"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Palette, Type, Layout, Sparkles, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { useAppStore } from "@/store/useAppStore";

interface Translation {
    settings: string;
    theme: string;
    blur: string;
    glow: string;
    partyMode: string;
    share: string;
    accentToken: string;
    typographyStyle: string;
    atmosphere: string;
    saveConfig: string;
    atmosphereTitle?: string;
    timerLayout?: string;
    styleSerifItalic?: string;
    styleMinimalSans?: string;
    styleEpicSaga?: string;
    styleNeoDigital?: string;
    layoutClassic?: string;
    layoutMinimal?: string;
    layoutBoxed?: string;
    layoutWide?: string;
    atmVoidGlow?: string;
    atmStarfield?: string;
    atmAurora?: string;
    [key: string]: string | undefined; // Allow dynamic keys
}

interface ThemePanelProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: Translation;
}

const themes = [
    { id: "dark-void", color: "#3B82F6", label: "Dark Void", class: "" },
    { id: "aurora", color: "#A855F7", label: "Aurora", class: "theme-aurora" },
    { id: "starfield", color: "#F59E0B", label: "Starfield", class: "theme-starfield" },
    { id: "emerald", color: "#10B981", label: "Emerald", class: "theme-emerald" },
    { id: "sunset", color: "#F97316", label: "Sunset", class: "theme-sunset" },
];

