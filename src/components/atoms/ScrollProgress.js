"use client";

import React, { useState, useEffect } from "react";

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("down");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;

          if (totalHeight > 0) {
            const progress = (currentScrollY / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, progress)));
          }

          if (currentScrollY > 120) {
            setIsVisible(true);
            if (currentScrollY > lastScrollY) {
              setScrollDirection("down");
            } else if (currentScrollY < lastScrollY) {
              setScrollDirection("up");
            }
          } else {
            setIsVisible(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 1. Ultra-sleek cinematic top glowing progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[#333333] via-[#555555] to-[#7a7a7a] transition-all duration-150 ease-out shadow-[0_0_12px_rgba(0,0,0,0.18)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Floating interactive Scroll Indicator Pill (bottom right) */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-500 pointer-events-none ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-90"
        }`}
        aria-hidden="true"
      >
        <div className="bg-black/80 backdrop-blur-md text-white border border-white/20 rounded-full px-3.5 py-1.5 shadow-2xl flex items-center gap-2 text-[12px] font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#d2d2d7] animate-pulse" />
          <span className="tabular-nums font-mono text-[11px] text-[#d2d2d7]">
            {Math.round(scrollProgress)}%
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider hidden sm:inline">
            {scrollDirection === "down" ? "Scroll ↓" : "Scroll ↑"}
          </span>
        </div>
      </div>
    </>
  );
}
