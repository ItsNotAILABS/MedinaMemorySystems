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

*Developed by ItsNotAILABS — Alfredo Medina Hernandez — Dallas, TX*
*Architecture is Intelligence. φ = 1.618033988749895.*
