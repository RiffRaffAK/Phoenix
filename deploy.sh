#!/usr/bin/env bash
# Phoenix Wolf Systems V9 — One-command deployment script
# Usage: bash deploy.sh
set -e

echo "🔮 Phoenix Wolf Systems V9 — Deployment"
echo "========================================"

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Install Node 18+ from https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -e "process.stdout.write(process.versions.node)")
echo "✅ Node.js $NODE_VERSION"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --production

# Create .env if not present
if [ ! -f .env ]; then
  cp .env.example .env
  # Generate a random JWT secret
  JWT_SECRET=$(node -e "process.stdout.write(require('crypto').randomBytes(48).toString('hex'))")
  sed -i "s/your-very-long-random-secret-here-change-me/$JWT_SECRET/" .env 2>/dev/null || true
  echo "✅ Created .env with generated JWT secret"
  echo "⚠️  Edit .env to configure GitHub token and other settings"
fi

echo ""
echo "✅ Dependencies installed"
echo "✅ Configuration ready"
echo ""
echo "🚀 Starting Phoenix Wolf Systems V9..."
echo "   URL: http://localhost:${PORT:-3000}"
echo ""
node server.js
