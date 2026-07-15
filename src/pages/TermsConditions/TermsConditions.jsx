import { Link } from 'react-router-dom'
import '../PrivacyPolicy/PrivacyPolicy.css'

const sections = [
  {
    title: 'About These Terms',
    body: 'These Terms & Conditions apply when you use the Kandyan Handicraft Center website. By browsing or contacting us through this site, you agree to these terms. If you do not agree, please do not use the website.',
  },
  {
    title: 'Our Website',
    body: 'This website showcases our jewellery, gemstones, photo gallery, and store information. It is provided for information and enquiry purposes. Product displays help you explore our craft; they are not an automated online checkout.',
  },
  {
    title: 'Enquiries & Orders',
    body: 'Purchases, custom designs, repairs, and appointments are arranged by contacting us — through our Contact Us form, WhatsApp, phone, or by visiting our store in Kandy. A website enquiry does not automatically confirm a sale. Availability, pricing, timelines, and materials are confirmed by Kandyan Handicraft Center before an order is accepted.',
  },
  {
    title: 'Prices & Metal Rates',
    body: 'Any prices, descriptions, or metal-rate displays on the website are indicative and may change with market conditions, metal weight, gemstone quality, design complexity, and availability. Final prices are confirmed directly by us for your specific piece or request.',
  },
  {
    title: 'Custom Work & Repairs',
    body: 'Custom jewellery and repair requests are handled case by case. Details such as design, material, size, style, occasion, and budget should be discussed with us. Work begins only after we confirm the arrangement with you. Handmade pieces may show natural variation from photographs or sketches.',
  },
  {
    title: 'Photos & Product Appearance',
    body: 'Images on this website are intended to represent our craftsmanship. Because jewellery and gemstones are handmade or natural, colour, size, and finish may vary slightly from what you see on screen. Lighting and device displays can also affect appearance.',
  },
  {
    title: 'Intellectual Property',
    body: 'Website content — including text, photographs, logos, and design — belongs to Kandyan Handicraft Center or is used with permission. You may view it for personal information. You may not copy, republish, or use our content for commercial purposes without our written consent.',
  },
  {
    title: 'Third-Party Links & Services',
    body: 'Our site may link to WhatsApp, maps, social platforms, or other external services. Those services have their own terms and privacy practices. We are not responsible for content or practices outside our website.',
  },
  {
    title: 'Website Availability',
    body: 'We aim to keep the website available and accurate, but we do not guarantee uninterrupted access or that every detail will always be current. We may update content, products shown, or features at any time without notice.',
  },
  {
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, Kandyan Handicraft Center is not liable for any indirect or consequential loss arising from use of this website or reliance on information displayed online. For purchases and custom work, the agreed arrangement between you and our store will apply.',
  },
  {
    title: 'Privacy',
    body: 'How we handle personal information is explained in our Privacy Policy. Please read it together with these terms.',
  },
  {
    title: 'Governing Law',
    body: 'These terms are governed by the laws of Sri Lanka. Any dispute related to the website or our services will be handled under applicable Sri Lankan law.',
  },
]

function TermsConditions() {
  return (
    <main className="privacy-page">
      <section className="privacy-hero">
        <div className="privacy-hero__atmosphere" aria-hidden="true">
          <span className="privacy-hero__orb privacy-hero__orb--a" />
          <span className="privacy-hero__orb privacy-hero__orb--b" />
          <span className="privacy-hero__grain" />
        </div>

        <div className="container privacy-hero__inner">
          <div className="privacy-hero__ornament" aria-hidden="true" />
          <p className="privacy-hero__eyebrow">Kandyan Handicraft Center</p>
          <h1>Terms &amp; Conditions</h1>
          <p className="privacy-hero__lead">
            Clear guidelines for using our website and enquiring with us.
          </p>
          <span className="privacy-hero__rule" aria-hidden="true" />
          <p className="privacy-hero__meta">Last updated: July 2026</p>
        </div>
      </section>

      <section className="privacy-body">
        <div className="container privacy-body__wrap">
          <article className="privacy-intro">
            <p>
              Welcome to Kandyan Handicraft Center. These Terms &amp; Conditions
              explain how our website works for browsing, enquiries, custom
              jewellery, and store communication — based on how we actually
              serve customers today.
            </p>
          </article>

          <div className="privacy-sections">
            {sections.map((section, index) => (
              <article className="privacy-card" key={section.title}>
                <span className="privacy-card__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="privacy-cta">
            <div className="privacy-cta__ornament" aria-hidden="true" />
            <p className="privacy-cta__eyebrow">Need clarity?</p>
            <h2>Contact our store</h2>
            <p>
              Questions about these terms, an enquiry, or a custom order can be
              sent through our Contact Us page. You can also read our{' '}
              <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
            <Link to="/contact" className="privacy-cta__btn">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default TermsConditions
