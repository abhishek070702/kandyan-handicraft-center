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
        <div className="container">
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
          <div className="contact-info">
            <p className="contact-section__eyebrow">Visit Our Store</p>
            <h2>We Would Love to Hear From You</h2>

            <p className="contact-info__text">
              Whether you are looking for a traditional jewellery piece, a
              custom design or a special gift, our team is ready to help you.
            </p>

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
                  <p>+94 77 123 4567</p>
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
              <a href="tel:+94771234567">Call Now</a>
              <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </div>

          <div className="contact-form-wrap">
          <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__row">
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
              </div>

              <input type="text" placeholder="Subject" />

              <textarea placeholder="Your Message" rows="7"></textarea>

              <button type="submit">Send Message</button>

              {isSubmitted && (
                <p className="contact-form__success">
                    Thank you! Your message has been received.
                </p>
                )}
            </form>
          </div>
        </div>

        <div className="container contact-map">
          <div>
            <span>📍</span>
            <h3>Kandyan Handicraft Center</h3>
            <p>Kandy, Sri Lanka</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact