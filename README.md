# NADRETH HOSTING Website

Website penjualan hosting dengan sistem manajemen produk, diskon, dan pembayaran.

## Cara Menjalankan

1. Download semua file: `index.html`, `styles.css`, `app.js`, dan `README.md`
2. Simpan semua file dalam folder yang sama
3. Buka file `index.html` di browser web dengan cara:
   - Double-click file `index.html`, atau
   - Drag file `index.html` ke jendela browser

## Fitur

### Untuk Pembeli (Akun Publik)
- Melihat daftar produk hosting
- Melihat detail produk
- Mengirim saran untuk produk tertentu
- Melakukan pembayaran dengan berbagai metode
- Menggunakan kode diskon (jika tersedia)

### Untuk Developer
- Login dengan kredensial default
- Mengelola produk (tambah, edit, hapus, publish/unpublish)
- Mengelola banner informasi (tampil 24 jam)
- Mengelola kode diskon dengan expiry
- Melihat saran dari pembeli

## Login Developer

Default credentials:
- Username: `NadrethbyNuxz`
- Password: `210108`

## Penyimpanan Data

Semua data disimpan di localStorage browser, termasuk:
- Data produk (nama, harga, gambar, benefit, status)
- Kode diskon (kode, jenis, nilai, expiry, status penggunaan)
- Banner informasi
- Saran dari pembeli
- Preferensi tema (terang/gelap)

## Sistem Diskon

- Kode diskon bisa berupa persentase atau nominal
- Setiap kode memiliki tanggal kadaluarsa
- Kode hanya bisa digunakan sekali untuk satu produk
- Setelah digunakan, kode tidak bisa dipakai lagi

## Metode Pembayaran

1. OVO: 089502396168
2. Dana: 089502396168
3. Gopay: 08979240985
4. QRIS: Scan barcode

## Alur Pembayaran

1. Klik "Beli Sekarang" pada produk → diarahkan ke halaman pembayaran
2. Pilih metode pembayaran → tampil detail nomor/barcode
3. Timer 2 menit berjalan
4. Klik "Sudah Bayar" → redirect ke WhatsApp dengan pesan otomatis
5. Klik "Cancel" → kembali ke pilihan metode pembayaran
6. Timer habis → reset otomatis ke pilihan metode

## Catatan

- Website ini berjalan sepenuhnya di frontend tanpa backend
- Pembayaran hanya simulasi, tidak ada integrasi asli dengan payment gateway
- Semua gambar diambil dari URL eksternal
- Data akan tetap ada setelah reload halaman karena menggunakan localStorage

## Teknologi

- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome untuk ikon
- LocalStorage untuk penyimpanan data
- Desain responsif untuk desktop dan mobile
- Dukungan tema terang dan gelap