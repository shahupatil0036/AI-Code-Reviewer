import React, { useState } from 'react';
import { useReview } from '../context/ReviewContext';
import CodeEditor from '../components/editor/CodeEditor';
import ReviewTabs from '../components/review/ReviewTabs';
import type { Language, ReviewType } from '../types';
import {
    Play,
    Trash2,
    ChevronDown,
    Loader2,
    AlertCircle,
    RefreshCw,
    Activity,
    Bug,
    Shield,
    Zap,
    Scan,
} from 'lucide-react';

const languages: { value: Language; label: string }[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'kotlin', label: 'Kotlin' },
];

const reviewTypes: { value: ReviewType; label: string; icon: React.ReactNode }[] = [
    { value: 'bug_detection', label: 'Bug Detection', icon: <Bug size={16} /> },
    { value: 'security_audit', label: 'Security Audit', icon: <Shield size={16} /> },
    { value: 'performance', label: 'Performance', icon: <Zap size={16} /> },
    { value: 'full_review', label: 'Full Review', icon: <Scan size={16} /> },
];

const DashboardPage: React.FC = () => {
    const { state, setLanguage, setReviewType, analyzeCode, clearResults } = useReview();
    const [usageCount] = useState(12);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Error Banner */}
            {state.error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                        <span className="text-sm text-red-300">{state.error}</span>
                    </div>
                    <button
                        onClick={analyzeCode}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                        <RefreshCw size={12} />
                        Retry
                    </button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="glass-card p-5 space-y-5 lg:sticky lg:top-24">
                        {/* Language Selection */}
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                                Language
                            </label>
                            <div className="relative">
                                <select
                                    value={state.language}
                                    onChange={(e) => setLanguage(e.target.value as Language)}
                                    className="w-full appearance-none px-4 py-2.5 rounded-xl bg-black/20 border border-border/30 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                                >
                                    {languages.map((lang) => (
                                        <option key={lang.value} value={lang.value} className="bg-surface-dark">
                                            {lang.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                                />
                            </div>
                        </div>

                        {/* Review Type */}
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                                Review Type
                            </label>
                            <div className="space-y-1.5">
                                {reviewTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setReviewType(type.value)}
                                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${state.reviewType === type.value
                                            ? 'bg-primary/15 text-primary-light border border-primary/30'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        {type.icon}
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border/20" />

                        {/* Analyze Button */}
                        <button
                            onClick={analyzeCode}
                            disabled={state.loading || !state.code.trim()}
                            className="btn-primary w-full justify-center py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            {state.loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Play size={16} />
                                    Analyze Code
                                </>
                            )}
                        </button>

                        {/* Clear Button */}
                        <button
                            onClick={clearResults}
                            className="btn-danger w-full justify-center py-2.5"
                        >
                            <Trash2 size={14} />
                            Clear All
                        </button>

                        {/* Usage Counter */}
                        <div className="p-3.5 rounded-xl bg-black/20 border border-border/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-text-muted">Reviews Today</span>
                                <Activity size={14} className="text-primary-light" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-text-primary">{usageCount}</span>
                                <span className="text-xs text-text-muted">/ 50</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-black/30 mt-2 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                    style={{ width: `${(usageCount / 50) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Main Panel */}
                <div className="flex-1 space-y-6 min-w-0">
                    {/* Loading Overlay */}
                    {state.loading && (
                        <div className="glass-card p-8 text-center animate-fade-in">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                                <Loader2 size={28} className="animate-spin text-primary-light" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                Analyzing Your Code
                            </h3>
                            <p className="text-sm text-text-muted">
                                Running multi-model analysis with OpenAI and Claude...
                            </p>
                            <div className="flex justify-center gap-2 mt-4">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-primary-light animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Code Editor */}
                    {!state.loading && <CodeEditor />}

                    {/* Review Results */}
                    {!state.loading && <ReviewTabs />}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
