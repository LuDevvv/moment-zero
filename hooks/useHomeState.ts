import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { useRouter, useParams } from "next/navigation";

interface HomeStateProps {
    initialTheme?: string;
    initialAtmosphere?: string;
    initialTypography?: string;
}

export function useHomeState({ initialTheme = "dark-void", initialAtmosphere = "void", initialTypography = "serif" }: HomeStateProps = {}) {
    const [view, setView] = useState<"countdown" | "capsule">("countdown");
    const [wish, setWish] = useState("");
    const [username, setUsername] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [layout, setLayout] = useState<"classic" | "minimal" | "boxed" | "wide">("classic");

    const router = useRouter();
    const params = useParams();

    // Lifted Theme State
    const [theme, setTheme] = useState(initialTheme);
    const [atmosphere, setAtmosphere] = useState(initialAtmosphere);
    const [typography, setTypography] = useState(initialTypography);

    const handleSendWish = useCallback(async () => {
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
                }), // targetYear defaults to next year in API
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create moment");
            }

            const data = await res.json();

            // Trigger success effect
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

            // Redirect to the new personalized page
            const locale = params?.locale || "en";
            router.push(`/${locale}/u/${data.username}`);

            // Reset fields
            setWish("");
            setUsername("");
            setView("countdown");

        } catch (error) {
            console.error(error);
            alert("Failed to save moment. Username might be taken!");
        } finally {
            setIsSending(false);
        }
    }, [wish, username, theme, atmosphere, typography, params, router]);

    return {
        view,
        setView,
        wish,
        setWish,
        username,
        setUsername,
        isSending,
        layout,
        setLayout,
        theme,
        setTheme,
        atmosphere,
        setAtmosphere,
        typography,
        setTypography,
        handleSendWish
    };
}
