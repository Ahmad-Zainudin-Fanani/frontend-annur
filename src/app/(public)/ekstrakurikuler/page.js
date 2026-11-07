import Image from "next/image";
import { redirect } from "next/navigation";
import MainLayout from "@/components/templates/MainLayout";
import Heading from "@/components/atoms/Heading";
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
      <section className="bg-white px-4 pt-16 pb-4 text-center sm:px-6 sm:pt-20 sm:pb-6 lg:px-8 lg:pt-24 lg:pb-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a7a7a]">
            Ekstrakurikuler Siswa
          </p>
          <Heading as="h1" variant="hero-display" className="text-balance">
            Ruang Tumbuh untuk{" "}
            <span className="block">Setiap Bakat.</span>
          </Heading>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-balance text-[#7a7a7a] sm:text-lg lg:text-xl">
            Temukan kegiatan ekstrakurikuler <span className="whitespace-nowrap">SD Plus An-Nur</span> yang mendukung minat, kreativitas, dan pengembangan diri siswa.
          </p>
        </div>
      </section>

      <section aria-label="Daftar ekstrakurikuler" className="bg-white pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {error ? (
            <ApiState error={error} />
          ) : activities.length === 0 ? (
            <p role="status" className="py-10 text-center text-sm text-[#7a7a7a]">
              Belum ada ekstrakurikuler yang dipublikasikan.
            </p>
          ) : (
            <div className="divide-y divide-[#e0e0e0]">
              {activities.map((activity, index) => {
                const [cover, ...photos] = activity.images;
                const titleId = `activity-${activity.id}`;

                return (
                  <article
                    key={activity.id}
                    aria-labelledby={titleId}
                    className="py-10 first:pt-0 last:pb-0 sm:py-14 lg:py-16"
                  >
                    <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
                      {cover ? (
                        <figure className={`order-1 min-w-0 lg:col-span-7 ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f5f5f7] sm:rounded-[24px] lg:aspect-[3/2]">
                            <Image
                              src={cover.url}
                              alt={cover.alt_text}
                              fill
                              unoptimized
                              sizes="(max-width: 1024px) 100vw, 58vw"
                              className="object-cover"
                            />
                          </div>
                        </figure>
                      ) : null}

                      <div className={`min-w-0 ${cover ? `order-2 lg:col-span-5 ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}` : "lg:col-span-12 lg:max-w-3xl"}`}>
                        <Heading id={titleId} as="h2" variant="display-md" className="text-balance break-words">
                          {activity.title}
                        </Heading>
                        {activity.description ? (
                          <p className="mt-4 whitespace-pre-wrap break-words text-base leading-relaxed text-[#7a7a7a] sm:text-lg">
                            {activity.description}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {photos.length > 0 ? (
                      <div className={`mt-6 grid gap-4 sm:mt-8 sm:gap-5 ${photos.length === 1 ? "sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-3"}`}>
                        {photos.map((image) => (
                          <figure key={image.id || image.url} className="min-w-0">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f5f5f7]">
                              <Image
                                src={image.url}
                                alt={image.alt_text}
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                              />
                            </div>
                          </figure>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}

          {!error && meta?.last_page > 1 ? (
            <nav aria-label="Paginasi ekstrakurikuler" className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-[#e0e0e0] pt-8">
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
