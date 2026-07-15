import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/collections'
import './Collections.css'

function Collections() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.collections-reveal'))
    if (!nodes.length) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="container">
      <div className="collections-category-grid">
        {categories.map((category, index) => (
          <Link
            to={`/collections/${category.slug}`}
            className="collections-category-card collections-reveal"
            key={category.id}
            style={{ '--stagger': `${index * 0.07}s` }}
          >
            <div className="collections-category-card__image">
              <img src={category.image} alt={category.name} />
            </div>

            <div className="collections-category-card__content">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <span className="collections-category-card__cta">
                <span className="collections-category-card__cta-label">Explore</span>
                <span className="collections-category-card__arrow" aria-hidden="true">
                  <svg viewBox="0 0 32 32" className="collections-category-card__arrow-icon">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M11 16h9.5M16.5 11.5 21.5 16l-5 4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Collections
