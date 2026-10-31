/**
 * smoothScroll.js
 * Akses instance Lenis untuk navigasi programatik (mis. panah timeline).
 * Lenis dibuat sekali di SmoothScroll; modul ini hanya menyimpan referensinya
 * agar komponen lain bisa memakai animasi scroll yang sama tanpa konflik.
 */

let lenisInstance = null;

export function setLenisInstance(instance) {
  lenisInstance = instance;
}

export function getLenisInstance() {
  return lenisInstance;
}
