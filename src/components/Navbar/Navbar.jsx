import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { getCustomOrderWhatsAppUrl } from '../../utils/whatsapp'
import './Navbar.css'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/collections', label: 'Collections' },
  { to: '/gems', label: 'Gems' },
  { to: '/gallery', label: 'Photo Gallery' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header className={`navbar ${isMenuOpen ? 'navbar--open' : ''}`}>
      <div className="navbar__container">
        <NavLink to="/" className="navbar__logo">
          <img
            src="/images/logo-elephant.png"
            alt="Kandyan Handicraft Center"
            className="navbar__logo-image"
          />
          <div>
            <h1>Kandyan</h1>
            <p>Handicraft Center</p>
          </div>
        </NavLink>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__menu ${isMenuOpen ? 'navbar__menu--open' : ''}`}>
          <div className="navbar__links">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <a
            href={getCustomOrderWhatsAppUrl()}
            className="navbar__button"
            target="_blank"
            rel="noreferrer"
          >
            Custom Order
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
