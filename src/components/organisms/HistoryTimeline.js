"use client";

/**
 * HistoryTimeline — section "Sejarah Berdiri" bergaya horizontal editorial.
 *
 * Konsep:
 * - Seluruh rangkaian tonggak sejarah berada dalam satu track horizontal.
 * - Section di-pin; scroll vertikal menggeser track dari kanan ke kiri dengan
 *   GSAP Timeline + ScrollTrigger (pin + scrub), sehingga animasi reversible.
 * - Semua slide memakai background putih. Perpindahan antarperistiwa dibangun
 *   lewat gerak horizontal, clip-path reveal pada foto, parallax angka tahun,
 *   dan staggered fade-up teks — bukan pergantian warna background.
 * - Palet monokrom mengikuti sistem warna project: ink #1d1d1f, abu sekunder
 *   #7a7a7a, garis #e0e0e0. Tidak ada aksen hijau di section ini.
 * - Timeline bawah hanya indikator progres visual (bukan tombol): garis tipis,
 *   titik kecil, tahun aktif lebih tegas, dan garis progres yang terisi
 *   mengikuti posisi scroll.
 * - Mobile & prefers-reduced-motion: tanpa pin, slide ditumpuk vertikal dan
 *   tetap terbaca (lihat globals.css).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";
import ApiState from "@/components/atoms/ApiState";
import { GraduationCapIcon } from "@/components/atoms/Icons";

const YEAR_PATTERN = /\b(1[89]\d{2}|20\d{2})\b/;

/* Angka tahun dekoratif: abu-abu muda dengan opacity rendah. */
const DECOR = "rgba(29, 29, 31, 0.075)";

function yearOf(date) {
  const match = String(date || "").match(YEAR_PATTERN);
  return match ? match[1] : "";
}

function labelOf(item, index) {
  return yearOf(item.date) || `Tonggak ${index + 1}`;
}

