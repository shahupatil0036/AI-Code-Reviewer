import OpenAI from "openai";
import { z } from "zod";
import { env } from "../config/env.js";
import type { ReviewResult } from "../types/review.types.js";

// ── OpenAI client (reads key from validated env) ────────────────────────

const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});

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

function fallbackResult(): ReviewResult {
    return {
        bugs: [],
        security_issues: [],
        performance_issues: [],
        refactored_code: "",
        score: 0,
        confidence: "low",
    };
}

// ── Main review function ────────────────────────────────────────────────

export async function reviewWithOpenAI(
    code: string,
    language: string,
    reviewType: string,
    signal?: AbortSignal
): Promise<ReviewResult> {
    const systemPrompt = `You are an expert code reviewer. Analyse the given code and return your review as **strict JSON** with exactly these keys:

{
  "bugs": [{ "line": <number|null>, "description": "<string>", "severity": "<low|medium|high|critical>" }],
  "security_issues": [{ "description": "<string>", "severity": "<low|medium|high|critical>" }],
  "performance_issues": [{ "description": "<string>", "suggestion": "<string>" }],
  "refactored_code": "<string with the improved code>",
  "score": <number 1-10>,
  "confidence": "<low|medium|high>"
}

Rules:
1. Identify all functional bugs.
2. Identify security issues (injection, XSS, auth flaws, etc.).
3. Identify performance improvements.
4. Provide refactored code that fixes found issues.
5. Score the code quality from 1 (terrible) to 10 (excellent).
6. State your confidence level (low / medium / high).

Return ONLY valid JSON. No markdown fences, no explanation outside the JSON object.`;

    const userPrompt = `Language: ${language}
Review type: ${reviewType}

Code:
\`\`\`${language}
${code}
\`\`\``;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 4096,
        response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    try {
        const parsed = reviewResultSchema.parse(JSON.parse(raw));
        return parsed;
    } catch {
        console.error("[OpenAI] Failed to parse/validate response JSON");
        return fallbackResult();
    }
}
