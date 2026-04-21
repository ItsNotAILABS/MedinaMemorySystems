# Papers — ItsNotAILABS

Public research and practical guides from **ItsNotAILABS**.

Written to be read, not just cited. No prerequisites. Free to share.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../packages/medina-memory-sdk/LICENSE)

---

## Papers

### [Why AI Teams Beat Single Models](./WHY_AI_TEAMS_BEAT_SINGLE_MODELS.md)
A plain-language case for multi-agent systems. Why self-critique fails in single models, what roles actually fix it, five patterns that make teams work, and when to use a team vs. a single model.

### [Memory in AI Systems: What Agents Remember and Why It Matters](./MEMORY_IN_AI_SYSTEMS.md)
The four types of AI agent memory (working, episodic, semantic, procedural). Why teams need tiered access (PUBLIC / SHARED / PRIVATE / SOVEREIGN). TTL expiry. The most common memory mistake. Practical examples.

### [How to Build AI Workflows That Don't Break](./HOW_TO_BUILD_AI_WORKFLOWS_THAT_DONT_BREAK.md)
Output gates, confidence tracking, fault isolation, visible disagreement, audit trails, and loop limits. A checklist for resilient pipelines. The patterns every multi-agent system needs before it ships.

---

## Reference Implementations

All patterns described in these papers are implemented as MIT-licensed packages in this repository:

| Package | Description |
|---|---|
| [`packages/medina-memory-sdk`](../packages/medina-memory-sdk) | Full multi-AI team engine — roles, memory, pipelines, consensus |
| [`packages/consensus-engine`](../packages/consensus-engine) | Weighted role-based consensus and disagreement resolution |
| [`packages/agent-signal`](../packages/agent-signal) | Pub/sub signal bus for AI agent communication |
| [`packages/team-vault`](../packages/team-vault) | Tiered memory store with TTL and access control |

---

*© 2026 ItsNotAILABS. MIT License.*
