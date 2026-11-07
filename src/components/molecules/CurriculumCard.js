import { CheckIcon, BookOpenIcon, BuildingIcon, AwardIcon, SparklesIcon } from "@/components/atoms/Icons";

const iconMap = {
  BookOpen: BookOpenIcon,
  Building: BuildingIcon,
  Award: AwardIcon,
  Sparkles: SparklesIcon,
};

export default function CurriculumCard({ pillar, level }) {
  const data = pillar || level;
  if (!data) return null;

  const IconComponent = pillar ? iconMap[pillar.iconName] || BookOpenIcon : null;
  const category = pillar ? pillar.category : level.level;
  const description = pillar ? pillar.summary : level.description;
  const points = (pillar ? pillar.points : level.keyCompetencies) ?? [];

  return (
    <article className="flex min-w-0 flex-col rounded-[24px] border border-[#e0e0e0] bg-white p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {IconComponent ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f5f7] text-[#333333]">
            <IconComponent className="h-5 w-5" />
          </span>
        ) : null}
        {category ? (
          <p className={`text-xs font-semibold uppercase tracking-[0.12em] text-[#7a7a7a] ${pillar ? "ml-auto text-right" : ""}`}>
            {category}
          </p>
        ) : null}
        {level?.ageRange ? <span className="text-xs text-[#7a7a7a]">{level.ageRange}</span> : null}
      </div>

      <h3 className="break-words text-xl font-semibold leading-snug tracking-tight text-[#1d1d1f] sm:text-2xl">
        {data.title}
      </h3>
      {level?.focus ? (
        <p className="mt-3 text-sm font-medium leading-relaxed text-[#333333]">Fokus: {level.focus}</p>
      ) : null}
      {description ? (
        <p className="mt-4 whitespace-pre-line break-words text-base leading-relaxed text-[#7a7a7a]">
          {description}
        </p>
      ) : null}

      {points.length > 0 ? (
        <div className="mt-6 border-t border-[#e0e0e0] pt-5">
          {level ? (
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#7a7a7a]">
              Kompetensi Utama Lulusan
            </h4>
          ) : null}
          <ul className="space-y-3">
            {points.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-[#333333]">
                <span aria-hidden="true" className="mt-1 shrink-0 text-[#7a7a7a]">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 break-words">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {level?.hours ? (
        <div className="mt-auto pt-6">
          <dl className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e0e0e0] pt-4 text-xs">
            <dt className="text-[#7a7a7a]">Waktu Belajar</dt>
            <dd className="font-medium text-[#1d1d1f]">{level.hours}</dd>
          </dl>
        </div>
      ) : null}
    </article>
  );
}
