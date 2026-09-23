import { NavLink } from 'react-router-dom'
import {
  COMPANY_PHONES,
  SHOP_ADDRESS,
  SHOP_EMAIL,
  getCustomOrderWhatsAppUrl,
  getWhatsAppUrl,
} from '../../utils/whatsapp'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <NavLink to="/" className="footer__logo">
            <img
              src="/images/logo-elephant.png"
              alt="Kandyan Handicraft Center"
              className="footer__logo-image"
            />
            <div>
              <h2>Kandyan</h2>
              <p>Handicraft Center</p>
            </div>
          </NavLink>

          <p className="footer__description">
            Discover timeless handcrafted jewellery inspired by Sri Lanka’s
            heritage, crafted with elegance and passion.
          </p>
        </div>

        <div className="footer__links">
          <h3>Quick Links</h3>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/collections">Collections</NavLink>
          <NavLink to="/gems">Gems</NavLink>
          <NavLink to="/gallery">Photo Gallery</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
        </div>

        <div className="footer__contact">
          <h3>Contact Us</h3>
          <p>{SHOP_ADDRESS}</p>
          {COMPANY_PHONES.map((phone) => (
            <p key={phone.tel}>
              <a href={phone.tel}>{phone.display}</a>
            </p>
          ))}
          <p>
            <a href={`mailto:${SHOP_EMAIL}`}>{SHOP_EMAIL}</a>
          </p>
          <p>Mon - Sat: 9.00 AM - 6.00 PM</p>
          <p>Sunday: 9.00 AM - 12.00 PM</p>
        </div>

        <div className="footer__newsletter">
          <h3>Custom Orders</h3>
          <p>Tell us about a design, a repair, or a piece you would like made.</p>

          <a
            className="footer__cta"
            href={getCustomOrderWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
          >
            Message on WhatsApp
          </a>

          <div className="footer__socials">
            <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10.1 10.1 0 0 0 4.65 1.12h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.86c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.64-.61-2.88-1.25-4.76-4.16-4.9-4.35-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.39 1.02-.39h.36c.12 0 .28-.04.44.34.16.39.56 1.36.61 1.46.05.1.08.22.02.36-.06.14-.1.22-.19.34-.1.12-.2.27-.29.36-.1.1-.2.2-.08.39.11.19.5.83 1.08 1.34.74.66 1.36.87 1.56.97.19.1.31.08.42-.05.12-.14.49-.57.62-.77.13-.19.26-.16.44-.1.18.06 1.14.54 1.34.64.19.1.32.14.37.22.05.08.05.46-.19 1.14z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© 2026 Kandyan Handicraft Center. All Rights Reserved.</p>
        <div>
          <NavLink to="/privacy-policy">Privacy Policy</NavLink>
          <span>|</span>
          <NavLink to="/terms-and-conditions">Terms & Conditions</NavLink>
        </div>
      </div>
    </footer>
  )
}

export default Footer