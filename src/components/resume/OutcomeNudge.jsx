import React, { useState } from 'react';
import { trackEvent } from '../../analytics';

const STORAGE_KEY = 'bobalabs-outcome-reported';

/**
 * OutcomeNudge — the only way we learn about real-world results.
 * Explicitly self-reported: "Yes" fires outcome_reported and never asks
 * again; "Not yet" just hides it until the next visit. No inference, ever.
 */
const OutcomeNudge = () => {
    const [hidden, setHidden] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) === '1';
        } catch {
            return false;
        }
    });
    if (hidden) return null;

    const celebrate = () => {
        try {
            localStorage.setItem(STORAGE_KEY, '1');
        } catch {
            /* storage blocked — still celebrate */
        }
        trackEvent('outcome_reported', { got_outcome: true });
        setHidden(true);
    };

    return (
        <section className="editor-section">
            <p style={{ margin: '0 0 0.25rem 0' }}><strong>Got an interview or offer? Tell us 🎉</strong></p>
            <p className="ats-blurb">Self-reported — we only count what you tell us.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={celebrate}>Yes 🎉</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setHidden(true)}>Not yet</button>
            </div>
        </section>
    );
};

export default OutcomeNudge;
