import React from 'react';
import { Link } from 'react-router-dom';
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

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
                    style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
                />
                <div
                    className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full opacity-5 blur-3xl"
                    style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
                />
            </div>

            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-32 sm:pb-32">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
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

                    {/* Stats */}
                    <div
                        className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-slide-up"
                        style={{ animationDelay: '0.45s' }}
                    >
                        {[
                            { value: '5+', label: 'Languages' },
                            { value: '2', label: 'AI Models' },
                            { value: '4', label: 'Review Types' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                                <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32">
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
                            className="glass-card glass-card-hover p-6 transition-all duration-300 animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
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

            {/* CTA Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-24">
                <div className="glass-card p-8 sm:p-12 text-center gradient-border">
                    <div className="flex items-center justify-center gap-2 mb-4">
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
            <footer className="border-t border-border/30 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Code2 size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-semibold text-text-primary">AI Code Reviewer</span>
                    </div>
                    <p className="text-xs text-text-muted">
                        &copy; {new Date().getFullYear()} AI Code Reviewer. Built for developers.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
