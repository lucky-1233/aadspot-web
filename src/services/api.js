const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const SESSION_KEY = "adspot-session";

export function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch (error) {
    console.error("Unable to read the authentication session.", error);
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function apiRequest(path, options = {}) {
  const session = readSession();
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (session?.token) headers.set("Authorization", `Bearer ${session.token}`);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (error) {
    throw new Error("Could not reach AdSpot. Check that the API server is running and try again.", { cause: error });
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 401 && session?.token) {
      clearSession();
      window.dispatchEvent(new Event("adspot:unauthorized"));
    }
    throw new Error(payload?.message || `Request failed (${response.status}).`);
  }
  return payload;
}

export function productFromApi(product) {
  const image = product.images?.[0] || "";
  return {
    ...product,
    id: String(product._id || product.id),
    image,
    images: product.images || [],
    seller: product.seller?.name || "",
    sellerId: product.seller?._id || product.seller,
    storeName: product.store?.name || "",
    storeSlug: product.store?.slug || "",
    status: product.status === "active" ? "Active" : product.status === "draft" ? "Draft" : product.status,
    dateAdded: product.createdAt ? new Date(product.createdAt).toISOString().slice(0, 10) : product.dateAdded || "",
    oldPrice: product.discountPrice || product.price,
  };
}

export function orderFromApi(order) {
  const items = (order.items || []).map((item) => ({
    productId: String(item.product?._id || item.product),
    product: item.name || item.product?.name || "Product",
    image: item.product?.images?.[0] || "",
    seller: item.product?.seller?.name || "",
    quantity: item.quantity,
    price: item.price,
  }));
  const address = order.deliveryAddress || {};
  return {
    ...order,
    id: order.orderNumber || String(order._id),
    customer: order.user?.name || "",
    email: order.user?.email || "",
    phone: address.phone || order.user?.phone || "",
    product: items.map((item) => item.product).join(", "),
    productId: items[0]?.productId || "",
    quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    amount: order.total,
    date: order.createdAt || "",
    deliveryStatus: order.orderStatus?.[0]?.toUpperCase() + order.orderStatus?.slice(1),
    paymentStatus: order.paymentStatus?.[0]?.toUpperCase() + order.paymentStatus?.slice(1),
    address: {
      province: address.province || "",
      district: address.district || "",
      sector: address.sector || "",
      street: address.details || "",
      instructions: address.instructions || "",
    },
    items,
    timeline: [],
  };
}

export function useProducts(path = "/products") {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest(path)
      .then((result) => { if (active) setProducts(result.map(productFromApi)); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [path]);
  return { products, setProducts, loading, error, setError };
}

export function useOrders(path = "/orders") {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((value) => value + 1);
  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest(path)
      .then((result) => { if (active) setOrders(result.map(orderFromApi)); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [path, revision]);
  return { orders, loading, error, setError, refresh };
}
import { useEffect, useState } from "react";
