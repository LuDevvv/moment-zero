"use client";

import { LandingPage } from "@/components/home/LandingPage";
import AppContainer from "@/components/app/AppContainer";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { LivePresence } from "@/components/ui/LivePresence";
import { AmbientPlayer } from "@/components/ui/AmbientPlayer";
import { ThemePanel } from "@/components/ui/ThemePanel";
import { Toaster } from "sonner";

export default function HomeClient({ lang, initialState }: { lang: any, initialState?: any }) {
    // If initialState is present (e.g. shared link), start in 'app' mode
    const [mode, setMode] = useState<'landing' | 'app'>(initialState ? 'app' : 'landing');
    const [hasOnboarded, setHasOnboarded] = useState(!!initialState);
    const { setTheme, setAtmosphere } = useAppStore();

    // Reset to defaults when on landing, unless we have initial state overrides
    useEffect(() => {
        // Check for returning user (Auto-Login Phase 1)
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('mz-username') : null;
        if (storedUser && mode === 'landing') {
            // Restore session
            setMode('app');
            setHasOnboarded(true);
        }
    }, [mode, initialState, setTheme, setAtmosphere]);

    return (
        <main className={`relative w-full flex flex-col items-center justify-start transition-all duration-500 ${mode === 'landing'
            ? 'min-h-screen'
            : 'h-dvh overflow-hidden fixed inset-0'
            }`}>
            {/* Persistent Background for seamless transition */}
            <BackgroundEffects mode={mode} />
            <Toaster position="top-center" richColors theme="dark" />

            <AnimatePresence>
                {mode === 'app' && hasOnboarded && (
                    <>
                        {/* Global Shell (Header & Footer) - Only in App Mode AND Onboarded */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
                        >
                            <div className="pointer-events-auto">
                                <LivePresence lang={lang} />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <AmbientPlayer t={lang.audio || lang} />
                            <ThemePanel t={lang} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {mode === 'landing' ? (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <LandingPage onStart={() => setMode('app')} lang={lang} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="app"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full"
                    >
                        <AppContainer
                            lang={lang}
                            initialState={initialState}
                            hasOnboarded={hasOnboarded}
                            onFinishOnboarding={() => setHasOnboarded(true)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
