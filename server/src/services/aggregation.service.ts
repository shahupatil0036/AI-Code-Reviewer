import type { ReviewResult, AggregatedResult } from "../types/review.types";

// ── Aggregation Service ─────────────────────────────────────────────────

/**
 * Aggregates results from Groq and Gemini into a unified summary.
 * Handles cases where one or both results may contain errors.
 */
export function aggregateReviews(
    groqResult: ReviewResult | null,
    geminiResult: ReviewResult | null,
    geminiFlashResult: ReviewResult | null,
    qwenResult: ReviewResult | null
): AggregatedResult {
    const results = [groqResult, geminiResult, geminiFlashResult, qwenResult].filter(
        (r): r is ReviewResult => r !== null && !r._error && !r.error
    );

    // If no valid results, return empty aggregation
    if (results.length === 0) {
        return {
            aggregated_bugs: [],
            aggregated_security: [],
            aggregated_performance: [],
            average_score: 0,
            final_confidence: "low",
        };
    }

    // ── Merge bug lists (deduplicate by description) ────────────────────
    const bugMap = new Map<string, ReviewResult["bugs"][number]>();
    for (const r of results) {
        for (const bug of r.bugs) {
            const key = bug.description.toLowerCase().trim();
            if (!bugMap.has(key)) {
                bugMap.set(key, bug);
            }
        }
    }

    // ── Merge security issues (deduplicate by description) ───────────────
    const secMap = new Map<string, ReviewResult["security_issues"][number]>();
    for (const r of results) {
        for (const issue of r.security_issues) {
            const key = issue.description.toLowerCase().trim();
            if (!secMap.has(key)) {
                secMap.set(key, issue);
            }
        }
    }

    // ── Merge performance issues (deduplicate by description) ────────────
    const perfMap = new Map<string, ReviewResult["performance_issues"][number]>();
    for (const r of results) {
        for (const issue of r.performance_issues) {
            const key = issue.description.toLowerCase().trim();
            if (!perfMap.has(key)) {
                perfMap.set(key, issue);
            }
        }
    }

    // ── Average score ───────────────────────────────────────────────────
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = Math.round((totalScore / results.length) * 10) / 10;

    // ── Determine confidence ────────────────────────────────────────────
    let finalConfidence: string;
    if (results.length === 1) {
        finalConfidence = results[0].confidence;
    } else {
        const scores = results.map(r => r.score);
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const scoreDiff = maxScore - minScore;

        if (scoreDiff <= 1) {
            finalConfidence = "high";
        } else if (scoreDiff <= 3) {
            finalConfidence = "medium";
        } else {
            finalConfidence = "low";
        }
    }

    return {
        aggregated_bugs: Array.from(bugMap.values()),
        aggregated_security: Array.from(secMap.values()),
        aggregated_performance: Array.from(perfMap.values()),
        average_score: averageScore,
        final_confidence: finalConfidence,
    };
}
