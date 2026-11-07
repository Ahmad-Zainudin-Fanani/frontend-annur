import SectionHeader from "@/components/molecules/SectionHeader";
import CurriculumCard from "@/components/molecules/CurriculumCard";
import ApiState from "@/components/atoms/ApiState";

export default function CurriculumOverview({ curriculum, error = null }) {
  const pillars = curriculum?.pillars ?? [];
  const levels = curriculum?.levels ?? [];

  if (error || (!pillars.length && !levels.length)) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ApiState error={error} empty={!error} />
        </div>
      </section>
    );
  }

  return (
    <div className="bg-white">
      {pillars.length > 0 ? (
        <section id="pilar" className="pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              align="left"
              className="[&_p]:mx-0"
              eyebrow="Integrasi Komprehensif"
              title="Pilar Kurikulum An-Nur"
              description="Memadukan standar kurikulum nasional dengan ilmu syar'i, tahfidz bersanad, bahasa internasional, dan literasi digital abad 21."
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
              {pillars.map((pillar) => (
                <CurriculumCard key={pillar.id} pillar={pillar} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {levels.length > 0 ? (
        <section id="jenjang" className="pb-16 sm:pb-20 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className={pillars.length ? "border-t border-[#e0e0e0] pt-12 lg:pt-16" : "pt-10 sm:pt-12 lg:pt-16"}>
              <SectionHeader
                align="left"
                className="[&_p]:mx-0"
                eyebrow="Tahapan Pembinaan Berkelanjutan"
                title="Fase Belajar & Profil Lulusan"
                description="Rancangan kurikulum bertahap yang disesuaikan dengan perkembangan psikologis, fitrah, dan potensi setiap jenjang usia."
              />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {levels.map((level) => (
                  <CurriculumCard key={level.id} level={level} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
