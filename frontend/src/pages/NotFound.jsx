import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
        <div className="animate-fade-in-up">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 12vw, 8rem)',
              background: 'var(--gradient-gold)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1,
              display: 'block',
            }}
          >
            404
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              margin: '1rem 0 0.75rem',
            }}
          >
            Lost Your Way?
          </h1>
          <p className="muted" style={{ lineHeight: 1.7, marginBottom: '2rem' }}>
            Looks like this page doesn't exist. Let's get you back to planning your dream wedding.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-gold">
              <Home size={18} /> Back to Home
            </Link>
            <Link to="/services" className="btn btn-outline">
              <Search size={18} /> Browse Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
