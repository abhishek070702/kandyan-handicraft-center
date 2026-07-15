import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductZoomModal from '../../components/ProductZoomModal/ProductZoomModal'
import { getCategoryBySlug, getProductsByCategory } from '../../data/collections'
import './CollectionCategory.css'

function CollectionCategory() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = getCategoryBySlug(slug)
  const products = getProductsByCategory(slug)
  const [genderFilter, setGenderFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const hasGenderFilter = products.some((product) => product.gender)
  const hasMenProducts = products.some((product) => product.gender === 'men')
  const hasWomenProducts = products.some((product) => product.gender === 'women')

  useEffect(() => {
    setGenderFilter('all')
  }, [slug])

  useEffect(() => {
    const productId = Number(searchParams.get('product'))
    if (!productId || !products.length) return

    const match = products.find((product) => product.id === productId)
    if (match) {
      setSelectedProduct({ ...match, categorySlug: slug })
    }
  }, [searchParams, products, slug])

  const openProduct = (product) => {
    setSelectedProduct({ ...product, categorySlug: slug })
    setSearchParams({ product: String(product.id) }, { replace: true })
  }

  const closeProduct = () => {
    setSelectedProduct(null)
    setSearchParams({}, { replace: true })
  }

  const genderFilters = useMemo(() => {
    if (!category) return []

    const label = category.name
    const filters = [{ id: 'all', label: `All ${label}` }]

    if (hasWomenProducts) {
      filters.push({ id: 'women', label: `Women's ${label}` })
    }

    if (hasMenProducts) {
      filters.push({ id: 'men', label: `Men's ${label}` })
    }

    return filters
  }, [category, hasMenProducts, hasWomenProducts])

  const visibleProducts = useMemo(() => {
    if (!hasGenderFilter || genderFilter === 'all') return products
    return products.filter((product) => product.gender === genderFilter)
  }, [products, genderFilter, hasGenderFilter])

  if (!category) {
    return (
      <div className="container collection-category-empty">
        <h1>Collection not found</h1>
        <Link to="/collections" className="collection-category__back">
          <svg
            className="collection-category__back-icon"
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
          <span>Back to Collections</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <Link to="/collections" className="collection-category__back">
        <svg
          className="collection-category__back-icon"
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
        <span>All Collections</span>
      </Link>

      {products.length > 0 ? (
        <>
          {hasGenderFilter && genderFilters.length > 1 && (
            <div className="collection-category-toolbar">
              <div className="collection-category-filters">
                {genderFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={`collection-category-filters__btn ${
                      genderFilter === filter.id ? 'is-active' : ''
                    }`}
                    onClick={() => setGenderFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <p className="collection-category-toolbar__count">
                Showing {visibleProducts.length} of {products.length}
              </p>
            </div>
          )}

          {visibleProducts.length > 0 ? (
            <div key={`${slug}-${genderFilter}`} className="collection-category-grid">
              {visibleProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="collection-category-grid__item"
                  style={{ '--stagger': `${Math.min(index, 11) * 0.05}s` }}
                >
                  <ProductCard product={product} onSelect={openProduct} />
                </div>
              ))}
            </div>
          ) : (
            <p className="collection-category-empty-list">
              No {category.name.toLowerCase()} found for this filter.
            </p>
          )}
        </>
      ) : (
        <div className="collection-category-empty">
          <h2>Coming Soon</h2>
          <p>
            New {category.name.toLowerCase()} designs will be added shortly.
            Visit our store or contact us for available pieces.
          </p>
          <Link to="/contact" className="collection-category__cta">
            Enquire Now
          </Link>
        </div>
      )}
      {selectedProduct && (
        <ProductZoomModal
          product={selectedProduct}
          onClose={closeProduct}
        />
      )}
    </div>
  )
}

export default CollectionCategory
