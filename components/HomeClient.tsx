"use client";
import { useEffect } from "react";
import { ThemePanel } from "@/components/ui/ThemePanel";
import { AmbientPlayer } from "@/components/ui/AmbientPlayer";
import { AnimatePresence } from "framer-motion";
import { LivePresence } from "@/components/ui/LivePresence";
// Removed useHomeState import
import { TimeCapsule } from "@/components/home/TimeCapsule";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { CountdownView } from "@/components/home/CountdownView";
import { useCountdown } from "@/hooks/useCountdown";
import { useAppStore } from "@/store/useAppStore";
import { useRouter, useParams } from "next/navigation";
import confetti from "canvas-confetti";

interface HomeProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lang: any;
    initialState?: {
        theme?: string;
        atmosphere?: string;
        typography?: string;
        message?: string;
        mode?: "view" | "edit";
        view?: "countdown" | "capsule";
        username?: string;
    };
}

export function HomeClient({ lang, initialState }: HomeProps) {
    const {
        view, setView,
        layout,
        wish, setWish,
        username, setUsername,
        isSending, setIsSending,
        theme, setTheme,
        atmosphere, setAtmosphere,
        typography, setTypography,
        resetForm,
        setMode,
        mode
    } = useAppStore();

    const router = useRouter();
    const params = useParams();

    // Hydrate store from props on mount if needed
    useEffect(() => {
        if (initialState) {
            if (initialState.theme) setTheme(initialState.theme);
            if (initialState.atmosphere) setAtmosphere(initialState.atmosphere);
            if (initialState.typography) setTypography(initialState.typography);
            if (initialState.message) setWish(initialState.message);
            if (initialState.username) setUsername(initialState.username);
            if (initialState.mode) setMode(initialState.mode);
            // Default view based on mode
            if (initialState.mode === 'view') setView('capsule');
        }
    }, [initialState, setTheme, setAtmosphere, setTypography, setWish, setUsername, setMode, setView]);

    // We need targetYear for the display
    const { targetYear, count, waitingText } = useCountdown();

    const handleSendWish = async () => {
        if (!wish.trim() || !username.trim()) return;
        setIsSending(true);

        try {
            const res = await fetch("/api/moments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim(),
                    theme,
                    atmosphere,
                    typography,
                    message: wish.trim(),
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create moment");
            }

            const data = await res.json();

            // Success confetti
            triggerConfetti();

            // Redirect to the new personalized page
            const locale = (params?.locale as string) || "en";
            router.push(`/${locale}/u/${data.username}`);
            setMode("view");

        } catch (error) {
            console.error(error);
            alert("Failed to save moment. Username might be taken!");
        } finally {
            setIsSending(false);
        }
    };

    const handleEditMoment = async () => {
        if (!wish.trim() || !username.trim()) return;
        setIsSending(true);
        try {
            const res = await fetch(`/api/moments/${username}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: wish.trim(),
                    theme,
                    atmosphere,
                    typography
                }),
            });
            if (!res.ok) throw new Error("Failed");
            triggerConfetti();
            setMode("view");
            // Refresh page or stay 
            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Update failed");
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteMoment = async () => {
        // Confirmation is handled in TimeCapsule UI now
        setIsSending(true);
        try {
            const res = await fetch(`/api/moments/${username}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");

            // Success: clear state and force navigate to root to avoid stale data
            resetForm();
            const locale = params?.locale || "en";
            window.location.href = `/${locale}`;
        } catch (e) {
            console.error(e);
            alert("Delete failed");
            setIsSending(false);
        }
    };

    const triggerConfetti = () => {
        const colors = ['#bb0000', '#ffffff'];
        confetti({
            particleCount: 80,
            spread: 100,
            origin: { y: 0.6 },
            colors: colors,
            shapes: ['circle', 'square', 'star'],
            ticks: 200,
            gravity: 0.8,
            scalar: 1.2,
            drift: 0,
        });
    };

    return (
        <main className="relative w-full h-full min-h-screen flex flex-col items-center justify-center overflow-hidden selection:bg-primary/30">
            <BackgroundEffects />


            {/* Header replaced by LivePresence */}
            <div className="absolute top-6 sm:top-10 w-full flex justify-center z-20 pointer-events-none">
                <div className="pointer-events-auto scale-90 sm:scale-100 origin-top">
                    <LivePresence lang={lang} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {view === "countdown" ? (
                        <CountdownView
                            lang={lang}
                            layout={layout as any}
                            targetYear={targetYear}
                            onToggleView={() => setView("capsule")}
                        />
                    ) : (
                        <TimeCapsule
                            wish={wish}
                            setWish={setWish}
                            username={username}
                            setUsername={setUsername}
                            isSending={isSending}
                            onSend={handleSendWish} // Create
                            onUpdate={handleEditMoment} // Update
                            onDelete={handleDeleteMoment} // Delete
                            onCancel={() => {
                                const isExisting = !!initialState?.username || (!!params?.username && !Array.isArray(params?.username));
                                if (mode === 'edit' && isExisting) {
                                    setMode("view");
                                } else {
                                    setView("countdown");
                                }
                            }}
                            onEdit={() => setMode("edit")}
                            placeholder={initialState?.message || lang.wishPlaceholder?.replace("%s", targetYear.toString())}
                            mode={mode} // Using store mode!

                            limitMessage={initialState?.mode === 'view' ? undefined : lang.limitMessage}
                            titleText={
                                mode === 'view'
                                    ? lang.capsuleTitle?.replace("%s", targetYear.toString())
                                    : lang.openCapsule?.replace("%s", targetYear.toString())
                            }
                            subtitleText={
                                mode === 'view'
                                    ? lang.capsuleSubtitleView?.replace("%s", targetYear.toString())
                                    : lang.capsuleSubtitleEdit?.replace("%s", targetYear.toString())
                            }
                            buttonText={lang.sendWish}
                            cancelText={mode === 'view' ? lang.returnToTimer : lang.cancel}
                            editMomentText={lang.editMoment}
                            updateMomentText={lang.updateMoment}
                            usernamePlaceholder={lang.usernamePlaceholder}
                            confirmDeleteText={lang.confirmDelete}
                            // Using params logic to make sure we know if we are on a permalink page
                            startInEditMode={!!initialState?.username || (!!params?.username && Array.isArray(params.username) ? false : !!params.username)}
                        />
                    )}
                </AnimatePresence>
            </div>

            <AmbientPlayer t={lang} />
            <ThemePanel t={lang} />
        </main >
    );
}
