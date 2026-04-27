# 𓂀 @medina/intelligence-routing-sdk

![Version](https://img.shields.io/badge/version-1.0.0-gold) ![License](https://img.shields.io/badge/license-MIT%20%2B%20Proprietary-blue) ![φ](https://img.shields.io/badge/φ-1.618033988749895-purple)

> **Intelligent task routing for AI workforces.** Route any task to the right model, agent, or terminal.

---

## Features

- **Multi-Model Routing** — 8 model families: Strategist, Builder, Analyst, Governance, Memory Curator, Operations, Risk, Projection
- **RUDN Architecture** — Router / Updater / Defender / Navigator cluster system
- **Command Parsing** — `/module verb [args] [--flags]` syntax
- **61 Callable Functions** — Full registry with Latin names
- **10 Terminal Stations** — Sovereign command surfaces
- **Intelligence Wire** — φ-traced dispatch with full audit
- **Frontend↔Backend Sync** — Automatic mapping between TypeScript and Motoko

## Quick Start

```bash
npm install @medina/intelligence-routing-sdk
```

```typescript
import { routeIntelligence, threeHeartsRoute } from '@medina/intelligence-routing-sdk';

// Route a task to the best model
const result = routeIntelligence({
  task: 'Analyze Q4 revenue projections',
  context: { department: 'finance', urgency: 'high' },
});

// Use three-hearts routing (Oro/Nova/Unified)
const heartResult = threeHeartsRoute({
  input: 'Evaluate risk of new market entry',
  requiredConsensus: true,
});
```

## API Reference

| Latin Name | Function | Description |
|---|---|---|
| INTELLIGENTIAE DUCTUS | `routeIntelligence` | Route to best model |
| TRIUM CORDIUM DUCTUS | `threeHeartsRoute` | Three-hearts routing |
| DUCTUS AD COGITATIONEM | `routeToRCluster` | Route to Router cluster |
| DUCTUS AD UNITATEM | `routeToUCluster` | Route to Updater cluster |
| DUCTUS AD DEFENSIONEM | `routeToDCluster` | Route to Defender cluster |
| DUCTUS AD NEXUM | `routeToNCluster` | Route to Navigator cluster |

## Model Families

| Family | Role | RUDN Cluster |
|---|---|---|
| Strategist | Long-term planning | Router |
| Builder | Code & architecture | Updater |
| Analyst | Data & insights | Router |
| Governance | Policy & compliance | Defender |
| Memory Curator | Knowledge management | Navigator |
| Operations | Day-to-day execution | Updater |
| Risk | Threat assessment | Defender |
| Projection | Future modeling | Navigator |

## Tiers

| Tier | Features | Price |
|---|---|---|
| **Free** | Single-model routing, basic commands | $0 |
| **Pro** | Multi-model orchestration, RUDN clusters | Contact |
| **Enterprise** | Full wire dispatch, custom terminals | Contact |

## License

Open-core: MIT routing layer with proprietary RUDN + wire dispatch.
See [LICENSE](../../../licenses/MIT.txt) for the open-source components.

---

*Developed by ItsNotAILABS — Alfredo Medina Hernandez — Dallas, TX*
