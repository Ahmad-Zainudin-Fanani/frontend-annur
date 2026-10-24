import React from "react";
import Link from "next/link";
import { MapPinIcon, ArrowUpRightIcon } from "@/components/atoms/Icons";

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] border-t border-[#e0e0e0] text-[#333333] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top summary disclaimer */}
        <div className="pb-8 mb-10 border-b border-[#e0e0e0]">
          <p className="text-[12px] text-[#7a7a7a] leading-relaxed max-w-4xl">
            SD Plus An-Nur adalah Sekolah Dasar Swasta (SD Swasta) terakreditasi A yang menerapkan Kurikulum SD Merdeka (pagi / 6 hari), program tahfidzul qur&apos;an Juz 30, serta pembinaan akhlak mulia. Didukung 13 tenaga pendidik profesional yang membimbing 398 peserta didik dalam 13 rombongan belajar di kampus seluas 1.320 m².
          </p>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Profil Sekolah */}
          <div>
            <h4 className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f] mb-3">
              Profil SD Plus An-Nur
            </h4>
            <ul className="text-[14px] sm:text-[15px] space-y-2.5 text-[#333333]">
              <li>
                <Link href="/profil" className="hover:text-[#0066cc] transition-colors">
                  Tentang SD Plus An-Nur
                </Link>
              </li>
              <li>
                <Link href="/profil#sejarah" className="hover:text-[#0066cc] transition-colors">
                  Statistik &amp; Utilitas
                </Link>
              </li>
              <li>
                <Link href="/profil#visi-misi" className="hover:text-[#0066cc] transition-colors">
                  Visi &amp; Misi Sekolah
                </Link>
              </li>
              <li>
                <Link href="/profil#pimpinan" className="hover:text-[#0066cc] transition-colors">
                  Pimpinan &amp; Pengelola
                </Link>
              </li>
              <li>
                <Link href="/profil#fasilitas" className="hover:text-[#0066cc] transition-colors">
                  13 Ruang Kelas &amp; Sarana
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Kurikulum & Akademik */}
          <div>
            <h4 className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f] mb-3">
              Kurikulum SD
            </h4>
            <ul className="text-[14px] sm:text-[15px] space-y-2.5 text-[#333333]">
              <li>
                <Link href="/kurikulum#pilar" className="hover:text-[#0066cc] transition-colors">
                  Kurikulum SD Merdeka
                </Link>
              </li>
              <li>
                <Link href="/kurikulum#pilar" className="hover:text-[#0066cc] transition-colors">
                  Projek Karakter P5
                </Link>
              </li>
              <li>
                <Link href="/kurikulum#pilar" className="hover:text-[#0066cc] transition-colors">
                  Program Tahfidz Juz 30
                </Link>
              </li>
              <li>
                <Link href="/kurikulum#jenjang" className="hover:text-[#0066cc] transition-colors">
                  Fase Belajar (A, B, C)
                </Link>
              </li>
              <li>
                <Link href="/kurikulum#jadwal" className="hover:text-[#0066cc] transition-colors">
                  Jadwal Belajar (Pagi / 6 Hari)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Guru & Asatidz */}
          <div>
            <h4 className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f] mb-3">
              Dewan Guru (13)
            </h4>
            <ul className="text-[14px] sm:text-[15px] space-y-2.5 text-[#333333]">
              <li>
                <Link href="/guru" className="hover:text-[#0066cc] transition-colors">
                  Direktori 13 Pendidik
                </Link>
              </li>
              <li>
                <Link href="/guru" className="hover:text-[#0066cc] transition-colors">
                  Guru Kelas 1 s.d 6
                </Link>
              </li>
              <li>
                <Link href="/guru" className="hover:text-[#0066cc] transition-colors">
                  Guru PAI &amp; Tahfidz
                </Link>
              </li>
              <li>
                <Link href="/guru" className="hover:text-[#0066cc] transition-colors">
                  Guru Bahasa &amp; PJOK
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Prestasi & Kegiatan */}
          <div>
            <h4 className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f] mb-3">
              Prestasi &amp; Info
            </h4>
            <ul className="text-[14px] sm:text-[15px] space-y-2.5 text-[#333333]">
              <li>
                <Link href="/prestasi" className="hover:text-[#0066cc] transition-colors">
                  Galeri Prestasi Siswa
                </Link>
              </li>
              <li>
                <Link href="/lomba" className="hover:text-[#0066cc] transition-colors">
                  Informasi Lomba Siswa
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-[#0066cc] transition-colors">
                  Dokumentasi Kegiatan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Sekretariat & Lokasi Maps */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f] mb-3">
              Sekretariat PPDB
            </h4>
            <p className="text-[13px] text-[#7a7a7a] leading-relaxed mb-2">
              SD Plus An-Nur (SD Swasta), Kediri, Jawa Timur.
            </p>
            <p className="text-[13px] text-[#1d1d1f] font-medium mb-3 flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>Koordinat: -7.8743, 112.1076</span>
            </p>
            <a
              href="https://www.google.com/maps?q=-7.8743,112.1076"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] text-[#0066cc] hover:underline mb-3"
            >
              <span>Petunjuk Arah Google Maps</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </a>
            <p className="text-[13px] text-[#1d1d1f] font-medium">
              WhatsApp: 0812-3456-7890
            </p>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 border-t border-[#e0e0e0] flex flex-col md:flex-row items-center justify-between text-[12px] text-[#7a7a7a] gap-4">
          <p>
            Hak Cipta © 2026 SD Plus An-Nur (Sekolah Dasar Swasta). Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/kontak" className="hover:text-[#1d1d1f]">
              Kebijakan Privasi
            </Link>
            <Link href="/kontak" className="hover:text-[#1d1d1f]">
              Syarat &amp; Ketentuan
            </Link>
            <a
              href="https://www.google.com/maps?q=-7.8743,112.1076"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0066cc]"
            >
              Google Maps (-7.8743, 112.1076)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
