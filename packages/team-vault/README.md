# team-vault

> Tiered memory store for AI agent teams.

Four access tiers: **PUBLIC**, **SHARED**, **PRIVATE**, **SOVEREIGN**. TTL expiry, owner-gated reads, automatic eviction. Scoped agent accessors so each agent only touches what it should.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Install

```bash
npm install team-vault
```

## Quick Start

```typescript
import { Vault } from 'team-vault';

const vault = new Vault();

// Lead writes shared context (visible to all team members)
vault.write('lead', 'goal', 'Launch by Q3', 'SHARED');

// Analyst writes private working notes — 5-minute TTL
vault.write('analyst', 'scratch', { tokens: [...] }, 'PRIVATE', {
  ttlMs: 5 * 60_000,
});

// Sovereign writes a top-level directive (only SOVEREIGN/LEAD can read)
vault.write('sovereign', 'directive', 'Do not ship unvalidated.', 'SOVEREIGN');

// Anyone reads SHARED
const goal = vault.read('goal', { readerId: 'builder' });             // 'Launch by Q3'

// LEAD reads SOVEREIGN tier
const directive = vault.read('directive', {
  readerId: 'lead',
  readerRole: 'LEAD',
});                                                                     // 'Do not ship unvalidated.'

// BUILDER cannot read PRIVATE entry belonging to analyst
const blocked = vault.read('scratch', { readerId: 'builder' });       // undefined

// Sweep expired entries
const swept = vault.evict();
```

## Access Tiers

| Tier       | Who can read                                  |
|------------|-----------------------------------------------|
| `PUBLIC`   | Anyone (no auth required)                     |
| `SHARED`   | Any team member                               |
| `PRIVATE`  | Only the agent that wrote it                  |
| `SOVEREIGN`| Writer + any agent with role SOVEREIGN or LEAD|

## Scoped Agent Accessor

Give each agent its own accessor — it can only write entries attributed to itself:

```typescript
import { Vault, createAgentVault } from 'team-vault';

const vault = new Vault();
const analyst = createAgentVault('analyst', 'ANALYST', vault);

analyst.write('findings', { summary: '...' }, 'SHARED');
const goal = analyst.read('goal');    // reads with analyst's ID + role
analyst.list({ tier: 'SHARED' });     // all SHARED entries visible to analyst
```

## API

### `Vault`

```typescript
new Vault()

vault.write(writerId, key, value, tier?, options?): VaultEntry
vault.read<T>(key, options?): T | undefined
vault.has(key, options?): boolean
vault.delete(key, requesterId, requesterRole?): boolean
vault.update<T>(key, value, requesterId, requesterRole?): boolean
vault.list(options?): VaultEntry[]
vault.evict(): number
vault.size(): number
vault.stats(): { total, byTier, totalAccesses, expiredPending }
```

### `createAgentVault(agentId, role, vault)`

Returns a scoped accessor: `{ write, read, has, list, delete }`.

### `createVault()`

Returns a new `Vault` instance.

---

MIT License © ItsNotAILABS
