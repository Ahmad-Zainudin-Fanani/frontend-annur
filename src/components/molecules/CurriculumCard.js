import React from "react";
import Badge from "@/components/atoms/Badge";
import { CheckIcon, BookOpenIcon, BuildingIcon, AwardIcon, SparklesIcon } from "@/components/atoms/Icons";

const iconMap = {
  BookOpen: BookOpenIcon,
  Building: BuildingIcon,
  Award: AwardIcon,
  Sparkles: SparklesIcon,
};

export default function CurriculumCard({ pillar, level }) {
  if (pillar) {
    const IconComponent = iconMap[pillar.iconName] || BookOpenIcon;
    return (
      <div className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 lg:p-8 flex flex-col justify-between transition-all hover:border-[#1d1d1f]">
        <div>
          <div className="w-12 h-12 rounded-xl bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center text-[#0066cc] mb-5">
            <IconComponent className="w-6 h-6" />
          </div>

          <Badge variant="primary" size="sm" className="mb-3">
            {pillar.category}
          </Badge>

          <h3 className="text-[21px] font-semibold leading-[1.2] tracking-[0.231px] text-[#1d1d1f] mb-3">
            {pillar.title}
          </h3>

          <p className="text-[17px] text-[#7a7a7a] leading-[1.47] tracking-[-0.374px] mb-6">
            {pillar.summary}
          </p>

          <ul className="space-y-3">
            {pillar.points.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[#333333] leading-[1.4]">
                <span className="text-[#0066cc] mt-0.5 shrink-0">
                  <CheckIcon className="w-4 h-4" />
                </span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (level) {
    return (
      <div className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 lg:p-8 flex flex-col justify-between transition-all hover:border-[#0066cc]">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge variant="dark" size="sm">
              {level.level}
            </Badge>
            <span className="text-[12px] text-[#7a7a7a]">{level.ageRange}</span>
          </div>

          <h3 className="text-[21px] font-semibold leading-[1.2] text-[#1d1d1f] mb-2">
            {level.title}
          </h3>

          <p className="text-[14px] font-medium text-[#0066cc] mb-3">
            Fokus: {level.focus}
          </p>

          <p className="text-[15px] text-[#7a7a7a] leading-relaxed mb-6">
            {level.description}
          </p>

          <div className="border-t border-[#f0f0f0] pt-4 mb-4">
            <h4 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wider mb-2.5">
              Kompetensi Utama Lulusan:
            </h4>
            <ul className="space-y-2">
              {level.keyCompetencies.map((comp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[13px] text-[#333333] leading-[1.35]">
                  <span className="text-[#0066cc] mt-0.5 shrink-0">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </span>
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-[#f0f0f0] text-[12px] text-[#7a7a7a] flex items-center justify-between">
          <span>Waktu Belajar:</span>
          <span className="font-medium text-[#1d1d1f]">{level.hours}</span>
        </div>
      </div>
    );
  }

  return null;
}
