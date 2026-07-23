import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { io } from 'socket.io-client'
import PageHeader from '../components/PageHeader.jsx'
import ReviewModal from '../components/ReviewModal.jsx'
import './Services.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://theweddingbells.onrender.com'

export default function Services() {
  const [servicesData, setServicesData] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [activeStyle, setActiveStyle] = useState('All')
  const [loading, setLoading] = useState(true)
  const [reviewServiceId, setReviewServiceId] = useState(null)

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
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-gold)' }}>
                            {service.reviews && service.reviews.length > 0 ? (
                              <>
                                {'★'.repeat(Math.round(service.reviews.reduce((acc, r) => acc + r.rating, 0) / service.reviews.length))}
                                {'☆'.repeat(5 - Math.round(service.reviews.reduce((acc, r) => acc + r.rating, 0) / service.reviews.length))}
                                <span className="muted" style={{ marginLeft: '5px' }}>({service.reviews.length})</span>
                              </>
                            ) : (
                              <span className="muted" style={{ fontSize: '0.8rem' }}>No reviews yet</span>
                            )}
                          </div>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            onClick={() => setReviewServiceId(service._id)}
                          >
                            Write a Review
                          </button>
                        </div>
                        
                        <Link to={`/contact?service=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}`} className="service-book-btn" style={{ marginTop: '1rem' }}>
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
              
              {/* Review Modal */}
              <ReviewModal 
                isOpen={!!reviewServiceId}
                serviceId={reviewServiceId}
                onClose={() => setReviewServiceId(null)}
                onSuccess={() => {
                  setReviewServiceId(null)
                  fetchServices()
                }}
              />
            </>
          )}
        </div>
      </section>
    </>
  )
}
