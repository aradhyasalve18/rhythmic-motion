import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import './TestimonialCarousel.css'

export default function TestimonialCarousel({ testimonials }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  function go(delta) {
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length)
  }

  const current = testimonials[index]

  return (
    <div className="carousel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      {current.image && (
        <img 
          src={current.image} 
          alt={current.name} 
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-gold-300)', marginBottom: '1rem', boxShadow: 'var(--shadow-card)' }} 
        />
      )}
      
      <div className="stars" aria-label={`Rated ${current.rating} out of 5`} style={{ color: 'var(--color-gold-500)', marginBottom: '1.5rem', display: 'flex', gap: '0.25rem' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={20}
            fill={i < Math.round(current.rating) ? 'currentColor' : 'none'}
            stroke="currentColor"
          />
        ))}
      </div>

      <p className="carousel-text" style={{ fontFamily: 'var(--font-accent)', fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--color-ink-soft)', lineHeight: '1.6' }}>
        &ldquo;{current.quote}&rdquo;
      </p>

      <p className="carousel-name" style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-ink)' }}>{current.name}</p>
      <p className="carousel-context muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{current.context}</p>

      <div className="carousel-controls" style={{ marginTop: '2rem' }}>
        <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial">
          <ChevronLeft size={20} />
        </button>
        <div className="carousel-dots">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={`carousel-dot ${i === index ? 'is-active' : ''}`}
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Next testimonial">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
