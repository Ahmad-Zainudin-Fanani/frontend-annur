# Panduan Frontend Admin Panel An-Nur

Panduan ini menjadi acuan saat membuat panel admin yang memakai API Laravel An-Nur. Dokumen ini menjelaskan struktur frontend, sesi, endpoint, payload, serta aturan validasi yang perlu diikuti.

## 1. Struktur Aplikasi

- Admin panel dan website company profile berjalan dalam satu aplikasi Next.js di root repo. Website berada di route group `src/app/(public)` dan admin di `src/app/(admin)`; nama route group tidak mengubah URL. Halaman admin tersedia di `/admin`, login di `/login`, dan website tetap memakai URL publik yang ada.
- Jalankan satu aplikasi dari root repo dengan `npm run dev` (atau `npm run build` dan `npm run start`). Gunakan Next.js App Router dan Tailwind sesuai stack proyek. Terapkan Atomic Design; komponen khusus admin berada di `src/components/admin/`.
- Kelompok halaman panel: dashboard, profil sekolah, guru, prestasi, lomba, pilar kurikulum, fase, slide hero, galeri, dan CRM kontak.
- Gunakan label dan pesan validasi berbahasa Indonesia. Setiap halaman daftar/form memiliki loading, empty, error, dan success state.

## 2. Integrasi API dan Sesi

Backend API menggunakan prefix `/api`. Untuk development, base URL umumnya `http://127.0.0.1:8000/api`. Simpan base URL dalam environment server-only aplikasi root, misalnya `API_BASE_URL`; jangan memakai prefix `NEXT_PUBLIC_`.

Browser hanya memanggil route handler BFF pada origin aplikasi. Route handler Next.js meneruskan request ke Laravel dengan header `Authorization: Bearer <token>`.

### Route sesi BFF

Route berikut adalah route lokal frontend, bukan endpoint Laravel:

| Route frontend | Fungsi |
|---|---|
| `POST /api/session/login` | Kirim email/password ke Laravel `POST /api/login`; pastikan role `admin` dan email sudah terverifikasi sebelum membuat sesi. |
| `GET /api/session` | Validasi token ke Laravel `GET /api/me` dan kembalikan user admin tanpa mengirim token ke browser. |
| `POST /api/session/logout` | Panggil Laravel `POST /api/logout`, lalu hapus cookie sesi. |
| `/api/admin/*` | Proxy hanya endpoint admin yang diizinkan; teruskan method, query, dan body yang sesuai. |

Simpan token Laravel dalam cookie `HttpOnly`, `SameSite=Lax`, `Path=/`, dan `Secure` di production. Cookie merupakan session cookie; jangan pernah mengirim token di JSON ke browser atau menyimpannya di `localStorage`/`sessionStorage`. Periksa `Origin` pada request mutasi BFF (`POST`, `PUT`, `PATCH`, `DELETE`). Untuk upload, teruskan `FormData` sebagai multipart dan jangan menetapkan header `Content-Type` secara manual.

Jika login mengembalikan role selain `admin` atau `email_verified: false`, jangan buat cookie sesi; cabut token melalui endpoint logout. BFF memeriksa sesi sebelum meneruskan request admin. Penolakan di frontend/BFF tidak menggantikan otorisasi backend.

Login Laravel menghapus personal access token lama milik user sebelum membuat token baru. Konfigurasi token saat ini tidak memiliki expiry; perilaku ini perlu diperhitungkan jika satu akun dipakai dari beberapa perangkat.

## 3. Endpoint dan Form

Semua endpoint pada bagian ini adalah route Laravel dan memerlukan bearer token. Route `/api/admin/*` juga mensyaratkan email terverifikasi.

### Dashboard dan profil

| Halaman | Endpoint | Data utama |
|---|---|---|
| Dashboard | `GET /api/admin/dashboard` | `crm_stats` berisi total dan hitungan status; `content_stats` berisi guru, prestasi, lomba, dan galeri; `recent_inquiries` berisi enam kontak terbaru. |
| Profil sekolah | `GET`, `PUT /api/admin/profile` | Identitas, kontak, visi/misi, principal, statistik, dan `public_sections`. Form edit mengambil data saat dibuka lalu mengirim field yang diubah dengan format API. |

