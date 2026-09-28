import React, { useState, useRef } from 'react';
import { trackEvent } from '../../analytics';
import { coverToLatex } from '../../cover/coverLatex';
import preambleTex from '../../resume/preamble.tex?raw';

const downloadTextFile = (filename, text) => {
    const blob = new Blob([text], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
};

const Field = ({ label, value, onChange, placeholder }) => (
    <div className="field">
        <label>{label}</label>
        <input
            type="text"
            value={value || ''}
            placeholder={placeholder || ''}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

/**
 * CoverEditor — form for the cover-letter builder. Same export pattern as the
 * resume editor: real LaTeX PDF download, .tex source download, .tex re-upload.
 */
const CoverEditor = ({ cover, latex }) => {
    const [exporting, setExporting] = useState(null);
    const [importError, setImportError] = useState(null);
    const texInputRef = useRef(null);

    const handleExport = (kind) => async () => {
        if (exporting) return;
        if (kind === 'pdf') {
            const name = (cover.coverData.personal.name || 'cover-letter').trim().replace(/\s+/g, '_');
            if (latex.downloadPdf(`${name}_Cover_Letter.pdf`)) {
                trackEvent('cover_letter_pdf_downloaded');
            }
            return;
        }
        setExporting(kind);
        try {
            downloadTextFile('cover-letter.tex', coverToLatex(cover.coverData));
            downloadTextFile('preamble.tex', preambleTex);
            trackEvent('cover_letter_tex_downloaded');
        } finally {
            setExporting(null);
        }
    };

    const handleTexFile = async (e) => {
        const file = e.target.files && e.target.files[0];
        e.target.value = '';
        if (!file) return;
        const err = cover.importTexText(await file.text());
        setImportError(err);
    };

    const pdfReady = latex.status === 'ready' && latex.pdfUrl;
    const pdfBusy = latex.status === 'loading' || latex.status === 'compiling';
    const d = cover.coverData;

    return (
        <div className="resume-editor no-print">
            <div className="editor-header">
                <h2>Cover Letter Editor</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="btn btn-secondary" onClick={cover.clearCover}>Start from scratch</button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => { setImportError(null); texInputRef.current && texInputRef.current.click(); }}
                        title="Re-upload a cover-letter .tex downloaded from Boba Labs"
                    >
                        Upload .tex
                    </button>
                    <input
                        ref={texInputRef}
                        type="file"
                        accept=".tex,text/x-tex"
                        style={{ display: 'none' }}
                        onChange={handleTexFile}
                    />
                    <button
                        className="btn btn-secondary"
                        onClick={handleExport('tex')}
                        disabled={exporting !== null}
                        title="LaTeX source for Overleaf or local compilation"
                    >
                        {exporting === 'tex' ? 'Preparing…' : 'Download .tex'}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleExport('pdf')}
                        disabled={!pdfReady}
                        title="The real LaTeX-compiled PDF — identical to the preview"
                    >
                        {latex.status === 'loading' ? 'Loading LaTeX…' : pdfBusy ? 'Compiling…' : 'Download PDF'}
                    </button>
                </div>
            </div>
            <p className="export-hint">The PDF is compiled with real LaTeX — what you see is what downloads. The .tex files are the full source, ready for Overleaf.</p>
            {importError && <p className="export-error" role="alert">{importError}</p>}

            <section className="editor-section">
                <h3>Your details</h3>
                <Field label="Full name" value={d.personal.name} onChange={(v) => cover.setPersonalField('name', v)} placeholder="Jane Doe" />
                <Field label="Email" value={d.personal.email} onChange={(v) => cover.setPersonalField('email', v)} placeholder="jane@example.com" />
                <Field label="Phone" value={d.personal.phone} onChange={(v) => cover.setPersonalField('phone', v)} placeholder="(555) 123-4567" />
                <Field label="Location" value={d.personal.location} onChange={(v) => cover.setPersonalField('location', v)} placeholder="New York, NY" />
                <Field label="Website" value={d.personal.website} onChange={(v) => cover.setPersonalField('website', v)} placeholder="janedoe.com" />
                <Field label="LinkedIn" value={d.personal.linkedin} onChange={(v) => cover.setPersonalField('linkedin', v)} placeholder="linkedin.com/in/janedoe" />
            </section>

            <section className="editor-section">
                <h3>Recipient</h3>
                <Field label="Date" value={d.date} onChange={(v) => cover.setField('date', v)} />
                <Field label="Recipient name" value={d.recipientName} onChange={(v) => cover.setField('recipientName', v)} placeholder="Hiring Manager" />
                <Field label="Recipient title" value={d.recipientTitle} onChange={(v) => cover.setField('recipientTitle', v)} placeholder="Engineering Manager" />
                <Field label="Company" value={d.company} onChange={(v) => cover.setField('company', v)} placeholder="Acme Corp" />
                <Field label="Company address" value={d.address} onChange={(v) => cover.setField('address', v)} placeholder="123 Main St, New York, NY" />
            </section>

            <section className="editor-section">
                <h3>Letter</h3>
                <Field label="Greeting" value={d.greeting} onChange={(v) => cover.setField('greeting', v)} />
                {d.paragraphs.map((p, i) => (
                    <div className="field" key={i}>
                        <label>Paragraph {i + 1}</label>
                        <textarea
                            value={p}
                            rows={4}
                            placeholder="Why you're a great fit…"
                            onChange={(e) => cover.setParagraph(i, e.target.value)}
                        />
                        <div className="para-actions">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => cover.moveParagraph(i, -1)} disabled={i === 0}>↑</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => cover.moveParagraph(i, 1)} disabled={i === d.paragraphs.length - 1}>↓</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => cover.removeParagraph(i)} disabled={d.paragraphs.length <= 1}>Remove</button>
                        </div>
                    </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={cover.addParagraph}>+ Add paragraph</button>
                <Field label="Closing" value={d.closing} onChange={(v) => cover.setField('closing', v)} />
            </section>
        </div>
    );
};

export default CoverEditor;
