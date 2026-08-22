# Ecosystem Memory Protocol

Medina Memory Systems is the durable continuity plane for the federated POCKET/NOVA ecosystem. It stores **typed outcomes and curated context**, not arbitrary hidden model state.

## Accepted memory event shape

```json
{
  "schema": "nexus.memory-event.v1",
  "event_id": "mem_...",
  "subject": {"type": "project", "id": "...", "tenant_id": "..."},
  "kind": "decision|outcome|correction|benchmark|incident|compatibility|release_evidence",
  "content": {"summary": "...", "facts": []},
  "sensitivity": "public|internal|confidential|restricted",
  "retention": "session|30d|90d|durable|legal_hold",
  "provenance": {"component": "...", "request_id": "...", "artifact_ids": []},
  "created_at": "RFC3339"
}
```

## Write gate

A memory event is rejected when:

- `tenant_id` is missing for tenant-scoped state;
- retention class is missing;
- sensitivity is missing;
- provenance is missing;
- content requests storage of private chain-of-thought/hidden reasoning;
- a caller attempts to persist raw secret values;
- the caller is outside the subject scope.

## Recall gate

Recall returns a `nexus.context-pack.v1`, not the entire database. A query must provide:

- tenant/principal scope;
- subject/project/session filter when applicable;
- maximum item count and byte budget;
- allowed sensitivity classes;
- relevance purpose;
- retention horizon.

Results preserve event IDs and provenance so consumers can trace why context was included.

## Practical intelligence

Memory consumers should prefer these durable event classes:

1. decisions that change future behavior;
2. corrections that prevent repeat failures;
3. benchmark outcomes with reproducible evidence;
4. incidents and their recovery result;
5. protocol compatibility findings;
6. release evidence and truth-state changes;
7. unresolved work that must recur.

Transient chat text, verbose logs and speculative internal reasoning are not durable memory by default.

## Enterprise isolation

Team vault and user memory are separate namespaces. A shared project may explicitly link selected memory event IDs, but namespace joins must be authorized and auditable. Cross-tenant semantic search is prohibited.

## Health semantics

Memory health reports liveness separately from readiness. A process can be alive while durable storage, indexes, encryption keys or tenant-policy dependencies are not ready.
