import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CategoryList from "../CategoryList";
import ProductCard from "../ProductCard";

const products = [
  {
    id: 1,
    name: "Nike Air Max",
    price: 85000,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    seller: "Urban Style Rwanda",
    rating: 4.8,
    stock: 10,
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 45000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    seller: "TechHub Rwanda",
    rating: 4.7,
    stock: 14,
  },
  {
    id: 3,
    name: "Premium Backpack",
    price: 32000,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    seller: "Kigali Outfitters",
    rating: 4.9,
    stock: 9,
  },
  {
    id: 4,
    name: "Smart Watch",
    price: 65000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    seller: "Digital Rwanda",
    rating: 4.6,
    stock: 8,
  },
  {
    id: 5,
    name: "Running Shoes",
    price: 55000,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600",
    seller: "SportWorld",
    rating: 4.8,
    stock: 18,
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 38000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    seller: "SoundPoint Rwanda",
    rating: 4.7,
    stock: 21,
  },
];

const categories = [
  "All",
  "Fashion",
  "Electronics",
  "Phones",
  "Computers",
  "Beauty",
  "Home",
  "Sports",
  "Automotive",
];

function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const searchTerm = query.toLowerCase();
      const matchesQuery =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.seller.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">Marketplace for Rwanda</span>
          <h1>Everything you want. In one trusted place.</h1>
          <p>
            Discover products from verified businesses across Rwanda and shop with confidence.
          </p>

          <div className="search-box">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, categories, or sellers"
              aria-label="Search products"
            />
            <button type="button">Search</button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>2,500+</strong>
              <span>Products</span>
            </div>
            <div>
              <strong>180+</strong>
              <span>Sellers</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="eyebrow accent">Popular categories</span>
            <h2>Shop by category</h2>
          </div>
          <Link to="/categories" className="text-link">View all</Link>
        </div>

        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="eyebrow accent">Featured</span>
            <h2>Featured deals</h2>
          </div>
          <Link to="/products" className="text-link">See more</Link>
        </div>

        <div className="product-grid">
          {filteredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="promo-band">
        <div>
          <span className="eyebrow light">For sellers</span>
          <h2>Grow your business with AdSpot</h2>
        </div>
        <Link to="/login" className="primary-button inline-button">
          Start selling
        </Link>
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="eyebrow accent">Popular now</span>
            <h2>Best selling products</h2>
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id + "-popular"} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
