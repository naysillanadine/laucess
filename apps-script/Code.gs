/**
 * ============================================================
 *  LAUNCESS — Google Apps Script Backend
 * ============================================================
 *  CARA PAKAI:
 *  1. Buka Google Sheet baru (lihat SETUP.md)
 *  2. Extensions → Apps Script → paste SEMUA isi file ini
 *  3. Simpan, lalu Deploy → New deployment → Web app
 *  4. Execute as: Me | Who has access: Anyone
 *  5. Copy URL, tempel di js/config.js (frontend)
 * ============================================================
 */

// ====== KONFIGURASI ======
const SHEET_NAME = "Orders";
const ADMIN_PASSWORD = "launcess2026"; // HARUS SAMA dengan js/config.js

// Header kolom (baris 1)
const HEADERS = [
  "OrderID",
  "Timestamp",
  "Nama",
  "WhatsApp",
  "Layanan",
  "Estimasi",
  "Alamat",
  "Catatan",
  "Status",
  "HargaFinal",
  "CatatanAdmin",
];

// ====== ENTRY POINT ======
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    let result;
    switch (action) {
      case "createOrder":
        result = createOrder(data);
        break;
      case "getOrder":
        result = getOrder(data.orderId);
        break;
      case "listOrders":
        result = listOrders(data.password);
        break;
      case "updateOrder":
        result = updateOrder(data);
        break;
      default:
        result = { error: "Action tidak dikenal: " + action };
    }

    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message || String(err) });
  }
}

function doGet(e) {
  // Optional: allow GET for simple status check
  if (e.parameter && e.parameter.action === "getOrder" && e.parameter.orderId) {
    return jsonResponse(getOrder(e.parameter.orderId));
  }
  return jsonResponse({
    status: "ok",
    message: "Launcess API is running. Use POST.",
  });
}

// ====== HELPERS ======
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function generateOrderId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const datePart = yy + mm + dd; // 241013

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  let seq = 1;

  if (lastRow > 1) {
    // Count orders with same date prefix today
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
    const todayIds = ids.filter(function (id) {
      return String(id).indexOf("LC-" + datePart) === 0;
    });
    seq = todayIds.length + 1;
  }

  return "LC-" + datePart + "-" + String(seq).padStart(3, "0");
}

function formatTimestamp() {
  const now = new Date();
  // WIB = UTC+7
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const y = wib.getUTCFullYear();
  const m = String(wib.getUTCMonth() + 1).padStart(2, "0");
  const d = String(wib.getUTCDate()).padStart(2, "0");
  const h = String(wib.getUTCHours()).padStart(2, "0");
  const min = String(wib.getUTCMinutes()).padStart(2, "0");
  return y + "-" + m + "-" + d + " " + h + ":" + min;
}

function rowToObject(row) {
  return {
    orderId: String(row[0] || ""),
    timestamp: String(row[1] || ""),
    nama: String(row[2] || ""),
    whatsapp: String(row[3] || ""),
    layanan: String(row[4] || ""),
    estimasi: String(row[5] || ""),
    alamat: String(row[6] || ""),
    catatan: String(row[7] || ""),
    status: String(row[8] || "Pending"),
    hargaFinal: row[9] || "",
    catatanAdmin: String(row[10] || ""),
  };
}

// ====== ACTIONS ======

/** Create new order */
function createOrder(data) {
  if (!data.nama || !data.whatsapp || !data.layanan) {
    return { error: "Nama, WhatsApp, dan Layanan wajib diisi." };
  }

  const sheet = getSheet();
  const orderId = generateOrderId();
  const ts = formatTimestamp();

  sheet.appendRow([
    orderId,
    ts,
    data.nama,
    data.whatsapp,
    data.layanan,
    data.estimasi || "",
    data.alamat || "",
    data.catatan || "",
    "Pending",
    "",
    "",
  ]);

  return {
    success: true,
    orderId: orderId,
    message: "Order berhasil dibuat.",
  };
}

/** Get single order by ID */
function getOrder(orderId) {
  if (!orderId) return { error: "Order ID diperlukan." };

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { error: "Order tidak ditemukan." };

  const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const needle = String(orderId).toUpperCase().trim();

  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).toUpperCase() === needle) {
      return { success: true, order: rowToObject(data[i]) };
    }
  }
  return { error: "Order tidak ditemukan. Periksa nomor order kamu." };
}

/** List all orders (admin) */
function listOrders(password) {
  if (password !== ADMIN_PASSWORD) {
    return { error: "Password admin salah." };
  }

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { success: true, orders: [] };

  const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const orders = data.map(rowToObject).reverse(); // newest first
  return { success: true, orders: orders };
}

/** Update order status / harga / catatan (admin) */
function updateOrder(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return { error: "Password admin salah." };
  }
  if (!data.orderId) return { error: "Order ID diperlukan." };

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { error: "Order tidak ditemukan." };

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const needle = String(data.orderId).toUpperCase().trim();
  var rowIndex = -1;

  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i]).toUpperCase() === needle) {
      rowIndex = i + 2; // 1-indexed, skip header
      break;
    }
  }

  if (rowIndex < 0) return { error: "Order tidak ditemukan." };

  // Status (col 9)
  if (data.status) {
    sheet.getRange(rowIndex, 9).setValue(data.status);
  }
  // HargaFinal (col 10)
  if (data.hargaFinal !== undefined && data.hargaFinal !== "") {
    sheet.getRange(rowIndex, 10).setValue(Number(data.hargaFinal) || data.hargaFinal);
  }
  // CatatanAdmin (col 11)
  if (data.catatanAdmin !== undefined) {
    sheet.getRange(rowIndex, 11).setValue(data.catatanAdmin);
  }

  return { success: true, message: "Order berhasil diupdate." };
}
