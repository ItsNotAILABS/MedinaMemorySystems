# agent-signal

> Pub/sub signal bus for AI agents and multi-agent teams.

Agents emit signals. Other agents subscribe and receive them. Signals carry a type (BROADCAST, DIRECT, ROLE, URGENT), a priority, a subject, and any payload you attach.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Install

```bash
npm install agent-signal
```

## Quick Start

```typescript
import { SignalBus } from 'agent-signal';

const bus = new SignalBus();

// Subscribe
const unsub = bus.subscribe('analyst', signal => {
  console.log(`analyst received: ${signal.subject}`, signal.payload);
});

// Broadcast from lead
bus.emit('lead', 'task:assigned', { taskId: 'task-001' });

// Direct message to analyst
bus.emit('lead', 'context:shared', { background: '...' }, {
  type: 'DIRECT',
  to: 'analyst',
});

// Target a role
bus.emit('sovereign', 'directive:issued', 'Do not ship unvalidated.', {
  type: 'ROLE',
  to: 'GUARDIAN',
  priority: 'CRITICAL',
});

// Read inbox
const inbox = bus.inbox('analyst');
bus.markRead('analyst');

// Unsubscribe
unsub();
```

## Signal Types

| Type        | Who receives it                           |
|-------------|-------------------------------------------|
| `BROADCAST` | All subscribers                           |
| `DIRECT`    | One agent by ID                           |
| `ROLE`      | All agents with a matching role           |
| `URGENT`    | All subscribers — fires handlers immediately |

## Priorities

`LOW` → `NORMAL` → `HIGH` → `CRITICAL`

`CRITICAL` signals fire handlers synchronously on emit, regardless of type.

## Channels

Scope a bus to a session or topic:

```typescript
import { SignalBus, SignalChannel } from 'agent-signal';

const bus = new SignalBus();
const session = new SignalChannel('session-abc', bus);

session.emit('lead', 'ready', null);
const inbox = session.inbox('analyst'); // only session-abc: signals
```

## API

### `SignalBus`

```typescript
new SignalBus(options?: { maxHistory?: number })  // Default history: 1000

bus.subscribe(agentId: string, handler: SignalHandler): () => void
bus.emit(from: string, subject: string, payload?, options?: EmitOptions): Signal
bus.inbox(agentId: string, role?: string, options?: InboxOptions): Signal[]
bus.markRead(agentId: string, role?: string): number
bus.bySubject(prefix: string): Signal[]
bus.from(agentId: string): Signal[]
bus.size(): number
bus.clear(): void
```

### `SignalChannel`

```typescript
new SignalChannel(name: string, bus: SignalBus)

channel.emit(from, subject, payload?, options?)
channel.inbox(agentId, role?, options?)
channel.markRead(agentId, role?)
```

### Helpers

```typescript
createBus(options?)          // new standalone SignalBus
createChannel(name, bus)     // new SignalChannel on existing bus
```

---

MIT License © ItsNotAILABS
