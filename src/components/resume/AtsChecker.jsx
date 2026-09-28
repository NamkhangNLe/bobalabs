import React, { useState } from 'react';
import { trackEvent } from '../../analytics';
import { runAtsChecks } from '../../resume/atsCheck';

const STATUS_ICON = { pass: '✓', warn: '!', fail: '✗' };
const STATUS_CLASS = { pass: 'ats-pass', warn: 'ats-warn', fail: 'ats-fail' };

/**
 * AtsChecker — runs the ATS/score check against the actually-compiled PDF
 * bytes and shows honest, verifiable signals. Collapsed until run.
 */
const AtsChecker = ({ latex }) => {
    const [state, setState] = useState(null); // null | { running } | { score, checks } | { error }

    const run = async () => {
        const bytes = latex.getPdfBytes ? latex.getPdfBytes() : null;
        if (!bytes) return;
        setState({ running: true });
        try {
            const result = await runAtsChecks(bytes, latex.pageCount);
            setState(result);
            // Analytics: the score only — never resume content.
            trackEvent('ats_check_completed', { score: result.score });
        } catch (e) {
            setState({ error: 'Could not analyze the PDF — try again.' });
        }
    };

    const ready = latex.status === 'ready' && latex.getPdfBytes && latex.getPdfBytes();

    return (
        <section className="editor-section ats-section">
            <h3>ATS score</h3>
            <p className="ats-blurb">
                Checks what applicant-tracking parsers actually see in your compiled PDF —
                real text extraction, page count, contact info, standard headers.
            </p>
            {!state && (
                <button className="btn btn-secondary" onClick={run} disabled={!ready}>
                    {ready ? 'Check my resume' : 'Compile first…'}
                </button>
            )}
            {state && state.running && <p className="ats-blurb">Analyzing your PDF…</p>}
            {state && state.error && (
                <div>
                    <p className="export-error" role="alert">{state.error}</p>
                    <button className="btn btn-secondary" onClick={run}>Try again</button>
                </div>
            )}
            {state && state.checks && (
                <div>
                    <div className="ats-score-row">
                        <span className="ats-score">{state.score}</span>
                        <span className="ats-score-label">/ 100</span>
                        <button className="btn btn-secondary btn-sm" onClick={run} style={{ marginLeft: 'auto' }}>
                            Re-check
                        </button>
                    </div>
                    <ul className="ats-checks">
                        {state.checks.map((c) => (
                            <li key={c.id} className={`ats-check ${STATUS_CLASS[c.status]}`}>
                                <span className="ats-icon">{STATUS_ICON[c.status]}</span>
                                <div>
                                    <strong>{c.label}</strong>
                                    <p>{c.detail}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};

export default AtsChecker;
