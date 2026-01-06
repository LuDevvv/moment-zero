"use client";

import { LandingPage } from "@/components/home/LandingPage";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export function LandingPageClient({ lang, locale }: { lang: any, locale: string }) {
    const router = useRouter();
    const [isExiting, setIsExiting] = useState(false);

    // Auto-redirect if user already has session
    useEffect(() => {
        const storedUser = localStorage.getItem('mz-username');
        if (storedUser) {
            router.push(`/${locale}/app`);
        }
    }, [locale, router]);

    const handleStart = () => {
        setIsExiting(true);
        setTimeout(() => {
            router.push(`/${locale}/onboarding`);
        }, 500);
    };

    return (
        <main className="relative w-full min-h-screen">
            {/* Language Switcher positioned specifically for Landing */}
            <LanguageSwitcher className="fixed top-6 right-6 z-[60]" />
            <Toaster position="top-center" richColors theme="dark" />

            <AnimatePresence>
                {!isExiting && (
                    <motion.div
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                    >
                        <LandingPage onStart={handleStart} lang={lang} />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
