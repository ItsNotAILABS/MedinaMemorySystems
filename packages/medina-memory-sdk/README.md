# @medina/memory-sdk

> Enterprise memory infrastructure for intelligent applications.

**Commercial License** — Medina Memory Systems

---

## What's Inside

The Medina Memory SDK includes 10 specialized sub-SDKs:

| # | Sub-SDK | What It Does |
|---|---------|-------------|
| 1 | **Spatial Memory** | Memory entries located in 3D spherical coordinate space |
| 2 | **Document Intelligence** | Transform documents into structured, queryable knowledge |
| 3 | **Knowledge Graph** | Living knowledge graphs with nodes, edges, and path finding |
| 4 | **Semantic Search** | TF-IDF powered search by meaning, not just keywords |
| 5 | **Context Engine** | Context stack with entity resolution and reference tracking |
| 6 | **Pattern Recognition** | Repeating pattern detection, anomaly detection |
| 7 | **Temporal Memory** | Time-aware memory with exponential decay |
| 8 | **Harmonic Computing** | φ, Fibonacci, Solfeggio frequencies, sacred geometry |
| 9 | **Frequency Alignment** | Align system state to harmonic frequency layers |
| 10 | **Multi-AI Teams** | Form AI teams with roles, shared memory, callable assistants |

---

## Quick Start

```typescript
import { Medina } from '@medina/memory-sdk';

const medina = new Medina({ apiKey: 'your-api-key' });

await medina.store({
  content: 'Important context about the project',
  context: { topic: 'architecture', priority: 'high' },
});

const results = await medina.retrieve({ query: 'architecture', limit: 5 });
```

## Spatial Memory

```typescript
import { SpatialMemory } from '@medina/memory-sdk';

const memory = new SpatialMemory();
memory.store('Root principle', { theta: 0, phi: 90, ring: 1 });
const ring1 = memory.findByRing(1);
```

## Multi-AI Teams

```typescript
import { MultiAITeam, createResearchTeam } from '@medina/memory-sdk';

const team = createResearchTeam('research-001', 'Strategy Research Team');

team.share('project_goal', 'Analyze memory architecture patterns');

// Submit outputs from each team member (after running your actual AI calls)
team.submitOutput('analyst', 'task-001', { findings: ['pattern A'] }, 'Based on data', 0.9);
team.submitOutput('synthesizer', 'task-001', { synthesis: 'Combined finding' }, undefined, 0.85);

const consensus = team.buildConsensus('task-001');
```

## Harmonic Computing

```typescript
import { PHI, fibonacci, harmonicResonance, SOLFEGGIO } from '@medina/memory-sdk';

console.log(PHI);                          // 1.618...
console.log(fibonacci(10));                // [0,1,1,2,3,5,8,13,21,34]
console.log(harmonicResonance(528, 1056)); // ~1.0 (exact octave)
console.log(SOLFEGGIO.MI);                 // 528 (love frequency)
```

## Chaos Flow Recovery (via chaos-flow package)

```typescript
// For workflow recovery, see the standalone chaos-flow package
import { ChaosMonitor, createWorkflow } from 'chaos-flow';
```

---

## Products

This SDK is the developer surface for 10 Medina Memory Systems products:

- **Memory Vault** — Secure, growing memory storage
- **Document Intelligence** — Documents become knowledge
- **Knowledge Graph** — Living, evolving knowledge graphs
- **Semantic Search** — Meaning-based search
- **Context Engine** — True context understanding
- **Pattern Recognition** — Hidden pattern discovery
- **Temporal Memory** — Time-aware memory
- **Harmonic Computing** — Mathematical harmony for computing
- **Frequency Alignment** — Harmonic optimization
- **Organism Sync** — Distributed state management

---

**Enterprise:** enterprise@medinamemorysystems.com  
**Documentation:** [docs.medinamemorysystems.com](https://docs.medinamemorysystems.com)  
**Research:** [medinamemorysystems.com/research](https://medinamemorysystems.com/research)

---

*Memory is the foundation of intelligence.*
