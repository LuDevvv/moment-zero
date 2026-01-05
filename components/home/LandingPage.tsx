"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LivePresence } from "@/components/ui/LivePresence";
import { InteractiveHowItWorks } from "@/components/home/InteractiveHowItWorks";

interface LandingPageProps {
    onStart: () => void;
    lang: any;
}

export function LandingPage({ onStart, lang }: LandingPageProps) {
    const targetYear = new Date().getFullYear() + 1;

    return (
        <div className="w-full relative flex flex-col items-center bg-slate-950">

            {/* HERO SECTION */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-4xl flex flex-col items-center gap-8 z-10"
                >
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-linear-to-b from-white via-white/90 to-white/50 tracking-tight leading-none pb-2">
                        {lang.landing?.heroTitlePart1 || "The "}
                        <span className="italic bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 font-serif pr-2">
                            {lang.landing?.heroTitleHighlight || "moment"}
                        </span>
                        {lang.landing?.heroTitlePart2 || " before everything changes."}
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground/80 max-w-2xl font-light leading-relaxed">
                        {(lang.landing?.heroSubtitle || "A shared countdown to the future — create your moment, set your intention, and step into %s with meaning.").replace('%s', targetYear.toString())}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStart}
                            className="bg-white text-black font-semibold text-lg px-10 py-4 rounded-full shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_-5px_rgba(255,255,255,0.6)] transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            {lang.landing?.ctaPrimary || "Create your Moment"}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </motion.div>
            </section>

            {/* INTERACTIVE HOW IT WORKS */}
            <InteractiveHowItWorks />


            {/* SOCIAL PROOF */}
            <section className="w-full px-6 py-20 flex flex-col items-center text-center gap-12 border-t border-white/5 bg-linear-to-b from-transparent to-primary/5">
                <h2 className="text-2xl sm:text-3xl font-display font-light text-white/90">
                    {(lang.landing?.socialProofTitle || "Thousands waiting together").replace('%s', targetYear.toString())}
                </h2>

                <div className="scale-100 sm:scale-110 my-8">
                    <LivePresence lang={lang} />
                </div>

                <p className="text-xs uppercase tracking-widest text-white/30 font-medium">
                    {lang.landing?.socialProofSubtitle || "People online now"}
                </p>
            </section>

        </div>
    );
}
