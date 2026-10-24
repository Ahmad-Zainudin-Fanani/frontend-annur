"use client";

import React, { useState } from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { PhoneIcon, MailIcon, MapPinIcon, CheckIcon, ArrowUpRightIcon } from "@/components/atoms/Icons";

export const mapsUrl = "https://www.google.com/maps?q=-7.8743,112.1076";

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    whatsapp: "",
    gradeTarget: "Kelas 1 (Siswa Baru)",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Sekretariat PPDB &amp; Informasi"
        title="Hubungi SD Plus An-Nur (SD Swasta)."
        subtitle="Tim administrasi dan panitia Penerimaan Peserta Didik Baru (PPDB) kami siap melayani pertanyaan seputar kurikulum, pendaftaran siswa, dan jadwal survei sekolah."
      />

      <section className="py-16 lg:py-20 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Information & Google Maps Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8 apple-product-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[20px] font-semibold text-[#1d1d1f]">
                    Lokasi SD Plus An-Nur
                  </h3>
                  <Badge variant="primary" size="sm">
                    SD Swasta
                  </Badge>
                </div>

                <div className="flex items-start gap-3 text-[15px] text-[#333333] mb-4">
                  <MapPinIcon className="w-5 h-5 text-[#0066cc] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#1d1d1f]">Alamat Kampus:</span>
                    <span>SD Plus An-Nur, Kediri, Jawa Timur</span>
                    <span className="text-[13px] text-[#7a7a7a] block mt-1">
                      Koordinat: -7.8743, 112.1076
                    </span>
                  </div>
                </div>

                {/* Direct Google Maps Action Button */}
                <div className="p-4 rounded-xl bg-[#fafafc] border border-[#f0f0f0] mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[12px] text-[#7a7a7a] block">Google Maps Resmi</span>
                      <span className="text-[14px] font-semibold text-[#1d1d1f]">Buka Petunjuk Arah</span>
                    </div>
                    <Button
                      href={mapsUrl}
                      target="_blank"
                      variant="primary"
                      size="sm"
                      className="inline-flex items-center gap-1.5"
                    >
                      <span>Buka Maps</span>
                      <ArrowUpRightIcon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#f0f0f0] text-[15px]">
                  <div className="flex items-center gap-3 text-[#333333]">
                    <PhoneIcon className="w-5 h-5 text-[#0066cc] shrink-0" />
                    <span>WhatsApp / Telepon: 0812-3456-7890</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#333333]">
                    <MailIcon className="w-5 h-5 text-[#0066cc] shrink-0" />
                    <span>info@sdplusannur.sch.id</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">
                  Waktu Operasional Pelayanan
                </h3>
                <ul className="space-y-2 text-[14px] text-[#7a7a7a]">
                  <li className="flex justify-between">
                    <span>Penyelenggaraan Sekolah:</span>
                    <strong className="text-[#1d1d1f]">Pagi / 6 Hari</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Senin - Kamis:</span>
                    <strong className="text-[#1d1d1f]">07.00 - 15.00 WIB</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Jumat:</span>
                    <strong className="text-[#1d1d1f]">07.00 - 11.30 WIB</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Sabtu:</span>
                    <strong className="text-[#1d1d1f]">07.00 - 13.00 WIB</strong>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Contact / PPDB Form */}
            <div className="lg:col-span-7 bg-white border border-[#e0e0e0] rounded-2xl p-8 lg:p-10 apple-product-shadow">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#ecfdf5] text-[#065f46] flex items-center justify-center mx-auto mb-4">
                    <CheckIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-[24px] font-semibold text-[#1d1d1f] mb-2">
                    Terima Kasih!
                  </h3>
                  <p className="text-[16px] text-[#7a7a7a] max-w-md mx-auto mb-6">
                    Pesan dan formulir pendaftaran konsultasi Anda telah kami terima. Tim sekretariat SD Plus An-Nur akan segera menghubungi Anda melalui WhatsApp.
                  </p>
                  <Button
                    variant="pearl-capsule"
                    onClick={() => setSubmitted(false)}
                  >
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-[24px] font-semibold text-[#1d1d1f] mb-2">
                      Formulir Pertanyaan &amp; PPDB
                    </h3>
                    <p className="text-[14px] text-[#7a7a7a]">
                      Silakan isi formulir di bawah ini untuk konsultasi pendaftaran siswa baru atau jadwal survei sekolah.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-1.5">
                      Nama Orang Tua / Wali Siswa
                    </label>
                    <Input
                      id="parentName"
                      name="parentName"
                      required
                      placeholder="Contoh: Bapak Ahmad Syarif"
                      value={formData.parentName}
                      onChange={(e) =>
                        setFormData({ ...formData, parentName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-1.5">
                      Nomor WhatsApp Aktif
                    </label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-1.5">
                      Kelas yang Dituju
                    </label>
                    <select
                      className="w-full h-[44px] px-5 bg-white text-[#1d1d1f] text-[15px] rounded-full border border-[#e0e0e0] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all cursor-pointer"
                      value={formData.gradeTarget}
                      onChange={(e) =>
                        setFormData({ ...formData, gradeTarget: e.target.value })
                      }
                    >
                      <option value="Kelas 1 (Siswa Baru)">Kelas 1 (Peserta Didik Baru)</option>
                      <option value="Kelas 2 (Pindahan)">Kelas 2 (Siswa Pindahan)</option>
                      <option value="Kelas 3 (Pindahan)">Kelas 3 (Siswa Pindahan)</option>
                      <option value="Kelas 4 (Pindahan)">Kelas 4 (Siswa Pindahan)</option>
                      <option value="Kelas 5 (Pindahan)">Kelas 5 (Siswa Pindahan)</option>
                      <option value="Informasi Umum & Survei">Informasi Umum &amp; Jadwal Kunjungan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold text-[#1d1d1f] mb-1.5">
                      Pesan atau Pertanyaan Khusus
                    </label>
                    <textarea
                      rows={4}
                      className="w-full p-4 bg-white text-[#1d1d1f] text-[15px] rounded-2xl border border-[#e0e0e0] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                      placeholder="Tuliskan pertanyaan seputar syarat pendaftaran, kurikulum, atau biaya pendidikan..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Kirim Formulir Konsultasi
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
