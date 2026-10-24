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
} from "@/components/atoms/Icons";

const programs = [
  {
    id: "tahfidz",
    title: "Tahfidzul Qur'an & Pembiasaan Ibadah",
    category: "Program Unggulan Plus",
    desc: "Bimbingan tahsin tartil dan target hafalan Juz 30 dengan metode ramah anak, dipadukan pembiasaan shalat Dhuha dan Zhuhur berjamaah setiap hari.",
    icon: AwardIcon,
    href: "/kurikulum#pilar",
  },
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
  return (
    <section className="py-20 lg:py-24 bg-white border-b border-[#f0f0f0]">
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
              <Button
                href="/kurikulum"
                variant="secondary-pill"
                size="md"
              >
                Semua Kurikulum
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Utility Cards Grid strictly matching DESIGN.md store-utility-card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {programs.map((prog, idx) => {
            const Icon = prog.icon;
            return (
              <ScrollReveal
                key={prog.id}
                animation="fade-up"
                delay={idx * 80}
                duration={650}
                className="flex"
              >
                <div className="w-full bg-white border border-[#e0e0e0] rounded-[18px] p-6 flex flex-col justify-between transition-colors duration-150">
                  <div>
                    {/* Quiet Icon Pedestal */}
                    <div className="w-11 h-11 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-[#0066cc] mb-5">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[12px] font-medium text-[#7a7a7a] uppercase tracking-wider block mb-1.5">
                      {prog.category}
                    </span>

                    <h3 className="text-[17px] font-semibold text-[#1d1d1f] leading-[1.24] tracking-[-0.374px] mb-2.5">
                      {prog.title}
                    </h3>

                    <p className="text-[15px] text-[#7a7a7a] leading-[1.47] tracking-[-0.2px] mb-6">
                      {prog.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#f0f0f0]">
                    <Link
                      href={prog.href}
                      className="text-[14px] text-[#0066cc] hover:underline inline-flex items-center gap-1 font-normal"
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
    </section>
  );
}
