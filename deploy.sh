#!/usr/bin/env bash
# Deploy Peacock on the VPS. Run as the CloudPanel site user, not root.
set -euo pipefail

# A non-interactive SSH session (what CI gets) does not source ~/.bashrc, so an
# nvm-installed node/npm is absent from PATH and every command exits 127.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" --no-use && nvm use --lts >/dev/null

export PATH="$HOME/.npm-global/bin:/usr/local/bin:$PATH"

command -v npm >/dev/null || { echo "npm not on PATH"; exit 127; }

cd "$(dirname "$0")"

echo "→ installing dependencies"
npm --prefix backend  ci --omit=dev
npm --prefix frontend ci

echo "→ running migrations"
npm run migrate

echo "→ building frontend"
npm run build

echo "→ restarting app"
sudo -n systemctl restart peacock

echo "✓ deployed $(git rev-parse --short HEAD)"
