# MEDINA V1 Replay Bundle Samples

Classification: BUILDER_CONFIDENTIAL

Replay bundles provide verifiable continuity for command execution, model routing, governance decisions, and projection events.

## Sample 1: Memory Consolidation Replay Bundle

```json
{
  "bundle_id": "bundle_mem_001",
  "workflow_id": "wf_memory_consolidation_001",
  "command": "/memory map mem_442 --mode helix",
  "state_before": {"ring": 3, "depth": 8},
  "state_after": {"ring": 2, "depth": 6, "promotion": "candidate"},
  "dual_read": {"semantic": "pass", "resonance": "pass"},
  "gates": {"a": "pass", "b": "pass", "c": "pass"},
  "lineage": {"parent": "mem_442", "recital": "mem_442_v7", "delta": "lawful_expansion"},
  "evidence_refs": ["ev_mem_301", "ev_gov_118"],
  "rollback_ref": "rb_mem_001"
}
```

## Sample 2: Governance Approval Replay Bundle

```json
{
  "bundle_id": "bundle_gov_014",
  "workflow_id": "wf_govern_approve_014",
  "command": "/govern approve prop_902 --policy pol_7",
  "proposal": "prop_902",
  "core_a_signature": "sig_core_a_902",
  "policy_checks": ["ontology_ok", "registers_ok", "gate_ok"],
  "gates": {"a": "pass", "b": "pass", "c": "pass"},
  "decision": "accepted",
  "evidence_refs": ["ev_pol_77", "ev_gate_202"]
}
```

## Sample 3: Company Hybrid Onboarding Replay Bundle

```json
{
  "bundle_id": "bundle_company_021",
  "workflow_id": "wf_company_hybrid_021",
  "command": "/company hybrid tenant_55 plan_alpha",
  "tenant_id": "tenant_55",
  "mode": "hybrid",
  "connectors": ["crm", "erp", "support"],
  "internalized_domains": ["knowledge", "workflow", "policy"],
  "reconciliation": {"cycle": 12, "diff_count": 3, "status": "resolved"},
  "gates": {"a": "pass", "b": "pass", "c": "pass"},
  "evidence_refs": ["ev_company_11", "ev_recon_12"],
  "rollback_ref": "rb_company_021"
}
```

## Replay Bundle Quality Rules

- Must include command or NL-equivalent command transcript
- Must include state before/after
- Must include lineage and recital references
- Must include gate verdicts and evidence refs
- Must include rollback pointer for reversible operations
