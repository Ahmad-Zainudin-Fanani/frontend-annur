import React from "react";
import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";

export default function HeroTile({
  theme = "light",
  variant = "white", // "white" | "parchment" | "dark" | "dark-2"
  eyebrow,
  title,
  subtitle,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
  children,
  className = "",
}) {
  const isDark = theme === "dark" || variant === "dark" || variant === "dark-2";

  let bgClass = "bg-white";
  if (variant === "parchment") bgClass = "bg-[#f5f5f7]";
  if (variant === "dark") bgClass = "bg-[#272729]";
  if (variant === "dark-2") bgClass = "bg-[#2a2a2c]";

  return (
    <section
      className={`w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center overflow-hidden ${bgClass} ${className}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {eyebrow && (
          <span
            className={`text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.2px] mb-3.5 select-none ${
              isDark ? "text-[#d2d2d7]" : "text-[#333333]"
            }`}
          >
            {eyebrow}
          </span>
        )}

        <Heading
          as="h1"
          variant="hero-display"
          theme={isDark ? "dark" : "light"}
          className="mb-4 max-w-3xl"
        >
          {title}
        </Heading>

        {subtitle && (
          <Text
            variant="lead"
            theme={isDark ? "dark" : "light"}
            muted={true}
            className="mb-8 max-w-2xl text-[19px] sm:text-[24px] lg:text-[28px]"
          >
            {subtitle}
          </Text>
        )}

        {/* CTA Stack */}
        {(primaryCtaText || secondaryCtaText) && (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 sm:mb-16">
            {primaryCtaText && (
              <Button
                href={primaryCtaHref}
                variant="primary"
                size="md"
              >
                {primaryCtaText}
              </Button>
            )}

            {secondaryCtaText && (
              <Button
                href={secondaryCtaHref}
                variant={isDark ? "text-link-on-dark" : "secondary-pill"}
                size="md"
              >
                {secondaryCtaText}
                {isDark ? " →" : ""}
              </Button>
            )}
          </div>
        )}

        {/* Graphic or Product Showcase Slot resting on surface */}
        {children && (
          <div className="w-full flex justify-center mt-2">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
