"use client";

/**
 * HomeGallery — Galeri Kegiatan SD Plus An-Nur
 *
 * Showcase "Vertical Pinned Stacked Cards":
 * - Section showcase memakai 100svh dan di-pin selama animasi berjalan.
 * - Kartu horizontal besar (92vw × 70–74vh) tersusun vertikal dan saling
 *   menumpuk; kartu berikutnya naik dari bawah menutupi kartu sebelumnya.
 * - Kartu yang sudah tertutup tetap di belakang, sedikit mengecil dan bergeser
 *   ke atas sehingga tepinya membentuk tumpukan bertingkat.
 * - Timeline GSAP memakai scrub, sehingga animasi reversible penuh: saat
 *   scroll naik, kartu terakhir turun dan kartu sebelumnya terbuka kembali.
 * - Jarak pin dihitung dinamis dari tinggi viewport, lalu di-refresh saat
 *   resize (invalidateOnRefresh).
 * - prefers-reduced-motion: tanpa pin/animasi; kartu tampil sebagai daftar
 *   vertikal biasa (lihat globals.css).
 * - Data & foto tetap berasal dari API galeri yang sudah ada.
 */

import Link from "next/link";
import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ScrollTrigger, ease } from "@/lib/gsapConfig";
import { ArrowUpRightIcon, CalendarIcon } from "@/components/atoms/Icons";
import ApiState from "@/components/atoms/ApiState";

