import { reviewWithGroq } from "./groq.service";
import { reviewWithGemini, reviewWithGeminiFlash } from "./gemini.service";
import { reviewWithQwen3Coder } from "./qwen.service";
import { aggregateReviews } from "./aggregation.service";
import type { ReviewResult, MultiModelResult } from "../types/review.types";

const MODEL_TIMEOUT_MS = 60_000; // 60 seconds per model

// ── Timeout-wrapped model call ──────────────────────────────────────────

async function callWithTimeout(
    fn: (signal: AbortSignal) => Promise<ReviewResult>,
    modelName: string
): Promise<ReviewResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);

    try {
        const result = await fn(controller.signal);
        return result;
    } catch (error) {
        if (controller.signal.aborted) {
            console.warn(`[ReviewService] ${modelName} timed out after ${MODEL_TIMEOUT_MS}ms`);
        } else {
            console.error(`[ReviewService] ${modelName} failed:`, error instanceof Error ? error.message : error);
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

// ── Multi-model orchestrator ────────────────────────────────────────────

/**
 * Runs each AI reviewer sequentially with a 1-second delay between calls
 * to avoid rate limiting. Individual model failures are caught and do not
 * affect the other reviewers. Only throws if ALL models fail.
 */
export async function performReview(
    code: string,
    language: string,
    reviewType: string
): Promise<MultiModelResult> {
    const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    type ReviewEntry = {
        name: string;
        fn: (signal: AbortSignal) => Promise<ReviewResult>;
    };

    const reviewers: ReviewEntry[] = [
        { name: "Groq", fn: (signal) => reviewWithGroq(code, language, reviewType, signal) },
        { name: "Gemini", fn: (signal) => reviewWithGemini(code, language, reviewType, signal) },
        { name: "GeminiFlash", fn: (signal) => reviewWithGeminiFlash(code, language, reviewType, signal) },
        { name: "Qwen3Coder", fn: (signal) => reviewWithQwen3Coder(code, language, reviewType, signal) },
    ];

    const results: Map<string, { status: "fulfilled"; value: ReviewResult } | { status: "rejected"; reason: unknown }> = new Map();

    for (let i = 0; i < reviewers.length; i++) {
        const { name, fn } = reviewers[i];

        if (i > 0) {
            await delay(1_000); // 1-second gap between calls to avoid rate limiting
        }

        try {
            const value = await callWithTimeout(fn, name);
            results.set(name, { status: "fulfilled", value });
        } catch (error) {
            results.set(name, { status: "rejected", reason: error });
        }
    }

    const get = (name: string) => results.get(name)!;

    const groqSettled = get("Groq");
    const geminiSettled = get("Gemini");
    const flashSettled = get("GeminiFlash");
    const qwenSettled = get("Qwen3Coder");

    const groqResult: ReviewResult | null =
        groqSettled.status === "fulfilled" ? groqSettled.value : null;
    const geminiResult: ReviewResult | null =
        geminiSettled.status === "fulfilled" ? geminiSettled.value : null;
    const geminiFlashResult: ReviewResult | null =
        flashSettled.status === "fulfilled" ? flashSettled.value : null;
    let qwenResult: any =
        qwenSettled.status === "fulfilled" ? qwenSettled.value : { error: "Model unavailable" };

    // If all models failed, throw with combined error info
    if (!groqResult && !geminiResult && !geminiFlashResult && qwenSettled.status === "rejected") {
        const groqErr = groqSettled.status === "rejected" ? groqSettled.reason : null;
        const geminiErr = geminiSettled.status === "rejected" ? geminiSettled.reason : null;
        const flashErr = flashSettled.status === "rejected" ? flashSettled.reason : null;
        const qwenErr = qwenSettled.reason;

        const message = [
            groqErr ? `Groq: ${groqErr instanceof Error ? groqErr.message : String(groqErr)}` : null,
            geminiErr ? `Gemini: ${geminiErr instanceof Error ? geminiErr.message : String(geminiErr)}` : null,
            flashErr ? `GeminiFlash: ${flashErr instanceof Error ? flashErr.message : String(flashErr)}` : null,
            qwenErr ? `Qwen3Coder: ${qwenErr instanceof Error ? qwenErr.message : String(qwenErr)}` : null,
        ].filter(Boolean).join("; ");

        const error = new Error(`All models failed. ${message}`) as Error & { statusCode: number };
        error.statusCode = 502;
        throw error;
    }

    // Log partial failures
    if (!groqResult) console.warn("[ReviewService] Groq failed");
    if (!geminiResult) console.warn("[ReviewService] Gemini Pro failed");
    if (!geminiFlashResult) console.warn("[ReviewService] Gemini Flash failed");
    if (qwenSettled.status === "rejected") console.warn("[ReviewService] Qwen3 Coder failed");

    const aggregated = aggregateReviews(
        groqResult,
        geminiResult,
        geminiFlashResult,
        qwenSettled.status === "fulfilled" ? qwenSettled.value : null
    );

    return {
        groq: groqResult,
        gemini: geminiResult,
        geminiFlash: geminiFlashResult,
        qwen3Coder: qwenResult,
        aggregated,
    };
}
