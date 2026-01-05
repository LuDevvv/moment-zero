import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, Space_Grotesk, Outfit, Cinzel, Syne } from "next/font/google";

import "@/app/globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
    variable: "--font-cormorant",
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

const cinzel = Cinzel({
    variable: "--font-cinzel",
    subsets: ["latin"],
});

const syne = Syne({
    variable: "--font-syne",
    subsets: ["latin"],
});

const dynamicYear = new Date().getFullYear() + 1;

export async function generateMetadata(): Promise<Metadata> {
    return {
        metadataBase: new URL("https://momentzero.app"),
        title: {
            default: `Moment Zero - The Global Countdown to ${dynamicYear}`,
            template: "%s | Moment Zero",
        },
        description: `Join the world in a synchronized digital experience. Customize your moment, lock your wish in a time capsule, and wait for the clock to strike zero on ${dynamicYear}.`,
        keywords: [`${dynamicYear} countdown`, "new year countdown", "digital time capsule", "viral event", "moment zero", "global timer", "online wish"],
        authors: [{ name: "Moment Zero Team" }],
        creator: "Moment Zero",
        publisher: "Moment Zero",
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        openGraph: {
            type: "website",
            locale: "en_US",
            url: "https://momentzero.app",
            title: `Moment Zero - The Global Countdown to ${dynamicYear}`,
            description: `A shared digital moment. Lock your wish for ${dynamicYear}.`,
            siteName: "Moment Zero",
            images: [
                {
                    url: "/og-global.jpg",
                    width: 1200,
                    height: 630,
                    alt: `Moment Zero ${dynamicYear} Countdown`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `Moment Zero - ${dynamicYear} Countdown`,
            description: "Join the global countdown. Lock your wish.",
            creator: "@momentzeroapp",
            images: ["/og-global.jpg"],
        },
        icons: {
            icon: [
                { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
                { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            ],
            apple: [
                { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
            ],
            shortcut: ["/favicon.ico"],
        },
        manifest: "/site.webmanifest",
        appleWebApp: {
            capable: true,
            statusBarStyle: "black-translucent",
            title: "Moment Zero",
        },
        alternates: {
            canonical: "https://momentzero.app",
            languages: {
                "en": "https://momentzero.app/en",
                "es": "https://momentzero.app/es",
                "fr": "https://momentzero.app/fr",
                "de": "https://momentzero.app/de",
                "ja": "https://momentzero.app/ja",
                "zh": "https://momentzero.app/zh",
                "ru": "https://momentzero.app/ru",
                "ar": "https://momentzero.app/ar",
            },
        },
    };
}

export const viewport: Viewport = {
    themeColor: "#050505",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const nextYear = new Date().getFullYear() + 1;

    return (
        <html lang={locale} className={`dark h-full ${inter.variable} ${cormorant.variable} ${spaceGrotesk.variable} ${outfit.variable} ${cinzel.variable} ${syne.variable}`} suppressHydrationWarning>
            <head>
                {/* Prevent Theme Flash Script */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function() {
                            try {
                                const theme = localStorage.getItem("mz-theme") || "dark-void";
                                const atmosphere = localStorage.getItem("mz-atmosphere") || "void";
                                const typography = localStorage.getItem("mz-typography") || "serif";
                                
                                const root = document.documentElement;
                                
                                // Apply Theme Class
                                const themes = { "aurora": "theme-aurora", "starfield": "theme-starfield", "emerald": "theme-emerald", "sunset": "theme-sunset" };
                                if (themes[theme]) root.classList.add(themes[theme]);
                                
                                // Apply Atmosphere
                                root.classList.add("atmosphere-" + atmosphere);
                                
                                // Apply Typography
                                root.classList.add("style-" + typography);
                            } catch (e) {}
                        })()`
                    }}
                />

                {/* JSON-LD Structure for Event */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Event",
                            "name": `Moment Zero - ${nextYear} Countdown`,
                            "startDate": `${nextYear - 1}-12-31T23:59:59Z`,
                            "endDate": `${nextYear}-01-01T00:00:00Z`,
                            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
                            "eventStatus": "https://schema.org/EventScheduled",
                            "location": {
                                "@type": "VirtualLocation",
                                "url": "https://momentzero.app"
                            },
                            "image": [
                                "https://momentzero.app/og-global.jpg"
                            ],
                            "description": `A global synchronized digital countdown event to welcome ${nextYear}. Create your time capsule.`,
                            "organizer": {
                                "@type": "Organization",
                                "name": "Moment Zero",
                                "url": "https://momentzero.app"
                            }
                        })
                    }}
                />
            </head>
            <body
                className="antialiased bg-background text-foreground transition-colors duration-300 min-h-screen"
            >
                {children}
            </body>
        </html>
    );
}
