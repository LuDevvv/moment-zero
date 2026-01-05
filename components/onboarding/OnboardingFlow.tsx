"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Lock, Share2 } from "lucide-react";
import { Timer } from "@/components/countdown/Timer";

interface OnboardingFlowProps {
    onComplete: (data: { theme: string; intention: string; username?: string }) => void;
    lang: any;
    targetYear: number;
    onThemeSelect?: (themeId: string) => void;
}

export function OnboardingFlow({ onComplete, lang, targetYear, onThemeSelect }: OnboardingFlowProps) {
    const [step, setStep] = useState<"arrival" | "theme" | "intention" | "username" | "preview" | "final">("arrival");
    const [selectedTheme, setSelectedTheme] = useState("default"); // Map to your actual themes
    const [intention, setIntention] = useState("");
    const [username, setUsername] = useState(""); // Capturing username in onboarding

    const t = lang?.onboarding || {};
    const suggestions = t.suggestions || ["Find my peace", "Build something new", "Love fearlessly"];

    // Step 1: Arrival
    if (step === "arrival") {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-12"
            >
                <div className="relative group cursor-default">
                    <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                    <div className="relative z-10 scale-90 md:scale-100">
                        <Timer labels={lang} layout="minimal" />
                    </div>
                </div>

                <div className="space-y-6 max-w-2xl mx-auto z-10 px-4">
                    <h1 className="text-4xl md:text-6xl font-brand-display font-bold tracking-tight text-white leading-tight">
                        {t.title1 || "The clock is ticking."}
                    </h1>
                    <p className="text-xl md:text-2xl font-brand-serif italic text-white/50">
                        "{t.subtitle1 || "Your moment is approaching."}"
                    </p>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep("theme")}
                    className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                    <span className="text-sm uppercase tracking-[0.2em] font-medium">{t.enterCta || "Enter"}</span>
                    <Sparkles className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                </motion.button>
            </motion.div>
        );
    }

    // Step 2: Theme Selection (Premium UI)
    if (step === "theme") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto gap-12 pt-10 px-4"
            >
                <div className="space-y-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-brand-display font-bold">{t.themeTitle || "How does your future feel?"}</h2>
                    <p className="text-muted-foreground text-lg">{t.themeDesc || "Select an atmosphere to set the tone."}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
                    {[
                        {
                            id: 'dark-void',
                            name: lang?.themeData?.['dark-void']?.name || 'Void',
                            desc: lang?.themeData?.['dark-void']?.desc || 'Deep. Calm. Infinite.',
                            grad: 'from-zinc-800 to-zinc-950',
                            ring: 'ring-zinc-500'
                        },
                        {
                            id: 'sunset',
                            name: lang?.themeData?.['sunset']?.name || 'Sunset',
                            desc: lang?.themeData?.['sunset']?.desc || 'Warm. Passionate. Alive.',
                            grad: 'from-orange-900/40 to-red-900/40',
                            ring: 'ring-orange-500'
                        },
                        {
                            id: 'aurora',
                            name: lang?.themeData?.['aurora']?.name || 'Aurora',
                            desc: lang?.themeData?.['aurora']?.desc || 'Mystical. Serene. Flowing.',
                            grad: 'from-purple-900/40 to-indigo-900/40',
                            ring: 'ring-purple-500'
                        },
                        {
                            id: 'starfield',
                            name: lang?.themeData?.['starfield']?.name || 'Starfield',
                            desc: lang?.themeData?.['starfield']?.desc || 'Cosmic. Electric. Bright.',
                            grad: 'from-blue-900/40 to-indigo-900/40',
                            ring: 'ring-cyan-400'
                        },
                    ].map((theme) => (
                        <motion.button
                            key={theme.id}
                            whileHover={{ scale: 1.01, y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => {
                                setSelectedTheme(theme.id);
                                if (onThemeSelect) onThemeSelect(theme.id);
                            }}
                            className={`
                                relative p-6 h-48 md:p-8 md:h-52 rounded-3xl border flex flex-col justify-end text-left overflow-hidden transition-all duration-300
                                ${selectedTheme === theme.id
                                    ? `bg-white/10 border-white/40 ring-2 ${theme.ring} shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]`
                                    : 'bg-zinc-900/20 border-white/5 hover:border-white/20 hover:bg-zinc-900/40'}
                            `}
                        >
                            {/* Gradient Background Preview */}
                            <div className={`absolute inset-0 bg-linear-to-br ${theme.grad} opacity-50 transition-opacity duration-500 ${selectedTheme === theme.id ? 'opacity-80' : 'group-hover:opacity-70'}`} />

                            {/* Selection Indicator */}
                            <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-all ${selectedTheme === theme.id ? 'bg-white text-black scale-100' : 'bg-transparent text-transparent scale-90'}`}>
                                <Check className="w-4 h-4" />
                            </div>

                            <div className="relative z-10 space-y-2">
                                <h3 className="text-2xl font-bold tracking-tight">{theme.name}</h3>
                                <p className="text-sm text-white/60 font-medium">{theme.desc}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setStep("arrival")}
                        className="px-8 py-3 rounded-full text-white/50 hover:text-white transition-colors text-sm"
                    >
                        {t.backButton || "Back"}
                    </button>
                    <button
                        onClick={() => setStep("intention")}
                        className="bg-white text-black px-10 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                        {lang.landing?.ctaPrimary || "Continue"}
                    </button>
                </div>
            </motion.div>
        );
    }

    // Step 3: Intention
    if (step === "intention") {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-12 pt-10 text-center px-4"
            >
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-brand-display font-medium text-white/80">{t.intentionTitle || "Make it last."}</h2>
                    <p className="text-muted-foreground text-lg">{(t.intentionDesc || "What is your single most important hope for %s?").replace('%s', targetYear.toString())}</p>
                </div>

                <div className="w-full relative group">
                    <input
                        type="text"
                        autoFocus
                        value={intention}
                        onChange={(e) => setIntention(e.target.value)}
                        placeholder={t.intentionPlaceholder || "I will..."}
                        className="w-full bg-transparent border-none py-8 text-4xl md:text-7xl text-center focus:outline-none focus:ring-0 placeholder:text-white/5 font-brand-serif italic font-bold tracking-tight text-white transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && intention.length > 3 && setStep("preview")}
                    />
                    {/* Minimal decorative line that glows on focus */}
                    <div className="absolute bottom-4 left-1/4 right-1/4 h-px bg-white/10 group-focus-within:bg-white/50 group-focus-within:shadow-[0_0_20px_white] transition-all duration-500" />
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {suggestions.map((suggestion: string) => (
                        <button
                            key={suggestion}
                            onClick={() => setIntention(suggestion)}
                            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm text-white/40 hover:text-white transition-all"
                        >
                            "{suggestion}"
                        </button>
                    ))}
                </div>

                <div className="h-24 flex items-center justify-center gap-6 mt-8">
                    <button
                        onClick={() => setStep("theme")}
                        className="text-white/40 hover:text-white px-6 py-3 transition-colors text-sm uppercase tracking-widest font-medium"
                    >
                        {t.backButton || "Back"}
                    </button>

                    {intention.length > 2 && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => setStep("username")}
                            className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>{t.continueButton || "Next: Sign It"}</span>
                        </motion.button>
                    )}
                </div>
            </motion.div>
        );
    }

    // Step NEW: Username
    if (step === "username") {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-8 pt-10 text-center px-4"
            >
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-brand-display font-medium text-white/80">{t.usernameTitle || "Claim your Identity"}</h2>
                    <p className="text-muted-foreground text-lg">{t.usernameDesc || "Your capsule needs a guardian."}</p>
                </div>

                <div className="relative group w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/30 text-2xl font-display font-bold">@</div>
                    <input
                        type="text"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                        placeholder="username"
                        maxLength={20}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-12 pr-6 text-2xl md:text-4xl text-left focus:outline-none focus:ring-1 focus:ring-white/30 placeholder:text-white/10 font-brand-display font-bold tracking-tight text-white transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && username.length > 2 && setStep("preview")}
                    />
                </div>

                <div className="h-24 flex items-center justify-center gap-6 mt-4">
                    <button
                        onClick={() => setStep("intention")}
                        className="text-white/40 hover:text-white px-6 py-3 transition-colors text-sm uppercase tracking-widest font-medium"
                    >
                        {t.backButton || "Back"}
                    </button>

                    {username.length > 2 && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setStep("preview")}
                            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                        >
                            {t.reviewCapsule || "Review Capsule"}
                        </motion.button>
                    )}
                </div>
            </motion.div>
        );
    }

    // Step 4: Preview (The Ritual of Sealing)
    if (step === "preview") {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto py-12 px-4 relative"
            >
                <div className="text-center space-y-2 mb-8 z-10">
                    <h2 className="text-2xl font-brand-display font-medium text-white/80">{t.previewTitle || "Your Legacy Awaits"}</h2>
                    <p className="text-muted-foreground text-sm">{t.previewDesc || "This moment will be locked until 2027."}</p>
                </div>

                {/* The Capsule Card */}
                <motion.div
                    initial={{ scale: 0.9, y: 20, rotateX: 10 }}
                    animate={{ scale: 1, y: 0, rotateX: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="relative w-full max-w-2xl aspect-16/10 md:aspect-2/1 bg-black/40 backdrop-blur-xl rounded-4xl border border-white/10 shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center p-8 md:p-12 text-center group overflow-hidden mb-12"
                >
                    {/* Ambient Glow based on theme could go here */}
                    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-50" />
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 blur-[50px] rounded-full group-hover:bg-white/10 transition-colors duration-700" />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <Sparkles className="w-6 h-6 text-white/30" />
                        <h3 className="text-3xl md:text-5xl font-brand-bodydium text-white leading-tight italic">
                            "{intention}"
                        </h3>
                        <div className="flex items-center gap-3 mt-4 text-xs md:text-sm font-brand-mono tracking-[0.2em] text-white/40 uppercase">
                            <span>{targetYear}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span>@{username}</span>
                        </div>
                    </div>

                    {/* Security Stamp/Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>

                {/* Action Interface */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl z-20">
                    <button
                        onClick={() => onComplete({ theme: selectedTheme, intention, username })}
                        className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-left"
                    >
                        <div className="p-3 rounded-full bg-black/50 border border-white/10 group-hover:bg-white/20 transition-colors">
                            <Lock className="w-5 h-5 text-white/70" />
                        </div>
                        <div>
                            <div className="font-bold text-white text-sm tracking-wide mb-0.5">{t.sealPrivate || "Seal Privately"}</div>
                            <div className="text-xs text-white/40">Visible only to you</div>
                        </div>
                    </button>

                    <button
                        onClick={() => onComplete({ theme: selectedTheme, intention, username })}
                        className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white text-black hover:bg-white/90 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all text-left transform hover:scale-[1.02]"
                    >
                        <div className="p-3 rounded-full bg-black/5 border border-black/10 group-hover:bg-white transition-colors">
                            <Share2 className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <div className="font-bold text-black text-sm tracking-wide mb-0.5">{t.sealPublic || "Seal & Share"}</div>
                            <div className="text-xs text-black/60">Generate public link</div>
                        </div>
                    </button>
                </div>

                <button
                    onClick={() => setStep("intention")}
                    className="mt-8 text-white/30 hover:text-white text-xs uppercase tracking-widest transition-colors"
                >
                    {t.editButton || "Make Changes"}
                </button>
            </motion.div>
        );
    }

    return null;
}
