import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { siteConfig } from '../data/siteConfig.js'
import './Footer.css'

/* App-style rounded square WhatsApp icon */
const WhatsappIcon = () => (
  <div className="social-app-icon social-app-whatsapp">
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#fff" viewBox="0 0 16 16">
      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.05-.084-.182-.133-.38-.232"/>
    </svg>
  </div>
)

/* App-style rounded square Instagram icon */
const InstagramIcon = () => (
  <div className="social-app-icon social-app-instagram">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="22" height="22" fill="#fff">
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
    </svg>
  </div>
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* Banner CTA */}
      <div className="footer-banner">
        <div className="container footer-banner-inner">
          <div>
            <span className="eyebrow" style={{ color: '#dcc9a0', fontStyle: 'italic' }}>
              Let's Connect
            </span>
            <h3 className="footer-banner-title">Start Planning Your Forever</h3>
            <p className="footer-banner-text">
              Reach out to us on WhatsApp or Instagram to discuss your vision, themes, and how we can bring it to life.
            </p>
          </div>
          <Link to="/contact" className="btn btn-gold footer-banner-btn">
            Contact Us
          </Link>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="container footer-grid">
        <div className="footer-col footer-about">
          <Link to="/" className="footer-logo">
             <img src="/images/logo.png" alt="The Wedding Bells Logo" className="navbar-logo-img" />
            <span className="navbar-logo-text">{siteConfig.name}</span>
          </Link>
          <p className="footer-about-text">{siteConfig.description}</p>
          <div className="footer-social">
            <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <WhatsappIcon />
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/services">All Services</Link>
          <Link to="/gallery">Wedding Gallery</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/planner">Plan Your Wedding</Link>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <Link to="/services">Royal Venues & Estates</Link>
          <Link to="/services">Gourmet Catering</Link>
          <Link to="/services">Exquisite Decor</Link>
          <Link to="/services">Styling Bride & Groom</Link>
          <Link to="/services">Photography & Videography</Link>
          <Link to="/services">Entertainment & Performances</Link>
        </div>

        <div className="footer-col footer-contact">
          <h4>Visit Us</h4>
          <p>
            <MapPin size={16} /> <span>{siteConfig.address}</span>
          </p>
          <p>
            <Phone size={16} /> <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>{siteConfig.phone}</a>
          </p>
          {/* 
          <p>
            <Mail size={16} /> <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
          */}
          <p className="footer-hours">{siteConfig.hours}</p>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© {year} {siteConfig.name}. All rights reserved.</p>
        <p className="footer-bottom-tagline">Crafting luxury weddings with love.</p>
      </div>
    </footer>
  )
}
