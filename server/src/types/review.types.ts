import { z } from "zod";

// ── Request Validation Schema ──────────────────────────────────────────

export const reviewRequestSchema = z.object({
    code: z
        .string({ required_error: "code is required" })
        .min(5, "code must be at least 5 characters long")
        .max(50_000, "code must be at most 50,000 characters"),
    language: z
        .string({ required_error: "language is required" })
        .min(1, "language is required"),
    reviewType: z.enum(
        ["full_review", "bugs_only", "security", "performance"],
        { required_error: "reviewType is required", invalid_type_error: "Invalid review type" }
    ),
});

export type ReviewRequest = z.infer<typeof reviewRequestSchema>;

// ── OpenAI Response Shape ──────────────────────────────────────────────

export interface ReviewBug {
    line?: number | null;
    description: string;
    severity: string;
}

export interface SecurityIssue {
    description: string;
    severity: string;
}

export interface PerformanceIssue {
    description: string;
    suggestion: string;
}

export interface ReviewResult {
    bugs: ReviewBug[];
    security_issues: SecurityIssue[];
    performance_issues: PerformanceIssue[];
    refactored_code: string;
    score: number;
    confidence: string;
}

// ── API Response Envelope ──────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
