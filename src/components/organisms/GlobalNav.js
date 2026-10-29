"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import {
  MenuIcon,
  XIcon,
  ChevronDownIcon,
} from "@/components/atoms/Icons";
import Button from "@/components/atoms/Button";
import { gsap } from "@/lib/gsapConfig";

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
  const [profileOpenRoute, setProfileOpenRoute] = useState(null);
  const [mobileProfilExpanded, setMobileProfilExpanded] = useState(true);
  const headerRef = useRef(null);
  const profileTriggerRef = useRef(null);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const openTimelineRef = useRef(null);
  const closeTimelineRef = useRef(null);
  const wasOpenRef = useRef(false);
  // Menahan panel agar tidak langsung terbuka lagi saat fokus dikembalikan
  // ke trigger setelah tombol Escape ditekan.
  const suppressProfileOpenUntilRef = useRef(0);
  const pathname = usePathname();
  const mobileMenuOpen = mobileMenuRoute === pathname;
  // Diikat ke pathname supaya panel otomatis tertutup saat pindah halaman.
  const profileOpen = profileOpenRoute === pathname;
  const profileItem = navLinks.find((item) => item.isDropdown);
  const closeMobileMenu = () => setMobileMenuRoute(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const openProfileMenu = useCallback(() => {
    if (Date.now() < suppressProfileOpenUntilRef.current) return;

    clearCloseTimeout();
    setProfileOpenRoute(pathname);
    setMobileMenuRoute(null);
  }, [clearCloseTimeout, pathname]);

  const closeProfileMenu = useCallback(() => {
    clearCloseTimeout();
    setProfileOpenRoute(null);
  }, [clearCloseTimeout]);

  // Pindahkan fokus keyboard dari trigger ke tautan pertama di panel.
  const handleProfileTriggerKeyDown = (event) => {
    if (event.key !== "ArrowDown") return;

    event.preventDefault();
    openProfileMenu();
    requestAnimationFrame(() => {
      panelRef.current?.querySelector("[data-menu-link]")?.focus();
    });
  };

  // Delay sedikit agar kursor sempat berpindah dari trigger ke panel.
  const scheduleCloseProfileMenu = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setProfileOpenRoute(null);
      closeTimeoutRef.current = null;
    }, 180);
  }, [clearCloseTimeout]);

  useEffect(() => () => clearCloseTimeout(), [clearCloseTimeout]);

  // Tutup mega menu ketika klik di luar header.
  useEffect(() => {
    if (!profileOpen) return;

    function handleClickOutside(event) {
      if (
        headerRef.current?.contains(event.target) ||
        panelRef.current?.contains(event.target)
      ) {
        return;
      }

      setProfileOpenRoute(null);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  // Tutup dengan Escape dan kembalikan fokus ke trigger.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== "Escape") return;

      if (profileOpen) {
        suppressProfileOpenUntilRef.current = Date.now() + 250;
        setProfileOpenRoute(null);
        profileTriggerRef.current?.focus();
      }
      setMobileMenuRoute(null);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [profileOpen]);

  // Kunci scroll halaman selama menu terbuka, dan tutup menu begitu
  // pengguna mencoba scroll.
  useEffect(() => {
    if (!profileOpen) return;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const closeOnScroll = () => setProfileOpenRoute(null);
    const preventScroll = (event) => {
      event.preventDefault();
      closeOnScroll();
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("scroll", closeOnScroll, { passive: true });

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("scroll", closeOnScroll);
    };
  }, [profileOpen]);

  // Tutup menu saat fokus keyboard keluar dari header/panel.
  const handleHeaderBlur = (event) => {
    if (
      !headerRef.current?.contains(event.relatedTarget) &&
      !panelRef.current?.contains(event.relatedTarget)
    ) {
      closeProfileMenu();
    }
  };

  // Animasi panel: fade + slide lembut, konten masuk bertahap seperti Apple.
  useGSAP(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (!panel || !overlay) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const groups = panel.querySelectorAll("[data-menu-group]");
    const links = panel.querySelectorAll("[data-menu-link]");

    gsap.set(panel, {
      autoAlpha: 0,
      y: -12,
      scale: 0.992,
      transformOrigin: "50% 0%",
    });
    gsap.set(overlay, { autoAlpha: 0 });

    if (prefersReduced) {
      openTimelineRef.current = gsap
        .timeline({ paused: true })
        .set(panel, { autoAlpha: 1, y: 0, scale: 1 })
        .set(overlay, { autoAlpha: 1 })
        .set(groups, { opacity: 1, y: 0 })
        .set(links, { opacity: 1, y: 0 });

      closeTimelineRef.current = gsap
        .timeline({ paused: true })
        .set(panel, { autoAlpha: 0 })
        .set(overlay, { autoAlpha: 0 });
      return;
    }

    openTimelineRef.current = gsap
      .timeline({ paused: true })
      .set(panel, { autoAlpha: 1 })
      .to(panel, { y: 0, scale: 1, duration: 0.5, ease: "power3.out" }, 0)
      .to(overlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0)
      .fromTo(
        groups,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.055,
        },
        0.05
      )
      .fromTo(
        links,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.018,
        },
        0.12
      );

    closeTimelineRef.current = gsap
      .timeline({ paused: true })
      .to(
        panel,
        { autoAlpha: 0, y: -8, duration: 0.22, ease: "power2.in" },
        0
      )
      .to(
        overlay,
        { autoAlpha: 0, duration: 0.26, ease: "power2.in" },
        0
      );
  }, []);

  useEffect(() => {
    if (!openTimelineRef.current || !closeTimelineRef.current) return;

    if (profileOpen) {
      closeTimelineRef.current.pause();
      openTimelineRef.current.restart(true);
    } else if (wasOpenRef.current) {
      openTimelineRef.current.pause();
      closeTimelineRef.current.restart(true);
    }

    wasOpenRef.current = profileOpen;
  }, [profileOpen]);

  const isProfilActive =
    pathname.startsWith("/profil") || pathname.startsWith("/guru");

  return (
    <>
      <header
        ref={headerRef}
        onBlur={handleHeaderBlur}
        className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md text-white select-none border-b border-[#222222]/80 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto h-[60px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <Link
            href="/"
            onMouseEnter={closeProfileMenu}
            onFocus={closeProfileMenu}
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
                    className="relative py-4"
                    onMouseEnter={openProfileMenu}
                    onMouseLeave={scheduleCloseProfileMenu}
                  >
                    <button
                      type="button"
                      ref={profileTriggerRef}
                      id="profile-menu-trigger"
                      aria-expanded={profileOpen}
                      aria-haspopup="true"
                      aria-controls="profile-mega-menu"
                      onFocus={openProfileMenu}
                      onKeyDown={handleProfileTriggerKeyDown}
                      onClick={openProfileMenu}
                      className={`inline-flex items-center gap-1 transition-colors py-1 apple-press-action cursor-pointer ${
                        isProfilActive
                          ? "text-white font-semibold border-b-2 border-[#d2d2d7]"
                          : "text-[#cccccc] hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDownIcon
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          profileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
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
                  onMouseEnter={closeProfileMenu}
                  onFocus={closeProfileMenu}
                  className={`transition-colors py-1 ${
                    isActive
                      ? "text-white font-semibold border-b-2 border-[#d2d2d7]"
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
              variant="light-pill"
              size="sm"
              onMouseEnter={closeProfileMenu}
              onFocus={closeProfileMenu}
              className="hidden sm:inline-flex py-2 px-4 text-[13px]"
            >
              Daftar Siswa (PPDB)
            </Button>
  
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => {
                closeProfileMenu();
                setMobileMenuRoute(mobileMenuOpen ? null : pathname);
              }}
              onMouseEnter={closeProfileMenu}
              onFocus={closeProfileMenu}
              className="lg:hidden p-2 text-[#cccccc] hover:text-white rounded-md apple-press-action cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
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
                      <button
                        type="button"
                        onClick={() => setMobileProfilExpanded((prev) => !prev)}
                        aria-expanded={mobileProfilExpanded}
                        className={`block py-2 pr-2 text-left text-[15px] font-normal tracking-tight transition-colors cursor-pointer ${
                          isProfilActive
                            ? "text-white font-semibold pl-2 border-l-2 border-[#d2d2d7]"
                            : "text-[#cccccc] hover:text-white"
                        }`}
                      >
                        {item.label}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileProfilExpanded((prev) => !prev)}
                        className="p-2 text-[#8e8e93] hover:text-white cursor-pointer"
                        aria-label="Toggle dropdown profil"
                        aria-expanded={mobileProfilExpanded}
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
                                  ? "text-[#d2d2d7] font-medium"
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
                      ? "text-white font-semibold pl-2 border-l-2 border-[#d2d2d7]"
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
                variant="light-pill"
                size="md"
                className="w-full text-[14px]"
              >
                Pendaftaran Siswa Baru (PPDB)
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Latar frost ala Apple untuk area kosong di bawah panel.
          Ditempatkan di luar <header> agar backdrop-filter tidak terkurung
          oleh backdrop root milik header. */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        onClick={closeProfileMenu}
        style={{ opacity: 0, visibility: "hidden" }}
        className={`fixed inset-x-0 bottom-0 top-[60px] z-30 hidden bg-black/30 backdrop-blur-3xl backdrop-saturate-150 lg:block ${
          profileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />

      {/* Dropdown desktop khusus Profil */}
      <nav
        ref={panelRef}
        id="profile-mega-menu"
        aria-labelledby="profile-menu-trigger"
        aria-hidden={!profileOpen}
        style={{ opacity: 0, visibility: "hidden" }}
        className="fixed inset-x-0 top-[60px] z-40 hidden lg:block pointer-events-none"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2.5 flex items-start justify-between">
          {/* Spacer penyeimbang brand di kiri agar posisi kolom selaras dengan navigasi */}
          <div
            className="hidden lg:block shrink-0 invisible pointer-events-none select-none text-[16px] sm:text-[17px] font-semibold tracking-[-0.2px]"
            aria-hidden="true"
          >
            SD PLUS AN-NUR
          </div>

          {/* Kolom menu utama bergaya Apple yang sejajar dengan trigger Profil */}
          <div className="w-full lg:w-auto flex-1 flex justify-start lg:justify-center">
            <div className="w-full lg:w-[604px] pl-0 lg:pl-16 xl:pl-20">
              <div
                data-menu-group
                onMouseEnter={openProfileMenu}
                onMouseLeave={scheduleCloseProfileMenu}
                onFocus={openProfileMenu}
                className={`relative w-fit min-w-[280px] rounded-2xl border border-black/[0.08] bg-white/90 backdrop-blur-[16px] px-8 py-7 text-[#1d1d1f] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15),0_0_1px_1px_rgba(0,0,0,0.05)] before:absolute before:-top-3 before:inset-x-0 before:h-3 before:content-[''] ${
                  profileOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <p className="text-[12px] font-normal text-[#86868b] tracking-normal mb-3">
                  Telusuri Profil
                </p>

                <div className="space-y-3">
                  {profileItem?.children.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      data-menu-link
                      onClick={closeProfileMenu}
                      className="block text-[24px] font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f] transition-opacity duration-200 hover:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded-sm"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Spacer penyeimbang tombol CTA PPDB di kanan */}
          <div
            className="hidden lg:flex items-center space-x-3 shrink-0 invisible pointer-events-none select-none"
            aria-hidden="true"
          >
            <span className="py-2 px-4 text-[13px]">Daftar Siswa (PPDB)</span>
          </div>
        </div>
      </nav>
    </>
  );
}
