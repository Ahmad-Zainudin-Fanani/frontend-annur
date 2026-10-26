"use client";

import React, { useState, useMemo, useEffect } from "react";
import SectionHeader from "@/components/molecules/SectionHeader";
import TeacherCard from "@/components/molecules/TeacherCard";
import SearchBar from "@/components/molecules/SearchBar";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/atoms/Icons";
import { teachersData } from "@/data/teachersData";
import { publicApi } from "@/data/api";

const ITEMS_PER_PAGE = 8;

export default function TeachersShowcase() {
  const [teachers, setTeachers] = useState(teachersData);
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
  let isMounted = true;

  const fetchTeachers = async () => {
    try {
      const data = await publicApi.teachers();

      if (isMounted && Array.isArray(data)) {
        setTeachers(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data guru dari API:", error);
      // Jika API gagal, gunakan teachersData sebagai fallback.
    }
  };

  fetchTeachers();

  return () => {
    isMounted = false;
  };
}, []);

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

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    // Smooth scroll to top of section
    const elem = document.getElementById("guru");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const elem = document.getElementById("guru");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="guru" className="py-16 lg:py-20 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Tenaga Pendidik Berdedikasi"
          title="Dewan Guru SD Plus An-Nur"
          description="Direktori 13 tenaga pendidik profesional yang membimbing pembelajaran dan karakter Qur'ani seluruh peserta didik."
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
        {paginatedTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e0e0e0] rounded-2xl p-10 text-center max-w-md mx-auto">
            <p className="text-[16px] text-[#1d1d1f] font-medium mb-1">
              Guru tidak ditemukan
            </p>
            <p className="text-[14px] text-[#7a7a7a] mb-4">
              Tidak ada nama guru atau mata pelajaran yang sesuai dengan pencarian Anda.
            </p>
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="text-[14px] text-[#0066cc] hover:underline font-medium cursor-pointer"
            >
              Tampilkan Semua Guru
            </button>
          </div>
        )}

        {/* Pagination Controls (Max 8 items per page) */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                currentPage === 1
                  ? "bg-[#e5e5e7] text-[#999999] cursor-not-allowed"
                  : "bg-white text-[#1d1d1f] border border-[#e0e0e0] hover:border-[#1d1d1f] hover:bg-[#fafafc] shadow-xs cursor-pointer apple-press-action"
              }`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-[13px] font-medium text-[#7a7a7a] px-3">
              Halaman <strong className="text-[#1d1d1f]">{currentPage}</strong> dari {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                currentPage === totalPages
                  ? "bg-[#e5e5e7] text-[#999999] cursor-not-allowed"
                  : "bg-white text-[#1d1d1f] border border-[#e0e0e0] hover:border-[#1d1d1f] hover:bg-[#fafafc] shadow-xs cursor-pointer apple-press-action"
              }`}
            >
              <span>Next</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
