import React from "react";
import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";

export default function CTASection({
  theme = "dark",
  eyebrow = "Penerimaan Santri Baru (SPMB)",
  title = "Mulai Perjalanan Mulia Bersama An-Nur",
  description = "Bergabunglah dengan keluarga besar Lembaga Pendidikan Islam Terpadu An-Nur. Pendaftaran tahun ajaran baru telah dibuka untuk seluruh jenjang pendidikan.",
  primaryText = "Daftar Sekarang",
  primaryHref = "/kontak",
  secondaryText = "Unduh Brosur Informasi",
  secondaryHref = "/profil",
}) {
  const isDark = theme === "dark";
  const isNeutral = theme === "neutral";

  return (
    <section
      className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 text-center ${
        isDark
          ? "bg-[#272729] text-white"
          : isNeutral
            ? "bg-white text-[#1d1d1f]"
            : "bg-[#f5f5f7] text-[#1d1d1f]"
      }`}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {eyebrow && (
          <span
            className={`mb-3 flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider select-none ${
              isDark
                ? "text-[#d2d2d7]"
                : isNeutral
                  ? "text-[#7a7a7a]"
                  : "text-[#7a7a7a]"
            }`}
          >
            {isNeutral && (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-[#7a7a7a]"
              />
            )}
            {eyebrow}
          </span>
        )}

        <Heading
          as="h2"
          variant="display-lg"
          theme={isDark ? "dark" : "light"}
          className="mb-4"
        >
          {title}
        </Heading>

        <Text
          variant="body"
          theme={isDark ? "dark" : "light"}
          muted={true}
          className="mb-8 max-w-2xl text-[17px] leading-[1.6]"
        >
          {description}
        </Text>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            href={primaryHref}
            variant={isNeutral ? "neutral-pill" : "primary"}
            size="lg"
          >
            {primaryText}
          </Button>
          <Button
            href={secondaryHref}
            variant={
              isDark
                ? "text-link-on-dark"
                : isNeutral
                  ? "neutral-outline"
                  : "secondary-pill"
            }
            size="lg"
          >
            {secondaryText}
            {isDark ? " →" : ""}
          </Button>
        </div>
      </div>
    </section>
  );
}
