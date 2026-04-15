# MEDINA on ICP (Motoko)

This directory contains a Motoko implementation of MEDINA's sovereign memory-operating runtime on ICP.

## MVP features implemented

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

### Replay, incidents, rollback
- Replay log per operation
- Incident log for gate/auth/permission/parse failures
- State snapshots + rollback to snapshot id

### Matalko equation layer
- Macro absorption
- Dual-read energy
- Physics stability
- Chemistry potential
- Memory potential

## Main modules

- `medina/Medina.mo` - integrated runtime actor
- `medina/Types.mo` - canonical runtime contracts
- `medina/LawEngine.mo` - constitutional law and gate logic
- `medina/MemoryTemple.mo` - memory geometry and transforms
- `medina/Governance.mo` - proposal/approval lifecycle
- `medina/ModelRouter.mo` - model route logic and naming
- `medina/Company.mo` - tenant and onboarding operations
- `medina/Orchestrators.mo` - ORCH registry and beat checks
- `medina/MatalkoICP.mo` - mathematical/physics/chemistry helpers

## Quick start

```bash
dfx start --background
dfx build medina
```

## Suggested bootstrap sequence

1. call `bootstrapDemo("core-a")`
2. call `runTextCommand("/memory find medina-runtime-origin")`
3. call `runTextCommand("/govern propose policy payload-alpha")`
4. call `runTextCommand("/govern approve proposal-1")`
5. call `runTextCommand("/company onboard tenant-1 --mode hybrid")`
6. call `runTextCommand("/run strategy")`
