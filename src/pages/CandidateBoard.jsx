import React from 'react';
import CandidateCard from '../components/CandidateCard';

const CandidateBoard = () => {
    const candidates = [
        {
            id: 1,
            name: "Alex C.",
            role: "Frontend Architect",
            hype: "Built a design system used by 50k+ devs. Obsessed with accessibility.",
            tags: ["React", "A11y", "System Design"],
            rotation: "rotate-neg-2"
        },
        {
            id: 2,
            name: "Sarah L.",
            role: "Product Engineer",
            hype: "Ex-Founder. Can ship a feature from Figma to Prod in 2 days.",
            tags: ["Fullstack", "Node", "Product Sense"],
            rotation: "rotate-1"
        },
        {
            id: 3,
            name: "Mike T.",
            role: "Backend Scaler",
            hype: "Optimized a Postgres query from 2s to 20ms. Loves Rust.",
            tags: ["Rust", "Postgres", "Infra"],
            rotation: "rotate-3"
        },
        {
            id: 4,
            name: "Jessica W.",
            role: "iOS Craftsperson",
            hype: "Her apps feel like magic. 60fps animations or nothing.",
            tags: ["SwiftUI", "Metal", "Animations"],
            rotation: "rotate-neg-1"
        },
        {
            id: 5,
            name: "David K.",
            role: "Growth Engineer",
            hype: "Hacked a waitlist to 10k users. Data-driven but writes clean code.",
            tags: ["Python", "AB Testing", "Analytics"],
            rotation: "rotate-2"
        }
    ];

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="fade-in" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    Freshly Brewed Talent 🍵
                </h1>
                <p className="fade-in delay-1" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    Vetted by friends. Ready to ship.
                </p>
            </div>

            <div className="fade-in delay-2" style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '3rem',
                padding: '2rem'
            }}>
                {candidates.map(candidate => (
                    <CandidateCard key={candidate.id} {...candidate} />
                ))}
            </div>

            <div style={{
                marginTop: '4rem',
                textAlign: 'center',
                padding: '2rem',
                border: '2px dashed var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-secondary)'
            }}>
                <p>Want to see the full roster?</p>
                <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#ffe4e1', borderRadius: '4px', marginTop: '0.5rem', fontWeight: 'bold', color: '#d65a5a' }}>
                    🔒 15 more candidates hidden
                </div>
            </div>
        </div>
    );
};

export default CandidateBoard;
