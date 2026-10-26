"use client";

import Link from "next/link";
import ScrollReveal from "@/components/atoms/ScrollReveal";
import ApiState from "@/components/atoms/ApiState";
import { BookOpenIcon, AwardIcon, SparklesIcon, BuildingIcon } from "@/components/atoms/Icons";

const icons = [BookOpenIcon, AwardIcon, SparklesIcon, BuildingIcon];

export default function FeaturedPrograms({ curriculum, error = null }) {
  const programs = curriculum?.pillars || [];

  return (
    <section className="py-20 lg:py-24 bg-[#f5f5f7] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="max-w-2xl">
              <span className="text-[13px] font-semibold uppercase text-[#0066cc] mb-3 block">
                Kurikulum &amp; Keunggulan
              </span>
              <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-[#1d1d1f]">
                Program Unggulan
              </h2>
              <p className="mt-3 text-[17px] text-[#7a7a7a] leading-relaxed">
                {curriculum?.overview || "Program belajar sekolah."}
              </p>
            </div>
            <Link href="/kurikulum" className="text-sm font-medium text-[#0066cc] hover:underline">
              Semua Kurikulum →
            </Link>
          </div>
        </ScrollReveal>

        {error ? (
          <ApiState error={error} />
        ) : programs.length === 0 ? (
          <ApiState empty />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program, index) => {
              const Icon = icons[index % icons.length];
              return (
                <ScrollReveal key={program.id} animation="fade-up" delay={index * 80}>
                  <article className="h-full bg-white border border-[#e0e0e0] rounded-[22px] p-7 sm:p-8 apple-product-shadow">
                    <div className="w-12 h-12 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold uppercase text-[#0066cc]">
                      {program.category}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold text-[#1d1d1f]">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-sm text-[#7a7a7a] leading-relaxed">
                      {program.summary}
                    </p>
                    {program.points?.length ? (
                      <ul className="mt-5 space-y-2 text-sm text-[#333333]">
                        {program.points.slice(0, 4).map((point) => (
                          <li key={point} className="flex gap-2">
                            <span className="text-[#0066cc]">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
