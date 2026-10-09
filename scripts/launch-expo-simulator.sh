#!/usr/bin/env bash
# scripts/launch-expo-simulator.sh [list|boot <device_id>|open-sim]
#
# Helper script to manage macOS host simulators from the container sandbox.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST_EXEC="$SCRIPT_DIR/host-exec.sh"

ACTION="${1:-list}"

case "$ACTION" in
  list)
    echo "=== 宿主机可用 iOS 模拟器设备 ==="
    bash "$HOST_EXEC" "xcrun simctl list devices available | grep -E 'iPhone|iPad'"
    echo ""
    echo "=== 宿主机可用 Android AVD 模拟器 ==="
    bash "$HOST_EXEC" "emulator -list-avds 2>/dev/null || echo '(Android emulator 未配置或无 AVD)'"
    ;;
  boot)
    DEVICE_ID="${2:-}"
    if [[ -z "$DEVICE_ID" ]]; then
      echo "错误: 请指定设备 ID 或设备名称，例如: $0 boot 'iPhone 18 Pro'"
      exit 1
    fi
    echo "正在启动模拟器: $DEVICE_ID ..."
    bash "$HOST_EXEC" "open -a Simulator && xcrun simctl boot \"$DEVICE_ID\" 2>/dev/null || true"
    echo "模拟器启动指令已发送。"
    ;;
  open-sim)
    echo "正在打开宿主机 Simulator.app ..."
    bash "$HOST_EXEC" "open -a Simulator"
    ;;
  *)
    echo "用法: $0 [list | boot <device_id> | open-sim]"
    exit 1
    ;;
esac
