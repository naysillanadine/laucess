# Panduan Lengkap SEO Launcess (nadin.web.id)

Website sudah dilengkapi file SEO dasar. Ikuti langkah di bawah **setelah kamu deploy ulang** ke GitHub Pages.

---

## 1. Deploy Ulang (PENTING)

1. Upload semua file dari ZIP ini ke repo GitHub kamu (overwrite yang lama).
2. Pastikan GitHub Pages aktif (Settings → Pages → Source: Deploy from branch `main` / root).
3. Tunggu 1–5 menit, lalu buka https://nadin.web.id/ dan pastikan halaman landing page muncul (bukan halaman verifikasi Google lagi).

---

## 2. Google Search Console (WAJIB)

Link: https://search.google.com/search-console

1. Login dengan akun Google yang sama dengan yang dipakai verifikasi sebelumnya.
2. Pilih properti **https://nadin.web.id/** (atau tambahkan jika belum ada).
3. Karena meta verification sudah ada, status harus **Verified**.
4. Di menu kiri → **Sitemaps** → masukkan:
   ```
   sitemap.xml
   ```
   lalu klik **Submit**.
5. Di menu **URL Inspection** → masukkan `https://nadin.web.id/` → **Request Indexing**.
6. Ulangi untuk halaman penting lainnya jika ada.

---

## 3. Google Business Profile (Sangat Direkomendasikan)

Link: https://business.google.com/

1. Buat profil bisnis baru (kategori: **Laundry service** atau **Dry cleaner**).
2. Isi alamat, jam operasional, nomor telepon, website: `https://nadin.web.id/`
3. Upload foto (pakai assets/laundry.jpg, desain.png, dll.).
4. Verifikasi bisnis (biasanya via postcard atau telepon).

Ini sangat membantu ranking lokal ("laundry terdekat").

---

## 4. Bing Webmaster Tools

Link: https://www.bing.com/webmasters

1. Login dengan Microsoft account.
2. Add site → `https://nadin.web.id/`
3. Verifikasi (bisa pakai meta tag atau import dari Google Search Console).
4. Submit sitemap: `https://nadin.web.id/sitemap.xml`

---

## 5. Open Graph & Social Preview Testing

Setelah deploy:

- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
  → masukkan `https://nadin.web.id/` → **Scrape Again**
- Twitter/X Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

Pastikan gambar OG muncul dengan benar.

---

## 6. PageSpeed & Core Web Vitals

Link: https://pagespeed.web.dev/

1. Test `https://nadin.web.id/`
2. Perbaiki jika ada skor rendah (gambar sudah relatif kecil, tapi bisa dioptimasi lebih lanjut dengan WebP jika perlu).

---

## 7. Schema Markup (Sudah dipasang)

JSON-LD LocalBusiness sudah ada di `<head>`.  
Cek di: https://search.google.com/test/rich-results

---

## 8. Langkah Tambahan (Opsional tapi Bagus)

| Langkah | Link | Keterangan |
|---------|------|----------|
| Google Analytics 4 | https://analytics.google.com/ | Buat property → pasang gtag di index.html |
| Microsoft Clarity | https://clarity.microsoft.com/ | Heatmap gratis, sangat berguna |
| Instagram | @nnws_dinee25 | Cantumkan link website di bio |
| WhatsApp Business | - | Buat katalog + link ke website |
| Google Maps | - | Pastikan alamat muncul di Maps |

---

## 9. Checklist Setelah Deploy

- [ ] https://nadin.web.id/ menampilkan landing page lengkap
- [ ] https://nadin.web.id/robots.txt bisa dibuka
- [ ] https://nadin.web.id/sitemap.xml bisa dibuka
- [ ] Favicon muncul di tab browser
- [ ] OG image muncul saat di-share di WhatsApp/Facebook
- [ ] Sitemap sudah di-submit di Search Console
- [ ] Request Indexing sudah dilakukan
- [ ] Google Business Profile sudah dibuat (jika punya alamat fisik)

---

## File SEO yang Sudah Ditambahkan

| File | Fungsi |
|------|--------|
| `robots.txt` | Memberi tahu bot apa yang boleh di-crawl |
| `sitemap.xml` | Daftar halaman untuk diindeks |
| `site.webmanifest` | PWA / icon di home screen |
| `assets/og-image.jpg` | Gambar saat di-share di sosial media (1200×630) |
| `assets/favicon.png` + `.svg` | Icon tab browser |
| Meta tags di `index.html` | Title, description, Open Graph, Twitter Card, canonical, robots |
| JSON-LD Schema | LocalBusiness structured data |
| `admin.html` | `noindex` agar tidak masuk Google |

---

**Catatan penting:**  
Isi `js/config.js` dengan URL Apps Script kamu sebelum atau sesudah deploy agar form order berfungsi.

Semoga ranking naik! 🚀
