import { motion } from "framer-motion";
import { LivePresence } from "@/components/ui/LivePresence";
import dynamic from 'next/dynamic';

const Timer = dynamic(() => import("@/components/countdown/Timer").then(mod => mod.Timer), {
    ssr: false,
    loading: () => <div className="w-full h-[20vh] animate-pulse bg-white/5 rounded-3xl" />
});

interface CountdownViewProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lang: any;
    layout: "classic" | "minimal" | "boxed" | "wide";
    targetYear: number;
    onToggleView: () => void;
}

export function CountdownView({ lang, layout, targetYear, onToggleView }: CountdownViewProps) {
    const formattedTitle = lang.yearBeginsIn ? lang.yearBeginsIn.replace("%s", targetYear.toString()) : `The Year ${targetYear} Begins In`;

    return (
        <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="flex flex-col items-center space-y-8 sm:space-y-12 pb-24 sm:pb-0"
        >


            {/* Title & Description */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 text-primary/80">
                    <div className="h-px w-8 bg-current opacity-50" />
                    <h1 className="text-[14px] sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-primary text-glow whitespace-nowrap">
                        {formattedTitle}
                    </h1>
                    <div className="h-px w-8 bg-current opacity-50" />
                </div>
            </div>

            <Timer labels={lang} layout={layout} />

            {/* Bottom Phrase */}
            <p className="font-display italic text-xl sm:text-2xl text-muted-foreground/80 text-glow-lg text-center px-4">
                &quot;{lang.timeUntilFuture || "Time until the future."}&quot;
            </p>

            {/* Call to Action - In Flow */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleView}
                className="mt-8 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white font-medium text-xs uppercase tracking-[0.2em] transition-all group overflow-hidden relative z-30"
            >
                <span className="relative z-10 group-hover:text-primary transition-colors">{lang.enterButton || "Open Time Capsule"}</span>
                <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
        </motion.div>
    );
}
