"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Globe, Hourglass, Zap, Clock } from "lucide-react";
import { LivePresence } from "@/components/ui/LivePresence";
import { InteractiveHowItWorks } from "@/components/home/InteractiveHowItWorks";
import { cn } from "@/lib/utils";

interface LandingPageProps {
    onStart: () => void;
    lang: any;
}

const Background = () => (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020202]">
        {/* Very subtle static gradient blobs - zero animation cost */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-900/10 blur-[80px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-900/10 blur-[80px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
);

// Minimal animation variant - just a simple fade in
const simpleFade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" as const } }
};

export function LandingPage({ onStart, lang }: LandingPageProps) {
    const targetYear = new Date().getFullYear() + 1;
    const t = lang?.landing || {};

    const titleParts = [
        { text: t.heroTitlePart1 || "The ", highlight: false },
        { text: t.heroTitleHighlight || "moment", highlight: true },
        { text: t.heroTitlePart2 || " before everything changes.", highlight: false }
    ];

    return (
        <div className="w-full relative min-h-screen font-brand-body text-white selection:bg-indigo-500/30 overflow-x-hidden">
            <Background />

            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={simpleFade}
                    className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto gap-8"
                >
                    {/* Main Title - Static text for best performance */}
                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-brand-display font-medium tracking-tighter leading-none text-white">
                        {titleParts.map((part, i) => (
                            <span
                                key={i}
                                className={cn(
                                    part.highlight
                                        ? "italic font-brand-serif text-transparent bg-clip-text bg-linear-to-r from-blue-300 via-purple-300 to-indigo-300 pr-2"
                                        : "text-white/90"
                                )}
                            >
                                {part.text}
                            </span>
                        ))}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl md:text-2xl text-white/50 max-w-2xl font-light font-brand-serif italic selection:text-white">
                        {(t.heroSubtitle || "A shared countdown to the future.").replace('%s', targetYear.toString())}
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-6 mt-8 w-full justify-center items-center">
                        <button
                            onClick={onStart}
                            className="group relative px-10 py-4 rounded-full bg-white text-black font-semibold text-sm uppercase tracking-widest hover:scale-105 transition-transform duration-200 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]"
                        >
                            <span className="flex items-center gap-3">
                                {t.ctaPrimary || "Create your Moment"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 animate-pulse">
                    <div className="w-px h-12 bg-linear-to-b from-transparent via-white to-transparent" />
                </div>
            </section>

            {/* MANIFESTO SECTION */}
            <section className="relative w-full py-32 px-6 border-t border-white/5 bg-black/20 backdrop-blur-sm z-10">
                <div className="max-w-5xl mx-auto flex flex-col gap-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="text-xs font-brand-mono uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                {t.socialProofSubtitle || "The Concept"}
                            </div>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-brand-display font-medium leading-[1.1] text-white/90">
                                {t.manifestoTitle || "Not just a timer. A promise to yourself."}
                            </h3>
                        </div>
                        <div className="text-lg md:text-xl text-white/50 font-light leading-relaxed">
                            <p>{t.manifestoBody || "In a fast-paced digital world, we rarely stop to set an intention. Moment Zero reimagines the countdown as a sacred digital ritual."}</p>
                        </div>
                    </div>

                    {/* Stats Grid - Fully Localized & Dynamic */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                        {[
                            {
                                icon: Clock,
                                label: t.statSynced || "Synchronized",
                                value: t.statValueGlobalTime || "Global Time"
                            },
                            {
                                icon: Globe,
                                label: t.statWorldwide || "Worldwide",
                                value: t.statValueConnected || "Connected"
                            },
                            {
                                icon: Hourglass,
                                label: t.statSealed || "Sealed",
                                value: (t.statValueSealedUntil || "Until %s").replace('%s', (targetYear + 1).toString())
                            },
                        ].map((stat, i) => (
                            <div key={i} className="p-8 bg-[#0a0a0a] hover:bg-[#111] transition-colors flex flex-col items-center text-center gap-4 group">
                                <stat.icon className="w-6 h-6 text-white/30 group-hover:text-blue-400 transition-colors" />
                                <div className="text-sm font-brand-mono uppercase tracking-widest text-white/40">{stat.label}</div>
                                <div className="text-xl font-brand-display font-bold text-white/90">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTEGRATED: How It Works */}
            <div className="relative z-10 border-t border-white/5 bg-[#050505]">
                <InteractiveHowItWorks lang={lang} />
            </div>

            {/* FOOTER */}
            <section className="relative w-full py-40 px-6 z-10 flex flex-col items-center justify-center text-center border-t border-white/5 bg-black/40">
                <div className="relative z-10 max-w-2xl mx-auto space-y-12">
                    <LivePresence lang={lang} />

                    <h2 className="text-4xl md:text-6xl font-brand-display font-medium tracking-tight text-white/90">
                        {t.finalCtaTitle || "Your future deserves a moment."}
                    </h2>

                    <button
                        onClick={onStart}
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)]"
                    >
                        <Zap className="w-4 h-4 fill-current" />
                        {t.finalCtaButton || "Start my Moment"}
                    </button>

                    <footer className="pt-20 text-[10px] text-white/20 font-brand-mono flex flex-col gap-4 uppercase tracking-wider">
                        <p>© {new Date().getFullYear()} Moment Zero.</p>
                        <div className="flex justify-center gap-8">
                            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                            <span className="w-px h-3 bg-white/10" />
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        </div>
                    </footer>
                </div>
            </section>
        </div>
    );
}
