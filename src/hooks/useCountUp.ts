import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for an animated count-up effect.
 * @param end - Target number
 * @param duration - Animation duration in ms (default: 1500)
 * @param start - Starting number (default: 0)
 */
export function useCountUp(end: number, duration = 1500, start = 0): number {
    const [value, setValue] = useState(start);
    const startedRef = useRef(false);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const startTime = performance.now();
        const diff = end - start;

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(start + diff * eased));

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }, [end, duration, start]);

    return value;
}
