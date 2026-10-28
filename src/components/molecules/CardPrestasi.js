"use client";

/**
 * CardPrestasi — Kartu showcase prestasi siswa.
 * Dipakai bersama di halaman /prestasi dan section Prestasi pada Beranda.
 *
 * - Latar gelap dengan aksen warna per kategori
 * - Badge lingkaran di tengah saat foto belum tersedia
 * - Nama peraih (bold) + judul prestasi sebagai subteks di bagian bawah
 */

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ease } from "@/lib/gsapConfig";
import { ArrowUpRightIcon, AwardIcon } from "@/components/atoms/Icons";

export const CATEGORY_ACCENT = {
  "Keagamaan & Tahfidz": "#3ddc97",
  "Akademik (OSN)": "#2997ff",
  "Olahraga (O2SN)": "#ffb340",
  "Seni & Literasi": "#c084fc",
};

const DEFAULT_ACCENT = "#2997ff";

export default function CardPrestasi({
  item,
  onDark = false,
  showArrow = true,
  className = "",
}) {
  const mediaRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  const hasPhoto = Boolean(item.imageUrl && !imageError);
  const accent = CATEGORY_ACCENT[item.category] || DEFAULT_ACCENT;

  const animateMedia = (scale) => {
    if (!mediaRef.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    gsap.to(mediaRef.current, {
      scale,
      duration: scale > 1 ? 0.7 : 0.55,
      ease: ease.smooth,
      overwrite: "auto",
    });
  };

  return (
    <article
      data-winner-card
      className={`group w-full focus-within:ring-2 focus-within:ring-[#0071e3] rounded-[16px] ${className}`}
      onMouseEnter={() => animateMedia(1.04)}
      onMouseLeave={() => animateMedia(1)}
    >
      <Link
        href={`/prestasi/${item.id}`}
        className="block w-full focus:outline-none"
        aria-label={`Detail prestasi siswa: ${item.studentName || "siswa"} — ${item.title}`}
      >
        <div
          className={`relative w-full aspect-[5/3] rounded-[16px] overflow-hidden bg-[#1d1d1f] transition-all duration-300 ${
            onDark
              ? "ring-1 ring-white/10 group-hover:ring-white/25 shadow-lg shadow-black/20"
              : "shadow-sm group-hover:shadow-xl"
          }`}
        >
          {/* Lapisan parallax ScrollTrigger (dipakai di halaman /prestasi) */}
          <div data-card-parallax className="absolute inset-x-0 -inset-y-[6%]">
            {hasPhoto ? (
              <div ref={mediaRef} className="absolute inset-0 will-change-transform">
                <Image
                  src={item.imageUrl}
                  alt={item.studentName || item.title}
                  fill
                  unoptimized
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                ref={mediaRef}
                className="absolute inset-0 bg-gradient-to-br from-[#272729] via-[#1d1d1f] to-[#141416] will-change-transform"
              >
                {/* Aksen kategori */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 72% 18%, ${accent}26, transparent 58%)`,
                  }}
                />

                {/* Tekstur titik halus */}
                <div
                  className="absolute inset-0 opacity-[0.07] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 25px 25px, white 2%, transparent 0%)",
                    backgroundSize: "28px 28px",
                  }}
                />

                {/* Badge lingkaran di tengah */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md transition-transform duration-500 group-hover:scale-105">
                    <span className="absolute -inset-6 rounded-full border border-white/[0.04]" />
                    <span className="absolute inset-2.5 rounded-full border border-white/[0.06]" />
                    <AwardIcon
                      className="w-12 h-12 sm:w-14 sm:h-14 transition-colors duration-300"
                      style={{ color: accent, opacity: 0.85 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gradasi agar label tetap terbaca di atas foto */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Nama peraih + judul prestasi */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
            <h3 className="text-[21px] sm:text-[25px] lg:text-[28px] font-semibold text-white leading-[1.15] tracking-[-0.015em]">
              {item.studentName || "Siswa Berprestasi"}
            </h3>
            <p className="mt-1.5 text-[12px] sm:text-[13px] text-white/70 leading-snug line-clamp-1">
              {item.title}
            </p>
          </div>

          {/* Ikon detail saat hover */}
          {showArrow && (
            <div className="pointer-events-none absolute top-4 right-4 z-10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <span className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
                <ArrowUpRightIcon className="w-4 h-4 text-[#0066cc]" />
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
