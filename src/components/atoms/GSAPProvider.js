"use client";

/**
 * GSAPProvider
 *
 * Client component yang mendaftarkan plugin GSAP (ScrollTrigger dll.)
 * sekali saja di level root agar semua komponen bisa menggunakannya
 * tanpa mendaftarkan ulang.
 *
 * Tidak merender apapun ke DOM (returns null).
 */

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GSAPProvider() {
  useEffect(() => {
    // Konfigurasi global ScrollTrigger
    ScrollTrigger.config({
      // Toleransi 1px untuk menghindari flicker di beberapa browser
      limitCallbacks: true,
    });

    // Refresh ScrollTrigger setelah semua font & gambar termuat
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
