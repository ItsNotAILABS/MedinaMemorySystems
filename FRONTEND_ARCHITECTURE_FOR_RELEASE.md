# MEDINA FRONTEND ARCHITECTURE — RELEASE READY

## Dual-Client Frontend Design

The frontend serves **BOTH humans AND AIs** as first-class clients.

---

## 🏛️ ARCHITECTURAL OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MEDINA FRONTEND SURFACE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │     HUMAN INTERFACE         │    │      AI INTERFACE            │        │
│  │                             │    │                              │        │
│  │  ┌─────────────────────┐   │    │  ┌─────────────────────┐    │        │
│  │  │  Visual Components  │   │    │  │   CPL Gateway       │    │        │
│  │  │  - Memory Temple    │   │    │  │   - Compress        │    │        │
│  │  │  - Governance UI    │   │    │  │   - Decompress      │    │        │
│  │  │  - Workforce View   │   │    │  │   - Stream          │    │        │
│  │  │  - Evidence Replay  │   │    │  └─────────────────────┘    │        │
│  │  └─────────────────────┘   │    │                              │        │
│  │                             │    │  ┌─────────────────────┐    │        │
│  │  ┌─────────────────────┐   │    │  │   JSON API          │    │        │
│  │  │  Interaction Layer  │   │    │  │   - REST endpoints  │    │        │
│  │  │  - Forms            │   │    │  │   - GraphQL (opt)   │    │        │
│  │  │  - Modals           │   │    │  │   - WebSocket       │    │        │
│  │  │  - Navigation       │   │    │  └─────────────────────┘    │        │
│  │  └─────────────────────┘   │    │                              │        │
│  │                             │    │  ┌─────────────────────┐    │        │
│  │  ┌─────────────────────┐   │    │  │   MCP Surface       │    │        │
│  │  │  Feedback Surfaces  │   │    │  │   - Tool schemas    │    │        │
│  │  │  - Notifications    │   │    │  │   - Function calls  │    │        │
│  │  │  - Progress         │   │    │  │   - Context exchange│    │        │
│  │  │  - Confirmations    │   │    │  └─────────────────────┘    │        │
│  │  └─────────────────────┘   │    │                              │        │
│  └─────────────────────────────┘    └─────────────────────────────┘        │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                         SHARED INTELLIGENCE LAYER                            │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    10 UI INTELLIGENCES                                │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐              │   │
│  │  │Interact│ │ Layout │ │  Nav   │ │Display │ │Feedback│              │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘              │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐              │   │
│  │  │  Form  │ │Overlay │ │ Anim   │ │ State  │ │Access  │              │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘              │   │
│  │                                                                       │   │
│  │  Each Intelligence: 3 Models × 4 Engines = 12 engines                 │   │
│  │  Total: 10 × 12 = 120 Frontend Engines                                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 FILE STRUCTURE

```
/src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   │
│   ├── api/                      # API Routes
│   │   ├── ai/                   # AI-specific endpoints
│   │   │   ├── ingest/          # AI data ingestion
│   │   │   ├── query/           # AI queries
│   │   │   ├── stream/          # Real-time AI collaboration
│   │   │   ├── cpl/             # CPL compress/decompress
│   │   │   └── mcp/             # MCP tool surface
│   │   │
│   │   ├── human/               # Human-specific endpoints
│   │   │   ├── auth/            # Authentication
│   │   │   ├── workspace/       # Workspace management
│   │   │   └── preferences/     # User preferences
│   │   │
│   │   └── shared/              # Shared endpoints
│   │       ├── memory/          # Memory Temple access
│   │       ├── governance/      # Governance operations
│   │       └── workforce/       # Workforce management
│   │
│   ├── (human)/                 # Human-only routes (route group)
│   │   ├── dashboard/           # Dashboard
│   │   ├── memory-temple/       # Memory Temple UI
│   │   ├── governance/          # Governance UI
│   │   └── workforce/           # Workforce monitoring
│   │
│   └── (ai)/                    # AI-only routes (route group)
│       ├── console/             # AI interaction console
│       └── playground/          # AI testing playground
│
├── components/
│   ├── human/                   # Human-facing components
│   │   ├── MemoryTemple/        # Memory navigation
│   │   ├── GovernancePanel/     # Governance UI
│   │   ├── WorkforceMonitor/    # Agent monitoring
│   │   └── EvidenceReplay/      # Audit playback
│   │
│   ├── ai/                      # AI-facing components
│   │   ├── CPLConsole/          # CPL interaction
│   │   ├── StreamViewer/        # Real-time stream
│   │   └── ToolSurface/         # MCP tool interface
│   │
│   └── shared/                  # Shared components
│       ├── ui/                  # Base UI elements
│       └── intelligence/        # Intelligence layer components
│
├── organism/                    # NEXUS Intelligence Layer
│   └── nexus/                   # All NEXUS modules
│       ├── frontend-intelligence/   # 10 UI Intelligences
│       ├── NEXUS_UI_INTELLIGENCE_DEEP.ts
│       └── ...
│
└── lib/                         # Utilities
    ├── cpl/                     # CPL implementation
    ├── api/                     # API utilities
    └── hooks/                   # React hooks
```

