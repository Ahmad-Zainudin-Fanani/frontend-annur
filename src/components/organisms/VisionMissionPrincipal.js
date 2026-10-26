"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/atoms/ScrollReveal";
import ApiState from "@/components/atoms/ApiState";
import { TargetIcon, ListCheckIcon, ChevronRightIcon } from "@/components/atoms/Icons";

export default function VisionMissionPrincipal({ profile, error = null }) {
  if (error) return <ApiState error={error} />;
  if (!profile) return <ApiState empty />;

  const principal = profile.principal;

  return (
    <section className="py-20 lg:py-24 bg-[#f5f5f7] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-sm font-semibold uppercase text-[#0066cc] mb-3 block">
              Arah Pendidikan &amp; Kepemimpinan
            </span>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-[#1d1d1f]">
              Visi, Misi &amp; Pemimpin Sekolah
            </h2>
            <p className="mt-3 text-[17px] text-[#7a7a7a] leading-relaxed">
              {profile.tagline}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ScrollReveal animation="fade-up" duration={650}>
              <article className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <TargetIcon className="w-6 h-6 text-[#0066cc]" />
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">
                    {profile.visionTitle}
                  </h3>
                </div>
                <p className="text-lg text-[#333333] leading-relaxed">
                  {profile.vision || "Visi belum tersedia."}
                </p>
              </article>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100} duration={650}>
              <article className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <ListCheckIcon className="w-6 h-6 text-[#0066cc]" />
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">
                    {profile.missionTitle}
                  </h3>
                </div>
                {profile.mission.length ? (
                  <ol className="space-y-3 text-sm text-[#333333] leading-relaxed">
                    {profile.mission.map((mission, index) => (
                      <li key={`${index}-${mission}`} className="flex gap-3">
                        <span className="font-semibold text-[#0066cc]">{index + 1}.</span>
                        <span>{mission}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-[#7a7a7a]">Misi belum tersedia.</p>
                )}
              </article>
            </ScrollReveal>
          </div>

          {principal ? (
            <div className="lg:col-span-5">
              <ScrollReveal animation="fade-up" delay={160} duration={650} className="h-full">
                <article className="relative h-full min-h-[440px] rounded-[18px] overflow-hidden border border-[#e0e0e0] bg-[#1d1d1f] flex flex-col justify-end">
                  {principal.photo ? (
                    <Image
                      src={principal.photo}
                      alt={principal.name}
                      fill
                      unoptimized
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="relative z-10 p-6 bg-white/95 border-t border-[#e0e0e0]">
                    {principal.bio ? (
                      <p className="text-sm text-[#555555] italic leading-relaxed mb-3">
                        “{principal.bio}”
                      </p>
                    ) : null}
                    <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[#1d1d1f]">
                          {principal.name}
                        </h3>
                        <p className="text-sm text-[#7a7a7a]">{principal.role}</p>
                      </div>
                      <Link href="/guru" className="text-sm text-[#0066cc] hover:underline inline-flex items-center gap-1">
                        Dewan Guru <ChevronRightIcon className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
