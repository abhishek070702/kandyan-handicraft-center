import { useEffect, useMemo, useState } from 'react'
import { galleryFilters, galleryImages } from '../../data/galleryImages'
import './Gallery.css'

function Gallery() {
  const [filter, setFilter] = useState('all')
  const [activeId, setActiveId] = useState(null)

  const items = useMemo(() => {
    if (filter === 'all') return galleryImages
    return galleryImages.filter((item) => item.category === filter)
  }, [filter])

  const activeIndex = items.findIndex((item) => item.id === activeId)
  const activeItem = activeIndex >= 0 ? items[activeIndex] : null

  useEffect(() => {
    if (!activeItem) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveId(null)
      if (event.key === 'ArrowRight') {
        const next = items[(activeIndex + 1) % items.length]
        setActiveId(next.id)
      }
      if (event.key === 'ArrowLeft') {
        const prev = items[(activeIndex - 1 + items.length) % items.length]
        setActiveId(prev.id)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeItem, activeIndex, items])

  const openAt = (id) => setActiveId(id)
  const close = () => setActiveId(null)
  const showPrev = () => {
    if (activeIndex < 0) return
    const prev = items[(activeIndex - 1 + items.length) % items.length]
    setActiveId(prev.id)
  }
  const showNext = () => {
    if (activeIndex < 0) return
    const next = items[(activeIndex + 1) % items.length]
    setActiveId(next.id)
  }

  return (
    <main className="gallery-page">
      <section className="gallery-hero" aria-label="Photo Gallery">
        <div className="gallery-hero__atmosphere" aria-hidden="true">
          <span className="gallery-hero__orb gallery-hero__orb--a" />
          <span className="gallery-hero__orb gallery-hero__orb--b" />
          <span className="gallery-hero__spark gallery-hero__spark--1" />
          <span className="gallery-hero__spark gallery-hero__spark--2" />
          <span className="gallery-hero__spark gallery-hero__spark--3" />
          <span className="gallery-hero__grain" />
        </div>
        <div className="container gallery-hero__inner">
          <div className="gallery-hero__ornament" aria-hidden="true" />
          <p className="gallery-hero__eyebrow">Our Moments</p>
          <h1>Photo Gallery</h1>
          <p className="gallery-hero__lead">
            Heritage moments and guests learning to craft — glimpses of the
            skill passed from generation to generation.
          </p>
          <div className="gallery-hero__rule" aria-hidden="true" />
        </div>
      </section>

      <section className="gallery-content">
        <div className="container">
          <div className="gallery-filters" role="tablist" aria-label="Gallery filters">
            {galleryFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                className={`gallery-filters__btn${filter === item.id ? ' is-active' : ''}`}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="gallery-masonry">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`gallery-tile gallery-tile--${item.span}`}
                style={{ '--stagger': `${(index % 8) * 0.04}s` }}
                onClick={() => openAt(item.id)}
              >
                <span className="gallery-tile__frame">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </span>
                <span className="gallery-tile__meta">
                  <span className="gallery-tile__category">{item.category}</span>
                  <span className="gallery-tile__title">{item.title}</span>
                </span>
              </button>
            ))}
          </div>

          {items.length === 0 && (
            <p className="gallery-empty">No images in this collection yet.</p>
          )}
        </div>
      </section>

      {activeItem && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={close}
        >
          <button
            type="button"
            className="gallery-lightbox__close"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>
          <button
            type="button"
            className="gallery-lightbox__nav gallery-lightbox__nav--prev"
            onClick={(event) => {
              event.stopPropagation()
              showPrev()
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <figure
            className="gallery-lightbox__figure"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={activeItem.image} alt={activeItem.title} />
            <figcaption>
              <p>{activeItem.category}</p>
              <h2>{activeItem.title}</h2>
              <p className="gallery-lightbox__caption">{activeItem.caption}</p>
            </figcaption>
          </figure>
          <button
            type="button"
            className="gallery-lightbox__nav gallery-lightbox__nav--next"
            onClick={(event) => {
              event.stopPropagation()
              showNext()
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </main>
  )
}

export default Gallery
