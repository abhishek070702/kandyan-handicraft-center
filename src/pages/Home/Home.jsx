import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductZoomModal from '../../components/ProductZoomModal/ProductZoomModal'
import MetalRates from '../../components/MetalRates/MetalRates'
import { categories, getFeaturedProducts } from '../../data/collections'
import { heroSlides } from '../../data/heroSlides'
import './Home.css'

const HERO_ROTATE_MS = 5000

function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [heroIndex, setHeroIndex] = useState(0)
  const [disableTransition, setDisableTransition] = useState(false)
  const slideCount = heroSlides.length
  const extendedSlides = useMemo(
    () => (slideCount > 0 ? [...heroSlides, heroSlides[0]] : []),
    [slideCount],
  )
  const activeDot = slideCount > 0 ? heroIndex % slideCount : 0
  const featuredProducts = useMemo(() => getFeaturedProducts(4), [])
  const resetTimeoutRef = useRef(null)

  const resetSlidePosition = useCallback((index) => {
    setDisableTransition(true)
    setHeroIndex(index)

    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current)
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setDisableTransition(false)
      resetTimeoutRef.current = null
    }, 20)
  }, [])

  const handleSlideTransitionEnd = useCallback(
    (event) => {
      if (event.propertyName !== 'transform') return
      if (heroIndex === slideCount) {
        resetSlidePosition(0)
      }
    },
    [heroIndex, resetSlidePosition, slideCount],
  )

  const goToSlide = useCallback(
    (index) => {
      if (index === activeDot) return
      resetSlidePosition(index)
    },
    [activeDot, resetSlidePosition],
  )

  useEffect(() => {
    if (slideCount <= 1) return undefined

    const interval = window.setInterval(() => {
      setHeroIndex((index) => (index >= slideCount ? index : index + 1))
    }, HERO_ROTATE_MS)

    return () => window.clearInterval(interval)
  }, [slideCount])

  useEffect(
    () => () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current)
      }
    },
    [],
  )

  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__hero-banner">
          <div
            className={`home__hero-slides${disableTransition ? ' home__hero-slides--instant' : ''}`}
            style={{ transform: `translateX(-${heroIndex * 100}%)` }}
            onTransitionEnd={handleSlideTransitionEnd}
            aria-hidden="true"
          >
            {extendedSlides.map((slide, index) => (
              <div
                key={`${slide.id}-${index}`}
                className="home__hero-slide"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            ))}
          </div>

          <div className="home__hero-overlay" aria-hidden="true" />

          <div className="container home__hero-grid">
            <div className="home__content">
              <p className="home__eyebrow">Heritage. Craft. Elegance.</p>

              <h1>
                <span className="home__hero-line">Timeless Beauty.</span>
                <span className="home__hero-line">Crafted with Passion.</span>
              </h1>

              <p className="home__description">
                Exquisite handcrafted jewellery inspired by Sri Lankan tradition,
                designed for elegance that lasts forever.
              </p>

              <div className="home__actions">
                <Link to="/collections" className="home__primary-btn">
                  Explore Collection
                </Link>

                <Link to="/contact" className="home__secondary-btn">
                  Book Custom Order
                </Link>
              </div>
            </div>
          </div>

          {slideCount > 1 && (
            <div className="home__hero-dots" role="tablist" aria-label="Hero showcase">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeDot}
                  aria-label={`Show ${slide.alt}`}
                  className={`home__hero-dot${index === activeDot ? ' is-active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}
        </div>

      <div className="container home__features">
        <div className="home__feature">
          <img
            src="/images/features/handcrafted.png"
            alt=""
            className="home__feature-icon"
          />
          <h3>Handcrafted Excellence</h3>
          <p>Made with care by skilled artisans.</p>
        </div>

        <div className="home__feature">
          <img
            src="/images/features/premium.png"
            alt=""
            className="home__feature-icon"
          />
          <h3>Premium Quality Materials</h3>
          <p>Gold, gems and quality materials.</p>
        </div>

        <div className="home__feature">
          <img
            src="/images/features/heritage.png"
            alt=""
            className="home__feature-icon"
          />
          <h3>Authentic Sri Lankan Craft</h3>
          <p>Inspired by traditional craftsmanship.</p>
        </div>

        <div className="home__feature">
          <img
            src="/images/features/custom.png"
            alt=""
            className="home__feature-icon"
          />
          <h3>Custom Designs Available</h3>
          <p>Personal jewellery crafted for you.</p>
        </div>
      </div>

      <MetalRates />

      <div className="container home__collection-strip">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/collections/${category.slug}`}
            className="home__collection-item"
          >
            <img
              src={category.cardImage}
              alt={category.name}
              className="home__collection-bg"
            />
            <div className="home__collection-content">
              <h3>{category.name}</h3>
              <p>Explore →</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="container home__featured">
        <div className="home__section-header">
          <p>Selected pieces</p>
          <h2>Featured Collection</h2>
        </div>

        <div className="home__product-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.featuredId}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductZoomModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      </section>
    </main>
  )
}

export default Home
