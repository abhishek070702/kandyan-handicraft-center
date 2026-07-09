import './About.css'

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="container about-hero__grid">
          <div className="about-hero__content">
            <p className="about-hero__eyebrow">Our Story</p>
            <h1>Crafted by Tradition. Inspired by Generations.</h1>
            <p>
              Kandyan Handicraft Center is a family-owned jewellery boutique
              built with a passion for preserving Sri Lanka’s rich heritage of
              craftsmanship.
            </p>
          </div>

          <div className="about-hero__image-wrap">
            <img
              src="/images/hero-jewellery.png"
              alt="Traditional handcrafted jewellery"
            />
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container about-story__grid">
          <div>
            <p className="about-section__eyebrow">The Craftsmanship</p>
            <h2>From Our Hands to Your Heart</h2>
          </div>

          <div>
            <p>
              Every piece we create tells a story of dedication, patience and
              beauty. From traditional designs to custom jewellery, our work
              blends heritage with modern elegance.
            </p>

            <p>
              We believe jewellery is not only an accessory. It is a memory, a
              celebration and a timeless treasure passed through generations.
            </p>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="container about-stats__grid">
          <div className="about-stat">
            <h3>25+</h3>
            <p>Years of Experience</p>
          </div>

          <div className="about-stat">
            <h3>10K+</h3>
            <p>Happy Customers</p>
          </div>

          <div className="about-stat">
            <h3>100%</h3>
            <p>Handcrafted Jewellery</p>
          </div>

          <div className="about-stat">
            <h3>Custom</h3>
            <p>Jewellery Designs</p>
          </div>
        </div>
      </section>

      <section className="about-process">
        <div className="container">
          <div className="about-section-header">
            <p>Our Process</p>
            <h2>How We Create Your Jewellery</h2>
          </div>

          <div className="about-process__grid">
            <div className="about-process__card">
              <span>01</span>
              <h3>Design</h3>
              <p>We understand your idea and prepare the jewellery concept.</p>
            </div>

            <div className="about-process__card">
              <span>02</span>
              <h3>Handcraft</h3>
              <p>Our skilled artisans carefully craft each detail by hand.</p>
            </div>

            <div className="about-process__card">
              <span>03</span>
              <h3>Finishing</h3>
              <p>The jewellery is polished and finished with premium care.</p>
            </div>

            <div className="about-process__card">
              <span>04</span>
              <h3>Delivery</h3>
              <p>Your jewellery is safely prepared and delivered with care.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About