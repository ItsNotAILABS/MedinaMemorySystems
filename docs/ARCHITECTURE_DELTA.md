# Architecture Delta — NOVA OVO v1.0.0

## What Changed From Prior Architecture

### v1.0.0 — Initial Production Release

**New:**
- Full Next.js 14 App Router implementation
- 8 model families (added Risk and Projection)
- Dual Read protocol (semantic + resonance)
- Gate C (Sovereign Gate) added to existing A/B
- Company onboarding with CONNECT/INTERNALIZE/HYBRID
- Replay Engine for session audit
- Fine-grained Permissions Manager
- OrganismField header with live 4-register display
- Spatial visualization in Memory Temple
- RECITAL_PLUS_ONE law implementation

**Architecture Decisions:**
- All state in-memory (no external database dependency)
- Mock AI responses (no external API keys required)
- Server Components for layout, Client Components for interactivity
- All API routes follow RESTful `?action=` pattern
- TypeScript strict mode throughout

**Known Limitations:**
- State resets on server restart (in-memory only)
- Mock responses not backed by real models
- No authentication layer in v1.0.0
- No persistence layer in v1.0.0

**Planned for v1.1.0:**
- Redis/PostgreSQL persistence
- Real model API integration (OpenAI, Anthropic, etc.)
- Authentication with permission binding
- WebSocket for real-time organism pulse
- Export/import for memory and governance state
