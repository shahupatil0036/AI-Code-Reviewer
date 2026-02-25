import React from 'react';
import { Link } from 'react-router-dom';
import { useCountUp } from '../hooks/useCountUp';
import {
    ArrowRight,
    Layers,
    FileSearch,
    Brain,
    Monitor,
    Sparkles,
    Zap,
    Shield,
    Code2,
    Upload,
    Settings2,
    BarChart3,
    Github,
    Twitter,
    Linkedin,
} from 'lucide-react';

const features = [
    {
        icon: <Layers size={24} />,
        title: 'Multi-LLM Comparison',
        description:
            'Get parallel analysis from OpenAI and Claude. Compare findings and spot issues no single model catches alone.',
        color: 'from-indigo-500 to-purple-500',
    },
    {
        icon: <FileSearch size={24} />,
        title: 'Structured AI Review',
        description:
            'Receive organized reports covering bugs, security vulnerabilities, and performance bottlenecks with actionable fixes.',
        color: 'from-cyan-500 to-blue-500',
    },
    {
        icon: <Brain size={24} />,
        title: 'Smart Aggregation Engine',
        description:
            'Intelligent merging of multi-model outputs into a unified executive summary with risk scoring and priority ranking.',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        icon: <Monitor size={24} />,
        title: 'Developer-First UI',
        description:
            'Built for developers with Monaco Editor, syntax highlighting, dark mode, and a streamlined workflow experience.',
        color: 'from-amber-500 to-orange-500',
    },
];

const steps = [
    {
        icon: <Upload size={28} />,
        title: 'Paste Your Code',
        description: 'Drop your code into the Monaco-powered editor or paste directly from your clipboard.',
        number: '01',
    },
    {
        icon: <Settings2 size={28} />,
        title: 'Choose Review Type',
        description: 'Select from bug detection, security audit, performance analysis, or a comprehensive full review.',
        number: '02',
    },
    {
        icon: <BarChart3 size={28} />,
        title: 'Get AI Results',
        description: 'Receive structured, actionable results from multiple AI models with aggregated scoring.',
        number: '03',
    },
];

