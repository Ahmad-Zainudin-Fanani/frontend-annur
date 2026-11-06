import Image from "next/image";
import { redirect } from "next/navigation";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import Button from "@/components/atoms/Button";
import ApiState from "@/components/atoms/ApiState";
import { publicApi } from "@/data/api";

export const metadata = {
  title: "Ekstrakurikuler | SD Plus An-Nur",
  description:
    "Kenali kegiatan ekstrakurikuler SD Plus An-Nur untuk mengembangkan minat, bakat, dan kreativitas siswa.",
};

export const instant = false;

export default async function EkstrakurikulerPage({ searchParams }) {
  const params = await searchParams;
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  let activities = [];
  let meta = null;
  let error = null;

  try {
    const response = await publicApi.extracurriculars({ page, per_page: 10 });
    activities = response.data;
    meta = response.meta;
  } catch (requestError) {
    error = requestError.message;
  }

  if (!error && meta && page > Math.max(1, meta.last_page)) {
    redirect(`/ekstrakurikuler?page=${Math.max(1, meta.last_page)}`);
  }

  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Ekstrakurikuler Siswa"
        title="Ruang Tumbuh untuk Setiap Bakat."
        subtitle="Temukan kegiatan ekstrakurikuler SD Plus An-Nur yang mendukung minat, kreativitas, dan pengembangan diri siswa."
      />

      <section aria-label="Daftar ekstrakurikuler" className="py-16 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <ApiState error={error} />
          ) : activities.length === 0 ? (
            <p role="status" className="py-10 text-center text-sm text-[#7a7a7a]">
              Belum ada ekstrakurikuler yang dipublikasikan.
            </p>
          ) : (
            <div className="space-y-6">
              {activities.map((activity) => (
                <article
                  key={activity.id}
                  className="overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white p-6 sm:p-8"
                >
                  <h2 className="text-xl font-semibold text-[#1d1d1f]">
                    {activity.title}
                  </h2>
                  {activity.description ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-[#7a7a7a] leading-relaxed">
                      {activity.description}
                    </p>
                  ) : null}

                  {activity.images.length > 0 ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {activity.images.map((image) => (
                        <figure key={image.id || image.url}>
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e8e8ed]">
                            <Image
                              src={image.url}
                              alt={image.alt_text}
                              fill
                              unoptimized
                              sizes="(max-width: 640px) 100vw, 50vw"
                              className="object-cover"
                            />
                          </div>
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}

          {!error && meta?.last_page > 1 ? (
            <nav aria-label="Paginasi ekstrakurikuler" className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {page > 1 ? (
                <Button href={`/ekstrakurikuler?page=${page - 1}`} variant="neutral-outline" size="sm">
                  Sebelumnya
                </Button>
              ) : null}
              <span className="text-sm text-[#7a7a7a]" aria-live="polite">
                Halaman {page} dari {meta.last_page}
              </span>
              {page < meta.last_page ? (
                <Button href={`/ekstrakurikuler?page=${page + 1}`} variant="neutral-outline" size="sm">
                  Berikutnya
                </Button>
              ) : null}
            </nav>
          ) : null}
        </div>
      </section>
    </MainLayout>
  );
}
