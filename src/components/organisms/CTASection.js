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

  return (
    <section
      className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 text-center ${
        isDark ? "bg-[#272729] text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"
      }`}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {eyebrow && (
          <span
            className={`text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider mb-3 select-none ${
              isDark ? "text-[#2997ff]" : "text-[#0066cc]"
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

        <Text
          variant="body"
          theme={theme}
          muted={true}
          className="mb-8 max-w-2xl text-[17px] leading-[1.6]"
        >
          {description}
        </Text>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={primaryHref} variant="primary" size="lg">
            {primaryText}
          </Button>
          <Button
            href={secondaryHref}
            variant={isDark ? "text-link-on-dark" : "secondary-pill"}
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
