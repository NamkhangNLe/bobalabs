import React, { useState, useRef, useEffect } from 'react';
import '../styles/main.css';
import { trackEvent } from '../analytics';

// Security: Sanitize URLs to prevent XSS attacks
const sanitizeUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    // Block dangerous protocols
    if (/^(javascript|data|vbscript):/i.test(trimmed)) {
        return '';
    }
    // Ensure http/https protocol
    if (!/^https?:\/\//i.test(trimmed)) {
        return `https://${trimmed}`;
    }
    return trimmed;
};

const AutoResizeTextarea = ({ value, onChange, placeholder, className }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`auto-resize-textarea ${className || ''}`}
        />
    );
};

const EXAMPLE_DATA = {
    personal: {
        name: "Namkhang Le",
        email: "NamkhangNLe@hotmail.com",
        phone: "(571) 443-0967",
        location: "Atlanta, GA",
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
            bullets: [
                "Engineered a Java and Spring-based customer-facing communication service to automate the delivery of 10+ Government Cloud request email notifications (received, approved, denied) per day by enabling seamless integration with 3 native AWS packages.",
                "Redesigned a 13-year-old email system into a scalable, end-to-end microservices architecture using AWS SWF, SNS, and SQS achieving a processing rate of over 5 transactions per second (TPS), ensuring redundancy and autoscaling across the application.",
                "Architected a 1st place-winning Amazon Bedrock-powered AI onboarding buddy, fine-tuned on internal documentation, to significantly reduce ramp-up lag time for new software engineers company-wide and reducing question response time."
            ]
        },
        {
            company: "Citigroup",
            location: "Tampa, FL",
            role: "Software Engineer Intern",
            date: "June 2023 - August 2023",
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
            bullets: [
                "Trained a wildfire-based infrastructure identification AI model through Kubeflow, Pytorch, & Tensorflow, with 98% accuracy.",
                "Implemented a real-time data monitoring interface in Spring, driving a 20% increase in operator awareness & object tracking.",
                "Transformed codebase maintainability by converting logging levels from Apache Log4J to SLF4J, achieving 80% code coverage."
            ]
        }
    ],
    projects: [
        {
            name: " Georgia Tech Computer Science Capstone Project",
            link: "https://github.com/NamkhangNLe/hemodynamics-calculator",
            techStack: "React, Express, MongoDB",
            date: "August 2023 - May 2024",
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
            bullets: [
                "Preprocessed 3 datasets comprising over 200,000 samples for the training of a custom machine learning model Scikit-learn.",
                "Developed a decision tree classifier and a convolutional neural network using Keras achieving a 97% translation accuracy.",
                "Implemented a React-base frontend built using HTML, CSS, and JavaScript connected to a Python Flask backend with Rest API endpoints for optimized communication with the CNN model hosted on Google Cloud’s Vertex AI platform."
            ]
        },
        {
            name: "MorseTorch (HackGT Hackathon)",
            link: "https://devpost.com/software/morse-torch",
            techStack: "Swift, CoreML",
            date: "October 2023",
            bullets: [" Employed Swift-based iOS application for Morse code translation, integrating Torch and Carthage binary framework.",
                "Executed K-means clustering algorithm using CoreML enabling real-time translation of optical signals with a 75% accuracy rate."]
        }

    ],
    skills: {
        languages: "Java, Python, C, SQL, JavaScript, CSS, HTML, Unified Modeling Language, C#, R, Swift, LaTeX",
        technologies: "Spring Boot, Angular, Android Studio, Bootstrap, RESTful APIs, Gradle, Pandas, Postman, React, Linux",
        development: "Agile, Jira, CI/CD, DevSecOps, CLI, Confluence, Coverity, Jenkins, Artifactory, Unit Test, Git",
        spokenLanguages: "Spoken Languages: English (Native), Vietnamese (Fluent), Spanish (Limited Working Proficiency)",
        affiliations: "Google Student Developer (Technical Lead), Competitive Programming, Mentor Jackets, Student Alumni Association"
    }
};

