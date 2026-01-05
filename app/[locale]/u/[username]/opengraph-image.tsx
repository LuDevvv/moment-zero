import { ImageResponse } from "next/og";
import { getDb } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

// Force Node.js runtime compat for some deps if needed, but Workers support D1
export const runtime = "nodejs"; // OpenNext usually handles this, or use 'edge'

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

// Theme mappings
const themeColors: Record<string, string> = {
    "dark-void": "#3B82F6", // Blue
    "aurora": "#A855F7",    // Purple
    "starfield": "#F59E0B", // Gold
    "emerald": "#10B981",   // Green
    "sunset": "#F43F5E",    // Red
};

const bgColors: Record<string, string> = {
    "dark-void": "#0B0F1A",
    "aurora": "#1e1b4b",
    "starfield": "#0f172a",
    "emerald": "#064e3b",
    "sunset": "#450a0a",
};

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    // Provide default data if DB fails or user not found
    let theme = "dark-void";
    let targetYear = new Date().getFullYear() + 1;
    let message = "Join the Countdown";

    try {
        const db = await getDb();
        const user = await db.query.users.findFirst({
            where: eq(users.username, username),
            with: { moments: true }
        });

        const moment = user?.moments[0];
        if (moment) {
            theme = moment.theme;
            targetYear = moment.targetYear;
            message = moment.message || message;
        }
    } catch (e) {
        console.error("OG Image DB Fetch Error:", e);
    }

    const accentColor = themeColors[theme] || themeColors["dark-void"];
    const bgColor = bgColors[theme] || bgColors["dark-void"];

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: bgColor,
                    color: "white",
                    fontFamily: "serif", // Basic font for now
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage: `linear-gradient(to bottom right, ${accentColor}, transparent)`,
                    }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{
                        height: "80px", width: "80px",
                        borderRadius: "50%",
                        border: `4px solid ${accentColor}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "32px", fontWeight: "bold"
                    }}>
                        {targetYear.toString().slice(2)}
                    </div>
                    <div style={{ fontSize: "48px", fontWeight: "bold", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Moment Zero
                    </div>
                </div>

                <div style={{
                    marginTop: "60px",
                    fontSize: "80px",
                    fontWeight: "bold",
                    textShadow: `0 0 30px ${accentColor}`,
                    textAlign: "center",
                    maxWidth: "900px"
                }}>
                    {username}
                </div>

                <div style={{ marginTop: "30px", fontSize: "32px", opacity: 0.8, fontStyle: "italic" }}>
                    "{message}"
                </div>

                <div style={{
                    position: "absolute",
                    bottom: "40px",
                    fontSize: "24px",
                    opacity: 0.5,
                    letterSpacing: "0.2em"
                }}>
                    MOMENTZERO.APP
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
