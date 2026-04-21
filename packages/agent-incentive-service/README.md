# agent-incentive-service

> Mechanism-design incentive structures for multi-agent AI coordination.

**Commercial License — BUSL-1.1 — ItsNotAILABS**

Production use requires a commercial license. See LICENSE for terms.
Contact ItsNotAILABS via authenticated channels.

---

## What it solves

Five classical incentive problems, applied to AI agent teams:

| Problem | Classical form | AI agent form | Structural solution |
|---------|---------------|---------------|-------------------|
| Principal-Agent | Agent pursues own interests | Agents optimize locally, diverge from team goal | Role-scope enforcement |
| Free-Rider | Consume without contributing | Low-effort outputs carry equal weight | Confidence-weighted voting |
| Holdup | Upstream exploits downstream investment | Agents optimize for appearance, not downstream utility | Stage gates with output specs |
| Asymmetric Information | Hidden reasoning, hidden quality | Black-box outputs with no reasoning chain | Mandatory reasoning transparency |
| Coordination Game | Multiple valid equilibria, no focal point | Multi-agent deadlock or incoherent composite | Role-authority focal point selection |

---

## Quick Start

```typescript
import { IncentiveService, createStandardService, STANDARD_FIVE_ROLES } from 'agent-incentive-service';

// Create service with default 5-role team
const service = createStandardService();

// Or configure your own roles
const service = new IncentiveService({
  roles: [
    {
      id: 'analyst',
      name: 'Analyst',
      authorityDomains: ['empirical-claim', 'data-interpretation'],
      baseWeight: 0.75,
      scope: [],
    },
    {
      id: 'critic',
      name: 'Critic',
      authorityDomains: ['risk-assessment', 'flaw-detection'],
      baseWeight: 0.75,
      scope: ['risk-assessment', 'flaw-detection'],
    },
  ],
  confidenceFloor: 0.72,
  enableReputation: true,
});

// Each agent produces an output
const outputs = [
  {
    roleId: 'analyst',
    agentId: 'a-001',
    decisionId: 'task-42',
    decisionType: 'empirical-claim',
    content: 'Market share is 34% based on Q3 data.',
    confidence: 0.88,
    reasoning: 'Derived from three independent data sources with consistent results.',
    timestamp: new Date().toISOString(),
  },
  {
    roleId: 'critic',
    agentId: 'c-001',
    decisionId: 'task-42',
    decisionType: 'risk-assessment',  // outside analyst scope for this decision
    content: 'Methodology is sound. No significant risks identified.',
    confidence: 0.82,
    reasoning: 'Reviewed data sources and found no conflicts.',
    timestamp: new Date().toISOString(),
  },
];

// Resolve to consensus
const result = service.resolve('task-42', 'empirical-claim', outputs);

console.log(result.approved);      // true
console.log(result.winner.content); // "Market share is 34%..."
console.log(result.dissent);        // critic's output (different decision type)

// Update reputation after outcome is confirmed
service.updateReputation('analyst', 'a-001', true);  // correct
service.updateReputation('critic', 'c-001', false);  // missed this decision type
```

---

## Stage Gates

Enforce output specifications at each pipeline stage:

```typescript
const service = new IncentiveService({
  roles,
  stageGates: [
    {
      stage: 'research',
      requiredFields: ['content', 'reasoning'],
      maxLength: 2000,
      minConfidence: 0.65,
    },
    {
      stage: 'synthesis',
      requiredFields: ['content', 'reasoning', 'metadata'],
      maxLength: 500,
      minConfidence: 0.80,
    },
  ],
});

const gateResult = service.enforceStageGate('research', output);
if (!gateResult.passed) {
  console.log(gateResult.violations); // ['Missing required field: reasoning']
}
```

---

## Formal Specification

The effective weight of agent *i*'s output on decision *d*:

```
W_i(d) = w_i × (1 + α(d, a_i) × (m - 1)) × c_i × rep_i
```

Where:
- `w_i` = role base weight
- `α(d, a_i)` = 1 if agent has authority over decision domain d, else 0
- `m` = authority multiplier (default: 2.0)
- `c_i` = stated confidence [0, 1]
- `rep_i` = reputation weight multiplier [0.25, 2.0]

Consensus winner: `argmax W_i(d)`, subject to `W_winner ≥ τ` (confidence floor).

---

## API

```typescript
// Core service
new IncentiveService(options)
service.resolve(decisionId, decisionType, outputs)     → ConsensusResult
service.enforceStageGate(stage, output)                → { passed, violations }
service.updateReputation(roleId, agentId, accurate)    → ReputationRecord
service.getReputation(roleId, agentId)                 → ReputationRecord | undefined
service.getAllReputations()                             → ReputationRecord[]
service.getAuditLog()                                  → AuditEntry[]

// Factory
createStandardService(overrides?)                      → IncentiveService
STANDARD_FIVE_ROLES                                    → AgentRole[]
```

---

## Foundation Paper

This package implements the framework described in:

**"Incentive Structures for Multi-Agent AI Systems"**
ItsNotAILABS, 2026
[papers/AGENT_INCENTIVE_STRUCTURES.md](../../papers/AGENT_INCENTIVE_STRUCTURES.md)

---

*Commercial license required for production use.*
*Contact ItsNotAILABS via authenticated channels.*
*BUSL-1.1 → converts to MIT on 2029-04-21.*
