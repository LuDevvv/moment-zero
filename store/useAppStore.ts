import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'countdown' | 'capsule';
export type AppMode = 'view' | 'edit';

interface AppState {
    // UI State
    view: ViewMode;
    mode: AppMode;
    isLoading: boolean;
    isSending: boolean;
    error: string | null;

    // Data State
    wish: string;
    username: string;

    // Theme State
    theme: string;
    atmosphere: string;
    typography: string;
    layout: string;

    // Actions
    setView: (view: ViewMode) => void;
    setMode: (mode: AppMode) => void;
    setWish: (wish: string) => void;
    setUsername: (username: string) => void;
    setTheme: (theme: string) => void;
    setAtmosphere: (atmosphere: string) => void;
    setTypography: (typography: string) => void;
    setLayout: (layout: string) => void;
    setError: (error: string | null) => void;
    setIsSending: (sending: boolean) => void;

    // Reset
    resetForm: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            view: 'countdown',
            mode: 'edit',
            isLoading: false,
            isSending: false,
            error: null,

            wish: '',
            username: '',

            theme: 'dark-void',
            atmosphere: 'void',
            typography: 'serif',
            layout: 'classic',

            setView: (view) => set({ view }),
            setMode: (mode) => set({ mode }),
            setWish: (wish) => set({ wish }),
            setUsername: (username) => set({ username }),
            setTheme: (theme) => set({ theme }),
            setAtmosphere: (atmosphere) => set({ atmosphere }),
            setTypography: (typography) => set({ typography }),
            setLayout: (layout) => set({ layout }),
            setError: (error) => set({ error }),
            setIsSending: (isSending) => set({ isSending }),

            resetForm: () => set({ wish: '', username: '', mode: 'edit' }),
        }),
        {
            name: 'moment-zero-storage',
            partialize: (state) => ({
                theme: state.theme,
                atmosphere: state.atmosphere,
                typography: state.typography,
                layout: state.layout,
                // We might want to persist username for convenience, but not wish for privacy?
                // For now, let's persist theme prefs.
            }),
        }
    )
);
