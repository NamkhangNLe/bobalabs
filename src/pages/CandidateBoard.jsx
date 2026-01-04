import React from 'react';
import CandidateCard from '../components/CandidateCard';

const CandidateBoard = () => {
    const candidates = [
        {
            id: 3,
            name: "Pau Sum",
            role: "Systems Engineer",
            targetRole: "Kernel Engineering Intern",
            companyType: "Big Tech",
            hype: "GT CS MS. FreeBSD GSoC contributor implementing journaling for ext3/4. Expert in C and OS internals.",
            tags: ["C", "FreeBSD", "Kernel", "File Systems"],
            rotation: "rotate-3",
            image: "/pau.jpeg",
            link: "https://www.linkedin.com/in/pausum"
        },
        {
            id: 2,
            name: "Syaam Khandaker",
            role: "Product Engineer",
            targetRole: "SWE Intern",
            companyType: "Startups / Big Tech",
            hype: "GT CS MS. Founding Engineer @ Phia. Shipped mobile & web infra for YC startups (Overlap, Sellraze). Expert in 0-to-1 product engineering and Ex-Amazon Intern.",
            tags: ["React", "TypeScript", "Node.js", "Python"],
            rotation: "rotate-1",
            image: "/syaam.jpeg",
            link: "https://www.linkedin.com/in/syaamkhandaker"
        },
        {
            id: 1,
            name: "Alex Chen",
            role: "Software Engineer ",
            targetRole: "Backend Engineer",
            companyType: "Big Tech",
            hype: "GT CS (4.0 GPA). TikTok SWE Intern who built Redis-backed propagation layers. Expert in Go, AWS, and Distributed Systems.",
            tags: ["Go", "Distributed Systems", "AWS", "Redis"],
            rotation: "rotate-neg-2",
            image: "/alex.jpeg",
            link: "https://www.linkedin.com/in/ayhschen"
        },
        {
            id: 4,
            name: "Henry Zhang",
            role: "AI Engineer",
            targetRole: "AI SWE / Technical PM",
            companyType: "AI Startups / Big Tech",
            hype: "NYU CS. AI Specialist (ex-Microsoft, Medidata). Built LLM agents, vector search, and MERN apps with continuous deployment.",
            tags: ["AI", "React", "AWS", "LLMs"],
            rotation: "rotate-neg-1",
            image: "/henry.jpeg",
            link: "https://www.linkedin.com/in/henryszhang"
        },
        {
            id: 5,
            name: "Namkhang Le",
            role: "Software Engineer",
            targetRole: "Machine Learning Engineer",
            companyType: "Big Tech",
            hype: "GT CS (AI/ML). Meta AI. Ex-Amazon, Citi, Lockheed Martin Intern. Winner of AI ATL Hackathon. Expert in building agentic AI and full-stack infra.",
            tags: ["Java", "Python", "AWS", "React", "AI"],
            rotation: "rotate-2",
            image: "/namkhang.jpeg",
            link: "https://linkedin.com/in/NamkhangNLe"
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
