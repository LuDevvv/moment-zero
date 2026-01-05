"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
    { code: 'en', label: 'English', flag: 'us' },
    { code: 'es', label: 'Español', flag: 'es' },
    { code: 'fr', label: 'Français', flag: 'fr' },
    { code: 'de', label: 'Deutsch', flag: 'de' },
    { code: 'it', label: 'Italiano', flag: 'it' },
    { code: 'pt', label: 'Português', flag: 'pt' },
    { code: 'ja', label: '日本語', flag: 'jp' },
    { code: 'zh', label: '中文', flag: 'cn' },
];

export function LanguageSwitcher({ className }: { className?: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Get current locale from URL (assumes /locale/...)
    const currentLocale = pathname?.split('/')[1] || 'en';
    const activeLang = languages.find(l => l.code === currentLocale) || languages[0];

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const switchLanguage = (code: string) => {
        if (!pathname) return;
        const segments = pathname.split('/');
        segments[1] = code; // Replace locale
        const newPath = segments.join('/');
        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className={cn("relative z-50 font-sans", className)} ref={containerRef}>
            <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-full transition-all duration-300 group",
                    isOpen ? "bg-white/10 border-white/20" : "bg-black/20 hover:bg-black/40 border-white/5 hover:border-white/10",
                    "backdrop-blur-xl border shadow-lg"
                )}
            >
                <div className="relative overflow-hidden w-5 h-3.5 rounded-[2px] shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                    <img
                        src={`https://flagcdn.com/w20/${activeLang.flag}.png`}
                        srcSet={`https://flagcdn.com/w40/${activeLang.flag}.png 2x`}
                        alt={activeLang.label}
                        className="w-full h-full object-cover"
                    />
                </div>

                <span className="text-xs font-medium text-white/80 uppercase tracking-widest group-hover:text-white transition-colors">
                    {activeLang.code}
                </span>

                <ChevronDown
                    className={cn(
                        "w-3 h-3 text-white/40 transition-transform duration-300",
                        isOpen ? "rotate-180 text-white/80" : "group-hover:text-white/60"
                    )}
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-2 w-56 max-h-[60vh] overflow-y-auto overflow-x-hidden bg-[#050505]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent ring-1 ring-white/5 origin-top-right"
                    >
                        <div className="px-4 py-2.5 text-[10px] uppercase tracking-widest text-white/30 font-bold border-b border-white/5 mb-1 flex items-center gap-2">
                            <Globe className="w-3 h-3" />
                            <span>Select Region</span>
                        </div>

                        <div className="p-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => switchLanguage(lang.code)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative",
                                        currentLocale === lang.code
                                            ? "bg-white/10 text-white"
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <div className={cn(
                                        "relative w-5 h-3.5 rounded-[2px] overflow-hidden transition-all duration-300",
                                        currentLocale === lang.code ? "opacity-100 scale-105 shadow-md" : "opacity-60 grayscale-50 group-hover:opacity-100 group-hover:grayscale-0"
                                    )}>
                                        <img
                                            src={`https://flagcdn.com/w20/${lang.flag}.png`}
                                            width="20"
                                            height="14"
                                            alt={lang.code}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <span className="text-xs flex-1 font-medium tracking-wide">
                                        {lang.label}
                                    </span>

                                    {currentLocale === lang.code && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
