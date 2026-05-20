#!/usr/bin/env bash
# ┌─────────────────────────────────────────────────────────────────────────────┐
# │  MEDINA Alpha Runner — Self-Hosted Setup Script                             │
# │  Registers and configures one of the 5 native alpha runners.               │
# │  Run this on each internal machine you want to add to the fleet.           │
# │                                                                             │
# │  Usage:                                                                     │
# │    ./setup-alpha-runner.sh <runner-label> <github-repo-url> <token>        │
# │                                                                             │
# │  Example:                                                                   │
# │    ./setup-alpha-runner.sh alpha-linux-x64 \                               │
# │      https://github.com/ItsNotAILABS/MedinaMemorySystems \                 │
# │      AAAAABBBBCCCC...                                                       │
# │                                                                             │
# │  Supported runner labels (no Windows):                                      │
# │    alpha-linux-x64      — Linux x86-64                                     │
# │    alpha-linux-arm64    — Linux ARM64 (native)                             │
# │    alpha-macos-arm64    — macOS Apple Silicon (M-series)                   │
# │    alpha-high-memory    — Linux x64 with ≥64 GB RAM                        │
# │    alpha-gpu            — Linux x64 with NVIDIA CUDA GPU                   │
# └─────────────────────────────────────────────────────────────────────────────┘

set -euo pipefail

# ─── Arguments ────────────────────────────────────────────────────────────────
RUNNER_LABEL="${1:-}"
REPO_URL="${2:-https://github.com/ItsNotAILABS/MedinaMemorySystems}"
REG_TOKEN="${3:-}"

if [[ -z "$RUNNER_LABEL" ]]; then
  echo "ERROR: runner label required (e.g. alpha-linux-x64)"
  echo "Usage: $0 <runner-label> [repo-url] [token]"
  exit 1
fi

# ─── Constants ────────────────────────────────────────────────────────────────
PHI="1.618033988749895"
ACTIONS_RUNNER_VERSION="2.316.1"
INSTALL_DIR="${HOME}/actions-runner"
NODE_REQUIRED="20"

# Determine platform
OS="$(uname -s)"
ARCH="$(uname -m)"

# ─── Validate runner label ────────────────────────────────────────────────────
VALID_LABELS=("alpha-linux-x64" "alpha-linux-arm64" "alpha-macos-arm64" "alpha-high-memory" "alpha-gpu")
VALID=false
for L in "${VALID_LABELS[@]}"; do
  [[ "$RUNNER_LABEL" == "$L" ]] && VALID=true && break
done

if [[ "$VALID" == "false" ]]; then
  echo "ERROR: Unknown runner label: $RUNNER_LABEL"
  echo "Valid labels: ${VALID_LABELS[*]}"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  𓂀 MEDINA Alpha Runner Setup"
echo "  Label:  $RUNNER_LABEL"
echo "  Repo:   $REPO_URL"
echo "  OS:     $OS / $ARCH"
echo "  φ:      $PHI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ─── Prerequisite check ───────────────────────────────────────────────────────
check_node() {
  if command -v node &>/dev/null; then
    NODE_VER=$(node --version | sed 's/v//' | cut -d. -f1)
    if [[ "$NODE_VER" -ge "$NODE_REQUIRED" ]]; then
      echo "✓ Node.js $(node --version)"
      return 0
    fi
  fi
  echo "✗ Node.js $NODE_REQUIRED+ required. Install from https://nodejs.org"
  exit 1
}

check_git() {
  if command -v git &>/dev/null; then
    echo "✓ Git $(git --version | awk '{print $3}')"
  else
    echo "✗ Git required. Install git."
    exit 1
  fi
}

check_node
check_git

# GPU runner: verify CUDA
if [[ "$RUNNER_LABEL" == "alpha-gpu" ]]; then
  if command -v nvidia-smi &>/dev/null; then
    GPU_NAME=$(nvidia-smi --query-gpu=name --format=csv,noheader | head -1)
    echo "✓ GPU detected: $GPU_NAME"
  else
    echo "WARNING: nvidia-smi not found. GPU runner may not have GPU access."
  fi
fi

