import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import CurriculumOverview from "@/components/organisms/CurriculumOverview";
import CTASection from "@/components/organisms/CTASection";
import { normalizeCurriculums, publicApi } from "@/data/api";

export const metadata = {
  title: "Kurikulum | SD Plus An-Nur",
  description: "Informasi kurikulum dan kegiatan belajar SD Plus An-Nur.",
};

export const instant = false;

export default async function KurikulumPage() {
  let curriculum = normalizeCurriculums();
  let profile = null;
  let error = null;

  try {
    const [records, schoolProfile] = await Promise.all([
      publicApi.curriculums(),
      publicApi.profile(),
    ]);
    profile = schoolProfile;
    curriculum = normalizeCurriculums(records, profile);
  } catch (requestError) {
    error = requestError.message;
  }

  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Kurikulum &amp; Sistem Belajar"
        title="Kurikulum & Sistem Belajar SD Plus An-Nur."
        subtitle={curriculum.overview || "Informasi program kurikulum dan kegiatan belajar."}
        primaryCtaText="Telusuri Pilar Kurikulum"
        primaryCtaHref="#pilar"
        secondaryCtaText="Lihat Fase Belajar (A - C)"
        secondaryCtaHref="#jenjang"
      />

      {/* Curriculum Overview Component */}
      <CurriculumOverview curriculum={curriculum} error={error} />

      <CTASection
        theme="dark"
        eyebrow="Konsultasi Pendidikan"
        title="Pendidikan Dasar Terbaik untuk Buah Hati Anda"
        description="Konsultasikan kesiapan belajar dan pendaftaran putra-putri Anda di SD Plus An-Nur bersama tim pengajar kami."
        primaryText="Konsultasi PPDB Sekarang"
        primaryHref="/kontak"
        secondaryText="Peta Lokasi Sekolah"
        secondaryHref={profile?.location.mapsUrl || "/kontak"}
      />
    </MainLayout>
  );
}
