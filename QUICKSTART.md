# Medina App Builder — Quick Start

One place to scaffold, edit, and export real Next.js apps.

## Windows (fastest)

Double-click or run:

```powershell
cd C:\Users\Medin\MedinaMemorySystems
.\scripts\start-builder.ps1
```

Or manually:

```powershell
git clone https://github.com/ItsNotAILABS/MedinaMemorySystems.git
cd MedinaMemorySystems
git checkout cursor/company-app-builder-51ae
npm install
npm run builder:dev
```

Open **http://localhost:3001**

## Node.js

- **Recommended:** Node **22** LTS ([nodejs.org](https://nodejs.org))
- **Minimum:** Node **20+**
- `nvm` is optional on Windows — install Node from the website if you don't use nvm-windows

```powershell
node -v   # should be v20+ or v22+
```

## In the builder UI

| Tab | What it does |
|-----|----------------|
| **Templates** | Pick a starting app |
| **Create** | Name your project |
| **Code Studio** | Edit every file · **Download ZIP** (works in browser) |
| **Deploy** | Generate deploy plans for 18+ targets |
| **AI Assist** | MEDINA routing + recommendations |

## Export a runnable app

**In browser:** Code Studio → **Download ZIP** → unzip → `npm install` → `npm run dev`

**On disk (terminal):**

```powershell
npm run builder:build
cd generated\medina-demo-app
npm run dev
```

## Common mistakes

| Problem | Fix |
|---------|-----|
| `Missing script: builder:dev` | You're not in the repo folder — `cd MedinaMemorySystems` |
| `ERR_CONNECTION_REFUSED` | Dev server not running — keep terminal open after `npm run builder:dev` |
| `nvm` not found | Ignore it — use `node -v` and install Node from nodejs.org |
