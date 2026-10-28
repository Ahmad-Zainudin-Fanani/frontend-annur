"use client";

/**
 * HomeAchievements — Running showcase prestasi siswa SD Plus An-Nur.
 * - Strip berjalan otomatis (marquee) berisi maksimal 4 prestasi terbaru
 * - Tanpa tombol navigasi: bergerak terus ke kanan seperti running text
 * - Memakai CardPrestasi yang sama dengan halaman /prestasi
 * - Marquee sengaja selalu berjalan, termasuk saat reduced motion
 * - SplitText & ScrollTrigger untuk judul dan kemunculan strip
 */

import Link from "next/link";
import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ease } from "@/lib/gsapConfig";
import { ArrowUpRightIcon } from "@/components/atoms/Icons";
import CardPrestasi from "@/components/molecules/CardPrestasi";
import ApiState from "@/components/atoms/ApiState";

const MAX_ITEMS = 4;

// Kecepatan geser (piksel per detik) dan durasi minimum.
const MARQUEE_SPEED = 75;
const MARQUEE_MIN_DURATION = 24;

// Jumlah grup identik agar strip selalu menutup layar lebar.
const MARQUEE_GROUPS = 3;

export default function HomeAchievements({ achievements = [], error = null }) {
  const sectionRef  = useRef(null);
  const headingRef  = useRef(null);
  const splitRef    = useRef(null);
  const stripRef    = useRef(null);
  const trackRef    = useRef(null);

  // Ambil maksimal 4 prestasi terbaru (tahun terbaru, lalu tanggal input)
  const latest = useMemo(() => {
    return [...achievements]
      .sort((a, b) => {
        const yearDiff = Number(b.year || 0) - Number(a.year || 0);
        if (yearDiff !== 0) return yearDiff;
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      })
      .slice(0, MAX_ITEMS);
  }, [achievements]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // 1. SplitText reveal pada judul section
      if (!prefersReduced && headingRef.current) {
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
                once: true,
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
                once: true,
              },
            }
          );
        }
      }

      // 2. Strip reveal saat masuk viewport
      if (!prefersReduced && stripRef.current) {
        gsap.fromTo(
          stripRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: ease.enter,
            scrollTrigger: {
              trigger: stripRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      // 3. Marquee: grup identik bergerak ke kanan tanpa henti.
      //    Geser tepat selebar satu grup (-100 / jumlah grup), lalu ulang:
      //    karena tiap grup identik, titik akhir sama persis dengan titik awal.
      const track = trackRef.current;
      if (track) {
        const groupWidth = track.scrollWidth / MARQUEE_GROUPS;
        const duration = Math.max(
          MARQUEE_MIN_DURATION,
          groupWidth / MARQUEE_SPEED
        );

        gsap.fromTo(
          track,
          { xPercent: -100 / MARQUEE_GROUPS },
          {
            xPercent: 0,
            duration,
            ease: "none",
            repeat: -1,
          }
        );
      }

      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [latest.length] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-32 bg-white border-b border-[#e0e0e0] text-[#1d1d1f]"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-14">
          <h2
            ref={headingRef}
            className="max-w-2xl text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-[#1d1d1f] leading-[1.08] tracking-[-0.02em]"
          >
            Prestasi Siswa-Siswi SD Plus An-Nur
          </h2>

          <Link
            href="/prestasi"
            className="shrink-0 inline-flex items-center gap-2 text-[14px] font-medium text-[#0066cc] hover:text-[#1d1d1f] transition-colors group apple-press-action"
          >
            <span>Lihat Semua Prestasi</span>
            <span className="w-7 h-7 rounded-full border border-[#0066cc]/30 group-hover:border-[#1d1d1f]/50 flex items-center justify-center transition-colors">
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* ── Content ── */}
      {error ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ApiState error={error} />
        </div>
      ) : latest.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ApiState empty />
        </div>
      ) : (
        <div ref={stripRef} className="relative">
          <div
            role="region"
            aria-label="Prestasi terkini siswa SD Plus An-Nur"
            className="overflow-hidden"
          >
            <div
              ref={trackRef}
              data-marquee-track
              className="flex w-max will-change-transform"
            >
              {Array.from({ length: MARQUEE_GROUPS }, (_, groupIndex) => {
                const isDuplicate = groupIndex > 0;

                return (
                  <div
                    key={groupIndex}
                    aria-hidden={isDuplicate || undefined}
                    inert={isDuplicate ? true : undefined}
                    className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5 lg:gap-6 lg:pr-6"
                  >
                    {latest.map((item) => (
                      <div
                        key={`${groupIndex}-${item.id}`}
                        className="shrink-0 w-[300px] sm:w-[400px] lg:w-[500px]"
                      >
                        <CardPrestasi item={item} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
