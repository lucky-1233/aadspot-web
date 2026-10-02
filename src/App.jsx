import { useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import SellerDashboard from "./components/SellerDashboard";
import {
  AddProductPage,
  AdvertisingPage,
  CampaignDetailsPage,
  CreateCampaignPage,
  EditCampaignPage,
  EditProductPage,
  OrderDetailsPage,
  OrdersPage,
  ProductsPage,
  SalesPage,
  StorePage,
} from "./components/SellerPages";
import {
  AccountPage,
  CartPage,
  CheckoutPage,
  CustomerOrderDetailsPage,
  OrderConfirmationPage,
  OrderHistoryPage,
  MarketplaceStorePage,
  ProductDetailsPage,
  SearchPage,
  WishlistPage,
} from "./components/CustomerPages";
import {
  AdminDetailPage,
  AdminAnalyticsPage,
  AdminDashboardPage,
  AdminOrdersPage,
  AdminProductsPage,
  AdminSellersPage,
  AdminUsersPage,
} from "./components/AdminPages";
import { getCart, getWishlist, saveCart, saveWishlist } from "./services/marketplaceData";
import "./App.css";

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

const products = [
  {
    id: 1,
    name: "Nike Air Max",
    price: 85000,
    oldPrice: 105000,
    category: "Fashion",
    rating: 4.8,
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 45000,
    oldPrice: 60000,
    category: "Electronics",
    rating: 4.7,
    badge: "-25%",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Premium Backpack",
    price: 32000,
    oldPrice: 42000,
    category: "Fashion",
    rating: 4.6,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Smart Watch",
    price: 65000,
    oldPrice: 80000,
    category: "Electronics",
    rating: 4.9,
    badge: "Top",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Running Shoes",
    price: 55000,
    oldPrice: 70000,
    category: "Sports",
    rating: 4.8,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 38000,
    oldPrice: 50000,
    category: "Electronics",
    rating: 4.5,
    badge: "Eco",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Modern Sunglasses",
    price: 25000,
    oldPrice: 34000,
    category: "Beauty",
    rating: 4.4,
    badge: "Fresh",
    image:
      "https://images.unsplash.com/photo-1577803947579-9f8c1f3e3f6d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "Gaming Controller",
    price: 48000,
    oldPrice: 62000,
    category: "Electronics",
    rating: 4.9,
    badge: "Pro",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80",
  },
];

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 21s-8.5-4.8-10.5-9.4C.5 8.8 2.2 4 6.5 4c2 0 3.1 1 4 2.2C11.4 5 12.5 4 14.5 4c4.3 0 6 4.8 5 7.5C20.5 16.2 12 21 12 21Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 4h2l2.5 10.3a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L20 7H7" />
      <circle cx="10" cy="18" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="17" cy="18" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(() => getCart().reduce((total, item) => total + item.quantity, 0));
  const [favorites, setFavorites] = useState(getWishlist);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id) => {
    setFavorites((current) => {
      const updated = current.some((item) => String(item) === String(id))
        ? current.filter((item) => String(item) !== String(id))
        : [...current, id];
      saveWishlist(updated);
      return updated;
    });
  };

  const addToCart = (product) => {
    const cart = getCart();
    const current = cart.find((item) => String(item.productId) === String(product.id));
    saveCart(current
      ? cart.map((item) => String(item.productId) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { productId: product.id, quantity: 1 }]);
    setCartCount((count) => count + 1);
  };

  return (
    <div className="adspot-app">
      <header className="site-header">
        <div className="top-bar">
          <div className="top-bar__inner">
            <span>📍 Kigali, Rwanda</span>
            <span>🚚 Next-day delivery</span>
            <span>💬 Support</span>
          </div>
        </div>

        <div className="nav-shell">
          <nav className="main-nav">
            <div className="brand" aria-label="AdSpot Rwanda home">
              <span className="brand-mark">A</span>
              <span className="brand-text">AdSpot</span>
            </div>

            <label className="search-box" aria-label="Search products">
              <SearchIcon />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    navigate(`/search?q=${encodeURIComponent(search)}`);
                  }
                }}
                placeholder="Search products, brands, categories..."
              />
            </label>

            <div className="nav-actions">
              <button
                type="button"
                className="icon-button"
                aria-label="Wishlist"
                onClick={() => navigate("/wishlist")}
              >
                <HeartIcon />
                <span>Wishlist</span>
              </button>

              <button
                type="button"
                className="cart-button"
                aria-label="Shopping cart"
                onClick={() => navigate("/cart")}
              >
                <CartIcon />

                <span>Cart</span>

                {cartCount > 0 && (
                  <span className="cart-count">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                className="account-button"
                onClick={() => navigate("/account")}
              >
                Account
              </button>
            </div>
          </nav>
        </div>

        <div className="category-strip">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={
                selectedCategory === category
                  ? "category-pill active"
                  : "category-pill"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <main className="page-shell">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="hero-badge">
              Rwanda marketplace
            </span>

            <h1>
              Everything You Want.{" "}
              <span>In One Place.</span>
            </h1>

            <p>
              AdSpot Rwanda helps shoppers discover trusted local
              businesses, while sellers grow their brands with stores,
              ads, inventory and online orders built for modern commerce.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              >
                Shop Now
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/login")}
              >
                Sell on AdSpot
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <strong>1200+</strong>
                <span>Local sellers</span>
              </div>

              <div>
                <strong>150k+</strong>
                <span>Happy buyers</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Support</span>
              </div>
            </div>
          </div>

          <div
            className="hero-visual"
            aria-label="Marketplace preview"
          >
            <div className="visual-card visual-card--featured">
              <div className="mini-label">
                Trending this week
              </div>

              <h3>Popular picks</h3>

              <div className="mini-product-row">
                <div className="mini-thumb mini-thumb--one" />

                <div>
                  <strong>
                    Wireless Headphones
                  </strong>

                  <span>
                    45,000 RWF
                  </span>
                </div>
              </div>

              <div className="mini-product-row">
                <div className="mini-thumb mini-thumb--two" />

                <div>
                  <strong>
                    Smart Watch
                  </strong>

                  <span>
                    65,000 RWF
                  </span>
                </div>
              </div>
            </div>

            <div className="visual-card visual-card--floating">
              <span className="floating-tag">
                Live
              </span>

              <strong>
                12,000+
              </strong>

              <p>
                Products ready to ship
              </p>
            </div>
          </div>
        </section>

        <section className="benefits-section">
          {[
            {
              title: "Fast Delivery",
              text: "Quick delivery across Rwanda.",
            },
            {
              title: "Secure Shopping",
              text: "Protected payments and trusted sellers.",
            },
            {
              title: "Local Businesses",
              text: "Support shops and makers near you.",
            },
            {
              title: "Customer Support",
              text: "Quick help before and after purchase.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="benefit-item"
            >
              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>
                  {item.title}
                </strong>

                <p>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                Popular products
              </span>

              <h2>
                Shop what people are buying
              </h2>
            </div>

            <button
              type="button"
              className="view-all"
              onClick={() => {
                setSelectedCategory("All");
                setSearch("");
              }}
            >
              View all
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const isFavorite = favorites.some((item) => String(item) === String(product.id));

                return (
                  <article
                    key={product.id}
                    className="product-card"
                  >
                    <div className="product-image-wrap">
                      <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
                        <img src={product.image} alt={product.name} />
                      </Link>

                      {product.badge && (
                        <span className="product-badge">
                          {product.badge}
                        </span>
                      )}

                      <button
                        type="button"
                        className={
                          isFavorite
                            ? "wishlist-button active"
                            : "wishlist-button"
                        }
                        onClick={() =>
                          toggleFavorite(product.id)
                        }
                        aria-label={`Save ${product.name}`}
                      >
                        <HeartIcon />
                      </button>
                    </div>

                    <div className="product-content">
                      <div className="product-meta-row">
                        <span className="product-category">
                          {product.category}
                        </span>

                        <span className="product-rating">
                          ★ {product.rating}
                        </span>
                      </div>

                      <Link to={`/product/${product.id}`}><h3>{product.name}</h3></Link>

                      <div className="price-row">
                        <strong>
                          {product.price.toLocaleString()} RWF
                        </strong>

                        <span>
                          {product.oldPrice.toLocaleString()} RWF
                        </span>
                      </div>

                      <button
                        type="button"
                        className="add-button"
                        onClick={() => addToCart(product)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <h3>
                No matching products
              </h3>

              <p>
                Try another product name or switch categories.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearch("");
                }}
              >
                Show all products
              </button>
            </div>
          )}
        </section>

        <section className="seller-banner">
          <div>
            <span className="eyebrow eyebrow--orange">
              For businesses
            </span>

            <h2>
              Turn Your Business Into an Online Store
            </h2>

            <p>
              Whether you sell fashion, electronics or food,
              AdSpot Rwanda helps businesses create stores,
              reach more shoppers and grow faster.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/login")}
          >
            Start Selling
          </button>
        </section>

        <section className="explore-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                Explore categories
              </span>

              <h2>
                Shop by interest
              </h2>
            </div>
          </div>

          <div className="category-grid">
            {[
              {
                name: "Fashion",
                image:
                  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
              },
              {
                name: "Electronics",
                image:
                  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
              },
              {
                name: "Phones",
                image:
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
              },
              {
                name: "Computers",
                image:
                  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
              },
              {
                name: "Beauty",
                image:
                  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
              },
              {
                name: "Home",
                image:
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
              },
            ].map((category) => (
              <button
                type="button"
                key={category.name}
                className="explore-card"
                onClick={() =>
                  setSelectedCategory(category.name)
                }
              >
                <img
                  src={category.image}
                  alt={category.name}
                />

                <span>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="brand-mark">
                A
              </span>

              <span className="brand-text">
                AdSpot
              </span>
            </div>

            <p>
              Rwanda's trusted marketplace for shopping,
              selling and growing local businesses online.
            </p>
          </div>

          <div>
            <h4>
              Marketplace
            </h4>

            <ul>
              <li>Popular products</li>
              <li>Featured stores</li>
              <li>Deals</li>
            </ul>
          </div>

          <div>
            <h4>
              Business
            </h4>

            <ul>
              <li>Become a seller</li>
              <li>Advertise</li>
              <li>Pricing</li>
            </ul>
          </div>

          <div>
            <h4>
              Help
            </h4>

            <ul>
              <li>Support</li>
              <li>Shipping</li>
              <li>Returns</li>
            </ul>
          </div>

          <div>
            <h4>
              Contact
            </h4>

            <ul>
              <li>
                Email: hello@adspot.rw
              </li>

              <li>
                Kigali, Rwanda
              </li>

              <li>
                +250 788 000 000
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          Made with ❤️ in Rwanda 🇷🇼
        </div>
      </footer>
    </div>
  );
}

function SignupPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Create your account</h1>
        <p className="login-subtitle">Join AdSpot Rwanda</p>
        <p className="signup-text">
          Registration will be available soon. Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
        <Link to="/" className="back-home">
          ← Back to AdSpot
        </Link>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/seller-dashboard/products" element={<ProductsPage />} />
      <Route path="/seller-dashboard/products/add" element={<AddProductPage />} />
      <Route path="/seller-dashboard/products/edit/:id" element={<EditProductPage />} />
      <Route path="/seller-dashboard/orders" element={<OrdersPage />} />
      <Route path="/seller-dashboard/orders/:id" element={<OrderDetailsPage />} />
      <Route path="/seller-dashboard/sales" element={<SalesPage />} />
      <Route path="/seller-dashboard/store" element={<StorePage />} />
      <Route path="/seller-dashboard/advertising" element={<AdvertisingPage />} />
      <Route path="/seller-dashboard/advertising/create" element={<CreateCampaignPage />} />
      <Route path="/seller-dashboard/advertising/edit/:id" element={<EditCampaignPage />} />
      <Route path="/seller-dashboard/advertising/:id" element={<CampaignDetailsPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/account/orders" element={<OrderHistoryPage />} />
      <Route path="/account/orders/:id" element={<CustomerOrderDetailsPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
      <Route path="/store/:storeName" element={<MarketplaceStorePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/users/:id" element={<AdminEntityDetails type="users" />} />
      <Route path="/admin/sellers" element={<AdminSellersPage />} />
      <Route path="/admin/sellers/:id" element={<AdminEntityDetails type="sellers" />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/products/:id" element={<AdminEntityDetails type="products" />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/orders/:id" element={<AdminEntityDetails type="orders" />} />
      <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

function AdminEntityDetails({ type }) {
  return <AdminDetailPage type={type} />;
}

export default App;