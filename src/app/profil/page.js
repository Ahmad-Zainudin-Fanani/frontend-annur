import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import ProfileHighlights from "@/components/organisms/ProfileHighlights";
import CTASection from "@/components/organisms/CTASection";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { profileData } from "@/data/profileData";
import { ShieldCheckIcon, MapPinIcon, ArrowUpRightIcon } from "@/components/atoms/Icons";

export const metadata = {
  title: "Profil & Kelembagaan | SD Plus An-Nur",
  description:
    "Profil resmi SD Plus An-Nur (Sekolah Dasar Swasta). Data pokok pendidikan, statistik 398 siswa, 13 guru, 13 rombel, visi misi, fasilitas, dan lokasi sekolah di Kediri, Jawa Timur.",
};

export default function ProfilPage() {
  return (
    <MainLayout>
      {/* Light Hero Tile */}
      <HeroTile
        variant="parchment"
        eyebrow="Profil Lembaga Pendidikan"
        title="SD Plus An-Nur (SD Swasta)"
        subtitle="Sekolah Dasar Swasta Islam terakreditasi A yang mendidik 398 siswa putra dan putri dalam 13 rombongan belajar berbasis Kurikulum SD Merdeka."
        primaryCtaText="Statistik &amp; Utilitas"
        primaryCtaHref="#sejarah"
        secondaryCtaText="Visi &amp; Misi"
        secondaryCtaHref="#visi-misi"
      >
        <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8 apple-product-shadow max-w-2xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <Badge variant="emerald" size="lg">
              <ShieldCheckIcon className="w-4 h-4" />
              {profileData.accreditation}
            </Badge>
            <Badge variant="primary" size="lg">
              Status: SD Swasta
            </Badge>
            <Badge variant="neutral" size="lg">
              Pagi / 6 Hari
            </Badge>
          </div>
          <p className="text-[16px] text-[#1d1d1f] font-medium leading-relaxed mb-4">
            Terakreditasi A oleh Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M). Berkomitmen menghadirkan lingkungan belajar yang aman, ramah anak, dan berkualitas tinggi.
          </p>
          <a
            href={profileData.location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[14px] text-[#0066cc] hover:underline font-medium"
          >
            <MapPinIcon className="w-4 h-4" />
            <span>Lokasi: {profileData.location.coordinates} (Buka Google Maps)</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </HeroTile>

      {/* Comprehensive Profile Sections with Screenshot Stats */}
      <ProfileHighlights showAll={true} />

      {/* Bottom CTA */}
      <CTASection
        theme="dark"
        eyebrow="Silaturahmi &amp; Kunjungan Sekolah"
        title="Jadwalkan Kunjungan ke Kampus SD Plus An-Nur"
        description="Kami mengundang calon orang tua wali murid untuk melihat langsung suasana kelas, ruang perpustakaan, fasilitas ibadah, dan sarana bermain anak."
        primaryText="Hubungi Kami Sekarang"
        primaryHref="/kontak"
        secondaryText="Peta Lokasi Google Maps"
        secondaryHref={profileData.location.mapsUrl}
      />
    </MainLayout>
  );
}
