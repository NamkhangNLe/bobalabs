import React from 'react'
import { Link } from 'react-router-dom'

const BlogPage = () => {
    const [expandedId, setExpandedId] = React.useState(null);

    const articles = [
        {
            id: 1,
            title: "Resume Tips: Brewing Success",
            date: "Dec 24, 2025",
            preview: "Your resume is like a good cup of tea - it needs to be steeped to perfection. Here are the top 5 tips to make your resume stand out...",
            content: "1. Keep it clear and concise.\n2. Use impact-driven bullet points (X, Y, Z formula).\n3. Match your keywords to the 'Job Brew' (Description).\n4. Highlight your unique 'Flavor' (Side Projects).\n5. Proofread until it's as smooth as a Matcha Latte.",
            readTime: "5 min read",
            tag: "Career Advice",
            rotation: "rotate-1"
        },
        {
            id: 2,
            title: "Networking: It's Just Having Tea",
            date: "Dec 22, 2025",
            preview: "Networking doesn't have to be transactional. Think of it as inviting someone for a chat. Authentic connections start with genuine curiosity...",
            content: "Don't ask for a job immediately. Ask about their journey, their favorite projects, and what they're brewing next. A genuine interest in the person leads to a stronger vouch later on.",
            readTime: "4 min read",
            tag: "Networking",
            rotation: "rotate-neg-1"
        },
        {
            id: 3,
            title: "The Art of the Follow-Up",
            date: "Dec 18, 2025",
            preview: "You've had the interview, now what? The follow-up is the foam on top of your latte - essential for a great finish. Here's how to do it right...",
            content: "Send a thank-you note within 24 hours. Reference a specific 'ingredient' (topic) from your conversation to show you were listening. It's the small details that make the drink perfect.",
            readTime: "3 min read",
            tag: "Interviewing",
            rotation: "rotate-1"
        }
    ]

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>The Daily Brew</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Sip on some wisdom. Fresh career insights served daily.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '3rem', maxWidth: '800px', margin: '0 auto' }}>
                {articles.map((article) => {
                    const isExpanded = expandedId === article.id;
                    return (
                        <article
                            key={article.id}
                            className={`sticker ${article.rotation} fade-in`}
                            style={{
                                background: 'white',
                                padding: '2.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-sticker)',
                                transition: 'all 0.3s ease',
                                border: '1px solid var(--glass-border)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#FFB7C5', fontWeight: 'bold' }}>
                                <span style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{article.tag}</span>
                                <span>{article.readTime}</span>
                            </div>

                            <h2 style={{ fontSize: '2rem', margin: '0', fontFamily: "'Fredoka', sans-serif" }}>{article.title}</h2>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{article.date}</div>

                            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                {article.preview}
                            </p>

                            {isExpanded && (
                                <div className="fade-in" style={{
                                    marginTop: '1rem',
                                    padding: '1.5rem',
                                    background: '#F4FAFF',
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: '4px solid #FFB7C5',
                                    color: 'var(--text-primary)',
                                    lineHeight: '1.8',
                                    whiteSpace: 'pre-line'
                                }}>
                                    <h4 style={{ margin: '0 0 1rem 0', fontFamily: "'Fredoka', sans-serif" }}>Full Brew:</h4>
                                    {article.content}
                                    <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.7 }}>
                                        Check back soon for the deep-dive edition! 🍵✨
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: '1rem' }}>
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : article.id)}
                                    className="btn btn-glass"
                                    style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem' }}
                                >
                                    {isExpanded ? 'Finish Sip' : 'Read Full Article'}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        </div>
    )
}

export default BlogPage
