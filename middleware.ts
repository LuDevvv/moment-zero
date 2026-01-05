import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};

const locales = ["en", "es", "fr", "de", "it", "pt", "ja", "zh"];
const defaultLocale = "en";

export default function middleware(request: NextRequest) {
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

        return NextResponse.redirect(
            new URL(`/${detectedLocale}${pathname}`, request.url)
        );
    }
}
