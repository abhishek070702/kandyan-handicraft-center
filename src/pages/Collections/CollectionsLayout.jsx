import { useMemo } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { getCategoryBySlug } from '../../data/collections'
import './CollectionsLayout.css'

const mainHero = {
  eyebrow: 'Heritage Jewellery',
  title: 'Our Collections',
  description:
    'Handcrafted pieces shaped by Sri Lankan artistry — refined for every occasion.',
  image: '/images/collections-hero.png',
  imagePosition: 'center 58%',
}

function CollectionsLayout() {
  const { slug } = useParams()
  const category = slug ? getCategoryBySlug(slug) : null

  const showHero = !category?.hideHero

  const hero = useMemo(() => {
    if (!category) return mainHero

    return {
      eyebrow: 'Curated Collection',
      title: category.name,
      description: category.heroDescription || category.description,
      image: category.heroImage,
      imagePosition: category.heroImagePosition || 'center 42%',
      imageOffsetY: category.heroImageOffsetY || '0%',
      imageScale: category.heroImageScale ?? 1.04,
      layoutClass: category.heroLayoutClass || '',
    }
  }, [category])

  return (
    <main className={`collections-layout${!showHero ? ' collections-layout--no-hero' : ''}`}>
      {showHero && (
      <section
        className={`collections-layout-hero${hero.layoutClass ? ` ${hero.layoutClass}` : ''}`}
      >
        <div className="collections-layout-hero__media" aria-hidden="true">
          <img
            key={hero.image}
            src={hero.image}
            alt=""
            className="collections-layout-hero__image"
            style={{
              objectPosition: hero.imagePosition,
              '--hero-image-scale': hero.imageScale ?? 1.04,
              '--hero-image-offset-y': hero.imageOffsetY || '0%',
            }}
          />
        </div>

        <div className="container collections-layout-hero__content">
          <p key={hero.eyebrow} className="collections-layout-hero__eyebrow">
            {hero.eyebrow}
          </p>
          <div className="collections-layout-hero__line" aria-hidden="true" />
          <h1 key={hero.title}>{hero.title}</h1>
          <p key={hero.description} className="collections-layout-hero__description">
            {hero.description}
          </p>
        </div>
      </section>
      )}

      <section id="collections-body" className="collections-layout-body">
        <div key={slug || 'index'} className="collections-layout-panel">
          <Outlet />
        </div>
      </section>
    </main>
  )
}

export default CollectionsLayout
