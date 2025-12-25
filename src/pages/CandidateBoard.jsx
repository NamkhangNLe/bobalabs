import React, { useState } from 'react'

const MOCK_CANDIDATES = [
    {
        id: 1,
        role: "Senior Staff Engineer",
        stack: "React, Node, Go",
        experience: "12 years",
        vouch: "Built the payment infrastructure at UnicornCorp. Absolute rockstar at scaling systems.",
        vouchedBy: "Ex-CTO of FintechCo"
    },
    {
        id: 2,
        role: "Founding Product Designer",
        stack: "Figma, React, Design Systems",
        experience: "8 years",
        vouch: "Designed the app that won Apple Design Award 2023. Fast execution.",
        vouchedBy: "Product Lead at BigTech"
    },
    {
        id: 3,
        role: "Machine Learning Engineer",
        stack: "Python, PyTorch, LLMs",
        experience: "5 years",
        vouch: "Top contributor to open source LLM libraries. Deep theoretical & practical knowledge.",
        vouchedBy: "Research Scientist at AI Lab"
    }
]

const CandidateBoard = () => {
    const [candidates] = useState(MOCK_CANDIDATES)

    return (
        <div className="container" style={{ padding: '3rem 0' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Vetted Talent Pool</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Only the top 1% of peer-reviewed candidates.</p>
                </div>
                <div className="btn btn-glass">Filter: All Roles</div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {candidates.map(candidate => (
                    <div key={candidate.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>{candidate.role}</h3>
                            <span style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>{candidate.stack}</span>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{candidate.vouch}"</p>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-primary)', opacity: 0.7 }}>
                                — Vouched by {candidate.vouchedBy}
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                            <button className="btn btn-primary" style={{ width: '100%' }}>Request Intro</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CandidateBoard
