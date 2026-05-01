# MEDINA SDK PACKAGES
## Multi-Package Software Development Kits

This directory contains all packaged SDKs for the MEDINA Memory Systems platform. Each package is independently deployable, versionable, and commercially licensable.

---

## Package Structure

```
/packages/
├── organism-sdk/         # Core Organism Runtime (Motoko)
├── intelligence-sdk/     # Intelligence Core (823+ modules)
├── enterprise-sdk/       # Enterprise Integration Layer
├── client-sdk/           # TypeScript Client Library
└── protocol-adapters/    # Protocol Adapters & Bridges
```

---

## 1. Organism SDK

**Package**: `@medina/organism-sdk`
**Language**: Motoko (ICP native)
**Purpose**: Core sovereign organism runtime

### Includes:
- Heart.mo — 873ms rhythm engine
- NeuralCore.mo — Real neuroscience substrate
- AnimalBrains.mo — Multi-species cognition (96 capabilities)
- Constants.mo — Ancient mathematical constants
- Workforce.mo — φ-scaled workforce orchestration
- Organism.mo — Sovereign integration layer
- Sandbox.mo — Document-to-model translation
- Underworld.mo — 7 hidden processing layers

### Use Cases:
- Deploy sovereign organism canisters
- Build custom organism extensions
- Integrate animal brain architectures
- Implement φ-harmonic systems

---

## 2. Intelligence SDK

**Package**: `@medina/intelligence-sdk`
**Language**: Mixed (Motoko + TypeScript)
**Purpose**: Complete intelligence spectrum (823+ modules)

### 7 Pillar Structure:
- **Neural** (87+ modules): Neurochemistry, synaptic plasticity
- **Cognitive** (64+ modules): Meta-cognition, reasoning, consciousness
- **Emergence** (53+ modules): Phase transitions, synchronization
- **Adaptation** (71+ modules): Antifragility, learning, attractors
- **Scalability** (42+ modules): Super-organisms, distributed systems
- **Computing** (89+ modules): φ-math, chaos theory, numerical methods
- **Machine Learning** (47+ modules): Pattern mining, prediction

### Use Cases:
- Build AI/ML applications with real mathematics
- Implement emergence and self-organization
- Create adaptive antifragile systems
- Deploy consciousness integration

---

## 3. Enterprise SDK

**Package**: `@medina/enterprise-sdk`
**Language**: Mixed (Motoko + TypeScript)
**Purpose**: Enterprise business integrations

### Includes:
- Parallax.mo — Multi-perspective processing
- EnterpriseIngest.mo — Company data ingestion
- ModelOrchestrator.mo — Model routing and orchestration
- EmergenceEngine.mo — Business emergence patterns
- SubstrateEngine.mo — Computational substrate
- ExternalUses.mo — External system adapters

### Enterprise Libs:
- companyOnboarding.ts — Company setup flows
- governanceEngine.ts — Policy and governance
- permissionsManager.ts — Access control
- replayEngine.ts — Audit and replay
- memoryEngine.ts — Organizational memory

### Use Cases:
- Onboard enterprise clients
- Integrate with existing systems
- Implement governance and compliance
- Deploy organizational memory

---

## 4. Client SDK

**Package**: `@medina/client-sdk`
**Language**: TypeScript/JavaScript
**Purpose**: Browser and Node.js client library

### Includes:
- Organism client interface
- Memory temple operations
- Model routing and invocation
- Governance operations
- Replay and audit interfaces
- Real-time subscriptions

### Features:
- Type-safe API client
- WebSocket support for real-time
- Automatic retry and reconnection
- Request/response validation
- φ-harmonic timing utilities

### Use Cases:
- Build web applications
- Create Node.js integrations
- Implement real-time dashboards
- Connect external services

---

## 5. Protocol Adapters

**Package**: `@medina/protocol-adapters`
**Language**: Mixed
**Purpose**: Protocol bridges and adapters

### Includes:
- ICP Adapter — Internet Computer Protocol
- HTTP/REST Adapter — RESTful API bridge
- WebSocket Adapter — Real-time bidirectional
- GraphQL Adapter — Query interface
- gRPC Adapter — High-performance RPC
- MQTT Adapter — IoT messaging
- AMQP Adapter — Message queue integration

### Use Cases:
- Connect diverse systems
- Bridge protocols
- Enable polyglot integration
- Implement event streaming

---

## Installation

### Motoko Packages (via mops)
```bash
mops install @medina/organism-sdk
mops install @medina/intelligence-sdk
mops install @medina/enterprise-sdk
```

### TypeScript/JavaScript Packages (via npm)
```bash
npm install @medina/client-sdk
npm install @medina/protocol-adapters
```

---

## Usage Example

### Deploy an Organism
```motoko
import Organism "mo:@medina/organism-sdk/Organism";
import Constants "mo:@medina/organism-sdk/Constants";

actor MyOrganism {
    let organism = Organism.new({
        heartbeat = Constants.HEARTBEAT_MS;
        phi = Constants.PHI;
    });

    public func pulse() : async Nat {
        organism.beat()
    };
};
```

### Use Client SDK
```typescript
import { MedinaClient } from '@medina/client-sdk';

const client = new MedinaClient({
    canisterId: 'your-canister-id',
    host: 'https://ic0.app'
});

// Invoke organism
const result = await client.organism.pulse();

// Store memory
await client.memory.store({
    key: 'important-fact',
    value: 'φ = 1.618033988749895',
    timestamp: Date.now()
});
```

---

## Versioning

All packages follow **Semantic Versioning** (semver):
- **MAJOR**: Breaking API changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Current versions:
- organism-sdk: `1.0.0`
- intelligence-sdk: `1.0.0`
- enterprise-sdk: `1.0.0`
- client-sdk: `1.0.0`
- protocol-adapters: `1.0.0`

---

## License

Each package includes its own LICENSE file. See individual package directories for licensing details.

**Default License**: Proprietary — Commercial licensing available

Contact: Alfredo Medina Hernandez | MEDINA TECH | Dallas, TX

---

## Support

- **Documentation**: `/docs` directory in each package
- **Examples**: `/examples` directory in each package
- **Issues**: GitHub Issues in main repository
- **Commercial Support**: Contact MEDINA TECH

---

**MEDINA TECH | ALFREDO MEDINA HERNANDEZ | DALLAS TX | 2026**

**COPYRIGHT © 2024-2026 ALFREDO MEDINA HERNANDEZ. ALL RIGHTS RESERVED.**
