"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsapConfig";

/**
 * InteractiveButton — tombol dengan interaksi fill melingkar (circle reveal)
 * mengikuti posisi kursor (seperti tombol 'Formulir Kontak' pada showcase Sekretariat).
 *
 * Mendukung 2 tema:
 * - "dark": Default background hitam/charcoal, border hitam, fill hover warna kontras.
 *   Namun varian persis seperti di Sekretariat & Layanan Informasi adalah:
 *   outline/light button dengan border hitam, background putih, teks hitam,
 *   dan saat hover memunculkan circle expand warna hitam dengan teks menjadi putih.
 * - Serta varian filled dark jika diinginkan (misal circle fill inverse).
 */
export default function InteractiveButton({
  children,
  href,
  onClick,
  variant = "outline", // "outline" (seperti Formulir Kontak) atau "filled"
  className = "",
  type = "button",
  target,
  rel,
  disabled = false,
  ...props
}) {
  const fillRef = useRef(null);
  const clipRef = useRef(null);
  const stateRef = useRef({ x: 0, y: 0, radius: 0 });

  const isOutline = variant === "outline";

  const applyClip = useCallback(() => {
    const { x, y, radius } = stateRef.current;
    const clipPath = `circle(${radius}px at ${x}px ${y}px)`;

    if (fillRef.current) fillRef.current.style.clipPath = clipPath;
    if (clipRef.current) clipRef.current.style.clipPath = clipPath;
  }, []);

  const handleMouseEnter = useCallback(
    (event) => {
      const button = event.currentTarget;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const offsetX = button.clientLeft || 0;
      const offsetY = button.clientTop || 0;
      const width = button.clientWidth || rect.width;
      const height = button.clientHeight || rect.height;
      const x = event.clientX - rect.left - offsetX;
      const y = event.clientY - rect.top - offsetY;

      const radius =
        Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) + 2;

      const state = stateRef.current;
      gsap.killTweensOf(state);
      state.x = x;
      state.y = y;
      state.radius = 0;
      applyClip();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        state.radius = radius;
        applyClip();
        return;
      }

      gsap.to(state, {
        radius,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: applyClip,
      });
    },
    [applyClip]
  );

  const handleMouseLeave = useCallback(
    (event) => {
      const button = event.currentTarget;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const offsetX = button.clientLeft || 0;
      const offsetY = button.clientTop || 0;
      const state = stateRef.current;

      gsap.killTweensOf(state);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        state.x = event.clientX - rect.left - offsetX;
        state.y = event.clientY - rect.top - offsetY;
        state.radius = 0;
        applyClip();
        return;
      }

      gsap.to(state, {
        x: event.clientX - rect.left - offsetX,
        y: event.clientY - rect.top - offsetY,
        radius: 0,
        duration: 0.45,
        ease: "power3.inOut",
        onUpdate: applyClip,
      });
    },
    [applyClip]
  );

  useEffect(() => {
    const state = stateRef.current;
    return () => {
      gsap.killTweensOf(state);
    };
  }, []);

  const baseClasses =
    "relative inline-flex items-center justify-center overflow-hidden rounded-full text-center text-[15px] sm:text-[16px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#7a7a7a] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none px-7 py-3 sm:px-8 sm:py-3.5";

  const themeClasses = isOutline
    ? "border border-black bg-white text-black"
    : "border border-black bg-[#1d1d1f] text-white";

  const content = (
    <>
      {/* Background fill yang membesar mengikuti cursor */}
      <span
        ref={fillRef}
        aria-hidden="true"
        style={{ clipPath: "circle(0px at 50% 50%)" }}
        className={`pointer-events-none absolute inset-0 z-0 rounded-full ${
          isOutline ? "bg-black" : "bg-white"
        }`}
      />

      {/* Label dasar */}
      <span className="relative z-10 font-semibold">{children}</span>

      {/* Label lapisan atas dengan warna terbalik yang ter-clip seirama */}
      <span
        ref={clipRef}
        aria-hidden="true"
        style={{ clipPath: "circle(0px at 50% 50%)" }}
        className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center font-semibold ${
          isOutline ? "text-white" : "text-black"
        }`}
      >
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${themeClasses} ${className}`}
        target={target}
        rel={rel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${themeClasses} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {content}
    </button>
  );
}

