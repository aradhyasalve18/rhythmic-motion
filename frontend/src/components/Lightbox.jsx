import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import './Lightbox.css'

export default function Lightbox({ items, activeIndex, onClose, onNavigate }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNavigate(-1)
      if (e.key === 'ArrowRight') onNavigate(1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, onNavigate])

  if (activeIndex === null) return null
  const item = items[activeIndex]

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close gallery view">
        <X size={26} />
      </button>

      <button
        type="button"
        className="lightbox-nav lightbox-prev"
        onClick={(e) => {
          e.stopPropagation()
          onNavigate(-1)
        }}
        aria-label="Previous image"
      >
        <ChevronLeft size={28} />
      </button>

      <div className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
        <img src={item.image} alt={item.title} className="lightbox-img animate-fade-in" />
        <div className="lightbox-caption">
          <p className="lightbox-category tag">{item.category}</p>
          <h3 className="lightbox-title">{item.title}</h3>
        </div>
      </div>

      <button
        type="button"
        className="lightbox-nav lightbox-next"
        onClick={(e) => {
          e.stopPropagation()
          onNavigate(1)
        }}
        aria-label="Next image"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  )
}
