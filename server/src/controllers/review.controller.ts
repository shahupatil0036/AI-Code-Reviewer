import type { Request, Response, NextFunction } from "express";
import { performReview } from "../services/review.service.js";
import type { ReviewRequest } from "../types/review.types.js";

/**
 * POST /api/review
 *
 * Expects a validated body of type ReviewRequest.
 * Returns a structured JSON response.
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
