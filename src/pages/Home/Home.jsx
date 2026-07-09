import './Home.css'

function Home() {
  return (
    <main className="home">
      <section className="home__hero">
        <div className="container home__hero-grid">
          <div className="home__content">
            <p className="home__eyebrow">Heritage. Craft. Elegance.</p>

            <h1>
              Timeless Beauty. <br />
              Crafted with Passion.
            </h1>

            <p className="home__description">
              Exquisite handcrafted jewellery inspired by Sri Lankan tradition,
              designed for elegance that lasts forever.
            </p>

            <div className="home__actions">
              <a href="/collections" className="home__primary-btn">
                Explore Collection
              </a>

              <a href="/contact" className="home__secondary-btn">
                Book Custom Order
              </a>
            </div>
          </div>

          <div className="home__visual">
            <img
              src="/images/hero-jewellery.png"
              alt="Ornate gold necklace with rubies and pearls"
              className="home__hero-image"
            />
          </div>
        </div>

        <div className="container home__collection-strip">
          <a href="/collections" className="home__collection-item">
            <span>💍</span>
            <h3>Rings</h3>
            <p>Explore →</p>
          </a>

          <a href="/collections" className="home__collection-item">
            <span>✨</span>
            <h3>Earrings</h3>
            <p>Explore →</p>
          </a>

          <a href="/collections" className="home__collection-item">
            <span>📿</span>
            <h3>Necklaces</h3>
            <p>Explore →</p>
          </a>

          <a href="/collections" className="home__collection-item">
            <span>◌</span>
            <h3>Bracelets</h3>
            <p>Explore →</p>
          </a>

          <a href="/collections" className="home__collection-item">
            <span>◎</span>
            <h3>Bangles</h3>
            <p>Explore →</p>
          </a>

          <a href="/collections" className="home__collection-item">
            <span>✦</span>
            <h3>Brooches</h3>
            <p>Explore →</p>
          </a>

          <a href="/collections" className="home__collection-item">
            <span>◇</span>
            <h3>Waist Chains</h3>
            <p>Explore →</p>
          </a>
        </div>

        <div className="container home__features">
          <div className="home__feature">
            <span>✦</span>
            <h3>Handcrafted Excellence</h3>
            <p>Made with care by skilled artisans.</p>
          </div>

          <div className="home__feature">
            <span>◇</span>
            <h3>Premium Materials</h3>
            <p>Gold, gems and quality materials.</p>
          </div>

          <div className="home__feature">
            <span>❖</span>
            <h3>Sri Lankan Heritage</h3>
            <p>Inspired by traditional craftsmanship.</p>
          </div>

          <div className="home__feature">
            <span>✧</span>
            <h3>Custom Designs</h3>
            <p>Personal jewellery crafted for you.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home