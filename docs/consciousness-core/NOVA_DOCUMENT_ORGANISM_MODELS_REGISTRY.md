# NOVA Document Organism Models Registry

## Registry

| Model ID | Name | Primary Domain | Ring Affinity |
|----------|------|----------------|---------------|
| strategist | Strategist | Macro planning | N1–N4 |
| builder | Builder | Construction | N5–N7 |
| analyst | Analyst | Data analysis | N7–N9 |
| governance | Governance | Policy & compliance | N2–N4 |
| memory-curator | Memory Curator | Memory management | N7 |
| operations | Operations | Workflow execution | N5–N6 |
| risk | Risk | Threat assessment | N3–N5 |
| projection | Projection | Future modeling | N4–N6 |

## Model Selection Protocol

1. Parse incoming prompt for keyword signals
2. Score each model family (1 point per matching keyword)
3. Select highest-scoring family
4. Tie-break: prefer model with ring affinity matching current dominant ring
5. Default: Strategist

## Model Health States

- **active**: Currently processing or ready
- **idle**: Available but not recently used
- **loading**: Warming up (usually 1–2 beats)
- **offline**: Unavailable (check gateway)
