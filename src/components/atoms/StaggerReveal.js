"use client";

/**
 * StaggerReveal
 *
 * Wrapper untuk stagger animation pada child elements.
 * Digunakan pada grid kartu, daftar, dll.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ease } from "@/lib/gsapConfig";

export default function StaggerReveal({
  children,
  className = "",
  childSelector = ":scope > *",   // selector child yang dianimasikan
  staggerDelay = 0.1,             // detik antar elemen
  duration = 0.7,
  fromY = 36,
  once = false,
}) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const targets = containerRef.current?.querySelectorAll(childSelector);
      if (!targets?.length) return;

      gsap.fromTo(
        targets,
        { opacity: 0, y: fromY },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: ease.enter,
          stagger: staggerDelay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            toggleActions: once
              ? "play none none none"
              : "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef, dependencies: [staggerDelay, duration, fromY, once] }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
