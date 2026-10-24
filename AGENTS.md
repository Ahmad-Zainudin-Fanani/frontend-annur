# AGENTS.md — Proyek Company Profile An-Nur

## 1. Tujuan
Bangun situs company profile An-Nur beserta panel admin, CMS, dan CRM. Pastikan aplikasi mudah digunakan, aman, responsif, dan mudah dikembangkan.

## 2. Dokumen Acuan
Sebelum mulai bekerja, baca kedua file berikut:
- `AGENTS.md`: aturan kerja, pembagian tugas, dan standar pengembangan proyek.
- `DESIGN.md`: acuan utama desain antarmuka, warna, tipografi, jarak, komponen, dan responsivitas.

Ikuti `DESIGN.md` untuk tampilan frontend. Terapkan sistem desainnya pada identitas An-Nur; jangan menyalin identitas atau konten merek Apple yang mungkin muncul sebagai referensi.

## 3. Teknologi
- Backend: Laravel 13 atau lebih baru, PHP 8.5.12, PostgreSQL.
- Autentikasi API: Laravel Sanctum.
- Frontend: Next.js, tailwind.

Periksa konfigurasi dan versi yang benar-benar tersedia di repositori sebelum mengubah dependensi. Jangan mengganti teknologi utama tanpa persetujuan tim.

## 4. Struktur Aplikasi dan Ruang Lingkup
Pisahkan aplikasi **company profile (compro)** dan **admin panel** ke direktori frontend yang berbeda. Keduanya boleh memakai backend/API yang sama, tetapi halaman, layout, dan fitur khusus admin tidak boleh dicampur ke aplikasi compro.

Contoh struktur (sesuaikan dengan repositori yang ada):

```text
/
├── AGENTS.md
├── DESIGN.md
├── backend/                 # Laravel API
├── compro/                  # Next.js company profile
└── admin-panel/             # Next.js admin, CMS, dan CRM
```

Gunakan **Atomic Design** untuk struktur frontend pada kedua aplikasi:
- `atoms/`: elemen dasar, seperti tombol, label, dan input.
- `molecules/`: gabungan elemen sederhana, seperti kolom formulir.
- `organisms/`: bagian antarmuka kompleks, seperti navigasi, formulir lengkap, dan tabel.
- `templates/`: kerangka tata letak halaman.
- `pages/` atau sistem routing bawaan Next.js: halaman/rute aplikasi. Jangan mengganti sistem routing Next.js hanya demi menyesuaikan nama folder Atomic Design.

Hindari duplikasi komponen yang sama. Jika komponen perlu dipakai bersama, tempatkan di direktori bersama yang jelas tanpa menghilangkan pemisahan kedua aplikasi.

Ruang lingkup:
- **Compro:** profil, kontak, prestasi, guru, galeri, informasi lomba, dan kurikulum.
- **Admin panel:** autentikasi dan otorisasi admin, CMS untuk mengelola konten, serta CRM untuk mengelola data dan tindak lanjut kontak atau calon pengguna.

## 5. Pembagian Tugas Tim
Semua anggota bekerja **full-stack**. Pembagian berikut adalah kepemilikan utama agar beban seimbang, bukan larangan membantu bagian anggota lain.

- **Fanani — Profil dan konten publik:** halaman profil, guru, prestasi, kurikulum; termasuk API, basis data, tampilan, dan pengujian fitur tersebut.
- **Adit — Galeri dan informasi:** galeri, informasi lomba, kontak; termasuk API, basis data, tampilan, dan pengujian fitur tersebut.
- **Rapi — Admin, CMS, dan CRM:** autentikasi/otorisasi admin, pengelolaan konten, data kontak/calon pengguna; termasuk API, basis data, tampilan, dan pengujian fitur tersebut.

**Dikerjakan bersama:** struktur proyek, integrasi frontend-backend, desain global, skema data yang dipakai lintas fitur, standar keamanan, pengujian integrasi, dan peninjauan kode. Sepakati kontrak API serta perubahan tabel bersama sebelum mengerjakan bagian yang saling bergantung.

## 6. Aturan Pengembangan
1. Pahami struktur dan pola kode yang sudah ada sebelum mengubah file.
2. Kerjakan perubahan sekecil dan sejelas mungkin; hindari mengubah bagian yang tidak terkait.
3. Gunakan penamaan yang konsisten, komponen yang dapat digunakan ulang, dan validasi data di server.
4. Semua endpoint yang memerlukan akses harus memeriksa autentikasi dan hak akses di backend.
5. Jangan menyimpan rahasia, kata sandi, atau token privat di kode frontend maupun repositori.
6. Validasi unggahan file, batasi tipe dan ukuran, serta jangan percaya data dari pengguna.
7. Jangan menimpa pekerjaan anggota lain. Beri tahu tim jika mengubah API, skema basis data, atau file bersama.
8. Jangan melakukan commit, push, menghapus data, atau menjalankan perubahan destruktif tanpa instruksi atau persetujuan yang sesuai.

## 7. Pemeriksaan Sebelum Selesai
- Jalankan pemeriksaan, lint, dan pengujian yang tersedia di proyek.
- Uji alur utama dan kondisi gagal, termasuk validasi serta akses tanpa izin.
- Pastikan tampilan responsif dan sesuai `DESIGN.md`.
- Perbarui dokumentasi atau contoh konfigurasi jika perubahan memerlukannya.
- Dalam laporan akhir, sebutkan perubahan, pengujian yang dijalankan, hasilnya, dan hal yang belum selesai.

## 8. Prinsip Agen AI
Baca `AGENTS.md` dan `DESIGN.md` sebelum bekerja. Jangan mengarang konfigurasi atau menganggap fitur sudah tersedia tanpa memeriksa repositori. Jika kebutuhan penting belum jelas, tanyakan sebelum mengambil keputusan yang berdampak besar.
