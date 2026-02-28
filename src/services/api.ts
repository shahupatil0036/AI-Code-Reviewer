import type { ReviewPayload, ReviewResult, AggregatedResult, BugIssue, SecurityIssue, PerformanceIssue } from '../types';

// ── API Configuration ───────────────────────────────────────────────────

const API_BASE = '/api';

// ── Backend response types (flat shape from server) ─────────────────────

interface BackendBug {
    line?: number | null;
    description: string;
    severity: string;
}

interface BackendSecurityIssue {
    description: string;
    severity: string;
}

interface BackendPerformanceIssue {
    description: string;
    suggestion: string;
}

interface BackendReviewResult {
    bugs: BackendBug[];
    security_issues: BackendSecurityIssue[];
    performance_issues: BackendPerformanceIssue[];
    refactored_code: string;
    score: number;
    confidence: string;
    _error?: string;
}

interface BackendAggregatedResult {
    aggregated_bugs: BackendBug[];
    aggregated_security: BackendSecurityIssue[];
    aggregated_performance: BackendPerformanceIssue[];
    average_score: number;
    final_confidence: string;
}

interface BackendMultiModelResponse {
    groq: BackendReviewResult | null;
    gemini: BackendReviewResult | null;
    geminiFlash: BackendReviewResult | null;
    qwen3Coder: BackendReviewResult | { error: string } | null;
    aggregated: BackendAggregatedResult;
}

interface BackendApiResponse {
    success: boolean;
    data?: BackendMultiModelResponse;
    error?: string;
}

// ── Mapping helpers (backend → frontend types) ──────────────────────────

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;
const resetIdCounter = () => { idCounter = 0; };

function mapSeverityToBug(severity: string): BugIssue['severity'] {
    if (severity === 'critical' || severity === 'high') return 'critical';
    if (severity === 'medium') return 'warning';
    return 'info';
}

function mapSeverityToSecurity(severity: string): SecurityIssue['severity'] {
    const valid: SecurityIssue['severity'][] = ['critical', 'high', 'medium', 'low'];
    return valid.includes(severity as SecurityIssue['severity'])
        ? (severity as SecurityIssue['severity'])
        : 'medium';
}

function mapImpact(description: string): PerformanceIssue['impact'] {
    const lower = description.toLowerCase();
    if (lower.includes('critical') || lower.includes('severe') || lower.includes('memory leak') || lower.includes('o(n²)') || lower.includes('o(n^2)')) return 'high';
    if (lower.includes('minor') || lower.includes('negligible') || lower.includes('cosmetic')) return 'low';
    return 'medium';
}

function mapBackendToFrontend(backend: BackendReviewResult): ReviewResult {
    return {
        bugs: backend.bugs.map((b) => ({
            id: nextId('bug'),
            line: b.line ?? 0,
            severity: mapSeverityToBug(b.severity),
            message: b.description,
            suggestion: `Fix: ${b.description}`,
        })),
        security_issues: backend.security_issues.map((s) => ({
            id: nextId('sec'),
            type: 'Security',
            severity: mapSeverityToSecurity(s.severity),
            description: s.description,
            recommendation: `Remediate: ${s.description}`,
        })),
        performance_issues: backend.performance_issues.map((p) => ({
            id: nextId('perf'),
            area: 'General',
            impact: mapImpact(p.description),
            description: p.description,
            suggestion: p.suggestion,
        })),
        refactored_code: backend.refactored_code,
        score: backend.score,
        confidence: (backend.confidence.charAt(0).toUpperCase() + backend.confidence.slice(1)) as ReviewResult['confidence'],
    };
}

