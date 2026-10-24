import React from "react";

export default function ProfileStat({ label, value, theme = "light" }) {
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left py-4 px-3">
      <div
        className={`text-[36px] sm:text-[44px] font-semibold leading-[1.05] tracking-tight mb-1.5 ${
          isDark ? "text-white" : "text-[#1d1d1f]"
        }`}
      >
        {value}
      </div>
      <div
        className={`text-[14px] leading-[1.4] tracking-[-0.224px] max-w-[180px] ${
          isDark ? "text-[#cccccc]" : "text-[#7a7a7a]"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
