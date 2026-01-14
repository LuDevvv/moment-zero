
import translations from "@/lib/translations.json";
import { AppPageClient } from "@/components/app/AppPageClient";

export function generateStaticParams() {
    return Object.keys(translations).map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lang = (translations as Record<string, any>)[locale] || (translations as Record<string, any>)["en"];

    return <AppPageClient lang={lang} locale={locale} />;
}
