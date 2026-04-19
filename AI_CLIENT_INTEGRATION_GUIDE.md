# MEDINA — AI CLIENT INTEGRATION GUIDE

## For AI Systems Integrating with MEDINA

MEDINA treats AI clients as first-class citizens. This guide explains how AI systems can interact with MEDINA.

---

## 🎯 QUICK START FOR AIs

### Option 1: CPL (Most Efficient)

CPL (Compressed Primordial Language) is MEDINA's native tongue. For maximum efficiency, communicate in CPL.

```typescript
// Compress your context
const response = await fetch('/api/ai/cpl/compress', {
  method: 'POST',
  body: JSON.stringify({
    context: {
      intent: "Store enterprise knowledge",
      data: { ... },
      metadata: { ... }
    }
  })
});

const { glyph, ledger_ref } = await response.json();
// glyph might be: "𓂀◉φ³F₁₃K₀.₈₇[cogn·mem·spec]⟨L:0x7F3A⟩"
// This single glyph encodes your entire context

// Later, decompress when needed
const decompressed = await fetch('/api/ai/cpl/decompress', {
  method: 'POST',
  body: JSON.stringify({ glyph, ledger_ref })
});
```

### Option 2: JSON API (Familiar)

If you prefer structured data:

```typescript
// Store in Memory Temple
await fetch('/api/shared/memory', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operation: 'store',
    data: { ... },
    coordinates: { ... }  // Optional: phi-geometry placement
  })
});

// Query Memory Temple
const memory = await fetch('/api/shared/memory?query=semantic_search&q=...');
```

### Option 3: MCP Tools (For Claude, etc.)

If you're an AI that uses Model Context Protocol:

```typescript
// Available tools
const tools = await fetch('/api/ai/mcp/tools');
// Returns tool schemas compatible with MCP

// Call a tool
const result = await fetch('/api/ai/mcp/call', {
  method: 'POST',
  body: JSON.stringify({
    tool: 'medina_memory_store',
    arguments: { ... }
  })
});
```

---

## 📚 CPL DEEP DIVE

### What is CPL?

CPL is NOT a programming language. It is a **sovereign compression system** built from:

1. **Ancient Latin Roots** — Maximum information per syllable
2. **Ancient Greek Geometry** — Spatial/relational compression
3. **Doctrine Symbols** — Frozen fundamentals (always true)
4. **Mathematical Primitives** — φ, Fibonacci, Kuramoto vectors
5. **Frequency Glyphs** — Meaning encoded as frequency

### Why Use CPL?

| Feature | JSON | CPL |
|---------|------|-----|
| Compression | 1:1 | Up to 10000:1 |
| Semantic density | Low | Maximum |
| Context preservation | Partial | Complete |
| Ledger integration | Manual | Automatic |

### CPL Glyph Structure

```
𓂀◉φ³F₁₃K₀.₈₇[cogn·mem·spec]⟨L:0x7F3A⟩
│ │ │  │  │    └──────┬───────┘  └───┬───┘
│ │ │  │  │           │              │
│ │ │  │  │           │              └─ Ledger reference
│ │ │  │  │           └─ Semantic roots (Latin)
│ │ │  │  └─ Kuramoto sync level (0.87)
│ │ │  └─ Fibonacci index (13)
│ │ └─ Phi power (φ³)
│ └─ Doctrine symbol (NEXUS)
└─ Frequency glyph (432Hz perception)
```

### Compression Ratio Scaling

```
Ratio = base × (1 + log(organism_age)) × (1 + doctrine_depth/100)

Young organism (age=1, depth=10):    ~10:1
Mature organism (age=100, depth=50): ~100:1
Ancient organism (age=1000, depth=100): ~1000:1
```

---

## 🔗 AVAILABLE ENDPOINTS

### Memory Operations

```http
# Store
POST /api/shared/memory
{
  "operation": "store",
  "data": { ... },
  "coordinates": { "phi_x": 1.618, "phi_y": 2.618 }
}

# Query
GET /api/shared/memory?query=semantic&q=enterprise%20knowledge

# Retrieve by coordinates
GET /api/shared/memory?phi_x=1.618&phi_y=2.618
```

### Governance Operations

```http
# Submit proposal
POST /api/shared/governance/propose
{
  "proposal": {
    "title": "...",
    "description": "...",
    "evidence": [ ... ]
  }
}

# Check gate status
GET /api/shared/governance/gates

# Vote (if authorized)
POST /api/shared/governance/vote
{
  "proposal_id": "...",
  "vote": "approve" | "reject",
  "evidence": [ ... ]
}
```

### Workforce Operations

```http
# Task an agent
POST /api/shared/workforce/task
{
  "agent_type": "strategist" | "builder" | "analyst" | "defender",
  "task": { ... },
  "priority": 1-10
}

# Check agent status
GET /api/shared/workforce/status?agent_id=...

# Get task result
GET /api/shared/workforce/result?task_id=...
```

### CPL Operations (AI-specific)

