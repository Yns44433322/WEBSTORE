document.addEventListener('DOMContentLoaded', () => {
    // --- DATA PRODUK AWAL (10 PRODUK) ---
    // Data ini akan dimuat HANYA JIKA localStorage kosong.
    const defaultProducts = [
        { id: 'prod_1', name: 'Hosting Paket ??? 1', price: 50000, benefits: ['1 Core CPU', '1 GB RAM', '20 GB SSD Storage', 'Unlimited Bandwidth'], imageUrl: 'https://via.placeholder.com/300x200.png?text=Produk+1', isSold: false, isPublished: true },
        { id: 'prod_2', name: 'VPS Server ??? 2', price: 150000, benefits: ['2 Core CPU', '2 GB RAM', '50 GB SSD Storage', 'Akses Root Penuh'], imageUrl: 'https://via.placeholder.com/300x200.png?text=Produk+2', isSold: false, isPublished: true },
        { id: 'prod_3', name: 'Domain .COM ??? 3', price: 125000, benefits: ['Gratis Whois Privacy', 'Manajemen DNS Mudah', 'Support 24/7'], imageUrl: 'https://via.placeholder.com/300x200.png?text=Produk+3', isSold: false, isPublished: true },
        { id: 'prod_4', name: 'Hosting Bisnis ??? 4', price: 250000, benefits: ['4 Core CPU', '4 GB RAM', '100 GB NVMe SSD', 'Gratis SSL & Domain'], imageUrl: 'https://via.placeholder.com/300x200.png?text=Produk+4', isSold: true, isPublished: true },
        { id: 'prod_5', name: 'Dedicated Server ??? 5', price: 1200000, benefits: ['8 Core CPU (Intel Xeon)', '16 GB DDR4 RAM', '1 TB NVMe SSD', 'IP Publik Dedicated'], imageUrl: 'https://via.placeholder.com/300x200.png?text=Produk+5', isSold: false, isPublished: true },
        { id: 'prod_6', name: 'Email Hosting ??? 6', price: 75000, benefits: ['Kapasitas 10 GB/akun', 'Anti-Spam & Anti-Virus', 'Webmail Profesional'], imageUrl: 'https://via.placeholder.com/300x200.png?text=Produk+6', isSold: false, isPublished: true },
        { id: 'prod_7', name: 'Cloud Backup ??? 7', price: 90000, benefits: ['Backup Harian Otomatis', 'Kapasitas 100 GB', 'Enkripsi End-to-End'], imageUrl: 'https://via.placeholder.com/300x200.png?text=Produk+7', isSold: false, isPublished: true },
        { id: 'prod_8', name: 'WordPress Hosting ??? 8', price: 85000, benefits: ['Server Dioptimalkan untuk WP', 'Instalasi 1-Klik', 'Keamanan Terjamin'], imageUrl: 'https://via.placeholder.com/300x200.png?text=Produk+8', isSold: false, isPublished: true },
        { id: 'prod_9', name: 'Lisensi cPanel ??? 9', price: 200000, benefits: ['Lisensi cPanel Resmi', 'Update Otomatis', 'Instalasi Mudah'], imageUrl: 'https://via.placeholder.com/300x200.png?text=Produk+9', isSold: false, isPublished: false },
        { id: 'prod_10', name: 'SSL Certificate ??? 10', price: 100000, benefits: ['Validasi Domain (DV)', 'Enkripsi 256-bit', 'Meningkatkan Kepercayaan'], imageUrl: 'https://via.placeholder.com/300x200.png?text=Produk+10', isSold: false, isPublished: true },
    ];

    // Cek jika produk belum ada di localStorage, maka tambahkan data awal
    if (!localStorage.getItem('nadreth_products')) {
        localStorage.setItem('nadreth_products', JSON.stringify(defaultProducts));
    }
    
    // STATE MANAGEMENT
    const state = {
        currentPage: 'home',
        currentUser: JSON.parse(localStorage.getItem('nadreth_user')) || { role: 'public' },
        products: JSON.parse(localStorage.getItem('nadreth_products')) || [],
        banner: JSON.parse(localStorage.getItem('nadreth_banner')) || null,
        discounts: JSON.parse(localStorage.getItem('nadreth_discounts')) || [],
        usedDiscounts: JSON.parse(localStorage.getItem('nadreth_used_discounts')) || [],
        suggestions: JSON.parse(localStorage.getItem('nadreth_suggestions')) || [],
        currentTheme: localStorage.getItem('nadreth_theme') || 'light',
        payment: { productId: null, timer: null, countdown: 120 },
    };

    // DOM ELEMENTS (Salin dari file app.js versi awal)
    const pages = document.querySelectorAll('.page');
    const avatarIcon = document.getElementById('avatar-icon');
    const themeToggle = document.getElementById('theme-toggle');
    const runningBanner = document.getElementById('running-banner');

    // HELPER FUNCTIONS (Salin dari file app.js versi awal)
    const saveToLocalStorage = (key, data) => localStorage.setItem(`nadreth_${key}`, JSON.stringify(data));
    const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId)?.classList.add('active');
        state.currentPage = pageId;
        window.scrollTo(0, 0);
        if (pageId === 'payment') {
            runningBanner.classList.add('hidden');
        } else {
            renderBanner();
        }
    };

    // THEME LOGIC (Salin dari file app.js versi awal)
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.checked = theme === 'dark';
        localStorage.setItem('nadreth_theme', theme);
        state.currentTheme = theme;
    };
    themeToggle.addEventListener('change', () => applyTheme(themeToggle.checked ? 'dark' : 'light'));

    // ACCOUNT & LOGIN LOGIC (Salin dari file app.js versi awal)
    const updateUIForLoginState = () => {
        const { role } = state.currentUser;
        const publicView = document.getElementById('public-account-view');
        const developerView = document.getElementById('developer-account-view');
        const loginForm = document.getElementById('developer-login-form');
        if (role === 'developer') {
            publicView.classList.add('hidden');
            developerView.classList.remove('hidden');
            loginForm.classList.add('hidden');
        } else {
            publicView.classList.remove('hidden');
            developerView.classList.add('hidden');
            loginForm.classList.add('hidden');
        }
    };
    avatarIcon.addEventListener('click', () => showPage('account'));
    document.getElementById('show-login-form-btn').addEventListener('click', () => { document.getElementById('public-account-view').classList.add('hidden'); document.getElementById('developer-login-form').classList.remove('hidden'); });
    document.getElementById('cancel-login-btn').addEventListener('click', () => { document.getElementById('public-account-view').classList.remove('hidden'); document.getElementById('developer-login-form').classList.add('hidden'); });
    document.getElementById('login-form').addEventListener('submit', (e) => { e.preventDefault(); const username = document.getElementById('username').value; const password = document.getElementById('password').value; if (username === 'NadrethbyNuxz' && password === '210108') { state.currentUser = { role: 'developer' }; saveToLocalStorage('user', state.currentUser); updateUIForLoginState(); } else { alert('Username atau password salah!'); } });
    document.getElementById('logout-btn').addEventListener('click', () => { state.currentUser = { role: 'public' }; saveToLocalStorage('user', state.currentUser); updateUIForLoginState(); showPage('home'); });

    // NAVIGATION (Salin dari file app.js versi awal)
    document.getElementById('go-to-products-btn').addEventListener('click', () => { renderProductList(); showPage('products'); });
    document.getElementById('developer-dashboard-btn').addEventListener('click', () => { renderAllDashboardPanes(); showPage('developer-dashboard'); });
    document.getElementById('back-to-home-from-dashboard').addEventListener('click', () => showPage('home'));
    document.getElementById('back-to-home-from-products').addEventListener('click', () => showPage('home'));
    document.getElementById('back-to-products-btn').addEventListener('click', () => { renderProductList(); showPage('products'); });

    // PRODUCT DETAIL
    const renderProductDetail = (productId) => {
        const product = state.products.find(p => p.id === productId);
        const content = document.getElementById('product-detail-content');
        if (!product) {
            content.innerHTML = '<p>Produk tidak ditemukan.</p>';
            return;
        }

        // MODIFIKASI: Ubah cara render benefit menjadi list per poin
        let benefitsHtml = '';
        if (Array.isArray(product.benefits)) {
            benefitsHtml = `<ul>${product.benefits.map(b => `<li>${b}</li>`).join('')}</ul>`;
        } else {
            // Fallback jika data lama masih berupa string
            benefitsHtml = `<div style="white-space: pre-wrap;">${product.benefits}</div>`;
        }

        content.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x300.png?text=No+Image';">
            <h2>${product.name}</h2>
            <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
            <p class="status">${product.isSold ? 'Stok Habis' : 'Tersedia'}</p>
            <h3>Benefit:</h3>
            <div class="benefits">${benefitsHtml}</div>
            <button id="buy-now-btn" class="btn btn-primary" ${product.isSold ? 'disabled' : ''} data-id="${product.id}">
                ${product.isSold ? 'Terjual' : 'Beli Sekarang'}
            </button>
        `;
    };
    
    // PRODUCT MANAGEMENT (CRUD)
    const renderManageProductList = () => { /* Salin dari app.js versi awal */ }; // (Tidak ada perubahan di sini)
    document.getElementById('product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('product-id').value;
        
        // MODIFIKASI: Saat menyimpan, ubah textarea menjadi array per baris
        const benefitsValue = document.getElementById('product-benefits').value;
        const benefitsArray = benefitsValue.split('\n').filter(b => b.trim() !== ''); // Pisahkan per baris

        const productData = {
            name: document.getElementById('product-name').value,
            price: parseInt(document.getElementById('product-price').value),
            benefits: benefitsArray, // Simpan sebagai array
            imageUrl: document.getElementById('product-image').value,
            isSold: document.getElementById('product-sold').checked,
            isPublished: document.getElementById('product-published').checked,
        };
        if (id) {
            const index = state.products.findIndex(p => p.id === id);
            state.products[index] = { ...state.products[index], ...productData };
        } else {
            productData.id = generateId();
            state.products.push(productData);
        }
        saveToLocalStorage('products', state.products);
        renderManageProductList();
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        alert('Produk berhasil disimpan!');
    });
    
    document.getElementById('manage-products-list').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const id = target.dataset.id;
        if (target.classList.contains('edit-product-btn')) {
            const product = state.products.find(p => p.id === id);
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-image').value = product.imageUrl;
            
            // MODIFIKASI: Saat mengedit, ubah array benefit menjadi teks di textarea
            if (Array.isArray(product.benefits)) {
                document.getElementById('product-benefits').value = product.benefits.join('\n');
            } else {
                document.getElementById('product-benefits').value = product.benefits;
            }
            
            document.getElementById('product-sold').checked = product.isSold;
            document.getElementById('product-published').checked = product.isPublished;
            window.scrollTo(0, 0);
        }
        if (target.classList.contains('delete-product-btn')) {
            if (confirm('Anda yakin ingin menghapus produk ini?')) {
                state.products = state.products.filter(p => p.id !== id);
                saveToLocalStorage('products', state.products);
                renderManageProductList();
            }
        }
    });

    // --- SALIN SEMUA SISA FUNGSI DARI app.js VERSI AWAL ---
    // (Banner, Dashboard, Discount, Suggestion, Public Product List, Payment Logic, dll)
    // Semua kode tersebut tidak perlu diubah dan bisa langsung disalin ke sini.
    // Pastikan Anda menyalin semua fungsi agar tidak ada yang terlewat.
    const renderProductList = () => {
        const listContainer = document.getElementById('products-list');
        listContainer.innerHTML = '';
        const publishedProducts = state.products.filter(p => p.isPublished);
        if (publishedProducts.length === 0) {
             listContainer.innerHTML = '<p style="text-align:center;">Saat ini belum ada produk yang tersedia.</p>';
             return;
        }
        publishedProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.id = product.id;
            if (product.isSold) card.classList.add('sold-out');
            card.innerHTML = `
                ${product.isSold ? '<div class="sold-badge">SOLD</div>' : ''}
                <div class="product-image-container">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-image" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200.png?text=No+Image';">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
                </div>
                <div class="suggestion-icon" data-id="${product.id}">!</div>
            `;
            listContainer.appendChild(card);
        });
    };
    
    // (Tambahkan sisa kode dari app.js versi pertama di sini...)
    // ...

    // INITIALIZATION
    const init = () => {
        applyTheme(state.currentTheme);
        updateUIForLoginState();
        renderBanner();
        showPage('home');
    };

    init();
});

// Catatan: Pastikan untuk menyalin semua fungsi lain yang tidak saya tulis ulang dari file app.js versi awal
// agar semua fitur seperti diskon, saran, banner, dll tetap berfungsi.
