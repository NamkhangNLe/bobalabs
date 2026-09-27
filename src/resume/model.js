/**
 * Boba Labs resume data model.
 *
 * Single source of truth for the resume shape, blank-entry factories, example
 * data, and versioned localStorage persistence. Both the editor and the preview
 * consume this module so the two views can never drift apart.
 */

// ---------------------------------------------------------------------------
// Storage versioning
// ---------------------------------------------------------------------------

/** Current storage schema version. Bump when the saved shape changes. */
export const STORAGE_VERSION = 2;
/** Versioned key for all resume-builder autosaves. */
export const STORAGE_KEY = 'bobalabs-resume';
/** Previous key (v1 shape: { resumeData, sectionOrder, isExample }, no version). */
const LEGACY_KEY = 'bobalabs-resume-v1';

/** Default order of the resume sections (also restored by "Start from scratch"). */
export const DEFAULT_SECTION_ORDER = ['education', 'experience', 'projects', 'skills'];

// ---------------------------------------------------------------------------
// Example + blank states
// ---------------------------------------------------------------------------

export const EXAMPLE_DATA = {
    personal: {
        name: "Namkhang Le",
        email: "NamkhangNLe@hotmail.com",
        phone: "(571) 443-0967",
        location: "San Francisco, CA",
        website: "NamkhangNLe.github.io",
        linkedin: "linkedin.com/in/NamkhangNLe"
    },
    education: [
        {
            school: "Georgia Institute of Technology",
            location: "",
            degree: "B.S. Computer Science, concentrations in Intelligence (AI/ML) and Information Internetworks",
            date: "August 2021 - May 2025",
            coursework: "Data Structures & Algorithms, Artificial Intelligence, Design of Algorithms"
        }
    ],
    experience: [
        {
            company: "Amazon Web Services (AWS)",
            location: "Arlington, VA",
            role: "Software Development Engineer Intern",
            date: "May 2024 - August 2024",
            description: "",
            bullets: [
                "Engineered a Java and Spring-based customer-facing communication service to automate the delivery of 10+ Government Cloud request email notifications (received, approved, denied) per day by enabling seamless integration with 3 native AWS packages.",
                "Redesigned a 13-year-old email system into a scalable, end-to-end microservices architecture using AWS SWF, SNS, and SQS achieving a processing rate of over 5 transactions per second (TPS), ensuring redundancy and autoscaling across the application.",
                "Architected a 1st place-winning Amazon Bedrock-powered AI onboarding buddy, fine-tuned on internal documentation, to reduce ramp-up lag time for new software engineers company-wide and speed up question response time."
            ]
        },
        {
            company: "Citigroup",
            location: "Tampa, FL",
            role: "Software Engineer Intern",
            date: "June 2023 - August 2023",
            description: "",
            bullets: [
                "Spearheaded Event Master Central, a full stack application for real-time corporate action event monitoring of financial assets in Angular & Oracle Database increasing engineering awareness of deployment failures by 18%.",
                "Revamped authentication logic, fortifying API token validation for REST API calls, contributing an 85% uptime to production.",
                "Orchestrated seamless integration with Institutional Services Group's Cloud services using Spring Boot, optimizing performance through JSON-based HTTP requests, and enhancing overall efficiency by 15% across the application."
            ]
        },
        {
            company: "Lockheed Martin",
            location: "Manassas, VA",
            role: "Software Engineer Intern",
            date: "May 2022 - August 2022",
            description: "",
            bullets: [
                "Trained a wildfire-based infrastructure identification AI model through Kubeflow, Pytorch, & Tensorflow, with 98% accuracy.",
                "Implemented a real-time data monitoring interface in Spring, driving a 20% increase in operator awareness & object tracking.",
                "Transformed codebase maintainability by converting logging levels from Apache Log4J to SLF4J, achieving 80% code coverage."
            ]
        }
    ],
    projects: [
        {
            name: "Georgia Tech Computer Science Capstone Project",
            link: "https://github.com/NamkhangNLe/hemodynamics-calculator",
            techStack: "React, Express, MongoDB",
            date: "August 2023 - May 2024",
            description: "",
            bullets: [
                "Developed a Hemodynamics Calculator, a full-stack application for the Emory University School of Medicine, to be used by 10 clinicians to reduce measurement error daily, impacting over 1,000 patients within the intensive care unit.",
                "Leveraged ReactJS, Express, and MongoDB to develop user-friendly interactive visualizations of trends in patient data and a reduction in data-related errors by 34%."
            ]
        },
        {
            name: "DiagnoseMe (Hackalytics Hackathon)",
            link: "https://devfolio.co/projects/diagnoseme-1992",
            techStack: "ElectronJS, React, Flask, Pandas",
            date: "February 2024",
            description: "",
            bullets: [
                "Constructed a ChatGPT powered ElectronJS application for disease diagnosis supporting medical students and doctors in training",
                "Streamlined user experience by creating 120 unique prompt-engineered scenarios through Pandas DataFrame consolidation.",
                "Achieved a 15% reduction in development time through REST APIs for seamless data exchange via JSON between React & Flask."
            ]
        },
        {
            name: "ScribbleTex (AI ATL Hackathon Github Winner)",
            link: "https://devpost.com/software/scribbletex",
            techStack: "React, Flask, Keras, Scikit-learn",
            date: "November 2023",
            description: "",
            bullets: [
                "Preprocessed 3 datasets comprising over 200,000 samples for the training of a custom machine learning model Scikit-learn.",
                "Developed a decision tree classifier and a convolutional neural network using Keras achieving a 97% translation accuracy.",
                "Implemented a React-based frontend built using HTML, CSS, and JavaScript connected to a Python Flask backend with REST API endpoints for optimized communication with the CNN model hosted on Google Cloud's Vertex AI platform."
            ]
        },
        {
            name: "MorseTorch (HackGT Hackathon)",
            link: "https://devpost.com/software/morse-torch",
            techStack: "Swift, CoreML",
            date: "October 2023",
            description: "",
            bullets: ["Employed Swift-based iOS application for Morse code translation, integrating Torch and Carthage binary framework.",
                "Executed K-means clustering algorithm using CoreML enabling real-time translation of optical signals with a 75% accuracy rate."]
        }

    ],
    skills: {
        languages: "Java, Python, C, SQL, JavaScript, CSS, HTML, Unified Modeling Language, C#, R, Swift, LaTeX",
        technologies: "Spring Boot, Angular, Android Studio, Bootstrap, RESTful APIs, Gradle, Pandas, Postman, React, Linux",
        development: "Agile, Jira, CI/CD, DevSecOps, CLI, Confluence, Coverity, Jenkins, Artifactory, Unit Test, Git",
        spokenLanguages: "English (Native), Vietnamese (Fluent), Spanish (Limited Working Proficiency)",
        affiliations: "Google Student Developer (Technical Lead), Competitive Programming, Mentor Jackets, Student Alumni Association"
    }
};

