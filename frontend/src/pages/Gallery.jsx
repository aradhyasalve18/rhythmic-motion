import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { io } from 'socket.io-client'
import PageHeader from '../components/PageHeader.jsx'
import Lightbox from '../components/Lightbox.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import './Gallery.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Gallery() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'
  
  const [galleryData, setGalleryData] = useState([])
  const [galleryCategories, setGalleryCategories] = useState(['All'])
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [activeIndex, setActiveIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/gallery`)
      const images = res.data.data || []
      setGalleryData(images)
      
      const uniqueCats = ['All', ...new Set(images.map(img => img.category))]
      setGalleryCategories(uniqueCats)
      
      if (!uniqueCats.includes(activeCategory)) {
        setActiveCategory('All')
      }
      setLoading(false)
    } catch (err) {
      console.error('Error fetching gallery:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery()

    const socket = io(API_URL)
    
    socket.on('content_updated', (payload) => {
      if (payload.type === 'gallery') {
        fetchGallery()
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return galleryData
    return galleryData.filter((item) => item.category === activeCategory)
  }, [activeCategory, galleryData])

  function navigate(delta) {
    setActiveIndex((i) => (i === null ? null : (i + delta + filtered.length) % filtered.length))
  }

  return (
    <>
      <PageHeader
        eyebrow="Visual Excellence"
        title="Wedding Gallery"
        subtitle="Royal venues, exquisite decor, and unforgettable moments — explore our curated gallery of love."
      />

      <section className="section animate-fade-in">
        <div className="container">
          {loading ? (
             <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-gold)' }}>Loading gallery...</div>
          ) : (
            <>
              {/* Filter chips */}
              <div className="gallery-filter">
                {galleryCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`chip ${activeCategory === cat ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveCategory(cat)
                      setActiveIndex(null)
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Masonry-style grid */}
              <div className="gallery-grid">
                {filtered.map((item, index) => (
                  <motion.button
                    type="button"
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.4, delay: (index % 6) * 0.08 }}
                    className={`gallery-item card ${index % 5 === 0 ? 'gallery-item--tall' : ''}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <img src={item.imageUrl} alt={item.title} className="gallery-item-img" />
                    <div className="gallery-item-overlay">
                      <span className="gallery-item-category tag">{item.category}</span>
                      <span className="gallery-item-title">{item.title}</span>
                    </div>
                    <div className="gallery-item-zoom">
                      <Camera size={20} />
                    </div>
                  </motion.button>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="muted text-center" style={{ marginTop: '3rem', marginBottom: '3rem', fontSize: '1.1rem' }}>
                  More spectacular moments coming soon to this category.
                </p>
              )}

              {/* Stats bar */}
              <div className="gallery-stats">
                <div className="gallery-stat">
                  <span className="gallery-stat-value">
                    <AnimatedCounter value={`${galleryData.length}+`} />
                  </span>
                  <span className="gallery-stat-label">Moments Captured</span>
                </div>
                <div className="gallery-stat">
                  <span className="gallery-stat-value">
                    <AnimatedCounter value="500+" />
                  </span>
                  <span className="gallery-stat-label">Happy Couples</span>
                </div>
                <div className="gallery-stat">
                  <span className="gallery-stat-value">
                    <AnimatedCounter value="12+" />
                  </span>
                  <span className="gallery-stat-label">Years of Magic</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeIndex !== null && filtered[activeIndex] && (
        <Lightbox
          image={filtered[activeIndex].imageUrl}
          alt={filtered[activeIndex].title}
          onClose={() => setActiveIndex(null)}
          onNext={() => navigate(1)}
          onPrev={() => navigate(-1)}
        />
      )}
    </>
  )
}
