import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { io } from 'socket.io-client'
import PageHeader from '../components/PageHeader.jsx'
import './Services.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://theweddingbells.onrender.com'

export default function Services() {
  const [servicesData, setServicesData] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [activeStyle, setActiveStyle] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/services`)
      const services = res.data.data || []
      setServicesData(services)
      
      // Extract unique categories
      const uniqueCats = ['All', ...new Set(services.map(s => s.category))]
      setCategories(uniqueCats)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching services:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()

    // Connect to WebSockets for real-time updates
    const socket = io(API_URL)
    
    socket.on('content_updated', (payload) => {
      if (payload.type === 'services') {
        fetchServices() // Refetch instantly when admin makes a change
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const filtered = useMemo(() => {
    if (activeStyle === 'All') return servicesData
    return servicesData.filter((s) => s.category === activeStyle)
  }, [activeStyle, servicesData])

  return (
    <>
      <PageHeader
        eyebrow="Premium Wedding Services"
        title="Curated for Perfection"
        subtitle="From royal venues to bridal styling — every service is handcrafted to turn your wedding into an unforgettable celebration."
      />

      <section className="section classes-section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-gold)' }}>Loading services...</div>
          ) : (
            <>
              {/* Filter */}
              <div className="classes-filter">
                {categories.map((style) => (
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
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
                  >
                    <div className="service-detail-card card">
                      <div className="service-detail-card-img-wrapper">
                        <img src={service.imageUrl} alt={service.name} className="service-detail-card-img" />
                        {service.tag && <span className="tag service-detail-card-tag">{service.tag}</span>}
                      </div>
                      
                      <div className="service-detail-card-body">
                        <div className="service-detail-card-header">
                          <h3 className="h4">{service.name}</h3>
                          <div className="service-detail-card-meta muted">
                            <span>{service.duration}</span>
                            <span className="dot"></span>
                            <span className="price">₹{service.price}</span>
                          </div>
                        </div>
                        
                        <p className="muted" style={{ flexGrow: 1 }}>{service.description}</p>
                        
                        {/* Reviews Count */}
                        {service.reviews && service.reviews.length > 0 && (
                          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--color-gold)' }}>
                            {'⭐'.repeat(Math.round(service.reviews.reduce((acc, r) => acc + r.rating, 0) / service.reviews.length))} 
                            {' '} ({service.reviews.length} reviews)
                          </div>
                        )}
                        
                        <Link to={`/contact?service=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}`} className="service-book-btn">
                          <span>Book Consultation</span>
                          <div className="service-book-btn-icon">
                            <ArrowRight size={18} />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
