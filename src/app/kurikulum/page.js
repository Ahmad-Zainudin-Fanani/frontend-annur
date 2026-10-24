import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import CurriculumOverview from "@/components/organisms/CurriculumOverview";
import CTASection from "@/components/organisms/CTASection";

export const metadata = {
  title: "Kurikulum SD Merdeka | SD Plus An-Nur",
  description:
    "Kurikulum SD Merdeka di SD Plus An-Nur (SD Swasta). Penyelenggaraan pagi / 6 hari, projek penguatan profil pelajar Pancasila (P5), program tahfidz Juz 30, dan pembinaan karakter.",
};

export default function KurikulumPage() {
  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Kurikulum &amp; Sistem Belajar"
        title="Kurikulum SD Merdeka Berbasis Karakter."
        subtitle="Memadukan Kurikulum SD Merdeka Kemendikbudristek dengan pembinaan keislaman khas, tahfidzul qur'an, dan pembiasaan adab dalam jadwal pagi / 6 hari sekolah."
        primaryCtaText="Telusuri Pilar Kurikulum"
        primaryCtaHref="#pilar"
        secondaryCtaText="Lihat Fase Belajar (A - C)"
        secondaryCtaHref="#jenjang"
      />

      {/* Curriculum Overview Component */}
      <CurriculumOverview />

      <CTASection
        theme="dark"
        eyebrow="Konsultasi Pendidikan"
        title="Pendidikan Dasar Terbaik untuk Buah Hati Anda"
        description="Konsultasikan kesiapan belajar dan pendaftaran putra-putri Anda di SD Plus An-Nur bersama tim pengajar kami."
        primaryText="Konsultasi PPDB Sekarang"
        primaryHref="/kontak"
        secondaryText="Peta Lokasi Sekolah"
        secondaryHref="https://www.google.com/maps?q=-7.8743,112.1076"
      />
    </MainLayout>
  );
}
