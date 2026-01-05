"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { useParams } from "next/navigation";
import translations from "@/lib/translations.json";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    const params = useParams();
    const locale = (params?.locale as string) || "en";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = (translations as any)[locale] || translations.en;

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
            <BackgroundEffects />
            <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500"
                >
                    <AlertTriangle size={32} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                >
                    <h2 className="text-xl font-medium tracking-wide text-white/90">
                        {t.errorTitle}
                    </h2>
                    <p className="text-sm text-white/50">
                        {t.errorMessage}
                    </p>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all group hover:scale-105"
                >
                    <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-xs uppercase tracking-widest font-medium">{t.tryAgain}</span>
                </motion.button>
            </div>
        </div>
    );
}
