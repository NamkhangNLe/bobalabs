import React from 'react';

const CandidateCard = ({ name, role, hype, tags, rotation }) => {
    return (
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
            cursor: 'pointer'
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
                {/* Random Boba/Animal Emoji based on name length to be deterministic-ish */}
                {['🐻', '🐼', '🐨', '🐸', '🐱', '🦄'][name.length % 6]}
            </div>

            {/* Content */}
            <div style={{ padding: '0 0.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: "'Fredoka', sans-serif" }}>{name}</h3>
                <p style={{
                    margin: 0,
                    color: 'var(--text-secondary)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {role}
                </p>
                <p style={{ marginTop: '1rem', fontSize: '0.95rem', lineHeight: '1.4' }}>
                    "{hype}"
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                    {tags.map(tag => (
                        <span key={tag} style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.6rem',
                            background: 'var(--bg-primary)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)'
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
};

export default CandidateCard;
