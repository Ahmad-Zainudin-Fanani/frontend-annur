import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import CTASection from "@/components/organisms/CTASection";
import Button from "@/components/atoms/Button";
import ApiState from "@/components/atoms/ApiState";
import HistoryJourneyMotion from "@/components/organisms/HistoryJourneyMotion";
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
      {/* 1. SECTION: KAPAN SEKOLAH DIBANGUN & BACKGROUND SINGKAT + JOURNEY CARDS */}
      <section id="linimasa" className="py-16 lg:py-24 bg-white border-b border-[#e0e0e0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 max-w-2xl">
            <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7a7a7a]">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-[#7a7a7a]"
              />
              Sejarah Berdiri
            </span>
            <h1 className="text-[28px] sm:text-[38px] font-semibold leading-tight tracking-tight text-[#1d1d1f]">
              Awal Pendirian &amp; Latar Belakang
            </h1>
            <p className="mt-2 text-[16px] leading-relaxed text-[#7a7a7a]">
              Berawal dari cita-cita luhur melahirkan generasi Qur&apos;ani yang cerdas dan berakhlak mulia di Kediri.
            </p>
          </div>

          {/* Waypoint cards — satu penanda berlian berjalan dari tonggak ke tonggak */}
          {history.milestones.length ? (
            <HistoryJourneyMotion>
              <span
                data-history-diamond
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-20 block opacity-0"
              >
                <span className="block h-[24px] w-[24px] rotate-45 rounded-[6px] bg-[#1d1d1f] shadow-[0_8px_22px_rgba(0,0,0,0.24)] sm:h-[26px] sm:w-[26px]" />
              </span>

              <ol data-history-journey className="relative flex flex-col gap-12 md:gap-16 lg:gap-20">
                {history.milestones.map((item, idx) => {
                  const number = String(idx + 1).padStart(2, "0");
                  const alignLeft = idx % 2 === 0;

                  return (
                    <li
                      key={`${item.date}-${idx}`}
                      data-history-step
                      className={`relative w-full md:w-[78%] ${
                        alignLeft ? "md:self-start" : "md:self-end"
                      }`}
                    >
                      <article
                        data-history-card
                        className="group relative flex items-center rounded-[26px] border border-[#e0e0e0] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-500 hover:border-[#d2d2d7] hover:shadow-[0_24px_64px_-38px_rgba(0,0,0,0.32)] data-[active=true]:border-[#d2d2d7] data-[active=true]:shadow-[0_26px_70px_-40px_rgba(0,0,0,0.34)] sm:p-8 md:p-10"
                      >
                        {/* Slot penanda (waypoint) */}
                        <div
                          data-history-marker
                          aria-hidden="true"
                          className={`absolute top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-[16px] border border-[#e0e0e0] bg-[#f5f5f7] transition-colors duration-500 group-data-[active=true]:border-[#d2d2d7] group-data-[active=true]:bg-white sm:h-16 sm:w-16 sm:rounded-[18px] ${
                            alignLeft
                              ? "left-4 sm:left-6"
                              : "right-4 sm:right-6"
                          }`}
                        >
                          <span
                            data-history-glyph
                            className="h-3 w-3 rotate-45 rounded-[2px] bg-[#c7c7cc] sm:h-3.5 sm:w-3.5"
                          />
                        </div>

                        <div
                          className={
                            alignLeft
                              ? "w-full pl-[64px] sm:pl-[88px]"
                              : "w-full pr-[64px] sm:pr-[88px]"
                          }
                        >
                          <div
                            data-history-reveal
                            className="flex flex-wrap items-center gap-x-3 gap-y-2"
                          >
                            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#7a7a7a]">
                              Tonggak {number}
                            </span>
                            {item.badge ? (
                              <span className="inline-flex items-center rounded-full border border-[#e0e0e0] bg-[#f5f5f7] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#555555]">
                                {item.badge}
                              </span>
                            ) : null}
                          </div>

                          <h3
                            data-history-reveal
                            className="mt-3 text-[23px] font-semibold leading-[1.16] tracking-tight text-[#1d1d1f] sm:text-[29px] lg:text-[32px]"
                          >
                            {item.title}
                          </h3>

                          <p
                            data-history-reveal
                            className="mt-2.5 text-[15px] font-semibold tabular-nums text-[#333333] sm:text-[16px]"
                          >
                            {item.date}
                          </p>

                          <p
                            data-history-reveal
                            className="mt-2 max-w-2xl text-[15px] leading-[1.7] text-[#7a7a7a] sm:text-[16px] lg:text-[17px]"
                          >
                            {item.desc}
                          </p>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </HistoryJourneyMotion>
          ) : (
            <ApiState empty />
          )}

          {/* Ringkasan latar belakang */}
          <div className="mt-16 grid gap-5 rounded-[22px] border border-[#e0e0e0] bg-[#f5f5f7] p-6 sm:p-8 md:grid-cols-[220px_1fr] md:gap-10 lg:p-10">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a7a7a]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-[#7a7a7a]"
                />
                Ikhtisar Ringkas
              </p>
              {history.foundingYear ? (
                <p className="mt-2 text-[15px] font-semibold leading-snug text-[#1d1d1f]">
                  Didirikan tahun {history.foundingYear}
                </p>
              ) : null}
            </div>
            <p className="text-[15px] leading-relaxed text-[#333333] sm:text-[16px]">
              {history.shortBackground || "Informasi sejarah belum tersedia."}
            </p>
          </div>
        </div>
      </section>

      {/* 2. SECTION: REKAM JEJAK KEPEMIMPINAN SD PLUS AN-NUR */}
      <section id="kepemimpinan" className="border-b border-[#e0e0e0] bg-[#f5f5f7] py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7a7a7a]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-[#7a7a7a]"
                />
                Kepemimpinan
              </span>
              <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[38px]">
                Daftar Kepala Sekolah
              </h2>
              <p className="mt-2 text-[16px] leading-relaxed text-[#7a7a7a]">
                Rekam jejak kepemimpinan SD Plus An-Nur dari masa ke masa.
              </p>
            </div>
            {history.leadershipTrackRecord.length ? (
              <span className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7a7a7a]">
                {String(history.leadershipTrackRecord.length).padStart(2, "0")} Periode
              </span>
            ) : null}
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
                      className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#e0e0e0] bg-[#f5f5f7] text-[12px] font-semibold tabular-nums text-[#7a7a7a] sm:mt-0 sm:h-12 sm:w-12 sm:rounded-[14px]"
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
