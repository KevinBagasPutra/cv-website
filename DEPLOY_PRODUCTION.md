# 🚀 Production Deploy & Database Seeding Guide

## 🔍 Masalah: Login Gagal di Production

**Gejala:**
- Login berhasil di localhost (http://localhost:3000)
- Login GAGAL di production (https://kevinbagasputra.space.z.ai)
- Error: "Email atau password salah"

**Penyebab:**
- Database production bersih (kosong)
- Admin user tidak ada di database production
- Seed script belum dijalankan di production

---

## ✅ Solusi: Jalankan Database Seed di Production

### **Langkah 1: SSH ke Server Production**

```bash
ssh username@server-ip
```

### **Langkah 2: Masuk ke Project Directory**

```bash
cd /path/to/your-project
```

### **Langkah 3: Reset Database dan Seed**

**Option A: Menggunakan Script Otomatis**
```bash
chmod +x reset-and-seed.sh
./reset-and-seed.sh
```

**Option B: Manual Step by Step**

```bash
# 1. Hapus database lama
rm -f db/custom.db

# 2. Push schema ke database
bun run db:push

# 3. Seed database dengan data awal
bun prisma/seed.js
```

### **Langkah 4: Restart Aplikasi**

```bash
# Jika menggunakan PM2
pm2 restart my-project

# Jika menggunakan Systemd
sudo systemctl restart my-project

# Jika menggunakan Docker
docker-compose restart web
```

---

## 🔧 Solusi Alternatif: Tambahkan API Endpoint untuk Seed

Buat file baru: `/src/app/api/seed-db/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Only allow seeding with secret key
    const body = await request.json()
    const { secretKey } = body

    if (secretKey !== process.env.SEED_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid seed secret.' },
        { status: 401 }
      )
    }

    // Check if admin user already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: 'admin@kevinbagasputra.com' }
    })

    if (existingAdmin) {
      // Update password if needed
      if (existingAdmin.password !== 'admin123') {
        await db.user.update({
          where: { email: 'admin@kevinbagasputra.com' },
          data: {
            password: 'admin123',
            updatedAt: new Date()
          }
        })
      }
      return NextResponse.json({
        message: 'Admin user sudah ada',
        action: 'Password updated jika diperlukan'
      })
    }

    // Create admin user
    const adminUser = await db.user.create({
      data: {
        email: 'admin@kevinbagasputra.com',
        name: 'Kevin Bagas Putra',
        password: 'admin123',
        role: 'admin'
      }
    })

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    })
  } catch (error) {
    console.error('Seed database error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
```

**Cara Menggunakan:**

```bash
# Tambahkan SECRET KEY ke .env
echo "SEED_SECRET_KEY=your-super-secret-key-here-2025" >> .env

# Jalankan API untuk seed
curl -X POST https://kevinbagasputra.space.z.ai/api/seed-db \
  -H "Content-Type: application/json" \
  -d '{"secretKey":"your-super-secret-key-here-2025"}'
```

---

## 🎯 Langkah-Langkah Deploy Complete

### **1. Push Code ke GitHub**

```bash
git add .
git commit -m "fix: Add production database seeding support"
git push origin master
```

### **2. Deploy ke Production**

```bash
# Jika menggunakan Vercel
vercel --prod

# Jika menggunakan deploy.sh atau CI/CD
./deploy.sh
```

### **3. SSH ke Production Server**

```bash
ssh username@server-ip
```

### **4. Pull Latest Code**

```bash
cd /path/to/your-project
git pull origin master
```

### **5. Install Dependencies (jika diperlukan)**

```bash
bun install
```

### **6. Generate Prisma Client**

```bash
bun run db:generate
```

### **7. Push Database Schema**

```bash
bun run db:push
```

### **8. Seed Database**

**Option A: Otomatis**
```bash
bun prisma/seed.js
```

**Option B: Using API ( jika dibuat)**
```bash
curl -X POST https://kevinbagasputra.space.z.ai/api/seed-db \
  -H "Content-Type: application/json" \
  -d '{"secretKey":"your-secret-key"}'
```

### **9. Restart Application**

```bash
# PM2
pm2 restart my-project

# Atau Systemd
sudo systemctl restart my-project

# Atau Docker
docker-compose restart
```

### **10. Test Login**

Buka: https://kevinbagasputra.space.z.ai/login
Email: admin@kevinbagasputra.com
Password: admin123

---

## 📋 Checklist Deploy

- [ ] SSH ke production server
- [ ] Pull latest code from GitHub
- [ ] Install dependencies (bun install)
- [ ] Generate Prisma client (bun run db:generate)
- [ ] Push database schema (bun run db:push)
- [ ] Seed database (bun prisma/seed.js)
- [ ] Restart application
- [ ] Test login di production

---

## 🛡️ Security Notes

### **⚠️ TIDAK ADA di Production:**
1. ❌ Password plaintext (sekarang admin123)
2. ❌ Seed endpoint tanpa secret key (jika dibuat)
3. ❌ Login tanpa rate limiting
4. ❌ Admin access tanpa 2FA

### **✅ SEBAIKNYA di Production:**
1. ✅ Gunakan bcrypt untuk password hashing
2. ✅ Implement NextAuth.js atau JWT
3. ✅ Tambahkan rate limiting ke login
4. ✅ Implement 2FA (Two-Factor Authentication)
5. ✅ Gunakan environment variables untuk secrets
6. ✅ SSL/HTTPS sudah aktif

---

## 🔨 Implementasi Password Hashing (Bcrypt)

### **1. Install bcrypt**

```bash
bun add bcrypt
bun add -d @types/bcrypt
```

### **2. Update Prisma Schema**

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   // Hashed password
  role      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### **3. Update Seed Script**

```javascript
const bcrypt = require('bcrypt')
const saltRounds = 10

// Hash password
const hashedPassword = await bcrypt.hash('admin123', saltRounds)

// Create user with hashed password
await prisma.user.create({
  data: {
    email: 'admin@kevinbagasputra.com',
    name: 'Kevin Bagas Putra',
    password: hashedPassword, // Store hashed password
    role: 'admin'
  }
})
```

### **4. Update Login API**

```typescript
import bcrypt from 'bcrypt'

// Hash input password
const isMatch = await bcrypt.compare(password, user.password)

if (!isMatch) {
  return NextResponse.json(
    { error: 'Email atau password salah' },
    { status: 401 }
  )
}
```

---

## 🚨 Troubleshooting

### **Jika Login Masih Gagal:**

**1. Cek Database**
```bash
cd /path/to/your-project
bun check_db.js
```

**2. Cek Logs Aplikasi**
```bash
# PM2 logs
pm2 logs my-project --lines 50

# Atau docker logs
docker-compose logs -f --tail=50
```

**3. Cek Environment Variables**
```bash
cat .env | grep DATABASE_URL
```

**4. Reset Database Lengkap**
```bash
rm -f db/custom.db
bun run db:push
bun prisma/seed.js
pm2 restart my-project
```

**5. Cek Firewall**
```bash
# Pastikan port 3000 (atau port yang digunakan) tidak diblokir
sudo ufw status
```

---

## 📞 Support

Jika masih mengalami masalah setelah mengikuti panduan ini:

1. Cek error logs di production server
2. Pastikan environment variables sudah benar
3. Pastikan database file ada dan bisa diakses
4. Pastikan Prisma client sudah di-generate
5. Restart server setelah perubahan

---

## 🎉 Summary

Masalah utamanya adalah **database production belum memiliki admin user**.

Solusi: **Jalankan seed script di production server** setelah deploy.

Admin credentials yang akan dibuat:
- **Email:** admin@kevinbagasputra.com
- **Password:** admin123

Setelah seeding selesai, login akan berfungsi dengan benar di production!
