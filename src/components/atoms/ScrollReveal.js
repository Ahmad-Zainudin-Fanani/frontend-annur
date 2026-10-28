"use client";

/**
 * ScrollReveal — GSAP ScrollTrigger edition.
 *
 * Pengganti ScrollReveal.js berbasis CSS sebelumnya.
 * Mendukung prefers-reduced-motion dan cleanup yang benar
 * untuk menghindari duplikasi ScrollTrigger pada re-render.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ease, dur } from "@/lib/gsapConfig";

// Daftarkan useGSAP agar GSAP mengetahui React lifecycle.
import gsapLib from "gsap";
gsapLib.registerPlugin(ScrollTrigger);

const ANIMATIONS = {
  "fade-up":    { opacity: 0, y: 40 },
  "fade-down":  { opacity: 0, y: -40 },
  "fade-left":  { opacity: 0, x: 40 },
  "fade-right": { opacity: 0, x: -40 },
  "zoom-in":    { opacity: 0, scale: 0.92, y: 20 },
  "clip-up":    { opacity: 0, clipPath: "inset(100% 0 0 0)", y: 0 },
};

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,           // ms
  duration = 650,      // ms
  threshold = 0.12,
  className = "",
  once = false,        // true = animasi hanya sekali
}) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // Hormati prefers-reduced-motion.
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const from = ANIMATIONS[animation] ?? ANIMATIONS["fade-up"];
      const to = { opacity: 1, y: 0, x: 0, scale: 1, clipPath: "inset(0% 0 0 0)" };

      gsap.fromTo(
        containerRef.current,
        from,
        {
          ...to,
          duration: duration / 1000,
          delay: delay / 1000,
          ease: ease.enter,
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${Math.round((1 - threshold) * 100)}%`,
            toggleActions: once
              ? "play none none none"
              : "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef, dependencies: [animation, delay, duration, threshold, once] }
  );

  return (
    <div ref={containerRef} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
