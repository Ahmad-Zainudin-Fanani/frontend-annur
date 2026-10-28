"use client";

/**
 * HomeAchievements — Section Prestasi Siswa SD Plus An-Nur
 * Terinspirasi dari layout editorial dinamis & interaksi SOHUB Digital:
 * - Hierarki visual membedakan Prestasi Utama (Spotlight Card) vs Prestasi Pendukung
 * - Menggunakan data prestasi aktual dari API proyek
 * - Animasi GSAP SplitText untuk judul & ScrollTrigger stagger untuk kartu
 * - Konsisten dengan token DESAIN.md (Dark Tile 1 #272729, sky link #2997ff, SF Pro typography)
 */

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ease } from "@/lib/gsapConfig";
import { AwardIcon, ChevronRightIcon } from "@/components/atoms/Icons";
import ApiState from "@/components/atoms/ApiState";

const LEVEL_STYLE = {
  Internasional: {
    bg: "from-amber-500/20 via-amber-600/10 to-transparent",
    border: "border-amber-500/30",
    glow: "rgba(245,158,11,0.18)",
    label: "Tingkat Internasional",
  },
  Nasional: {
    bg: "from-blue-500/20 via-indigo-600/10 to-transparent",
    border: "border-blue-500/30",
    glow: "rgba(59,130,246,0.18)",
    label: "Tingkat Nasional",
  },
  Provinsi: {
    bg: "from-emerald-500/20 via-teal-600/10 to-transparent",
    border: "border-emerald-500/30",
    glow: "rgba(16,185,129,0.18)",
    label: "Tingkat Provinsi",
  },
  Kabupaten: {
    bg: "from-cyan-500/20 via-sky-600/10 to-transparent",
    border: "border-cyan-500/30",
    glow: "rgba(6,182,212,0.18)",
    label: "Tingkat Kabupaten",
  },
};

function getLevelStyle(level = "") {
  for (const [key, val] of Object.entries(LEVEL_STYLE)) {
    if (level.includes(key)) return val;
  }
  return {
    bg: "from-white/10 via-white/5 to-transparent",
    border: "border-white/15",
    badge: "bg-white/10 text-white/70 border-white/20",
    glow: "rgba(255,255,255,0.06)",
    label: level || "Prestasi Sekolah",
  };
}

