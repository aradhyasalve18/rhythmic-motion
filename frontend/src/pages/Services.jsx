import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader.jsx'
import { servicesData, serviceCategories } from '../data/servicesData.js'
import './Services.css'

export default function Services() {
  const [activeStyle, setActiveStyle] = useState('All')

  const filtered = useMemo(() => {
    if (activeStyle === 'All') return servicesData
    return servicesData.filter((s) => s.style === activeStyle)
  }, [activeStyle])

  return (
    <>
      <PageHeader
        eyebrow="Premium Wedding Services"
        title="Curated for Perfection"
        subtitle="From royal venues to bridal styling — every service is handcrafted to turn your wedding into an unforgettable celebration."
      />

      <section className="section classes-section">
        <div className="container">
          {/* Filter */}
          <div className="classes-filter">
            {serviceCategories.map((style) => (
              <button
                key={style}
                type="button"
                className={`chip ${activeStyle === style ? 'is-active' : ''}`}
                onClick={() => setActiveStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Counter */}
          <p className="classes-count muted">
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'service' : 'services'}
            {activeStyle !== 'All' ? ` in ${activeStyle}` : ''}
          </p>

          {/* Grid */}
          <div className="classes-grid">
            {filtered.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
              >
                <div className="service-detail-card card">
                  <div className="service-detail-card-img-wrapper">
                    <img src={service.image} alt={service.name} className="service-detail-card-img" />
                    {service.tag && <span className="tag service-detail-card-tag">{service.tag}</span>}
                  </div>
                  <div className="service-detail-card-body">
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>{service.name}</h3>
                    <p className="muted" style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{service.description}</p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span className="chip" style={{ fontSize: '0.8rem' }}>{service.style}</span>
                      <span className="chip" style={{ fontSize: '0.8rem' }}>{service.duration}</span>
                      <span className="chip" style={{ fontSize: '0.8rem' }}>{service.price}</span>
                    </div>
                    <Link to="/planner" className="btn btn-gold" style={{ width: '100%', textAlign: 'center', marginTop: 'auto' }}>
                      Enquire Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="muted text-center" style={{ marginTop: '2rem' }}>
              No services in this category yet — check back soon.
            </p>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section section-soft">
        <div className="container classes-cta">
          <Sparkles size={28} className="classes-cta-icon" />
          <h2 className="section-title">Not Sure Where to Start?</h2>
          <p className="section-sub" style={{ textAlign: 'center' }}>
            Use our interactive planner to select your services, share your vision, and connect with us directly on WhatsApp.
          </p>
          <div className="classes-cta-actions">
            <Link to="/planner" className="btn btn-gold">Plan Your Wedding</Link>
            <Link to="/contact" className="btn btn-outline">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
