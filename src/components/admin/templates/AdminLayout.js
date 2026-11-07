"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar, { navItems } from "@/components/admin/organisms/Sidebar";
import { useAuth } from "@/context/admin/AuthContext";

const navigation = navItems.flatMap((item) => item.items ?? [item]);

function MenuIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true"><path strokeLinecap="round" d="M4 6h16M4 12h10M4 18h16" /></svg>;
}

function NavigationSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const matches = navigation.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));
  const open = focused && query.trim().length > 0;

  return (
    <div className="relative hidden w-full max-w-64 md:block" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
    }}>
      <label className="flex items-center gap-2.5 rounded-xl border border-divider/80 bg-white/75 px-3.5 py-2.5 text-ink-soft focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path strokeLinecap="round" d="m16 16 4 4" /></svg>
        <input type="search" aria-label="Cari menu admin" placeholder="Cari menu..." value={query} onChange={(event) => { setQuery(event.target.value); setFocused(true); }} onFocus={() => setFocused(true)} onKeyDown={(event) => { if (event.key === "Escape") setFocused(false); }} aria-controls={open ? "admin-menu-results" : undefined} className="min-w-0 w-full bg-transparent text-xs text-ink placeholder:text-ink-soft focus:outline-none" />
      </label>
      {open && <div id="admin-menu-results" className="absolute top-full right-0 left-0 z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-divider bg-white p-2 shadow-xl shadow-ink/10">
        <p className="px-3 py-2 text-[10px] font-semibold tracking-wider text-ink-soft uppercase">Navigasi cepat</p>
        {matches.length ? matches.map((item) => <Link key={item.href} href={item.href} onClick={() => { setQuery(""); setFocused(false); }} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-ink-muted hover:bg-primary-light hover:text-primary"><span className="text-primary" aria-hidden="true">{item.icon}</span>{item.label}</Link>) : <p className="px-3 py-3 text-xs text-ink-soft">Menu tidak ditemukan.</p>}
      </div>}
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const mobileRef = useRef(null);
  const mobileTrigger = useRef(null);
  const contentRef = useRef(null);
  const current = navigation.find((item) => item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href));

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = mobileRef.current;
    panel?.querySelector("button, a")?.focus();
    const close = () => setMobileOpen(false);
    const media = window.matchMedia("(min-width: 1024px)");
    media.addEventListener("change", close);
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const items = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')];
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    const trigger = mobileTrigger.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", close);
      trigger?.focus();
    };
  }, [mobileOpen]);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-canvas-secondary">
      <a href="#admin-main" className="sr-only fixed top-4 left-4 z-[200] rounded-xl bg-primary px-4 py-3 text-sm text-white focus:not-sr-only">Lewati ke konten utama</a>

        <div className={`sidebar-transition hidden h-full shrink-0 border-r border-divider/60 lg:flex ${collapsed ? "w-[76px]" : "w-[232px]"}`}><Sidebar collapsed={collapsed} /></div>

        {mobileOpen && <div className="fixed inset-0 z-40 bg-ink/35 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
        <div ref={mobileRef} role={mobileOpen ? "dialog" : undefined} aria-modal={mobileOpen ? true : undefined} aria-label="Menu administrasi" inert={!mobileOpen} className={`sidebar-transition fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-white shadow-2xl lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Tutup menu" className="absolute top-3 right-3 rounded-lg p-1.5 text-ink-soft hover:bg-primary-light"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" d="m6 6 12 12M6 18 18 6" /></svg></button>
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </div>

        <div inert={mobileOpen} className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex min-h-20 shrink-0 items-center gap-3 px-4 sm:px-6 xl:min-h-24 xl:px-8">
            <button ref={mobileTrigger} onClick={() => setMobileOpen(true)} className="admin-icon-button lg:hidden" aria-label="Buka menu" aria-expanded={mobileOpen}><MenuIcon /></button>
            <button onClick={() => setCollapsed(!collapsed)} className="admin-icon-button hidden lg:flex" aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"} aria-expanded={!collapsed}><MenuIcon /></button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-ink-soft">An-Nur <span className="mx-1.5 text-ink-faint">/</span> Administrasi</p>
              <p className="mt-1 truncate text-sm font-semibold text-ink">{current?.label ?? "Ruang kerja"}</p>
            </div>
            <NavigationSearch key={pathname} />
            <Link href="/" target="_blank" rel="noopener noreferrer" className="admin-icon-button shrink-0" aria-label="Buka website publik di tab baru" title="Lihat website"><svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m0-7L10 14m0-9H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /></svg></Link>
            <div className="ml-1 hidden items-center gap-3 border-l border-divider pl-4 sm:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-white bg-[#dbe9e4] text-sm font-semibold text-primary shadow-sm" title={user?.name ?? "Administrator"}>{user?.name?.charAt(0)?.toUpperCase() ?? "A"}</span>
            </div>
          </header>
          <main id="admin-main" ref={contentRef} tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 focus:outline-none sm:px-6 xl:px-8 xl:pb-8">
            {children}
            <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-divider/70 pt-4 text-[10px] text-ink-soft"><span>SD Plus An-Nur · Ruang pengelolaan sekolah</span><span>Dikelola dengan sepenuh hati.</span></footer>
          </main>
        </div>
    </div>
  );
}
