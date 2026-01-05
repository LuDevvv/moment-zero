import translations from "@/lib/translations.json";
import { notFound } from "next/navigation";
import { getDb } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
// Helper components
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { LivePresence } from "@/components/ui/LivePresence";

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

    // Privacy Check: If moment is private and not demo, show 404
    if (!momentData.isPublic && momentData.username !== 'demo') {
        return notFound();
    }

    // Custom Public View Layout
    return (
        <main className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-x-hidden">
            {/* Force specific background based on data */}
            <div className="fixed inset-0 -z-10">
                <BackgroundEffects forceTheme={momentData.theme as any} forceAtmosphere={momentData.atmosphere as any} mode="app" />
            </div>

            {/* Floating Live Presence - Top Center */}
            <div className="fixed top-4 sm:top-6 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
                <div className="pointer-events-auto">
                    <LivePresence lang={lang} />
                </div>
            </div>

            {/* Main Content Container - Centered Vertically */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 flex flex-col items-center gap-8 sm:gap-12 md:gap-16">

                {/* 1. IDENTITY HEADER */}
                <div className="flex flex-col items-center gap-3 sm:gap-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/50 font-medium">
                            {lang.capsuleSubtitleView || "Someone locked a wish for the future"}
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-brand-display font-bold text-white tracking-tight">
                        <span className="inline-block bg-clip-text text-transparent bg-linear-to-r from-white via-white/90 to-white/70 animate-in fade-in duration-1000 delay-200">
                            @{momentData.username}
                        </span>
                    </h1>
                </div>

                {/* 2. THE CAPSULE CARD - Center Stage with Premium Design */}
                <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <div className="group relative">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        {/* Main Card */}
                        <div className="relative bg-linear-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-4xl p-8 sm:p-10 md:p-14 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transform hover:scale-[1.02] transition-all duration-500">
                            {/* Decorative Corner Accents */}
                            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-white/20 rounded-tl-xl opacity-50"></div>
                            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-white/20 rounded-br-xl opacity-50"></div>

                            {/* Quote Icon */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-linear-to-br from-primary/30 to-accent/30 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                                </svg>
                            </div>

                            {/* Message Content */}
                            <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8">
                                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-brand-serif italic text-white/95 leading-relaxed text-center">
                                    "{momentData.message || (lang.capsuleLocked || "A secret locked in time.")}"
                                </p>

                                {/* Sealed Badge */}
                                <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-white/10 to-white/5 rounded-full border border-white/20 backdrop-blur-sm shadow-lg group-hover:shadow-xl group-hover:border-white/30 transition-all duration-500">
                                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs sm:text-sm uppercase tracking-[0.15em] font-bold text-white/80">
                                        {(lang.sealedUntil || "Sealed until %s").replace('%s', momentData.targetYear.toString())}
                                    </span>
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]"></span>
                                </div>
                            </div>

                            {/* Subtle Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent rounded-4xl pointer-events-none"></div>
                        </div>
                    </div>
                </div>

                {/* 3. CTA - Create Your Own */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <a
                        href={`/${locale}`}
                        className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-white text-black font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.7)] uppercase tracking-widest overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>

                        <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="relative z-10">{lang.landing?.ctaPrimary || "Create your Moment"}</span>
                        <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </main>
    );
}