# High-memory runner: check RAM
if [[ "$RUNNER_LABEL" == "alpha-high-memory" ]] && [[ "$OS" == "Linux" ]]; then
  RAM_GB=$(awk '/MemTotal/{printf "%.0f", $2/1048576}' /proc/meminfo)
  echo "  RAM: ${RAM_GB} GB"
  if [[ "$RAM_GB" -lt 32 ]]; then
    echo "WARNING: alpha-high-memory runner expected ≥32 GB. Found: ${RAM_GB} GB"
  fi
fi

# ─── Download GitHub Actions runner ──────────────────────────────────────────
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Pick the right tarball for this platform
if [[ "$OS" == "Darwin" ]]; then
  TARBALL="actions-runner-osx-arm64-${ACTIONS_RUNNER_VERSION}.tar.gz"
  URL="https://github.com/actions/runner/releases/download/v${ACTIONS_RUNNER_VERSION}/${TARBALL}"
elif [[ "$OS" == "Linux" && "$ARCH" == "aarch64" ]]; then
  TARBALL="actions-runner-linux-arm64-${ACTIONS_RUNNER_VERSION}.tar.gz"
  URL="https://github.com/actions/runner/releases/download/v${ACTIONS_RUNNER_VERSION}/${TARBALL}"
else
  TARBALL="actions-runner-linux-x64-${ACTIONS_RUNNER_VERSION}.tar.gz"
  URL="https://github.com/actions/runner/releases/download/v${ACTIONS_RUNNER_VERSION}/${TARBALL}"
fi

if [[ ! -f "config.sh" ]]; then
  echo "⬇  Downloading runner: $TARBALL"
  curl -fL "$URL" -o "$TARBALL"
  tar xzf "$TARBALL"
  rm -f "$TARBALL"
  echo "✓ Runner extracted"
else
  echo "✓ Runner already installed ($(./config.sh --version 2>/dev/null || echo 'unknown version'))"
fi

# ─── Register runner ──────────────────────────────────────────────────────────
if [[ -n "$REG_TOKEN" ]]; then
  echo ""
  echo "Registering runner with GitHub…"

  # Build extra labels based on runner type
  EXTRA_LABELS="medina,phi-${PHI//./-},alpha"
  case "$RUNNER_LABEL" in
    alpha-linux-x64)     EXTRA_LABELS="${EXTRA_LABELS},compute,x64"    ;;
    alpha-linux-arm64)   EXTRA_LABELS="${EXTRA_LABELS},arm64,native"   ;;
    alpha-macos-arm64)   EXTRA_LABELS="${EXTRA_LABELS},macos,apple-silicon" ;;
    alpha-high-memory)   EXTRA_LABELS="${EXTRA_LABELS},himem,stress"   ;;
    alpha-gpu)           EXTRA_LABELS="${EXTRA_LABELS},cuda,gpu,accel"  ;;
  esac

  ./config.sh \
    --url "$REPO_URL" \
    --token "$REG_TOKEN" \
    --name "$RUNNER_LABEL-$(hostname | cut -c1-8)" \
    --labels "${RUNNER_LABEL},${EXTRA_LABELS}" \
    --work "_work" \
    --unattended \
    --replace

  echo "✓ Runner registered: $RUNNER_LABEL"
else
  echo ""
  echo "NOTE: No token provided. Skipping GitHub registration."
  echo "To register, obtain a token from:"
  echo "  $REPO_URL/settings/actions/runners/new"
  echo "Then re-run:"
  echo "  $0 $RUNNER_LABEL $REPO_URL <YOUR_TOKEN>"
fi

# ─── Install as system service ────────────────────────────────────────────────
echo ""
echo "Installing runner as system service…"
if [[ "$OS" == "Linux" ]] && command -v systemctl &>/dev/null; then
  sudo ./svc.sh install 2>/dev/null || echo "  (service install requires sudo — run manually: sudo ./svc.sh install)"
  sudo ./svc.sh start  2>/dev/null || echo "  (to start: sudo ./svc.sh start)"
elif [[ "$OS" == "Darwin" ]]; then
  ./svc.sh install 2>/dev/null || echo "  (service install failed — run: ./run.sh to start manually)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ Setup complete: $RUNNER_LABEL"
echo ""
echo "  Runner directory: $INSTALL_DIR"
echo "  To start manually: cd $INSTALL_DIR && ./run.sh"
echo "  To check service:  sudo ./svc.sh status"
echo ""
echo "  This runner will appear in GitHub as:"
echo "    Repository → Settings → Actions → Runners"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