Field top-level profil: `name` (wajib), `tagline`, `description`, `history`, `vision_title`, `vision[]`, `mission_title`, `missions[]`, `address`, `phone`, `whatsapp`, `email`, `maps_embed_url`, `facebook_url`, `instagram_url`, `youtube_url`, `principal_name`, `principal_title`, `principal_message`, `principal_education`, `principal_experience`, `principal_bio`, `principal_photo`, `accreditation`, `npsn`, `stats`, dan `public_sections`.

Field terstruktur dalam `public_sections`: `school_status`, `education_level`, `semester`, `utilities[]`; `location` (`coordinates`, `maps_url`, `full_address`); `core_values[]` (`code`, `title`, `desc`); `facilities[]` (`name`, `capacity`, `description`); `history` (`founding_year`, `founding_date`, `milestones[]` dengan `badge`, `date`, `title`, `desc`); `curriculum` (`overview`, `utilities[]`, `daily_schedule[]` dengan `time` dan `activity`); serta `leadership[]` (`name`, `role`, `gender`, `education`, `experience`, `bio`). Ikuti bentuk array/objek yang dikembalikan GET profile; jangan mengubahnya menjadi string JSON.

`principal_name` harus sama persis dengan tepat satu nama guru. Nama yang tidak ditemukan atau duplikat menghasilkan 422. Mengirim `principal_name` kosong mengakhiri masa jabatan aktif. Perubahan riwayat principal menggunakan record guru yang sudah ada.

### Resource CMS

Semua resource di tabel berikut memiliki pola `apiResource`: `GET` daftar, `POST` tambah, `GET /{id}` detail, `PUT` atau `PATCH /{id}` ubah, dan `DELETE /{id}` hapus. ID resource berupa UUID. Daftar CMS berupa array di `data` dan tidak memakai pagination.

| Halaman / endpoint | Field wajib | Field opsional/khusus |
|---|---|---|
| Guru — `/api/admin/teachers` | `name`, `subject` | `nip`, `role_title`, `education`, `photo`, `bio`, `gender` (`L`/`P`), `certifications[]`, `experience`, `is_leadership`, `is_active`, `order` |
| Prestasi — `/api/admin/achievements` | `title`, `category`, `level`, `year`, `recipient_name`, `status` | `organizer`, `description`, `image` |
| Lomba — `/api/admin/competitions` | `title`, `organizer`, `category`, `status` | `level`, `display_status`, `description`, `registration_deadline`, `event_date`, `location`, `guide_book_url`, `banner_image`, `is_featured` |
| Pilar kurikulum — `/api/admin/curriculum-pillars` | `title`, `description`, `status` | `subtitle`, `code`, `features` (object/array), `order` |
| Fase — `/api/admin/phases` | `title`, `phase_name`, `description`, `status` | `code`, `features` (object/array), `order` |
| Slide hero — `/api/admin/hero-slides` | `image`, `heading`, `subheading`, `caption`, `status` | `order`, `button_label` dan `button_url` (keduanya kosong atau keduanya terisi) |
| Galeri — `/api/admin/galleries` | `title`, `category`, `image`, `status` | `description`, `event_date` |

Untuk resource yang memiliki `status`, nilai yang diterima adalah `draft` atau `published`. Guru memakai `is_active`, bukan field `status`. Gunakan nilai `order` untuk urutan tampil. Pada CTA slide hero, URL harus berupa path internal (`/kontak`) atau URL HTTP(S); path yang diawali `//` tidak valid.

Filter daftar yang didukung API:

| Resource | Query |
|---|---|
| Guru | `search` |
| Prestasi | `search`, `category`, `status` |
| Lomba | `search`, `status` |
| Pilar, fase, slide hero | `status` |
| Galeri | `category`, `status` |

Untuk status draft dan terbit, kirim `status=draft` atau `status=published`; `status=all` menampilkan keduanya. Filter yang tidak tercantum pada tabel per resource jangan diasumsikan diterapkan hanya karena diterima validator umum.

