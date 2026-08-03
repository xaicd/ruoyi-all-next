#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd -- "$APP_ROOT/../.." && pwd)"

SKIP_INIT=false
SKIP_CHECK=false
USE_ROOT_INIT=false
RUN_HEALTH_CHECK=false

for arg in "$@"; do
  case "$arg" in
    --skip-init) SKIP_INIT=true ;;
    --skip-check) SKIP_CHECK=true ;;
    --root-init) USE_ROOT_INIT=true ;;
    -h|--help)
      cat <<'EOF'
    用法：npm run quick-start -- [--skip-init] [--skip-check] [--root-init] [--health-check]

默认行为：
1) 安装依赖（若未安装）
2) 可选执行根仓初始化（--root-init）
3) 启动开发服务器

参数：
  --skip-init   跳过初始化步骤（本地提示或 root-init）
  --skip-check  跳过治理检查
  --root-init   执行仓库根 docker/db 初始化
  --health-check  启动前先执行一次构建+路由/API 冒烟检查
EOF
      exit 0
      ;;
    --health-check) RUN_HEALTH_CHECK=true ;;
    *)
      echo "[ruoyi-all-next] 未知参数: $arg"
      exit 2
      ;;
  esac
done

echo "[ruoyi-all-next] Repo root: $REPO_ROOT"
echo "[ruoyi-all-next] App root: $APP_ROOT"
cd "$APP_ROOT"

if [[ ! -d "$APP_ROOT/node_modules" ]]; then
  echo "[0/4] 安装依赖 npm install"
  npm install
fi

if [[ "$SKIP_INIT" != true ]]; then
  if [[ "$USE_ROOT_INIT" == true ]]; then
    echo "[1/4] 执行 root 初始化 docker/db"
    npm run init:root
  else
    echo "[1/4] 跳过 root 初始化（使用内置 mock/文件存储最小启动）"
    npm run init
  fi
else
  echo "[skip] 已跳过初始化步骤"
fi

if [[ "$SKIP_CHECK" != true ]]; then
  if [[ "$USE_ROOT_INIT" == true ]]; then
    echo "[2/4] 运行 ruoyi 门禁检查"
    npm run check
  else
    echo "[2/4] 跳过治理检查（本地快速启动模式）"
  fi
else
  echo "[skip] 已跳过门禁检查"
fi

if [[ "$RUN_HEALTH_CHECK" == true ]]; then
  echo "[3/5] 执行健康检查"
  npm run health-check
else
  echo "[3/5] 跳过健康检查"
fi

echo "[4/5] 启动开发服务器"
npm run dev
