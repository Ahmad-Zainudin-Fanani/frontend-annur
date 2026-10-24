"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon, SearchIcon, MapPinIcon } from "@/components/atoms/Icons";
import Button from "@/components/atoms/Button";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/kurikulum", label: "Kurikulum" },
  { href: "/guru", label: "Dewan Guru" },
  { href: "/prestasi", label: "Prestasi" },
  { href: "/galeri", label: "Galeri" },
  { href: "/lomba", label: "Informasi Lomba" },
  { href: "/kontak", label: "Kontak & Lokasi" },
];

export default function GlobalNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#000000] text-white select-none border-b border-[#222222]">
      <div className="max-w-7xl mx-auto h-[60px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity apple-press-action shrink-0"
        >
          <span className="w-8 h-8 rounded-full bg-[#0066cc] flex items-center justify-center text-[14px] font-bold text-white shadow-xs">
            ن
          </span>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-[15px] sm:text-[16px] font-semibold tracking-tight leading-tight">
                SD PLUS AN-NUR
              </span>
              <span className="text-[10px] font-medium bg-[#1d1d1f] text-[#2997ff] border border-[#333333] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                SD Swasta
              </span>
            </div>
            <span className="text-[11px] text-[#7a7a7a] leading-none hidden sm:inline-block">
              Terakreditasi A • Kurikulum SD Merdeka
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav Links (Single unified section) */}
        <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-normal tracking-[-0.12px]">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? "text-white font-semibold border-b-2 border-[#0066cc]"
                    : "text-[#cccccc] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Primary Action Button (PPDB) & Mobile Trigger */}
        <div className="flex items-center space-x-3 shrink-0">
          <Button
            href="/kontak"
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex py-2 px-4 text-[13px]"
          >
            Daftar Siswa (PPDB)
          </Button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#cccccc] hover:text-white rounded-md apple-press-action cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#000000] border-t border-[#222222] px-6 py-5 space-y-3">
          <div className="pb-3 border-b border-[#222222] flex items-center justify-between text-xs text-[#7a7a7a]">
            <span>Status: Sekolah Dasar Swasta (SD Swasta)</span>
            <span className="text-[#2997ff]">Akreditasi A</span>
          </div>

          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-[15px] font-normal tracking-tight transition-colors ${
                  isActive
                    ? "text-white font-semibold pl-2 border-l-2 border-[#0066cc]"
                    : "text-[#cccccc] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#222222] space-y-2">
            <Button
              href="/kontak"
              onClick={() => setMobileMenuOpen(false)}
              variant="primary"
              size="md"
              className="w-full text-[14px]"
            >
              Pendaftaran Siswa Baru (PPDB)
            </Button>
            <a
              href="https://www.google.com/maps?q=-7.8743,112.1076"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 text-[13px] text-[#2997ff] py-2 hover:underline"
            >
              <MapPinIcon className="w-4 h-4" />
              <span>Lihat Lokasi di Google Maps</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
