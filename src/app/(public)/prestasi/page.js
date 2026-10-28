import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import PrestasiHero from "@/components/organisms/PrestasiHero";
import PrestasiWinnersGallery from "@/components/organisms/PrestasiWinnersGallery";
import { publicApi } from "@/data/api";

export const metadata = {
  title: "Galeri Prestasi Siswa | SD Plus An-Nur",
  description:
    "Galeri visual pemenang lomba dan rekam jejak prestasi siswa-siswi SD Plus An-Nur di bidang sains (OSN), keagamaan (MHQ & Pentas PAI), seni (FLS2N), dan olahraga (O2SN).",
};

export const instant = false;

export default async function PrestasiPage() {
  let achievements = [];
  let error = null;

  try {
    achievements = await publicApi.achievements({ status: "published" });
  } catch (requestError) {
    error = requestError.message;
  }

  return (
    <MainLayout>
      {/* 1. Hero Prestasi — Disederhanakan & Editorial */}
      <PrestasiHero />

      {/* 2. Galeri Pemenang Lomba — Grid Foto Editorial Besar ala SOHUB Digital */}
      <PrestasiWinnersGallery achievements={achievements} error={error} />
    </MainLayout>
  );
}
