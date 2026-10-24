import React from "react";
import Link from "next/link";

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  target,
  rel,
  disabled = false,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center text-center font-normal transition-all apple-press-action focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  let variantClasses = "";
  let sizeClasses = "";

  switch (variant) {
    case "primary":
      variantClasses =
        "bg-[#0066cc] text-white hover:bg-[#0071e3] active:bg-[#005bb5] rounded-full";
      break;
    case "secondary-pill":
      variantClasses =
        "bg-transparent text-[#0066cc] border border-[#0066cc] hover:bg-[#0066cc]/5 active:bg-[#0066cc]/10 rounded-full";
      break;
    case "dark-utility":
      variantClasses =
        "bg-[#1d1d1f] text-white hover:bg-[#333333] active:bg-black rounded-lg text-sm";
      break;
    case "pearl-capsule":
      variantClasses =
        "bg-[#fafafc] text-[#333333] border-[3px] border-[#f0f0f0] hover:bg-white rounded-[11px] text-sm";
      break;
    case "hero":
      variantClasses =
        "bg-[#0066cc] text-white hover:bg-[#0071e3] rounded-full font-light";
      break;
    case "text-link":
      variantClasses =
        "bg-transparent text-[#0066cc] hover:underline p-0 inline-flex items-center gap-1 font-normal";
      break;
    case "text-link-on-dark":
      variantClasses =
        "bg-transparent text-[#2997ff] hover:underline p-0 inline-flex items-center gap-1 font-normal";
      break;
    default:
      variantClasses =
        "bg-[#0066cc] text-white hover:bg-[#0071e3] rounded-full";
  }

  // Size styling matching DESIGN.md
  if (variant !== "text-link" && variant !== "text-link-on-dark") {
    switch (size) {
      case "sm":
        sizeClasses = "px-[15px] py-[8px] text-[14px] leading-[1.29] tracking-[-0.224px]";
        break;
      case "lg":
        sizeClasses = "px-[28px] py-[14px] text-[18px] leading-[1.0] tracking-[0px]";
        break;
      case "md":
      default:
        sizeClasses = "px-[22px] py-[11px] text-[17px] leading-[1.47] tracking-[-0.374px]";
        break;
    }
  }

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  if (href) {
    if (href.startsWith("http") || target === "_blank") {
      return (
        <a
          href={href}
          className={combinedClasses}
          target={target}
          rel={rel || "noopener noreferrer"}
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
