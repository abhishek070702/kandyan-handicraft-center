import { NavLink } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <NavLink to="/" className="footer__logo">
            <span>🐘</span>
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
          <p>No. 123, Kandy Road, Kandy, Sri Lanka</p>
          <p>+94 77 123 4567</p>
          <p>info@kandyanhandicraft.lk</p>
          <p>Mon - Sat: 9.00 AM - 6.00 PM</p>
        </div>

        <div className="footer__newsletter">
          <h3>Newsletter</h3>
          <p>Subscribe to get latest collections and custom jewellery updates.</p>

          <form className="footer__form">
            <input type="email" placeholder="Enter your email" />
            <button type="button">Subscribe</button>
          </form>

          <div className="footer__socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              f
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              ◎
            </a>
            <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              ☏
            </a>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© 2026 Kandyan Handicraft Center. All Rights Reserved.</p>
        <div>
          <NavLink to="/">Privacy Policy</NavLink>
          <span>|</span>
          <NavLink to="/">Terms & Conditions</NavLink>
        </div>
      </div>
    </footer>
  )
}

export default Footer