import React, { useState, useEffect } from 'react';
import { useReview } from '../context/ReviewContext';
import { useToast } from '../components/ui/Toast';
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
    ClipboardPaste,
    Sparkles,
    Brain,
    CheckCircle2,
} from 'lucide-react';

const languages: { value: Language; label: string }[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'kotlin', label: 'Kotlin' },
];

const reviewTypes: { value: ReviewType; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'bug_detection', label: 'Bug Detection', icon: <Bug size={16} />, desc: 'Find potential bugs' },
    { value: 'security_audit', label: 'Security Audit', icon: <Shield size={16} />, desc: 'Audit vulnerabilities' },
    { value: 'performance', label: 'Performance', icon: <Zap size={16} />, desc: 'Optimize speed' },
    { value: 'full_review', label: 'Full Review', icon: <Scan size={16} />, desc: 'Comprehensive review' },
];

const analysisSteps = [
    { icon: <Sparkles size={16} />, label: 'Sending to OpenAI GPT-4...' },
    { icon: <Brain size={16} />, label: 'Analyzing with Claude...' },
    { icon: <CheckCircle2 size={16} />, label: 'Aggregating results...' },
];

const DashboardPage: React.FC = () => {
    const { state, setCode, setLanguage, setReviewType, analyzeCode, clearResults } = useReview();
    const { addToast } = useToast();
    const [usageCount] = useState(12);
    const [progressStep, setProgressStep] = useState(0);

    // Simulate progress steps during loading
    useEffect(() => {
        if (!state.loading) {
            setProgressStep(0);
            return;
        }
        setProgressStep(0);
        const t1 = setTimeout(() => setProgressStep(1), 2000);
        const t2 = setTimeout(() => setProgressStep(2), 5000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [state.loading]);

    const handleAnalyze = async () => {
        try {
            await analyzeCode();
            addToast('success', 'Code analysis completed successfully!');
        } catch {
            addToast('error', 'Analysis failed. Please try again.');
        }
    };

    const handleClear = () => {
        clearResults();
        addToast('info', 'Editor and results cleared.');
    };

    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text.trim()) {
                setCode(text);
                addToast('success', 'Code pasted from clipboard!');
            } else {
                addToast('info', 'Clipboard is empty.');
            }
        } catch {
            addToast('error', 'Could not read clipboard. Please paste manually.');
        }
    };

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
                        onClick={handleAnalyze}
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
                                    className="w-full appearance-none px-4 py-2.5 rounded-xl surface-dim border border-border/30 text-sm text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
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
                                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${state.reviewType === type.value
                                            ? 'bg-primary/15 text-primary-light border border-primary/30 shadow-sm shadow-primary/10'
                                            : 'text-text-secondary hover:text-text-primary hover-surface border border-transparent'
                                            }`}
                                    >
                                        <span className={`transition-transform duration-200 ${state.reviewType === type.value ? 'scale-110' : 'group-hover:scale-105'}`}>
                                            {type.icon}
                                        </span>
                                        <div className="text-left">
                                            <div>{type.label}</div>
                                            <div className={`text-[10px] ${state.reviewType === type.value ? 'text-primary-light/60' : 'text-text-muted'}`}>
                                                {type.desc}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="gradient-divider" />

                        {/* Analyze Button */}
                        <button
                            onClick={handleAnalyze}
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
                            onClick={handleClear}
                            className="btn-danger w-full justify-center py-2.5"
                        >
                            <Trash2 size={14} />
                            Clear All
                        </button>

                        {/* Usage Counter */}
                        <div className="p-3.5 rounded-xl surface-dim border border-border/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-text-muted">Reviews Today</span>
                                <Activity size={14} className="text-primary-light" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-text-primary">{usageCount}</span>
                                <span className="text-xs text-text-muted">/ 50</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full progress-track mt-2 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                                    style={{ width: `${(usageCount / 50) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Main Panel */}
                <div className="flex-1 space-y-6 min-w-0">
                    {/* Multi-Step Loading Overlay */}
                    {state.loading && (
                        <div className="glass-card p-8 animate-fade-in">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                                    <Loader2 size={28} className="animate-spin text-primary-light" />
                                </div>
                                <h3 className="text-lg font-semibold text-text-primary mb-1">
                                    Analyzing Your Code
                                </h3>
                                <p className="text-sm text-text-muted">
                                    Running multi-model analysis...
                                </p>
                            </div>

                            {/* Progress Steps */}
                            <div className="max-w-sm mx-auto space-y-3">
                                {analysisSteps.map((step, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${idx <= progressStep
                                            ? 'bg-primary/10 border border-primary/20'
                                            : 'surface-dim border border-transparent opacity-40'
                                            }`}
                                    >
                                        <span className={`transition-colors duration-300 ${idx < progressStep ? 'text-green-400' : idx === progressStep ? 'text-primary-light' : 'text-text-muted'}`}>
                                            {idx < progressStep ? <CheckCircle2 size={16} /> : step.icon}
                                        </span>
                                        <span className={`text-sm font-medium ${idx <= progressStep ? 'text-text-primary' : 'text-text-muted'}`}>
                                            {step.label}
                                        </span>
                                        {idx === progressStep && (
                                            <div className="ml-auto flex gap-1">
                                                {[0, 1, 2].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1.5 h-1.5 rounded-full bg-primary-light animate-bounce"
                                                        style={{ animationDelay: `${i * 0.15}s` }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Paste from Clipboard Quick Action */}
                    {!state.loading && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePasteFromClipboard}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-primary/5 border border-primary/15 text-primary-light hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                            >
                                <ClipboardPaste size={14} />
                                Paste from Clipboard
                            </button>
                            <span className="text-[10px] text-text-muted">or type directly in the editor below</span>
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
