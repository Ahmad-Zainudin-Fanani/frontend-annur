import React from "react";
import Badge from "@/components/atoms/Badge";
import Text from "@/components/atoms/Text";
import { GraduationCapIcon } from "@/components/atoms/Icons";

export default function TeacherCard({ teacher, onSelect }) {
  const isFemale = teacher.gender === "P";

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 flex flex-col justify-between transition-all hover:border-[#1d1d1f] hover:bg-[#fafafc]">
      <div>
        {/* Top: Avatar placeholder & Department Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-14 h-14 rounded-lg bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center text-[#1d1d1f] font-semibold text-lg overflow-hidden shrink-0">
            {/* Elegant initials glyph with geometric styling */}
            <span className="text-[#0066cc]">
              {teacher.name
                .replace(/^(Ustadz|Ustadzah|Dr\.|Dra\.|H\.|Hj\.)\s+/gi, "")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
          <Badge variant="neutral" size="sm" className="truncate max-w-[170px]">
            {teacher.department}
          </Badge>
        </div>

        {/* Teacher Name */}
        <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-[#1d1d1f] mb-1">
          {teacher.name}
        </h3>

        {/* Role & Subject */}
        <p className="text-[14px] text-[#0066cc] font-medium leading-[1.4] mb-3">
          {teacher.role}
        </p>

        {/* Education Credentials */}
        <div className="flex items-start gap-2 text-[13px] text-[#7a7a7a] mb-3">
          <GraduationCapIcon className="w-4 h-4 shrink-0 mt-0.5 text-[#1d1d1f]" />
          <span className="line-clamp-2 leading-[1.4]">{teacher.education}</span>
        </div>

        {/* Quote / Motto */}
        {teacher.quote && (
          <p className="text-[13px] italic text-[#333333] bg-[#f5f5f7] p-3 rounded-lg border-l-2 border-[#0066cc] mb-4 leading-relaxed">
            &ldquo;{teacher.quote}&rdquo;
          </p>
        )}
      </div>

      {/* Footer / Certifications */}
      <div className="pt-3 border-t border-[#f0f0f0] flex flex-wrap items-center justify-between gap-2">
        <span className="text-[12px] text-[#7a7a7a]">
          {teacher.experience}
        </span>
        <button
          type="button"
          onClick={() => onSelect && onSelect(teacher)}
          className="text-[14px] text-[#0066cc] hover:underline font-normal apple-press-action cursor-pointer"
        >
          Detail Profil →
        </button>
      </div>
    </div>
  );
}
