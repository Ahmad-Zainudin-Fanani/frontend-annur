import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import TeachersShowcase from "@/components/organisms/TeachersShowcase";
import CTASection from "@/components/organisms/CTASection";

export const metadata = {
  title: "Dewan Guru | SD Plus An-Nur",
  description:
    "Direktori 13 tenaga pendidik SD Plus An-Nur (Sekolah Dasar Swasta) yang penuh dedikasi mendampingi 398 siswa dalam 13 rombongan belajar.",
};

export default function GuruPage() {
  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Tenaga Pendidik Profesional"
        title="Dewan Guru SD Plus An-Nur (13 Pendidik)."
        subtitle="Didukung 13 guru berdedikasi tinggi yang mendampingi tumbuh kembang 398 siswa dalam kurikulum SD Merdeka dan pembinaan akhlak mulia."
        primaryCtaText="Telusuri Direktori Pendidik"
        primaryCtaHref="#guru"
        secondaryCtaText="Struktur Kurikulum"
        secondaryCtaHref="/kurikulum"
      />

      {/* Teachers Directory Component */}
      <TeachersShowcase />

      <CTASection
        theme="dark"
        eyebrow="Karier &amp; Pengabdian"
        title="Bergabung Menjadi Tenaga Pendidik SD Plus An-Nur"
        description="Kami senantiasa membuka pintu bagi pendidik berdedikasi yang mencintai dunia anak dan berkomitmen membangun karakter generasi bangsa."
        primaryText="Informasi Rekrutmen Guru"
        primaryHref="/kontak"
        secondaryText="Hubungi Kami"
        secondaryHref="/kontak"
      />
    </MainLayout>
  );
}
