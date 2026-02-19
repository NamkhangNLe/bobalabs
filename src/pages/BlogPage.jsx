import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const TAG_CLASS_MAP = {
    'Career Advice': 'tag-career',
    'Networking': 'tag-networking',
    'Interviewing': 'tag-interviewing',
    'Side Projects': 'tag-side-projects',
    'Job Search': 'tag-job-search',
    'Mindset': 'tag-mindset',
}

const CATEGORIES = ['All', 'Career Advice', 'Networking', 'Interviewing', 'Side Projects', 'Job Search', 'Mindset']

const articles = [
    {
        id: 1,
        emoji: '📝',
        title: "Resume Tips: Brewing Success",
        date: "Dec 24, 2025",
        preview: "Your resume is like a good cup of tea — it needs to be steeped to perfection. Here are the top 5 tips to make your resume stand out from the pile.",
        content: "1. **Keep it clear and concise.** One page max for most early-career roles. Every word should earn its spot.\n\n2. **Use impact-driven bullet points** — the X, Y, Z formula: Accomplished [X] as measured by [Y] by doing [Z].\n\n3. **Match your keywords to the 'Job Brew'** (that's the description). Most companies use ATS systems — mirror their language.\n\n4. **Highlight your unique 'Flavor'** — side projects, open-source contributions, and hackathon wins often say more than a GPA.\n\n5. **Proofread until it's as smooth as a Matcha Latte.** Typos are an instant deal-breaker.",
        readTime: "5 min read",
        tag: "Career Advice",
    },
    {
        id: 2,
        emoji: '🤝',
        title: "Networking: It's Just Having Tea",
        date: "Dec 22, 2025",
        preview: "Networking doesn't have to be transactional. Think of it as inviting someone for a chat. Authentic connections start with genuine curiosity.",
        content: "Don't ask for a job immediately. Ask about their journey, their favorite projects, and what they're brewing next. A genuine interest in the person leads to a stronger vouch later on.\n\nThe best networking happens when both sides feel like they gained something — a new perspective, a laugh, or just good vibes. Keep it human.",
        readTime: "4 min read",
        tag: "Networking",
    },
    {
        id: 3,
        emoji: '🎙️',
        title: "The Art of the Follow-Up",
        date: "Dec 18, 2025",
        preview: "You've had the interview, now what? The follow-up is the foam on top of your latte — essential for a great finish.",
        content: "Send a thank-you note within 24 hours. Reference a specific 'ingredient' (topic) from your conversation to show you were listening.\n\nA great formula: 'Hi [Name], thanks for chatting about [specific topic]. I especially enjoyed your take on [insight]. Looking forward to hearing about next steps!'\n\nIt's the small details that make the drink perfect.",
        readTime: "3 min read",
        tag: "Interviewing",
    },
    {
        id: 4,
        emoji: '🧊',
        title: "Cold Brew Outreach: Templates That Work",
        date: "Dec 15, 2025",
        preview: "Cold outreach is an art. Most messages get ignored — but the ones that get replies all have something in common.",
        content: "**The 3-Line Rule**: Keep your initial message to 3 lines max. Anyone scrolling LinkedIn at 11 PM isn't reading your essay.\n\n**Lead with value**: Don't say 'I'm looking for opportunities.' Instead, try: 'I saw your talk on [topic] and noticed your team ships in [stack] — I built something similar and would love to compare notes.'\n\n**Follow up once**: If they don't reply in a week, send one more message. After that, move on. Persistence ≠ pestering.",
        readTime: "4 min read",
        tag: "Job Search",
    },
    {
        id: 5,
        emoji: '💻',
        title: "Leetcode vs. Real-World Projects",
        date: "Dec 10, 2025",
        preview: "The eternal debate. Should you grind 500 problems, or build a project that solves a real problem? Here's what actually matters.",
        content: "**The truth**: You need both — but in different proportions depending on where you're applying.\n\n**Big Tech**: Leetcode is the gatekeeper. You need to be comfortable with medium-level problems in 25 minutes.\n\n**Startups & Mid-Size**: They care more about what you've built. A deployed project with real users says 'I can ship' louder than a 2000-rated Codeforces profile.\n\n**The hack**: Pick problems that relate to your projects. Built a social app? Study graph problems. Built an API? Study system design. Make your prep reinforce your projects.",
        readTime: "6 min read",
        tag: "Career Advice",
    },
    {
        id: 6,
        emoji: '🚀',
        title: "Building in Public: Why Side Projects Win",
        date: "Dec 5, 2025",
        preview: "Your GPA won't land you a referral, but a cool side project might. Here's why building in public is the ultimate career hack.",
        content: "**Visibility > Perfection**: Ship early, share often. A half-finished project on GitHub with a good README beats a 'coming soon.'\n\n**Write about what you build**: A short blog post or Twitter thread about your side project gets more visibility than you think. Recruiters Google you.\n\n**Solve your own problems**: The best side projects come from scratching your own itch. If you wished an app existed — build it.\n\n**Collaborate**: Open-source contributions and hackathons are side projects with built-in networking. Two brews, one cup.",
        readTime: "5 min read",
        tag: "Side Projects",
    },
    {
        id: 7,
        emoji: '🧘',
        title: "Rejection Brews Character",
        date: "Nov 28, 2025",
        preview: "Got rejected? Good. Every 'no' is just a redirect. Here's how to process rejection without letting it steep into bitterness.",
        content: "**Reframe it**: A rejection means you were brave enough to try. Most people never even apply.\n\n**Ask for feedback**: If you made it to a final round, politely ask what you could improve. Some recruiters will share insights.\n\n**Track your progress**: Keep a spreadsheet. When you see 50+ applications, 10 interviews, and 2 offers, you realize the numbers game is real — and you're improving.\n\n**Celebrate small wins**: Got a first-round call? That's validation. Made it to onsite? You're competitive. Each step is progress.",
        readTime: "4 min read",
        tag: "Mindset",
    },
]

