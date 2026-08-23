#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
MODE="${1:-dev}"
COMPOSE=(docker compose -f deploy/docker-compose.dev.yml)

usage() {
  cat <<'EOF'
Usage: ./start.sh [dev|infra|app|docker|memory|status|stop]
  dev     Default. Start PostgreSQL + Redis, migrate and seed the local bootstrap administrator, then run Next.js.
  infra   Start PostgreSQL:5433 and Redis:6380, then migrate and seed the local bootstrap administrator.
  app     Run Next.js only, using .env.local.
  docker  Start infrastructure, migrate, then build and start the app container.
  memory  Run Next.js with in-memory persistence and no Redis.
  status  Show dev Docker services.
  stop    Stop project dev Docker services without deleting volumes.
EOF
}

require_tools() { command -v docker >/dev/null || { echo '[ERROR] Docker is required.' >&2; exit 1; }; command -v npm >/dev/null || { echo '[ERROR] Node.js and npm are required.' >&2; exit 1; }; }
infra() { require_tools; echo '[STEP] Starting PostgreSQL (5433) and Redis (6380)...'; "${COMPOSE[@]}" up -d --wait postgres redis; echo '[STEP] Generating Prisma client, applying migrations, seeding and backing up development data...'; npm run db:generate; npm run db:migrate; npm run db:seed; npm run db:backup; echo '[OK] Infrastructure is ready; use ADMIN_BOOTSTRAP_USERNAME and ADMIN_BOOTSTRAP_PASSWORD from .env.local.'; }

app() { command -v npm >/dev/null || { echo '[ERROR] Node.js and npm are required.' >&2; exit 1; }; echo '[INFO] Starting Next.js at http://localhost:3100'; exec npm run dev; }
memory() { command -v npm >/dev/null || { echo '[ERROR] Node.js and npm are required.' >&2; exit 1; }; echo '[INFO] Starting in-memory mode at http://localhost:3100'; DB_DRIVER=memory DATABASE_URL=memory://ruoyi-all-next REDIS_URL= exec npm run dev; }

case "$MODE" in
  dev) infra; app ;;
  infra) infra ;;
  app) app ;;
  docker) infra; echo '[STEP] Building and starting the Docker app at http://localhost:3100...'; "${COMPOSE[@]}" up -d --build app ;;
  memory) memory ;;
  status) "${COMPOSE[@]}" ps ;;
  stop) echo '[STEP] Stopping project Docker services; volumes are preserved.'; "${COMPOSE[@]}" down ;;
  help|-h|--help) usage ;;
  *) echo "[ERROR] Unknown mode: $MODE" >&2; usage; exit 2 ;;
esac
