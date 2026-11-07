import React from "react";
import MainLayout from "@/components/templates/MainLayout";
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
      {/* Teachers Directory Component */}
      <TeachersShowcase initialTeachers={teachers} error={error} />

      <CTASection
        theme="neutral"
        eyebrow="Karier & Pengabdian"
        title="Bergabung Menjadi Tenaga Pendidik SD Plus An-Nur"
        description="Kami senantiasa membuka pintu bagi pendidik berdedikasi yang mencintai dunia anak dan berkomitmen membangun karakter generasi bangsa."
        primaryText="Hubungi Kami"
        primaryHref="/kontak"
        secondaryText=""
        secondaryHref=""
      />
    </MainLayout>
  );
}
