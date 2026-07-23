import { useState, useEffect, useRef } from 'react'
import { Check, ChevronLeft, ChevronRight, Send, ChevronDown } from 'lucide-react'
import axios from 'axios'
import PageHeader from '../components/PageHeader.jsx'
import { siteConfig } from '../data/siteConfig.js'
import './Planner.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://theweddingbells.onrender.com'
const WORD_LIMIT = 1000
const TOTAL_STEPS = 4

function countWords(text) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

export default function Planner() {
  const [step, setStep] = useState(0)
  const [servicesList, setServicesList] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [selectedServices, setSelectedServices] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  
  // Custom Dropdown State
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const wordCount = countWords(description)
  const wordsRemaining = WORD_LIMIT - wordCount

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/services`)
        setServicesList(res.data.data || [])
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef])

  function toggleService(id) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = servicesList.find(s => s._id === id);
    return sum + (service ? service.price : 0);
  }, 0);

  function canProceed() {
    if (step === 0) return selectedServices.length > 0
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
    const selectedLabels = selectedServices
      .map(id => servicesList.find(s => s._id === id)?.name || '')
      .join(', ')

    const msg = [
      `*New Wedding Inquiry — ${siteConfig.name}*`,
      ``,
      `*Name:* ${name}`,
      `*Email:* ${email}`,
      `*Phone:* ${phone}`,
      ``,
      `*Services:* ${selectedLabels}`,
      `*Estimated Total:* ₹${totalPrice.toLocaleString('en-IN')}`,
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
                <p className="muted" style={{ marginBottom: '2rem' }}>Select one or more packages from the dropdown to build your estimate.</p>
                
                {loading ? (
                  <p>Loading available services...</p>
                ) : (
                  <div className="planner-dropdown-container" ref={dropdownRef}>
                    <div 
                      className="planner-dropdown-header"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <span>
                        {selectedServices.length === 0 
                          ? 'Select Services...' 
                          : `${selectedServices.length} Service(s) Selected`}
                      </span>
                      <ChevronDown size={20} className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`} />
                    </div>
                    
                    {dropdownOpen && (
                      <div className="planner-dropdown-list">
                        {servicesList.map((service) => (
                          <div 
                            key={service._id} 
                            className={`planner-dropdown-item ${selectedServices.includes(service._id) ? 'selected' : ''}`}
                            onClick={() => toggleService(service._id)}
                          >
                            <div className="item-details">
                              <span className="item-name">{service.name}</span>
                              <span className="item-price">₹{service.price.toLocaleString('en-IN')}</span>
                            </div>
                            {selectedServices.includes(service._id) && (
                              <Check size={18} className="item-check" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {selectedServices.length > 0 && (
                  <div className="planner-price-estimate">
                    <h3>Estimated Total:</h3>
                    <div className="price-amount">₹{totalPrice.toLocaleString('en-IN')}</div>
                  </div>
                )}
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
                    <span>{selectedServices.map(id => servicesList.find(s => s._id === id)?.name).join(', ')}</span>
                  </div>
                  <div className="planner-review-row">
                    <span className="planner-review-label">Estimated Total</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-gold)' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
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
