#!/bin/bash

echo "🗑️ Resetting database..."
rm -f db/custom.db

echo "🔄 Pushing database schema..."
bun run db:push

echo "📋 Seeding database..."
bun prisma/seed.js

echo ""
echo "✅ Database seeded successfully!"
echo "📋 Admin Credentials:"
echo "   Email: admin@kevinbagasputra.com"
echo "   Password: admin123"
echo ""
echo "🚀 Silakan coba login lagi!"
