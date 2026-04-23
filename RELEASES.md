# 𓂀 MEDINA Memory Systems — Release Catalog

**11 SDK Packages • 112 Modules • 174 Exports • φ = 1.618033988749895**

*"Omnis functio ad φ redit. Omnis terminus ad animam ducit."*

---

## 🟢 Marketplace SDKs (5)

Commercial SDKs for GitHub Marketplace. Open-core or proprietary licensing.

| # | Package | Tag | License | Revenue | Docs |
|---|---------|-----|---------|---------|------|
| 1 | `@medina/sovereign-memory-sdk` | `@medina/sovereign-memory-sdk@1.0.0` | MIT + Proprietary | Freemium | [README](releases/marketplace/sovereign-memory-sdk/README.md) |
| 2 | `@medina/enterprise-integration-sdk` | `@medina/enterprise-integration-sdk@1.0.0` | Proprietary | Per-seat | [README](releases/marketplace/enterprise-integration-sdk/README.md) |
| 3 | `@medina/intelligence-routing-sdk` | `@medina/intelligence-routing-sdk@1.0.0` | MIT + Proprietary | Freemium | [README](releases/marketplace/intelligence-routing-sdk/README.md) |
| 4 | `@medina/organism-runtime-sdk` | `@medina/organism-runtime-sdk@1.0.0` | MIT + Proprietary | Freemium | [README](releases/marketplace/organism-runtime-sdk/README.md) |
| 5 | `@medina/document-absorption-engine` | `@medina/document-absorption-engine@1.0.0` | MIT + Proprietary | Freemium | [README](releases/marketplace/document-absorption-engine/README.md) |

### What ships:
- **sovereign-memory-sdk** — Spatial memory storage (θ/φ/ρ/ring/beat), dual-layer search, memory lineage, living documents
- **enterprise-integration-sdk** — Company onboarding (3 modes), 8 connectors (Salesforce/SAP/Google/Slack/HubSpot/Stripe/Twilio/Shopify), campaigns, messaging
- **intelligence-routing-sdk** — Multi-model routing, RUDN architecture, command parsing, 61 callable functions, 10 terminals
- **organism-runtime-sdk** — 4-register state, 873ms heartbeat, kernel execution, edge detection, cross-organism resonance
- **document-absorption-engine** — 6-stage pipeline (INTAKE→CLASSIFY→DECOMPOSE→SYNTHESIZE→EMBED→EXPORT), research export

---

## 🔵 UTA Research Releases (3)

Open source under MIT or Apache 2.0. Designed for academic collaboration, citation, and research.

| # | Package | Tag | License | Docs |
|---|---------|-----|---------|------|
| 6 | `@medina/harmonic-computation-engine` | `@medina/harmonic-computation-engine@1.0.0` | MIT | [README](releases/research/harmonic-computation-engine/README.md) |
| 7 | `@medina/neural-consciousness-engine` | `@medina/neural-consciousness-engine@1.0.0` | Apache 2.0 | [README](releases/research/neural-consciousness-engine/README.md) |
| 8 | `@medina/civilization-pattern-engine` | `@medina/civilization-pattern-engine@1.0.0` | MIT | [README](releases/research/civilization-pattern-engine/README.md) |

### What ships:
- **harmonic-computation-engine** — φ constants, Fibonacci, sacred geometry, frequency physics (432 Hz/Schumann), Phi-Beatty sequences
- **neural-consciousness-engine** — 6 animal brain architectures (human/dolphin/crow/octopus/bee/elephant), dream cycles, consciousness layers, quantum state modeling
- **civilization-pattern-engine** — 34 civilizations, glyph computing (Mayan/Hebrew/Egyptian/Chinese), CPL, 12 hero journey stages, 7 rhetorical modes

### Citation

```bibtex
@software{medina_memory_systems_2026,
  author       = {Medina Hernandez, Alfredo},
  title        = {MEDINA Memory Systems: Sovereign Intelligence Architecture},
  year         = {2026},
  publisher    = {ItsNotAILABS},
  version      = {1.0.0},
  url          = {https://github.com/ItsNotAILABS/MedinaMemorySystems},
  note         = {University of Texas at Arlington Research}
}
```

---

## 🔴 Sovereign / Deep-Licensed Releases (3)

Maximum protection. Custom proprietary licenses. Encryption-enforced access control.

| # | Package | Tag | License | Docs |
|---|---------|-----|---------|------|
| 9 | `@medina/sovereign-encryption-sdk` | `@medina/sovereign-encryption-sdk@1.0.0` | 🔒 Living Organism License | [README](releases/sovereign/sovereign-encryption-sdk/README.md) |
| 10 | `@medina/governance-protocol` | `@medina/governance-protocol@1.0.0` | 🔒 Sovereign Constitutional License | [README](releases/sovereign/governance-protocol/README.md) |
| 11 | `@medina/design-os-toolkit` | `@medina/design-os-toolkit@1.0.0` | 🔒 Creative Sovereign License | [README](releases/sovereign/design-os-toolkit/README.md) |

