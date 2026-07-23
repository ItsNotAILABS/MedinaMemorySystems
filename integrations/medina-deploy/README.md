# medina-deploy CLI

Unified deploy CLI for **Medina Company App Builder** projects.

## Install

```bash
npm install -g ./integrations/medina-deploy
# or from App Builder UI — copy commands from Deploy tab
```

## ICP (new CLI flow — not raw dfx only)

```bash
# Local replica
medina-deploy icp --network local --project my-app

# Mainnet
medina-deploy icp --network ic --project my-app
```

The App Builder generates `deploy/dfx.json`, `deploy/mops.toml`, `deploy/deploy-icp.sh` and `deploy/deploy-icp.ps1` automatically.

## SaaS platforms

| Command | Platform |
|---------|----------|
| `medina-deploy vercel` | Vercel |
| `medina-deploy cloudflare` | Cloudflare Workers |
| `medina-deploy netlify` | Netlify |
| `medina-deploy railway` | Railway |
| `medina-deploy flyio` | Fly.io |
| `medina-deploy render` | Render |

## Blockchain

| Command | Chain |
|---------|-------|
| `medina-deploy evm --chain ethereum` | Ethereum |
| `medina-deploy evm --chain base` | Base L2 |
| `medina-deploy solana` | Solana |

## Other

| Command | Target |
|---------|--------|
| `medina-deploy docker` | Docker Compose |
| `medina-deploy k8s` | Kubernetes |
| `medina-deploy wasm` | WASM edge capsule |
| `medina-deploy export` | ZIP artifact export |

## Also suggested (via App Builder UI)

- **GitHub Pages** — static sites
- **AWS Amplify** — full-stack AWS
- **Supabase** — Postgres + edge functions
- **Shopify Hydrogen** — headless commerce

All targets generate copy-paste CLI commands + deploy scripts in the App Builder **Deploy** tab.
