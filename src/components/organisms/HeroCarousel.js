"use client";

/**
 * HeroCarousel — GSAP Timeline + SplitText + ScrollTrigger edition.
 * Hierarki animasi pembuka:
 * 1. Heading utama (SplitText words reveal)
 * 2. Deskripsi & Subheading (Fade up halus)
 * 3. Visual background (Parallax scrub + scale settling)
 * 4. CTA Button (Spring reveal)
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, ease, dur } from "@/lib/gsapConfig";
import ApiState from "@/components/atoms/ApiState";
import Button from "@/components/atoms/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/atoms/Icons";

export default function HeroCarousel({ slides = [], error = null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const sectionRef   = useRef(null);
  const headingRef   = useRef(null);
  const subheadRef   = useRef(null);
  const captionRef   = useRef(null);
  const ctaRef       = useRef(null);
  const imgRefs      = useRef([]);
  const splitRef     = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + Math.max(slides.length, 1)) % Math.max(slides.length, 1)
    );
  }, [slides.length]);

  // Auto-advance slide
  useEffect(() => {
    if (isPaused || slides.length < 2) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slides.length]);

  // ─── 1. HERO ENTRANCE TIMELINE (GSAP Timeline + SplitText) ─────────
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!headingRef.current) return;

      if (prefersReduced) {
        gsap.set([headingRef.current, subheadRef.current, captionRef.current, ctaRef.current].filter(Boolean), {
          opacity: 1,
          y: 0,
        });
        setHasEntered(true);
        return;
      }

      // Cleanup previous SplitText instance if any
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }

      const elsToHide = [subheadRef.current, captionRef.current, ctaRef.current].filter(Boolean);
      gsap.set(elsToHide, { opacity: 0, y: 28 });

      // Split text on heading
      try {
        splitRef.current = new SplitText(headingRef.current, {
          type: "words,lines",
          linesClass: "overflow-hidden py-0.5",
        });

        gsap.set(splitRef.current.words, { yPercent: 115, opacity: 0 });
      } catch (e) {
        // Fallback if SplitText cannot parse
        gsap.set(headingRef.current, { opacity: 0, y: 36 });
      }

      const activeImg = imgRefs.current[currentIndex];
      if (activeImg) {
        gsap.set(activeImg, { scale: 1.18 });
      }

      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => setHasEntered(true),
      });

      // 1. Heading words reveal
      if (splitRef.current && splitRef.current.words.length) {
        tl.to(splitRef.current.words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          ease: ease.enter,
          stagger: 0.045,
        });
      } else {
        tl.to(headingRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: ease.enter,
        });
      }

      // 2. Deskripsi & Subheading fade up
      if (subheadRef.current) {
        tl.to(
          subheadRef.current,
          { opacity: 1, y: 0, duration: 0.65, ease: ease.enter },
          "-=0.45"
        );
      }
      if (captionRef.current) {
        tl.to(
          captionRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: ease.enter },
          "-=0.4"
        );
      }

      // 3. Visual settling
      if (activeImg) {
        tl.to(
          activeImg,
          { scale: 1.12, duration: 1.2, ease: "power2.out" },
          "-=0.8"
        );
      }

      // 4. CTA button reveal
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          { opacity: 1, y: 0, duration: 0.55, ease: ease.spring },
          "-=0.35"
        );
      }

      return () => {
        tl.kill();
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  // ─── 2. PARALLAX pada gambar mengikuti scroll (scrub) ─────────────
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const imgs = imgRefs.current.filter(Boolean);
      if (!imgs.length) return;

      imgs.forEach((img) => {
        gsap.to(img, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [slides.length] }
  );

  // ─── 3. CONTENT RE-ANIMATE saat slide berganti ────────────────────
  useGSAP(
    () => {
      if (!hasEntered) return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // Revert previous SplitText
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }

      const otherEls = [subheadRef.current, captionRef.current, ctaRef.current].filter(Boolean);
      const tl = gsap.timeline();

      try {
        if (headingRef.current) {
          splitRef.current = new SplitText(headingRef.current, {
            type: "words,lines",
            linesClass: "overflow-hidden py-0.5",
          });
          tl.fromTo(
            splitRef.current.words,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.65, ease: ease.enter, stagger: 0.03 }
          );
        }
      } catch {
        if (headingRef.current) {
          tl.fromTo(
            headingRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: ease.enter }
          );
        }
      }

      if (otherEls.length) {
        tl.fromTo(
          otherEls,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, ease: ease.enter, stagger: 0.08 },
          "-=0.4"
        );
      }

      return () => {
        tl.kill();
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [currentIndex] }
  );

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
      ref={sectionRef}
      className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#000000] text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =====================================================
          1. SLIDE BACKGROUNDS — native img, parallax via GSAP
          ===================================================== */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
            }`}
          >
            <img
              ref={(el) => { imgRefs.current[index] = el; }}
              src={slide.image}
              alt=""
              aria-hidden="true"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding={index === 0 ? "sync" : "async"}
              className="absolute inset-0 w-full h-full object-cover object-center scale-[1.12]"
            />
          </div>
        );
      })}

      {/* =====================================================
          2. OVERLAY — subtle visual depth
          ===================================================== */}
      <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" aria-hidden="true" />

      {/* =====================================================
          3. HERO CONTENT — Hierarki animasi jelas
          ===================================================== */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
        <h1
          ref={headingRef}
          className="text-[36px] sm:text-[46px] lg:text-[56px] font-semibold text-white leading-[1.07] tracking-[-0.28px] max-w-3xl mb-4 drop-shadow-lg"
        >
          {activeSlide.heading}
        </h1>

        <h2
          ref={subheadRef}
          className="text-[20px] sm:text-[24px] lg:text-[28px] font-normal text-white/90 leading-[1.25] tracking-[0.196px] max-w-2xl mb-3 drop-shadow-md"
        >
          {activeSlide.subheading}
        </h2>

        {activeSlide.caption && (
          <p
            ref={captionRef}
            className="text-[15px] sm:text-[17px] font-normal text-white/80 leading-relaxed max-w-2xl mb-8 drop-shadow"
          >
            {activeSlide.caption}
          </p>
        )}

        <div
          ref={ctaRef}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {activeSlide.buttonLabel && activeSlide.buttonUrl && (
            <Button href={activeSlide.buttonUrl} variant="primary" size="md">
              {activeSlide.buttonLabel}
            </Button>
          )}
          {activeSlide.secondaryCtaText && (
            <Button href={activeSlide.secondaryCtaHref} variant="text-link-on-dark" size="md">
              <span>{activeSlide.secondaryCtaText}</span>
              <span className="ml-1">→</span>
            </Button>
          )}
        </div>
      </div>

      {/* =====================================================
          4. CAROUSEL CONTROLS
          ===================================================== */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Slide Sebelumnya"
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[rgba(210,210,215,0.25)] hover:bg-[rgba(210,210,215,0.4)] backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 cursor-pointer apple-press-action"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Slide Selanjutnya"
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[rgba(210,210,215,0.25)] hover:bg-[rgba(210,210,215,0.4)] backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 cursor-pointer apple-press-action"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </>
      )}

      {/* =====================================================
          5. SLIDE DOTS
          ===================================================== */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-white/10 shadow-sm">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Pindah ke slide ${idx + 1}`}
              aria-current={idx === currentIndex ? "true" : undefined}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
