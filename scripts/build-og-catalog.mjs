import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ringProducts } from '../src/data/products/rings.js'
import { necklaceProducts } from '../src/data/products/necklaces.js'
import { broochProducts } from '../src/data/products/brooches.js'
import { braceletProducts } from '../src/data/products/bracelets.js'
import { pendantProducts } from '../src/data/products/pendants.js'
import { earringProducts } from '../src/data/products/earrings.js'
import { waistChainProducts } from '../src/data/products/waistChains.js'
import { bangleProducts } from '../src/data/products/bangles.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outFile = join(root, 'public', 'og-catalog.json')

const categories = [
  {
    slug: 'rings',
    name: 'Rings',
    description: 'Elegant handcrafted rings for timeless beauty.',
    image: '/images/categories/rings-card.png',
    products: ringProducts,
  },
  {
    slug: 'earrings',
    name: 'Earrings',
    description: 'Traditional and modern earrings with graceful detail.',
    image: '/images/categories/earrings-card.png',
    products: earringProducts,
  },
  {
    slug: 'necklaces',
    name: 'Necklaces',
    description: 'Luxury necklaces inspired by Sri Lankan heritage.',
    image: '/images/categories/necklaces-card.png',
    products: necklaceProducts,
  },
  {
    slug: 'bracelets',
    name: 'Bracelets',
    description: 'Beautiful bracelets crafted with elegance.',
    image: '/images/categories/bracelets-card.png',
    products: braceletProducts,
  },
  {
    slug: 'brooches',
    name: 'Brooches',
    description: 'Decorative saree pins and brooches with artistic detail.',
    image: '/images/categories/brooches-card.png',
    products: broochProducts,
  },
  {
    slug: 'pendants',
    name: 'Pendants',
    description: 'Ornate gold pendants with heritage filigree detail.',
    image: '/images/categories/pendants-card.png',
    products: pendantProducts,
  },
  {
    slug: 'waist-chains',
    name: 'Waist Chains',
    description: 'Traditional hawadiya — Sri Lankan waist chains of cultural elegance.',
    image: '/images/categories/waist-chains-card.png',
    products: waistChainProducts,
  },
  {
    slug: 'bangles',
    name: 'Bangles',
    description: 'Classic bangles with refined craftsmanship.',
    image: '/images/categories/bangles-card.png',
    products: bangleProducts,
  },
]

const catalog = {
  site: {
    name: 'Kandyan Handicraft Center',
    description: 'Handcrafted jewellery inspired by Sri Lankan heritage.',
    image: '/images/hero-jewellery.png',
  },
  categories: {},
  products: {},
}

for (const category of categories) {
  catalog.categories[category.slug] = {
    name: category.name,
    description: category.description,
    image: category.image,
  }

  for (const product of category.products) {
    catalog.products[`${category.slug}:${product.id}`] = {
      name: product.name,
      description: product.description,
      image: product.image,
      categorySlug: category.slug,
    }
  }
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(catalog))
console.log(`OG catalog written: ${Object.keys(catalog.products).length} products`)
