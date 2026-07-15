import './ProductCard.css'

const genderLabels = {
  men: "Men's",
  women: "Women's",
}

function ProductCard({ product, onSelect }) {
  const genderLabel = product.gender ? genderLabels[product.gender] : null

  const handleSelect = () => {
    if (onSelect) onSelect(product)
  }

  return (
    <article
      className={`product-card${onSelect ? ' product-card--clickable' : ''}`}
      onClick={onSelect ? handleSelect : undefined}
      onKeyDown={
        onSelect
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleSelect()
              }
            }
          : undefined
      }
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />

        {genderLabel && (
          <span className="product-card__badge">{genderLabel}</span>
        )}

        {onSelect && (
          <span className="product-card__zoom-hint" aria-hidden="true">
            Quick View
          </span>
        )}
      </div>

      <div className="product-card__content">
        <h3>{product.name}</h3>
        <p>
          {product.price ||
            product.description ||
            'Available in store · Enquire for details'}
        </p>
      </div>
    </article>
  )
}

export default ProductCard