import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};

const locales = ["en", "es", "fr", "de", "it", "pt", "ja", "zh"];
const defaultLocale = "en";

// Patrones sospechosos comunes de ataques
const SUSPICIOUS_PATTERNS = [
    /wp-admin/i,
    /wordpress/i,
    /wp-content/i,
    /wp-includes/i,
    /\.env/i,
    /\.git/i,
    /config\.php/i,
    /setup-config/i,
    /phpmyadmin/i,
    /admin\.php/i,
    /xmlrpc\.php/i,
    /\.sql/i,
    /\.bak/i,
    /\.old/i,
    /backup/i,
];

// Rutas permitidas que podrían coincidir con patrones sospechosos
const ALLOWED_PATHS = [
    '/robots.txt',
    '/sitemap.xml',
];

function isSuspiciousRequest(pathname: string): boolean {
    // Permitir rutas específicas
    if (ALLOWED_PATHS.includes(pathname)) {
        return false;
    }

    // Verificar patrones sospechosos
    return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(pathname));
}

function addSecurityHeaders(response: NextResponse): NextResponse {
    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
    );

    // Strict Transport Security
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );

    // X-Frame-Options
    response.headers.set('X-Frame-Options', 'DENY');

    // X-Content-Type-Options
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer-Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions-Policy
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()'
    );

    // X-XSS-Protection (legacy, pero aún útil)
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
}

export default function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // 1. BLOQUEAR PETICIONES SOSPECHOSAS
    if (isSuspiciousRequest(pathname)) {
        console.warn(`[SECURITY] Blocked suspicious request: ${pathname}`);

        // Retornar 403 Forbidden
        return new NextResponse('Forbidden', {
            status: 403,
            headers: {
                'Content-Type': 'text/plain',
            }
        });
    }

    // 2. VERIFICAR LOCALE
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const acceptLanguage = request.headers.get("accept-language") || "";
        const detectedLocale = locales.find(l => acceptLanguage.includes(l)) || defaultLocale;

        const response = NextResponse.redirect(
            new URL(`/${detectedLocale}${pathname}`, request.url)
        );

        // Agregar headers de seguridad
        return addSecurityHeaders(response);
    }

    // 3. AGREGAR HEADERS DE SEGURIDAD A TODAS LAS RESPUESTAS
    const response = NextResponse.next();
    return addSecurityHeaders(response);
}
