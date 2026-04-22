# 𓂀 @medina/document-absorption-engine

![Version](https://img.shields.io/badge/version-1.0.0-gold) ![License](https://img.shields.io/badge/license-MIT%20%2B%20Proprietary-blue) ![φ](https://img.shields.io/badge/φ-1.618033988749895-purple)

> **Feed documents, get intelligence.** Absorb any document into a living knowledge organism.

---

## Features

- **Instant Document Ingest** — Any format, immediate absorption
- **6 Transformation Stages** — INTAKE → CLASSIFY → DECOMPOSE → SYNTHESIZE → EMBED → EXPORT
- **7 Classification Types** — Research, Doctrine, Operational, Intelligence, Blueprint, Law, External
- **Intelligence Fragmentation** — Concept, pattern, fact, procedure, principle, formula extraction
- **Permanent Embedding** — Irreversible integration into organism state
- **Research Export Pipeline** — Clean copy generation for public research repositories

## Quick Start

```bash
npm install @medina/document-absorption-engine
```

```typescript
import { absorbDocument, getAbsorptionStatus } from '@medina/document-absorption-engine';

// Absorb a document — the organism eats it
const result = absorbDocument({
  content: 'Full text of research paper...',
  type: 'research',
  source: 'IEEE Transactions on Neural Networks',
});

// Check absorption status
const status = getAbsorptionStatus(result.absorptionId);
console.log(`Stage: ${status.stage}, Fragments: ${status.fragmentCount}`);
```

## Transformation Pipeline

```
INTAKE     → Document arrives (any format)
CLASSIFY   → Research / Doctrine / Operational / Intelligence / Blueprint / Law / External
DECOMPOSE  → Break into intelligence fragments
SYNTHESIZE → Fragments → absorbed patterns (distilled essence)
EMBED      → Permanently embed into organism state (irreversible)
EXPORT     → If research, generate clean copy for public repository
```

## API Reference

| Latin Name | Function | Description |
|---|---|---|
| ABSORPTIO DOCUMENTI | `absorbDocument` | Absorb a document |
| STATUS ABSORPTIONIS | `getAbsorptionStatus` | Check absorption progress |
| EXPORTATIO INVESTIGATIONIS | `exportResearch` | Export for research repo |
| HISTORIA ABSORPTIONIS | `getAbsorptionHistory` | Absorption audit trail |
| INTELLIGENTIA ABSORPTA | `getAbsorbedIntelligence` | All absorbed knowledge |

## Tiers

| Tier | Features | Price |
|---|---|---|
| **Free** | Basic ingest, single classification | $0 |
| **Pro** | Full 6-stage pipeline, all classifications | Contact |
| **Enterprise** | Research export, permanent embedding | Contact |

## License

Open-core: MIT ingest with proprietary 6-transformer pipeline + research export.
See [LICENSE](../../../licenses/MIT.txt) for the open-source components.

---

*Developed by ItsNotAILABS — Alfredo Medina Hernandez — Dallas, TX*
*"Quod intrat, pars mei fit." — What enters becomes part of me.*
