import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CandidateCard from '../components/CandidateCard';
import { candidates } from '../data/candidates';

const CandidateBoard = () => {
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState('All');



    /* Collect all unique tags */
    const allTags = useMemo(() => {
        const s = new Set();
        candidates.forEach(c => c.tags.forEach(t => s.add(t)));
        return ['All', ...Array.from(s).sort()];
    }, []);

    /* Filter logic */
    const filtered = useMemo(() => {
        return candidates.filter(c => {
            const q = search.toLowerCase();
            const matchesSearch = !q ||
                c.name.toLowerCase().includes(q) ||
                c.role.toLowerCase().includes(q) ||
                c.tags.some(t => t.toLowerCase().includes(q));
            const matchesTag = activeTag === 'All' || c.tags.includes(activeTag);
            return matchesSearch && matchesTag;
        });
    }, [search, activeTag]);

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 className="fade-in-up" style={{
                    fontSize: '3rem',
                    marginBottom: '0.6rem',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    Meet the network.
                </h1>
                <p className="fade-in-up delay-1" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
                    People and the work they do. Find someone to connect with.
                </p>
            </div>

            {/* Search */}
            <div className="search-bar fade-in-up delay-1">
                <span className="search-icon">🔍</span>
                <input
                    aria-label="Search candidates"
                    type="text"
                    placeholder="Search by name, role, or skill..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Tag Filters */}
            <div className="fade-in-up delay-2" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center',
                marginBottom: '3rem',
            }}>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        aria-pressed={activeTag === tag}
                        onClick={() => setActiveTag(tag)}
                        className="category-pill"
                        style={{
                            background: activeTag === tag
                                ? '#1c2420'
                                : 'rgba(255,255,255,0.7)',
                            color: activeTag === tag ? 'white' : 'var(--text-secondary)',
                            border: activeTag === tag ? 'none' : '1px solid var(--glass-border)',
                            padding: '0.4rem 1rem',
                            borderRadius: '999px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '2rem',
                justifyItems: 'center',
            }}>
                {filtered.map((candidate, i) => (
                    <div
                        key={candidate.id}
                        className="fade-in-up"
                        style={{ animationDelay: `${i * 0.08}s` }}
                    >
                        <CandidateCard {...candidate} />
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: 'var(--text-secondary)',
                }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍵</p>
                    <p>No candidates match your search. Try a different query or filter.</p>
                </div>
            )}

            {/* CTA */}
            <div style={{
                marginTop: '4rem',
                textAlign: 'center',
                padding: '2.5rem',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(236, 72, 153, 0.06))',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
            }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                    Want to be on this board?
                </p>
                <Link to="/apply" className="btn btn-primary">
                    Join the Network →
                </Link>
            </div>
        </div>
    );
};

export default CandidateBoard;
