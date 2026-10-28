"use client";

/**
 * PrestasiWinnersGallery — Galeri Pemenang Lomba Berbasis Foto
 * - Grid editorial 2 kolom, 6 item per halaman
 * - Paginasi Prev / Next halus dengan dot indicator
 * - Search nama siswa atau nama lomba (tanpa tab kategori)
 * - Animasi GSAP ScrollTrigger reveal saat halaman berganti
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ease } from "@/lib/gsapConfig";
import { SearchIcon, XIcon, ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/atoms/Icons";
import ApiState from "@/components/atoms/ApiState";

const ITEMS_PER_PAGE = 6;

/* ─────────────────────────────────────────────────────────────────────────────
   WinnerCard
───────────────────────────────────────────────────────────────────────────── */
function WinnerCard({ item, index }) {
  const imgRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  const isTall = index % 3 === 1;

  const handleMouseEnter = () => {
    if (imgRef.current) gsap.to(imgRef.current, { scale: 1.04, duration: 0.6, ease: ease.smooth });
  };
  const handleMouseLeave = () => {
    if (imgRef.current) gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: ease.smooth });
  };

  const studentInitials = item.studentName
    ? item.studentName.replace(/\(.*\)/g, "").trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "AN";

  const hasPhoto = Boolean(item.imageUrl && !imageError);

  return (
    <article
      data-winner-card
      className="group flex flex-col w-full focus-within:ring-2 focus-within:ring-[#0071e3] rounded-[24px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/prestasi/${item.id}`}
        className="block w-full focus:outline-none"
        aria-label={`Detail prestasi siswa: ${item.studentName} — ${item.title}`}
      >
        <div
          className={`relative w-full rounded-[24px] overflow-hidden bg-[#f0f0f2] border border-[#e0e0e0] shadow-sm transition-all duration-300 group-hover:border-[#1d1d1f]/40 group-hover:shadow-lg ${
            isTall ? "aspect-[4/3] lg:aspect-[16/13]" : "aspect-[16/11] lg:aspect-[16/12]"
          }`}
        >
          {hasPhoto ? (
            <div className="absolute inset-0">
              <Image
                ref={imgRef}
                src={item.imageUrl}
                alt={item.studentName || item.title}
                fill
                unoptimized
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover will-change-transform"
              />
            </div>
          ) : (
            <div
              ref={imgRef}
              className="absolute inset-0 bg-gradient-to-br from-[#272729] via-[#1d1d1f] to-[#141416] p-8 sm:p-10 flex flex-col justify-between text-white will-change-transform"
            >
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 25px 25px, white 2%, transparent 0%)", backgroundSize: "28px 28px" }}
              />
              <div className="relative z-10 flex items-center justify-between text-white/40">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">SD Plus An-Nur</span>
                <span className="text-[12px] font-normal text-white/30">Rekam Prestasi</span>
              </div>
              <div className="relative z-10 my-auto text-center py-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-white/20 transition-all duration-300">
                  <span className="text-[34px] sm:text-[40px] font-semibold text-white tracking-wider">{studentInitials}</span>
                </div>
                <p className="text-[13px] font-medium tracking-wide text-white/60 line-clamp-1 max-w-[260px] mx-auto">{item.studentName}</p>
              </div>
              <div className="relative z-10 flex items-center justify-between text-[11px] text-white/30 pt-4 border-t border-white/5">
                <span>Galeri Pemenang</span>
                <span>Lihat Detail →</span>
              </div>
            </div>
          )}

          <div className="absolute top-5 right-5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 pointer-events-none">
            <span className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center backdrop-blur-md border border-black/5">
              <ArrowUpRightIcon className="w-4 h-4 text-[#0066cc]" />
            </span>
          </div>
        </div>

        <div className="pt-5 px-1">
          <h2 className="text-[22px] sm:text-[26px] lg:text-[28px] font-semibold text-[#1d1d1f] tracking-[-0.025em] leading-[1.2] group-hover:text-[#0066cc] transition-colors duration-200">
            {item.studentName || "Siswa Berprestasi"}
          </h2>
          <p className="mt-2 text-[15px] sm:text-[16px] text-[#7a7a7a] font-normal leading-relaxed line-clamp-2">
            {item.title}
          </p>
        </div>
      </Link>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PrestasiWinnersGallery — Main Component
───────────────────────────────────────────────────────────────────────────── */
export default function PrestasiWinnersGallery({ achievements = [], error = null }) {
  const sectionRef = useRef(null);
  const gridRef    = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter hanya berdasarkan pencarian
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return achievements;
    return achievements.filter(
      (item) =>
        (item.studentName && item.studentName.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q))
    );
  }, [achievements, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  // Reset ke halaman 1 saat pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  // GSAP reveal setiap ganti halaman
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced || !gridRef.current) return;
      const cards = gridRef.current.querySelectorAll("[data-winner-card]");
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 36, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: ease.enter, stagger: 0.07, clearProps: "transform,opacity" }
      );
    },
    { scope: sectionRef, dependencies: [currentPage, pageItems.length] }
  );

  const scrollToGrid = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrev = () => {
    if (currentPage > 1) { setCurrentPage((p) => p - 1); scrollToGrid(); }
  };
  const handleNext = () => {
    if (currentPage < totalPages) { setCurrentPage((p) => p + 1); scrollToGrid(); }
  };

  return (
    <section id="galeri-pemenang" ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Search Bar saja ── */}
        <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-[#f0f0f0]">
          <p className="text-[13px] text-[#7a7a7a] shrink-0 hidden sm:block">
            <strong className="text-[#1d1d1f] font-semibold">{filtered.length}</strong> pemenang
          </p>

          <div className="relative w-full max-w-sm ml-auto">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7a7a7a]">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              id="prestasi-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa atau lomba..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[13px] text-[#1d1d1f] placeholder-[#7a7a7a] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Bersihkan pencarian"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            )}
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
              onClick={() => setSearchQuery("")}
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
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 lg:gap-x-12 lg:gap-y-16 items-start"
            >
              {pageItems.map((item, index) => (
                <WinnerCard key={item.id} item={item} index={index} />
              ))}
            </div>

            {/* ── Paginasi ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-16 pt-8 border-t border-[#f0f0f0]">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  aria-label="Halaman sebelumnya"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#f5f5f7]"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                {/* Dot / nomor halaman */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => { setCurrentPage(page); scrollToGrid(); }}
                      aria-label={`Halaman ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={`w-8 h-8 rounded-full text-[13px] font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-[#1d1d1f] text-white"
                          : "text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-[#f0f0f0]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  aria-label="Halaman berikutnya"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 bg-[#1d1d1f] text-white hover:bg-[#333333] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#1d1d1f]"
                >
                  <span className="hidden sm:inline">Berikutnya</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
