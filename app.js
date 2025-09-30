// ========== KONSTANTA DEV ========== //
const DEV_USER = "NadrethbyNuxz";
const DEV_PASS = "210108";

// ========== STATE ========== //
let isDev = false;
let pembayaranProduk = null;
let pembayaranMetode = null;
let pembayaranTimeout = null;
let pembayaranCountdown = 120;
let pembayaranTotal = 0;
let produkDetailIdx = null;
let diskonDipakai = null;

// ========== DOM ELEMENTS ========== //
const landing = document.getElementById('landing');
const produkListSection = document.getElementById('produk-list-section');
const saranSection = document.getElementById('saran-section');
const devDashboard = document.getElementById('dev-dashboard');
const devLoginBtn = document.getElementById('dev-login-btn');
const devLogoutBtn = document.getElementById('dev-logout-btn');
const listProdukBtn = document.getElementById('list-produk-btn');
const backLandingBtn = document.getElementById('back-landing-btn');
const saranBtn = document.getElementById('saran-btn');
const backSaranBtn = document.getElementById('back-saran-btn');
const produkList = document.getElementById('produk-list');
const devProdukList = document.getElementById('dev-produk-list');
const produkForm = document.getElementById('produk-form');
const produkCancelBtn = document.getElementById('produk-cancel-btn');
const devLoginModal = document.getElementById('dev-login-modal');
const closeLoginModal = document.getElementById('close-login-modal');
const devLoginForm = document.getElementById('dev-login-form');
const devLoginError = document.getElementById('dev-login-error');
const avatarContainer = document.getElementById('avatar-container');
const avatarPopup = document.getElementById('avatar-popup');
const infoBanner = document.getElementById('info-banner');
const bannerForm = document.getElementById('banner-form');
const bannerInput = document.getElementById('banner-input');
const removeBannerBtn = document.getElementById('remove-banner-btn');
const diskonForm = document.getElementById('diskon-form');
const devDiskonList = document.getElementById('dev-diskon-list');
const saranForm = document.getElementById('saran-form');
const saranInput = document.getElementById('saran-input');
const devSaranList = document.getElementById('dev-saran-list');
const themeToggle = document.getElementById('theme-toggle');

// ========== DATA PEMBAYARAN ========== //
const metodePembayaran = [
  {
    id: 'ovo',
    nama: 'OVO',
    img: 'https://ar-hosting.pages.dev/1759062672982.jpg',
    info: 'Nomor: 089502396168',
    barcode: null
  },
  {
    id: 'gopay',
    nama: 'Gopay',
    img: 'https://ar-hosting.pages.dev/1759062947442.jpg',
    info: 'Nomor: 08979240985',
    barcode: null
  },
  {
    id: 'dana',
    nama: 'Dana',
    img: 'https://ar-hosting.pages.dev/1759062895265.jpg',
    info: 'Nomor: 089502396168',
    barcode: null
  },
  {
    id: 'qris',
    nama: 'QRIS',
    img: 'https://ar-hosting.pages.dev/1759062992641.jpg',
    info: 'Scan barcode di bawah',
    barcode: 'https://ar-hosting.pages.dev/1756913721550.jpg'
  }
];

