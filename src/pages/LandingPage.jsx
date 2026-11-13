import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { candidates } from '../data/candidates';

const filters = ['All', 'AI', 'Systems'];
const matchesFilter = (person, filter) => filter === 'All' ||
    (filter === 'AI' && person.tags.some(tag => /AI|LLM/i.test(tag))) ||
    (filter === 'Systems' && person.tags.some(tag => /Kernel|Systems|FreeBSD/i.test(tag)));

// Stable editorial selection: directory order is not feature priority.
const featuredIds = [3, 2, 5];
const featuredPeople = featuredIds.flatMap(id => candidates.filter(person => person.id === id));

function Asterisk() {
    return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 2v60M6 17l52 30M6 47l52-30" stroke="currentColor" strokeWidth="7" /></svg>;
}

export default function LandingPage() {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const network = useRef(null);
    const people = useMemo(() => candidates.filter(person => matchesFilter(person, filter) &&
        [person.name, person.role, ...person.tags].join(' ').toLowerCase().includes(query.trim().toLowerCase())), [query, filter]);
    const discover = name => {
        setQuery(name || ''); setFilter('All');
        network.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };

    return <main className="bn">
        <section className="bn-hero bn-wrap">
            <div className="bn-intro">
                <p className="bn-kicker"><span className="bn-small-star">✳</span> A NETWORK WITH A HUMAN SIDE</p>
                <h1>Your next role<br />starts with<br /><em>someone.</em><span className="bn-title-star"><Asterisk /></span></h1>
                <p className="bn-deck">Good work deserves a real introduction. Meet the people behind the profiles, and put a face to your next conversation.</p>
                <div className="bn-actions"><button className="bn-button" onClick={() => discover()}>Meet the network <span>↗</span></button><Link className="bn-text-link" to="/apply">Introduce yourself <span>→</span></Link></div>
                <p className="bn-note">By friends. For the people they believe in.</p>
            </div>
            <div className="bn-portrait-world" aria-label="People in the Boba Labs directory">
                <div className="bn-orbit" aria-hidden="true" />
                <p className="bn-world-label">THE PEOPLE MAKE THE DIFFERENCE.</p>
                <div className="bn-portrait-row">
                    {featuredPeople.map((person, i) => <button key={person.id} className={`bn-portrait bn-portrait-${i}`} onClick={() => discover(person.name)} aria-label={`Find ${person.name} in the network`}>
                        <img src={person.image} alt={person.name} />
                        <span className="bn-portrait-name">{person.name}</span><span className="bn-portrait-role">{person.role}</span>
                    </button>)}
                </div>
                <div className="bn-world-foot"><span>Different paths.<br /><i>Shared ambition.</i></span><span className="bn-world-arrow" aria-hidden="true">↙</span></div>
            </div>
        </section>

        <section className="bn-network bn-wrap" id="network" ref={network} aria-labelledby="network-heading">
            <div className="bn-section-top"><p className="bn-kicker">01 / THE NETWORK</p><Link className="bn-text-link" to="/board">Open full directory ↗</Link></div>
            <div className="bn-directory-heading"><h2 id="network-heading">People worth<br /><em>knowing.</em></h2><p>Engineers, builders, and curious minds.<br />Find someone whose work speaks to you.</p></div>
            <div className="bn-toolbar"><div className="bn-filters" role="group" aria-label="Filter people by specialty">{filters.map(label => <button key={label} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>)}</div><label className="bn-search"><span aria-hidden="true">⌕</span><input aria-label="Search the network" placeholder="Search name, role, or skill" value={query} onChange={e => setQuery(e.target.value)} />{query && <button aria-label="Clear search" onClick={() => setQuery('')}>×</button>}</label></div>
            <p className="bn-result-count" role="status">{people.length} {people.length === 1 ? 'person' : 'people'} in this view</p>
            {people.length ? <div className="bn-people">{people.map(person => <a className="bn-person" key={person.id} href={person.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${person.name}'s LinkedIn profile`}>
                <div className="bn-person-photo"><img src={person.image} alt="" loading="lazy" /><span className="bn-photo-arrow" aria-hidden="true">↗</span></div>
                <div className="bn-person-heading"><h3>{person.name}</h3><span>↗</span></div><p className="bn-person-role">{person.role}</p><div className="bn-skills">{person.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div>
            </a>)}</div> : <div className="bn-empty"><h3>No match, yet.</h3><p>Try another name or skill, or clear your filters.</p><button className="bn-text-link" onClick={() => { setQuery(''); setFilter('All'); }}>Reset this view →</button></div>}
        </section>

        <section className="bn-invitation bn-wrap">
            <div className="bn-invitation-inner"><div><p className="bn-kicker">THERE'S A PLACE FOR YOU HERE.</p><h2>Good people know<br /><em>good people.</em></h2></div><div className="bn-invitation-copy"><p>Tell us what you're building, where you want to go, and who knows your work.</p><Link className="bn-button bn-button-light" to="/apply">Make your introduction <span>↗</span></Link><small>We'll prepare an email for you to review and send.</small></div></div>
        </section>
    </main>;
}
