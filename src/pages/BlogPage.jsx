import React from 'react'
import { Link } from 'react-router-dom'

const BlogPage = () => {
    const articles = [
        {
            id: 1,
            title: "Resume Tips: Brewing Success",
            date: "Dec 24, 2025",
            preview: "Your resume is like a good cup of tea - it needs to be steeped to perfection. Here are the top 5 tips to make your resume stand out...",
            readTime: "5 min read",
            tag: "Career Advice"
        },
        {
            id: 2,
            title: "Networking: It's Just Having Tea",
            date: "Dec 22, 2025",
            preview: "Networking doesn't have to be transactional. Think of it as inviting someone for a chat. Authentic connections start with genuine curiosity...",
            readTime: "4 min read",
            tag: "Networking"
        },
        {
            id: 3,
            title: "The Art of the Follow-Up",
            date: "Dec 18, 2025",
            preview: "You've had the interview, now what? The follow-up is the foam on top of your latte - essential for a great finish. Here's how to do it right...",
            readTime: "3 min read",
            tag: "Interviewing"
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

            <div style={{ display: 'grid', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                {articles.map((article) => (
                    <article key={article.id} className="glass-card fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                            <span style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{article.tag}</span>
                            <span>{article.readTime}</span>
                        </div>

                        <h2 style={{ fontSize: '2rem', margin: '0' }}>{article.title}</h2>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{article.date}</div>

                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            {article.preview}
                        </p>

                        <div style={{ marginTop: '1rem' }}>
                            <button className="btn btn-glass" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                Read Full Article
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        </div>
    )
}

export default BlogPage
