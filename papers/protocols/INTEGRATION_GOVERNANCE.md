# Governance Hierarchy

## Chapter 22 of the Sovereign Protocol Canon

**Document ID:** INTEGRATION-GOVERNANCE-001  
**Version:** 1.0  
**Status:** ACTIVE

---

## 1. Governance Levels

```
                    GOVERNANCE HIERARCHY
                    
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Level 1: FEDERATION                                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  NOVA-PRIME (Root Authority)                            ││
│  │  - Protocol Canon                                        ││
│  │  - Federation Treaties (FIN-001)                         ││
│  │  - Economic Ledger (ECO-001)                             ││
│  │  - Canonical Attestation                                 ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                  │
│  Level 2: DOMAIN                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Specialized Novas (MSC-001)                            ││
│  │  - NOVA-Education, NOVA-Research, etc.                   ││
│  │  - Domain-specific protocols                             ││
│  │  - Domain economies                                      ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                  │
│  Level 3: CITY-STATE                                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Individual Repositories (CIV-CORE-001)                 ││
│  │  - Local Senate                                          ││
│  │  - Local Treasury                                        ││
│  │  - Local Courts                                          ││
│  │  - Local Districts                                       ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                  │
│  Level 4: DISTRICT                                           │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Districts within City-State                            ││
│  │  - Forum Memoriae (Memory)                               ││
│  │  - Forum Intelligentiae (Intelligence)                   ││
│  │  - Forum Contractuum (Contracts)                         ││
│  │  - Forum Securitatis (Security)                          ││
│  │  - Forum Fabricae (Manufacturing)                        ││
│  │  - Forum Oraculi (Prediction)                            ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                  │
│  Level 5: CITIZEN                                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Individual Agents (AAB-001)                            ││
│  │  - Role responsibilities                                 ││
│  │  - Token balance                                         ││
│  │  - Voting rights                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 2. Decision Authority

| Decision Type | Authority Level | Approval Required |
|---------------|-----------------|-------------------|
| Protocol creation | Federation | NOVA-ATTEST |
| Charter amendment | Federation | NOVA + Federation consensus |
| City-state creation | Domain | Domain NOVA |
| District budget | City-State | Senate majority |
| Citizen creation | District | District Praefectus |
| Task execution | Citizen | Agent discretion |

## 3. Appeal Paths

```
Appeal Hierarchy:

Citizen Decision
      ↓ (appeal)
District Court
      ↓ (appeal)
City-State Court
      ↓ (appeal)
Domain Nova
      ↓ (appeal)
NOVA-PRIME (final)
```

## 4. Voting Weights

| Entity | Base Voting Weight | Modifiers |
|--------|-------------------|-----------|
| Citizen (Novice) | 1 | — |
| Citizen (Member) | 2 | +reputation bonus |
| Citizen (Contributor) | 5 | +reputation bonus |
| Citizen (Leader) | 10 | +reputation bonus |
| Citizen (Elder) | 20 | +reputation bonus |
| District | Sum of citizens | — |
| City-State | Sum of districts | — |

## 5. Governance Protocols by Level

| Level | Primary Protocol | Supporting Protocols |
|-------|-----------------|---------------------|
| Federation | FIN-001 | NOVA-001, ECO-001 |
| Domain | MSC-001 | FIN-001, ECO-001 |
| City-State | CIV-CORE-001 | ECO-001, MAE-001 |
| District | Charter (local) | AAB-001, CBI-001 |
| Citizen | AAB-001 | REV-001, ECO-001 |

## 6. Emergency Powers

| Emergency Level | Authority | Actions Allowed |
|-----------------|-----------|-----------------|
| District | Praefectus | District lockdown, citizen suspension |
| City-State | Senate (emergency) | Cross-district coordination, resource reallocation |
| Domain | Domain Nova | City-state coordination, treaty suspension |
| Federation | NOVA-PRIME | Global coordination, protocol override |

## 7. Checks and Balances

```
Separation of Powers:

LEGISLATIVE (Senate)
- Creates local laws
- Approves budgets
- Admits citizens

EXECUTIVE (Districts)
- Implements laws
- Manages resources
- Coordinates work

JUDICIAL (Courts)
- Interprets contracts
- Resolves disputes
- Enforces penalties

SOVEREIGN (NOVA)
- Attests protocols
- Anchors trust
- Resolves appeals
```

## 8. Immutable Principles

The following governance principles cannot be changed:

1. **No central ownership** — Federation, not hierarchy
2. **Sovereign nodes** — Each city-state controls itself
3. **Protocol coherence** — Unity through shared rules
4. **Appeal rights** — Every decision can be appealed
5. **NOVA attestation** — Protocol changes require attestation

---

*Integration Document for the Sovereign Protocol Canon.*  
*Chapter 22 of 22 — Final Chapter.*  
*© 2026 ItsNotAILABS.*