export default function HomeAchievements({ achievements = [], error = null }) {
  const sectionRef  = useRef(null);
  const headingRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const subtitleRef = useRef(null);
  const spotlightRef = useRef(null);
  const listRef     = useRef(null);
  const splitRef    = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // 1. SplitText reveal on section heading
      if (headingRef.current) {
        try {
          splitRef.current = new SplitText(headingRef.current, {
            type: "words,lines",
            linesClass: "overflow-hidden py-0.5",
          });

          gsap.fromTo(
            splitRef.current.words,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: ease.enter,
              stagger: 0.035,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
              },
            }
          );
        } catch {
          gsap.fromTo(
            headingRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: ease.enter,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
              },
            }
          );
        }
      }

      // Eyebrow & Subtitle fade up
      if (eyebrowRef.current && subtitleRef.current) {
        gsap.fromTo(
          [eyebrowRef.current, subtitleRef.current],
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: ease.enter,
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
            },
          }
        );
      }

      // 2. Spotlight main card reveal
      if (spotlightRef.current) {
        gsap.fromTo(
          spotlightRef.current,
          { opacity: 0, y: 48, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: ease.enter,
            scrollTrigger: {
              trigger: spotlightRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // 3. Stagger supporting cards
      if (listRef.current) {
        const cards = listRef.current.querySelectorAll("[data-support-card]");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 36, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: ease.enter,
              stagger: 0.09,
              scrollTrigger: {
                trigger: listRef.current,
                start: "top 85%",
              },
            }
          );
        }
      }

      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [achievements.length] }
  );

  // Separate spotlight item from supporting items
  const items = achievements.slice(0, 6);
  const [spotlight, ...supporting] = items;
  const spotlightStyle = spotlight ? getLevelStyle(spotlight.level) : null;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden bg-[#161617] text-white border-b border-[#2d2d2f]"
    >
      {/* Background ambient radial glow inspired by SOHUB Digital */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(41,151,255,0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 left-10 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(0,102,204,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Editorial Cadence */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p
              ref={eyebrowRef}
              className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.25em] text-[#2997ff] mb-4"
            >
              Prestasi Siswa
            </p>
            <h2
              ref={headingRef}
              className="text-[32px] sm:text-[42px] lg:text-[48px] font-semibold text-white leading-[1.08] tracking-[-0.02em]"
            >
              Torehan Emas &amp; Jejak Prestasi An-Nur
            </h2>
            <p
              ref={subtitleRef}
              className="mt-4 text-[16px] sm:text-[17px] text-[#cccccc] leading-[1.47]"
            >
              Bukti dedikasi pembinaan bakat, kecerdasan, dan adab islami yang diukir para siswa di tingkat kabupaten, provinsi, hingga nasional.
            </p>
          </div>

          <Link
            href="/prestasi"
            className="shrink-0 inline-flex items-center gap-2.5 text-[14px] font-medium text-[#2997ff] hover:text-white transition-colors group apple-press-action"
          >
            <span>Semua Prestasi</span>
            <span className="w-7 h-7 rounded-full border border-[#2997ff]/30 group-hover:border-white/50 group-hover:bg-white/10 flex items-center justify-center text-xs transition-all">
              →
            </span>
          </Link>
        </div>

        {/* Content Area */}
        {error ? (
          <ApiState error={error} />
        ) : items.length === 0 ? (
          <ApiState empty />
        ) : (
          <div className="space-y-6">
            {/* Editorial 2-Column: Spotlight (Main) vs Supporting (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* 1. SPOTLIGHT CARD (Prestasi Utama) */}
              {spotlight && (
                <div ref={spotlightRef} className="lg:col-span-7">
                  <article
                    className={`relative h-full flex flex-col justify-between rounded-[22px] p-7 sm:p-9 border ${spotlightStyle.border} bg-gradient-to-br ${spotlightStyle.bg} bg-[#212124] overflow-hidden group transition-all duration-300 hover:border-white/30`}
                    style={{
                      boxShadow: `0 20px 40px -15px ${spotlightStyle.glow}`,
                    }}
                  >
                    {/* Decorative Watermark Trophy */}
                    <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none text-white">
                      <AwardIcon className="w-56 h-56" />
                    </div>

                    {/* Top Badges */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <span className="text-[12px] font-semibold uppercase tracking-wider text-[#2997ff]">
                          {spotlight.level ? `Tingkat ${spotlight.level}` : "Prestasi Utama"}
                        </span>
                        <div className="flex items-center gap-2 text-[13px] text-[#cccccc]">
                          <span>Tahun {spotlight.year}</span>
                          {spotlight.category && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-[12px]">
                                {spotlight.category}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Main Title */}
                      <h3 className="text-[24px] sm:text-[30px] font-semibold text-white leading-snug tracking-tight mb-4 group-hover:text-[#2997ff] transition-colors">
                        {spotlight.title}
                      </h3>

                      {/* Student Name */}
                      {spotlight.studentName && (
                        <div className="inline-flex items-center gap-3 py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 mb-6">
                          <span className="text-[12px] uppercase tracking-wider text-white/50 font-medium">
                            Peraih:
                          </span>
                          <span className="text-[15px] font-semibold text-white">
                            {spotlight.studentName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer Info */}
                    <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[13px] text-white/60">
                      <div>
                        <span className="text-white/40 block text-[11px] uppercase tracking-wider mb-0.5">
                          Penyelenggara
                        </span>
                        <span className="font-medium text-white/80">
                          {spotlight.organizer || "Kompetisi Resmi"}
                        </span>
                      </div>
                      <Link
                        href="/prestasi"
                        className="inline-flex items-center gap-1.5 text-[#2997ff] hover:underline font-medium text-[13px]"
                      >
                        Lihat Arsip Prestasi <ChevronRightIcon className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                </div>
              )}

              {/* 2. SUPPORTING CARDS (Prestasi Pendukung) */}
              <div
                ref={listRef}
                className="lg:col-span-5 flex flex-col gap-4 justify-between"
              >
                {supporting.slice(0, 2).map((item) => {
                  const style = getLevelStyle(item.level);
                  return (
                    <article
                      key={item.id}
                      data-support-card
                      className="relative rounded-[18px] p-6 border border-white/10 bg-[#212124] hover:bg-[#252528] hover:border-white/20 transition-all duration-300 flex-1 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2997ff]">
                            Tingkat {item.level}
                          </span>
                          <span className="text-[12px] text-white/40 font-medium">
                            {item.year}
                          </span>
                        </div>
                        <h4 className="text-[16px] sm:text-[17px] font-semibold text-white leading-snug mb-2 group-hover:text-[#2997ff] transition-colors">
                          {item.title}
                        </h4>
                        {item.studentName && (
                          <p className="text-[13px] text-white/60 font-medium">
                            {item.studentName}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 mt-4 border-t border-white/8 flex items-center justify-between text-[12px] text-white/40">
                        <span className="truncate max-w-[170px]">
                          {item.organizer || "Lomba Sekolah"}
                        </span>
                        {item.category && (
                          <span className="px-2 py-0.5 rounded bg-white/8 text-white/60 text-[11px]">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* 3. TERTIARY ROW (Quick Scan Grid for remaining items 3..5) */}
            {supporting.length > 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {supporting.slice(2, 5).map((item) => {
                  const style = getLevelStyle(item.level);
                  return (
                    <article
                      key={item.id}
                      data-support-card
                      className="rounded-[16px] p-5 border border-white/8 bg-[#1d1d1f] hover:border-white/20 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2997ff]">
                          Tingkat {item.level}
                        </span>
                        <span className="text-[11px] text-white/40">
                          {item.year}
                        </span>
                      </div>
                      <h5 className="text-[14px] font-semibold text-white leading-snug mb-1.5 group-hover:text-[#2997ff] transition-colors">
                        {item.title}
                      </h5>
                      <div className="flex items-center justify-between text-[12px] text-white/50 pt-2 border-t border-white/5">
                        <span className="truncate max-w-[140px]">
                          {item.studentName || item.organizer}
                        </span>
                        {item.category && (
                          <span className="text-[11px] text-white/40">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
