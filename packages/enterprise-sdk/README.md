# Enterprise SDK
## Business Integration Layer for MEDINA Platform

**Package**: `@medina/enterprise-sdk`
**Version**: `1.0.0`
**Language**: TypeScript
**Platform**: Node.js + ICP

---

## Overview

The Enterprise SDK provides the complete business integration layer for deploying MEDINA organisms in production enterprise environments. It includes φ-scaled workforce orchestration, OMNIS™ governance voting, organizational memory management, audit trails, and compliance tooling.

---

## Features

✅ **Workforce Orchestration** — 8 φ-scaled workforce types (W-ANALYST to W-OPERATIONS)
✅ **OMNIS™ Governance** — 43-core voting consensus engine
✅ **Sovereign Heart™** — Dual cardiac architecture for high-availability
✅ **Organizational Memory** — Replay-grade evidence with Fibonacci indexing
✅ **Audit Engine** — Complete tamper-proof audit trail
✅ **Compliance Tools** — Regulatory reporting and policy enforcement
✅ **Company Onboarding** — Automated enterprise setup
✅ **Role-Based Access** — Permissions and access control

---

## Installation

```bash
npm install @medina/enterprise-sdk
```

---

## Quick Start

### 1. Initialize Enterprise Client

```typescript
import { MedinaEnterprise } from '@medina/enterprise-sdk';

const enterprise = new MedinaEnterprise({
    canisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    host: 'https://ic0.app',
    organization: {
        name: 'Acme Corp',
        tier: 'enterprise',
        licenseKey: process.env.MEDINA_LICENSE_KEY,
    },
});

await enterprise.connect();
console.log('MEDINA Enterprise connected ✓');
```

### 2. Spawn Workforce Agents

```typescript
// Spawn all 8 workforce types (φ-scaled cycle allocation)
const workforce = await enterprise.workforce.spawnAll();

console.log('Active workforce:');
workforce.forEach(agent => {
    console.log(`  ${agent.type}: ${agent.cycles}M cycles`);
});
// W-ANALYST:    1.000M cycles (φ⁰)
// W-STRATEGIST: 1.618M cycles (φ¹)
// W-BUILDER:    2.618M cycles (φ²)
// W-GOVERNANCE: 2.618M cycles (φ²)
// W-MEMORY:     4.236M cycles (φ³)
// W-RISK:       0.618M cycles (φ⁻¹)
// W-PROJECTION: 1.618M cycles (φ¹)
// W-OPERATIONS: 1.618M cycles (φ¹)

// Invoke specific workforce type
const analysis = await enterprise.workforce.invoke({
    type: 'W-ANALYST',
    task: 'quarterly-risk-assessment',
    data: { quarter: 'Q2-2026', department: 'Finance' },
});
```

### 3. OMNIS™ Governance Voting

```typescript
// Submit governance proposal through OMNIS 43-core voting
const proposal = await enterprise.governance.propose({
    title: 'Expand into European markets',
    description: 'Open EMEA operations by Q4 2026',
    type: 'strategic-initiative',
    requiredConsensus: 0.618, // φ⁻¹ threshold
});

console.log('Proposal submitted:', proposal.id);
console.log('OMNIS cores voting:', proposal.coreCount); // 43

// Monitor voting progress
enterprise.governance.subscribe('vote', (update) => {
    console.log(`Votes: ${update.for}/${update.total} (${update.consensus}%)`);
    if (update.passed) {
        console.log('Proposal PASSED — OMNIS consensus reached');
    }
});
```

### 4. Organizational Memory

```typescript
// Store organizational memory with Fibonacci priority
await enterprise.memory.store({
    key: 'strategic-decision-2026-Q2',
    value: {
        decision: 'Expand to EMEA',
        rationale: 'Market analysis shows 40% growth potential',
        approvedBy: ['CEO', 'Board', 'OMNIS-43'],
        timestamp: Date.now(),
    },
    priority: 'fibonacci-13', // High priority (Fib[7]=13)
    category: 'strategic',
});

// Query organizational memory with time range
const history = await enterprise.memory.query({
    category: 'strategic',
    timeRange: { start: '2026-01-01', end: '2026-12-31' },
    limit: 100,
});

// Replay decision for audit
const replay = await enterprise.memory.replay('strategic-decision-2026-Q2');
console.log('Decision audit trail:', replay.events);
```

### 5. Audit & Compliance

```typescript
// Generate compliance report
const report = await enterprise.compliance.generateReport({
    type: 'SOX', // Sarbanes-Oxley
    period: { start: '2026-01-01', end: '2026-03-31' },
    format: 'pdf',
});

// Get audit trail
const audit = await enterprise.audit.getTrail({
    entityId: 'workforce-agent-W-ANALYST-001',
    timeRange: { start: lastWeek, end: now },
    eventTypes: ['task-invoked', 'decision-made', 'memory-stored'],
});

// Real-time compliance monitoring
enterprise.compliance.monitor({
    policy: 'data-sovereignty',
    onViolation: async (violation) => {
        console.error('COMPLIANCE VIOLATION:', violation);
        await enterprise.governance.escalate(violation);
    },
});
```

### 6. Sovereign Heart™ High Availability

