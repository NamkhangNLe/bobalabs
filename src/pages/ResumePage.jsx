import React, { useState, useRef, useEffect } from 'react';
import '../styles/main.css';

const ResumePage = () => {
    const previewRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [resumeData, setResumeData] = useState({
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
                date: "August 2021 -- May 2025",
                coursework: "Data Structures & Algorithms, Artificial Intelligence, Design & Analysis of Algorithms, Computer Organization & Programming, Probability & Statistics, Combinatorics, Linear Algebra, Computer Systems & Networks, Database Systems"
            }
        ],
        experience: [
            {
                company: "Amazon Web Services (AWS)",
                location: "Arlington, VA",
                role: "Software Development Engineer Intern",
                date: "May 2024 -- August 2024",
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
                date: "June 2023 -- August 2023",
                bullets: [
                    "Spearheaded Event Master Central, a full stack application for real-time corporate action event monitoring of financial assets in Angular & Oracle Database increasing engineering awareness of deployment failures by 18%.",
                    "Revamped authentication logic, fortifying API token validation for REST API calls, contributing an 85% uptime to production.",
                    "Orchestrated seamless integration with Institutional Services Group's Cloud services using Spring Boot, optimizing performance through JSON-based HTTP requests, and enhancing overall efficiency by 15% across the application.",
                    "Leveraged 2 Python’s Pandas DataFrame to analyze surface temperatures vs global domestic product, resulting in a 0.8 positive correlation within Tableau in support of Citi's 1 trillion dollar commitment to sustainable finance."
                ]
            },
            {
                company: "Lockheed Martin",
                location: "Manassas, VA",
                role: "Software Engineer Intern",
                date: "May 2022 -- August 2022",
                bullets: [
                    "Trained a wildfire-based infrastructure identification AI model through Kubeflow, Pytorch, & Tensorflow, with 98% accuracy.",
                    "Implemented a real-time data monitoring interface in Spring, driving a 20% increase in operator awareness & object tracking.",
                    "Transformed codebase maintainability by converting logging levels from Apache Log4J to SLF4J, achieving 80% code coverage.",
                    "Collaborated with quality analysis team to execute comprehensive testing, resulting in a 12% reduction in logging inefficiencies."
                ]
            }
        ],
        projects: [
            {
                name: "Georgia Tech Computer Science Capstone Project",
                link: "https://github.com/NamkhangNLe/hemodynamics-calculator",
                tech: "JavaScript, ReactJS, MongoDB, ExpressJS, NodeJS",
                date: "August 2023 -- May 2024",
                bullets: [
                    "Developed a Hemodynamics Calculator, a full-stack application for the Emory University School of Medicine, to be used by 10 clinicians to reduce measurement error daily, impacting over 1,000 patients within the intensive care unit.",
                    "Leveraged ReactJS, Express, and MongoDB to develop user-friendly interactive visualizations of trends in patient data and a reduction in data-related errors by 34%."
                ]
            },
            {
                name: "ScribbleTex (AI ATL Hackathon GitHub Winner)",
                link: "https://devpost.com/software/scribbletex",
                tech: "JavaScript, Google Cloud Platform, VertexAI, Flask, ReactJS",
                date: "November 2023",
                bullets: [
                    "Preprocessed 3 datasets comprising over 200,000 samples for the training of a custom machine learning model Scikit-learn.",
                    "Developed a decision tree classifier and a convolutional neural network using Keras achieving a 97% translation accuracy.",
                    "Implemented a React-base frontend built using HTML, CSS, and JavaScript connected to a Python Flask backend with Rest API endpoints for optimized communication with the CNN model hosted on Google Cloud's Vertex AI platform."
                ]
            },
            {
                name: "MorseTorch (HackGT Hackathon)",
                link: "https://devpost.com/software/morse-torch",
                tech: "Swift, Python, Pandas, Jupyter Notebook, XCode, CoreML, Torch, Carthage",
                date: "October 2023",
                bullets: [
                    "Employed Swift-based iOS application for Morse code translation, integrating Torch and Carthage binary framework.",
                    "Executed K-means clustering algorithm using CoreML enabling real-time translation of optical signals with a 75% accuracy rate."
                ]
            }
        ],
        skills: {
            languages: "Java, Python, C, SQL, JavaScript, CSS, HTML, Unified Modeling Language, C#, R, Swift, LaTeX",
            technologies: "Spring Boot, Angular, Android Studio, Bootstrap, RESTful APIs, Gradle, Pandas, Postman, React, Linux",
            development: "Agile, Jira, CI/CD, DevSecOps, CLI, Confluence, Coverity, Jenkins, Artifactory, Unit Test, Git",
            spoken: "English (Native), Vietnamese (Fluent), Spanish (Limited Working Proficiency)",
            affiliations: "Google Student Developer (Technical Lead), Competitive Programming, Mentor Jackets, Student Alumni Association"
        }
    });

    useEffect(() => {
        const checkOverflow = () => {
            if (previewRef.current) {
                const { scrollHeight, clientHeight } = previewRef.current;
                setIsOverflowing(scrollHeight > clientHeight + 5);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
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
        const newItem = section === 'experience'
            ? { company: '', location: '', role: '', date: '', bullets: [''] }
            : { name: '', link: '', tech: '', date: '', bullets: [''] };
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

    const printResume = () => {
        window.print();
    };

    return (
        <div className="resume-maker-container">
            <div className="resume-editor no-print">
                <div className="editor-header">
                    <h2>Resume Editor</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {isOverflowing && (
                            <span style={{
                                color: '#ff4d4d',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                background: '#fff0f0',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid #ffcccc'
                            }}>
                                ⚠️ Content exceeds 1 page
                            </span>
                        )}
                        <button className="btn btn-primary" onClick={printResume}>Export to PDF</button>
                    </div>
                </div>

                {/* Personal Info */}
                <section className="editor-section">
                    <h3>Personal Information</h3>
                    <div className="form-grid">
                        <input name="name" placeholder="Full Name" value={resumeData.personal.name} onChange={handlePersonalInfoChange} />
                        <input name="email" placeholder="Email" value={resumeData.personal.email} onChange={handlePersonalInfoChange} />
                        <input name="phone" placeholder="Phone" value={resumeData.personal.phone} onChange={handlePersonalInfoChange} />
                        <input name="location" placeholder="Location" value={resumeData.personal.location} onChange={handlePersonalInfoChange} />
                        <input name="website" placeholder="Website (url)" value={resumeData.personal.website} onChange={handlePersonalInfoChange} />
                        <input name="linkedin" placeholder="LinkedIn (url)" value={resumeData.personal.linkedin} onChange={handlePersonalInfoChange} />
                    </div>
                </section>

                {/* Education */}
                <section className="editor-section">
                    <h3>Education</h3>
                    {resumeData.education.map((edu, idx) => (
                        <div key={idx} className="editor-item">
                            <input placeholder="School" value={edu.school} onChange={(e) => handleListChange('education', idx, 'school', e.target.value)} />
                            <input placeholder="Degree" value={edu.degree} onChange={(e) => handleListChange('education', idx, 'degree', e.target.value)} />
                            <input placeholder="Date" value={edu.date} onChange={(e) => handleListChange('education', idx, 'date', e.target.value)} />
                            <textarea placeholder="Coursework" value={edu.coursework} onChange={(e) => handleListChange('education', idx, 'coursework', e.target.value)} />
                        </div>
                    ))}
                </section>

                {/* Experience */}
                <section className="editor-section">
                    <div className="section-header">
                        <h3>Experience</h3>
                        <button className="btn-small" onClick={() => addItem('experience')}>+ Add</button>
                    </div>
                    {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="editor-item">
                            <div className="item-row">
                                <input placeholder="Company" value={exp.company} onChange={(e) => handleListChange('experience', idx, 'company', e.target.value)} />
                                <button className="btn-remove" onClick={() => removeItem('experience', idx)}>×</button>
                            </div>
                            <input placeholder="Role" value={exp.role} onChange={(e) => handleListChange('experience', idx, 'role', e.target.value)} />
                            <div className="form-grid">
                                <input placeholder="Location" value={exp.location} onChange={(e) => handleListChange('experience', idx, 'location', e.target.value)} />
                                <input placeholder="Date" value={exp.date} onChange={(e) => handleListChange('experience', idx, 'date', e.target.value)} />
                            </div>
                            <div className="bullets-editor">
                                {exp.bullets.map((bullet, bIdx) => (
                                    <div key={bIdx} className="bullet-row">
                                        <textarea value={bullet} onChange={(e) => handleBulletChange('experience', idx, bIdx, e.target.value)} />
                                        <button className="btn-remove-bullet" onClick={() => removeBullet('experience', idx, bIdx)}>×</button>
                                    </div>
                                ))}
                                <button className="btn-small" onClick={() => addBullet('experience', idx)}>+ Add Bullet</button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Projects */}
                <section className="editor-section">
                    <div className="section-header">
                        <h3>Projects</h3>
                        <button className="btn-small" onClick={() => addItem('projects')}>+ Add</button>
                    </div>
                    {resumeData.projects.map((proj, idx) => (
                        <div key={idx} className="editor-item">
                            <div className="item-row">
                                <input placeholder="Project Name" value={proj.name} onChange={(e) => handleListChange('projects', idx, 'name', e.target.value)} />
                                <button className="btn-remove" onClick={() => removeItem('projects', idx)}>×</button>
                            </div>
                            <input placeholder="Technologies" value={proj.tech} onChange={(e) => handleListChange('projects', idx, 'tech', e.target.value)} />
                            <div className="form-grid">
                                <input placeholder="Link" value={proj.link} onChange={(e) => handleListChange('projects', idx, 'link', e.target.value)} />
                                <input placeholder="Date" value={proj.date} onChange={(e) => handleListChange('projects', idx, 'date', e.target.value)} />
                            </div>
                            <div className="bullets-editor">
                                {proj.bullets.map((bullet, bIdx) => (
                                    <div key={bIdx} className="bullet-row">
                                        <textarea value={bullet} onChange={(e) => handleBulletChange('projects', idx, bIdx, e.target.value)} />
                                        <button className="btn-remove-bullet" onClick={() => removeBullet('projects', idx, bIdx)}>×</button>
                                    </div>
                                ))}
                                <button className="btn-small" onClick={() => addBullet('projects', idx)}>+ Add Bullet</button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Skills */}
                <section className="editor-section">
                    <h3>Skills</h3>
                    <div className="skills-grid">
                        <div className="field">
                            <label>Languages</label>
                            <textarea value={resumeData.skills.languages} onChange={(e) => handleSkillChange('languages', e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Technologies</label>
                            <textarea value={resumeData.skills.technologies} onChange={(e) => handleSkillChange('technologies', e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Software Dev</label>
                            <textarea value={resumeData.skills.development} onChange={(e) => handleSkillChange('development', e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Spoken Languages</label>
                            <textarea value={resumeData.skills.spoken} onChange={(e) => handleSkillChange('spoken', e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Affiliations</label>
                            <textarea value={resumeData.skills.affiliations} onChange={(e) => handleSkillChange('affiliations', e.target.value)} />
                        </div>
                    </div>
                </section>
            </div>

            <div className="resume-preview">
                <div className="latex-resume" ref={previewRef}>
                    <header className="resume-header">
                        <h1>{resumeData.personal.name}</h1>
                        <p>
                            {resumeData.personal.email} | {resumeData.personal.phone} | {resumeData.personal.location}
                        </p>
                        <p>
                            <a href={`https://${resumeData.personal.website}`} target="_blank" rel="noreferrer">{resumeData.personal.website}</a> | <a href={`https://${resumeData.personal.linkedin}`} target="_blank" rel="noreferrer">{resumeData.personal.linkedin}</a>
                        </p>
                    </header>

                    <section className="resume-section">
                        <h2 className="section-title">Education</h2>
                        {resumeData.education.map((edu, idx) => (
                            <div key={idx} className="section-content education-item">
                                <div className="row">
                                    <span className="company-name">{edu.school}</span>
                                    <span className="date">{edu.date}</span>
                                </div>
                                <div className="row">
                                    <span className="role-title">{edu.degree}</span>
                                </div>
                                <div className="coursework">
                                    <span className="italic">Relevant Coursework</span>: {edu.coursework}
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="resume-section">
                        <h2 className="section-title">Experience</h2>
                        {resumeData.experience.map((exp, idx) => (
                            <div key={idx} className="section-content experience-item">
                                <div className="row">
                                    <span className="company-name">{exp.company}</span>
                                    <span className="date">{exp.location}</span>
                                </div>
                                <div className="row">
                                    <span className="role-title">{exp.role}</span>
                                    <span className="date">{exp.date}</span>
                                </div>
                                <ul className="bullet-list">
                                    {exp.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    <section className="resume-section">
                        <h2 className="section-title">Projects</h2>
                        {resumeData.projects.map((proj, idx) => (
                            <div key={idx} className="section-content project-item">
                                <div className="row">
                                    <div className="project-header">
                                        <span className="bold">{proj.name}</span> <span className="tech-stack">| {proj.tech}</span>
                                    </div>
                                    <span className="date">{proj.date}</span>
                                </div>
                                <ul className="bullet-list">
                                    {proj.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    <section className="resume-section">
                        <h2 className="section-title">Skills</h2>
                        <div className="section-content skills-list">
                            <p><span className="bold">Programming Languages</span>: {resumeData.skills.languages}</p>
                            <p><span className="bold">Technologies</span>: {resumeData.skills.technologies}</p>
                            <p><span className="bold">Software Development</span>: {resumeData.skills.development}</p>
                            <p><span className="bold">Spoken Languages</span>: {resumeData.skills.spoken}</p>
                            <p><span className="bold">Affiliations</span>: {resumeData.skills.affiliations}</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ResumePage;
