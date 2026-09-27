import React from 'react'

const BlogPage = () => {
  return (
    <div className="container" style={{ padding: '5rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <div
        className="fade-in-up"
        style={{
          textAlign: 'center',
          maxWidth: '580px',
          padding: '3.5rem 3rem',
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 12px 40px rgba(15, 23, 42, 0.10)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>☕</div>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Fredoka', sans-serif" }}>
          The Daily Brew has moved
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.25rem' }}>
          Fresh posts now live on my personal site — come grab a cup over there.
        </p>
        <a
          href="https://namkhangnle.github.io/"
          className="btn btn-primary"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          Visit the new home →
        </a>
      </div>
    </div>
  )
}

export default BlogPage
