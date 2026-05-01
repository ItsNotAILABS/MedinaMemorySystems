# Protocol Adapters
## Multi-Protocol Bridge for MEDINA Organisms

**Package**: `@medina/protocol-adapters`
**Version**: `1.0.0`
**Language**: TypeScript
**Platform**: Node.js + Browser

---

## Overview

The Protocol Adapters package provides bridge modules that connect MEDINA organisms to any external system or protocol. It implements the Wave Router frequency multiplexing architecture to route data across 7 protocol channels using φ-harmonic frequency assignments.

---

## Supported Protocols

| Protocol | Module | Use Case |
|----------|--------|----------|
| **ICP** | `IcpAdapter` | Internet Computer native calls |
| **HTTP/REST** | `HttpAdapter` | REST API integration |
| **WebSocket** | `WsAdapter` | Real-time bidirectional |
| **GraphQL** | `GraphQLAdapter` | Query-based access |
| **gRPC** | `GrpcAdapter` | High-performance RPC |
| **MQTT** | `MqttAdapter` | IoT and messaging |
| **AMQP** | `AmqpAdapter` | Enterprise message queues |

---

## Features

✅ **Wave Router** — Frequency-multiplexed routing across all protocols
✅ **φ-Harmonic Channels** — Golden ratio frequency assignment
✅ **Auto-Reconnect** — Intelligent retry with φ-backoff
✅ **Protocol Translation** — Seamless message format conversion
✅ **Load Balancing** — φ-scaled request distribution
✅ **Circuit Breaker** — Automatic failure isolation
✅ **Observable** — Full telemetry and tracing

---

## Installation

```bash
npm install @medina/protocol-adapters
```

---

## Quick Start

### Wave Router (All Protocols)

```typescript
import { WaveRouter } from '@medina/protocol-adapters';

// Initialize the Wave Router — frequency multiplexing for all protocols
const router = new WaveRouter({
    organism: {
        canisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
        host: 'https://ic0.app',
    },
    channels: {
        icp:       { frequency: 7.83 },   // Schumann fundamental
        http:      { frequency: 14.3 },   // Schumann 2nd harmonic
        websocket: { frequency: 20.8 },   // Schumann 3rd harmonic
        graphql:   { frequency: 27.3 },   // Schumann 4th harmonic
        grpc:      { frequency: 33.8 },   // Schumann 5th harmonic
        mqtt:      { frequency: 39.0 },   // Schumann 6th harmonic
        amqp:      { frequency: 45.0 },   // Schumann 7th harmonic
    },
});

await router.initialize();
console.log('Wave Router initialized — 7 channels active ✓');

// Route a message to any organism through any protocol
const result = await router.route({
    to: 'my-organism',
    protocol: 'icp',    // or 'http', 'ws', 'graphql', 'grpc', 'mqtt', 'amqp'
    action: 'pulse',
    data: {},
});
```

### ICP Adapter

```typescript
import { IcpAdapter } from '@medina/protocol-adapters';

const icp = new IcpAdapter({
    canisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    host: 'https://ic0.app',
    identity: yourIdentity, // Optional
});

await icp.connect();

// Query a canister
const state = await icp.query('getState', []);

// Update a canister
const beat = await icp.update('pulse', []);

// Subscribe to canister events
icp.subscribe('heartbeat', (event) => {
    console.log('ICP heartbeat:', event);
});
```

### HTTP/REST Adapter

```typescript
import { HttpAdapter } from '@medina/protocol-adapters';

const http = new HttpAdapter({
    baseUrl: 'https://api.myapp.com',
    headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'X-MEDINA-Organism': 'my-organism-id',
    },
    // φ-harmonic retry backoff
    retry: {
        maxAttempts: 5,
        backoff: 'phi', // 1s, 1.618s, 2.618s, 4.236s, 6.854s
    },
});

// Forward organism events to REST endpoint
const organism = await medina.organism.connect('my-organism');
organism.subscribe('pulse', async (beat) => {
    await http.post('/organism/heartbeat', { beat });
});

// Trigger organism actions via REST webhook
http.handle('POST', '/trigger/analyze', async (req) => {
    const result = await organism.invoke('W-ANALYST', req.body);
    return result;
});
```

### WebSocket Adapter

