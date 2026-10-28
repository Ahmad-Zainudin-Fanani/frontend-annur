import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroCarousel from "@/components/organisms/HeroCarousel";
import HomeAchievements from "@/components/organisms/HomeAchievements";
import VisionMissionPrincipal from "@/components/organisms/VisionMissionPrincipal";
import HomeGallery from "@/components/organisms/HomeGallery";
import HomeContactSection from "@/components/organisms/HomeContactSection";
import { publicApi } from "@/data/api";

export const metadata = {
  title: "SD Plus An-Nur | Sekolah Dasar Swasta Islam Unggulan",
  description:
    "Situs resmi SD Plus An-Nur (Sekolah Dasar Swasta). Menerapkan Kurikulum SD Merdeka, program Tahfidz Al-Qur'an, dan pembiasaan adab islami dalam lingkungan belajar yang ramah anak.",
};

export const instant = false;

export default async function HomePage() {
  let profile          = null;
  let profileError     = null;
  let heroSlides       = [];
  let heroSlidesError  = null;
  let achievements     = [];
  let achievementsError = null;
  let galleries        = [];
  let galleriesError   = null;

  try {
    profile = await publicApi.profile();
  } catch (e) {
    profileError = e.message;
  }

  try {
    heroSlides = await publicApi.heroSlides();
  } catch (e) {
    heroSlidesError = e.message;
  }

  try {
    achievements = await publicApi.achievements({ status: "published" });
  } catch (e) {
    achievementsError = e.message;
  }

  try {
    galleries = await publicApi.galleries({ status: "published" });
  } catch (e) {
    galleriesError = e.message;
  }

  return (
    <MainLayout>
      {/* ========================================================
          SECTION 1: Hero Banner (Full-Screen Carousel + SplitText)
          ======================================================== */}
      <HeroCarousel slides={heroSlides} error={heroSlidesError} />

      {/* ========================================================
          SECTION 2: Prestasi Siswa (Pinned horizontal showcase)
          Pin section + geser kartu horizontal mengikuti scroll
          ======================================================== */}
      <HomeAchievements achievements={achievements} error={achievementsError} />

      {/* ========================================================
          SECTION 3: Arah Pendidikan & Kepemimpinan
          (Menggantikan statistik angka "Dedikasi yang Terukur")
          Visi, Misi & Kepala Sekolah dalam satu narasi terpadu
          ======================================================== */}
      <VisionMissionPrincipal profile={profile} error={profileError} />

      {/* ========================================================
          SECTION 4: Galeri Kegiatan
          Bento layout dinamis + GSAP Flip filter & ScrollTrigger
          ======================================================== */}
      <HomeGallery galleries={galleries} error={galleriesError} />

      {/* ========================================================
          SECTION 5: Lokasi & Kontak Resmi
          Peta interaktif, saluran WhatsApp, email, dan jam layanan
          ======================================================== */}
      <HomeContactSection profile={profile} error={profileError} />
    </MainLayout>
  );
}
