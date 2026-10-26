"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import ScrollReveal from "@/components/atoms/ScrollReveal";
import {
  BookOpenIcon,
  AwardIcon,
  SparklesIcon,
  UsersIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
} from "@/components/atoms/Icons";

const featuredProgram = {
  id: "tahfidz",
  title: "Tahfidzul Qur'an & Pembiasaan Ibadah",
  category: "Pilar Utama Keunggulan",
  desc: "Bimbingan tahsin tartil dan target tuntas hafalan Juz 30 dengan metode ramah anak, dipadukan pembiasaan shalat Dhuha dan Zhuhur berjamaah setiap hari untuk menumbuhkan adab islami sejak dini.",
  highlights: [
    "Target hafalan Juz 30 & surat-surat pilihan",
    "Bimbingan makharijul huruf tartil bersanad",
    "Shalat Dhuha & Zhuhur berjamaah harian di musholla",
  ],
  icon: AwardIcon,
  href: "/kurikulum#pilar",
};

const secondaryPrograms = [
  {
    id: "kurikulum-merdeka",
    title: "Kurikulum SD Merdeka & Literasi Sains",
    category: "Standar Kemendikbudristek",
    desc: "Pembelajaran intrakurikuler berdiferensiasi yang memfasilitasi anak mengeksplorasi konsep sesuai minat bakat serta penguatan literasi dan numerasi esensial.",
    icon: BookOpenIcon,
    href: "/kurikulum",
  },
  {
    id: "p5-karakter",
    title: "Projek Karakter Profil Pelajar Pancasila",
    category: "Karakter & Kebangsaan",
    desc: "Kegiatan kokurikuler berbasis karya nyata untuk menumbuhkan jiwa mandiri, nalar kritis, empati sosial, gotong royong, dan kewirausahaan cilik.",
    icon: SparklesIcon,
    href: "/kurikulum",
  },
  {
    id: "pendampingan-guru",
    title: "13 Rombel & Pembinaan Ramah Anak",
    category: "Layanan Pembelajaran",
    desc: "Didampingi 13 tenaga pendidik berdedikasi yang membimbing 398 siswa putra dan putri dengan pendekatan personal, aman, dan penuh kasih sayang.",
    icon: UsersIcon,
    href: "/profil",
  },
];

export default function FeaturedPrograms() {
  const FeaturedIcon = featuredProgram.icon;

  return (
    <section className="py-20 lg:py-24 bg-[#f5f5f7] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="max-w-2xl">
              <span className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.2px] text-[#0066cc] mb-3 block select-none">
                Kurikulum &amp; Keunggulan
              </span>
              <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-[#1d1d1f] leading-[1.1] tracking-normal">
                Program Unggulan SD Plus An-Nur
              </h2>
              <p className="mt-3 text-[17px] text-[#7a7a7a] leading-[1.47] tracking-[-0.374px]">
                Memadukan kurikulum nasional SD Merdeka dengan nilai-nilai adab islami untuk menumbuhkan potensi intelektual, spiritual, dan emosional anak.
              </p>
            </div>

            <div className="shrink-0">
              <Button href="/kurikulum" variant="secondary-pill" size="md">
                Semua Kurikulum
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Bento Grid: 1 Large Featured Card (Left) + 3 Smaller Stacked Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* ========================================================
              LEFT COLUMN: Featured Card (Span 7 on Desktop)
              ======================================================== */}
          <ScrollReveal
            animation="fade-up"
            duration={650}
            className="lg:col-span-7 flex"
          >
            <div className="w-full bg-white border border-[#e0e0e0] rounded-[24px] p-8 sm:p-10 flex flex-col justify-between apple-product-shadow transition-all duration-200 hover:border-[#1d1d1f]">
              <div>
                {/* Minimalist Outline Icon with Blue Accent Pedestal */}
                <div className="w-14 h-14 rounded-2xl bg-[#0066cc]/10 border border-[#0066cc]/20 flex items-center justify-center text-[#0066cc] mb-6">
                  <FeaturedIcon className="w-7 h-7" />
                </div>

                <span className="text-[12px] font-semibold text-[#0066cc] uppercase tracking-wider block mb-2">
                  {featuredProgram.category}
                </span>

                <h3 className="text-[24px] sm:text-[30px] font-bold text-[#1d1d1f] leading-[1.2] tracking-tight mb-4">
                  {featuredProgram.title}
                </h3>

                <p className="text-[16px] sm:text-[17px] text-[#555555] leading-[1.6] tracking-[-0.2px] mb-8">
                  {featuredProgram.desc}
                </p>

                {/* Highlight Checkpoints */}
                <div className="space-y-3 bg-[#fafafc] border border-[#e0e0e0] rounded-2xl p-5 mb-6">
                  <span className="text-[12px] font-semibold text-[#7a7a7a] uppercase tracking-wide block">
                    Cakupan Program:
                  </span>
                  {featuredProgram.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-[14px] text-[#1d1d1f]">
                      <div className="w-5 h-5 rounded-full bg-[#0066cc]/15 text-[#0066cc] flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold">✓</span>
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#f0f0f0] flex items-center justify-between">
                <span className="text-[13px] text-[#7a7a7a]">
                  Program Wajib Seluruh Santri
                </span>
                <Link
                  href={featuredProgram.href}
                  className="text-[15px] font-medium text-[#0066cc] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Pelajari lebih lanjut</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* ========================================================
              RIGHT COLUMN: 3 Supporting Cards (Span 5 on Desktop)
              ======================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {secondaryPrograms.map((prog, idx) => {
              const Icon = prog.icon;
              return (
                <ScrollReveal
                  key={prog.id}
                  animation="fade-up"
                  delay={100 * (idx + 1)}
                  duration={650}
                  className="flex-1 flex"
                >
                  <div className="w-full bg-white border border-[#e0e0e0] rounded-[22px] p-6 sm:p-7 flex flex-col justify-between apple-product-shadow transition-all duration-200 hover:border-[#1d1d1f]">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-[#0066cc]/10 border border-[#0066cc]/20 flex items-center justify-center text-[#0066cc] shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-[#7a7a7a] uppercase tracking-wide bg-[#f5f5f7] px-2.5 py-1 rounded-full">
                          {prog.category}
                        </span>
                      </div>

                      <h4 className="text-[18px] sm:text-[19px] font-bold text-[#1d1d1f] leading-snug mb-2">
                        {prog.title}
                      </h4>

                      <p className="text-[14px] text-[#555555] leading-relaxed mb-4 line-clamp-3">
                        {prog.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#f0f0f0]">
                      <Link
                        href={prog.href}
                        className="text-[13px] font-medium text-[#0066cc] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Pelajari lebih lanjut</span>
                        <ChevronRightIcon className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