```typescript
// Configure dual cardiac system for 99.99% uptime
await enterprise.sovereignty.configureHeartSystem({
    primary: {
        canisterId: 'primary-organism-canister-id',
        heartbeatMs: 873, // φ⁴ × (1000/7.83)
    },
    secondary: {
        canisterId: 'backup-organism-canister-id',
        heartbeatMs: 873,
        failoverThreshold: 3, // 3 missed beats → failover
    },
    neurochemicals: {
        dopamine: 1.0,    // Reward and motivation
        serotonin: 1.0,   // Stability and wellbeing
        cortisol: 0.2,    // Stress response (low)
        oxytocin: 0.8,    // Social bonding
        norepinephrine: 0.6,
        acetylcholine: 1.0,
        gaba: 0.9,
        glutamate: 0.7,
    },
});

enterprise.sovereignty.subscribe('heartbeat', (beat) => {
    console.log(`♥ Beat #${beat.count} | Active: ${beat.activeHeart}`);
});
```

---

## Workforce Types Reference

| Type | Cycles | φ-Scale | Primary Function |
|------|--------|---------|-----------------|
| W-ANALYST | 1.000M | φ⁰ | Data analysis, insights |
| W-STRATEGIST | 1.618M | φ¹ | Strategic planning |
| W-BUILDER | 2.618M | φ² | Implementation, delivery |
| W-GOVERNANCE | 2.618M | φ² | Policy, compliance |
| W-MEMORY | 4.236M | φ³ | Knowledge management |
| W-RISK | 0.618M | φ⁻¹ | Risk assessment |
| W-PROJECTION | 1.618M | φ¹ | Forecasting |
| W-OPERATIONS | 1.618M | φ¹ | Daily operations |
| **Total** | **15.944M** | **≈10×φ** | |

---

## OMNIS™ Architecture

The OMNIS™ 43-core voting system provides enterprise-grade consensus:

```
OMNIS™ 43-Core Voting System
├── Ring 1 (VELA): 7 cores  — Foundation layer
├── Ring 2 (NOVA): 12 cores — Intelligence layer
├── Ring 3 (OMNI): 13 cores — Emergence layer
├── Ring 4 (APEX): 8 cores  — Synthesis layer
└── Ring 5 (SOVEREIGN): 3 cores — Final judgment

Consensus threshold: φ⁻¹ = 0.618 (61.8%)
Emergency threshold: φ² = 2.618 (super-majority)
```

---

## API Reference

### Workforce API
- `spawnAll()` — Spawn all 8 workforce types
- `spawn(type)` — Spawn specific workforce type
- `invoke(request)` — Invoke workforce task
- `getCycleAllocation(type)` — Get cycle budget
- `subscribe(event, callback)` — Monitor workforce events

### Governance API
- `propose(proposal)` — Submit OMNIS voting proposal
- `vote(proposalId, decision)` — Cast vote
- `getConsensus(proposalId)` — Get current consensus
- `escalate(issue)` — Emergency escalation
- `subscribe(event, callback)` — Monitor governance

### Memory API
- `store(memory)` — Store with Fibonacci priority
- `get(key)` — Retrieve memory
- `query(criteria)` — Search memories
- `replay(key)` — Replay with full audit trail

### Compliance API
- `generateReport(params)` — Generate compliance report
- `monitor(policy)` — Real-time policy monitoring
- `validateAction(action)` — Pre-validate for compliance
- `getViolations(timeRange)` — Get violation history

### Sovereignty API
- `configureHeartSystem(config)` — Setup dual cardiac
- `getHeartStatus()` — Get Sovereign Heart™ status
- `triggerFailover()` — Manual failover
- `subscribe(event, callback)` — Monitor heartbeat

---

## Examples

See `/examples` directory for:
- **workforce-dashboard**: Real-time workforce monitoring dashboard
- **governance-engine**: Production OMNIS™ governance integration

---

## Production Deployment

```typescript
// Production configuration
const enterprise = new MedinaEnterprise({
    canisterId: process.env.ORGANISM_CANISTER_ID,
    host: process.env.ICP_HOST || 'https://ic0.app',
    organization: {
        name: process.env.ORG_NAME,
        tier: 'enterprise',
        licenseKey: process.env.MEDINA_LICENSE_KEY,
    },
    // High availability
    highAvailability: {
        enabled: true,
        primaryCanister: process.env.PRIMARY_CANISTER_ID,
        backupCanister: process.env.BACKUP_CANISTER_ID,
    },
    // Observability
    telemetry: {
        enabled: true,
        endpoint: process.env.TELEMETRY_ENDPOINT,
        sampleRate: 1.0,
    },
    // Security
    security: {
        encryptMemory: true,
        auditAllActions: true,
        dataResidency: 'US', // Sovereign data residency
    },
});
```

---

## License

**Proprietary** — Professional and Enterprise tiers available

Starting at **$999/month**. Contact sales@medinatech.com.

---

**MEDINA TECH | ALFREDO MEDINA HERNANDEZ | DALLAS TX | 2026**

**COPYRIGHT © 2024-2026 ALFREDO MEDINA HERNANDEZ. ALL RIGHTS RESERVED.**
