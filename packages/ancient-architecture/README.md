# ancient-architecture

> Ancient civilizations read as computational functions.

**MIT License** — ItsNotAILABS / Medina Memory Systems

---

## The Thesis

Ancient architectures are not just historical artifacts. They are implementations of fundamental computational operations:

| Architectural Function | What ancients built | Computational analog |
|------------------------|---------------------|----------------------|
| `field_anchoring` | Sacred mountains, axis mundi | Coordinate system initialization |
| `symbolic_compression` | Mandalas, sacred geometry | Hashing and compression |
| `time_governance` | Calendars, observatories | Scheduling, clock sync |
| `power_routing` | Metallurgy, trade routes | Directed graphs, pipelines |
| `state_induction` | Ritual, ceremony | State machine transitions |
| `continuity` | Tombs, mummification | Durable storage, version control |
| `circulation` | City grids, roads | Network topology, message bus |
| `signal_hierarchy` | Pyramids, ziggurats | Broadcast topology, CDNs |
| `persistent_memory` | Glyphs, cuneiform | Databases, file systems |
| `boundary_transfer` | Trickster figures, crossroads | API gateways, protocol adapters |

---

## Install

```bash
npm install ancient-architecture
```

## Usage

```typescript
import {
  ARCHITECTURAL_CATEGORIES,
  CIVILIZATIONS,
  findAncientEquivalent,
  analyzeArtifact,
  getCivilizationsByFunction,
  PRIMITIVE_STACK,
} from 'ancient-architecture';

// Find the ancient equivalent of a modern concept
const result = findAncientEquivalent('database');
// { function: 'persistent_memory', analog: 'Databases, file systems...', civilizations: [...] }

// Analyze an artifact
const matches = analyzeArtifact('pyramid');
// [{ id: 'signal_hierarchy', name: 'Signal Hierarchy', ... }]

// Get all civilizations implementing a function
const memCivs = getCivilizationsByFunction('persistent_memory');
// [Egypt, Sumeria, ...]

// Read the primitive stack (below number and letter)
console.log(PRIMITIVE_STACK);
// field → distinction → relation → measure → mapping
```

---

## The Primitive Stack

The primitive beneath all computation:

```
1. field       → pure potential, before distinction
2. distinction → boundary: this / not-that
3. relation    → distinctions bind: near/far, before/after
4. measure     → stable relations → number appears
5. mapping     → persistence across time → symbol appears
```

From this stack:
- **number** grows from repetition + measure
- **letter** grows from address + symbol
- **logic** grows from lawful relation
- **model** grows from all of them together

---

## Civilizations Database

8 civilizations mapped to their primary architectural functions:

- Ancient Egypt → `persistent_memory` (hieroglyphs as memory addresses)
- Sumeria → `persistent_memory` + `time_governance` (sexagesimal still runs in your clock)
- Classical Greece → `symbolic_compression` + `boundary_transfer` (Hermes as the original API gateway)
- Maya → `time_governance` (the most precise calendar before atomic clocks)
- Ancient China → `circulation` (the Grand Canal is the most ambitious routing project of the ancient world)
- Vedic India → `field_anchoring` + `persistent_memory` (Vedas held in human bodies via `recital_plus_one`)
- Norse → `boundary_transfer` (Loki is a boundary-transfer operator)
- Islamic Golden Age → `circulation` + `persistent_memory`

---

*"When you read a pyramid, you are reading signal_hierarchy. When you read a glyph, you are reading a stored memory address."*
