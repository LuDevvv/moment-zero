import AppContainer from "@/components/app/AppContainer";
import translations from "@/lib/translations.json";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const lang = translations[locale as keyof typeof translations] || translations.en;
    return <AppContainer lang={lang} />;
}
