import React, { useState } from 'react';

const IntakeTicket = () => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        hype: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Order Received! We'll brew your profile, ${formData.name}. 🍵`);
    };

    return (
        <div className="container" style={{
            minHeight: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <div className="sticker rotate-neg-1" style={{
                background: '#fff',
                width: '100%',
                maxWidth: '500px',
                padding: '2rem',
                backgroundImage: 'repeating-linear-gradient(#f0f0f0 0 1px, transparent 1px 100%)',
                backgroundSize: '100% 2rem',
                lineHeight: '2rem',
                position: 'relative'
            }}>
                {/* Ticket Hole */}
                <div style={{
                    width: '20px',
                    height: '20px',
                    background: 'var(--bg-primary)',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }} />

                <h2 style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem', fontFamily: "'Courier New', monospace", textTransform: 'uppercase' }}>
                    Order Ticket #001
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    <div className="form-group">
                        <label style={{ fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>SERVER (YOUR NAME):</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{
                                width: '100%',
                                border: 'none',
                                borderBottom: '2px solid #000',
                                background: 'transparent',
                                fontSize: '1.2rem',
                                padding: '0.5rem 0',
                                fontFamily: "'Courier New', monospace"
                            }}
                            placeholder="e.g. Namkhang Le"
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>INGREDIENTS (ROLE):</label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            style={{
                                width: '100%',
                                border: 'none',
                                borderBottom: '2px solid #000',
                                background: 'transparent',
                                fontSize: '1.2rem',
                                padding: '0.5rem 0',
                                fontFamily: "'Courier New', monospace"
                            }}
                            placeholder="e.g. Frontend Wizard"
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>SPECIAL REQUESTS (PITCH):</label>
                        <textarea
                            value={formData.hype}
                            onChange={(e) => setFormData({ ...formData, hype: e.target.value })}
                            style={{
                                width: '100%',
                                border: 'none',
                                background: 'rgba(0,0,0,0.05)',
                                fontSize: '1rem',
                                padding: '1rem',
                                fontFamily: "'Courier New', monospace",
                                minHeight: '100px',
                                resize: 'none',
                                marginTop: '0.5rem'
                            }}
                            placeholder="Why should we vouch for you?"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                        SUBMIT ORDER
                    </button>

                </form>

                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '0.8rem',
                    opacity: 0.6
                }}>
                    * Guaranteed Fresh
                </div>
            </div>
        </div>
    );
};

export default IntakeTicket;
