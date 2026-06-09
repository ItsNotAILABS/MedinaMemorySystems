# 𓂀 Medina Organism SDK — Julia

**The unified SDK that combines ALL protocols into one living, callable organism.**

## Installation

```julia
using Pkg
Pkg.develop(path="sdk/julia/MedinaOrganism")
```

## Quick Start

```julia
using MedinaOrganism

# Create the organism — all protocols active
org = create_organism()

# ═══ Quantum Decision Making ═══
decision = quantum_decide(org, ["invest", "hold", "sell"])
println("Decision: $(decision["option"]) (p=$(decision["probability"]))")

# With bias toward an option
decision = quantum_decide(org, ["yes", "no", "maybe"], 
                          biases=Dict("yes" => 0.3))

# ═══ Memory Operations ═══
remember!(org, "market_data", Dict("sp500" => 5200), importance=0.9)
remember!(org, "weather", "sunny", importance=0.3)
memories = recall(org, query="market")

# ═══ Pattern Recognition ═══
learn_pattern!(org, "bullish", [0.9, 0.8, 0.7, 0.6])
learn_pattern!(org, "bearish", [0.1, 0.2, 0.3, 0.4])
match = recognize(org, [0.85, 0.75, 0.65, 0.55])

# ═══ Swarm Optimization ═══
result = optimize(org, 3, x -> -(x[1]^2 + x[2]^2 + x[3]^2);
                  iterations=100, swarm_size=30)
println("Optimal: $(result["best_position"])")

# ═══ Temporal Reasoning ═══
record!(org, "user_request", Dict("query" => "status"))
record!(org, "system_response", Dict("status" => "ok"))
link_cause!(org, "user_request", "system_response")
effects = trace_effects(org, "user_request")

# ═══ Attention Management ═══
focus!(org, "critical_alert", priority=0.95)
focus!(org, "background_task", priority=0.2)
current_focus = get_focus(org)

# ═══ Multi-Criteria Decisions ═══
result = decide(org,
    Dict("cost" => Dict{String,Any}("weight" => 0.4, "minimize" => true),
         "quality" => Dict{String,Any}("weight" => 0.6, "minimize" => false)),
    Dict("vendor_a" => Dict("cost" => 100.0, "quality" => 8.0),
         "vendor_b" => Dict("cost" => 150.0, "quality" => 9.0))
)
println("Best: $(result["winner"])")

# ═══ Predictive Coding ═══
predict!(org, 0, [0.5, 0.3, 0.2])
error = observe!(org, 0, [0.6, 0.2, 0.3])
println("Surprise: $(surprise(org))")

# ═══ Organism Heartbeat ═══
for _ in 1:10
    report = tick!(org)
end

println(status(org))
```

## Protocol Reference

| Function | Domain | Description |
|----------|--------|-------------|
| `quantum_decide` | Quantum | Superposition measurement |
| `remember!` / `recall` | Memory | Store and retrieve |
| `optimize` | Swarm | PSO optimization |
| `record!` / `link_cause!` | Temporal | Causal chains |
| `learn_pattern!` / `recognize` | Pattern | Feature matching |
| `focus!` / `unfocus!` | Attention | Priority allocation |
| `bind_features!` | Neural | Phase synchronization |
| `predict!` / `observe!` | Predictive | Error minimization |
| `decide` | Decision | Multi-criteria TOPSIS |
| `causal_strength` / `what_if` | Causal | Counterfactuals |

## Architecture

```
MedinaOrganism module
├── QuantumState          → Superposition & measurement
├── TemporalEngine        → φ-scaled time & causality
├── SwarmEngine           → PSO optimization
├── MemoryEngine          → Consolidation & decay
├── PatternEngine         → Recognition & learning
├── AttentionEngine       → Focus & allocation
├── CausalEngine          → Inference & intervention
├── PredictiveEngine      → Hierarchical prediction
└── OrganismSDK           → Unified living interface
```

## φ Constants

```julia
PHI     = 1.618033988749895  # Golden ratio
PHI_INV = 0.618033988749895  # 1/φ
PHI_SQ  = 2.618033988749895  # φ²
```

## Attribution

Alfredo Medina Hernandez | Medina Tech | Dallas TX | 2026  
License: ISIL-1.1
