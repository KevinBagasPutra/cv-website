# 🚀 Panduan Setup Project di Visual Studio Code

## 📋 Prerequisites (Yang Diperlukan)

### **1. Software yang Harus Terinstall:**

#### **A. Editor - Visual Studio Code (VSCode)**
- Download: https://code.visualstudio.com/
- Install dan buka aplikasi

#### **B. Runtime - Node.js atau Bun**

**Option A: Node.js (RECOMMENDED untuk Windows/Mac)**
- Download: https://nodejs.org/
- Versi: **LTS** (Long Term Support) - versi 18.x atau 20.x
- Install dan restart komputer

**Option B: Bun (CEPAT - Alternative Node.js)**
- Download: https://bun.sh/
- Install dan restart komputer
- Note: Bun kompatibel dengan Node.js packages

**C. Git - Version Control**
- Download: https://git-scm.com/downloads
- Install dan setup
- Optional tapi direkomendasikan

---

## 📥 Cara Download Project Files

### **Option 1: Download sebagai ZIP (PALING MUDAH)**

1. Di repository GitHub/project Anda, klik tombol **"Code"**
2. Pilih **"Download ZIP"**
3. Extract file ZIP yang terdownload
4. Extract ke folder di komputer (misal: `C:\Users\Username\Documents\kevin-cv-website`)

### **Option 2: Clone dengan Git (RECOMMENDED)**

```bash
# Buka terminal (Command Prompt, PowerShell, atau Git Bash)
cd Documents
git clone https://github.com/username/kevin-cv-website.git
cd kevin-cv-website
```

### **Option 3: Copy Manual Files**

1. Download/copy semua file dari repository
2. Paste ke folder project di komputer
3. Pastikan semua folder dan file ikut (node_modules tidak perlu)

---

## 🛠️ Setup Project di Visual Studio Code

### **Langkah 1: Buka VSCode**

**Windows:**
- Buka folder project di File Explorer
- Klik kanan → **"Open with Visual Studio Code"**

**Mac/Linux:**
- Buka terminal
- Navigate ke folder project: `cd /path/to/kevin-cv-website`
- Ketik: `code .`

### **Langkah 2: Buka Terminal di VSCode**

**Cara 1: Menu**
- Menu: **Terminal** → **New Terminal**
- Keyboard: `Ctrl` + `` ` `` (backtick di kiri angka 1)

**Cara 2: Command Palette**
- Keyboard: `Ctrl` + `Shift` + `P` (Windows/Linux)
- Keyboard: `Cmd` + `Shift` + `P` (Mac)
- Ketik: `terminal` → Enter

**Cara 3: Tab Bar**
- Klik **"+"** di tab bar untuk buka terminal baru

---

## 💻 Install Dependencies (PENTING!)

### **Jalankan di Terminal VSCode:**

```bash
# Gunakan Node.js
npm install

# ATAU gunakan Bun (lebih cepat)
bun install
```

**Catatan:**
- Proses ini akan download banyak package
- Mungkin memakan waktu 1-5 menit tergantung internet
- Pastikan internet stabil

**Hasil yang diharapkan:**
```
added 1250 packages, and audited 1251 packages in 2m
```

---

## 🗄️ Setup Database

### **Langkah 1: Cek apakah Database Sudah Ada**

```bash
# Cek folder db
ls db/

# Harusnya ada file: custom.db
```

### **Langkah 2: Jika Database TIDAK Ada**

```bash
# Push database schema
bun run db:push

# ATAU jika menggunakan npm
npm run db:push
```

### **Langkah 3: Seed Database (Buat Admin User)**

```bash
# Jalankan seed script
bun prisma/seed.js

# ATAU jika menggunakan npm
npm run db:seed
```

**Hasil yang diharapkan:**
```
Seeding database...
✅ Portfolio seeded
✅ Services seeded
✅ Testimonials seeded
✅ Admin user created
✅ Database seeded successfully!
```

---

## 🚀 Menjalankan Development Server

### **Cara 1: Menggunakan Terminal VSCode (RECOMMENDED)**

```bash
# Jalankan development server
npm run dev
```

**ATAU jika menggunakan Bun:**
```bash
bun run dev
```

**Output yang diharapkan:**
```
▲ Next.js 15.3.5
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000

