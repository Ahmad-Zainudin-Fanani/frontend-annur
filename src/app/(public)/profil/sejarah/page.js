import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import CTASection from "@/components/organisms/CTASection";
import Button from "@/components/atoms/Button";
import ApiState from "@/components/atoms/ApiState";
import HistoryTimeline from "@/components/organisms/HistoryTimeline";
import { publicApi } from "@/data/api";

export const metadata = {
  title: "Sejarah & Rekam Jejak Kepemimpinan | SD Plus An-Nur",
  description:
    "Sejarah berdirinya SD Plus An-Nur, background pendirian, serta rekam jejak kepemimpinan Kepala Sekolah dari masa ke masa di Kediri, Jawa Timur.",
};

export const instant = false;

export default async function SejarahPage() {
  let profile = null;
  let error = null;

  try {
    profile = await publicApi.profile();
  } catch (requestError) {
    error = requestError.message;
  }

  if (!profile) {
    return (
      <MainLayout>
        <section className="py-20">
          <ApiState error={error} empty={!error} />
        </section>
      </MainLayout>
    );
  }

  const { history } = profile;

  return (
    <MainLayout>
      {/* 1. SECTION: SEJARAH BERDIRI — horizontal historical timeline */}
      <HistoryTimeline history={history} />

      {/* 2. SECTION: REKAM JEJAK KEPEMIMPINAN SD PLUS AN-NUR */}
      <section id="kepemimpinan" className="bg-white pb-16 pt-6 lg:pb-24 lg:pt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7a7a7a]">
                Kepemimpinan
              </span>
              <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[38px]">
                Daftar Kepala Sekolah
              </h2>
              <p className="mt-2 text-[16px] leading-relaxed text-[#7a7a7a]">
                Rekam jejak kepemimpinan SD Plus An-Nur dari masa ke masa.
              </p>
            </div>
          </div>

          {/* Daftar kepemimpinan */}
          <div className="overflow-hidden rounded-[22px] border border-[#e0e0e0] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            {history.leadershipTrackRecord.length ? (
              <ul className="divide-y divide-[#f0f0f0]">
                {history.leadershipTrackRecord.map((record) => (
                  <li
                    key={record.no}
                    className="flex items-start gap-4 px-5 py-5 transition-colors duration-300 hover:bg-[#fafafc] sm:items-center sm:gap-5 sm:px-8 sm:py-6"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e0e0e0] bg-[#f5f5f7] text-[12px] font-semibold tabular-nums text-[#7a7a7a] sm:mt-0 sm:h-12 sm:w-12 sm:rounded-[14px]"
                    >
                      {String(record.no ?? "").padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                        <div className="min-w-0">
                          <h3 className="text-[16px] font-semibold leading-snug text-[#1d1d1f] sm:text-[17px]">
                            {record.name}
                          </h3>
                          {record.status ? (
                            <p className="mt-1 text-[12.5px] leading-snug text-[#7a7a7a] sm:text-[13px]">
                              {record.status}
                            </p>
                          ) : null}
                        </div>

                        {record.period ? (
                          <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-[#e0e0e0] bg-[#f5f5f7] px-2.5 py-0.5 text-[11.5px] font-semibold tabular-nums text-[#333333] sm:text-[12px]">
                            {record.period}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6">
                <ApiState empty />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        theme="neutral"
        eyebrow="Silaturahmi & Kunjungan"
        title="Mengenal Lebih Dekat Budaya Sekolah Kami"
        description="SD Plus An-Nur terus berinovasi menjaga amanah para pendahulu dalam mendidik generasi Qur'ani yang berakhlak mulia."
        primaryText="Hubungi Kami"
        primaryHref="/kontak"
        secondaryText="Kembali ke Profil Sekolah"
        secondaryHref="/profil"
      />
    </MainLayout>
  );
}
