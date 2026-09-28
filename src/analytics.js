import posthog from "posthog-js";

// PostHog is configured via build-time env vars. With no key, every call
// below is a silent no-op — the app never depends on analytics.
//   VITE_POSTHOG_KEY   public project key (phc_...)
//   VITE_POSTHOG_HOST  ingest host (defaults to US cloud)
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

let enabled = false;

export const initPostHog = () => {
    if (!POSTHOG_KEY) return;

    try {
        // No custom identify and no locally minted user ID — PostHog assigns
        // its own anonymous distinct_id. Nothing here can be tied back to a
        // person, their resume, or their contact details.
        posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
        });
        enabled = true;
    } catch (e) {
        console.error("PostHog init failed", e);
    }
};

/**
 * Fire an analytics event. Never pass resume content, personal details, or
 * anything identifying — only aggregate-safe properties (page counts, scores).
 */
export const trackEvent = (eventName, properties = {}) => {
    if (!enabled) return;
    try {
        posthog.capture(eventName, properties);
    } catch {
        /* analytics must never break the app */
    }
};

export const isAnalyticsEnabled = () => enabled;

export default posthog;
