import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../data/siteConfig.js'
import { servicesData } from '../data/servicesData.js'
import { testimonialsData } from '../data/testimonialsData.js'
import { galleryData } from '../data/galleryData.js'
import SectionDivider from '../components/SectionDivider.jsx'
import TestimonialCarousel from '../components/TestimonialCarousel.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import './Home.css'

const popularStyles = servicesData;

const heroImages = [
  '/images/hero_banner.png',
  '/images/wedding_venue.png',
  '/images/wedding_decor.png',
  '/images/wedding_catering.png',
  '/images/wedding_styling.png',
]

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0)

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
            {popularStyles.map(({ name, description, image }, index) => (
              <Link
                to="/services"
                key={name}
                className="style-card card scroll-reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="style-card-image-container">
                  <img src={image} alt={name} className="style-card-img" />
                </div>
                <div className="style-card-content">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-ink)' }}>{name}</h3>
                  <p>{description}</p>
                  <span className="style-card-link">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ----------------------------- ABOUT -------------------------------- */}
      <section className="section section-soft about-section">
        <div className="container about-inner">
          <div className="about-text-container scroll-reveal">
            <span className="eyebrow">{siteConfig.name}</span>
            <h2 className="section-title">Your Fairy Tale Starts Here</h2>
            <p className="section-sub">{siteConfig.description}</p>
            <Link to="/planner" className="btn btn-gold" style={{ marginTop: '1.5rem' }}>
              Begin Your Journey
            </Link>
          </div>
          <div className="about-media scroll-reveal delay-200">
            <div className="about-img-wrapper">
              <img src="/images/couple_1.png" alt="Happy Couple" className="about-img card" />
            </div>
            <div className="about-stats">
              {siteConfig.stats.map((stat) => (
                <div className="about-stat card" key={stat.label}>
                  <span className="about-stat-value">
                    <AnimatedCounter value={stat.value} />
                  </span>
                  <span className="about-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* --------------------------- TESTIMONIALS --------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Love Stories</span>
            <h2 className="section-title">Happy Couples</h2>
          </div>
          <TestimonialCarousel testimonials={testimonialsData} />
        </div>
      </section>

      {/* ----------------------------- GALLERY TEASER ----------------------------- */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-head-row">
            <div>
              <span className="eyebrow">Get Inspired</span>
              <h2 className="section-title">Wedding Gallery</h2>
            </div>
            <Link to="/gallery" className="btn btn-outline">
              View Full Gallery
            </Link>
          </div>

          <div className="gallery-teaser">
            {galleryData.slice(0, 5).map((item, index) => (
              <Link
                to="/gallery"
                key={item.id}
                className="gallery-teaser-item card scroll-reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <img src={item.image} alt={item.title} className="gallery-teaser-img" />
                <div className="gallery-teaser-overlay">
                  <span className="tag">{item.category}</span>
                  <h3>{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
