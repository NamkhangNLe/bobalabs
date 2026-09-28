import React from 'react';
import '../styles/main.css';
import { useResume } from '../resume/useResume';
import { useLatexResume } from '../latex/useLatexResume';
import ResumeEditor from '../components/resume/ResumeEditor';
import ResumePreview from '../components/resume/ResumePreview';

/**
 * ResumePage — thin composition. Form state lives in useResume; the real
 * LaTeX compile (preview + download bytes) lives in useLatexResume.
 */
const ResumePage = () => {
    const resume = useResume();
    const latex = useLatexResume(resume.resumeData, resume.sectionOrder, {
        compiledEvent: 'resume_compiled',
    });

    return (
        <div className="resume-maker-container">
            <ResumeEditor resume={resume} latex={latex} />
            <ResumePreview resume={resume} latex={latex} />
        </div>
    );
};

export default ResumePage;
