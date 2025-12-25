import React, { useState } from 'react'

const IntakeForm = () => {
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <h2 className="text-gradient">Application Received</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Your profile has been sent to our vetting committee. If a match is found, you will be notified via email.
                    </p>
                    <button onClick={() => setSubmitted(false)} className="btn btn-glass">Back to Home</button>
                </div>
            </div>
        )
    }

    return (
        <div className="container" style={{ padding: '3rem 0', maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Join the Network</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                We only accept candidates who are vouched for. Please provide your details and your voucher.
            </p>

            <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                    <input
                        type="text"
                        required
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            color: 'white',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Primary Role</label>
                    <input
                        type="text"
                        placeholder="e.g. Senior Backend Engineer"
                        required
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            color: 'white',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>LinkedIn / Portfolio</label>
                    <input
                        type="url"
                        required
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            color: 'white',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Who can vouch for you?</label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Provide the email of a former colleague or manager.</p>
                    <input
                        type="email"
                        required
                        placeholder="colleague@company.com"
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            color: 'white',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Submit Application</button>
            </form>
        </div>
    )
}

export default IntakeForm
