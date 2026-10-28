import React from "react";

export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
  ...props
}) {
  let variantStyles = "";
  switch (variant) {
    case "primary":
      variantStyles = "bg-[#333333]/10 text-[#333333] border border-[#333333]/20";
      break;
    case "primary-on-dark":
      variantStyles = "bg-[#d2d2d7]/15 text-[#d2d2d7] border border-[#d2d2d7]/30";
      break;
    case "dark":
      variantStyles = "bg-[#272729] text-white border border-[#333333]";
      break;
    case "gold":
      variantStyles = "bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]";
      break;
    case "emerald":
      variantStyles = "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]";
      break;
    case "neutral":
    default:
      variantStyles = "bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0]";
      break;
  }

  let sizeStyles = "px-3 py-1 text-[12px] font-normal leading-[1.2]";
  if (size === "sm") {
    sizeStyles = "px-2.5 py-0.5 text-[11px] font-normal leading-[1.1]";
  } else if (size === "lg") {
    sizeStyles = "px-4 py-1.5 text-[14px] font-normal leading-[1.3]";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full tracking-[-0.12px] select-none ${variantStyles} ${sizeStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
