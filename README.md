# Launcess — Laundry Kekinian

Website landing page + sistem order online dengan **Google Sheets** sebagai database (gratis) dan **Google Apps Script** sebagai backend API.

## Fitur

- Landing page modern (responsive)
- **Form Order Online** → data langsung masuk Google Sheet
- **Nomor Order otomatis** (LC-YYMMDD-XXX)
- **Cek Status Order** oleh pelanggan
- **Admin Dashboard** (password protected)
  - Lihat semua order
  - Filter & search
  - Ubah status, harga, catatan
  - Link WhatsApp ke pelanggan
- Hosting gratis di GitHub Pages

## Struktur File

```
├── index.html          → halaman utama (order + cek status)
├── admin.html          → dashboard admin
├── css/style.css
├── js/
│   ├── config.js       → ⚠️ ISI URL Apps Script di sini
│   ├── app.js
│   └── admin.js
├── assets/
├── apps-script/
│   └── Code.gs         → kode backend (paste ke Apps Script)
└── SETUP.md            → panduan setup lengkap
```

## Cara Deploy

Baca **SETUP.md** langkah demi langkah.

Singkatnya:
1. Buat Google Sheet + paste `Code.gs` ke Apps Script → Deploy as Web App
2. Copy URL Web App → tempel di `js/config.js`
3. Upload semua file ke GitHub → aktifkan GitHub Pages

## Default Password Admin

```
launcess2026
```

Ganti di dua tempat:
- `apps-script/Code.gs` → `ADMIN_PASSWORD`
- `js/config.js` → `ADMIN_PASSWORD`

## Kontak Instagram

@nnws_dinee25
