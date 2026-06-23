import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send, MessageCircle } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { siteConfig } from '../data/siteConfig.js'
import { serviceCategories } from '../data/servicesData.js'
import './Contact.css'

const emptyForm = { name: '', phone: '', email: '', interest: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // No backend wired up yet — replace this with your contact API / email service.
    setSubmitted(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="We'd Love to Hear From You"
        title="Get In Touch"
        subtitle="Have questions about our wedding services? Reach out and we'll get back within a day."
      />

      <section className="section">
        <div className="container contact-grid">
          {/* Form Card */}
          <div className="card contact-form-card scroll-reveal">
            {!submitted ? (
              <>
                <div className="contact-card-header">
                  <Send size={22} className="contact-card-icon" />
                  <h2 className="contact-card-title">Send a Message</h2>
                </div>
                <form className="form-grid" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="c-name">Full name <span className="required-star">*</span></label>
                      <input id="c-name" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" />
                    </div>
                    <div className="form-field">
                      <label htmlFor="c-phone">Phone number <span className="required-star">*</span></label>
                      <input
                        id="c-phone"
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
                    <label htmlFor="c-email">Email <span className="required-star">*</span></label>
                    <input
                      id="c-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="c-interest">I'm interested in <span className="required-star">*</span></label>
                    <select id="c-interest" name="interest" required value={form.interest} onChange={handleChange}>
                      <option value="" disabled>
                        Choose one
                      </option>
                      {serviceCategories
                        .filter((s) => s !== 'All')
                        .map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      <option value="General Enquiry">General Enquiry</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="c-message">Message <span className="required-star">*</span></label>
                    <textarea
                      id="c-message"
                      name="message"
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what you're looking for…"
                    />
                  </div>

                  <button type="submit" className="btn btn-gold btn-block">
                    Send Message
                  </button>
                </form>
              </>
            ) : (
              <div className="contact-success animate-fade-in-up">
                <div className="contact-success-icon">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="contact-card-title">Message sent!</h2>
                <p className="muted">
                  Thanks, {form.name.split(' ')[0] || 'there'}. Someone from The Wedding Bells will reach out within a day.
                </p>
                <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>
                  Back to Home
                </Link>
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className="contact-info scroll-reveal delay-200">
            <div className="card contact-info-card">
              <h2 className="contact-card-title">Our Details</h2>
              <p>
                <MapPin size={18} /> <span>{siteConfig.address}</span>
              </p>
              <p>
                <Phone size={18} /> <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>{siteConfig.phone}</a>
              </p>
              <p>
                <Mail size={18} /> <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </p>
              <p>
                <Clock size={18} /> <span>{siteConfig.hours}</span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="contact-quick-actions">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="contact-quick-btn whatsapp"
              >
                <MessageCircle size={20} />
                <div>
                  <strong>WhatsApp Us</strong>
                  <span>Quick replies, wedding enquiries</span>
                </div>
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="contact-quick-btn call"
              >
                <Phone size={20} />
                <div>
                  <strong>Call Us</strong>
                  <span>{siteConfig.phone}</span>
                </div>
              </a>
            </div>

            <div className="contact-map card" role="img" aria-label="Map placeholder for the studio location">
              <MapPin size={36} />
              <span>Map preview — drop in your Google Maps embed here</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
