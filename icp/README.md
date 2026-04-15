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
- **RUDN Model Engine** (Router/Updater/Defender/Navigator execution): `medina/ModelEngine.mo`
- **Work Packet/Workflow contracts** (packet lifecycle, workflow orchestration): `medina/WorkPacket.mo`

## RUDN Model Engine Architecture

The Model Engine implements role-specialized behavior for task execution:

| Role | Code | Behavior | Capability |
|------|------|----------|------------|
| **Router** | R | Routes tasks to appropriate handlers, performs read-only analysis | ReadOnly |
| **Updater** | U | Performs state mutations with full gate validation | WriteWithGate |
| **Defender** | D | Risk assessment, safety validation, anomaly detection | ReadOnly |
| **Navigator** | N | Pathfinding, projection, lineage exploration | WriteWithGate |

### Engine-to-Family Mapping

- **Strategist** → Navigator (projects and navigates)
- **Builder** → Updater (mutates state)
- **Analyst** → Router (evaluates and routes)
- **Governance** → Updater (strong gate validation)
- **MemoryCurator** → Updater (memory mutations)
- **Operations** → Router (coordinates)
- **Defense** → Defender (validates)
- **Projection** → Navigator (external projection)

## Work Packet Lifecycle

Work packets track units of work through their lifecycle:

```
Draft → Open → InProgress → AwaitingGate → Completed
                    ↓              ↓
                Rejected      Cancelled
```

## Workflow Execution

Workflows orchestrate multi-step tasks:

1. **Create**: Define workflow with task steps
2. **Start**: Begin execution (status: Running)
3. **Step**: Execute each step with appropriate RUDN engine
4. **Complete**: All steps done, workflow completed

## Canonical architecture mapping

This Motoko implementation maps directly to:

- ORCH-01..ORCH-08 orchestrator naming
- Four-register contracts
- Dual-read always-on checks
- Gate A/B/C enforcement
- Non-collapse ontology invariants
- Memory lineage and replay references

## Key actor API (`medina/Medina.mo`)

### Core Operations
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

### Model Engine Operations
- `modelInvoke(family, taskRef, contextMemoryId, inputPayload) -> EngineResult`
- `engineHistory() -> [EngineInvocation]`
- `engineResultHistory() -> [EngineResult]`

### Work Packet Operations
- `workspaceCreate(title, taskRef, inputPayload, registers) -> WorkPacket`
- `workspaceOpen(packetId) -> ?WorkPacket`
- `workspaceAssign(packetId, family) -> ?WorkPacket`
- `workspaceComplete(packetId, outputPayload) -> ?WorkPacket`
- `workspaceList() -> [WorkPacket]`
- `workspaceGet(packetId) -> ?WorkPacket`

### Workflow Operations
- `workflowCreate(name, taskRefs) -> Workflow`
- `workflowStep(workflowId) -> ?WorkflowResult`
- `workflowRun(workflowId) -> ?WorkflowResult`
- `workflowStatus(workflowId) -> ?Workflow`
- `workflowList() -> [Workflow]`

### Universal Command Executor
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
