import { useMemo, useState } from "react";
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

function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="content-section">
      <div className="section-header">
        <div>
          <span className="eyebrow accent">Browse</span>
          <h2>All categories</h2>
        </div>
      </div>

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default CategoriesPage;
