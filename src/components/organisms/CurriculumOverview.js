"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/molecules/SectionHeader";
import CurriculumCard from "@/components/molecules/CurriculumCard";
import Chip from "@/components/atoms/Chip";
import ApiState from "@/components/atoms/ApiState";

export default function CurriculumOverview({ curriculum, error = null }) {
  const curriculumData = curriculum || {
    overview: "",
    utilities: {},
    pillars: [],
    levels: [],
  };
  const firstAvailableTab = curriculumData.pillars.length
    ? "pillars"
    : "levels";
  const [activeTab, setActiveTab] = useState(firstAvailableTab);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);

  if (error) {
    return <ApiState error={error} />;
  }

  if (
    !curriculumData.pillars.length &&
    !curriculumData.levels.length
  ) {
    return <ApiState empty />;
  }

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <section className="bg-white pt-8 pb-4 border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#f5f5f7] rounded-full border border-[#e0e0e0]">
            {curriculumData.pillars.length ? (
              <Chip
                label="Pilar Kurikulum"
                selected={activeTab === "pillars"}
                onClick={() => setActiveTab("pillars")}
                size="sm"
              />
            ) : null}
            {curriculumData.levels.length ? (
              <Chip
                label="Fase Belajar SD (A - C)"
                selected={activeTab === "levels"}
                onClick={() => setActiveTab("levels")}
                size="sm"
              />
            ) : null}
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
                  key={lvl.id}
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
                  key={lvl.id}
                  onClick={() => setSelectedLevelIndex(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedLevelIndex === idx
                      ? "bg-white border-[#333333] ring-2 ring-[#333333]/20 shadow-xs"
                      : "bg-[#fafafc] border-[#e0e0e0] hover:bg-white"
                  }`}
                >
                  <div className="text-[12px] font-semibold text-[#333333] mb-1">
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

    </div>
  );
}
