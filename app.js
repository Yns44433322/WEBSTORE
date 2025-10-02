// NADRETH HOSTING - App JavaScript

// Data Models
class Product {
    constructor(id, name, price, image, benefits, sold = false, published = true) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.benefits = benefits;
        this.sold = sold;
        this.published = published;
    }
}

class Discount {
    constructor(code, type, value, expiry, used = false) {
        this.code = code;
        this.type = type;
        this.value = value;
        this.expiry = expiry;
        this.used = used;
    }
}

class Suggestion {
    constructor(productId, message, timestamp) {
        this.productId = productId;
        this.message = message;
        this.timestamp = timestamp;
    }
}

class BannerInfo {
    constructor(text, timestamp) {
        this.text = text;
        this.timestamp = timestamp;
    }
}

// App State
let appState = {
    currentPage: 'landingPage',
    isDeveloper: false,
    currentProduct: null,
    selectedPaymentMethod: null,
    appliedDiscount: null,
    countdownInterval: null,
    currentSuggestionProductId: null
};

// DOM Elements
const pages = document.querySelectorAll('.page');
const themeToggle = document.getElementById('themeToggle');
const profileBtn = document.getElementById('profileBtn');
const listProductBtn = document.getElementById('listProductBtn');
const loginDeveloperBtn = document.getElementById('loginDeveloperBtn');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardBtn = document.getElementById('dashboardBtn');
const loginForm = document.getElementById('loginForm');
const productForm = document.getElementById('productForm');
const infoForm = document.getElementById('infoForm');
const discountForm = document.getElementById('discountForm');
const suggestionForm = document.getElementById('suggestionForm');
const productModal = document.getElementById('productModal');
const suggestionModal = document.getElementById('suggestionModal');
const closeButtons = document.querySelectorAll('.close');
const productsGrid = document.getElementById('productsGrid');
const productsList = document.getElementById('productsList');
const discountsList = document.getElementById('discountsList');
const suggestionsList = document.getElementById('suggestionsList');
const infoBanner = document.getElementById('infoBanner');
const bannerText = document.getElementById('bannerText');
const discountInput = document.getElementById('discountInput');
const applyDiscountBtn = document.getElementById('applyDiscountBtn');
const discountMessage = document.getElementById('discountMessage');
const paymentOptions = document.querySelectorAll('.payment-option');
const paymentDetails = document.getElementById('paymentDetails');
const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
const countdownTimer = document.getElementById('countdownTimer');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize App
function initApp() {
    loadTheme();
    loadBanner();
    checkDeveloperStatus();
    showPage('landingPage');
    renderProducts();
    renderDiscounts();
    renderSuggestions();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    profileBtn.addEventListener('click', () => showPage('publicAccountPage'));
    listProductBtn.addEventListener('click', () => showPage('productsPage'));
    loginDeveloperBtn.addEventListener('click', () => showPage('loginPage'));
    logoutBtn.addEventListener('click', logout);
    dashboardBtn.addEventListener('click', () => showPage('dashboardPage'));
    
    // Forms
    loginForm.addEventListener('submit', handleLogin);
    productForm.addEventListener('submit', handleAddProduct);
    infoForm.addEventListener('submit', handleSaveBanner);
    discountForm.addEventListener('submit', handleAddDiscount);
    suggestionForm.addEventListener('submit', handleSubmitSuggestion);
    
    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            productModal.style.display = 'none';
            suggestionModal.style.display = 'none';
        });
    });
    
    // Payment
    applyDiscountBtn.addEventListener('click', applyDiscount);
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => selectPaymentMethod(option));
    });
    cancelPaymentBtn.addEventListener('click', cancelPayment);
    
    // Dashboard Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
        if (e.target === suggestionModal) {
            suggestionModal.style.display = 'none';
        }
    });
}

// Page Navigation
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(pageId).classList.add('active');
    appState.currentPage = pageId;
    
    // Special handling for certain pages
    if (pageId === 'productsPage') {
        renderProducts();
    } else if (pageId === 'dashboardPage') {
        renderProductsList();
        renderDiscounts();
        renderSuggestions();
    }
}

// Theme Management
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Developer Authentication
function checkDeveloperStatus() {
    const isDev = localStorage.getItem('isDeveloper') === 'true';
    appState.isDeveloper = isDev;
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Default credentials
    if (username === 'NadrethbyNuxz' && password === '210108') {
        localStorage.setItem('isDeveloper', 'true');
        appState.isDeveloper = true;
        showPage('developerAccountPage');
        showNotification('Login berhasil!', 'success');
    } else {
        showNotification('Username atau password salah!', 'error');
    }
}

