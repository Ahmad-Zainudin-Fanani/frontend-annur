"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@/components/atoms/Icons";
import Button from "@/components/atoms/Button";

// Primary navigation structure as specified
const navLinks = [
  { href: "/", label: "Beranda" },
  {
    href: "/profil",
    label: "Profil",
    isDropdown: true,
    children: [
      { href: "/profil/sejarah", label: "Sejarah", desc: "Awal pendirian & rekam jejak kepemimpinan" },
      { href: "/profil/kepala-wakil", label: "Kepala & Wakil Kepala", desc: "Pimpinan lembaga dan manajemen" },
      { href: "/guru", label: "Dewan Guru", desc: "Profil tenaga pendidik" },
      { href: "/profil/tim-pengembang", label: "Tim Pengembang WEB", desc: "Tim perancang sistem web" },
    ],
  },
  { href: "/kurikulum", label: "Kurikulum" },
  { href: "/prestasi", label: "Prestasi" },
  { href: "/galeri", label: "Galeri" },
  { href: "/lomba", label: "Informasi Lomba" },
  { href: "/kontak", label: "Kontak & Lokasi" },
];

export default function GlobalNav() {
  const [mobileMenuRoute, setMobileMenuRoute] = useState(null);
  const [dropdownRoute, setDropdownRoute] = useState(null);
  const [mobileProfilExpanded, setMobileProfilExpanded] = useState(true);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const pathname = usePathname();
  const mobileMenuOpen = mobileMenuRoute === pathname;
  const dropdownOpen = dropdownRoute === pathname;
  const closeMobileMenu = () => setMobileMenuRoute(null);

  // Handle smooth hover with slight delay so moving cursor won't immediately close it
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setDropdownRoute(pathname);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownRoute(null);
    }, 200);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownRoute(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setDropdownRoute(null);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isProfilActive =
    pathname.startsWith("/profil") || pathname.startsWith("/guru");

  return (
    <header className="sticky top-0 z-50 bg-[#000000] text-white select-none border-b border-[#222222]">
      <div className="max-w-7xl mx-auto h-[60px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.2px] text-white hover:text-[#cccccc] transition-colors apple-press-action shrink-0"
        >
          SD PLUS AN-NUR
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-normal tracking-[-0.12px]">
          {navLinks.map((item) => {
            if (item.isDropdown) {
              return (
                <div
                  key={item.label}
                  ref={dropdownRef}
                  className="relative py-4"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setDropdownRoute((prev) =>
                        prev === pathname ? null : pathname
                      )
                    }
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    className={`inline-flex items-center gap-1 transition-colors py-1 cursor-pointer apple-press-action ${
                      isProfilActive
                        ? "text-white font-semibold border-b-2 border-[#0066cc]"
                        : "text-[#cccccc] hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDownIcon
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu with bridging wrapper */}
                  {dropdownOpen && (
                    <div
                      className="absolute top-[calc(100%-8px)] left-0 pt-2 z-50"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div
                        className="w-64 bg-[#161617] border border-[#2d2d2f] rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-1 duration-150 backdrop-blur-md"
                        role="menu"
                      >
                        {item.children.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              role="menuitem"
                              onClick={() => setDropdownRoute(null)}
                              className={`block px-4 py-2.5 hover:bg-[#242426] transition-colors group ${
                                isSubActive ? "bg-[#1f1f21]" : ""
                              }`}
                            >
                              <span
                                className={`text-[13px] font-medium block leading-tight ${
                                  isSubActive
                                    ? "text-[#2997ff]"
                                    : "text-white group-hover:text-white"
                                }`}
                              >
                                {sub.label}
                              </span>
                              {sub.desc && (
                                <span className="text-[11px] text-[#8e8e93] block mt-0.5 leading-snug">
                                  {sub.desc}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

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
            onClick={() =>
              setMobileMenuRoute(mobileMenuOpen ? null : pathname)
            }
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
        <div className="lg:hidden bg-[#000000] border-t border-[#222222] px-6 py-5 space-y-2 max-h-[calc(100vh-60px)] overflow-y-auto">
          {navLinks.map((item) => {
            if (item.isDropdown) {
              return (
                <div key={item.label} className="py-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`block py-2 text-[15px] font-normal tracking-tight transition-colors ${
                        isProfilActive
                          ? "text-white font-semibold pl-2 border-l-2 border-[#0066cc]"
                          : "text-[#cccccc] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileProfilExpanded((prev) => !prev)}
                      className="p-2 text-[#8e8e93] hover:text-white cursor-pointer"
                      aria-label="Toggle dropdown profil"
                    >
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform ${
                          mobileProfilExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {mobileProfilExpanded && (
                    <div className="pl-4 ml-2 border-l border-[#2a2a2c] space-y-1.5 my-1">
                      {item.children.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={closeMobileMenu}
                            className={`block py-1.5 text-[14px] transition-colors ${
                              isSubActive
                                ? "text-[#2997ff] font-medium"
                                : "text-[#aaaaaa] hover:text-white"
                            }`}
                          >
                            <span className="block">{sub.label}</span>
                            <span className="text-[11px] text-[#666666] block">
                              {sub.desc}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
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
              onClick={closeMobileMenu}
              variant="primary"
              size="md"
              className="w-full text-[14px]"
            >
              Pendaftaran Siswa Baru (PPDB)
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
