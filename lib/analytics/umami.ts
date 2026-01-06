
// Types for Umami global object
type UmamiTracker = {
    track: {
        (payload: Record<string, any>): void;
        (eventName: string, eventData?: Record<string, any>): void;
    };
};

declare global {
    interface Window {
        umami?: UmamiTracker;
    }
}

// Environment variables
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

/**
 * Core tracking function that safely calls window.umami
 * @param eventName - The name of the event to track
 * @param eventData - Optional payload for the event
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    if (typeof window === "undefined") return;

    if (window.umami) {
        try {
            window.umami.track(eventName, eventData);
        } catch (error) {
            console.warn("Umami tracking failed:", error);
        }
    } else if (process.env.NODE_ENV === "development") {
        console.log(`[Umami Dev] Event: ${eventName}`, eventData);
    }
};

/**
 * Helper to check if analytics is initialized
 */
export const isAnalyticsEnabled = () => {
    return typeof window !== "undefined" && !!window.umami;
};
