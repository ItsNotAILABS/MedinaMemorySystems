# MEDINA V1 Frontend Change Specification

Classification: BUILDER_CONFIDENTIAL

## Scope

Defines the operator-facing surfaces and interaction contracts to make MEDINA V1 executable from a single universal chat plane.

## 1. Universal Chat Control Plane

### 1.1 Interaction Modes
- Natural language mode: intent extraction + confirmation
- Command mode: strict grammar execution (`/memory`, `/govern`, `/model`, `/company`, `/replay`, `/run`)

### 1.2 Required UX Guarantees
- One entry point controls all platform planes
- Explicit command previews before destructive operations
- All state-changing operations return lineage and gate badges
- Audit trail links visible inline

## 2. Operator Surfaces

### 2.1 Memory Surface
- Helix/ring navigator
- Coordinate inspector (`theta`, `phi`, `depth`, `ring`, `beat`)
- Lineage path replay view
- Promotion/consolidation event markers

### 2.2 Governance Surface
- Proposal queue
- Approval and rejection actions
- Policy check trace viewer
- Gate A/B/C score panel

### 2.3 Model Routing Surface
- Model family selector
- Route rationale panel
- Fallback source badge and incident ribbon (H7)

### 2.4 Company Operations Surface
- Onboarding wizard: connect/internalize/hybrid
- Tenant and policy panel
- Workflow runbook and replay links

### 2.5 Replay and Evidence Surface
- Replay timeline with command->model->state transitions
- Rollback affordance with authorization checks
- Projection evidence manifest view

## 3. Route and Information Architecture Clarity (H4)

- Single canonical route for each surface:
  - `/control/chat`
  - `/memory/temple`
  - `/governance/console`
  - `/models/router`
  - `/company/operations`
  - `/replay/evidence`
- No duplicated route aliases that shadow canonical operators
- Route registry lint rule rejects collisions

## 4. Access and Permission Toggles

UI must provide explicit grant/revoke/audit controls for:
- filesystem scope
- camera
- microphone
- screen capture
- clipboard
- location
- notifications
- command bridge
- connectors
- local/sandbox/cloud compute

Requirements:
- No hidden toggles
- Revocation effective immediately
- Every permission mutation writes an audit event

## 5. Frontend-Backend Parity

- Memory navigation interfaces match backend coordinate schema (H2)
- Command grammar router and backend command handlers remain contract-synced
- Gate evidence is rendered from backend truth without client-side fabrication

## 6. Usability Targets (Day-1 Superiority)

- time-to-first-value under one guided flow
- command completion hints for all grammar roots
- visible fallback and incident transparency
- replay discovery within two interactions from any mutation event