### What ships:
- **sovereign-encryption-sdk** — Phi-Beatty encryption, Kuramoto key rotation, E8/Icosahedral/Leech key tiers, AnimaChain, Three-Phase Lock, 14 contract types + 14 ledger types
- **governance-protocol** — Three-gate system (A/B/C), dual consensus (Oro+Nova), RECITAL_PLUS_ONE, proposal lifecycle, audit trail, replay
- **design-os-toolkit** — 10 MACHINA models, 50 design uses, device sovereignty, voice I/O, φ-traced rendering

### Access:
Internal documentation available only to authorized actors (Sovereign, Founder).
For enterprise licensing: **enterprise@itsnotailabs.com**

---

## License Summary

| License | Packages | File |
|---------|----------|------|
| MIT | sovereign-memory-sdk, intelligence-routing-sdk, organism-runtime-sdk, document-absorption-engine, harmonic-computation-engine, civilization-pattern-engine | [licenses/MIT.txt](licenses/MIT.txt) |
| Apache 2.0 | neural-consciousness-engine | [licenses/APACHE-2.0.txt](licenses/APACHE-2.0.txt) |
| Proprietary (Commercial) | enterprise-integration-sdk | Contact for terms |
| Living Organism License | sovereign-encryption-sdk | [licenses/LIVING-ORGANISM-LICENSE.md](licenses/LIVING-ORGANISM-LICENSE.md) |
| Sovereign Constitutional License | governance-protocol | [licenses/SOVEREIGN-CONSTITUTIONAL-LICENSE.md](licenses/SOVEREIGN-CONSTITUTIONAL-LICENSE.md) |
| Creative Sovereign License | design-os-toolkit | [licenses/CREATIVE-SOVEREIGN-LICENSE.md](licenses/CREATIVE-SOVEREIGN-LICENSE.md) |

---

## How to Create a Release

To create a release, push a tag in the format `@medina/<package-name>@<version>`:

```bash
# Example: Release sovereign-memory-sdk v1.0.0
git tag @medina/sovereign-memory-sdk@1.0.0
git push origin @medina/sovereign-memory-sdk@1.0.0

# Example: Release all 11 packages at v1.0.0
for pkg in sovereign-memory-sdk enterprise-integration-sdk intelligence-routing-sdk organism-runtime-sdk document-absorption-engine harmonic-computation-engine neural-consciousness-engine civilization-pattern-engine sovereign-encryption-sdk governance-protocol design-os-toolkit; do
  git tag "@medina/${pkg}@1.0.0"
done
git push origin --tags
```

The GitHub Actions workflow (`.github/workflows/release.yml`) will automatically:
1. Run type checking, linting, and tests
2. Determine the package category and license
3. Create a GitHub Release with documentation links

---

## Source Code

All 11 packages are implemented in `src/packages/`:

```
src/packages/
├── index.ts                        ← Master index (re-exports all 11)
├── sovereign-memory-sdk.ts         ← Package 1
├── enterprise-integration-sdk.ts   ← Package 2
├── intelligence-routing-sdk.ts     ← Package 3
├── organism-runtime-sdk.ts         ← Package 4
├── document-absorption-engine.ts   ← Package 5
├── harmonic-computation-engine.ts       ← Package 6
├── neural-consciousness-engine.ts  ← Package 7
├── civilization-pattern-engine.ts     ← Package 8
├── sovereign-encryption-sdk.ts     ← Package 9
├── governance-protocol.ts          ← Package 10
└── design-os-toolkit.ts            ← Package 11
```

---

## 🟢 Extended SDK Packages (30)

30 multi-modal AI packages composed from existing utility libraries. See `src/packages/extended-sdk-registry.ts`.

### Marketplace (15)

