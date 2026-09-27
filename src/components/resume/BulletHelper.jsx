import React, { useState } from "react";
import { QUESTIONS, assembleBullet } from "../../resume/bulletGuide";
import AutoResizeTextarea from "./AutoResizeTextarea";

/**
 * BulletHelper — "Help me write this".
 *
 * A 4-question stepper that secretly IS the XYZ formula: the kid learns it
 * by answering. Deterministic assembly, no AI. Closing (×, cancel, or
 * clicking outside) inserts nothing; "Use this bullet" hands the assembled
 * text back to the entry.
 */
const BulletHelper = ({ section, onUse, onClose }) => {
    const questions = QUESTIONS[section] || QUESTIONS.experience;
    // Steps 0-3: questions. Step 4: review the assembled bullet.
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState(["", "", "", ""]);
    const [draft, setDraft] = useState("");

    const setAnswer = (value) => {
        setAnswers((prev) => {
            const next = [...prev];
            next[step] = value;
            return next;
        });
    };

    const goNext = () => {
        if (step < 3) {
            setStep(step + 1);
            return;
        }
        // Q2 is the number, Q3 the scale fallback — use whichever was answered.
        const y = [answers[1], answers[2]].filter((s) => s.trim()).join("; ");
        setDraft(assembleBullet({ x: answers[0], y, z: answers[3] }));
        setStep(4);
    };

    const goBack = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <div className="bullet-helper-overlay" onClick={onClose}>
            <div
                className="bullet-helper-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Help me write this bullet"
            >
                <div className="bullet-helper-head">
                    <div>
                        <h4>✨ Help me write this</h4>
                        <p className="bullet-helper-sub">
                            Answer 4 quick questions — we&apos;ll turn them into a strong bullet.
                        </p>
                    </div>
                    <button className="btn-remove" onClick={onClose} aria-label="Close" title="Close">
                        ×
                    </button>
                </div>

                <div className="bullet-helper-steps" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <span
                            key={i}
                            className={`helper-dot${i === step ? " active" : ""}${i < step ? " done" : ""}`}
                        />
                    ))}
                </div>

                {step < 4 ? (
                    <div className="bullet-helper-body">
                        <p className="helper-tag">{questions[step].tag}</p>
                        <label className="helper-question">{questions[step].question}</label>
                        <AutoResizeTextarea
                            value={answers[step]}
                            placeholder={`e.g. "${questions[step].placeholder}"`}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                        <div className="bullet-helper-nav">
                            <button className="btn-small" onClick={goBack} disabled={step === 0}>
                                ← Back
                            </button>
                            <button className="btn-small btn-primary-small" onClick={goNext}>
                                {step === 3 ? "Build my bullet →" : "Next →"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bullet-helper-body">
                        <p className="helper-tag">Review — tweak anything, then use it</p>
                        <AutoResizeTextarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                        />
                        <div className="bullet-helper-nav">
                            <button className="btn-small" onClick={goBack}>
                                ← Back
                            </button>
                            <button
                                className="btn-small btn-primary-small"
                                onClick={() => onUse(draft)}
                                disabled={!draft.trim()}
                            >
                                Use this bullet
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulletHelper;
