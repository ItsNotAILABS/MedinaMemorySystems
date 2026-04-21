# ai-tools-marketplace

> A callable tools and agents marketplace for AI systems.

**MIT License** — ItsNotAILABS / Medina Memory Systems

---

## What It Is

A registry where AI agents can discover and invoke tools, form teams, share memory, and build coordinated multi-AI workflows. Designed for the reality that your AI system needs to call other things — and those other things need to know what's available.

---

## Install

```bash
npm install ai-tools-marketplace
```

## Quick Start

```typescript
import { AIToolsMarketplace } from 'ai-tools-marketplace';

const marketplace = new AIToolsMarketplace();

// Register a custom tool
marketplace.tools.register({
  id: 'summarize',
  name: 'Summarize Text',
  description: 'Summarizes any text to a given length',
  category: 'text',
  version: '1.0.0',
  inputSchema: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'Text to summarize' },
      maxWords: { type: 'number', description: 'Max words in summary' },
    },
    required: ['text'],
  },
  outputSchema: {
    type: 'object',
    properties: { summary: { type: 'string', description: 'The summary' } },
  },
  status: 'AVAILABLE',
  author: 'your-name',
  tags: ['text', 'nlp', 'summarization'],
  handler: async (input) => {
    const { text, maxWords = 50 } = input as { text: string; maxWords?: number };
    const words = text.split(' ').slice(0, maxWords);
    return { summary: words.join(' ') + (words.length < text.split(' ').length ? '…' : '') };
  },
});

// Call it
const result = await marketplace.call('summarize', { text: 'Very long text here...', maxWords: 10 });

// Describe tools for LLM function calling
const toolDefs = marketplace.describeTools();
// Feed this into your LLM as function definitions
```

## Agent Teams

```typescript
import { AgentRegistry, TeamManager, ToolRegistry } from 'ai-tools-marketplace';

const tools = new ToolRegistry();
const agents = new AgentRegistry();
const teams = new TeamManager(agents, tools);

// Register agents
agents.register({
  id: 'analyst-1',
  name: 'Data Analyst',
  role: 'ANALYST',
  description: 'Analyzes data and returns structured insights',
  capabilities: [],
  status: 'IDLE',
  tags: ['analysis', 'data'],
});

agents.register({
  id: 'builder-1',
  name: 'Code Builder',
  role: 'BUILDER',
  description: 'Generates and reviews code',
  capabilities: [],
  status: 'IDLE',
  tags: ['code', 'build'],
});

// Form a team
const team = teams.form('team-alpha', 'Alpha Team', 'Research + build team', ['analyst-1', 'builder-1'], 'analyst-1');

// Share team knowledge
teams.shareMemory('team-alpha', 'project_goal', 'Build a memory SDK');

// Broadcast a task to all team members
const results = await teams.broadcast('team-alpha', 'Analyze the architecture', { context: 'SDK design' });
```

## Agent Memory

```typescript
// Store agent memory
agents.remember('analyst-1', 'last_analysis', { findings: ['pattern A', 'pattern B'] });

// Recall later
const memory = agents.recall('analyst-1', 'last_analysis');
```

---

## Architecture

```
AIToolsMarketplace
├── ToolRegistry      — Register and invoke callable tools
├── AgentRegistry     — Register agents with roles, memory, handlers
└── TeamManager       — Form teams, broadcast tasks, share memory
```

---

*"Every AI should be able to call something. Every tool should be findable."*