// ========== UTILITAS LOCALSTORAGE ========== //
function getData(key, def) {
  try {
    return JSON.parse(localStorage.getItem(key)) || def;
  } catch {
    return def;
  }
}
function setData(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// ========== DISKON ========== //
function getDiskon() {
  return getData('diskon', []);
}
function saveDiskon(arr) {
  setData('diskon', arr);
}
function getUsedCoupons() {
  return getData('usedCoupons', []);
}
function setUsedCoupons(arr) {
  setData('usedCoupons', arr);
}
function applyDiskon(kode, harga) {
  const arr = getDiskon();
  const used = getUsedCoupons();
  const now = new Date();
  const d = arr.find(d => d.kode.toLowerCase() === kode.toLowerCase());
  if (!d) return { valid: false, msg: 'Kode tidak ditemukan', total: harga };
  if (new Date(d.expiry) < now) return { valid: false, msg: 'Kode expired', total: harga };
  if (used.includes(kode.toLowerCase())) {
    return { valid: false, msg: 'Kode sudah digunakan, tidak bisa dipakai lagi.', total: harga };
  }
  let total = harga;
  if (d.tipe === 'percent') total -= harga * d.nilai / 100;
  else total -= d.nilai;
  if (total < 0) total = 0;
  return { valid: true, msg: 'Diskon diterapkan', total };
}
function markCouponUsed(kode) {
  const used = getUsedCoupons();
  if (!used.includes(kode.toLowerCase())) {
    used.push(kode.toLowerCase());
    setUsedCoupons(used);
  }
}
function renderDevDiskonList() {
  const arr = getDiskon();
  devDiskonList.innerHTML = arr.length ? arr.map((d, i) => `
    <div>
      <b>${d.kode}</b> - ${d.tipe === 'percent' ? d.nilai + '%' : 'Rp' + d.nilai}
      (exp: ${d.expiry}) 
      <button onclick="hapusDiskon(${i})">Hapus</button>
    </div>
  `).join('') : '<i>Belum ada diskon.</i>';
}
window.hapusDiskon = function(idx) {
  if (confirm('Hapus diskon ini?')) {
    const arr = getDiskon();
    arr.splice(idx, 1);
    saveDiskon(arr);
    renderDevDiskonList();
  }
};
diskonForm.onsubmit = function(e) {
  e.preventDefault();
  const kode = document.getElementById('diskon-kode').value.trim();
  const nilai = parseInt(document.getElementById('diskon-value').value);
  const tipe = document.getElementById('diskon-type').value;
  const expiry = document.getElementById('diskon-expiry').value;
  if (!kode || !nilai || !expiry) return;
  const arr = getDiskon();
  arr.push({ kode, nilai, tipe, expiry });
  saveDiskon(arr);
  renderDevDiskonList();
  diskonForm.reset();
};

// ========== PRODUK ========== //
function getProduk() {
  return getData('produk', []);
}
function saveProduk(arr) {
  setData('produk', arr);
}
function renderProdukList() {
  const arr = getProduk().filter(p => p.publish);
  produkList.innerHTML = '';
  if (!arr.length) {
    produkList.innerHTML = '<i>Belum ada produk.</i>';
    return;
  }
  arr.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'produk-card';
    card.innerHTML = `
      <img src="${p.gambar}" class="produk-img" alt="Gambar">
      <div class="produk-info">
        <b>${p.nama}</b> <br>
        <span>Rp${Number(p.harga).toLocaleString()}</span>
        ${p.sold ? `<span class="produk-status">SOLD</span>` : ''}
      </div>
    `;
    card.onclick = () => showProdukDetail(idx);
    produkList.appendChild(card);
  });
}
function renderDevProdukList() {
  const arr = getProduk();
  devProdukList.innerHTML = '';
  if (!arr.length) {
    devProdukList.innerHTML = '<i>Belum ada produk.</i>';
    return;
  }
  arr.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'produk-card';
    card.innerHTML = `
      <img src="${p.gambar}" class="produk-img" alt="Gambar">
      <div class="produk-info">
        <b>${p.nama}</b> <br>
        <span>Rp${Number(p.harga).toLocaleString()}</span>
        <ul class="produk-benefit">
          ${p.benefit.map(b => `<li>${b}</li>`).join('')}
        </ul>
        <span>Status: ${p.publish ? 'Publish' : 'Unpublish'}${p.sold ? ', SOLD' : ''}</span>
      </div>
      <div class="produk-actions">
        <button onclick="editProduk(${i})">Edit</button>
        <button onclick="hapusProduk(${i})">Hapus</button>
      </div>
    `;
    devProdukList.appendChild(card);
  });
}
window.editProduk
