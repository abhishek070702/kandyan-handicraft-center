import { Link } from 'react-router-dom'
import { collections } from '../../data/collections'
import './Collections.css'

function Collections() {
  return (
    <main className="collections-page">
      <section className="collections-hero">
        <div className="container">
          <p className="collections-hero__eyebrow">Explore Jewellery</p>
          <h1>Our Collections</h1>
          <p>
            Discover handcrafted jewellery designed with heritage, elegance and
            timeless craftsmanship.
          </p>
        </div>
      </section>

      <section className="collections-content">
        <div className="container collections-grid">
          {collections.map((item) => (
            <Link to="/collections" className="collection-card" key={item.id}>
              <div className="collection-card__image-wrap">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="collection-card__content">
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <span>Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Collections