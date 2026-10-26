import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import CTASection from "@/components/organisms/CTASection";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Image from "next/image";
import { profileData } from "@/data/profileData";
import { teachersData } from "@/data/teachersData";
import {
  GraduationCapIcon,
  AwardIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckIcon,
} from "@/components/atoms/Icons";

export const metadata = {
  title: "Kepala & Wakil Kepala Sekolah | SD Plus An-Nur",
  description:
    "Profil pimpinan SD Plus An-Nur: Kepala Sekolah Ustadz H. Ahmad Fauzi, S.Pd.I., M.Pd. dan jajaran Wakil Kepala Sekolah serta Koordinator.",
};

export default function KepalaWakilPage() {
  const principal = profileData.leadership[0];
  const vicePrincipals = profileData.leadership.slice(1);

  return (
    <MainLayout>
      {/* Hero Tile */}
      <HeroTile
        variant="parchment"
        eyebrow="Kepemimpinan Penuh Amanah"
        title="Kepala & Wakil Kepala Sekolah"
        subtitle="Mewujudkan visi pendidikan dasar Islam holistik yang mengintegrasikan adab, tahfidzul qur'an, dan keunggulan akademik Kurikulum SD Merdeka."
        primaryCtaText="Lihat Profil Pimpinan"
        primaryCtaHref="#pimpinan-utama"
        secondaryCtaText="Dewan Guru Lengkap"
        secondaryCtaHref="/guru"
      />

      <section id="pimpinan-utama" className="py-16 lg:py-24 bg-white border-b border-[#f0f0f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SECTION HEADER */}
          <div className="max-w-3xl mb-12">
            <span className="text-[13px] font-semibold uppercase tracking-[0.2px] text-[#0066cc] mb-2 block">
              Pimpinan Utama Lembaga
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
              Kepala Sekolah SD Plus An-Nur
            </h2>
            <p className="text-[16px] text-[#7a7a7a] mt-2">
              Nakhoda kepemimpinan yang membimbing dan mengawal kualitas pembelajaran 398 siswa dalam 13 rombel.
            </p>
          </div>

          {/* FEATURED: KEPALA SEKOLAH (Prominent Apple-style Hero Showcase) */}
          <div className="bg-[#fafafc] border border-[#e0e0e0] rounded-[24px] p-6 sm:p-10 lg:p-12 apple-product-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Photo Column */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-[20px] overflow-hidden border border-[#e0e0e0] bg-[#1d1d1f] apple-product-shadow shadow-md">
                  <Image
                    src="/images/kepala-sekolah.jpg"
                    alt={`Kepala Sekolah ${principal.name}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 340px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[12px] font-medium tracking-wide border border-white/20">
                      Kepala Sekolah
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                    <p className="text-[13px] font-medium text-white/90">
                      SD Plus An-Nur Kediri
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio & Details Column */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="primary" size="md">
                    Pimpinan Lembaga
                  </Badge>
                  <Badge variant="emerald" size="md">
                    <ShieldCheckIcon className="w-3.5 h-3.5 inline mr-1" />
                    Terakreditasi A
                  </Badge>
                </div>

                <h3 className="text-[26px] sm:text-[32px] font-bold text-[#1d1d1f] tracking-tight leading-snug mb-2">
                  {principal.name}
                </h3>

                <p className="text-[16px] font-medium text-[#0066cc] mb-6">
                  {principal.role}
                </p>

                {/* Quote Callout */}
                <div className="bg-white border-l-4 border-[#0066cc] rounded-r-xl p-5 border border-y-[#e0e0e0] border-r-[#e0e0e0] mb-6">
                  <p className="text-[15px] sm:text-[16px] italic text-[#333333] leading-relaxed">
                    &ldquo;{principal.bio}&rdquo;
                  </p>
                </div>

                {/* Key Credentials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#e0e0e0]">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#f0f0f0] flex items-center justify-center text-[#0066cc] shrink-0">
                      <GraduationCapIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[12px] text-[#7a7a7a] uppercase font-semibold block">
                        Latar Belakang Pendidikan
                      </span>
                      <span className="text-[14px] text-[#1d1d1f] font-medium leading-snug">
                        {principal.education}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#f0f0f0] flex items-center justify-center text-[#0066cc] shrink-0">
                      <AwardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[12px] text-[#7a7a7a] uppercase font-semibold block">
                        Pengalaman Pengabdian
                      </span>
                      <span className="text-[14px] text-[#1d1d1f] font-medium leading-snug">
                        {principal.experience}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: WAKIL KEPALA & KOORDINATOR */}
          <div className="mt-20">
            <div className="max-w-3xl mb-10">
              <span className="text-[13px] font-semibold uppercase tracking-[0.2px] text-[#0066cc] mb-2 block">
                Jajaran Manajemen Sekolah
              </span>
              <h2 className="text-[26px] sm:text-[32px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                Wakil Kepala Sekolah & Koordinator
              </h2>
              <p className="text-[15px] text-[#7a7a7a] mt-2">
                Pendidik berpengalaman yang mengoordinasikan bidang kurikulum, kesiswaan, keagamaan, dan pembinaan karakter siswa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vicePrincipals.map((vp, index) => {
                // Find matching teacher record if exists
                const teacherMatch = teachersData.find((t) => t.name === vp.name);
                const isFemale = teacherMatch?.gender === "P";

                return (
                  <div
                    key={index}
                    className="bg-white border border-[#e0e0e0] rounded-[20px] overflow-hidden apple-product-shadow flex flex-col justify-between transition-all hover:border-[#1d1d1f] hover:-translate-y-1"
                  >
                    <div>
                      {/* Portrait Header */}
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#f0f4f9] via-[#e8eff8] to-[#d9e5f5] flex items-center justify-center border-b border-[#e0e0e0] overflow-hidden">
                        <div className="w-24 h-24 rounded-full bg-white shadow-md border border-[#e0e0e0] flex items-center justify-center text-[#0066cc] font-bold text-2xl">
                          {vp.name
                            .replace(/^(Ustadz|Ustadzah|Dr\.|Dra\.|H\.|Hj\.)\s+/gi, "")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="absolute top-3.5 right-3.5">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#0066cc] border border-[#e0e0e0]">
                            {isFemale ? "Ustadzah" : "Ustadz"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <span className="text-[12px] font-semibold text-[#0066cc] uppercase tracking-wide block mb-1">
                          {vp.role}
                        </span>
                        <h3 className="text-[18px] font-semibold text-[#1d1d1f] leading-snug mb-3">
                          {vp.name}
                        </h3>

                        <div className="space-y-2 mb-4 text-[13px] text-[#555555]">
                          <div className="flex items-start gap-2">
                            <GraduationCapIcon className="w-4 h-4 text-[#7a7a7a] shrink-0 mt-0.5" />
                            <span className="leading-snug">{vp.education}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <SparklesIcon className="w-4 h-4 text-[#7a7a7a] shrink-0 mt-0.5" />
                            <span className="leading-snug">{vp.experience}</span>
                          </div>
                        </div>

                        {vp.bio && (
                          <p className="text-[13px] italic text-[#555555] bg-[#fafafc] p-3 rounded-xl border border-[#e0e0e0] leading-relaxed">
                            &ldquo;{vp.bio}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-[#fafafc] border-t border-[#f0f0f0] flex items-center justify-between text-[13px]">
                      <span className="text-[#7a7a7a]">Tim Manajemen SD</span>
                      <Button
                        href="/guru"
                        variant="secondary-pill"
                        size="sm"
                        className="text-[12px] py-1 px-3"
                      >
                        Lihat Dewan Guru →
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <CTASection
        theme="dark"
        eyebrow="Konsultasi & Silaturahmi"
        title="Ingin Berkenalan Lebih Dekat dengan SD Plus An-Nur?"
        description="Pintu komunikasi kami terbuka lebar bagi orang tua murid yang ingin mendiskusikan masa depan pendidikan ananda."
        primaryText="Hubungi Kontak & Lokasi"
        primaryHref="/kontak"
        secondaryText="Kembali ke Profil Sekolah"
        secondaryHref="/profil"
      />
    </MainLayout>
  );
}
