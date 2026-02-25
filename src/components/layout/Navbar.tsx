import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import {
    Sun,
    Moon,
    Plus,
    History,
    Code2,
    User,
    Menu,
    X,
} from 'lucide-react';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';
const hasClerk = CLERK_KEY.startsWith('pk_');

const Navbar: React.FC = () => {
    const { isDark, toggle } = useTheme();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Close mobile menu on outside click
    useEffect(() => {
        if (!mobileOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [mobileOpen]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const navLinks = [
        { path: '/dashboard', label: 'New Review', icon: <Plus size={16} />, shortcut: 'Ctrl+N' },
        { path: '/history', label: 'History', icon: <History size={16} />, shortcut: 'Ctrl+H' },
    ];

    return (
        <>
            <nav
                className="sticky top-0 z-50 border-b border-border/50"
                style={{
                    background: isDark
                        ? 'rgba(10, 10, 26, 0.85)'
                        : 'rgba(248, 250, 252, 0.85)',
                    backdropFilter: 'blur(16px)',
                }}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
                            <Code2 size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-bold text-text-primary hidden sm:inline">
                            AI Code Reviewer
                        </span>
                    </Link>

                    {/* Center Nav Links — Desktop */}
                    <div className="hidden sm:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group/link ${isActive(link.path)
                                    ? 'bg-primary/15 text-primary-light'
                                    : 'text-text-secondary hover:text-text-primary hover-surface'
                                    }`}
                                title={link.shortcut}
                            >
                                {link.icon}
                                {link.label}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                                )}
                                {/* Keyboard shortcut tooltip */}
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-surface-dark/95 border border-border/30 text-[10px] text-text-muted font-mono whitespace-nowrap opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    {link.shortcut}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Side — Desktop */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggle}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover-surface transition-all duration-200 hover:rotate-12"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Auth */}
                        <div className="hidden sm:block">
                            {hasClerk ? (
                                <>
                                    <SignedOut>
                                        <SignInButton mode="modal">
                                            <button className="btn-primary text-sm">Sign In</button>
                                        </SignInButton>
                                    </SignedOut>
                                    <SignedIn>
                                        <UserButton
                                            appearance={{
                                                elements: { avatarBox: 'w-8 h-8' },
                                            }}
                                        />
                                    </SignedIn>
                                </>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center" title="Demo Mode">
                                    <User size={16} className="text-primary-light" />
                                </div>
                            )}
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover-surface transition-all duration-200"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="mobile-menu-overlay sm:hidden" onClick={() => setMobileOpen(false)}>
                    <div
                        ref={menuRef}
                        className="absolute right-0 top-0 h-full w-72 animate-slide-in-right"
                        style={{
                            background: isDark
                                ? 'rgba(10, 10, 26, 0.97)'
                                : 'rgba(248, 250, 252, 0.97)',
                            backdropFilter: 'blur(20px)',
                            borderLeft: '1px solid rgba(99, 102, 241, 0.15)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <div className="flex items-center justify-between p-4 border-b border-border/30">
                            <span className="text-sm font-semibold text-text-primary">Menu</span>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover-surface transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Nav Links */}
                        <div className="p-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(link.path)
                                        ? 'bg-primary/15 text-primary-light'
                                        : 'text-text-secondary hover:text-text-primary hover-surface'
                                        }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="gradient-divider mx-4" />

                        {/* Auth in mobile */}
                        <div className="p-4">
                            {hasClerk ? (
                                <>
                                    <SignedOut>
                                        <SignInButton mode="modal">
                                            <button className="btn-primary w-full justify-center text-sm">Sign In</button>
                                        </SignInButton>
                                    </SignedOut>
                                    <SignedIn>
                                        <div className="flex items-center gap-3">
                                            <UserButton
                                                appearance={{
                                                    elements: { avatarBox: 'w-8 h-8' },
                                                }}
                                            />
                                            <span className="text-sm text-text-secondary">Account</span>
                                        </div>
                                    </SignedIn>
                                </>
                            ) : (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User size={16} className="text-primary-light" />
                                    </div>
                                    <span className="text-sm text-text-muted">Demo Mode</span>
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
