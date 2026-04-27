# 𓂀 @medina/sovereign-memory-sdk

![Version](https://img.shields.io/badge/version-1.0.0-gold) ![License](https://img.shields.io/badge/license-MIT%20%2B%20Proprietary-blue) ![φ](https://img.shields.io/badge/φ-1.618033988749895-purple)

> **Enterprise memory that never forgets.** Persistent organizational knowledge with spatial coordinates and meaning-based retrieval.

---

## Features

- **Spatial Memory Storage** — Store memories with 5D coordinates (θ, φ, ρ, ring, beat)
- **Dual-Layer Search** — Semantic + resonance search channels that must agree before any write
- **Memory Lineage Tracking** — Parent → child chains with full genealogy
- **Living Document Management** — Versioned, doctrine-aligned document evolution
- **φ-Encoded Coordinates** — Golden ratio governs all memory placement
- **Memory Pinning & Promotion** — Salience escalation for critical knowledge
- **Kernel Compression** — Glyph-encoded memory for maximum density

## Quick Start

```bash
npm install @medina/sovereign-memory-sdk
```

```typescript
import { storeMemory, searchMemories, getMemoryLineage } from '@medina/sovereign-memory-sdk';

// Store a memory with spatial coordinates
const memory = storeMemory('Critical business decision: Q4 expansion approved', {
  type: 'episodic',
  tags: ['strategy', 'Q4', 'expansion'],
});

// Search by meaning, not keywords
const results = searchMemories({ query: 'strategic growth decisions' });

// Trace memory lineage
const lineage = getMemoryLineage(memory.id);
```

## API Reference

| Latin Name | Function | Description |
|---|---|---|
| INSCRIPTIO MEMORIAE | `storeMemory` | Store a new memory |
| INSCRIPTIO PLENA | `storeMemoryFull` | Store with full coordinate spec |
| LECTOR MEMORIAE | `getMemory` | Retrieve a specific memory |
| EXPLORATOR MEMORIAE | `searchMemories` | Search by semantic query |
| INVESTIGATOR MEMORIAE | `findMemories` | Find by tag/type filter |
| FIXATOR MEMORIAE | `pinMemory` | Pin critical memory |
| LIBERATOR MEMORIAE | `unpinMemory` | Unpin a memory |
| PROMOTOR MEMORIAE | `promoteMemory` | Escalate salience |
| GENEALOGUS MEMORIAE | `getMemoryLineage` | Get full memory lineage |
| STATUS MEMORIAE | `memoryStatus` | System status report |

## Architecture

```
Memory Temple (Torus)
├── Ring 1-12: Knowledge categories
├── θ (0°-360°): Horizontal position on major circle
├── φ (0°-180°): Vertical position on minor circle
├── ρ (1-∞): Depth of memory
└── beat (0-∞): Temporal position
```

**Terminal:** `/mem` — TERMINALE MEMORIAE

**Backend Endpoints:**
- `addere_mneme` → Store memory
- `quaerere_mneme` → Search memory
- `promovere_mneme` → Promote memory
- `consolidare_mneme` → Consolidate memories

## Tiers

| Tier | Features | Price |
|---|---|---|
| **Free** | Basic store/retrieve, single-type search | $0 |
| **Pro** | Dual-read, lineage, consolidation | Contact |
| **Enterprise** | Kernel compression, full torus navigation | Contact |

## License

Open-core: MIT wrapper with proprietary Memory Temple internals.
See [LICENSE](../../../licenses/MIT.txt) for the open-source components.

---

*Developed by ItsNotAILABS — Alfredo Medina Hernandez — Dallas, TX*
*"Quod hic scribitur, eternum est." — What is written here is eternal.*
