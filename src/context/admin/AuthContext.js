"use client";
import React, { createContext, useContext, useState, useCallback, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { setAdminCacheScope } from "@/lib/admin/api";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser ?? null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Establish scope before descendant effects can start CMS requests.
  useLayoutEffect(() => {
    setAdminCacheScope(user?.id ?? null);
  }, [user]);

  const login = useCallback(async (email, password) => {
    setAdminCacheScope(null, { broadcast: true });
    setLoading(true);
    try {
      const res = await fetch("/api/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setAdminCacheScope(data.user?.id ?? null, { broadcast: true });
        setUser(data.user);
        router.replace("/admin");
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setAdminCacheScope(null, { broadcast: true });
    await fetch("/api/session/logout", { method: "POST", cache: "no-store" });
    setAdminCacheScope(null, { broadcast: true });
    setUser(null);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