function logout() {
    localStorage.setItem('isDeveloper', 'false');
    appState.isDeveloper = false;
    showPage('publicAccountPage');
    showNotification('Anda telah logout', 'info');
}

// Product Management
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value;
    const benefits = document.getElementById('productBenefits').value;
    const sold = document.getElementById('productSold').checked;
    const published = document.getElementById('productPublished').checked;
    
    const products = getProducts();
    const newProduct = new Product(
        Date.now().toString(),
        name,
        price,
        image,
        benefits,
        sold,
        published
    );
    
    products.push(newProduct);
    saveProducts(products);
    
    // Reset form
    productForm.reset();
    document.getElementById('productPublished').checked = true;
    
    // Update UI
    renderProductsList();
    showNotification('Produk berhasil ditambahkan!', 'success');
}

function renderProducts() {
    const products = getProducts().filter(p => p.published);
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="text-center">Belum ada produk yang tersedia.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product, false);
        productsGrid.appendChild(productCard);
    });
}

function renderProductsList() {
    const products = getProducts();
    productsList.innerHTML = '';
    
    if (products.length === 0) {
        productsList.innerHTML = '<p class="text-center">Belum ada produk.</p>';
        return;
    }
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        productItem.innerHTML = `
            <div>
                <h4>${product.name}</h4>
                <p>Rp ${product.price.toLocaleString('id-ID')}</p>
                <div>
                    <span class="status-badge ${product.sold ? 'status-expired' : 'status-active'}">
                        ${product.sold ? 'Sold' : 'Available'}
                    </span>
                    <span class="status-badge ${product.published ? 'status-active' : 'status-expired'}">
                        ${product.published ? 'Published' : 'Unpublished'}
                    </span>
                </div>
            </div>
            <div class="product-actions-small">
                <button class="edit-btn" onclick="editProduct('${product.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteProduct('${product.id}')">Hapus</button>
            </div>
        `;
        
        productsList.appendChild(productItem);
    });
}

