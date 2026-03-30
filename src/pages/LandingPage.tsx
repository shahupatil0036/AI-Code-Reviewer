import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Layers,
    FileSearch,
    Brain,
    Monitor,
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
            'Get parallel analysis from Gemini, Llama (Groq), and Qwen Coder. Compare findings and spot issues no single model catches alone.',
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

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* ═══════════════════════════════════════
                FULL-SCREEN WEB3 HERO SECTION
                ═══════════════════════════════════════ */}
            <section
                className="relative w-full overflow-hidden"
                style={{ background: '#000000', fontFamily: "'General Sans', sans-serif" }}
            >
                {/* General Sans font from Fontshare */}
                <style>{`
                    @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');
                    .hero-section * { font-family: 'General Sans', sans-serif !important; }

                    .waitlist-btn-nav {
                        position: relative;
                        display: inline-flex;
                        align-items: center;
                        border-radius: 9999px;
                        border: 0.6px solid rgba(255,255,255,1);
                        padding: 2px;
                        overflow: hidden;
                        cursor: pointer;
                        background: transparent;
                        text-decoration: none;
                    }
                    .waitlist-btn-nav::before {
                        content: '';
                        position: absolute;
                        top: -8px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60%;
                        height: 16px;
                        background: radial-gradient(ellipse at center top, rgba(255,255,255,0.55) 0%, transparent 70%);
                        filter: blur(4px);
                        border-radius: 50%;
                        pointer-events: none;
                    }
                    .waitlist-btn-nav-inner {
                        background: #000;
                        border-radius: 9999px;
                        padding: 11px 29px;
                        color: #fff;
                        font-size: 14px;
                        font-weight: 500;
                        font-family: 'General Sans', sans-serif;
                        white-space: nowrap;
                        position: relative;
                    }
                    .waitlist-btn-hero {
                        position: relative;
                        display: inline-flex;
                        align-items: center;
                        border-radius: 9999px;
                        border: 0.6px solid rgba(255,255,255,1);
                        padding: 2px;
                        overflow: hidden;
                        cursor: pointer;
                        background: transparent;
                        text-decoration: none;
                    }
                    .waitlist-btn-hero::before {
                        content: '';
                        position: absolute;
                        top: -8px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60%;
                        height: 16px;
                        background: radial-gradient(ellipse at center top, rgba(255,255,255,0.55) 0%, transparent 70%);
                        filter: blur(4px);
                        border-radius: 50%;
                        pointer-events: none;
                    }
                    .waitlist-btn-hero-inner {
                        background: #fff;
                        border-radius: 9999px;
                        padding: 11px 29px;
                        color: #000;
                        font-size: 14px;
                        font-weight: 500;
                        font-family: 'General Sans', sans-serif;
                        white-space: nowrap;
                        position: relative;
                    }
                    .hero-gradient-text {
                        background: linear-gradient(144.5deg, #ffffff 28%, rgba(0,0,0,0) 115%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    /* ── Dropdown ── */
                    .nav-dd-wrap {
                        position: relative;
                        display: inline-flex;
                        align-items: center;
                    }
                    .nav-dd-trigger {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        color: #fff;
                        font-size: 14px;
                        font-weight: 500;
                        font-family: 'General Sans', sans-serif;
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 4px 0;
                        transition: color 0.2s;
                    }
                    .nav-dd-trigger:hover { color: rgba(255,255,255,0.75); }
                    .nav-dd-chevron {
                        transition: transform 0.22s ease;
                        display: block;
                    }
                    .nav-dd-wrap:hover .nav-dd-chevron {
                        transform: rotate(180deg);
                    }
                    .nav-dd-panel {
                        position: absolute;
                        top: calc(100% + 18px);
                        left: 0;
                        opacity: 0;
                        pointer-events: none;
                        transform: translateY(-6px);
                        transition: opacity 0.2s ease, transform 0.2s ease;
                        z-index: 200;
                        min-width: 290px;
                    }
                    .nav-dd-panel-center {
                        left: 50%;
                        transform: translateX(-50%) translateY(-6px);
                    }
                    .nav-dd-panel-right {
                        left: auto;
                        right: 0;
                    }
                    .nav-dd-wrap:hover .nav-dd-panel {
                        opacity: 1;
                        pointer-events: auto;
                        transform: translateY(0);
                    }
                    .nav-dd-wrap:hover .nav-dd-panel-center {
                        transform: translateX(-50%) translateY(0);
                    }
                    .nav-dd-box {
                        background: rgba(8,8,8,0.97);
                        border: 1px solid rgba(255,255,255,0.10);
                        border-radius: 16px;
                        padding: 8px;
                        backdrop-filter: blur(40px);
                        box-shadow: 0 24px 60px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(255,255,255,0.05);
                        position: relative;
                    }
                    .nav-dd-box::before {
                        content: '';
                        position: absolute;
                        top: -6px;
                        left: 28px;
                        width: 12px;
                        height: 12px;
                        background: rgba(8,8,8,0.97);
                        border-left: 1px solid rgba(255,255,255,0.10);
                        border-top: 1px solid rgba(255,255,255,0.10);
                        transform: rotate(45deg);
                        border-radius: 2px;
                    }
                    .nav-dd-box-center::before { left: 50%; transform: translateX(-50%) rotate(45deg); }
                    .nav-dd-box-right::before { left: auto; right: 28px; }
                    .nav-dd-header {
                        padding: 8px 14px 4px;
                        font-size: 10px;
                        font-weight: 600;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                        color: rgba(255,255,255,0.28);
                        font-family: 'General Sans', sans-serif;
                    }
                    .nav-dd-item {
                        display: flex;
                        align-items: flex-start;
                        gap: 12px;
                        padding: 10px 12px;
                        border-radius: 10px;
                        text-decoration: none;
                        cursor: pointer;
                        transition: background 0.15s;
                    }
                    .nav-dd-item:hover { background: rgba(255,255,255,0.07); }
                    .nav-dd-ico {
                        width: 36px;
                        height: 36px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        font-size: 18px;
                    }
                    .nav-dd-title {
                        font-size: 13px;
                        font-weight: 600;
                        color: #fff;
                        margin-bottom: 2px;
                        font-family: 'General Sans', sans-serif;
                    }
                    .nav-dd-desc {
                        font-size: 11.5px;
                        color: rgba(255,255,255,0.42);
                        line-height: 1.5;
                        font-family: 'General Sans', sans-serif;
                    }
                    .nav-dd-divider {
                        height: 1px;
                        background: rgba(255,255,255,0.07);
                        margin: 5px 12px;
                    }
                `}</style>

                {/* Background Video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ zIndex: 0 }}
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
                />

                {/* 50% Black Overlay */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1 }}
                />

                {/* All content above video */}
                <div className="relative hero-section" style={{ zIndex: 2 }}>

                    {/* ── Navbar ── */}
                    <nav
                        className="px-8 md:px-[120px]"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 20,
                            paddingBottom: 20,
                        }}
                    >
                        {/* Left: Logo + Nav Links */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
                            {/* Logo wordmark */}
                            <div style={{ width: 187, height: 25, display: 'flex', alignItems: 'center' }}>
                                <svg width="187" height="25" viewBox="0 0 187 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <text x="0" y="20" fill="white" fontFamily="'General Sans', sans-serif" fontSize="16" fontWeight="700" letterSpacing="0.5">AI Code Reviewer</text>
                                </svg>
                            </div>

                            {/* Nav links — hidden on mobile */}
                            <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>

                                {/* ── GET STARTED ── */}
                                <div className="nav-dd-wrap">
                                    <button className="nav-dd-trigger">
                                        Get Started
                                        <svg className="nav-dd-chevron" width="12" height="12" viewBox="0 0 14 14" fill="none">
                                            <path d="M3 5L7 9L11 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <div className="nav-dd-panel">
                                        <div className="nav-dd-box">
                                            <div className="nav-dd-header">Quick Start</div>
                                            <a href="/dashboard" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(99,102,241,0.14)' }}>🚀</div>
                                                <div>
                                                    <div className="nav-dd-title">Try for Free</div>
                                                    <div className="nav-dd-desc">Paste your code and get an instant AI-powered review — no signup required.</div>
                                                </div>
                                            </a>
                                            <a href="/dashboard" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(6,182,212,0.14)' }}>📋</div>
                                                <div>
                                                    <div className="nav-dd-title">Paste Your Code</div>
                                                    <div className="nav-dd-desc">Drop any snippet into the Monaco editor — JS, TS, Python, Java, Kotlin supported.</div>
                                                </div>
                                            </a>
                                            <a href="/dashboard" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(16,185,129,0.14)' }}>⚙️</div>
                                                <div>
                                                    <div className="nav-dd-title">Pick a Review Type</div>
                                                    <div className="nav-dd-desc">Choose Bug Detection, Security Audit, Performance, or Full Review mode.</div>
                                                </div>
                                            </a>
                                            <div className="nav-dd-divider" />
                                            <a href="/dashboard" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(245,158,11,0.14)' }}>⚡</div>
                                                <div>
                                                    <div className="nav-dd-title">Results in Seconds</div>
                                                    <div className="nav-dd-desc">Gemini, Llama & Qwen analyse your code in parallel — results merged instantly.</div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* ── DASHBOARD ── */}
                                <div className="nav-dd-wrap">
                                    <button className="nav-dd-trigger">
                                        Dashboard
                                        <svg className="nav-dd-chevron" width="12" height="12" viewBox="0 0 14 14" fill="none">
                                            <path d="M3 5L7 9L11 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <div className="nav-dd-panel nav-dd-panel-center">
                                        <div className="nav-dd-box nav-dd-box-center">
                                            <div className="nav-dd-header">Your Workspace</div>
                                            <a href="/dashboard" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(99,102,241,0.14)' }}>🖥️</div>
                                                <div>
                                                    <div className="nav-dd-title">Code Editor</div>
                                                    <div className="nav-dd-desc">Monaco-powered editor with syntax highlighting & one-click clipboard paste.</div>
                                                </div>
                                            </a>
                                            <a href="/dashboard" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(139,92,246,0.14)' }}>🤖</div>
                                                <div>
                                                    <div className="nav-dd-title">Multi-Model Analysis</div>
                                                    <div className="nav-dd-desc">Gemini 1.5 Flash, Llama 3 (Groq), and Qwen Coder run in parallel — no single point of failure.</div>
                                                </div>
                                            </a>
                                            <a href="/dashboard" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(6,182,212,0.14)' }}>📊</div>
                                                <div>
                                                    <div className="nav-dd-title">Aggregated Results</div>
                                                    <div className="nav-dd-desc">Unified executive summary with risk score, priority ranking, and per-model tabs.</div>
                                                </div>
                                            </a>
                                            <div className="nav-dd-divider" />
                                            <a href="/history" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(16,185,129,0.14)' }}>🕓</div>
                                                <div>
                                                    <div className="nav-dd-title">Review History</div>
                                                    <div className="nav-dd-desc">Browse all past reviews, filter by language, type, and quality score.</div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* ── FEATURES ── */}
                                <div className="nav-dd-wrap">
                                    <button className="nav-dd-trigger">
                                        Features
                                        <svg className="nav-dd-chevron" width="12" height="12" viewBox="0 0 14 14" fill="none">
                                            <path d="M3 5L7 9L11 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <div className="nav-dd-panel nav-dd-panel-right" style={{ minWidth: 310 }}>
                                        <div className="nav-dd-box nav-dd-box-right">
                                            <div className="nav-dd-header">What You Get</div>
                                            <a href="#features" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(99,102,241,0.14)' }}>🧠</div>
                                                <div>
                                                    <div className="nav-dd-title">Multi-LLM Comparison</div>
                                                    <div className="nav-dd-desc">Three AI models run in parallel — catch issues no single model finds on its own.</div>
                                                </div>
                                            </a>
                                            <a href="#features" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(6,182,212,0.14)' }}>🔍</div>
                                                <div>
                                                    <div className="nav-dd-title">Structured Reports</div>
                                                    <div className="nav-dd-desc">Bugs, security vulnerabilities, and performance issues — each with actionable fix suggestions.</div>
                                                </div>
                                            </a>
                                            <a href="#features" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(245,158,11,0.14)' }}>🔒</div>
                                                <div>
                                                    <div className="nav-dd-title">Security Audit Mode</div>
                                                    <div className="nav-dd-desc">Detect OWASP Top 10 risks, injection attacks, auth bypasses, and unsafe dependencies.</div>
                                                </div>
                                            </a>
                                            <a href="#features" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(16,185,129,0.14)' }}>⚡</div>
                                                <div>
                                                    <div className="nav-dd-title">Performance Analysis</div>
                                                    <div className="nav-dd-desc">Identify bottlenecks, memory leaks, inefficient loops, and algorithmic complexity issues.</div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* ── HOW IT WORKS ── */}
                                <div className="nav-dd-wrap">
                                    <button className="nav-dd-trigger">
                                        How It Works
                                        <svg className="nav-dd-chevron" width="12" height="12" viewBox="0 0 14 14" fill="none">
                                            <path d="M3 5L7 9L11 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <div className="nav-dd-panel nav-dd-panel-right" style={{ minWidth: 300 }}>
                                        <div className="nav-dd-box nav-dd-box-right">
                                            <div className="nav-dd-header">3-Step Process</div>
                                            <div className="nav-dd-item" style={{ cursor: 'default' }}>
                                                <div className="nav-dd-ico" style={{ background: 'rgba(99,102,241,0.14)', fontWeight: 700, color: '#818cf8', fontSize: 14 }}>01</div>
                                                <div>
                                                    <div className="nav-dd-title">Paste Your Code</div>
                                                    <div className="nav-dd-desc">Open the dashboard, pick a language, and drop your snippet into the Monaco editor.</div>
                                                </div>
                                            </div>
                                            <div className="nav-dd-item" style={{ cursor: 'default' }}>
                                                <div className="nav-dd-ico" style={{ background: 'rgba(6,182,212,0.14)', fontWeight: 700, color: '#06b6d4', fontSize: 14 }}>02</div>
                                                <div>
                                                    <div className="nav-dd-title">Choose Review Type</div>
                                                    <div className="nav-dd-desc">Select Bug Detection, Security Audit, Performance, or Full Review from the sidebar.</div>
                                                </div>
                                            </div>
                                            <div className="nav-dd-item" style={{ cursor: 'default' }}>
                                                <div className="nav-dd-ico" style={{ background: 'rgba(16,185,129,0.14)', fontWeight: 700, color: '#10b981', fontSize: 14 }}>03</div>
                                                <div>
                                                    <div className="nav-dd-title">Get AI Results</div>
                                                    <div className="nav-dd-desc">All three models analyze in seconds. Results are merged into a priority-ranked report with a quality score.</div>
                                                </div>
                                            </div>
                                            <div className="nav-dd-divider" />
                                            <a href="/dashboard" className="nav-dd-item">
                                                <div className="nav-dd-ico" style={{ background: 'rgba(245,158,11,0.12)' }}>▶️</div>
                                                <div>
                                                    <div className="nav-dd-title">Try It Now — It's Free</div>
                                                    <div className="nav-dd-desc">Go straight to the dashboard and run your first review.</div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Right: Start Reviewing button */}
                        <a href="/dashboard" className="waitlist-btn-nav">
                            <span className="waitlist-btn-nav-inner">Start Reviewing</span>
                        </a>
                    </nav>

                    {/* ── Hero Content ── */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            paddingBottom: 102,
                            gap: 40,
                        }}
                        className="pt-[200px] md:pt-[280px]"
                    >
                        {/* Badge */}
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                background: 'rgba(255,255,255,0.10)',
                                border: '1px solid rgba(255,255,255,0.20)',
                                borderRadius: 20,
                                padding: '6px 14px',
                            }}
                        >
                            <span
                                style={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    background: '#fff',
                                    display: 'inline-block',
                                    flexShrink: 0,
                                }}
                            />
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.60)' }}>
                                Now live — powered by
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>
                                Gemini, Groq &amp; Qwen
                            </span>
                        </div>

                        {/* Heading */}
                        <h1
                            className="hero-gradient-text"
                            style={{
                                maxWidth: 613,
                                fontSize: 'clamp(36px, 5vw, 56px)',
                                fontWeight: 500,
                                lineHeight: 1.28,
                                margin: 0,
                            }}
                        >
                            AI Code Review at the Speed of Intelligence
                        </h1>

                        {/* Subtitle */}
                        <p
                            style={{
                                maxWidth: 680,
                                fontSize: 15,
                                fontWeight: 400,
                                color: 'rgba(255,255,255,0.70)',
                                margin: '-16px 0 0 0',
                                lineHeight: 1.6,
                            }}
                        >
                            Paste your code and get structured, actionable reviews from multiple AI models in seconds. Catch bugs, audit security, and optimize performance — all in one developer-first platform.
                        </p>

                        {/* CTA Button */}
                        <a href="/dashboard" className="waitlist-btn-hero">
                            <span className="waitlist-btn-hero-inner">Start Reviewing →</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                SECTIONS BELOW HERO — black background
                ═══════════════════════════════════════ */}
            <div style={{ background: '#000', position: 'relative', overflow: 'hidden' }}>

                {/* Subtle ambient orbs */}
                <div className="pointer-events-none" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <div style={{ position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)', filter: 'blur(40px)' }} />
                    <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)', filter: 'blur(40px)' }} />
                    <div style={{ position: 'absolute', top: '55%', left: '45%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05), transparent 70%)', filter: 'blur(40px)' }} />
                </div>

                {/* Thin top divider */}
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)', margin: '0 auto', maxWidth: 896 }} />

                {/* ── Features Section ── */}
                <section id="features" style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '96px 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
                            Everything You Need for{' '}
                            <span style={{ background: 'linear-gradient(135deg, #818cf8, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Intelligent Reviews
                            </span>
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 576, margin: '0 auto' }}>
                            Purpose-built for developers who demand deeper code analysis beyond simple linting.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="animate-slide-up group"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.10)',
                                    borderRadius: 16,
                                    padding: 24,
                                    backdropFilter: 'blur(12px)',
                                    transition: 'border-color 0.3s, background 0.3s',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)';
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.20)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.10)';
                                }}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                                    style={{ transition: 'transform 0.3s' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1) rotate(3deg)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = ''}
                                >
                                    <span style={{ color: '#fff' }}>{feature.icon}</span>
                                </div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                                    {feature.title}
                                </h3>
                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Thin divider */}
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)', margin: '0 auto', maxWidth: 896 }} />

                {/* ── How It Works ── */}
                <section style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '96px 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
                            How It{' '}
                            <span style={{ background: 'linear-gradient(135deg, #818cf8, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Works
                            </span>
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 576, margin: '0 auto' }}>
                            Three simple steps to smarter, AI-powered code reviews.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, position: 'relative' }}>
                        {/* Connecting line */}
                        <div className="hidden md:block" style={{ position: 'absolute', top: 40, left: '16.66%', right: '16.66%', height: 1, background: 'linear-gradient(90deg, rgba(99,102,241,0.3), rgba(6,182,212,0.3), rgba(99,102,241,0.3))' }} />

                        {steps.map((step, index) => (
                            <div key={step.number} className="animate-slide-up" style={{ textAlign: 'center', animationDelay: `${index * 0.15}s` }}>
                                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 18, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 24, transition: 'transform 0.3s, border-color 0.3s' }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)';
                                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.5)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLDivElement).style.transform = '';
                                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.25)';
                                    }}
                                >
                                    <span style={{ color: '#818cf8' }}>{step.icon}</span>
                                    <span style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {index + 1}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{step.title}</h3>
                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Thin divider */}
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)', margin: '0 auto', maxWidth: 896 }} />

                {/* ── CTA Section ── */}
                <section style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '96px 24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '64px 48px', textAlign: 'center', backdropFilter: 'blur(16px)', position: 'relative', overflow: 'hidden' }}>
                        {/* Glow blob inside card */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 200, background: 'radial-gradient(ellipse, rgba(99,102,241,0.12), transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16, position: 'relative' }}>
                            <Code2 size={24} style={{ color: '#818cf8' }} />
                            <Zap size={20} style={{ color: '#06b6d4' }} />
                            <Shield size={24} style={{ color: '#818cf8' }} />
                        </div>
                        <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#fff', marginBottom: 12, position: 'relative' }}>
                            Ready to Ship Better Code?
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.60)', marginBottom: 32, maxWidth: 560, margin: '0 auto 32px', position: 'relative' }}>
                            Start leveraging AI-powered multi-model code reviews to catch bugs, fix
                            vulnerabilities, and optimize performance before they reach production.
                        </p>
                        <Link
                            to="/dashboard"
                            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, border: '0.6px solid rgba(255,255,255,1)', padding: 2, textDecoration: 'none', background: 'transparent' }}
                        >
                            <span style={{ background: '#fff', borderRadius: 9999, padding: '11px 29px', color: '#000', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                                Launch Dashboard <ArrowRight size={16} />
                            </span>
                        </Link>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer style={{ borderTop: '1px solid rgba(255,255,255,0.10)', position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 32 }}>
                            {/* Brand */}
                            <div style={{ gridColumn: 'span 1' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Code2 size={14} style={{ color: '#fff' }} />
                                    </div>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>AI Code Reviewer</span>
                                </div>
                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                                    Multi-model AI code review engine. Ship better, more secure code with confidence.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Quick Links</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <li><Link to="/dashboard" style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#818cf8'} onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.50)'}>Dashboard</Link></li>
                                    <li><Link to="/history" style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#818cf8'} onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.50)'}>Review History</Link></li>
                                </ul>
                            </div>

                            {/* Resources */}
                            <div>
                                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Resources</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <li><a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', textDecoration: 'none' }}>Documentation</a></li>
                                    <li><a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', textDecoration: 'none' }}>API Reference</a></li>
                                    <li><a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', textDecoration: 'none' }}>Changelog</a></li>
                                </ul>
                            </div>

                            {/* Connect */}
                            <div>
                                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Connect</h4>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {[Github, Twitter, Linkedin].map((Icon, i) => (
                                        <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.50)', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#818cf8'; (e.currentTarget as HTMLAnchorElement).style.color = '#818cf8'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.50)'; }}
                                        >
                                            <Icon size={16} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)', marginBottom: 24 }} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                                &copy; {new Date().getFullYear()} AI Code Reviewer. Built for developers.
                            </p>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Privacy</a>
                                <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Terms</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
