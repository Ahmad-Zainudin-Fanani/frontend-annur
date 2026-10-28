"use client";

/**
 * HomeGallery — Galeri Kegiatan SD Plus An-Nur
 * - Layout bento-editorial dinamis (variasi ukuran visual, bukan grid seragam)
 * - Filter kategori interaktif yang ditenagai GSAP Flip (perpindahan layout antar state)
 * - ScrollTrigger reveal & hover micro-interactions
 * - Tautan menuju rute /galeri
 */

import Link from "next/link";
import { useState, useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, Flip, ease } from "@/lib/gsapConfig";
import ApiState from "@/components/atoms/ApiState";
import { ChevronRightIcon } from "@/components/atoms/Icons";

function GalleryCard({ item, isLarge = false }) {
  const cardRef = useRef(null);
  const imgRef  = useRef(null);

  const handleMouseEnter = () => {
    if (imgRef.current) {
      gsap.to(imgRef.current, { scale: 1.06, duration: 0.5, ease: ease.smooth });
    }
  };

  const handleMouseLeave = () => {
    if (imgRef.current) {
      gsap.to(imgRef.current, { scale: 1, duration: 0.45, ease: ease.smooth });
    }
  };

  return (
    <div
      ref={cardRef}
      data-gallery-item
      data-category={item.category || "Umum"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[18px] bg-[#e8e8ed] group cursor-pointer border border-[#e0e0e0] ${
        isLarge
          ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 min-h-[360px] lg:min-h-[460px]"
          : "col-span-1 min-h-[220px]"
      }`}
    >
      {item.imageUrl ? (
        <img
          ref={imgRef}
          src={item.imageUrl}
          alt={item.title || "Dokumentasi SD Plus An-Nur"}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8e8ed] to-[#d0d0d5] flex items-center justify-center text-[#7a7a7a]">
          <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path strokeWidth={1.5} d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      )}

      {/* Atmospheric gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Category Pill Tag */}
      {item.category && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-white px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
            {item.category}
          </span>
        </div>
      )}

      {/* Caption Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <h3
          className={`font-semibold text-white leading-snug tracking-tight mb-1 drop-shadow ${
            isLarge ? "text-[18px] sm:text-[22px]" : "text-[15px]"
          }`}
        >
          {item.title}
        </h3>
        {item.date && (
          <span className="text-[12px] text-white/70 block">
            {item.date}
          </span>
        )}
      </div>
    </div>
  );
}

export default function HomeGallery({ galleries = [], error = null }) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const eyebrowRef = useRef(null);
  const gridRef    = useRef(null);
  const splitRef   = useRef(null);

  // Extract unique categories for Flip filter tabs
  const categories = useMemo(() => {
    const set = new Set();
    galleries.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ["Semua", ...Array.from(set)];
  }, [galleries]);

  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredItems = useMemo(() => {
    if (activeCategory === "Semua") return galleries.slice(0, 6);
    return galleries.filter((g) => g.category === activeCategory).slice(0, 6);
  }, [galleries, activeCategory]);

  // Entrance animation on mount
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

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
                start: "top 80%",
              },
            }
          );
        } catch {
          gsap.fromTo(
            headingRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: ease.enter,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
              },
            }
          );
        }
      }

      if (eyebrowRef.current) {
        gsap.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: ease.enter,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
            },
          }
        );
      }

      // Initial card stagger reveal
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll("[data-gallery-item]");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: ease.enter,
              stagger: 0.08,
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
              },
            }
          );
        }
      }

      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [galleries.length] }
  );

  // GSAP Flip animation when category changes
  const handleCategoryChange = (newCat) => {
    if (newCat === activeCategory) return;

    if (!gridRef.current) {
      setActiveCategory(newCat);
      return;
    }

    const cards = gridRef.current.querySelectorAll("[data-gallery-item]");
    const state = Flip.getState(cards);

    setActiveCategory(newCat);

    // Apply Flip animation immediately after react re-renders DOM
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.55,
        ease: "power2.inOut",
        stagger: 0.04,
        scale: true,
        fade: true,
        onComplete: () => {
          if (typeof window !== "undefined" && window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        },
      });
    });
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 bg-white border-b border-[#e0e0e0] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span
              ref={eyebrowRef}
              className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0066cc] mb-3 px-3.5 py-1 rounded-full border border-[#0066cc]/20 bg-[#f5f5f7]"
            >
              Galeri Kegiatan
            </span>
            <h2
              ref={headingRef}
              className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-[#1d1d1f] leading-[1.08] tracking-[-0.02em]"
            >
              Momen Berkesan &amp; Dokumentasi An-Nur
            </h2>
            <p className="mt-4 text-[17px] text-[#7a7a7a] leading-[1.47]">
              Merekam dinamika proses pembelajaran, kreativitas santri, perayaan hari besar, dan kegiatan ekstrakurikuler unggulan.
            </p>
          </div>

          <Link
            href="/galeri"
            className="shrink-0 inline-flex items-center gap-2 text-[14px] font-medium text-[#0066cc] hover:text-[#1d1d1f] transition-colors group apple-press-action"
          >
            <span>Lihat Semua Galeri</span>
            <span className="w-7 h-7 rounded-full border border-[#0066cc]/30 group-hover:border-[#1d1d1f]/50 flex items-center justify-center text-xs transition-colors">
              →
            </span>
          </Link>
        </div>

        {/* Filter Tabs using GSAP Flip */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer apple-press-action ${
                    isActive
                      ? "bg-[#1d1d1f] text-white shadow-sm"
                      : "bg-[#f5f5f7] text-[#555555] hover:text-[#1d1d1f] hover:bg-[#e8e8ed]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic Bento Editorial Grid */}
        {error ? (
          <ApiState error={error} />
        ) : filteredItems.length === 0 ? (
          <ApiState empty />
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr"
          >
            {filteredItems.map((item, index) => {
              // Item pertama dibuat large untuk variasi bento editorial
              const isLarge = index === 0;
              return (
                <GalleryCard
                  key={item.id}
                  item={item}
                  isLarge={isLarge}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
