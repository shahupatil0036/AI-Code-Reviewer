import React, { useState, useRef, useEffect } from 'react';
import { useReview } from '../../context/ReviewContext';
import ModelOutput from './ModelOutput';
import AggregatedPanel from './AggregatedPanel';
import ScorePanel from './ScorePanel';
import { Bot, Cpu, BarChart3, Target } from 'lucide-react';

type TabId = 'openai' | 'claude' | 'aggregated' | 'score';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ReactNode;
}

const tabs: Tab[] = [
    { id: 'openai', label: 'OpenAI', icon: <Bot size={16} /> },
    { id: 'claude', label: 'Claude', icon: <Cpu size={16} /> },
    { id: 'aggregated', label: 'Aggregated Summary', icon: <BarChart3 size={16} /> },
    { id: 'score', label: 'Score', icon: <Target size={16} /> },
];

const ReviewTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('openai');
    const { state } = useReview();
    const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
        openai: null,
        claude: null,
        aggregated: null,
        score: null,
    });
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

    const hasResults = state.openaiResult || state.claudeResult || state.aggregatedResult;

    // Update sliding indicator position
    useEffect(() => {
        const activeEl = tabRefs.current[activeTab];
        if (activeEl) {
            setIndicatorStyle({
                width: activeEl.offsetWidth,
                transform: `translateX(${activeEl.offsetLeft}px)`,
            });
        }
    }, [activeTab]);

    if (!hasResults) {
        return (
            <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center animate-scale-in">
                    <BarChart3 size={28} className="text-primary-light" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">No Analysis Yet</h3>
                <p className="text-sm text-text-muted max-w-md mx-auto">
                    Paste your code in the editor, select a review type, and click{' '}
                    <span className="text-primary-light font-medium">Analyze</span> to get AI-powered
                    code reviews from multiple models.
                </p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden">
            {/* Tab Header */}
            <div className="relative flex border-b border-border/30 overflow-x-auto">
                {/* Sliding indicator */}
                <span
                    className="absolute bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 ease-out"
                    style={indicatorStyle}
                />

                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        ref={(el) => { tabRefs.current[tab.id] = el; }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all duration-200 relative ${activeTab === tab.id
                            ? 'text-primary-light'
                            : 'text-text-muted hover:text-text-secondary'
                            }`}
                    >
                        <span className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                            {tab.icon}
                        </span>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-5">
                <div className="animate-fade-in" key={activeTab}>
                    {activeTab === 'openai' && state.openaiResult && (
                        <ModelOutput result={state.openaiResult} modelName="OpenAI GPT-4" />
                    )}
                    {activeTab === 'claude' && state.claudeResult && (
                        <ModelOutput result={state.claudeResult} modelName="Anthropic Claude" />
                    )}
                    {activeTab === 'aggregated' && state.aggregatedResult && (
                        <AggregatedPanel result={state.aggregatedResult} />
                    )}
                    {activeTab === 'score' && state.aggregatedResult && (
                        <ScorePanel result={state.aggregatedResult} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewTabs;
