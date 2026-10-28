"use client";

/**
 * SmoothScroll — Smooth scrolling vertikal untuk halaman publik.
 *
 * - Lenis dijalankan dengan lerp ringan (0.12) agar responsif, bukan mengambang.
 * - Touch tetap memakai scroll native (syncTouch: false) supaya gestur di
 *   perangkat sentuh tidak tertunda.
 * - RAF Lenis dijalankan lewat gsap.ticker dan setiap event scroll-nya
 *   meneruskan update ke ScrollTrigger, sehingga pin/scrub (termasuk
 *   showcase prestasi) tetap sinkron tanpa konflik.
 * - prefers-reduced-motion: Lenis tidak diaktifkan sama sekali.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";
import "lenis/dist/lenis.css";

// Lerp ringan: cukup untuk menghaluskan wheel/trackpad tanpa lag terasa.
const LERP = 0.12;

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: LERP,
      smoothWheel: true,
      wheelMultiplier: 1,
      // Touch memakai scroll native; jangan di-smooth agar tetap responsif.
      syncTouch: false,
      // Link anchor internal ikut memakai animasi Lenis.
      anchors: true,
      // Hentikan inertia saat pindah halaman agar tidak "menerus" ke route baru.
      stopInertiaOnNavigate: true,
    });

    // Sinkronkan posisi scroll Lenis dengan ScrollTrigger (pin & scrub).
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    // Wajib saat memakai Lenis: matikan lag smoothing GSAP agar tidak dobel.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
