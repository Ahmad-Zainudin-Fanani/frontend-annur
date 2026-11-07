import MainLayout from "@/components/templates/MainLayout";
import Heading from "@/components/atoms/Heading";
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
      <section className="bg-white px-4 pt-16 pb-4 text-center sm:px-6 sm:pt-20 sm:pb-6 lg:px-8 lg:pt-24 lg:pb-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a7a7a]">
            Dokumentasi Visual Sekolah
          </p>
          <Heading as="h1" variant="hero-display" className="text-balance">
            Keceriaan &amp; Semangat Belajar{" "}
            <span className="block">
              Siswa SD Plus <span className="whitespace-nowrap">An-Nur.</span>
            </span>
          </Heading>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-balance text-[#7a7a7a] sm:text-lg lg:text-xl">
            Potret kegiatan belajar, projek, dan keseharian siswa di lingkungan sekolah.
          </p>
        </div>
      </section>
      <GalleryShowcase galleries={galleries} error={error} />
    </MainLayout>
  );
}
