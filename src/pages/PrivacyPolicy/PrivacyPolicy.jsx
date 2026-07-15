import { Link } from 'react-router-dom'
import './PrivacyPolicy.css'

const sections = [
  {
    title: 'Do We Collect Personal Information?',
    body: 'Yes — but only when you choose to contact us. Simply browsing our website does not require you to give personal details. We do not run advertising trackers or analytics tools on this website at present.',
  },
  {
    title: 'Contact Form',
    body: 'If you send a message through our Contact Us page, we collect the details you enter: your name, email address, subject, and message. You may also optionally attach up to three photos (for example a design idea, sample, or old jewellery piece). These submissions are received through Netlify Forms so we can review your enquiry and reply to the email address you provide.',
  },
  {
    title: 'How We Use This Information',
    body: 'We use contact information only to respond to your enquiry, discuss product availability or pricing, handle custom orders, repairs, or appointments, and provide customer service. We do not use your details for selling lists or unsolicited marketing.',
  },
  {
    title: 'Phone & WhatsApp',
    body: 'If you call us or tap a WhatsApp button on our website, your communication continues on your phone or in WhatsApp. WhatsApp buttons may open a chat with a short pre-filled message. Any chat on WhatsApp is also covered by WhatsApp’s own privacy practices.',
  },
  {
    title: 'Newsletter Area',
    body: 'Our website footer shows a newsletter email field. This feature is not currently active for collecting or storing emails. If it is enabled in future, we will update this Privacy Policy before collecting subscription details.',
  },
  {
    title: 'Hosting & Technical Data',
    body: 'Our website is hosted on Netlify. When you submit the contact form, Netlify processes that submission so we can receive it. Like most websites, normal hosting or network logs may exist for security and reliability. This is not used to build marketing profiles.',
  },
  {
    title: 'Cookies & Browser Storage',
    body: 'We do not use advertising cookies or visitor analytics cookies. The site may use limited browser storage for normal site features (for example temporary display preferences such as metal-rate caching). This does not identify you by name or email.',
  },
  {
    title: 'Sharing Your Information',
    body: 'We do not sell or rent your personal information. We only share information when needed to respond to your request (for example through our form hosting provider), to comply with the law, or to protect our business.',
  },
  {
    title: 'Keeping Information Safe',
    body: 'We take reasonable care with the information you send us. No online method is perfectly secure, so please avoid sending unnecessary sensitive details in forms or chats.',
  },
  {
    title: 'Your Requests',
    body: 'You may ask us to correct or remove personal information you have shared with us. Contact Kandyan Handicraft Center through our Contact Us page and we will help as reasonably possible.',
  },
]

function PrivacyPolicy() {
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
          <h1>Privacy Policy</h1>
          <p className="privacy-hero__lead">
            A clear record of what we collect — and what we do not.
          </p>
          <span className="privacy-hero__rule" aria-hidden="true" />
          <p className="privacy-hero__meta">Last updated: July 2026</p>
        </div>
      </section>

      <section className="privacy-body">
        <div className="container privacy-body__wrap">
          <article className="privacy-intro">
            <p>
              Kandyan Handicraft Center respects your privacy. This policy
              describes our real website practices today: how information is
              collected through contact forms, WhatsApp, and phone — and how we
              use it only to serve your jewellery enquiry.
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
            <p className="privacy-cta__eyebrow">Privacy questions</p>
            <h2>Speak with us directly</h2>
            <p>
              For privacy-related questions, contact Kandyan Handicraft Center
              through our Contact Us page.
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

export default PrivacyPolicy
