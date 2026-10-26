import React from "react";
import SectionHeader from "@/components/molecules/SectionHeader";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { profileData } from "@/data/profileData";
import {
  UsersIcon,
  BookOpenIcon,
  BuildingIcon,
  ShieldCheckIcon,
  SparklesIcon,
  MapPinIcon,
  ArrowUpRightIcon,
  CheckIcon,
} from "@/components/atoms/Icons";

export default function ProfileHighlights({ showAll = false }) {
  const displayedLeadership = showAll
    ? profileData.leadership
    : profileData.leadership.slice(0, 4);

  const displayedFacilities = showAll
    ? profileData.facilities
    : profileData.facilities.slice(0, 4);

  return (
    <div className="w-full">
      {/* 1. Official School Statistics & Utilities (Reference Screenshot Data) */}
      <section className="bg-[#f5f5f7] border-y border-[#e0e0e0] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="primary" size="sm" className="mb-2">
              Data Pokok Pendidikan (Dapodik) Resmi
            </Badge>
            <h2 className="text-[26px] sm:text-[32px] font-semibold text-[#1d1d1f] tracking-tight">
              Statistik &amp; Utilitas SD Plus An-Nur
            </h2>
            <p className="text-[15px] text-[#7a7a7a] mt-1">
              Status: Sekolah Dasar Swasta (SD Swasta) • Semester 2026/2027 Gasal
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Box 1: Statistik Sekolah */}
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8 apple-product-shadow">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#f0f0f0]">
                <h3 className="text-[19px] font-semibold text-[#1d1d1f]">
                  Statistik Sekolah
                </h3>
                <span className="text-[12px] bg-[#f5f5f7] px-2.5 py-1 rounded text-[#7a7a7a]">
                  Total 398 Siswa
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#f0f0f0]">
                {/* Guru */}
                <div className="pt-2 sm:pt-0 sm:px-2 text-center sm:text-left">
                  <span className="text-[13px] text-[#7a7a7a] block mb-1">Guru</span>
                  <span className="text-[32px] font-semibold text-[#0066cc] leading-none block">
                    13
                  </span>
                  <span className="text-[11px] text-[#7a7a7a] mt-1 block">Tenaga Pendidik</span>
                </div>

                {/* Siswa Laki-laki */}
                <div className="pt-2 sm:pt-0 sm:px-3 text-center sm:text-left">
                  <span className="text-[13px] text-[#7a7a7a] block mb-1">Siswa Laki-laki</span>
                  <span className="text-[32px] font-semibold text-[#0066cc] leading-none block">
                    193
                  </span>
                  <span className="text-[11px] text-[#7a7a7a] mt-1 block">Peserta Didik</span>
                </div>

                {/* Siswa Perempuan */}
                <div className="pt-2 sm:pt-0 sm:px-3 text-center sm:text-left">
                  <span className="text-[13px] text-[#7a7a7a] block mb-1">Siswa Perempuan</span>
                  <span className="text-[32px] font-semibold text-[#0066cc] leading-none block">
                    205
                  </span>
                  <span className="text-[11px] text-[#7a7a7a] mt-1 block">Peserta Didik</span>
                </div>

                {/* Rombel */}
                <div className="pt-2 sm:pt-0 sm:px-3 text-center sm:text-left">
                  <span className="text-[13px] text-[#7a7a7a] block mb-1">Rombongan Belajar</span>
                  <span className="text-[32px] font-semibold text-[#0066cc] leading-none block">
                    13
                  </span>
                  <span className="text-[11px] text-[#7a7a7a] mt-1 block">Rombel Kelas 1-6</span>
                </div>
              </div>

              {/* Sub-row: Ruang Kelas, Lab, Perpustakaan, Daya Tampung */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-[#f0f0f0] text-[13px]">
                <div>
                  <span className="text-[#7a7a7a] block mb-1">Ruang Kelas</span>
                  <span className="text-[20px] font-semibold text-[#1d1d1f]">13</span>
                </div>
                <div>
                  <span className="text-[#7a7a7a] block mb-1">Perpustakaan</span>
                  <span className="text-[20px] font-semibold text-[#1d1d1f]">1 Unit</span>
                </div>
                <div>
                  <span className="text-[#7a7a7a] block mb-1">Laboratorium</span>
                  <span className="text-[20px] font-semibold text-[#7a7a7a]">0</span>
                </div>
                <div>
                  <span className="text-[#7a7a7a] block mb-1">Daya Tampung</span>
                  <span className="text-[15px] font-semibold text-[#0066cc]">13 Rombel</span>
                </div>
              </div>
            </div>

            {/* Box 2: Kurikulum dan Utilitas */}
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8 apple-product-shadow">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#f0f0f0]">
                <h3 className="text-[19px] font-semibold text-[#1d1d1f]">
                  Kurikulum &amp; Utilitas Sekolah
                </h3>
                <span className="text-[12px] bg-[#ecfdf5] text-[#065f46] px-2.5 py-1 rounded font-medium">
                  Operasional Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafafc] border border-[#f0f0f0]">
                  <BookOpenIcon className="w-5 h-5 text-[#0066cc] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] text-[#7a7a7a] block">Kurikulum Pembelajaran</span>
                    <strong className="text-[#1d1d1f] font-semibold">Kurikulum SD Merdeka</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafafc] border border-[#f0f0f0]">
                  <BuildingIcon className="w-5 h-5 text-[#0066cc] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] text-[#7a7a7a] block">Waktu Penyelenggaraan</span>
                    <strong className="text-[#1d1d1f] font-semibold">Pagi / 6 hari</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafafc] border border-[#f0f0f0]">
                  <SparklesIcon className="w-5 h-5 text-[#0066cc] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] text-[#7a7a7a] block">Akses Internet &amp; Jaringan</span>
                    <strong className="text-[#1d1d1f] font-semibold">Shared</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafafc] border border-[#f0f0f0]">
                  <ShieldCheckIcon className="w-5 h-5 text-[#0066cc] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] text-[#7a7a7a] block">Sumber &amp; Daya Listrik</span>
                    <strong className="text-[#1d1d1f] font-semibold">PLN (3.500 VA)</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafafc] border border-[#f0f0f0] sm:col-span-2">
                  <MapPinIcon className="w-5 h-5 text-[#0066cc] shrink-0 mt-0.5" />
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <span className="text-[12px] text-[#7a7a7a] block">Luas Tanah Kampus</span>
                      <strong className="text-[#1d1d1f] font-semibold">1.320 m²</strong>
                    </div>
                    <a
                      href={profileData.location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[13px] text-[#0066cc] hover:underline font-medium"
                    >
                      <span>Buka Google Maps</span>
                      <ArrowUpRightIcon className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Overview & Status SD Swasta Unggulan */}
      <section id="sejarah" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[13px] font-semibold text-[#0066cc] uppercase tracking-wider">
                  SD Swasta Unggulan
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[13px] text-[#7a7a7a]">
                  Kediri, Jawa Timur
                </span>
              </div>

              <h2 className="text-[34px] sm:text-[40px] font-semibold leading-[1.1] text-[#1d1d1f] tracking-tight mb-6">
                Mendidik dengan Hati, Menumbuhkan Generasi Berakhlak
              </h2>

              <p className="text-[17px] text-[#333333] leading-[1.6] tracking-[-0.374px] mb-6">
                {profileData.overview}
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge variant="emerald" size="lg">
                  <ShieldCheckIcon className="w-4 h-4" />
                  {profileData.accreditation}
                </Badge>
                <Badge variant="primary" size="lg">
                  Kurikulum SD Merdeka
                </Badge>
                <Badge variant="neutral" size="lg">
                  Status: Swasta
                </Badge>
              </div>

              {/* Sejarah & Rekam Jejak Callout Button */}
              <div className="mb-6 p-4 rounded-xl bg-[#fafafc] border border-[#e0e0e0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[12px] text-[#0066cc] font-semibold uppercase block">
                    Sejarah &amp; Pendirian
                  </span>
                  <span className="text-[14px] text-[#1d1d1f] font-medium block">
                    Didirikan 12 Juli 2012 • 3 Periode Kepala Sekolah
                  </span>
                </div>
                <Button
                  href="/profil/sejarah"
                  variant="primary"
                  size="sm"
                  className="shrink-0 text-[13px]"
                >
                  Buka Linimasa &amp; Kepemimpinan →
                </Button>
              </div>

              {/* Direct Maps Link Block */}
              <div className="p-4 rounded-xl bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-[#0066cc]" />
                  <div>
                    <span className="text-[12px] text-[#7a7a7a] block">Lokasi Sekolah:</span>
                    <span className="text-[14px] font-medium text-[#1d1d1f]">
                      Koordinat: {profileData.location.coordinates}
                    </span>
                  </div>
                </div>
                <Button
                  href={profileData.location.mapsUrl}
                  target="_blank"
                  variant="secondary-pill"
                  size="sm"
                >
                  Peta Lokasi ↗
                </Button>
              </div>
            </div>

            {/* Visual Pedestal Card with Apple signature shadow */}
            <div className="lg:col-span-6">
              <div className="bg-[#f5f5f7] border border-[#e0e0e0] rounded-2xl p-8 lg:p-10 apple-product-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold text-lg">
                    ن
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#1d1d1f]">
                      SD Plus An-Nur
                    </h3>
                    <p className="text-[13px] text-[#7a7a7a]">
                      Sekolah Dasar Swasta • Karakter &amp; Prestasi
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-[#e0e0e0]">
                    <div className="text-[13px] font-semibold text-[#0066cc] uppercase mb-1">
                      Kurikulum Merdeka
                    </div>
                    <div className="text-[15px] font-medium text-[#1d1d1f] mb-1">
                      Pagi / 6 Hari
                    </div>
                    <p className="text-[13px] text-[#7a7a7a]">
                      Pendekatan pembelajaran aktif, diferensiasi, serta penguatan Projek P5 tematik.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-[#e0e0e0]">
                    <div className="text-[13px] font-semibold text-[#0066cc] uppercase mb-1">
                      Tahfidz Juz 30
                    </div>
                    <div className="text-[15px] font-medium text-[#1d1d1f] mb-1">
                      Tartil &amp; Munaqasyah
                    </div>
                    <p className="text-[13px] text-[#7a7a7a]">
                      Target tuntas hafalan Juz 30 dan surat-surat pilihan dengan tajwid yang benar.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-[#e0e0e0]">
                    <div className="text-[13px] font-semibold text-[#0066cc] uppercase mb-1">
                      Pembiasaan Ibadah
                    </div>
                    <div className="text-[15px] font-medium text-[#1d1d1f] mb-1">
                      Dhuha &amp; Zhuhur
                    </div>
                    <p className="text-[13px] text-[#7a7a7a]">
                      Shalat berjamaah harian di musholla sekolah, doa, dzikir, dan adab sopan santun.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-[#e0e0e0]">
                    <div className="text-[13px] font-semibold text-[#0066cc] uppercase mb-1">
                      13 Rombel &amp; 13 Guru
                    </div>
                    <div className="text-[15px] font-medium text-[#1d1d1f] mb-1">
                      Rasio Terbimbing
                    </div>
                    <p className="text-[13px] text-[#7a7a7a]">
                      Pendampingan telaten bagi 398 siswa putra dan putri dalam suasana ramah anak.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Visi & Misi — Alternating Dark Tile (#272729) */}
      <section id="visi-misi" className="py-20 lg:py-24 bg-[#272729] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Arah &amp; Komitmen Sekolah"
            title="Visi &amp; Misi SD Plus An-Nur"
            description="Membentuk generasi cemerlang berakhlakul karimah dan siap berprestasi di tingkat lanjutan."
            theme="dark"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Visi */}
            <div className="lg:col-span-5 bg-[#2a2a2c] border border-[#333333] rounded-[18px] p-8">
              <span className="text-[13px] font-semibold text-[#2997ff] uppercase tracking-wider block mb-3">
                Visi Sekolah
              </span>
              <p className="text-[20px] sm:text-[22px] font-normal leading-[1.5] text-white">
                &ldquo;{profileData.vision}&rdquo;
              </p>
            </div>

            {/* Misi */}
            <div className="lg:col-span-7 bg-[#2a2a2c] border border-[#333333] rounded-[18px] p-8">
              <span className="text-[13px] font-semibold text-[#2997ff] uppercase tracking-wider block mb-4">
                Misi Pendidikan
              </span>
              <ul className="space-y-4">
                {profileData.mission.map((misi, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-[15px] sm:text-[16px] text-[#cccccc] leading-[1.5]">
                    <span className="w-6 h-6 rounded-full bg-[#2997ff]/20 text-[#2997ff] flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{misi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nilai-nilai Kelembagaan */}
          <div className="pt-10 border-t border-[#3a3a3c]">
            <h3 className="text-[21px] font-semibold text-center text-white mb-8 tracking-wide">
              Lima Nilai Karakter SD Plus An-Nur
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {profileData.coreValues.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-[#2a2a2c] border border-[#3a3a3c] rounded-[14px] p-5 hover:border-[#2997ff] transition-colors"
                >
                  <div className="text-[12px] font-bold tracking-widest text-[#2997ff] uppercase mb-1">
                    {val.code}
                  </div>
                  <div className="text-[16px] font-semibold text-white mb-2">
                    {val.title}
                  </div>
                  <p className="text-[13px] text-[#cccccc] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dewan Pimpinan & Pendidik — Parchment (#f5f5f7) */}
      <section id="pimpinan" className="py-20 lg:py-24 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Kepemimpinan Penuh Dedikasi"
            title="Pimpinan &amp; Pengelola Sekolah"
            description="Dipimpin oleh tenaga pendidik profesional dan berpengalaman di dunia pendidikan dasar Islam."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedLeadership.map((leader, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 flex flex-col justify-between hover:border-[#1d1d1f] transition-all"
              >
                <div>
                  <div className="w-14 h-14 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center text-[#0066cc] font-bold text-lg mb-4">
                    {leader.name
                      .replace(/^(Ustadz|Ustadzah|H\.|Hj\.)\s+/gi, "")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <h3 className="text-[17px] font-semibold leading-tight text-[#1d1d1f] mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-[14px] text-[#0066cc] font-medium mb-3">
                    {leader.role}
                  </p>
                  <p className="text-[13px] text-[#7a7a7a] mb-2 leading-snug">
                    <strong className="text-[#333333]">Pendidikan:</strong> {leader.education}
                  </p>
                  <p className="text-[13px] text-[#7a7a7a] mb-4 leading-snug">
                    <strong className="text-[#333333]">Pengalaman:</strong> {leader.experience}
                  </p>
                </div>
                <p className="text-[13px] text-[#333333] pt-3 border-t border-[#f0f0f0] italic leading-relaxed">
                  &ldquo;{leader.bio}&rdquo;
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              href="/profil/kepala-wakil"
              variant="secondary-pill"
              size="md"
            >
              Lihat Halaman Khusus Kepala &amp; Wakil Kepala →
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Fasilitas Kampus */}
      <section id="fasilitas" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Sarana Prasarana Belajar"
            title="Fasilitas Pembelajaran SD Plus An-Nur"
            description="Dilengkapi 13 ruang kelas representatif, perpustakaan terpadu, dan lahan seluas 1.320 m² untuk aktivitas bermain dan olahraga anak."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedFacilities.map((fac, idx) => (
              <div
                key={idx}
                className="bg-[#fafafc] border border-[#e0e0e0] rounded-[18px] p-6 sm:p-7 hover:border-[#0066cc] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-[#e0e0e0] flex items-center justify-center text-[#0066cc] mb-4">
                  <BuildingIcon className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-[#1d1d1f] mb-2">
                  {fac.name}
                </h3>
                <Badge variant="neutral" size="sm" className="mb-3">
                  {fac.capacity}
                </Badge>
                <p className="text-[14px] text-[#7a7a7a] leading-relaxed">
                  {fac.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
