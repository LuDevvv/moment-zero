import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "es", "fr", "de", "it", "pt", "ja", "zh"];
const defaultLocale = "en";

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // Basic locale detection logic
        const acceptLanguage = request.headers.get("accept-language") || "";
        // Simple priority match
        const detectedLocale = locales.find(l => acceptLanguage.includes(l)) || defaultLocale;

        // In a real app, we might check x-vercel-ip-country for better geolocation defaults

        return NextResponse.redirect(
            new URL(`/${detectedLocale}${pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!_next|favicon.ico|api|.*\\..*).*)",
    ],
};
