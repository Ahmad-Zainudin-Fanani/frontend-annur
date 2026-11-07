"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import ApiState from "@/components/atoms/ApiState";

export default function GalleryShowcase({ galleries = [], error = null }) {
  const [category, setCategory] = useState("Semua Foto");
  // Hanya kategori ini yang ditampilkan sebagai tombol filter.
  const visibleCategories = ["Kegiatan Belajar", "Sarana Sekolah"];
  const categories = [
    "Semua Foto",
    ...visibleCategories.filter((item) =>
      galleries.some((gallery) => gallery.category === item)
    ),
  ];
  const filteredGalleries = useMemo(
    () =>
      category === "Semua Foto"
        ? galleries
        : galleries.filter((item) => item.category === category),
    [category, galleries]
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error ? (
          <ApiState error={error} />
        ) : (
          <>
            <div aria-label="Filter kategori galeri" className="mb-8 flex items-center justify-start gap-6 overflow-x-auto border-b border-[#e0e0e0] sm:mb-10 sm:gap-8">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  aria-controls="gallery-results"
                  className={`shrink-0 border-b-2 px-1 pt-2 pb-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7a7a7a] ${
                    category === item
                      ? "border-[#1d1d1f] font-semibold text-[#1d1d1f]"
                      : "border-transparent font-medium text-[#7a7a7a] hover:border-[#d2d2d7] hover:text-[#1d1d1f]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div id="gallery-results" aria-live="polite">
              {filteredGalleries.length === 0 ? (
                <ApiState empty />
              ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
                  {filteredGalleries.map((item) => (
                    <article key={item.id} aria-labelledby={`gallery-title-${item.id}`} className="min-w-0">
                      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-[#f5f5f7] sm:rounded-[24px]">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1280px) 33vw, 384px"
                          />
                        ) : (
                          <span className="text-sm text-[#7a7a7a]">Foto belum tersedia</span>
                        )}
                      </div>
                      <div className="pt-5 sm:pt-6">
                        {item.category ? (
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a7a7a]">
                            {item.category}
                          </p>
                        ) : null}
                        <h2 id={`gallery-title-${item.id}`} className="break-words text-xl font-semibold leading-snug tracking-tight text-[#1d1d1f] sm:text-2xl">
                          {item.title}
                        </h2>
                        {item.description ? (
                          <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-[#7a7a7a] sm:text-base">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
