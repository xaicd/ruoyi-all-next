#!/usr/bin/env bash
# scripts/host-exec.sh [command...]
#
# Transparent SSH execution proxy from container sandbox to macOS host.
# Automatically resolves host IP, loads credentials from /root/.ssh, and invokes tools.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SSH_KEY="/root/.ssh/id_ed25519"
if [[ ! -f "$SSH_KEY" && -f "/root/.ssh-host/id_ed25519" ]]; then
  mkdir -p /root/.ssh
  cp /root/.ssh-host/id_ed25519 "$SSH_KEY"
  chmod 600 "$SSH_KEY"
fi

# Detect if we are already on host
if [[ ! -f "/.dockerenv" ]] && ! grep -q 'containerd' /proc/1/cgroup 2>/dev/null; then
  # We are on the host directly
  exec bash -c "$*"
fi

HOST_USER="${HOST_USER:-mac}"

# Ensure route to LAN bypasses clash TUN before probing
if command -v ip >/dev/null 2>&1; then
  ip rule add to 192.168.0.0/16 lookup main prio 8000 2>/dev/null || true
  ip route replace 192.168.0.0/16 via 172.19.0.1 dev eth0 2>/dev/null || true
fi

# We are in container; resolve Mac host IP
TARGET_HOST="${MAC_HOST_IP:-}"
if [[ -z "$TARGET_HOST" ]]; then
  for candidate in "192.168.3.90" "192.168.3.85" "100.84.124.71"; do
    if ssh -o StrictHostKeyChecking=no -o ConnectTimeout=1 -o BatchMode=yes -i "$SSH_KEY" "$HOST_USER@$candidate" "true" 2>/dev/null; then
      TARGET_HOST="$candidate"
      break
    fi
  done
  [[ -n "$TARGET_HOST" ]] || TARGET_HOST="192.168.3.90"
fi

RAW_SCRIPT="export ANDROID_HOME=/Users/mac/android-sdk; export PATH=\"/Users/mac/android-sdk/platform-tools:/Users/mac/android-sdk/emulator:/opt/homebrew/Cellar/node@24/24.20.0/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:\$PATH\"; cd \"\${HOST_WORKSPACE:-\$HOME/workspace/xaicd/coolie}\" 2>/dev/null || true; $*"
B64_SCRIPT="$(printf '%s' "$RAW_SCRIPT" | base64 | tr -d '\r\n')"

exec ssh -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
  -o LogLevel=ERROR \
  -o BatchMode=yes \
  -o ConnectTimeout=5 \
  -o ServerAliveInterval=15 \
  -o ServerAliveCountMax=2 \
  -o ControlMaster=auto \
  -o ControlPath=/tmp/ssh-cm-%r@%h:%p \
  -o ControlPersist=10m \
  -i "$SSH_KEY" \
  "$HOST_USER@$TARGET_HOST" \
  "echo $B64_SCRIPT | base64 -d | bash"

