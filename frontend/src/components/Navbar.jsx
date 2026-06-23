import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Marquee from './Marquee.jsx'
import './Navbar.css'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <Marquee text="LUXURY WEDDINGS ✦ ROYAL VENUES ✦ GOURMET CATERING ✦ EXQUISITE DECOR ✦" speed="50s" />

        <div className="navbar-main container">
          <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            {/* Replace the 'W' circle with your logo image. The path points to public/images/logo.png */}
            <img src="/images/logo.png" alt="The Wedding Bells Logo" className="navbar-logo-img" />
            <span className="navbar-logo-text">The Wedding Bells</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="navbar-links desktop-only">
            <div className="navbar-nav-list">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="navbar-actions">
            <Link to="/planner" className="btn btn-gold navbar-cta">
              Plan Your Wedding
            </Link>
            <button
              type="button"
              className="navbar-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div className={`navbar-backdrop ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* Mobile Drawer */}
      <nav className={`navbar-drawer ${menuOpen ? 'is-open' : ''}`}>
        <div className="navbar-mobile-header">
          <span className="navbar-logo-text">The Wedding Bells</span>
          <button className="navbar-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <div className="navbar-nav-list">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-mobile-footer">
          <Link
            to="/planner"
            className="btn btn-gold navbar-cta navbar-cta-mobile"
            onClick={() => setMenuOpen(false)}
          >
            Plan Your Wedding
          </Link>
        </div>
      </nav>
    </>
  )
}
