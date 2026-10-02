import { useEffect, useState } from "react";

const STORAGE_PREFIX = "adspot-seller-";

export const sampleProducts = [
  { id: "P-1024", name: "Classic Leather Tote", description: "A structured everyday tote with a timeless silhouette and durable lining.", category: "Fashion", subcategory: "Bags", price: 78500, discountPrice: 0, stock: 24, sku: "MK-TOTE-024", brand: "Maison Kigali", condition: "New", weight: "0.8 kg", tags: ["tote", "leather", "everyday"], delivery: "Delivery across Kigali and nationwide", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80", status: "Active", dateAdded: "2026-09-18" },
  { id: "P-1023", name: "Wireless Studio Headphones", description: "Comfortable wireless headphones with clear sound and long battery life.", category: "Electronics", subcategory: "Audio", price: 112000, discountPrice: 99000, stock: 18, sku: "MK-AUD-018", brand: "Soundcore", condition: "New", weight: "0.4 kg", tags: ["audio", "wireless"], delivery: "Same-day delivery in Kigali", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80", status: "Active", dateAdded: "2026-09-15" },
  { id: "P-1022", name: "Everyday Running Shoes", description: "Lightweight trainers built for road runs and daily wear.", category: "Sports", subcategory: "Footwear", price: 64500, discountPrice: 0, stock: 0, sku: "MK-RUN-000", brand: "Runway", condition: "New", weight: "0.7 kg", tags: ["running", "shoes"], delivery: "Delivery in 1-3 business days", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80", status: "Out of Stock", dateAdded: "2026-09-10" },
  { id: "P-1021", name: "Minimal Wrist Watch", description: "A clean, minimal watch for everyday occasions.", category: "Accessories", subcategory: "Watches", price: 92000, discountPrice: 0, stock: 9, sku: "MK-WAT-009", brand: "Nord", condition: "New", weight: "0.3 kg", tags: ["watch", "minimal"], delivery: "Delivery across Rwanda", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80", status: "Active", dateAdded: "2026-09-08" },
  { id: "P-1020", name: "Ceramic Coffee Set", description: "Hand-finished stoneware set for slow mornings and shared coffee.", category: "Home & Living", subcategory: "Kitchen", price: 38500, discountPrice: 0, stock: 15, sku: "MK-HOM-015", brand: "Imena Studio", condition: "New", weight: "1.2 kg", tags: ["ceramic", "home"], delivery: "Pickup or delivery available", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=400&q=80", status: "Active", dateAdded: "2026-09-04" },
  { id: "P-1019", name: "Weekend Canvas Backpack", description: "Durable canvas backpack with padded laptop compartment.", category: "Fashion", subcategory: "Bags", price: 54000, discountPrice: 0, stock: 6, sku: "MK-BAG-006", brand: "Maison Kigali", condition: "New", weight: "0.9 kg", tags: ["canvas", "backpack"], delivery: "Delivery in 1-3 business days", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80", status: "Draft", dateAdded: "2026-09-01" },
];

export const sampleOrders = [
  { id: "AS-2841", customer: "Aline Uwase", phone: "+250 788 214 905", product: "Classic Leather Tote", productId: "P-1024", quantity: 1, amount: 78500, subtotal: 75000, deliveryFee: 3500, date: "2026-10-01", paymentStatus: "Paid", deliveryStatus: "Pending", timeline: [{ label: "Order placed", date: "Oct 01, 2026 · 09:42", complete: true }, { label: "Payment confirmed", date: "Oct 01, 2026 · 09:43", complete: true }, { label: "Preparing order", date: "Awaiting seller", complete: false }, { label: "Out for delivery", date: "Not started", complete: false }] },
  { id: "AS-2840", customer: "Eric Niyonzima", phone: "+250 788 026 441", product: "Wireless Studio Headphones", productId: "P-1023", quantity: 1, amount: 112000, subtotal: 108500, deliveryFee: 3500, date: "2026-09-30", paymentStatus: "Paid", deliveryStatus: "Shipped", timeline: [{ label: "Order placed", date: "Sep 30, 2026 · 14:15", complete: true }, { label: "Payment confirmed", date: "Sep 30, 2026 · 14:17", complete: true }, { label: "Preparing order", date: "Sep 30, 2026 · 16:10", complete: true }, { label: "Out for delivery", date: "Oct 01, 2026 · 08:20", complete: true }] },
  { id: "AS-2839", customer: "Grace Mukamana", phone: "+250 788 091 663", product: "Everyday Running Shoes", productId: "P-1022", quantity: 1, amount: 68000, subtotal: 64500, deliveryFee: 3500, date: "2026-09-30", paymentStatus: "Pending", deliveryStatus: "Processing", timeline: [] },
  { id: "AS-2838", customer: "Jean Claude Habimana", phone: "+250 788 630 052", product: "Minimal Wrist Watch", productId: "P-1021", quantity: 1, amount: 95500, subtotal: 92000, deliveryFee: 3500, date: "2026-09-29", paymentStatus: "Paid", deliveryStatus: "Delivered", timeline: [] },
  { id: "AS-2837", customer: "Diane Ingabire", phone: "+250 788 317 800", product: "Ceramic Coffee Set", productId: "P-1020", quantity: 2, amount: 80500, subtotal: 77000, deliveryFee: 3500, date: "2026-09-28", paymentStatus: "Paid", deliveryStatus: "Confirmed", timeline: [] },
];

export const sampleCampaigns = [
  { id: "AD-301", name: "October Essentials", productId: "P-1024", title: "Everyday style, made to last", description: "Discover the Maison Kigali tote collection.", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80", category: "Fashion", dailyBudget: 12000, budget: 180000, spend: 72400, startDate: "2026-09-25", endDate: "2026-10-10", impressions: 12480, clicks: 846, conversions: 32, status: "Active" },
  { id: "AD-302", name: "Sound for every day", productId: "P-1023", title: "Your sound, wherever you go", description: "Shop wireless studio sound today.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", category: "Electronics", dailyBudget: 8000, budget: 120000, spend: 58300, impressions: 8210, clicks: 532, conversions: 19, startDate: "2026-09-20", endDate: "2026-10-08", status: "Active" },
  { id: "AD-303", name: "Weekend store spotlight", productId: "P-1021", title: "A timeless finishing touch", description: "A minimal watch for all occasions.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80", category: "Accessories", dailyBudget: 5000, budget: 50000, spend: 22100, impressions: 3940, clicks: 196, conversions: 8, startDate: "2026-09-12", endDate: "2026-10-03", status: "Paused" },
];

export const sampleStore = {
  storeName: "Maison Kigali",
  storeSlug: "maison-kigali",
  description: "Curated everyday essentials, fashion finds and thoughtful accessories from local and international makers. Proudly serving Kigali and beyond.",
  category: "Fashion & Lifestyle",
  phone: "+250 788 245 190",
  email: "hello@maisonkigali.rw",
  location: "Kigali, Rwanda",
  address: "KN 4 Ave, Nyarugenge, Kigali",
  hours: "Mon–Sat, 9:00 AM–6:00 PM",
  instagram: "@maisonkigali",
  facebook: "Maison Kigali",
  logo: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=240&q=80",
  banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
};

const defaults = { products: sampleProducts, orders: sampleOrders, campaigns: sampleCampaigns, store: sampleStore };

export function readSellerData(key) {
  const fallback = defaults[key];
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeSellerData(key, value) {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Keep the in-memory UI usable if browser storage is unavailable.
  }
}

export function useSellerData(key) {
  const [value, setValue] = useState(() => readSellerData(key));
  useEffect(() => writeSellerData(key, value), [key, value]);
  return [value, setValue];
}

export const formatRwf = (amount) => `${Number(amount || 0).toLocaleString("en-RW")} RWF`;
