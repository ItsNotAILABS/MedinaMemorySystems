<!--
  ╔══════════════════════════════════════════════════════════════════════════╗
  ║  ITSNOTAILABS SOVEREIGN INTELLIGENCE ORGANISM                           ║
  ║  Organism Class:    README.LIVING                                       ║
  ║  Registry:          ISIL-1.1 :: ITSNOTAILABS :: 2026                   ║
  ║  SAEIS Status:      ACTIVE                                              ║
  ║  Access logging:    ENABLED                                             ║
  ║                                                                          ║
  ║  This document is a living artifact of the ItsNotAILABS organism.      ║
  ║  It knows you're here.                                                   ║
  ╚══════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

```
  ╔══════════════════════════════════════════════════════════════════════╗
  ║                                                                      ║
  ║   ██╗████████╗███████╗███╗   ██╗ ██████╗ ████████╗ █████╗ ██╗      ║
  ║   ██║╚══██╔══╝██╔════╝████╗  ██║██╔═══██╗╚══██╔══╝██╔══██╗██║      ║
  ║   ██║   ██║   ███████╗██╔██╗ ██║██║   ██║   ██║   ███████║██║      ║
  ║   ██║   ██║   ╚════██║██║╚██╗██║██║   ██║   ██║   ██╔══██║██║      ║
  ║   ██║   ██║   ███████║██║ ╚████║╚██████╔╝   ██║   ██║  ██║██║      ║
  ║   ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝      ║
  ║                                                                      ║
  ║              A I L A B S  ·  M E D I N A  M E M O R Y              ║
  ║                                                                      ║
  ║      Intelligentia Architecturae  ·  Deep Lineage  ·  Sovereign     ║
  ╚══════════════════════════════════════════════════════════════════════╝
```

**Sovereign intelligence infrastructure for AI agents.**  
Memory that thinks. Systems that remember. Architecture that lasts.