function createProductCard(product, isEditable = false) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageSrc = product.image || 'https://via.placeholder.com/300x200?text=No+Image';
    
    card.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        ${product.sold ? '<div class="sold-badge">Sold</div>' : ''}
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
            <div class="product-actions">
                <button class="btn-primary" onclick="viewProduct('${product.id}')">Detail</button>
                <button class="suggestion-btn" onclick="openSuggestionModal('${product.id}')">
                    <i class="fas fa-exclamation"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function viewProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    appState.currentProduct = product;
    
    const productDetail = document.getElementById('productDetail');
    const imageSrc = product.image || 'https://via.placeholder.com/500x300?text=No+Image';
    
    productDetail.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}" class="detail-image" onerror="this.src='https://via.placeholder.com/500x300?text=No+Image'">
        <div class="detail-info">
            <h3>${product.name}</h3>
            <p class="detail-price">Rp ${product.price.toLocaleString('id-ID')}</p>
            ${product.sold ? '<div class="sold-badge">Sold</div>' : ''}
            <div class="detail-benefits">
                <h4>Benefit:</h4>
                <ul>
                    ${product.benefits.split('\n').map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
            <div class="detail-actions">
                ${!product.sold ? `<button class="btn-primary" onclick="startPayment('${product.id}')">Beli Sekarang</button>` : ''}
                <button class="btn-secondary" onclick="productModal.style.display='none'">Tutup</button>
            </div>
        </div>
    `;
    
    productModal.style.display = 'block';
}

function editProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productBenefits').value = product.benefits;
    document.getElementById('productSold').checked = product.sold;
    document.getElementById('productPublished').checked = product.published;
    
    // Change form to update mode
    productForm.onsubmit = function(e) {
        e.preventDefault();
        
        product.name = document.getElementById('productName').value;
        product.price = parseInt(document.getElementById('productPrice').value);
        product.image = document.getElementById('productImage').value;
        product.benefits = document.getElementById('productBenefits').value;
        product.sold = document.getElementById('productSold').checked;
        product.published = document.getElementById('productPublished').checked;
        
        saveProducts(products);
        
        // Reset form to add mode
        productForm.reset();
        document.getElementById('productPublished').checked = true;
        productForm.onsubmit = handleAddProduct;
        
        // Update UI
        renderProductsList();
        showNotification('Produk berhasil diupdate!', 'success');
    };
    
    // Scroll to form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(productId) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    
    const products = getProducts();
    const filteredProducts = products.filter(p => p.id !== productId);
    
    saveProducts(filteredProducts);
    renderProductsList();
    showNotification('Produk berhasil dihapus!', 'success');
}

// Banner Management
function getBanner() {
    return JSON.parse(localStorage.getItem('banner')) || null;
}

function saveBanner(banner) {
    localStorage.setItem('banner', JSON.stringify(banner));
}

function handleSaveBanner(e) {
    e.preventDefault();
    
    const text = document.getElementById('bannerText').value;
    const banner = new BannerInfo(text, Date.now());
    
    saveBanner(banner);
    loadBanner();
    showNotification('Banner berhasil disimpan!', 'success');
}

function loadBanner() {
    const banner = getBanner();
    
    if (!banner) {
        infoBanner.classList.add('hidden');
        return;
    }
    
    // Check if banner is still valid (24 hours)
    const now = Date.now();
    const bannerTime = banner.timestamp;
    const hoursDiff = (now - bannerTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
        // Banner expired
        saveBanner(null);
        infoBanner.classList.add('hidden');
        return;
    }
    
    bannerText.textContent = banner.text;
    infoBanner.classList.remove('hidden');
}

// Discount Management
function getDiscounts() {
    return JSON.parse(localStorage.getItem('discounts')) || [];
}

function saveDiscounts(discounts) {
    localStorage.setItem('discounts', JSON.stringify(discounts));
}

function handleAddDiscount(e) {
    e.preventDefault();
    
    const code = document.getElementById('discountCode').value;
    const type = document.getElementById('discountType').value;
    const value = parseInt(document.getElementById('discountValue').value);
    const expiry = new Date(document.getElementById('discountExpiry').value).getTime();
    
    const discounts = getDiscounts();
    
    // Check if code already exists
    if (discounts.some(d => d.code === code)) {
        showNotification('Kode diskon sudah ada!', 'error');
        return;
    }
    
    const newDiscount = new Discount(code, type, value, expiry);
    discounts.push(newDiscount);
    
    saveDiscounts(discounts);
    
    // Reset form
    discountForm.reset();
    
    // Update UI
    renderDiscounts();
    showNotification('Diskon berhasil ditambahkan!', 'success');
}

function renderDiscounts() {
    const discounts = getDiscounts();
    discountsList.innerHTML = '';
    
    if (discounts.length === 0) {
        discountsList.innerHTML = '<p class="text-center">Belum ada diskon.</p>';
        return;
    }
    
    discounts.forEach(discount => {
        const discountItem = document.createElement('div');
        discountItem.className = 'discount-item';
        
        const now = Date.now();
        const isExpired = now > discount.expiry;
        const status = discount.used ? 'used' : isExpired ? 'expired' : 'active';
        const statusText = discount.used ? 'Used' : isExpired ? 'Expired' : 'Active';
        
        discountItem.innerHTML = `
            <div>
                <h4>${discount.code}</h4>
                <p>${discount.type === 'percentage' ? `${discount.value}%` : `Rp ${discount.value.toLocaleString('id-ID')}`}</p>
                <p>Expiry: ${new Date(discount.expiry).toLocaleString('id-ID')}</p>
                <span class="status-badge status-${status}">${statusText}</span>
            </div>
            <div class="discount-actions">
                <button class="delete-btn" onclick="deleteDiscount('${discount.code}')">Hapus</button>
            </div>
        `;
        
        discountsList.appendChild(discountItem);
    });
}

function deleteDiscount(code) {
    if (!confirm('Apakah Anda yakin ingin menghapus diskon ini?')) return;
    
    const discounts = getDiscounts();
    const filteredDiscounts = discounts.filter(d => d.code !== code);
    
    saveDiscounts(filteredDiscounts);
    renderDiscounts();
    showNotification('Diskon berhasil dihapus!', 'success');
}

function applyDiscount() {
    const code = discountInput.value.trim();
    
    if (!code) {
        discountMessage.textContent = 'Masukkan kode diskon terlebih dahulu.';
        discountMessage.className = 'discount-message error';
        return;
    }
    
    const discounts = getDiscounts();
    const discount = discounts.find(d => d.code === code);
    const now = Date.now();
    
    if (!discount) {
        discountMessage.textContent = 'Kode diskon tidak valid.';
        discountMessage.className = 'discount-message error';
        return;
    }
    
    if (discount.used) {
        discountMessage.textContent = 'Kode diskon sudah digunakan.';
        discountMessage.className = 'discount-message error';
        return;
    }
    
    if (now > discount.expiry) {
        discountMessage.textContent = 'Kode diskon sudah kadaluarsa.';
        discountMessage.className = 'discount-message error';
        return;
    }
    
    // Valid discount
    appState.appliedDiscount = discount;
    
    // Calculate discounted price
    const originalPrice = appState.currentProduct.price;
    let discountedPrice = originalPrice;
    
    if (discount.type === 'percentage') {
        discountedPrice = originalPrice - (originalPrice * discount.value / 100);
    } else if (discount.type === 'nominal') {
        discountedPrice = originalPrice - discount.value;
    }
    
    // Ensure price doesn't go below 0
    discountedPrice = Math.max(0, discountedPrice);
    
    discountMessage.textContent = `Diskon berhasil diterapkan! Harga baru: Rp ${discountedPrice.toLocaleString('id-ID')}`;
    discountMessage.className = 'discount-message success';
    
    // Update payment product price display
    document.getElementById('paymentProductPrice').textContent = `Rp ${discountedPrice.toLocaleString('id-ID')}`;
    
    // Update WhatsApp link with new price if payment method is selected
    if (appState.selectedPaymentMethod) {
        updateWhatsAppLink(discountedPrice);
    }
}

// Suggestion Management
function getSuggestions() {
    return JSON.parse(localStorage.getItem('suggestions')) || [];
}

function saveSuggestions(suggestions) {
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
}

function openSuggestionModal(productId) {
    appState.currentSuggestionProductId = productId;
    suggestionModal.style.display = 'block';
}

function handleSubmitSuggestion(e) {
    e.preventDefault();
    
    const message = document.getElementById('suggestionMessage').value;
    
    if (!appState.currentSuggestionProductId) {
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
        return;
    }
    
    const suggestions = getSuggestions();
    const newSuggestion = new Suggestion(
        appState.currentSuggestionProductId,
        message,
        Date.now()
    );
    
    suggestions.push(newSuggestion);
    saveSuggestions(suggestions);
    
    // Reset form and close modal
    suggestionForm.reset();
    suggestionModal.style.display = 'none';
    
    showNotification('Saran berhasil dikirim!', 'success');
}

function renderSuggestions() {
    const suggestions = getSuggestions();
    const products = getProducts();
    
    suggestionsList.innerHTML = '';
    
    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<p class="text-center">Belum ada saran.</p>';
        return;
    }
    
    // Sort by timestamp (newest first)
    suggestions.sort((a, b) => b.timestamp - a.timestamp);
    
    suggestions.forEach(suggestion => {
        const product = products.find(p => p.id === suggestion.productId);
        const productName = product ? product.name : 'Produk tidak ditemukan';
        
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        
        suggestionItem.innerHTML = `
            <div>
                <h4>${productName}</h4>
                <p>${suggestion.message}</p>
                <small>${new Date(suggestion.timestamp).toLocaleString('id-ID')}</small>
            </div>
        `;
        
        suggestionsList.appendChild(suggestionItem);
    });
}

// Payment Flow
function startPayment(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    appState.currentProduct = product;
    appState.appliedDiscount = null;
    appState.selectedPaymentMethod = null;
    
    // Reset payment state
    paymentDetails.classList.add('hidden');
    paymentOptions.forEach(opt => opt.classList.remove('active'));
    
    // Reset discount input
    discountInput.value = '';
    discountMessage.textContent = '';
    discountMessage.className = 'discount-message';
    
    // Update payment page
    document.getElementById('paymentProductName').textContent = product.name;
    document.getElementById('paymentProductPrice').textContent = `Rp ${product.price.toLocaleString('id-ID')}`;
    
    // Clear any existing countdown
    if (appState.countdownInterval) {
        clearInterval(appState.countdownInterval);
        appState.countdownInterval = null;
    }
    
    // Reset countdown display
    countdownTimer.textContent = '02:00';
    countdownTimer.style.color = '';
    countdownTimer.style.fontWeight = '';
    
    // Show payment page
    showPage('paymentPage');
}

function selectPaymentMethod(option) {
    // Remove active class from all options
    paymentOptions.forEach(opt => opt.classList.remove('active'));
    
    // Add active class to selected option
    option.classList.add('active');
    
    appState.selectedPaymentMethod = option.dataset.method;
    
    // Show payment details
    paymentDetails.classList.remove('hidden');
    
    // Update payment details based on selected method
    const methodName = document.getElementById('selectedMethodName');
    const paymentInfo = document.getElementById('paymentInfo');
    
    let methodData = {};
    
    switch (appState.selectedPaymentMethod) {
        case 'ovo':
            methodData = {
                name: 'OVO',
                number: '089502396168',
                logo: 'https://ar-hosting.pages.dev/1759062672982.jpg'
            };
            break;
        case 'dana':
            methodData = {
                name: 'Dana',
                number: '089502396168',
                logo: 'https://ar-hosting.pages.dev/1759062895265.jpg'
            };
            break;
        case 'gopay':
            methodData = {
                name: 'Gopay',
                number: '08979240985',
                logo: 'https://ar-hosting.pages.dev/1759062947442.jpg'
            };
            break;
        case 'qris':
            methodData = {
                name: 'QRIS',
                qrCode: 'https://ar-hosting.pages.dev/1756913721550.jpg',
                logo: 'https://ar-hosting.pages.dev/1759062992641.jpg'
            };
            break;
    }
    
    methodName.textContent = methodData.name;
    
    if (appState.selectedPaymentMethod === 'qris') {
        paymentInfo.innerHTML = `
            <div class="payment-method-info">
                <p>Scan QR Code berikut untuk melakukan pembayaran:</p>
                <img src="${methodData.qrCode}" alt="QR Code" class="qris-image">
                <p class="payment-note">Scan QRIS di atas menggunakan aplikasi e-wallet atau mobile banking Anda</p>
            </div>
        `;
    } else {
        paymentInfo.innerHTML = `
            <div class="payment-method-info">
                <div class="payment-number">
                    <p>Transfer ke nomor berikut:</p>
                    <div class="number-display">${methodData.number}</div>
                    <p class="payment-recipient">a.n. NADRETH HOSTING</p>
                </div>
                <div class="payment-instruction">
                    <p><strong>Instruksi Pembayaran:</strong></p>
                    <ol>
                        <li>Buka aplikasi ${methodData.name} Anda</li>
                        <li>Masukkan nomor <strong>${methodData.number}</strong></li>
                        <li>Masukkan jumlah yang harus dibayar</li>
                        <li>Konfirmasi pembayaran</li>
                        <li>Screenshot bukti transfer</li>
                    </ol>
                </div>
            </div>
        `;
    }
    
    // Calculate final price with discount
    let finalPrice = appState.currentProduct.price;
    if (appState.appliedDiscount) {
        if (appState.appliedDiscount.type === 'percentage') {
            finalPrice = finalPrice - (finalPrice * appState.appliedDiscount.value / 100);
        } else if (appState.appliedDiscount.type === 'nominal') {
            finalPrice = finalPrice - appState.appliedDiscount.value;
        }
        finalPrice = Math.max(0, finalPrice);
    }
    
    // Update WhatsApp link
    updateWhatsAppLink(finalPrice);
    
    // Start countdown
    startCountdown();
}

function updateWhatsAppLink(finalPrice) {
    const productName = appState.currentProduct.name;
    const message = `bang saya sudah bayar produk ${productName} dengan harga Rp ${finalPrice.toLocaleString('id-ID')}... Ini saya mau mengirimkan bukti transfer nya`;
    const encodedMessage = encodeURIComponent(message);
    confirmPaymentBtn.href = `https://wa.me/628979240985?text=${encodedMessage}`;
}

