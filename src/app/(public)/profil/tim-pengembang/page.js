import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import CTASection from "@/components/organisms/CTASection";

export const metadata = {
  title: "Tim Pengembang WEB | SD Plus An-Nur",
  description:
    "Tim Pengembang website resmi SD Plus An-Nur yang berdedikasi membangun platform informasi sekolah modern, responsif, dan aman.",
};

const devTeam = [
  {
    name: "Fanani",
    role: "Profil, Guru & Konten Publik",
    scope: "Halaman Profil, Direktori Dewan Guru, Kepala & Wakil Kepala, Kurikulum, dan Prestasi",
  },
  {
    name: "Adit",
    role: "Galeri & Layanan Informasi",
    scope: "Galeri Dokumentasi, Informasi Lomba, serta Kontak & Lokasi",
  },
  {
    name: "Rapi",
    role: "Admin, CMS & CRM",
    scope: "Panel Admin, Manajemen Konten (CMS), dan Layanan Calon Siswa (CRM)",
  },
];

export default function TimPengembangPage() {
  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Inovasi & Digitalisasi Pendidikan"
        title="Tim Pengembang WEB SD Plus An-Nur"
        subtitle="Kolaborasi tim pengembang dalam merancang website resmi berstandar modern, elegan, dan ramah pengguna dengan prinsip Atomic Design."
        primaryCtaText="Lihat Tim Pengembang"
        primaryCtaHref="#tim"
        secondaryCtaText="Kembali ke Beranda"
        secondaryCtaHref="/"
      />

      <section id="tim" className="py-16 lg:py-20 bg-[#f5f5f7] border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[13px] font-semibold uppercase tracking-[0.2px] text-[#7a7a7a] mb-2 block">
              Kolaborasi &amp; Arsitektur
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Struktur Pembagian Tugas Pengembang
            </h2>
            <p className="text-[16px] text-[#7a7a7a] mt-2">
              Bekerja secara sinergis full-stack untuk menghadirkan pengalaman digital terbaik bagi seluruh sivitas akademika SD Plus An-Nur.
            </p>
          </div>

          {/* Cards styled consistently with Dewan Guru (3:4 portrait avatar + Name + Role/Scope) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl">
            {devTeam.map((member, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e0e0e0] rounded-[20px] overflow-hidden flex flex-col apple-product-shadow transition-all duration-200 hover:border-[#1d1d1f] hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Top: Portrait Placeholder (3:4 aspect ratio) identical to Teacher Card */}
                <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-[#f0f4f8] via-[#e8eff8] to-[#dce7f5] flex items-center justify-center overflow-hidden border-b border-[#e0e0e0]">
                  <div className="flex flex-col items-center justify-center text-center select-none">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-[#e0e0e0] shadow-xs flex items-center justify-center mb-2.5 text-[#333333] font-bold text-3xl">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[12px] font-medium text-[#7a7a7a]">
                      SD Plus An-Nur Web Team
                    </span>
                  </div>
                </div>

                {/* Details: Only Name and Role/Scope */}
                <div className="p-5 text-center flex flex-col justify-center min-h-[96px]">
                  <h3 className="text-[17px] font-bold text-[#1d1d1f] leading-snug tracking-[-0.2px] mb-1.5">
                    {member.name}
                  </h3>
                  <p className="text-[14px] text-[#333333] font-medium leading-snug">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        theme="dark"
        eyebrow="Komitmen Kualitas"
        title="Dukungan &amp; Pengembangan Berkelanjutan"
        description="Aplikasi web SD Plus An-Nur dibangun dengan standar Atomic Design, responsivitas tinggi, dan performa optimal."
        primaryText="Kunjungi Laman Utama"
        primaryHref="/"
        secondaryText="Hubungi Kami"
        secondaryHref="/kontak"
      />
    </MainLayout>
  );
}
