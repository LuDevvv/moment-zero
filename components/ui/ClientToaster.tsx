"use client";

import { Toaster } from "sonner";
import { useAppStore } from "@/store/useAppStore";

export function ClientToaster() {
    const { theme } = useAppStore();

    return (
        <Toaster
            position="top-center"
            theme="dark" // O dinámico si prefieres
            closeButton={false}
            // Personalización global de estilos si es necesario
            toastOptions={{
                className: "font-sans !bg-zinc-900 !border-white/10 !text-white",
            }}
        />
    );
}
