#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. In Termux run: pkg install -y nodejs-lts"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Install nodejs-lts in Termux first."
  exit 1
fi

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example."
  echo "Open .env.local and add only your own local/hosting environment values. Never share private keys in chat."
fi

if [ ! -d node_modules ]; then
  npm install --no-package-lock
fi

npm run dev:termux
