import { Link } from 'react-router-dom'
import { categories } from '../../data/collections'
import './Collections.css'

function Collections() {
  return (
    <div className="container">
      <div className="collections-category-grid">
        {categories.map((category) => (
          <Link
            to={`/collections/${category.slug}`}
            className="collections-category-card"
            key={category.id}
          >
            <div className="collections-category-card__image">
              <img src={category.image} alt={category.name} />
            </div>

            <div className="collections-category-card__content">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <span>Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Collections
