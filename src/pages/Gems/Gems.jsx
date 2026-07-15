import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { gems } from '../../data/gems'
import './Gems.css'

const filters = [
  { id: 'all', label: 'All Gems' },
  { id: 'precious', label: 'Precious Gems' },
  { id: 'semi', label: 'Semi Precious Gems' },
  { id: 'rare', label: 'Rare Gems' },
  { id: 'apala', label: 'Astrology Gems' },
]

function Gems() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [heroReady, setHeroReady] = useState(false)

  const visibleGems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return gems.filter((gem) => {
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'apala' ? gem.apala : gem.category === activeFilter)
      const matchesSearch =
        !query ||
        gem.name.toLowerCase().includes(query) ||
        gem.color.toLowerCase().includes(query)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, search])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHeroReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <main className={`gems-page${heroReady ? ' is-ready' : ''}`}>
      <section className="gems-hero">
        <div className="gems-hero__media" aria-hidden="true">
          <img
            src="/images/gems-hero.png?v=2"
            alt=""
            className="gems-hero__image"
          />
          <span className="gems-hero__orb gems-hero__orb--a" />
          <span className="gems-hero__orb gems-hero__orb--b" />
          <span className="gems-hero__shine" />
        </div>

        <div className="gems-hero__inner">
          <div className="gems-hero__content">
            <p className="gems-hero__eyebrow">Island Treasures</p>
            <h1>Gems of Sri Lanka</h1>
            <div className="gems-hero__line" aria-hidden="true" />
            <p>
              Discover the natural gemstones Sri Lanka is known for — from
              precious sapphires to rare and semi-precious stones found across
              the island.
            </p>
          </div>
        </div>
      </section>

      <section className="gems-content">
        <div className="container">
          <div className="gems-toolbar">
            <div className="gems-filters">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`gems-filters__btn ${
                    activeFilter === filter.id ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <label className="gems-search">
              <input
                type="search"
                placeholder="Search gem..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <svg
                className="gems-search__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M16.5 16.5L21 21"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </label>
          </div>

          <div key={`${activeFilter}-${search}`} className="gems-grid">
            {visibleGems.map((gem, index) => (
              <article
                className="gem-card"
                key={gem.id}
                style={{ '--stagger': `${Math.min(index, 17) * 0.04}s` }}
              >
                <div className="gem-card__image-wrap">
                  <img src={gem.image} alt={gem.name} />
                </div>

                <div className="gem-card__content">
                  <h2>{gem.name}</h2>
                  <p>{gem.color}</p>
                  <Link to={`/gems/${gem.slug}`} className="gem-card__btn">
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {visibleGems.length === 0 && (
            <p className="gems-empty">No gems found for your search.</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default Gems
