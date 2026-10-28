/**
 * gsapConfig.js
 * Satu tempat pendaftaran semua plugin GSAP.
 * Import file ini sekali saja di komponen top-level (layout atau provider).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

// Daftarkan plugin GSAP (hanya di client/browser atau aman di universal)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
}

export { gsap, ScrollTrigger, Flip, SplitText };

/**
 * Ease presets konsisten dengan desain An-Nur.
 * Terinspirasi dari kurva easing Apple Human Interface Guidelines.
 */
export const ease = {
  enter: "power3.out",
  exit: "power2.in",
  spring: "back.out(1.4)",
  smooth: "power2.inOut",
};

/**
 * Durasi standar (detik).
 */
export const dur = {
  fast: 0.35,
  base: 0.65,
  slow: 1.0,
  verySlow: 1.4,
};
