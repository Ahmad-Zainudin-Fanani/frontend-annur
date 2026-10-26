"use client";

import React, { useState, useMemo } from "react";
import SectionHeader from "@/components/molecules/SectionHeader";
import AchievementCard from "@/components/molecules/AchievementCard";
import SearchBar from "@/components/molecules/SearchBar";
import Chip from "@/components/atoms/Chip";
import Button from "@/components/atoms/Button";
import ApiState from "@/components/atoms/ApiState";

export default function AchievementsShowcase({
  achievements = [],
  initialLimit,
  error = null,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const achievementCategories = [
    "Semua",
    ...new Set(achievements.map((item) => item.category).filter(Boolean)),
  ];

  const filteredAchievements = useMemo(() => {
    return achievements.filter((item) => {
      const matchCat =
        selectedCategory === "Semua" || item.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [achievements, searchQuery, selectedCategory]);

  const displayedAchievements = initialLimit
    ? filteredAchievements.slice(0, initialLimit)
    : filteredAchievements;

  return (
    <section id="prestasi" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Prestasi Siswa SD Plus An-Nur"
          title="Torehan Prestasi Tingkat Kabupaten"
          description="Apresiasi atas dedikasi dan kerja keras siswa-siswi SD Plus An-Nur dalam ajang perlombaan akademik (OSN), keagamaan (Pentas PAI &amp; MHQ), seni (FLS2N), dan olahraga (O2SN) tingkat kabupaten."
        />

        {/* Minimalist Controls: Single Category Tab Row & Compact Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Single clean category filter bar */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full md:w-auto">
            {achievementCategories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
                className={selectedCategory === cat ? "!bg-[#0066cc] !border-[#0066cc]" : ""}
              />
            ))}
          </div>

          {/* Simple compact search */}
          <div className="w-full md:w-72 shrink-0">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              placeholder="Cari prestasi atau nama siswa..."
            />
          </div>
        </div>

        {/* Minimal Counter */}
        <div className="flex items-center justify-between text-[13px] text-[#7a7a7a] mb-6">
          <span>
            Menampilkan <strong className="text-[#1d1d1f] font-semibold">{displayedAchievements.length}</strong> prestasi siswa
          </span>
          {(searchQuery || selectedCategory !== "Semua") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
              className="text-[#0066cc] hover:underline apple-press-action cursor-pointer text-[13px]"
            >
              Tampilkan Semua
            </button>
          )}
        </div>

        {/* Grid of Achievements */}
        {error ? (
          <ApiState error={error} />
        ) : displayedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedAchievements.map((item) => (
              <AchievementCard key={item.id} achievement={item} />
            ))}
          </div>
        ) : (
          <div className="bg-[#fafafc] border border-[#e0e0e0] rounded-2xl p-10 text-center max-w-md mx-auto">
            <p className="text-[16px] text-[#1d1d1f] font-medium mb-1">
              {achievements.length === 0
                ? "Belum ada data prestasi"
                : "Tidak ada data prestasi yang sesuai"}
            </p>
            <p className="text-[13px] text-[#7a7a7a] mb-4">
              Silakan pilih kategori lain atau bersihkan kotak pencarian.
            </p>
            <Button
              variant="pearl-capsule"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
            >
              Lihat Semua Prestasi
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
