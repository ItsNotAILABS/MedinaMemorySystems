# NOVA-001: Nova Core

## Chapter 10 of the Sovereign Protocol Canon

**Protocol ID:** NOVA-001  
**Version:** 1.0  
**Status:** CANONICAL  
**Role:** Sovereign Anchor Node

---

## 1. Definition

Nova Core is the **sovereign anchor** of the organism—the heart and root of trust. It is private, underground, multi-substrate, and operates as a black-box to external observers.

## 2. Properties

| Property | Description |
|----------|-------------|
| **Private** | Not publicly accessible |
| **Underground** | Location and details obscured |
| **Multi-substrate** | Runs across multiple platforms |
| **Black-box** | Internal workings not exposed |
| **Sovereign** | Ultimate authority within organism |

## 3. Hosts

Nova hosts the critical infrastructure:

| Component | Function |
|-----------|----------|
| **Semper Memoria** | Canonical archive and collective memory |
| **Protocol Canon** | Authoritative protocol specifications |
| **Economic Ledger** | Master token balance record |
| **Trust Root** | Cryptographic root of trust |
| **Invariant Store** | System-wide invariants |

## 4. Interfaces

Nova exposes only two interfaces:

### NOVA-SYNC

Synchronizes laws, tokens, and invariants with the outer mesh.

```
NOVA-SYNC: Sync with outer mesh
  Input: sync_request (node_id, sync_type)
  Output: sync_package (laws, tokens, invariants)
  
Sync Types:
  - FULL: Complete state sync
  - INCREMENTAL: Changes since last sync
  - LAWS_ONLY: Protocol updates only
  - TOKENS_ONLY: Economic updates only
```

### NOVA-ATTEST

Signs canonical decisions and upgrades.

```
NOVA-ATTEST: Attest canonical decision
  Input: decision_payload, requester_id
  Output: attestation (signature, timestamp, decision_id)
  
Attestable Items:
  - Protocol canonization
  - Charter ratification
  - Critical governance decisions
  - Sovereign tier grants
  - Federation treaty ratification
```

## 5. Trust Hierarchy

```
NOVA (root)
  ├── Federation Treaties (FIN-001)
  │     ├── City-State A
  │     ├── City-State B
  │     └── City-State C
  ├── Protocol Canon
  │     ├── Canonical protocols
  │     └── Charters
  └── Economic Ledger
        ├── Token balances
        └── Settlement history
```

## 6. Access Control

| Requestor | NOVA-SYNC | NOVA-ATTEST |
|-----------|-----------|-------------|
| Federation node | ✓ | Request only |
| City-state | ✓ | Request only |
| SOVEREIGN tier | ✓ | ✓ (with justification) |
| Other | ✗ | ✗ |

## 7. Invariants

| Invariant | Enforcement |
|-----------|-------------|
| Single root of trust | Only one NOVA per organism |
| Attestation immutable | Once attested, cannot be un-attested |
| Sync consistency | All nodes receive same sync |
| Black-box internals | No external inspection |

## 8. Failure Modes

| Scenario | Response |
|----------|----------|
| NOVA unreachable | Federation operates on last-sync state |
| Attestation disputed | Formal dispute via FIN-DISPUTE |
| Sync corruption | Rollback to previous verified state |
| Key compromise | Emergency key rotation protocol |

## 9. Integration

- **CIV-CORE-001**: Heart of the organism
- **FIN-001**: Federation anchor
- **ECO-001**: Economic ledger host
- **All protocols**: Attestation authority

---

*Protocol NOVA-001 is CANONICAL and self-attested.*  
*© 2026 ItsNotAILABS.*
