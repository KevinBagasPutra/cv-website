@echo off
REM ========================================
REM Setup Project Kevin Bagas Putra CV
REM Windows (Node.js)
REM ========================================

echo.
echo ========================================
echo   SETUP PROJECT KEVIN BAGAS PUTRA
echo ========================================
echo.

REM Check Node.js
echo [1/7] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js tidak terinstall!
    echo.
    echo Silakan download Node.js dari:
    echo https://nodejs.org/
    echo.
    echo Pilih versi LTS (Long Term Support)
    pause
    exit /b 1
)
echo ✅ Node.js terinstall
echo.

REM Check Git
echo [2/7] Checking Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Git tidak terinstall (opsional)
    echo.
    echo Untuk fitur version control, download Git dari:
    echo https://git-scm.com/downloads
) else (
    echo ✅ Git terinstall
)
echo.

REM Install Dependencies
echo [3/7] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Gagal install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

REM Setup Database
echo [4/7] Setting up database...
if not exist "db" mkdir db
call npm run db:push
if %errorlevel% neq 0 (
    echo ❌ Gagal push database schema
    pause
    exit /b 1
)
echo ✅ Database schema pushed
echo.

REM Seed Database
echo [5/7] Seeding database...
call npm run db:seed
if %errorlevel% neq 0 (
    echo ❌ Gagal seed database
    pause
    exit /b 1
)
echo ✅ Database seeded successfully
echo.

REM Display Admin Credentials
echo.
echo ========================================
echo   ✅ SETUP SELESAI!
echo ========================================
echo.
echo   📋 Admin Credentials:
echo   ├─ Email:    admin@kevinbagasputra.com
echo   └─ Password: admin123
echo.
echo   🌐 Local URLs:
echo   ├─ Homepage: http://localhost:3000
echo   ├─ Login:    http://localhost:3000/login
echo   └─ Dashboard: http://localhost:3000/admin/dashboard
echo.
echo   🚀 Untuk memulai development server:
echo   └─ Ketik: npm run dev
echo.
echo   📂 Atau buka project di Visual Studio Code:
echo   └─ Double klik file ini atau ketik: code .
echo.

REM Ask to start server
echo.
set /p start="Apakah Anda ingin memulai development server sekarang? (y/n) "
if /i "%start%"=="y" (
    echo.
    echo 🚀 Starting development server...
    echo.
    call npm run dev
) else (
    echo.
    echo ✅ Setup selesai! Anda bisa memulai server kapan saja dengan:
    echo    npm run dev
    echo.
    pause
)
