# Nimbus - Landing Page SaaS

Landing page untuk produk SaaS **fiktif** bernama Nimbus, aplikasi buat mengatur tugas tim. Cuma satu file `index.html`: CSS dan JavaScript-nya sudah di dalam, tanpa library, tanpa font atau gambar dari luar.

## Isinya

- Header yang tetap di atas, lengkap dengan menu untuk HP (bisa ditutup pakai tombol Escape)
- Bagian pembuka dengan tombol ajakan dan contoh tampilan aplikasi dari HTML/CSS
- Daftar fitur dengan ikon SVG
- Cara kerja dalam tiga langkah
- Tiga paket harga fiktif, bisa ganti antara bulanan dan tahunan
- FAQ yang bisa dibuka-tutup, juga pakai keyboard
- Form daftar email yang dicek dulu sebelum dikirim (ada pesan salah dan pesan berhasil; datanya tidak dikirim ke mana-mana)
- Tema gelap dan terang: ikut pengaturan perangkat, bisa diganti manual, dan diingat browser
- Nyaman diakses: HTML semantik, tombol "Langsung ke isi halaman", fokus keyboard kelihatan, kontras warna cukup, dan animasi mati kalau perangkat minta "kurangi gerakan"
- Rapi di HP maupun layar besar

## Cara pakai

1. Download atau salin file `index.html`.
2. Buka langsung di browser. Nggak perlu build atau server.
3. Ganti teksnya langsung di HTML. Daftar fitur, paket harga, dan FAQ ada di bagian `<script>` (`features`, `plans`, `faqs`).
4. Ganti warna lewat variabel CSS di blok `:root` (misalnya `--primary`, `--accent`, `--bg`, `--text`). Warna tema gelap ada di blok `:root[data-theme="dark"]` dan di media query `prefers-color-scheme`.

## Lisensi

MIT. Bebas dipakai, diubah, dan dibagikan. Nimbus cuma nama fiktif untuk contoh.
