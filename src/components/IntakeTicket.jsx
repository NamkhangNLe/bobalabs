import React, { useState } from 'react';

const STEPS = [
    { label: 'About You', icon: '👤' },
    { label: 'Your Goals', icon: '🎯' },
    { label: 'Your Pitch', icon: '🚀' },
];

const IntakeTicket = () => {
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        targetRole: '',
        companyType: '',
        hype: ''
    });

    const update = (field, value) => setFormData({ ...formData, [field]: value });

    const canAdvance = () => {
        if (step === 0) return formData.name.trim() && formData.role.trim();
        if (step === 1) return formData.targetRole.trim() && formData.companyType.trim();
        return true;
    };

    const handleSubmit = () => {
        const subject = encodeURIComponent(`Boba Labs Vouch Request: ${formData.name}`);
        const body = encodeURIComponent(
            `New Vouch Order Received! 🍵\n\n` +
            `SERVER (NAME): ${formData.name}\n` +
            `INGREDIENTS (CURRENT ROLE): ${formData.role}\n` +
            `DESIRED BREW (TARGET ROLE): ${formData.targetRole}\n` +
            `CAFE TYPE (COMPANIES): ${formData.companyType}\n\n` +
            `SPECIAL REQUESTS (PITCH):\n${formData.hype}\n\n` +
            `--- Sent via Boba Labs ---`
        );
        window.location.href = `mailto:Namkhangnle@hotmail.com?subject=${subject}&body=${body}`;
        setSubmitted(true);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.9rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--glass-border)',
        background: 'rgba(255, 255, 255, 0.6)',
        fontSize: '1rem',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.2s ease',
        outline: 'none',
    };

    const labelStyle = {
        fontWeight: 600,
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '0.4rem',
        display: 'block',
    };

    if (submitted) {
        return (
            <div className="container" style={{
                minHeight: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
            }}>
                <div className="fade-in-up" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '4rem 3rem',
                    textAlign: 'center',
                    maxWidth: '500px',
                    border: '1px solid var(--glass-border)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 style={{ fontFamily: "'Fredoka', sans-serif", marginBottom: '0.5rem' }}>
                        You're All Set!
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        Your vouch request has been brewed and sent. We'll review your profile and get back to you soon!
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                        Check your email client to complete sending the request.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{
            minHeight: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
        }}>
            <div className="fade-in-up" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: 'var(--radius-lg)',
                padding: '3rem',
                width: '100%',
                maxWidth: '560px',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}>
                <h2 style={{
                    textAlign: 'center',
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: '1.8rem',
                    marginBottom: '0.4rem',
                }}>
                    Join the Network ☕
                </h2>
                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    Tell us about yourself and get vouched for.
                </p>

                {/* Step Progress Bar */}
                <div className="form-stepper">
                    <div className="step-connector-line">
                        <div className="step-connector-fill" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
                    </div>
                    {STEPS.map((s, i) => (
                        <div key={i} className="form-step-indicator">
                            <div className={`form-step-dot ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
                                {i < step ? '✓' : s.icon}
                            </div>
                            <span className={`form-step-label ${i === step ? 'active' : ''}`}>{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div style={{ minHeight: '200px' }}>

                    {/* Step 0: About You */}
                    {step === 0 && (
                        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => update('name', e.target.value)}
                                    style={inputStyle}
                                    placeholder="e.g. Namkhang Le"
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Current Role / Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role}
                                    onChange={e => update('role', e.target.value)}
                                    style={inputStyle}
                                    placeholder="e.g. Frontend Engineer, CS Student"
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 1: Your Goals */}
                    {step === 1 && (
                        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Target Role</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.targetRole}
                                    onChange={e => update('targetRole', e.target.value)}
                                    style={inputStyle}
                                    placeholder="e.g. Senior Product Lead, ML Engineer"
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Company Type</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.companyType}
                                    onChange={e => update('companyType', e.target.value)}
                                    style={inputStyle}
                                    placeholder="e.g. Series B Fintech, Big Tech"
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Your Pitch */}
                    {step === 2 && (
                        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Why Should We Vouch For You?</label>
                                <textarea
                                    value={formData.hype}
                                    onChange={e => update('hype', e.target.value)}
                                    style={{
                                        ...inputStyle,
                                        minHeight: '140px',
                                        resize: 'vertical',
                                    }}
                                    placeholder="Tell us your story — what makes you awesome? Projects, experience, superpowers..."
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: step > 0 ? 'space-between' : 'flex-end',
                    marginTop: '2rem',
                    gap: '1rem',
                }}>
                    {step > 0 && (
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="btn btn-glass"
                            style={{ padding: '0.7rem 1.5rem' }}
                        >
                            ← Back
                        </button>
                    )}

                    {step < STEPS.length - 1 ? (
                        <button
                            type="button"
                            onClick={() => canAdvance() && setStep(step + 1)}
                            className="btn btn-primary"
                            style={{
                                padding: '0.7rem 1.5rem',
                                opacity: canAdvance() ? 1 : 0.5,
                                cursor: canAdvance() ? 'pointer' : 'not-allowed',
                            }}
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn btn-primary"
                            style={{ padding: '0.7rem 2rem' }}
                        >
                            Submit Request ☕
                        </button>
                    )}
                </div>

                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    opacity: 0.6,
                }}>
                    ✨ Guaranteed Fresh • 100% Human-Reviewed
                </p>
            </div>
        </div>
    );
};

export default IntakeTicket;
