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
import ApiState from "@/components/atoms/ApiState";

export default function HomeContactSection({ profile, error = null }) {
  if (error) return <ApiState error={error} />;
  if (!profile) return <ApiState empty />;

  const mapsExternalUrl = profile.location.mapsUrl;
  const whatsapp = (profile.whatsapp || profile.phone || "").replace(/\D/g, "");
  const whatsappNumber = whatsapp.startsWith("0")
    ? `62${whatsapp.slice(1)}`
    : whatsapp;

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
              Kunjungi {profile.institutionName}
            </h2>
            <p className="mt-3 text-[17px] text-[#7a7a7a] leading-[1.47] tracking-[-0.374px]">
              Temukan lokasi kampus kami di {profile.location.address || "alamat yang terdaftar"} dan hubungi tim layanan sekretariat untuk informasi pendaftaran, kurikulum, serta kunjungan sekolah.
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
              {profile.mapsEmbedUrl ? (
              <div className="relative rounded-[18px] overflow-hidden border border-[#e0e0e0] bg-[#f5f5f7] h-[380px] sm:h-[460px] lg:h-[480px] w-full">
                <iframe
                  title={`Peta Lokasi ${profile.institutionName}`}
                  src={profile.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />

                {/* Direct Google Maps Action Button at Bottom Right */}
                {mapsExternalUrl ? (
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
                ) : null}
              </div>
              ) : (
                <div className="rounded-[18px] border border-[#e0e0e0] bg-[#f5f5f7] min-h-48 flex items-center justify-center">
                  <ApiState empty />
                </div>
              )}
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
                  {profile.location.address}
                </p>
                <div className="mt-4 pt-3.5 border-t border-[#e0e0e0] text-[13px] text-[#7a7a7a]">
                  <strong>Alamat:</strong> {profile.location.fullAddress}
                </div>
              </div>

              {/* 2. Contact Channel List */}
              <div className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 sm:p-7 space-y-4">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
                  Layanan Sekretariat &amp; PPDB
                </h3>

                {(profile.whatsapp || profile.phone) ? <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0066cc] flex items-center justify-center shrink-0">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[12px] font-medium text-[#7a7a7a] block uppercase tracking-wider">
                      WhatsApp &amp; Telepon
                    </span>
                    <a
                      href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[16px] font-semibold text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
                    >
                      {profile.whatsapp || profile.phone}
                    </a>
                  </div>
                </div> : null}

                {profile.email ? <div className="flex items-start gap-3.5 pt-2">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0066cc] flex items-center justify-center shrink-0">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[12px] font-medium text-[#7a7a7a] block uppercase tracking-wider">
                      Email Resmi
                    </span>
                    <a
                      href={profile.email ? `mailto:${profile.email}` : undefined}
                      className="text-[16px] font-semibold text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div> : null}

                {(profile.utilities.schedule || profile.utilities.service_hours) ? <div className="flex items-start gap-3.5 pt-2">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0066cc] flex items-center justify-center shrink-0">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[12px] font-medium text-[#7a7a7a] block uppercase tracking-wider">
                      Jam Layanan Sekolah
                    </span>
                    <span className="text-[14px] text-[#1d1d1f] font-medium block">
                      {profile.utilities.schedule || ""}
                    </span>
                    <span className="text-[13px] text-[#7a7a7a] block">
                      {profile.utilities.service_hours}
                    </span>
                  </div>
                </div> : null}
              </div>

              {/* 3. Fast Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "/kontak"}
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
