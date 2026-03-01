import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { env } from "../config/env";
import type { ReviewResult } from "../types/review.types";

// ── Gemini client ───────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-2.5-flash";

// ── Response validation schema ──────────────────────────────────────────

const reviewResultSchema = z.object({
    bugs: z.array(z.object({
        line: z.number().nullable().optional(),
        description: z.string(),
        severity: z.string(),
    })).default([]),
    security_issues: z.array(z.object({
        description: z.string(),
        severity: z.string(),
    })).default([]),
    performance_issues: z.array(z.object({
        description: z.string(),
        suggestion: z.string(),
    })).default([]),
    refactored_code: z.string().default(""),
    score: z.number().min(0).max(10).default(5),
    confidence: z.enum(["low", "medium", "high", "Low", "Medium", "High"]).default("low"),
});

// ── Placeholder detection ───────────────────────────────────────────────

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
    if (!code || code.trim().length < 5) return true;
    const lower = code.toLowerCase().trim();
    return PLACEHOLDER_PATTERNS.some((p) => lower.includes(p));
}

// ── Fallback result ─────────────────────────────────────────────────────

function fallbackResult(errorMessage: string): ReviewResult {
    return {
        bugs: [],
        security_issues: [],
        performance_issues: [],
        refactored_code: "Unable to generate refactored code.",
        score: 0,
        confidence: "low",
        _error: errorMessage,
    };
}

// ── JSON extraction and repair ──────────────────────────────────────────

function repairTruncatedJson(raw: string): string | null {
    let text = raw.trim();

    // Remove trailing incomplete entries (comma at the end of partial object/array)
    text = text.replace(/,\s*$/, "");

    // Remove trailing incomplete string value that got cut off mid-quote
    // e.g. "refactored_code": "function foo() {\n  ...
    text = text.replace(/:\s*"[^"]*$/, ': ""');

    // Count unclosed brackets using a simple stack
    let openBraces = 0;
    let openBrackets = 0;
    let inString = false;
    let escape = false;

    for (const ch of text) {
        if (escape) { escape = false; continue; }
        if (ch === "\\" && inString) { escape = true; continue; }
        if (ch === '"') { inString = !inString; continue; }
        if (inString) continue;
        if (ch === "{") openBraces++;
        else if (ch === "}") openBraces--;
        else if (ch === "[") openBrackets++;
        else if (ch === "]") openBrackets--;
    }

    // Close any open arrays first, then objects
    const closing =
        "]".repeat(Math.max(0, openBrackets)) +
        "}".repeat(Math.max(0, openBraces));

    const repaired = text + closing;

    try {
        JSON.parse(repaired);
        console.warn("[Gemini] Repaired truncated JSON successfully");
        return repaired;
    } catch {
        console.error("[Gemini] Could not repair truncated JSON");
        return null;
    }
}

function extractJsonFromText(text: string): string | null {
    // Strip markdown code fences
    let stripped = text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();

    // Find start of JSON object
    const startIndex = stripped.indexOf("{");
    if (startIndex === -1) return null;
    stripped = stripped.slice(startIndex);

    // Try direct parse first
    try {
        JSON.parse(stripped);
        return stripped;
    } catch {
        // Try to repair truncated JSON
        return repairTruncatedJson(stripped);
    }
}

// ── Parse and validate response ─────────────────────────────────────────

function parseModelResponse(raw: string): ReviewResult {
    const jsonStr = extractJsonFromText(raw);

    if (!jsonStr) {
        console.error("[Gemini] No JSON object found in response");
        return fallbackResult("Gemini returned no valid JSON object.");
    }

    try {
        const parsed = JSON.parse(jsonStr);
        const validated = reviewResultSchema.parse(parsed);
        return {
            ...validated,
            confidence: validated.confidence.toLowerCase() as ReviewResult["confidence"],
        };
    } catch (error) {
        console.error("[Gemini] JSON parse/validation failed:", error instanceof Error ? error.message : error);
        return fallbackResult("Failed to parse Gemini response JSON.");
    }
}

// ── Prompts ─────────────────────────────────────────────────────────────

