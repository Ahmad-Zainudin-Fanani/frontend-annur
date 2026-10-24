"use client";

import React, { useEffect, useState } from "react";

export default function MotionGraphicsDecor() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Luminous Ambient Gradient Orb 1 (Top Left) */}
      <div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#0066cc]/10 via-[#2997ff]/5 to-transparent blur-3xl transition-transform duration-700 ease-out animate-ambient-drift"
        style={{
          transform: `translate3d(0, ${scrollY * 0.12}px, 0)`,
        }}
      />

      {/* 2. Luminous Ambient Gradient Orb 2 (Middle Right) */}
      <div
        className="absolute top-[40%] -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#38bdf8]/10 via-[#0066cc]/5 to-transparent blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.08}px, 0)`,
        }}
      />

      {/* 3. Luminous Ambient Gradient Orb 3 (Bottom Left) */}
      <div
        className="absolute top-[75%] -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#6366f1]/8 via-[#0066cc]/5 to-transparent blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(0, ${scrollY * 0.06}px, 0)`,
        }}
      />

      {/* 4. Geometric Rotating Islamic 8-Point Star Graphic (Top Right Hero Area) */}
      <div
        className="absolute top-28 right-8 lg:right-24 w-44 h-44 opacity-20 transition-transform duration-500 ease-out hidden md:block"
        style={{
          transform: `translate3d(0, ${scrollY * 0.18}px, 0) rotate(${scrollY * 0.08}deg)`,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-[#0066cc] animate-spin-slow"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* 8-pointed star created by two rotated squares */}
          <rect x="25" y="25" width="50" height="50" rx="3" />
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            rx="3"
            transform="rotate(45 50 50)"
          />
          <circle cx="50" cy="50" r="16" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* 5. Geometric Concentric Orbital Ring (Middle Left Area) */}
      <div
        className="absolute top-[48%] left-6 lg:left-16 w-52 h-52 opacity-15 transition-transform duration-500 ease-out hidden lg:block"
        style={{
          transform: `translate3d(0, ${scrollY * 0.14}px, 0) rotate(${-scrollY * 0.06}deg)`,
        }}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full text-[#2997ff]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle cx="60" cy="60" r="54" strokeDasharray="6 6" />
          <circle cx="60" cy="60" r="38" />
          <circle cx="60" cy="60" r="22" strokeDasharray="4 4" />
          <circle cx="60" cy="60" r="4" fill="currentColor" />
        </svg>
      </div>

      {/* 6. Subtle Floating Micro Sparkle Motif (Bottom Right Area) */}
      <div
        className="absolute top-[82%] right-12 lg:right-20 w-32 h-32 opacity-25 transition-transform duration-500 ease-out hidden sm:block"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.1}px, 0) scale(${1 + Math.sin(scrollY * 0.005) * 0.1})`,
        }}
      >
        <svg
          viewBox="0 0 80 80"
          className="w-full h-full text-[#0066cc]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M40 8v64M8 40h64M17.5 17.5l45 45M62.5 17.5l-45 45"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
