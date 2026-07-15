import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductZoomModal from '../../components/ProductZoomModal/ProductZoomModal'
import MetalRates from '../../components/MetalRates/MetalRates'
import { categories, getFeaturedProducts } from '../../data/collections'
import { heroSlides } from '../../data/heroSlides'
import { getCustomOrderWhatsAppUrl } from '../../utils/whatsapp'
import './Home.css'

const HERO_ROTATE_MS = 5000
const FEATURED_ROTATE_MS = 20000
const FEATURED_PAGE_SIZE = 4

function useRevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.home-reveal'))
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
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [heroIndex, setHeroIndex] = useState(0)
  const [disableTransition, setDisableTransition] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const [featuredPage, setFeaturedPage] = useState(0)
  const slideCount = heroSlides.length
  const extendedSlides = useMemo(
    () => (slideCount > 0 ? [...heroSlides, heroSlides[0]] : []),
    [slideCount],
  )
  const activeDot = slideCount > 0 ? heroIndex % slideCount : 0
  const featuredPool = useMemo(() => getFeaturedProducts(24), [])
  const featuredPageCount = Math.max(
    1,
    Math.ceil(featuredPool.length / FEATURED_PAGE_SIZE),
  )
  const featuredProducts = useMemo(() => {
    const start = (featuredPage % featuredPageCount) * FEATURED_PAGE_SIZE
    return featuredPool.slice(start, start + FEATURED_PAGE_SIZE)
  }, [featuredPool, featuredPage, featuredPageCount])
  const resetTimeoutRef = useRef(null)

  useRevealOnScroll()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHeroReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

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

  useEffect(() => {
    if (featuredPageCount <= 1) return undefined

    const interval = window.setInterval(() => {
      setFeaturedPage((page) => (page + 1) % featuredPageCount)
    }, FEATURED_ROTATE_MS)

    return () => window.clearInterval(interval)
  }, [featuredPageCount])

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
      <section className={`home__hero${heroReady ? ' is-ready' : ''}`}>
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
                className={`home__hero-slide${
                  slideCount > 0 && index % slideCount === activeDot
                    ? ' is-active'
                    : ''
                }`}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            ))}
          </div>

          <div className="home__hero-overlay" aria-hidden="true" />
          <div className="home__hero-shine" aria-hidden="true" />

          <div className="container home__hero-grid">
            <div className="home__content">
              <p className="home__eyebrow">Heritage. Craft. Elegance.</p>
              <span className="home__eyebrow-rule" aria-hidden="true" />

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

                <a
                  href={getCustomOrderWhatsAppUrl()}
                  className="home__secondary-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  Book Custom Order
                </a>
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

        <div className="container home__features home-reveal">
          {[
            {
              icon: '/images/features/handcrafted.png',
              title: 'Handcrafted Excellence',
              text: 'Made with care by skilled artisans.',
            },
            {
              icon: '/images/features/premium.png',
              title: 'Premium Quality Materials',
              text: 'Gold, gems and quality materials.',
            },
            {
              icon: '/images/features/heritage.png',
              title: 'Authentic Sri Lankan Craft',
              text: 'Inspired by traditional craftsmanship.',
            },
            {
              icon: '/images/features/custom.png',
              title: 'Custom Designs Available',
              text: 'Personal jewellery crafted for you.',
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="home__feature"
              style={{ '--stagger': `${index * 0.08}s` }}
            >
              <img src={feature.icon} alt="" className="home__feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>

        <div className="home-reveal">
          <MetalRates />
        </div>

        <div className="container home__collection-strip home-reveal">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/collections/${category.slug}`}
              className="home__collection-item"
              style={{ '--stagger': `${index * 0.06}s` }}
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

        <div className="container home__featured home-reveal">
          <div className="home__section-header">
            <p>Selected pieces</p>
            <h2>Featured Collection</h2>
          </div>

          <div
            key={featuredPage}
            className="home__product-grid home__product-grid--swap"
          >
            {featuredProducts.map((product, index) => (
              <div
                key={product.featuredId}
                className="home__product-reveal"
                style={{ '--stagger': `${index * 0.06}s` }}
              >
                <ProductCard product={product} onSelect={setSelectedProduct} />
              </div>
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
