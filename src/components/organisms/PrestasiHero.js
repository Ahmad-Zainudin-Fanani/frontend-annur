"use client";

/**
 * PrestasiHero — Hero Section Halaman Prestasi SD Plus An-Nur
 * - Judul utama: "Mengasah Potensi, Mengukir Prestasi."
 * - Deskripsi ringkas & tipografi editorial tegas
 * - Ruang kosong proporsional dan tidak berlebihan
 * - Animasi masuk halus dengan GSAP SplitText & Timeline
 */

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ease } from "@/lib/gsapConfig";

export default function PrestasiHero() {
  const containerRef = useRef(null);
  const eyebrowRef   = useRef(null);
  const titleRef     = useRef(null);
  const descRef      = useRef(null);
  const splitRef     = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      if (!titleRef.current) return;

      try {
        splitRef.current = new SplitText(titleRef.current, {
          type: "words,lines",
          linesClass: "overflow-hidden py-0.5",
        });

        const tl = gsap.timeline({ delay: 0.15 });

        if (eyebrowRef.current) {
          tl.fromTo(
            eyebrowRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: ease.enter }
          );
        }

        if (splitRef.current.words.length) {
          tl.fromTo(
            splitRef.current.words,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.75,
              ease: ease.enter,
              stagger: 0.035,
            },
            "-=0.3"
          );
        }

        if (descRef.current) {
          tl.fromTo(
            descRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: ease.enter },
            "-=0.4"
          );
        }
      } catch {
        gsap.fromTo(
          [eyebrowRef.current, titleRef.current, descRef.current].filter(Boolean),
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, ease: ease.enter, stagger: 0.1 }
        );
      }

      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
      };
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <section
      ref={containerRef}
      className="w-full pt-12 pb-8 sm:pt-16 sm:pb-10 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#e0e0e0] select-none"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow Editorial — Bersih tanpa pill badge berbingkai */}
        <div ref={eyebrowRef} className="mb-3">
          <span className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.25em] text-[#7a7a7a]">
            Galeri Prestasi Siswa
          </span>
        </div>

        {/* Title — Hierarki Tipografi Kuat */}
        <h1
          ref={titleRef}
          className="text-[34px] sm:text-[46px] lg:text-[54px] font-semibold text-[#1d1d1f] leading-[1.08] tracking-[-0.03em] max-w-3xl mb-4"
        >
          Mengasah Potensi, Mengukir Prestasi.
        </h1>

        {/* Concise Description */}
        <p
          ref={descRef}
          className="text-[16px] sm:text-[18px] text-[#7a7a7a] font-normal leading-[1.47] max-w-2xl"
        >
          Dokumentasi jejak kejuaraan siswa-siswi SD Plus An-Nur dalam ajang olimpiade sains, musabaqah tahfidz Al-Qur&apos;an, seni, dan olahraga.
        </p>
      </div>
    </section>
  );
}
