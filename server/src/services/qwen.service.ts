import { z } from "zod";
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

Return exactly:

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

    const makeRequest = async (messages: any[]) => {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "qwen/qwen3-coder:free",
                messages,
                temperature: 0.2,
                max_tokens: 2000,
            }),
            signal: signal || AbortSignal.timeout(60_000)
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as any;
        const content = data.choices[0]?.message?.content || "";
        return String(content);
    };

    let messages = [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
    ];

    try {
        let text = await makeRequest(messages);

        console.log("[Qwen3 Coder] Raw API Response:", text);

        let match = text.match(/\{[\s\S]*\}/);
        if (!match) {
            throw new Error("Invalid Qwen3 Response: No JSON object found in response");
        }

        let parsed = JSON.parse(match[0]);
        let refactoredCode = parsed.refactored_code || "";

        if (!refactoredCode || refactoredCode.trim().length === 0 || isPlaceholderCode(refactoredCode)) {
            // retry once with correction message
            messages.push({ role: "assistant", content: text });
            messages.push({ role: "user", content: "The previous response did not include a valid refactored_code field. Return ONLY valid JSON with a complete refactored_code implementation. The refactored_code field must contain actual executable improved code, not placeholder text." });

            text = await makeRequest(messages);
            match = text.match(/\{[\s\S]*\}/);

            if (!match) {
                throw new Error("Invalid Qwen3 Response: No JSON object found in retry response");
            }
            parsed = JSON.parse(match[0]);
            refactoredCode = parsed.refactored_code || "";
            if (!refactoredCode || refactoredCode.trim().length === 0 || isPlaceholderCode(refactoredCode)) {
                parsed.refactored_code = code; // default to original if still missing
            }
        }

        const fallbackBugs = parsed.bugs || [];
        const fallbackSecurity = parsed.security_issues || [];
        const fallbackPerformance = parsed.performance_issues || [];

        return {
            bugs: Array.isArray(fallbackBugs) ? fallbackBugs : [],
            security_issues: Array.isArray(fallbackSecurity) ? fallbackSecurity : [],
            performance_issues: Array.isArray(fallbackPerformance) ? fallbackPerformance : [],
            refactored_code: parsed.refactored_code || code,
            score: typeof parsed.score === "number" ? parsed.score : 0,
            confidence: (parsed.confidence || "low").toLowerCase() as ReviewResult["confidence"],
        };

    } catch (error) {
        console.error("[Qwen3 Coder] Execution failed:", error);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error("Qwen3 Coder request timed out");
        }
        // If it throws structured error or parsing fail, we throw so it can be handled by the caller as { error: "Model unavailable" }
        throw error;
    }
}
