import React from 'react';
import type { AggregatedResult } from '../../types';
import {
    AlertTriangle,
    CheckCircle,
    FileText,
    TrendingUp,
    Shield,
} from 'lucide-react';

interface AggregatedPanelProps {
    result: AggregatedResult;
}

const riskColors: Record<string, string> = {
    Low: 'bg-green-500/10 text-green-400 border-green-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const AggregatedPanel: React.FC<AggregatedPanelProps> = ({ result }) => {
    const scorePercent = (result.overall_score / 10) * 100;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-lg font-semibold text-text-primary">Aggregated Analysis</h3>
                <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${riskColors[result.risk_level]}`}
                >
                    <Shield size={14} className="inline mr-1.5 -mt-0.5" />
                    {result.risk_level} Risk
                </span>
            </div>

            {/* Overall Score Progress Bar */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-text-secondary">Overall Quality Score</span>
                    <span className="text-2xl font-bold gradient-text">{result.overall_score}/10</span>
                </div>
                <div className="w-full h-3 rounded-full progress-track overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${scorePercent}%`,
                            background: `linear-gradient(90deg, ${scorePercent >= 70
                                ? '#10b981, #06b6d4'
                                : scorePercent >= 50
                                    ? '#f59e0b, #ef4444'
                                    : '#ef4444, #dc2626'
                                })`,
                        }}
                    />
                </div>
            </div>

            {/* Critical Issues */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={18} className="text-yellow-400" />
                    <h4 className="text-sm font-semibold text-text-primary">Most Critical Issues</h4>
                </div>
                <ul className="space-y-2">
                    {result.critical_issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                                {index + 1}
                            </span>
                            <span className="text-sm text-text-secondary">{issue}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recommendations */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={18} className="text-cyan-400" />
                    <h4 className="text-sm font-semibold text-text-primary">Combined Recommendations</h4>
                </div>
                <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                            <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-text-secondary">{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Executive Summary */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                    <FileText size={18} className="text-primary-light" />
                    <h4 className="text-sm font-semibold text-text-primary">Executive Summary</h4>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                    {result.executive_summary}
                </p>
            </div>
        </div>
    );
};

export default AggregatedPanel;
