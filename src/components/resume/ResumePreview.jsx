import React from 'react';

/**
 * ResumePreview — the right-hand document. Shows the actual PDF compiled by
 * the real pdfTeX engine from the form data (via the resume's own LaTeX
 * template). The bytes on screen are exactly the bytes the Download button
 * hands over. While recompiling, the last good PDF stays visible.
 */

const ResumePreview = ({ resume: api, latex }) => {
    const { isExample } = api;
    const { status, pdfUrl, pageCount, error, errorDetail, recompile } = latex;

    const compiling = status === 'compiling';
    const overPage = pageCount != null && pageCount > 1;

    return (
        <div className="resume-preview">
            <div className="preview-header no-print">
                {isExample && <span className="example-badge">Example resume</span>}
                <span className="preview-header-text">
                    {isExample
                        ? "This is sample data — edit any field to make it yours."
                        : "Compiled with real LaTeX as you type."}
                </span>
                {status === 'loading' && <span className="latex-status">Loading LaTeX engine…</span>}
                {compiling && <span className="latex-status">Compiling…</span>}
                {status === 'ready' && pageCount != null && !overPage && (
                    <span className="latex-status latex-ok">1 page ✓</span>
                )}
                {overPage && (
                    <span className="overflow-warning" title="The compiled PDF is longer than one page">
                        {pageCount} pages — over 1 page
                    </span>
                )}
                {status === 'error' && (
                    <button type="button" className="latex-retry" onClick={recompile} title={errorDetail || error}>
                        Compile failed — retry
                    </button>
                )}
            </div>

            <div className="pdf-preview-frame">
                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        title="Compiled resume PDF"
                        className="pdf-preview-iframe"
                    />
                ) : status === 'error' ? (
                    <div className="latex-error-panel">
                        <p className="latex-error-title">Couldn't compile your resume.</p>
                        <pre className="latex-error-log">{errorDetail || error || 'Unknown error.'}</pre>
                        <button type="button" className="latex-retry" onClick={recompile}>
                            Try again
                        </button>
                    </div>
                ) : (
                    <div className="latex-loading-panel">
                        <p>Loading the LaTeX engine…</p>
                        <p className="latex-loading-sub">First load takes a few seconds.</p>
                    </div>
                )}
                {compiling && pdfUrl && <div className="pdf-compiling-veil">Compiling…</div>}
            </div>
        </div>
    );
};

export default ResumePreview;
