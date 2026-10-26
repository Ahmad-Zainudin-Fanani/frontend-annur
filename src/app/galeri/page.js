import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import GalleryShowcase from "@/components/organisms/GalleryShowcase";
import { publicApi } from "@/data/api";

export const metadata = {
  title: "Galeri Kegiatan | SD Plus An-Nur",
  description:
    "Dokumentasi visual aktivitas belajar, projek, dan kegiatan SD Plus An-Nur.",
};

export const instant = false;

export default async function GaleriPage() {
  let galleries = [];
  let error = null;

  try {
    galleries = await publicApi.galleries();
  } catch (requestError) {
    error = requestError.message;
  }

  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Dokumentasi Visual Sekolah"
        title="Keceriaan &amp; Semangat Belajar Siswa SD Plus An-Nur."
        subtitle="Potret kegiatan belajar, projek, dan keseharian siswa di lingkungan sekolah."
      />
      <GalleryShowcase galleries={galleries} error={error} />
    </MainLayout>
  );
}
