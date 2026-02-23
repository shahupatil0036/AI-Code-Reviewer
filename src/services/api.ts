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
}

interface BackendApiResponse {
    success: boolean;
    data?: BackendReviewResult;
    error?: string;
}

// ── Mapping helpers (backend → frontend types) ──────────────────────────

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

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

function mapImpact(severity: string): PerformanceIssue['impact'] {
    if (severity === 'high' || severity === 'critical') return 'high';
    if (severity === 'medium') return 'medium';
    return 'low';
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
            impact: mapImpact('medium'),
            description: p.description,
            suggestion: p.suggestion,
        })),
        refactored_code: backend.refactored_code,
        score: backend.score,
        confidence: (backend.confidence.charAt(0).toUpperCase() + backend.confidence.slice(1)) as ReviewResult['confidence'],
    };
}

function generateAggregatedResult(
    openai: ReviewResult,
    claude: ReviewResult
): AggregatedResult {
    const avgScore = Math.round((openai.score + claude.score) / 2);
    const totalBugs = openai.bugs.length + claude.bugs.length;
    const totalSecurity = openai.security_issues.length + claude.security_issues.length;

    const criticalIssues: string[] = [];
    if (totalBugs > 0) criticalIssues.push(`${totalBugs} bug(s) detected across analysis`);
    if (totalSecurity > 0) criticalIssues.push(`${totalSecurity} security concern(s) identified`);
    if (openai.performance_issues.length + claude.performance_issues.length > 0) {
        criticalIssues.push('Performance bottlenecks detected');
    }

    const recommendations: string[] = [];
    if (totalBugs > 0) recommendations.push('Fix all reported bugs before deployment');
    if (totalSecurity > 0) recommendations.push('Address security vulnerabilities immediately');
    recommendations.push('Consider adding unit tests for critical paths');

    return {
        overall_score: avgScore,
        critical_issues: criticalIssues.length > 0 ? criticalIssues : ['No critical issues found'],
        recommendations,
        executive_summary: `AI analysis reveals a codebase with a quality score of ${avgScore}/10. ${totalBugs} potential bug(s) and ${totalSecurity} security concern(s) were identified.`,
        risk_level: avgScore >= 7 ? 'Low' : avgScore >= 5 ? 'Medium' : 'High',
        score_breakdown: {
            bugs: Math.max(Math.round((10 - totalBugs * 1.5) * 10) / 10, 0),
            security: Math.max(Math.round((10 - totalSecurity * 2) * 10) / 10, 0),
            performance: Math.round((avgScore + 1) * 10) / 10,
        },
    };
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

// ── Main API function ───────────────────────────────────────────────────

export const submitReview = async (
    payload: ReviewPayload,
    signal?: AbortSignal
): Promise<{
    openaiResult: ReviewResult;
    claudeResult: ReviewResult;
    aggregatedResult: AggregatedResult;
}> => {
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

        // Map backend response to frontend types
        // Use the same result for both "models" since
        // the backend currently only has one model (OpenAI)
        const openaiResult = mapBackendToFrontend(json.data);
        const claudeResult = mapBackendToFrontend(json.data);
        const aggregatedResult = generateAggregatedResult(openaiResult, claudeResult);

        return { openaiResult, claudeResult, aggregatedResult };
    } catch (error) {
        // If the backend is unreachable, fall back to demo mode
        if (
            error instanceof TypeError &&
            error.message.includes('fetch')
        ) {
            console.warn('[API] Backend unreachable — falling back to demo mode');
            await simulateDelay(1500 + Math.random() * 500);

            const openaiResult = generateMockResult(payload.language);
            const claudeResult = generateMockResult(payload.language);
            const aggregatedResult = generateAggregatedResult(openaiResult, claudeResult);

            return { openaiResult, claudeResult, aggregatedResult };
        }

        // Re-throw all other errors (AbortError, server errors, etc.)
        throw error;
    }
};
