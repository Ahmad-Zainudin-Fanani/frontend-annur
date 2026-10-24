"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import ScrollReveal from "@/components/atoms/ScrollReveal";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  ChevronRightIcon,
} from "@/components/atoms/Icons";
import { profileData } from "@/data/profileData";

export default function HomeContactSection() {
  const mapsEmbedUrl =
    "https://maps.google.com/maps?q=-7.8743,112.1076&hl=id&z=15&output=embed";
  const mapsExternalUrl = profileData.location.mapsUrl;

  return (
    <section className="py-20 lg:py-24 bg-white border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.2px] text-[#0066cc] mb-3 block select-none">
              Lokasi &amp; Kontak Resmi
            </span>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-[#1d1d1f] leading-[1.1] tracking-normal">
              Kunjungi Kampus SD Plus An-Nur
            </h2>
            <p className="mt-3 text-[17px] text-[#7a7a7a] leading-[1.47] tracking-[-0.374px]">
              Temukan lokasi kampus kami di Kabupaten Kediri dan hubungi tim layanan sekretariat untuk informasi pendaftaran, kurikulum, serta kunjungan sekolah.
            </p>
          </div>
        </ScrollReveal>

        {/* 2-Column Responsive Layout strictly adhering to DESIGN.md */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================
              LEFT COLUMN: Interactive Google Maps Frame
              ======================================================== */}
          <div className="lg:col-span-7">
            <ScrollReveal animation="fade-up" delay={80} duration={650}>
              <div className="relative rounded-[18px] overflow-hidden border border-[#e0e0e0] bg-[#f5f5f7] h-[380px] sm:h-[460px] lg:h-[480px] w-full">
                <iframe
                  title="Peta Lokasi SD Plus An-Nur"
                  src={mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />

                {/* Direct Google Maps Action Button at Bottom Right */}
                <div className="absolute bottom-4 right-4 z-10">
                  <Button
                    href={mapsExternalUrl}
                    target="_blank"
                    variant="primary"
                    size="sm"
                    className="inline-flex items-center gap-1"
                  >
                    <span>Buka Google Maps</span>
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Deskripsi Lokasi & Informasi Kontak
              ======================================================== */}
          <div className="lg:col-span-5">
            <ScrollReveal animation="fade-up" delay={160} duration={650} className="flex flex-col space-y-6">
              {/* 1. Brief Location Description Card */}
              <div className="bg-[#f5f5f7] border border-[#e0e0e0] rounded-[18px] p-6 sm:p-7">
                <div className="flex items-center gap-2.5 mb-2.5 text-[#0066cc]">
                  <MapPinIcon className="w-5 h-5 shrink-0" />
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">
                    Deskripsi Lokasi Kampus
                  </h3>
                </div>
                <p className="text-[15px] text-[#555555] leading-relaxed">
                  SD Plus An-Nur berlokasi di kawasan asri Kecamatan Kras, Kabupaten Kediri. Suasana lingkungan yang tenang, jauh dari kebisingan jalan raya utama, sangat aman, sejuk, dan kondusif untuk mendukung kegiatan belajar mengajar serta pembiasaan ibadah harian peserta didik.
                </p>
                <div className="mt-4 pt-3.5 border-t border-[#e0e0e0] text-[13px] text-[#7a7a7a]">
                  <strong>Alamat:</strong> {profileData.location.fullAddress}
                </div>
              </div>

              {/* 2. Contact Channel List */}
              <div className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 sm:p-7 space-y-4">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
                  Layanan Sekretariat &amp; PPDB
                </h3>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0066cc] flex items-center justify-center shrink-0">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[12px] font-medium text-[#7a7a7a] block uppercase tracking-wider">
                      WhatsApp &amp; Telepon
                    </span>
                    <a
                      href="https://wa.me/6281234567890?text=Halo%20SD%20Plus%20An-Nur,%20saya%20ingin%20bertanya%20seputar%20pendaftaran%20siswa%20baru"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[16px] font-semibold text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
                    >
                      0812-3456-7890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0066cc] flex items-center justify-center shrink-0">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[12px] font-medium text-[#7a7a7a] block uppercase tracking-wider">
                      Email Resmi
                    </span>
                    <a
                      href="mailto:info@sdplusannur.sch.id"
                      className="text-[16px] font-semibold text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
                    >
                      info@sdplusannur.sch.id
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0066cc] flex items-center justify-center shrink-0">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[12px] font-medium text-[#7a7a7a] block uppercase tracking-wider">
                      Jam Layanan Sekolah
                    </span>
                    <span className="text-[14px] text-[#1d1d1f] font-medium block">
                      Pagi / 6 Hari (Senin - Sabtu)
                    </span>
                    <span className="text-[13px] text-[#7a7a7a] block">
                      Senin - Kamis: 07.00 - 15.00 WIB • Jumat: 07.00 - 11.30 WIB
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Fast Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  href="https://wa.me/6281234567890?text=Halo%20SD%20Plus%20An-Nur,%20saya%20ingin%20informasi%20seputar%20sekolah"
                  target="_blank"
                  variant="primary"
                  size="md"
                  className="flex-1"
                >
                  Chat WhatsApp
                </Button>
                <Button
                  href="/kontak"
                  variant="secondary-pill"
                  size="md"
                  className="flex-1"
                >
                  Formulir PPDB
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
