"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Badge from "@/components/atoms/Badge";
import ApiState from "@/components/atoms/ApiState";

export default function GalleryShowcase({ galleries = [], error = null }) {
  const [category, setCategory] = useState("Semua Foto");
  const categories = [
    "Semua Foto",
    ...new Set(galleries.map((item) => item.category).filter(Boolean)),
  ];
  const filteredGalleries = useMemo(
    () =>
      category === "Semua Foto"
        ? galleries
        : galleries.filter((item) => item.category === category),
    [category, galleries]
  );

  return (
    <section className="py-16 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error ? (
          <ApiState error={error} />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    category === item
                      ? "bg-[#1d1d1f] text-white"
                      : "bg-white text-[#1d1d1f] border border-[#e0e0e0] hover:bg-[#fafafc]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {filteredGalleries.length === 0 ? (
              <ApiState empty />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGalleries.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white border border-[#e0e0e0] rounded-[18px] overflow-hidden hover:border-[#1d1d1f] transition-all"
                  >
                    <div className="relative h-56 bg-[#e8e8ed]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <Badge variant="primary" size="sm" className="mb-2">
                        {item.category}
                      </Badge>
                      <h2 className="text-base font-semibold text-[#1d1d1f] leading-snug">
                        {item.title}
                      </h2>
                      {item.description ? (
                        <p className="mt-2 text-sm text-[#7a7a7a]">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
