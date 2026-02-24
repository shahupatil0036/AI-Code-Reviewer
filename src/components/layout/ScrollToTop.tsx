import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="scroll-to-top-btn"
            aria-label="Scroll to top"
        >
            <ArrowUp size={18} />
        </button>
    );
};

export default ScrollToTop;
