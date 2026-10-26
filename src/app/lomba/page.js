import Image from "next/image";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApiState from "@/components/atoms/ApiState";
import { CalendarIcon } from "@/components/atoms/Icons";
import { publicApi } from "@/data/api";

export const metadata = {
  title: "Informasi Lomba & Kegiatan | SD Plus An-Nur",
  description:
    "Informasi kompetisi, pendaftaran, dan kegiatan SD Plus An-Nur.",
};

export const instant = false;

function formatDate(value) {
  if (!value) return "Jadwal belum ditentukan";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

export default async function LombaPage() {
  let competitions = [];
  let error = null;

  try {
    competitions = await publicApi.competitions();
  } catch (requestError) {
    error = requestError.message;
  }

  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Pusat Informasi Kompetisi Siswa"
        title="Wadah Berkompetisi &amp; Berkreasi Positif."
        subtitle="Informasi kegiatan dan kompetisi yang dikelola SD Plus An-Nur."
      />

      <section className="py-16 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <ApiState error={error} />
          ) : competitions.length === 0 ? (
            <ApiState empty />
          ) : (
            <div className="space-y-6">
              {competitions.map((event) => (
                <article
                  key={event.id}
                  className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#1d1d1f] transition-all"
                >
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {event.status ? (
                        <Badge variant="emerald" size="sm">
                          {event.status}
                        </Badge>
                      ) : null}
                      {event.level ? (
                        <Badge variant="neutral" size="sm">
                          {event.level}
                        </Badge>
                      ) : null}
                      <span className="text-xs text-[#7a7a7a] flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {formatDate(event.event_date)}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">
                      {event.title}
                    </h2>
                    <p className="text-sm text-[#7a7a7a] leading-relaxed">
                      {event.description}
                    </p>
                    {event.organizer ? (
                      <p className="mt-3 text-xs text-[#7a7a7a]">
                        Penyelenggara: {event.organizer}
                      </p>
                    ) : null}
                    {event.registration_deadline ? (
                      <p className="mt-1 text-xs text-[#7a7a7a]">
                        Batas pendaftaran: {formatDate(event.registration_deadline)}
                      </p>
                    ) : null}
                  </div>

                  {event.guide_book_url || event.banner_image ? (
                    <div className="flex shrink-0 flex-col gap-3">
                      {event.banner_image ? (
                        <div className="relative h-28 w-44 overflow-hidden rounded-xl bg-[#e8e8ed]">
                          <Image
                            src={event.banner_image}
                            alt={event.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      {event.guide_book_url ? (
                        <Button
                          href={event.guide_book_url}
                          target="_blank"
                          variant="primary"
                          size="sm"
                        >
                          Buku Panduan
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
