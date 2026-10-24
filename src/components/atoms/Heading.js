import React from "react";

export default function Heading({
  as: Component = "h2",
  variant = "display-lg",
  children,
  className = "",
  theme = "light",
  ...props
}) {
  let typographyClasses = "";

  switch (variant) {
    case "hero-display":
      // 56px, 600 weight, tight tracking
      typographyClasses =
        "text-[36px] sm:text-[46px] lg:text-[56px] font-semibold leading-[1.07] tracking-[-0.28px]";
      break;
    case "display-lg":
      // 40px, 600 weight
      typographyClasses =
        "text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.1] tracking-normal";
      break;
    case "display-md":
      // 34px, 600 weight
      typographyClasses =
        "text-[24px] sm:text-[28px] lg:text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]";
      break;
    case "lead":
      // 28px, 400 weight
      typographyClasses =
        "text-[20px] sm:text-[24px] lg:text-[28px] font-normal leading-[1.14] tracking-[0.196px]";
      break;
    case "tagline":
      // 21px, 600 weight
      typographyClasses =
        "text-[18px] sm:text-[21px] font-semibold leading-[1.19] tracking-[0.231px]";
      break;
    default:
      typographyClasses =
        "text-[28px] sm:text-[40px] font-semibold leading-[1.1]";
  }

  const colorClass = theme === "dark" ? "text-white" : "text-[#1d1d1f]";

  return (
    <Component
      className={`${typographyClasses} ${colorClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
