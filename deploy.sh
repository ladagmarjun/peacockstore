#!/usr/bin/env bash
# Deploy Peacock on the VPS. Run as the CloudPanel site user, not root.
set -euo pipefail

cd "$(dirname "$0")"

echo "→ pulling master"
git fetch --prune origin
git reset --hard origin/master

echo "→ installing dependencies"
npm --prefix backend  ci --omit=dev
npm --prefix frontend ci

echo "→ running migrations"
npm run migrate

echo "→ building frontend"
npm run build

echo "→ restarting app"
pm2 restart peacock --update-env

echo "✓ deployed $(git rev-parse --short HEAD)"
