import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

export const metadata = {
  title: "Galeri Kegiatan | SD Plus An-Nur",
  description: "Dokumentasi visual aktivitas belajar siswa, kegiatan projek P5, pembiasaan shalat berjamaah, dan sarana belajar SD Plus An-Nur (SD Swasta).",
};

export default function GaleriPage() {
  const categories = ["Semua Foto", "Kegiatan Belajar", "Projek P5", "Hafalan Qur'an", "Sarana Sekolah", "Pentas Seni"];

  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Dokumentasi Visual Sekolah"
        title="Keceriaan &amp; Semangat Belajar Siswa SD Plus An-Nur."
        subtitle="Potret keseharian 398 siswa dalam menuntut ilmu, berkreasi dalam projek P5, shalat berjamaah, dan bermain bersama di lingkungan sekolah yang asri."
      />

      <section className="py-16 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className={`px-4 py-2 rounded-full text-[14px] cursor-pointer transition-all ${
                  idx === 0
                    ? "bg-[#1d1d1f] text-white"
                    : "bg-white text-[#1d1d1f] border border-[#e0e0e0] hover:bg-[#fafafc]"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Pembelajaran Aktif Kurikulum SD Merdeka di Ruang Kelas", category: "Kegiatan Belajar" },
              { title: "Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5)", category: "Projek P5" },
              { title: "Bimbingan Tahfidz Juz 30 & Tahsin Al-Qur'an Pagi", category: "Hafalan Qur'an" },
              { title: "Shalat Dhuha & Zhuhur Berjamaah di Musholla", category: "Hafalan Qur'an" },
              { title: "Aktivitas Literasi di Perpustakaan Sekolah", category: "Sarana Sekolah" },
              { title: "Kegiatan Pramuka Siaga & Senam Sehat di Lapangan 1.320 m²", category: "Kegiatan Belajar" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e0e0e0] rounded-[18px] overflow-hidden hover:border-[#1d1d1f] transition-all flex flex-col justify-between"
              >
                <div className="h-56 bg-[#e8e8ed] flex items-center justify-center text-[#7a7a7a] relative">
                  <div className="text-center p-4">
                    <span className="text-3xl block mb-2">📸</span>
                    <span className="text-xs text-[#7a7a7a]">Dokumentasi SD Plus An-Nur #{idx + 1}</span>
                  </div>
                </div>
                <div className="p-5">
                  <Badge variant="primary" size="sm" className="mb-2">
                    {item.category}
                  </Badge>
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f] leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
