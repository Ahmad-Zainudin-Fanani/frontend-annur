"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/atoms/Button";

export default function SubNav({
  title = "Pesantren & SIT An-Nur",
  links = [],
  ctaLabel = "Daftar Santri",
  ctaHref = "/kontak",
}) {
  return (
    <div className="sticky top-[44px] z-40 bg-[#f5f5f7]/85 backdrop-blur-md border-b border-[#e0e0e0] select-none transition-all">
      <div className="max-w-7xl mx-auto h-[52px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Category Title */}
        <div className="flex items-center space-x-2 truncate">
          <Link
            href="/"
            className="text-[18px] sm:text-[21px] font-semibold text-[#1d1d1f] tracking-[0.231px] truncate hover:text-[#0066cc] transition-colors"
          >
            {title}
          </Link>
        </div>

        {/* Right: Inline Utility Links & Action Pill */}
        <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
          {links && links.length > 0 && (
            <div className="hidden sm:flex items-center space-x-5 text-[14px] text-[#1d1d1f] tracking-[-0.224px]">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="hover:text-[#0066cc] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {ctaLabel && (
            <Button
              href={ctaHref}
              variant="primary"
              size="sm"
              className="py-1.5 px-4 text-[13px] font-normal"
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
