"use client";

import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Toaster, toast } from "sonner";
import { saveMoment } from "@/lib/api";

export function OnboardingPageClient({ lang, locale }: { lang: any, locale: string }) {
    const router = useRouter();
    const { setTheme, setAtmosphere, setTypography, theme, atmosphere, typography } = useAppStore();
    const targetYear = new Date().getFullYear() + 1;

    const handleThemePreview = (themeId: string) => {
        setTheme(themeId);
        // Map atmosphere directly if it matches, otherwise default to "void"
        if (['aurora', 'starfield', 'sunset', 'emerald'].includes(themeId)) {
            setAtmosphere(themeId);
        } else {
            setAtmosphere('void');
        }

        // Optional: Typography presets
        if (themeId === 'aurora') setTypography('sans');
        else if (themeId === 'sunset') setTypography('serif');
        else if (themeId === 'starfield') setTypography('epic');
        else setTypography('sans');
    };

    const handleComplete = async (data: { theme: string; intention: string; username?: string; isPublic?: boolean }) => {
        // Persist locally immediately
        localStorage.setItem("mz-username", data.username || "");
        localStorage.setItem("mz-wish", data.intention);
        localStorage.setItem("mz-theme", data.theme);

        // If username exists, try to save to API
        if (data.username) {
            const toastId = toast.loading("Sealing your capsule...");
            try {
                await saveMoment({
                    username: data.username,
                    message: data.intention,
                    theme: theme, // Use stored theme/atmosphere from preview
                    atmosphere: atmosphere,
                    typography: typography,
                    targetYear: targetYear,
                    isPublic: data.isPublic
                });

                toast.success(data.isPublic ? "Capsule sealed & ready to share" : "Capsule sealed anonymously", { id: toastId });

                // Navigate to App after short delay
                setTimeout(() => {
                    router.push(`/${locale}/app`);
                }, 1000);

            } catch (err: any) {
                console.warn("Auto-seal offline fallback", err);
                toast.success("Saved locally", { id: toastId });
                // Still navigate
                setTimeout(() => {
                    router.push(`/${locale}/app`);
                }, 1000);
            }
        } else {
            router.push(`/${locale}/app`);
        }
    };

    return (
        <main className="relative w-full min-h-screen flex items-center justify-center">
            {/* Language Switcher for Onboarding - Standard Position */}
            <LanguageSwitcher className="fixed top-6 right-6 z-[60]" />
            <Toaster position="top-center" richColors theme="dark" />

            <OnboardingFlow
                lang={lang}
                targetYear={targetYear}
                onThemeSelect={handleThemePreview}
                onComplete={handleComplete}
            />
        </main>
    );
}
