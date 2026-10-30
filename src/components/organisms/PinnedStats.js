"use client";

/**
 * PinnedStats — Redesign premium.
 *
 * - Label Indonesia yang benar (bukan raw API key)
 * - Layout: 2 baris dengan icon + counter + label
 * - Latar: gradient gelap elegan dengan grid line dekoratif
 * - GSAP: counter animasi + stagger entrance per card
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ease } from "@/lib/gsapConfig";

// Mapping key API → label Indonesia + icon SVG path
const STAT_MAP = {
  teachers:          { label: "Guru & Tendik",      icon: "M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" },
  students:          { label: "Total Siswa",         icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
  male_students:     { label: "Siswa Putra",         icon: "M9.5 11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" },
  female_students:   { label: "Siswa Putri",         icon: "M9.5 11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" },
  class_groups:      { label: "Rombongan Belajar",   icon: "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" },
  classrooms:        { label: "Ruang Kelas",         icon: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" },
  library_count:     { label: "Perpustakaan",        icon: "M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" },
  lab_count:         { label: "Laboratorium",        icon: "M19.8 18.4 14 10.67V6.5l1.35-1.69c.26-.33.03-.81-.39-.81H9.04c-.42 0-.65.48-.39.81L10 6.5v4.17L4.2 18.4c-.49.66-.02 1.6.8 1.6h14c.82 0 1.29-.94.8-1.6z" },
};

function getStatEntries(statsObj) {
  if (!statsObj || typeof statsObj !== "object") return [];
  return Object.entries(statsObj)
    .map(([key, raw]) => {
      const num = parseInt(String(raw).replace(/\D/g, ""), 10) || 0;
      const suffix = String(raw).replace(/^\d+/, "") || "";
      const info = STAT_MAP[key] || { label: key, icon: null };
      return { key, label: info.label, value: num, suffix, icon: info.icon };
    })
    .filter((s) => s.value > 0); // sembunyikan yang 0
}

export default function PinnedStats({ profile }) {
  const stats = getStatEntries(profile?.stats);

  const sectionRef   = useRef(null);
  const cardRefs     = useRef([]);
  const counterRefs  = useRef([]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ── Stagger entrance kartu ──
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.65,
            ease: ease.enter,
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // ── Counter animasi ──
      if (prefersReduced) return;
      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i]?.value ?? 0;
        const obj = { val: 0 };
        gsap.fromTo(obj, { val: 0 }, {
          val: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
          onUpdate() {
            if (el) el.textContent = Math.round(obj.val).toLocaleString("id-ID");
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [stats.length] }
  );

  if (!stats.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0a0b 0%, #1a1a1c 50%, #0d0d0f 100%)" }}
    >
      {/* Dekorasi grid line */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(122,122,122,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(122,122,122,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(51,51,51,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-14">
          <span className="inline-block text-[12px] font-bold uppercase tracking-[0.2em] text-[#d2d2d7] mb-4 px-4 py-1.5 rounded-full border border-[#d2d2d7]/30 bg-[#d2d2d7]/10">
            An-Nur dalam Angka
          </span>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] font-semibold text-white leading-tight tracking-tight">
            Dedikasi yang Terukur
          </h2>
          <p className="mt-3 text-[16px] text-white/50 max-w-xl mx-auto">
            Data riil yang mencerminkan komitmen sekolah dalam mendidik generasi terbaik.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {stats.map((stat, i) => (
            <div
              key={stat.key}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="relative group rounded-2xl p-5 lg:p-6 border border-white/8 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(122,122,122,0.08) 0%, transparent 60%)" }} />

              {/* Icon */}
              {stat.icon && (
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(122,122,122,0.15)" }}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#d2d2d7]" aria-hidden="true">
                    <path d={stat.icon} />
                  </svg>
                </div>
              )}

              {/* Counter */}
              <div className="text-[36px] sm:text-[44px] lg:text-[52px] font-bold text-white leading-none tracking-tight tabular-nums">
                <span ref={(el) => { counterRefs.current[i] = el; }}>
                  {stat.value.toLocaleString("id-ID")}
                </span>
                {stat.suffix && (
                  <span className="text-[#d2d2d7] text-[0.7em]">{stat.suffix}</span>
                )}
              </div>

              {/* Label */}
              <p className="mt-2 text-[13px] font-medium text-white/55 leading-snug">
                {stat.label}
              </p>

              {/* Accent bar bawah */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
                style={{ background: "linear-gradient(90deg, #333333, #d2d2d7)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
