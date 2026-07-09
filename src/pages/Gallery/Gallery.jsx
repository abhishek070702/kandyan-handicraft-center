import { galleryImages } from '../../data/galleryImages'
import './Gallery.css'

function Gallery() {
  return (
    <main className="gallery-page">
      <section className="gallery-hero">
        <div className="container">
          <p className="gallery-hero__eyebrow">Our Moments</p>
          <h1>Photo Gallery</h1>
          <p>
            A glimpse into our handcrafted jewellery, custom creations and
            timeless Sri Lankan craftsmanship.
          </p>
        </div>
      </section>

      <section className="gallery-content">
        <div className="container gallery-grid">
          {galleryImages.map((item) => (
            <article className="gallery-card" key={item.id}>
              <img src={item.image} alt={item.title} />

              <div className="gallery-card__overlay">
                <p>{item.category}</p>
                <h2>{item.title}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Gallery