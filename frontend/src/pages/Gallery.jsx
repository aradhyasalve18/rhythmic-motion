import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Camera } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Lightbox from '../components/Lightbox.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import { galleryCategories, galleryData } from '../data/galleryData.js'
import './Gallery.css'

export default function Gallery() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'
  const [activeCategory, setActiveCategory] = useState(
    galleryCategories.includes(initialCategory) ? initialCategory : 'All'
  )
  const [activeIndex, setActiveIndex] = useState(null)

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return galleryData
    return galleryData.filter((item) => item.category === activeCategory)
  }, [activeCategory])

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
              <button
                type="button"
                key={item.id}
                className={`gallery-item card scroll-reveal ${index % 5 === 0 ? 'gallery-item--tall' : ''}`}
                style={{ transitionDelay: `${(index % 6) * 80}ms` }}
                onClick={() => setActiveIndex(index)}
              >
                <img src={item.image} alt={item.title} className="gallery-item-img" />
                <div className="gallery-item-overlay">
                  <span className="gallery-item-category tag">{item.category}</span>
                  <span className="gallery-item-title">{item.title}</span>
                </div>
                <div className="gallery-item-zoom">
                  <Camera size={20} />
                </div>
              </button>
            ))}
          </div>

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
                <AnimatedCounter value="10" />
              </span>
              <span className="gallery-stat-label">Years of Memories</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-soft">
        <div className="container gallery-cta">
          <span className="eyebrow">Be Part of the Story</span>
          <h2 className="section-title">Your Moment Is Waiting</h2>
          <p className="section-sub" style={{ textAlign: 'center' }}>
            From the stunning venue to the final reception — let us craft the perfect backdrop for your wedding gallery.
          </p>
          <Link to="/planner" className="btn btn-gold" style={{ marginTop: '1.5rem' }}>
            Plan Your Wedding
          </Link>
        </div>
      </section>

      <Lightbox items={filtered} activeIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={navigate} />
    </>
  )
}
