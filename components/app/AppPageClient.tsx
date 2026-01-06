"use client";

import { useEffect, useState } from "react";
import { CountdownView } from "@/components/home/CountdownView";
import { TimeCapsule } from "@/components/home/TimeCapsule";
import { useAppStore } from "@/store/useAppStore";
import { AnimatePresence, motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { updateMoment, saveMoment } from "@/lib/api";
import { LivePresence } from "@/components/ui/LivePresence";
import { AmbientPlayer } from "@/components/ui/AmbientPlayer";
import { ThemePanel } from "@/components/ui/ThemePanel";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function AppPageClient({ lang, locale }: { lang: any, locale: string }) {
    const [view, setView] = useState<'countdown' | 'capsule'>('countdown');
    const { theme, atmosphere, layout, typography, setTheme, setAtmosphere, setWish, wish } = useAppStore();

    const [username, setUsername] = useState("");
    const [isEditingCapsule, setIsEditingCapsule] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSavedToDatabase, setIsSavedToDatabase] = useState(false);
    const [isPublicMoment, setIsPublicMoment] = useState(false);

    const targetYear = new Date().getFullYear() + 1;

    // Load state on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("mz-username");
        const storedWish = localStorage.getItem("mz-wish");
        const storedTheme = localStorage.getItem("mz-theme");
        const storedAtmosphere = localStorage.getItem("mz-atmosphere");

        if (storedUser) {
            setUsername(storedUser);
            setIsSavedToDatabase(true);
            // In a real app we might fetch the user to check isPublic, 
            // but for now we'll assume private unless we know otherwise or just let the user toggle if we implemented that.
            // Actually, we can't easily know isPublic from localstorage unless we saved it.
            // Let's assume true for "copy link" visibility if they have a username, 
            // OR maybe query the API. For now, let's just default true for UX if they have a username.
            setIsPublicMoment(true);
        }
        if (storedWish) setWish(storedWish);
        if (storedTheme) setTheme(storedTheme);
        if (storedAtmosphere) setAtmosphere(storedAtmosphere);
    }, [setTheme, setAtmosphere, setWish]);

    const handleUpdate = async () => {
        if (!wish) return;
        setIsSending(true);
        const toastId = toast.loading(lang.updateMoment || "Updating your moment...");

        if (isSavedToDatabase && username) {
            try {
                await updateMoment({
                    username,
                    message: wish,
                    theme,
                    atmosphere,
                    typography,
                    targetYear
                });
                toast.success("Moment updated successfully", { id: toastId });
                localStorage.setItem("mz-wish", wish);
                localStorage.setItem("mz-theme", theme);
                setIsEditingCapsule(false);
            } catch (error: any) {
                console.error("Update failed:", error);
                toast.error(error.message || "Failed to update", { id: toastId });
                setIsEditingCapsule(false);
            } finally {
                setIsSending(false);
            }
        } else {
            localStorage.setItem("mz-wish", wish);
            localStorage.setItem("mz-theme", theme);
            toast.success("Moment updated locally", { id: toastId });
            setIsEditingCapsule(false);
            setIsSending(false);
        }
    };

    const handleSend = async () => {
        // Logic for specific "Save" button if used outside of onboarding
        // ... (Usually handled in onboarding, but kept for completeness if user enters App without onboarding via edit)
    };

    return (
        <main className="fixed inset-0 overflow-hidden w-full h-full flex flex-col">
            <Toaster position="top-center" richColors theme="dark" />

            {/* Language Switcher - Specific App Positioning (Lower down) */}
            <LanguageSwitcher className="fixed top-8 sm:top-10 right-6 z-[60]" />

            {/* Global Shell (Header & Footer) */}
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <div className="pointer-events-auto">
                    <LivePresence lang={lang} />
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    <AmbientPlayer t={lang.audio || lang} />
                    <ThemePanel t={lang} />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full relative z-10"
                >
                    {view === 'countdown' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center pt-32 pb-20 px-4">
                            <CountdownView
                                onOpenCapsule={() => setView('capsule')}
                                lang={lang}
                                layout={layout as any}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full min-h-dvh flex flex-col items-center justify-center pt-32 pb-24 px-4 overflow-y-auto custom-scrollbar">
                            <TimeCapsule
                                onBack={() => isEditingCapsule ? setIsEditingCapsule(false) : setView('countdown')}
                                wish={wish}
                                username={username}
                                setUsername={setUsername}
                                onCancel={() => isEditingCapsule ? setIsEditingCapsule(false) : setView('countdown')}
                                setWish={(val) => setWish(val)}
                                isSending={isSending}
                                onSend={handleSend}
                                onUpdate={handleUpdate}
                                onEdit={() => setIsEditingCapsule(true)}
                                mode={isEditingCapsule ? "edit" : "view"}
                                startInEditMode={isEditingCapsule}
                                placeholder={lang.capsulePlaceholder || "Write your intention..."}
                                buttonText={lang.onboarding?.sealButton || "Seal Intention"}
                                updateMomentText={lang.updateMoment || "Update Moment"}
                                editMomentText={lang.onboarding?.editButton || "Make Changes"}
                                titleText={lang.capsuleTitle || "Your Time Capsule"}
                                subtitleText={lang.capsuleSubtitle || "What do you want to tell your future self?"}
                                cancelText={isEditingCapsule ? "Cancel Edit" : (lang.returnToCountdown || "Return to Countdown")}
                                copyLinkText={lang.copyLink || "Copy Link"}
                                showCopyLink={isSavedToDatabase && !!username}
                                legalDisclaimerText={lang.legalDisclaimer}
                                termsText={lang.termsLink}
                                onCopyLink={(user) => {
                                    const url = `${window.location.origin}/${locale}/u/${user}`;
                                    navigator.clipboard.writeText(url);
                                    toast.success(lang.toastCopied || "Link copied");
                                }}
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