✓ Starting...
✓ Ready in 3.5s
```

### **Cara 2: Menggunakan VSCode Integrated Terminal**

1. Pastikan terminal di VSCode sudah buka
2. Ketik: `npm run dev`
3. Server akan berjalan

### **Cara 3: Run dan Debug di VSCode**

1. Tekan `F5` di VSCode
2. Atau: Run and Debug → Start Debugging
3. Pilih **"Next.js: debug server-side"**

---

## 🌐 Buka Website di Browser

### **Langkah 1: Buka URL**

```bash
# Akses di browser
http://localhost:3000
```

### **Langkah 2: Test Homepage**

1. Cek website berjalan
2. Scroll ke bawah
3. Cek semua sections: About, Skills, Portfolio, Services, Testimonials

### **Langkah 3: Test Login Admin**

```bash
# Buka login page
http://localhost:3000/login

# Login dengan credentials:
Email: admin@kevinbagasputra.com
Password: admin123
```

---

## 📁 Structure Project yang Akan Terlihat

```
kevin-cv-website/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── login/                # Login page
│   │   └── admin/
│   │       └── dashboard/        # Admin dashboard
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   └── admin/               # CMS components
│   └── lib/
│       └── db.ts                 # Prisma database client
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.js                 # Seed script
├── db/
│   └── custom.db               # SQLite database (auto-generated)
├── public/                     # Static files (images, etc)
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
├── next.config.mjs             # Next.js config
├── .env                       # Environment variables
└── node_modules/              # Installed packages (otomatis)
```

---

## ⚙️ Konfigurasi Tambahan

### **Environment Variables (.env)**

Pastikan file `.env` ada di root project dengan konten:

```env
DATABASE_URL="file:./db/custom.db"
```

**Jika belum ada, buat file baru:**
1. Di VSCode: File → New File
2. Simpan dengan nama: `.env`
3. Paste konten di atas
4. Simpan di root project

---

## 🔨 Troubleshooting

### **Masalah 1: Port 3000 Sudah Dipakai**

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solusi:**
```bash
# Windows - Kill process
npx kill-port 3000

# ATAU ganti port di package.json
# Ubah script "dev" dari "next dev -p 3000"
# menjadi "next dev -p 3001"
```

### **Masalah 2: Database Error**

**Error:**
```
Error: ENOENT: no such file or directory, statx './db/custom.db'
```

**Solusi:**
```bash
# Buat folder db
mkdir -p db

# Push schema
bun run db:push

# Seed database
bun prisma/seed.js
```

### **Masalah 3: Modules Not Found**

**Error:**
```
Module not found: Can't resolve '@/lib/db'
```

**Solusi:**
```bash
# Install dependencies lagi
npm install

# ATAU generate Prisma client
npm run db:generate
```

### **Masalah 4: Build Errors**

**Error:**
```
TypeScript error: Property 'xxx' does not exist on type 'yyy'
```

**Solusi:**
```bash
# Lint project
npm run lint

# Fix TypeScript errors
npm run lint -- --fix
```

### **Masalah 5: Hot Reload Tidak Bekerja**

**Solusi:**
```bash
# Restart development server
# Di terminal, tekan Ctrl + C
# Jalankan lagi: npm run dev
```

---

## 🎯 Workflow Development yang Direkomendasikan

### **1. Setup Awal (ONE TIME)**
```bash
# 1. Clone/download project
git clone https://github.com/username/kevin-cv-website.git

# 2. Masuk ke folder
cd kevin-cv-website

# 3. Install dependencies
npm install
# atau: bun install

# 4. Setup database
npm run db:push

# 5. Seed database
npm run db:seed
```

### **2. Sehari-hari Development**
```bash
# 1. Buka VSCode
code .

# 2. Buka terminal di VSCode (Ctrl + `)

# 3. Jalankan dev server
npm run dev

# 4. Buka browser ke http://localhost:3000

# 5. Edit code di VSCode

# 6. Save changes (Ctrl + S)

