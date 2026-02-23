import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

interface AppError extends Error {
    statusCode?: number;
}

export function globalErrorHandler(
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    const statusCode = err.statusCode ?? 500;

    const message =
        env.NODE_ENV === "production"
            ? statusCode === 500
                ? "Internal server error"
                : err.message
            : err.message || "Internal server error";

    console.error(`[ERROR ${statusCode}]`, err.message);

    res.status(statusCode).json({
        success: false,
        error: message,
    });
}
