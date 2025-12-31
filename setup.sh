#!/bin/bash

# ========================================
# Setup Project Kevin Bagas Putra CV
# Mac/Linux (Node.js/Bun)
# ========================================

echo ""
echo "========================================"
echo "  SETUP PROJECT KEVIN BAGAS PUTRA"
echo "========================================"
echo ""

# Check Node.js or Bun
echo "[1/7] Checking runtime..."
if command -v bun &> /dev/null; then
    RUNTIME="bun"
    INSTALL_CMD="bun install"
    echo "✅ Bun terinstall (${RUNTIME})"
elif command -v node &> /dev/null; then
    RUNTIME="node"
    INSTALL_CMD="npm install"
    echo "✅ Node.js terinstall (${RUNTIME})"
else
    echo "❌ Tidak ada runtime terinstall!"
    echo ""
    echo "Silakan install salah satu:"
    echo "  - Bun: https://bun.sh/"
    echo "  - Node.js: https://nodejs.org/"
    echo ""
    echo "Pilih versi LTS (Long Term Support)"
    exit 1
fi
echo ""

# Check Git
echo "[2/7] Checking Git..."
if command -v git &> /dev/null; then
    echo "✅ Git terinstall"
else
    echo "⚠️  Git tidak terinstall (opsional)"
    echo ""
    echo "Untuk fitur version control, download Git dari:"
    echo "  https://git-scm.com/downloads"
fi
echo ""

# Install Dependencies
echo "[3/7] Installing dependencies..."
$INSTALL_CMD
if [ $? -ne 0 ]; then
    echo "❌ Gagal install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Create db directory if needed
echo "[4/7] Setting up database..."
if [ ! -d "db" ]; then
    mkdir -p db
    echo "✅ Created db directory"
fi

# Push Database Schema
echo "[5/7] Pushing database schema..."
if [ "$RUNTIME" = "bun" ]; then
    bun run db:push
else
    npm run db:push
fi

if [ $? -ne 0 ]; then
    echo "❌ Gagal push database schema"
    exit 1
fi
echo "✅ Database schema pushed"
echo ""

# Seed Database
echo "[6/7] Seeding database..."
if [ "$RUNTIME" = "bun" ]; then
    bun prisma/seed.js
else
    npm run db:seed
fi

if [ $? -ne 0 ]; then
    echo "❌ Gagal seed database"
    exit 1
fi
echo "✅ Database seeded successfully"
echo ""

# Display Success Message
echo ""
echo "========================================"
echo "      ✅ SETUP SELESAI!"
echo "========================================"
echo ""
echo "📋 Admin Credentials:"
echo "   ├─ Email:    admin@kevinbagasputra.com"
echo "   └─ Password: admin123"
echo ""
echo "🌐 Local URLs:"
echo "   ├─ Homepage: http://localhost:3000"
echo "   ├─ Login:    http://localhost:3000/login"
echo "   └─ Dashboard: http://localhost:3000/admin/dashboard"
echo ""
echo "🚀 To start development server:"
echo "   └─ $RUNTIME run dev"
echo ""
echo "📂 Or open in VSCode:"
echo "   └─ code ."
echo ""

# Ask to start server
read -p "Apakah Anda ingin memulai development server sekarang? (y/n) " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting development server..."
    echo ""
    $RUNTIME run dev
else
    echo ""
    echo "✅ Setup selesai! Anda bisa memulai server kapan saja dengan:"
    echo "   $RUNTIME run dev"
    echo ""
fi
