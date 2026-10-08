import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, orderFromApi, useOrders, useProducts } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./SellerDashboard.css";

const initialProducts = [
  {
    id: "P-1024",
    name: "Classic Leather Tote",
    category: "Fashion",
    price: 78500,
    stock: 24,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "P-1023",
    name: "Wireless Studio Headphones",
    category: "Electronics",
    price: 112000,
    stock: 18,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "P-1022",
    name: "Everyday Running Shoes",
    category: "Sports",
    price: 64500,
    stock: 0,
    status: "Out of stock",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "P-1021",
    name: "Minimal Wrist Watch",
    category: "Accessories",
    price: 92000,
    stock: 9,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=160&q=80",
  },
];

const navItems = [
  { label: "Dashboard", icon: "▦", to: "/seller-dashboard" },
  { label: "Products", icon: "□", to: "/seller-dashboard/products" },
  { label: "Add Product", icon: "+", to: "/seller-dashboard/products/add" },
  { label: "Orders", icon: "▤", to: "/seller-dashboard/orders" },
  { label: "Sales", icon: "↗", to: "/seller-dashboard/sales" },
  { label: "My Store", icon: "⌂", to: "/seller-dashboard/store" },
  { label: "Advertising", icon: "◈", to: "/seller-dashboard/advertising" },
  { label: "Settings", icon: "⚙", to: "/seller-dashboard" },
];

const formatRwf = (amount) => `${amount.toLocaleString("en-RW")} RWF`;

