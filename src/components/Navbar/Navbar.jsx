import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { COMPANY_PHONES, getCustomOrderWhatsAppUrl } from '../../utils/whatsapp'
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
  const [isCallOpen, setIsCallOpen] = useState(false)
  const callRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
    setIsCallOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen && !isCallOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (isCallOpen) {
        setIsCallOpen(false)
        return
      }
      setIsMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen, isCallOpen])

  useEffect(() => {
    if (!isCallOpen) return undefined

    const onPointerDown = (event) => {
      if (!callRef.current?.contains(event.target)) setIsCallOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [isCallOpen])

  return (
    <header className={`navbar ${isMenuOpen ? 'navbar--open' : ''}`}>
      <div className="navbar__container">
        <NavLink to="/" className="navbar__logo">
          <img
            src="/images/logo-elephant.png"
            alt="Kandyan Handicraft Centre"
            className="navbar__logo-image"
          />
          <div>
            <span className="navbar__logo-title">Kandyan</span>
            <p>Handicraft Centre</p>
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

          <div className="navbar__call" ref={callRef}>
            <button
              type="button"
              className="navbar__call-btn"
              aria-label="Call the shop"
              aria-expanded={isCallOpen}
              onClick={() => setIsCallOpen((open) => !open)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7.4 3.8h2.6c.7 0 1.3.5 1.4 1.2l.4 2.2a1.5 1.5 0 0 1-.4 1.3l-1.1 1.2a12.6 12.6 0 0 0 4.2 4.2l1.2-1.1a1.5 1.5 0 0 1 1.3-.4l2.2.4c.7.1 1.2.7 1.2 1.4v2.6c0 .8-.6 1.5-1.4 1.5C10.8 19.8 4.2 13.2 4 5.2c0-.8.6-1.4 1.4-1.4Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className={`navbar__call-menu${isCallOpen ? ' is-open' : ''}`}>
              {COMPANY_PHONES.map((phone) => (
                <a key={phone.tel} href={phone.tel}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M7.4 3.8h2.6c.7 0 1.3.5 1.4 1.2l.4 2.2a1.5 1.5 0 0 1-.4 1.3l-1.1 1.2a12.6 12.6 0 0 0 4.2 4.2l1.2-1.1a1.5 1.5 0 0 1 1.3-.4l2.2.4c.7.1 1.2.7 1.2 1.4v2.6c0 .8-.6 1.5-1.4 1.5C10.8 19.8 4.2 13.2 4 5.2c0-.8.6-1.4 1.4-1.4Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {phone.display}
                </a>
              ))}
            </div>
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
