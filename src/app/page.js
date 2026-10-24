import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import ProfileHighlights from "@/components/organisms/ProfileHighlights";
import CurriculumOverview from "@/components/organisms/CurriculumOverview";
import TeachersShowcase from "@/components/organisms/TeachersShowcase";
import AchievementsShowcase from "@/components/organisms/AchievementsShowcase";
import CTASection from "@/components/organisms/CTASection";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { BookOpenIcon, AwardIcon, UsersIcon, ShieldCheckIcon, SparklesIcon, MapPinIcon } from "@/components/atoms/Icons";

export const metadata = {
  title: "SD Plus An-Nur | Sekolah Dasar Swasta Islam Unggulan",
  description:
    "Situs resmi SD Plus An-Nur (Sekolah Dasar Swasta). Menerapkan Kurikulum SD Merdeka, program Tahfidz Al-Qur'an, dan pembiasaan adab islami dalam lingkungan belajar yang ramah anak.",
};

export default function HomePage() {
  return (
    <MainLayout>
      {/* ========================================================
          TILE 1 (Light Hero): Pure White Canvas
          ======================================================== */}
      <HeroTile
        variant="white"
        eyebrow="Sekolah Dasar Swasta Islam Unggulan"
        title="SD Plus An-Nur. Cerdas, Berakhlak, Berkarakter."
        subtitle="Menerapkan Kurikulum SD Merdeka yang dipadukan dengan pembiasaan adab islami, tahfidzul qur'an, dan penguatan literasi sains dalam 13 rombongan belajar yang kondusif."
        primaryCtaText="Pendaftaran Siswa Baru (PPDB)"
        primaryCtaHref="/kontak"
        secondaryCtaText="Pelajari Kurikulum SD Merdeka"
        secondaryCtaHref="/kurikulum"
      >
        {/* Apple-grade product pedestal card resting on the surface */}
        <div className="w-full max-w-4xl bg-[#f5f5f7] border border-[#e0e0e0] rounded-3xl p-6 sm:p-10 lg:p-12 apple-product-shadow text-left">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#e0e0e0]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="primary" size="sm">
                  Status: SD Swasta
                </Badge>
                <Badge variant="emerald" size="sm">
                  Terakreditasi A
                </Badge>
                <Badge variant="neutral" size="sm">
                  Kurikulum SD Merdeka
                </Badge>
              </div>
              <h3 className="text-[24px] sm:text-[30px] font-semibold text-[#1d1d1f] tracking-tight">
                Pondasi Karakter &amp; Kemandirian Sejak Dini
              </h3>
              <p className="text-[15px] sm:text-[17px] text-[#7a7a7a] mt-1 max-w-xl">
                Membimbing 398 siswa putra dan putri dengan dedikasi 13 tenaga pendidik profesional dalam 13 rombongan belajar ramah anak.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-start md:items-end">
              <span className="text-[36px] font-bold text-[#0066cc]">398</span>
              <span className="text-[13px] text-[#7a7a7a]">
                Peserta Didik Aktif
              </span>
            </div>
          </div>

          {/* 3 Pillars highlight row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e0e0e0] flex items-center justify-center text-[#0066cc] shrink-0">
                <BookOpenIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-[#1d1d1f] mb-1">
                  Kurikulum SD Merdeka
                </h4>
                <p className="text-[13px] text-[#7a7a7a] leading-relaxed">
                  Penyelenggaraan Pagi / 6 hari dengan fokus literasi, numerasi, dan projek karakter P5.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e0e0e0] flex items-center justify-center text-[#0066cc] shrink-0">
                <AwardIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-[#1d1d1f] mb-1">
                  Tahfidz &amp; Karakter Plus
                </h4>
                <p className="text-[13px] text-[#7a7a7a] leading-relaxed">
                  Target hafalan Juz 30, shalat dhuha dan zhuhur berjamaah, serta adab harian islami.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e0e0e0] flex items-center justify-center text-[#0066cc] shrink-0">
                <UsersIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-[#1d1d1f] mb-1">
                  13 Tenaga Pendidik
                </h4>
                <p className="text-[13px] text-[#7a7a7a] leading-relaxed">
                  Guru kelas dan guru mata pelajaran berkompeten yang mendampingi siswa dengan penuh kasih sayang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </HeroTile>

      {/* ========================================================
          TILE 2 (Dark Section Tile 1: #272729): Tahfidz & Keislaman
          ======================================================== */}
      <HeroTile
        variant="dark"
        theme="dark"
        eyebrow="Program Unggulan Plus"
        title="Tahfidzul Qur'an &amp; Pembiasaan Ibadah."
        subtitle="Membina generasi yang akrab dengan Al-Qur'an sejak usia dasar melalui bimbingan tahsin tartil dan hafalan surat-surat Juz 30."
        primaryCtaText="Pelajari Program Tahfidz"
        primaryCtaHref="/kurikulum#pilar"
        secondaryCtaText="Prestasi Siswa"
        secondaryCtaHref="/prestasi"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full text-left">
          <div className="bg-[#2a2a2c] border border-[#3a3a3c] rounded-2xl p-6">
            <span className="text-[12px] font-bold text-[#2997ff] uppercase tracking-wider block mb-2">
              Metode Tartil &amp; Ramah Anak
            </span>
            <h4 className="text-[18px] font-semibold text-white mb-2">
              Bimbingan Sabar &amp; Menyenangkan
            </h4>
            <p className="text-[14px] text-[#cccccc] leading-relaxed">
              Anak-anak dibimbing melafalkan makharijul huruf dengan metode visual, tartil, dan pengulangan berkala yang membahagiakan.
            </p>
          </div>

          <div className="bg-[#2a2a2c] border border-[#3a3a3c] rounded-2xl p-6">
            <span className="text-[12px] font-bold text-[#2997ff] uppercase tracking-wider block mb-2">
              Target Bertahap
            </span>
            <h4 className="text-[18px] font-semibold text-white mb-2">
              Hafalan Juz 30 Tuntas
            </h4>
            <p className="text-[14px] text-[#cccccc] leading-relaxed">
              Target hafalan berjenjang mulai dari surat-surat pendek di kelas 1 hingga tuntas Juz 30 pada kelas 6.
            </p>
          </div>

          <div className="bg-[#2a2a2c] border border-[#3a3a3c] rounded-2xl p-6">
            <span className="text-[12px] font-bold text-[#2997ff] uppercase tracking-wider block mb-2">
              Amaliah Ibadah
            </span>
            <h4 className="text-[18px] font-semibold text-white mb-2">
              Shalat Dhuha &amp; Zhuhur
            </h4>
            <p className="text-[14px] text-[#cccccc] leading-relaxed">
              Praktik wudhu tertib dan shalat berjamaah setiap hari membiasakan anak cinta masjid dan disiplin waktu.
            </p>
          </div>
        </div>
      </HeroTile>

      {/* ========================================================
          TILE 3 (Parchment Section #f5f5f7): Statistik & Profil Sekolah
          ======================================================== */}
      <ProfileHighlights showAll={false} />

      {/* ========================================================
          TILE 4 (White Section): Kurikulum SD Merdeka Overview
          ======================================================== */}
      <CurriculumOverview />

      {/* ========================================================
          TILE 5 (Parchment Section #f5f5f7): Dewan Guru (13 Tenaga Pendidik)
          ======================================================== */}
      <TeachersShowcase initialLimit={6} />

      {/* ========================================================
          TILE 6 (White Section): Prestasi Siswa Terkini
          ======================================================== */}
      <AchievementsShowcase initialLimit={6} />

      {/* ========================================================
          TILE 7 (Dark Section #272729): CTA PPDB
          ======================================================== */}
      <CTASection
        theme="dark"
        eyebrow="Penerimaan Peserta Didik Baru (PPDB) TA 2026/2027"
        title="Daftarkan Putra-Putri Anda di SD Plus An-Nur."
        description="Mari bersama-sama membimbing ananda meraih masa depan cemerlang, beriman, dan berakhlak mulia di Sekolah Dasar Swasta Islam terpercaya."
        primaryText="Isi Formulir Pendaftaran (PPDB)"
        primaryHref="/kontak"
        secondaryText="Hubungi WhatsApp Kami"
        secondaryHref="/kontak"
      />
    </MainLayout>
  );
}