const MAX_ITEMS = 6;
const STACK_SCALE_STEP = 0.03;
const MAX_VISIBLE_DEPTH = 4;
function formatGalleryDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    // Patokan waktu sekolah agar hasil server & browser selalu sama
    // (menghindari hydration mismatch saat server berzona UTC).
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function GalleryStackCard({ item, index }) {
  const date = formatGalleryDate(item.date);
  const description = (item.description || "").trim();
  const showDescription =
    description !== "" && description !== (item.title || "").trim();

  return (
    <div className="gallery-stack-layer absolute inset-0 flex items-center justify-center px-3 sm:px-5">
      <article
        data-gallery-stack-card
        aria-label={`Galeri kegiatan: ${item.title || "Dokumentasi kegiatan"}`}
        style={{ zIndex: index + 1 }}
        className="gallery-stack-card group relative h-[70svh] w-[92vw] overflow-hidden rounded-[22px] border border-black/10 bg-[#1d1d1f] shadow-[0_16px_40px_-26px_rgba(0,0,0,0.45)] will-change-transform sm:h-[72svh] sm:rounded-[26px] lg:h-[74vh] lg:rounded-[30px]"
      >
        {item.imageUrl ? (
          <img
            data-card-image
            src={item.imageUrl}
            alt={item.title || "Dokumentasi kegiatan SD Plus An-Nur"}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2a2a2c] via-[#1d1d1f] to-black text-white/30">
            <svg
              className="h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.25} />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.25} />
              <path strokeWidth={1.25} d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Lapisan gelap agar teks tetap terbaca di atas foto apa pun. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />

        {/* Komposisi konten konsisten di setiap kartu */}
        <div
          data-card-content
          className="absolute inset-x-0 bottom-0 p-6 sm:p-9 lg:p-12"
        >
          <div className="max-w-2xl">
            {date ? (
              <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/65 sm:text-[12px]">
                <CalendarIcon className="h-3.5 w-3.5" />
                {date}
              </p>
            ) : null}

            <h3 className="text-[28px] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-[38px] lg:text-[52px]">
              {item.title || "Dokumentasi kegiatan"}
            </h3>

            {showDescription ? (
              <p className="mt-3 hidden max-w-xl text-[15px] leading-[1.5] text-white/75 sm:block lg:mt-4 lg:text-[17px]">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}

export default function HomeGallery({ galleries = [], error = null }) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const eyebrowRef = useRef(null);
  const stageRef = useRef(null);
  const splitRef = useRef(null);

  const displayItems = useMemo(
    () => galleries.slice(0, MAX_ITEMS),
    [galleries]
  );

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Tanpa animasi: biarkan CSS menampilkan kartu sebagai daftar vertikal.
      if (prefersReduced) return;

      // 1. Reveal judul section
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
                start: "top 82%",
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
              duration: 0.75,
              ease: ease.enter,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 82%",
                once: true,
              },
            }
          );
        }
      }

      if (eyebrowRef.current) {
        gsap.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: ease.enter,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 84%",
              once: true,
            },
          }
        );
      }

      // 2. Vertical pinned stacked cards
      const stage = stageRef.current;
      if (stage) {
        const cards = Array.from(
          stage.querySelectorAll("[data-gallery-stack-card]")
        );

        if (cards.length) {
          const total = cards.length;

          // Muat foto lebih awal (satu layar sebelum stage) supaya decode
          // gambar tidak terjadi di tengah animasi pin dan bikin scroll patah.
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top bottom+=40%",
            once: true,
            onEnter: () => {
              cards.forEach((card) => {
                const image = card.querySelector("[data-card-image]");
                if (!image) return;

                image.loading = "eager";
                if (typeof image.decode === "function") {
                  image.decode().catch(() => {});
                }
              });
            },
          });

          // State awal: kartu pertama tampil, kartu lain menunggu di bawah.
          cards.forEach((card, index) => {
            gsap.set(card, {
              yPercent: index === 0 ? 0 : 125,
              scale: 1,
              transformOrigin: "50% 50%",
              force3D: true,
            });

            // Kartu yang tertutup tidak ikut terpilih saat navigasi keyboard.
            card.inert = index !== 0;

            if (index > 0) {
              const content = card.querySelector("[data-card-content]");
              if (content) gsap.set(content, { y: 26, opacity: 0 });
            }
          });

          if (cards.length > 1) {
            let lastActive = 0;

            // Jarak scroll per kartu dihitung dari tinggi viewport agar
            // kecepatan animasi tetap proporsional di semua layar. Nilainya
            // dibuat ringkas supaya section tidak terasa "berat" saat di-scroll.
            const stepDistance = () =>
              Math.max(360, window.innerHeight * 0.68);

            const timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: () => `+=${stepDistance() * (cards.length - 1)}`,
                pin: true,
                pinSpacing: true,
                // Lenis sudah menghaluskan scroll; scrub tanpa jeda tambahan
                // membuat kartu mengikuti posisi scroll secara langsung.
                scrub: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  // Hanya kartu teratas yang boleh menerima fokus keyboard.
                  const active = Math.min(
                    total,
                    Math.round(self.progress * (total - 1)) + 1
                  );

                  if (active !== lastActive) {
                    lastActive = active;

                    cards.forEach((card, index) => {
                      card.inert = index !== active - 1;
                    });
                  }
                },
              },
            });

            for (let i = 1; i < cards.length; i += 1) {
              const at = i - 1;
              const card = cards[i];
              const content = card.querySelector("[data-card-content]");

              // Kartu baru naik dari bawah dan menutupi kartu sebelumnya.
              timeline.to(card, { yPercent: 0, duration: 1 }, at);

              if (content) {
                timeline.to(
                  content,
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.42,
                    ease: "power2.out",
                  },
                  at + 0.58
                );
              }

              // Semua kartu di belakangnya mundur sedikit ke atas agar
              // tepinya tetap terlihat sebagai tumpukan bertingkat. Kartu yang
              // sudah lebih dalam dari MAX_VISIBLE_DEPTH tidak perlu dianimasikan
              // lagi karena posisinya tidak berubah.
              for (
                let j = Math.max(0, i - MAX_VISIBLE_DEPTH);
                j < i;
                j += 1
              ) {
                const depth = Math.min(i - j, MAX_VISIBLE_DEPTH);
                const scale = 1 - depth * STACK_SCALE_STEP;
                const yPercent =
                  -((1 - scale) * 50) - 1.4 - (depth - 1) * 1.1;

                timeline.to(
                  cards[j],
                  { scale, yPercent, duration: 1 },
                  at
                );
              }
            }
          }
        }
      }

      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [displayItems.length] }
  );

  return (
    <section ref={sectionRef} className="relative bg-white pt-16 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p
              ref={eyebrowRef}
              className="mb-2 text-[15px] font-semibold tracking-[-0.02em] text-[#86868b] sm:text-[16px]"
            >
              Galeri Kegiatan
            </p>
            <h2
              ref={headingRef}
              className="text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#1d1d1f] sm:text-[40px] lg:text-[48px]"
            >
              Momen Berkesan &amp; Dokumentasi An-Nur
            </h2>
            <p className="mt-4 text-[17px] leading-[1.47] text-[#7a7a7a]">
              Merekam dinamika proses pembelajaran, kreativitas santri, perayaan
              hari besar, dan kegiatan ekstrakurikuler unggulan.
            </p>
          </div>

          <Link
            href="/galeri"
            className="group inline-flex shrink-0 items-center gap-2 text-[14px] font-medium text-[#333333] transition-colors hover:text-[#1d1d1f] apple-press-action"
          >
            <span>Lihat Semua Galeri</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#333333]/30 text-xs transition-colors group-hover:border-[#1d1d1f]/50">
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* Showcase */}
      {error ? (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <ApiState error={error} />
        </div>
      ) : displayItems.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <ApiState empty />
        </div>
      ) : (
        <div
          ref={stageRef}
          role="region"
          aria-label="Galeri kegiatan SD Plus An-Nur"
          className="gallery-stack relative h-[100svh] w-full overflow-hidden bg-white"
        >
          <div className="gallery-stack-inner relative h-full w-full">
            {displayItems.map((item, index) => (
              <GalleryStackCard
                key={item.id}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
