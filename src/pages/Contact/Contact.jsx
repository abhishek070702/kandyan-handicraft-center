import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    event.target.reset()
    setIsSubmitted(true)
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__media" aria-hidden="true">
          <video
            className="contact-hero__video"
            src="/videos/contact-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        <div className="container contact-hero__content">
          <p className="contact-hero__eyebrow">Get in Touch</p>
          <h1>Contact Us</h1>
          <p>
            Reach out to us for jewellery enquiries, custom orders, repairs or
            appointments.
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container contact-grid">
          <div className="contact-main">
            <div className="contact-intro">
              <p className="contact-section__eyebrow">Visit Our Store</p>
              <h2>We Would Love to Hear From You</h2>
              <p className="contact-info__text">
                Whether you are looking for a traditional jewellery piece, a
                custom design or a special gift, our team is ready to help you.
              </p>
            </div>

            <div className="contact-form-wrap">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form__row">
                  <input type="text" placeholder="Your Name" />
                  <input type="email" placeholder="Your Email" />
                </div>

                <input type="text" placeholder="Subject" />

                <label className="contact-form__message">
                  <span className="contact-form__message-label">Your Message</span>
                  <textarea
                    name="message"
                    placeholder="Tell us about your enquiry, custom order, or appointment…"
                    rows="5"
                  />
                </label>

                <button type="submit">Send Message</button>

                {isSubmitted && (
                  <p className="contact-form__success">
                    Thank you! Your message has been received.
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="contact-info">
            <div className="contact-info__cards">
              <div className="contact-info__card">
                <span>📍</span>
                <div>
                  <h3>Address</h3>
                  <p>No. 123, Kandy Road, Kandy, Sri Lanka</p>
                </div>
              </div>

              <div className="contact-info__card">
                <span>📞</span>
                <div>
                  <h3>Phone</h3>
                  <p>+94 77 673 6509</p>
                </div>
              </div>

              <div className="contact-info__card">
                <span>✉️</span>
                <div>
                  <h3>Email</h3>
                  <p>info@kandyanhandicraft.lk</p>
                </div>
              </div>

              <div className="contact-info__card">
                <span>⏰</span>
                <div>
                  <h3>Opening Hours</h3>
                  <p>Mon - Sat: 9.00 AM - 6.00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="contact-actions">
              <a href="tel:+94776736509">Call Now</a>
              <a href="https://wa.me/94779516105" target="_blank" rel="noreferrer">
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
