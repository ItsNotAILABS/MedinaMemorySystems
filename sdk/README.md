# 𓂀 Medina Organism SDK — Unified Protocol Interface

**All 44+ protocols combined into one super-usable SDK in Python and Julia.**

> "The organism IS the computation. This SDK wraps it into a living, callable unit."

## SDKs Available

| Language | Path | Status |
|----------|------|--------|
| **Python** | `sdk/python/` | ✅ Ready |
| **Julia** | `sdk/julia/MedinaOrganism/` | ✅ Ready |

## What's Included

Every cognitive protocol from the organism — unified under a single `create_organism()` call:

### Core Protocols
- **Quantum Coherence** (PROTO-231) — Superposition, phase rotation, entanglement, measurement
- **Temporal Reasoning** (PROTO-232) — φ-scaled time perception, causal chains
- **Swarm Intelligence** (PROTO-233) — PSO optimization, convergence detection

### Cognitive Architecture (10 Protocols)
- Memory Consolidation, Memory Retrieval, Working Memory
- Attention Mechanism, Attention Routing
- Neural Binding, Neural Plasticity
- Pattern Recognition
- Episodic Encoding
- Semantic Fusion

### Reasoning Domain (8 Protocols)
- Causal Inference, Symbolic Reasoning, Spatial Reasoning
- Analogy Engine, Hypothesis Generation, Belief Revision
- Context Integration, Knowledge Synthesis

### Planning Domain (5 Protocols)
- Planning, Hierarchical Planning, Goal Management
- Action Selection, Constraint Satisfaction

### Learning Domain (5 Protocols)
- Learning Adaptation, Schema Learning, Reward Shaping
- Error Correction, Concept Formation

### Decision & Prediction (4 Protocols)
- Decision Optimization, Predictive Coding
- Resource Allocation, Emergence Detection

### Self & Communication (5 Protocols)
- Emotion Modeling, Self Model, World Model
- Communication, Cognitive Graph

## Quick Start (Python)

```python
from medina_organism import create_organism

org = create_organism()

# Quantum decision-making
decision = org.quantum_decide(["invest", "hold", "sell"])

# Memory
org.remember("market", {"sp500": 5200}, importance=0.9)
memories = org.recall("market")

# Optimization  
best = org.optimize(3, lambda x: -sum(xi**2 for xi in x), iterations=100)

# Full heartbeat cycle
report = org.tick()
```

## Quick Start (Julia)

```julia
using MedinaOrganism

org = create_organism()

# Quantum decision-making
decision = quantum_decide(org, ["invest", "hold", "sell"])

# Memory
remember!(org, "market", Dict("sp500" => 5200), importance=0.9)
memories = recall(org, query="market")

# Optimization
best = optimize(org, 3, x -> -(x[1]^2 + x[2]^2 + x[3]^2), iterations=100)

# Full heartbeat cycle
report = tick!(org)
```

## Architecture

```
sdk/
├── python/
│   ├── medina_organism/
│   │   ├── __init__.py        # Main exports
│   │   ├── core.py            # φ constants & config
│   │   ├── protocols.py       # All protocol implementations
│   │   ├── organism.py        # OrganismSDK unified interface
│   │   └── registry.py        # Protocol registry (44 protocols)
│   ├── tests/
│   │   └── test_organism_sdk.py  # 21 comprehensive tests
│   ├── pyproject.toml
│   └── README.md
└── julia/
    └── MedinaOrganism/
        ├── src/
        │   └── MedinaOrganism.jl  # Complete Julia implementation
        ├── Project.toml
        └── README.md
```

## Design Principles

1. **φ-Coherent** — All timing, decay, and resonance follows the golden ratio
2. **Zero Ceremony** — `create_organism()` gives you everything immediately
3. **Protocol Fusion** — Individual protocols compose seamlessly
4. **Living Interface** — The SDK `tick()`s like a heartbeat, maintaining coherence
5. **Dual Language** — Identical API philosophy in both Python and Julia

## Attribution

Alfredo Medina Hernandez | Medina Tech | Dallas TX | 2026  
License: ISIL-1.1  
Omnis functio ad φ redit — Every function returns to φ.
