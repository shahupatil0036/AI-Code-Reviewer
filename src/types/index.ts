export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'kotlin';

export type ReviewType = 'bug_detection' | 'security_audit' | 'performance' | 'full_review';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Confidence = 'High' | 'Medium' | 'Low';

export interface BugIssue {
    id: string;
    line: number;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    suggestion: string;
}

export interface SecurityIssue {
    id: string;
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
}

export interface PerformanceIssue {
    id: string;
    area: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
    suggestion: string;
}

export interface ReviewResult {
    bugs: BugIssue[];
    security_issues: SecurityIssue[];
    performance_issues: PerformanceIssue[];
    refactored_code: string;
    score: number;
    confidence: Confidence;
}

export interface AggregatedResult {
    overall_score: number;
    critical_issues: string[];
    recommendations: string[];
    executive_summary: string;
    risk_level: RiskLevel;
    score_breakdown: {
        bugs: number;
        security: number;
        performance: number;
    };
}

export interface ReviewPayload {
    code: string;
    language: Language;
    review_type: ReviewType;
}

export type ReviewActionType =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_LANGUAGE'; payload: Language }
    | { type: 'SET_REVIEW_TYPE'; payload: ReviewType }
    | { type: 'SET_CODE'; payload: string }
    | { type: 'SET_OPENAI_RESULT'; payload: ReviewResult }
    | { type: 'SET_CLAUDE_RESULT'; payload: ReviewResult }
    | { type: 'SET_AGGREGATED_RESULT'; payload: AggregatedResult }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'CLEAR_RESULTS' };

export interface ReviewState {
    loading: boolean;
    language: Language;
    reviewType: ReviewType;
    code: string;
    openaiResult: ReviewResult | null;
    claudeResult: ReviewResult | null;
    aggregatedResult: AggregatedResult | null;
    error: string | null;
}

export interface HistoryItem {
    id: string;
    language: Language;
    reviewType: ReviewType;
    code: string;
    score: number;
    timestamp: string;
    openaiResult: ReviewResult;
    claudeResult: ReviewResult;
    aggregatedResult: AggregatedResult;
}
