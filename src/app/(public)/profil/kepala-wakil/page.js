import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import CTASection from "@/components/organisms/CTASection";
import Image from "next/image";
import ApiState from "@/components/atoms/ApiState";
import { publicApi } from "@/data/api";

export const metadata = {
  title: "Kepala & Wakil Kepala Sekolah | SD Plus An-Nur",
  description:
    "Profil kepala sekolah, wakil kepala sekolah, dan koordinator SD Plus An-Nur.",
};

export const instant = false;

export default async function KepalaWakilPage() {
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

  const principal = profile.leadership[0];
  const principalPhoto = principal?.photo?.endsWith("/images/kepala-sekolah.jpg")
    ? null
    : principal?.photo;
  const vicePrincipals = profile.leadership.slice(1);

  const principalInitials =
    principal?.name
      .replace(/^(?:(?:Ustadz|Ustadzah|Dr|Dra|H|Hj)\.?\s+)+/i, "")
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase() || "AA";

  if (!principal) {
    return (
      <MainLayout>
        <section className="py-20">
          <ApiState empty />
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section id="pimpinan-utama" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SECTION HEADER */}
          <div className="max-w-3xl mb-12">
            <span className="text-[13px] font-semibold uppercase tracking-[0.2px] text-[#7a7a7a] mb-2 block">
              Pimpinan Utama Lembaga
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
              Kepala Sekolah {profile.institutionName}
            </h2>
            <p className="text-[16px] text-[#7a7a7a] mt-2">
              {profile.stats?.students != null
                ? `Pimpinan sekolah membimbing ${profile.stats.students} siswa dalam ${profile.stats.class_groups ?? ""} rombongan belajar.`
                : "Pimpinan sekolah membimbing kegiatan pendidikan dan perkembangan siswa."}
            </p>
          </div>

          {/* FEATURED: KEPALA SEKOLAH */}
          <div className="overflow-hidden rounded-[18px] border border-[#e0e0e0] bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Text Column */}
              <div className="flex flex-col justify-center px-7 py-10 sm:px-12 sm:py-14 lg:col-span-7 lg:px-16 lg:py-16">
                <p className="text-[14px] text-[#7a7a7a]">Kepala Sekolah</p>

                <h3 className="mt-3 text-[32px] sm:text-[40px] lg:text-[44px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-[1.08]">
                  {principal.name}
                </h3>

                <p className="mt-3 text-[15px] leading-[1.47] text-[#7a7a7a]">
                  {principal.role || "Kepala SD Plus An-Nur"}
                  {profile.accreditation ? ` · ${profile.accreditation}` : ""}
                </p>

                {principal.message ? (
                  <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.47] text-[#333333]">
                    {principal.message}
                  </p>
                ) : null}
              </div>

              {/* Photo Column */}
              <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-[#f5f5f7] lg:col-span-5 lg:aspect-auto lg:min-h-[420px]">
                {principalPhoto ? (
                  <Image
                    src={principalPhoto}
                    alt={principal.name}
                    fill
                    unoptimized
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                ) : (
                  <span className="text-[80px] font-semibold tracking-[-0.02em] text-[#86868b]">
                    {principalInitials}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION: WAKIL KEPALA & KOORDINATOR */}
          <div className="mt-20">
            <div className="max-w-3xl mb-10">
              <span className="text-[13px] font-semibold uppercase tracking-[0.2px] text-[#7a7a7a] mb-2 block">
                Jajaran Manajemen Sekolah
              </span>
              <h2 className="text-[26px] sm:text-[32px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                Wakil Kepala Sekolah & Koordinator
              </h2>
              <p className="text-[15px] text-[#7a7a7a] mt-2">
                Pendidik berpengalaman yang mengoordinasikan bidang kurikulum, kesiswaan, keagamaan, dan pembinaan karakter siswa.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {vicePrincipals.map((vp, index) => {
                const initials =
                  vp.name
                    .replace(/^(?:(?:Ustadz|Ustadzah|Dr|Dra|H|Hj)\.?\s+)+/i, "")
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join("")
                    .toUpperCase() || "AA";

                return (
                  <article
                    key={index}
                    className="group flex flex-col overflow-hidden rounded-[18px] border border-[#e0e0e0] bg-white transition-colors duration-200 hover:border-[#1d1d1f]"
                  >
                    {/* Foto / monogram */}
                    <div className="relative flex aspect-4/5 w-full items-center justify-center overflow-hidden border-b border-[#f0f0f0] bg-linear-to-b from-[#f5f5f7] to-[#e8e8ed]">
                      {vp.photo ? (
                        <Image
                          src={vp.photo}
                          alt={vp.name}
                          fill
                          unoptimized
                          className="object-cover object-top"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-[22px] font-semibold tracking-[-0.01em] text-[#333333]">
                          {initials}
                        </div>
                      )}
                    </div>

                    {/* Nama & jabatan */}
                    <div className="flex flex-col items-center px-5 py-5 text-center">
                      <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-[#1d1d1f]">
                        {vp.name}
                      </h3>
                      <p className="mt-1 text-[14px] leading-snug text-[#7a7a7a]">
                        {vp.role}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <CTASection
        theme="neutral"
        eyebrow="Konsultasi & Silaturahmi"
        title="Ingin Berkenalan Lebih Dekat dengan SD Plus An-Nur?"
        description="Pintu komunikasi kami terbuka lebar bagi orang tua murid yang ingin mendiskusikan masa depan pendidikan ananda."
        primaryText="Hubungi Kami"
        primaryHref="/kontak"
        secondaryText=""
        secondaryHref=""
      />
    </MainLayout>
  );
}