const BlogPage = () => {
    const [expandedId, setExpandedId] = useState(null)
    const [activeCategory, setActiveCategory] = useState('All')
    const [email, setEmail] = useState('')
    const [copied, setCopied] = useState(null)

    const featured = articles[0]
    const rest = articles.slice(1)
    const filtered = activeCategory === 'All' ? rest : rest.filter(a => a.tag === activeCategory)

    const handleCopy = (id) => {
        navigator.clipboard.writeText(`${window.location.origin}/blog#article-${id}`)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleNewsletter = (e) => {
        e.preventDefault()
        const subject = encodeURIComponent('Subscribe to The Daily Brew')
        const body = encodeURIComponent(`Please add this email to The Daily Brew newsletter:\n\n${email}`)
        window.location.href = `mailto:Namkhangnle@hotmail.com?subject=${subject}&body=${body}`
        setEmail('')
    }

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>

            {/* Header */}
            <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '3.2rem', marginBottom: '0.6rem', fontFamily: "'Fredoka', sans-serif" }}>
                    ☕ The Daily Brew
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '500px', margin: '0 auto' }}>
                    Sip on some wisdom. Fresh career insights served daily.
                </p>
            </div>

            {/* Hero Featured Article */}
            <div
                className="blog-hero fade-in-up delay-1"
                onClick={() => setExpandedId(expandedId === featured.id ? null : featured.id)}
            >
                <div className="blog-hero-emoji">{featured.emoji}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
                        <span className={`tag-badge ${TAG_CLASS_MAP[featured.tag]}`}>{featured.tag}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{featured.readTime}</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 0.4rem 0', fontFamily: "'Fredoka', sans-serif", color: 'var(--text-primary)' }}>
                        {featured.title}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0' }}>
                        {featured.date}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.8rem' }}>
                        {featured.preview}
                    </p>

                    {expandedId === featured.id && (
                        <div className="blog-expand" style={{
                            marginTop: '1rem',
                            padding: '1.5rem',
                            background: 'rgba(255,255,255,0.6)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid #FFB7C5',
                            whiteSpace: 'pre-line',
                            lineHeight: 1.8,
                        }}>
                            {featured.content}
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                        <button
                            className="btn btn-primary"
                            style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }}
                            onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === featured.id ? null : featured.id) }}
                        >
                            {expandedId === featured.id ? 'Finish Sip ✨' : 'Read Full Article'}
                        </button>
                        <button
                            className="btn btn-glass"
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={(e) => { e.stopPropagation(); handleCopy(featured.id) }}
                        >
                            {copied === featured.id ? '✅ Copied!' : '🔗 Share'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="category-pills fade-in-up delay-2" style={{ marginTop: '3.5rem' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Article Grid */}
            <div className="blog-grid">
                {filtered.map((article, i) => {
                    const isExpanded = expandedId === article.id
                    return (
                        <article
                            key={article.id}
                            id={`article-${article.id}`}
                            className={`blog-card fade-in-up delay-${Math.min(i + 2, 6)}`}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="blog-card-emoji">{article.emoji}</div>
                                <div>
                                    <span className={`tag-badge ${TAG_CLASS_MAP[article.tag]}`}>{article.tag}</span>
                                    <span style={{ marginLeft: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{article.readTime}</span>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.4rem', margin: 0, fontFamily: "'Fredoka', sans-serif" }}>
                                {article.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{article.date}</p>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                {article.preview}
                            </p>

                            {isExpanded && (
                                <div className="blog-expand" style={{
                                    padding: '1.2rem',
                                    background: '#f8fafc',
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: '4px solid #FFB7C5',
                                    whiteSpace: 'pre-line',
                                    lineHeight: 1.8,
                                    color: 'var(--text-primary)',
                                }}>
                                    {article.content}
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : article.id)}
                                    className="btn btn-glass"
                                    style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}
                                >
                                    {isExpanded ? 'Finish Sip ✨' : 'Read Full Article'}
                                </button>
                                <button
                                    onClick={() => handleCopy(article.id)}
                                    className="btn btn-glass"
                                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                                >
                                    {copied === article.id ? '✅ Copied!' : '🔗 Share'}
                                </button>
                            </div>
                        </article>
                    )
                })}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="fade-in-up" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍵</p>
                    <p style={{ fontSize: '1.1rem' }}>No brews in this category yet. Check back soon!</p>
                </div>
            )}

            {/* Newsletter Section */}
            <div className="newsletter-section fade-in-up" style={{ marginTop: '4rem' }}>
                <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '2rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                    ☕ Never Miss a Brew
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                    Get fresh career insights, networking tips, and industry tea delivered to your inbox.
                </p>
                <form onSubmit={handleNewsletter} className="newsletter-input-group">
                    <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                        Subscribe 🍵
                    </button>
                </form>
            </div>

            {/* Back to Home */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link to="/" className="btn btn-glass" style={{ padding: '0.6rem 1.5rem' }}>
                    ← Back to Home
                </Link>
            </div>
        </div>
    )
}

export default BlogPage
