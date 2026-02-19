import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* Simple animated counter hook */
const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                let start = 0;
                const step = Math.ceil(end / (duration / 16));
                const timer = setInterval(() => {
                    start += step;
                    if (start >= end) { setCount(end); clearInterval(timer); }
                    else setCount(start);
                }, 16);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return [count, ref];
};

const LandingPage = () => {
    const [candidates, candidatesRef] = useCounter(50);
    const [companies, companiesRef] = useCounter(15);
    const [vetted, vettedRef] = useCounter(100);

    return (
        <div style={{ overflow: 'hidden' }}>

            {/* ===== HERO ===== */}
            <section className="container" style={{
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                padding: '4rem 2rem',
            }}>
                {/* Background blob */}
                <div style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(236, 72, 153, 0.08) 40%, transparent 70%)',
                    zIndex: -1,
                    borderRadius: '50%',
                }} />

                {/* Floating emojis */}
                <span className="floating-emoji" style={{ top: '15%', left: '10%', animationDelay: '0s' }}>🍵</span>
                <span className="floating-emoji" style={{ top: '25%', right: '12%', animationDelay: '1s', fontSize: '1.6rem' }}>🧋</span>
                <span className="floating-emoji" style={{ bottom: '20%', left: '15%', animationDelay: '2s', fontSize: '1.4rem' }}>✨</span>
                <span className="floating-emoji" style={{ bottom: '30%', right: '10%', animationDelay: '3s' }}>🤝</span>
                <span className="floating-emoji" style={{ top: '45%', left: '5%', animationDelay: '4s', fontSize: '1.3rem' }}>💼</span>

                <div className="fade-in-up">
                    <h1 className="hero-gradient-text" style={{ marginBottom: '1.5rem' }}>
                        Friends {'>'}<br />Algorithms
                    </h1>
                </div>

                <p className="fade-in-up delay-1" style={{
                    fontSize: '1.3rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '520px',
                    lineHeight: 1.6,
                    marginBottom: '2.5rem',
                }}>
                    Skip the resume black hole. Get referred by someone who actually knows you — and actually vouches for you.
                </p>

                <div className="fade-in-up delay-2" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/apply" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                        Join the Network 🚀
                    </Link>
                    <Link to="/board" className="btn btn-glass" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                        View Talent Board
                    </Link>
                </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <section className="container fade-in-up" style={{ padding: '0 2rem', marginTop: '-2rem' }}>
                <div className="stats-bar">
                    <div className="stat-item" ref={candidatesRef}>
                        <div className="stat-number">{candidates}+</div>
                        <div className="stat-label">Candidates</div>
                    </div>
                    <div className="stat-item" ref={companiesRef}>
                        <div className="stat-number">{companies}+</div>
                        <div className="stat-label">Partner Companies</div>
                    </div>
                    <div className="stat-item" ref={vettedRef}>
                        <div className="stat-number">{vetted}%</div>
                        <div className="stat-label">Human-Vetted</div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="container section-gap" style={{ padding: '0 2rem' }}>
                <h2 className="fade-in-up" style={{
                    textAlign: 'center',
                    fontSize: '2.4rem',
                    fontFamily: "'Fredoka', sans-serif",
                    marginBottom: '0.6rem',
                }}>
                    How It Works
                </h2>
                <p className="fade-in-up delay-1" style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    marginBottom: '3rem',
                    fontSize: '1.1rem',
                }}>
                    Three simple steps to your next opportunity.
                </p>

                <div className="steps-container">
                    <div className="step-card fade-in-up delay-1">
                        <div className="step-number">1</div>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>📝</div>
                        <h3 style={{ marginBottom: '0.5rem', fontFamily: "'Fredoka', sans-serif" }}>Apply</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            Tell us about yourself — your skills, your goals, and why you're awesome.
                        </p>
                        <div className="step-connector" />
                    </div>

                    <div className="step-card fade-in-up delay-2">
                        <div className="step-number">2</div>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🤝</div>
                        <h3 style={{ marginBottom: '0.5rem', fontFamily: "'Fredoka', sans-serif" }}>Get Vouched</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            A friend in our network personally vouches for your skills and character.
                        </p>
                        <div className="step-connector" />
                    </div>

                    <div className="step-card fade-in-up delay-3">
                        <div className="step-number">3</div>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🚀</div>
                        <h3 style={{ marginBottom: '0.5rem', fontFamily: "'Fredoka', sans-serif" }}>Get Referred</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            We connect you directly with hiring managers. No ATS, no black holes.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section className="container section-gap" style={{ padding: '0 2rem' }}>
                <h2 className="fade-in-up" style={{
                    textAlign: 'center',
                    fontSize: '2.4rem',
                    fontFamily: "'Fredoka', sans-serif",
                    marginBottom: '0.6rem',
                }}>
                    Why Boba Labs?
                </h2>
                <p className="fade-in-up delay-1" style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    marginBottom: '3rem',
                    fontSize: '1.1rem',
                }}>
                    We're not another job board. We're your friends who happen to know people.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                }}>
                    <div className="feature-card fade-in-up delay-1">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' }}>🤝</div>
                        <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginBottom: '0.6rem' }}>Vetted by Humans</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            No AI filtering. Just real recommendations from engineers who trust you and your work.
                        </p>
                    </div>

                    <div className="feature-card fade-in-up delay-2">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' }}>📨</div>
                        <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginBottom: '0.6rem' }}>Direct to Inbox</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Skip the ATS. We send your profile directly to hiring managers' DMs. Straight to the top.
                        </p>
                    </div>

                    <div className="feature-card fade-in-up delay-3">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>🍵</div>
                        <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginBottom: '0.6rem' }}>The Daily Brew</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Fresh career advice and industry tea served daily. No corporate fluff, just real talk.
                        </p>
                    </div>

                    <div className="feature-card fade-in-up delay-4">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>⚡</div>
                        <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginBottom: '0.6rem' }}>Lightning Fast</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Average time from vouch to first interview: 5 days. We move fast because talent doesn't wait.
                        </p>
                    </div>

                    <div className="feature-card fade-in-up delay-5">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' }}>🎯</div>
                        <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginBottom: '0.6rem' }}>Role Matching</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            We don't spam. We match your skills and goals with roles that actually make sense for you.
                        </p>
                    </div>

                    <div className="feature-card fade-in-up delay-6">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #ffedd5, #fed7aa)' }}>🔒</div>
                        <h3 style={{ fontFamily: "'Fredoka', sans-serif", marginBottom: '0.6rem' }}>Privacy First</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Your profile is only shared with companies you approve. Full control, always.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== CTA BANNER ===== */}
            <section className="container section-gap" style={{ padding: '0 2rem' }}>
                <div className="fade-in-up" style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-20%',
                        width: '400px',
                        height: '400px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '50%',
                    }} />
                    <h2 style={{
                        fontSize: '2.4rem',
                        fontFamily: "'Fredoka', sans-serif",
                        marginBottom: '1rem',
                        color: 'white',
                        position: 'relative',
                    }}>
                        Ready to Get Brewed? ☕
                    </h2>
                    <p style={{
                        fontSize: '1.15rem',
                        opacity: 0.9,
                        maxWidth: '480px',
                        margin: '0 auto 2rem',
                        lineHeight: 1.6,
                        position: 'relative',
                    }}>
                        Join 50+ candidates who've already skipped the resume black hole. Your next opportunity is one vouch away.
                    </p>
                    <Link to="/apply" className="btn" style={{
                        background: 'white',
                        color: '#6366f1',
                        padding: '0.9rem 2.5rem',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        position: 'relative',
                    }}>
                        Join the Network →
                    </Link>
                </div>
            </section>

            <div style={{ height: '2rem' }} />
        </div>
    );
};

export default LandingPage;
