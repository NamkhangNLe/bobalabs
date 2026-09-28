import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import BlogPage from './pages/BlogPage'
import IntakeTicket from './components/IntakeTicket'
import CandidateBoard from './pages/CandidateBoard'
import ResumePage from './pages/ResumePage'
import CoverPage from './pages/CoverPage'
import './styles/main.css'

const NAV_ITEMS = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'The Daily Brew' },
    { to: '/resume', label: 'Resume Maker' },
    { to: '/cover', label: 'Cover Letter' },
    { to: '/board', label: 'Find Talent' },
]

const ScrollToTop = () => {
    const { pathname } = useLocation()
    useEffect(() => { window.scrollTo(0, 0) }, [pathname])
    return null
}

const NavBar = () => {
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => { setMobileOpen(false) }, [location.pathname])

    return (
        <>
            <div className="site-nav-wrapper">
                <nav className="site-nav">
                    <Link to="/" className="nav-logo">
                        <span style={{ color: 'var(--text-primary)' }}>Boba</span>
                        <span style={{ color: '#FFB7C5' }}>Labs</span>
                    </Link>

                    <div className="nav-links">
                        {NAV_ITEMS.map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link to="/apply" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                            Join Network
                        </Link>
                    </div>

                    <button
                        className={`hamburger ${mobileOpen ? 'open' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                    </button>
                </nav>
            </div>

            {/* Mobile overlay */}
            <div
                className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}
                onClick={() => setMobileOpen(false)}
                style={{ pointerEvents: mobileOpen ? 'auto' : 'none' }}
            />

            {/* Mobile drawer */}
            <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
                {NAV_ITEMS.map(item => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
                <Link to="/apply" className="btn btn-primary" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    Join Network
                </Link>
            </div>
        </>
    )
}

const Footer = () => (
    <footer className="site-footer">
        <div className="footer-content">
            <div>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: '1.2rem' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Boba</span>
                    <span style={{ color: '#FFB7C5' }}>Labs</span>
                </span>
                <p className="footer-tagline" style={{ marginTop: '0.3rem' }}>Built with 🍵 by friends, for friends.</p>
            </div>
            <div className="footer-links">
                <Link to="/blog">Blog</Link>
                <Link to="/board">Talent</Link>
                <Link to="/resume">Resume</Link>
                <Link to="/apply">Apply</Link>
            </div>
            <p className="footer-tagline">© 2025 Boba Labs. All rights reserved.</p>
        </div>
    </footer>
)

const App = () => {
    return (
        <Router basename="/bobalabs">
            <ScrollToTop />
            <div className="app">
                <NavBar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/board" element={<CandidateBoard />} />
                    <Route path="/apply" element={<IntakeTicket />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/resume" element={<ResumePage />} />
                    <Route path="/cover" element={<CoverPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App
114
