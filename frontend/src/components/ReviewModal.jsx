import { useState } from 'react'
import axios from 'axios'
import { X, Star } from 'lucide-react'
import './ReviewModal.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://theweddingbells.onrender.com'

export default function ReviewModal({ isOpen, serviceId, onClose, onSuccess }) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [customerName, setCustomerName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await axios.post(`${API_URL}/api/services/${serviceId}/reviews`, {
        customerName,
        contactInfo,
        rating,
        text
      })
      // Reset form
      setRating(5)
      setCustomerName('')
      setContactInfo('')
      setText('')
      onSuccess()
    } catch (err) {
      console.error(err)
      setError('Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content review-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        
        <h2 className="modal-title">Write a Review</h2>
        <p className="muted" style={{ marginBottom: '1.5rem' }}>Share your experience with this service.</p>
        
        {error && <div className="modal-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="review-form">
          <div className="review-stars-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                className={`review-star ${(hoverRating || rating) >= star ? 'filled' : ''}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                fill={(hoverRating || rating) >= star ? 'var(--color-gold-500)' : 'none'}
                color={(hoverRating || rating) >= star ? 'var(--color-gold-500)' : 'var(--color-ink-faint)'}
              />
            ))}
          </div>
          
          <div className="form-group">
            <label>Your Name <span className="required-star">*</span></label>
            <input 
              type="text" 
              required 
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="e.g. Priya M."
            />
          </div>
          
          <div className="form-group">
            <label>Email or Phone <span className="required-star">*</span></label>
            <input 
              type="text" 
              required 
              value={contactInfo}
              onChange={e => setContactInfo(e.target.value)}
              placeholder="For verification"
            />
          </div>
          
          <div className="form-group">
            <label>Review</label>
            <textarea 
              rows={4}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Tell us what you loved..."
            />
          </div>
          
          <button type="submit" className="btn btn-gold btn-block" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}
