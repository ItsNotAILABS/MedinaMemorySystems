#!/bin/bash

# ICP Development Tools Installation Script
# Installs comprehensive ICP and WASM development tools via cargo

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║       ICP Development Tools Installation Script                       ║"
echo "║       MedinaMemorySystems - Sovereign Omni-Intelligence Architecture  ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Rust/Cargo is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Cargo not found. Please install Rust first:"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

echo "✅ Rust/Cargo detected: $(cargo --version)"
echo ""

# Array of tools to install
declare -a TOOLS=(
    "ic-wasm:0.9.10:WASM manipulation for ICP canisters"
    "candid-extractor:0.1.6:Extract Candid interface definitions"
    "wasm-tools::Comprehensive WASM toolkit"
    "wasm-bindgen-cli::WASM/JS interop bindings"
    "wasm-pack::WASM packaging for npm"
    "cargo-component::Rust WASM Component Model"
    "cargo-audit::Security vulnerability auditing"
    "wasm-snip::Dead code elimination"
    "twiggy::WASM code size profiler"
    "cargo-expand::Macro expansion viewer"
    "cargo-generate::Project scaffolding"
)

TOTAL=${#TOOLS[@]}
CURRENT=0

echo "Installing $TOTAL ICP/WASM development tools..."
echo ""

for tool_info in "${TOOLS[@]}"; do
    IFS=':' read -r name version description <<< "$tool_info"
    CURRENT=$((CURRENT + 1))
    
    echo "[$CURRENT/$TOTAL] Installing $name - $description"
    
    if [ -n "$version" ]; then
        cargo install "$name" --version "$version" 2>&1 | tail -1 || \
        cargo install "$name" 2>&1 | tail -1
    else
        cargo install "$name" 2>&1 | tail -1
    fi
    
    echo "    ✅ $name installed"
    echo ""
done

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                    Installation Complete!                             ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Installed tools:"
cargo install --list | grep -E "^[a-z]"
echo ""
echo "📚 See docs/ICP_DEVELOPMENT_TOOLS.md for usage documentation"
