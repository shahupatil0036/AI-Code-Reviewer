import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LoadingScreenProps {
    onComplete: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const WORDS = ['Design', 'Create', 'Inspire'];
const WORD_INTERVAL_MS = 900;
const COUNTER_DURATION_MS = 2700;
const COMPLETE_DELAY_MS = 400;

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

// ─── Component ────────────────────────────────────────────────────────────────
const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [wordIndex, setWordIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const onCompleteRef = useRef(onComplete);
    const startTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    // Keep ref in sync to avoid stale closure
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    // ── Rotating words ─────────────────────────────────────────────────────────
    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => {
                if (prev < WORDS.length - 1) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, WORD_INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    // ── Counter via requestAnimationFrame ─────────────────────────────────────
    useEffect(() => {
        const tick = (timestamp: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = timestamp;
            }
            const elapsed = timestamp - startTimeRef.current;
            const raw = Math.min((elapsed / COUNTER_DURATION_MS) * 100, 100);
            setProgress(raw);

            if (raw < 100) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                // Counter finished — fire onComplete after delay
                setTimeout(() => {
                    onCompleteRef.current();
                }, COMPLETE_DELAY_MS);
            }
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <motion.div
            key="loading-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: '#0a0a0a',
                overflow: 'hidden',
            }}
        >
            {/* ── Instrument Serif font ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
                .font-display { font-family: 'Instrument Serif', serif; }
            `}</style>

            {/* ── Element 1: Portfolio label (top-left) ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                style={{
                    position: 'absolute',
                    top: 32,
                    left: 32,
                    color: '#888888',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    fontFamily: 'system-ui, sans-serif',
                }}
                className="md:top-12 md:left-12 text-xs md:text-sm"
            >
                Portfolio
            </motion.div>

            {/* ── Element 2: Rotating words (center) ── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.span
                        key={wordIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="font-display text-4xl md:text-6xl lg:text-7xl"
                        style={{
                            fontStyle: 'italic',
                            fontWeight: 400,
                            color: 'rgba(245, 245, 245, 0.80)',
                        }}
                    >
                        {WORDS[wordIndex]}
                    </motion.span>
                </AnimatePresence>
            </div>

            {/* ── Element 3: Counter (bottom-right) ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                style={{
                    position: 'absolute',
                    bottom: 32,
                    right: 32,
                    lineHeight: 1,
                }}
                className="md:bottom-12 md:right-12"
            >
                <span
                    className="font-display text-6xl md:text-8xl lg:text-9xl"
                    style={{
                        fontVariantNumeric: 'tabular-nums',
                        color: '#f5f5f5',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                    }}
                >
                    {Math.round(progress).toString().padStart(3, '0')}
                </span>
            </motion.div>

            {/* ── Element 4: Progress bar (bottom edge) ── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: 'rgba(31, 31, 31, 0.50)',
                }}
            >
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress / 100 }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                    style={{
                        height: '100%',
                        transformOrigin: 'left',
                        background: 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
                        boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
                    }}
                />
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
