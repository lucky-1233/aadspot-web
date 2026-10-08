import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, clearSession, readSession, saveSession } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [loading, setLoading] = useState(Boolean(readSession()?.token));

  const establishSession = useCallback((result) => {
    const next = { token: result.token, user: result };
    saveSession(next);
    setSession(next);
    return next.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const updateUser = useCallback((user) => {
    setSession((current) => {
      if (!current) return current;
      const next = { ...current, user };
      saveSession(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      clearSession();
      setSession(null);
      setLoading(false);
    };
    window.addEventListener("adspot:unauthorized", onUnauthorized);
    return () => window.removeEventListener("adspot:unauthorized", onUnauthorized);
  }, [session?.token, logout]);

  useEffect(() => {
    if (!session?.token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    apiRequest("/users/me")
      .then(({ user }) => {
        if (!cancelled) {
          const next = { ...session, user };
          saveSession(next);
          setSession(next);
        }
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (session?.user?.role !== "customer") return;
    let cancelled = false;
    apiRequest("/users/me/cart")
      .then(({ cart }) => {
        if (cancelled) return;
        const local = JSON.parse(localStorage.getItem("adspot-customer-cart") || "[]");
        const synchronized = cart.length ? cart : local;
        localStorage.setItem("adspot-customer-cart", JSON.stringify(synchronized));
        if (!cart.length && local.length) {
          return apiRequest("/users/me/cart", { method: "PUT", body: JSON.stringify({ items: local }) });
        }
        return undefined;
      })
      .catch((error) => {
        if (!cancelled) window.dispatchEvent(new CustomEvent("adspot:sync-error", { detail: error.message }));
      });
    return () => { cancelled = true; };
  }, [session?.user?._id, session?.user?.role]);

  const value = useMemo(() => ({
    user: session?.user || null,
    token: session?.token || null,
    loading,
    establishSession,
    updateUser,
    logout,
  }), [session, loading, establishSession, updateUser, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
