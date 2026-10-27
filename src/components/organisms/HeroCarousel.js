"use client";

import { useState, useEffect, useCallback } from "react";
import ApiState from "@/components/atoms/ApiState";
import Button from "@/components/atoms/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/atoms/Icons";

export default function HeroCarousel({ slides = [], error = null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + Math.max(slides.length, 1)) % Math.max(slides.length, 1)
    );
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length < 2) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slides.length]);

  const activeSlide = slides[currentIndex];

  if (!activeSlide) {
    return (
      <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-[#000000] text-white lg:min-h-screen">
        <ApiState error={error} empty={!error} />
      </section>
    );
  }

  return (
    <section
      className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#000000] text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ========================================================
          1. SLIDE BACKGROUNDS
          ======================================================== */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${JSON.stringify(slide.image)})` }}
              aria-hidden="true"
            />
          </div>
        );
      })}

      {/* ========================================================
          2. DARK OVERLAY
          ======================================================== */}
      <div
        className="absolute inset-0 z-10 bg-black/60 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none"
        aria-hidden="true"
      />

      {/* ========================================================
          3. HERO CONTENT (Typography strict to DESIGN.md)
          ======================================================== */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
        {/* Hero headline in SF Pro Display 600, negative tracking */}
        <h1 className="text-[36px] sm:text-[46px] lg:text-[56px] font-semibold text-white leading-[1.07] tracking-[-0.28px] max-w-3xl mb-4">
          {activeSlide.heading}
        </h1>

        {/* Lead subtitle in SF Pro Display 400 */}
        <h2 className="text-[20px] sm:text-[24px] lg:text-[28px] font-normal text-[#cccccc] leading-[1.25] tracking-[0.196px] max-w-2xl mb-3">
          {activeSlide.subheading}
        </h2>

        {activeSlide.caption && (
          <p className="text-[15px] sm:text-[17px] font-normal text-[#cccccc] leading-relaxed max-w-2xl mb-8">
            {activeSlide.caption}
          </p>
        )}

        {/* Action buttons strictly following DESIGN.md button grammars */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {activeSlide.buttonLabel && activeSlide.buttonUrl && (
            <Button
              href={activeSlide.buttonUrl}
              variant="primary"
              size="md"
            >
              {activeSlide.buttonLabel}
            </Button>
          )}

          {activeSlide.secondaryCtaText && (
            <Button
              href={activeSlide.secondaryCtaHref}
              variant="text-link-on-dark"
              size="md"
            >
              <span>{activeSlide.secondaryCtaText}</span>
              <span className="ml-1">→</span>
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================
          4. CAROUSEL CIRCULAR CONTROLS (DESIGN.md button-icon-circular)
          ======================================================== */}
      {slides.length > 1 && (
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Slide Sebelumnya"
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[rgba(210,210,215,0.25)] hover:bg-[rgba(210,210,215,0.4)] backdrop-blur-md text-white flex items-center justify-center transition-all duration-120 apple-press-action cursor-pointer"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
      )}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Slide Selanjutnya"
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[rgba(210,210,215,0.25)] hover:bg-[rgba(210,210,215,0.4)] backdrop-blur-md text-white flex items-center justify-center transition-all duration-120 apple-press-action cursor-pointer"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      )}

      {/* ========================================================
          5. MINIMAL SLIDE DOTS (Bottom Center)
          ======================================================== */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Pindah ke slide ${idx + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
