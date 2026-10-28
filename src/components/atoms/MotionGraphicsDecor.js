"use client";

/**
 * MotionGraphicsDecor — GSAP parallax edition.
 *
 * Orbs dan elemen dekoratif bergerak dengan kecepatan berbeda
 * menggunakan GSAP ScrollTrigger scrub — jauh lebih smooth daripada
 * implementasi rAF + setState sebelumnya karena tidak memicu re-render.
 *
 * Reduced-motion: orbs tetap tampil statis tanpa animasi.
 * Desktop only: hidden di mobile agar tidak mengganggu performa.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

export default function MotionGraphicsDecor() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Helper: parallax per elemen
        const parallax = (selector, yFactor) => {
          const el = containerRef.current?.querySelector(selector);
          if (!el) return;
          gsap.to(el, {
            y: () => window.innerHeight * yFactor,
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        };

        // Rotation untuk elemen geometrik
        const rotate = (selector, degFactor) => {
          const el = containerRef.current?.querySelector(selector);
          if (!el) return;
          gsap.to(el, {
            rotation: () => window.scrollY * degFactor,
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom top",
              scrub: 2,
            },
          });
        };

        parallax("[data-orb='1']",  0.14);
        parallax("[data-orb='2']", -0.10);
        parallax("[data-orb='3']",  0.08);
        parallax("[data-star]",     0.22);
        parallax("[data-ring]",     0.16);
        parallax("[data-spark]",   -0.12);
        rotate("[data-star]",  0.06);
        rotate("[data-ring]", -0.04);

        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Orb kiri atas */}
      <div
        data-orb="1"
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#0066cc]/10 via-[#2997ff]/5 to-transparent blur-3xl hidden md:block"
      />

      {/* 2. Orb kanan tengah */}
      <div
        data-orb="2"
        className="absolute top-[40%] -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#38bdf8]/10 via-[#0066cc]/5 to-transparent blur-3xl hidden md:block"
      />

      {/* 3. Orb kiri bawah */}
      <div
        data-orb="3"
        className="absolute top-[75%] -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#6366f1]/8 via-[#0066cc]/5 to-transparent blur-3xl hidden md:block"
      />

      {/* 4. Bintang Islam 8 sudut */}
      <div
        data-star
        className="absolute top-28 right-8 lg:right-24 w-44 h-44 opacity-20 hidden md:block"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-[#0066cc]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <rect x="25" y="25" width="50" height="50" rx="3" />
          <rect x="25" y="25" width="50" height="50" rx="3" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="16" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* 5. Ring konsentris */}
      <div
        data-ring
        className="absolute top-[48%] left-6 lg:left-16 w-52 h-52 opacity-15 hidden lg:block"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full text-[#2997ff]" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="60" cy="60" r="54" strokeDasharray="6 6" />
          <circle cx="60" cy="60" r="38" />
          <circle cx="60" cy="60" r="22" strokeDasharray="4 4" />
          <circle cx="60" cy="60" r="4" fill="currentColor" />
        </svg>
      </div>

      {/* 6. Sparkle */}
      <div
        data-spark
        className="absolute top-[82%] right-12 lg:right-20 w-32 h-32 opacity-25 hidden sm:block"
      >
        <svg viewBox="0 0 80 80" className="w-full h-full text-[#0066cc]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M40 8v64M8 40h64M17.5 17.5l45 45M62.5 17.5l-45 45" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
