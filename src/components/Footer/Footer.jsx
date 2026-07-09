import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a href="/" className="footer__logo">
            <span>🐘</span>
            <div>
              <h2>Kandyan</h2>
              <p>Handicraft Center</p>
            </div>
          </a>

          <p className="footer__description">
            Discover timeless handcrafted jewellery inspired by Sri Lanka’s
            heritage, crafted with elegance and passion.
          </p>
        </div>

        <div className="footer__links">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/collections">Collections</a>
          <a href="/gems">Gems</a>
          <a href="/gallery">Photo Gallery</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
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
            <a href="/" aria-label="Facebook">f</a>
            <a href="/" aria-label="Instagram">◎</a>
            <a href="/" aria-label="WhatsApp">☏</a>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© 2026 Kandyan Handicraft Center. All Rights Reserved.</p>
        <div>
          <a href="/">Privacy Policy</a>
          <span>|</span>
          <a href="/">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer