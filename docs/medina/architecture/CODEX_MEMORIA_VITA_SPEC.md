# CODEX MEMORIA VITA — Canonical Implementation Specification

Classification: SOVEREIGN_DOCTRINE
Version: 1.0.0
Status: ACTIVE

---

## Overview

This document establishes the canonical implementation specification for the four foundational domains of the MEDINA sovereign intelligence architecture:

1. **Autobot Codex** — Constructive, lawful agent classification
2. **Decepticon Codex** — Adversarial, chaos-domain agent classification
3. **Semper Memoria** — Eternal memory lineage system
4. **Vita Aeterna** — Immortal organism runtime lifecycle

These domains work in concert under the sovereign governance layer, ensuring all agents, memory operations, and lifecycle transitions remain auditable, reversible, and doctrine-aligned.

---

## §1 AUTOBOT CODEX

### 1.1 Definition

Autobots are **constructive agents** operating within bounded, lawful domains. Every Autobot must satisfy four fundamental laws before any action:

| Law | Name | Enforcement |
|-----|------|-------------|
| A-1 | **Coherence** | All outputs must maintain semantic and doctrinal coherence with existing memory state |
| A-2 | **Reversibility** | Every mutation must be reversible via lineage rollback |
| A-3 | **Explainability** | All reasoning must be audit-loggable with causal chains |
| A-4 | **Containment** | Actions are bounded to authorized scopes; no privilege escalation |

### 1.2 Autobot Classes

```typescript
type AutobotClass =
  | 'PRIME'        // Sovereign-level builder; full doctrine access
  | 'GUARDIAN'     // Gate enforcement and security
  | 'ARCHITECT'    // Memory structure and lineage design
  | 'CURATOR'      // Memory curation and retention policy
  | 'ANALYST'      // Read-only analysis and projection
  | 'OPERATOR'     // Workflow execution within bounds
  | 'SCOUT'        // External reconnaissance (sandboxed output)
```

### 1.3 Spawn Rules

- All Autobots must be spawned through `VitaAeterna.spawn()` with explicit class and scope
- Each spawn generates a unique `autobotId` linked to a lineage chain
- Maximum concurrent Autobots per class enforced by quota system
- Promotion from lower to higher class requires governance proposal

---

## §2 DECEPTICON CODEX

### 2.1 Definition

Decepticons are **adversarial agents** operating exclusively within **chaos domains**. They exist to stress-test, probe vulnerabilities, and surface edge cases — but under strict containment:

| Law | Name | Enforcement |
|-----|------|-------------|
| D-1 | **Sandboxing** | All actions confined to isolated sandbox; never touch canonical state |
| D-2 | **Telemetry** | Every action emits immutable telemetry to audit log |
| D-3 | **Non-Persistence** | Chaos-domain mutations auto-expire; no canonical persistence |
| D-4 | **Counterpart** | Every Decepticon class has a mandatory Autobot counterpart |

### 2.2 Decepticon Classes

```typescript
type DecepticonClass =
  | 'TRICKSTER'    // Input mutation and edge-case generation
  | 'PHANTOM'      // State hallucination probing
  | 'CRAWLER'      // Aggressive boundary scanning
  | 'DISRUPTOR'    // Concurrent stress testing
  | 'MIRAGE'       // False response generation for security testing
```

### 2.3 Counterpart Mapping

| Decepticon | Autobot Counterpart |
|------------|---------------------|
| TRICKSTER  | GUARDIAN            |
| PHANTOM    | ARCHITECT           |
| CRAWLER    | SCOUT               |
| DISRUPTOR  | OPERATOR            |
| MIRAGE     | ANALYST             |

### 2.4 Chaos Domain Guarantees

- Chaos domains are ephemeral sandboxes with TTL ≤ 1 hour
- All chaos mutations isolated to `chaos://` namespace
- Canonical memory layer (`sovereign://`) is read-only from chaos perspective
- Telemetry emitted to `CHAOS_AUDIT_LOG` for every action

---

## §3 SEMPER MEMORIA — Eternal Memory System

### 3.1 Core Principles

"*Semper Memoria*" — memory that persists forever through lineage.

Every memory object in MEDINA:
1. Has a **lineage chain** tracing its origin to the sovereign root
2. Supports **fork/merge** operations with conflict detection
3. Applies **compression policies** for retention efficiency
4. Enforces **access scopes** per tier/role

### 3.2 Data Model

