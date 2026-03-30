import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import {
    Plus,
    History,
    User,
    Menu,
    X,
} from 'lucide-react';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';
const hasClerk = CLERK_KEY.startsWith('pk_');

/* ─── Shared pill-button styles ─────────────────────────────────────────────── */
const pillBtnStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 9999,
    border: '0.6px solid rgba(255,255,255,1)',
    padding: 2,
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'transparent',
    textDecoration: 'none',
};

const pillBtnInnerStyle: React.CSSProperties = {
    background: '#000',
    borderRadius: 9999,
    padding: '11px 29px',
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'General Sans', sans-serif",
    whiteSpace: 'nowrap',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
};

/* ─── Nav glow streak (top edge of pill) ───────────────────────────────────── */
const PillGlow = () => (
    <span style={{
        position: 'absolute',
        top: -8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: 16,
        background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.55) 0%, transparent 70%)',
        filter: 'blur(4px)',
        borderRadius: '50%',
        pointerEvents: 'none',
    }} />
);

/* ─── Component ─────────────────────────────────────────────────────────────── */
const Navbar: React.FC = () => {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;
    const isLanding = location.pathname === '/';

    /* scroll detection for stronger blur when scrolled */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* close mobile menu on route change */
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    /* close mobile menu on outside click */
    useEffect(() => {
        if (!mobileOpen) return;
        const handle = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [mobileOpen]);

    /* lock body scroll on mobile menu */
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const navLinks = [
        { path: '/dashboard', label: 'New Review', icon: <Plus size={15} /> },
        { path: '/history',   label: 'History',    icon: <History size={15} /> },
    ];

    /* On Landing page, the hero already has its own nav — hide this global one */
    if (isLanding) return null;

    return (
        <>
            <style>{`
                .nav-link-active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 12px;
                    right: 12px;
                    height: 1.5px;
                    background: linear-gradient(90deg, #89AACC, #4E85BF);
                    border-radius: 999px;
                }
                .nav-pill-btn::before {
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
            `}</style>

            {/* ── Desktop Navbar ── */}
            <nav
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    background: scrolled ? 'rgba(0, 0, 0, 0.92)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                    transition: 'all 0.3s ease',
                }}
            >
                <div className="px-8 md:px-[120px]" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 20,
                    paddingBottom: 20,
                    width: '100%',
                }}>

                    {/* Logo */}
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                        }}
                    >
                        <div
                            style={{
                                width: 187,
                                height: 25,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <svg width="187" height="25" viewBox="0 0 187 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <text x="0" y="20" fill="white" fontFamily="'General Sans', sans-serif" fontSize="16" fontWeight="700" letterSpacing="0.5">AI Code Reviewer</text>
                            </svg>
                        </div>
                    </Link>

                    {/* Center nav links — desktop */}
                    <div
                        className="hidden sm:flex"
                        style={{ alignItems: 'center', gap: 4 }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={isActive(link.path) ? 'nav-link-active' : ''}
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '6px 14px',
                                    borderRadius: 8,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    color: isActive(link.path)
                                        ? '#fff'
                                        : 'rgba(255,255,255,0.55)',
                                    background: isActive(link.path)
                                        ? 'rgba(255,255,255,0.07)'
                                        : 'transparent',
                                    transition: 'color 0.2s, background 0.2s',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive(link.path)) {
                                        (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive(link.path)) {
                                        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)';
                                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                                    }
                                }}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

                        {/* Auth — desktop */}
                        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 10 }}>
                            {hasClerk ? (
                                <>
                                    <SignedOut>
                                        <SignInButton mode="modal">
                                            <a className="nav-pill-btn" style={pillBtnStyle}>
                                                <PillGlow />
                                                <span style={pillBtnInnerStyle}>Sign In</span>
                                            </a>
                                        </SignInButton>
                                    </SignedOut>
                                    <SignedIn>
                                        <UserButton
                                            appearance={{ elements: { avatarBox: 'w-8 h-8' } }}
                                        />
                                    </SignedIn>
                                </>
                            ) : (
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'rgba(99,102,241,0.20)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(99,102,241,0.30)',
                                }} title="Demo Mode">
                                    <User size={15} color="#818cf8" />
                                </div>
                            )}
                        </div>

                        {/* CTA pill — "Start Reviewing" */}
                        <Link
                            to="/dashboard"
                            className="nav-pill-btn hidden sm:inline-flex"
                            style={pillBtnStyle}
                        >
                            <PillGlow />
                            <span style={pillBtnInnerStyle}>
                                Start Reviewing
                            </span>
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="sm:hidden"
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(255,255,255,0.70)',
                                cursor: 'pointer',
                            }}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Menu Slide-in ── */}
            {mobileOpen && (
                <div
                    className="sm:hidden"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 49,
                        background: 'rgba(0,0,0,0.60)',
                        backdropFilter: 'blur(4px)',
                    }}
                    onClick={() => setMobileOpen(false)}
                >
                    <div
                        ref={menuRef}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: 280,
                            background: '#0a0a0a',
                            borderLeft: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Menu</span>
                            <button
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 6,
                                    border: '1px solid rgba(255,255,255,0.10)',
                                    background: 'rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.60)',
                                    cursor: 'pointer',
                                }}
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Links */}
                        <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '10px 14px',
                                        borderRadius: 10,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        color: isActive(link.path) ? '#fff' : 'rgba(255,255,255,0.55)',
                                        background: isActive(link.path) ? 'rgba(255,255,255,0.07)' : 'transparent',
                                    }}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 20px' }} />

                        {/* Auth */}
                        <div style={{ padding: '16px 20px' }}>
                            {hasClerk ? (
                                <>
                                    <SignedOut>
                                        <SignInButton mode="modal">
                                            <button style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: 10,
                                                border: '0.6px solid rgba(255,255,255,1)',
                                                background: '#000',
                                                color: '#fff',
                                                fontSize: 14,
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                            }}>
                                                Sign In
                                            </button>
                                        </SignInButton>
                                    </SignedOut>
                                    <SignedIn>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
                                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)' }}>Account</span>
                                        </div>
                                    </SignedIn>
                                </>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '10px 14px',
                                    borderRadius: 10,
                                    background: 'rgba(99,102,241,0.07)',
                                }}>
                                    <div style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: '50%',
                                        background: 'rgba(99,102,241,0.20)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <User size={14} color="#818cf8" />
                                    </div>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)' }}>Demo Mode</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
