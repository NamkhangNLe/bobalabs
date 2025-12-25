import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CandidateBoard from './pages/CandidateBoard'
import IntakeForm from './pages/IntakeForm'
import BlogPage from './pages/BlogPage'
import './styles/main.css'

function App() {
    return (
        <Router>
            <div className="app-container">
                <nav style={{ padding: '1rem 0', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
                    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            Boba<span className="text-gradient">Labs</span>
                        </Link>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <Link to="/board" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Candidates</Link>
                            <Link to="/blog" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>The Daily Brew</Link>
                        </div>
                    </div>
                </nav>

                <main>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/board" element={<CandidateBoard />} />
                        <Route path="/apply" element={<IntakeForm />} />
                        <Route path="/blog" element={<BlogPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
