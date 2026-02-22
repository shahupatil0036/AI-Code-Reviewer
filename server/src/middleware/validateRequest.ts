import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

/**
 * Factory that returns Express middleware to validate `req.body`
 * against the supplied Zod schema.
 *
 * On failure → responds with 400 and field-level error messages.
 */
export function validateRequest(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));

            res.status(400).json({
                success: false,
                error: "Validation failed",
                details: errors,
            });
            return;
        }

        // Attach validated data so downstream handlers can trust it
        req.body = result.data;
        next();
    };
}
