import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import Heading from "@/components/atoms/Heading";
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
      <section className="bg-white px-4 pt-16 pb-4 text-center sm:px-6 sm:pt-20 sm:pb-6 lg:px-8 lg:pt-24 lg:pb-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a7a7a]">
            Kurikulum &amp; Sistem Belajar
          </p>
          <Heading as="h1" variant="hero-display" className="text-balance">
            Kurikulum &amp; Sistem Belajar{" "}
            <span className="block">SD Plus <span className="whitespace-nowrap">An-Nur.</span></span>
          </Heading>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-balance text-[#7a7a7a] sm:text-lg lg:text-xl">
            {curriculum.overview || "Informasi program kurikulum dan kegiatan belajar."}
          </p>
        </div>
      </section>
      <CurriculumOverview curriculum={curriculum} error={error} />

      <CTASection
        theme="neutral"
        eyebrow="Konsultasi Pendidikan"
        title={<>Pendidikan Dasar Terbaik{" "}<span className="block">untuk Buah Hati Anda</span></>}
        description="Konsultasikan kesiapan belajar dan pendaftaran putra-putri Anda di SD Plus An-Nur bersama tim pengajar kami."
        primaryText="Konsultasi PPDB Sekarang"
        primaryHref="/kontak"
        secondaryText=""
        secondaryHref=""
      />
    </MainLayout>
  );
}
