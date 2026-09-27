import React from 'react';
import useResume from '../resume/useResume';
import ResumeEditor from '../components/resume/ResumeEditor';
import ResumePreview from '../components/resume/ResumePreview';

/**
 * ResumePage — thin composition shell.
 * All resume state lives in useResume; the editor and preview share it.
 */
const ResumePage = () => {
    const resume = useResume();

    return (
        <div className="resume-maker-container">
            <ResumeEditor resume={resume} />
            <ResumePreview resume={resume} />
        </div>
    );
};

export default ResumePage;
