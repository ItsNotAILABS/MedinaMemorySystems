# chaos-flow

> Micro chaos models for AI workflow recovery.

**MIT License** — ItsNotAILABS / Medina Memory Systems

---

## What It Does

When an AI workflow reaches an unstable state, `chaos-flow` detects the instability type, finds the nearest stable attractor basin, and applies a recovery strategy.

**Instability types detected:**

| Type | Description |
|------|-------------|
| `LOOP` | Step retrying infinitely |
| `DEADLOCK` | Two+ steps waiting on each other |
| `DRIFT` | Gradual coherence decline |
| `CASCADE` | One failure causing many downstream failures |
| `STALL` | Complete halt — no output, no error |
| `OSCILLATION` | Alternating between incompatible states |

**Recovery strategies:**

| Strategy | When |
|----------|------|
| `RESTART` | Step failed but is stateless — restart it |
| `REROUTE` | Skip the step, use alternate path |
| `FALLBACK` | Use a fallback value |
| `REDUCE` | Reduce scope and retry |
| `CHECKPOINT` | Roll back to last stable state |
| `ISOLATE` | Quarantine the failing step |
| `HUMAN_ESCALATE` | All automated recovery failed |

---

## Install

```bash
npm install chaos-flow
```

## Usage

```typescript
import {
  createWorkflow,
  detectInstability,
  applyRecovery,
  ChaosMonitor,
} from 'chaos-flow';

// Create a workflow
const workflow = createWorkflow('wf-001', [
  { id: 'step-1', name: 'Fetch Data', dependencies: [] },
  { id: 'step-2', name: 'Process', dependencies: ['step-1'] },
  { id: 'step-3', name: 'Output', dependencies: ['step-2'] },
]);

// Simulate a failure
workflow.steps.get('step-2')!.status = 'FAILED';
workflow.steps.get('step-2')!.retryCount = 4; // 4 retries = loop

// Detect instability
const event = detectInstability(workflow);
// { instability: 'LOOP', suggestedStrategy: 'REROUTE', severity: 0.4, ... }

// Apply recovery
const { result } = applyRecovery(workflow, event!);
// { success: true, strategy: 'REROUTE', coherenceAfter: 0.65, ... }

// Or use the ChaosMonitor for automatic recovery
const monitor = new ChaosMonitor(workflow, {
  autoRecover: true,
  onEvent: (e) => console.log('Chaos detected:', e.instability),
  onRecovery: (r) => console.log('Recovered via:', r.strategy),
});

// Run health checks during your execution loop
const chaosEvent = monitor.check();
```

---

## Attractor Basins

`chaos-flow` uses attractor basin theory: every instability has a nearest stable state to fall into.

| Basin | Stability | Used for |
|-------|-----------|----------|
| Stable Serial | 0.95 | Deadlocks, stalls |
| Fallback Chain | 0.80 | Loops, oscillations |
| Minimal Viable | 0.70 | Drift |
| Checkpoint Recovery | 0.85 | Cascades |
| Human-in-the-Loop | 1.0 | Last resort |

---

*"Every chaos resolves into a basin. The question is which one you choose."*
