# BeeZap Landing Page

Landing page statis BeeZap WhatsApp Business API — HTML, CSS, dan JavaScript murni (tanpa build step).

## Struktur

```
index.html          Halaman utama
css/style.css       Semua style
js/main.js          FAQ, form, smooth scroll, animasi scroll
assets/img/         Gambar, logo, favicon
.nojekyll           Agar GitHub Pages tidak memproses file dengan Jekyll
```

## Catatan

- Semua path relatif, jadi aman dipasang di subfolder (misalnya GitHub Pages `/<nama-repo>/`).
- Logo klien dimuat dari `https://beezap.id/assets/img/clients/`. Jika ingin mandiri, simpan kelima file logo ke `assets/img/clients/` dan ganti `src`-nya di `index.html`.
- Form demo memeriksa isian lalu menawarkan kirim via WhatsApp; belum tersambung ke CRM/email.
- Font (Google Fonts) dan smooth scroll (Lenis, via jsDelivr) dimuat dari CDN.
