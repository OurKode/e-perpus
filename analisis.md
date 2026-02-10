# 📚 Dokumen Analisis Aplikasi: **e-Perpus**

## Sistem Informasi Perpustakaan Digital — MTs/MAS Aisyiyah Binjai

**Tanggal Analisis:** 11 Februari 2026  
**Versi Aplikasi:** 0.1.0 (MVP)  
**Analis:** Antigravity AI Assistant

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Struktur Direktori](#3-struktur-direktori)
4. [Skema Database](#4-skema-database)
5. [Fitur & Alur Kerja](#5-fitur--alur-kerja)
6. [Komponen UI](#6-komponen-ui)
7. [Analisis Keamanan](#7-analisis-keamanan)
8. [Analisis Performa & Kualitas Kode](#8-analisis-performa--kualitas-kode)
9. [Kesesuaian UI/UX](#9-kesesuaian-uiux)
10. [Temuan Bug & Masalah](#10-temuan-bug--masalah)
11. [Rekomendasi Perbaikan](#11-rekomendasi-perbaikan)

---

## 1. Ringkasan Eksekutif

**e-Perpus** adalah aplikasi web **Sistem Informasi Perpustakaan Digital** yang dikembangkan untuk **MTs - MAS Aisyiyah Binjai**. Aplikasi ini berfungsi sebagai alat manajemen internal perpustakaan sekolah yang mencakup pengelolaan data buku, anggota (siswa), dan transaksi peminjaman/pengembalian buku.

### Karakteristik Utama

| Aspek | Detail |
|---|---|
| **Nama Aplikasi** | e-Perpus (Aisyiyah Binjai Library) |
| **Tipe** | Web Application (Admin Dashboard) |
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Bahasa** | TypeScript |
| **Database** | LibSQL/Turso (SQLite cloud) |
| **ORM** | Drizzle ORM |
| **Autentikasi** | NextAuth v5 (Credentials Provider) |
| **UI Kit** | shadcn/ui pattern (Radix UI + Tailwind CSS v4) |
| **Target Pengguna** | Staf Perpustakaan / Administrator |
| **Status** | MVP (Minimum Viable Product) |

---

## 2. Arsitektur Sistem

### 2.1 Tech Stack Diagram

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│  Next.js 16 (App Router) + React 19 + TypeScript    │
│  UI: Radix UI + Tailwind CSS v4 + Framer Motion     │
│  Form: React Hook Form + Zod Validation             │
├─────────────────────────────────────────────────────┤
│                   MIDDLEWARE                        │
│  NextAuth v5 (Route Protection via Edge Middleware) │
├─────────────────────────────────────────────────────┤
│                 BACKEND (Server Actions)            │
│  Next.js Server Actions ('use server')              │
│  Drizzle ORM (Type-safe queries)                    │
├─────────────────────────────────────────────────────┤
│                    DATABASE                         │
│  LibSQL / Turso (Cloud SQLite)                      │
│  + Local fallback: local.db                         │
└─────────────────────────────────────────────────────┘
```

### 2.2 Pola Arsitektur

- **Rendering:** Menggunakan **React Server Components (RSC)** secara dominan. Halaman-halaman utama (`page.tsx`) adalah async server components yang langsung query database.
- **Data Fetching:** Tidak menggunakan API routes tradisional. Semua mutasi data dilakukan melalui **Next.js Server Actions** (`'use server'`).
- **State Management:** Menggunakan React `useState` dan `useTransition` bawaan — tidak ada state manager eksternal (Redux, Zustand, dll).
- **Routing:** Menggunakan App Router dengan **Route Groups** (`(auth)`, `(dashboard)`, `(content)`) untuk mengorganisir layout.

### 2.3 Alur Autentikasi

```
User → Login Page → authenticate() Server Action
                          ↓
                   NextAuth signIn('credentials')
                          ↓
                   Validasi Zod (email+password)
                          ↓
                   Query DB → Compare Password (Plain Text!)
                          ↓
                   Set Session Cookie → Redirect ke Dashboard
                          ↓
     Middleware (auth.config.ts) → Protect semua route kecuali /login
```

---

## 3. Struktur Direktori

```
e-perpus-main/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Halaman login (client component)
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Dashboard layout + Sidebar
│   │   └── (content)/
│   │       ├── layout.tsx            # Content wrapper (bg hijau)
│   │       ├── page.tsx              # Dashboard utama (statistik + tabel)
│   │       ├── books/
│   │       │   ├── page.tsx          # Halaman manajemen buku
│   │       │   ├── books-list.tsx    # Komponen tabel buku (sederhana)
│   │       │   └── actions.ts        # CRUD server actions buku
│   │       ├── members/
│   │       │   ├── page.tsx          # Halaman manajemen anggota
│   │       │   └── actions.ts        # CRUD server actions anggota
│   │       ├── borrow/
│   │       │   ├── page.tsx          # Halaman form peminjaman
│   │       │   └── borrow-form.tsx   # Form peminjaman (client)
│   │       ├── transactions/
│   │       │   └── actions.ts        # Server actions peminjaman/pengembalian
│   │       └── profile/
│   │           ├── page.tsx          # Halaman edit profil
│   │           ├── profile-form.tsx  # Form profil (client)
│   │           └── actions.ts        # Server action update profil
│   ├── api/
│   │   └── auth/                     # NextAuth API routes (auto-generated)
│   ├── lib/
│   │   └── actions.ts               # Server action authenticate (login)
│   ├── layout.tsx                    # Root layout (fonts, metadata)
│   └── globals.css                   # Design tokens & theme variables
├── components/
│   ├── BooksList.tsx                 # Komponen utama list buku (CRUD + detail)
│   ├── MembersList.tsx               # Komponen utama list anggota (CRUD + cetak kartu)
│   ├── ReturnButton.tsx              # Tombol pengembalian buku (dialog konfirmasi)
│   ├── ServiceHoursDialog.tsx        # Dialog info jam pelayanan
│   └── ui/                           # shadcn/ui primitives (13 komponen)
├── db/
│   └── schema.ts                     # Drizzle schema (users, books, members, transactions)
├── drizzle/
│   └── 0000_exotic_cassandra_nova.sql # Migrasi SQL pertama
├── lib/
│   ├── db.ts                         # Koneksi database (Drizzle + LibSQL)
│   └── utils.ts                      # Utility cn() untuk class merging
├── scripts/
│   ├── seed.ts                       # Seeder database (dummy data)
│   └── drop_members.ts              # Script drop tabel members
├── public/
│   ├── logo.png                      # Logo sekolah (~91KB)
│   ├── background.png                # Background login (~13.8MB!) ⚠️
│   └── background.jpg               # Background alternatif (~2.1MB)
├── auth.ts                           # Konfigurasi NextAuth + Credentials provider
├── auth.config.ts                    # Config auth (pages, callbacks)
├── middleware.ts                     # Edge middleware (route protection)
├── drizzle.config.ts                 # Konfigurasi Drizzle Kit (Turso)
└── package.json                      # Dependencies
```

---

## 4. Skema Database

### 4.1 Entity-Relationship Diagram (ERD)

```
┌──────────────┐        ┌──────────────────────┐        ┌──────────────┐
│    USERS     │        │    TRANSACTIONS      │        │    BOOKS     │
├──────────────┤        ├──────────────────────┤        ├──────────────┤
│ id (PK, AI)  │        │ id (PK, AI)          │        │ id (PK, AI)  │
│ email (UQ)   │        │ member_id (FK) ──────┼───┐    │ code (UQ)    │
│ name         │        │ book_id (FK) ────────┼───┼──→ │ title        │
│ telp         │        │ borrow_date          │   │    │ author       │
│ address      │        │ due_date             │   │    │ publisher    │
│ password     │        │ return_date          │   │    │ published_yr │
└──────────────┘        │ status               │   │    │ isbn         │
                        │ fine_amount          │   │    │ total_pages  │
┌──────────────┐        └──────────────────────┘   │    │ dimensions   │
│   MEMBERS    │                                    │    │ edition      │
├──────────────┤                                    │    │ stock        │
│ id (PK, AI)  │←───────────────────────────────────┘    │ location     │
│ nis_nisn (UQ)│                                         └──────────────┘
│ name         │
│ kelas        │
│ address      │
│ created_at   │
└──────────────┘
```

### 4.2 Detail Tabel

#### `users` — Administrator Sistem
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik |
| `email` | TEXT | UNIQUE, NOT NULL | Email login |
| `name` | TEXT | nullable | Nama admin |
| `telp` | INTEGER | nullable | No. telepon |
| `address` | TEXT | nullable | Alamat |
| `password` | TEXT | NOT NULL | Password (⚠️ plain text di produksi) |

#### `books` — Data Buku
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik |
| `code` | TEXT | UNIQUE, NOT NULL | Kode buku (e.g. B001) |
| `title` | TEXT | NOT NULL | Judul buku |
| `author` | TEXT | nullable | Penulis |
| `publisher` | TEXT | nullable | Penerbit |
| `published_year` | INTEGER | nullable | Tahun terbit |
| `isbn` | TEXT | nullable | ISBN |
| `total_pages` | INTEGER | nullable | Jumlah halaman |
| `dimensions` | TEXT | nullable | Dimensi fisik |
| `edition` | TEXT | nullable | Cetakan/edisi |
| `stock` | INTEGER | DEFAULT 0, NOT NULL | Jumlah stok tersedia |
| `location` | TEXT | nullable | Lokasi rak |

#### `members` — Anggota (Siswa)
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik |
| `nis_nisn` | TEXT | UNIQUE, NOT NULL | NIS/NISN siswa |
| `name` | TEXT | NOT NULL | Nama lengkap |
| `kelas` | TEXT | nullable | Kelas (e.g. VII-A) |
| `address` | TEXT | nullable | Alamat |
| `created_at` | INTEGER (timestamp) | DEFAULT NOW | Tanggal registrasi |

#### `transactions` — Transaksi Peminjaman
| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik |
| `member_id` | INTEGER | FK → members.id, NOT NULL | ID peminjam |
| `book_id` | INTEGER | FK → books.id, NOT NULL | ID buku |
| `borrow_date` | TEXT | NOT NULL | Tanggal pinjam (ISO yyyy-MM-dd) |
| `due_date` | TEXT | NOT NULL | Batas pengembalian |
| `return_date` | TEXT | nullable | Tanggal dikembalikan |
| `status` | TEXT | DEFAULT 'BORROWED', NOT NULL | Status: BORROWED / RETURNED |
| `fine_amount` | INTEGER | DEFAULT 0, NOT NULL | Jumlah denda |

### 4.3 Relasi

| Relasi | Tipe | Keterangan |
|---|---|---|
| `members` ↔ `transactions` | One-to-Many | Satu anggota bisa memiliki banyak transaksi |
| `books` ↔ `transactions` | One-to-Many | Satu buku bisa muncul di banyak transaksi |

### 4.4 Catatan Penting Schema

- ⚠️ **Schema Drift:** Terdapat perbedaan antara file migrasi SQL (`0000_exotic_cassandra_nova.sql`) dan schema Drizzle saat ini (`db/schema.ts`). Migrasi awal belum mencakup kolom-kolom baru (`author`, `publisher`, `isbn`, `dimensions`, `edition`, `nis_nisn`, dll). Ini berarti schema sudah di-*push* langsung (via `drizzle-kit push`) tanpa generate migrasi baru.
- ⚠️ **Tabel `users` di migrasi** tidak memiliki kolom `name`, `telp`, `address` — kolom-kolom ini ditambahkan setelah migrasi awal.

---

## 5. Fitur & Alur Kerja

### 5.1 Peta Fitur

| # | Fitur | Halaman | Tipe Render | Status |
|---|---|---|---|---|
| 1 | **Login** | `/login` | Client Component | ✅ Implementasi lengkap |
| 2 | **Dashboard** | `/` | Server Component | ✅ Statistik + tabel aktif |
| 3 | **Manajemen Buku** | `/books` | Server + Client | ✅ CRUD + Detail + Search |
| 4 | **Manajemen Anggota** | `/members` | Server + Client | ✅ CRUD + Search + Cetak Kartu |
| 5 | **Peminjaman Buku** | `/borrow` | Server + Client | ✅ Form + searchable combobox |
| 6 | **Pengembalian Buku** | `/` (dashboard) | Client Component | ✅ Tombol return + dialog denda |
| 7 | **Edit Profil** | `/profile` | Server + Client | ✅ Update nama, telp, alamat |
| 8 | **Info Jam Pelayanan** | Sidebar (dialog) | Client Component | ✅ Dialog informasi statis |
| 9 | **Logout** | Sidebar | Server Action | ✅ Sign out via form |

### 5.2 Alur Kerja Utama

#### A. Login → Dashboard

```
1. User membuka aplikasi
2. Middleware mendeteksi user belum login → redirect ke /login
3. User memasukkan email + password
4. authenticate() → signIn('credentials') → validasi Zod → query DB → compare
5. Jika berhasil → set session → redirect ke Dashboard (/)
6. Dashboard menampilkan:
   - Statistik: Total Buku, Total Siswa, Sedang Dipinjam
   - Tabel peminjaman aktif + status keterlambatan + tombol Kembalikan
```

#### B. Peminjaman Buku (Borrow Flow)

```
1. Admin navigasi ke /borrow
2. Sistem memuat daftar buku (stok > 0) dan daftar anggota dari DB
3. Admin memilih anggota + buku via searchable combobox
4. Admin menentukan tanggal jatuh tempo (default: 7 hari dari hari ini)
5. Admin klik "Confirm Loan"
6. Server Action borrowBook():
   a. Cek stok buku
   b. INSERT transaksi baru (status: BORROWED)
   c. UPDATE stok buku (stock - 1)
   d. Dalam satu DB transaction (atomik)
7. Redirect ke Dashboard, data diperbarui via revalidatePath
```

#### C. Pengembalian Buku (Return Flow)

```
1. Admin melihat tabel peminjaman aktif di Dashboard
2. Admin klik tombol "Kembalikan" pada baris transaksi
3. AlertDialog konfirmasi muncul
4. Admin konfirmasi → Server Action returnBook():
   a. Hitung keterlambatan (jumlah hari lewat due_date)
   b. Hitung denda: Rp 500 × hari terlambat (jika ada)
   c. UPDATE transaksi (returnDate, status=RETURNED, fineAmount)
   d. UPDATE stok buku (stock + 1)
   e. Dalam satu DB transaction (atomik)
5. Dialog sukses menampilkan jumlah denda
```

#### D. Perhitungan Denda

| Parameter | Nilai |
|---|---|
| **Tarif denda** | Rp 500 / hari keterlambatan |
| **Ditampilkan di Dashboard** | Rp 5.000 / hari *(inkonsisten!)* ⚠️ |
| **Dihitung saat** | Pengembalian buku (returnBook action) |
| **Kalkulasi tampilan** | Realtime di dashboard (differenceInCalendarDays × 5000) |
| **Kalkulasi simpan** | Di server action (differenceInCalendarDays × 500) |

> ⚠️ **INKONSISTENSI DENDA:** Tampilan dashboard menghitung `daysLate * 5000` (baris 118, `page.tsx`), namun server action `returnBook()` menyimpan `daysLate * 500` (baris 52, `transactions/actions.ts`). **Selisih 10x lipat!**

---

## 6. Komponen UI

### 6.1 Komponen Kustom

| Komponen | File | Tipe | Keterangan |
|---|---|---|---|
| `BooksList` | `components/BooksList.tsx` | Client | Tabel buku lengkap: search, CRUD dialog, detail popup |
| `MembersList` | `components/MembersList.tsx` | Client | Tabel anggota: search, CRUD dialog, cetak kartu anggota |
| `ReturnButton` | `components/ReturnButton.tsx` | Client | Tombol pengembalian buku + dialog konfirmasi + dialog denda |
| `ServiceHoursDialog` | `components/ServiceHoursDialog.tsx` | Client | Dialog info jam pelayanan perpustakaan |
| `BorrowForm` | `app/.../borrow/borrow-form.tsx` | Client | Form peminjaman buku dengan searchable combobox |
| `ProfileForm` | `app/.../profile/profile-form.tsx` | Client | Form edit profil pengguna |

### 6.2 Komponen shadcn/ui (Primitives)

Terdapat **13 komponen UI** di `components/ui/`:

| Komponen | Digunakan di |
|---|---|
| `alert-dialog` | BooksList, MembersList, ReturnButton |
| `alert` | - (belum digunakan) |
| `badge` | Dashboard |
| `button` | Seluruh halaman |
| `card` | Dashboard, BorrowForm, ProfileForm |
| `dialog` | BooksList, MembersList, ServiceHoursDialog, ReturnButton |
| `form` | LoginPage, BorrowForm |
| `input` | Seluruh form |
| `islamic-pattern` | - (belum digunakan) |
| `label` | Seluruh form |
| `popover` | BorrowForm (combobox) |
| `select` | - (belum digunakan) |
| `table` | Dashboard, BooksList, MembersList |

### 6.3 Fitur Cetak Kartu Anggota

Komponen `MembersList` memiliki fitur **cetak kartu anggota** berformat kartu ID (ukuran 85.6mm × 54mm) dengan:
- Header hijau gelap bertuliskan "KARTU ANGGOTA PERPUSTAKAAN MTs AISYIYAH"
- Placeholder foto 3×4
- Data NIS/NISN, nama, kelas, dan alamat
- Menggunakan `@media print` CSS untuk isolasi area cetak

---

## 7. Analisis Keamanan

### 🔴 Temuan Kritis

| # | Severity | Masalah | File | Detail |
|---|---|---|---|---|
| 1 | **🔴 KRITIS** | **Password disimpan plain text** | `auth.ts:32` | Password dibandingkan langsung tanpa hashing (`password === user.password`). Komentar di kode menyatakan "In production, use bcrypt/argon2". |
| 2 | **🔴 KRITIS** | **Seed menggunakan hash password yang invalid** | `scripts/seed.ts:22-36` | Seeder berisi beberapa hash bcrypt yang palsu/invalid. Password sebenarnya yang digunakan di DB tidak jelas. |
| 3 | **🟠 TINGGI** | **Tidak ada rate limiting pada login** | `app/lib/actions.ts` | Endpoint login dapat di-brute-force tanpa hambatan. |
| 4 | **🟠 TINGGI** | **Input `any` type pada authenticate** | `app/lib/actions.ts:6` | Parameter `formData: any` — tidak ada type safety. |
| 5 | **🟡 SEDANG** | **Tidak ada CSRF protection eksplisit** | Server Actions | Meskipun Next.js Server Actions memiliki proteksi bawaan, tidak ada implementasi CSRF token eksplisit. |
| 6 | **🟡 SEDANG** | **Tidak ada validasi session di beberapa actions** | `books/actions.ts`, `members/actions.ts` | Server actions CRUD buku dan anggota tidak memverifikasi session pengguna. Hanya halaman `page.tsx` yang mengecek session. |
| 7 | **🟡 SEDANG** | **Tidak ada audit trail** | Seluruh actions | Tidak ada pencatatan siapa yang melakukan operasi CRUD dan kapan. |
| 8 | **🟢 RENDAH** | **Environment variables tanpa fallback** | `lib/db.ts:5` | `process.env.TURSO_DATABASE_URL!` menggunakan non-null assertion — akan crash jika env tidak di-set. |

### Ringkasan Postur Keamanan

```
Skor Keamanan: ██░░░░░░░░ 2/10

⚠️  Aplikasi ini dalam tahap MVP dan BELUM AMAN untuk produksi.
    Hashing password adalah keharusan absolut sebelum deployment.
```

---

## 8. Analisis Performa & Kualitas Kode

### 8.1 Temuan Performa

| # | Severity | Masalah | Detail |
|---|---|---|---|
| 1 | **🔴 KRITIS** | **File background.png berukuran 13.8MB** | File gambar di `/public/background.png` sangat besar. Ini akan menyebabkan load time login page sangat lama. Sebaiknya gunakan `background.jpg` (2.1MB) atau kompres lebih lanjut. |
| 2 | **🟠 TINGGI** | **Tidak ada paginasi** | Semua data buku dan anggota di-fetch seluruhnya (`db.select().from(books)`) tanpa LIMIT. Akan bermasalah saat data besar. |
| 3 | **🟡 SEDANG** | **Background image menggunakan `<img>` tag biasa** | Logo di login page dan sidebar menggunakan `<img>` bukan `<Image>` dari Next.js, sehingga tidak mendapat optimasi gambar otomatis. |
| 4 | **🟡 SEDANG** | **Duplikasi komponen BooksList** | Terdapat dua versi BooksList: `app/.../books/books-list.tsx` (sederhana, tidak digunakan secara langsung) dan `components/BooksList.tsx` (lengkap, yang benar-benar dirender). File sederhana tampak redundan. |
| 5 | **🟢 RENDAH** | **Font Playfair_Display di-instantiate berulang** | Font di-define ulang di `layout.tsx`, `BooksList.tsx`, `login/page.tsx`, dan `dashboard/layout.tsx`. Sebaiknya dipusatkan. |

### 8.2 Kualitas Kode

| Aspek | Skor | Catatan |
|---|---|---|
| **TypeScript Coverage** | ⭐⭐⭐⭐ | Baik. Menggunakan InferSelectModel dari Drizzle, interface, dan type-safe schemas. |
| **Konsistensi Bahasa** | ⭐⭐⭐ | Campuran Bahasa Indonesia & Inggris di UI, nama variabel, dan komentar. Beberapa label dalam Bahasa Indonesia, form label dalam Bahasa Inggris. |
| **Error Handling** | ⭐⭐⭐ | Ada try-catch di semua server actions, namun error messages generik. Tidak ada logging ke service eksternal. |
| **Code Organization** | ⭐⭐⭐⭐ | Pemisahan Server/Client components baik. Route groups terstruktur. Actions terpisah per fitur. |
| **Reusability** | ⭐⭐⭐ | Komponen besar (BooksList: 355 baris, MembersList: 328 baris) bisa dipecah lebih modular. |
| **Dokumentasi** | ⭐⭐ | Minim. Hanya README default Next.js. Tidak ada JSDoc atau komentar arsitektur. |

---

## 9. Kesesuaian UI/UX

### 9.1 Design System

| Aspek | Detail |
|---|---|
| **Color Palette** | Hijau (Aisyiyah/Islam), Biru (Sidebar), Amber/Gold (Aksen) |
| **Typography** | `Inter` (sans-serif, body) + `Playfair Display` (serif, headings) |
| **Theme** | Light-only (mode gelap ada tapi sebenarnya identik dengan light) |
| **Border Radius** | 0.5rem base, dengan variasi sm/md/lg/xl |

### 9.2 Temuan UI/UX

| # | Severity | Masalah | Detail |
|---|---|---|---|
| 1 | **🟠 TINGGI** | **Tidak ada responsive mobile sidebar** | Sidebar menggunakan `hidden md:block` — pada layar mobile sidebar menghilang TANPA hamburger menu alternatif. Navigasi mobile mustahil. |
| 2 | **🟠 TINGGI** | **Content layout background green solid** | `(content)/layout.tsx` menerapkan `bg-[#228B22]` hijau solid yang membuat teks hitam/gelap di beberapa halaman children sulit dibaca. |
| 3 | **🟡 SEDANG** | **Dark mode tidak fungsional** | CSS variable `.dark` ada tapi nilainya hampir identik dengan `:root`. Tidak ada toggle dark mode di UI. |
| 4 | **🟡 SEDANG** | **Bahasa campuran** | Beberapa bagian UI berbahasa Indonesia ("Buku", "Anggota"), sementara lainnya berbahasa Inggris ("Books Management", "Add New Book", "Select member"). |
| 5 | **🟡 SEDANG** | **Login error menggunakan `alert()`** | Error login ditampilkan menggunakan `alert()` bawaan browser, bukan komponen toast/notification yang lebih estetis. |
| 6 | **🟡 SEDANG** | **Sidebar width inconsistency** | Sidebar width `w-75` (300px) tapi main content `md:ml-64` (256px), menyebabkan konten tertutup sidebar sebagian. |
| 7 | **🟢 RENDAH** | **Tidak ada breadcrumbs** | Navigasi tidak memiliki breadcrumb untuk menunjukkan posisi user dalam hierarki. |
| 8 | **🟢 RENDAH** | **Tidak ada loading states pada halaman** | Halaman server component tidak memiliki Suspense/loading.tsx untuk menampilkan skeleton saat data di-fetch. |

---

## 10. Temuan Bug & Masalah

### 🐛 Bug Teridentifikasi

| # | Severity | Bug | File | Detail |
|---|---|---|---|---|
| 1 | **🔴 KRITIS** | **Inkonsistensi perhitungan denda** | `page.tsx:118` vs `transactions/actions.ts:52` | Dashboard menampilkan denda `× 5000`, tapi server menyimpan `× 500`. Selisih 10 kali lipat! |
| 2 | **🟠 TINGGI** | **Sidebar dan konten overlap** | `layout.tsx` | `w-75` (300px sidebar) vs `md:ml-64` (256px margin) = 44px overlap. |
| 3 | **🟠 TINGGI** | **Tidak ada proteksi delete member yang punya transaksi** | `members/actions.ts:42` | Jika anggota dihapus sementara masih memiliki transaksi aktif, foreign key violation atau orphaned data akan terjadi. |
| 4 | **🟠 TINGGI** | **Tidak ada proteksi delete buku yang sedang dipinjam** | `books/actions.ts:55` | Menghapus buku yang sedang dipinjam akan menyebabkan transaksi menggantung. |
| 5 | **🟡 SEDANG** | **Seeder password tidak berfungsi** | `scripts/seed.ts` | Password yang di-seed adalah hash bcrypt, tetapi autentikasi menggunakan perbandingan plain text. User seeder tidak bisa login kecuali password di DB diubah manual. |
| 6 | **🟡 SEDANG** | **Migrasi SQL tidak sinkron** | `drizzle/` | File migrasi awal tidak mencerminkan schema terbaru. Kolom-kolom baru tidak ter-track di migrasi. |
| 7 | **🟢 RENDAH** | **Typo class CSS** | `page.tsx:54` | `uSppercase` seharusnya `uppercase`. |

---

## 11. Rekomendasi Perbaikan

### 🔴 Prioritas Kritis (Harus Segera)

1. **Implementasi Password Hashing**
   - Install `bcryptjs` atau `argon2`
   - Hash password saat registrasi/seed
   - Gunakan `bcrypt.compare()` di `auth.ts:32`

2. **Perbaiki Inkonsistensi Denda**
   - Seragamkan tarif denda di satu tempat (constant/env variable)
   - Pastikan tampilan dashboard dan server action menggunakan tarif yang sama

3. **Tambahkan Validasi Session di Server Actions**
   - Semua server actions CRUD harus memverifikasi `auth()` sebelum eksekusi
   - Jangan hanya mengandalkan middleware

### 🟠 Prioritas Tinggi (Penting)

4. **Perbaiki Ukuran File Background**
   - Kompres `background.png` (13.8MB → target <500KB)
   - Atau gunakan format WebP/AVIF

5. **Tambahkan Mobile Navigation**
   - Implementasi hamburger menu untuk layar kecil
   - Tambahkan `Sheet`/`Drawer` component dari Radix UI

6. **Perbaiki Sidebar Width**
   - Seragamkan `w-75` dan `md:ml-64` agar tidak overlap

7. **Proteksi Foreign Key pada Delete**
   - Cek transaksi aktif sebelum menghapus buku/anggota
   - Tampilkan pesan error yang jelas

8. **Implementasi Paginasi**
   - Tambahkan pagination pada tabel buku dan anggota
   - Gunakan `LIMIT` dan `OFFSET` pada query

### 🟡 Prioritas Sedang (Peningkatan)

9. **Konsistensi Bahasa UI**
   - Pilih satu bahasa (Bahasa Indonesia lebih sesuai untuk target audience)
   - Terapkan secara konsisten di seluruh aplikasi

10. **Ganti `alert()` dengan Toast Component**
    - Implementasi toast notification untuk feedback user
    - Gunakan library seperti `sonner` atau `react-hot-toast`

11. **Tambahkan Loading States**
    - Buat `loading.tsx` untuk setiap route group
    - Implementasi skeleton screens

12. **Sinkronkan Migrasi Database**
    - Jalankan `drizzle-kit generate` untuk membuat migrasi yang mencakup semua perubahan schema

13. **Centralisasi Konfigurasi Font**
    - Definisikan font di satu tempat (root layout) dan gunakan CSS variable

### 🟢 Prioritas Rendah (Nice-to-Have)

14. **Tambahkan Riwayat Transaksi**
    - Halaman `/transactions` untuk melihat semua riwayat pinjam-kembali
    - Filter berdasarkan status, tanggal, anggota

15. **Export Data**
    - Export data buku/anggota ke Excel/CSV

16. **Notifikasi Keterlambatan**
    - Dashboard alert untuk buku-buku yang sudah melewati due date

17. **Audit Trail / Logging**
    - Catat semua operasi CRUD dengan timestamp dan user ID

18. **Testing**
    - Belum ada unit test atau integration test sama sekali
    - Prioritaskan test untuk logika bisnis (perhitungan denda, stok)

---

## Lampiran

### A. Environment Variables yang Diperlukan

```env
TURSO_DATABASE_URL=libsql://your-db-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token
AUTH_SECRET=your-nextauth-secret
```

### B. Script yang Tersedia

| Script | Command | Keterangan |
|---|---|---|
| Dev Server | `npm run dev` | Jalankan development server |
| Build | `npm run build` | Build untuk produksi |
| Start | `npm run start` | Jalankan production build |
| Lint | `npm run lint` | Jalankan ESLint |
| DB Generate | `npm run db:generate` | Generate migrasi Drizzle |
| DB Push | `npm run db:push` | Push schema ke database |
| DB Studio | `npm run db:studio` | Buka Drizzle Studio (GUI) |
| DB Seed | `npm run db:seed` | Jalankan seeder data dummy |

### C. Jumlah Kode

| Kategori | Jumlah File | ~Total Baris |
|---|---|---|
| Pages (TSX) | 7 | ~470 |
| Components (TSX) | 17 (4 kustom + 13 UI) | ~1,570 |
| Server Actions (TS) | 5 | ~330 |
| Config & Lib (TS) | 7 | ~170 |
| CSS | 1 | ~160 |
| Scripts | 2 | ~210 |
| **TOTAL** | **~39** | **~2,910** |

---

> **Kesimpulan:** Aplikasi e-Perpus merupakan MVP yang fungsional dengan fondasi arsitektur yang baik (Next.js App Router, Drizzle ORM, NextAuth v5). Namun, terdapat beberapa masalah kritis terutama di sisi keamanan (password plain text) dan inkonsistensi logika bisnis (perhitungan denda) yang **harus diperbaiki sebelum digunakan di lingkungan produksi**. Fitur-fitur inti CRUD dan peminjaman/pengembalian sudah berjalan, tetapi perlu penguatan di sisi responsive design, error handling, dan data validation.
