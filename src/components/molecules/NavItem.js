import React from "react";
import Link from "next/link";

export default function NavItem({
  href,
  label,
  active = false,
  theme = "dark",
  onClick,
  className = "",
}) {
  const isDark = theme === "dark";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-[12px] tracking-[-0.12px] font-normal transition-colors py-1 px-2.5 rounded apple-press-action ${
        isDark
          ? active
            ? "text-white font-medium"
            : "text-[#cccccc] hover:text-white"
          : active
          ? "text-[#1d1d1f] font-medium"
          : "text-[#7a7a7a] hover:text-[#1d1d1f]"
      } ${className}`.trim()}
    >
      {label}
    </Link>
  );
}
