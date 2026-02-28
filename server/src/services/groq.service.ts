import Groq from "groq-sdk";
import { z } from "zod";
import { env } from "../config/env";
import type { ReviewResult } from "../types/review.types";

// ── Groq client (reads key from validated env) ──────────────────────────

const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
});

// ── Models (primary → fallback) ─────────────────────────────────────────

const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

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
    score: z.number().min(1).max(10).default(5),
    confidence: z.enum(["low", "medium", "high"]).default("low"),
});

// ── Fallback when JSON parsing/validation fails ─────────────────────────

function fallbackResult(errorMessage: string): ReviewResult {
    return {
        bugs: [],
        security_issues: [],
        performance_issues: [],
        refactored_code: "",
        score: 1,
        confidence: "low",
        _error: errorMessage,
    };
}

// ── Try to extract JSON from a raw string using regex ───────────────────

function extractJsonFromString(raw: string): string | null {
    // Try to find a JSON object in the raw string
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : null;
}

// ── Parse and validate the model's response ─────────────────────────────

function parseModelResponse(raw: string): ReviewResult {
    // Attempt 1: Direct JSON parse
    try {
        const parsed = JSON.parse(raw);
        return reviewResultSchema.parse(parsed);
    } catch {
        // Direct parse failed, try regex extraction
    }

    // Attempt 2: Regex-based JSON extraction
    const extracted = extractJsonFromString(raw);
    if (extracted) {
        try {
            const parsed = JSON.parse(extracted);
            return reviewResultSchema.parse(parsed);
        } catch {
            // Regex extraction parse also failed
        }
    }

    // Attempt 3: Return structured error
    console.error("[Groq] Failed to parse/validate response JSON");
    return fallbackResult("Failed to parse AI response. The model returned invalid JSON.");
}

// ── Build prompts ───────────────────────────────────────────────────────

function buildSystemPrompt(): string {
    return `You are a senior software architect and security engineer.
You must return ONLY valid JSON.
Do not include explanations outside JSON.
Follow the schema strictly.`;
}

function buildUserPrompt(code: string, language: string, reviewType: string): string {
    return `Analyze the following ${language} code. Review type: ${reviewType}.

Your tasks:
1. Identify functional bugs (include line numbers where possible)
2. Identify security issues (injection, XSS, auth flaws, etc.)
3. Identify performance improvements with specific suggestions
4. Suggest refactored code that fixes the found issues
5. Provide an overall quality score from 1 (terrible) to 10 (excellent)
6. Provide your confidence level: "low", "medium", or "high"

Return your response as a JSON object with EXACTLY this schema:

{
  "bugs": [{ "line": <number|null>, "description": "<string>", "severity": "<low|medium|high|critical>" }],
  "security_issues": [{ "description": "<string>", "severity": "<low|medium|high|critical>" }],
  "performance_issues": [{ "description": "<string>", "suggestion": "<string>" }],
  "refactored_code": "<string with the improved code>",
  "score": <number 1-10>,
  "confidence": "<low|medium|high>"
}

Return ONLY the JSON object. No markdown fences, no explanation outside the JSON.

Code:
\`\`\`${language}
${code}
\`\`\``;
}

// ── Call Groq with model fallback ────────────────────────────────────────

async function callGroq(
    systemPrompt: string,
    userPrompt: string,
    model: string,
    signal?: AbortSignal
): Promise<string> {
    const completion = await groq.chat.completions.create(
        {
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 4096,
        },
        { signal }
    );

    return completion.choices[0]?.message?.content ?? "";
}

// ── Main review function ────────────────────────────────────────────────

export async function reviewWithGroq(
    code: string,
    language: string,
    reviewType: string,
    signal?: AbortSignal
): Promise<ReviewResult> {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(code, language, reviewType);

    // Try primary model first, fall back on failure
    try {
        const raw = await callGroq(systemPrompt, userPrompt, PRIMARY_MODEL, signal);
        return parseModelResponse(raw);
    } catch (primaryError) {
        // If the signal was aborted, don't retry with fallback
        if (signal?.aborted) {
            throw primaryError;
        }

        console.warn(
            `[Groq] Primary model (${PRIMARY_MODEL}) failed, trying fallback (${FALLBACK_MODEL}):`,
            primaryError instanceof Error ? primaryError.message : primaryError
        );

        try {
            const raw = await callGroq(systemPrompt, userPrompt, FALLBACK_MODEL, signal);
            return parseModelResponse(raw);
        } catch (fallbackError) {
            console.error(
                `[Groq] Fallback model (${FALLBACK_MODEL}) also failed:`,
                fallbackError instanceof Error ? fallbackError.message : fallbackError
            );
            throw fallbackError;
        }
    }
}