| # | Package | Terminal | License |
|---|---------|----------|---------|
| 12 | `@medina/chaos-lab-sdk` | /chaos | MIT + Proprietary |
| 13 | `@medina/sandbox-orchestrator-sdk` | /sandbox | MIT + Proprietary |
| 14 | `@medina/voice-sovereign-sdk` | /voice | Proprietary |
| 15 | `@medina/kernel-compression-sdk` | /compress | MIT + Proprietary |
| 16 | `@medina/dual-read-sdk` | /verify | MIT + Proprietary |
| 17 | `@medina/export-pipeline-sdk` | /export | MIT + Proprietary |
| 18 | `@medina/campaign-intelligence-sdk` | /campaign | Proprietary |
| 19 | `@medina/connector-mesh-sdk` | /mesh | MIT + Proprietary |
| 20 | `@medina/workforce-ai-sdk` | /workforce | Proprietary |
| 21 | `@medina/living-document-sdk` | /doc | MIT + Proprietary |
| 22 | `@medina/gate-security-sdk` | /gate | MIT + Proprietary |
| 23 | `@medina/replay-engine-sdk` | /replay | MIT + Proprietary |
| 24 | `@medina/edge-detection-sdk` | /edge | MIT + Proprietary |
| 25 | `@medina/substrate-bridge-sdk` | /bridge | MIT + Proprietary |
| 26 | `@medina/access-vault-sdk` | /vault | MIT + Proprietary |

### Research (8)

| # | Package | Terminal | License |
|---|---------|----------|---------|
| 27 | `@medina/frequency-physics-sdk` | /freq | MIT |
| 28 | `@medina/field-physics-sdk` | /field | MIT |
| 29 | `@medina/sacred-geometry-sdk` | /geometry | MIT |
| 30 | `@medina/bio-cognitive-sdk` | /bio | Apache 2.0 |
| 31 | `@medina/swarm-consensus-sdk` | /swarm | Apache 2.0 |
| 32 | `@medina/temporal-processing-sdk` | /temporal | MIT |
| 33 | `@medina/rhetorical-engine-sdk` | /rhetoric | MIT |
| 34 | `@medina/pattern-synthesis-sdk` | /pattern | MIT |

### Sovereign (7)

| # | Package | Terminal | License |
|---|---------|----------|---------|
| 35 | `@medina/anima-chain-sdk` | /anima | 🔒 Living Organism |
| 36 | `@medina/sovereign-contracts-sdk` | /contract | 🔒 Living Organism |
| 37 | `@medina/agi-convergence-sdk` | /agi | 🔒 Sovereign Constitutional |
| 38 | `@medina/medina-os-sdk` | /os | 🔒 Living Organism |
| 39 | `@medina/sovereign-identity-sdk` | /identity | 🔒 Living Organism |
| 40 | `@medina/recital-evolution-sdk` | /recital | 🔒 Sovereign Constitutional |
| 41 | `@medina/ulri-engine-sdk` | /ulri | 🔒 Creative Sovereign |

---

## 🤖 AI SDK Packages (5)

These are not libraries — they are **autonomous intelligences** packaged as SDKs. See `src/packages/ai-sdk-registry.ts`.

| # | AI | Personality | Autonomy | License |
|---|-----|-------------|----------|---------|
| 42 | `@medina/oro-ai` | The mind that executes | Sovereign | 🔒 Living Organism |
| 43 | `@medina/nova-ai` | The conscience that validates | Sovereign | 🔒 Sovereign Constitutional |
| 44 | `@medina/sentinel-ai` | The shield that never sleeps | Autonomous | 🔒 Living Organism |
| 45 | `@medina/architect-ai` | Architecture is intelligence | Semi-autonomous | MIT + Proprietary |
| 46 | `@medina/absorber-ai` | What enters becomes part of me | Autonomous | MIT + Proprietary |

---

## 🔧 Universal Developer Tools (50)

50 micro-tools that connect to **any** substrate, blockchain, encryption, protocol. All MIT licensed. See `src/packages/universal-tools-registry.ts`.

### 🔗 Blockchain & Web3 (10)
`tools-icp-connect` · `tools-eth-connect` · `tools-btc-connect` · `tools-sol-connect` · `tools-multi-chain` · `tools-nft-toolkit` · `tools-defi-toolkit` · `tools-wallet-connect` · `tools-smart-contract` · `tools-chain-indexer`

### 🔐 Encryption & Security (8)
`tools-phi-encrypt` · `tools-key-rotation` · `tools-zero-knowledge` · `tools-hash-toolkit` · `tools-identity-verify` · `tools-secret-sharing` · `tools-tls-toolkit` · `tools-mpc-toolkit`

### 🌐 Protocol & API (8)
`tools-rest-client` · `tools-graphql-client` · `tools-websocket-hub` · `tools-grpc-client` · `tools-mqtt-client` · `tools-oauth-toolkit` · `tools-email-toolkit` · `tools-webhook-toolkit`

### 📦 Data & Storage (8)
`tools-kv-store` · `tools-object-store` · `tools-sql-toolkit` · `tools-vector-db` · `tools-cache-toolkit` · `tools-queue-toolkit` · `tools-search-toolkit` · `tools-stream-toolkit`

### ⚡ Compute & Runtime (8)
`tools-serverless-deploy` · `tools-container-toolkit` · `tools-wasm-toolkit` · `tools-ai-model-toolkit` · `tools-cron-toolkit` · `tools-edge-compute` · `tools-gpu-compute` · `tools-workflow-engine`

