import { trackEvent } from "./umami";

// --- Types ---

type AuthMethod = "google" | "email";
type MomentType = "countdown" | "capsule" | "message";
type GoalType = "resolution" | "habit" | "project";
type Visibility = "public" | "private";
type ReminderData = { has_reminder: boolean };

// --- Auth Events ---

export const trackAuthSignup = (method: AuthMethod) => {
    trackEvent("auth_signup", { method, is_new_user: true });
};

export const trackAuthLogin = (method: AuthMethod) => {
    trackEvent("auth_login", { method, is_new_user: false });
};

export const trackAuthLogout = () => {
    trackEvent("auth_logout");
};

// --- Core Product Events ---

export const trackMomentCreated = (payload: { moment_type: MomentType; visibility: Visibility; has_reminder: boolean }) => {
    trackEvent("moment_created", payload);
};

export const trackMomentShared = (moment_type: MomentType) => {
    trackEvent("moment_shared", { moment_type });
};

export const trackMomentCompleted = (moment_type: MomentType) => {
    trackEvent("moment_completed", { moment_type });
};

export const trackGoalCreated = (payload: { goal_type: GoalType; has_reminder: boolean }) => {
    trackEvent("goal_created", payload);
};

export const trackGoalCompleted = (goal_type: GoalType) => {
    trackEvent("goal_completed", { goal_type });
};

// --- Engagement Events ---

export const trackCtaClicked = (cta_name: string, page?: string) => {
    trackEvent("cta_clicked", {
        cta_name,
        page: page || (typeof window !== 'undefined' ? window.location.pathname : undefined)
    });
};

export const trackFeatureUsed = (feature_name: string) => {
    trackEvent("feature_used", { feature_name });
};

export const trackOnboardingCompleted = (step?: number) => {
    trackEvent("onboarding_completed", { step });
};

// --- Error Events ---

export const trackClientError = (error_type: string, page?: string) => {
    trackEvent("client_error", {
        error_type,
        page: page || (typeof window !== 'undefined' ? window.location.pathname : undefined)
    });
};
