import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './About.css'

const eras = [
  {
    year: '1954',
    title: 'Where Our Heritage Began',
    name: 'Mr. Danthasinghe Chithra Moolacharige Patabendigē',
    aka: 'A highly talented traditional craftsman',
    image: '/images/about/patabendige-heritage.png',
    imageAlt:
      'Mr. Danthasinghe Chithra Moolacharige Patabendigē with his gold miniature of the Temple of the Sacred Tooth Relic',
    text: [
      'Our story began with Mr. Danthasinghe Chithra Moolacharige Patabendigē, a highly talented traditional craftsman renowned for creating exceptional artistic works.',
      'According to our family history, during Queen Elizabeth II’s visit to Sri Lanka in 1954, he presented several special exhibits that showcased the excellence of Sri Lankan traditional craftsmanship and the country’s proud heritage of gold, silver, pearls, and gemstones.',
      'Among his most remarkable creations was a highly detailed miniature model of the Temple of the Sacred Tooth Relic, crafted entirely from gold. This masterpiece reflected his extraordinary creativity, precision, patience, and devotion to Sri Lankan craftsmanship.',
    ],
  },
  {
    year: '1977',
    title: 'Kandyan Handicraft Center Was Established',
    name: 'Mr. D. C. M. Hemasiri',
    aka: 'Founder of Kandyan Handicraft Center, Kandy',
    image: '/images/about/hemasiri.png',
    imageAlt: 'Mr. D. C. M. Hemasiri at Kandyan Handicraft Center',
    text: [
      'In 1977, his son, Mr. D. C. M. Hemasiri, established Kandyan Handicraft Center in Kandy.',
      'The shop was opened at the same location where we continue to serve our customers today. Through dedication, skilled workmanship, and trusted customer relationships, he developed the business and introduced traditional Kandyan creations to customers from different countries.',
    ],
  },
  {
    year: '1983',
    title: 'Swarna Hansa Was Opened',
    name: 'Swarna Hansa',
    aka: 'Opened by Mr. D. C. M. Jagath Keerthi Dushmantha Chithrasena · 5th Mile Post, Nugawela',
    image: '/images/about/swarna-hansa.png',
    imageAlt: 'Inside Swarna Hansa in Nugawela — crafts, copperware, and guests',
    text: [
      'In 1983, Mr. D. C. M. Jagath Keerthi Dushmantha Chithrasena opened another shop named Swarna Hansa at 5th Mile Post, Nugawela.',
      'This was an important step in expanding the family’s craftsmanship and making its creations available to a wider community.',
    ],
  },
  {
    year: '1991',
    title: 'Continuing the Family Legacy',
    name: 'Mr. D. C. M. Jagath Keerthi Dushmantha Chithrasena',
    aka: 'Managing and developing Kandyan Handicraft Center',
    image: '/images/about/jagath-chithrasena.png',
    imageAlt:
      'Mr. D. C. M. Jagath Keerthi Dushmantha Chithrasena at Kandyan Handicraft Center',
    text: [
      'Since 1991, Mr. D. C. M. Jagath Keerthi Dushmantha Chithrasena has continued to manage and develop Kandyan Handicraft Center.',
      'By building strong relationships with both local and international customers, he further expanded the business while protecting the traditional knowledge, skills, and values inherited through generations.',
    ],
  },
]

const creations = [
  'Necklaces',
  'Earrings',
  'Bangles',
  'Bracelets',
  'Rings',
  'Pendants',
  'Brooches',
  'Bridal jewellery',
  'Waist chains (Hawadiya)',
  'Custom-made jewellery',
  'Traditional ornaments',
  'Decorative handicrafts',
]

const materials = [
  'Gold',
  'Silver',
  'Copper',
  'Brass',
  'Gemstones',
  'Pearls',
  'Decorative materials',
]

const services = [
  'Jewellery repairs and restoration',
  'Resizing and redesigning',
  'Gold and silver plating',
  'Jewellery colour restoration',
  'Polishing and cleaning',
  'Stone replacement',
  'Recreation of old or damaged jewellery',
  'Custom jewellery and handicraft manufacturing',
]

