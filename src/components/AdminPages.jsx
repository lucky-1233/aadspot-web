import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest, orderFromApi, productFromApi } from "../services/api";
import { moneyRwf } from "../services/marketplaceData";
import "./AdminPages.css";

const paths = { users: "/admin/users", sellers: "/admin/sellers", products: "/admin/products", orders: "/admin/orders" };
const titles = { users: "Users", sellers: "Sellers", products: "Products", orders: "Orders" };

function useAdminResource(type) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((value) => value + 1);
  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest(paths[type])
      .then((response) => {
        const mapped = type === "products" ? response.map(productFromApi) : type === "orders" ? response.map(orderFromApi) : response.map((item) => ({
          ...item,
          id: String(item._id),
          status: item.isActive === false ? "Suspended" : "Active",
          storeName: item.store?.name || "",
          products: item.productCount || 0,
        }));
        if (active) setItems(mapped);
      })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [type, revision]);
  return { items, loading, error, setError, refresh };
}

function AdminLayout({ title, children }) {
  const { user, logout } = useAuth();
  const nav = [["Dashboard", "/admin", "▦"], ["Users", paths.users, "♙"], ["Sellers", paths.sellers, "⌂"], ["Products", paths.products, "□"], ["Orders", paths.orders, "▤"], ["Analytics", "/admin/analytics", "↗"]];
  return <div className="ap-shell"><aside className="ap-sidebar"><Link to="/" className="ap-brand"><span>A</span> AdSpot <i>ADMIN</i></Link><small className="ap-nav-label">PLATFORM</small><nav>{nav.map(([label, url, icon]) => <Link key={label} to={url} className={title === label ? "active" : ""}><span>{icon}</span>{label}</Link>)}</nav><div className="ap-sidebar-bottom"><span className="ap-admin-avatar">{user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><strong>{user?.name}</strong><small>Administrator</small></div><button type="button" aria-label="Logout" onClick={logout}>↪</button></div></aside><div className="ap-main"><header className="ap-header"><div><small>AdSpot Rwanda / Admin</small><strong>{title}</strong></div><span className="ap-header-avatar">{user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span></header><main className="ap-content">{children}<footer>AdSpot Rwanda · Platform administration <span>Live MongoDB data · Payment provider is mock</span></footer></main></div></div>;
}

function Heading({ title, description }) { return <div className="ap-heading"><div><small>ADMINISTRATION</small><h1>{title}</h1><p>{description}</p></div></div>; }
function Badge({ children }) { return <span className={`ap-badge ap-badge--${String(children).toLowerCase().replaceAll(" ", "-")}`}>{children}</span>; }
function Alert({ children }) { return children ? <p role="alert" className="sp-form-error">{children}</p> : null; }

export function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([apiRequest("/admin/overview"), apiRequest("/admin/orders")])
      .then(([summary, rows]) => { if (active) { setOverview(summary); setOrders(rows.map(orderFromApi)); } })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);
  const metrics = overview ? [["Total users", overview.users, paths.users], ["Total sellers", overview.sellers, paths.sellers], ["Total stores", overview.stores, paths.sellers], ["Total products", overview.products, paths.products], ["Total orders", overview.orders, paths.orders], ["Pending orders", overview.pendingOrders, paths.orders], ["Recorded order value", moneyRwf(overview.revenue), "/admin/analytics"]] : [];
  return <AdminLayout title="Dashboard"><Heading title="Platform overview" description="Live totals from the AdSpot marketplace database." /><Alert>{error}</Alert>{!overview ? <p role="status">Loading platform data…</p> : <><div className="ap-metrics">{metrics.map(([label, value, path]) => <Link className="ap-metric" to={path} key={label}><span>{label}</span><strong>{value}</strong></Link>)}</div><section className="ap-panel"><div className="ap-panel-title"><div><h2>Recent orders</h2><p>Latest marketplace orders</p></div><Link to={paths.orders}>View all</Link></div><Table columns={["Order", "Customer", "Products", "Amount", "Payment", "Delivery"]} rows={orders.slice(0, 8).map((order) => <tr key={order._id}><td>{order.id}</td><td>{order.customer}</td><td>{order.product}</td><td>{moneyRwf(order.amount)}</td><td><Badge>{order.paymentStatus}</Badge></td><td><Badge>{order.deliveryStatus}</Badge></td></tr>)} /></section></>}</AdminLayout>;
}