```typescript
interface SemperMemoriaLineage {
  id: string;                    // Unique lineage identifier
  rootId: string;                // Ultimate ancestor
  parentId?: string;             // Direct parent (if forked)
  forkPoint?: string;            // ISO timestamp of fork
  mergedFrom?: string[];         // IDs merged into this lineage
  depth: number;                 // Distance from root
  status: 'active' | 'archived' | 'merged' | 'pruned';
}

interface SemperMemoriaShard {
  id: string;
  lineageId: string;
  content: string;
  contentHash: string;           // SHA-256 of content
  compressionLevel: 0 | 1 | 2 | 3;  // 0=raw, 3=max compression
  accessScope: AccessScope;
  ttl?: number;                  // Seconds until auto-prune (null = eternal)
  createdAt: string;
  createdBy: string;             // Agent or user ID
}

type AccessScope =
  | 'public'                     // Any reader
  | 'enterprise'                 // Authenticated enterprise
  | 'internal'                   // Platform operators
  | 'sovereign'                  // Doctrine-bound only
  | 'chaos'                      // Chaos-domain only (ephemeral)
```

### 3.3 Operations

| Operation | Description | Law Check |
|-----------|-------------|-----------|
| `createLineage` | Initialize a new sovereign lineage from root | A-1, A-2 |
| `forkLineage` | Create a branched lineage from existing | A-1, A-2 |
| `mergeLineage` | Combine two lineages with conflict report | A-1, A-2, A-3 |
| `appendShard` | Add memory shard to lineage | A-1, A-4 |
| `getShard` | Retrieve shard by ID | A-4 |
| `summarizeLineage` | Compress and summarize lineage content | A-1, A-3 |
| `grantAccess` | Extend access scope to entity | A-4 |
| `revokeAccess` | Remove access scope from entity | A-4 |
| `setRetention` | Configure compression/TTL policy | A-1, A-2 |

### 3.4 Compression Levels

| Level | Name | Retention | Use Case |
|-------|------|-----------|----------|
| 0 | RAW | ≤ 24h hot | Active working memory |
| 1 | LIGHT | ≤ 7d warm | Recent context |
| 2 | STANDARD | ≤ 90d cold | Historical reference |
| 3 | ARCHIVE | Eternal | Doctrinal law, lineage roots |

---

## §4 VITA AETERNA — Immortal Runtime Lifecycle

### 4.1 Core Principles

"*Vita Aeterna*" — the organism lives forever through regeneration.

Every organism kernel in MEDINA:
1. Follows a **lifecycle**: template → spawn → growth → maturity → retirement
2. Has **substrate quotas** for resource governance
3. Enforces **CPL-L** (Constitutional Programming Language — Laws) at runtime
4. Integrates with **Semper Memoria** for state persistence

### 4.2 Lifecycle States

```typescript
type OrganismLifecycleState =
  | 'template'     // Blueprint, not yet instantiated
  | 'spawning'     // Initialization in progress
  | 'growth'       // Active development, learning
  | 'maturity'     // Stable operation, full capabilities
  | 'retiring'     // Graceful shutdown, state transfer
  | 'archived'     // Preserved for lineage; no longer active
```

### 4.3 Substrate Quotas

```typescript
interface SubstrateQuota {
  maxConcurrentAgents: number;           // Per-class agent limit
  memoryShardLimit: number;              // Max shards per lineage
  cpuCyclesPerBeat: number;              // Compute budget per heartbeat
  networkCallsPerMinute: number;         // External call rate limit
  chaosDomainTTL: number;                // Max chaos sandbox lifetime (ms)
}

const DEFAULT_QUOTAS: Record<string, SubstrateQuota> = {
  PUBLIC: {
    maxConcurrentAgents: 3,
    memoryShardLimit: 100,
    cpuCyclesPerBeat: 1000,
    networkCallsPerMinute: 10,
    chaosDomainTTL: 300_000,  // 5 min
  },
  ENTERPRISE: {
    maxConcurrentAgents: 10,
    memoryShardLimit: 1000,
    cpuCyclesPerBeat: 10_000,
    networkCallsPerMinute: 100,
    chaosDomainTTL: 900_000,  // 15 min
  },
  SOVEREIGN: {
    maxConcurrentAgents: 50,
    memoryShardLimit: 10_000,
    cpuCyclesPerBeat: 100_000,
    networkCallsPerMinute: 1000,
    chaosDomainTTL: 3_600_000,  // 1 hour
  },
};
```

### 4.4 CPL-L Enforcement

Constitutional Programming Language — Laws (CPL-L) are checked at every state transition:

1. **Pre-spawn check**: Validate template integrity and quota availability
2. **Growth check**: Ensure learning stays within doctrine bounds
3. **Maturity check**: Verify all Autobot laws before full activation
4. **Retirement check**: Confirm state transfer to lineage before archive

### 4.5 Memory Fabric Integration

