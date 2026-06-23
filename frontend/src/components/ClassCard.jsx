import { Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import './ClassCard.css'

export default function ClassCard({ classItem }) {
  return (
    <article className="class-card card">
      <div className="class-card-image-wrapper">
        {classItem.image && (
          <img src={classItem.image} alt={classItem.name} className="class-card-image" />
        )}
        <div className="class-card-image-overlay">
          <span className="class-card-style">{classItem.style}</span>
          {classItem.tag && <span className="tag">{classItem.tag}</span>}
        </div>
      </div>

      <div className="class-card-body">
        <h3 className="class-card-name">{classItem.name}</h3>
        <p className="class-card-desc">{classItem.description}</p>

        <ul className="class-card-meta">
          <li>
            <Clock size={15} /> {classItem.duration} &middot; {classItem.level}
          </li>
          <li className="class-card-batch">{classItem.batch}</li>
        </ul>

        <div className="class-card-footer">
          <span className="class-card-price">{classItem.price}</span>
          <Link
            to="/free-trial"
            state={{ style: classItem.style, className: classItem.name }}
            className="btn btn-gold btn-sm"
          >
            Book Trial
          </Link>
        </div>
      </div>
    </article>
  )
}
