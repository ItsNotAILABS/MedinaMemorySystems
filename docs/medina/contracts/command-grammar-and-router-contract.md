# MEDINA V1 Command Grammar and Router Contract

Classification: BUILDER_CONFIDENTIAL

## 1. Grammar Intent

Universal chat must execute both natural language and deterministic command invocations while preserving governance, lineage, and safety guarantees.

## 2. Canonical Command Grammar

```txt
/memory find <query> [--lineage <id>] [--ring <r>] [--depth <d>]
/memory pin <memory_id> [--reason <text>]
/memory map <memory_id> [--mode helix|ring|path]

/govern status [--proposal <id>]
/govern propose <type> <payload_ref>
/govern approve <proposal_id> [--policy <id>]

/model invoke <family> <task_ref> [--context <memory_id>]
/model route <task_ref> [--policy <id>]

/workspace open <packet_id>

/company onboard <tenant_id> [--mode connect|internalize|hybrid]
/company connect <tenant_id> <connector_ref>
/company internalize <tenant_id> <domain_ref>
/company hybrid <tenant_id> <plan_ref>

/replay show <workflow_id|bundle_id>

/run <workflow_ref>
```

## 3. Router Pipeline

1. Parse command into AST
2. Bind actor identity and permissions
3. Validate ontology boundary and command namespace
4. Resolve route target (orchestrator/module)
5. Run dual-read preflight for state mutation commands
6. Run Gate A/B/C checks when applicable
7. Execute backend handler
8. Emit response with lineage, evidence refs, gate scores

## 4. Router Contracts

Each command handler must return:
- `status` (`ok|error|blocked`)
- `lineage_id`
- `gate_snapshot` (if mutating)
- `evidence_refs[]`
- `projection_profile` (if externalized)

Errors must classify into:
- syntax error
- policy denial
- gate failure
- dependency failure
- runtime fallback

## 5. Natural Language Bridge

- NL intents are transformed into canonical command plans
- User confirmation required for destructive actions
- Bridge emits equivalent command transcript for replay integrity

## 6. Safety and Governance Constraints

- `/govern approve` requires role and policy authorization
- `/company *` commands require tenant scope binding
- `/model invoke` must log model family and route rationale
- `/replay show` read access requires evidence role policy

## 7. Test Matrix

- parser conformance tests for all grammar roots
- AST stability tests across versions
- route map parity tests frontend/backend
- mutation command gate enforcement tests
- NL bridge equivalence tests (NL vs command output identity)
