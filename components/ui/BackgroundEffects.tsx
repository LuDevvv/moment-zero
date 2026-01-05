"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BackgroundEffectsProps {
    forceTheme?: string;
    forceAtmosphere?: string;
    mode?: 'landing' | 'app';
}

export function BackgroundEffects({ forceTheme, forceAtmosphere, mode = 'landing' }: BackgroundEffectsProps) {
    const store = useAppStore();
    const atmosphere = forceAtmosphere || store.atmosphere;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted && !forceAtmosphere) return null; // If forcing, render immediately (SSR hydration match)

    const gradients: Record<string, { bg: string, orb1: string, orb2: string }> = {
        'void': {
            bg: "bg-[#0f172a]", // Slate 900
            orb1: "rgba(99, 102, 241, 0.4)",
            orb2: "rgba(139, 92, 246, 0.4)"
        },
        'starfield': {
            bg: "bg-[#172554]", // Blue 950
            orb1: "rgba(37, 99, 235, 0.3)",
            orb2: "rgba(251, 191, 36, 0.2)"
        },
        'aurora': {
            bg: "bg-[#312e81]", // Indigo 900
            orb1: "rgba(45, 212, 191, 0.3)",
            orb2: "rgba(217, 70, 239, 0.3)"
        },
        'emerald': {
            bg: "bg-[#064e3b]", // Emerald 900
            orb1: "rgba(52, 211, 153, 0.3)",
            orb2: "rgba(163, 230, 53, 0.3)"
        },
        'sunset': {
            bg: "bg-[#7f1d1d]", // Red 900
            orb1: "rgba(249, 115, 22, 0.3)",
            orb2: "rgba(244, 63, 94, 0.3)"
        }
    };

    const current = gradients[atmosphere] || gradients['void'];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">
            {/* Base Background Layer */}
            <div
                className={`absolute inset-0 bg-black ${current.bg} transition-colors duration-1000`}
            />

            {/* Animated Orbs - ONLY Render in Landing Mode */}
            {mode === 'landing' && (
                <>
                    <motion.div
                        animate={{
                            opacity: 1,
                            scale: [1, 1.1, 1],
                            background: current.orb1
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px] mix-blend-screen transition-colors duration-1000`}
                    />

                    <motion.div
                        animate={{
                            opacity: 1,
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                            background: current.orb2
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className={`absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px] mix-blend-screen transition-colors duration-1000`}
                    />
                </>
            )}

            {/* Static Glow - ONLY Render in App Mode */}
            {mode === 'app' && (
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-80 transition-opacity duration-1000"
                >
                    {atmosphere === 'aurora' ? (
                        <>
                            {/* Aurora Style: Wide sweeping bands */}
                            <div
                                className="absolute top-0 w-[150vw] h-[60vh] blur-[120px] mix-blend-screen opacity-60"
                                style={{ background: `linear-gradient(to right, transparent, ${current.orb1}, transparent)` }}
                            />
                            <div
                                className="absolute bottom-0 w-[150vw] h-[60vh] blur-[120px] mix-blend-screen opacity-40"
                                style={{ background: `linear-gradient(to left, transparent, ${current.orb2}, transparent)` }}
                            />
                        </>
                    ) : atmosphere === 'sunset' ? (
                        <>
                            {/* Sunset Style: Horizon focus */}
                            <div
                                className="absolute bottom-[-10%] w-[120vw] h-[70vh] rounded-full blur-[130px] mix-blend-screen opacity-80"
                                style={{ background: current.orb1 }}
                            />
                            <div
                                className="absolute bottom-[30%] w-[80vw] h-[40vh] rounded-full blur-[100px] mix-blend-screen opacity-50"
                                style={{ background: current.orb2 }}
                            />
                        </>
                    ) : (
                        <>
                            {/* Standard Core Glow (Void, Starfield, Emerald) */}
                            <div
                                className="absolute w-[120vw] h-[120vw] sm:w-[90vw] sm:h-[90vw] rounded-full blur-[100px] mix-blend-screen transition-colors duration-1000"
                                style={{ background: `radial-gradient(circle, ${current.orb1} 0%, transparent 70%)` }}
                            />
                            <div
                                className="absolute w-screen h-[100vw] sm:w-[70vw] sm:h-[70vw] rounded-full blur-[120px] mix-blend-screen transition-colors duration-1000 translate-y-[10%]"
                                style={{ background: `radial-gradient(circle, ${current.orb2} 0%, transparent 70%)` }}
                            />
                        </>
                    )}
                </div>
            )}

            {/* Grain/Texture Overlay */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>
    );
}
