import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__container">
        <NavLink to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🐘</span>
          <div>
            <h1>Kandyan</h1>
            <p>Handicraft Center</p>
          </div>
        </NavLink>

        <nav className="navbar__links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/collections">Collections</NavLink>
          <NavLink to="/gems">Gems</NavLink>
          <NavLink to="/gallery">Photo Gallery</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
        </nav>

        <NavLink to="/contact" className="navbar__button">
          Custom Order
        </NavLink>
      </div>
    </header>
  )
}

export default Navbar