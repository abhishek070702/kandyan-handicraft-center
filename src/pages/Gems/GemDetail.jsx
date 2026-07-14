import { Link, useParams } from 'react-router-dom'
import { categoryLabels, getGemBySlug } from '../../data/gems'
import './GemDetail.css'

function GemDetail() {
  const { slug } = useParams()
  const gem = getGemBySlug(slug)

  if (!gem) {
    return (
      <main className="gem-detail-page">
        <div className="container gem-detail-empty">
          <h1>Gem not found</h1>
          <Link to="/gems" className="gem-detail__back">
            <svg
              className="gem-detail__back-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back to Gems</span>
          </Link>
        </div>
      </main>
    )
  }

  const details = gem.details

  return (
    <main className="gem-detail-page">
      <section className="gem-detail">
        <div className="container">
          <Link to="/gems" className="gem-detail__back">
            <svg
              className="gem-detail__back-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back to Gems</span>
          </Link>

          <div className="gem-detail__layout">
            <div className="gem-detail__media">
              <img src={gem.image} alt={gem.name} />
            </div>

            <div className="gem-detail__info">
              <p className="gem-detail__eyebrow">
                {categoryLabels[gem.category] || 'Gemstone'}
              </p>
              <h1>{gem.name}</h1>
              {gem.tagline && (
                <p className="gem-detail__tagline">{gem.tagline}</p>
              )}
              <p className="gem-detail__color">{gem.color}</p>

              {details ? (
                <div className="gem-detail__sections">
                  <section>
                    <h2>Introduction</h2>
                    <p>{details.introduction}</p>
                  </section>

                  {details.types && (
                    <section>
                      <h2>Types of {gem.name}</h2>
                      <div className="gem-detail__types">
                        {details.types.map((type) => (
                          <div className="gem-detail__type" key={type.name}>
                            <h3>{type.name}</h3>
                            <p>{type.meaning}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <h2>Where {gem.name} Can Be Found</h2>
                    <p>{details.whereFound}</p>
                  </section>

                  <section>
                    <h2>What {gem.name} Is Used For</h2>
                    <p>{details.usesIntro}</p>
                    <ul>
                      {details.uses.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p>{details.usesNote}</p>
                  </section>

                  <section>
                    <h2>Traditional / Apala Belief</h2>
                    <p>{details.belief}</p>
                  </section>
                </div>
              ) : (
                <div className="gem-detail__sections">
                  <section>
                    <p>
                      Full details for {gem.name} will be added soon. This is
                      one of the gemstones Sri Lanka is known for.
                    </p>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default GemDetail
