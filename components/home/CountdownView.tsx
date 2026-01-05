"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const Timer = dynamic(() => import("@/components/countdown/Timer").then(mod => mod.Timer), {
    ssr: false,
    loading: () => <div className="w-full h-[20vh] animate-pulse bg-white/5 rounded-3xl" />
});

interface CountdownViewProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lang: any;
    // Match prop names
    onOpenCapsule?: () => void;
    layout?: "classic" | "minimal" | "boxed" | "wide";
    targetYear?: number;
}

export function CountdownView({ lang, layout = "classic", targetYear = 2026, onOpenCapsule }: CountdownViewProps) {
    const formattedTitle = lang.yearBeginsIn ? lang.yearBeginsIn.replace("%s", targetYear.toString()) : `The Year ${targetYear} Begins In`;

    // Dynamic Phrase Logic
    const [phraseIndex, setPhraseIndex] = React.useState(0);
    const phrases = lang.dynamicPhrases || [lang.timeUntilFuture || "Time until the future."];

    React.useEffect(() => {
        if (!lang.dynamicPhrases || lang.dynamicPhrases.length === 0) return;
        const interval = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 8000); // Cycle every 8 seconds
        return () => clearInterval(interval);
    }, [lang.dynamicPhrases, phrases.length]);

    // Check if current phrase is potentially CJK for font adjustment (optional, or just rely on global)
    // Here we just use a fade animation key

    return (
        <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="flex flex-col items-center space-y-6 sm:space-y-10 pb-24 sm:pb-0"
        >


            {/* Title & Description */}
            <div className="text-center space-y-4 mt-32">
                <div className="flex items-center justify-center gap-3 text-primary/80">
                    <div className="h-px w-8 bg-current opacity-50" />
                    <h1 className="text-[14px] sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-primary text-glow whitespace-nowrap">
                        {formattedTitle}
                    </h1>
                    <div className="h-px w-8 bg-current opacity-50" />
                </div>
            </div>

            <Timer labels={lang} layout={layout} />

            {/* Bottom Phrase - Dynamic */}
            <div className="h-20 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={phraseIndex}
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                        transition={{ duration: 0.8 }}
                        className="font-display italic text-lg sm:text-xl md:text-2xl text-muted-foreground/80 text-glow-lg text-center px-4 max-w-3xl"
                    >
                        &quot;{phrases[phraseIndex]}&quot;
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Call to Action - In Flow */}
            {onOpenCapsule && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenCapsule}
                    className="mt-4 md:mt-6 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white font-medium text-xs uppercase tracking-[0.2em] transition-all group overflow-hidden relative z-30"
                >
                    <span className="relative z-10 group-hover:text-primary transition-colors">{lang.enterButton || "Open Time Capsule"}</span>
                    <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </motion.button>
            )}
        </motion.div>
    );
}
