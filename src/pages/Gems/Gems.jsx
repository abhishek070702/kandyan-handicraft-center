import { gems } from '../../data/gems'
import './Gems.css'

function Gems() {
  return (
    <main className="gems-page">
      <section className="gems-hero">
        <div className="container gems-hero__grid">
          <div>
            <p className="gems-hero__eyebrow">Nature’s finest treasures</p>
            <h1>Precious Gems</h1>
            <p>
              Explore premium gemstones selected for brilliance, beauty and
              timeless handcrafted jewellery.
            </p>
          </div>

          <div className="gems-hero__visual">
            <span>Sapphire</span>
            <span>Ruby</span>
            <span>Emerald</span>
            <span>Topaz</span>
          </div>
        </div>
      </section>

      <section className="gems-content">
        <div className="container gems-grid">
          {gems.map((gem) => (
            <article className="gem-card" key={gem.id}>
              <div className="gem-card__image-wrap">
                <img src={gem.image} alt={gem.name} />
              </div>

              <div className="gem-card__content">
                <p>{gem.color}</p>
                <h2>{gem.name}</h2>
                <span>{gem.description}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Gems