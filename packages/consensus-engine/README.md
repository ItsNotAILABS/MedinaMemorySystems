# consensus-engine

> Weighted consensus engine for multi-agent AI systems.

Every agent role carries a frequency-derived authority weight. Confidence scores decay weak votes. Sovereign roles hold veto power. Truth emerges from the weighted sum.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Install

```bash
npm install consensus-engine
```

## Quick Start

```typescript
import { ConsensusEngine, vote, summarise } from 'consensus-engine';

const engine = new ConsensusEngine({ threshold: 0.65 });

const result = engine.resolve('task-001', [
  vote('lead',       'LEAD',        'Approve the plan.', 0.90),
  vote('analyst',    'ANALYST',     'Approve the plan.', 0.83),
  vote('critic',     'CRITIC',      'Not yet.', 0.55),
  vote('synthesizer','SYNTHESIZER', 'Approve with edits.', 0.88),
]);

console.log(result.approved);      // true / false
console.log(result.approvalRatio); // e.g. 0.74
console.log(result.winner);        // highest-weighted approving vote
console.log(result.dissent);       // votes that came in under confidence floor
console.log(summarise(result));    // "[APPROVED] task=task-001 ratio=0.74 votes=4 dissent=0"
```

## Role Weights

Default weights are derived from Solfeggio frequencies:

| Role           | Weight |
|----------------|--------|
| SOVEREIGN      | 1.00   |
| LEAD           | 0.85   |
| SYNTHESIZER    | 0.80   |
| CRITIC         | 0.75   |
| ANALYST        | 0.70   |
| GUARDIAN       | 0.70   |
| DOMAIN_EXPERT  | 0.65   |
| BUILDER        | 0.60   |
| MEMORY_CURATOR | 0.55   |
| RESEARCHER     | 0.50   |

Override any weight at construction or at runtime:

```typescript
const engine = new ConsensusEngine({
  roleWeights: { MY_CUSTOM_ROLE: 0.95 },
});

engine.setRoleWeight('BUILDER', 0.72);
```

## Veto

Any role listed in `vetoRoles` (default: `['SOVEREIGN']`) will cause an automatic `REJECT` if its vote comes in below the confidence floor:

```typescript
const engine = new ConsensusEngine({
  vetoRoles: ['SOVEREIGN', 'GUARDIAN'],
  confidenceFloor: 0.4,
});
```

## API

### `ConsensusEngine`

```typescript
new ConsensusEngine(options?: {
  threshold?: number;        // Default: 0.6
  confidenceFloor?: number;  // Default: 0.4
  vetoRoles?: string[];      // Default: ['SOVEREIGN']
  roleWeights?: Record<string, number>;
})

engine.resolve(taskId: string, votes: AgentVote[]): ConsensusResult
engine.majority(votes: AgentVote[]): boolean
engine.setRoleWeight(role: string, weight: number): void
engine.getRoleWeight(role: string): number
engine.listWeights(): Array<{ role: string; weight: number }>
```

### `vote(agentId, role, content, confidence, reasoning?)`

Build an `AgentVote` quickly.

### `summarise(result)`

One-line log string from a `ConsensusResult`.

---

MIT License © ItsNotAILABS
