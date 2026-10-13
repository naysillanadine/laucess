/* ============================================================
   LAUNCESS — Admin Dashboard
   ============================================================ */

const SESSION_KEY = "launcess_admin";

async function callAPI(action, payload = {}) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_DEPLOYMENT_ID")) {
    throw new Error("APPS_SCRIPT_URL belum diisi di js/config.js");
  }
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) throw new Error("Gagal menghubungi server");
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// ---------- Auth ----------
function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

function showLogin() {
  document.getElementById("login-view").hidden = false;
  document.getElementById("dashboard-view").hidden = true;
}

function showDashboard() {
  document.getElementById("login-view").hidden = true;
  document.getElementById("dashboard-view").hidden = false;
  loadOrders();
}

document.getElementById("login-btn")?.addEventListener("click", () => {
  const pass = document.getElementById("admin-pass").value;
  const err = document.getElementById("login-error");
  if (pass === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "1");
    err.hidden = true;
    showDashboard();
  } else {
    err.hidden = false;
    err.textContent = "Password salah.";
  }
});

document.getElementById("admin-pass")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("login-btn").click();
});

document.getElementById("logout-btn")?.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

// ---------- Load Orders ----------
let allOrders = [];

async function loadOrders() {
  const tbody = document.getElementById("orders-body");
  tbody.innerHTML = `<tr><td colspan="9" class="admin-empty">Memuat data...</td></tr>`;

  try {
    const data = await callAPI("listOrders", { password: ADMIN_PASSWORD });
    allOrders = data.orders || [];
    renderStats(allOrders);
    renderTable(allOrders);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="9" class="admin-empty" style="color:var(--red)">${err.message}</td></tr>`;
  }
}

function renderStats(orders) {
  const counts = { Pending: 0, Diterima: 0, Dicuci: 0, Siap: 0, Selesai: 0, Batal: 0 };
  orders.forEach((o) => {
    if (counts[o.status] !== undefined) counts[o.status]++;
  });
  document.getElementById("stats").innerHTML = `
    <div class="stat-card"><div class="num">${orders.length}</div><div class="label">Total</div></div>
    <div class="stat-card"><div class="num">${counts.Pending}</div><div class="label">Pending</div></div>
    <div class="stat-card"><div class="num">${counts.Diterima + counts.Dicuci}</div><div class="label">Proses</div></div>
    <div class="stat-card"><div class="num">${counts.Siap}</div><div class="label">Siap</div></div>
    <div class="stat-card"><div class="num">${counts.Selesai}</div><div class="label">Selesai</div></div>
  `;
}

function renderTable(orders) {
  const filter = document.getElementById("filter-status").value;
  const search = document.getElementById("search-order").value.toLowerCase().trim();

  let list = orders;
  if (filter) list = list.filter((o) => o.status === filter);
  if (search) {
    list = list.filter(
      (o) =>
        o.orderId.toLowerCase().includes(search) ||
        o.nama.toLowerCase().includes(search) ||
        o.whatsapp.includes(search)
    );
  }

  const tbody = document.getElementById("orders-body");
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="admin-empty">Tidak ada order.</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map(
      (o) => `
    <tr>
      <td class="oid-cell">${esc(o.orderId)}</td>
      <td>${esc(o.timestamp)}</td>
      <td>${esc(o.nama)}</td>
      <td><a href="https://wa.me/62${o.whatsapp.replace(/^0/, "")}" target="_blank" style="color:var(--red)">${esc(o.whatsapp)}</a></td>
      <td>${esc(o.layanan)}</td>
      <td>${esc(o.estimasi) || "—"}</td>
      <td><span class="status-badge badge-${o.status.toLowerCase()}">${esc(o.status)}</span></td>
      <td>${o.hargaFinal ? "Rp " + Number(o.hargaFinal).toLocaleString("id-ID") : "—"}</td>
      <td><button class="btn primary btn-sm" onclick="openEdit('${esc(o.orderId)}')">Edit</button></td>
    </tr>
  `
    )
    .join("");
}

function esc(str) {
  if (!str) return "";
  const d = document.createElement("div");
  d.textContent = String(str);
  return d.innerHTML;
}

// Filter & search
document.getElementById("filter-status")?.addEventListener("change", () => renderTable(allOrders));
document.getElementById("search-order")?.addEventListener("input", () => renderTable(allOrders));
document.getElementById("refresh-btn")?.addEventListener("click", loadOrders);

// ---------- Edit Modal ----------
function openEdit(orderId) {
  const o = allOrders.find((x) => x.orderId === orderId);
  if (!o) return;
  document.getElementById("edit-oid").value = o.orderId;
  document.getElementById("edit-status").value = o.status;
  document.getElementById("edit-harga").value = o.hargaFinal || "";
  document.getElementById("edit-catatan").value = o.catatanAdmin || "";
  document.getElementById("modal-title").textContent = "Edit " + o.orderId;
  document.getElementById("edit-modal").style.display = "flex";
}

document.getElementById("close-modal")?.addEventListener("click", () => {
  document.getElementById("edit-modal").style.display = "none";
});

document.getElementById("save-edit")?.addEventListener("click", async () => {
  const orderId = document.getElementById("edit-oid").value;
  const status = document.getElementById("edit-status").value;
  const hargaFinal = document.getElementById("edit-harga").value;
  const catatanAdmin = document.getElementById("edit-catatan").value;

  try {
    await callAPI("updateOrder", {
      password: ADMIN_PASSWORD,
      orderId,
      status,
      hargaFinal,
      catatanAdmin,
    });
    document.getElementById("edit-modal").style.display = "none";
    loadOrders();
  } catch (err) {
    alert("Gagal update: " + err.message);
  }
});

// Init
if (isLoggedIn()) {
  showDashboard();
} else {
  showLogin();
}
