import React from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import ProfileHighlights from "@/components/organisms/ProfileHighlights";
import CTASection from "@/components/organisms/CTASection";
import Badge from "@/components/atoms/Badge";
import ApiState from "@/components/atoms/ApiState";
import { ShieldCheckIcon } from "@/components/atoms/Icons";
import { publicApi } from "@/data/api";

export const metadata = {
  title: "Profil & Kelembagaan | SD Plus An-Nur",
  description:
    "Profil, visi misi, fasilitas, sejarah, dan informasi SD Plus An-Nur.",
};

export const instant = false;

export default async function ProfilPage() {
  let profile = null;
  let stats = null;
  let error = null;

  try {
    [profile, stats] = await Promise.all([
      publicApi.profile(),
      publicApi.stats(),
    ]);
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

  return (
    <MainLayout>
      {/* Light Hero Tile */}
      <HeroTile
        variant="parchment"
        eyebrow="Profil Lembaga Pendidikan"
        title={profile.institutionName}
        subtitle={profile.tagline || profile.overview}
        primaryCtaText="Statistik &amp; Utilitas"
        primaryCtaHref="#sejarah"
        secondaryCtaText="Visi &amp; Misi"
        secondaryCtaHref="#visi-misi"
      >
        <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8 apple-product-shadow max-w-2xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <Badge variant="emerald" size="lg">
              <ShieldCheckIcon className="w-4 h-4" />
              {profile.accreditation}
            </Badge>
            <Badge variant="primary" size="lg">
              {profile.schoolStatus}
            </Badge>
          </div>
          <p className="text-[16px] text-[#1d1d1f] font-medium leading-relaxed mb-4">
            {profile.overview}
          </p>
        </div>
      </HeroTile>

      {/* Comprehensive Profile Sections with Screenshot Stats */}
      <ProfileHighlights profile={profile} stats={stats} showAll={true} />

      {/* Bottom CTA */}
      <CTASection
        theme="dark"
        eyebrow="Silaturahmi &amp; Kunjungan Sekolah"
        title={`Jadwalkan Kunjungan ke ${profile.institutionName}`}
        description={profile.overview}
        primaryText="Hubungi Kami Sekarang"
        primaryHref="/kontak"
        secondaryText={profile.location.mapsUrl ? "Peta Lokasi Google Maps" : "Hubungi Sekolah"}
        secondaryHref={profile.location.mapsUrl || "/kontak"}
      />
    </MainLayout>
  );
}
