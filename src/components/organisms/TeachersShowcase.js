"use client";

import React, { useState, useMemo } from "react";
import SectionHeader from "@/components/molecules/SectionHeader";
import TeacherCard from "@/components/molecules/TeacherCard";
import SearchBar from "@/components/molecules/SearchBar";
import Chip from "@/components/atoms/Chip";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { teachersData, teacherDepartments } from "@/data/teachersData";
import { XIcon, GraduationCapIcon } from "@/components/atoms/Icons";

export default function TeachersShowcase({ initialLimit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("Semua Departemen");
  const [activeTeacher, setActiveTeacher] = useState(null);

  const filteredTeachers = useMemo(() => {
    return teachersData.filter((t) => {
      const matchDept =
        selectedDept === "Semua Departemen" || t.department === selectedDept;
      const matchQuery =
        searchQuery.trim() === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.education.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchQuery;
    });
  }, [searchQuery, selectedDept]);

  const displayedTeachers = initialLimit
    ? filteredTeachers.slice(0, initialLimit)
    : filteredTeachers;

  return (
    <section id="guru" className="py-20 lg:py-24 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Sanad Keilmuan & Keteladanan"
          title="Dewan Asatidz & Tenaga Pendidik"
          description="Dididik oleh para ulama, hafizh bersanad, dan akademisi lulusan universitas terkemuka dunia yang mendedikasikan hidup untuk kemajuan santri."
        />

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Department Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {teacherDepartments.map((dept) => (
              <Chip
                key={dept}
                label={dept}
                selected={selectedDept === dept}
                onClick={() => setSelectedDept(dept)}
                size="sm"
              />
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 shrink-0">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              placeholder="Cari asatidz, gelar, atau mapel..."
            />
          </div>
        </div>

        {/* Result Counter */}
        <div className="flex items-center justify-between text-[14px] text-[#7a7a7a] mb-6">
          <span>
            Menampilkan{" "}
            <strong className="text-[#1d1d1f] font-semibold">
              {displayedTeachers.length}
            </strong>{" "}
            dari {teachersData.length} tenaga pendidik
          </span>
          {(searchQuery || selectedDept !== "Semua Departemen") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("Semua Departemen");
              }}
              className="text-[#0066cc] hover:underline text-[13px] apple-press-action cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Grid of Teacher Cards */}
        {displayedTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onSelect={(selected) => setActiveTeacher(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e0e0e0] rounded-2xl p-12 text-center max-w-lg mx-auto">
            <p className="text-[17px] text-[#1d1d1f] font-medium mb-2">
              Tidak ada tenaga pendidik yang cocok
            </p>
            <p className="text-[14px] text-[#7a7a7a] mb-6">
              Silakan periksa kata kunci pencarian atau pilih departemen lain.
            </p>
            <Button
              variant="pearl-capsule"
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("Semua Departemen");
              }}
            >
              Tampilkan Semua Asatidz
            </Button>
          </div>
        )}

        {/* Detail Modal */}
        {activeTeacher && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveTeacher(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#e0e0e0] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveTeacher(null)}
                className="absolute top-4 right-4 p-2 text-[#7a7a7a] hover:text-[#1d1d1f] rounded-full apple-press-action cursor-pointer"
                aria-label="Tutup modal"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center text-[#0066cc] font-bold text-2xl">
                  {activeTeacher.name.slice(0, 2)}
                </div>
                <div>
                  <Badge variant="primary" size="sm" className="mb-1">
                    {activeTeacher.department}
                  </Badge>
                  <h3 className="text-[19px] font-semibold text-[#1d1d1f] leading-tight">
                    {activeTeacher.name}
                  </h3>
                  <p className="text-[14px] text-[#0066cc]">
                    {activeTeacher.role}
                  </p>
                </div>
              </div>

              <div className="space-y-4 my-6 text-[14px]">
                <div>
                  <span className="font-semibold text-[#1d1d1f] block mb-1">
                    Riwayat Pendidikan:
                  </span>
                  <p className="text-[#333333] leading-relaxed">
                    {activeTeacher.education}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-[#1d1d1f] block mb-1">
                    Sertifikasi & Sanad:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTeacher.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="bg-[#f5f5f7] px-2.5 py-1 rounded text-[13px] text-[#333333]"
                      >
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-[#1d1d1f] block mb-1">
                    Motto Dedikasi:
                  </span>
                  <p className="italic text-[#333333] bg-[#f5f5f7] p-3 rounded-lg border-l-2 border-[#0066cc]">
                    &ldquo;{activeTeacher.quote}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f0f0f0] flex justify-end">
                <Button
                  variant="pearl-capsule"
                  onClick={() => setActiveTeacher(null)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
