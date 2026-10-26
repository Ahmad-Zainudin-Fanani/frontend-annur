"use client";

import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/atoms/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/atoms/Icons";

const defaultSlides = [
  {
    id: 1,
    eyebrow: "Sekolah Dasar Swasta Islam Unggulan",
    title: "SD Plus An-Nur. Cerdas, Berakhlak, Berkarakter.",
    subtitle:
      "Menerapkan Kurikulum SD Merdeka yang dipadukan dengan pembiasaan adab islami, tahfidzul qur'an Juz 30, dan literasi sains dalam lingkungan belajar ramah anak.",
    primaryCtaText: "Pendaftaran Siswa Baru (PPDB)",
    primaryCtaHref: "/kontak",
    secondaryCtaText: "Pelajari Profil Sekolah",
    secondaryCtaHref: "/profil",
    background:
      "radial-gradient(ellipse at 50% 18%, #24466a 0%, #182838 45%, #090b0f 100%)",
  },
  {
    id: 2,
    eyebrow: "Pondasi Karakter Qur'ani",
    title: "Tahfidzul Qur'an & Pembiasaan Ibadah Harian.",
    subtitle:
      "Membina generasi yang mencintai Al-Qur'an sejak usia dini melalui bimbingan tartil makharijul huruf, target tuntas Juz 30, serta shalat dhuha dan zhuhur berjamaah.",
    primaryCtaText: "Pelajari Program Tahfidz",
    primaryCtaHref: "/kurikulum#pilar",
    secondaryCtaText: "Prestasi Siswa",
    secondaryCtaHref: "/prestasi",
    background:
      "radial-gradient(ellipse at 80% 24%, #315047 0%, #1d302d 42%, #090b0f 100%)",
  },
  {
    id: 3,
    eyebrow: "Kurikulum SD Merdeka",
    title: "Eksplorasi Nalar Kritis, Kreativitas & Sains.",
    subtitle:
      "Pembelajaran intrakurikuler berdiferensiasi dengan penguatan literasi, numerasi kontekstual, dan projek penguatan profil pelajar Pancasila (P5) ramah anak.",
    primaryCtaText: "Pelajari Kurikulum",
    primaryCtaHref: "/kurikulum",
    secondaryCtaText: "Hubungi Kontak PPDB",
    secondaryCtaHref: "/kontak",
    background:
      "radial-gradient(ellipse at 20% 28%, #59472f 0%, #30291f 44%, #090b0f 100%)",
  },
];

export default function HeroCarousel({ slides = defaultSlides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay carousel every 6 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const activeSlide = slides[currentIndex];

  return (
    <section
      className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#000000] text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ========================================================
          1. SLIDE BACKGROUNDS
          ======================================================== */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
            }`}
          >
            <div
              className="relative w-full h-full"
              style={{ background: slide.background }}
              aria-hidden="true"
            />
          </div>
        );
      })}

      {/* ========================================================
          2. DARK OVERLAY
          ======================================================== */}
      <div
        className="absolute inset-0 z-10 bg-black/60 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none"
        aria-hidden="true"
      />

      {/* ========================================================
          3. HERO CONTENT (Typography strict to DESIGN.md)
          ======================================================== */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
        {/* Simple typographical eyebrow in Sky Link Blue (#2997ff) - NO PILL BADGES */}
        {activeSlide.eyebrow && (
          <span className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.2px] text-[#2997ff] mb-3.5 block select-none">
            {activeSlide.eyebrow}
          </span>
        )}

        {/* Hero headline in SF Pro Display 600, negative tracking */}
        <h1 className="text-[36px] sm:text-[46px] lg:text-[56px] font-semibold text-white leading-[1.07] tracking-[-0.28px] max-w-3xl mb-4">
          {activeSlide.title}
        </h1>

        {/* Lead subtitle in SF Pro Display 400 */}
        <p className="text-[18px] sm:text-[22px] lg:text-[26px] font-normal text-[#cccccc] leading-[1.25] tracking-[0.196px] max-w-2xl mb-8">
          {activeSlide.subtitle}
        </p>

        {/* Action buttons strictly following DESIGN.md button grammars */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {activeSlide.primaryCtaText && (
            <Button
              href={activeSlide.primaryCtaHref}
              variant="primary"
              size="md"
            >
              {activeSlide.primaryCtaText}
            </Button>
          )}

          {activeSlide.secondaryCtaText && (
            <Button
              href={activeSlide.secondaryCtaHref}
              variant="text-link-on-dark"
              size="md"
            >
              <span>{activeSlide.secondaryCtaText}</span>
              <span className="ml-1">→</span>
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================
          4. CAROUSEL CIRCULAR CONTROLS (DESIGN.md button-icon-circular)
          ======================================================== */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Slide Sebelumnya"
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[rgba(210,210,215,0.25)] hover:bg-[rgba(210,210,215,0.4)] backdrop-blur-md text-white flex items-center justify-center transition-all duration-120 apple-press-action cursor-pointer"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Slide Selanjutnya"
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[rgba(210,210,215,0.25)] hover:bg-[rgba(210,210,215,0.4)] backdrop-blur-md text-white flex items-center justify-center transition-all duration-120 apple-press-action cursor-pointer"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* ========================================================
          5. MINIMAL SLIDE DOTS (Bottom Center)
          ======================================================== */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Pindah ke slide ${idx + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
