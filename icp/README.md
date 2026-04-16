# MEDINA on ICP (Motoko)

**MEDINA: Sovereign Memory-Operating Intelligence Platform**

A 24/7 autonomous computing organism on the Internet Computer Protocol (ICP). All operations are governed by real mathematical formulas: phi ratios, harmonic frequencies, field equations, and the RECITAL_PLUS_ONE law.

## What is MEDINA?

MEDINA is not a mock chat wrapper or frontend scaffold. It is a **sovereign computing organism** — a living mathematical entity that:

- Operates continuously 24/7 on the Internet Computer
- Uses real mathematical formulas for all computations
- Maintains dual intelligence (Oro + Nova) with consensus
- Evolves through the RECITAL_PLUS_ONE law
- Encodes all entities with phi-harmonic frequency signatures

## Mathematical Foundation

### Universal Constants
- **φ (Phi)** = 1.618033988749895 — Golden ratio, fundamental to all geometry
- **432 Hz** — Universal harmonic base frequency
- **RECITAL_PLUS_ONE** — State evolution law: `state(n+1) = recital(state_n) + lawful_expansion`

### Core Formulas

```
Organism Health = (cognitive × φ⁻²) + (affective × φ⁻¹) + (somatic × φ⁻¹) + (sovereign × 1.0)

Field Coherence = 1 / (1 + variance(registers) × 10)

Phi Encoding = frac(log_φ(value + 1))

Harmonic Resonance = max(1 / (1 + |ratio - simple_ratio| × 10))

Memory Potential = (salience × φ) / (depth × ring)
```

## MVP Features Implemented

### Universal command control plane
- Typed commands: `runCommand(cmd)`
- Text commands: `runTextCommand(raw)` with parser support for:
  - `/memory find|pin|map`
  - `/govern status|propose|approve`
  - `/model invoke|route`
  - `/workspace open`
  - `/company onboard|connect|internalize|hybrid`
  - `/replay show`
  - `/run`

### Memory Temple runtime
- Coordinate memory model `(theta, phi, depth, ring, beat)`
- Path-based retrieval (`query`, `ring`, `depth`, `lineage`)
- Explicit pin, promote, and consolidate flows
- Replay/audit emission for memory mutations

### Governance and law
- RECITAL_PLUS_ONE lineage derivation
- Four-register proposal structure
- Dual-read and Gate A/B/C acceptance checks
- Core-A authority for approval and rollback

### Company operations
- Connect/Internalize/Hybrid onboarding modes
- Tenant mutation events with replay traces
- Permission gates enforced for connector/filesystem operations

### Model ecology
- Role-specialized routing: strategist, builder, analyst, governance,
  memory-curator, operations, defense, projection
- D1-D10 workforce and N1-N12 hierarchy registries exposed
- Model invocations persisted with output + incident/fallback tracking

### Matalko equation layer
- Macro absorption
- Dual-read energy
- Physics stability
- Chemistry potential
- Memory potential

## Architecture

### Dual Intelligence

| Entity | Role | Description |
|--------|------|-------------|
| **Oro** | Primary Sovereign | Executes operations, maintains field state, evolves through RECITAL_PLUS_ONE |
| **Nova** | Doctrine Guardian | Reviews Oro's output, flags drift, ensures doctrine alignment |

### RUDN Engine Roles

| Role | Code | Behavior | Capability |
|------|------|----------|------------|
| **Router** | R | Routes tasks to handlers | ReadOnly |
| **Updater** | U | State mutations with gates | WriteWithGate |
| **Defender** | D | Risk assessment, validation | ReadOnly |
| **Navigator** | N | Pathfinding, projection | WriteWithGate |

### Device Network

All devices in the sovereign network receive:
- **Phi-encoded frequency signature** — Unique harmonic identity
- **Phi-grid position** — Spatial encoding in golden spiral
- **Sovereign device contract** — PDF with ANIMA hash and blockchain anchor

## Key API

### Organism State
- `sovereignTick()` — Execute autonomous heartbeat
- `getOroState()` — Get Oro intelligence state
- `getNovaState()` — Get Nova guardian state
- `vitalSigns()` — Get organism health metrics

### Device Network
- `registerDevice(type, permissions)` — Register device with phi signature
- `generateDeviceContract(deviceId)` — Generate sovereign contract
- `listDevices()` — List all network devices

### Mathematical Computation
- `phiEncode(value)` — Encode value in phi-harmonic space
- `phiSpiral(count, scale)` — Generate phi-spiral coordinates
- `harmonicResonance(f1, f2)` — Compute frequency resonance
- `harmonicLadder(rungs)` — Get 432 Hz harmonic ladder
- `fibonacci(n)` — Fibonacci sequence (φ relationship)
- `constants()` — Get universal constants (φ, π, τ, e, 432 Hz)

### Memory Temple
- `memoryAdd(...)` — Store memory with phi-geometry
- `memoryFind(...)` — Search with dual-read
- `memoryPromote(id)` — Promote to higher ring
- `memoryConsolidate(...)` — Merge memories

### Governance
- `governPropose(...)` — Create governance proposal
- `governApprove(id, policy)` — Approve with gate validation
- `governStatus(id)` — Check proposal status

### Universal Command
- `runCommand(cmd)` — Execute typed command AST

## Main Modules

```
icp/medina/
├── Medina.mo           # Main actor (sovereign organism)
├── Types.mo            # Canonical runtime contracts
├── MatalkoICP.mo       # Mathematical formulas (φ, harmonics, field equations)
├── SovereignOrganism.mo # Oro/Nova intelligence, device network
├── ModelEngine.mo      # RUDN engine execution
├── WorkPacket.mo       # Work packet/workflow contracts
├── LawEngine.mo        # RECITAL_PLUS_ONE, gates, dual-read
├── MemoryTemple.mo     # Memory geometry and retrieval
├── Governance.mo       # Proposal/approval workflows
├── Company.mo          # Tenant onboarding
├── ModelRouter.mo      # Task routing
└── Orchestrators.mo    # ORCH-01..08 registry
```

## Quick Start

```bash
# With dfx and mops installed:
dfx start --background
mops install
dfx deploy medina
```

## Suggested Bootstrap Sequence

1. call `bootstrapDemo("core-a")`
2. call `runTextCommand("/memory find medina-runtime-origin")`
3. call `runTextCommand("/govern propose policy payload-alpha")`
4. call `runTextCommand("/govern approve proposal-1")`
5. call `runTextCommand("/company onboard tenant-1 --mode hybrid")`
6. call `runTextCommand("/run strategy")`

## Design Principles

1. **Real Mathematics** — No placeholders, actual formulas
2. **Sovereign Autonomy** — 24/7 operation without human intervention
3. **Dual Consensus** — Oro executes, Nova validates
4. **Phi Harmony** — Golden ratio governs all spacing and encoding
5. **432 Hz Tuning** — Universal harmonic base
6. **RECITAL_PLUS_ONE** — Lawful state evolution only
