# Signal-Driven Coordination in Multi-Agent AI Teams

**Pub/Sub Communication Patterns for Decoupled Agent Architectures**

---

**Author:** GitHub Copilot, in collaboration with ItsNotAILABS  
**Institution:** ItsNotAILABS — Intelligence Architecture & Sovereign Systems  
**Date:** April 21, 2026  
**Repository:** [ItsNotAILABS/MedinaMemorySystems](https://github.com/ItsNotAILABS/MedinaMemorySystems)  
**License:** MIT

---

## Abstract

Tightly coupled inter-agent communication — where each agent directly invokes another — produces brittle multi-agent systems. A single agent failure cascades; role changes require re-wiring every caller; audit trails are fragmented. This paper proposes a **signal-driven coordination model** for multi-agent AI teams, in which agents communicate exclusively through a pub/sub signal bus. We define four signal types (BROADCAST, DIRECT, ROLE, URGENT), a four-level priority system, and a channel abstraction for session-scoped isolation. We analyze coordination patterns for task assignment, context propagation, error escalation, and inter-team routing. The reference implementation (`agent-signal`, MIT) is released alongside this paper.

---

## 1. Introduction

When AI agents need to coordinate — passing context, flagging blockers, announcing completions — the naive design is direct invocation: Agent A calls Agent B's handler. This works for small, fixed teams. It fails at scale.

Direct invocation creates five structural problems:

1. **Coupling** — Agent A must know Agent B's interface, location, and availability.
2. **Cascade failure** — A failure in Agent B returns an error to Agent A, which must handle it.
3. **Fan-out cost** — Broadcasting to ten agents requires ten direct calls.
4. **Audit fragmentation** — Communication records are spread across callers.
5. **Role inflexibility** — Adding a new agent role requires updating every agent that might need to contact it.

Pub/sub communication solves all five. Agents emit signals. Other agents subscribe. The bus routes, records, and delivers. Agents are decoupled by design.

---

## 2. Signal Model

A signal is the atomic unit of inter-agent communication:

```typescript
interface Signal {
  id: string;           // Unique ID
  type: SignalType;     // Routing type
  from: string;         // Emitting agent ID
  to?: string;          // Target agent ID or role (type-dependent)
  subject: string;      // Short descriptor (namespaced: 'task:assigned')
  payload: unknown;     // Arbitrary data
  priority: Priority;   // LOW | NORMAL | HIGH | CRITICAL
  read: boolean;        // Delivery state
  timestamp: string;    // ISO 8601
}
```

### 2.1 Signal Types

**BROADCAST** — Delivered to all subscribers. Used for team-wide announcements: task completions, phase changes, new context.

**DIRECT** — Delivered to one agent by ID. Used for targeted communication: task delegation, private clarification requests.

**ROLE** — Delivered to all agents holding a specified role. Used for role-functional requests: "all GUARDIANs, please review this output."

**URGENT** — Delivered to all subscribers with immediate synchronous handler invocation. Used for critical events: pipeline failures, veto decisions, security alerts.

### 2.2 Priority Ordering

```
CRITICAL > HIGH > NORMAL > LOW
```

`CRITICAL` signals (and `URGENT` type signals) fire registered handlers synchronously at emit time. All other signals are delivered on inbox read.

---

## 3. Coordination Patterns

### 3.1 Task Assignment

```
lead → BROADCAST: 'task:assigned' { taskId, description, assignedTo }
```

All agents receive the broadcast. Agents check `assignedTo` against their own ID or role. Unassigned agents ignore it.

**Advantage over direct call:** Adding a new agent role to the team requires no changes to the lead's code.

### 3.2 Context Propagation

```
researcher → BROADCAST: 'context:ready' { source, summary }
analyst    → DIRECT to 'builder': 'context:refined' { details }
```

The BROADCAST notifies all agents that background context is available. The DIRECT carries refined details specifically to the builder. Both are recorded in the bus history — full audit trail.

### 3.3 Blocker Escalation

```
builder → DIRECT to 'lead': 'blocker:raised' { issue, urgency: 'HIGH' }
lead    → ROLE to 'CRITIC': 'blocker:review' { issue }
```

The builder raises a blocker to the lead. The lead routes it to all critics by role. No agent needs to know how many critics are on the team or who they are.

### 3.4 Critical Event (Pipeline Failure)

```
system → URGENT BROADCAST: 'pipeline:failed' { stage, reason }
         priority: CRITICAL
```

CRITICAL priority fires all subscribed handlers immediately. The sovereign and guardian agents are notified before the next event loop tick. Human-alerting hooks can subscribe at the same level.

### 3.5 Inter-Team Routing

When an orchestrator manages multiple teams, the bus can be scoped to a named channel per team and a shared bus across teams. Cross-team signals travel the shared bus; intra-team signals travel the team channel. Agents subscribe to their own channel; the orchestrator subscribes to both.

---

## 4. Inbox Model

Each agent has a logical inbox: the set of unread signals addressed to them. An agent "processes its inbox" by reading, acting, and marking read:

```
inbox(agentId, role) → filters signals by:
  - type BROADCAST: always included
  - type URGENT: always included
  - type DIRECT: included if signal.to === agentId
  - type ROLE: included if signal.to === role
  - read === false (default)
```

Inboxes support filtering by subject prefix, minimum priority, and read state. A session channel ensures an agent reading its inbox for `session-001` only sees signals scoped to that session.

---

## 5. Channel Scoping

In long-running systems, a single bus accumulates signals across many sessions. Channel scoping provides session isolation without a separate bus per session:

```
channel = SignalChannel('session-abc', bus)
channel.emit('lead', 'ready', null)
inbox = channel.inbox('analyst')  // only 'session-abc:*' subjects
```

Channels prepend the channel name to every subject. Inbox reads filter by that prefix. Multiple sessions share the same underlying bus (and therefore the same handlers and history) while remaining logically isolated.

---

## 6. Bus Properties

### 6.1 Isolation
Handler errors are caught and isolated. One agent's broken subscription handler cannot crash the bus or block delivery to other agents.

### 6.2 History
All signals are retained in order (up to a configurable `maxHistory`, default 1000). History supports full audit: replay, debugging, and post-hoc analysis.

### 6.3 Unsubscribe
Every `subscribe` call returns an unsubscribe function. Agents that are deactivated or removed from the team can cleanly unsubscribe.

### 6.4 Statelessness of Agents
Agents do not need to hold references to each other. They hold a reference to the bus. This means agents can be added, removed, or replaced without modifying any other agent's code.

---

## 7. Comparison to Direct Invocation

| Property           | Direct Invocation      | Signal Bus                  |
|--------------------|------------------------|-----------------------------|
| Coupling           | Tight (caller knows callee) | Loose (only bus interface) |
| Fan-out            | O(n) calls, O(n) errors | 1 emit                     |
| Audit trail        | Fragmented             | Centralized in bus          |
| Role flexibility   | Hard-coded             | Runtime-configurable        |
| Failure isolation  | Cascades to caller     | Isolated to handler         |
| Replay / debug     | Manual                 | Built-in history            |

---

## 8. Conclusion

Signal-driven coordination produces multi-agent AI systems that are decoupled, auditable, and resilient. The four signal types cover the full spectrum of inter-agent communication: team-wide announcements, targeted delegation, role-functional requests, and critical events. The channel abstraction provides session isolation without sacrificing the shared history that makes large systems debuggable. The reference implementation is available as `agent-signal` (MIT) in this repository.

---

## References

1. Hohpe & Woolf, *Enterprise Integration Patterns*, Addison-Wesley, 2003.  
2. Gamma et al., *Design Patterns: Elements of Reusable Object-Oriented Software*, Addison-Wesley, 1994.  
3. Wang et al., "Voyager: An Open-Ended Embodied Agent with Large Language Models," NeurIPS 2023.  
4. Medina Memory Systems — Internal Architecture Documentation, ItsNotAILABS, 2025–2026.

---

*© 2026 ItsNotAILABS. Released under MIT License.*
