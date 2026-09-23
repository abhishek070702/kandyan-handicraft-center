import { COMPANY_PHONES, SHOP_ADDRESS, SHOP_EMAIL, getWhatsAppUrl } from '../../utils/whatsapp'
import './Contact.css'

function Contact() {
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
          <div className="contact-intro">
            <p className="contact-section__eyebrow">Visit Our Store</p>
            <h2>We Would Love to Hear From You</h2>
            <p className="contact-intro__note">
              Call, WhatsApp, or email us. We will reply as soon as we can.
            </p>
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
                  <p>{SHOP_ADDRESS}</p>
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
                  {COMPANY_PHONES.map((phone) => (
                    <p key={phone.tel}>
                      <a href={phone.tel}>{phone.display}</a>
                    </p>
                  ))}
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
                    <a href={`mailto:${SHOP_EMAIL}`}>{SHOP_EMAIL}</a>
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
              <a href={COMPANY_PHONES[0].tel}>Call Now</a>
              <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer">
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
