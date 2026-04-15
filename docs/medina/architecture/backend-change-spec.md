# MEDINA V1 Backend Change Specification

Classification: BUILDER_CONFIDENTIAL

## Scope

Defines backend contracts and service boundaries required to operationalize MEDINA V1.

## 1. Core Services

### 1.1 Sovereign Tick Runtime
- Implement beat scheduler with cadence classes: every beat, n-beat, event-driven
- Enforce instruction budget policy per beat
- Emit authoritative `law_write_epoch` once per beat (H6)

### 1.2 Law and Governance Engine
- Implement RECITAL_PLUS_ONE validator
- Enforce four-register schema on critical artifacts
- Enforce dual-read precondition for autonomous write
- Run Gate A/B/C checks before commit and projection
- Maintain Core A vs Core B acceptance boundary

### 1.3 Memory Temple Service
- Support coordinate keys: `theta`, `phi`, `depth`, `ring`, `beat`
- Path-based retrieval with lineage filters
- Explicit consolidation and promotion events
- Shared traversal state for user + system contexts

### 1.4 Model Routing Service
- Register model families: strategist, builder, analyst, governance, curator, ops, defense, projection
- Route requests by role and policy
- Record route decision evidence and fallback source badges (H7)

### 1.5 Company Onboarding Service
- Expose onboarding modes: connect/internalize/hybrid
- Maintain tenant isolation and policy overlays
- Produce workflow replay trails from day 1

### 1.6 Replay and Incident Service
- Persist replay bundles per beat and per workflow
- Include rollback pointers and incident IDs
- Validate evidence completeness before bundle publish

## 2. API Contract Surface

- `/api/chat/command`
- `/api/memory/find`
- `/api/memory/pin`
- `/api/memory/map`
- `/api/govern/status`
- `/api/govern/propose`
- `/api/govern/approve`
- `/api/model/invoke`
- `/api/model/route`
- `/api/workspace/open`
- `/api/company/onboard`
- `/api/company/connect`
- `/api/company/internalize`
- `/api/company/hybrid`
- `/api/replay/show`
- `/api/run`

All endpoints must:
- enforce permission + policy scopes
- return lineage IDs
- include gate score snapshots when state mutation is involved

## 3. Data Schemas (Minimum)

### 3.1 Constitutional Artifact
- `id`
- `version`
- `recital_ref`
- `expansion_delta`
- `registers.{founder,builder,organism,external}`
- `dual_read.{semantic,resonance}`
- `gate_scores.{a,b,c}`
- `acceptance.core_a_signed`

### 3.2 Memory Coordinate Record
- `memory_id`
- `coords.{theta,phi,depth,ring,beat}`
- `lineage.parent_id`
- `salience_score`
- `doctrine_tags[]`
- `promotion_state`

### 3.3 Replay Bundle
- `bundle_id`
- `workflow_id`
- `state_before`
- `state_after`
- `commands[]`
- `model_routes[]`
- `gate_evidence`
- `rollback_ref`
- `projection_manifest`

## 4. Observability Requirements

- Beat health metrics
- Gate pass/fail counters
- model import vs invoke inventory (H8)
- fallback duration + incident markers (H7)
- law epoch timestamp consistency (H6)
- no-orphan-micro signal alarms

## 5. Hardening Hooks

- H1: API parity test suite
- H2: memory navigation parity contract tests
- H3: organism model schema consistency checks
- H5: runtime beat budget assertions
- H6: law epoch singleton assertions
- H7: fallback transparency monitor
- H8: engine inventory diff report
