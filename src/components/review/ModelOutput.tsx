import React, { useState } from 'react';
import type { ReviewResult } from '../../types';
import {
    Bug,
    Shield,
    Zap,
    Code,
    Copy,
    Check,
    ChevronDown,
    ChevronRight,
    AlertTriangle,
    Info,
    AlertCircle,
} from 'lucide-react';

interface ModelOutputProps {
    result: ReviewResult;
    modelName: string;
}

const severityColor: Record<string, string> = {
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
    high: 'text-red-400 bg-red-500/10 border-red-500/20',
    warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

const SeverityIcon: React.FC<{ severity: string }> = ({ severity }) => {
    switch (severity) {
        case 'critical':
        case 'high':
            return <AlertCircle size={14} />;
        case 'warning':
        case 'medium':
            return <AlertTriangle size={14} />;
        default:
            return <Info size={14} />;
    }
};

const CollapsibleSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    count: number;
    defaultOpen?: boolean;
    children: React.ReactNode;
}> = ({ title, icon, count, defaultOpen = false, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-border/30 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 hover-surface transition-colors duration-200"
            >
                <div className="flex items-center gap-2.5">
                    {icon}
                    <span className="text-sm font-medium text-text-primary">{title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary-light font-medium">
                        {count}
                    </span>
                </div>
                {isOpen ? (
                    <ChevronDown size={16} className="text-text-muted" />
                ) : (
                    <ChevronRight size={16} className="text-text-muted" />
                )}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 space-y-2 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

const ModelOutput: React.FC<ModelOutputProps> = ({ result, modelName }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            const formattedCode = result.refactored_code.replace(/\\n/g, '\n');
            await navigator.clipboard.writeText(formattedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    const formattedOutputCode = result.refactored_code.replace(/\\n/g, '\n');

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-text-primary">{modelName} Analysis</h3>
                    <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${result.confidence === 'High'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}
                    >
                        {result.confidence} Confidence
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold gradient-text">{result.score}</span>
                    <span className="text-sm text-text-muted">/10</span>
                </div>
            </div>

            {/* Bugs Section */}
            <CollapsibleSection
                title="Bugs Detected"
                icon={<Bug size={16} className="text-red-400" />}
                count={result.bugs.length}
                defaultOpen
            >
                {result.bugs.map((bug) => (
                    <div
                        key={bug.id}
                        className={`p-3 rounded-lg border ${severityColor[bug.severity]}`}
                    >
                        <div className="flex items-start gap-2">
                            <SeverityIcon severity={bug.severity} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono opacity-70">Line {bug.line}</span>
                                    <span className="text-xs uppercase font-medium opacity-70">{bug.severity}</span>
                                </div>
                                <p className="text-sm mb-1">{bug.message}</p>
                                <p className="text-xs opacity-70">💡 {bug.suggestion}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </CollapsibleSection>

            {/* Security Section */}
            <CollapsibleSection
                title="Security Issues"
                icon={<Shield size={16} className="text-yellow-400" />}
                count={result.security_issues.length}
            >
                {result.security_issues.map((issue) => (
                    <div
                        key={issue.id}
                        className={`p-3 rounded-lg border ${severityColor[issue.severity]}`}
                    >
                        <div className="flex items-start gap-2">
                            <SeverityIcon severity={issue.severity} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold uppercase opacity-70">{issue.type}</span>
                                    <span className="text-xs uppercase font-medium opacity-70">{issue.severity}</span>
                                </div>
                                <p className="text-sm mb-1">{issue.description}</p>
                                <p className="text-xs opacity-70">🔒 {issue.recommendation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </CollapsibleSection>

            {/* Performance Section */}
            <CollapsibleSection
                title="Performance Suggestions"
                icon={<Zap size={16} className="text-cyan-400" />}
                count={result.performance_issues.length}
            >
                {result.performance_issues.map((issue) => (
                    <div
                        key={issue.id}
                        className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-cyan-400 uppercase">{issue.area}</span>
                            <span
                                className={`text-xs px-1.5 py-0.5 rounded font-medium ${issue.impact === 'high'
                                    ? 'bg-red-500/10 text-red-400'
                                    : issue.impact === 'medium'
                                        ? 'bg-yellow-500/10 text-yellow-400'
                                        : 'bg-blue-500/10 text-blue-400'
                                    }`}
                            >
                                {issue.impact} impact
                            </span>
                        </div>
                        <p className="text-sm text-text-primary mb-1">{issue.description}</p>
                        <p className="text-xs text-text-muted">⚡ {issue.suggestion}</p>
                    </div>
                ))}
            </CollapsibleSection>

            {/* Refactored Code */}
            <div className="border border-border/30 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                    <div className="flex items-center gap-2">
                        <Code size={16} className="text-primary-light" />
                        <span className="text-sm font-medium text-text-primary">Refactored Code</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text-primary hover-surface transition-all duration-200"
                    >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <pre className="p-4 overflow-x-auto whitespace-pre-wrap text-sm text-text-primary font-mono leading-relaxed code-block-bg">
                    <code>{formattedOutputCode}</code>
                </pre>
            </div>
        </div>
    );
};

export default ModelOutput;
