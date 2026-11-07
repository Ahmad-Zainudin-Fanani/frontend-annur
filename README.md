# Frontend An-Nur

Frontend publik SD Plus An-Nur yang mengambil data dari API Laravel.

## Konfigurasi

Isi `.env.local` dengan alamat API backend:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
API_BASE_URL=http://127.0.0.1:8000/api
```

Jalankan backend Laravel pada alamat tersebut, lalu mulai frontend:

```bash
npm run dev
```

## Cache frontend

- **Publik:** data GET yang diizinkan disimpan di Next.js Data Cache selama
  **60 detik**, dengan tag per resource. Server Components membaca backend
  langsung; browser membaca melalui BFF anonim `/api/public/*` dengan kebijakan
  cache yang sama. BFF tidak meneruskan cookie/token, dan respons HTTP browser
  memakai `no-store` agar tidak ada cache tambahan yang mengabaikan invalidasi.
- **Admin CMS:** hasil GET disimpan hanya di memori tab selama **30 detik**,
  maksimal 100 entri per tab. Query dinormalisasi, request bersamaan digabung,
  dan hasil diklon agar perubahan objek tidak merusak cache.
- CRM, dashboard, autentikasi/sesi, upload, mutasi, serta respons error tidak
  disimpan dalam cache admin. Respons BFF admin/sesi memakai
  `Cache-Control: private, no-store, max-age=0`; data tidak disimpan di
  `localStorage`, `sessionStorage`, atau cache bersama.
- Mutasi CMS yang berhasil melalui BFF menghapus cache admin dan menginvalidasi
  tag publik terkait. Login/logout/perubahan sesi membersihkan cache admin;
  `BroadcastChannel` menyinkronkan invalidasi antartab bila didukung browser.
  Cache admin juga dibersihkan saat tab kehilangan/mendapat fokus.

Arahkan `NEXT_PUBLIC_API_URL` dan `API_BASE_URL` ke backend yang sama agar
invalidasi admin memperbarui data publik yang benar. Tidak ada perubahan
konfigurasi backend yang diperlukan.

Perubahan dari klien lain tidak mengirim notifikasi ke Next.js: data publik
mengikuti revalidasi 60 detik (dapat menyajikan data lama saat revalidasi latar
belakang berjalan). Backend juga memiliki cache publik 300 detik; perubahan
langsung ke database yang melewati invalidasi backend dapat tertunda lebih lama.
Tab publik yang sudah terbuka tidak diperbarui secara realtime; muat ulang atau
navigasikan kembali untuk membaca data baru.

Kebijakan ada di `src/lib/cache-policy.js`, pembacaan publik di
`src/data/api.js`, dan cache admin di `src/lib/admin/api.js`.

## Ekstrakurikuler publik

Halaman `/ekstrakurikuler` menggantikan informasi lomba. URL lama `/lomba`
dialihkan permanen ke halaman tersebut. Konten dikelola melalui
`/admin/ekstrakurikuler`.

Frontend menggunakan `GET /api/extracurriculars?status=published&page=1&per_page=10`
pada backend yang dikonfigurasi di atas. Endpoint publik ini perlu tersedia di
Laravel tanpa autentikasi dan **hanya boleh mengembalikan data published**;
filter di frontend bukan pengganti pembatasan akses backend.

Kontrak respons yang digunakan (mengikuti struktur resource admin):

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Nama ekstrakurikuler",
      "description": "Deskripsi kegiatan",
      "status": "published",
      "order": 1,
      "images": [
        {
          "id": "uuid-foto",
          "url": "http://127.0.0.1:8000/storage/uploads/foto.jpg",
          "path": "uploads/foto.jpg",
          "alt_text": "Dokumentasi kegiatan",
          "order": 1
        }
      ]
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 10, "total": 1 }
}
```

`meta` bersifat opsional jika endpoint mengembalikan seluruh data tanpa
paginasi. Setiap kegiatan menyertakan seluruh `images`. URL foto relatif
diselesaikan terhadap origin backend; `path` upload tanpa `url` menggunakan
prefix `/storage/`. Backend Laravel tidak berada di repositori ini, sehingga
ketersediaan endpoint publik perlu diperiksa saat integrasi.

Perintah pemeriksaan: `npm run lint` dan `npm run build`.
