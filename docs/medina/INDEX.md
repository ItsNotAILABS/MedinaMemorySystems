# MEDINA V1 Architecture Package

Classification: BUILDER_CONFIDENTIAL

This package is the architecture-first execution baseline for MEDINA V1.
It translates constitutional law, runtime organism logic, memory geometry, and enterprise operations into implementation contracts and evidence artifacts.

## Deliverables Map

1. Final architecture map -> `architecture/final-architecture-map.md`
2. Orchestrator/model/module index -> `architecture/orchestrator-model-module-index.md`
3. Backend changes -> `architecture/backend-change-spec.md`
4. Frontend changes -> `architecture/frontend-change-spec.md`
5. Frontend Technology Intelligence Layer -> `architecture/FRONTEND_TECHNOLOGY_INTELLIGENCE_LAYER.md`
6. **Codex Memoria Vita Specification** -> `architecture/CODEX_MEMORIA_VITA_SPEC.md` *(NEW)*
7. Command grammar/router contracts -> `contracts/command-grammar-and-router-contract.md`
8. Memory/govern/company flow contracts -> `contracts/memory-govern-company-flow-contracts.md`
9. H1..H8 hardening evidence -> `hardening/h1-h8-hardening-evidence.md`
10. Gate A/B/C evidence -> `evidence/gate-abc-evidence.md`
11. Replay bundle samples -> `replay/replay-bundle-samples.md`
12. Launch package artifacts -> `release/launch-package-artifacts.md`

## Codex Memoria Vita — Four Domain Architecture

The MEDINA platform now implements four foundational domains:

### 1. Autobot Codex (Constructive Agents)
- **Laws**: A-1 Coherence, A-2 Reversibility, A-3 Explainability, A-4 Containment
- **Classes**: PRIME, GUARDIAN, ARCHITECT, CURATOR, ANALYST, OPERATOR, SCOUT
- **Implementation**: `src/lib/vitaAeternaRuntime.ts`

### 2. Decepticon Codex (Adversarial Agents)
- **Laws**: D-1 Sandboxing, D-2 Telemetry, D-3 Non-Persistence, D-4 Counterpart
- **Classes**: TRICKSTER, PHANTOM, CRAWLER, DISRUPTOR, MIRAGE
- **Counterpart Mapping**: Every Decepticon has a mandatory Autobot counterpart
- **Implementation**: `src/lib/vitaAeternaRuntime.ts`

### 3. Semper Memoria (Eternal Memory System)
- **Lineage Operations**: Create, Fork, Merge with conflict detection
- **Shard Operations**: Append, Get, Summarize with compression levels
- **Access Control**: Scoped grants (public/enterprise/internal/sovereign/chaos)
- **Retention Policies**: Auto-compression, TTL, auto-prune
- **Implementation**: `src/lib/semperMemoriaEngine.ts`

### 4. Vita Aeterna (Immortal Runtime Lifecycle)
- **Lifecycle States**: template → spawning → growth → maturity → retiring → archived
- **Substrate Quotas**: Per-tier resource limits (PUBLIC/ENTERPRISE/SOVEREIGN)
- **CPL-L Enforcement**: Constitutional law checks at every transition
- **Memory Binding**: Organisms bind to Semper Memoria lineages
- **Implementation**: `src/lib/vitaAeternaRuntime.ts`

## API Surfaces

### Memory API (`/api/memory`)
- Legacy actions: list, get, search, pinned, stats, lineage, root, dual, omni
- **Semper Memoria actions**: 
  - `semper.stats`, `semper.audit`, `semper.root`
  - `lineage.get`, `lineage.list`, `lineage.shards`, `lineage.summary`
  - `shard.get`, `shard.append`
  - `access.list`, `access.check`, `access.grant`, `access.revoke`
  - `retention.get`, `retention.set`, `retention.apply`

### Agents API (`/api/agents`)
- Legacy actions: list, session, journal, stats, registry
- **Vita Aeterna actions**:
  - `vita.stats`, `vita.audit`
  - `template.get`, `template.list`, `template.create`
  - `organism.get`, `organism.list`, `organism.spawn`, `organism.transition`, `organism.retire`
  - `autobot.get`, `autobot.list`, `autobot.spawn`, `autobot.retire`
  - `decepticon.list`, `chaos.list`, `chaos.telemetry`, `chaos.deploy`, `chaos.mutation`, `chaos.expire`, `chaos.cleanup`
  - `quota.check`, `quota.update`

## Governance Integration

Gate-Codex mapping:
- **Gate A**: Autobot spawn/promotion, general governance
- **Gate B**: Memory write/delete, lineage operations
- **Gate C**: Decepticon deployment, chaos domain management

See `src/lib/governanceEngine.ts` for codex law validation functions.

## ICP Motoko Implementation

- Implementation root: `../../icp/`
- Motoko guide: `../../icp/README.md`
- Main actor: `../../icp/medina/Medina.mo`
- Law engine: `../../icp/medina/LawEngine.mo`
- Memory Temple geometry: `../../icp/medina/MemoryTemple.mo`
- Matalko math/physics/chemistry/memory formulas: `../../icp/medina/MatalkoICP.mo`

## Core Doctrine (Non-Negotiable)

- RECITAL_PLUS_ONE state evolution with lineage.
- Four-register artifact emission: Founder, Builder, Organism, External.
- Dual-read always on: semantic + resonance.
- Non-collapse ontology: Absolute/Law/Model/Engine/Core/Module/Lab/Workforce/Product remain distinct.
- Authority split: Core A runtime truth, Core B industrial/workforce execution.
- Gate A/B/C enforced globally with no bypass.
- **Autobot/Decepticon codex laws enforced at every agent action.**
- **Semper Memoria lineage chains for all memory operations.**

## MEDINA V1 Product Shape

- Universal chat control plane for all platform operations.
- Memory Temple as navigable geometry (helix/ring/coordinates).
- Multi-model runtime with role-specialized families.
- Governance and replay as executable, auditable subsystems.
- Company onboarding modes: Connect, Internalize, Hybrid.
- Agentic workspace fabric with packetized operations.
- Explicit and auditable permissions and access control.
- Safe external projection with bounded evidence outputs.
- **Codex-aware agent identities with law enforcement.**
- **Chaos domains for adversarial testing with telemetry.**

## Execution Sequence

- Phase 1: Operator Value Spine
- Phase 2: Living Document Intelligence
- Phase 3: Macro/Micro and N/D depth
- Phase 4: Hardening and Release

## Canonical Copy/Paste Pack

- Full canonical pack: `prompts/medina-canonical-copy-paste-kit.md`

## How to use

1. Start with `prompts/medina-master-builder-prompt.md`.
2. Align build intent with `prompts/medina-builder-readme.md`.
3. Implement contracts in `contracts/`.
4. Validate hardening with `hardening/` and `evidence/`.
5. Package release material in `release/` and `replay/`.
6. **Review Codex Memoria Vita spec in `architecture/CODEX_MEMORIA_VITA_SPEC.md`.**
