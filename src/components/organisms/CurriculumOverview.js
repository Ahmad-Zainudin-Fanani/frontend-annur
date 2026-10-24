"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/molecules/SectionHeader";
import CurriculumCard from "@/components/molecules/CurriculumCard";
import Chip from "@/components/atoms/Chip";
import { curriculumData } from "@/data/curriculumData";
import { CheckIcon, CalendarIcon } from "@/components/atoms/Icons";

export default function CurriculumOverview() {
  const [activeTab, setActiveTab] = useState("pillars"); // "pillars" | "levels" | "schedule"
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <section className="bg-white pt-8 pb-4 border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#f5f5f7] rounded-full border border-[#e0e0e0]">
            <Chip
              label="4 Pilar Kurikulum Terpadu"
              selected={activeTab === "pillars"}
              onClick={() => setActiveTab("pillars")}
              size="sm"
            />
            <Chip
              label="Jenjang Pendidikan (TK - SMA)"
              selected={activeTab === "levels"}
              onClick={() => setActiveTab("levels")}
              size="sm"
            />
            <Chip
              label="Ritme Harian Santri 24 Jam"
              selected={activeTab === "schedule"}
              onClick={() => setActiveTab("schedule")}
              size="sm"
            />
          </div>
        </div>
      </section>

      {/* 1. View: Pillars */}
      {activeTab === "pillars" && (
        <section id="pilar" className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Integrasi Komprehensif"
              title="Empat Pilar Kurikulum An-Nur"
              description="Memadukan standar kurikulum nasional dengan ilmu syar'i, tahfidz bersanad, bahasa internasional, dan literasi digital abad 21."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {curriculumData.pillars.map((pillar) => (
                <CurriculumCard key={pillar.id} pillar={pillar} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. View: Levels */}
      {activeTab === "levels" && (
        <section id="jenjang" className="py-16 lg:py-20 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Tahapan Pembinaan Berkelanjutan"
              title="Jenjang Pendidikan & Profil Lulusan"
              description="Rancangan kurikulum bertahap yang disesuaikan dengan perkembangan psikologis, fitrah, dan potensi setiap jenjang usia."
            />

            {/* Sub-selector for levels */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {curriculumData.levels.map((lvl, idx) => (
                <Chip
                  key={idx}
                  label={lvl.level}
                  selected={selectedLevelIndex === idx}
                  onClick={() => setSelectedLevelIndex(idx)}
                />
              ))}
            </div>

            {/* Focused Level View */}
            <div className="max-w-4xl mx-auto">
              <CurriculumCard level={curriculumData.levels[selectedLevelIndex]} />
            </div>

            {/* Quick summary grid of all levels below */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              {curriculumData.levels.map((lvl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedLevelIndex(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedLevelIndex === idx
                      ? "bg-white border-[#0066cc] ring-2 ring-[#0066cc]/20 shadow-xs"
                      : "bg-[#fafafc] border-[#e0e0e0] hover:bg-white"
                  }`}
                >
                  <div className="text-[12px] font-semibold text-[#0066cc] mb-1">
                    {lvl.level}
                  </div>
                  <div className="text-[14px] font-semibold text-[#1d1d1f] mb-1 truncate">
                    {lvl.title}
                  </div>
                  <div className="text-[12px] text-[#7a7a7a]">
                    {lvl.ageRange}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. View: Daily Schedule / Rhythm */}
      {activeTab === "schedule" && (
        <section id="jadwal" className="py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Kedisiplinan & Barakah Waktu"
              title="Jadwal & Ritme Harian Santri (24 Jam)"
              description="Keteraturan jadwal membiasakan santri untuk istiqamah dalam ibadah, disiplin belajar, dan mandiri mengelola waktu."
            />

            <div className="bg-[#fafafc] border border-[#e0e0e0] rounded-2xl overflow-hidden divide-y divide-[#e0e0e0]">
              {curriculumData.dailySchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-3 mb-1 sm:mb-0">
                    <span className="w-2 h-2 rounded-full bg-[#0066cc]" />
                    <span className="text-[15px] font-semibold text-[#1d1d1f] min-w-[130px]">
                      {item.time}
                    </span>
                  </div>
                  <span className="text-[15px] text-[#333333] pl-5 sm:pl-0">
                    {item.activity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