export const INITIAL_STATE = {
    personal: {
        name: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: ""
    },
    education: [
        {
            school: "",
            location: "",
            degree: "",
            date: "",
            coursework: ""
        }
    ],
    experience: [
        {
            company: "",
            location: "",
            role: "",
            date: "",
            description: "",
            bullets: ["", "", ""]
        },
        {
            company: "",
            location: "",
            role: "",
            date: "",
            description: "",
            bullets: ["", "", ""]
        },
        {
            company: "",
            location: "",
            role: "",
            date: "",
            description: "",
            bullets: ["", "", ""]
        }
    ],
    projects: [
        {
            name: "",
            link: "",
            techStack: "",
            date: "",
            description: "",
            bullets: ["", ""]
        },
        {
            name: "",
            link: "",
            techStack: "",
            date: "",
            description: "",
            bullets: ["", "", ""]
        },
        {
            name: "",
            link: "",
            techStack: "",
            date: "",
            description: "",
            bullets: ["", ""]
        }
    ],
    skills: {
        languages: "",
        technologies: "",
        development: "",
        spokenLanguages: "",
        affiliations: ""
    }
};

// ---------------------------------------------------------------------------
// Blank-entry factories (single place that defines what a new entry looks like)
// ---------------------------------------------------------------------------

export const blankEducation = () => ({
    school: "",
    location: "",
    degree: "",
    date: "",
    coursework: ""
});

export const blankExperience = () => ({
    company: "",
    location: "",
    role: "",
    date: "",
    description: "",
    bullets: [""]
});

export const blankProject = () => ({
    name: "",
    link: "",
    techStack: "",
    date: "",
    description: "",
    bullets: [""]
});

const BLANK_FACTORIES = {
    education: blankEducation,
    experience: blankExperience,
    projects: blankProject
};

export const blankItem = (section) => {
    const factory = BLANK_FACTORIES[section];
    return factory ? factory() : { bullets: [""] };
};

// ---------------------------------------------------------------------------
// Normalization + migration
// ---------------------------------------------------------------------------

const asString = (v) => (typeof v === 'string' ? v : '');

