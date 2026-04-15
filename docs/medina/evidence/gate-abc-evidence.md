# MEDINA V1 Gate A/B/C Evidence Contract

Classification: BUILDER_CONFIDENTIAL

## Gate A: Runtime Readiness

### Purpose
Validate runtime correctness and stability before state mutation acceptance.

### Required checks
- dual-read availability and quality threshold
- beat budget compliance
- no orphan micro signals
- law epoch singleton validity

### Evidence artifacts
- `evidence/gate-a/runtime-health.json`
- `evidence/gate-a/dual-read-report.json`
- `evidence/gate-a/beat-budget-report.json`

### Pass rule
Gate A passes only if all required checks pass.

## Gate B: Workforce Activation

### Purpose
Validate safe and lawful activation of workforce operations.

### Required checks
- role-based permission validity
- task constitution packet completeness
- arbitration record readiness
- integration contract presence

### Evidence artifacts
- `evidence/gate-b/workforce-readiness.json`
- `evidence/gate-b/packet-integrity.json`
- `evidence/gate-b/permissions-audit.json`

### Pass rule
Gate B passes only if all task packet elements are valid and policy-aligned.

## Gate C: Projection Safety

### Purpose
Ensure safe bounded external outputs without sovereign truth leakage.

### Required checks
- projection boundary enforcement
- content sanitization and policy scan
- evidence references attached
- fallback/incident badges included when relevant

### Evidence artifacts
- `evidence/gate-c/projection-safety.json`
- `evidence/gate-c/redaction-scan.json`
- `evidence/gate-c/external-proof-manifest.json`

### Pass rule
Gate C passes only if output is bounded, evidenced, and policy-compliant.

## Combined Gate Verdict Schema

```json
{
  "workflow_id": "wf_*",
  "gate_verdict": {
    "a": {"status": "pass", "evidence": ["..."]},
    "b": {"status": "pass", "evidence": ["..."]},
    "c": {"status": "pass", "evidence": ["..."]}
  },
  "final_status": "accepted|rejected",
  "reviewed_by": ["core_a", "governance_orchestrator"],
  "timestamp": "iso8601"
}
```

## Enforcement Rule

No runtime truth mutation, workforce activation, or external projection can execute unless corresponding gate verdict is `pass`.
