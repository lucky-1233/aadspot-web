import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const products = [
  {
    id: 1,
    name: "Nike Air Max",
    price: 85000,
    category: "Fashion",
    seller: "Urban Style Rwanda",
    rating: 4.8,
    stock: 10,
    description:
      "Lightweight everyday sneakers designed for comfort and city style.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 45000,
    category: "Electronics",
    seller: "TechHub Rwanda",
    rating: 4.7,
    stock: 14,
    description:
      "Premium sound, long battery life, and a comfortable fit for work and travel.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
  },
  {
    id: 3,
    name: "Premium Backpack",
    price: 32000,
    category: "Fashion",
    seller: "Kigali Outfitters",
    rating: 4.9,
    stock: 9,
    description:
      "A durable everyday backpack with smart compartments for work, school, and travel.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200",
  },
  {
    id: 4,
    name: "Smart Watch",
    price: 65000,
    category: "Electronics",
    seller: "Digital Rwanda",
    rating: 4.6,
    stock: 8,
    description:
      "Track fitness, notifications, and performance with a sleek daily-use design.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
  },
  {
    id: 5,
    name: "Running Shoes",
    price: 55000,
    category: "Sports",
    seller: "SportWorld",
    rating: 4.8,
    stock: 18,
    description:
      "Responsive shoes built for comfort, traction, and long-distance performance.",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1200",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 38000,
    category: "Electronics",
    seller: "SoundPoint Rwanda",
    rating: 4.7,
    stock: 21,
    description:
      "Portable, rich-sounding audio with a powerful rechargeable battery.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200",
  },
];

function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = useMemo(
    () => products.find((item) => String(item.id) === String(id)),
    [id]
  );

  if (!product) {
    return (
      <section className="content-section empty-state">
        <h2>Product not found</h2>
        <Link to="/products" className="primary-button inline-button">
          Back to products
        </Link>
      </section>
    );
  }

  const relatedProducts = products.filter(
    (item) => item.category === product.category && item.id !== product.id
  );

  return (
    <section className="content-section product-details-shell">
      <div className="product-detail-layout">
        <div className="product-detail-image-wrap">
          <img src={product.image} alt={product.name} className="product-detail-image" />
        </div>

        <div className="product-detail-info">
          <span className="eyebrow accent">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="product-rating-row">
            <span>★ {product.rating}</span>
            <span>{product.seller}</span>
          </div>

          <div className="product-price-main">{product.price.toLocaleString()} RWF</div>

          <p className="product-description">{product.description}</p>

          <div className="detail-list">
            <p>
              <strong>Seller:</strong> {product.seller}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock} available
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
          </div>

          <div className="detail-actions">
            <button type="button" className="primary-button" onClick={() => addToCart(product)}>
              Add to cart
            </button>
            <button type="button" className="secondary-button">
              Buy now
            </button>
          </div>
        </div>
      </div>

      <div className="related-products-block">
        <div className="section-header">
          <div>
            <span className="eyebrow accent">You may also like</span>
            <h2>Related products</h2>
          </div>
        </div>

        <div className="product-grid compact-grid">
          {relatedProducts.slice(0, 3).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