const normalizeEntry = (section, entry) => {
    const blank = blankItem(section);
    const merged = { ...blank, ...(entry && typeof entry === 'object' ? entry : {}) };
    // Bullets must always be a non-empty array of strings so the editor and
    // preview never have to guard against missing data.
    const bullets = Array.isArray(merged.bullets) ? merged.bullets : [];
    merged.bullets = bullets.length > 0 ? bullets.map(asString) : [""];
    if ('description' in blank) merged.description = asString(merged.description);
    return merged;
};

/**
 * Merge arbitrary stored data over the blank template so old or partial saves
 * keep working when new fields are added later.
 */
export const normalizeResumeData = (data) => {
    const fresh = JSON.parse(JSON.stringify(INITIAL_STATE));
    if (!data || typeof data !== 'object') return fresh;
    return {
        ...fresh,
        ...data,
        personal: { ...fresh.personal, ...(data.personal || {}) },
        skills: { ...fresh.skills, ...(data.skills || {}) },
        education: Array.isArray(data.education)
            ? data.education.map((e) => normalizeEntry('education', e))
            : fresh.education,
        experience: Array.isArray(data.experience)
            ? data.experience.map((e) => normalizeEntry('experience', e))
            : fresh.experience,
        projects: Array.isArray(data.projects)
            ? data.projects.map((e) => normalizeEntry('projects', e))
            : fresh.projects
    };
};

export const normalizeSectionOrder = (order) => {
    const clean = Array.isArray(order)
        ? order.filter((s) => DEFAULT_SECTION_ORDER.includes(s))
        : [];
    DEFAULT_SECTION_ORDER.forEach((s) => { if (!clean.includes(s)) clean.push(s); });
    return clean;
};

/**
 * Migrate a stored payload from an older schema version to the current one.
 * Add a case per version bump; each case upgrades one version forward.
 */
export const migratePayload = (payload) => {
    const data = { ...(payload || {}) };
    let version = data.version || 1;
    // v1 -> v2: entries gain an optional freeform `description` field.
    if (version < 2) {
        ['experience', 'projects'].forEach((section) => {
            if (Array.isArray(data.resumeData?.[section])) {
                data.resumeData[section] = data.resumeData[section].map((entry) => ({
                    description: '',
                    ...entry
                }));
            }
        });
        version = 2;
    }
    data.version = STORAGE_VERSION;
    return data;
};

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

const safeGet = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
};

/**
 * Load the persisted builder state.
 * Returns { resumeData, sectionOrder, isExample, isFresh } where isFresh means
 * "no save existed, start from the labeled example resume".
 */
export const loadStoredState = () => {
    let payload = safeGet(STORAGE_KEY);
    if (!payload) {
        // Migrate the legacy unversioned save (v1 shape) if one exists.
        const legacy = safeGet(LEGACY_KEY);
        if (legacy && typeof legacy.resumeData === 'object') {
            payload = migratePayload({ version: 1, ...legacy });
            try { localStorage.removeItem(LEGACY_KEY); } catch (e) { /* noop */ }
        }
    }
    if (!payload || typeof payload.resumeData !== 'object') {
        return {
            resumeData: JSON.parse(JSON.stringify(EXAMPLE_DATA)),
            sectionOrder: [...DEFAULT_SECTION_ORDER],
            isExample: true,
            isFresh: true
        };
    }
    const migrated = payload.version === STORAGE_VERSION
        ? payload
        : migratePayload(payload);
    return {
        resumeData: normalizeResumeData(migrated.resumeData),
        sectionOrder: normalizeSectionOrder(migrated.sectionOrder),
        isExample: migrated.isExample ?? false,
        isFresh: false
    };
};

export const saveStoredState = ({ resumeData, sectionOrder, isExample }) => {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ version: STORAGE_VERSION, resumeData, sectionOrder, isExample })
        );
    } catch (e) {
        // Storage unavailable or full: edits still work for this session.
    }
};

export const clearStoredState = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_KEY);
    } catch (e) {
        // Storage unavailable: in-memory reset still applies.
    }
};

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

/** Sanitize URLs to prevent XSS: block dangerous protocols, default to https. */
export const sanitizeUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
};

/** Older saves may store the "Spoken Languages:" label inside the value itself;
 *  strip a leading label at render time so the preview doesn't print it twice. */
export const withoutSpokenPrefix = (value) =>
    (value || '').replace(/^spoken languages:\s*/i, '');

/** Derive the PDF filename from the resume's name field ("Ada Lovelace" -> "Ada_Lovelace_Resume"). */
export const resumeFileName = (name) => {
    const clean = (name || '').trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_\-]/g, '');
    return clean ? `${clean}_Resume` : 'Resume';
};
