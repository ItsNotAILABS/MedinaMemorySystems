# Protocol Dependency Graph

## Chapter 20 of the Sovereign Protocol Canon

**Document ID:** INTEGRATION-DEPS-001  
**Version:** 1.0  
**Status:** ACTIVE

---

## 1. Dependency Overview

All protocols form an interconnected system. No protocol exists in isolation.

## 2. Core Dependencies

```
                    CIV-ORG-001
                   (The Organism)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    CIV-CORE-001    NOVA-001        ECO-001
   (Architecture)    (Heart)      (Metabolism)
        │               │               │
        ├───────────────┼───────────────┤
        │               │               │
    ┌───┴───┐       ┌───┴───┐       ┌───┴───┐
    │       │       │       │       │       │
 AAB-001 REV-001  FIN-001 HUB-001 ECO-EXT MAE-001
    │       │       │       │               │
    ├───────┴───────┴───────┴───────────────┤
    │                                       │
 CBI-001 ←───────── CPE-001 ──────────→ DCM-001
    │                                       │
    └───────────────────────────────────────┘
                      │
                  SPA-001
             (Self-Programming)
```

## 3. Protocol Dependency Matrix

| Protocol | Requires | Enables |
|----------|----------|---------|
| REV-001 | — | AAB-001, CBI-001, MAE-001 |
| CBI-001 | REV-001 | CPE-001, MAE-001 |
| AAB-001 | REV-001 | MAE-001, SPA-001 |
| CIV-CORE-001 | — | All protocols |
| ECO-001 | CIV-CORE-001 | ECO-001-EXT, MAE-001 |
| NOVA-001 | — | All protocols (attestation) |
| HUB-001 | CIV-CORE-001, FIN-001 | DCM-001 |
| DCM-001 | HUB-001 | CPE-001 |
| MAE-001 | AAB-001, CBI-001, ECO-001 | SPA-001 |
| SPA-001 | AAB-001, MAE-001, NOVA-001 | Evolution |
| FIN-001 | CIV-CORE-001, NOVA-001 | HUB-001, MSC-001 |
| ECO-001-EXT | ECO-001 | Long-term economics |
| MSC-001 | NOVA-001, FIN-001 | Multi-domain organization |
| CPE-001 | CBI-001, DCM-001 | Idea persistence |
| CIV-ORG-001 | All protocols | System coherence |

## 4. Charter Dependencies

| Charter | Protocol Dependencies |
|---------|----------------------|
| City-State | CIV-CORE-001, AAB-001, ECO-001 |
| Sandbox | CIV-CORE-001, AAB-001, NOVA-001 |
| Voice | REV-001, AAB-001, CBI-001 |
| Enterprise | HUB-001, ECO-001, FIN-001 |

## 5. Initialization Order

For system bootstrap:

```
Phase 1: Core
1. NOVA-001 (heart)
2. CIV-CORE-001 (structure)
3. REV-001 (cognition)

Phase 2: Economy
4. ECO-001 (metabolism)
5. ECO-001-EXT (extended)

Phase 3: Agents
6. AAB-001 (brain regions)
7. CBI-001 (artifacts)

Phase 4: Network
8. HUB-001 (nodes)
9. DCM-001 (mesh)
10. FIN-001 (federation)

Phase 5: Advanced
11. MAE-001 (multi-agent)
12. CPE-001 (persistence)
13. SPA-001 (self-programming)
14. MSC-001 (multi-nova)

Phase 6: Integration
15. CIV-ORG-001 (complete organism)
```

---

*Integration Document for the Sovereign Protocol Canon.*  
*Chapter 20 of 22.*  
*© 2026 ItsNotAILABS.*
