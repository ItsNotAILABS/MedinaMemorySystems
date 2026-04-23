# ICP Development Tools - Comprehensive Cargo Toolchain

This document provides comprehensive information about the ICP (Internet Computer Protocol) and WebAssembly development tools installed via Cargo for the MedinaMemorySystems project.

## 🛠️ Installed Tools Summary

| #  | Tool                   | Version  | Purpose                                              |
|----|------------------------|----------|------------------------------------------------------|
| 1  | ic-wasm                | 0.9.10   | WASM manipulation for ICP canisters                  |
| 2  | candid-extractor       | 0.1.6    | Extract Candid interface definitions from WASM       |
| 3  | wasm-tools             | 1.247.0  | Comprehensive WASM manipulation toolkit              |
| 4  | wasm-bindgen-cli       | 0.2.118  | WASM/JavaScript interop bindings                     |
| 5  | wasm-pack              | 0.14.0   | WASM packaging for npm ecosystem                     |
| 6  | cargo-component        | 0.21.1   | Rust WASM Component Model support                    |
| 7  | cargo-audit            | 0.22.1   | Security vulnerability auditing                      |
| 8  | wasm-snip              | 0.4.0    | Dead code elimination for WASM                       |
| 9  | twiggy                 | 0.8.0    | WASM code size profiler                              |
| 10 | cargo-expand           | 1.0.121  | Macro expansion viewer                               |
| 11 | cargo-generate         | 0.23.8   | Project scaffolding from templates                   |

---

## 📦 Tool Details and Usage

### 1. ic-wasm (v0.9.10)
**Purpose**: WASM manipulation specifically designed for ICP canisters

#### Commands:
```bash
# Shrink WASM file (optimize size)
ic-wasm shrink input.wasm -o output.wasm

# Add metadata to canister
ic-wasm metadata input.wasm -o output.wasm --name my_metadata --visibility public --data "metadata content"

# List metadata sections
ic-wasm info input.wasm

# Optimize WASM for ICP
ic-wasm optimize input.wasm -o output.wasm

# Extract metadata for seeds
ic-wasm metadata input.wasm --name candid:service --visibility public
```

### 2. candid-extractor (v0.1.6)
**Purpose**: Extract Candid interface definitions from compiled WASM files

#### Commands:
```bash
# Extract Candid interface from WASM
candid-extractor target/wasm32-unknown-unknown/release/my_canister.wasm > my_canister.did

# Use with dfx build output
candid-extractor .dfx/local/canisters/my_canister/my_canister.wasm
```

### 3. wasm-tools (v1.247.0)
**Purpose**: Comprehensive toolkit for WASM file manipulation

#### Commands:
```bash
# Parse and validate WASM
wasm-tools validate input.wasm

# Print WASM in text format (WAT)
wasm-tools print input.wasm

# Demangle symbols
wasm-tools demangle input.wasm -o output.wasm

# Strip debug info
wasm-tools strip input.wasm -o output.wasm

# Convert WAT to WASM
wasm-tools parse input.wat -o output.wasm

# Component model operations
wasm-tools component new core.wasm -o component.wasm
wasm-tools component wit component.wasm

# Compose components
wasm-tools compose input.wasm -d dep.wasm -o output.wasm

# WASM shrinking
wasm-tools shrink input.wasm -o output.wasm

# Metadata inspection
wasm-tools metadata show input.wasm
wasm-tools metadata add input.wasm --name key --value "data" -o output.wasm

# Smith (fuzzing/generation)
wasm-tools smith --fuel 100 -o generated.wasm
```

### 4. wasm-bindgen-cli (v0.2.118)
**Purpose**: Generate JavaScript bindings for Rust WASM modules

#### Commands:
```bash
# Generate JS bindings
wasm-bindgen target/wasm32-unknown-unknown/release/my_lib.wasm --out-dir pkg

# Generate for browser
wasm-bindgen --target web --out-dir web-pkg my_lib.wasm

# Generate for Node.js
wasm-bindgen --target nodejs --out-dir node-pkg my_lib.wasm

# Generate TypeScript definitions
wasm-bindgen --typescript --out-dir pkg my_lib.wasm

# Convert to ES6 module
wasm2es6js input.wasm -o output.js --base64
```

### 5. wasm-pack (v0.14.0)
**Purpose**: Package Rust WASM for npm distribution

#### Commands:
```bash
# Build for npm
wasm-pack build

# Build with specific target
wasm-pack build --target web
wasm-pack build --target nodejs
wasm-pack build --target bundler

# Build in release mode
wasm-pack build --release

# Publish to npm
wasm-pack publish

# Create new project
wasm-pack new my-wasm-project

# Run tests
wasm-pack test --headless --chrome
wasm-pack test --node
```

### 6. cargo-component (v0.21.1)
**Purpose**: Build Rust projects as WASM components