const INITIAL_STATE = {
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
            bullets: ["", "", ""]
        },
        {
            company: "",
            location: "",
            role: "",
            date: "",
            bullets: ["", "", ""]
        },
        {
            company: "",
            location: "",
            role: "",
            date: "",
            bullets: ["", "", ""]
        }
    ],
    projects: [
        {
            name: "",
            link: "",
            techStack: "",
            date: "",
            bullets: ["", ""]
        },
        {
            name: "",
            link: "",
            techStack: "",
            date: "",
            bullets: ["", "", ""]
        },
        {
            name: "",
            link: "",
            techStack: "",
            date: "",
            bullets: ["", "", ""]
        },
        {
            name: "",
            link: "",
            techStack: "",
            date: "",
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


// localStorage key for the resume builder autosave.
const AUTOSAVE_KEY = 'bobalabs-resume-v1';
// Default order of the resume sections (also restored by "Start from scratch").
const DEFAULT_SECTION_ORDER = ['education', 'experience', 'projects', 'skills'];

const readAutosave = () => {
    try {
        const raw = localStorage.getItem(AUTOSAVE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
};

// Read a previously autosaved resume, merged over the empty template so that
// older saves keep working when new fields are added later.
const loadSavedResume = () => {
    const fresh = JSON.parse(JSON.stringify(INITIAL_STATE));
    const saved = readAutosave();
    if (!saved || typeof saved.resumeData !== 'object') return fresh;
    const data = saved.resumeData;
    return {
        ...fresh,
        ...data,
        personal: { ...fresh.personal, ...(data.personal || {}) },
        skills: { ...fresh.skills, ...(data.skills || {}) }
    };
};

// Read a previously autosaved section order, falling back to the default order.
const loadSavedSectionOrder = () => {
    const saved = readAutosave();
    const order = saved && Array.isArray(saved.sectionOrder)
        ? saved.sectionOrder.filter((s) => DEFAULT_SECTION_ORDER.includes(s))
        : [];
    DEFAULT_SECTION_ORDER.forEach((s) => { if (!order.includes(s)) order.push(s); });
    return order;
};

// The example data stores the "Spoken Languages:" label inside the value itself;
// strip a leading label at render time so the preview doesn't print it twice.
const withoutSpokenPrefix = (value) => (value || '').replace(/^spoken languages:\s*/i, '');


const ResumePage = () => {
    const previewRef = useRef(null);
    const previewContainerRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    // Lazy initializer: restore the autosaved resume (if any) on page load.
    const [resumeData, setResumeData] = useState(loadSavedResume);
    const [sectionOrder, setSectionOrder] = useState(loadSavedSectionOrder);
    const [previewScale, setPreviewScale] = useState(1);
    const [previewScaledHeight, setPreviewScaledHeight] = useState('auto');

    useEffect(() => {
        const checkOverflow = () => {
            if (previewRef.current) {
                const { scrollHeight, clientHeight } = previewRef.current;
                setIsOverflowing(scrollHeight > clientHeight + 5);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        // Set document title for PDF print name
        const originalTitle = document.title;
        document.title = "Namkhang_Le_Resume";

        return () => {
            window.removeEventListener('resize', checkOverflow);
            document.title = originalTitle;
        };
    }, [resumeData]);

    // Autosave: write the full resume state (including section order) to
    // localStorage ~500ms after the user stops making changes.
    const autosaveTimeoutRef = useRef(null);
    const skipAutosave = useRef(true);

    useEffect(() => {
        if (skipAutosave.current) {
            skipAutosave.current = false;
            return;
        }
        if (autosaveTimeoutRef.current) {
            clearTimeout(autosaveTimeoutRef.current);
        }
        autosaveTimeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ resumeData, sectionOrder }));
            } catch (e) {
                // Storage unavailable or full: edits still work for this session.
            }
        }, 500);
        return () => clearTimeout(autosaveTimeoutRef.current);
    }, [resumeData, sectionOrder]);

    // Track edits with debounce
    const editTimeoutRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (editTimeoutRef.current) {
            clearTimeout(editTimeoutRef.current);
        }

        editTimeoutRef.current = setTimeout(() => {
            trackEvent('resume_edited');
        }, 5000); // 5 seconds debounce to capture a "session" of edits

        return () => clearTimeout(editTimeoutRef.current);
    }, [resumeData]);

    // Mobile preview: scale the fixed 8.5in-wide (816px) resume down to fit
    // the preview pane on narrow screens.
    useEffect(() => {
        const updateScale = () => {
            const container = previewContainerRef.current;
            const preview = previewRef.current;
            if (!container || !preview) return;
            const nextScale = Math.min(1, container.clientWidth / 816);
            setPreviewScale(nextScale);
            setPreviewScaledHeight(preview.offsetHeight * nextScale);
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [resumeData]);

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            personal: { ...prev.personal, [name]: value }
        }));
    };

    const handleListChange = (section, index, field, value) => {
        setResumeData(prev => {
            const newList = [...prev[section]];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, [section]: newList };
        });
    };

    const handleBulletChange = (section, index, bulletIndex, value) => {
        setResumeData(prev => {
            const newList = [...prev[section]];
            const newBullets = [...newList[index].bullets];
            newBullets[bulletIndex] = value;
            newList[index] = { ...newList[index], bullets: newBullets };
            return { ...prev, [section]: newList };
        });
    };

    const handleSkillChange = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            skills: { ...prev.skills, [field]: value }
        }));
    };

    const addItem = (section) => {
        let newItem;
        if (section === 'experience') {
            newItem = { company: '', location: '', role: '', date: '', bullets: [''] };
        } else if (section === 'education') {
            newItem = { school: '', location: '', degree: '', date: '', coursework: '' };
        } else {
            newItem = { name: '', link: '', techStack: '', date: '', bullets: [''] };
        }
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }));
    };

    const addBullet = (section, index) => {
        setResumeData(prev => {
            const newList = [...prev[section]];
            newList[index] = { ...newList[index], bullets: [...newList[index].bullets, ''] };
            return { ...prev, [section]: newList };
        });
    };

    const removeItem = (section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const removeBullet = (section, index, bulletIndex) => {
        setResumeData(prev => {
            const newList = [...prev[section]];
            newList[index] = {
                ...newList[index],
                bullets: newList[index].bullets.filter((_, i) => i !== bulletIndex)
            };
            return { ...prev, [section]: newList };
        });
    };

    // Move a resume section up or down in the ordering.
    const moveSection = (section, direction) => {
        setSectionOrder(prev => {
            const idx = prev.indexOf(section);
            const next = idx + direction;
            if (idx < 0 || next < 0 || next >= prev.length) return prev;
            const copy = [...prev];
            [copy[idx], copy[next]] = [copy[next], copy[idx]];
            return copy;
        });
    };

    // Reset the builder to empty fields and delete the autosaved draft.
    const clearResume = () => {
        try {
            localStorage.removeItem(AUTOSAVE_KEY);
        } catch (e) {
            // Storage unavailable: still reset the in-memory state.
        }
        // Skip the next autosave tick so the blank state isn't written back.
        skipAutosave.current = true;
        setResumeData(JSON.parse(JSON.stringify(INITIAL_STATE)));
        setSectionOrder([...DEFAULT_SECTION_ORDER]);
    };

    // Section header with up/down reorder buttons and an optional add button.
    const renderSectionHeader = (title, sectionKey, addButton) => (
        <div className="section-header">
            <h3>{title}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="btn-small" onClick={() => moveSection(sectionKey, -1)} disabled={sectionOrder[0] === sectionKey} aria-label={`Move ${title} up`} title={`Move ${title} up`}>↑</button>
                <button className="btn-small" onClick={() => moveSection(sectionKey, 1)} disabled={sectionOrder[sectionOrder.length - 1] === sectionKey} aria-label={`Move ${title} down`} title={`Move ${title} down`}>↓</button>
                {addButton}
            </div>
        </div>
    );

    const printResume = () => {
        trackEvent('resume_exported');
        window.print();
    };

    return (
    const educationEditor = (
        <section className="editor-section" key="education">
            {renderSectionHeader('Education', 'education',
                <button className="btn-small" onClick={() => addItem('education')}>+ Add education</button>
            )}
            {resumeData.education.map((edu, idx) => (
                <div key={idx} className="editor-item">
                    <div className="item-row">
                        <input
                            placeholder="School / University"
                            value={edu.school}
                            onChange={(e) => handleListChange('education', idx, 'school', e.target.value)}
                        />
                        <button className="btn-remove" onClick={() => removeItem('education', idx)} aria-label="Remove education entry">×</button>
                    </div>
                    <input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => handleListChange('education', idx, 'degree', e.target.value)}
                    />
                    <div className="form-grid">
                        <input
                            placeholder="Location"
                            value={edu.location}
                            onChange={(e) => handleListChange('education', idx, 'location', e.target.value)}
                        />
                        <input
                            placeholder="Date Range"
                            value={edu.date}
                            onChange={(e) => handleListChange('education', idx, 'date', e.target.value)}
                        />
                    </div>
                    <AutoResizeTextarea
                        placeholder="Relevant Coursework"
                        value={edu.coursework}
                        onChange={(e) => handleListChange('education', idx, 'coursework', e.target.value)}
                    />
                </div>
            ))}
        </section>
    );

    const experienceEditor = (
        <section className="editor-section" key="experience">
            {renderSectionHeader('Experience', 'experience',
                <button className="btn-small" onClick={() => addItem('experience')}>+ Add</button>
            )}
            {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="editor-item">
                    <div className="item-row">
                        <input
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) => handleListChange('experience', idx, 'company', e.target.value)}
                        />
                        <button className="btn-remove" onClick={() => removeItem('experience', idx)}>×</button>
                    </div>
                    <input
                        placeholder="Job Title"
                        value={exp.role}
                        onChange={(e) => handleListChange('experience', idx, 'role', e.target.value)}
                    />
                    <div className="form-grid">
                        <input
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => handleListChange('experience', idx, 'location', e.target.value)}
                        />
                        <input
                            placeholder="Date Range"
                            value={exp.date}
                            onChange={(e) => handleListChange('experience', idx, 'date', e.target.value)}
                        />
                    </div>
                    <div className="bullets-editor">
                        {exp.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="bullet-row">
                                <AutoResizeTextarea
                                    value={bullet}
                                    placeholder="Accomplished [X] as measured by [Y], by doing [Z]."
                                    onChange={(e) => handleBulletChange('experience', idx, bIdx, e.target.value)}
                                />
                                <button className="btn-remove-bullet" onClick={() => removeBullet('experience', idx, bIdx)}>×</button>
                            </div>
                        ))}
                        <button className="btn-small" onClick={() => addBullet('experience', idx)}>+ Add Bullet</button>
                    </div>
                </div>
            ))}
        </section>
    );

    return (
    const projectsEditor = (
        <section className="editor-section" key="projects">
            {renderSectionHeader('Projects', 'projects',
                <button className="btn-small" onClick={() => addItem('projects')}>+ Add</button>
            )}
            {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="editor-item">
                    <div className="item-row">
                        <input
                            placeholder="Project Name"
                            value={proj.name}
                            onChange={(e) => handleListChange('projects', idx, 'name', e.target.value)}
                        />
                        <button className="btn-remove" onClick={() => removeItem('projects', idx)}>×</button>
                    </div>
                    <input
                        placeholder="Tech Stack (e.g., React, Python, MongoDB)"
                        value={proj.techStack || ''}
                        onChange={(e) => handleListChange('projects', idx, 'techStack', e.target.value)}
                    />
                    <div className="form-grid">
                        <input
                            placeholder="Project Link / URL"
                            value={proj.link}
                            onChange={(e) => handleListChange('projects', idx, 'link', e.target.value)}
                        />
                        <input
                            placeholder="Date Range"
                            value={proj.date}
                            onChange={(e) => handleListChange('projects', idx, 'date', e.target.value)}
                        />
                    </div>
                    <div className="bullets-editor">
                        {proj.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="bullet-row">
                                <AutoResizeTextarea
                                    value={bullet}
                                    placeholder="Accomplished [X] as measured by [Y], by doing [Z]."
                                    onChange={(e) => handleBulletChange('projects', idx, bIdx, e.target.value)}
                                />
                                <button className="btn-remove-bullet" onClick={() => removeBullet('projects', idx, bIdx)}>×</button>
                            </div>
                        ))}
                        <button className="btn-small" onClick={() => addBullet('projects', idx)}>+ Add Bullet</button>
                    </div>
                </div>
            ))}
        </section>
    );

    const skillsEditor = (
        <section className="editor-section" key="skills">
            {renderSectionHeader('Skills', 'skills', null)}
            <div className="skills-grid">
                <div className="field">
                    <label>Languages</label>
                    <AutoResizeTextarea
                        value={resumeData.skills.languages}
                        placeholder="Programming languages (e.g., Java, Python)"
                        onChange={(e) => handleSkillChange('languages', e.target.value)}
                    />
                </div>
                <div className="field">
                    <label>Technologies</label>
                    <AutoResizeTextarea
                        value={resumeData.skills.technologies}
                        placeholder="Frameworks & Tools (e.g., React, Spring Boot)"
                        onChange={(e) => handleSkillChange('technologies', e.target.value)}
                    />
                </div>
                <div className="field">
                    <label>Software Dev</label>
                    <AutoResizeTextarea
                        value={resumeData.skills.development}
                        placeholder="Methodologies & Other (e.g., Agile, CI/CD)"
                        onChange={(e) => handleSkillChange('development', e.target.value)}
                    />
                </div>
                <div className="field">
                    <label>Affiliations</label>
                    <AutoResizeTextarea
                        value={resumeData.skills.affiliations}
                        placeholder="Clubs, Awards, or Affiliations"
                        onChange={(e) => handleSkillChange('affiliations', e.target.value)}
                    />
                </div>
                <div className="field">
                    <label>Spoken Languages</label>
                    <AutoResizeTextarea
                        value={resumeData.skills.spokenLanguages}
                        placeholder="Spoken Languages"
                        onChange={(e) => handleSkillChange('spokenLanguages', e.target.value)}
                    />
                </div>
            </div>
        </section>
    );

    const editorSections = {
        education: educationEditor,
        experience: experienceEditor,
        projects: projectsEditor,
        skills: skillsEditor
    };

    return (
    const educationPreview = (
        <section className="resume-section" key="education">
            <h2 className="section-title">Education</h2>
            {resumeData.education.map((edu, idx) => (
                <div key={idx} className="section-content education-item">
                    <div className="row">
                        <span className="company-name">{edu.school || EXAMPLE_DATA.education[idx]?.school}</span>
                        <span className="date">{edu.date || EXAMPLE_DATA.education[idx]?.date}</span>
                    </div>
                    <div className="row">
                        <span className="role-title">{edu.degree || EXAMPLE_DATA.education[idx]?.degree}</span>
                        <span className="date">{edu.location || EXAMPLE_DATA.education[idx]?.location}</span>
                    </div>
                    <div className="coursework">
                        <span className="italic">Relevant Coursework</span>: {edu.coursework || EXAMPLE_DATA.education[idx]?.coursework}
                    </div>
                </div>
            ))}
        </section>
    );

    const experiencePreview = (
        <section className="resume-section" key="experience">
            <h2 className="section-title">Experience</h2>
            {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="section-content experience-item">
                    <div className="row">
                        <span className="company-name">{exp.company || EXAMPLE_DATA.experience[idx]?.company}</span>
                        <span className="date">{exp.location || EXAMPLE_DATA.experience[idx]?.location}</span>
                    </div>
                    <div className="row">
                        <span className="role-title">{exp.role || EXAMPLE_DATA.experience[idx]?.role}</span>
                        <span className="date">{exp.date || EXAMPLE_DATA.experience[idx]?.date}</span>
                    </div>
                    <ul className="bullet-list">
                        {exp.bullets.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet || EXAMPLE_DATA.experience[idx]?.bullets?.[bIdx]}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );

    return (
    const projectsPreview = (
        <section className="resume-section" key="projects">
            <h2 className="section-title">Projects</h2>
            {resumeData.projects.map((proj, idx) => {
                const techStack = proj.techStack || EXAMPLE_DATA.projects[idx]?.techStack;
                return (
                    <div key={idx} className="section-content project-item">
                        <div className="row">
                            <div className="project-header">
                                <span className="bold">{proj.name || EXAMPLE_DATA.projects[idx]?.name}</span>
                                {techStack ? (
                                    <><span className="pipe"> | </span><span className="italic">{techStack}</span></>
                                ) : null}
                            </div>
                            <span className="date">{proj.date || EXAMPLE_DATA.projects[idx]?.date}</span>
                        </div>
                        <ul className="bullet-list">
                            {proj.bullets.map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet || EXAMPLE_DATA.projects[idx]?.bullets?.[bIdx]}</li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </section>
    );

    const skillsPreview = (
        <section className="resume-section" key="skills">
            <h2 className="section-title">Skills</h2>
            <div className="section-content skills-list">
                <p><span className="bold">Programming Languages</span>: {resumeData.skills.languages || EXAMPLE_DATA.skills.languages}</p>
                <p><span className="bold">Technologies</span>: {resumeData.skills.technologies || EXAMPLE_DATA.skills.technologies}</p>
                <p><span className="bold">Software Development</span>: {resumeData.skills.development || EXAMPLE_DATA.skills.development}</p>
                <p><span className="bold">Affiliations</span>: {resumeData.skills.affiliations || EXAMPLE_DATA.skills.affiliations}</p>
                <p><span className="bold">Spoken Languages</span>: {withoutSpokenPrefix(resumeData.skills.spokenLanguages || EXAMPLE_DATA.skills.spokenLanguages)}</p>
            </div>
        </section>
    );

    const previewSections = {
        education: educationPreview,
        experience: experiencePreview,
        projects: projectsPreview,
        skills: skillsPreview
    };

    return (
        <div className="resume-maker-container">
            <div className="resume-editor no-print">
                <div className="editor-header">
                    <h2>Resume Editor</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn btn-secondary" onClick={clearResume}>Start from scratch</button>
                        <button className="btn btn-primary" onClick={printResume}>Export to PDF</button>
                    </div>
                </div>
                <p className="export-hint">Clicking "Export to PDF" opens your system's print dialog — choose "Save as PDF" as the destination.</p>

                {/* Personal Info */}
                <section className="editor-section">
                    <h3>Personal Information</h3>
                    <div className="form-grid">
                        <input name="name" placeholder="Full Name" value={resumeData.personal.name} onChange={handlePersonalInfoChange} />
                        <input name="email" placeholder="Email" value={resumeData.personal.email} onChange={handlePersonalInfoChange} />
                        <input name="phone" placeholder="Phone" value={resumeData.personal.phone} onChange={handlePersonalInfoChange} />
                        <input name="location" placeholder="Location" value={resumeData.personal.location} onChange={handlePersonalInfoChange} />
                        <input name="website" placeholder="Website" value={resumeData.personal.website} onChange={handlePersonalInfoChange} />
                        <input name="linkedin" placeholder="LinkedIn" value={resumeData.personal.linkedin} onChange={handlePersonalInfoChange} />
                    </div>
                </section>

                {sectionOrder.map((key) => editorSections[key])}

                

                

                
            </div>

            <div className="resume-preview" ref={previewContainerRef}>
                <div className="preview-header no-print">
                    <span className="example-badge">Example resume</span>
                    <span className="preview-header-text">Sample data — your edits appear here as you type.</span>
                </div>
                <div className="preview-scale-outer" style={{ height: previewScaledHeight }}>
                    <div className="preview-scale-inner" style={{ transform: `scale(${previewScale})` }}>
                        <div className="latex-resume" ref={previewRef}>
                    <header className="resume-header">
                        <h1>{resumeData.personal.name || EXAMPLE_DATA.personal.name}</h1>
                        <p>
                            {(resumeData.personal.email || EXAMPLE_DATA.personal.email)} <span className="pipe">|</span> {(resumeData.personal.phone || EXAMPLE_DATA.personal.phone)} <span className="pipe">|</span> {(resumeData.personal.location || EXAMPLE_DATA.personal.location)}
                        </p>
                        <p>
                            <a href={sanitizeUrl(resumeData.personal.website || EXAMPLE_DATA.personal.website)} target="_blank" rel="noopener noreferrer">{(resumeData.personal.website || EXAMPLE_DATA.personal.website)}</a> <span className="pipe">|</span> <a href={sanitizeUrl(resumeData.personal.linkedin || EXAMPLE_DATA.personal.linkedin)} target="_blank" rel="noopener noreferrer">{(resumeData.personal.linkedin || EXAMPLE_DATA.personal.linkedin)}</a>
                        </p>
                    </header>

                    {sectionOrder.map((key) => previewSections[key])}




                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumePage;
