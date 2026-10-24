import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroCarousel from "@/components/organisms/HeroCarousel";
import FeaturedPrograms from "@/components/organisms/FeaturedPrograms";
import VisionMissionPrincipal from "@/components/organisms/VisionMissionPrincipal";
import HomeContactSection from "@/components/organisms/HomeContactSection";
import CTASection from "@/components/organisms/CTASection";

export const metadata = {
  title: "SD Plus An-Nur | Sekolah Dasar Swasta Islam Unggulan",
  description:
    "Situs resmi SD Plus An-Nur (Sekolah Dasar Swasta). Menerapkan Kurikulum SD Merdeka, program Tahfidz Al-Qur'an, dan pembiasaan adab islami dalam lingkungan belajar yang ramah anak.",
};

export default function HomePage() {
  return (
    <MainLayout>
      {/* ========================================================
          SECTION 1: Full-screen Hero Section (Background Image, Dark Overlay & Carousel)
          ======================================================== */}
      <HeroCarousel />

      {/* ========================================================
          SECTION 2: Ringkasan Program Unggulan
          ======================================================== */}
      <FeaturedPrograms />

      {/* ========================================================
          SECTION 3: Visi Misi & Box Kepala Sekolah yang Sedang Menjabat
          (Mengacu persis pada konsep layout gambar/screenshot)
          ======================================================== */}
      <VisionMissionPrincipal />

      {/* ========================================================
          SECTION 4: Contact Section (Google Maps Kiri & Deskripsi/Kontak Kanan)
          ======================================================== */}
      <HomeContactSection />

      {/* ========================================================
          SECTION 5: Elegant CTA PPDB (Dark #272729)
          ======================================================== */}
      <CTASection
        theme="dark"
        eyebrow="Penerimaan Peserta Didik Baru (PPDB) TA 2026/2027"
        title="Daftarkan Putra-Putri Anda di SD Plus An-Nur."
        description="Mari bersama-sama membimbing ananda meraih masa depan cemerlang, beriman, dan berakhlak mulia di Sekolah Dasar Swasta Islam terpercaya."
        primaryText="Konsultasi Pendaftaran (PPDB)"
        primaryHref="/kontak"
        secondaryText="Hubungi WhatsApp Kami"
        secondaryHref="https://wa.me/6281234567890?text=Halo%20SD%20Plus%20An-Nur,%20saya%20ingin%20konsultasi%20PPDB"
      />
    </MainLayout>
  );
}
