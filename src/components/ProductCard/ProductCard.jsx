import './ProductCard.css'

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />

        <button className="product-card__wishlist" aria-label="Add to wishlist">
          ♡
        </button>
      </div>

      <div className="product-card__content">
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    </article>
  )
}

export default ProductCard