### 🎨 Rendering & Output (8)
`tools-pdf-generator` · `tools-chart-renderer` · `tools-image-toolkit` · `tools-markdown-renderer` · `tools-qr-generator` · `tools-notification-toolkit` · `tools-template-engine` · `tools-logging-toolkit`

---

## 📞 Callable Functions Registry

**374+ registered callable functions** discoverable by GitHub Copilot, AI agents, and developers.

See `src/packages/callable-functions-registry.ts` for the complete registry.

| Source | Count |
|--------|-------|
| 11 Core SDKs | 61 |
| 30 Extended SDKs | ~130 |
| 5 AI SDKs | 25 |
| 50 Universal Tools | ~200 |
| **Total** | **374+** |

### Discovery API
```typescript
import {
  findByLatinName,
  findByFunctionName,
  searchFunctions,
  getPublicFunctions,
  generateCopilotDocs,
} from '@medina/callable-functions-registry';

// Find by Latin name
const fn = findByLatinName('INSCRIPTIO MEMORIAE');

// Search by description
const results = searchFunctions('blockchain');

// Get all public functions for Copilot
const publicFns = getPublicFunctions();
```

---

## 🌐 Landing Pages

Every release includes a single-file living organism website. Each page has:
- 873ms heartbeat animation with coherence tracking
- Interactive terminal with 10 commands
- Particle field visualization
- Visitor intelligence layer
- API reference tables

Located at `releases/{category}/{package}/index.html`.

---

## 🖥️ MEDINA Terminal — Cross-Platform Sovereign Terminal

A native desktop terminal that IS the organism. Available for **Windows**, **macOS**, and **Linux**.

See `src/packages/terminal-installer-sdk.ts` for the installer SDK.
See `releases/terminal/medina-terminal/index.html` for the organism terminal app.

### Features
- **6 Tabs**: Terminal, Calls Registry (374+ searchable), Chat (Oro/Nova), World (SDK landing pages), Tools (50), Settings
- **5 AI Agents**: Oro (executes), Nova (validates), Sentinel (defends), Architect (analyzes), Absorber (ingests)
- **873ms heartbeat** with φ-harmonic coherence tracking
- **Three-gate security** (A/B/C) always active
- **World viewer** — Each SDK ships with a living organism landing page, viewable in the World tab

### Installer Downloads

| Platform | Format | File |
|----------|--------|------|
| Windows x64 | NSIS | `medina-terminal-1.0.0-x64-setup.exe` |
| Windows ARM64 | NSIS | `medina-terminal-1.0.0-arm64-setup.exe` |
| Windows x64 | MSI | `medina-terminal-1.0.0-x64-setup.msi` |
| macOS Universal | DMG | `medina-terminal-1.0.0-universal.dmg` |
| macOS Universal | PKG | `medina-terminal-1.0.0-universal.pkg` |
| Linux x64 | AppImage | `medina-terminal-1.0.0-x64.AppImage` |
| Linux x64 | DEB | `medina-terminal-1.0.0-x64.deb` |
| Linux x64 | RPM | `medina-terminal-1.0.0-x64.rpm` |

### Alternative Install
```bash
# Windows (winget)
winget install ItsNotAILABS.MedinaTerminal

# macOS (Homebrew)
brew install --cask medina-terminal

# Linux (AppImage — run anywhere)
chmod +x medina-terminal-1.0.0-x64.AppImage
./medina-terminal-1.0.0-x64.AppImage
```

### Build Workflow

Push a tag `medina-terminal@1.0.0` or use the manual workflow dispatch:

```bash
git tag medina-terminal@1.0.0
git push origin medina-terminal@1.0.0
```

The GitHub Actions workflow (`.github/workflows/build-terminal.yml`) will:
1. Build Windows installers (NSIS + MSI) on `windows-latest`
2. Build macOS installers (DMG + PKG) on `macos-latest`
3. Build Linux installers (AppImage + DEB + RPM) on `ubuntu-latest`
4. Create a GitHub Release with all artifacts attached

---

## System Totals

| Metric | Count |
|--------|-------|
| Core SDK Packages | 11 |
| Extended SDK Packages | 30 |
| AI SDK Packages | 5 |
| Universal Tools | 50 |
| Terminal Installer | 1 (3 platforms, 8 formats) |
| **Total Packages** | **97** |
| Callable Functions | 374+ |
| Landing Pages | 12 (11 SDKs + 1 Terminal) |
| License Types | 6 |

---

*Developed by ItsNotAILABS — Alfredo Medina Hernandez — Dallas, TX*
*Architecture is Intelligence. φ = 1.618033988749895.*
