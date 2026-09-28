import React from 'react';
import '../styles/main.css';
import { useResume } from '../resume/useResume';
import { useCoverLetter } from '../cover/useCoverLetter';
import { useLatexResume } from '../latex/useLatexResume';
import { coverToLatex } from '../cover/coverLatex';
import CoverEditor from '../components/cover/CoverEditor';
import CoverPreview from '../components/cover/CoverPreview';

/**
 * CoverPage — thin composition. Form state lives in useCoverLetter (seeding
 * contact details from the resume when available); the real LaTeX compile
 * reuses useLatexResume with the cover-letter generator.
 */
const CoverPage = () => {
    const resume = useResume();
    const cover = useCoverLetter(resume.resumeData.personal);
    const latex = useLatexResume(cover.coverData, null, {
        toLatex: (data) => coverToLatex(data),
        mainFile: 'cover-letter.tex',
        compiledEvent: 'cover_letter_compiled',
    });

    return (
        <div className="resume-maker-container">
            <CoverEditor cover={cover} latex={latex} />
            <CoverPreview latex={latex} />
        </div>
    );
};

export default CoverPage;