function mapBackendAggregated(backend: BackendAggregatedResult): AggregatedResult {
    const totalBugs = backend.aggregated_bugs.length;
    const totalSecurity = backend.aggregated_security.length;
    const totalPerf = backend.aggregated_performance.length;

    const criticalIssues: string[] = [];
    if (totalBugs > 0) criticalIssues.push(`${totalBugs} bug(s) detected across analysis`);
    if (totalSecurity > 0) criticalIssues.push(`${totalSecurity} security concern(s) identified`);
    if (totalPerf > 0) criticalIssues.push('Performance bottlenecks detected');

    const recommendations: string[] = [];
    if (totalBugs > 0) recommendations.push('Fix all reported bugs before deployment');
    if (totalSecurity > 0) recommendations.push('Address security vulnerabilities immediately');
    recommendations.push('Consider adding unit tests for critical paths');

    return {
        overall_score: backend.average_score,
        critical_issues: criticalIssues.length > 0 ? criticalIssues : ['No critical issues found'],
        recommendations,
        executive_summary: `AI analysis reveals a codebase with a quality score of ${backend.average_score}/10. ${totalBugs} potential bug(s) and ${totalSecurity} security concern(s) were identified.`,
        risk_level: backend.average_score >= 7 ? 'Low' : backend.average_score >= 5 ? 'Medium' : 'High',
        score_breakdown: {
            bugs: Math.max(Math.round((10 - totalBugs * 1.5) * 10) / 10, 0),
            security: Math.max(Math.round((10 - totalSecurity * 2) * 10) / 10, 0),
            performance: Math.round((backend.average_score + 1) * 10) / 10,
        },
    };
}

function mapQwenBackendToFrontend(backend: BackendReviewResult | { error: string }): ReviewResult {
    if ('error' in backend) {
        return {
            bugs: [],
            security_issues: [],
            performance_issues: [],
            refactored_code: `// ${backend.error}`,
            score: 0,
            confidence: "Low"
        };
    }
    return mapBackendToFrontend(backend);
}

// ── Mock generators (fallback for demo mode) ────────────────────────────

const generateMockBugs = (language: string): BugIssue[] => [
    {
        id: 'bug-1',
        line: 12,
        severity: 'critical',
        message: `Potential null reference error in ${language} code at line 12`,
        suggestion: 'Add null check before accessing object properties',
    },
    {
        id: 'bug-2',
        line: 25,
        severity: 'warning',
        message: 'Unused variable declaration may cause memory overhead',
        suggestion: 'Remove unused variable or use underscore prefix',
    },
    {
        id: 'bug-3',
        line: 38,
        severity: 'info',
        message: 'Consider using const instead of let for immutable values',
        suggestion: 'Replace let with const for variables that are not reassigned',
    },
];

const generateMockSecurity = (): SecurityIssue[] => [
    {
        id: 'sec-1',
        type: 'Injection',
        severity: 'high',
        description: 'Potential SQL/NoSQL injection vulnerability detected',
        recommendation: 'Use parameterized queries or prepared statements',
    },
    {
        id: 'sec-2',
        type: 'XSS',
        severity: 'medium',
        description: 'Unsanitized user input rendered in DOM',
        recommendation: 'Apply proper input sanitization and output encoding',
    },
];

const generateMockPerformance = (): PerformanceIssue[] => [
    {
        id: 'perf-1',
        area: 'Memory',
        impact: 'high',
        description: 'Large array created inside loop causing excessive memory allocation',
        suggestion: 'Move array initialization outside the loop or use streaming',
    },
    {
        id: 'perf-2',
        area: 'Complexity',
        impact: 'medium',
        description: 'Nested loops resulting in O(n²) time complexity',
        suggestion: 'Consider using a hash map for O(n) lookup',
    },
];

const simulateDelay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

const generateMockResult = (language: string): ReviewResult => ({
    bugs: generateMockBugs(language),
    security_issues: generateMockSecurity(),
    performance_issues: generateMockPerformance(),
    refactored_code: `// Refactored ${language} code with improvements applied`,
    score: Math.floor(Math.random() * 3) + 6,
    confidence: (['High', 'Medium'] as const)[Math.floor(Math.random() * 2)],
});

