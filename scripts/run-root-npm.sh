#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "用法: bash ./scripts/run-root-npm.sh <npm-script> [args...]"
  exit 2
fi

SCRIPT_NAME="$1"
shift || true

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd -- "$APP_ROOT/../.." && pwd)"

cd "$REPO_ROOT"

if [[ $# -gt 0 ]]; then
  npm run "$SCRIPT_NAME" -- "$@"
else
  npm run "$SCRIPT_NAME"
fi
