import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroCarousel from "@/components/organisms/HeroCarousel";
import FeaturedPrograms from "@/components/organisms/FeaturedPrograms";
import VisionMissionPrincipal from "@/components/organisms/VisionMissionPrincipal";
import HomeContactSection from "@/components/organisms/HomeContactSection";
import CTASection from "@/components/organisms/CTASection";
import ApiState from "@/components/atoms/ApiState";
import { normalizeCurriculums, publicApi } from "@/data/api";

export const metadata = {
  title: "SD Plus An-Nur | Sekolah Dasar Swasta Islam Unggulan",
  description:
    "Situs resmi SD Plus An-Nur (Sekolah Dasar Swasta). Menerapkan Kurikulum SD Merdeka, program Tahfidz Al-Qur'an, dan pembiasaan adab islami dalam lingkungan belajar yang ramah anak.",
};

export const instant = false;

export default async function HomePage() {
  let profile = null;
  let profileError = null;
  let curriculum = normalizeCurriculums();
  let curriculumError = null;
  let heroSlides = [];
  let heroSlidesError = null;

  try {
    profile = await publicApi.profile();
  } catch (error) {
    profileError = error.message;
  }

  try {
    const records = await publicApi.curriculums();
    curriculum = normalizeCurriculums(records, profile);
  } catch (error) {
    curriculumError = error.message;
  }

  try {
    heroSlides = await publicApi.heroSlides();
  } catch (error) {
    heroSlidesError = error.message;
  }

  return (
    <MainLayout>
      {/* ========================================================
          SECTION 1: Full-screen Hero Section (Background Image, Dark Overlay & Carousel)
          ======================================================== */}
      <HeroCarousel slides={heroSlides} error={heroSlidesError} />

      {/* ========================================================
          SECTION 2: Ringkasan Program Unggulan
          ======================================================== */}
      <FeaturedPrograms curriculum={curriculum} error={curriculumError} />

      {/* ========================================================
          SECTION 3: Visi Misi & Box Kepala Sekolah yang Sedang Menjabat
          (Mengacu persis pada konsep layout gambar/screenshot)
          ======================================================== */}
      <VisionMissionPrincipal profile={profile} error={profileError} />

      {/* ========================================================
          SECTION 4: Contact Section (Google Maps Kiri & Deskripsi/Kontak Kanan)
          ======================================================== */}
      <HomeContactSection profile={profile} error={profileError} />

      {/* ========================================================
          SECTION 5: Elegant CTA PPDB (Dark #272729)
          ======================================================== */}
      {profile ? <CTASection
        theme="dark"
        eyebrow="Penerimaan Peserta Didik Baru (PPDB)"
        title={`Daftarkan Putra-Putri Anda di ${profile.institutionName}.`}
        description={profile.tagline}
        primaryText="Konsultasi Pendaftaran (PPDB)"
        primaryHref="/kontak"
        secondaryText="Hubungi WhatsApp Kami"
        secondaryHref={profile.whatsapp ? `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}` : "/kontak"}
      /> : <ApiState error={profileError} empty={!profileError} />}
    </MainLayout>
  );
}
