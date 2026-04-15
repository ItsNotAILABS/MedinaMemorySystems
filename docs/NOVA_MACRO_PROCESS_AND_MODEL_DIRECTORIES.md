# NOVA OVO Macro Process & Model Directories

## Model Family Directory

### 1. Strategist
- **Domain**: Macro-level planning, vision, sovereign decisions
- **Keywords**: strategy, plan, vision, macro, sovereign, decide
- **Avg Latency**: ~420ms

### 2. Builder
- **Domain**: Construction, code generation, system design
- **Keywords**: build, create, code, implement, design, construct
- **Avg Latency**: ~380ms

### 3. Analyst
- **Domain**: Data analysis, pattern recognition, insights
- **Keywords**: analyze, data, pattern, trend, insight, measure
- **Avg Latency**: ~350ms

### 4. Governance
- **Domain**: Policy, proposals, compliance, doctrine enforcement
- **Keywords**: govern, proposal, vote, policy, doctrine, audit
- **Avg Latency**: ~400ms

### 5. Memory Curator
- **Domain**: Memory triage, resonance scoring, lineage tracking
- **Keywords**: memory, remember, recall, store, coordinate, lineage
- **Avg Latency**: ~290ms

### 6. Operations
- **Domain**: Day-to-day workflows, task routing, execution
- **Keywords**: operate, task, workflow, execute, manage, run
- **Avg Latency**: ~320ms

### 7. Risk
- **Domain**: Risk assessment, threat modeling, gate enforcement
- **Keywords**: risk, threat, danger, secure, gate, protect
- **Avg Latency**: ~460ms

### 8. Projection
- **Domain**: Future state, scenario modeling, forecasting
- **Keywords**: project, forecast, future, scenario, predict
- **Avg Latency**: ~510ms

## Routing Algorithm

The model router scores each model family based on keyword presence in the prompt, then selects the highest-scoring family. Ties default to Strategist.

## Macro Process Flow

```
User Input
    │
    ├─→ Command? (/verb) → CommandParser → Module Handler → StructuredResponse
    │
    └─→ Natural Language → ModelRouter → ModelFamily → MockResponse
                                    ↓
                            Record to ReplayEngine
                                    ↓
                            Return to ChatInterface
```
