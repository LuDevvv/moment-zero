"use client";

import { Globe, Palette, Sparkles, Lock } from "lucide-react";
import { useState, useEffect } from "react";

export function InteractiveHowItWorks() {
    const [activeColor, setActiveColor] = useState<string | null>(null);

    return (
        <section className="w-full px-4 py-24 md:py-32">
            <div className="max-w-7xl mx-auto flex flex-col gap-16">
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight">
                        Create your moment.
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl font-light">
                        Simple, beautiful tools to make 2026 arrive exactly how you want it.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {/* CARD 1: VIBE */}
                    <div className="group relative h-96 min-h-[420px] rounded-3xl bg-zinc-900/30 border border-white/5 overflow-hidden hover:border-white/10 transition-colors duration-500">
                        <div className={`absolute inset-0 transition-opacity duration-700 ${activeColor ? 'opacity-100' : 'opacity-0'}`}>
                            {activeColor === 'blue' && <div className="absolute inset-0 bg-blue-500/10 blur-3xl scale-150 translate-y-20" />}
                            {activeColor === 'orange' && <div className="absolute inset-0 bg-orange-500/10 blur-3xl scale-150 translate-y-20" />}
                            {activeColor === 'purple' && <div className="absolute inset-0 bg-purple-500/10 blur-3xl scale-150 translate-y-20" />}
                        </div>

                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:scale-105 transition-transform duration-500">
                                    <Palette strokeWidth={1.5} className="w-7 h-7" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-medium text-white">Choose your Vibe</h3>
                                    <p className="text-muted-foreground leading-relaxed font-light">Set the atmosphere. From calm voids to radiant auroras.</p>
                                </div>
                            </div>

                            <div className="mt-auto flex justify-center gap-6 py-6">
                                <button
                                    onMouseEnter={() => setActiveColor('blue')}
                                    onMouseLeave={() => setActiveColor(null)}
                                    className="w-12 h-12 rounded-full bg-linear-to-tr from-blue-600 to-cyan-400 shadow-lg ring-1 ring-white/20 hover:scale-110 transition-transform"
                                />
                                <button
                                    onMouseEnter={() => setActiveColor('purple')}
                                    onMouseLeave={() => setActiveColor(null)}
                                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-400 shadow-lg ring-1 ring-white/20 hover:scale-110 transition-transform"
                                />
                                <button
                                    onMouseEnter={() => setActiveColor('orange')}
                                    onMouseLeave={() => setActiveColor(null)}
                                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 shadow-lg ring-1 ring-white/20 hover:scale-110 transition-transform"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: INTENTION */}
                    <div className="group relative h-96 min-h-[420px] rounded-3xl bg-zinc-900/30 border border-white/5 overflow-hidden hover:border-white/10 transition-colors duration-500">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl scale-50 translate-y-20" />

                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:scale-105 transition-transform duration-500">
                                    <Sparkles strokeWidth={1.5} className="w-7 h-7" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-medium text-white">Set Your Intention</h3>
                                    <p className="text-muted-foreground leading-relaxed font-light">Lock a wish for the future. Sealed safely until the moment arrives.</p>
                                </div>
                            </div>

                            <div className="mt-auto relative h-24 flex items-center justify-center">
                                <div className="w-full bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                                    <TypingAnimation />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: SYNC */}
                    <div className="group relative h-96 min-h-[420px] rounded-3xl bg-zinc-900/30 border border-white/5 overflow-hidden hover:border-white/10 transition-colors duration-500">
                        <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl scale-50 translate-y-20" />

                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:scale-105 transition-transform duration-500">
                                    <Globe strokeWidth={1.5} className="w-7 h-7" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-medium text-white">Sync with the World</h3>
                                    <p className="text-muted-foreground leading-relaxed font-light">Join a living map of humanity. Thousands waiting together in real-time.</p>
                                </div>
                            </div>

                            <div className="mt-auto relative h-32 flex items-center justify-center">
                                <div className="relative">
                                    <Globe strokeWidth={0.5} className="w-32 h-32 text-white/10" />
                                    <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                                        <div className="absolute top-2 left-1/2 w-2 h-2 bg-pink-400 rounded-full shadow-[0_0_10px_currentColor]" />
                                    </div>
                                    <div className="absolute inset-0 bg-pink-500/10 rounded-full blur-2xl animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TypingAnimation() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 0) {
            timer = setTimeout(() => setStep(1), 2000);
        } else if (step === 1) {
            timer = setTimeout(() => setStep(2), 2000);
        } else if (step === 2) {
            timer = setTimeout(() => setStep(0), 2000);
        }
        return () => clearTimeout(timer);
    }, [step]);

    if (step === 0) {
        return (
            <div className="flex items-center gap-1 text-white/90 text-sm font-light tracking-wide animate-fade-in">
                <span className="italic">"For a better 2026..."</span>
                <span className="w-px h-4 bg-primary animate-pulse" />
            </div>
        );
    }

    if (step === 1) {
        return (
            <div className="flex items-center gap-1 text-white/90 text-sm font-light tracking-wide opacity-0 blur-sm transition-all duration-1000">
                <span className="italic">"For a better 2026..."</span>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="flex flex-col items-center gap-2 text-emerald-400 animate-scale-in">
                <Lock className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-medium">Sealed</span>
            </div>
        );
    }
    return null;
}
