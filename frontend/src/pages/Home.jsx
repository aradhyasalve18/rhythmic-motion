import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client'
import { siteConfig } from '../data/siteConfig.js'
import SectionDivider from '../components/SectionDivider.jsx'
import TestimonialCarousel from '../components/TestimonialCarousel.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import './Home.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const heroImages = [
  '/images/hero_banner.png',
  '/images/wedding_venue.png',
  '/images/wedding_decor.png',
  '/images/wedding_catering.png',
  '/images/wedding_styling.png',
]

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0)
  
  const [servicesData, setServicesData] = useState([])
  const [testimonialsData, setTestimonialsData] = useState([])
  const [galleryData, setGalleryData] = useState([])

  const fetchAllData = async () => {
    try {
      const [servicesRes, testimonialsRes, galleryRes] = await Promise.all([
        axios.get(`${API_URL}/api/services`),
        axios.get(`${API_URL}/api/testimonials`),
        axios.get(`${API_URL}/api/gallery`)
      ])
      
      setServicesData(servicesRes.data.data || [])
      setTestimonialsData(testimonialsRes.data.data || [])
      setGalleryData(galleryRes.data.data || [])
    } catch (err) {
      console.error('Error fetching home data:', err)
    }
  }

  useEffect(() => {
    fetchAllData()

    const socket = io(API_URL)
    
    socket.on('content_updated', (payload) => {
      // If any of the content updates, refetch the home data
      fetchAllData()
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* ---------------------------- HERO ---------------------------- */}
      <section className="hero">
        {heroImages.map((img, i) => (
          <div
            key={img}
            className={`hero-slide ${i === heroIndex ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
            aria-hidden={i !== heroIndex}
          />
        ))}
        <div className="hero-bg-overlay" aria-hidden="true" />
        <div className="container hero-inner animate-fade-in">
          <span className="eyebrow animate-fade-in-up" style={{ color: '#fbe1d8' }}>The Premier Luxury Wedding Partner</span>
          <h1 className="hero-title animate-fade-in-up delay-100">
            Crafting Your <span className="hero-title-accent">Forever</span> Moments
          </h1>
          <p className="hero-sub animate-fade-in-up delay-200">
            From majestic venues to exquisite decor, we bring your dream wedding to life with unparalleled elegance and attention to detail.
          </p>

          <div className="hero-actions animate-fade-in-up delay-300">
            <Link to="/planner" className="btn btn-gold hero-cta-btn">
              Plan Your Wedding
            </Link>
            <Link to="/services" className="btn btn-outline hero-cta-btn secondary">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------ POPULAR SERVICES ------------------------ */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Discover Excellence</span>
            <h2 className="section-title">Our Premium Services</h2>
          </div>

          <div className="style-grid">
            {servicesData.slice(0, 4).map(({ _id, name, description, imageUrl }, index) => (
              <Link
                to="/services"
                key={_id}
                className="style-card card scroll-reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="style-card-image-container">
                  <img src={imageUrl} alt={name} className="style-card-img" />
                </div>
                <div className="style-card-content">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-ink)' }}>{name}</h3>
                  <p>{description}</p>
                  <span className="style-card-link">View Details →</span>
                </div>
              </Link>
            ))}
            
            {servicesData.length === 0 && (
               <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem', color: 'var(--color-ink)' }}>
                 More premium services coming soon.
               </div>
            )}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ----------------------------- ABOUT -------------------------------- */}
      <section className="section section-soft about-section">
        <div className="container about-inner">
          <div className="about-text-container scroll-reveal">
            <span className="eyebrow">About The Wedding Bells</span>
            <h2 className="h2 about-title">Where Dreams Become Reality</h2>
            <p className="lead" style={{ marginBottom: '1.5rem', color: 'var(--color-slate)' }}>
              Founded on the belief that every love story deserves a beautiful celebration, we are a team of passionate planners, designers, and artisans.
            </p>
            <p style={{ marginBottom: '2.5rem', color: 'var(--color-gray)' }}>
              With over a decade of experience in crafting luxury weddings, we handle everything from the grandest venues to the smallest floral details, ensuring your special day is stress-free and spectacular.
            </p>
            
            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-number"><AnimatedCounter value={`${galleryData.length > 500 ? galleryData.length : '500'}+`} /></span>
                <span className="about-stat-label">Weddings<br />Planned</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-number"><AnimatedCounter value="15+" /></span>
                <span className="about-stat-label">Awards<br />Won</span>
              </div>
            </div>
          </div>
          
          <div className="about-image-container scroll-reveal" style={{ transitionDelay: '200ms' }}>
            <img src="/images/couple_1.png" alt="Happy couple" className="about-img" />
          </div>
        </div>
      </section>

      {/* -------------------------- TESTIMONIALS -------------------------- */}
      <section className="section bg-pattern">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow" style={{ color: 'var(--color-clay)' }}>Real Love Stories</span>
            <h2 className="section-title">Words From Our Couples</h2>
          </div>
          {testimonialsData.length > 0 ? (
            <TestimonialCarousel testimonials={testimonialsData} />
          ) : (
             <div style={{ textAlign: 'center', color: 'var(--color-slate)' }}>Client stories coming soon.</div>
          )}
        </div>
      </section>
      
      {/* -------------------------- BOTTOM CTA -------------------------- */}
      <section className="section center" style={{ backgroundColor: 'var(--color-paper-dark)' }}>
        <div className="container scroll-reveal">
          <h2 className="h2" style={{ marginBottom: '1.5rem' }}>Ready to Begin Your Journey?</h2>
          <p className="lead" style={{ maxWidth: '600px', margin: '0 auto 2.5rem', color: 'var(--color-gray)' }}>
            Let us turn your vision into a breathtaking reality. Schedule a consultation with our expert wedding planners today.
          </p>
          <Link to="/contact" className="btn btn-gold btn-large">
            Contact Us Now
          </Link>
        </div>
      </section>
    </>
  )
}
