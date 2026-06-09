# PROTO-MM-002: Adaptive Model Routing Protocol

## Multi-Model Protocol Canon — Chapter 2

**Protocol ID:** PROTO-MM-002  
**Version:** 1.0  
**Status:** CANONICAL  
**Role:** Intelligent Task-to-Model Routing

---

## 1. Definition

The Adaptive Model Routing Protocol selects the optimal model for each task based on configurable routing strategies. It supports φ-optimal, capability-match, cost-efficient, latency-optimal, quality-first, and balanced strategies with constraint enforcement.

## 2. Interfaces

### PROTO-MM-002-API

**Input:**
- Required capabilities for the task
- Routing strategy selection
- Optional constraints (maxCost, maxLatency, minQuality)

**Output:**
- Routing decision with selected model, score, and alternatives
- Strategy reasoning trace

## 3. Invariants

| Invariant | Description |
|-----------|-------------|
| Strategy Consistent | Same inputs + strategy = deterministic ranking |
| Constraint Respected | Models violating constraints score zero |
| Alternative Provided | Always includes ranked alternatives |
| History Preserved | All routing decisions logged |
| φ-Optimal Default | Default strategy uses golden-ratio weighting |

## 4. Operations

```
MM-ROUTE: Route task to optimal model
  Input: capabilities[], strategy, constraints
  Output: RoutingDecision (model, score, alternatives)

MM-SCORE: Score a model for given strategy
  Input: model, strategy, constraints
  Output: numeric score (0 = excluded)
```

## 5. Integration

- **PROTO-MM-001**: Reads model registry for candidates
- **PROTO-MM-006**: Factors health into routing scores
- **PROTO-MM-008**: Task decomposer routes subtasks

---

*Protocol PROTO-MM-002 is CANONICAL and attested by MULTI-MODEL-001.*  
*© 2026 ItsNotAILABS.*
