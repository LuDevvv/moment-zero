"use client";

import { useEffect, useState } from "react";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { CountdownView } from "@/components/home/CountdownView";
import { TimeCapsule } from "@/components/home/TimeCapsule";
import { useAppStore } from "@/store/useAppStore";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { saveMoment, updateMoment } from "@/lib/api";

export default function AppPage({ params, searchParams, lang, initialState, hasOnboarded: controlledHasOnboarded, onFinishOnboarding }: any) {
    // Local state for the app flow (separate from Landing)
    const [view, setView] = useState<'countdown' | 'capsule'>(initialState?.view || 'countdown');
    const { theme, atmosphere, layout, typography, setTheme, setAtmosphere, setTypography, setWish, wish } = useAppStore();

    // Check if user has completed onboarding (could be persisted or parameter based)
    const [userInfo, setUserInfo] = useState<any>(initialState ? { username: initialState.username } : null);

    // Dual state management: Controlled (via props) or Uncontrolled (internal)
    const [internalHasOnboarded, setInternalHasOnboarded] = useState(!!initialState);
    const hasOnboarded = controlledHasOnboarded !== undefined ? controlledHasOnboarded : internalHasOnboarded;

    const [isEditingCapsule, setIsEditingCapsule] = useState(false);
    const [username, setUsername] = useState(initialState?.username || "");
    const [isSending, setIsSending] = useState(false);
    const [isSavedToDatabase, setIsSavedToDatabase] = useState(!!initialState); // Track if moment is saved to DB

    const targetYear = new Date().getFullYear() + 1;

    useEffect(() => {
        if (initialState) {
            if (initialState.theme) setTheme(initialState.theme);
            if (initialState.atmosphere) setAtmosphere(initialState.atmosphere);
            if (initialState.message) setWish(initialState.message);
        } else {
            // Try to recover from local storage if no initial state (e.g. pure client nav)
            const storedUser = localStorage.getItem("mz-username");
            if (storedUser && !username) setUsername(storedUser);

            const storedWish = localStorage.getItem("mz-wish");
            if (storedWish && !wish) setWish(storedWish);
        }
    }, [initialState, setTheme, setAtmosphere, setWish, username, wish]);

    const handleUpdate = async () => {
        if (!wish) return;
        setIsSending(true);
        // Corrected translation path: updateMoment is at the root level, not inside onboarding
        const toastId = toast.loading(lang.updateMoment || "Updating your moment...");

        // If saved to database, update there; otherwise just update localStorage
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
                setIsEditingCapsule(false); // Return to View Mode
            } catch (error: any) {
                console.error("Update failed:", error);
                toast.error(error.message || "Failed to update", { id: toastId });
                // Fallback local update
                localStorage.setItem("mz-wish", wish);
                localStorage.setItem("mz-theme", theme);
                setIsEditingCapsule(false);
            } finally {
                setIsSending(false);
            }
        } else {
            // Local mode - just update localStorage
            localStorage.setItem("mz-wish", wish);
            localStorage.setItem("mz-theme", theme);
            localStorage.setItem("mz-atmosphere", atmosphere);
            localStorage.setItem("mz-typography", typography);
            toast.success("Moment updated locally", { id: toastId });
            setIsEditingCapsule(false);
            setIsSending(false);
        }
    };

    const handleSend = async () => {
        if (!username || !wish) return;
        setIsSending(true);
        const toastId = toast.loading("Sealing your moment...");

        try {
            await saveMoment({
                username,
                message: wish,
                theme,
                atmosphere,
                typography,
                targetYear
            });

            toast.success("Moment sealed forever", { id: toastId });
            console.log("Moment synced to cloud.");
            setIsSavedToDatabase(true); // Mark as saved to DB
        } catch (error: any) {
            if (error.isDuplicate) {
                toast.error("Username taken. Try another.", { id: toastId });
                setIsSending(false);
                return;
            }
            console.warn("Backend unavailable, saving locally:", error);
            // Fallback for demo
            localStorage.setItem("mz-wish", wish);
            localStorage.setItem("mz-theme", theme);
            toast.success("Saved locally (Offline Mode)", { id: toastId });
        } finally {
            setIsSending(false);
        }
    };

    const handleOnboardingComplete = async (data: any) => {
        setWish(data.intention);
        // If username was captured in onboarding (Phase 2 flow), auto-seal
        if (data.username) {
            setUsername(data.username);
            setUserInfo({ name: data.username });

            // Persist locally immediately
            localStorage.setItem("mz-username", data.username);

            // Auto-save since they clicked "Seal"
            const toastId = toast.loading("Sealing your capsule...");
            try {
                await saveMoment({
                    username: data.username,
                    message: data.intention,
                    theme,
                    atmosphere,
                    typography,
                    targetYear
                });
                toast.success("Capsule sealed anonymously", { id: toastId });
                setIsSavedToDatabase(true); // Mark as saved to DB immediately
                localStorage.setItem("mz-username", data.username);
                localStorage.setItem("mz-wish", data.intention);
                localStorage.setItem("mz-theme", theme);
            } catch (err) {
                console.warn("Auto-seal offline fallback", err);
                toast.success("Saved locally", { id: toastId, icon: "📂" });
                localStorage.setItem("mz-username", data.username);
                localStorage.setItem("mz-wish", data.intention);
            }
        }

        if (onFinishOnboarding) {
            onFinishOnboarding();
        } else {
            setInternalHasOnboarded(true);
        }

        setView('capsule');
    };




    const handleThemePreview = (themeId: string) => {
        setTheme(themeId);
        // Map atmosphere directly if it matches, otherwise default to "void" for dark-void
        if (['aurora', 'starfield', 'sunset', 'emerald'].includes(themeId)) {
            setAtmosphere(themeId);
        } else {
            setAtmosphere('void');
        }

        // Optional: Typography presets per theme flavor
        if (themeId === 'aurora') setTypography('sans');
        else if (themeId === 'sunset') setTypography('serif');
        else if (themeId === 'starfield') setTypography('epic');
        else setTypography('sans');
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10">

            <AnimatePresence mode="wait">
                {!hasOnboarded ? (
                    <motion.div
                        key="onboarding"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        className="w-full h-full flex items-center justify-center relative z-10"
                    >
                        <OnboardingFlow
                            onComplete={handleOnboardingComplete}
                            lang={lang}
                            onThemeSelect={handleThemePreview}
                            targetYear={targetYear}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="app-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full relative z-10"
                    >
                        {/* App Navigation / Controls could go here */}

                        {view === 'countdown' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                <CountdownView
                                    onOpenCapsule={() => setView('capsule')}
                                    lang={lang}
                                    layout={layout as any}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 overflow-y-auto custom-scrollbar">
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
                                    updateMomentText={lang.updateMoment || "Update Moment"} // Corrected path
                                    editMomentText={lang.onboarding?.editButton || "Make Changes"}
                                    titleText={lang.capsuleTitle || "Your Time Capsule"}
                                    subtitleText={lang.capsuleSubtitle || "What do you want to tell your future self?"}
                                    cancelText={isEditingCapsule ? "Cancel Edit" : (lang.returnToCountdown || "Return to Countdown")}
                                    copyLinkText={lang.copyLink || "Copy Link"}
                                    showCopyLink={isSavedToDatabase} // Only show if saved to database
                                    legalDisclaimerText={lang.legalDisclaimer}
                                    termsText={lang.termsLink}
                                    onCopyLink={(user) => {
                                        // Use dynamic locale from params instead of hardcoded 'en'
                                        const currentLocale = params?.locale || 'en';
                                        const url = `${window.location.origin}/${currentLocale}/u/${user}`;
                                        navigator.clipboard.writeText(url);

                                        // Standard Minimal Toast
                                        toast.success(lang.toastCopied || "Link copied", {
                                            duration: 2000,
                                        });
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