---

## 🤖 AI CLIENT SURFACES

### 1. CPL Gateway (`/api/ai/cpl`)

```typescript
// POST /api/ai/cpl/compress
interface CompressRequest {
  context: any;                    // Full context to compress
  organism_age?: number;           // Affects compression ratio
  doctrine_depth?: number;         // Affects symbol density
}

interface CompressResponse {
  glyph: string;                   // CPL glyph
  ledger_ref: string;              // Reference for decompression
  ratio: number;                   // Compression ratio achieved
}

// POST /api/ai/cpl/decompress
interface DecompressRequest {
  glyph: string;
  ledger_ref: string;
}

interface DecompressResponse {
  context: any;                    // Full decompressed context
}
```

### 2. MCP Tool Surface (`/api/ai/mcp`)

```typescript
// For AI systems using Model Context Protocol
interface MCPToolRegistry {
  tools: [
    {
      name: "medina_memory_store",
      description: "Store data in Memory Temple",
      parameters: { ... }
    },
    {
      name: "medina_memory_query",
      description: "Query Memory Temple",
      parameters: { ... }
    },
    {
      name: "medina_governance_propose",
      description: "Submit governance proposal",
      parameters: { ... }
    },
    {
      name: "medina_workforce_task",
      description: "Task a workforce agent",
      parameters: { ... }
    },
    // ... more tools
  ]
}
```

### 3. Streaming Interface (`/api/ai/stream`)

```typescript
// WebSocket endpoint for real-time AI collaboration
interface StreamMessage {
  type: "memory" | "governance" | "workforce" | "intelligence";
  data: any;
  cpl?: string;  // Optional CPL-compressed form
  timestamp: number;
}
```

---

## 👤 HUMAN CLIENT SURFACES

### Memory Temple UI

```tsx
// /src/components/human/MemoryTemple/index.tsx
export function MemoryTemple() {
  return (
    <TempleContainer>
      {/* 3D navigation of memory space */}
      <MemoryNavigation />
      
      {/* Memory node detail view */}
      <NodeInspector />
      
      {/* Lineage and connection view */}
      <LineageGraph />
      
      {/* Search by meaning, not keywords */}
      <SemanticSearch />
    </TempleContainer>
  );
}
```

### Governance Panel

```tsx
// /src/components/human/GovernancePanel/index.tsx
export function GovernancePanel() {
  return (
    <PanelContainer>
      {/* Active proposals */}
      <ProposalList />
      
      {/* Proposal submission */}
      <ProposalForm />
      
      {/* Gate status (A, B, C) */}
      <GateStatus />
      
      {/* Audit trail */}
      <AuditLog />
    </PanelContainer>
  );
}
```

---

## 🔄 STATE MANAGEMENT

### For Both Clients

```typescript
// /src/lib/state/organism-state.ts
export interface OrganismState {
  // Shared state
  memory: MemoryState;
  governance: GovernanceState;
  workforce: WorkforceState;
  
  // Client-specific views
  human: HumanViewState;
  ai: AIViewState;
}

// State is synchronized across both client types
// Human actions update AI-visible state
// AI actions update Human-visible state
```

---

## 📡 API ROUTES SUMMARY

| Route | Human | AI | Method | Purpose |
|-------|-------|-----|--------|---------|
| `/api/shared/memory` | ✅ | ✅ | GET/POST | Memory Temple |
| `/api/shared/governance` | ✅ | ✅ | GET/POST | Governance |
| `/api/shared/workforce` | ✅ | ✅ | GET/POST | Workforce |
| `/api/ai/cpl` | ❌ | ✅ | POST | CPL operations |
| `/api/ai/stream` | ❌ | ✅ | WS | Real-time stream |
| `/api/ai/mcp` | ❌ | ✅ | GET/POST | MCP tools |
| `/api/human/auth` | ✅ | ❌ | POST | Authentication |
| `/api/human/preferences` | ✅ | ❌ | GET/PUT | User prefs |

---

## 🎨 STYLING APPROACH

```css
/* globals.css - Phi-based spacing system */
:root {
  /* Golden ratio derived values */
  --phi: 1.618033988749895;
  --spacing-1: 0.618rem;
  --spacing-2: 1rem;
  --spacing-3: 1.618rem;
  --spacing-4: 2.618rem;
  --spacing-5: 4.236rem;
  
  /* 432 Hz derived colors (harmonic) */
  --color-primary: hsl(432, 70%, 50%);
  --color-sovereign: hsl(396, 80%, 45%);
  
  /* Frequencies as visual rhythm */
  --transition-harmony: 0.432s ease;
}
```

---

## ✅ FRONTEND RELEASE CHECKLIST

- [ ] All components render without errors
- [ ] Human routes accessible and functional
- [ ] AI endpoints respond correctly
- [ ] CPL compress/decompress works
- [ ] WebSocket streaming functional
- [ ] MCP tools registered and callable
- [ ] Responsive design verified
- [ ] Accessibility checked (WCAG 2.1 AA)
- [ ] Performance metrics acceptable
- [ ] Error boundaries in place

---

**MEDINA Frontend** — *Surfaces for Humans and AIs*

*Architecture is Intelligence*
