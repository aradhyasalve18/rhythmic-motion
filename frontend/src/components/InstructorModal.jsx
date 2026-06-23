import { useEffect } from 'react'
import { Instagram, Star, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import './InstructorModal.css'

export default function InstructorModal({ instructor, onClose }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  if (!instructor) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel instructor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructor-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close instructor profile">
          <X size={20} />
        </button>

        <div className="instructor-modal-head">
          <div className="instructor-image-wrapper lg">
            <img src={instructor.image} alt={instructor.name} className="instructor-image" />
          </div>
          <div>
            <h3 id="instructor-modal-title" className="modal-title" style={{ paddingRight: 0 }}>
              {instructor.name}
            </h3>
            <p className="instructor-role">{instructor.role}</p>
            <div className="stars" aria-label={`Rated ${instructor.rating} out of 5`}>
              <Star size={15} fill="currentColor" stroke="none" />
              <span>{instructor.rating}</span>
              <span className="muted">· {instructor.experience} experience</span>
            </div>
          </div>
        </div>

        <p className="instructor-bio">{instructor.bio}</p>

        <div className="instructor-section">
          <h4>Highlights</h4>
          <ul className="instructor-achievements">
            {instructor.achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="instructor-section">
          <h4>Teaches</h4>
          <div className="instructor-classes">
            {instructor.classes.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="instructor-modal-actions">
          <a
            className="btn btn-outline btn-sm"
            href={`https://instagram.com/${instructor.instagram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={16} /> {instructor.instagram}
          </a>
          <Link
            to="/free-trial"
            state={{ style: instructor.style }}
            className="btn btn-gold btn-sm"
            onClick={onClose}
          >
            Book a Class with {instructor.name.split(' ')[0]}
          </Link>
        </div>
      </div>
    </div>
  )
}
