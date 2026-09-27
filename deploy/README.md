# Deploy guide

## Структура сервисов

```
kenku-migrate.service   (oneshot) — drizzle-kit migrate
       ↓ Requires
kenku-server.service    (always restart) — Hono API на порту 3000
       ↓ Requires
kenku-zero-cache.service (always restart) — zero-cache на порту 4848
```

## Первоначальный сетап на VM

```bash
# 1. Создать системного пользователя
sudo useradd -r -m -s /bin/false kenku

# 2. Склонировать репо
sudo git clone https://github.com/your-org/kenku-games /opt/kenku
sudo chown -R kenku:kenku /opt/kenku

# 3. Создать .env (скопировать .env.example и заполнить)
sudo cp /opt/kenku/.env.example /opt/kenku/.env
sudo nano /opt/kenku/.env

# 4. Установить зависимости
cd /opt/kenku && sudo -u kenku pnpm install --frozen-lockfile

# 5. Собрать сервер
sudo -u kenku pnpm --filter @kenku/server build

# 6. Установить systemd units
sudo cp /opt/kenku/deploy/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable kenku-migrate kenku-server kenku-zero-cache
sudo systemctl start kenku-server   # запустит migrate → server → zero-cache по цепочке
```

## Деплой новой версии

```bash
cd /opt/kenku && ./deploy/deploy.sh
# или конкретную ветку:
./deploy/deploy.sh feature/my-branch
```

## Просмотр логов

```bash
# Hono сервер
journalctl -u kenku-server -f

# zero-cache
journalctl -u kenku-zero-cache -f

# Миграции
journalctl -u kenku-migrate --no-pager

# Все сразу
journalctl -u kenku-server -u kenku-zero-cache -u kenku-migrate -f
```

## .env на VM (минимальный набор)

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://api.kenku.me

ZERO_UPSTREAM_DB=postgres://kenku:...@localhost:5432/kenku
ZERO_CVR_DB=postgres://kenku:...@localhost:5432/kenku
ZERO_CHANGE_DB=postgres://kenku:...@localhost:5432/kenku
ZERO_REPLICA_FILE=/var/lib/kenku/zero-replica.db
ZERO_QUERY_URL=http://localhost:3000/api/zero/query
ZERO_MUTATE_URL=http://localhost:3000/api/zero/mutate
ZERO_QUERY_FORWARD_COOKIES=true

FRONTEND_URL=https://kenku.me
VITE_API_URL=https://api.kenku.me
VITE_ZERO_CACHE_URL=https://zero.kenku.me
```

---

## GitHub Actions — автоматический деплой

Workflow `.github/workflows/deploy.yml` запускается при каждом пуше в `main` и SSH-ит на VPS, запуская `deploy.sh`.

### 1. Сгенерировать SSH-ключ (на локальной машине)

```bash
ssh-keygen -t ed25519 -C "github-actions-kenku" -f ~/.ssh/kenku_deploy -N ""
```

Получаем два файла:
- `kenku_deploy` — **приватный ключ** → идёт в GitHub Secret
- `kenku_deploy.pub` — **публичный ключ** → добавляется на VPS

### 2. Добавить публичный ключ на VPS

```bash
ssh-copy-id -i ~/.ssh/kenku_deploy.pub kenku@<VPS_IP>
# или вручную:
cat ~/.ssh/kenku_deploy.pub | ssh kenku@<VPS_IP> "cat >> ~/.ssh/authorized_keys"
```

### 3. Добавить секреты в GitHub

Репозиторий → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Значение |
|--------|---------|
| `VPS_HOST` | IP или домен (`185.x.x.x` или `games.example.com`) |
| `VPS_USER` | `kenku` (или `root` если деплоишь от root) |
| `VPS_SSH_KEY` | Содержимое файла `~/.ssh/kenku_deploy` (весь текст включая `-----BEGIN...`) |
| `VPS_SSH_PORT` | `22` (опционально, если порт нестандартный) |

### 4. Разрешить kenku запускать systemctl без пароля

`deploy.sh` внутри вызывает `sudo systemctl`. Нужно добавить passwordless sudo для конкретных команд:

```bash
# На VPS, от root:
cat > /etc/sudoers.d/kenku-deploy << 'SUDOERS'
kenku ALL=(ALL) NOPASSWD: \
  /bin/systemctl reset-failed kenku-migrate.service, \
  /bin/systemctl start kenku-migrate.service, \
  /bin/systemctl restart kenku-server.service, \
  /bin/systemctl restart kenku-zero-cache.service, \
  /bin/systemctl status kenku-server.service
SUDOERS
chmod 440 /etc/sudoers.d/kenku-deploy
# Проверить что синтаксис правильный:
visudo -c -f /etc/sudoers.d/kenku-deploy
```

### 5. Проверить

```bash
# Локально: сделать любой коммит в main и запушить
git commit --allow-empty -m "chore: test github actions deploy"
git push origin main

# Следить за прогрессом:
# GitHub → репо → Actions → последний workflow run
# На VPS:
tail -f /var/log/kenku-deploy.log
```

### Как выглядит успешный run

```
✓ Deploy via SSH   ~45s
```

Если деплой упал (ошибка сборки, миграция провалилась, healthcheck не прошёл) — workflow помечается как ❌, пуш виден как красный, сервисы остаются на предыдущей версии.
