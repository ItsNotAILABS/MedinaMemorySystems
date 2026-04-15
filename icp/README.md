# MEDINA on ICP (Motoko)

This directory contains a Motoko-first implementation scaffold for MEDINA's architecture on the Internet Computer Protocol (ICP).

## What is implemented

- **Universal chat control plane (typed command AST)**: `runCommand` in `medina/Medina.mo`
- **Memory Temple geometry** (helix/ring/coordinate retrieval): `medina/MemoryTemple.mo`
- **Constitutional law engine** (`RECITAL_PLUS_ONE`, dual-read, Gate A/B/C): `medina/LawEngine.mo`
- **Governance workflows** (proposal, approval, status): `medina/Governance.mo`
- **Company onboarding modes** (connect/internalize/hybrid): `medina/Company.mo`
- **Model routing ecology** (role-specialized family routing + D/N contracts): `medina/ModelRouter.mo`
- **Orchestrator registry and beat gate evaluation**: `medina/Orchestrators.mo`
- **Matalko math/physics/chemistry/memory formalization helpers**: `medina/MatalkoICP.mo`

## Canonical architecture mapping

This Motoko implementation maps directly to:

- ORCH-01..ORCH-08 orchestrator naming
- Four-register contracts
- Dual-read always-on checks
- Gate A/B/C enforcement
- Non-collapse ontology invariants
- Memory lineage and replay references

## Key actor API (`medina/Medina.mo`)

- `sovereignBeat(...) -> BeatSummary`
- `memoryAdd(...) -> MemoryNode`
- `memoryFind(...) -> [MemoryNode]`
- `memoryPromote(memoryId) -> Bool`
- `memoryConsolidate(...) -> ?MemoryNode`
- `governPropose(...) -> GovernanceProposal`
- `governApprove(...) -> ?GovernanceProposal`
- `governStatus(...) -> Text`
- `companyOnboard(...) -> Tenant`
- `modelRoute(taskRef, policy) -> ModelRoute`
- `runCommand(cmd) -> CommandResult`

## Build notes

This repository now includes:

- `dfx.json`
- `mops.toml`

If your environment has `dfx` and `mops` installed:

```bash
dfx start --background
dfx build medina
```

## Design note

This is a production-oriented architecture scaffold in Motoko intended to host MEDINA's sovereign runtime contracts on ICP; it is not a mock chat wrapper.
