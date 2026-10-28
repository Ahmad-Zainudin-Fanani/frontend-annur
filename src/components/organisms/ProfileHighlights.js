import SectionHeader from "@/components/molecules/SectionHeader";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApiState from "@/components/atoms/ApiState";
import { MapPinIcon } from "@/components/atoms/Icons";

export default function ProfileHighlights({
  profile,
  stats,
  error = null,
  showAll = false,
}) {
  if (error) return <ApiState error={error} />;
  if (!profile) return <ApiState empty />;

  const customStats = stats?.custom_stats || profile.stats || {};
  const totals = [
    ["Guru", customStats.teachers ?? stats?.total_teachers, "Tenaga pendidik"],
    ["Siswa Laki-laki", customStats.male_students, "Peserta didik"],
    ["Siswa Perempuan", customStats.female_students, "Peserta didik"],
    ["Total Siswa", customStats.students, "Peserta didik"],
    ["Rombongan Belajar", customStats.class_groups, "Rombel"],
    ["Ruang Kelas", customStats.classrooms, "Ruangan"],
  ].filter(([, value]) => value !== undefined && value !== null);
  const utilityLabels = {
    curriculum: "Kurikulum Pembelajaran",
    schedule: "Waktu Penyelenggaraan",
    internet: "Akses Internet & Jaringan",
    power_source: "Sumber Listrik",
    power_capacity: "Daya Listrik",
    land_area: "Luas Tanah Kampus",
    library_count: "Perpustakaan",
    lab_count: "Laboratorium",
  };
  const utilities = Object.entries(profile.utilities || {}).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
  const leadership = showAll
    ? profile.leadership || []
    : (profile.leadership || []).slice(0, 4);
  const facilities = showAll
    ? profile.facilities || []
    : (profile.facilities || []).slice(0, 4);

  return (
    <div className="w-full">
      <section className="bg-[#f5f5f7] border-y border-[#e0e0e0] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="primary" size="sm" className="mb-2">
              Data Pokok Pendidikan
            </Badge>
            <h2 className="text-[26px] sm:text-[32px] font-semibold text-[#1d1d1f] tracking-tight">
              Statistik &amp; Utilitas {profile.institutionName}
            </h2>
            <p className="text-[15px] text-[#7a7a7a] mt-1">
              {[profile.educationLevel, profile.schoolStatus, profile.semester]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8 apple-product-shadow">
              <h3 className="text-[19px] font-semibold text-[#1d1d1f] pb-4 mb-6 border-b border-[#f0f0f0]">
                Statistik Sekolah
              </h3>
              {totals.length === 0 ? (
                <p className="text-sm text-[#7a7a7a]">Statistik belum tersedia.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {totals.map(([label, value, caption]) => (
                    <div key={label}>
                      <span className="text-[13px] text-[#7a7a7a] block mb-1">
                        {label}
                      </span>
                      <span className="text-[28px] font-semibold text-[#333333] leading-none block">
                        {value}
                      </span>
                      <span className="text-[11px] text-[#7a7a7a] mt-1 block">
                        {caption}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8 apple-product-shadow">
              <h3 className="text-[19px] font-semibold text-[#1d1d1f] pb-4 mb-6 border-b border-[#f0f0f0]">
                Kurikulum &amp; Utilitas Sekolah
              </h3>
              {utilities.length === 0 ? (
                <p className="text-sm text-[#7a7a7a]">Utilitas belum tersedia.</p>
              ) : (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {utilities.map(([key, value]) => (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-[#fafafc] border border-[#f0f0f0]"
                    >
                      <dt className="text-xs text-[#7a7a7a]">
                        {utilityLabels[key] || key}
                      </dt>
                      <dd className="mt-1 font-semibold text-[#1d1d1f]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="sejarah" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <span className="text-[13px] font-semibold text-[#7a7a7a] uppercase tracking-wider">
                Profil Lembaga
              </span>
              <h2 className="mt-3 text-[34px] sm:text-[40px] font-semibold leading-[1.1] text-[#1d1d1f] tracking-tight">
                {profile.institutionName}
              </h2>
              <p className="mt-5 text-[17px] text-[#333333] leading-[1.6]">
                {profile.overview}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                {profile.accreditation ? (
                  <Badge variant="emerald" size="lg">
                    {profile.accreditation}
                  </Badge>
                ) : null}
                {profile.schoolStatus ? (
                  <Badge variant="neutral" size="lg">
                    {profile.schoolStatus}
                  </Badge>
                ) : null}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#7a7a7a]">
                {profile.location.address ? (
                  <span>{profile.location.address}</span>
                ) : null}
                {profile.location.coordinates ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4 text-[#333333]" />
                    {profile.location.coordinates}
                  </span>
                ) : null}
                {profile.location.mapsUrl ? (
                  <a
                    href={profile.location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#333333] hover:underline"
                  >
                    Buka Google Maps
                  </a>
                ) : null}
              </div>
              {profile.history.shortBackground ? (
                <div className="mt-8 rounded-xl bg-[#fafafc] border border-[#e0e0e0] p-5">
                  <p className="text-sm leading-relaxed text-[#555555]">
                    {profile.history.shortBackground}
                  </p>
                  <Button
                    href="/profil/sejarah"
                    variant="secondary-pill"
                    size="sm"
                    className="mt-4"
                  >
                    Sejarah &amp; Kepemimpinan
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div id="visi-misi" className="rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0] p-6">
                <SectionHeader
                  eyebrow="Arah Pendidikan"
                  title={`${profile.visionTitle} & ${profile.missionTitle}`}
                  description={profile.vision || "Visi belum tersedia."}
                />
                {profile.mission.length ? (
                  <ol className="mt-4 space-y-3 text-sm text-[#333333]">
                    {profile.mission.map((mission, index) => (
                      <li key={`${index}-${mission}`} className="flex gap-3">
                        <span className="font-semibold text-[#333333]">
                          {index + 1}.
                        </span>
                        <span>{mission}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ApiState empty />
                )}
              </div>

              {leadership[0] ? (
                <div className="rounded-2xl bg-white border border-[#e0e0e0] p-6">
                  <p className="text-xs font-semibold uppercase text-[#333333]">
                    Kepala Sekolah
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#1d1d1f]">
                    {leadership[0].name}
                  </h3>
                  {leadership[0].bio ? (
                    <p className="mt-2 text-sm text-[#7a7a7a]">
                      {leadership[0].bio}
                    </p>
                  ) : null}
                  <Button
                    href="/profil/kepala-wakil"
                    variant="secondary-pill"
                    size="sm"
                    className="mt-4"
                  >
                    Profil Pimpinan
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          {profile.coreValues.length ? (
            <section className="mt-16 pt-10 border-t border-[#e0e0e0]">
              <h3 className="text-xl font-semibold text-center text-[#1d1d1f] mb-8">
                Nilai Karakter
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {profile.coreValues.map((value) => (
                  <article
                    key={value.code || value.title}
                    className="rounded-xl bg-[#f5f5f7] border border-[#e0e0e0] p-5"
                  >
                    <span className="text-xs font-semibold text-[#333333]">
                      {value.code}
                    </span>
                    <h4 className="mt-2 font-semibold text-[#1d1d1f]">
                      {value.title}
                    </h4>
                    <p className="mt-2 text-sm text-[#7a7a7a]">{value.desc}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {facilities.length ? (
            <section id="fasilitas" className="mt-16">
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-6">
                Fasilitas Sekolah
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facilities.map((facility) => (
                  <article
                    key={facility.name}
                    className="rounded-xl bg-white border border-[#e0e0e0] p-5"
                  >
                    <h4 className="font-semibold text-[#1d1d1f]">
                      {facility.name}
                    </h4>
                    {facility.capacity ? (
                      <p className="mt-1 text-xs text-[#333333]">
                        {facility.capacity}
                      </p>
                    ) : null}
                    {facility.description ? (
                      <p className="mt-2 text-sm text-[#7a7a7a]">
                        {facility.description}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}
