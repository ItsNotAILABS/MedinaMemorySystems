# AGENTS.md

## Cursor Cloud specific instructions

### Overview

MEDINA / NOVA OVO is a sovereign intelligence platform with two layers:
- **Next.js web app** (`nova-ovo`): Full-stack Next.js 15 + React 18 + Tailwind CSS + TypeScript. All state is in-memory (no external database). This is the primary development target.
- **ICP Motoko canister** (`medina`): Optional layer for Internet Computer deployment. Requires `dfx` and `mops` (not installed by default).

### Running the app

**Requires Node.js 20** (see `.nvmrc`). Use `nvm use` or `fnm use` before installing.

```bash
npm run dev       # Start Next.js dev server on http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint (requires .eslintrc.json to exist)
npm run type-check # TypeScript type checking (tsc --noEmit)
```

### Key caveats

- **No external services required**: The app uses in-memory state — no database, no Redis, no API keys needed.
- **ESLint config**: An `.eslintrc.json` with `"extends": "next/core-web-vitals"` must exist for `npm run lint` to run non-interactively. Without it, `next lint` prompts for interactive setup.
- **Dark UI theme**: The app uses a near-black background (`#0a0a0f`). When testing with computerUse, be aware content may appear as a dark screen but is functional. Verify via API calls (`curl`) alongside UI testing.
- **API endpoints**: `/api/chat`, `/api/memory`, `/api/govern`, `/api/model`, `/api/company`, `/api/replay`, `/api/permissions`, `/api/ai/mcp`, `/api/builder` — all accept POST (and some GET with `?action=` query param).
- **iPhone Bridge MCP**: Full app at `integrations/mcp-iphone-bridge/` — Bluetooth + USB, all MCP hosts. Configure via `.cursor/mcp.json`. Tools at `/api/ai/mcp?action=tools&server=iphone-bridge`.
- **ICP canister layer** (`dfx.json`, `mops.toml`, `icp/` directory) is optional and not needed for the main web app development.
