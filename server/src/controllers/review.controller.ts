import type { Request, Response, NextFunction } from "express";
import { performReview } from "../services/review.service";
import type { ReviewRequest } from "../types/review.types";

/**
 * POST /api/review
 *
 * Expects a validated body of type ReviewRequest.
 * Returns multi-model results: { groq, gemini, aggregated }.
 */
export async function handleReview(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { code, language, reviewType } = req.body as ReviewRequest;

        const result = await performReview(code, language, reviewType);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}
