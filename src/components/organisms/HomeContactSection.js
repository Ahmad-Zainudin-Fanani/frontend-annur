"use client";

/**
 * HomeContactSection — Lokasi & Kontak Resmi SD Plus An-Nur
 * - Pertahankan data resmi (alamat, peta embed, WhatsApp/telepon, email, jam layanan)
 * - Tampilan visual editorial terpadu mengikuti DESAIN.md
 * - Animasi GSAP SplitText & ScrollTrigger yang tidak mengganggu interaktivitas peta
 */

import React, { useRef } from "react";
import Button from "@/components/atoms/Button";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ease } from "@/lib/gsapConfig";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  ChevronRightIcon,
} from "@/components/atoms/Icons";
import ApiState from "@/components/atoms/ApiState";

export default function HomeContactSection({ profile, error = null }) {
  const sectionRef   = useRef(null);
  const headingRef   = useRef(null);
  const eyebrowRef   = useRef(null);
  const mapColRef    = useRef(null);
  const infoColRef   = useRef(null);
  const splitRef     = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      if (headingRef.current) {
        try {
          splitRef.current = new SplitText(headingRef.current, {
            type: "words,lines",
            linesClass: "overflow-hidden py-0.5",
          });

          gsap.fromTo(
            splitRef.current.words,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: ease.enter,
              stagger: 0.035,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
              },
            }
          );
        } catch {
          gsap.fromTo(
            headingRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: ease.enter,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
              },
            }
          );
        }
      }

      if (eyebrowRef.current) {
        gsap.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: ease.enter,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
            },
          }
        );
      }

      if (mapColRef.current) {
        gsap.fromTo(
          mapColRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: ease.enter,
            scrollTrigger: {
              trigger: mapColRef.current,
              start: "top 85%",
            },
          }
        );
      }

      if (infoColRef.current) {
        gsap.fromTo(
          infoColRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: ease.enter,
            scrollTrigger: {
              trigger: infoColRef.current,
              start: "top 85%",
            },
          }
        );
      }

      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [profile?.name] }
  );

  if (error) return <ApiState error={error} />;
  if (!profile) return <ApiState empty />;

  const mapsExternalUrl = profile.location.mapsUrl;
  const whatsapp = (profile.whatsapp || profile.phone || "").replace(/\D/g, "");
  const whatsappNumber = whatsapp.startsWith("0")
    ? `62${whatsapp.slice(1)}`
    : whatsapp;

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 bg-white border-b border-[#e0e0e0] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <span
            ref={eyebrowRef}
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0066cc] mb-3 px-3.5 py-1 rounded-full border border-[#0066cc]/20 bg-[#f5f5f7]"
          >
            Lokasi &amp; Kontak Resmi
          </span>
          <h2
            ref={headingRef}
            className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-[#1d1d1f] leading-[1.08] tracking-[-0.02em]"
          >
            Kunjungi &amp; Hubungi {profile.institutionName}
          </h2>
          <p className="mt-4 text-[17px] text-[#7a7a7a] leading-[1.47]">
            Temukan lokasi kampus kami di {profile.location.address || "alamat yang terdaftar"} dan hubungi tim layanan sekretariat untuk konsultasi PPDB, silaturahmi, serta kunjungan sekolah.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================
              LEFT COLUMN: Interactive Google Maps Frame (Col 7)
              ======================================================== */}
          <div ref={mapColRef} className="lg:col-span-7">
            {profile.mapsEmbedUrl ? (
              <div className="relative rounded-[22px] overflow-hidden border border-[#e0e0e0] bg-[#f5f5f7] h-[400px] sm:h-[480px] lg:h-[520px] w-full shadow-sm">
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
                  <div className="absolute bottom-5 right-5 z-10">
                    <Button
                      href={mapsExternalUrl}
                      target="_blank"
                      variant="primary"
                      size="sm"
                      className="inline-flex items-center gap-1.5 shadow-lg backdrop-blur-md"
                    >
                      <span>Buka Google Maps</span>
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-[22px] border border-[#e0e0e0] bg-[#f5f5f7] min-h-64 flex items-center justify-center">
                <ApiState empty />
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN: Location & Contact Channels (Col 5)
              ======================================================== */}
          <div ref={infoColRef} className="lg:col-span-5 flex flex-col space-y-6">
            {/* 1. Location Description Card */}
            <div className="bg-[#f5f5f7] border border-[#e0e0e0] rounded-[22px] p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3 text-[#0066cc]">
                <MapPinIcon className="w-5 h-5 shrink-0" />
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">
                  Alamat Kampus
                </h3>
              </div>
              <p className="text-[15px] text-[#333333] leading-relaxed font-medium">
                {profile.location.address}
              </p>
              {profile.location.fullAddress && (
                <div className="mt-4 pt-3.5 border-t border-[#e0e0e0] text-[13px] text-[#7a7a7a]">
                  <strong>Detail:</strong> {profile.location.fullAddress}
                </div>
              )}
            </div>

            {/* 2. Contact Channel List */}
            <div className="bg-white border border-[#e0e0e0] rounded-[22px] p-6 sm:p-7 space-y-5 shadow-sm">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight mb-2 pb-3 border-b border-[#f0f0f0]">
                Sekretariat &amp; Layanan Informasi
              </h3>

              {/* Phone / WhatsApp */}
              {(profile.whatsapp || profile.phone) ? (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0066cc] flex items-center justify-center shrink-0">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-[#7a7a7a] block uppercase tracking-wider">
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
                </div>
              ) : null}

              {/* Email */}
              {profile.email ? (
                <div className="flex items-start gap-3.5 pt-1">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0066cc] flex items-center justify-center shrink-0">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-[#7a7a7a] block uppercase tracking-wider">
                      Email Resmi
                    </span>
                    <a
                      href={profile.email ? `mailto:${profile.email}` : undefined}
                      className="text-[16px] font-semibold text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Schedule */}
              {(profile.utilities?.schedule || profile.utilities?.service_hours) ? (
                <div className="flex items-start gap-3.5 pt-1">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0066cc] flex items-center justify-center shrink-0">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-[#7a7a7a] block uppercase tracking-wider">
                      Jam Layanan Sekolah
                    </span>
                    <span className="text-[14px] text-[#1d1d1f] font-medium block">
                      {profile.utilities.schedule || "Senin - Sabtu"}
                    </span>
                    {profile.utilities.service_hours && (
                      <span className="text-[13px] text-[#7a7a7a] block mt-0.5">
                        {profile.utilities.service_hours}
                      </span>
                    )}
                  </div>
                </div>
              ) : null}

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                {whatsappNumber && (
                  <Button
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                    className="flex-1 text-center"
                  >
                    Chat WhatsApp
                  </Button>
                )}
                <Button
                  href="/kontak"
                  variant="secondary"
                  size="md"
                  className="flex-1 text-center"
                >
                  Formulir Kontak
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