function buildSystemInstruction(): string {
    return `You are a senior software architect and security engineer.

You MUST return ONLY valid JSON.
Do NOT include markdown.
Do NOT include backticks.
Do NOT include explanations before or after JSON.
Do NOT wrap the JSON in code blocks.
Do NOT add comments outside JSON.

CRITICAL: The 'refactored_code' field must be a complete, valid JSON string.
Escape all special characters inside it: use \\n for newlines, \\" for quotes, \\\\ for backslashes.
It must NOT contain placeholder text.
It must contain actual executable improved code.
If no changes are required, return the original code inside 'refactored_code'.

Return ONLY the JSON object. Nothing before it, nothing after it.`;
}

function buildUserPrompt(code: string, language: string, reviewType: string): string {
    return `Analyze the following ${language} code for:

1. Functional bugs
2. Security vulnerabilities
3. Performance issues
4. Code quality improvements

Review type: ${reviewType}

Return strictly this JSON structure (no markdown, no backticks, raw JSON only):

{
  "bugs": [{ "line": <number|null>, "description": "<string>", "severity": "<low|medium|high|critical>" }],
  "security_issues": [{ "description": "<string>", "severity": "<low|medium|high|critical>" }],
  "performance_issues": [{ "description": "<string>", "suggestion": "<string>" }],
  "refactored_code": "<complete improved code as escaped JSON string>",
  "score": <number 1-10>,
  "confidence": "<low|medium|high>"
}

Code:
\`\`\`${language}
${code}
\`\`\``;
}

function buildRetryPrompt(): string {
    return `The previous response did not include a valid refactored_code field.
Return ONLY valid JSON with a complete refactored_code implementation.
The refactored_code field must contain actual executable improved code, not placeholder text.`;
}

// ── Call Gemini ──────────────────────────────────────────────────────────

async function callGemini(
    modelName: string,
    userPrompt: string,
    signal?: AbortSignal
): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: buildSystemInstruction(),
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192, // raised from 2000 — truncation was the root cause
            responseMimeType: "application/json",
        },
    });

    const result = await model.generateContent(
        {
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        },
        { signal, timeout: 60_000 }
    );

    return result.response.text();
}

// ── Main review function ────────────────────────────────────────────────

async function executeGeminiReview(
    modelName: string,
    code: string,
    language: string,
    reviewType: string,
    signal?: AbortSignal
): Promise<ReviewResult> {
    const userPrompt = buildUserPrompt(code, language, reviewType);

    try {
        const raw = await callGemini(modelName, userPrompt, signal);
        let result = parseModelResponse(raw);

        // If refactored_code is missing or placeholder, retry once
        if (isPlaceholderCode(result.refactored_code) && !result._error) {
            console.warn(`[Gemini ${modelName}] refactored_code missing or placeholder — retrying once`);

            if (signal?.aborted) return result;

            try {
                const retryPrompt = `${userPrompt}\n\n${buildRetryPrompt()}`;
                const retryRaw = await callGemini(modelName, retryPrompt, signal);
                const retryResult = parseModelResponse(retryRaw);

                if (!isPlaceholderCode(retryResult.refactored_code)) {
                    result = retryResult;
                } else {
                    console.warn(`[Gemini ${modelName}] Retry also produced placeholder — using original code`);
                    result.refactored_code = code;
                }
            } catch (retryError) {
                console.warn(`[Gemini ${modelName}] Retry failed:`, retryError instanceof Error ? retryError.message : retryError);
                result.refactored_code = code;
            }
        }

        return result;
    } catch (error) {
        if (signal?.aborted) throw error;
        console.error(`[Gemini ${modelName}] Model call failed:`, error instanceof Error ? error.message : error);
        throw error;
    }
}

export async function reviewWithGemini(
    code: string,
    language: string,
    reviewType: string,
    signal?: AbortSignal
): Promise<ReviewResult> {
    return executeGeminiReview(MODEL_NAME, code, language, reviewType, signal);
}

export async function reviewWithGeminiFlash(
    code: string,
    language: string,
    reviewType: string,
    signal?: AbortSignal
): Promise<ReviewResult> {
    return executeGeminiReview("gemini-2.5-flash", code, language, reviewType, signal);
}