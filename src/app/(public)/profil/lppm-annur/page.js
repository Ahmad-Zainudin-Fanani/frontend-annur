import { Suspense } from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import FoundationStructure from "@/components/organisms/FoundationStructure";

export const metadata = {
  title: "LPPM ANNUR | SD Plus An-Nur",
  description: "Informasi struktur yayasan dan pengurus LPPM ANNUR.",
};

export const instant = false;

export default function LppmAnnurPage() {
  return (
    <MainLayout>
      <HeroTile
        variant="parchment"
        eyebrow="Profil Yayasan"
        title="LPPM ANNUR"
        subtitle="Mengenal struktur yayasan dan jajaran pengurus LPPM ANNUR."
        primaryCtaText="Lihat Pengurus Yayasan"
        primaryCtaHref="#pengurus-yayasan"
      />
      <section id="pengurus-yayasan" className="border-b border-[#f0f0f0] bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.2px] text-[#7a7a7a]">
              Struktur Yayasan
            </span>
            <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[36px]">
              Pengurus Yayasan
            </h2>
          </div>
          <Suspense fallback={(
            <p role="status" className="py-10 text-center text-sm text-[#7a7a7a]">
              Memuat data pengurus yayasan...
            </p>
          )}>
            <FoundationStructure />
          </Suspense>
        </div>
      </section>
    </MainLayout>
  );
}