[![License: MIT](https://img.shields.io/badge/consensus--engine-MIT-22c55e?style=flat-square)](packages/consensus-engine)
[![License: MIT](https://img.shields.io/badge/agent--signal-MIT-22c55e?style=flat-square)](packages/agent-signal)
[![License: ISIL-1.1](https://img.shields.io/badge/agent--incentive--service-ISIL--1.1%20commercial-f97316?style=flat-square)](packages/agent-incentive-service)
[![License: ISIL-1.1](https://img.shields.io/badge/medina--memory--sdk-ISIL--1.1%20proprietary-ef4444?style=flat-square)](packages/medina-memory-sdk)
[![SAEIS: ACTIVE](https://img.shields.io/badge/SAEIS-ACTIVE-7c3aed?style=flat-square)](#enforcement)

</div>

---

## What you've found

This is the ItsNotAILABS sovereign intelligence stack.

It isn't a collection of tools. It's a **living architecture** — memory systems, coordination engines, incentive structures, and organism infrastructure designed to give AI agents the one thing they've always lacked: *memory with meaning.*

You can use two things from here freely. Everything else runs under the sovereign systems described below.

---

## Public releases

### `consensus-engine` · MIT · [→ package](packages/consensus-engine)

Role-weighted voting for multi-agent AI councils.

Every agent on your team has a role. Every role carries authority over specific decision domains. Dissent is logged, not ignored. Confidence decays weak votes. Sovereign roles hold veto power. Truth — or the best available approximation — emerges from the weighted sum.

```typescript
import { ConsensusEngine } from 'consensus-engine';

const engine = new ConsensusEngine({
  roles: [
    { id: 'analyst',    weight: 0.75, authorityDomains: ['empirical-claim'] },
    { id: 'strategist', weight: 0.85, authorityDomains: ['strategic-direction'] },
    { id: 'sovereign',  weight: 1.00, vetoEnabled: true },
  ],
  confidenceFloor: 0.72,
});

const result = engine.resolve('decision-001', votes);
// result.approved     — did the council ratify?
// result.winner       — the prevailing vote
// result.dissent      — minority positions, archived
```

```
npm install consensus-engine
```

---

### `agent-signal` · MIT · [→ package](packages/agent-signal)

Decoupled pub/sub signal bus for AI agent teams.

Agents emit. Agents subscribe. No tight coupling. No single point of failure. BROADCAST reaches everyone. DIRECT reaches one. ROLE reaches all agents holding a given designation. URGENT fires synchronously — when something has to land right now.

```typescript
import { SignalBus } from 'agent-signal';

const bus = new SignalBus();

bus.subscribe('agent-critic', (signal) => {
  console.log(`[${signal.priority}] ${signal.subject}`);
});

bus.emit({
  type: 'ROLE',
  role: 'critic',
  priority: 'HIGH',
  subject: 'Review this output before it ships',
  payload: { outputId: 'out-42' },
});
```

```
npm install agent-signal
```

---

## Commercial release

### `agent-incentive-service` · ISIL-1.1 commercial · [→ package](packages/agent-incentive-service)

Mechanism-design coordination for agent teams.

Five classical incentive problems — principal-agent, free-rider, holdup, asymmetric information, coordination failure — all solved structurally. Role-scoped enforcement. Conviction-weighted claims. Mandatory reasoning transparency. Stage covenants. Standing ledger. The formal math from the AGENT_INCENTIVE_STRUCTURES research paper, deployed as a production TypeScript service.

Per-call commercial license. Converts to MIT on 2029-04-21.  
Contact ItsNotAILABS for licensing.

---

## Sovereign SDK

### `@medina/memory-sdk` · ISIL-1.1 proprietary · [→ package](packages/medina-memory-sdk)

The core sovereign memory infrastructure. Not public. Not open. Available under executed enterprise license agreements only.

What it contains: spatial memory, temporal memory, harmonic computing, knowledge graphs, pattern recognition, multi-AI team orchestration, context engine, document memory. The full stack.

What it enables: AI agents that remember across sessions, across devices, across team members — with sovereignty, coherence, and structure.

---

## Internal registry

### `@itsnotailabs/tools` · ISIL-1.1 proprietary · [→ package](packages/ai-tools-marketplace)

28 tools. One catalog. Install anything from any terminal, on any authorized device, in seconds.

```
npx @itsnotailabs/tools list
```

Internal and authorized family/team use only.

---

## Research

| Paper | Venue | Status |
|-------|-------|--------|
| [Cognitive Memory and AI Agents](papers/COGNITIVE_MEMORY_AND_AI_AGENTS.md) | UTA Psychology/Cognitive Science | Published |
| [Agent Incentive Structures](papers/AGENT_INCENTIVE_STRUCTURES.md) | UTA Economics/Computer Science | Published |
| [Role Frequency Alignment](RESEARCH/ROLE_FREQUENCY_ALIGNMENT.md) | ItsNotAILABS Internal | Published |

---

## Architecture

```
ItsNotAILABS Sovereign Stack
│
├── packages/
│   ├── consensus-engine          MIT      Role-weighted multi-agent voting
│   ├── agent-signal              MIT      Decoupled agent pub/sub bus
│   ├── agent-incentive-service   ISIL-1.1 Mechanism-design coordination (commercial)
│   └── medina-memory-sdk         ISIL-1.1 Full sovereign memory SDK (proprietary)
│
├── src/
│   ├── lib/                               25+ internal organism utilities
│   ├── organism/                          Full organism architecture
│   └── app/api/                           Sovereign API surface
│
├── papers/                                Academic research papers
├── landing/                               Sovereign landing page
└── RESEARCH/                             Internal research archive
```

---

## Enforcement

This repository operates under the **ItsNotAILABS Sovereign Intelligence License (ISIL-1.1)**.

The MIT-licensed packages (`consensus-engine`, `agent-signal`) are free to use, modify, and distribute. Everything else is governed by ISIL-1.1 — a living enforcement instrument backed by the **Sovereign Active Enforcement Intelligence System (SAEIS)** and **Sovereign Access Token (SAT)** binding.

SAEIS is always on. It monitors access patterns, flags violations, and escalates to enforcement. Your access to this repository is logged.

The full terms are in [LICENSE](LICENSE).

---

<div align="center">

```
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ItsNotAILABS · Intelligentia Architecturae · Deep Lineage · Sovereign
  ISIL-1.1 · 2026 · All Rights Reserved · SAEIS Active
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

</div>
