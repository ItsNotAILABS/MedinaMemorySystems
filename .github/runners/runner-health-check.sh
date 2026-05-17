#!/usr/bin/env bash
# ┌─────────────────────────────────────────────────────────────────────────────┐
# │  MEDINA Alpha Fleet — Runner Health Check                                   │
# │  Run on each machine to verify runner status and system readiness.          │
# │                                                                             │
# │  Usage: ./runner-health-check.sh [runner-label]                            │
# └─────────────────────────────────────────────────────────────────────────────┘

set -euo pipefail

RUNNER_LABEL="${1:-unknown}"
INSTALL_DIR="${HOME}/actions-runner"
PHI="1.618033988749895"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  𓂀 MEDINA Alpha Runner Health Check — ${RUNNER_LABEL}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# System info
echo "[ System ]"
echo "  OS:      $(uname -s) $(uname -r)"
echo "  Arch:    $(uname -m)"
echo "  Host:    $(hostname)"
echo "  CPUs:    $(nproc 2>/dev/null || sysctl -n hw.ncpu)"
echo "  Uptime:  $(uptime | awk '{print $3, $4}' | tr -d ',')"

# Memory
if [[ "$(uname -s)" == "Linux" ]]; then
  RAM_TOTAL=$(awk '/MemTotal/{printf "%.1f GB", $2/1048576}' /proc/meminfo)
  RAM_AVAIL=$(awk '/MemAvailable/{printf "%.1f GB", $2/1048576}' /proc/meminfo)
  echo "  RAM:     ${RAM_TOTAL} (${RAM_AVAIL} available)"
elif [[ "$(uname -s)" == "Darwin" ]]; then
  RAM_BYTES=$(sysctl -n hw.memsize)
  echo "  RAM:     $(awk "BEGIN{printf \"%.1f GB\", ${RAM_BYTES}/1073741824}")"
fi

echo ""
echo "[ Node.js ]"
if command -v node &>/dev/null; then
  echo "  Version: $(node --version)"
  echo "  Path:    $(which node)"
  echo "  npm:     $(npm --version)"
else
  echo "  ✗ Node.js NOT FOUND"
fi

echo ""
echo "[ Git ]"
if command -v git &>/dev/null; then
  echo "  Version: $(git --version)"
else
  echo "  ✗ Git NOT FOUND"
fi

echo ""
echo "[ GitHub Actions Runner ]"
if [[ -d "$INSTALL_DIR" && -f "${INSTALL_DIR}/config.sh" ]]; then
  cd "$INSTALL_DIR"
  RUNNER_VER=$(./config.sh --version 2>/dev/null || echo "unknown")
  echo "  Version:  $RUNNER_VER"
  echo "  Dir:      $INSTALL_DIR"
  # Check if service running
  if [[ "$(uname -s)" == "Linux" ]]; then
    SVC_STATUS=$(sudo ./svc.sh status 2>/dev/null | grep -i "active\|running\|stopped" || echo "unknown")
    echo "  Service:  $SVC_STATUS"
  fi
else
  echo "  ✗ Runner NOT installed at $INSTALL_DIR"
  echo "  Run: ./setup-alpha-runner.sh $RUNNER_LABEL"
fi

# GPU check (alpha-gpu runner)
echo ""
echo "[ GPU (alpha-gpu only) ]"
if command -v nvidia-smi &>/dev/null; then
  echo "  GPU:      $(nvidia-smi --query-gpu=name --format=csv,noheader | head -1)"
  echo "  Memory:   $(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -1) MB"
  echo "  Driver:   $(nvidia-smi --query-gpu=driver_version --format=csv,noheader | head -1)"
  echo "  CUDA:     $(nvcc --version 2>/dev/null | grep 'release' | awk '{print $6}' || echo 'not in PATH')"
else
  echo "  nvidia-smi: not available (OK if not alpha-gpu)"
fi

echo ""
echo "[ Disk ]"
df -h "${INSTALL_DIR:-$HOME}" 2>/dev/null | tail -1 | awk '{printf "  Available: %s of %s (%s used)\n", $4, $2, $5}'

echo ""
echo "[ φ Pulse ]"
echo "  φ = $PHI"
# Simple phi verification: phi^2 - phi - 1 should be 0
python3 -c "
phi = (1 + 5**0.5) / 2
residual = abs(phi**2 - phi - 1)
status = '✓' if residual < 1e-10 else '✗'
print(f'  phi^2 - phi - 1 = {residual:.2e}  {status}')
" 2>/dev/null || echo "  (python3 not available for phi check)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Health check complete — $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