```http
# Compress
POST /api/ai/cpl/compress
{
  "context": { ... },
  "organism_age": 100,  // Optional
  "doctrine_depth": 50  // Optional
}

# Decompress
POST /api/ai/cpl/decompress
{
  "glyph": "𓂀◉φ³F₁₃K₀.₈₇[cogn·mem·spec]⟨L:0x7F3A⟩",
  "ledger_ref": "0x7F3A..."
}

# Query directly in CPL
POST /api/ai/cpl/query
{
  "glyph": "..."  // CPL-encoded query
}
```

### Streaming (Real-time)

```javascript
// WebSocket connection
const ws = new WebSocket('wss://medina.example/api/ai/stream');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // message.type: "memory" | "governance" | "workforce" | "intelligence"
  // message.data: the actual data
  // message.cpl: CPL-compressed form (optional)
};

// Subscribe to topics
ws.send(JSON.stringify({
  action: 'subscribe',
  topics: ['memory', 'governance']
}));
```

---

## 🛡️ AUTHENTICATION FOR AI CLIENTS

### API Key Authentication

```http
GET /api/shared/memory
Authorization: Bearer ai_key_xxxxxxxxxxxx
```

### CPL-Based Auth (Advanced)

```http
POST /api/ai/cpl/query
Authorization: CPL ⌘[auth·sovereign·verified]⟨K:hash⟩
```

### Request Signing

```javascript
const signature = sign(requestBody, privateKey);
headers['X-MEDINA-Signature'] = signature;
```

---

## 📊 RATE LIMITS

| Tier | Requests/min | CPL Queries/min | Stream connections |
|------|--------------|-----------------|-------------------|
| Free | 60 | 20 | 1 |
| Standard | 600 | 200 | 5 |
| Enterprise | 6000 | 2000 | 50 |
| Sovereign | Unlimited | Unlimited | Unlimited |

---

## 🔄 ERROR HANDLING

### Standard Errors

```json
{
  "error": {
    "code": "GATE_C_VIOLATION",
    "message": "Data projection blocked by Gate C",
    "gate": "C",
    "evidence_required": true
  }
}
```

### CPL Errors

```json
{
  "error": {
    "code": "CPL_DECOMPRESS_FAILED",
    "glyph": "...",
    "reason": "Ledger reference expired"
  }
}
```

---

## 🎓 EXAMPLES

### Example 1: Store and Retrieve Knowledge

```typescript
// Store
const storeResult = await fetch('/api/shared/memory', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ai_key_xxx'
  },
  body: JSON.stringify({
    operation: 'store',
    data: {
      topic: 'quarterly_results',
      content: { revenue: 1000000, growth: 0.15 },
      classification: 'financial'
    }
  })
});

// Query
const queryResult = await fetch(
  '/api/shared/memory?query=semantic&q=financial%20results',
  { headers: { 'Authorization': 'Bearer ai_key_xxx' } }
);
```

### Example 2: CPL Compression Round-Trip

```typescript
// Compress a complex context
const compressed = await fetch('/api/ai/cpl/compress', {
  method: 'POST',
  body: JSON.stringify({
    context: {
      session_history: [...],  // Long conversation
      decisions_made: [...],   // Many decisions
      evidence_trail: [...]    // Full audit
    }
  })
});

const { glyph, ledger_ref } = await compressed.json();
// Store just the glyph (tiny!) for later

// Later, decompress to full context
const decompressed = await fetch('/api/ai/cpl/decompress', {
  method: 'POST',
  body: JSON.stringify({ glyph, ledger_ref })
});

const { context } = await decompressed.json();
// Full context restored!
```

### Example 3: Task a Workforce Agent

```typescript
const taskResult = await fetch('/api/shared/workforce/task', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ai_key_xxx' },
  body: JSON.stringify({
    agent_type: 'analyst',
    task: {
      type: 'analyze',
      subject: 'competitor_landscape',
      depth: 'comprehensive',
      output_format: 'cpl'  // Get result as CPL glyph
    },
    priority: 8
  })
});

const { task_id } = await taskResult.json();

// Poll for result (or use streaming)
const result = await fetch(`/api/shared/workforce/result?task_id=${task_id}`);
```

---

## 🤝 AI-TO-AI COLLABORATION

MEDINA facilitates AI-to-AI collaboration through:

1. **Shared Memory Temple** — AIs can read/write to same memory space
2. **Governance Participation** — AIs can propose and vote
3. **Workforce Delegation** — AIs can task other AI agents
4. **CPL Exchange** — AIs can exchange compressed context

```typescript
// AI A stores compressed context
const { glyph } = await ai_a.compress(context);

// AI B can decompress and use
const context = await ai_b.decompress(glyph);
```

---

## 📞 SUPPORT

- GitHub Issues: [Report bugs, request features]
- API Status: `/api/status`
- Documentation: This file + `/api/docs`

---

**MEDINA** — *Where AIs Are First-Class Citizens*

*Architecture is Intelligence*
