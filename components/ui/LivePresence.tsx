"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useAppStore } from "@/store/useAppStore";

interface LivePresenceProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lang?: any;
}

export function LivePresence({ lang }: LivePresenceProps) {
    const [count, setCount] = useState(14205);
    const [currentEvent, setCurrentEvent] = useState<{ code: string; text: string } | null>(null);
    const [avatars, setAvatars] = useState<string[]>([]);
    const { theme } = useAppStore();

    // Theme Logic
    const themeColors: Record<string, { ping: string; dot: string; text: string; scanner: string; bar: string }> = {
        'dark-void': {
            ping: 'bg-blue-400',
            dot: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
            text: 'text-blue-400',
            scanner: 'text-blue-500/50',
            bar: 'bg-blue-500/50'
        },
        'aurora': {
            ping: 'bg-purple-400',
            dot: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]',
            text: 'text-purple-400',
            scanner: 'text-purple-500/50',
            bar: 'bg-purple-500/50'
        },
        'sunset': {
            ping: 'bg-orange-400',
            dot: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]',
            text: 'text-orange-400',
            scanner: 'text-orange-500/50',
            bar: 'bg-orange-500/50'
        },
        'emerald': {
            ping: 'bg-emerald-400',
            dot: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
            text: 'text-emerald-400',
            scanner: 'text-emerald-500/50',
            bar: 'bg-emerald-500/50'
        },
        'starfield': {
            ping: 'bg-amber-400',
            dot: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
            text: 'text-amber-400',
            scanner: 'text-amber-500/50',
            bar: 'bg-amber-500/50'
        },
    };

    const colors = themeColors[theme] || themeColors['dark-void'];

    const t = lang?.liveEvents || {};
    const countries = t.countries || {};
    const waitingText = lang?.liveWaiting || "Waiting Together";

    // Dynamic Events based on translations
    const eventDefinitions = useMemo(() => [
        { code: "br", type: "locked" },
        { code: "fr", type: "joined" },
        { code: "jp", type: "waiting" },
        { code: "us", type: "locked" },
        { code: "de", type: "entered" },
        { code: "it", type: "locked" }
    ], []);

    // Helper to format event
    const formatEvent = (code: string, type: string) => {
        const countryName = countries[code] || code.toUpperCase();
        const template = t[type] || `Someone from ${countryName} ${type}`;
        return template.replace("{country}", countryName);
    };

    // Initialize avatars with high-quality realistic images
    useEffect(() => {
        // Use a fixed seed-like approach or just Unsplash Source for realism
        const seeds = [100, 200, 300];
        setAvatars(seeds.map(s => `https://images.unsplash.com/photo-${s}?auto=format&fit=crop&w=64&h=64&q=80`));
        // Actually lets use specific IDs that look like people to avoid 404s
        setAvatars([
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64"
        ]);
    }, []);

    // Simulate Live Activity - Smoother but Wider Oscillation
    useEffect(() => {
        // Simular "Tendencia" para que no salte aleatoriamente, sino que tenga olas
        let trend = Math.random() > 0.5 ? 1 : -1;

        const interval = setInterval(() => {
            setCount(prev => {
                // Change direction randomly sometimes
                if (Math.random() > 0.8) trend *= -1;

                // Variación normal: entre 5 y 25 personas entran/salen
                // Trend factor: empuja hacia arriba o abajo
                const change = Math.floor(Math.random() * 20) + (trend * Math.floor(Math.random() * 35));

                let next = prev + change;

                // Si se acerca a los límites, forzar cambio de tendencia
                if (next > 15500) trend = -1;
                if (next < 2500) trend = 1;

                // Keep it within wider credibility range
                return Math.max(2100, Math.min(15900, next));
            });

            // Randomly trigger an "event" less frequently
            if (Math.random() > 0.8) {
                const def = eventDefinitions[Math.floor(Math.random() * eventDefinitions.length)];

                setCurrentEvent({
                    code: def.code,
                    text: formatEvent(def.code, def.type)
                });

                // Update one avatar with a new random Unsplash portrait
                // Using random sig to force new image fetch
                const randomId = Math.floor(Math.random() * 1000);
                setAvatars(prev => {
                    const newAvatars = [...prev];
                    newAvatars.pop(); // Remove last
                    // Fallback to randomuser.me for high availability diversity or stick to unsplash keywords
                    newAvatars.unshift(`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 99)}.jpg`);
                    return newAvatars;
                });

                // Clear event after 5 seconds for better readability
                setTimeout(() => setCurrentEvent(null), 5000);
            }
        }, 3000); // Faster tick for smoother feeling, but smaller changes

        return () => clearInterval(interval);
    }, [eventDefinitions, t, countries]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={cn(
                "flex flex-row items-center justify-between gap-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl mx-auto mb-8 hover:bg-white/10 transition-colors cursor-default group overflow-hidden",
                // Responsive Sizing & Alignment
                "px-4 py-3 sm:px-5 sm:py-3",
                "w-[90vw] sm:w-auto sm:min-w-[420px] max-w-4xl"
            )}
        >
            {/* Left: Status Dot */}
            <div className="flex items-center gap-3 shrink-0">
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0">
                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", colors.ping)}></span>
                    <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3", colors.dot)}></span>
                </span>
            </div>

            {/* Middle: Content Area (Dual Layout) */}
            <div className="relative h-6 flex-1 flex items-center overflow-hidden">
                {/* Mobile View: Swaps between Count and Event */}
                <div className="md:hidden w-full relative">
                    <AnimatePresence mode="wait">
                        {currentEvent ? (
                            <motion.span
                                key="event-mobile"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className={cn("text-xs sm:text-sm font-medium w-full flex items-center gap-2 truncate", colors.text)}
                            >
                                <img
                                    src={`https://flagcdn.com/w20/${currentEvent.code}.png`}
                                    srcSet={`https://flagcdn.com/w40/${currentEvent.code}.png 2x`}
                                    width="16"
                                    height="12"
                                    alt={currentEvent.code}
                                    className="rounded-[2px] object-cover shrink-0"
                                />
                                <span className="truncate">{currentEvent.text}</span>
                            </motion.span>
                        ) : (
                            <motion.span
                                key="count-mobile"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-xs sm:text-sm font-medium text-white/90 tracking-wide flex items-center gap-1.5"
                            >
                                <span className="tabular-nums font-mono font-bold">{count.toLocaleString()}</span>
                                <span className="opacity-70 truncate">{waitingText}</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop View: Shows Count AND Event side-by-side */}
                <div className="hidden md:flex items-center gap-4 w-full">
                    <span className="text-sm font-medium text-white/90 tracking-wide flex items-center gap-2 shrink-0">
                        <span className="tabular-nums font-mono font-bold text-base">{count.toLocaleString()}</span>
                        <span className="opacity-70">{waitingText}</span>
                    </span>

                    {/* Divider */}
                    <div className="h-4 w-px bg-white/10 shrink-0" />

                    {/* Event Ticker Area */}
                    <div className="relative min-w-[200px] flex-1 h-6 flex items-center">
                        <AnimatePresence mode="wait">
                            {currentEvent ? (
                                <motion.span
                                    key="event-desktop"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className={cn("text-sm font-medium flex items-center gap-2 truncate absolute inset-0", colors.text)}
                                >
                                    <img
                                        src={`https://flagcdn.com/w20/${currentEvent.code}.png`}
                                        srcSet={`https://flagcdn.com/w40/${currentEvent.code}.png 2x`}
                                        width="16"
                                        height="12"
                                        alt={currentEvent.code}
                                        className="rounded-[2px] object-cover shrink-0"
                                    />
                                    <span className="truncate">{currentEvent.text}</span>
                                </motion.span>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center pl-1"
                                >
                                    <span className={cn("text-xs sm:text-sm font-mono tracking-wider flex uppercase", colors.scanner)}>
                                        {(lang?.scanningGlobal || "Scanning global...").split("").map((char: string, i: number) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.05, delay: i * 0.05 }}
                                            >
                                                {char === " " ? "\u00A0" : char}
                                            </motion.span>
                                        ))}
                                    </span>
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className={cn("w-1.5 h-3 ml-1 block", colors.bar)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Right: Avatars */}
            <div className="flex items-center -space-x-2 sm:-space-x-3 pl-2 shrink-0">
                <AnimatePresence mode="popLayout">
                    {avatars.map((url, i) => (
                        <motion.div
                            key={url}
                            initial={{ scale: 0, opacity: 0, x: -10 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#0a0a0a] relative z-0 bg-neutral-800 shadow-md"
                        >
                            <img src={url} alt="User" className="w-full h-full rounded-full object-cover" />
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#0a0a0a] bg-neutral-800 flex items-center justify-center text-[10px] md:text-xs font-bold text-white relative z-10 shrink-0 shadow-md">
                    +2k
                </div>
            </div>
        </motion.div>
    );
}
