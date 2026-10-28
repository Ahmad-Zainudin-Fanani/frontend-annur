"use client";

/**
 * VisionMissionPrincipal — Arah Pendidikan & Kepemimpinan
 * Menyajikan narasi terpadu:
 * 1. Visi & Misi Sekolah (Tipografi editorial, bukan sekadar kartu generik)
 * 2. Pemimpin Sekolah (Kepala sekolah resmi, foto resmi, jabatan, pesan pimpinan)
 *
 * GSAP Animations:
 * - SplitText pada heading section
 * - ScrollTrigger stagger pada pilar visi & butir-butir misi
 * - Parallax / floating entrance pada kartu pimpinan
 */

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ease } from "@/lib/gsapConfig";
import ApiState from "@/components/atoms/ApiState";
import {
  TargetIcon,
  ChevronRightIcon,
  UsersIcon,
} from "@/components/atoms/Icons";

export default function VisionMissionPrincipal({ profile, error = null }) {
  const [failedPrincipalPhoto, setFailedPrincipalPhoto] = useState(null);
  const sectionRef    = useRef(null);
  const headingRef    = useRef(null);
  const eyebrowRef    = useRef(null);
  const visionRef     = useRef(null);
  const missionListRef = useRef(null);
  const leaderCardRef = useRef(null);
  const splitRef      = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // 1. Heading SplitText animation
      if (headingRef.current) {
        try {
          splitRef.current = new SplitText(headingRef.current, {
            type: "words,lines",
            linesClass: "overflow-hidden py-0.5",
          });

          gsap.fromTo(
            splitRef.current.words,
            { yPercent: 105, opacity: 0 },
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
              duration: 0.75,
              ease: ease.enter,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
              },
            }
          );
        }
      }

      // Eyebrow reveal
      if (eyebrowRef.current) {
        gsap.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: ease.enter,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
            },
          }
        );
      }

      // 2. Vision card reveal
      if (visionRef.current) {
        gsap.fromTo(
          visionRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: ease.enter,
            scrollTrigger: {
              trigger: visionRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // 3. Stagger mission items
      if (missionListRef.current) {
        const items = missionListRef.current.querySelectorAll("[data-mission-item]");
        if (items.length) {
          gsap.fromTo(
            items,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: ease.enter,
              stagger: 0.08,
              scrollTrigger: {
                trigger: missionListRef.current,
                start: "top 85%",
              },
            }
          );
        }
      }

      // 4. Leader card reveal
      if (leaderCardRef.current) {
        gsap.fromTo(
          leaderCardRef.current,
          { opacity: 0, y: 50, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: ease.enter,
            scrollTrigger: {
              trigger: leaderCardRef.current,
              start: "top 85%",
            },
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
    { scope: sectionRef, dependencies: [profile?.name] }
  );

  if (error) return <ApiState error={error} />;
  if (!profile) return <ApiState empty />;

  const principal = profile.principal;
  const hasPrincipalPhoto = principal?.photo && failedPrincipalPhoto !== principal.photo;

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[#f5f5f7] border-b border-[#e0e0e0] text-[#1d1d1f] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <span
            ref={eyebrowRef}
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#7a7a7a] mb-3 px-3.5 py-1 rounded-full border border-[#333333]/20 bg-white"
          >
            Arah Pendidikan &amp; Kepemimpinan
          </span>
          <h2
            ref={headingRef}
            className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-[#1d1d1f] leading-[1.08] tracking-[-0.02em]"
          >
            Visi, Misi &amp; Pemimpin Sekolah
          </h2>
          <p className="mt-4 text-[17px] text-[#7a7a7a] leading-[1.47]">
            {profile.tagline ||
              "Menyelenggarakan pendidikan dasar unggul yang menyeimbangkan kecerdasan intelektual, kemandirian, dan budi pekerti Qur'ani."}
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ========================================================
              LEFT COLUMN: Visi & Misi Sekolah (Col 7)
              ======================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
            {/* 1. VISI SEKOLAH — Heroic Quote Format */}
            <article
              ref={visionRef}
              className="relative bg-white border border-[#e0e0e0] rounded-[22px] p-7 sm:p-9 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5 text-[#333333]">
                <div className="w-10 h-10 rounded-xl bg-[#333333]/10 flex items-center justify-center">
                  <TargetIcon className="w-5 h-5 text-[#333333]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7a7a7a] block">
                    Landasan Utama
                  </span>
                  <h3 className="text-[19px] sm:text-[21px] font-semibold text-[#1d1d1f]">
                    {profile.visionTitle || "Visi Sekolah"}
                  </h3>
                </div>
              </div>

              {/* Visi Text with Editorial Emphasis */}
              <blockquote className="text-[18px] sm:text-[22px] font-medium text-[#1d1d1f] leading-[1.4] tracking-tight">
                “{profile.vision || "Membentuk Generasi Cerdas, Qur'ani, Berkarakter, dan Mandiri."}”
              </blockquote>

              {profile.overview && (
                <p className="mt-4 pt-4 border-t border-[#f0f0f0] text-[15px] text-[#7a7a7a] leading-relaxed">
                  {profile.overview}
                </p>
              )}
            </article>

            {/* 2. MISI SEKOLAH — Numbered Editorial List */}
            <article className="bg-white border border-[#e0e0e0] rounded-[22px] p-7 sm:p-9 shadow-sm flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f0f0f0]">
                  <h3 className="text-[19px] sm:text-[21px] font-semibold text-[#1d1d1f] tracking-tight">
                    {profile.missionTitle || "Misi & Langkah Strategis"}
                  </h3>
                  <span className="text-[12px] font-medium text-[#7a7a7a] bg-[#f5f5f7] px-2.5 py-1 rounded-full">
                    {profile.mission?.length || 0} Pokok Misi
                  </span>
                </div>

                {profile.mission && profile.mission.length > 0 ? (
                  <ol ref={missionListRef} className="space-y-4">
                    {profile.mission.map((item, index) => (
                      <li
                        key={`${index}-${item.slice(0, 15)}`}
                        data-mission-item
                        className="flex items-start gap-3.5 group"
                      >
                        <span className="w-7 h-7 rounded-lg bg-[#f5f5f7] group-hover:bg-[#333333] group-hover:text-white transition-colors text-[13px] font-bold text-[#333333] flex items-center justify-center shrink-0 mt-0.5">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="text-[15px] sm:text-[16px] text-[#333333] leading-relaxed group-hover:text-[#1d1d1f] transition-colors">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-[14px] text-[#7a7a7a]">
                    Butir misi sekolah belum dimuat.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#f0f0f0] flex items-center justify-between text-[13px] text-[#7a7a7a]">
                <span>Terintegrasi Kurikulum Merdeka &amp; Program Tahfidz</span>
                <Link
                  href="/kurikulum"
                  className="inline-flex items-center gap-1 text-[#333333] hover:underline font-medium"
                >
                  Kurikulum <ChevronRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Pemimpin Sekolah (Col 5)
              ======================================================== */}
          <div ref={leaderCardRef} className="lg:col-span-5">
            {principal ? (
              <article className="relative h-full min-h-[500px] rounded-[22px] overflow-hidden border border-[#e0e0e0] bg-[#1d1d1f] flex flex-col justify-end shadow-sm group">
                {/* Official Leader Photo */}
                {hasPrincipalPhoto ? (
                  <Image
                    src={principal.photo}
                    alt={principal.name}
                    fill
                    unoptimized
                    className="object-cover object-top filter brightness-[0.95] group-hover:scale-102 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    onError={() => setFailedPrincipalPhoto(principal.photo)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#272729] to-[#161617] flex items-center justify-center text-white/20">
                    <UsersIcon className="w-32 h-32" />
                  </div>
                )}

                {/* Subtle gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 p-6 sm:p-7 bg-white/95 backdrop-blur-md border-t border-[#e0e0e0]">
                  <div className="flex items-center gap-2 mb-2 text-[#333333]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#333333]/10 px-2.5 py-0.5 rounded-full">
                      Pimpinan Lembaga
                    </span>
                    {principal.period && (
                      <span className="text-[12px] text-[#7a7a7a]">
                        Masa Bakti: {principal.period}
                      </span>
                    )}
                  </div>

                  <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#1d1d1f] leading-tight mb-1">
                    {principal.name}
                  </h3>
                  <p className="text-[14px] font-medium text-[#7a7a7a] mb-4">
                    {principal.role || "Kepala SD Plus An-Nur"}
                  </p>

                  {principal.bio && (
                    <blockquote className="text-[14px] text-[#555555] italic leading-relaxed mb-4 pl-3 border-l-2 border-[#333333]">
                      “{principal.bio}”
                    </blockquote>
                  )}

                  <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between">
                    <Link
                      href="/guru"
                      className="text-[13px] font-medium text-[#333333] hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>Lihat Dewan Guru</span>
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/profil/kepala-wakil"
                      className="text-[13px] text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors"
                    >
                      Profil Pimpinan →
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              /* Fallback if principal data is empty */
              <div className="h-full min-h-[400px] rounded-[22px] border border-[#e0e0e0] bg-white p-8 flex flex-col justify-center items-center text-center">
                <UsersIcon className="w-12 h-12 text-[#333333]/40 mb-3" />
                <h4 className="text-[18px] font-semibold text-[#1d1d1f] mb-1">
                  Kepemimpinan Lembaga
                </h4>
                <p className="text-[14px] text-[#7a7a7a] max-w-xs mb-4">
                  SD Plus An-Nur dikelola oleh tenaga pendidik dan pimpinan berdedikasi tinggi.
                </p>
                <Link
                  href="/guru"
                  className="text-[14px] font-medium text-[#333333] hover:underline inline-flex items-center gap-1"
                >
                  Lihat Direktori Guru &amp; Tenaga Kependidikan <ChevronRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
