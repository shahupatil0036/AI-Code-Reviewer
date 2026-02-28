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
 * Runs Groq and Gemini reviews in parallel.
 * Individual model failures are caught — partial results are returned.
 * Only throws if BOTH models fail.
 */
export async function performReview(
    code: string,
    language: string,
    reviewType: string
): Promise<MultiModelResult> {
    const [groqSettled, geminiSettled, geminiFlashSettled, qwenSettled] = await Promise.allSettled([
        callWithTimeout(
            (signal) => reviewWithGroq(code, language, reviewType, signal),
            "Groq"
        ),
        callWithTimeout(
            (signal) => reviewWithGemini(code, language, reviewType, signal),
            "Gemini"
        ),
        callWithTimeout(
            (signal) => reviewWithGeminiFlash(code, language, reviewType, signal),
            "GeminiFlash"
        ),
        callWithTimeout(
            (signal) => reviewWithQwen3Coder(code, language, reviewType, signal),
            "Qwen3Coder"
        ),
    ]);

    const groqResult: ReviewResult | null =
        groqSettled.status === "fulfilled" ? groqSettled.value : null;
    const geminiResult: ReviewResult | null =
        geminiSettled.status === "fulfilled" ? geminiSettled.value : null;
    const geminiFlashResult: ReviewResult | null =
        geminiFlashSettled.status === "fulfilled" ? geminiFlashSettled.value : null;
    let qwenResult: any =
        qwenSettled.status === "fulfilled" ? qwenSettled.value : { error: "Model unavailable" };

    // If all models failed, throw with combined error info
    if (!groqResult && !geminiResult && !geminiFlashResult && qwenSettled.status === "rejected") {
        const groqErr = groqSettled.status === "rejected" ? groqSettled.reason : null;
        const geminiErr = geminiSettled.status === "rejected" ? geminiSettled.reason : null;
        const geminiFlashErr = geminiFlashSettled.status === "rejected" ? geminiFlashSettled.reason : null;
        const qwenErr = qwenSettled.reason;

        const message = [
            groqErr ? `Groq: ${groqErr instanceof Error ? groqErr.message : String(groqErr)}` : null,
            geminiErr ? `Gemini: ${geminiErr instanceof Error ? geminiErr.message : String(geminiErr)}` : null,
            geminiFlashErr ? `GeminiFlash: ${geminiFlashErr instanceof Error ? geminiFlashErr.message : String(geminiFlashErr)}` : null,
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

    const aggregated = aggregateReviews(groqResult, geminiResult, geminiFlashResult, qwenSettled.status === "fulfilled" ? qwenSettled.value : null);

    return {
        groq: groqResult,
        gemini: geminiResult,
        geminiFlash: geminiFlashResult,
        qwen3Coder: qwenResult,
        aggregated,
    };
}
