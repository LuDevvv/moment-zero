"use client";

import { usePathname } from "next/navigation";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { useEffect, useState } from "react";

export function GlobalBackground() {
    const pathname = usePathname();
    const [mode, setMode] = useState<'landing' | 'app'>('landing');

    useEffect(() => {
        if (pathname?.includes('/app') || pathname?.includes('/u/')) {
            setMode('app');
        } else {
            setMode('landing');
        }
    }, [pathname]);

    return <BackgroundEffects mode={mode} />;
}
