import { HomeClient } from "@/components/HomeClient";
import translations from "@/lib/translations.json";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";

async function getMomentData(username: string) {
    // Fallback/Demo mode
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
        const user = await db.user.findUnique({
            where: { username },
            include: {
                moments: {
                    orderBy: { createdAt: "desc" },
                    take: 1
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

    // We pass the "initialState" to HomeClient to override defaults
    return (
        <HomeClient
            lang={lang}
            initialState={{
                theme: momentData.theme,
                atmosphere: momentData.atmosphere,
                // We might need to inject the message display in HomeClient
                message: momentData.message || "",
                username: momentData.username,
                mode: "view",
                view: "capsule"
            }}
        />
    );
}
