import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { siteConfig } from '../data/siteConfig.js'
import './Planner.css'

const serviceOptions = [
  { id: 'venue', label: 'Royal Venues & Estates', icon: '🏰' },
  { id: 'catering', label: 'Gourmet Catering', icon: '🍽️' },
  { id: 'decor', label: 'Exquisite Decor', icon: '🌸' },
  { id: 'styling', label: 'Styling Bride & Groom', icon: '👗' },
]

const WORD_LIMIT = 1000
const TOTAL_STEPS = 4

function countWords(text) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

export default function Planner() {
  const [step, setStep] = useState(0)
  const [services, setServices] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')

  const wordCount = countWords(description)
  const wordsRemaining = WORD_LIMIT - wordCount

  function toggleService(id) {
    setServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  function canProceed() {
    if (step === 0) return services.length > 0
    if (step === 1) return name.trim() && email.trim() && phone.trim()
    if (step === 2) return wordCount > 0 && wordCount <= WORD_LIMIT
    return true
  }

  function handleDescriptionChange(e) {
    const text = e.target.value
    if (countWords(text) <= WORD_LIMIT) {
      setDescription(text)
    }
  }

  function buildWhatsAppMessage() {
    const selectedLabels = serviceOptions
      .filter((s) => services.includes(s.id))
      .map((s) => s.label)
      .join(', ')

    const msg = [
      `*New Wedding Inquiry — ${siteConfig.name}*`,
      ``,
      `*Name:* ${name}`,
      `*Email:* ${email}`,
      `*Phone:* ${phone}`,
      ``,
      `*Services:* ${selectedLabels}`,
      ``,
      `*Requirements:*`,
      description,
    ].join('\n')

    return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(msg)}`
  }

  function handleSubmit() {
    const url = buildWhatsAppMessage()
    window.open(url, '_blank')
  }

  const stepTitles = ['Select Services', 'Your Details', 'Describe Your Vision', 'Review & Send']

  return (
    <>
      <PageHeader
        eyebrow="Let's Create Magic"
        title="Plan Your Wedding"
        subtitle="Tell us about your dream celebration and we'll connect with you instantly on WhatsApp."
      />

      <section className="section">
        <div className="container planner-container">
          {/* Progress bar */}
          <div className="planner-progress">
            {stepTitles.map((title, i) => (
              <div key={title} className={`planner-step-indicator ${i <= step ? 'is-active' : ''} ${i < step ? 'is-complete' : ''}`}>
                <div className="planner-step-circle">
                  {i < step ? <Check size={16} /> : <span>{i + 1}</span>}
                </div>
                <span className="planner-step-label">{title}</span>
              </div>
            ))}
          </div>

          <div className="planner-card card">
            {/* ====== STEP 0: Service Selection ====== */}
            {step === 0 && (
              <div className="planner-step animate-fade-in">
                <h2 className="planner-step-title">Which services are you interested in? <span className="required-star">*</span></h2>
                <p className="muted" style={{ marginBottom: '2rem' }}>Select one or more to get started.</p>
                <div className="planner-service-grid">
                  {serviceOptions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`planner-service-option ${services.includes(s.id) ? 'is-selected' : ''}`}
                      onClick={() => toggleService(s.id)}
                    >
                      <span className="planner-service-icon">{s.icon}</span>
                      <span className="planner-service-label">{s.label}</span>
                      {services.includes(s.id) && (
                        <span className="planner-service-check"><Check size={18} /></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ====== STEP 1: Personal Details ====== */}
            {step === 1 && (
              <div className="planner-step animate-fade-in">
                <h2 className="planner-step-title">Tell us about yourself</h2>
                <p className="muted" style={{ marginBottom: '2rem' }}>All fields are required.</p>
                <div className="planner-form-group">
                <label htmlFor="planner-name">Full Name <span className="required-star">*</span></label>
                  <input
                    id="planner-name"
                    type="text"
                    placeholder="E.g. Priya & Rohan Malhotra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="planner-form-group">
                <label htmlFor="planner-email">Email Address <span className="required-star">*</span></label>
                  <input
                    id="planner-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="planner-form-group">
                <label htmlFor="planner-phone">Phone Number <span className="required-star">*</span></label>
                  <input
                    id="planner-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* ====== STEP 2: Description ====== */}
            {step === 2 && (
              <div className="planner-step animate-fade-in">
                <h2 className="planner-step-title">Describe your dream wedding</h2>
                <p className="muted" style={{ marginBottom: '2rem' }}>
                  Share your vision — themes, colors, preferences, any special requirements.
                </p>
                <div className="planner-form-group">
                  <label htmlFor="planner-desc">Your Requirements</label>
                  <textarea
                    id="planner-desc"
                    rows={8}
                    placeholder="Tell us everything about your dream wedding... themes, colors, number of guests, special requests..."
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                  <div className="planner-word-counter">
                    <span className={wordsRemaining <= 50 ? 'planner-word-warning' : ''}>
                      {wordCount} / {WORD_LIMIT} words
                    </span>
                    {wordsRemaining <= 50 && wordsRemaining > 0 && (
                      <span className="planner-word-warning"> — {wordsRemaining} remaining</span>
                    )}
                    {wordsRemaining <= 0 && (
                      <span className="planner-word-danger"> — Word limit reached</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ====== STEP 3: Review ====== */}
            {step === 3 && (
              <div className="planner-step animate-fade-in">
                <h2 className="planner-step-title">Review your details</h2>
                <p className="muted" style={{ marginBottom: '2rem' }}>
                  Everything looks perfect? Hit send and we'll continue on WhatsApp!
                </p>
                <div className="planner-review">
                  <div className="planner-review-row">
                    <span className="planner-review-label">Services</span>
                    <span>{serviceOptions.filter((s) => services.includes(s.id)).map((s) => s.label).join(', ')}</span>
                  </div>
                  <div className="planner-review-row">
                    <span className="planner-review-label">Name</span>
                    <span>{name}</span>
                  </div>
                  <div className="planner-review-row">
                    <span className="planner-review-label">Email</span>
                    <span>{email}</span>
                  </div>
                  <div className="planner-review-row">
                    <span className="planner-review-label">Phone</span>
                    <span>{phone}</span>
                  </div>
                  <div className="planner-review-row" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                    <span className="planner-review-label">Requirements</span>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--color-ink-soft)' }}>{description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="planner-nav">
              {step > 0 && (
                <button type="button" className="btn btn-outline" onClick={() => setStep(step - 1)}>
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              <div style={{ flex: 1 }} />
              {step < TOTAL_STEPS - 1 && (
                <button
                  type="button"
                  className="btn btn-gold"
                  disabled={!canProceed()}
                  onClick={() => setStep(step + 1)}
                >
                  Next <ChevronRight size={18} />
                </button>
              )}
              {step === TOTAL_STEPS - 1 && (
                <button type="button" className="btn btn-gold planner-send-btn" onClick={handleSubmit}>
                  <Send size={18} /> Send via WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
