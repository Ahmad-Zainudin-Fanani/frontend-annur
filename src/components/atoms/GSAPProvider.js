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

    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    // Refresh setelah font selesai dimuat agar tinggi layout final
    // (dan posisi pin) sudah stabil — mengurangi layout shift.
    document.fonts?.ready.then(refresh);

    // Refresh setelah semua gambar termuat.
    const onLoad = () => refresh();
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
