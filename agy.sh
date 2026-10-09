#!/usr/bin/env bash
# ==============================================================================
# 启动 Antigravity CLI (agy) - 自动跳过权限确认并进入交互/继续模式 (-c)
# 用法:
#   ./agy.sh [其他参数...]
# ==============================================================================

set -euo pipefail

# 确保常见安装路径在 PATH 中
export PATH="$HOME/.local/bin:$HOME/.gemini/antigravity-cli/bin:/usr/local/bin:$PATH"

if ! command -v agy >/dev/null 2>&1; then
    echo "[错误] 未找到 agy 命令，请确认已安装 Antigravity CLI 并位于 PATH 中。" >&2
    exit 1
fi

exec agy --dangerously-skip-permissions -c "$@"
