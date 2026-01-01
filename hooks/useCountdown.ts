import { useState, useEffect } from "react";

interface TimeLeft {
    d: number;
    h: number;
    m: number;
    s: number;
}

export function useCountdown(onComplete?: () => void) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear() + 1);

    useEffect(() => {
        // Dynamic Target: Next January 1st
        const now = new Date();
        const currentYear = now.getFullYear();
        const nextYear = currentYear + 1;
        setTargetYear(nextYear);

        const target = new Date(nextYear, 0, 1, 0, 0, 0).getTime();

        const frame = () => {
            const nowTime = Date.now();
            const difference = target - nowTime;

            if (difference <= 0) {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
                if (onComplete) onComplete();
                // Optional: Trigger auto-reset or hold at 0
                return;
            }

            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const m = Math.floor((difference / 1000 / 60) % 60);
            const s = Math.floor((difference / 1000) % 60);

            setTimeLeft((prev) => {
                if (!prev) return { d, h, m, s };
                if (prev.d === d && prev.h === h && prev.m === m && prev.s === s) return prev;
                return { d, h, m, s };
            });

            requestAnimationFrame(frame);
        };

        const handle = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(handle);
    }, [onComplete]);

    return { timeLeft, targetYear, count: 0, waitingText: "waiting" };
}
