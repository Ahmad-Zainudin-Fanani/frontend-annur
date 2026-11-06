import Image from "next/image";
import ApiState from "@/components/atoms/ApiState";
import { publicApi } from "@/data/api";

export default async function FoundationStructure() {
  let members;

  try {
    members = await publicApi.organizationStructures();
  } catch (error) {
    return <ApiState error={error.message} />;
  }

  if (members.length === 0) {
    return (
      <p role="status" className="py-10 text-center text-sm text-[#7a7a7a]">
        Data pengurus yayasan belum dipublikasikan.
      </p>
    );
  }

  const membersById = new Map(members.map((member) => [member.id, member]));

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => {
        const parent = membersById.get(member.parent_id);

        return (
          <li
            key={member.id}
            className="overflow-hidden rounded-[20px] border border-[#e0e0e0] bg-white apple-product-shadow"
          >
            <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden border-b border-[#e0e0e0] bg-[#f5f5f7]">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={`Foto ${member.name}`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top"
                />
              ) : (
                <span className="text-sm text-[#7a7a7a]">Foto belum tersedia</span>
              )}
            </div>
            <div className="p-6">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#7a7a7a]">
                {member.position}
              </p>
              <h3 className="text-[20px] font-semibold leading-snug tracking-tight text-[#1d1d1f]">
                {member.name}
              </h3>
              {parent ? (
                <p className="mt-4 border-t border-[#f0f0f0] pt-4 text-[13px] leading-relaxed text-[#7a7a7a]">
                  Di bawah koordinasi {parent.position} — {parent.name}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
