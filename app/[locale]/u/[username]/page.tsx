import translations from "@/lib/translations.json";
import { notFound } from "next/navigation";
import { getDb } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
// Helper components
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { LivePresence } from "@/components/ui/LivePresence";
import { CountdownView } from "@/components/home/CountdownView";

async function getMomentData(username: string) {
    if (username === "demo") {
        return {
            username: "demo",
            theme: "aurora",
            atmosphere: "aurora",
            typography: "serif",
            targetYear: new Date().getFullYear() + 1,
            message: "Ready for the future!",
            isPublic: true
        };
    }

    try {
        const db = await getDb();
        const user = await db.query.users.findFirst({
            where: eq(users.username, username),
            with: {
                moments: {
                    limit: 1
                }
            }
        });

        if (!user) return null;

        const moment = user.moments[0];

        return {
            username: user.username,
            theme: moment?.theme || "dark-void",
            atmosphere: moment?.atmosphere || "void",
            typography: moment?.typography || "serif",
            targetYear: moment?.targetYear || 2026,
            message: moment?.message || "",
            isPublic: moment?.isPublic ?? true
        };
    } catch (error) {
        console.error("Database connection failed", error);
        return null;
    }
}

export default async function UserMomentPage({ params }: { params: Promise<{ locale: string, username: string }> }) {
    const { locale, username } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lang = (translations as Record<string, any>)[locale] || (translations as Record<string, any>)["en"];

    const momentData = await getMomentData(username);

    if (!momentData) {
        return notFound();
    }

    // Custom Public View Layout
    return (
        <main className="relative w-full min-h-screen flex flex-col items-center py-24 overflow-x-hidden">
            {/* Force specific background based on data */}
            <div className="fixed inset-0 -z-10">
                <BackgroundEffects forceTheme={momentData.theme as any} forceAtmosphere={momentData.atmosphere as any} mode="app" />
            </div>

            {/* Header: Presence (Centered) */}
            <div className="fixed top-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    <LivePresence lang={lang} />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto p-6 flex flex-col items-center gap-8 text-center mt-20 md:mt-12">
                {/* 1. Identity Header */}
                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm md:text-base uppercase tracking-[0.3em] text-white/50 font-medium">
                        {lang.capsuleSubtitleView || "Someone locked a wish for the future"}
                    </p>
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight text-glow">
                        @{momentData.username}
                    </h1>
                </div>

                {/* CTA: Create Your Own (In-Flow) */}
                <a
                    href="/en"
                    className="px-8 py-3 rounded-full bg-white text-black font-bold text-xs md:text-sm hover:scale-105 transition-transform shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] uppercase tracking-widest flex items-center gap-2"
                >
                    <span className="relative z-10">{lang.landing?.ctaPrimary || "Create your Moment"}</span>
                </a>

                {/* 2. The Capsule (Center Stage) */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-14 rounded-3xl max-w-2xl w-full shadow-2xl transform hover:scale-[1.01] transition-transform duration-500 group">
                    <p className="text-2xl md:text-4xl font-serif italic text-white/90 leading-relaxed">
                        "{momentData.message || (lang.capsuleLocked || "A secret locked in time.")}"
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="px-5 py-2.5 bg-white/10 rounded-full border border-white/5 flex items-center gap-3 text-xs uppercase tracking-widest text-white/60 group-hover:bg-white/15 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_var(--color-amber-500)]" />
                            {lang.sealButton?.split(' ')[0] || "Sealed"} until {momentData.targetYear}
                        </div>
                    </div>
                </div>

                {/* 3. The Countdown (Bottom) */}
                <div className="scale-75 md:scale-90 opacity-70 hover:opacity-100 transition-opacity pb-20">
                    <CountdownView lang={lang} targetYear={momentData.targetYear} layout="minimal" />
                </div>
            </div>
        </main>
    );
}
