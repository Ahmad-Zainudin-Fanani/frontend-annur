"use client";

import React, { useState, useMemo } from "react";
import SectionHeader from "@/components/molecules/SectionHeader";
import TeacherCard from "@/components/molecules/TeacherCard";
import SearchBar from "@/components/molecules/SearchBar";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/atoms/Icons";
import ApiState from "@/components/atoms/ApiState";

const ITEMS_PER_PAGE = 8;

export default function TeachersShowcase({ initialTeachers = [], error = null }) {
  const teachers = initialTeachers;
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);

  const filteredTeachers = useMemo(() => {
  const q = searchQuery.trim().toLowerCase();

  if (!q) return teachers;

  return teachers.filter((t) =>
    [t.name, t.role, t.department].some((value) =>
      String(value ?? "").toLowerCase().includes(q)
    )
  );
}, [teachers, searchQuery]);

  // Reset to page 1 whenever search query changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE) || 1;

  // Slice data for pagination
  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTeachers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTeachers, currentPage]);

  const goToPage = (page) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Smooth scroll to top of section
    const elem = document.getElementById("guru");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="guru" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Tenaga Pendidik Berdedikasi"
          title="Dewan Guru SD Plus An-Nur"
          description="Kenali tenaga pendidik yang membimbing pembelajaran dan perkembangan siswa."
        />

        {/* Clean, minimalist search bar only */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-[14px] text-[#7a7a7a]">
            Menampilkan{" "}
            <strong className="text-[#1d1d1f] font-semibold">
              {filteredTeachers.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}
              {" - "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredTeachers.length)}
            </strong>{" "}
            dari {filteredTeachers.length} tenaga pendidik
          </div>

          <div className="w-full sm:w-80">
            <SearchBar
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onClear={() => handleSearchChange("")}
              placeholder="Cari nama guru atau mata pelajaran..."
            />
          </div>
        </div>

        {/* Grid of Clean Teacher Cards */}
        {error ? (
          <ApiState error={error} />
        ) : paginatedTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e0e0e0] rounded-2xl p-10 text-center max-w-md mx-auto">
            <p className="text-[16px] text-[#1d1d1f] font-medium mb-1">
              {teachers.length === 0 ? "Belum ada data guru" : "Guru tidak ditemukan"}
            </p>
            <p className="text-[14px] text-[#7a7a7a] mb-4">
              Tidak ada nama guru atau mata pelajaran yang sesuai dengan pencarian Anda.
            </p>
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="text-[14px] text-[#333333] hover:underline font-medium cursor-pointer"
            >
              Tampilkan Semua Guru
            </button>
          </div>
        )}

        {/* Pagination Controls (Max 8 items per page) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-16 pt-8 border-t border-[#f0f0f0]">
            <nav aria-label="Navigasi halaman" className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#f5f5f7] transition-all duration-200"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-label={`Halaman ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`w-9 h-9 rounded-full text-[13px] font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "bg-[#1d1d1f] text-white"
                      : "text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-[#f0f0f0]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#f5f5f7] transition-all duration-200"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}
