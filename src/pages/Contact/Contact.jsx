import { useEffect, useRef, useState } from 'react'
import './Contact.css'

/** Test inbox — switch back to jagathitresena@ymail.com when ready */
const CONTACT_EMAIL = 'abhishekchitresena0707@gmail.com'
const WHATSAPP_NUMBER = '94779516105'
const MAX_PHOTOS = 3
const MAX_PHOTO_MB = 2

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isNetlifyHost() {
  const host = window.location.hostname
  return host.includes('netlify.app') || host.includes('netlify.com')
}

function Contact() {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [photos, setPhotos] = useState([])
  const fileInputRef = useRef(null)
  const photoUrlsRef = useRef([])

  useEffect(() => {
    return () => {
      photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const clearPhotos = () => {
    photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    photoUrlsRef.current = []
    setPhotos([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePhotosChange = (event) => {
    const selected = Array.from(event.target.files || [])
    if (!selected.length) return

    const next = [...photos]
    const errors = []

    for (const file of selected) {
      if (next.length >= MAX_PHOTOS) {
        errors.push(`You can attach up to ${MAX_PHOTOS} photos.`)
        break
      }
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image.`)
        continue
      }
      if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
        errors.push(`${file.name} is larger than ${MAX_PHOTO_MB} MB.`)
        continue
      }
      const previewUrl = URL.createObjectURL(file)
      photoUrlsRef.current.push(previewUrl)
      next.push({
        file,
        previewUrl,
        id: `${file.name}-${file.size}-${file.lastModified}`,
      })
    }

    setPhotos(next)
    if (errors.length) {
      setStatus('error')
      setErrorMessage(errors[0])
    } else if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }

    event.target.value = ''
  }

  const removePhoto = (id) => {
    setPhotos((current) => {
      const target = current.find((item) => item.id === id)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
        photoUrlsRef.current = photoUrlsRef.current.filter(
          (url) => url !== target.previewUrl,
        )
      }
      return current.filter((item) => item.id !== id)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    const form = event.currentTarget
    const fields = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    }

    // Photo + message delivery: Netlify Forms (free file uploads).
    // This only works on the live Netlify site, not localhost.
    if (!isNetlifyHost()) {
      setStatus('error')
      setErrorMessage(
        'Message + photo send works on the live Netlify website. Deploy the site, then test on kandyan-handicraft-center.netlify.app/contact.',
      )
      return
    }

    try {
      const formData = new FormData()
      formData.append('form-name', 'contact')
      formData.append('name', fields.name)
      formData.append('email', fields.email)
      formData.append('subject', fields.subject)
      formData.append('message', fields.message)

      // Netlify: one file per field
      photos.forEach((item, index) => {
        formData.append(`photo-${index + 1}`, item.file, item.file.name)
      })

      const response = await fetch('/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Unable to send your message.')
      }

      form.reset()
      clearPhotos()
      setStatus('sent')
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again or email us directly.',
      )
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__media" aria-hidden="true">
          <img
            className="contact-hero__image"
            src="/images/contact/contact-hero.png"
            alt=""
          />
        </div>

        <div className="container contact-hero__content">
          <p className="contact-hero__eyebrow">Get in Touch</p>
          <h1>Contact Us</h1>
          <span className="contact-hero__line" aria-hidden="true" />
          <p className="contact-hero__lead">
            Enquiries, custom designs, repairs, and appointments.
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container contact-grid">
          <div className="contact-main">
            <div className="contact-intro">
              <p className="contact-section__eyebrow">Visit Our Store</p>
              <h2>We Would Love to Hear From You</h2>
            </div>

            <div className="contact-form-wrap">
              <form
                className="contact-form"
                name="contact"
                method="POST"
                encType="multipart/form-data"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="contact" />
                <input
                  type="text"
                  name="bot-field"
                  tabIndex={-1}
                  autoComplete="off"
                  className="contact-form__honey"
                  aria-hidden="true"
                />

                <div className="contact-form__row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    autoComplete="name"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    autoComplete="email"
                  />
                </div>

                <input type="text" name="subject" placeholder="Subject" required />

                <label className="contact-form__message">
                  <span className="contact-form__message-label">Your Message</span>
                  <textarea
                    name="message"
                    placeholder="Describe your enquiry, custom design, or repair. Attach photos below if helpful…"
                    rows="5"
                    required
                  />
                </label>

                <div className="contact-form__photos">
                  <div className="contact-form__photos-head">
                    <span className="contact-form__message-label">
                      Attach photos
                    </span>
                    <span className="contact-form__photos-hint">
                      Optional · up to {MAX_PHOTOS} images · max {MAX_PHOTO_MB}{' '}
                      MB each
                    </span>
                  </div>

                  <label className="contact-form__photos-pick">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotosChange}
                    />
                    <span>Choose photos</span>
                    <span className="contact-form__photos-count">
                      {photos.length}/{MAX_PHOTOS}
                    </span>
                  </label>

                  {photos.length > 0 && (
                    <ul className="contact-form__photo-list">
                      {photos.map((item) => (
                        <li key={item.id}>
                          <img src={item.previewUrl} alt="" />
                          <div>
                            <p>{item.file.name}</p>
                            <span>{formatBytes(item.file.size)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePhoto(item.id)}
                            aria-label={`Remove ${item.file.name}`}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>

                {status === 'sent' && (
                  <p className="contact-form__success" role="status">
                    Thank you! Your message
                    {photos.length ? ' and photos have' : ' has'} been sent. We
                    will reply to your email.
                  </p>
                )}

                {status === 'error' && (
                  <p className="contact-form__error" role="alert">
                    {errorMessage} You can also email{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="contact-info">
            <div className="contact-info__cards">
              <div className="contact-info__card">
                <span className="contact-info__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </span>
                <div>
                  <h3>Address</h3>
                  <p>No. 123, Kandy Road, Kandy, Sri Lanka</p>
                </div>
              </div>

              <div className="contact-info__card">
                <span className="contact-info__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7.4 3.8h2.6c.7 0 1.3.5 1.4 1.2l.4 2.2a1.5 1.5 0 0 1-.4 1.3l-1.1 1.2a12.6 12.6 0 0 0 4.2 4.2l1.2-1.1a1.5 1.5 0 0 1 1.3-.4l2.2.4c.7.1 1.2.7 1.2 1.4v2.6c0 .8-.6 1.5-1.4 1.5C10.8 19.8 4.2 13.2 4 5.2c0-.8.6-1.4 1.4-1.4Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <h3>Phone</h3>
                  <p>+94 77 673 6509</p>
                </div>
              </div>

              <div className="contact-info__card">
                <span className="contact-info__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3.5"
                      y="5.5"
                      width="17"
                      height="13"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="m4.5 7.5 7.5 6 7.5-6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <h3>Email</h3>
                  <p>
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </p>
                </div>
              </div>

              <div className="contact-info__card">
                <span className="contact-info__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="8.25"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M12 7.5V12l3.2 2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <h3>Opening Hours</h3>
                  <p>Mon - Sat: 9.00 AM - 6.00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="contact-actions">
              <a href="tel:+94776736509">Call Now</a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="container contact-map">
          <iframe
            title="Kandyan Handicraft Center location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d989.3841860345444!2d80.63679496962011!3d7.293427899544633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662b9ffac459%3A0x835e98c65cd437b!2sKandyan%20Handicraft%20Center!5e0!3m2!1sen!2slk!4v1783686694347!5m2!1sen!2slk"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>
    </main>
  )
}

export default Contact
