"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function TeacherCard({ teacher }) {
  const [failedPhoto, setFailedPhoto] = useState(null);
  const hasPhoto = teacher.photo && failedPhoto !== teacher.photo;

  // Initials for avatar
  const initials = teacher.name
    .replace(/^(Ustadz|Ustadzah|Dr\.|Dra\.|H\.|Hj\.)\s+/gi, "")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-[20px] overflow-hidden flex flex-col apple-product-shadow transition-all duration-200 hover:border-[#1d1d1f] hover:shadow-md hover:-translate-y-0.5">
      {/* Top: Teacher Portrait (3:4 aspect ratio) */}
      <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-[#f0f4f8] via-[#e8eff8] to-[#dce7f5] flex items-center justify-center overflow-hidden border-b border-[#e0e0e0]">
        {hasPhoto ? (
          <Image
            src={teacher.photo}
            alt={teacher.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            onError={() => setFailedPhoto(teacher.photo)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center select-none">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-[#e0e0e0] shadow-xs flex items-center justify-center mb-2.5 text-[#333333] font-bold text-3xl">
              {initials}
            </div>
            <span className="text-[12px] font-medium text-[#7a7a7a]">
              SD Plus An-Nur
            </span>
          </div>
        )}
      </div>

      {/* Details: Only Teacher Name and Subject/Wali Kelas */}
      <div className="p-5 text-center flex flex-col justify-center min-h-[96px]">
        <h3 className="text-[17px] font-bold text-[#1d1d1f] leading-snug tracking-[-0.2px] mb-1.5">
          {teacher.name}
        </h3>
        <p className="text-[14px] text-[#333333] font-medium leading-snug">
          {teacher.role}
        </p>
      </div>
    </div>
  );
}
