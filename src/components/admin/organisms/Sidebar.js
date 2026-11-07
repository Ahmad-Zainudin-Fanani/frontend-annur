"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/admin/AuthContext";

export const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    group: "Konten",
    items: [
      {
        label: "Profil Sekolah",
        href: "/admin/profil-sekolah",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        label: "Guru",
        href: "/admin/guru",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        label: "Prestasi",
        href: "/admin/prestasi",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ),
      },
      {
        label: "Lomba",
        href: "/admin/lomba",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        label: "Pilar Kurikulum",
        href: "/admin/pilar-kurikulum",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        label: "Fase",
        href: "/admin/fase",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
      },
      {
        label: "Slide Hero",
        href: "/admin/slide-hero",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        label: "Galeri",
        href: "/admin/galeri",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ),
      },
      {
        label: "Ekstrakurikuler",
        href: "/admin/ekstrakurikuler",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h4" />
          </svg>
        ),
      },
      {
        label: "Struktur Yayasan",
        href: "/admin/struktur-yayasan",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v5m0 0H6v5m6-5h6v5M6 13v3m12-3v3M4 19h4m8 0h4" />
            <circle cx="12" cy="5" r="2" />
            <circle cx="6" cy="11" r="2" />
            <circle cx="18" cy="11" r="2" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "CRM",
    items: [
      {
        label: "Kontak",
        href: "/admin/kontak",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
    ],
  },
];

function NavLink({ href, icon, label, active, collapsed, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${collapsed ? "justify-center" : ""}
        ${active
          ? "bg-sidebar-active text-sidebar-text-active"
          : "text-sidebar-text hover:bg-sidebar-hover hover:text-primary"
        }`}
    >
      <span className="shrink-0" aria-hidden="true">{icon}</span>
      {!collapsed && <span className="flex-1">{label}</span>}
      {active && !collapsed && <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />}
    </Link>
  );
}

export default function Sidebar({ collapsed = false, onNavigate }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError(null);
    try {
      await logout();
    } catch {
      setLogoutError("Gagal keluar. Silakan coba lagi.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside
      aria-label="Navigasi administrasi"
      className="flex h-full w-full flex-col bg-sidebar"
    >
      {/* Logo */}
      <Link href="/admin" onClick={onNavigate} aria-label="An-Nur — Dashboard" className={`flex min-h-24 items-center gap-3 px-5 ${collapsed ? "justify-center px-2" : ""}`}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold tracking-tight text-white shadow-[0_6px_16px_-6px_#17657580]">an<span className="text-[#b7e3d6]">.</span></span>
        {!collapsed && (
          <span className="min-w-0">
            <span className="block truncate text-[17px] font-bold tracking-tight text-ink">An-Nur<span className="text-primary">.</span></span>
            <span className="mt-0.5 block text-[10px] font-medium tracking-[0.12em] text-ink-soft uppercase">School workspace</span>
          </span>
        )}
      </Link>

      {/* Navigation */}
      <nav aria-label="Menu utama" className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {!collapsed && <p className="px-3 pb-3 text-[10px] font-medium tracking-[0.14em] text-ink-soft uppercase">Ruang kerja</p>}
        {navItems.map((item) => {
          if (item.href) {
            return (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={isActive(item.href)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            );
          }
          if (item.group) {
            return (
              <div key={item.group} className="pt-5">
                {!collapsed && (
                  <p className="mb-2 px-3 text-[10px] font-medium tracking-[0.14em] text-ink-soft uppercase">
                    {item.group}
                  </p>
                )}
                <div className="space-y-0.5">
                  {item.items.map((sub) => (
                    <NavLink
                      key={sub.href}
                      href={sub.href}
                      icon={sub.icon}
                      label={sub.label}
                      active={isActive(sub.href)}
                      collapsed={collapsed}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </nav>

      {/* User section */}
      <div className="mx-3 border-t border-divider py-3">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0">
            <span className="text-primary text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-ink text-xs font-semibold truncate">{user?.name ?? "Admin"}</p>
              <p className="text-sidebar-text text-xs truncate">{user?.email ?? ""}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label={collapsed ? "Keluar dari akun" : undefined}
          title={collapsed ? "Keluar dari akun" : undefined}
          className={`w-full mt-1 flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-sidebar-text hover:bg-danger-light hover:text-danger transition-colors disabled:opacity-50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>{loggingOut ? "Keluar..." : "Keluar"}</span>}
        </button>
        {logoutError && <p role="alert" className="mt-2 px-2 text-xs text-danger">{logoutError}</p>}
      </div>
    </aside>
  );
}
