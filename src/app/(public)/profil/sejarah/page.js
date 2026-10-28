import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import CTASection from "@/components/organisms/CTASection";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApiState from "@/components/atoms/ApiState";
import { publicApi } from "@/data/api";
import {
  UsersIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  MapPinIcon,
  ArrowUpRightIcon,
} from "@/components/atoms/Icons";

export const metadata = {
  title: "Sejarah & Rekam Jejak Kepemimpinan | SD Plus An-Nur",
  description:
    "Sejarah berdirinya SD Plus An-Nur, background pendirian, serta rekam jejak kepemimpinan Kepala Sekolah dari masa ke masa di Kediri, Jawa Timur.",
};

export const instant = false;

export default async function SejarahPage() {
  let profile = null;
  let error = null;

  try {
    profile = await publicApi.profile();
  } catch (requestError) {
    error = requestError.message;
  }

  if (!profile) {
    return (
      <MainLayout>
        <section className="py-20">
          <ApiState error={error} empty={!error} />
        </section>
      </MainLayout>
    );
  }

  const { history } = profile;

  return (
    <MainLayout>
      {/* Hero Tile */}
      <HeroTile
        variant="parchment"
        eyebrow="Napak Tilas & Amanah Perjuangan"
        title={`Sejarah & Rekam Jejak ${profile.institutionName}`}
        subtitle={history.foundingYear
          ? `Sejarah ${profile.institutionName} sejak ${history.foundingYear}, perjalanan sekolah, dan estafet kepemimpinan.`
          : `Sejarah ${profile.institutionName} dan estafet kepemimpinan.`}
        primaryCtaText="Telusuri Linimasa Sejarah"
        primaryCtaHref="#linimasa"
        secondaryCtaText="Daftar Kepala Sekolah"
        secondaryCtaHref="#kepemimpinan"
      />

      {/* 1. SECTION: KAPAN SEKOLAH DIBANGUN & BACKGROUND SINGKAT + TIMELINE */}
      <section id="linimasa" className="py-16 lg:py-24 bg-white border-b border-[#e0e0e0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <span className="text-[13px] font-semibold uppercase tracking-[0.2px] text-[#0066cc] mb-2 block">
              Sejarah Berdiri
            </span>
            <h2 className="text-[28px] sm:text-[38px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
              Awal Pendirian &amp; Latar Belakang
            </h2>
            <p className="text-[16px] text-[#7a7a7a] mt-2">
              Berawal dari cita-cita luhur melahirkan generasi Qur&apos;ani yang cerdas dan berakhlak mulia di Kediri.
            </p>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pl-6 sm:pl-10 border-l-2 border-[#0066cc]/30 space-y-12">
            {history.milestones.length ? history.milestones.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Circle Node */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-[#0066cc] shadow-xs group-hover:scale-110 transition-transform" />

                {/* Badge Category */}
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[12px] font-semibold bg-[#e8f2ff] text-[#0066cc]">
                    {item.badge}
                  </span>
                </div>

                {/* Date Highlight */}
                <h3 className="text-[26px] sm:text-[32px] font-bold text-[#1d1d1f] tracking-tight mb-4">
                  {item.date}
                </h3>

                {/* Content Box */}
                <div className="bg-white border border-[#e0e0e0] rounded-[20px] p-6 sm:p-8 apple-product-shadow transition-colors hover:border-[#1d1d1f]">
                  <h4 className="text-[18px] font-semibold text-[#1d1d1f] mb-3 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[15px] sm:text-[16px] text-[#555555] leading-[1.65]">
                    {item.desc}
                  </p>
                </div>
              </div>
            )) : <ApiState empty />}
          </div>

          {/* Background Singkat Callout Card */}
          <div className="mt-16 bg-[#fafafc] border border-[#e0e0e0] rounded-[22px] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[13px] font-semibold text-[#0066cc] uppercase tracking-wide">
                Ikhtisar Ringkas
              </span>
              <span className="text-[#cccccc]">•</span>
              <span className="text-[13px] text-[#7a7a7a]">
                Didirikan Tahun {history.foundingYear}
              </span>
            </div>
            <p className="text-[15px] sm:text-[16px] text-[#333333] leading-relaxed">
              {history.shortBackground || "Informasi sejarah belum tersedia."}
            </p>
          </div>
        </div>
      </section>

      {/* 2. SECTION: REKAM JEJAK KEPEMIMPINAN SD PLUS AN-NUR */}
      <section id="kepemimpinan" className="py-16 lg:py-24 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.2px] text-[#0066cc] mb-2">
                <GraduationCapIcon className="w-4 h-4" />
                <span>Kepemimpinan</span>
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-semibold text-[#1d1d1f] tracking-tight">
                Daftar Kepala Sekolah
              </h2>
            </div>
            <p className="text-[14px] sm:text-[15px] text-[#7a7a7a] italic">
              Rekam jejak kepemimpinan SD Plus An-Nur dari masa ke masa.
            </p>
          </div>

          {/* Table Container styled exactly like reference */}
          <div className="bg-white border border-[#e0e0e0] rounded-[22px] overflow-hidden apple-product-shadow">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 sm:px-8 py-4 bg-[#fafafc] border-b border-[#e0e0e0] text-[12px] font-bold text-[#7a7a7a] uppercase tracking-wider">
              <div className="col-span-2 sm:col-span-1 text-center sm:text-left">No</div>
              <div className="col-span-4 sm:col-span-4">Masa Jabatan</div>
              <div className="col-span-6 sm:col-span-7">Nama Kepala Sekolah</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#f0f0f0]">
              {history.leadershipTrackRecord.length ? history.leadershipTrackRecord.map((record) => (
                <div
                  key={record.no}
                  className="grid grid-cols-12 gap-4 px-6 sm:px-8 py-5 items-center hover:bg-[#fafafc] transition-colors"
                >
                  {/* Number */}
                  <div className="col-span-2 sm:col-span-1 text-[14px] font-semibold text-[#0066cc] text-center sm:text-left">
                    {record.no}
                  </div>

                  {/* Period */}
                  <div className="col-span-4 sm:col-span-4 flex items-center gap-2 text-[14px] sm:text-[15px] font-semibold text-[#1d1d1f]">
                    <span className="text-[#0066cc] hidden sm:inline">🗓</span>
                    <span>{record.period}</span>
                  </div>

                  {/* Name & status */}
                  <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f0f4f9] text-[#0066cc] hidden sm:flex items-center justify-center shrink-0">
                      <UsersIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[15px] sm:text-[16px] font-bold text-[#1d1d1f] leading-snug">
                        {record.name}
                      </h4>
                      <p className="text-[12px] sm:text-[13px] text-[#7a7a7a] mt-0.5 leading-snug">
                        {record.status}
                      </p>
                    </div>
                  </div>
                </div>
              )) : <ApiState empty />}
            </div>
          </div>

          {/* Action Link to Current Leadership Page */}
          <div className="mt-8 flex justify-center">
            <Button
              href="/profil/kepala-wakil"
              variant="secondary-pill"
              size="md"
              className="text-[14px]"
            >
              Lihat Profil Kepala &amp; Wakil Kepala Saat Ini →
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        theme="dark"
        eyebrow="Silaturahmi & Kunjungan"
        title="Mengenal Lebih Dekat Budaya Sekolah Kami"
        description="SD Plus An-Nur terus berinovasi menjaga amanah para pendahulu dalam mendidik generasi Qur'ani yang berakhlak mulia."
        primaryText="Hubungi Kami"
        primaryHref="/kontak"
        secondaryText="Kembali ke Profil Sekolah"
        secondaryHref="/profil"
      />
    </MainLayout>
  );
}
