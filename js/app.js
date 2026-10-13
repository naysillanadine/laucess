/* ============================================================
   LAUNCESS — Frontend Logic
   ============================================================ */

// ---------- Mobile menu ----------
document.getElementById("menu-btn")?.addEventListener("click", () => {
  document.getElementById("main-nav")?.classList.toggle("mobile-open");
});

// Close menu when clicking a link
document.querySelectorAll("#main-nav a").forEach((a) => {
  a.addEventListener("click", () => {
    document.getElementById("main-nav")?.classList.remove("mobile-open");
  });
});

// ---------- Helper: call Apps Script ----------
async function callAPI(action, payload = {}) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_DEPLOYMENT_ID")) {
    throw new Error("APPS_SCRIPT_URL belum diisi. Buka js/config.js dan isi URL Web App.");
  }

  const body = JSON.stringify({ action, ...payload });

  // Google Apps Script Web App expects POST with text/plain or form
  // We use text/plain to avoid CORS preflight issues
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body,
  });

  if (!res.ok) throw new Error("Gagal menghubungi server. Coba lagi.");
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// ---------- ORDER FORM ----------
const orderForm = document.getElementById("order-form");
if (orderForm) {
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("submit-btn");
    const result = document.getElementById("order-result");
    const btnText = btn.querySelector(".btn-text");
    const btnLoading = btn.querySelector(".btn-loading");

    const payload = {
      nama: document.getElementById("nama").value.trim(),
      whatsapp: document.getElementById("whatsapp").value.trim(),
      layanan: document.getElementById("layanan").value,
      estimasi: document.getElementById("estimasi").value.trim(),
      alamat: document.getElementById("alamat").value.trim(),
      catatan: document.getElementById("catatan").value.trim(),
    };

    if (!payload.nama || !payload.whatsapp || !payload.layanan) {
      showOrderResult(false, "Mohon isi Nama, WhatsApp, dan Layanan.");
      return;
    }

    // Basic WA validation
    const wa = payload.whatsapp.replace(/\D/g, "");
    if (wa.length < 10 || wa.length > 15) {
      showOrderResult(false, "Nomor WhatsApp tidak valid.");
      return;
    }
    payload.whatsapp = wa;

    btn.disabled = true;
    btnText.hidden = true;
    btnLoading.hidden = false;
    result.hidden = true;

    try {
      const data = await callAPI("createOrder", payload);
      showOrderResult(true, null, data.orderId);
      orderForm.reset();
    } catch (err) {
      showOrderResult(false, err.message);
    } finally {
      btn.disabled = false;
      btnText.hidden = false;
      btnLoading.hidden = true;
    }
  });
}

function showOrderResult(success, errorMsg, orderId) {
  const el = document.getElementById("order-result");
  el.hidden = false;
  el.className = "order-result" + (success ? "" : " error");

  if (success) {
    el.innerHTML = `
      <div style="font-size:28px;margin-bottom:8px">✓</div>
      <strong>Order berhasil dikirim!</strong>
      <div class="order-id">${orderId}</div>
      <p>Simpan nomor order di atas untuk cek status cucianmu.<br>
      Tim Launcess akan segera menghubungi kamu via WhatsApp.</p>
    `;
  } else {
    el.innerHTML = `<strong>Gagal</strong><p>${errorMsg}</p>`;
  }
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------- CEK STATUS ----------
const statusForm = document.getElementById("status-form");
if (statusForm) {
  statusForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const orderId = document.getElementById("order-id").value.trim().toUpperCase();
    const result = document.getElementById("status-result");
    const btn = document.getElementById("status-btn");

    if (!orderId) return;

    btn.disabled = true;
    btn.textContent = "Mencari...";
    result.hidden = true;

    try {
      const data = await callAPI("getOrder", { orderId });
      renderStatus(data.order);
    } catch (err) {
      result.hidden = false;
      result.className = "status-result error";
      result.innerHTML = `<strong>Tidak ditemukan</strong><p>${err.message}</p>`;
    } finally {
      btn.disabled = false;
      btn.textContent = "Cek Status";
    }
  });
}

function renderStatus(o) {
  const el = document.getElementById("status-result");
  el.hidden = false;
  el.className = "status-result";

  const badgeClass = {
    Pending: "badge-pending",
    Diterima: "badge-diterima",
    Dicuci: "badge-dicuci",
    Siap: "badge-siap",
    Selesai: "badge-selesai",
    Batal: "badge-batal",
  }[o.status] || "badge-pending";

  el.innerHTML = `
    <div class="status-header">
      <span class="oid">${o.orderId}</span>
      <span class="status-badge ${badgeClass}">${o.status}</span>
    </div>
    <div class="status-details">
      <div><span>Nama</span><span>${esc(o.nama)}</span></div>
      <div><span>Layanan</span><span>${esc(o.layanan)}</span></div>
      <div><span>Estimasi</span><span>${esc(o.estimasi) || "—"}</span></div>
      <div><span>Tanggal Order</span><span>${esc(o.timestamp)}</span></div>
      ${o.hargaFinal ? `<div><span>Harga</span><span>Rp ${Number(o.hargaFinal).toLocaleString("id-ID")}</span></div>` : ""}
      ${o.catatanAdmin ? `<div><span>Catatan Admin</span><span>${esc(o.catatanAdmin)}</span></div>` : ""}
    </div>
  `;
}

function esc(str) {
  if (!str) return "";
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}
