import React from "react";

export default function Text({
  as: Component = "p",
  variant = "body",
  children,
  className = "",
  theme = "light",
  muted = false,
  ...props
}) {
  let typographyClasses = "";

  switch (variant) {
    case "body-strong":
      typographyClasses =
        "text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]";
      break;
    case "dense-link":
      typographyClasses =
        "text-[17px] font-normal leading-[2.41] tracking-normal";
      break;
    case "caption":
      typographyClasses =
        "text-[14px] font-normal leading-[1.43] tracking-[-0.224px]";
      break;
    case "caption-strong":
      typographyClasses =
        "text-[14px] font-semibold leading-[1.29] tracking-[-0.224px]";
      break;
    case "fine-print":
      typographyClasses =
        "text-[12px] font-normal leading-[1.0] tracking-[-0.12px]";
      break;
    case "micro-legal":
      typographyClasses =
        "text-[10px] font-normal leading-[1.3] tracking-[-0.08px]";
      break;
    case "body":
    default:
      typographyClasses =
        "text-[17px] font-normal leading-[1.47] tracking-[-0.374px]";
      break;
  }

  let colorClasses = "";
  if (theme === "dark") {
    colorClasses = muted ? "text-[#cccccc]" : "text-white";
  } else {
    colorClasses = muted ? "text-[#7a7a7a]" : "text-[#1d1d1f]";
  }

  return (
    <Component
      className={`${typographyClasses} ${colorClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
