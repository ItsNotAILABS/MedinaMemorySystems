# PROTO-MM-003: Cross-Model Consensus Protocol

## Multi-Model Protocol Canon — Chapter 3

**Protocol ID:** PROTO-MM-003  
**Version:** 1.0  
**Status:** CANONICAL  
**Role:** Multi-Model Agreement and Decision Fusion

---

## 1. Definition

The Cross-Model Consensus Protocol coordinates multiple AI models to produce agreed-upon outputs. It supports φ-weighted, majority vote, confidence-max, unanimous, and hierarchical consensus modes with agreement scoring and φ-coherence measurement.

## 2. Interfaces

### PROTO-MM-003-API

**Input:**
- Prompt to resolve across models
- List of participating model IDs
- Consensus mode and minimum agreement threshold

**Output:**
- Individual model results with confidence scores
- Fused consensus output
- Agreement score and φ-coherence metric

## 3. Invariants

| Invariant | Description |
|-----------|-------------|
| Multi-Source | Requires 2+ models for meaningful consensus |
| Confidence Weighted | Higher confidence outputs weight more |
| φ-Coherence Bounded | Coherence always between 0 and φ |
| Agreement Measured | Variance-based agreement calculation |
| Mode Respected | Fusion follows selected consensus mode |

## 4. Operations

```
MM-CONSENSUS: Resolve prompt across models
  Input: prompt, model_ids[], mode, min_agreement
  Output: ConsensusResponse (fused output, agreement, coherence)

MM-FUSE: Combine model outputs by strategy
  Input: results[], mode
  Output: fused_output string
```

## 5. Integration

- **PROTO-MM-001**: Models resolved from registry
- **PROTO-MM-009**: Synthesis may follow consensus
- **PROTO-MM-007**: Governance gates may restrict participants

---

*Protocol PROTO-MM-003 is CANONICAL and attested by MULTI-MODEL-001.*  
*© 2026 ItsNotAILABS.*