#### Commands:
```bash
# Create new component project
cargo component new my-component

# Build as WASM component
cargo component build

# Build in release mode
cargo component build --release

# Check component
cargo component check

# Generate bindings
cargo component bindings
```

### 7. cargo-audit (v0.22.1)
**Purpose**: Security vulnerability auditing for Rust dependencies

#### Commands:
```bash
# Audit dependencies
cargo audit

# Audit with JSON output
cargo audit --json

# Fix vulnerabilities
cargo audit fix

# Audit specific lockfile
cargo audit -f Cargo.lock

# Ignore specific advisories
cargo audit --ignore RUSTSEC-2021-0001
```

### 8. wasm-snip (v0.4.0)
**Purpose**: Replace WASM functions with unreachable (dead code elimination)

#### Commands:
```bash
# Snip unused functions
wasm-snip input.wasm -o output.wasm --snip-rust-fmt-code

# Snip specific functions
wasm-snip input.wasm -o output.wasm -f function_name

# Snip panicking code
wasm-snip input.wasm -o output.wasm --snip-rust-panicking-code
```

### 9. twiggy (v0.8.0)
**Purpose**: Code size profiler for WASM binaries

#### Commands:
```bash
# Show top items by size
twiggy top input.wasm

# Show call graph dominators
twiggy dominators input.wasm

# Show paths to specific functions
twiggy paths input.wasm function_name

# Show garbage (unreachable code)
twiggy garbage input.wasm

# Compare two WASM files
twiggy diff old.wasm new.wasm

# Output as CSV
twiggy top input.wasm --format csv
```

### 10. cargo-expand (v1.0.121)
**Purpose**: View expanded Rust macro output

#### Commands:
```bash
# Expand all macros
cargo expand

# Expand specific module
cargo expand module_name

# Expand specific item
cargo expand module_name::item_name

# Expand with themes
cargo expand --theme github-dark

# Output to file
cargo expand > expanded.rs
```

### 11. cargo-generate (v0.23.8)
**Purpose**: Generate projects from templates

#### Commands:
```bash
# Generate from git template
cargo generate --git https://github.com/user/template

# Generate with specific name
cargo generate --git https://github.com/user/template --name my-project

# Generate from local template
cargo generate --path ./my-template

# Use favorite templates
cargo generate --favorite rust-wasm
```

---

## 🔄 ICP Development Workflow

### Building and Optimizing Canisters

```bash
# 1. Build your Motoko/Rust canister
dfx build

# 2. Optimize WASM size
ic-wasm shrink .dfx/local/canisters/my_canister/my_canister.wasm \
  -o .dfx/local/canisters/my_canister/my_canister_optimized.wasm

# 3. Extract Candid interface
candid-extractor .dfx/local/canisters/my_canister/my_canister_optimized.wasm > interface.did

# 4. Add metadata
ic-wasm metadata .dfx/local/canisters/my_canister/my_canister_optimized.wasm \
  -o final.wasm \
  --name "candid:service" \
  --visibility public \
  --file interface.did

# 5. Verify and analyze
wasm-tools validate final.wasm
twiggy top final.wasm | head -20
```

### Security Workflow

```bash
# Audit dependencies before building
cargo audit

# Check for dead code that can be eliminated
twiggy garbage my_canister.wasm

# Remove unreachable code
wasm-snip my_canister.wasm -o optimized.wasm --snip-rust-panicking-code
```

### Metadata for Seeds (Deep Metadata Extraction)

```bash
# Extract all metadata sections
ic-wasm info my_canister.wasm

# Extract specific metadata for seeding
ic-wasm metadata my_canister.wasm --name icp:public candid:service
ic-wasm metadata my_canister.wasm --name icp:private candid:args

# Add seed metadata
ic-wasm metadata my_canister.wasm \
  -o seeded.wasm \
  --name seed:config \
  --visibility private \
  --data '{"version": "1.0", "seed_type": "genesis"}'

# Extract and validate with wasm-tools
wasm-tools metadata show my_canister.wasm
```

---

## 📚 Additional Resources

- [DFINITY SDK Documentation](https://sdk.dfinity.org/)
- [Internet Computer Developer Docs](https://internetcomputer.org/docs/)
- [Candid Specification](https://github.com/dfinity/candid)
- [ic-wasm GitHub](https://github.com/dfinity/ic-wasm)
- [wasm-tools GitHub](https://github.com/bytecodealliance/wasm-tools)

---

## 🔧 Installation Verification

Run this command to verify all tools are installed:

```bash
cargo install --list | grep -E "(ic-wasm|candid-extractor|wasm-tools|wasm-bindgen|wasm-pack|cargo-component|cargo-audit|wasm-snip|twiggy|cargo-expand|cargo-generate)"
```

---

*Last Updated: April 2026*
*Tools installed for MedinaMemorySystems ICP Development*
