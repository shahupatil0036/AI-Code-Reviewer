import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReview } from '../context/ReviewContext';
import type { HistoryItem, Language, ReviewType } from '../types';
import {
    Clock,
    Code2,
    Star,
    ChevronRight,
    Search,
    Calendar,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';

const mockHistory: HistoryItem[] = [
    {
        id: 'hist-1',
        language: 'typescript',
        reviewType: 'full_review',
        code: 'function processData(data: any[]) { return data.filter(Boolean); }',
        score: 8,
        timestamp: '2026-02-21T10:30:00Z',
        openaiResult: {
            bugs: [{ id: 'b1', line: 1, severity: 'warning', message: 'Using any type', suggestion: 'Use generic type' }],
            security_issues: [],
            performance_issues: [],
            refactored_code: '',
            score: 8,
            confidence: 'High',
        },
        claudeResult: {
            bugs: [{ id: 'b2', line: 1, severity: 'info', message: 'Consider strict typing', suggestion: 'Define interface' }],
            security_issues: [],
            performance_issues: [],
            refactored_code: '',
            score: 8,
            confidence: 'High',
        },
        aggregatedResult: {
            overall_score: 8,
            critical_issues: ['Minor typing concerns'],
            recommendations: ['Use strict TypeScript types'],
            executive_summary: 'Well-written code with minor type safety improvements suggested.',
            risk_level: 'Low',
            score_breakdown: { bugs: 8.5, security: 9.0, performance: 8.0 },
        },
    },
    {
        id: 'hist-2',
        language: 'python',
        reviewType: 'security_audit',
        code: 'import sqlite3\ndef query(user_input):\n  conn = sqlite3.connect("db.sqlite")\n  conn.execute(f"SELECT * FROM users WHERE name = \'{user_input}\'")',
        score: 4,
        timestamp: '2026-02-20T15:45:00Z',
        openaiResult: {
            bugs: [{ id: 'b3', line: 4, severity: 'critical', message: 'SQL Injection vulnerability', suggestion: 'Use parameterized queries' }],
            security_issues: [{ id: 's1', type: 'Injection', severity: 'critical', description: 'Raw SQL with string interpolation', recommendation: 'Use parameterized queries' }],
            performance_issues: [],
            refactored_code: '',
            score: 4,
            confidence: 'High',
        },
        claudeResult: {
            bugs: [{ id: 'b4', line: 4, severity: 'critical', message: 'SQL Injection risk', suggestion: 'Sanitize inputs' }],
            security_issues: [{ id: 's2', type: 'Injection', severity: 'critical', description: 'Unsanitized user input in SQL query', recommendation: 'Use prepared statements' }],
            performance_issues: [],
            refactored_code: '',
            score: 3,
            confidence: 'High',
        },
        aggregatedResult: {
            overall_score: 4,
            critical_issues: ['Critical SQL Injection vulnerability', 'No input sanitization'],
            recommendations: ['Use parameterized queries', 'Add input validation', 'Use ORM'],
            executive_summary: 'Critical security vulnerability detected. Immediate remediation required.',
            risk_level: 'High',
            score_breakdown: { bugs: 3.0, security: 2.0, performance: 7.0 },
        },
    },
    {
        id: 'hist-3',
        language: 'javascript',
        reviewType: 'performance',
        code: 'const arr = [];\nfor (let i = 0; i < 100000; i++) {\n  arr.push(heavyComputation(i));\n}',
        score: 6,
        timestamp: '2026-02-20T09:20:00Z',
        openaiResult: {
            bugs: [],
            security_issues: [],
            performance_issues: [{ id: 'p1', area: 'Complexity', impact: 'high', description: 'Synchronous heavy computation in loop', suggestion: 'Use Web Workers or chunking' }],
            refactored_code: '',
            score: 6,
            confidence: 'Medium',
        },
        claudeResult: {
            bugs: [],
            security_issues: [],
            performance_issues: [{ id: 'p2', area: 'Memory', impact: 'high', description: 'Large array allocation', suggestion: 'Use streaming or generators' }],
            refactored_code: '',
            score: 6,
            confidence: 'Medium',
        },
        aggregatedResult: {
            overall_score: 6,
            critical_issues: ['Performance bottleneck in main thread'],
            recommendations: ['Use Web Workers', 'Implement chunking', 'Consider lazy evaluation'],
            executive_summary: 'Performance issues identified. Code is functional but needs optimization for scale.',
            risk_level: 'Medium',
            score_breakdown: { bugs: 8.0, security: 9.0, performance: 4.0 },
        },
    },
    {
        id: 'hist-4',
        language: 'java',
        reviewType: 'bug_detection',
        code: 'public String getName() {\n  return this.user.getProfile().getName();\n}',
        score: 5,
        timestamp: '2026-02-19T14:00:00Z',
        openaiResult: {
            bugs: [{ id: 'b5', line: 2, severity: 'critical', message: 'Potential NullPointerException', suggestion: 'Add null checks or use Optional' }],
            security_issues: [],
            performance_issues: [],
            refactored_code: '',
            score: 5,
            confidence: 'High',
        },
        claudeResult: {
            bugs: [{ id: 'b6', line: 2, severity: 'critical', message: 'Chained method calls without null safety', suggestion: 'Use Optional.ofNullable()' }],
            security_issues: [],
            performance_issues: [],
            refactored_code: '',
            score: 5,
            confidence: 'High',
        },
        aggregatedResult: {
            overall_score: 5,
            critical_issues: ['NullPointerException risk in method chaining'],
            recommendations: ['Add null checks', 'Use Optional pattern', 'Add @Nullable annotations'],
            executive_summary: 'Bug-prone code with null safety issues. Should be refactored before deployment.',
            risk_level: 'Medium',
            score_breakdown: { bugs: 4.0, security: 8.0, performance: 7.0 },
        },
    },
    {
        id: 'hist-5',
        language: 'kotlin',
        reviewType: 'full_review',
        code: 'suspend fun fetchUsers(): List<User> = withContext(Dispatchers.IO) {\n  api.getUsers().also { cache.save(it) }\n}',
        score: 9,
        timestamp: '2026-02-19T08:15:00Z',
        openaiResult: {
            bugs: [],
            security_issues: [],
            performance_issues: [],
            refactored_code: '',
            score: 9,
            confidence: 'High',
        },
        claudeResult: {
            bugs: [],
            security_issues: [],
            performance_issues: [],
            refactored_code: '',
            score: 9,
            confidence: 'High',
        },
        aggregatedResult: {
            overall_score: 9,
            critical_issues: [],
            recommendations: ['Consider adding error handling for cache operations'],
            executive_summary: 'Excellent code quality with proper coroutine usage and clean architecture.',
            risk_level: 'Low',
            score_breakdown: { bugs: 9.5, security: 9.0, performance: 9.0 },
        },
    },
];

const languageColors: Record<Language, string> = {
    javascript: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    typescript: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    python: 'bg-green-500/10 text-green-400 border-green-500/20',
    java: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    kotlin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const reviewTypeLabels: Record<ReviewType, string> = {
    bug_detection: 'Bug Detection',
    security_audit: 'Security Audit',
    performance: 'Performance',
    full_review: 'Full Review',
};

const getScoreColor = (score: number): string => {
    if (score >= 8) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (score >= 6) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    if (score >= 4) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
};

const formatDate = (iso: string): string => {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const HistoryPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage] = useState(1);
    const navigate = useNavigate();
    const { setCode, setLanguage, setReviewType, setResults } = useReview();

    const filteredHistory = mockHistory.filter(
        (item) =>
            item.language.includes(searchQuery.toLowerCase()) ||
            item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reviewTypeLabels[item.reviewType].toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenReview = (item: HistoryItem) => {
        setCode(item.code);
        setLanguage(item.language);
        setReviewType(item.reviewType);
        setResults(item.openaiResult, item.claudeResult, item.aggregatedResult);
        navigate('/dashboard');
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Review History</h1>
                    <p className="text-sm text-text-muted mt-1">
                        Browse and revisit your past code analyses
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/20 border border-border/30 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            {/* History List */}
            <div className="space-y-3">
                {filteredHistory.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <Clock size={32} className="mx-auto mb-4 text-text-muted" />
                        <h3 className="text-lg font-semibold text-text-primary mb-2">No Reviews Found</h3>
                        <p className="text-sm text-text-muted">
                            {searchQuery
                                ? 'No reviews match your search query.'
                                : 'Your review history will appear here.'}
                        </p>
                    </div>
                ) : (
                    filteredHistory.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => handleOpenReview(item)}
                            className="w-full glass-card glass-card-hover p-4 sm:p-5 text-left transition-all duration-300 animate-fade-in group"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    {/* Language Badge */}
                                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                        <Code2 size={18} className="text-text-muted" />
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium border ${languageColors[item.language]}`}
                                        >
                                            {item.language}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                            <span className="text-sm font-semibold text-text-primary">
                                                {reviewTypeLabels[item.reviewType]}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getScoreColor(item.score)}`}
                                            >
                                                <Star size={10} className="inline mr-0.5 -mt-0.5" />
                                                {item.score}/10
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-muted font-mono truncate max-w-lg">
                                            {item.code.split('\n')[0]}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
                                            <Calendar size={12} />
                                            {formatDate(item.timestamp)}
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <ChevronRight
                                    size={18}
                                    className="text-text-muted group-hover:text-primary-light transition-colors flex-shrink-0"
                                />
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
                <button
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowLeft size={14} />
                    Previous
                </button>
                {[1, 2, 3].map((page) => (
                    <button
                        key={page}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                            ? 'bg-primary/15 text-primary-light'
                            : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                            }`}
                    >
                        {page}
                    </button>
                ))}
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
                    Next
                    <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default HistoryPage;
