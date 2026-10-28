"use client";

/**
 * PrestasiWinnersGallery — Galeri Pemenang Lomba Berbasis Foto
 * - Grid portfolio 2 kolom rapat, 6 item per halaman
 * - Label nama siswa & prestasi menempel di dalam kotak (ala showcase)
 * - Pencarian nama siswa / lomba dengan animasi GSAP Flip
 * - SplitText + ScrollTrigger untuk judul dan kemunculan kartu
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, Flip, SplitText, ease } from "@/lib/gsapConfig";
import {
  SearchIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/atoms/Icons";
import CardPrestasi from "@/components/molecules/CardPrestasi";
import ApiState from "@/components/atoms/ApiState";

const ITEMS_PER_PAGE = 6;

/* ─────────────────────────────────────────────────────────────────────────────
   PrestasiWinnersGallery — Main Component
───────────────────────────────────────────────────────────────────────────── */
export default function PrestasiWinnersGallery({ achievements = [], error = null }) {
  const sectionRef  = useRef(null);
  const gridRef     = useRef(null);
  const headingRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const subtitleRef = useRef(null);
  const splitRef    = useRef(null);
  const flipStateRef = useRef(null);
  const changeRef   = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter hanya berdasarkan pencarian
  const filtered = useMemo(() => {
    const q = activeQuery.trim().toLowerCase();
    if (!q) return achievements;
    return achievements.filter(
      (item) =>
        (item.studentName && item.studentName.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q))
    );
  }, [achievements, activeQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  // Debounce pencarian agar animasi Flip tidak bertabrakan saat mengetik.
  useEffect(() => {
    if (searchQuery === activeQuery) return;

    const timer = setTimeout(() => {
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll("[data-winner-card]");
        if (cards.length) flipStateRef.current = Flip.getState(cards);
      }
      changeRef.current = true;
      setCurrentPage(1);
      setActiveQuery(searchQuery);
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery, activeQuery]);

  /* ── SplitText judul + ScrollTrigger reveal kartu & parallax ── */
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // 1. Judul section — SplitText per kata
      if (headingRef.current) {
        try {
          splitRef.current = new SplitText(headingRef.current, {
            type: "words,lines",
            linesClass: "overflow-hidden py-0.5",
          });

          gsap.fromTo(
            splitRef.current.words,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: ease.enter,
              stagger: 0.035,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 82%",
                once: true,
              },
            }
          );
        } catch {
          gsap.fromTo(
            headingRef.current,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: ease.enter,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 82%",
                once: true,
              },
            }
          );
        }
      }

      // 2. Eyebrow & deskripsi
      const introElements = [eyebrowRef.current, subtitleRef.current].filter(Boolean);
      if (introElements.length) {
        gsap.fromTo(
          introElements,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: ease.enter,
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 3. Kartu — reveal saat masuk viewport
      if (gridRef.current) {
        const cards = Array.from(gridRef.current.querySelectorAll("[data-winner-card]"));
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: ease.enter,
              stagger: 0.08,
              clearProps: "opacity,transform",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
                once: true,
              },
            }
          );
        }

        // 4. Parallax halus pada media kartu (scrub)
        gridRef.current.querySelectorAll("[data-card-parallax]").forEach((layer) => {
          gsap.fromTo(
            layer,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: layer.closest("[data-winner-card]"),
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        });
      }

      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  /* ── Animasi Flip saat pencarian / halaman berubah ── */
  useGSAP(
    () => {
      // Hanya berjalan setelah pengguna mengubah pencarian/halaman.
      // Animasi awal sudah ditangani ScrollTrigger di atas.
      if (!changeRef.current) return;
      changeRef.current = false;

      const cards = gridRef.current
        ? Array.from(gridRef.current.querySelectorAll("[data-winner-card]"))
        : [];

      if (!cards.length) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const state = flipStateRef.current;
      flipStateRef.current = null;

      // Layout yang sama sekali baru (mis. halaman berpindah)
      if (!state || !state.targets || !state.targets.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 36, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: ease.enter,
            stagger: 0.06,
            clearProps: "opacity,transform",
            onComplete: () => ScrollTrigger.refresh(),
          }
        );
        return;
      }

      // Filter pencarian — kartu yang tersisa dianimasikan ke posisi baru
      Flip.from(state, {
        targets: cards,
        duration: 0.55,
        ease: "power2.inOut",
        stagger: 0.035,
        scale: true,
        absolute: true,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, y: 30, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: ease.enter,
              stagger: 0.05,
            }
          ),
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { scope: sectionRef, dependencies: [activeQuery, currentPage] }
  );

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const scrollToGrid = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToPage = (page) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    flipStateRef.current = null;
    changeRef.current = true;
    setCurrentPage(page);
    scrollToGrid();
  };

  return (
    <section id="galeri-pemenang" ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section heading ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#f0f0f0]">
          <div className="max-w-xl">
            <span
              ref={eyebrowRef}
              className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.25em] text-[#0066cc] block mb-3"
            >
              Pemenang Lomba
            </span>
            <h2
              ref={headingRef}
              className="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-[#1d1d1f] leading-[1.1] tracking-[-0.025em]"
            >
              Setiap Juara Punya Cerita.
            </h2>
            <p ref={subtitleRef} className="mt-3 text-[15px] sm:text-[16px] text-[#7a7a7a] leading-[1.55]">
              Telusuri nama dan capaian siswa yang mengharumkan nama SD Plus An-Nur.
            </p>
          </div>

          <div className="w-full md:w-[320px] shrink-0">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7a7a7a]">
                <SearchIcon className="w-4 h-4" />
              </span>
              <input
                id="prestasi-search"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari siswa atau lomba..."
                className="w-full pl-10 pr-9 py-2.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[13px] text-[#1d1d1f] placeholder-[#7a7a7a] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  aria-label="Bersihkan pencarian"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="mt-2 text-[12px] text-[#7a7a7a] text-right">
              <strong className="text-[#1d1d1f] font-semibold">{filtered.length}</strong> pemenang
            </p>
          </div>
        </div>

        {/* ── Konten ── */}
        {error ? (
          <ApiState error={error} />
        ) : filtered.length === 0 ? (
          <div className="bg-[#fafafc] border border-[#e0e0e0] rounded-[24px] p-12 text-center max-w-lg mx-auto">
            <SearchIcon className="w-10 h-10 text-[#7a7a7a]/50 mx-auto mb-3" />
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-1">Tidak Ditemukan</h3>
            <p className="text-[14px] text-[#7a7a7a] mb-5">Coba cari dengan nama siswa atau nama lomba lainnya.</p>
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white text-[13px] font-medium hover:bg-[#333333] transition-colors"
            >
              Tampilkan Semua
            </button>
          </div>
        ) : (
          <>
            {/* Grid 2 kolom */}
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
            >
              {pageItems.map((item) => (
                <CardPrestasi key={item.id} item={item} />
              ))}
            </div>

            {/* ── Paginasi: < 1 2 > ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-16 pt-8 border-t border-[#f0f0f0]">
                <nav aria-label="Navigasi halaman" className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Halaman sebelumnya"
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#f5f5f7] transition-all duration-200"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      aria-label={`Halaman ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={`w-9 h-9 rounded-full text-[13px] font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-[#1d1d1f] text-white"
                          : "text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-[#f0f0f0]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Halaman berikutnya"
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#f5f5f7] transition-all duration-200"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
