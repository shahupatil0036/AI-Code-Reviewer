import rateLimit from "express-rate-limit";

/**
 * Rate limiter: 20 requests per minute per IP.
 */
export const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "Too many requests. Please try again later.",
    },
});
