import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { siteConfig } from '../data/siteConfig.js'
import './Footer.css'

/* App-style rounded square WhatsApp icon */
const WhatsappIcon = () => (
  <div className="social-app-icon social-app-whatsapp">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="22" height="22" fill="#fff">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.7c-33.1 0-65.5-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.3l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.9 82.8-184.7 184.7-184.7 54.3 0 105.4 21.1 143.8 59.6 38.5 38.4 59.6 89.5 59.6 143.8 0 101.9-82.9 184.7-184.6 184.7zM325 277.1c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-2.1-3.6 2.1-3.2 7.6-14 2.8-5.5 1.4-10.6 0-14.3-1.4-3.7-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
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
