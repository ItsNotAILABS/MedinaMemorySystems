# recital-plus-one

> The RECITAL_PLUS_ONE law — a compounding salience algorithm for memory systems.

**MIT License** — ItsNotAILABS / Medina Memory Systems

---

## The Law

```
Resonance(n+1) = Resonance(n) × (1 + α)
```

Every recital of a memory amplifies the next. Resonance compounds across temporal beats.

`α` (alpha) is the amplification coefficient. Default: `0.1` (10% per recital).

After 10 recitals at α=0.1: `Resonance × (1.1)^10 ≈ Resonance × 2.59`

---

## Inspiration

| Tradition | Form |
|-----------|------|
| Neuroscience | Hebbian learning — "neurons that fire together wire together" |
| Islam | Tajwid / Hifz — recitation as memory strengthening |
| Vedic | Sruti — knowledge held in bodies through repetition |
| Bardic | Oral epic tradition — story gains weight with each telling |
| Information theory | Salience as a function of access frequency |

---

## Install

```bash
npm install recital-plus-one
```

## Usage

```typescript
import { recite, resonanceAfterN, RecitalRegistry, RECITAL_LAW } from 'recital-plus-one';

// Apply the law directly
const r0 = 0.5;
const r1 = recite(r0);           // 0.55 (10% amplification)
const r10 = resonanceAfterN(r0, 10); // ~1.296

// Use the registry
const registry = new RecitalRegistry({ defaultAlpha: 0.1, decayRate: 0.005 });

const entry = registry.register('memory-001', 'The founding doctrine of NOVA OVO.');

registry.recite('memory-001');
registry.recite('memory-001');
registry.recite('memory-001');

console.log(registry.get('memory-001')?.resonance); // ~0.665

// Advance time (applies decay)
registry.advanceBeat();

// Query high-resonance memories
const top = registry.query({ minResonance: 0.5, sortBy: 'resonance', order: 'desc' });

console.log(RECITAL_LAW.formula); // "Resonance(n+1) = Resonance(n) × (1 + α)"
```

---

## API

### Core Functions

| Function | Description |
|----------|-------------|
| `recite(resonance, alpha?, maxResonance?)` | Apply one recital |
| `resonanceAfterN(initial, n, alpha?)` | Resonance after N recitals |
| `recitalsToReach(initial, target, alpha?)` | How many recitals to hit a target |
| `decay(resonance, beatsElapsed, decayRate?)` | Apply temporal decay |

### RecitalRegistry

```typescript
const registry = new RecitalRegistry(config);

registry.register(id, content, initialResonance?, options?)
registry.recite(id)
registry.advanceBeat()
registry.query(RecitalQuery)
registry.getBeat()
registry.stats()
```

---

## Research

This library is the standalone extract of the RECITAL_PLUS_ONE law developed inside [Medina Memory Systems](https://medinamemorysystems.com).

The full theoretical treatment is available as a research paper in the Medina Memory Systems admin vault.

---

*"A memory that is recited gains salience. The organism that recites gains coherence."*
