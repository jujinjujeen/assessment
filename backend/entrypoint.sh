#!/usr/bin/env sh
set -e

npx prisma generate
npx prisma migrate deploy

if npx tsx ./prisma/seed-check.ts; then
  echo "✅ Data already present; skipping seed."
else
  echo "👉 No existing data found; running seed script..."
  npx prisma db seed
fi

if [ "$NODE_ENV" = "production" ]; then
  npm run build
  ls -la
  ls -la dist
  exec npm run serve
else
  exec npm run dev
fi