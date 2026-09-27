/**
 * bulletGuide — deterministic resume-bullet guidance for the Boba Labs builder.
 *
 * Pure logic, no JSX. Source of truth: Namkhang's resume-formula post —
 * Harvard's action verbs + Wonsulting's XYZ formula. No AI in v1.
 */

/** Every nudge links the post that teaches the rule behind it. */
export const BLOG_URL = "https://namkhangnle.github.io/?post=resume-formula";

/**
 * The blog post's worst offenders, plus two close cousins.
 * "Responsible for" is the single worst opener: it describes a job
 * description, not an achievement.
 */
export const WEAK_OPENERS = [
    "responsible for",
    "helped with",
    "assisted in",
    "assisted with",
    "worked on",
    "tasked with",
    "in charge of",
];

/** Strong openers — Harvard's rule: every bullet starts with a strong verb. */
export const STRONG_VERBS = [
    "spearheaded", "built", "shipped", "reduced", "scaled", "led", "designed",
    "optimized", "launched", "engineered", "architected", "developed",
    "implemented", "created", "organized", "drove", "delivered", "improved",
    "increased", "decreased", "cut", "grew", "transformed", "revamped",
    "orchestrated", "streamlined", "accelerated", "automated", "pioneered",
    "overhauled", "boosted", "slashed", "doubled",
];

/** Fluff the number already proves — cut on sight. */
export const FLUFF_WORDS = [
    "very", "really", "various", "successfully", "significantly",
    "seamless", "seamlessly", "overall",
];

const VERB_EXAMPLES =
    "spearheaded, built, shipped, reduced, scaled, led, designed, optimized, launched";

/** First alphabetic word, ignoring leading quotes/parens. */
const firstWord = (text) => {
    const m = (text || "").trim().match(/^["'“‘'(\[]*([A-Za-z]+)/);
    return m ? m[1].toLowerCase() : "";
};

/**
 * Run Wendy's 7-second scan on one bullet.
 * Returns an array of nudges: [{ rule, message }]. Empty text → no nudges
 * (the empty-state prompt covers blank bullets). Never blocks, never scores.
 */
export const checkBullet = (text) => {
    const nudges = [];
    const t = (text || "").trim();
    if (!t) return nudges;

    // 1. Leading verb (Harvard's rule).
    const opener = WEAK_OPENERS.find((op) => new RegExp(`^${op}\\b`, "i").test(t));
    if (opener) {
        const pretty = opener.charAt(0).toUpperCase() + opener.slice(1);
        nudges.push({
            rule: "verb",
            message:
                opener === "responsible for"
                    ? `"${pretty}" is the classic trap — it describes the job, not what you did. Try starting with what YOU did instead: ${VERB_EXAMPLES}.`
                    : `"${pretty}" keeps you in the background of your own story. Start with what YOU did: ${VERB_EXAMPLES}.`,
        });
    } else if (!STRONG_VERBS.includes(firstWord(t))) {
        nudges.push({
            rule: "verb",
            message: `Open with a strong action verb so the first word does the heavy lifting — e.g. ${VERB_EXAMPLES}.`,
        });
    }

    // 2. Has a number (XYZ's Y: the proof).
    if (!/[\d%$×]/.test(t)) {
        nudges.push({
            rule: "number",
            message:
                "Where's the proof? Add a number — or estimate honestly / give the scale: people served, team size, hours.",
        });
    }

    // 3. Length band.
    if (t.length < 60) {
        nudges.push({ rule: "length", message: "A bit thin — what was the result?" });
    } else if (t.length > 280) {
        nudges.push({ rule: "length", message: "Long for one bullet — split it into two?" });
    }

    // 4. Zero fluff.
    const fluff = FLUFF_WORDS.find((w) => new RegExp(`\\b${w}\\b`, "i").test(t));
    if (fluff) {
        nudges.push({
            rule: "fluff",
            message: `Cut "${fluff}" — the number already proves it.`,
        });
    }

    return nudges;
};

/**
 * The XYZ formula as 4 questions, one at a time. Q1/Q2 adapt lightly per
 * section; Q3 is the scale fallback for kids with no hard numbers
 * ("estimate honestly, or quantify the scale").
 */
export const QUESTIONS = {
    experience: [
        {
            question: "What was your role?",
            tag: "X — the outcome",
            placeholder: "Ran my troop's annual food drive",
        },
        {
            question: "What changed because of your work?",
            tag: "Y — the proof",
            placeholder: "500 cans, 20 volunteers",
        },
        {
            question:
                "No exact number? Give the scale instead — people served, team size, hours.",
            tag: "Y — estimate honestly",
            placeholder: "~200 families in the neighborhood",
        },
        {
            question: "How did you do it?",
            tag: "Z — the method",
            placeholder: "Set up sign-up sheets and planned delivery routes",
        },
    ],
    projects: [
        {
            question: "What did you build?",
            tag: "X — the outcome",
            placeholder: "A website that tracks volunteer hours",
        },
        {
            question: "Who is it for / what does it do?",
            tag: "Y — the proof",
            placeholder: "200 students signed up in the first month",
        },
        {
            question:
                "No exact number? Give the scale instead — users, team size, hours.",
            tag: "Y — estimate honestly",
            placeholder: "Built for a 30-person club",
        },
        {
            question: "How did you build it?",
            tag: "Z — tools & method",
            placeholder: "React frontend with a Firebase backend",
        },
    ],
};

const cleanFragment = (s) =>
    (s || "")
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[.]+$/, "")
        .replace(/^i\s+/i, "");

const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * Deterministic assembly — the post's formula:
 * "Accomplished [X], as measured by [Y], by doing [Z]."
 * The method rides after an em dash in the kid's own words (no grammar
 * surgery — "by setting up" can't be derived reliably), and the result is
 * always editable in the review step. Missing parts are skipped.
 */
export const assembleBullet = ({ x, y, z }) => {
    const X = cleanFragment(x);
    const Y = cleanFragment(y);
    const Z = cleanFragment(z);
    if (!X && !Y && !Z) return "";
    let out = capFirst(X);
    if (Y) out += `${out ? ", " : ""}as measured by ${Y}`;
    if (Z) out += `${out ? " — " : ""}${capFirst(Z)}`;
    return `${out}.`;
};
