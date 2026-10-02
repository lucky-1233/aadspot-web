
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "./context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [favorite, setFavorite] = useState(false);

  const handleCart = () => {
    addToCart(product);
  };

  return (
    <article className="product-card">

      {/* FAVORITE */}
      <button
        type="button"
        className={`favorite-button ${favorite ? "active" : ""}`}
        aria-label="Save to favorites"
        onClick={() => setFavorite(!favorite)}
      >
        {favorite ? "♥" : "♡"}
      </button>

      {/* REAL PRODUCT IMAGE */}
      <Link
        to={`/products/${product.id}`}
        className="product-image-link"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image-real"
        />
      </Link>

      <div className="product-body">

        <div className="product-meta-row">
          <span className="product-category">
            {product.category}
          </span>

          <span className="rating">
            ★ {product.rating || 4.8}
          </span>
        </div>

        <h3>{product.name}</h3>

        <div className="seller-line">
          {product.seller}
        </div>

        <div className="product-price-row">
          <span className="price">
            {product.price.toLocaleString()} RWF
          </span>

          {product.stock > 0 ? (
            <span className="stock in-stock">
              In stock
            </span>
          ) : (
            <span className="stock out-of-stock">
              Out of stock
            </span>
          )}
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleCart}
          disabled={product.stock <= 0}
        >
          🛒 Add to Cart
        </button>

      </div>
    </article>
  );
}

export default ProductCard;