import React from "react";

export default function Chip({
  label,
  count,
  selected = false,
  onClick,
  className = "",
  size = "md",
  ...props
}) {
  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full font-normal transition-all apple-press-action cursor-pointer select-none ${
        isSmall
          ? "px-3 py-1.5 text-[13px] leading-tight"
          : "px-4 py-2 text-[14px] leading-[1.43] tracking-[-0.224px]"
      } ${
        selected
          ? "bg-[#1d1d1f] text-white border-2 border-[#1d1d1f] shadow-xs"
          : "bg-white text-[#1d1d1f] border border-[#e0e0e0] hover:border-[#7a7a7a] hover:bg-[#fafafc]"
      } ${className}`.trim()}
      {...props}
    >
      <span>{label}</span>
      {typeof count === "number" && (
        <span
          className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
            selected ? "bg-white/20 text-white" : "bg-[#f0f0f0] text-[#7a7a7a]"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