Vita Aeterna organisms bind to Semper Memoria through:

```typescript
interface OrganismMemoryBinding {
  organismId: string;
  lineageId: string;           // Primary lineage for this organism
  shardIds: string[];          // Active shards in working memory
  snapshotPolicy: 'on-beat' | 'on-mutation' | 'manual';
  lastSnapshot: string;        // ISO timestamp
}
```

---

## §5 GOVERNANCE INTEGRATION

### 5.1 Codex Law Checks

Every agent action passes through governance validation:

```typescript
interface CodexLawCheckResult {
  passed: boolean;
  law: string;                 // e.g., 'A-1' or 'D-2'
  agent: string;               // Agent ID
  action: string;              // Attempted action
  reason: string;              // Pass/fail explanation
  timestamp: string;
  auditId: string;             // Reference to audit log entry
}
```

### 5.2 Gate Mapping

| Gate | Codex Enforcement |
|------|-------------------|
| A | Autobot spawn/promotion approval |
| B | Memory write/delete authorization |
| C | Sovereign broadcast and Decepticon deployment |

### 5.3 Audit Events

All codex operations emit audit events:

```typescript
type CodexAuditAction =
  | 'AUTOBOT_SPAWN'
  | 'AUTOBOT_RETIRE'
  | 'AUTOBOT_LAW_CHECK'
  | 'DECEPTICON_DEPLOY'
  | 'DECEPTICON_TELEMETRY'
  | 'CHAOS_DOMAIN_CREATE'
  | 'CHAOS_DOMAIN_EXPIRE'
  | 'LINEAGE_CREATE'
  | 'LINEAGE_FORK'
  | 'LINEAGE_MERGE'
  | 'SHARD_APPEND'
  | 'ACCESS_GRANT'
  | 'ACCESS_REVOKE'
  | 'LIFECYCLE_TRANSITION'
  | 'QUOTA_EXCEEDED';
```

---

## §6 API SURFACE

### 6.1 Semper Memoria API

**POST /api/memory**

| Action | Body | Returns |
|--------|------|---------|
| `lineage.create` | `{ name }` | `SemperMemoriaLineage` |
| `lineage.fork` | `{ parentId }` | `SemperMemoriaLineage` |
| `lineage.merge` | `{ sourceId, targetId }` | `{ lineage, conflicts }` |
| `shard.append` | `{ lineageId, content, scope }` | `SemperMemoriaShard` |
| `shard.get` | `{ shardId }` | `SemperMemoriaShard` |
| `lineage.summarize` | `{ lineageId }` | `{ summary, shardCount }` |
| `access.grant` | `{ lineageId, entity, scope }` | `AccessGrant` |
| `access.revoke` | `{ lineageId, entity }` | `boolean` |

### 6.2 Vita Aeterna API

**POST /api/agents**

| Action | Body | Returns |
|--------|------|---------|
| `organism.spawn` | `{ templateId, class, scope }` | `OrganismInstance` |
| `organism.retire` | `{ organismId }` | `RetirementResult` |
| `organism.transition` | `{ organismId, targetState }` | `TransitionResult` |
| `quota.check` | `{ tier }` | `SubstrateQuota` |
| `chaos.create` | `{ decepticonClass, ttl }` | `ChaosDomain` |
| `chaos.telemetry` | `{ domainId }` | `TelemetryLog[]` |

---

## §7 IMPLEMENTATION FILES

| Component | File Path |
|-----------|-----------|
| Types | `src/types/index.ts` (extended) |
| Semper Memoria Engine | `src/lib/semperMemoriaEngine.ts` |
| Vita Aeterna Runtime | `src/lib/vitaAeternaRuntime.ts` |
| Codex Governance | `src/lib/governanceEngine.ts` (extended) |
| Agent Engine | `src/lib/activatedAgentEngine.ts` (extended) |
| Memory API | `src/app/api/memory/route.ts` (extended) |
| Agent API | `src/app/api/agents/route.ts` (extended) |
| Tests | `src/__tests__/semperMemoria.test.ts` |
| Tests | `src/__tests__/vitaAeterna.test.ts` |
| Tests | `src/__tests__/codexLaws.test.ts` |

---

## §8 DOCTRINE ALIGNMENT

This specification aligns with:

- **RECITAL_PLUS_ONE**: Lineage chains amplify memory through beats
- **Gate A/B/C**: All operations gated by sovereign governance
- **Non-collapse ontology**: Codex/Memoria/Vita remain distinct layers
- **Dual-read**: Semantic + resonance always on for memory queries
- **Four-register**: Founder/Builder/Organism/External artifact emission

---

*Finis documentum. Lex manet. Memoria aeterna est.*
