import AppContainer from "@/components/app/AppContainer";
import translations from "@/lib/translations.json";

export default function Page({ params: { locale } }: { params: { locale: string } }) {
    const lang = translations[locale as keyof typeof translations] || translations.en;
    return <AppContainer lang={lang} />;
}
