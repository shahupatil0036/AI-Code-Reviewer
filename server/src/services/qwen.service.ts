import type { ReviewResult } from "../types/review.types";

const PLACEHOLDER_PATTERNS = [
    "refactored code",
    "improved code here",
    "your code here",
    "insert code",
    "placeholder",
    "todo",
    "// ...",
    "/* ... */",
];

function isPlaceholderCode(code: string): boolean {
    if (!code || code.trim().length === 0) return true;
    const lower = code.toLowerCase().trim();
    return PLACEHOLDER_PATTERNS.some((p) => lower.includes(p));
}

// ── Model fallback chain (all free) ────────────────────────────────────
// Models are tried in order. 429 (rate limited) and 404 (unavailable)
// both cause the next model to be tried automatically.

const FREE_MODEL_CHAIN = [
    "qwen/qwen3-coder:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "openai/gpt-oss-120b:free",
    "openai/gpt-oss-20b:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "arcee-ai/trinity-large-preview:free",
    "google/gemma-3-27b-it:free",
    "openrouter/free", // final catch-all: OpenRouter picks any available free model
];

// Skippable HTTP status codes (rate limited or model unavailable)
const SKIP_STATUSES = new Set([404, 429, 503]);

// ── Single request attempt ──────────────────────────────────────────────

async function makeRequest(
    model: string,
    messages: any[],
    signal?: AbortSignal
): Promise<string> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            messages,
            temperature: 0.2,
            max_tokens: 2000,
        }),
        signal: signal || AbortSignal.timeout(60_000),
    });

    if (SKIP_STATUSES.has(response.status)) {
        throw new Error(`SKIP:${response.status}`); // sentinel for fallback chain
    }

    if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    return String(data.choices[0]?.message?.content || "");
}

// ── Try each model in chain until one succeeds ──────────────────────────

async function makeRequestWithFallback(
    messages: any[],
    signal?: AbortSignal
): Promise<{ text: string; model: string }> {
    const skipped: string[] = [];

    for (const model of FREE_MODEL_CHAIN) {
        if (signal?.aborted) throw new Error("Request aborted");

        try {
            console.log(`[Qwen3 Coder] Trying model: ${model}`);
            const text = await makeRequest(model, messages, signal);
            console.log(`[Qwen3 Coder] Success with model: ${model}`);
            return { text, model };
        } catch (err: any) {
            if (err.message?.startsWith("SKIP:")) {
                const status = err.message.split(":")[1];
                console.warn(`[Qwen3 Coder] Model ${model} returned ${status}, trying next...`);
                skipped.push(`${model}(${status})`);
                continue;
            }
            throw err; // non-skippable error — rethrow immediately
        }
    }

    throw new Error(`All free models unavailable. Skipped: ${skipped.join(", ")}`);
}

// ── Main review function ────────────────────────────────────────────────

export async function reviewWithQwen3Coder(
    code: string,
    language: string,
    reviewType: string,
    signal?: AbortSignal
): Promise<ReviewResult> {
    const userMessage = `Analyze the following ${language} code for:

1. Functional bugs
2. Security vulnerabilities
3. Performance issues
4. Code quality improvements

Return exactly this JSON and nothing else:

{
  "bugs": [],
  "security_issues": [],
  "performance_issues": [],
  "refactored_code": "",
  "score": 0,
  "confidence": ""
}

Code:
${code}`;

    const systemMessage = `You are a senior software architect and security engineer.
Return ONLY valid JSON.
Do NOT include markdown.
Do NOT include backticks.
Do NOT include explanations outside JSON.
The refactored_code field must contain fully rewritten improved code.
If no changes are needed, return the original code inside refactored_code.`;

    let messages = [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
    ];

    try {
        let { text, model } = await makeRequestWithFallback(messages, signal);

        console.log(`[Qwen3 Coder] Raw response from ${model}:`, text);

        let match = text.match(/\{[\s\S]*\}/);
        if (!match) {
            throw new Error("No JSON object found in response");
        }

        let parsed = JSON.parse(match[0]);
        let refactoredCode = parsed.refactored_code || "";

        // If refactored_code is placeholder, retry once with correction
        if (!refactoredCode || refactoredCode.trim().length === 0 || isPlaceholderCode(refactoredCode)) {
            messages.push({ role: "assistant", content: text });
            messages.push({
                role: "user",
                content:
                    "The previous response did not include a valid refactored_code field. Return ONLY valid JSON with a complete refactored_code implementation. The refactored_code field must contain actual executable improved code, not placeholder text.",
            });

            const retry = await makeRequestWithFallback(messages, signal);
            match = retry.text.match(/\{[\s\S]*\}/);

            if (!match) throw new Error("No JSON object found in retry response");

            parsed = JSON.parse(match[0]);
            refactoredCode = parsed.refactored_code || "";

            if (!refactoredCode || refactoredCode.trim().length === 0 || isPlaceholderCode(refactoredCode)) {
                parsed.refactored_code = code;
            }
        }

        return {
            bugs: Array.isArray(parsed.bugs) ? parsed.bugs : [],
            security_issues: Array.isArray(parsed.security_issues) ? parsed.security_issues : [],
            performance_issues: Array.isArray(parsed.performance_issues) ? parsed.performance_issues : [],
            refactored_code: parsed.refactored_code || code,
            score: typeof parsed.score === "number" ? parsed.score : 0,
            confidence: (parsed.confidence || "low").toLowerCase() as ReviewResult["confidence"],
        };
    } catch (error) {
        console.error("[Qwen3 Coder] Execution failed:", error);
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error("Qwen3 Coder request timed out");
        }
        throw error;
    }
}