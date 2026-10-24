import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import AchievementsShowcase from "@/components/organisms/AchievementsShowcase";
import CTASection from "@/components/organisms/CTASection";

export const metadata = {
  title: "Prestasi Siswa | SD Plus An-Nur",
  description:
    "Galeri prestasi dan rekam jejak kejuaraan siswa-siswi SD Plus An-Nur di bidang OSN SD, tahfidz Al-Qur'an, seni FLS2N, dan olahraga O2SN tingkat kabupaten.",
};

export default function PrestasiPage() {
  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Prestasi Siswa SD Plus An-Nur"
        title="Mengasah Potensi, Mengukir Prestasi."
        subtitle="Dari Olimpiade Sains Nasional (OSN SD), Musabaqah Hifdzil Qur'an, seni FLS2N, hingga kejuaraan olahraga O2SN tingkat kabupaten, siswa SD Plus An-Nur terus bersemangat menorehkan prestasi membanggakan."
        primaryCtaText="Lihat Prestasi Siswa"
        primaryCtaHref="#prestasi"
        secondaryCtaText="Informasi Lomba Siswa"
        secondaryCtaHref="/lomba"
      />

      {/* Minimalist Achievements Showcase Component */}
      <AchievementsShowcase />

      <CTASection
        theme="dark"
        eyebrow="Apresiasi &amp; Motivasi"
        title="Dukung Tumbuh Kembang Bakat Ananda"
        description="SD Plus An-Nur memberikan ruang seluas-luasnya bagi setiap siswa untuk mengeksplorasi minat dan bakat melalui berbagai ekstrakurikuler pilihan."
        primaryText="Daftar Siswa Baru (PPDB)"
        primaryHref="/kontak"
        secondaryText="Hubungi Sekolah"
        secondaryHref="/kontak"
      />
    </MainLayout>
  );
}