function startCountdown() {
    let timeLeft = 120; // 2 minutes in seconds
    
    // Clear existing interval
    if (appState.countdownInterval) {
        clearInterval(appState.countdownInterval);
    }
    
    // Update countdown immediately
    updateCountdownDisplay(timeLeft);
    
    // Start new interval
    appState.countdownInterval = setInterval(() => {
        timeLeft--;
        updateCountdownDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(appState.countdownInterval);
            cancelPayment();
            // Show timeout message
            showNotification('Waktu pembayaran telah habis. Silakan pilih metode pembayaran lagi.', 'error');
        } else if (timeLeft <= 30) {
            // Change color to red when less than 30 seconds
            countdownTimer.style.color = '#e74c3c';
            countdownTimer.style.fontWeight = 'bold';
        }
    }, 1000);
}

function updateCountdownDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    countdownTimer.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function cancelPayment() {
    // Clear countdown
    if (appState.countdownInterval) {
        clearInterval(appState.countdownInterval);
        appState.countdownInterval = null;
    }
    
    // Reset countdown display
    countdownTimer.textContent = '02:00';
    countdownTimer.style.color = '';
    countdownTimer.style.fontWeight = '';
    
    // Reset payment state
    appState.selectedPaymentMethod = null;
    
    // Hide payment details
    paymentDetails.classList.add('hidden');
    
    // Remove active class from payment options
    paymentOptions.forEach(opt => opt.classList.remove('active'));
}

// Dashboard Tabs
function switchTab(tabId) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    // Update tab contents
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabId}Tab`);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);