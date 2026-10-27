import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] border-t border-[#e0e0e0] text-[#333333] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top summary disclaimer */}
        <div className="pb-8 mb-10 border-b border-[#e0e0e0]">
          <p className="text-[12px] text-[#7a7a7a] leading-relaxed max-w-4xl">
            Pendidikan dasar yang memadukan kegiatan belajar, pengembangan karakter, minat, dan bakat siswa.
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
                <Link href="/profil/kepala-wakil" className="hover:text-[#0066cc] transition-colors">
                  Pimpinan &amp; Pengelola
                </Link>
              </li>
              <li>
                <Link href="/profil#fasilitas" className="hover:text-[#0066cc] transition-colors">
                  Fasilitas Sekolah
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
            </ul>
          </div>

          {/* Col 3: Guru & Asatidz */}
          <div>
            <h4 className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f] mb-3">
              Dewan Guru
            </h4>
            <ul className="text-[14px] sm:text-[15px] space-y-2.5 text-[#333333]">
              <li>
                <Link href="/guru" className="hover:text-[#0066cc] transition-colors">
                  Direktori Pendidik
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

          {/* Col 5: Sekretariat */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f] mb-3">
              Sekretariat PPDB
            </h4>
            <p className="text-[13px] text-[#7a7a7a] leading-relaxed mb-3">
              Alamat, nomor telepon, email, dan jam layanan tersedia di halaman kontak.
            </p>
            <Link href="/kontak" className="text-[13px] text-[#0066cc] hover:underline">
              Lihat informasi kontak
            </Link>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 border-t border-[#e0e0e0] flex flex-col md:flex-row items-center justify-between text-[12px] text-[#7a7a7a] gap-4">
          <p>
            Hak Cipta SD Plus An-Nur. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/profil" className="hover:text-[#1d1d1f]">
              Profil Sekolah
            </Link>
            <Link href="/kontak" className="hover:text-[#1d1d1f]">
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
