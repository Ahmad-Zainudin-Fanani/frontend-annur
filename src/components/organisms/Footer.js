import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/atoms/Icons";

export default function Footer() {
  return (
    <footer className="relative bg-[#f5f5f7] border-t-2 border-[#e0e0e0] text-[#333333] pt-16 sm:pt-20 pb-12 select-none">
      {/* Visual Accent Hairline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Summary & Identity */}
        <div className="pb-8 mb-10 border-b border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <span className="text-[14px] font-semibold tracking-tight text-[#1d1d1f] block mb-1">
              SD PLUS AN-NUR
            </span>
            <p className="text-[12px] sm:text-[13px] text-[#7a7a7a] leading-relaxed">
              Lembaga pendidikan dasar Islam yang mengintegrasikan Kurikulum Merdeka, Tahfidz Al-Qur&apos;an, dan pembiasaan adab islami dalam ekosistem belajar yang ramah anak dan berdaya saing global.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/kontak"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#333333] hover:underline"
            >
              <span>Hubungi Sekretariat</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Structured Multi-Column Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-14">
          {/* Col 1: Profil Sekolah */}
          <div>
            <h4 className="text-[13px] font-semibold tracking-tight text-[#1d1d1f] uppercase mb-4">
              Profil Lembaga
            </h4>
            <ul className="text-[13px] sm:text-[14px] space-y-2.5 text-[#555555]">
              <li>
                <Link href="/profil" className="hover:text-[#1d1d1f] transition-colors">
                  Tentang SD Plus An-Nur
                </Link>
              </li>
              <li>
                <Link href="/profil/sejarah" className="hover:text-[#1d1d1f] transition-colors">
                  Sejarah &amp; Rekam Jejak
                </Link>
              </li>
              <li>
                <Link href="/profil/kepala-wakil" className="hover:text-[#1d1d1f] transition-colors">
                  Kepala &amp; Wakil Kepala
                </Link>
              </li>
              <li>
                <Link href="/profil#fasilitas" className="hover:text-[#1d1d1f] transition-colors">
                  Fasilitas Sekolah
                </Link>
              </li>
              <li>
                <Link href="/profil/tim-pengembang" className="hover:text-[#1d1d1f] transition-colors">
                  Tim Pengembang WEB
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Kurikulum & Akademik */}
          <div>
            <h4 className="text-[13px] font-semibold tracking-tight text-[#1d1d1f] uppercase mb-4">
              Kurikulum
            </h4>
            <ul className="text-[13px] sm:text-[14px] space-y-2.5 text-[#555555]">
              <li>
                <Link href="/kurikulum" className="hover:text-[#1d1d1f] transition-colors">
                  Kurikulum SD Merdeka
                </Link>
              </li>
              <li>
                <Link href="/kurikulum#pilar" className="hover:text-[#1d1d1f] transition-colors">
                  Projek Karakter P5
                </Link>
              </li>
              <li>
                <Link href="/kurikulum#pilar" className="hover:text-[#1d1d1f] transition-colors">
                  Program Tahfidz Qur&apos;an
                </Link>
              </li>
              <li>
                <Link href="/kurikulum#jenjang" className="hover:text-[#1d1d1f] transition-colors">
                  Fase Pembelajaran
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Guru & Pendidik */}
          <div>
            <h4 className="text-[13px] font-semibold tracking-tight text-[#1d1d1f] uppercase mb-4">
              Tenaga Pendidik
            </h4>
            <ul className="text-[13px] sm:text-[14px] space-y-2.5 text-[#555555]">
              <li>
                <Link href="/guru" className="hover:text-[#1d1d1f] transition-colors">
                  Direktori Guru
                </Link>
              </li>
              <li>
                <Link href="/guru" className="hover:text-[#1d1d1f] transition-colors">
                  Guru Kelas 1 s.d 6
                </Link>
              </li>
              <li>
                <Link href="/guru" className="hover:text-[#1d1d1f] transition-colors">
                  Guru PAI &amp; Tahfidz
                </Link>
              </li>
              <li>
                <Link href="/guru" className="hover:text-[#1d1d1f] transition-colors">
                  Guru Bidang Studi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Prestasi & Informasi */}
          <div>
            <h4 className="text-[13px] font-semibold tracking-tight text-[#1d1d1f] uppercase mb-4">
              Prestasi &amp; Agenda
            </h4>
            <ul className="text-[13px] sm:text-[14px] space-y-2.5 text-[#555555]">
              <li>
                <Link href="/prestasi" className="hover:text-[#1d1d1f] transition-colors">
                  Torehan Prestasi Siswa
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-[#1d1d1f] transition-colors">
                  Galeri Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="/lomba" className="hover:text-[#1d1d1f] transition-colors">
                  Informasi Lomba Siswa
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Layanan PPDB */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-[13px] font-semibold tracking-tight text-[#1d1d1f] uppercase mb-4">
              Pendaftaran (PPDB)
            </h4>
            <p className="text-[12px] sm:text-[13px] text-[#7a7a7a] leading-relaxed mb-3">
              Informasi persyaratan pendaftaran, jadwal seleksi, dan biaya pendidikan dapat dikonsultasikan melalui sekretariat.
            </p>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#333333] hover:underline"
            >
              <span>Konsultasi Pendaftaran</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 border-t border-[#e0e0e0] flex flex-col md:flex-row items-center justify-between text-[12px] text-[#7a7a7a] gap-4">
          <p>
            Hak Cipta SD Plus An-Nur. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center space-x-6 text-[12px]">
            <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
              Beranda
            </Link>
            <Link href="/profil" className="hover:text-[#1d1d1f] transition-colors">
              Profil
            </Link>
            <Link href="/kurikulum" className="hover:text-[#1d1d1f] transition-colors">
              Kurikulum
            </Link>
            <Link href="/kontak" className="hover:text-[#1d1d1f] transition-colors">
              Kontak &amp; Lokasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
