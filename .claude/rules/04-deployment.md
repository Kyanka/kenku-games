# Rule 04 — Deployment

## Overview

The app runs on a single Linux VPS. Services are managed by **systemd**, reverse proxy by **Caddy**.

### Service chain

```
kenku-migrate.service  (oneshot — runs drizzle migrations)
        ↓ requires
kenku-server.service   (Hono API + auth)
        ↓ requires
kenku-zero-cache.service  (Zero cache, syncs DB to clients)
```

Both `kenku-server` and `kenku-zero-cache` restart automatically on failure (`Restart=always, RestartSec=5`).

---

## First-time VM setup

```bash
# 1. Create app user
useradd -m -s /bin/bash kenku

# 2. Install Node + pnpm
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
corepack enable && corepack prepare pnpm@latest --activate

# 3. Clone repo
git clone https://github.com/your-org/kenku-games.git /opt/kenku-games
chown -R kenku:kenku /opt/kenku-games

# 4. Copy .env
cp /opt/kenku-games/deploy/.env.example /opt/kenku-games/.env
# Fill in DB_URL, AUTH_SECRET, ZERO_AUTH_SECRET, etc.

# 5. Install Caddy
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install caddy

# 6. Copy Caddyfile
cp /opt/kenku-games/deploy/Caddyfile /etc/caddy/Caddyfile
systemctl reload caddy

# 7. Install systemd units
cp /opt/kenku-games/deploy/*.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable kenku-migrate kenku-server kenku-zero-cache

# 8. First deploy
cd /opt/kenku-games && ./deploy/deploy.sh
```

---

## Caddy config (`deploy/Caddyfile`)

```caddyfile
games.example.com {
    # Frontend (built static files)
    root * /opt/kenku-games/apps/web/dist
    file_server

    # API
    handle /api/* {
        reverse_proxy localhost:3000
    }

    # Zero cache WebSocket + HTTP
    handle /zero/* {
        reverse_proxy localhost:4848
    }

    # SPA fallback
    try_files {path} /index.html
}
```

---

## Deploy script (`deploy/deploy.sh`)

What it does on each deploy:

1. `git pull origin main`
2. `pnpm install --frozen-lockfile`
3. Build server: `pnpm --filter @kenku/server build`
4. Build web: `pnpm --filter @kenku/web build`
5. Run migrations: `systemctl reset-failed kenku-migrate && systemctl start kenku-migrate`
6. Restart server: `systemctl restart kenku-server`
7. Restart zero-cache: `systemctl restart kenku-zero-cache`
8. Healthcheck loop on `/healthz` (max 30 s)

---

## Useful commands

```bash
# Logs (live)
journalctl -u kenku-server -f
journalctl -u kenku-zero-cache -f

# Status
systemctl status kenku-migrate kenku-server kenku-zero-cache

# Manual migration only
systemctl reset-failed kenku-migrate && systemctl start kenku-migrate

# Full restart
systemctl restart kenku-server kenku-zero-cache
```

---

## Environment variables (`.env` on the VPS)

| Variable             | Purpose                                |
| -------------------- | -------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string           |
| `BETTER_AUTH_SECRET` | Auth session signing key               |
| `ZERO_AUTH_SECRET`   | JWT secret for Zero auth tokens        |
| `ZERO_UPSTREAM_DB`   | Postgres URL for zero-cache            |
| `ZERO_QUERY_URL`     | `http://localhost:3000/api/zero/query` |
| `ZERO_CVR_DB_URL`    | Postgres URL for CVR store             |
| `ZERO_CHANGE_DB_URL` | Postgres URL for change log            |
| `NODE_ENV`           | `production`                           |
| `PORT`               | `3000` (Hono server)                   |

---

## GitHub Actions — CI/CD

Workflow `.github/workflows/deploy.yml` автоматически деплоит при пуше в `main`.

### Как работает

```
push → main
   ↓
GitHub Actions runner (ubuntu-latest)
   ↓ SSH (appleboy/ssh-action@v1)
VPS: cd /opt/kenku-games && ./deploy/deploy.sh main
   ↓
deploy.sh: pull → install → build → migrate → restart → healthcheck
```

### Необходимые GitHub Secrets

| Secret         | Что содержит                            |
| -------------- | --------------------------------------- |
| `VPS_HOST`     | IP или домен VPS                        |
| `VPS_USER`     | SSH-пользователь (`kenku`)              |
| `VPS_SSH_KEY`  | Приватный ed25519 ключ (без passphrase) |
| `VPS_SSH_PORT` | SSH-порт (обычно `22`)                  |

### Требования на VPS

1. Публичный ключ в `~kenku/.ssh/authorized_keys`
2. Passwordless sudo для systemctl команд деплоя (`/etc/sudoers.d/kenku-deploy`)

Полная инструкция по первоначальной настройке — в `deploy/README.md`.

### Дебаг

```bash
# Лог деплоя на VPS
tail -f /var/log/kenku-deploy.log

# История runs в GitHub
# Репо → Actions → Deploy to VPS
```