function About() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const nodes = root.querySelectorAll('[data-reveal]')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      nodes.forEach((node) => node.classList.add('is-revealed'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="about-page" ref={rootRef}>
      <section className="about-cover" aria-label="About Kandyan Handicraft Center">
        <div className="about-cover__atmosphere" aria-hidden="true">
          <span className="about-cover__orb about-cover__orb--a" />
          <span className="about-cover__orb about-cover__orb--b" />
          <span className="about-cover__grain" />
        </div>

        <div className="container about-cover__inner">
          <div className="about-cover__ornament" aria-hidden="true" />

          <img
            src="/images/logo-elephant.png"
            alt=""
            className="about-cover__seal"
          />

          <p className="about-cover__mark">About Us</p>

          <h1>
            Kandyan Handicraft
            <span>Center</span>
          </h1>

          <p className="about-cover__tagline">Crafted through generations</p>
        </div>
      </section>

      <section className="about-belief" data-reveal="up">
        <div className="container about-belief__inner">
          <p className="about-belief__lead">
            Jewellery making is more than a profession for us — it is knowledge,
            patience, and artistry passed down through generations in Kandy,
            Sri Lanka.
          </p>
          <p className="about-belief__years" aria-label="Key years">
            <span>1954</span>
            <span aria-hidden="true" />
            <span>1977</span>
            <span aria-hidden="true" />
            <span>1983</span>
            <span aria-hidden="true" />
            <span>1991</span>
            <span aria-hidden="true" />
            <span>Present</span>
          </p>
        </div>
      </section>

      <section
        className="about-chronicle"
        aria-label="Our journey through generations"
      >
        <div className="container about-chronicle__head" data-reveal="up">
          <p>The Family Chronicle</p>
          <h2>Four chapters of a living craft</h2>
        </div>

        <div className="about-chronicle__spine" aria-hidden="true" />

        {eras.map((era, index) => (
          <article
            key={era.year}
            className={`about-era ${index % 2 === 1 ? 'about-era--flip' : ''}`}
            data-reveal={index % 2 === 1 ? 'left' : 'right'}
            style={{ '--era-delay': `${index * 0.04}s` }}
          >
            <div className="container about-era__grid">
              <div className="about-era__year">
                <span>{era.year}</span>
              </div>

              <div className="about-era__body">
                <p className="about-era__chapter">{era.title}</p>
                <h3>{era.name}</h3>
                <p className="about-era__aka">{era.aka}</p>
                {era.text.map((paragraph) => (
                  <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                ))}
              </div>

              <figure className="about-era__figure">
                <div className="about-era__media">
                  <img src={era.image} alt={era.imageAlt} />
                </div>
              </figure>
            </div>
          </article>
        ))}
      </section>

      <section className="about-atelier" data-reveal="up">
        <div className="about-atelier__glow" aria-hidden="true" />
        <div className="container about-atelier__wrap">
          <header className="about-atelier__head">
            <div className="about-atelier__ornament" aria-hidden="true" />
            <p>What We Create</p>
            <h2>Traditional soul. Contemporary grace.</h2>
            <p className="about-atelier__intro">
              Today, Kandyan Handicraft Center creates a wide range of
              traditional and modern jewellery — each piece shaped with
              inherited skill and lasting beauty.
            </p>
          </header>

          <ul className="about-atelier__creations">
            {creations.map((item, index) => (
              <li
                key={item}
                data-reveal="up"
                style={{ '--stagger': `${index * 0.04}s` }}
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="about-atelier__materials-block">
            <p className="about-atelier__materials-label">We create with</p>
            <ul className="about-atelier__materials">
              {materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="about-atelier__note">
            <p>
              Bring us a photograph, drawing, sample, old jewellery piece, or
              even a simple idea. Our craftsmen transform it into a creation
              shaped around your preferred design, material, size, style,
              occasion, and budget.
            </p>
            <Link to="/collections" className="about-atelier__link">
              Explore collections
            </Link>
          </div>
        </div>
      </section>

      <section className="about-care" data-reveal="up">
        <div className="about-care__glow" aria-hidden="true" />
        <div className="container about-care__wrap">
          <header className="about-care__head">
            <div className="about-care__ornament" aria-hidden="true" />
            <p className="about-care__eyebrow">Jewellery Services</p>
            <h2>Care beyond creation</h2>
            <p className="about-care__intro">
              Every piece is handled with care — especially jewellery that
              carries sentimental, cultural, or family value.
            </p>
          </header>

          <ol className="about-care__list">
            {services.map((service, index) => (
              <li
                key={service}
                data-reveal="up"
                style={{ '--stagger': `${index * 0.045}s` }}
              >
                <span className="about-care__num">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="about-care__label">{service}</span>
              </li>
            ))}
          </ol>

          <div className="about-care__foot">
            <p>
              Trust us with pieces that matter — restored, refined, and returned
              with the same devotion that shaped them.
            </p>
            <Link to="/contact" className="about-care__link">
              Ask about a service
            </Link>
          </div>
        </div>
      </section>

      <section className="about-close" data-reveal="up">
        <div className="about-close__atmosphere" aria-hidden="true">
          <span className="about-close__orb about-close__orb--a" />
          <span className="about-close__orb about-close__orb--b" />
        </div>
        <div className="container about-close__inner">
          <div className="about-close__ornament" aria-hidden="true" />
          <img
            src="/images/logo-elephant.png"
            alt=""
            className="about-close__seal"
          />
          <p className="about-close__whisper">Crafted Through Generations</p>
          <h2>
            Created especially
            <span>for you.</span>
          </h2>
          <p className="about-close__body">
            Every creation reflects our family heritage, traditional artistry,
            and commitment to quality — combining generations of craftsmanship
            with modern creativity, personalised service, and fair pricing.
          </p>
          <p className="about-close__years" aria-hidden="true">
            <span>1954</span>
            <span />
            <span>Present</span>
          </p>
          <div className="about-close__actions">
            <Link to="/contact" className="about-close__link">
              Visit the shop
            </Link>
            <Link to="/collections" className="about-close__link about-close__link--ghost">
              View collections
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
