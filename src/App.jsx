import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BlogPage from './pages/BlogPage'
import IntakeTicket from './components/IntakeTicket'
import CandidateBoard from './pages/CandidateBoard'
import './styles/main.css'

const App = () => {
    return (
        <Router>
            <div className="app">
                <nav style={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
                        🧋 Boba Labs
                    </Link>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Link to="/blog">The Daily Brew</Link>
                        <Link to="/board">Find Talent</Link>
                        <Link to="/apply" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                            Join Network
                        </Link>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/board" element={<CandidateBoard />} />
                    <Route path="/apply" element={<IntakeTicket />} />
                    <Route path="/blog" element={<BlogPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App
