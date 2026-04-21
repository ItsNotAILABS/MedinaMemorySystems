# @itsnotailabs/tools

> ItsNotAILABS Internal SDK Registry & Marketplace

**PROPRIETARY — Internal use only.**

---

## What this is

A single-import catalog of every tool, SDK, and utility built by ItsNotAILABS. Use it to:

- Discover what exists
- Get the correct install command for any tool
- Bootstrap a fresh machine quickly
- Pass tools to family and team members without hunting through repos

---

## Quick Start

```bash
# See everything in the registry
node -e "require('./dist').listAll()"

# Or from source
npx ts-node src/index.ts
```

```typescript
import { REGISTRY, listAll, findTool, getPublicTools } from '@itsnotailabs/tools';

// See everything
listAll();

// Find a specific tool
const tool = findTool('agent-signal');
console.log(tool?.install); // "npm install agent-signal"

// Get only public MIT tools
const publicTools = getPublicTools();
```

---

## Registry Contents (28 tools)

### Public — MIT License
| Tool | What it does |
|------|-------------|
| `consensus-engine` | Role-weighted voting for multi-agent teams |
| `agent-signal` | Pub/sub signal bus for AI agents |

### Commercial — BUSL-1.1 (Per-Call)
| Tool | What it does |
|------|-------------|
| `agent-incentive-service` | Mechanism-design coordination: consensus, reputation, stage gates |

### Proprietary SDK
| Tool | What it does |
|------|-------------|
| `@medina/memory-sdk` | Full sovereign memory + multi-AI team engine |

### Internal Utilities (25)
`campaignEngine` · `commandParser` · `companyOnboarding` · `crossOrganismResonance` · `deviceSovereignty` · `dualRead` · `exportEngine` · `fullStackKernelRegistry` · `gateEnforcement` · `governanceEngine` · `icpOrganism` · `kernelCompression` · `livingDocument` · `memoryEngine` · `messageEngine` · `modelRouter` · `novaSovereignEncryption` · `organismKernelExecutor` · `permissionsManager` · `recitalPlusOne` · `replayEngine` · `sovereignContractsLedgers` · `voiceEngine` + more

---

*PROPRIETARY — ItsNotAILABS. Not for public distribution.*
