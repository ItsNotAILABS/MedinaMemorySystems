# Client SDK
## TypeScript/JavaScript Client Library for MEDINA

**Package**: `@medina/client-sdk`
**Version**: `1.0.0`
**Language**: TypeScript/JavaScript
**Platform**: Browser + Node.js

---

## Overview

The Client SDK provides a type-safe, ergonomic interface for interacting with MEDINA organisms from web applications and Node.js services. Includes real-time subscriptions, automatic retry, and φ-harmonic timing utilities.

---

## Features

✅ **Type-Safe API** — Full TypeScript support
✅ **Real-Time** — WebSocket subscriptions
✅ **Automatic Retry** — Intelligent reconnection
✅ **φ-Harmonic Timing** — Golden ratio utilities
✅ **Request Validation** — Schema-based validation
✅ **Browser + Node** — Universal JavaScript

---

## Installation

```bash
npm install @medina/client-sdk
```

---

## Quick Start

### 1. Initialize Client

```typescript
import { MedinaClient } from '@medina/client-sdk';

const client = new MedinaClient({
    canisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    host: 'https://ic0.app',
    identity: yourIdentity // Optional
});
```

### 2. Organism Operations

```typescript
// Pulse the organism (heartbeat)
const beat = await client.organism.pulse();
console.log('Beat count:', beat);

// Get organism state
const state = await client.organism.getState();
console.log('Consciousness:', state.consciousness);
console.log('φ:', state.phi);

// Recognize pattern
const recognized = await client.organism.recognize({
    type: 'spatial',
    data: patternData
});
```

### 3. Memory Operations

```typescript
// Store memory
await client.memory.store({
    key: 'important-fact',
    value: 'φ = 1.618033988749895',
    timestamp: Date.now(),
    priority: 'fibonacci-13' // High priority
});

// Retrieve memory
const memory = await client.memory.get('important-fact');
console.log('Retrieved:', memory.value);

// Query memories
const memories = await client.memory.query({
    timeRange: { start: yesterday, end: now },
    tags: ['mathematics', 'constants']
});
```

### 4. Model Orchestration

```typescript
// Invoke workforce model
const result = await client.models.invoke({
    workforce: 'W-ANALYST',
    task: 'analyze-data',
    data: { ... },
    cycleAllocation: 1.0e6 // φ⁰
});

// Orchestrate multiple models
const results = await client.models.orchestrate([
    { workforce: 'W-ANALYST', task: 'analyze' },
    { workforce: 'W-STRATEGIST', task: 'strategize' },
    { workforce: 'W-BUILDER', task: 'build' }
]);
```

### 5. Governance Operations

```typescript
// Submit proposal
const proposal = await client.governance.propose({
    title: 'Add new workforce type',
    description: '...',
    type: 'architecture-change'
});

// Vote on proposal
await client.governance.vote({
    proposalId: proposal.id,
    vote: 'yes',
    reasoning: 'Improves scalability'
});

// Get governance state
const state = await client.governance.getState();
```

### 6. Replay & Audit

```typescript
// Get replay history
const history = await client.replay.getHistory({
    timeRange: { start: lastWeek, end: now },
    eventTypes: ['memory-store', 'model-invoke']
});

// Replay specific event
const replayResult = await client.replay.replayEvent(eventId);

// Generate audit report
const audit = await client.replay.generateAudit({
    timeRange: { start: lastMonth, end: now },
    format: 'pdf'
});
```

---

## Real-Time Subscriptions

### Subscribe to organism heartbeat
```typescript
const unsubscribe = client.organism.subscribe('pulse', (beat) => {
    console.log('Heartbeat:', beat);
    console.log('BPM:', 68.7);
});

// Unsubscribe later
unsubscribe();
```

### Subscribe to memory updates
```typescript
client.memory.subscribe('store', (event) => {
    console.log('New memory:', event.key, event.value);
});
```

### Subscribe to governance events
```typescript
client.governance.subscribe('proposal', (proposal) => {
    console.log('New proposal:', proposal.title);
});
```

---

## φ-Harmonic Utilities

