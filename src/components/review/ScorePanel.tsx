import React from 'react';
import type { AggregatedResult } from '../../types';
import { Award, Bug, Shield, Zap, TrendingUp } from 'lucide-react';

interface ScorePanelProps {
    result: AggregatedResult;
}

const getColor = (s: number) => {
    if (s >= 8) return '#10b981';
    if (s >= 6) return '#06b6d4';
    if (s >= 4) return '#f59e0b';
    return '#ef4444';
};

const getGlowClass = (s: number) => {
    if (s >= 8) return 'score-glow-green';
    if (s >= 6) return 'score-glow-cyan';
    if (s >= 4) return 'score-glow-yellow';
    return 'score-glow-red';
};

const CircularScore: React.FC<{ score: number; size?: number }> = ({
    score,
    size = 160,
}) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percent = (score / 10) * 100;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className={`relative inline-flex items-center justify-center animate-scale-in ${getGlowClass(score)}`}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    className="score-ring-track"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getColor(score)}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-text-primary tabular-nums">{score}</span>
                <span className="text-sm text-text-muted">/10</span>
            </div>
        </div>
    );
};

const BreakdownBar: React.FC<{
    label: string;
    score: number;
    icon: React.ReactNode;
    color: string;
}> = ({ label, score, icon, color }) => {
    const clampedScore = Math.min(Math.max(score, 0), 10);
    const percent = (clampedScore / 10) * 100;

    return (
        <div className="space-y-2 group">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="transition-transform duration-200 group-hover:scale-110">{icon}</span>
                    <span className="text-sm font-medium text-text-primary">{label}</span>
                </div>
                <span className="text-sm font-bold text-text-primary tabular-nums">
                    {clampedScore.toFixed(1)}
                </span>
            </div>
            <div className="w-full h-2 rounded-full progress-track overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: `${percent}%`,
                        background: color,
                    }}
                />
            </div>
        </div>
    );
};

const ScorePanel: React.FC<ScorePanelProps> = ({ result }) => {
    const getRatingBadge = (score: number) => {
        if (score >= 8) return { label: 'Excellent', color: 'bg-green-500/10 text-green-400 border-green-500/20' };
        if (score >= 6) return { label: 'Good', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
        if (score >= 4) return { label: 'Needs Work', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
        return { label: 'Poor', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    };

    const rating = getRatingBadge(result.overall_score);

    const getRecommendation = (score: number): string => {
        if (score >= 8)
            return 'Your code demonstrates strong quality. Focus on edge case handling and documentation to achieve perfection.';
        if (score >= 6)
            return 'Good foundation with room for improvement. Address the highlighted security and performance issues for a more robust codebase.';
        if (score >= 4)
            return 'Several areas need attention. Prioritize fixing critical bugs and security vulnerabilities before deployment.';
        return 'Significant improvements required. Consider a thorough code review and refactoring session to address fundamental issues.';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Circular Score */}
            <div className="glass-card p-8 flex flex-col items-center gap-4">
                <CircularScore score={result.overall_score} />
                <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <Award size={18} className="text-primary-light" />
                    <span
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${rating.color}`}
                    >
                        {rating.label}
                    </span>
                </div>
            </div>

            {/* Score Breakdown */}
            <div className="glass-card p-5 space-y-5">
                <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary-light" />
                    Score Breakdown
                </h4>
                <BreakdownBar
                    label="Bug Detection"
                    score={result.score_breakdown.bugs}
                    icon={<Bug size={14} className="text-red-400" />}
                    color="linear-gradient(90deg, #ef4444, #f87171)"
                />
                <BreakdownBar
                    label="Security"
                    score={result.score_breakdown.security}
                    icon={<Shield size={14} className="text-yellow-400" />}
                    color="linear-gradient(90deg, #f59e0b, #fbbf24)"
                />
                <BreakdownBar
                    label="Performance"
                    score={result.score_breakdown.performance}
                    icon={<Zap size={14} className="text-cyan-400" />}
                    color="linear-gradient(90deg, #06b6d4, #22d3ee)"
                />
            </div>

            {/* Recommendation */}
            <div className="glass-card p-5">
                <h4 className="text-sm font-semibold text-text-primary mb-3">
                    💡 Improvement Recommendation
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                    {getRecommendation(result.overall_score)}
                </p>
            </div>
        </div>
    );
};

export default ScorePanel;
