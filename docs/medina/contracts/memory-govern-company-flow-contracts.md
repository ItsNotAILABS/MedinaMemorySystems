# MEDINA V1 Memory / Governance / Company Flow Contracts

Classification: BUILDER_CONFIDENTIAL

## 1. Memory Flow Contract

### 1.1 Retrieval Flow
1. Receive `/memory find` or NL-derived equivalent
2. Resolve path constraints (query + lineage + coordinate scope)
3. Execute semantic and resonance reads
4. Rank by salience + lineage continuity
5. Return replayable traversal path

### 1.2 Consolidation Flow
1. Detect consolidation trigger
2. Build consolidation candidate set
3. Produce RECITAL_PLUS_ONE proposal
4. Governance precheck for truth mutation
5. Apply accepted consolidation event with lineage link

### 1.3 Promotion Flow
1. Evaluate promotion eligibility by doctrine and salience
2. Create promotion proposal
3. Gate A + governance checks
4. Persist promotion marker and replay evidence

## 2. Governance Flow Contract

### 2.1 Proposal Flow
1. Create proposal with four registers
2. Attach evidence and policy references
3. Run ontology and law validation
4. Queue for approval

### 2.2 Approval Flow
1. Verify role authorization
2. Validate dual-read artifacts
3. Run Gate A/B/C as required
4. Core A signs acceptance or rejection
5. Emit governance decision event + replay link

### 2.3 Incident and Rollback Flow
1. Register incident context and impacted artifacts
2. Load rollback candidates from replay bundles
3. Run gate checks for rollback safety
4. Apply rollback with lineage continuity
5. Publish incident closure evidence

## 3. Company Onboarding Flow Contract

### 3.1 Connect Mode
- Integrate existing systems
- Preserve external source-of-truth references
- Establish permission and policy boundaries

### 3.2 Internalize Mode
- Replicate selected domains into MEDINA-native substrate
- Attach lineage to migration steps
- Establish internal replay continuity

### 3.3 Hybrid Mode
- Run dual system operation
- Reconcile divergence per cycle
- Produce reconciliation evidence ledger

## 4. Shared Cross-Flow Invariants

- Every state mutation has lineage and evidence
- Every critical artifact has four registers
- Dual-read required for autonomous write
- No gate bypass under any mode
- No orphan micro signals by end of beat

## 5. Event Contract Schema (Shared)

```json
{
  "event_id": "evt_*",
  "event_type": "memory|governance|company|incident|rollback",
  "lineage": {
    "parent": "artifact_*",
    "recital": "artifact_*",
    "delta": "lawful_expansion"
  },
  "registers": {
    "founder": {},
    "builder": {},
    "organism": {},
    "external": {}
  },
  "dual_read": {
    "semantic": "pass|degraded|fail",
    "resonance": "pass|degraded|fail"
  },
  "gates": {
    "a": "pass|fail",
    "b": "pass|fail",
    "c": "pass|fail"
  },
  "evidence": {
    "replay_bundle": "bundle_*",
    "policy_refs": []
  }
}
```
