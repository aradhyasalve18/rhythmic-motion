import { Star } from 'lucide-react'
import './InstructorCard.css'

export default function InstructorCard({ instructor, onView }) {
  return (
    <article className="instructor-card card">
      <div className="instructor-image-wrapper">
        <img src={instructor.image} alt={instructor.name} className="instructor-image" />
      </div>
      <div className="instructor-card-content">
        <h3 className="instructor-card-name">{instructor.name}</h3>
        <p className="instructor-card-role">{instructor.role}</p>
        <div className="stars" aria-label={`Rated ${instructor.rating} out of 5`}>
          <Star size={14} fill="currentColor" stroke="none" />
          <span>{instructor.rating}</span>
          <span className="muted">· {instructor.experience}</span>
        </div>
        <p className="instructor-card-bio">{instructor.bio}</p>
        <button type="button" className="btn btn-outline btn-sm btn-block" onClick={() => onView(instructor)}>
          View Profile
        </button>
      </div>
    </article>
  )
}