export function ThemePanel({ t }: ThemePanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Zustand Store
    const activeTheme = useAppStore(state => state.theme);
    const setTheme = useAppStore(state => state.setTheme);
    const activeAtmosphere = useAppStore(state => state.atmosphere);
    const setAtmosphere = useAppStore(state => state.setAtmosphere);
    const activeTypography = useAppStore(state => state.typography);
    const setTypography = useAppStore(state => state.setTypography);
    const activeLayout = useAppStore(state => state.layout);
    const setLayout = useAppStore(state => state.setLayout);

    // Dynamic labels based on translation
    const typographies = [
        { id: "serif", label: t.styleSerifItalic || "Serif Italic" },
        { id: "sans", label: t.styleMinimalSans || "Minimal Sans" },
        { id: "epic", label: t.styleEpicSaga || "Epic Saga" },
        { id: "digital", label: t.styleNeoDigital || "Neo Digital" },
    ];

    const layouts = [
        { id: "classic", label: t.layoutClassic || "Classic" },
        { id: "minimal", label: t.layoutMinimal || "Minimal" },
        { id: "boxed", label: t.layoutBoxed || "Boxed" },
        { id: "wide", label: t.layoutWide || "Wide" },
    ];

    const atmospheresData = [
        { id: "void", label: t.atmVoidGlow || "Void & Glow" },
        { id: "starfield", label: t.atmStarfield || "Starfield" },
        { id: "aurora", label: t.atmAurora || "Aurora" },
        { id: "sunset", label: "Sunset" },
    ];

    const applyConfig = useCallback((themeId: string, atmId: string, typoId: string) => {
        const root = document.documentElement;

        // 1. Theme (Colors)
        root.classList.remove(...themes.map(t => t.class).filter(Boolean));
        const themeObj = themes.find(t => t.id === themeId);
        if (themeObj && themeObj.class) {
            root.classList.add(themeObj.class);
        }

        // 2. Atmosphere
        root.classList.remove("atmosphere-void", "atmosphere-starfield", "atmosphere-aurora");
        if (atmId) root.classList.add(`atmosphere-${atmId}`);

        // 3. Typography
        root.classList.remove("style-serif", "style-sans", "style-epic", "style-digital");
        if (typoId) root.classList.add(`style-${typoId}`);
    }, []);

    const handleSave = () => {
        localStorage.setItem("mz-theme", activeTheme);
        localStorage.setItem("mz-atmosphere", activeAtmosphere);
        localStorage.setItem("mz-typography", activeTypography);
        localStorage.setItem("mz-layout", activeLayout);

        applyConfig(activeTheme, activeAtmosphere, activeTypography);
        setIsOpen(false);
    };

    // Apply config whenever props change
    useEffect(() => {
        applyConfig(activeTheme, activeAtmosphere, activeTypography);
    }, [activeTheme, activeAtmosphere, activeTypography, applyConfig]);

    const [isPartyActive, setIsPartyActive] = useState(false);

    const triggerParty = () => {
        // "Surprise Box" logic - varying effects
        const colors = [themes.find(t => t.id === activeTheme)?.color || '#ffffff', '#ffffff'];

        const runStandard = () => {
            const end = Date.now() + 1000;
            (function frame() {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors,
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors,
                });
                if (Date.now() < end) requestAnimationFrame(frame);
            })();
        };

        const runSchoolPride = () => {
            const end = Date.now() + 1000;
            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });
                if (Date.now() < end) requestAnimationFrame(frame);
            })();
        };

        const runFireworks = () => {
            const duration = 2000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors });
            }, 250);
        };

        const runRealistic = () => {
            const count = 200;
            const defaults = {
                origin: { y: 0.7 }
            };

            function fire(particleRatio: number, opts: any) {
                confetti({
                    ...defaults,
                    ...opts,
                    particleCount: Math.floor(count * particleRatio),
                    colors
                });
            }

            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });
        };

        const runSnow = () => {
            const duration = 3000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 1,
                    startVelocity: 0,
                    ticks: 200,
                    origin: {
                        x: Math.random(),
                        // since particles fall down, skew start toward the top
                        y: (Math.random() * 0.1) - 0.2
                    },
                    colors: ['#ffffff'],
                    shapes: ['circle'],
                    gravity: 0.6,
                    scalar: 0.5,
                    drift: 0
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();
        };

        const runGalaxy = () => {
            const defaults = { spread: 360, ticks: 100, gravity: 0, decay: 0.94, startVelocity: 30, shapes: ['star'], colors: ['#FFED00', '#FF0000', '#00FFFF', '#ffffff'] };

            confetti({ ...defaults, particleCount: 40, scalar: 1.2, shapes: ['star'] });
            confetti({ ...defaults, particleCount: 10, scalar: 0.75, shapes: ['circle'] });
        };

        const effects = [runStandard, runSchoolPride, runFireworks, runRealistic, runSnow, runGalaxy];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];

        // Unlock button immediately or after short delay? Let's just run it. 
        // We track 'active' just for the icon glow maybe?
        setIsPartyActive(true);
        setTimeout(() => setIsPartyActive(false), 500); // Quick toggle for feedback

        randomEffect();
    };

    return (
        <>
            {/* Floating Action Buttons */}
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-50 flex gap-3">
                    <motion.button
                        layoutId="party-btn"
                        className="p-3 rounded-full glass-panel hover:bg-white/10 text-white shadow-lg shadow-primary/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={triggerParty}
                    >
                        <Zap size={20} className={isPartyActive ? "text-yellow-400 fill-yellow-400" : ""} />
                    </motion.button>

                    <motion.button
                        layoutId="settings-btn"
                        className="p-3 rounded-full glass-panel hover:bg-white/10 text-white shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                    >
                        <Settings size={20} />
                    </motion.button>
                </div>
            )}

            {/* Side Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-55 bg-black/20 backdrop-blur-[2px]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-80 sm:w-96 glass-panel border-l border-white/10 bg-[#050505]/80 backdrop-blur-xl z-60 flex flex-col shadow-2xl overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="p-6 pb-2 flex justify-between items-center border-b border-white/5">
                                <h2 className="font-display text-2xl italic tracking-wide text-white">{t.settings || "Personalize"}</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X size={20} className="opacity-50" />
                                </button>
                            </div>

                            <div className="flex-1 p-6 space-y-8">

                                {/* Accent Token */}
                                <div className="space-y-6">
                                    <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold block mb-4">{t.accentToken || "Accent Token"}</label>
                                    <div className="flex gap-4">
                                        {themes.map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => {
                                                    setTheme(theme.id);
                                                    // Auto-switch atmosphere for immersive themes
                                                    if (theme.id === "aurora") setAtmosphere("aurora");
                                                    if (theme.id === "starfield") setAtmosphere("starfield");
                                                    if (theme.id === "dark-void") setAtmosphere("void");
                                                    if (theme.id === "sunset") setAtmosphere("sunset");
                                                }}
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all relative ring-offset-2 ring-offset-[#050505]",
                                                    activeTheme === theme.id ? "ring-2 ring-white scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"
                                                )}
                                                style={{ backgroundColor: theme.color }}
                                                aria-label={theme.label}
                                            >
                                                {activeTheme === theme.id && <Check size={14} className="text-black/50" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Typography */}
                                <div className="space-y-4">
                                    <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{t.typographyStyle || "Typography Style"}</label>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl">
                                        {typographies.map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setTypography(type.id)}
                                                className={cn(
                                                    "py-3 px-2 rounded-lg text-xs font-medium transition-all",
                                                    activeTypography === type.id
                                                        ? "bg-white/10 text-white shadow-sm"
                                                        : "text-muted-foreground hover:text-white"
                                                )}
                                            >
                                                <span className={cn(
                                                    type.id === "serif" && "font-serif italic text-base",
                                                    type.id === "sans" && "font-sans",
                                                    type.id === "epic" && "font-cinzel",
                                                    type.id === "digital" && "font-syne uppercase"
                                                )}>
                                                    {type.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Timer Layout */}
                                <div className="space-y-4">
                                    <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{t.timerLayout || "Timer Layout"}</label>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl">
                                        {layouts.map((layout) => (
                                            <button
                                                key={layout.id}
                                                onClick={() => setLayout(layout.id)}
                                                className={cn(
                                                    "py-3 px-2 rounded-lg text-xs font-medium transition-all border border-transparent",
                                                    activeLayout === layout.id
                                                        ? "bg-white/10 text-white shadow-sm border-white/10"
                                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                {layout.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Atmosphere */}
                                <div className="space-y-4">
                                    <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{t.atmosphereTitle || "Atmosphere"}</label>
                                    <div className="space-y-2">
                                        {atmospheresData.map((atm) => (
                                            <button
                                                key={atm.id}
                                                onClick={() => setAtmosphere(atm.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-sm",
                                                    activeAtmosphere === atm.id
                                                        ? "bg-primary/10 border-primary/50 text-primary"
                                                        : "bg-transparent border-white/5 text-muted-foreground hover:bg-white/5"
                                                )}
                                            >
                                                <span>{atm.label}</span>
                                                {activeAtmosphere === atm.id && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_currentColor]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-white/10 space-y-3 bg-black/20">
                                <button
                                    onClick={handleSave}
                                    className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold tracking-wide text-sm shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all flex items-center justify-center gap-2"
                                >
                                    {t.saveConfig || "Save Configuration"}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
