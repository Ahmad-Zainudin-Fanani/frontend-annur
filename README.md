# Frontend An-Nur

Frontend publik SD Plus An-Nur yang mengambil data dari API Laravel.

## Konfigurasi

Isi `.env.local` dengan alamat API backend:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Jalankan backend Laravel pada alamat tersebut, lalu mulai frontend:

```bash
npm run dev
```

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
