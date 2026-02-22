import { reviewWithOpenAI } from "./openai.service.js";
import type { ReviewResult } from "../types/review.types.js";

const REVIEW_TIMEOUT_MS = 10_000; // 10 seconds

/**
 * High-level review orchestrator.
 *
 * Wraps the OpenAI call with a timeout and error handling so the
 * controller never receives an unstructured rejection.
 */
export async function performReview(
    code: string,
    language: string,
    reviewType: string
): Promise<ReviewResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REVIEW_TIMEOUT_MS);

    try {
        const result = await Promise.race<ReviewResult>([
            reviewWithOpenAI(code, language, reviewType, controller.signal),
            new Promise<never>((_resolve, reject) => {
                controller.signal.addEventListener("abort", () => {
                    reject(new Error("Review request timed out after 10 seconds"));
                });
            }),
        ]);

        return result;
    } catch (error) {
        if (error instanceof Error && error.message.includes("timed out")) {
            throw new Error("Review request timed out. Please try again.");
        }

        console.error("[ReviewService] Unexpected error:", error);
        throw new Error("An unexpected error occurred during the review.", {
            cause: error,
        });
    } finally {
        clearTimeout(timeout);
    }
}
