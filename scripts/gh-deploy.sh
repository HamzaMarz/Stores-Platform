#!/usr/bin/env bash
set -euo pipefail

# Configuration
REPO_DIR="/home/ubuntu/Stores-Platform"
FRONTEND_DIR="$REPO_DIR/frontend"
ADMIN_DIR="$REPO_DIR/admin-frontend"
BACKEND_DIR="$REPO_DIR/backend"

WEB_ROOT_MAIN="/etc/www/stores-platform/main"
WEB_ROOT_ADMIN="/etc/www/stores-platform/admin"

PM2_BACKEND_NAME="stores-platform-backend"

log() { echo "[deploy] $(date '+%Y-%m-%d %H:%M:%S') $*"; }

cd "$REPO_DIR"
log "Switched to repo directory: $(pwd)"

# Ensure git can use token for pulls
if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  GIT_URL=$(git config --get remote.origin.url || true)
  if [[ "$GIT_URL" == https://* ]]; then
    CLEAN_URL=${GIT_URL#https://}
    git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@${CLEAN_URL}"
  fi
fi

# Save current HEAD before pulling
PREV_HEAD=$(git rev-parse HEAD)

log "Pulling latest changes"
git fetch --all --prune
git reset --hard origin/main

POST_HEAD=$(git rev-parse HEAD)
if [[ "$PREV_HEAD" == "$POST_HEAD" ]]; then
  log "No changes detected; exiting."
  exit 0
fi

# Determine changed top-level dirs between commits
CHANGED_DIRS=$(git diff --name-only "$PREV_HEAD" "$POST_HEAD" | awk -F/ '{print $1}' | sort -u)
log "Changed top-level dirs: $CHANGED_DIRS"

changed_backend=false
changed_frontend=false
changed_admin=false
for dir in $CHANGED_DIRS; do
  case "$dir" in
    backend) changed_backend=true ;;
    frontend) changed_frontend=true ;;
    admin-frontend) changed_admin=true ;;
  esac
done

# Backend deploy (PM2 restart)
if [[ "$changed_backend" == true ]]; then
  log "Backend changes detected; reinstall and restart PM2 app"
  cd "$BACKEND_DIR"
  npm ci --omit=dev
  if pm2 describe "$PM2_BACKEND_NAME" >/dev/null 2>&1; then
    pm2 stop "$PM2_BACKEND_NAME" || true
    pm2 delete "$PM2_BACKEND_NAME" || true
  fi
  pm2 start index.js --name "$PM2_BACKEND_NAME"
  pm2 save
fi

# Frontend build and deploy to WEB_ROOT_MAIN
if [[ "$changed_frontend" == true ]]; then
  log "Frontend changes detected; building and deploying"
  cd "$FRONTEND_DIR"
  npm ci
  npm run build
  mkdir -p "$WEB_ROOT_MAIN"
  rm -rf "$WEB_ROOT_MAIN"/*
  rsync -a --delete "$FRONTEND_DIR/dist/" "$WEB_ROOT_MAIN/"
fi

# Admin frontend build and deploy to WEB_ROOT_ADMIN
if [[ "$changed_admin" == true ]]; then
  log "Admin frontend changes detected; building and deploying"
  cd "$ADMIN_DIR"
  npm ci
  npm run build
  mkdir -p "$WEB_ROOT_ADMIN"
  rm -rf "$WEB_ROOT_ADMIN"/*
  rsync -a --delete "$ADMIN_DIR/dist/" "$WEB_ROOT_ADMIN/"
fi

sleep 5

# Notify API (after small delay to ensure server is back up)
NOTIFY_URL="http://localhost:4001/api/v1/deploy/notify"
curl -sS -X POST "$NOTIFY_URL" \
  -H "Content-Type: application/json" \
  -d "{\"changed_backend\":$changed_backend,\"changed_frontend\":$changed_frontend,\"changed_admin\":$changed_admin,\"prev_head\":\"$PREV_HEAD\",\"post_head\":\"$POST_HEAD\"}" || true

log "Deploy finished"


