# NOVA OVO Quickstart

## Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Interface Overview

### Chat (Primary Surface)
Type naturally or use `/commands`:

```
/memory find doctrine
/govern list
/model list
/organism status
/help
```

### Panels
- **Chat** — Universal command + conversational interface
- **Memory Temple** — Spatial memory navigation with coordinate system
- **Governance** — Proposals, voting, audit log, gate management
- **Models** — 8 model families with invocation
- **Company** — CONNECT / INTERNALIZE / HYBRID onboarding
- **Replay** — Session audit and event replay
- **Permissions** — Fine-grained permission grants

## Command Reference

### Memory
```
/memory list              List recent memories
/memory find <query>      Search by content/tags
/memory store <content>   Store new memory
/memory pin <id>          Pin a memory
/memory dual <query>      Dual semantic+resonance read
/memory root              Jump to root memory
/memory lineage <id>      Show memory lineage
```

### Governance
```
/govern list              List all proposals
/govern propose <title>   Create proposal
/govern gates             Show gate statuses
/govern status            Governance stats
/govern audit             Audit log
```

### Models
```
/model list               List model families
/model invoke <id> <prompt>  Invoke a model
/model route <prompt>     Route to best model
/model status             Model health status
```

### Organism
```
/organism status          Show 4-register state
```

## Gates
- **Gate A** — Governance enactment gate
- **Gate B** — Memory write authorization
- **Gate C** — Sovereign broadcast gate

Gate statuses are shown in the header bar and update every 5 seconds.

## Architecture

Built with Next.js 14 App Router, TypeScript, Tailwind CSS. All state is in-memory (no external database required for development).
