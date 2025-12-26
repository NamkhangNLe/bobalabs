import React from 'react';

const CandidateCard = ({ name, role, hype, tags, rotation, targetRole, companyType, emoji, link }) => {
    const CardContent = (
        <div className={`sticker ${rotation}`} style={{
            background: 'white',
            padding: '1rem 1rem 3rem 1rem', // Extra bottom padding for Polaroid look
            borderRadius: '4px',
            boxShadow: 'var(--shadow-sticker)',
            maxWidth: '300px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            transition: 'transform 0.2s',
            cursor: 'pointer',
            height: '100%',
            color: 'inherit',
            textDecoration: 'none'
        }}>
            {/* "Photo" Area */}
            <div style={{
                background: '#f0f0f0',
                height: '220px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                border: '1px solid #ddd'
            }}>
                {/* Use provided emoji or fallback to random logic */}
                {emoji || ['🐻', '🐼', '🐨', '🐸', '🐱', '🦄'][name.length % 6]}
            </div>

            {/* Content */}
            <div style={{ padding: '0 0.5rem' }}>
                <h3 style={{ margin: '0 0 0.2rem 0', fontFamily: "'Fredoka', sans-serif" }}>{name}</h3>
                <p style={{
                    margin: 0,
                    color: 'var(--text-secondary)',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {role}
                </p>

                {/* Target Section */}
                <div style={{
                    marginTop: '1.2rem',
                    padding: '0.8rem',
                    background: '#fdfbf7',
                    border: '1px dashed #d4bf97',
                    borderRadius: '8px'
                }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold', color: '#8b6e4e' }}>TARGET BREW:</p>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {targetRole} <span style={{ opacity: 0.5 }}>at</span> {companyType}
                    </p>
                </div>

                <p style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: '1.4', fontStyle: 'italic' }}>
                    "{hype}"
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                    {tags.map(tag => (
                        <span key={tag} style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            background: 'var(--bg-primary)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--glass-border)'
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Vetted Stamp */}
            <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                border: '3px solid #ff6b6b',
                color: '#ff6b6b',
                padding: '0.2rem 0.5rem',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                transform: 'rotate(-15deg)',
                opacity: 0.8,
                pointerEvents: 'none',
                fontFamily: "'Courier New', monospace"
            }}>
                VETTED
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
