# Setup Launcess — Google Sheet + Apps Script + GitHub Pages

Ikuti langkah di bawah **berurutan**. Total waktu ± 10–15 menit.

---

## 1. Buat Google Spreadsheet (Database)

1. Buka [https://sheets.google.com](https://sheets.google.com) → **Blank** spreadsheet.
2. Rename spreadsheet menjadi **Launcess Orders** (klik judul di kiri atas).
3. Rename sheet tab pertama menjadi **Orders** (klik kanan tab → Rename).
4. (Opsional) Isi baris 1 dengan header berikut (Apps Script juga bisa auto-buat):

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| OrderID | Timestamp | Nama | WhatsApp | Layanan | Estimasi | Alamat | Catatan | Status | HargaFinal | CatatanAdmin |

---

## 2. Pasang Google Apps Script

1. Di spreadsheet yang sama → menu **Extensions → Apps Script**.
2. Hapus semua kode default di `Code.gs`.
3. Buka file `apps-script/Code.gs` dari folder ini, **copy SEMUA isinya**, paste ke editor Apps Script.
4. Klik ikon 💾 **Save** (atau Ctrl+S).
5. (Opsional) Ganti password di baris:
   ```js
   const ADMIN_PASSWORD = "launcess2026";
   ```
   Ganti dengan password kamu sendiri. **Harus sama** dengan yang di `js/config.js`.

---

## 3. Deploy sebagai Web App

1. Di editor Apps Script → klik **Deploy → New deployment**.
2. Klik gear ⚙️ di samping "Select type" → pilih **Web app**.
3. Isi:
   - **Description**: `Launcess API v1`
   - **Execute as**: `Me` (akun Google kamu)
   - **Who has access**: `Anyone`
4. Klik **Deploy**.
5. Google akan minta **Authorize access**:
   - Pilih akun Google kamu
   - Klik **Advanced → Go to Launcess Orders (unsafe)** (ini normal untuk script pribadi)
   - Klik **Allow**
6. Setelah deploy, **copy URL** yang muncul (bentuknya:  
   `https://script.google.com/macros/s/AKfycb....../exec`)

> ⚠️ Simpan URL ini. Kalau nanti kamu edit script, deploy ulang dengan **Manage deployments → Edit → New version**.

---

## 4. Hubungkan Frontend ke API

1. Buka file `js/config.js` di folder website.
2. Ganti baris ini:
   ```js
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
   ```
   dengan URL yang kamu copy di langkah 3.
3. (Opsional) Sesuaikan password:
   ```js
   const ADMIN_PASSWORD = "launcess2026";
   ```
   harus sama dengan yang di `Code.gs`.

---

## 5. Deploy ke GitHub Pages

1. Buat repository baru di GitHub (misal: `launcess`).
2. Upload **semua isi folder ini** (kecuali folder `apps-script` kalau mau, tapi boleh ikut).
3. Pastikan struktur root repo seperti:
   ```
   ├── index.html
   ├── admin.html
   ├── CNAME          (opsional, untuk custom domain)
   ├── css/
   │   └── style.css
   ├── js/
   │   ├── config.js
   │   ├── app.js
   │   └── admin.js
   ├── assets/
   │   ├── favicon.svg
   │   ├── favicon.png
   │   └── laundry.jpg
   └── SETUP.md
   ```
4. Settings → Pages → Source: **Deploy from a branch** → Branch: `main` → folder `/ (root)` → Save.
5. Tunggu 1–2 menit, website hidup di `https://username.github.io/launcess/`  
   (atau di custom domain kalau CNAME sudah di-set).

---

## 6. Uji Coba

1. Buka website → scroll ke **Order Online** → isi form → Kirim.
2. Cek Google Sheet → harus muncul baris baru dengan Order ID (contoh: `LC-241013-001`).
3. Buka bagian **Cek Status** → masukkan nomor order → harus muncul data.
4. Buka `/admin.html` → login dengan password → lihat daftar order → Edit status.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "APPS_SCRIPT_URL belum diisi" | Pastikan `js/config.js` sudah diisi URL Web App |
| "Order tidak ditemukan" | Cek Order ID di Sheet, pastikan huruf besar/kecil sama |
| CORS / gagal fetch | Pastikan deploy **Who has access = Anyone** dan Content-Type text/plain |
| Password salah di admin | Samakan `ADMIN_PASSWORD` di `Code.gs` dan `js/config.js` |
| Script error setelah edit | Deploy ulang: Manage deployments → Edit → Version: New version → Deploy |

---

## Keamanan (penting)

- Password admin disimpan di frontend (bisa dilihat di source). Ini cukup untuk proteksi ringan.  
  Untuk keamanan lebih tinggi, bisa ganti password sering, atau nanti upgrade ke Firebase Auth / backend lain.
- Jangan share URL Web App secara publik di tempat yang tidak perlu.
- Siapa pun yang tahu password admin bisa mengubah status order.

---

## Fitur yang sudah aktif

✅ Form order online → data masuk Google Sheet  
✅ Nomor order otomatis (LC-YYMMDD-XXX)  
✅ Cek status order by Order ID  
✅ Admin dashboard (login password)  
✅ Ubah status, harga final, catatan admin  
✅ Link WhatsApp langsung ke pelanggan dari admin  
✅ Statistik ringkas (total, pending, proses, siap, selesai)  

Selamat! Website Launcess sekarang sudah punya database gratis.
