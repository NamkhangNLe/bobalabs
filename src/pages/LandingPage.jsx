import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    return (
        <div className="landing-page">
            <section style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(255, 183, 197, 0.25) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: -1
                }} />

                <h1 className="fade-in" style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                    Hiring is broken.<br />
                    <span className="text-gradient">Trust is the currency.</span>
                </h1>

                <p className="fade-in delay-1" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem' }}>
                    Stop filtering through thousands of applications. Access a closed network of high-caliber engineers, vetted by peers you trust.
                </p>

                <div className="fade-in delay-2" style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/board" className="btn btn-primary">I'm Hiring</Link>
                    <Link to="/apply" className="btn btn-glass">I want to be Vetted</Link>
                </div>
            </section>

            <section className="container" style={{ padding: '5rem 0', borderTop: '1px solid var(--glass-border)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How it works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="glass-card">
                        <h3 className="text-gradient">1. Vetted by Peers</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>No automated tests. Candidates are vouched for by senior engineers in the network.</p>
                    </div>
                    <div className="glass-card">
                        <h3 className="text-gradient">2. Anonymous First</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Browse candidates by merit and vouch strength, not just logos. Request intros when interested.</p>
                    </div>
                    <div className="glass-card">
                        <h3 className="text-gradient">3. Direct Connection</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Skip the recruiter spam. Connect directly with talent that is ready to move.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
