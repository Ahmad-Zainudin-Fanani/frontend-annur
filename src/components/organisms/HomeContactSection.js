"use client";

/**
 * HomeContactSection — Lokasi & Kontak Resmi SD Plus An-Nur
 * - Pertahankan data resmi (alamat, peta embed, WhatsApp/telepon, email, jam layanan)
 * - Tampilan visual editorial terpadu mengikuti DESAIN.md
 * - Animasi GSAP SplitText & ScrollTrigger yang tidak mengganggu interaktivitas peta
 */

import React, { useCallback, useEffect, useRef } from "react";
import Button from "@/components/atoms/Button";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ease } from "@/lib/gsapConfig";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
} from "@/components/atoms/Icons";
import ApiState from "@/components/atoms/ApiState";

const CTA_LABEL = "Formulir Kontak";

export default function HomeContactSection({ profile, error = null }) {
  const sectionRef   = useRef(null);
  const headingRef   = useRef(null);
  const eyebrowRef   = useRef(null);
  const mapColRef    = useRef(null);
  const infoColRef   = useRef(null);
  const splitRef     = useRef(null);
  const ctaFillRef   = useRef(null);
  const ctaClipRef   = useRef(null);
  const ctaStateRef  = useRef({ x: 0, y: 0, radius: 0 });

  // Terapkan lingkaran clip yang sama ke lapisan putih dan teks hitam,
  // sehingga warna teks tampak berubah tepat mengikuti tepi lingkaran.
  const applyCtaClip = useCallback(() => {
    const { x, y, radius } = ctaStateRef.current;
    const clipPath = `circle(${radius}px at ${x}px ${y}px)`;

    if (ctaFillRef.current) ctaFillRef.current.style.clipPath = clipPath;
    if (ctaClipRef.current) ctaClipRef.current.style.clipPath = clipPath;
  }, []);

  const handleCtaEnter = useCallback(
    (event) => {
      const button = event.currentTarget;
      if (!button) return;

      // Koordinat dihitung terhadap padding box (di dalam border 1px),
      // karena lapisan fill dan label overlay diposisikan inset-0 di sana.
      const rect = button.getBoundingClientRect();
      const offsetX = button.clientLeft || 0;
      const offsetY = button.clientTop || 0;
      const width = button.clientWidth || rect.width;
      const height = button.clientHeight || rect.height;
      const x = event.clientX - rect.left - offsetX;
      const y = event.clientY - rect.top - offsetY;
      // Radius = jarak terjauh dari titik cursor ke sudut button.
      const radius =
        Math.hypot(
          Math.max(x, width - x),
          Math.max(y, height - y)
        ) + 2;

      const state = ctaStateRef.current;
      gsap.killTweensOf(state);
      state.x = x;
      state.y = y;
      state.radius = 0;
      applyCtaClip();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        state.radius = radius;
        applyCtaClip();
        return;
      }

      gsap.to(state, {
        radius,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: applyCtaClip,
      });
    },
    [applyCtaClip]
  );

  const handleCtaLeave = useCallback(
    (event) => {
      const button = event.currentTarget;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const offsetX = button.clientLeft || 0;
      const offsetY = button.clientTop || 0;
      const state = ctaStateRef.current;

      gsap.killTweensOf(state);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        state.x = event.clientX - rect.left - offsetX;
        state.y = event.clientY - rect.top - offsetY;
        state.radius = 0;
        applyCtaClip();
        return;
      }

      gsap.to(state, {
        x: event.clientX - rect.left - offsetX,
        y: event.clientY - rect.top - offsetY,
        radius: 0,
        duration: 0.45,
        ease: "power3.inOut",
        onUpdate: applyCtaClip,
      });
    },
    [applyCtaClip]
  );

  useEffect(() => {
    const state = ctaStateRef.current;
    return () => {
      gsap.killTweensOf(state);
    };
  }, []);

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

  const whatsapp = (profile.whatsapp || profile.phone || "").replace(/\D/g, "");
  const whatsappNumber = whatsapp.startsWith("0")
    ? `62${whatsapp.slice(1)}`
    : whatsapp;

  return (
    <section
      ref={sectionRef}
      className="pt-8 sm:pt-12 pb-20 sm:pb-28 bg-white relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <p
            ref={eyebrowRef}
            className="text-[15px] sm:text-[16px] font-semibold tracking-[-0.02em] text-[#86868b] mb-2"
          >
            Lokasi &amp; Kontak Resmi
          </p>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ========================================================
              LEFT COLUMN: Interactive Google Maps Frame (Col 7)
              ======================================================== */}
          <div ref={mapColRef} className="lg:col-span-7 h-full">
            {profile.mapsEmbedUrl ? (
              <div className="relative rounded-[22px] overflow-hidden border border-[#e0e0e0] bg-[#f5f5f7] w-full h-full min-h-100 sm:min-h-120 lg:min-h-0 shadow-sm">
                <iframe
                  title={`Peta Lokasi ${profile.institutionName}`}
                  src={profile.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full absolute inset-0"
                />
              </div>
            ) : (
              <div className="rounded-[22px] border border-[#e0e0e0] bg-[#f5f5f7] min-h-64 flex items-center justify-center h-full">
                <ApiState empty />
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN: Location & Contact Channels (Col 5)
              ======================================================== */}
          <div ref={infoColRef} className="lg:col-span-5 flex flex-col space-y-6">
            {/* 1. Location Description Card */}
            <div className="bg-white border border-[#e0e0e0] rounded-[22px] p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3 text-[#333333]">
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
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#333333] flex items-center justify-center shrink-0">
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
                      className="text-[16px] font-semibold text-[#1d1d1f] hover:text-[#1d1d1f] transition-colors"
                    >
                      {profile.whatsapp || profile.phone}
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Email */}
              {profile.email ? (
                <div className="flex items-start gap-3.5 pt-1">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#333333] flex items-center justify-center shrink-0">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-[#7a7a7a] block uppercase tracking-wider">
                      Email Resmi
                    </span>
                    <a
                      href={profile.email ? `mailto:${profile.email}` : undefined}
                      className="text-[16px] font-semibold text-[#1d1d1f] hover:text-[#1d1d1f] transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Schedule */}
              {(profile.utilities?.schedule || profile.utilities?.service_hours) ? (
                <div className="flex items-start gap-3.5 pt-1">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#333333] flex items-center justify-center shrink-0">
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

              {/* CTA Action Button */}
              <div className="flex justify-start pt-3">
                <Button
                  href="/kontak"
                  variant="secondary"
                  size="md"
                  className="relative w-fit border border-black"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    paddingLeft: "28px",
                    paddingRight: "28px",
                  }}
                  onMouseEnter={handleCtaEnter}
                  onMouseLeave={handleCtaLeave}
                >
                  <span
                    ref={ctaFillRef}
                    aria-hidden="true"
                    style={{ clipPath: "circle(0px at 50% 50%)" }}
                    className="pointer-events-none absolute inset-0 z-0 rounded-full bg-[#000000]"
                  />
                  <span className="relative z-10 font-semibold">{CTA_LABEL}</span>
                  <span
                    ref={ctaClipRef}
                    aria-hidden="true"
                    style={{ clipPath: "circle(0px at 50% 50%)" }}
                    className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center font-semibold text-white"
                  >
                    {CTA_LABEL}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
