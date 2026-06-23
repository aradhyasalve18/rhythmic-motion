import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { useBooking } from '../context/BookingContext.jsx'
import { classStyles } from '../data/classesData.js'
import './BookingModal.css'

const emptyForm = { name: '', phone: '', email: '', style: '', batch: '', message: '' }

export default function BookingModal() {
  const { isOpen, prefill, closeBooking } = useBooking()
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm((f) => ({ ...emptyForm, style: prefill.style || '', message: prefill.className ? `I'm interested in: ${prefill.className}` : '' }))
      setSubmitted(false)
    }
  }, [isOpen, prefill])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') closeBooking()
    }
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeBooking])

  if (!isOpen) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // No backend wired up yet — replace this with your booking API / email service.
    setSubmitted(true)
  }

  return (
    <div className="modal-overlay" onClick={closeBooking}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={closeBooking} aria-label="Close booking form">
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <span className="eyebrow">First class is on us</span>
            <h3 id="booking-modal-title" className="modal-title">
              Book Your Free Trial Class
            </h3>
            <p className="muted modal-sub">
              Tell us a little about yourself and we'll confirm your slot over WhatsApp within a few hours.
            </p>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="bm-name">Full name</label>
                  <input id="bm-name" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" />
                </div>
                <div className="form-field">
                  <label htmlFor="bm-phone">Phone number</label>
                  <input
                    id="bm-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="bm-email">Email</label>
                <input
                  id="bm-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="bm-style">Preferred style</label>
                  <select id="bm-style" name="style" required value={form.style} onChange={handleChange}>
                    <option value="" disabled>
                      Choose a style
                    </option>
                    {classStyles
                      .filter((s) => s !== 'All')
                      .map((style) => (
                        <option key={style} value={style}>
                          {style}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="bm-batch">Preferred batch</label>
                  <select id="bm-batch" name="batch" required value={form.batch} onChange={handleChange}>
                    <option value="" disabled>
                      Choose a timing
                    </option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Weekend">Weekend</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="bm-message">Anything we should know? (optional)</label>
                <textarea
                  id="bm-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Prior experience, a class you're curious about, scheduling notes…"
                />
              </div>

              <button type="submit" className="btn btn-gold btn-block">
                Confirm My Trial Slot
              </button>
            </form>
          </>
        ) : (
          <div className="modal-success">
            <CheckCircle2 size={48} color="var(--color-gold-500)" />
            <h3 className="modal-title">You're on the list, {form.name.split(' ')[0] || 'dancer'}!</h3>
            <p className="muted">
              We've noted your interest in <strong>{form.style || 'a class'}</strong>. Our team will reach out on{' '}
              {form.phone} to confirm your free trial slot.
            </p>
            <button type="button" className="btn btn-outline" onClick={closeBooking}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
