"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TargetIcon, ListCheckIcon, ChevronRightIcon } from "@/components/atoms/Icons";
import ScrollReveal from "@/components/atoms/ScrollReveal";
import { profileData } from "@/data/profileData";

export default function VisionMissionPrincipal() {
  const principal = profileData.leadership?.[0] || {
    name: "Ustadz H. Ahmad Fauzi, S.Pd.I., M.Pd.",
    role: "Kepala Sekolah SD Plus An-Nur",
  };

  return (
    <section className="py-20 lg:py-24 bg-[#f5f5f7] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.2px] text-[#0066cc] mb-3 block select-none">
              Arah Pendidikan &amp; Kepemimpinan
            </span>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-[#1d1d1f] leading-[1.1] tracking-normal">
              Visi, Misi &amp; Komitmen Pemimpin Sekolah
            </h2>
            <p className="mt-3 text-[17px] text-[#7a7a7a] leading-[1.47] tracking-[-0.374px]">
              Pondasi dasar dan haluan strategis SD Plus An-Nur dalam membentuk generasi masa depan yang kokoh dalam iman, unggul dalam nalar, dan luhur dalam budi pekerti.
            </p>
          </div>
        </ScrollReveal>

        {/* 2-Column Responsive Grid matching user concept */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ==========================================
              LEFT COLUMN: Visi & Misi Box Cards
              ========================================== */}
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
            {/* Box 1: VISI */}
            <ScrollReveal animation="fade-up" delay={80} duration={650} className="flex-1 flex">
              <div className="w-full bg-white border border-[#e0e0e0] rounded-[18px] p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-[#0066cc] shrink-0">
                      <TargetIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#0066cc] uppercase tracking-wider block">
                        Haluan Utama
                      </span>
                      <h3 className="text-[21px] font-semibold text-[#1d1d1f] tracking-tight">
                        Visi
                      </h3>
                    </div>
                  </div>

                  <blockquote className="text-[19px] sm:text-[21px] font-semibold text-[#1d1d1f] leading-snug tracking-[-0.28px]">
                    &ldquo;TERWUJUDNYA PESERTA DIDIK YANG BERIMAN, BERAKHLAKUL KARIMAH, CERDAS, BERKARAKTER, DAN BERWAWASAN MASA DEPAN.&rdquo;
                  </blockquote>
                </div>

                <p className="text-[15px] text-[#7a7a7a] mt-4 leading-relaxed">
                  Mempersiapkan anak-anak menjadi insan bertaqwa yang mandiri, adaptif terhadap perkembangan zaman, serta mampu memberi manfaat bagi umat dan bangsa.
                </p>
              </div>
            </ScrollReveal>

            {/* Box 2: MISI */}
            <ScrollReveal animation="fade-up" delay={160} duration={650} className="flex-1 flex">
              <div className="w-full bg-white border border-[#e0e0e0] rounded-[18px] p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-[#0066cc] shrink-0">
                      <ListCheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#0066cc] uppercase tracking-wider block">
                        Langkah Konkret
                      </span>
                      <h3 className="text-[21px] font-semibold text-[#1d1d1f] tracking-tight">
                        Misi
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-3 text-[15px] text-[#333333] leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] shrink-0 mt-2" />
                      <span>
                        Mewujudkan peserta didik yang beriman, bertaqwa kepada Allah SWT, dan beradab luhur dalam keseharian.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] shrink-0 mt-2" />
                      <span>
                        Membimbing hafalan Al-Qur&apos;an (Tahfidz Juz 30) dengan metode tartil, pembiasaan shalat berjamaah, dan dzikir.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] shrink-0 mt-2" />
                      <span>
                        Menyelenggarakan pembelajaran Kurikulum SD Merdeka yang merangsang daya nalar kritis, literasi, numerasi, dan kreativitas.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] shrink-0 mt-2" />
                      <span>
                        Mengembangkan potensi minat, bakat, serta jiwa kepemimpinan siswa melalui projek profil pelajar Pancasila (P5) dan ekstrakurikuler.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] shrink-0 mt-2" />
                      <span>
                        Menciptakan lingkungan madrasah/sekolah yang ramah anak, berwawasan lingkungan, nyaman, dan berdaya saing tinggi.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ==========================================
              RIGHT COLUMN: Box Kepala Sekolah yang Sedang Menjabat
              ========================================== */}
          <div className="lg:col-span-5 flex flex-col">
            <ScrollReveal animation="fade-up" delay={200} duration={650} className="h-full flex flex-col">
              <div className="relative rounded-[18px] overflow-hidden border border-[#e0e0e0] bg-[#1d1d1f] apple-product-shadow flex flex-col justify-end min-h-[480px] sm:min-h-[540px] lg:h-full">
                {/* Principal Photo */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src="/images/kepala-sekolah.jpg"
                    alt={`Kepala Sekolah ${principal.name}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                  {/* Subtle dark vignette strictly for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Minimal Status indicator top left */}
                <div className="absolute top-5 left-5 z-20">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[12px] font-medium tracking-wide border border-white/20">
                    Kepala Sekolah
                  </span>
                </div>

                {/* Clean caption card at bottom */}
                <div className="relative z-20 p-6 bg-white/95 backdrop-blur-md rounded-b-[18px] border-t border-[#e0e0e0] text-left">
                  <p className="text-[14px] text-[#555555] italic leading-relaxed mb-3">
                    &ldquo;Selamat datang di laman resmi SD Plus An-Nur. Kami berikhtiar mendampingi tumbuh kembang ananda dengan keteladanan dan adab qur&apos;ani.&rdquo;
                  </p>

                  <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-[17px] font-semibold text-[#1d1d1f] leading-snug">
                        {principal.name}
                      </h4>
                      <p className="text-[13px] text-[#7a7a7a]">
                        Kepala Sekolah SD Plus An-Nur
                      </p>
                    </div>
                    <Link
                      href="/guru"
                      className="text-[14px] text-[#0066cc] hover:underline inline-flex items-center gap-1 font-normal shrink-0"
                    >
                      <span>Dewan Guru</span>
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
