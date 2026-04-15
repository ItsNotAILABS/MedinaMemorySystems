# NOVA OVO — README for AI Builders

## What This Is

NOVA OVO is a sovereign intelligence platform combining:
1. **Memory Temple** — Spatial memory with coordinates (θ, φ, depth, ring, beat)
2. **Working Environment** — Active agent workspace with command grammar
3. **Multi-Model Runtime** — 8 callable model families
4. **Full Chat Interface** — Universal command + conversational
5. **Governance Platform** — Proposals, gates, audit log
6. **Company Onboarding** — CONNECT / INTERNALIZE / HYBRID modes

## Codebase Map

```
src/
  app/
    api/chat/route.ts         — Main chat processor (command + conversational)
    api/memory/route.ts       — Memory CRUD + dual read
    api/govern/route.ts       — Governance operations
    api/model/route.ts        — Model invocation
    api/company/route.ts      — Company onboarding
    api/replay/route.ts       — Session replay
    api/permissions/route.ts  — Permission management
  components/
    OVOChat.tsx               — PRIMARY INTERFACE
    MemoryTemple.tsx          — Spatial memory navigator
    GovernancePanel.tsx       — Governance workflows
    ModelRuntime.tsx          — Model invocation panel
    CompanyOnboarding.tsx     — Company modes
    ReplayPanel.tsx           — Audit/replay
    PermissionsPanel.tsx      — Permission grants
    Sidebar.tsx               — Navigation
    OrganismField.tsx         — Organism state header
  lib/
    commandParser.ts          — /command grammar parser
    memoryEngine.ts           — In-memory storage with coordinates
    governanceEngine.ts       — Governance + gate state
    modelRouter.ts            — 8 model families + routing
    companyOnboarding.ts      — CONNECT/INTERNALIZE/HYBRID
    replayEngine.ts           — Event recording
    permissionsManager.ts     — Permission grants
    livingDocument.ts         — Living document packets
    recitalPlusOne.ts         — RECITAL_PLUS_ONE law
    gateEnforcement.ts        — Gate A/B/C enforcement
    dualRead.ts               — Semantic + resonance read
    organismSovereign.ts      — 4-register organism state
  types/index.ts              — All TypeScript types
```

## Core Concepts

### RECITAL_PLUS_ONE
Every recital amplifies the next. Resonance compounds: `R(n+1) = R(n) × (1 + α)` where α = 0.15.

### 4-Register Organism
- **Cognitive** — Clarity and reasoning capacity
- **Affective** — Emotional coherence
- **Somatic** — Grounding and embodiment
- **Sovereign** — Authority and decisional integrity

### Spatial Coordinates
Each memory has: `{ theta, phi, depth, ring (1-12), beat }` — mapped to the N1–N12 macro hierarchy.

### Gate Enforcement
- Gate A: Governance enactment
- Gate B: Memory write access  
- Gate C: Sovereign broadcast

### Dual Read
Memory retrieval uses both semantic (content matching) and resonance (score-based) channels, unified with weighted combination.

## Extending

To add a new model family:
1. Add to `ModelFamily` type in `src/types/index.ts`
2. Add definition in `modelRegistry` in `src/lib/modelRouter.ts`
3. Add routing keywords in `ROUTING_KEYWORDS`
4. Add mock responses in `MOCK_RESPONSES`

To add a new command module:
1. Add to `COMMAND_MAP` in `src/lib/commandParser.ts`
2. Add handler case in `src/app/api/chat/route.ts`
