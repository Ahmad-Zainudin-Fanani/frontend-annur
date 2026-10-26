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

Perintah pemeriksaan: `npm run lint` dan `npm run build`.
