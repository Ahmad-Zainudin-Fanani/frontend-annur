"use client";

/**
 * FeaturedPrograms — Redesign premium.
 *
 * Layout: heading kiri + link kanan, lalu alternating card style:
 * - 2 kolom grid di lg dengan kartu yang punya accent color berbeda
 * - Icon besar dengan glow ring
 * - Hover: card naik + shadow lebih dalam
 * GSAP: stagger entrance dari bawah
 */

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ease } from "@/lib/gsapConfig";
import ApiState from "@/components/atoms/ApiState";
import { BookOpenIcon, AwardIcon, SparklesIcon, BuildingIcon } from "@/components/atoms/Icons";

const CARD_THEMES = [
  { icon: BookOpenIcon, accent: "#0066cc", light: "rgba(0,102,204,0.08)", ring: "rgba(0,102,204,0.2)" },
  { icon: SparklesIcon, accent: "#6366f1", light: "rgba(99,102,241,0.08)", ring: "rgba(99,102,241,0.2)" },
  { icon: AwardIcon,    accent: "#0891b2", light: "rgba(8,145,178,0.08)", ring: "rgba(8,145,178,0.2)" },
  { icon: BuildingIcon, accent: "#059669", light: "rgba(5,150,105,0.08)", ring: "rgba(5,150,105,0.2)" },
];

export default function FeaturedPrograms({ curriculum, error = null }) {
  const programs = curriculum?.pillars || [];
  const sectionRef  = useRef(null);
  const headingRef  = useRef(null);
  const gridRef     = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // Heading
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current.querySelectorAll("[data-r]"),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, ease: ease.enter, stagger: 0.1,
            scrollTrigger: { trigger: headingRef.current, start: "top 85%" } }
        );
      }

      // Cards stagger
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll("[data-card]");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 44, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: ease.enter, stagger: 0.1,
            scrollTrigger: { trigger: gridRef.current, start: "top 82%" } }
        );
      }
    },
    { scope: sectionRef, dependencies: [programs.length] }
  );

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#f5f5f7] border-b border-[#e8e8ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div ref={headingRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span data-r className="inline-block text-[12px] font-bold uppercase tracking-[0.2em] text-[#0066cc] mb-4 px-3 py-1 rounded-full border border-[#0066cc]/25 bg-[#0066cc]/8">
              Kurikulum &amp; Keunggulan
            </span>
            <h2 data-r className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold text-[#1d1d1f] leading-tight tracking-tight">
              Program Unggulan<br className="hidden sm:block" /> SD Plus An-Nur
            </h2>
            <p data-r className="mt-3 text-[17px] text-[#7a7a7a] leading-relaxed">
              {curriculum?.overview || "Kurikulum terpadu yang menyeimbangkan ilmu umum, keislaman, dan kecakapan abad ke-21."}
            </p>
          </div>
          <Link href="/kurikulum" data-r className="shrink-0 inline-flex items-center gap-2 text-[14px] font-medium text-[#0066cc] hover:text-[#1d1d1f] transition-colors">
            Semua Kurikulum
            <span className="w-6 h-6 rounded-full border border-[#0066cc]/40 flex items-center justify-center text-xs">→</span>
          </Link>
        </div>

        {/* Cards */}
        {error ? (
          <ApiState error={error} />
        ) : programs.length === 0 ? (
          <ApiState empty />
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {programs.map((program, index) => {
              const theme = CARD_THEMES[index % CARD_THEMES.length];
              const Icon  = theme.icon;
              return (
                <article
                  key={program.id}
                  data-card
                  className="group relative bg-white border border-[#e8e8ed] rounded-[24px] p-7 sm:p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
                >
                  {/* Top accent stripe */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[24px]"
                    style={{ background: `linear-gradient(90deg, ${theme.accent}, transparent)` }}
                  />

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 ring-2"
                    style={{ background: theme.light, ringColor: theme.ring }}
                  >
                    <Icon className="w-6 h-6" style={{ color: theme.accent }} />
                  </div>

                  {/* Category pill */}
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block"
                    style={{ color: theme.accent, background: theme.light }}
                  >
                    {program.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-3 leading-snug group-hover:text-[#0066cc] transition-colors">
                    {program.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-[15px] text-[#7a7a7a] leading-relaxed mb-5">
                    {program.summary}
                  </p>

                  {/* Points */}
                  {program.points?.length ? (
                    <ul className="space-y-2 text-[14px] text-[#333333]">
                      {program.points.slice(0, 4).map((point) => (
                        <li key={point} className="flex gap-2.5 items-start">
                          <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                            style={{ background: theme.light, color: theme.accent }}>✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {/* Hover glow corner */}
                  <div
                    className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${theme.ring} 0%, transparent 70%)` }}
                  />
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
