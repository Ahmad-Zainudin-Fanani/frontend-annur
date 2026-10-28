"use client";

/**
 * HistoryJourneyMotion — koreografi penanda "waypoint" pada section
 * "Sejarah Berdiri".
 *
 * Konsep:
 * - Setiap kartu tonggak punya slot penanda (waypoint) di dalamnya.
 * - Satu penanda berlian berjalan dari slot ke slot mengikuti lintasan
 *   MotionPath saat halaman di-scroll. Tidak ada garis, SVG, atau timeline
 *   line yang digambar — MotionPath hanya dipakai sebagai pengatur gerak.
 * - Lintasan tiap segmen dibuat dari geometri asli (posisi slot dan celah
 *   antar kartu), jadi berlian bergerak di area kosong kartu dan tidak
 *   menutupi teks, lalu dihitung ulang saat resize.
 * - Tiap segmen punya durasi sama, sehingga berlian selalu berhenti tepat
 *   di tengah slot saat progres scroll mencapai tonggak tersebut.
 * - ScrollTrigger memakai scrub langsung tanpa jeda, sehingga posisi berlian
 *   selalu sama dengan posisi scroll — termasuk tepat di tonggak pertama saat
 *   halaman berada di paling atas.
 * - Isi kartu muncul dengan stagger halus saat masuk viewport, dan kartu yang
 *   sedang "dituju" berlian diberi state aktif (border + slot lebih terang).
 * - prefers-reduced-motion: berlian disembunyikan, isi kartu tampil tanpa
 *   animasi, dan tiap slot menampilkan penanda statisnya sendiri.
 */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const CORNER_RADIUS = 48;

/**
 * Lintasan satu segmen: turun dari slot, menyeberang di celah antar kartu,
 * lalu turun lagi ke slot berikutnya. Semua koordinat relatif kontainer.
 */
const buildSegmentPath = (from, to) => {
  const gapY = (from.y + to.y) / 2;
  const direction = Math.sign(to.x - from.x) || 1;
  const radius = Math.max(
    0,
    Math.min(
      CORNER_RADIUS,
      Math.abs(to.x - from.x) / 3,
      (gapY - from.y) / 2,
      (to.y - gapY) / 2
    )
  );

  return [
    `M ${from.x} ${from.y}`,
    `L ${from.x} ${gapY - radius}`,
    `Q ${from.x} ${gapY} ${from.x + direction * radius} ${gapY}`,
    `L ${to.x - direction * radius} ${gapY}`,
    `Q ${to.x} ${gapY} ${to.x} ${gapY + radius}`,
    `L ${to.x} ${to.y}`,
  ].join(" ");
};

export default function HistoryJourneyMotion({ children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const diamond = root.querySelector("[data-history-diamond]");
    const journey = root.querySelector("[data-history-journey]");
    const steps = Array.from(root.querySelectorAll("[data-history-step]"));
    if (!diamond || !journey || !steps.length) return;

    const cards = steps
      .map((step) => step.querySelector("[data-history-card]"))
      .filter(Boolean);
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    let context = null;
    let revealContext = null;
    let resizeFrame = 0;
    let disposed = false;

    const clearActive = () => {
      cards.forEach((card) => card.removeAttribute("data-active"));
    };

    const reset = () => {
      context?.revert();
      context = null;
      gsap.set(diamond, { clearProps: "all" });
      clearActive();
      root.removeAttribute("data-history-motion");
    };

    // Isi kartu: fade + naik halus, stagger per kartu. Tidak menyentuh posisi
    // kartu/slot, jadi lintasan berlian tetap presisi.
    const buildReveals = () => {
      revealContext?.revert();
      revealContext = null;

      if (motionQuery.matches) return;

      revealContext = gsap.context(() => {
        steps.forEach((step) => {
          const items = step.querySelectorAll("[data-history-reveal]");
          if (!items.length) return;

          gsap.from(items, {
            autoAlpha: 0,
            y: 20,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: step,
              start: "top 88%",
              once: true,
            },
          });
        });
      }, root);
    };

    // Kartu terdekat dari posisi berlian diberi state aktif.
    const markActive = (progress) => {
      if (!cards.length) return;
      const index = Math.round(progress * (cards.length - 1));

      cards.forEach((card, cardIndex) => {
        if (cardIndex === index) card.setAttribute("data-active", "true");
        else card.removeAttribute("data-active");
      });
    };

    const build = () => {
      if (disposed) return;

      reset();

      if (motionQuery.matches) {
        root.setAttribute("data-history-motion", "static");
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const diamondWidth = diamond.offsetWidth || 22;
      const diamondHeight = diamond.offsetHeight || 22;

      // Titik pusat tiap slot, relatif terhadap kontainer animasi.
      const points = steps
        .map((step) => {
          const marker = step.querySelector("[data-history-marker]");
          if (!marker) return null;
          const markerRect = marker.getBoundingClientRect();

          return {
            x:
              markerRect.left +
              markerRect.width / 2 -
              rootRect.left -
              diamondWidth / 2,
            y:
              markerRect.top +
              markerRect.height / 2 -
              rootRect.top -
              diamondHeight / 2,
          };
        })
        .filter(Boolean);

      if (!points.length) return;

      const paths = [];
      for (let index = 0; index < points.length - 1; index += 1) {
        paths.push(buildSegmentPath(points[index], points[index + 1]));
      }

      context = gsap.context(() => {
        gsap.set(diamond, {
          x: points[0].x,
          y: points[0].y,
          autoAlpha: 1,
        });

        if (!paths.length) return;

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: journey,
            // Fungsi + klem 0: bila section berada dekat atas halaman,
            // animasi tetap mulai dari tonggak pertama, bukan di tengah rute.
            start: () =>
              Math.max(
                0,
                journey.getBoundingClientRect().top +
                  window.scrollY -
                  window.innerHeight * 0.78
              ),
            end: () => {
              const rect = journey.getBoundingClientRect();
              return (
                rect.top +
                window.scrollY +
                rect.height -
                window.innerHeight * 0.62
              );
            },
            scrub: true,
            onUpdate: (self) => markActive(self.progress),
            onRefresh: (self) => markActive(self.progress),
          },
        });

        paths.forEach((path, index) => {
          timeline.to(
            diamond,
            {
              duration: 1,
              motionPath: { path },
            },
            index
          );
        });
      }, root);

      root.setAttribute("data-history-motion", "active");
      ScrollTrigger.refresh();
    };

    const scheduleBuild = () => {
      if (disposed) return;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(build);
    };

    buildReveals();
    build();

    const resizeObserver = new ResizeObserver(scheduleBuild);
    resizeObserver.observe(root);

    const handleMotionChange = () => {
      buildReveals();
      build();
    };
    motionQuery.addEventListener?.("change", handleMotionChange);

    document.fonts?.ready.then(scheduleBuild);

    return () => {
      disposed = true;
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      motionQuery.removeEventListener?.("change", handleMotionChange);
      revealContext?.revert();
      revealContext = null;
      reset();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {children}
    </div>
  );
}
