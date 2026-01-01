"use client";

import Link from "next/link";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import "./globals.css";
import { usePathname } from "next/navigation";
import translations from "@/lib/translations.json";

export default function NotFound() {
    const pathname = usePathname();
    const locale = pathname?.split("/")[1] || "en";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = (translations as any)[locale] || translations.en;

    return (
        <html lang={locale}>
            <body className="bg-[#050505] text-white antialiased overflow-hidden font-sans">
                <main className="relative w-full h-screen flex flex-col items-center justify-center p-4">
                    <BackgroundEffects />

                    <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="mb-8"
                        >
                            <h1 className="text-[12rem] sm:text-[15rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white/20 to-transparent select-none font-display">
                                404
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-white/90">
                                    {t.notFoundTitle}
                                </h2>
                                <p className="text-sm sm:text-base text-white/50 font-mono">
                                    {t.notFoundMessage}
                                </p>
                            </div>

                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all group hover:scale-105"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs uppercase tracking-[0.2em] font-medium">{t.returnHome}</span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Decorative footer */}
                    <div className="absolute bottom-8 text-xs text-white/20 tracking-[0.2em] font-mono">
                        MOMENT ZERO // SYSTEM ERROR
                    </div>
                </main>
            </body>
        </html>
    );
}
