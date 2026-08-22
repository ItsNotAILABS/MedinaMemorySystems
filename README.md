# Medina Memory Systems

**Durable memory, context, provenance and team-vault infrastructure for AI systems.**

Medina Memory Systems is the continuity plane of the POCKET/NEXUS ecosystem. It stores durable outcomes and knowledge as typed, provenance-bearing records and returns bounded context packs to agents, models and product surfaces.

```text
Agent / Voice / Model / Product
          │
          ▼
   bounded context request
          │
          ▼
  Medina Memory Systems
          │
          ├── memory events
          ├── temporal memory
          ├── knowledge graph
          ├── team vault
          ├── retention / sensitivity
          ├── provenance
          └── recall / context packs
          │
          ▼
     NEXUS context pack
```

## What belongs in durable memory

Use durable memory for information that should affect later work:

```text
decisions
outcomes
corrections
benchmark evidence
incidents
compatibility findings
release evidence
unresolved recurring work
important project/user knowledge
```

Transient transport logs and entire prompt histories do not need to become durable state by default.

## NEXUS memory contracts

The repository is federated through [`ecosystem.surface.json`](ecosystem.surface.json) and [`docs/ECOSYSTEM_MEMORY_PROTOCOL.md`](docs/ECOSYSTEM_MEMORY_PROTOCOL.md).

Primary contracts:

```text
nexus.memory-event.v1
nexus.context-pack.v1
nexus.retention-policy.v1
nexus.health.v1
nexus.artifact.v1
```

A memory event carries an explicit subject, kind, content, provenance and creation time. Stored records can additionally carry tenant, sensitivity and retention semantics.

Example shape:

```json
{
  "schema": "nexus.memory-event.v1",
  "event_id": "mem_001",
  "subject": {
    "type": "project",
    "id": "project-alpha",
    "tenant_id": "team-acme"
  },
  "kind": "outcome",
  "content": {
    "summary": "Release gate passed",
    "facts": ["protocol-compatible", "receipt-linked"]
  },
  "provenance": {
    "component": "pocket-agent",
    "request_id": "req_001"
  },
  "created_at": "2026-08-22T00:00:00Z"
}
```

## Context packs

Recall should return a bounded working set rather than cloning the complete memory database into every model request.

```text
request
  -> tenant/project scope
  -> relevance / importance / recency
  -> sensitivity + retention policy
  -> bounded items
  -> provenance
  -> nexus.context-pack.v1
```

This lets POCKET Agent, Pocket Voice and AURO consume the same continuity layer without sharing unrestricted internal state.

## Package families

The repository contains multiple memory/coordination packages, including lanes for:

- Medina Memory SDK;
- temporal memory;
- memory palace / structured recall;
- knowledge graph;
- team vault;
- agent signals;
- consensus/governance components;
- replay and coordination infrastructure.

Use each package's local README/package metadata for its direct install surface.

## POCKET / NEXUS integration

```text
POCKET Host
 identity / tenant / project
        │
        ▼
POCKET Agent / Pocket Voice / AURO
        │
        ├── context request
        ▼
Medina Memory
        │
        ├── bounded recall
        ├── durable outcome write
        └── provenance / retention
        │
        ▼
receipt-linked continuation
```

NEXUS owns cross-repo protocol compatibility. Medina Memory owns durable memory semantics and must not become the policy or execution authority.

## Production storage principles

A deployed memory service should preserve these invariants:

```text
[ ] every durable record has an owner/subject
[ ] tenant scope is explicit
[ ] provenance names the producing component/request
[ ] sensitivity is explicit for non-public data
[ ] retention behavior is explicit
[ ] recall is bounded
[ ] deletes/legal holds are policy-driven
[ ] cross-tenant recall is denied
[ ] secrets are referenced through secret bindings, not copied into memory
[ ] artifacts are hash-linked when memory cites produced files/results
```

## Health model

Memory infrastructure should distinguish:

- **liveness** — process/storage loop is alive;
- **readiness** — dependencies required to safely read/write are available;
- **degraded** — partial recall/write paths remain available;
- **unavailable** — request should be handed off/retried under NEXUS resilience policy.

## Development and verification

This is a multi-package repository. Run the install/test commands for the package being changed, then validate the ecosystem declaration before release.

At the federation level, verify:

```text
ecosystem.surface.json
docs/ECOSYSTEM_MEMORY_PROTOCOL.md
```

And from NEXUS:

```bash
python tools/validate_ecosystem_protocols.py
python tools/validate_ecosystem_registry.py
python tools/production_gate.py
```

## Ecosystem

- [NEXUS](https://github.com/ItsNotAILABS/nexus) — federation and protocol authority
- [POCKET](https://github.com/ItsNotAILABS/pocket) — identity, tenancy and product host
- [POCKET Agent](https://github.com/ItsNotAILABS/pocket-agent) — long-running execution
- [Pocket Voice](https://github.com/ItsNotAILABS/pocket-voice-to-text) — conversational context producer
- [AURO](https://github.com/ItsNotAILABS/AURO) — model runtime consumer/producer

The role is simple: **keep continuity durable, scoped, attributable and useful enough that the next runtime can continue instead of starting over.**
