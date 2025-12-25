import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="container" style={{ padding: '4rem 2rem', overflow: 'hidden' }}>

            {/* Scattered Hero Section */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                minHeight: '80vh',
                justifyContent: 'center'
            }}>
                {/* Background Blob */}
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '700px',
                    height: '700px',
                    background: 'radial-gradient(circle, rgba(255, 183, 197, 0.3) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: -1
                }} />

                {/* Main Sticker Title */}
                <div className="sticker rotate-neg-2 fade-in" style={{
                    background: '#fff',
                    padding: '2rem 4rem',
                    borderRadius: '50px',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        fontSize: '4.5rem',
                        margin: 0,
                        lineHeight: 1,
                        color: 'var(--text-primary)'
                    }}>
                        Friends <br />
                        <span style={{ color: 'var(--accent-secondary)' }}>&gt;</span> Algorithms
                    </h1>
                </div>

                {/* Subtitle Note */}
                <div className="rotate-3 fade-in delay-1" style={{
                    background: '#FFF0F5',
                    padding: '1.5rem',
                    maxWidth: '500px',
                    boxShadow: 'var(--shadow-sm)',
                    transform: 'rotate(2deg)',
                    marginBottom: '3rem'
                }}>
                    <p style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-secondary)' }}>
                        Skip the resume black hole. Get referred by someone who actually knows you.
                    </p>
                </div>

                {/* CTA Buttons - Scattered */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/apply" className="btn btn-primary rotate-neg-1 sticker">
                        Join the Network
                    </Link>
                    <Link to="/board" className="btn btn-glass rotate-2" style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}>
                        View Board
                    </Link>
                </div>
            </div>

            {/* Features (Sticky Notes) */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '3rem',
                marginTop: '4rem'
            }}>
                <div className="glass-card rotate-1 sticker" style={{ flex: '1 1 300px', maxWidth: '350px', background: '#fff' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                    <h3>Vetted by Humans</h3>
                    <p>No AI filtering. Just real recommendations from engineers who trust you.</p>
                </div>

                <div className="glass-card rotate-neg-2 sticker" style={{ flex: '1 1 300px', maxWidth: '350px', background: '#F0F8FF' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📨</div>
                    <h3>Direct to Inbox</h3>
                    <p>Skip the ATS. We send your profile directly to hiring managers' DMs.</p>
                </div>

                <div className="glass-card rotate-2 sticker" style={{ flex: '1 1 300px', maxWidth: '350px', background: '#FFF0F5' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍵</div>
                    <h3>The Daily Brew</h3>
                    <p>Get fresh career advice and industry tea. No corporate fluff.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
