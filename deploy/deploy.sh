#!/usr/bin/env bash
# deploy.sh — pull latest code, build, migrate, restart services
# Run as a user with sudo rights or as root.
#
# Usage: ./deploy/deploy.sh [branch]
# Default branch: main
#
# First-time setup:
#   sudo useradd -r -s /bin/false kenku
#   sudo mkdir -p /opt/kenku && sudo chown kenku:kenku /opt/kenku
#   # Clone repo to /opt/kenku, copy .env, then run this script.
#   sudo cp deploy/*.service /etc/systemd/system/
#   sudo systemctl daemon-reload
#   sudo systemctl enable kenku-migrate kenku-server kenku-zero-cache

set -euo pipefail

BRANCH="${1:-main}"
DEPLOY_DIR="/opt/kenku-games"
LOG_TAG="kenku-deploy"

log() { echo "[$(date '+%H:%M:%S')] $*"; }

log "=== Deploy started (branch: $BRANCH) ==="

cd "$DEPLOY_DIR"

log "Pulling latest from origin/$BRANCH..."
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

log "Installing dependencies..."
pnpm install --frozen-lockfile

log "Building server..."
pnpm --filter @kenku/server build

log "Running migrations..."
# kenku-migrate.service is a oneshot — reset it so systemd runs it again
sudo systemctl reset-failed kenku-migrate.service 2>/dev/null || true
sudo systemctl start kenku-migrate.service

log "Restarting services..."
sudo systemctl restart kenku-server.service
sudo systemctl restart kenku-zero-cache.service

log "Waiting for server to be healthy..."
for i in $(seq 1 15); do
  if curl -sf http://localhost:3000/healthz > /dev/null; then
    log "Server is healthy ✓"
    break
  fi
  sleep 2
done

log "=== Deploy finished ==="
sudo systemctl status kenku-server.service --no-pager -l | tail -5
