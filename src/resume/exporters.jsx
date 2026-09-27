import React from 'react';
import { trackEvent } from '../analytics';
import { resumeFileName } from './model';

/**
 * One-click resume exports. Both heavy libraries load lazily (dynamic import)
 * so they never bloat the initial bundle — the editor buttons show a brief
 * "Preparing…" state while they load and render.
 */

/** Download a Blob with an anchor click, then release the object URL. */
const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
};

export const downloadResumePdf = async (resumeData, sectionOrder) => {
    trackEvent('resume_exported');
    const [{ pdf }, { default: ResumePdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./ResumePdf.jsx')
    ]);
    const blob = await pdf(
        <ResumePdf resumeData={resumeData} sectionOrder={sectionOrder} />
    ).toBlob();
    triggerDownload(blob, `${resumeFileName(resumeData.personal.name)}.pdf`);
};

export const downloadResumeDocx = async (resumeData, sectionOrder) => {
    trackEvent('resume_exported');
    const { buildResumeDocx } = await import('./resumeDocx.js');
    const blob = await buildResumeDocx(resumeData, sectionOrder);
    triggerDownload(blob, `${resumeFileName(resumeData.personal.name)}.docx`);
};