Guru dengan riwayat kepala sekolah tidak dapat dihapus; API mengembalikan 422. Tawarkan aksi nonaktifkan (`is_active: false`) untuk mengarsipkan data tersebut.

### CRM kontak dan upload

| Fitur | Endpoint | Kontrak |
|---|---|---|
| Daftar kontak | `GET /api/admin/contacts` | Query `status`, `priority`, `search`, `per_page`, dan `page`; respons memakai pagination Laravel di dalam `data`. |
| Detail kontak | `GET /api/admin/contacts/{id}` | Mengembalikan kontak, handler, dan catatan. |
| Ubah status/prioritas | `PATCH /api/admin/contacts/{id}/status` | `crm_status`: `new`, `contacted`, `in_progress`, `resolved`, `closed`; `priority`: `low`, `normal`, `high`, `urgent`; `handled_by` opsional. |
| Tambah catatan | `POST /api/admin/contacts/{id}/notes` | Body `{ "note": "..." }`; panjang 3–2000 karakter. |
| Hapus kontak | `DELETE /api/admin/contacts/{id}` | Tidak ada endpoint tambah/edit pesan; pesan dibuat dari formulir publik. |
| Upload berkas | `POST /api/admin/upload` | Multipart field `file`, maksimal 5 MB; JPG/JPEG/PNG/WEBP/AVIF/GIF/PDF. Respons berisi `url` dan `path`. |

Laravel menyimpan upload di `storage/app/public/uploads` dan menyajikannya melalui `/storage/uploads/...`; jalankan `php artisan storage:link` sekali pada setiap environment agar file dapat diakses publik.

Gunakan URL dari respons upload sebagai nilai field gambar/file pada resource. Filter status kontak mendukung `all`, `new`, `contacted`, `in_progress`, `resolved`, `closed`; filter prioritas mendukung `all`, `low`, `normal`, `high`, `urgent`.

## 4. Bentuk Respons dan Penanganan Error

Respons sukses umumnya berbentuk `{ "success": true, "data": ... }`, dengan `message` pada operasi tulis tertentu. Login mengembalikan `token` dan `user`; `/api/me` mengembalikan `user`; upload mengembalikan `url` dan `path`. Jangan mengasumsikan semua endpoint menaruh hasil di bentuk yang sama tanpa memeriksa endpoint tersebut.

Tangani status HTTP berikut di UI:

- `401`: sesi tidak valid; hapus sesi BFF dan arahkan ke login.
- `403`: tampilkan pesan akses/verifikasi email; jangan mengulang request otomatis.
- `404`: tampilkan data tidak ditemukan dan perbarui daftar bila perlu.
- `422`: tampilkan `message` dan petakan `errors` per field form.
- Gangguan jaringan/5xx: tampilkan error yang bisa dicoba ulang tanpa mengganti data API dengan mock.

Setelah mutasi sukses, perbarui data daftar/detail dan dashboard yang terkait. API menginvalidasi cache publik pada perubahan konten; frontend admin tetap memuat ulang data melalui endpoint admin.

## 5. Batasan Keamanan dan Kriteria Selesai

- Route admin backend saat ini memakai `auth:sanctum` dan `verified`, tetapi belum memeriksa `role`. Sebelum production, tambahkan role guard backend untuk membatasi API pada admin; pemeriksaan role di BFF saja tidak cukup.
- Konfigurasi Sanctum saat ini tidak menetapkan masa kedaluwarsa token. Logout harus memanggil API untuk mencabut token dan menghapus cookie; tinjau expiry token backend sebelum production.
- Verifikasi panduan terhadap `routes/api.php`, FormRequest, controller, dan service sebelum menjadikan dokumen ini acuan implementasi. Jika kontrak API berubah, perbarui panduan pada perubahan yang sama.
- Panel dianggap siap saat seluruh area di tabel memiliki halaman dan aksi sesuai endpoint, request tidak membocorkan token ke browser, role selain admin/akun belum terverifikasi ditolak, validasi 422 tampil pada field yang benar, dan alur upload/CRM/pagination dapat digunakan.
