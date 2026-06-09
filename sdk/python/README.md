# 𓂀 Medina Organism SDK — Python

**The unified SDK that combines ALL protocols into one living, callable organism.**

## Installation

```bash
pip install -e sdk/python/
```

## Quick Start

```python
from medina_organism import create_organism

# Create the organism — all protocols active
org = create_organism()

# ═══ Quantum Decision Making ═══
decision = org.quantum_decide(["invest", "hold", "sell"], biases={"invest": 0.3})
print(f"Decision: {decision['option']} (p={decision['probability']:.3f})")

# ═══ Memory Operations ═══
org.remember("market_data", {"sp500": 5200, "trend": "up"}, importance=0.9)
org.remember("weather", "sunny and warm", importance=0.3)
memories = org.recall("market")

# ═══ Pattern Recognition ═══
org.learn_pattern("bullish", [0.9, 0.8, 0.7, 0.6])
org.learn_pattern("bearish", [0.1, 0.2, 0.3, 0.4])
match = org.recognize([0.85, 0.75, 0.65, 0.55])  # -> bullish

# ═══ Swarm Optimization ═══
best = org.optimize(
    dimensions=3,
    fitness_fn=lambda x: -(x[0]**2 + x[1]**2 + x[2]**2),  # minimize distance to origin
    iterations=100,
    swarm_size=30
)
print(f"Optimal: {best['best_position']}")

# ═══ Temporal Reasoning ═══
org.record("user_request", {"query": "status"})
org.record("system_response", {"status": "ok"})
org.link_cause("user_request", "system_response")
effects = org.trace_effects("user_request")

# ═══ Attention Management ═══
org.focus("critical_alert", priority=0.95)
org.focus("background_task", priority=0.2)
focus_list = org.get_focus()  # -> ["critical_alert", "background_task"]

# ═══ Multi-Criteria Decisions ═══
result = org.decide(
    criteria={
        "cost": {"weight": 0.4, "minimize": True},
        "quality": {"weight": 0.6, "minimize": False},
    },
    alternatives={
        "vendor_a": {"cost": 100, "quality": 8},
        "vendor_b": {"cost": 150, "quality": 9},
        "vendor_c": {"cost": 80, "quality": 6},
    }
)
print(f"Best vendor: {result['winner']}")

# ═══ Predictive Coding ═══
org.predict(level=0, prediction=[0.5, 0.3, 0.2])
error = org.observe(level=0, observation=[0.6, 0.2, 0.3])
print(f"Surprise: {org.surprise():.4f}")

# ═══ Neural Binding ═══
binding = org.bind_features({
    "color": {"type": "visual", "value": "red"},
    "shape": {"type": "visual", "value": "circle"},
    "sound": {"type": "auditory", "value": "beep"},
})
print(f"Binding coherence: {binding['coherence']:.3f}")

# ═══ Organism Heartbeat ═══
for _ in range(10):
    report = org.tick()
    
print(org.status())
```

## Protocol Reference

| Protocol | Domain | Description |
|----------|--------|-------------|
| `QuantumCoherenceProtocol` | Quantum | Superposition, phase rotation, measurement |
| `TemporalReasoningProtocol` | Temporal | φ-scaled time, causal chains |
| `SwarmIntelligenceProtocol` | Swarm | PSO optimization, convergence |
| `MemoryConsolidationProtocol` | Memory | Store, recall, consolidate, decay |
| `PatternRecognitionProtocol` | Pattern | Learn, recognize, adapt patterns |
| `NeuralBindingProtocol` | Neural | Phase sync, feature binding |
| `CausalInferenceProtocol` | Causal | Causal graphs, intervention, counterfactuals |
| `AttentionMechanismProtocol` | Attention | Focus, release, decay |
| `PredictiveCodingProtocol` | Predictive | Hierarchical prediction, surprise |
| `DecisionOptimizationProtocol` | Decision | Multi-criteria TOPSIS |

## Architecture

The SDK wraps the organism's 44+ cognitive protocols into a single `OrganismSDK` class.
Every operation is φ-coherent — timing, decay, and resonance all follow the golden ratio.

```
OrganismSDK
├── quantum    → QuantumCoherenceProtocol
├── temporal   → TemporalReasoningProtocol  
├── swarm      → SwarmIntelligenceProtocol
├── memory     → MemoryConsolidationProtocol
├── patterns   → PatternRecognitionProtocol
├── binding    → NeuralBindingProtocol
├── causal     → CausalInferenceProtocol
├── attention  → AttentionMechanismProtocol
├── predictive → PredictiveCodingProtocol
└── decision   → DecisionOptimizationProtocol
```

## φ Constants

```python
from medina_organism import PHI, PHI_INV, PHI_SQ

PHI     = 1.618033988749895  # Golden ratio
PHI_INV = 0.618033988749895  # 1/φ
PHI_SQ  = 2.618033988749895  # φ²
```

## Attribution

Alfredo Medina Hernandez | Medina Tech | Dallas TX | 2026  
License: ISIL-1.1
