import React from 'react';
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
} from 'lucide-react';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';
const hasClerk = CLERK_KEY.startsWith('pk_');

const Navbar: React.FC = () => {
    const { isDark, toggle } = useTheme();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
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
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
                        <Code2 size={18} className="text-white" />
                    </div>
                    <span className="text-lg font-bold text-text-primary hidden sm:inline">
                        AI Code Reviewer
                    </span>
                </Link>

                {/* Center Nav Links */}
                <div className="flex items-center gap-1">
                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/dashboard')
                                ? 'bg-primary/15 text-primary-light'
                                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                            }`}
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">New Review</span>
                    </Link>
                    <Link
                        to="/history"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/history')
                                ? 'bg-primary/15 text-primary-light'
                                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                            }`}
                    >
                        <History size={16} />
                        <span className="hidden sm:inline">History</span>
                    </Link>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggle}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

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
            </div>
        </nav>
    );
};

export default Navbar;