function ArchiveFallback({ item }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
      style={{
        background:
          "linear-gradient(140deg, #f7f7f8 0%, #efeff1 55%, #fafafc 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(29, 29, 31, 0.10) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#d2d2d7] text-[#b4b4b9] sm:h-24 sm:w-24">
        <GraduationCapIcon className="h-9 w-9 sm:h-10 sm:w-10" />
      </span>

      <div className="relative">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-[#86868b]">
          Arsip Dokumentasi
        </p>
        {item.badge ? (
          <p className="mt-2 text-[13px] font-medium tracking-[-0.01em] text-[#a1a1a6]">
            {item.badge}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function HistorySlide({ item }) {
  const year = yearOf(item.date);

  return (
    <article
      data-history-slide
      className="history-slide relative flex w-full shrink-0 items-center overflow-hidden bg-white px-5 py-16 sm:px-8 sm:py-20 lg:h-full lg:w-full lg:px-8 lg:py-0"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12 xl:gap-16">
        {/* Area visual: angka tahun dekoratif di belakang foto */}
        <div className="relative">
          <span
            data-history-year
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 z-0 -translate-x-1/2 select-none whitespace-nowrap font-display text-[34vw] font-medium leading-none tracking-[-0.05em] tabular-nums lg:text-[clamp(170px,16vw,230px)]"
            style={{ color: DECOR }}
          >
            {year}
          </span>

          <figure className="relative z-10 mt-[clamp(44px,6vw,84px)] aspect-[4/3] w-full overflow-hidden rounded-[18px] border border-black/[0.06] bg-[#f5f5f7] sm:rounded-[22px] lg:rounded-[24px]">
            <div data-history-image className="absolute -inset-[3%]">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={`Dokumentasi ${item.title || item.badge || "sejarah"}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <ArchiveFallback item={item} />
              )}
            </div>
          </figure>
        </div>

        {/* Area teks */}
        <div className="relative z-10 lg:pl-2">
          <span
            data-history-reveal
            aria-hidden="true"
            className="block h-px w-10 bg-[#1d1d1f]/60"
          />

          <p
            data-history-reveal
            className="mt-7 font-display text-[clamp(42px,4.6vw,68px)] font-medium leading-none tracking-[-0.035em] tabular-nums text-[#1d1d1f]"
          >
            {year || item.date}
          </p>

          <h3
            data-history-reveal
            className="mt-4 text-[26px] font-semibold leading-[1.12] tracking-[-0.02em] text-[#1d1d1f] sm:text-[32px] lg:text-[clamp(30px,2.7vw,40px)]"
          >
            {item.title}
          </h3>

          <p
            data-history-reveal
            className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#86868b]"
          >
            <span>{item.date}</span>
            {item.badge ? (
              <>
                <span aria-hidden="true" className="text-[#d2d2d7]">
                  /
                </span>
                <span className="text-[#a1a1a6]">{item.badge}</span>
              </>
            ) : null}
          </p>

          <p
            data-history-reveal
            className="mt-5 max-w-[44ch] text-[15px] leading-[1.7] text-[#7a7a7a] sm:text-[16px] lg:text-[17px] lg:leading-[1.72]"
          >
            {item.desc}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function HistoryTimeline({ history = {} }) {
  const milestones = history.milestones || [];
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const timelineViewportRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const timelineProgressRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  const [active, setActive] = useState(0);

  const count = milestones.length;

  // Geser indikator tahun bila jumlah tonggak melebihi lebar area tersedia.
  const positionTimeline = useCallback(() => {
    const viewport = timelineViewportRef.current;
    const track = timelineTrackRef.current;
    if (!viewport || !track) return;

    const dots = track.querySelectorAll("[data-timeline-dot]");
    const dot = dots[active];
    if (!dot) return;

    const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const center = dot.offsetLeft + dot.offsetWidth / 2;
    const offset = Math.min(
      maxOffset,
      Math.max(0, center - viewport.clientWidth / 2)
    );

    gsap.to(track, {
      x: -offset,
      duration: 0.45,
      ease: "power2.out",
      overwrite: true,
    });
  }, [active]);

  useEffect(() => {
    positionTimeline();
    window.addEventListener("resize", positionTimeline);
    return () => window.removeEventListener("resize", positionTimeline);
  }, [positionTimeline]);

  useGSAP(
    () => {
      if (count < 2) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const mm = gsap.matchMedia();

      // Horizontal storytelling hanya untuk desktop/tablet lebar.
      mm.add("(min-width: 1024px)", () => {
        const stage = stageRef.current;
        const track = trackRef.current;
        if (!stage || !track) return;

        const slides = gsap.utils.toArray("[data-history-slide]", track);
        if (slides.length < 2) return;

        const total = slides.length;

        // State awal: slide pertama tampil, slide lain menunggu di kanan.
        slides.forEach((slide, index) => {
          const reveals = slide.querySelectorAll("[data-history-reveal]");
          const image = slide.querySelector("[data-history-image]");
          const year = slide.querySelector("[data-history-year]");

          if (index > 0) {
            gsap.set(reveals, { y: 40, opacity: 0 });
            if (image) {
              gsap.set(image, { clipPath: "inset(0% 0% 0% 100%)" });
            }
          }
          if (image) gsap.set(image, { xPercent: -2, force3D: true });
          if (year) gsap.set(year, { xPercent: 3 });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () =>
              `+=${Math.max(620, window.innerHeight * 0.92) * (total - 1)}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = Math.round(self.progress * (total - 1));
              setActive((prev) => (prev === next ? prev : next));

              // Isi garis progres timeline secara kontinu mengikuti scroll.
              if (timelineProgressRef.current) {
                timelineProgressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });

        scrollTriggerRef.current = timeline.scrollTrigger;

        // 1. Gerak horizontal seluruh track.
        timeline.to(
          track,
          { xPercent: -100 * (total - 1), duration: total - 1 },
          0
        );

        // 2. Parallax foto + angka tahun (kecepatan berbeda).
        //    Jendela gerak dibatasi ke rentang scroll [0, total - 1] agar tidak
        //    ada posisi negatif yang menggeser titik nol timeline.
        slides.forEach((slide, index) => {
          const image = slide.querySelector("[data-history-image]");
          const year = slide.querySelector("[data-history-year]");

          const windowStart = Math.max(0, index - 1);
          const windowEnd = Math.min(total - 1, index + 1);
          const span = Math.max(0.001, windowEnd - windowStart);
          const fullStart = index - 1;
          const startRatio = (windowStart - fullStart) / 2;
          const endRatio = (windowEnd - fullStart) / 2;

          if (image) {
            timeline.fromTo(
              image,
              { xPercent: -2 + startRatio * 4 },
              { xPercent: -2 + endRatio * 4, duration: span },
              windowStart
            );
          }

          if (year) {
            timeline.fromTo(
              year,
              { xPercent: 3 - startRatio * 6 },
              { xPercent: 3 - endRatio * 6, duration: span },
              windowStart
            );
          }
        });

        // 3. Clip-path reveal foto saat slide masuk.
        for (let i = 1; i < total; i += 1) {
          const image = slides[i].querySelector("[data-history-image]");
          if (!image) continue;

          timeline.fromTo(
            image,
            { clipPath: "inset(0% 0% 0% 100%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.55,
              ease: "power2.out",
            },
            i - 0.6
          );
        }

        // 4. Teks keluar/masuk dengan stagger saat pergantian slide.
        for (let i = 1; i < total; i += 1) {
          const at = i - 1;
          const incoming = slides[i].querySelectorAll("[data-history-reveal]");
          const outgoing = slides[i - 1].querySelectorAll(
            "[data-history-reveal]"
          );

          if (outgoing.length) {
            timeline.to(
              outgoing,
              {
                y: -20,
                opacity: 0,
                duration: 0.25,
                stagger: 0.025,
                ease: "power1.in",
              },
              at + 0.05
            );
          }

          if (incoming.length) {
            timeline.fromTo(
              incoming,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.45,
                stagger: 0.055,
                ease: "power2.out",
              },
              at + 0.28
            );
          }
        }

        return () => {
          scrollTriggerRef.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [count] }
  );

  return (
    <section
      ref={sectionRef}
      id="linimasa"
      className="relative bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        {/* Header */}
        <div className="mb-10 max-w-2xl lg:mb-12">
          <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">
            Sejarah Berdiri
          </span>
          <h1 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#1d1d1f] sm:text-[40px] lg:text-[48px]">
            Awal Pendirian &amp; Latar Belakang
          </h1>
          <p className="mt-4 text-[17px] leading-[1.47] text-[#7a7a7a]">
            Berawal dari cita-cita luhur melahirkan generasi Qur&apos;ani yang
            cerdas dan berakhlak mulia di Kediri.
          </p>
        </div>
      </div>

      {/* Stage horizontal */}
      {count ? (
        <div
          ref={stageRef}
          role="region"
          aria-label="Linimasa sejarah SD Plus An-Nur"
          className="history-stage relative w-full overflow-hidden bg-white lg:flex lg:h-[100svh] lg:flex-col"
        >
          <div
            ref={trackRef}
            className="history-track flex w-full flex-col lg:min-h-0 lg:flex-1 lg:flex-row lg:will-change-transform"
          >
            {milestones.map((item, index) => (
              <HistorySlide
                key={`${item.date}-${index}`}
                item={item}
                index={index}
              />
            ))}
          </div>

          {/* Timeline indikator — bukan kontrol navigasi */}
          <div className="history-controls relative z-20 hidden shrink-0 lg:block">
            <div className="mx-auto max-w-6xl px-4 pb-9 pt-2 sm:px-6 lg:px-8">
              <div
                ref={timelineViewportRef}
                className="relative overflow-hidden"
              >
                <div
                  ref={timelineTrackRef}
                  className="relative flex w-full items-start"
                  style={{ minWidth: `${Math.max(0, count * 150)}px` }}
                >
                  {/* Garis dasar */}
                  <span
                    aria-hidden="true"
                    className="absolute top-[38px] h-px bg-[#e0e0e0]"
                    style={{
                      left: `${50 / count}%`,
                      right: `${50 / count}%`,
                    }}
                  />

                  {/* Garis progres */}
                  <span
                    aria-hidden="true"
                    className="absolute top-[38px] h-px overflow-hidden"
                    style={{
                      left: `${50 / count}%`,
                      right: `${50 / count}%`,
                    }}
                  >
                    <span
                      ref={timelineProgressRef}
                      className="block h-px w-full origin-left bg-[#1d1d1f]"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>

                  <ol
                    aria-label="Indikator perjalanan sejarah"
                    className="relative flex w-full items-start"
                  >
                    {milestones.map((item, index) => {
                      const isActive = index === active;

                      return (
                        <li
                          key={`timeline-${item.date}-${index}`}
                          data-timeline-dot
                          aria-current={isActive ? "step" : undefined}
                          className="flex min-w-0 flex-1 flex-col items-center"
                        >
                          <span
                            className={`h-5 text-[12px] leading-5 tabular-nums tracking-[0.01em] transition-colors duration-500 ${
                              isActive
                                ? "font-medium text-[#1d1d1f]"
                                : "font-normal text-[#a1a1a6]"
                            }`}
                          >
                            {labelOf(item, index)}
                          </span>

                          <span
                            aria-hidden="true"
                            className="relative mt-3 flex h-3 w-3 items-center justify-center"
                          >
                            <span
                              className={`absolute rounded-full border transition-all duration-500 ${
                                isActive
                                  ? "h-3 w-3 border-[#d2d2d7]"
                                  : "h-0 w-0 border-transparent"
                              }`}
                            />
                            <span
                              className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                                isActive ? "bg-[#1d1d1f]" : "bg-[#d2d2d7]"
                              }`}
                            />
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>

              <p className="sr-only" aria-live="polite">
                {milestones[active]
                  ? `Peristiwa ${active + 1} dari ${count}: ${
                      labelOf(milestones[active], active)
                    } ${milestones[active].title}`
                  : ""}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ApiState empty />
        </div>
      )}
    </section>
  );
}
