import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import AppRoutes from './routes/AppRoutes'

const SITE_URL = 'https://kandyanhandicraftcenter.lk'
const BRAND = 'Kandyan Handicraft Centre'

const staticSeo = {
  '/': {
    title: 'Kandyan Handicraft Centre | Jewellery & Handicrafts in Kandy',
    description:
      'Kandyan Handicraft Centre is a jewellery store and handicraft centre in Kandy, Sri Lanka, offering handcrafted Kandyan jewellery, gems, custom jewellery and jewellery repairs.',
  },
  '/collections': {
    title: `Jewellery Collections in Kandy | ${BRAND}`,
    description:
      'Explore handcrafted jewellery collections in Kandy, including rings, earrings, necklaces, bracelets, bangles, brooches, waist chains and pendants.',
  },
  '/gems': {
    title: `Gemstones in Kandy, Sri Lanka | ${BRAND}`,
    description:
      'Discover Sri Lankan gemstones and jewellery gems at Kandyan Handicraft Centre in Kandy, including sapphires, rubies and other precious and semi-precious stones.',
  },
  '/gallery': {
    title: `Jewellery & Handicraft Gallery in Kandy | ${BRAND}`,
    description:
      'View handcrafted jewellery, traditional Sri Lankan craftsmanship and custom jewellery creations from Kandyan Handicraft Centre in Kandy.',
  },
  '/about': {
    title: `About ${BRAND} | Jewellery Store in Kandy`,
    description:
      'Learn about Kandyan Handicraft Centre, a family jewellery and handicraft business in Kandy with generations of Sri Lankan craftsmanship and custom jewellery experience.',
  },
  '/contact': {
    title: `Contact Jewellery Store in Kandy | ${BRAND}`,
    description:
      'Contact Kandyan Handicraft Centre in Kandy for handcrafted jewellery, custom designs, gemstones, jewellery repairs and store enquiries.',
  },
  '/privacy-policy': {
    title: `Privacy Policy | ${BRAND}`,
    description: `Read the privacy policy for the ${BRAND} website.`,
  },
  '/terms-and-conditions': {
    title: `Terms & Conditions | ${BRAND}`,
    description: `Read the website terms and conditions for ${BRAND}.`,
  },
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function setMeta(name, content, attribute = 'name') {
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function getSeo(pathname) {
  if (staticSeo[pathname]) return staticSeo[pathname]

  if (pathname.startsWith('/collections/')) {
    const name = titleFromSlug(pathname.replace('/collections/', ''))
    return {
      title: `${name} in Kandy | ${BRAND}`,
      description: `Explore handcrafted ${name.toLowerCase()} in Kandy from ${BRAND}, with traditional Sri Lankan styles, modern designs and custom jewellery options.`,
    }
  }

  if (pathname.startsWith('/gems/')) {
    const name = titleFromSlug(pathname.replace('/gems/', ''))
    return {
      title: `${name} Gemstone in Kandy | ${BRAND}`,
      description: `Learn about ${name}, its appearance, jewellery uses and gemstone background from ${BRAND} in Kandy, Sri Lanka.`,
    }
  }

  return {
    title: `Page Not Found | ${BRAND}`,
    description: `The requested page could not be found on the ${BRAND} website.`,
    noindex: true,
  }
}

function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin'

  useEffect(() => {
    if (isAdmin) {
      document.title = `Admin | ${BRAND}`
      setMeta('robots', 'noindex, nofollow')
      return
    }

    const seo = getSeo(pathname)
    const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`

    document.title = seo.title
    setMeta('description', seo.description)
    setMeta('robots', seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    setMeta('og:title', seo.title, 'property')
    setMeta('og:description', seo.description, 'property')
    setMeta('og:url', canonical, 'property')
    setMeta('twitter:title', seo.title)
    setMeta('twitter:description', seo.description)
    setCanonical(canonical)
  }, [isAdmin, pathname])

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <AppRoutes />
      {!isAdmin && <Footer />}
    </>
  )
}

export default App
