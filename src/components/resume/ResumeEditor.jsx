import React from 'react';
import AutoResizeTextarea from './AutoResizeTextarea';

/**
 * ResumeEditor — the left-hand form. Every field writes into the shared resume
 * model through the useResume api; the preview renders the same data.
 */

const SectionHeader = ({ title, sectionKey, order, onMove, addButton }) => (
    <div className="section-header">
        <h3>{title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="btn-small" onClick={() => onMove(sectionKey, -1)} disabled={order[0] === sectionKey} aria-label={`Move ${title} up`} title={`Move ${title} up`}>↑</button>
            <button className="btn-small" onClick={() => onMove(sectionKey, 1)} disabled={order[order.length - 1] === sectionKey} aria-label={`Move ${title} down`} title={`Move ${title} down`}>↓</button>
            {addButton}
        </div>
    </div>
);

/** Reorderable, removable bullet list shared by experience + project entries. */
const BulletEditor = ({ section, entryIndex, bullets, api }) => (
    <div className="bullets-editor">
        {(bullets || []).map((bullet, bIdx) => (
            <div key={bIdx} className="bullet-row">
                <div className="bullet-reorder">
                    <button
                        className="btn-small"
                        onClick={() => api.moveBullet(section, entryIndex, bIdx, -1)}
                        disabled={bIdx === 0}
                        aria-label="Move bullet up"
                        title="Move bullet up"
                    >↑</button>
                    <button
                        className="btn-small"
                        onClick={() => api.moveBullet(section, entryIndex, bIdx, 1)}
                        disabled={bIdx === (bullets || []).length - 1}
                        aria-label="Move bullet down"
                        title="Move bullet down"
                    >↓</button>
                </div>
                <AutoResizeTextarea
                    value={bullet || ''}
                    placeholder="Accomplished [X] as measured by [Y], by doing [Z]."
                    onChange={(e) => api.handleBulletChange(section, entryIndex, bIdx, e.target.value)}
                />
                <button
                    className="btn-remove-bullet"
                    onClick={() => api.removeBullet(section, entryIndex, bIdx)}
                    aria-label="Remove bullet"
                    title="Remove bullet"
                >×</button>
            </div>
        ))}
        <button className="btn-small" onClick={() => api.addBullet(section, entryIndex)}>+ Add Bullet</button>
    </div>
);

/** Optional freeform paragraph rendered above the bullets in the preview. */
const DescriptionField = ({ section, entryIndex, value, api }) => (
    <AutoResizeTextarea
        className="description-field"
        placeholder="Short description (optional) — a sentence or two about this role or project."
        value={value || ''}
        onChange={(e) => api.handleListChange(section, entryIndex, 'description', e.target.value)}
    />
);

const PersonalInfoEditor = ({ api }) => (
    <section className="editor-section">
        <h3>Personal Information</h3>
        <div className="form-grid">
            <input name="name" placeholder="Full Name" value={api.resumeData.personal.name || ''} onChange={api.handlePersonalInfoChange} />
            <input name="email" placeholder="Email" value={api.resumeData.personal.email || ''} onChange={api.handlePersonalInfoChange} />
            <input name="phone" placeholder="Phone" value={api.resumeData.personal.phone || ''} onChange={api.handlePersonalInfoChange} />
            <input name="location" placeholder="Location" value={api.resumeData.personal.location || ''} onChange={api.handlePersonalInfoChange} />
            <input name="website" placeholder="Website" value={api.resumeData.personal.website || ''} onChange={api.handlePersonalInfoChange} />
            <input name="linkedin" placeholder="LinkedIn" value={api.resumeData.personal.linkedin || ''} onChange={api.handlePersonalInfoChange} />
        </div>
    </section>
);

const EducationEditor = ({ api }) => (
    <section className="editor-section" key="education">
        <SectionHeader
            title="Education"
            sectionKey="education"
            order={api.sectionOrder}
            onMove={api.moveSection}
            addButton={<button className="btn-small" onClick={() => api.addItem('education')}>+ Add education</button>}
        />
        {api.resumeData.education.map((edu, idx) => (
            <div key={idx} className="editor-item">
                <div className="item-row">
                    <input
                        placeholder="School / University"
                        value={edu.school || ''}
                        onChange={(e) => api.handleListChange('education', idx, 'school', e.target.value)}
                    />
                    <button className="btn-remove" onClick={() => api.removeItem('education', idx)} aria-label="Remove education entry">×</button>
                </div>
                <input
                    placeholder="Degree"
                    value={edu.degree || ''}
                    onChange={(e) => api.handleListChange('education', idx, 'degree', e.target.value)}
                />
                <div className="form-grid">
                    <input
                        placeholder="Location"
                        value={edu.location || ''}
                        onChange={(e) => api.handleListChange('education', idx, 'location', e.target.value)}
                    />
                    <input
                        placeholder="Date Range"
                        value={edu.date || ''}
                        onChange={(e) => api.handleListChange('education', idx, 'date', e.target.value)}
                    />
                </div>
                <AutoResizeTextarea
                    placeholder="Relevant Coursework"
                    value={edu.coursework || ''}
                    onChange={(e) => api.handleListChange('education', idx, 'coursework', e.target.value)}
                />
            </div>
        ))}
    </section>
);

const ExperienceEditor = ({ api }) => (
    <section className="editor-section" key="experience">
        <SectionHeader
            title="Experience"
            sectionKey="experience"
            order={api.sectionOrder}
            onMove={api.moveSection}
            addButton={<button className="btn-small" onClick={() => api.addItem('experience')}>+ Add</button>}
        />
        {api.resumeData.experience.map((exp, idx) => (
            <div key={idx} className="editor-item">
                <div className="item-row">
                    <input
                        placeholder="Company Name"
                        value={exp.company || ''}
                        onChange={(e) => api.handleListChange('experience', idx, 'company', e.target.value)}
                    />
                    <button className="btn-remove" onClick={() => api.removeItem('experience', idx)} aria-label="Remove experience entry">×</button>
                </div>
                <input
                    placeholder="Job Title"
                    value={exp.role || ''}
                    onChange={(e) => api.handleListChange('experience', idx, 'role', e.target.value)}
                />
                <div className="form-grid">
                    <input
                        placeholder="Location"
                        value={exp.location || ''}
                        onChange={(e) => api.handleListChange('experience', idx, 'location', e.target.value)}
                    />
                    <input
                        placeholder="Date Range"
                        value={exp.date || ''}
                        onChange={(e) => api.handleListChange('experience', idx, 'date', e.target.value)}
                    />
                </div>
                <DescriptionField section="experience" entryIndex={idx} value={exp.description} api={api} />
                <BulletEditor section="experience" entryIndex={idx} bullets={exp.bullets} api={api} />
            </div>
        ))}
    </section>
);

const ProjectsEditor = ({ api }) => (
    <section className="editor-section" key="projects">
        <SectionHeader
            title="Projects"
            sectionKey="projects"
            order={api.sectionOrder}
            onMove={api.moveSection}
            addButton={<button className="btn-small" onClick={() => api.addItem('projects')}>+ Add</button>}
        />
        {api.resumeData.projects.map((proj, idx) => (
            <div key={idx} className="editor-item">
                <div className="item-row">
                    <input
                        placeholder="Project Name"
                        value={proj.name || ''}
                        onChange={(e) => api.handleListChange('projects', idx, 'name', e.target.value)}
                    />
                    <button className="btn-remove" onClick={() => api.removeItem('projects', idx)} aria-label="Remove project entry">×</button>
                </div>
                <input
                    placeholder="Tech Stack (e.g., React, Python, MongoDB)"
                    value={proj.techStack || ''}
                    onChange={(e) => api.handleListChange('projects', idx, 'techStack', e.target.value)}
                />
                <div className="form-grid">
                    <input
                        placeholder="Project Link / URL"
                        value={proj.link || ''}
                        onChange={(e) => api.handleListChange('projects', idx, 'link', e.target.value)}
                    />
                    <input
                        placeholder="Date Range"
                        value={proj.date || ''}
                        onChange={(e) => api.handleListChange('projects', idx, 'date', e.target.value)}
                    />
                </div>
                <DescriptionField section="projects" entryIndex={idx} value={proj.description} api={api} />
                <BulletEditor section="projects" entryIndex={idx} bullets={proj.bullets} api={api} />
            </div>
        ))}
    </section>
);

const SkillsEditor = ({ api }) => (
    <section className="editor-section" key="skills">
        <SectionHeader title="Skills" sectionKey="skills" order={api.sectionOrder} onMove={api.moveSection} addButton={null} />
        <div className="skills-grid">
            <div className="field">
                <label>Languages</label>
                <AutoResizeTextarea
                    value={api.resumeData.skills.languages || ''}
                    placeholder="Programming languages (e.g., Java, Python)"
                    onChange={(e) => api.handleSkillChange('languages', e.target.value)}
                />
            </div>
            <div className="field">
                <label>Technologies</label>
                <AutoResizeTextarea
                    value={api.resumeData.skills.technologies || ''}
                    placeholder="Frameworks & Tools (e.g., React, Spring Boot)"
                    onChange={(e) => api.handleSkillChange('technologies', e.target.value)}
                />
            </div>
            <div className="field">
                <label>Software Dev</label>
                <AutoResizeTextarea
                    value={api.resumeData.skills.development || ''}
                    placeholder="Methodologies & Other (e.g., Agile, CI/CD)"
                    onChange={(e) => api.handleSkillChange('development', e.target.value)}
                />
            </div>
            <div className="field">
                <label>Affiliations</label>
                <AutoResizeTextarea
                    value={api.resumeData.skills.affiliations || ''}
                    placeholder="Clubs, Awards, or Affiliations"
                    onChange={(e) => api.handleSkillChange('affiliations', e.target.value)}
                />
            </div>
            <div className="field">
                <label>Spoken Languages</label>
                <AutoResizeTextarea
                    value={api.resumeData.skills.spokenLanguages || ''}
                    placeholder="Spoken Languages"
                    onChange={(e) => api.handleSkillChange('spokenLanguages', e.target.value)}
                />
            </div>
        </div>
    </section>
);

const ResumeEditor = ({ resume: api }) => {
    const editors = {
        education: <EducationEditor api={api} />,
        experience: <ExperienceEditor api={api} />,
        projects: <ProjectsEditor api={api} />,
        skills: <SkillsEditor api={api} />
    };

    return (
        <div className="resume-editor no-print">
            <div className="editor-header">
                <h2>Resume Editor</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="btn btn-secondary" onClick={api.clearResume}>Start from scratch</button>
                    <button className="btn btn-primary" onClick={api.printResume}>Download PDF</button>
                </div>
            </div>
            <p className="export-hint">Clicking "Download PDF" opens your system's print dialog — choose "Save as PDF" as the destination.</p>

            <PersonalInfoEditor api={api} />
            {api.sectionOrder.map((key) => editors[key])}
        </div>
    );
};

export default ResumeEditor;
