"use client";

/**
 * HomeAchievements — Showcase prestasi siswa SD Plus An-Nur.
 * - Section di-pin sementara saat masuk viewport, lalu deretan kartu
 *   bergeser horizontal mengikuti scroll (scrub, bisa dibalik)
 * - Setelah kartu terakhir tampil penuh, pin dilepas dan halaman
 *   kembali scroll vertikal seperti biasa
 * - Jarak scroll dihitung dinamis dari lebar track dikurangi lebar viewport
 * - Memakai CardPrestasi yang sama dengan halaman /prestasi
 * - SplitText & ScrollTrigger untuk judul dan kemunculan strip
 */

import Link from "next/link";
import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ease } from "@/lib/gsapConfig";
import { ArrowUpRightIcon } from "@/components/atoms/Icons";
import CardPrestasi from "@/components/molecules/CardPrestasi";
import ApiState from "@/components/atoms/ApiState";

const MAX_ITEMS = 8;

// Jarak aman agar kartu terakhir tidak menempel tepat di tepi layar.
const END_GUTTER = 24;

export default function HomeAchievements({ achievements = [], error = null }) {
  const sectionRef  = useRef(null);
  const headingRef  = useRef(null);
  const splitRef    = useRef(null);
  const stripRef    = useRef(null);
  const viewportRef = useRef(null);
  const trackRef    = useRef(null);

  // Ambil maksimal 8 prestasi terbaru (tahun terbaru, lalu tanggal input)
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

      // 3. Pin section + geser kartu horizontal mengikuti scroll.
      //    Jarak tempuh = lebar seluruh track dikurangi lebar viewport,
      //    jadi kartu terakhir berhenti tepat di dalam layar.
      const track = trackRef.current;
      const viewport = viewportRef.current;

      if (track && viewport) {
        const getDistance = () => {
          const scrollable = track.scrollWidth - viewport.clientWidth;
          return scrollable > 0 ? scrollable + END_GUTTER : 0;
        };

        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${Math.max(1, getDistance())}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
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
            className="shrink-0 inline-flex items-center gap-2 text-[14px] font-medium text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors group apple-press-action"
          >
            <span>Lihat Semua Prestasi</span>
            <span className="w-7 h-7 rounded-full border border-[#d2d2d7] text-[#7a7a7a] group-hover:border-[#8e8e93] group-hover:text-[#1d1d1f] group-hover:bg-[#f5f5f7] flex items-center justify-center transition-colors">
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
            ref={viewportRef}
            role="region"
            aria-label="Prestasi terkini siswa SD Plus An-Nur"
            className="overflow-hidden"
          >
            <div
              ref={trackRef}
              data-prestasi-track
              className="flex w-max gap-4 will-change-transform sm:gap-5 lg:gap-6"
            >
              {latest.map((item) => (
                <div
                  key={item.id}
                  className="shrink-0 w-[340px] sm:w-[460px] lg:w-[580px]"
                >
                  <CardPrestasi item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