function generateMockAggregated(groq: ReviewResult, gemini: ReviewResult, geminiFlash: ReviewResult, qwen: ReviewResult): AggregatedResult {
    const avgScore = Math.round((groq.score + gemini.score + geminiFlash.score + qwen.score) / 4);
    const totalBugs = groq.bugs.length + gemini.bugs.length + geminiFlash.bugs.length + qwen.bugs.length;
    const totalSecurity = groq.security_issues.length + gemini.security_issues.length + geminiFlash.security_issues.length + qwen.security_issues.length;

    return {
        overall_score: avgScore,
        critical_issues: totalBugs > 0 ? [`${totalBugs} bug(s) detected`] : ['No critical issues found'],
        recommendations: ['Fix all reported bugs', 'Add unit tests'],
        executive_summary: `Quality score of ${avgScore}/10. ${totalBugs} bug(s) and ${totalSecurity} security concern(s) identified.`,
        risk_level: avgScore >= 7 ? 'Low' : avgScore >= 5 ? 'Medium' : 'High',
        score_breakdown: {
            bugs: Math.max(Math.round((10 - totalBugs * 1.5) * 10) / 10, 0),
            security: Math.max(Math.round((10 - totalSecurity * 2) * 10) / 10, 0),
            performance: Math.round((avgScore + 1) * 10) / 10,
        },
    };
}

// ── Main API function ───────────────────────────────────────────────────

export const submitReview = async (
    payload: ReviewPayload,
    signal?: AbortSignal
): Promise<{
    groqResult: ReviewResult;
    geminiResult: ReviewResult;
    geminiFlashResult: ReviewResult;
    qwen3CoderResult: ReviewResult;
    aggregatedResult: AggregatedResult;
}> => {
    resetIdCounter();

    if (!payload.code.trim()) {
        throw new Error('Code content cannot be empty');
    }

    if (payload.code.length < 10) {
        throw new Error('Code must be at least 10 characters long');
    }

    try {
        // Call the real backend
        const response = await fetch(`${API_BASE}/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: payload.code,
                language: payload.language,
                reviewType: payload.review_type,
            }),
            signal,
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(
                (errorBody as { error?: string }).error ||
                `Server error (${response.status})`
            );
        }

        const json: BackendApiResponse = await response.json();

        if (!json.success || !json.data) {
            throw new Error(json.error || 'Unexpected server response');
        }

        const { data } = json;

        // Map each model result (handle partial failures)
        const groqResult = data.groq
            ? mapBackendToFrontend(data.groq)
            : generateMockResult(payload.language); // fallback if Groq failed

        const geminiResult = data.gemini
            ? mapBackendToFrontend(data.gemini)
            : generateMockResult(payload.language); // fallback if Gemini failed

        const geminiFlashResult = data.geminiFlash
            ? mapBackendToFrontend(data.geminiFlash)
            : generateMockResult(payload.language); // fallback if Flash failed

        const qwen3CoderResult = data.qwen3Coder
            ? mapQwenBackendToFrontend(data.qwen3Coder)
            : generateMockResult(payload.language); // fallback if Qwen Failed

        // Use server-side aggregation
        const aggregatedResult = mapBackendAggregated(data.aggregated);

        return { groqResult, geminiResult, geminiFlashResult, qwen3CoderResult, aggregatedResult };
    } catch (error) {
        // If the backend is unreachable, fall back to demo mode
        if (
            error instanceof TypeError &&
            error.message.includes('fetch')
        ) {
            console.warn('[API] Backend unreachable — falling back to demo mode');
            await simulateDelay(1500 + Math.random() * 500);

            const groqResult = generateMockResult(payload.language);
            const geminiResult = generateMockResult(payload.language);
            const geminiFlashResult = generateMockResult(payload.language);
            const qwen3CoderResult = generateMockResult(payload.language);
            const aggregatedResult = generateMockAggregated(groqResult, geminiResult, geminiFlashResult, qwen3CoderResult);

            return { groqResult, geminiResult, geminiFlashResult, qwen3CoderResult, aggregatedResult };
        }

        // Re-throw all other errors (AbortError, server errors, etc.)
        throw error;
    }
};
