# Papers — ItsNotAILABS

Public research and practical guides from **ItsNotAILABS**.

Written to be read, not just cited. No prerequisites. Free to share.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../packages/consensus-engine/LICENSE)

---

## Papers

### [Why AI Teams Beat Single Models](./WHY_AI_TEAMS_BEAT_SINGLE_MODELS.md)
A plain-language case for multi-agent systems. Why self-critique fails in single models, what roles actually fix it, five patterns that make teams work, and when to use a team vs. a single model.

### [Memory in AI Systems: What Agents Remember and Why It Matters](./MEMORY_IN_AI_SYSTEMS.md)
The four types of AI agent memory (working, episodic, semantic, procedural). Why teams need tiered access. TTL expiry. The most common memory mistake. Practical examples.

### [How to Build AI Workflows That Don't Break](./HOW_TO_BUILD_AI_WORKFLOWS_THAT_DONT_BREAK.md)
Output gates, confidence tracking, fault isolation, visible disagreement, audit trails, and loop limits. A checklist for resilient pipelines.

### [Cognitive Memory Architecture in Artificial Intelligence Agents](./COGNITIVE_MEMORY_AND_AI_AGENTS.md)
A framework bridging human cognitive science (episodic, semantic, procedural, and working memory) and AI agent design. Proposes a four-tier agent memory architecture, discusses forgetting curves, transactive memory in agent teams, and presents three empirically testable hypotheses. Academic paper with full citations.

### [Incentive Structures for Multi-Agent AI Systems](./AGENT_INCENTIVE_STRUCTURES.md)
Applies classical mechanism design theory (principal-agent problem, free-rider problem, holdup problem, asymmetric information) to multi-agent AI coordination. Presents role-weighted consensus with typed authority as a structural solution, introduces token economics for AI agent networks, and outlines a research agenda.

### [Sovereign Field Models — 120 Field Intelligence Units](./SOVEREIGN_FIELD_MODELS.md)
The complete doctrine for the 120 sovereign field models wired into the MEDINA organism. 12 domains × 10 named, Latin-named intelligence units each: STREAMS, WEBRTC, COMPONENTS, WORKERS, OBSERVERS, CANVAS, SVG, XR, WASM, AUDIO, GPU, and GL. Covers architecture integration, ULRI routing participation, resonance formula, doctrine injection, and the expansion field pattern.

---

## Reference Implementations

Patterns described in these papers are implemented as MIT-licensed packages:

| Package | Description |
|---|---|
| [`packages/consensus-engine`](../packages/consensus-engine) | Weighted role-based consensus and disagreement resolution |
| [`packages/agent-signal`](../packages/agent-signal) | Pub/sub signal bus for AI agent communication |

---

## License Note

All papers in this directory are released under the **MIT License**.

The research papers in [`RESEARCH/`](../RESEARCH/) are released under **CC BY-NC-ND 4.0** (share with attribution; no commercial use; no derivatives).

---

*© 2026 ItsNotAILABS. MIT License.*

