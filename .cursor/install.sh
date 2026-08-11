#!/usr/bin/env bash
# Idempotent dependency + local-config bootstrap for the nelan.dev MERN app.
# Runs after the repository is checked out. Safe to run multiple times.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Local (gitignored) env files for development. Only created if missing so
# developer overrides are preserved across reruns.
if [ ! -f server/.env ]; then
  cp .cursor/server.env.example server/.env
  echo "Created server/.env from template"
fi

if [ ! -f client/.env.development ]; then
  cp .cursor/client.env.example client/.env.development
  echo "Created client/.env.development from template"
fi

# Install dependencies using the committed lockfiles.
( cd server && npm ci --no-audit --no-fund )
( cd client && npm ci --no-audit --no-fund )

# Verify the server TypeScript compiles.
( cd server && npm run build )

echo "install.sh complete"