function Table({ columns, rows }) { return <div className="ap-table-wrap"><table className="ap-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows}</tbody></table></div>; }

function AdminList({ type }) {
  const { items, loading, error, setError, refresh } = useAdminResource(type);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState("");
  const title = titles[type];
  const filtered = useMemo(() => items.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase())), [items, search]);
  const update = async (item, body, method = "PATCH") => {
    setError("");
    setBusy(item.id);
    try {
      const endpoint = type === "orders" ? `/orders/${item._id}/status` : type === "products" ? `/admin/products/${item._id}` : `/admin/users/${item._id}`;
      await apiRequest(endpoint, { method, body: JSON.stringify(body) });
      refresh();
    } catch (requestError) { setError(requestError.message); }
    finally { setBusy(""); }
  };
  const rows = filtered.map((item) => {
    if (type === "users") return <tr key={item.id}><td>{item.name}</td><td>{item.email}</td><td>{item.role}</td><td><Badge>{item.status}</Badge></td><td><button disabled={busy === item.id} onClick={() => update(item, { isActive: !item.isActive })}>{item.isActive ? "Suspend" : "Reactivate"}</button></td></tr>;
    if (type === "sellers") return <tr key={item.id}><td>{item.storeName || "Store not created"}</td><td>{item.name}</td><td>{item.email}</td><td>{item.products}</td><td><Badge>{item.status}</Badge></td><td><button disabled={busy === item.id} onClick={() => update(item, { isActive: !item.isActive })}>{item.isActive ? "Suspend" : "Reactivate"}</button></td></tr>;
    if (type === "products") return <tr key={item.id}><td>{item.name}</td><td>{item.seller}</td><td>{item.category}</td><td>{moneyRwf(item.price)}</td><td>{item.stock}</td><td><Badge>{item.status}</Badge></td><td><button disabled={busy === item.id} onClick={() => update(item, { status: item.status === "Active" ? "archived" : "active" })}>{item.status === "Active" ? "Archive" : "Activate"}</button><button disabled={busy === item.id} onClick={() => update(item, {}, "DELETE")}>Delete</button></td></tr>;
    return <tr key={item._id}><td>{item.id}</td><td>{item.customer}</td><td>{item.product}</td><td>{moneyRwf(item.amount)}</td><td><Badge>{item.paymentStatus}</Badge></td><td><select value={item.deliveryStatus?.toLowerCase()} disabled={busy === item.id} onChange={(event) => update(item, { status: event.target.value })}>{["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>;
  });
  const columns = type === "users" ? ["Name", "Email", "Role", "Status", "Actions"] : type === "sellers" ? ["Store", "Seller", "Email", "Products", "Status", "Actions"] : type === "products" ? ["Product", "Seller", "Category", "Price", "Stock", "Status", "Actions"] : ["Order", "Customer", "Products", "Amount", "Payment", "Delivery status"];
  return <AdminLayout title={title}><Heading title={title} description={`View and manage marketplace ${title.toLowerCase()} stored in MongoDB.`} /><Alert>{error}</Alert><section className="ap-panel"><label className="ap-field"><span>Search {title.toLowerCase()}</span><input value={search} onChange={(event) => setSearch(event.target.value)} /></label>{loading ? <p role="status">Loading {title.toLowerCase()}…</p> : filtered.length ? <Table columns={columns} rows={rows} /> : <p>No {title.toLowerCase()} found.</p>}</section></AdminLayout>;
}

export function AdminUsersPage() { return <AdminList type="users" />; }
export function AdminSellersPage() { return <AdminList type="sellers" />; }
export function AdminProductsPage() { return <AdminList type="products" />; }
export function AdminOrdersPage() { return <AdminList type="orders" />; }

export function AdminDetailPage({ type }) {
  const { id } = useParams();
  const { items, loading, error } = useAdminResource(type);
  const item = items.find((entry) => String(entry._id || entry.id) === decodeURIComponent(id || ""));
  return <AdminLayout title={`${titles[type]} details`}><Heading title={`${titles[type]} details`} description="Record loaded from the protected AdSpot API." /><Alert>{error}</Alert>{loading ? <p role="status">Loading record…</p> : item ? <section className="ap-panel"><pre>{JSON.stringify(item, (key, value) => key === "password" ? undefined : value, 2)}</pre><Link to={paths[type]}>Back to {titles[type].toLowerCase()}</Link></section> : <section className="ap-panel"><p>Record not found.</p><Link to={paths[type]}>Back to {titles[type].toLowerCase()}</Link></section>}</AdminLayout>;
}

export function AdminAnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; apiRequest("/admin/overview").then((result) => { if (active) setOverview(result); }).catch((requestError) => { if (active) setError(requestError.message); }); return () => { active = false; }; }, []);
  return <AdminLayout title="Analytics"><Heading title="Marketplace analytics" description="Current totals from saved marketplace records." /><Alert>{error}</Alert>{overview ? <section className="ap-metrics">{[["Users", overview.users], ["Sellers", overview.sellers], ["Stores", overview.stores], ["Products", overview.products], ["Orders", overview.orders], ["Order value", moneyRwf(overview.revenue)]].map(([label, value]) => <article className="ap-metric" key={label}><span>{label}</span><strong>{value}</strong></article>)}</section> : <p role="status">Loading analytics…</p>}</AdminLayout>;
}
