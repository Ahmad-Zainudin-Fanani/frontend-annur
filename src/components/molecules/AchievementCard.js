import React from "react";

export default function AchievementCard({ achievement }) {

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 flex flex-col justify-between transition-all hover:border-[#1d1d1f] hover:bg-[#fafafc]">
      <div>
        {/* Top Meta: Level & Year */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#0066cc]">
            Tingkat {achievement.level}
          </span>
          <span className="text-[13px] font-semibold text-[#7a7a7a]">
            {achievement.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-semibold leading-[1.3] tracking-[-0.374px] text-[#1d1d1f] mb-2">
          {achievement.title}
        </h3>

        {/* Student Name */}
        <p className="text-[14px] text-[#0066cc] font-medium mb-3">
          {achievement.studentName}
        </p>

        {/* Description */}
        <p className="text-[14px] text-[#7a7a7a] leading-[1.45] mb-4">
          {achievement.description}
        </p>
      </div>

      {/* Footer: Organizer & Category */}
      <div className="pt-3 border-t border-[#f0f0f0] flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#7a7a7a]">
        <span className="truncate max-w-[200px]" title={achievement.organizer}>
          {achievement.organizer}
        </span>
        <span className="bg-[#f5f5f7] px-2 py-0.5 rounded text-[#1d1d1f]">
          {achievement.category}
        </span>
      </div>
    </div>
  );
}
