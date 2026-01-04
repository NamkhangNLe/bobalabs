import posthog from "posthog-js";

export const initPostHog = () => {
    // Generate unique ID once per browser
    let userId = localStorage.getItem("user_id");
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("user_id", userId);
    }

    try {
        posthog.init("phc_stARXvfQuqvWp3Hfgdqi2PdAlB1vbft6MtMoim5k4oh", {
            api_host: "https://app.posthog.com",
            loaded: (ph) => {
                ph.identify(userId);
            }
        });
    } catch (e) {
        console.error("PostHog init failed", e);
    }
};

export const trackEvent = (eventName, properties = {}) => {
    posthog.capture(eventName, properties);
};

export default posthog;