# 7. Check browser - otomatis refresh!
```

---

## 🎨 Tips Menggunakan Visual Studio Code

### **Useful Extensions (Recommended)**

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenpetersen.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "usernamehw.errorlens",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### **Keyboard Shortcuts yang Berguna**

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| Open Terminal | `Ctrl` + `` ` `` | `Cmd` + `` ` `` |
| Save File | `Ctrl` + `S` | `Cmd` + `S` |
| Save All | `Ctrl` + `Shift` + `S` | `Cmd` + `Shift` + `S` |
| Close Tab | `Ctrl` + `W` | `Cmd` + `W` |
| Reopen Tab | `Ctrl` + `Shift` + `T` | `Cmd` + `Shift` + `T` |
| Toggle Sidebar | `Ctrl` + `B` | `Cmd` + `B` |
| Find | `Ctrl` + `F` | `Cmd` + `F` |
| Replace | `Ctrl` + `H` | `Cmd` + `H` |
| Format Document | `Shift` + `Alt` + `F` | `Shift` + `Option` + `F` |

### **VSCode Terminal Tips**

```bash
# Multiple terminals
# Tekan "+" di terminal tab bar

# Split terminal
# Klik kanan terminal → "Split Terminal Right/Down"

# Clear terminal
# Tekan ikon trash di terminal
# atau ketik: clear

# Stop server
# Tekan Ctrl + C
```

---

## 📚 Dokumentasi Tambahan

### **File-file Penting untuk Dipelajari**

1. **`package.json`** - Scripts dan dependencies
   ```bash
   npm run dev      # Start development server
   npm run build     # Build for production
   npm run start     # Run production build
   npm run lint      # Lint code
   npm run db:push   # Push database schema
   npm run db:seed   # Seed database
   ```

2. **`.env`** - Environment variables
   ```env
   DATABASE_URL="file:./db/custom.db"
   ```

3. **`next.config.mjs`** - Next.js configuration
   - Image domains
   - Rewrites
   - Environment variables

4. **`tailwind.config.ts`** - Tailwind CSS configuration
   - Custom colors
   - Theme customization

---

## ✅ Checklist Sebelum Memulai

- [ ] **Visual Studio Code terinstall**
- [ ] **Node.js/Bun terinstall**
- [ ] **Git terinstall (opsional)**
- [ ] **Project files didownload/copied**
- [ ] **Project dibuka di VSCode**
- [ ] **Terminal di VSCode dibuka**
- [ ] **Dependencies diinstall** (`npm install`)
- [ ] **Database di-push** (`npm run db:push`)
- [ ] **Database di-seed** (`npm run db:seed`)
- [ ] **Dev server dijalankan** (`npm run dev`)
- [ ] **Website dibuka di browser** (`http://localhost:3000`)
- [ ] **Login admin berhasil** (admin@kevinbagasputra.com / admin123)

---

## 🎉 Summary

### **YES, Anda cukup:**
1. ✅ Download semua file project
2. ✅ Buka di Visual Studio Code
3. ✅ Jalankan `npm run dev` di terminal

### **TAPI, sebelum itu, perlu:**
1. ⚠️ **Install dependencies** (`npm install`)
2. ⚠️ **Setup database** (`npm run db:push` dan `npm run db:seed`)

### **Setelah setup selesai, semua akan berjalan dengan sempurna!** 🚀

---

## 💡 Quick Start Commands (Copy & Paste)

```bash
# Di terminal VSCode, ketik satu per satu:

# 1. Install dependencies
npm install

# 2. Push database schema
npm run db:push

# 3. Seed database
npm run db:seed

# 4. Start development server
npm run dev

# 5. Buka browser
# http://localhost:3000
```

---

## 🆘 Jika Butuh Bantuan

### **Cara Cek Version Node.js:**
```bash
node --version
```

### **Cara Cek Version NPM:**
```bash
npm --version
```

### **Reinstall Semua Dependencies (Jika Error):**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Reset Lengkap Project:**
```bash
# Hapus node_modules dan lock
rm -rf node_modules package-lock.json

# Hapus database (akan di-seed ulang)
rm -f db/custom.db

# Install dependencies
npm install

# Setup database
npm run db:push
npm run db:seed

# Start server
npm run dev
```

---

**Selamat mengembangkan project di Visual Studio Code!** 🎊

### **Login Credentials:**
- Email: `admin@kevinbagasputra.com`
- Password: `admin123`

### **Local URL:**
- Homepage: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Admin Dashboard: `http://localhost:3000/admin/dashboard`
