import React from 'react';
import { sanitizeUrl, withoutSpokenPrefix } from '../../resume/model';

/**
 * ResumePreview — the right-hand document. Renders the same resume model the
 * editor writes to. Empty bullets and fully-empty entries are hidden so a
 * half-filled resume still looks clean (forgiving for first-time builders).
 */

const nonEmpty = (v) => (v || '').trim().length > 0;

const visibleBullets = (bullets) => (bullets || []).filter(nonEmpty);

const entryHasContent = (entry, fields) =>
    fields.some((f) => nonEmpty(entry[f])) || visibleBullets(entry.bullets).length > 0;

const Description = ({ text }) =>
    nonEmpty(text) ? <p className="entry-description">{text}</p> : null;

/** Contact header: only renders lines that have content, so a blank resume
 *  doesn't print stray "|" separators. */
const ResumeHeader = ({ personal }) => {
    const line1 = [personal.email, personal.phone, personal.location].filter(nonEmpty);
    const links = [
        personal.website ? (
            <a key="site" href={sanitizeUrl(personal.website)} target="_blank" rel="noopener noreferrer">{personal.website}</a>
        ) : null,
        personal.linkedin ? (
            <a key="li" href={sanitizeUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer">{personal.linkedin}</a>
        ) : null
    ].filter(Boolean);

    return (
        <header className="resume-header">
            {nonEmpty(personal.name) && <h1>{personal.name}</h1>}
            {line1.length > 0 && (
                <p>
                    {line1.map((part, i) => (
                        <span key={i}>
                            {i > 0 && <span className="pipe"> | </span>}
                            {part}
                        </span>
                    ))}
                </p>
            )}
            {links.length > 0 && (
                <p>
                    {links.map((link, i) => (
                        <span key={i}>
                            {i > 0 && <span className="pipe"> | </span>}
                            {link}
                        </span>
                    ))}
                </p>
            )}
        </header>
    );
};

const BulletList = ({ bullets }) => {
    const items = visibleBullets(bullets);
    if (items.length === 0) return null;
    return (
        <ul className="bullet-list">
            {items.map((bullet, bIdx) => (
                <li key={bIdx}>{bullet}</li>
            ))}
        </ul>
    );
};

const EducationPreview = ({ entries }) => (
    <section className="resume-section" key="education">
        <h2 className="section-title">Education</h2>
        {entries.filter((edu) => entryHasContent(edu, ['school', 'degree', 'location', 'date', 'coursework'])).map((edu, idx) => (
            <div key={idx} className="section-content education-item">
                <div className="row">
                    <span className="company-name">{edu.school || ''}</span>
                    <span className="date">{edu.date || ''}</span>
                </div>
                <div className="row">
                    <span className="role-title">{edu.degree || ''}</span>
                    <span className="date">{edu.location || ''}</span>
                </div>
                {nonEmpty(edu.coursework) && (
                    <div className="coursework">
                        <span className="italic">Relevant Coursework</span>: {edu.coursework}
                    </div>
                )}
            </div>
        ))}
    </section>
);

const ExperiencePreview = ({ entries }) => (
    <section className="resume-section" key="experience">
        <h2 className="section-title">Experience</h2>
        {entries.filter((exp) => entryHasContent(exp, ['company', 'role', 'location', 'date', 'description'])).map((exp, idx) => (
            <div key={idx} className="section-content experience-item">
                <div className="row">
                    <span className="company-name">{exp.company || ''}</span>
                    <span className="date">{exp.location || ''}</span>
                </div>
                <div className="row">
                    <span className="role-title">{exp.role || ''}</span>
                    <span className="date">{exp.date || ''}</span>
                </div>
                <Description text={exp.description} />
                <BulletList bullets={exp.bullets} />
            </div>
        ))}
    </section>
);

const ProjectsPreview = ({ entries }) => (
    <section className="resume-section" key="projects">
        <h2 className="section-title">Projects</h2>
        {entries.filter((proj) => entryHasContent(proj, ['name', 'link', 'techStack', 'date', 'description'])).map((proj, idx) => {
            const techStack = proj.techStack || '';
            return (
                <div key={idx} className="section-content project-item">
                    <div className="row">
                        <div className="project-header">
                            <span className="bold">{proj.name || ''}</span>
                            {techStack ? (
                                <><span className="pipe"> | </span><span className="italic">{techStack}</span></>
                            ) : null}
                        </div>
                        <span className="date">{proj.date || ''}</span>
                    </div>
                    <Description text={proj.description} />
                    <BulletList bullets={proj.bullets} />
                </div>
            );
        })}
    </section>
);

const SkillsPreview = ({ skills }) => (
    <section className="resume-section" key="skills">
        <h2 className="section-title">Skills</h2>
        <div className="section-content skills-list">
            {nonEmpty(skills.languages) && <p><span className="bold">Programming Languages</span>: {skills.languages}</p>}
            {nonEmpty(skills.technologies) && <p><span className="bold">Technologies</span>: {skills.technologies}</p>}
            {nonEmpty(skills.development) && <p><span className="bold">Software Development</span>: {skills.development}</p>}
            {nonEmpty(skills.affiliations) && <p><span className="bold">Affiliations</span>: {skills.affiliations}</p>}
            {nonEmpty(skills.spokenLanguages) && <p><span className="bold">Spoken Languages</span>: {withoutSpokenPrefix(skills.spokenLanguages)}</p>}
        </div>
    </section>
);

const ResumePreview = ({ resume: api }) => {
    const { resumeData, sectionOrder, isExample, isOverflowing } = api;
    const sections = {
        education: <EducationPreview entries={resumeData.education} />,
        experience: <ExperiencePreview entries={resumeData.experience} />,
        projects: <ProjectsPreview entries={resumeData.projects} />,
        skills: <SkillsPreview skills={resumeData.skills} />
    };

    return (
        <div className="resume-preview" ref={api.previewContainerRef}>
            <div className="preview-header no-print">
                {isExample && <span className="example-badge">Example resume</span>}
                <span className="preview-header-text">
                    {isExample
                        ? "This is sample data — edit any field to make it yours."
                        : "Your edits appear here as you type."}
                </span>
                {isOverflowing && (
                    <span className="overflow-warning" title="Content taller than one printed page">
                        Over 1 page
                    </span>
                )}
            </div>
            <div className="preview-scale-outer" style={{ height: api.previewScaledHeight }}>
                <div className="preview-scale-inner" style={{ transform: `scale(${api.previewScale})` }}>
                    <div className="latex-resume" ref={api.previewRef}>
                        <ResumeHeader personal={resumeData.personal} />

                        {sectionOrder.map((key) => sections[key])}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;
