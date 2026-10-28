import React from "react";
import Link from "next/link";
import Image from "next/image";
import MainLayout from "@/components/templates/MainLayout";
import { publicApi } from "@/data/api";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@/components/atoms/Icons";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const achievement = await publicApi.achievement(id);

  if (!achievement) {
    return {
      title: "Prestasi Tidak Ditemukan | SD Plus An-Nur",
      description: "Data prestasi siswa tidak ditemukan atau telah diperbarui.",
    };
  }

  return {
    title: `${achievement.studentName} - ${achievement.title} | SD Plus An-Nur`,
    description:
      achievement.description ||
      `Prestasi ${achievement.studentName} dalam ajang ${achievement.title}.`,
  };
}

export const instant = false;

export default async function AchievementDetailPage({ params }) {
  const { id } = await params;
  let achievement = null;
  let allAchievements = [];
  let error = null;

  try {
    achievement = await publicApi.achievement(id);
    allAchievements = await publicApi.achievements({ status: "published" });
  } catch (err) {
    error = err.message;
  }

  // Not found fallback
  if (!achievement) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center text-[#7a7a7a] mb-5">
            <SearchIcon className="w-8 h-8 text-[#7a7a7a]" />
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
            Prestasi Tidak Ditemukan
          </h1>
          <p className="text-[16px] text-[#7a7a7a] max-w-md mb-8">
            Data prestasi siswa yang Anda cari tidak tersedia atau rute tautan telah diperbarui.
          </p>
          <Link
            href="/prestasi"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0066cc] text-white text-[15px] font-medium hover:bg-[#0071e3] transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Kembali ke Galeri Prestasi</span>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Rekomendasi prestasi lainnya (kecuali item ini)
  const relatedAchievements = allAchievements
    .filter((item) => String(item.id) !== String(achievement.id))
    .slice(0, 2);

  // Ambil predikat juara jika ada dari judul (misal "Juara 1", "Juara 2")
  const awardMatch = achievement.title.match(/Juara\s+\d+|Medali\s+\w+/i);
  const awardLabel = awardMatch ? awardMatch[0] : "Pemenang Penghargaan";

  return (
    <MainLayout>
      <div className="w-full bg-white text-[#1d1d1f]">
        {/* Navigation Breadcrumb Bar */}
        <div className="border-b border-[#e0e0e0] bg-[#fafafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/prestasi"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0066cc] hover:text-[#1d1d1f] transition-colors group"
            >
              <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali ke Galeri Prestasi</span>
            </Link>
          </div>
        </div>

        {/* Main Editorial Detail Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* ========================================================
                  LEFT COLUMN: Visual Frame (Foto Siswa / Medallion)
                  ======================================================== */}
              <div className="lg:col-span-5">
                <div className="relative w-full aspect-[4/3] sm:aspect-[1/1] rounded-[24px] overflow-hidden bg-[#f0f0f2] border border-[#e0e0e0] shadow-md">
                  {achievement.imageUrl ? (
                    <Image
                      src={achievement.imageUrl}
                      alt={achievement.studentName}
                      fill
                      unoptimized
                      priority
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                  ) : (
                    /* Fallback Visual Elegan saat foto belum diunggah */
                    <div className="absolute inset-0 bg-gradient-to-br from-[#272729] via-[#1d1d1f] to-[#161617] p-8 sm:p-10 flex flex-col justify-between text-white">
                      {/* Watermark radial */}
                      <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 25px 25px, white 2%, transparent 0%)",
                          backgroundSize: "28px 28px",
                        }}
                      />

                      {/* Top Badges */}
                      <div className="relative z-10 flex items-center justify-between text-white/50 text-[12px]">
                        <span className="font-medium tracking-wider uppercase text-white/70">
                          {awardLabel}
                        </span>
                        <span>{achievement.year}</span>
                      </div>

                      {/* Center Monogram */}
                      <div className="relative z-10 my-auto text-center py-8">
                        <div className="w-24 h-24 mx-auto rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center mb-4 shadow-xl">
                          <span className="text-[36px] font-bold text-white tracking-wider">
                            {achievement.studentName
                              ? achievement.studentName
                                  .replace(/\(.*\)/g, "")
                                  .trim()
                                  .split(/\s+/)
                                  .slice(0, 2)
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "AN"}
                          </span>
                        </div>
                        <span className="text-[13px] font-medium uppercase tracking-widest text-[#2997ff] block mb-1">
                          {achievement.category}
                        </span>
                        <span className="text-[12px] text-white/50 block">
                          Tingkat {achievement.level}
                        </span>
                      </div>

                      {/* Bottom tag */}
                      <div className="relative z-10 text-[12px] text-white/40 pt-4 border-t border-white/10">
                        SD Plus An-Nur
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================
                  RIGHT COLUMN: Editorial Content & Metadata
                  ======================================================== */}
              <div className="lg:col-span-7 flex flex-col">
                {/* Level, Year & Category Meta — Tipografi Bersih Tanpa Pill Badge */}
                <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#7a7a7a] mb-4">
                  <span className="font-semibold text-[#0066cc] uppercase tracking-wider">
                    Tingkat {achievement.level}
                  </span>
                  <span>•</span>
                  <span>Tahun {achievement.year}</span>
                  {achievement.category && (
                    <>
                      <span>•</span>
                      <span className="text-[#555555]">{achievement.category}</span>
                    </>
                  )}
                </div>

                {/* 1. NAMA SISWA — Fokus Utama */}
                <h1 className="text-[32px] sm:text-[42px] lg:text-[46px] font-semibold text-[#1d1d1f] tracking-[-0.025em] leading-[1.1] mb-2">
                  {achievement.studentName}
                </h1>

                {/* 2. NAMA LOMBA / PRESTASI */}
                <p className="text-[19px] sm:text-[22px] text-[#0066cc] font-medium leading-snug mb-8">
                  {achievement.title}
                </p>

                {/* 3. DESKRIPSI PRESTASI */}
                {achievement.description && (
                  <div className="mb-8">
                    <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#7a7a7a] mb-2.5">
                      Uraian Prestasi
                    </h2>
                    <p className="text-[16px] sm:text-[17px] text-[#333333] leading-[1.65]">
                      {achievement.description}
                    </p>
                  </div>
                )}

                {/* 4. DETAIL METADATA GRID (Apple-grade utility card) */}
                <div className="bg-[#f5f5f7] border border-[#e0e0e0] rounded-[20px] p-6 sm:p-7 space-y-4 mb-8">
                  <h3 className="text-[14px] font-semibold text-[#1d1d1f] uppercase tracking-wider pb-3 border-b border-[#e0e0e0]">
                    Informasi Kompetisi
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                    {/* Penyelenggara */}
                    <div>
                      <span className="text-[12px] font-medium text-[#7a7a7a] block uppercase tracking-wider mb-1">
                        Penyelenggara
                      </span>
                      <span className="font-semibold text-[#1d1d1f] block leading-snug">
                        {achievement.organizer || "Lembaga Resmi"}
                      </span>
                    </div>

                    {/* Tingkat Lomba */}
                    <div>
                      <span className="text-[12px] font-medium text-[#7a7a7a] block uppercase tracking-wider mb-1">
                        Tingkat Kompetisi
                      </span>
                      <span className="font-semibold text-[#1d1d1f] block leading-snug">
                        {achievement.level || "Tingkat Sekolah"}
                      </span>
                    </div>

                    {/* Penghargaan */}
                    <div>
                      <span className="text-[12px] font-medium text-[#7a7a7a] block uppercase tracking-wider mb-1">
                        Peringkat / Penghargaan
                      </span>
                      <span className="font-semibold text-[#0066cc] block leading-snug">
                        {awardLabel}
                      </span>
                    </div>

                    {/* Tahun */}
                    <div>
                      <span className="text-[12px] font-medium text-[#7a7a7a] block uppercase tracking-wider mb-1">
                        Tahun Pelaksanaan
                      </span>
                      <span className="font-semibold text-[#1d1d1f] block leading-snug">
                        {achievement.year}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/kontak"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0066cc] text-white text-[15px] font-medium hover:bg-[#0071e3] transition-colors"
                  >
                    Konsultasi Bakat &amp; PPDB
                  </Link>
                  <Link
                    href="/lomba"
                    className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#1d1d1f] text-[15px] font-medium hover:bg-[#e8e8ed] transition-colors"
                  >
                    <span>Informasi Lomba Siswa</span>
                    <ChevronRightIcon className="w-4 h-4 text-[#7a7a7a]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            RELATED ACHIEVEMENTS: Galeri Prestasi Siswa Lainnya
            ======================================================== */}
        {relatedAchievements.length > 0 && (
          <section className="py-16 sm:py-20 bg-[#fafafc] border-t border-[#e0e0e0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[#0066cc] block mb-1">
                    Inspirasi Prestasi
                  </span>
                  <h3 className="text-[24px] sm:text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
                    Prestasi Siswa Lainnya
                  </h3>
                </div>
                <Link
                  href="/prestasi"
                  className="text-[14px] font-medium text-[#0066cc] hover:underline inline-flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedAchievements.map((item) => (
                  <article
                    key={item.id}
                    className="group rounded-[20px] bg-white border border-[#e0e0e0] p-6 hover:border-[#1d1d1f]/40 hover:shadow-md transition-all duration-300"
                  >
                    <Link href={`/prestasi/${item.id}`} className="block">
                      <div className="flex items-center justify-between mb-3 text-[12px]">
                        <span className="font-semibold text-[#0066cc] uppercase tracking-wider">
                          {item.level}
                        </span>
                        <span className="text-[#7a7a7a]">{item.year}</span>
                      </div>
                      <h4 className="text-[20px] font-semibold text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors leading-snug mb-1">
                        {item.studentName}
                      </h4>
                      <p className="text-[14px] text-[#7a7a7a] line-clamp-2">
                        {item.title}
                      </p>
                      <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-[13px] text-[#0066cc] font-medium">
                        <span>Lihat Detail</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
