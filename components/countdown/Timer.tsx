"use client";

import React, { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimerProps {
    labels: { days: string; hours: string; minutes: string; seconds: string };
    layout?: "classic" | "minimal" | "boxed" | "wide";
    onComplete?: () => void;
}

export function Timer({ labels, layout = "classic", onComplete }: TimerProps) {
    const { timeLeft } = useCountdown(onComplete);

    if (!timeLeft) {
        // Return a consistent skeleton or spacer to prevent layout shift during hydration
        return <div className="h-[20vh] w-full" />;
    }

    // Layout Generators
    const isBoxed = layout === "boxed";
    const isMinimal = layout === "minimal";
    const isWide = layout === "wide";

    const containerClass = cn(
        "flex items-start justify-center select-none transition-all duration-700 ease-out",
        isWide ? "gap-1 sm:gap-6 lg:gap-10" : "gap-1 sm:gap-3 lg:gap-6",
        isMinimal ? "scale-75 opacity-90" : "",
        isBoxed ? "gap-2 sm:gap-4 lg:gap-8" : ""
    );

    return (
        <div className={containerClass}>
            <DigitGroup value={timeLeft.d} label={labels.days} layout={layout} />
            <Separator layout={layout} />
            <DigitGroup value={timeLeft.h} label={labels.hours} layout={layout} />
            <Separator layout={layout} />
            <DigitGroup value={timeLeft.m} label={labels.minutes} layout={layout} />

            {/* Seconds - Hidden on mobile (up to sm), visible on desktop */}
            <div className="hidden sm:flex self-center">
                <Separator layout={layout} />
            </div>
            <div className="hidden sm:flex">
                <DigitGroup value={timeLeft.s} label={labels.seconds} layout={layout} />
            </div>
        </div>
    );
}

function Separator({ layout }: { layout: string }) {
    if (layout === "boxed") return null;

    return (
        <div className="flex flex-col gap-2 sm:gap-4 self-center pb-[2vw] sm:pb-6 opacity-80">
            <motion.div
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full bg-primary shadow-[0_0_15px_var(--color-primary)]"
            />
            <motion.div
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                className="w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full bg-primary shadow-[0_0_15px_var(--color-primary)]"
            />
        </div>
    );
}

function DigitGroup({ value, label, layout }: { value: number; label: string; layout: string }) {
    const str = value.toString().padStart(2, "0");
    const chars = str.split("");
    const isBoxed = layout === "boxed";

    return (
        <div className={cn(
            "flex flex-col items-center transition-all duration-500",
            // Improved Boxed Style: Subtle Glass, no harsh borders
            isBoxed ? "bg-white/5 rounded-3xl p-3 sm:p-4 md:p-6 backdrop-blur-md shadow-2xl ring-1 ring-white/5" : ""
        )}>
            <div className={cn(
                "flex justify-center",
                isBoxed ? "space-x-1 sm:space-x-4" : "-space-x-1 sm:-space-x-2"
            )}>
                {chars.map((char, i) => (
                    <SplitDigit key={i} char={char} layout={layout} />
                ))}
            </div>
            {!isBoxed && (
                <span className="text-[0.6rem] sm:text-xs md:text-sm lg:text-base uppercase tracking-[0.4em] font-semibold text-muted-foreground/60 mt-0 sm:mt-2">
                    {label}
                </span>
            )}
            {isBoxed && (
                <span className="text-[0.5rem] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 mt-2">
                    {label}
                </span>
            )}
        </div>
    );
}

function SplitDigit({ char, layout }: { char: string; layout: string }) {
    const isBoxed = layout === "boxed";

    // Adjust sizes based on layout
    const widthClass = isBoxed
        ? "w-[9vw] sm:w-[8vw] md:w-[4rem] lg:w-[5rem] xl:w-[6rem]"
        : "w-[14vw] sm:w-[10vw] md:w-[5rem] lg:w-[6rem] xl:w-[8rem]";

    const textClass = isBoxed
        ? "text-[12vw] sm:text-[9vw] md:text-[5rem] lg:text-[6rem] xl:text-[8rem]"
        : "text-[18vw] sm:text-[13vw] md:text-[7rem] lg:text-[8rem] xl:text-[11rem]";

    return (
        <div className={cn(
            "timer-digit-wrapper relative h-[1em] flex justify-center items-center leading-none overflow-visible",
            widthClass,
            textClass
        )}>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={char}
                    initial={{ y: "60%", opacity: 0, filter: "blur(5px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-60%", opacity: 0, filter: "blur(5px)", position: "absolute" }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                        mass: 0.8
                    }}
                    className="font-display font-light text-foreground text-glow block text-center w-full will-change-transform"
                >
                    {char}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
