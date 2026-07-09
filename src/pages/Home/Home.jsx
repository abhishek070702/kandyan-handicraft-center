import './Home.css'

function Home() {
  return (
    <main className="home">
      <section className="home__hero">
        <div className="container home__hero-content">
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
      </section>
    </main>
  )
}

export default Home