"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Lock, Sparkles, Send } from "lucide-react";

export function ProductDemo() {
    const [step, setStep] = useState(0);

    // Automation loop
    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 3);
        }, 4000); // 4 seconds per step
        return () => clearInterval(timer);
    }, []);

    const steps = [
        {
            label: "Choose a Vibe",
            theme: "bg-blue-900/20 border-blue-500/30",
            backdrop: "from-blue-500/10 to-transparent",
            content: (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="step1"
                    className="grid grid-cols-2 gap-3 w-full"
                >
                    <div className="h-20 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors flex items-center justify-center cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-blue-500/50 blur-md" />
                    </div>
                    <div className="h-20 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center relative">
                        <div className="w-6 h-6 rounded-full bg-purple-500/50 blur-md" />
                        <div className="absolute top-2 right-2 bg-primary text-[8px] px-2 py-0.5 rounded-full text-black font-bold">SELECTED</div>
                    </div>
                    <div className="h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/50 blur-md" />
                    </div>
                    <div className="h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-amber-500/50 blur-md" />
                    </div>
                </motion.div>
            )
        },
        {
            label: "Set Intention",
            theme: "bg-purple-900/20 border-purple-500/30",
            backdrop: "from-purple-500/10 to-transparent",
            content: (
                <motion.div
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 w-full"
                >
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">Writing...</p>
                    <div className="text-xl md:text-2xl font-display text-white text-center">
                        <TypingText text="Make 2026 count." />
                    </div>
                    <div className="w-full h-0.5 bg-white/20 rounded-full mt-2 relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-primary"
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                        />
                    </div>
                </motion.div>
            )
        },
        {
            label: "Lock Moment",
            theme: "bg-emerald-900/20 border-emerald-500/30",
            backdrop: "from-emerald-500/10 to-transparent",
            content: (
                <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center gap-4 py-4"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"
                    >
                        <Lock className="w-8 h-8" />
                    </motion.div>
                    <div className="text-center">
                        <h4 className="text-white font-medium">Moment Locked</h4>
                        <p className="text-xs text-white/50">Unlocks Jan 1, 2026</p>
                    </div>
                </motion.div>
            )
        }
    ];

    return (
        <div className="relative w-full max-w-md aspect-[4/5] md:aspect-square flex items-center justify-center p-6 sm:p-10">
            {/* Dynamic Backdrop */}
            <motion.div
                animate={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                className={`absolute inset-0 rounded-full blur-[80px] opacity-40 transition-colors duration-1000 ${steps[step].backdrop}`}
            />

            {/* Device Mockup */}
            <div className="relative w-full h-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden">
                {/* Header Mockup */}
                <div className="flex justify-between items-center mb-8 opacity-50">
                    <div className="w-12 h-1 rounded-full bg-white/20" />
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    </div>
                </div>

                {/* Main Interaction Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        {steps[step].content}
                    </AnimatePresence>
                </div>

                {/* Progress Indicators */}
                <div className="mt-8 flex gap-2 justify-center">
                    {steps.map((s, i) => (
                        <div
                            key={i}
                            onClick={() => setStep(i)}
                            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${step === i ? 'w-8 bg-white' : 'w-1.5 bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TypingText({ text }: { text: string }) {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        setDisplayed("");
        let i = 0;
        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i + 1));
            i++;
            if (i > text.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <span>{displayed}<span className="animate-pulse">|</span></span>
    );
}
