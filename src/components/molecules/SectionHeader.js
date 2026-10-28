import React from "react";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "light",
  className = "",
}) {
  const isCenter = align === "center";
  const isDark = theme === "dark";

  return (
    <div
      className={`max-w-3xl mb-12 lg:mb-16 ${
        isCenter ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-block text-[13px] sm:text-[14px] font-semibold tracking-[0.2px] uppercase mb-3 ${
            isDark ? "text-[#d2d2d7]" : "text-[#7a7a7a]"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <Heading
        as="h2"
        variant="display-lg"
        theme={theme}
        className="mb-4"
      >
        {title}
      </Heading>
      {description && (
        <Text
          variant="body"
          theme={theme}
          muted={true}
          className="max-w-2xl mx-auto"
        >
          {description}
        </Text>
      )}
    </div>
  );
}
