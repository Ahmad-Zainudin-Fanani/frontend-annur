"use client";

/**
 * VisionMissionPrincipal — Arah Pendidikan & Kepemimpinan
 * Komposisi dua kolom:
 * - Kiri (7/12): Visi (card) di atas, Misi (card) di bawah
 * - Kanan (5/12): Pemimpin Sekolah dalam satu card tinggi
 *
 * GSAP Animations:
 * - SplitText pada heading section
 * - Fade-up ScrollTrigger untuk visi, misi (stagger), dan card pimpinan
 */

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ease } from "@/lib/gsapConfig";
import ApiState from "@/components/atoms/ApiState";
import {
  ChevronRightIcon,
  UsersIcon,
  ArrowRightIcon,
} from "@/components/atoms/Icons";

export default function VisionMissionPrincipal({ profile, error = null }) {
  const [failedPrincipalPhoto, setFailedPrincipalPhoto] = useState(null);
  const sectionRef    = useRef(null);
  const headingRef    = useRef(null);
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

      // 2. Vision reveal
      if (visionRef.current) {
        gsap.fromTo(
          visionRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: ease.enter,
            scrollTrigger: {
              trigger: visionRef.current,
              start: "top 88%",
            },
          }
        );
      }

      // 3. Stagger mission items — fade-up halus, angka & narasi tampil berurutan
      if (missionListRef.current) {
        const items = missionListRef.current.querySelectorAll("[data-mission-item]");
        if (items.length) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: ease.enter,
              stagger: 0.08,
              scrollTrigger: {
                trigger: missionListRef.current,
                start: "top 90%",
              },
            }
          );
        }
      }

      // 4. Leader card reveal — fade sederhana, tanpa scale berlebihan
      if (leaderCardRef.current) {
        gsap.fromTo(
          leaderCardRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: ease.enter,
            scrollTrigger: {
              trigger: leaderCardRef.current,
              start: "top 90%",
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
  const hasPrincipalPhoto = Boolean(principal?.photo && failedPrincipalPhoto !== principal.photo);

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-18 bg-[#f5f5f7] border-b border-[#e0e0e0] text-[#1d1d1f] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ───────────────────────────────────── */}
        <div className="max-w-3xl">
          <h2
            ref={headingRef}
            className="text-[28px] sm:text-[36px] lg:text-[42px] font-semibold leading-[1.1] tracking-[-0.02em]"
          >
            Visi, Misi &amp; Pemimpin Sekolah
          </h2>
          <p className="mt-2.5 max-w-2xl text-[15px] sm:text-[16px] leading-[1.5] text-[#7a7a7a]">
            {profile.tagline ||
              "Menyelenggarakan pendidikan dasar unggul yang menyeimbangkan kecerdasan intelektual, kemandirian, dan budi pekerti Qur'ani."}
          </p>
        </div>

        {/* ── Komposisi dua kolom ──────────────────────────────── */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          {/* KIRI: Visi + Misi */}
          <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-5">
            {/* VISI */}
            <article
              ref={visionRef}
              className="rounded-[22px] border border-[#e0e0e0] bg-white p-5 sm:p-6"
            >
              <div className="pb-3 border-b border-[#e0e0e0]">
                <h3 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] text-[#86868b]">
                  {profile.visionTitle || "Visi Sekolah"}
                </h3>
              </div>
              <blockquote className="mt-3.5 text-pretty text-[17px] sm:text-[19px] lg:text-[21px] font-semibold leading-[1.35] tracking-[-0.015em] text-[#1d1d1f]">
                “{profile.vision || "Membentuk Generasi Cerdas, Qur'ani, Berkarakter, dan Mandiri."}”
              </blockquote>
            </article>

            {/* MISI */}
            <article className="flex-1 flex flex-col rounded-[22px] border border-[#e0e0e0] bg-white p-5 sm:p-6">
              <div className="pb-3 border-b border-[#e0e0e0]">
                <h3 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] text-[#86868b]">
                  {profile.missionTitle || "Misi & Langkah Strategis"}
                </h3>
              </div>

              {profile.mission && profile.mission.length > 0 ? (
                <ol ref={missionListRef} className="divide-y divide-[#e0e0e0]">
                  {profile.mission.map((item, index) => (
                    <li
                      key={`${index}-${item.slice(0, 15)}`}
                      data-mission-item
                      className="group"
                    >
                      <div className="grid grid-cols-[1.75rem_1fr] sm:grid-cols-[2rem_1fr] items-center gap-x-2.5 sm:gap-x-3 py-2.5 sm:py-3">
                        <span
                          aria-hidden="true"
                          className="select-none font-display text-[20px] sm:text-[24px] font-bold leading-none tracking-[-0.04em] tabular-nums text-[#1d1d1f] transition-colors duration-500 group-hover:text-[#424245]"
                        >
                          {index + 1}.
                        </span>
                        <p className="max-w-[58ch] text-[13.5px] sm:text-[14.5px] font-medium leading-[1.5] text-[#1d1d1f]">
                          {item}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="py-4 text-[13px] text-[#7a7a7a]">
                  Butir misi sekolah belum dimuat.
                </p>
              )}

              <div className="mt-auto flex justify-end pt-3 text-[13px] text-[#7a7a7a]">
                <Link
                  href="/kurikulum"
                  className="inline-flex items-center gap-1 font-medium text-[#1d1d1f] hover:text-[#6e6e73] transition-colors"
                >
                  Kurikulum <ChevronRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          </div>

          {/* KANAN: Pemimpin Sekolah */}
          <div className="lg:col-span-6">
            {principal ? (
              <article
                ref={leaderCardRef}
                className="relative h-full min-h-[460px] rounded-[22px] overflow-hidden border border-[#e0e0e0] bg-white flex flex-col justify-end shadow-sm group"
              >
                {/* Foto resmi pimpinan di bagian atas/latar belakang */}
                {hasPrincipalPhoto ? (
                  <Image
                    src={principal.photo}
                    alt={principal.name}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top filter brightness-[0.95] group-hover:scale-102 transition-transform duration-700"
                    onError={() => setFailedPrincipalPhoto(principal.photo)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#272729] to-[#161617] flex items-center justify-center text-white/20">
                    <UsersIcon className="w-24 h-24" />
                  </div>
                )}

                {/* Subtle gradient scrim (dibatasi agar tidak bocor ke sudut bawah kartu) */}
                <div className="absolute inset-x-0 top-0 bottom-32 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Kotak konten overlay di bagian bawah dengan warna putih solid persis visi misi */}
                <div className="relative z-10 bg-white rounded-t-[20px] rounded-b-[21px] border-t border-[#e0e0e0] p-5 sm:p-6">
                  <div>
                    <p className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] text-[#86868b]">
                      Pimpinan Lembaga
                    </p>
                    <h3 className="mt-1 text-[19px] sm:text-[21px] lg:text-[22px] font-semibold leading-tight text-[#1d1d1f] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {principal.name}
                    </h3>
                    <p className="mt-0.5 text-[14px] sm:text-[15px] font-medium text-[#7a7a7a]">
                      {principal.role || "Kepala SD Plus An-Nur"}
                    </p>

                    {principal.bio ? (
                      <blockquote className="mt-2.5 text-[13px] sm:text-[14px] leading-[1.55] text-[#555555] line-clamp-3">
                        “{principal.bio}”
                      </blockquote>
                    ) : null}
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-[#e0e0e0] flex justify-end">
                    <Link
                      href="/profil/kepala-wakil"
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1d1d1f] hover:text-[#6e6e73] transition-colors"
                    >
                      Profil Pimpinan
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <div className="h-full min-h-[320px] rounded-[22px] border border-[#e0e0e0] bg-white px-6 py-10 text-center flex flex-col items-center justify-center">
                <UsersIcon className="h-8 w-8 text-[#c7c7cc]" />
                <p className="mt-3 text-[14px] text-[#7a7a7a]">
                  Informasi pimpinan belum tersedia.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