### Golden Ratio Calculations
```typescript
import { phi } from '@medina/client-sdk/utils';

const phiValue = phi.PHI; // 1.6180339887498948482
const phiSquared = phi.squared(); // φ²
const phiInverse = phi.inverse(); // 1/φ

// φ-normalize value
const normalized = phi.normalize(100); // 161.803...

// Get Fibonacci number
const fib13 = phi.fibonacci(13); // 233
```

### Frequency Utilities
```typescript
import { frequencies } from '@medina/client-sdk/utils';

// Schumann resonance
const fundamental = frequencies.schumann.fundamental; // 7.83 Hz

// Solfeggio frequencies
const loveFreq = frequencies.solfeggio.love; // 528 Hz

// Brain waves
const alpha = frequencies.brainWaves.alpha; // 8-13 Hz
```

### Timing Utilities
```typescript
import { timing } from '@medina/client-sdk/utils';

// Heartbeat interval
const heartbeat = timing.HEARTBEAT_MS; // 873ms

// φ-scaled delays
await timing.delay(timing.phi.scale(1000)); // 1618ms

// Fibonacci-timed execution
await timing.fibonacciInterval(5, async () => {
    console.log('Executed at Fibonacci[5] = 5ms');
});
```

---

## Error Handling

```typescript
import { MedinaError, ErrorCode } from '@medina/client-sdk';

try {
    await client.organism.pulse();
} catch (error) {
    if (error instanceof MedinaError) {
        switch (error.code) {
            case ErrorCode.CANISTER_UNREACHABLE:
                console.error('Organism offline');
                break;
            case ErrorCode.INSUFFICIENT_CYCLES:
                console.error('Not enough cycles');
                break;
            case ErrorCode.INVALID_PATTERN:
                console.error('Pattern unrecognized');
                break;
        }
    }
}
```

---

## Advanced Configuration

```typescript
const client = new MedinaClient({
    canisterId: 'xxx',
    host: 'https://ic0.app',

    // Retry configuration
    retry: {
        maxAttempts: 3,
        backoff: 'exponential',
        baseDelay: 1000
    },

    // Timeout configuration
    timeout: {
        query: 5000,
        update: 30000
    },

    // WebSocket configuration
    websocket: {
        reconnect: true,
        heartbeat: 873 // φ⁴ × (1000/7.83)
    },

    // φ-harmonic mode
    phiMode: true // All timings φ-scaled
});
```

---

## API Reference

### Organism API
- `pulse()` — Trigger heartbeat
- `getState()` — Get organism state
- `recognize(pattern)` — Pattern recognition
- `subscribe(event, callback)` — Real-time events

### Memory API
- `store(memory)` — Store memory
- `get(key)` — Retrieve memory
- `query(criteria)` — Search memories
- `subscribe(event, callback)` — Memory events

### Models API
- `invoke(request)` — Invoke single model
- `orchestrate(requests)` — Multi-model orchestration
- `getWorkforce()` — List workforce types

### Governance API
- `propose(proposal)` — Submit proposal
- `vote(vote)` — Vote on proposal
- `getState()` — Get governance state

### Replay API
- `getHistory(query)` — Get event history
- `replayEvent(id)` — Replay specific event
- `generateAudit(params)` — Generate audit report

---

## Examples

See `/examples` directory for:
- Basic client setup
- Real-time subscriptions
- φ-harmonic timing
- Error handling
- Advanced configuration

---

## TypeScript Support

Full type definitions included:

```typescript
import type {
    OrganismState,
    Memory,
    ModelRequest,
    Proposal,
    ReplayEvent
} from '@medina/client-sdk/types';
```

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

---

## Node.js Support

- Node.js 18+
- Node.js 20+ (recommended)

---

## License

**Proprietary** — Commercial licensing available

---

## Support

- **Documentation**: `/docs`
- **Examples**: `/examples`
- **Issues**: GitHub Issues
- **Commercial**: contact@medinatech.com

---

**Version**: 1.0.0

**MEDINA TECH | ALFREDO MEDINA HERNANDEZ | DALLAS TX | 2026**

**COPYRIGHT © 2024-2026 ALFREDO MEDINA HERNANDEZ. ALL RIGHTS RESERVED.**