```typescript
import { WsAdapter } from '@medina/protocol-adapters';

const ws = new WsAdapter({
    url: 'wss://realtime.myapp.com/organisms',
    heartbeatMs: 873, // φ⁴-tuned
    reconnect: {
        enabled: true,
        maxDelay: 30000,
        strategy: 'phi-exponential',
    },
});

await ws.connect();

// Bidirectional real-time organism communication
ws.on('message', async (msg) => {
    const result = await organism.process(msg);
    ws.send(result);
});

organism.subscribe('pulse', (beat) => {
    ws.broadcast({ type: 'heartbeat', beat });
});
```

### GraphQL Adapter

```typescript
import { GraphQLAdapter } from '@medina/protocol-adapters';

// Expose organism as GraphQL API
const graphql = new GraphQLAdapter({
    port: 4000,
    schema: `
        type OrganismState {
            beats: Int!
            phi: Float!
            consciousness: String!
            isConscious: Boolean!
        }

        type Memory {
            key: String!
            value: String!
            timestamp: String!
            priority: String!
        }

        type Query {
            state: OrganismState!
            memory(key: String!): Memory
            memories(category: String, limit: Int): [Memory!]!
        }

        type Mutation {
            pulse: Int!
            storeMemory(key: String!, value: String!): Memory!
        }

        type Subscription {
            heartbeat: Int!
            memoryUpdate: Memory!
        }
    `,
});

// Auto-resolve from organism
graphql.resolveFromOrganism(organism);

await graphql.start();
console.log('GraphQL server running at http://localhost:4000/graphql');
```

### MQTT Adapter (IoT)

```typescript
import { MqttAdapter } from '@medina/protocol-adapters';

const mqtt = new MqttAdapter({
    brokerUrl: 'mqtt://iot.mycompany.com',
    clientId: 'medina-organism-bridge',
    topics: {
        subscribe: ['sensors/+/reading', 'devices/+/status'],
        publish: ['organism/heartbeat', 'organism/intelligence/#'],
    },
});

await mqtt.connect();

// Bridge IoT sensor data to organism intelligence
mqtt.subscribe('sensors/+/reading', async (topic, data) => {
    const sensorId = topic.split('/')[1];
    const intelligence = await organism.invoke('W-ANALYST', {
        task: 'analyze-sensor',
        sensorId,
        reading: data,
    });
    await mqtt.publish(`organism/intelligence/${sensorId}`, intelligence);
});

// Publish organism heartbeat to IoT network
organism.subscribe('pulse', async (beat) => {
    await mqtt.publish('organism/heartbeat', {
        beat,
        timestamp: Date.now(),
        phi: 1.6180339887498948482,
    });
});
```

---

## Wave Router Architecture

```
Wave Router — Frequency Multiplexing
┌─────────────────────────────────────────────┐
│  MEDINA Organism (ICP Canister)             │
│    ♥ 873ms heartbeat (φ⁴ × 1000/7.83)     │
└──────────────────┬──────────────────────────┘
                   │
            ┌──────▼──────┐
            │  Wave Router │
            │ 7 Channels   │
            └──────┬───────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
 ICP            HTTP         WebSocket
7.83Hz         14.3Hz         20.8Hz
    │              │              │
    ▼              ▼              ▼
GraphQL         gRPC           MQTT
27.3Hz         33.8Hz         39.0Hz
                               │
                               ▼
                             AMQP
                            45.0Hz
```

---

## Circuit Breaker

```typescript
import { CircuitBreaker } from '@medina/protocol-adapters';

const breaker = new CircuitBreaker({
    failureThreshold: 5,     // Open after 5 failures
    successThreshold: 2,     // Close after 2 successes
    timeout: 873,            // φ-tuned timeout (873ms)
    halfOpenDelay: 5000,     // 5s before testing again
});

// Wrap any adapter call
const result = await breaker.execute(async () => {
    return await httpAdapter.post('/api/organism', data);
});
```

---

## Examples

See `/examples` directory for:
- **icp-bridge**: Connect legacy systems to ICP organisms
- **http-gateway**: REST API gateway for organisms

---

## License

**Proprietary** — Developer tier free for non-commercial use

Professional tier: **$199/month** — Contact sales@medinatech.com

---

**MEDINA TECH | ALFREDO MEDINA HERNANDEZ | DALLAS TX | 2026**

**COPYRIGHT © 2024-2026 ALFREDO MEDINA HERNANDEZ. ALL RIGHTS RESERVED.**