const CountUpStat: React.FC<{ end: number; suffix?: string; label: string }> = ({ end, suffix = '', label }) => {
    const count = useCountUp(end, 1800);
    return (
        <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold gradient-text tabular-nums">
                {count}{suffix}
            </div>
            <div className="text-xs text-text-muted mt-1">{label}</div>
        </div>
    );
};

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="floating-orb w-96 h-96 opacity-[0.08] top-[15%] left-[20%]"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent)', animationDelay: '0s' }}
                />
                <div
                    className="floating-orb w-80 h-80 opacity-[0.06] bottom-[20%] right-[15%]"
                    style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animationDelay: '-3s', animationDuration: '10s' }}
                />
                <div
                    className="floating-orb w-64 h-64 opacity-[0.05] top-[60%] left-[50%]"
                    style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animationDelay: '-5s', animationDuration: '12s' }}
                />
                <div
                    className="floating-orb w-48 h-48 opacity-[0.04] top-[10%] right-[30%]"
                    style={{ background: 'radial-gradient(circle, #10b981, transparent)', animationDelay: '-2s', animationDuration: '14s' }}
                />
            </div>

            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-32 sm:pb-32">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in hover-lift cursor-default">
                        <Sparkles size={14} className="text-primary-light" />
                        <span className="text-xs font-medium text-primary-light">
                            Powered by Multi-Model AI
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
                        <span className="text-text-primary">Multi-Model AI</span>
                        <br />
                        <span className="gradient-text">Code Review Engine</span>
                    </h1>

                    {/* Description */}
                    <p
                        className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
                        style={{ animationDelay: '0.15s' }}
                    >
                        Submit your code and receive structured, actionable reviews from multiple AI models.
                        Detect bugs, audit security, optimize performance — all in one platform.
                    </p>

                    {/* CTA Buttons */}
                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
                        style={{ animationDelay: '0.3s' }}
                    >
                        <Link
                            to="/dashboard"
                            className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-lg shadow-primary/25"
                        >
                            Start Reviewing
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/dashboard"
                            className="btn-secondary text-base px-8 py-3.5 rounded-xl"
                        >
                            View Demo
                        </Link>
                    </div>

                    {/* Stats with Count-Up */}
                    <div
                        className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-slide-up"
                        style={{ animationDelay: '0.45s' }}
                    >
                        <CountUpStat end={5} suffix="+" label="Languages" />
                        <CountUpStat end={2} label="AI Models" />
                        <CountUpStat end={4} label="Review Types" />
                    </div>
                </div>
            </section>

            {/* Gradient Divider */}
            <div className="gradient-divider max-w-4xl mx-auto" />

            {/* Features Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                        Everything You Need for{' '}
                        <span className="gradient-text">Intelligent Reviews</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Purpose-built for developers who demand deeper code analysis beyond simple linting.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="glass-card glass-card-hover p-6 transition-all duration-300 animate-slide-up group"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                            >
                                <span className="text-white">{feature.icon}</span>
                            </div>
                            <h3 className="text-base font-semibold text-text-primary mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gradient Divider */}
            <div className="gradient-divider max-w-4xl mx-auto" />

            {/* How It Works */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Three simple steps to smarter, AI-powered code reviews.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden md:block absolute top-20 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />

                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className="relative text-center animate-slide-up"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            {/* Step number circle */}
                            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 mb-6 mx-auto shadow-lg transition-all duration-300 hover:scale-110 hover:border-primary/40">
                                <span className="text-primary-light">{step.icon}</span>
                                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold flex items-center justify-center shadow-md">
                                    {index + 1}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gradient Divider */}
            <div className="gradient-divider max-w-4xl mx-auto" />

            {/* CTA Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
                <div className="glass-card p-8 sm:p-12 text-center gradient-border">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Code2 size={24} className="text-primary-light" />
                        <Zap size={20} className="text-accent" />
                        <Shield size={24} className="text-primary-light" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                        Ready to Ship Better Code?
                    </h2>
                    <p className="text-text-secondary mb-8 max-w-xl mx-auto">
                        Start leveraging AI-powered multi-model code reviews to catch bugs, fix
                        vulnerabilities, and optimize performance before they reach production.
                    </p>
                    <Link
                        to="/dashboard"
                        className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-lg shadow-primary/25"
                    >
                        Launch Dashboard
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                                    <Code2 size={14} className="text-white" />
                                </div>
                                <span className="text-base font-bold text-text-primary">AI Code Reviewer</span>
                            </div>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Multi-model AI code review engine. Ship better, more secure code with confidence.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-text-primary mb-4">Quick Links</h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link to="/dashboard" className="text-sm text-text-muted hover:text-primary-light transition-colors">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/history" className="text-sm text-text-muted hover:text-primary-light transition-colors">
                                        Review History
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="text-sm font-semibold text-text-primary mb-4">Resources</h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <a href="#" className="text-sm text-text-muted hover:text-primary-light transition-colors">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-text-muted hover:text-primary-light transition-colors">
                                        API Reference
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-text-muted hover:text-primary-light transition-colors">
                                        Changelog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="text-sm font-semibold text-text-primary mb-4">Connect</h4>
                            <div className="flex items-center gap-3">
                                <a href="#" className="w-9 h-9 rounded-lg icon-btn-surface border border-border/30 flex items-center justify-center text-text-muted hover:text-primary-light hover:border-primary/30 transition-all duration-200 hover-lift">
                                    <Github size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-lg icon-btn-surface border border-border/30 flex items-center justify-center text-text-muted hover:text-primary-light hover:border-primary/30 transition-all duration-200 hover-lift">
                                    <Twitter size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-lg icon-btn-surface border border-border/30 flex items-center justify-center text-text-muted hover:text-primary-light hover:border-primary/30 transition-all duration-200 hover-lift">
                                    <Linkedin size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="gradient-divider mb-6" />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-text-muted">
                            &copy; {new Date().getFullYear()} AI Code Reviewer. Built for developers.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Privacy</a>
                            <a href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
