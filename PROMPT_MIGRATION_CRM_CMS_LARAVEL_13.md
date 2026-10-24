# Prompt Pembuatan Migration CRM dan CMS Laravel

## 1. Stack Teknologi

- PHP **8.5.12**.
- Laravel **13.38.0**.
- Database: MySQL.
- ORM: Eloquent.

Gunakan konvensi dan fitur migration yang kompatibel dengan versi Laravel tersebut.

## 2. Ruang Lingkup

Fokus pekerjaan **hanya pada perancangan dan pembuatan migration database** untuk modul CRM dan CMS aplikasi sekolah.

Jangan membuat endpoint API, route, controller, service, frontend, model tambahan, seeder, factory, atau implementasi autentikasi pada tahap ini. Laravel Sanctum akan digunakan pada tahap API berikutnya, bukan dikerjakan sekarang.

Modul PPDB dan SIAKAD juga belum termasuk dalam ruang lingkup.

## 3. Ketentuan Umum Database

- Periksa migration yang sudah ada sebelum membuat migration baru agar tidak terjadi duplikasi.
- Gunakan tabel `users` bawaan Laravel jika sudah tersedia. Jangan membuat tabel `users` baru.
- Jangan membuat tabel `roles` atau `permissions` khusus.
- Gunakan nama tabel dan kolom yang konsisten dengan konvensi Laravel.
- Tentukan tipe data, panjang kolom, `nullable`, nilai default, index, dan foreign key sesuai kebutuhan.
- Gunakan `constrained()`, `cascadeOnDelete()`, `nullOnDelete()`, atau aturan penghapusan lain secara tepat berdasarkan hubungan data.
- Gunakan `timestamps()` dan `softDeletes()` hanya jika sesuai kebutuhan tabel.
- Pastikan urutan migration memperhatikan dependensi foreign key.
- Pastikan migration dapat dijalankan dan di-rollback dengan benar.
- Jangan menyimpan file upload sebagai binary di database. Simpan file melalui Laravel Storage dan metadata file di database.
- Hindari kolom yang tidak diperlukan dan jelaskan asumsi desain yang penting.

## 4. Migration CRM

Buat migration untuk tabel berikut:

1. `lead_sources` — menyimpan sumber calon pelanggan, misalnya website, media sosial, atau referensi.
2. `leads` — menyimpan data calon pelanggan, informasi kontak, sumber, status, dan jadwal tindak lanjut.
3. `lead_activities` — menyimpan riwayat komunikasi dan aktivitas terhadap calon pelanggan.
4. `lead_notes` — menyimpan catatan tambahan terkait calon pelanggan.

Ketentuan CRM:

- Hubungkan lead dengan sumbernya menggunakan foreign key bila sesuai.
- Hubungkan aktivitas dan catatan dengan lead.
- Jika aktivitas atau catatan memiliki pembuat, hubungkan dengan tabel `users` yang sudah ada.
- Gunakan status lead yang konsisten, minimal `new`, `contacted`, `interested`, `follow_up`, `converted`, dan `lost`.
- Pertimbangkan index untuk kolom yang umum digunakan dalam pencarian atau penyaringan, seperti status, sumber, dan jadwal tindak lanjut.
- Tentukan aturan penghapusan data yang tidak menyebabkan data yatim atau hilangnya riwayat penting secara tidak sengaja.

## 5. Migration CMS

Buat migration untuk tabel berikut:

1. `categories` — kategori konten.
2. `pages` — halaman statis website.
3. `posts` — artikel atau berita sekolah.
4. `media` — metadata file dan gambar.
5. `announcements` — pengumuman sekolah.
6. `banners` — banner website.
7. `menus` — navigasi website.
8. `settings` — pengaturan website.

Ketentuan CMS:

- Tentukan kolom yang sesuai, misalnya `title`, `slug`, `content`, `status`, `published_at`, dan `sort_order` jika relevan untuk masing-masing tabel.
- Gunakan slug unik pada tabel yang memerlukannya.
- Hubungkan konten dengan kategori, media, atau pengguna sesuai kebutuhan desain.
- Simpan metadata file pada tabel `media`, seperti nama file, path, MIME type, ukuran, dan alt text jika diperlukan.
- Tentukan status publikasi yang konsisten, misalnya `draft` dan `published`, sesuai kebutuhan setiap jenis konten.
- Untuk `menus`, pertimbangkan struktur hierarki jika menu bertingkat memang diperlukan.
- Untuk `settings`, tentukan struktur key-value yang konsisten dan jangan mengasumsikan semua pengaturan boleh ditampilkan secara publik.
- Tambahkan index pada kolom yang sering dicari atau digunakan untuk mengurutkan konten.

## 6. Output yang Diminta

Berikan hasil berikut:

1. Daftar seluruh migration yang diperlukan beserta urutannya.
2. Isi lengkap setiap file migration Laravel, siap ditempatkan di direktori `database/migrations`.
3. Penjelasan singkat fungsi setiap tabel dan relasi antartabel.
4. Penjelasan keputusan penting terkait foreign key, index, status, nullable, dan aturan penghapusan data.
5. Perintah untuk menjalankan migration dan melakukan rollback.
6. Pemeriksaan konsistensi agar tidak ada tabel duplikat, dependensi foreign key yang salah, atau tipe data relasi yang tidak cocok.

## 7. Batasan Pengerjaan

Jangan membuat endpoint, route API, controller, service, model tambahan, seeder, factory, autentikasi Sanctum, atau fitur frontend. Jangan memasukkan tabel PPDB maupun SIAKAD.

Jika struktur proyek sudah berisi migration bawaan Laravel, gunakan struktur yang ada dan jangan membuat ulang tabel yang sama. Jika ada keputusan skema yang belum jelas, nyatakan asumsi secara singkat sebelum memberikan migration.

**Target akhir:** migration database CRM dan CMS yang rapi, konsisten, dapat dijalankan, dapat di-rollback, dan siap menjadi fondasi pengembangan aplikasi sekolah Laravel.