function Chart() {
  const points = "0,95 45,78 90,86 135,51 180,62 225,37 270,48 315,20 360,31 405,7";

  return (
    <div className="seller-chart">
      <div className="seller-chart__y-labels" aria-hidden="true">
        <span>1.2M</span><span>900K</span><span>600K</span><span>300K</span><span>0</span>
      </div>
      <div className="seller-chart__plot">
        <svg viewBox="0 0 405 120" preserveAspectRatio="none" role="img" aria-label="Revenue increased over the last seven months">
          <defs>
            <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f27638" stopOpacity=".22" />
              <stop offset="100%" stopColor="#f27638" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M ${points.replaceAll(" ", " L ")} L 405 120 L 0 120 Z`} fill="url(#revenueFill)" />
          <polyline points={points} fill="none" stroke="#f27638" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <circle cx="405" cy="7" r="4" fill="#f27638" />
        </svg>
        <div className="seller-chart__months"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
      </div>
    </div>
  );
}

function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const { products } = useProducts("/products/seller/mine");
  const { orders, refresh: refreshOrders } = useOrders("/orders/seller");
  const [store, setStore] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/stores/mine").then((result) => { if (active) setStore(result); }).catch((error) => { if (active) showNotice(error.message); });
    return () => { active = false; };
  }, []);

  const visibleProducts = useMemo(
    () => products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );
  const visibleOrders = useMemo(
    () => orders.filter((order) => `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(search.toLowerCase())),
    [orders, search]
  );

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const addProduct = () => navigate("/seller-dashboard/products/add");

  const editProduct = (product) => {
    const name = window.prompt("Product name", product.name);
    if (name?.trim()) {
      apiRequest(`/products/${product.id}`, { method: "PUT", body: JSON.stringify({ name: name.trim() }) })
        .then(() => window.location.reload())
        .catch((error) => showNotice(error.message));
    }
  };

  const deleteProduct = (product) => {
    if (window.confirm(`Delete ${product.name}?`)) {
      apiRequest(`/products/${product.id}`, { method: "DELETE" })
        .then(() => window.location.reload())
        .catch((error) => showNotice(error.message));
    }
  };

  const updateOrder = async (orderId) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    const nextStatus = order.deliveryStatus === "Processing" ? "Shipped" : order.deliveryStatus === "Shipped" ? "Delivered" : "Processing";
    try {
      await apiRequest(`/orders/${order._id}/status`, { method: "PATCH", body: JSON.stringify({ status: nextStatus.toLowerCase() }) });
      refreshOrders();
    } catch (error) { showNotice(error.message); }
  };

  const renderOrders = (rows) => (
    <div className="seller-table-wrap">
      <table className="seller-table">
        <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Date</th><th>Status</th><th /></tr></thead>
        <tbody>{rows.map((order) => (
          <tr key={order.id}>
            <td className="seller-table__id">{order.id}</td><td>{order.customer}</td><td>{order.product}</td><td>{formatRwf(order.amount)}</td><td>{order.date}</td>
            <td><span className={`seller-status seller-status--${(order.deliveryStatus || order.status || "Pending").toLowerCase()}`}>{order.deliveryStatus || order.status || "Pending"}</span></td>
            <td><button className="seller-text-button" type="button" onClick={() => updateOrder(order.id)}>Update status</button></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );

  const renderProducts = (rows) => (
    <div className="seller-table-wrap">
      <table className="seller-table seller-products-table">
        <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{rows.map((product) => (
          <tr key={product.id}>
            <td><div className="seller-product-cell"><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.id}</small></span></div></td>
            <td>{product.category}</td><td>{formatRwf(product.price)}</td><td>{product.stock}</td>
            <td><span className={`seller-status ${product.status === "Active" ? "seller-status--delivered" : "seller-status--processing"}`}>{product.status}</span></td>
            <td><div className="seller-row-actions"><button className="seller-text-button" type="button" onClick={() => editProduct(product)}>Edit</button><button className="seller-text-button seller-text-button--danger" type="button" onClick={() => deleteProduct(product)}>Delete</button></div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );

  const renderOverview = () => (
    <>
      <div className="seller-metrics">
        <article className="seller-metric"><span className="seller-metric__icon seller-metric__icon--orange">↗</span><span className="seller-metric__label">Order value</span><strong>{formatRwf(orders.reduce((sum, order) => sum + order.amount, 0))}</strong><small className="seller-neutral">Recorded seller orders</small></article>
        <article className="seller-metric"><span className="seller-metric__icon seller-metric__icon--blue">▤</span><span className="seller-metric__label">Total Orders</span><strong>{orders.length}</strong><small className="seller-neutral">From MongoDB</small></article>
        <article className="seller-metric"><span className="seller-metric__icon seller-metric__icon--purple">□</span><span className="seller-metric__label">Total Products</span><strong>{products.length}</strong><small className="seller-neutral">{products.filter((product) => product.stock < 5).length} <span>low in stock</span></small></article>
        <article className="seller-metric"><span className="seller-metric__icon seller-metric__icon--green">◉</span><span className="seller-metric__label">Store Visitors</span><strong>—</strong><small className="seller-neutral">Visitor analytics unavailable</small></article>
      </div>

      <section className="seller-panel seller-revenue-panel">
        <div className="seller-panel__heading"><div><h2>Revenue overview</h2><p>Track your store performance over time</p></div><select aria-label="Revenue time period" defaultValue="7 months"><option>7 months</option><option>This year</option><option>This month</option></select></div>
        <div className="seller-chart-total"><strong>{formatRwf(orders.reduce((sum, order) => sum + order.amount, 0))}</strong><small>Order value</small></div>
        <Chart />
      </section>

      <div className="seller-overview-grid">
        <section className="seller-panel"><div className="seller-panel__heading"><div><h2>Recent orders</h2><p>Your latest customer orders</p></div><button className="seller-text-button" type="button" onClick={() => setActiveSection("Orders")}>View all</button></div>{renderOrders(orders.slice(0, 3))}</section>
        <section className="seller-panel seller-top-products"><div className="seller-panel__heading"><div><h2>Top selling products</h2><p>Best performers this month</p></div><button type="button" className="seller-icon-button" aria-label="More top products">···</button></div>
          {products.slice(0, 3).map((product, index) => <div className="seller-top-product" key={product.id}><span className="seller-top-product__rank">0{index + 1}</span><img src={product.image || ""} alt="" /><span className="seller-top-product__name"><strong>{product.name}</strong><small>{product.stock} in stock</small></span><strong className="seller-top-product__revenue">{formatRwf(product.price)}</strong></div>)}
        </section>
      </div>
    </>
  );

  const renderContent = () => {
    if (activeSection === "Products") return <section className="seller-panel"><div className="seller-panel__heading"><div><h2>Products</h2><p>Manage your store inventory</p></div><button className="seller-primary-button" type="button" onClick={addProduct}>＋ Add Product</button></div>{renderProducts(visibleProducts)}</section>;
    if (activeSection === "Orders") return <section className="seller-panel"><div className="seller-panel__heading"><div><h2>Orders</h2><p>Review and update customer orders</p></div><span className="seller-count-tag">{orders.length} recent</span></div>{renderOrders(visibleOrders)}</section>;
    if (activeSection === "Sales") return <><div className="seller-page-intro"><h2>Sales & revenue</h2><p>Monitor sales performance for your store.</p></div>{renderOverview()}</>;
    if (activeSection === "My Store") return <section className="seller-panel seller-store-panel"><div className="seller-panel__heading"><div><h2>My Store</h2><p>Manage your public storefront information</p></div><button className="seller-primary-button" type="button" onClick={() => navigate("/seller-dashboard/store")}>{store ? "Edit Store" : "Create Store"}</button></div>{store ? <><div className="seller-store-profile"><div className="seller-store-logo">{store.name[0]}</div><div><h3>{store.name}</h3><span className="seller-status seller-status--delivered">Store open</span></div></div><p className="seller-store-description">{store.description}</p><div className="seller-store-details"><div><span>Phone</span><strong>{store.contactPhone}</strong></div><div><span>Email</span><strong>{store.email}</strong></div><div><span>Location</span><strong>{store.location}</strong></div></div></> : <p>Create your store profile to begin listing products.</p>}</section>;
    if (activeSection === "Advertising") return <section className="seller-panel"><div className="seller-panel__heading"><div><h2>Advertising</h2><p>Promote products and reach more shoppers</p></div><button className="seller-primary-button" type="button" onClick={() => showNotice("Advertisement draft created.")}>＋ Create Advertisement</button></div><div className="seller-ad-list"><div className="seller-ad-row seller-ad-row--head"><span>Advertisement</span><span>Placement</span><span>Views</span><span>Clicks</span><span>Status</span></div>{[{ name: "October essentials campaign", placement: "Homepage feature", views: "12,480", clicks: "846", status: "Active" }, { name: "New season accessories", placement: "Category promotion", views: "8,210", clicks: "532", status: "Active" }, { name: "Weekend store spotlight", placement: "Search results", views: "3,940", clicks: "196", status: "Paused" }].map((ad) => <div className="seller-ad-row" key={ad.name}><strong>{ad.name}</strong><span>{ad.placement}</span><span>{ad.views}</span><span>{ad.clicks}</span><span className={`seller-status ${ad.status === "Active" ? "seller-status--delivered" : "seller-status--processing"}`}>{ad.status}</span></div>)}</div></section>;
    if (activeSection === "Settings") return <section className="seller-panel"><div className="seller-panel__heading"><div><h2>Settings</h2><p>Manage your seller account preferences</p></div></div><div className="seller-settings"><label>Store notifications <input type="checkbox" defaultChecked /></label><label>Order email alerts <input type="checkbox" defaultChecked /></label><label>Weekly performance report <input type="checkbox" /></label></div></section>;
    return renderOverview();
  };

  return (
    <div className="seller-dashboard">
      <aside className="seller-sidebar">
        <Link className="seller-brand" to="/" aria-label="AdSpot home"><span className="seller-brand__mark">A</span><span>AdSpot<span className="seller-brand__dot">.</span></span></Link>
        <div className="seller-workspace-label">WORKSPACE</div>
        <nav className="seller-nav" aria-label="Seller dashboard navigation">
          {navItems.map((item) => <Link to={item.to} key={item.label} className={`seller-nav__item ${item.label === "Dashboard" && activeSection === "Dashboard" ? "is-active" : ""}`}><span className="seller-nav__icon">{item.icon}</span>{item.label}{item.label === "Orders" && <span className="seller-nav__badge">{orders.length}</span>}</Link>)}
        </nav>
        <div className="seller-sidebar__bottom"><div className="seller-help-card"><span>Need a hand?</span><p>Our seller team is here to help you grow.</p><button type="button" onClick={() => showNotice("Seller support: support@adspot.rw")}>Contact support</button></div><button className="seller-nav__item seller-logout" type="button" onClick={logout}><span className="seller-nav__icon">↪</span>Logout</button></div>
      </aside>

      <div className="seller-main">
        <header className="seller-header"><div className="seller-header__title"><span>Seller workspace</span><strong>{activeSection}</strong></div><label className="seller-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search dashboard..." aria-label="Search dashboard" /><kbd>⌘ K</kbd></label><button type="button" className="seller-notification" aria-label="Notifications">♧<i /></button><div className="seller-profile"><div className="seller-avatar">{user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><span><strong>{user?.name}</strong><small>{store?.name || "Seller account"}</small></span><span className="seller-profile__chevron">⌄</span></div></header>
        <main className="seller-content"><div className="seller-welcome"><div><p className="seller-date">THURSDAY, OCTOBER 1, 2026</p><h1>{activeSection === "Dashboard" ? "Good morning, Jean 👋" : activeSection}</h1><p>{activeSection === "Dashboard" ? "Here's what's happening with your store today." : `Manage your ${activeSection.toLowerCase()} and keep your store running smoothly.`}</p></div>{activeSection === "Dashboard" && <button type="button" className="seller-outline-button" onClick={() => setActiveSection("Products")}>View store <span>↗</span></button>}</div>
          {notice && <div className="seller-notice" role="status">{notice}</div>}
          {renderContent()}
          <footer className="seller-footer">© 2026 AdSpot Rwanda <span>Made for local businesses, with care.</span></footer>
        </main>
      </div>
    </div>
  );
}

export default SellerDashboard;
