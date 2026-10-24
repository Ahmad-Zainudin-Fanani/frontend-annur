import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { AwardIcon, CalendarIcon } from "@/components/atoms/Icons";

export const metadata = {
  title: "Informasi Lomba & Kegiatan | SD Plus An-Nur",
  description: "Jadwal kompetisi sains, olimpiade matematika SD, lomba tahfidz, dan pentas seni pelajar SD Plus An-Nur (SD Swasta).",
};

export default function LombaPage() {
  const upcomingEvents = [
    {
      title: "An-Nur Kids Science & Islamic Festival 2026",
      date: "15 - 18 November 2026",
      level: "Tingkat Kabupaten & Provinsi",
      category: "Sains & Tahfidz",
      status: "Pendaftaran Dibuka",
      desc: "Kompetisi tahunan Musabaqah Hifdzil Qur'an (MHQ) Juz 30, Olimpiade Matematika Nalaria Realistik, dan Lomba Menggambar & Mewarnai Kreatif tingkat SD/MI.",
    },
    {
      title: "Seleksi Olimpiade Sains Nasional (OSN) Tingkat SD",
      date: "Desember 2026",
      level: "Tingkat Kabupaten",
      category: "Matematika & IPA SD",
      status: "Pembinaan Khusus",
      desc: "Bimbingan intensif bagi delegasi siswa SD Plus An-Nur dalam mata pelajaran Matematika dan Ilmu Pengetahuan Alam (IPA).",
    },
    {
      title: "Pentas Seni & Gelar Karya Projek P5 Semester Gasal",
      date: "Januari 2027",
      level: "Tingkat Sekolah",
      category: "Kreativitas & Seni",
      status: "Segera Hadir",
      desc: "Pameran hasil karya siswa dari 13 rombongan belajar, market day kewirausahaan cilik, dan penampilan tari serta puisi islami.",
    },
  ];

  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Pusat Informasi Kompetisi Siswa"
        title="Wadah Berkompetisi &amp; Berkreasi Positif."
        subtitle="Mendorong siswa-siswi SD Plus An-Nur untuk berani menampilkan bakat terbaik, mengasah mental juara, dan menjunjung sportivitas."
      />

      <section className="py-16 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#1d1d1f] transition-all"
              >
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="emerald" size="sm">
                      {event.status}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {event.level}
                    </Badge>
                    <span className="text-[12px] text-[#7a7a7a] flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {event.date}
                    </span>
                  </div>

                  <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">
                    {event.title}
                  </h3>

                  <p className="text-[14px] text-[#7a7a7a] leading-relaxed">
                    {event.desc}
                  </p>
                </div>

                <div className="shrink-0">
                  <Button href="/kontak" variant="primary" size="sm">
                    Detail Informasi →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
