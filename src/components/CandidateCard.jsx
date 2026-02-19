import React from 'react';

const CandidateCard = ({ name, role, hype, tags, targetRole, companyType, link, image }) => {
    const CardContent = (
        <div className="candidate-card-v2">
            {/* Avatar */}
            <div className="candidate-avatar">
                {image ? (
                    <img
                        src={image}
                        alt={`${name} profile`}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem',
                    }}>
                        {['🐻', '🐼', '🐨', '🐸', '🐱', '🦄'][name.length % 6]}
                    </div>
                )}
                <span className="candidate-badge">✓ Vetted</span>
            </div>

            {/* Info */}
            <div>
                <h3 style={{
                    margin: '0 0 0.15rem 0',
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: '1.3rem',
                }}>{name}</h3>
                <p style={{
                    margin: 0,
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                }}>
                    {role}
                </p>
            </div>

            {/* Target */}
            <div style={{
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #fefce8, #fef9c3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(234, 179, 8, 0.2)',
            }}>
                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Target Brew
                </p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {targetRole} <span style={{ opacity: 0.4 }}>at</span> {companyType}
                </p>
            </div>

            {/* Pitch */}
            <p style={{
                fontSize: '0.88rem',
                lineHeight: 1.5,
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                margin: 0,
            }}>
                "{hype}"
            </p>

            {/* Tags */}
            <div className="candidate-tags">
                {tags.map(tag => (
                    <span key={tag} className="candidate-tag">{tag}</span>
                ))}
            </div>
        </div>
    );

    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                {CardContent}
            </a>
        );
    }

    return CardContent;
};

export default CandidateCard;
