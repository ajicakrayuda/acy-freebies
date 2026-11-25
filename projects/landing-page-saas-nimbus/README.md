# Nimbus - Landing Page SaaS

Landing page untuk produk SaaS **fiktif** bernama Nimbus, aplikasi buat mengatur tugas tim. Isinya tiga file yang rapi dan terpisah, tanpa library, tanpa font atau gambar dari luar.

## File

| File | Isi |
|---|---|
| `index.html` | Isi halaman |
| `style.css` | Tampilan, dikelompokkan per bagian halaman |
| `script.js` | Perilaku: tema, menu HP, harga, FAQ, dan pengecekan form |

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

1. Download ketiga file (`index.html`, `style.css`, `script.js`) dan taruh di satu folder.
2. Buka `index.html` di browser. Nggak perlu build atau server.
3. Ganti teks halaman di `index.html`. Daftar fitur, paket harga, dan FAQ ada di `script.js` (`features`, `plans`, `faqs`).
4. Ganti warna lewat variabel di bagian paling atas `style.css` (misalnya `--primary`, `--accent`, `--bg`, `--text`). Warna tema gelap ada di blok `:root[data-theme="dark"]` dan di media query `prefers-color-scheme`.

## Lisensi

MIT. Bebas dipakai, diubah, dan dibagikan. Nimbus cuma nama fiktif untuk contoh.
