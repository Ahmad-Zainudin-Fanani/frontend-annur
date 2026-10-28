import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import TeachersShowcase from "@/components/organisms/TeachersShowcase";
import CTASection from "@/components/organisms/CTASection";
import { publicApi } from "@/data/api";

export const metadata = {
  title: "Dewan Guru | SD Plus An-Nur",
  description:
    "Direktori tenaga pendidik SD Plus An-Nur.",
};

export const instant = false;

export default async function GuruPage() {
  let teachers = [];
  let error = null;

  try {
    teachers = await publicApi.teachers();
  } catch (requestError) {
    error = requestError.message;
  }

  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Tenaga Pendidik Profesional"
        title="Dewan Guru SD Plus An-Nur."
        subtitle="Kenali para pendidik yang mendampingi kegiatan belajar dan perkembangan siswa."
        primaryCtaText="Telusuri Direktori Pendidik"
        primaryCtaHref="#guru"
        secondaryCtaText="Struktur Kurikulum"
        secondaryCtaHref="/kurikulum"
      />

      {/* Teachers Directory Component */}
      <TeachersShowcase initialTeachers={teachers} error={error} />

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
