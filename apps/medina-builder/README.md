# Medina Builder Standalone App

Real Next.js app with **server-side disk export** — writes complete runnable projects to `generated/`.

## Run the builder UI

```bash
# From repo root
npm run builder:dev

# Or from this directory
npm install
npm run dev
```

Open http://localhost:3001 — use **Export to Disk** (works here because API routes run on the server).

## Build a demo app on disk

From repo root:

```bash
npm run builder:export   # writes generated/medina-demo-app/
npm run builder:build    # export + npm install + npm run build
```

Then run the generated app:

```bash
cd generated/medina-demo-app
npm run dev
```

Open http://localhost:3000
