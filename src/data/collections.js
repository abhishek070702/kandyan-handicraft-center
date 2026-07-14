import { ringProducts } from './products/rings'
import { necklaceProducts } from './products/necklaces'
import { broochProducts } from './products/brooches'
import { braceletProducts } from './products/bracelets'
import { pendantProducts } from './products/pendants'
import { earringProducts } from './products/earrings'
import { waistChainProducts } from './products/waistChains'
import { bangleProducts } from './products/bangles'

export const categories = [
  {
    id: 1,
    slug: 'rings',
    name: 'Rings',
    description: 'Elegant handcrafted rings for timeless beauty.',
    heroDescription:
      'Statement pieces and everyday classics, finely wrought in gold and precious detail.',
    image: '/images/categories/rings-showcase.png',
    cardImage: '/images/categories/rings-card.png',
    heroImage: '/images/categories/rings-showcase.png',
  },
  {
    id: 2,
    slug: 'earrings',
    name: 'Earrings',
    description: 'Traditional and modern earrings with graceful detail.',
    image: '/images/categories/earrings-showcase.png',
    cardImage: '/images/categories/earrings-card.png',
    heroImage: '/images/categories/earrings-showcase.png',
  },
  {
    id: 3,
    slug: 'necklaces',
    name: 'Necklaces',
    description: 'Luxury necklaces inspired by Sri Lankan heritage.',
    image: '/images/categories/necklaces-showcase.png',
    cardImage: '/images/categories/necklaces-card.png',
    heroImage: '/images/categories/necklaces-hero.png',
    heroImagePosition: 'center center',
  },
  {
    id: 4,
    slug: 'bracelets',
    name: 'Bracelets',
    description: 'Beautiful bracelets crafted with elegance.',
    image: '/images/categories/bracelets-showcase.png',
    cardImage: '/images/categories/bracelets-card.png',
    heroImage: '/images/categories/bracelets-showcase.png',
  },
  {
    id: 5,
    slug: 'bangles',
    name: 'Bangles',
    description: 'Classic bangles with refined craftsmanship.',
    image: '/images/categories/bangles-showcase.png',
    cardImage: '/images/categories/bangles-card.png',
    heroImage: '/images/categories/bangles-showcase.png',
  },
  {
    id: 6,
    slug: 'brooches',
    name: 'Brooches',
    description: 'Decorative saree pins and brooches with artistic detail.',
    image: '/images/categories/brooches-showcase.png',
    cardImage: '/images/categories/brooches-card.png',
    heroImage: '/images/categories/brooches-showcase.png',
  },
  {
    id: 7,
    slug: 'waist-chains',
    name: 'Waist Chains',
    description: 'Traditional hawadiya — Sri Lankan waist chains of cultural elegance.',
    heroDescription:
      'Handcrafted hawadiya with filigree panels, cascading chains, and heritage detail.',
    image: '/images/categories/waist-chains-showcase.png',
    cardImage: '/images/categories/waist-chains-card.png',
    heroImage: '/images/categories/waist-chains-showcase.png',
  },
  {
    id: 8,
    slug: 'pendants',
    name: 'Pendants',
    description: 'Ornate gold pendants with heritage filigree detail.',
    image: '/images/categories/pendants-showcase.png',
    cardImage: '/images/categories/pendants-card.png',
    heroImage: '/images/categories/pendants-showcase.png',
  },
]

const productsByCategory = {
  rings: ringProducts,
  necklaces: necklaceProducts,
  brooches: broochProducts,
  bracelets: braceletProducts,
  pendants: pendantProducts,
  earrings: earringProducts,
  'waist-chains': waistChainProducts,
  bangles: bangleProducts,
}

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug)
}

export function getProductsByCategory(slug) {
  return productsByCategory[slug] || []
}

export function getAllProducts() {
  return Object.entries(productsByCategory).flatMap(([categorySlug, products]) =>
    products.map((product) => ({
      ...product,
      categorySlug,
      featuredId: `${categorySlug}-${product.id}`,
    })),
  )
}

export function getFeaturedProducts(limit = 4) {
  const categoriesWithProducts = Object.entries(productsByCategory).filter(
    ([, products]) => products.length > 0,
  )

  if (categoriesWithProducts.length === 0) return []

  const featured = []
  let index = 0

  while (
    featured.length < limit &&
    categoriesWithProducts.some(([, products]) => index < products.length)
  ) {
    for (const [categorySlug, products] of categoriesWithProducts) {
      if (featured.length >= limit) break

      const product = products[index]
      if (!product) continue

      featured.push({
        ...product,
        categorySlug,
        featuredId: `${categorySlug}-${product.id}`,
      })
    }

    index += 1
  }

  return featured
}
