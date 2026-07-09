import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__container">
        <a href="/" className="navbar__logo">
          <span className="navbar__logo-icon">🐘</span>
          <div>
            <h1>Kandyan</h1>
            <p>Handicraft Center</p>
          </div>
        </a>

        <nav className="navbar__links">
          <a href="/">Home</a>
          <a href="/collections">Collections</a>
          <a href="/gems">Gems</a>
          <a href="/gallery">Photo Gallery</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
        </nav>

        <button className="navbar__button">
          Custom Order
        </button>
      </div>
    </header>
  )
}

export default Navbar