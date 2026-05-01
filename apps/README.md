# Production Apps
## MEDINA Platform — Ready-to-Deploy Applications

This directory contains production-ready applications built on the MEDINA SDK ecosystem. These are complete, deployable products you can run today.

---

## Applications

### 1. `medina-dashboard` — Enterprise Control Center

**Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
**Purpose**: Full enterprise management UI for MEDINA organisms

**Features**:
- 🧬 Live 873ms heartbeat visualization
- 👥 Real-time workforce agent monitoring (8 agents × φ-cycles)
- 🗳️ OMNIS™ 43-core governance voting interface
- 💾 Organizational memory browser with Fibonacci indexing
- 📊 Intelligence module console
- 🔒 Sovereign Heart™ dual cardiac monitoring
- 📋 Tamper-proof audit trail

**Quick Start**:
```bash
cd medina-dashboard
npm install
cp .env.example .env.local
# Edit .env.local with your organism canister ID and license key
npm run dev
# Open http://localhost:3000
```

---

### 2. `medina-api-server` — Production API Backend

**Tech Stack**: Node.js, Express, TypeScript, WebSocket, GraphQL
**Purpose**: REST + WebSocket + GraphQL API server for any frontend or service

**Features**:
- 🌐 REST API for all organism operations
- ⚡ WebSocket real-time subscriptions
- 🔍 GraphQL flexible querying
- 🔑 JWT + API key authentication
- ⚖️ φ-harmonic rate limiting by tier
- 🏢 Multi-tenant organization support
- 🐳 Docker + docker-compose ready
- 📊 Health checks and metrics

**Quick Start**:
```bash
cd medina-api-server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
# API: http://localhost:3001/api
# GraphQL: http://localhost:3001/graphql
# WebSocket: ws://localhost:3001/ws
```

---

## Architecture

```
Production Deployment
┌─────────────────────────────────────────────┐
│  medina-dashboard (Next.js)                 │
│  Port 3000 — Enterprise control UI          │
└──────────────────────┬──────────────────────┘
                       │ REST + WebSocket
┌──────────────────────▼──────────────────────┐
│  medina-api-server (Express)                │
│  Port 3001 — Backend API                    │
└──────────────────────┬──────────────────────┘
                       │ @medina/enterprise-sdk
                       │ @medina/protocol-adapters
┌──────────────────────▼──────────────────────┐
│  Protocol Adapters (Wave Router)            │
│  ICP • HTTP • WebSocket • GraphQL • gRPC    │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│  MEDINA Organisms (ICP Canisters)           │
│  Primary ♥ 873ms  +  Backup (Sovereign)    │
└─────────────────────────────────────────────┘
```

---

## Full Stack Deployment

### Using Docker Compose

```yaml
# Full production stack
version: '3.9'
services:
  dashboard:
    build: ./medina-dashboard
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3001
    depends_on:
      - api

  api:
    build: ./medina-api-server
    ports:
      - "3001:3001"
    env_file: ./medina-api-server/.env
    depends_on:
      - redis
      - postgres

  redis:
    image: redis:7-alpine

  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: medina_api
      POSTGRES_USER: medina
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

volumes:
  pgdata:
```

```bash
# Deploy entire stack
docker-compose up -d

# Check all services
docker-compose ps

# View logs
docker-compose logs -f api
```

---

## Prerequisites

- Node.js 20+ or Docker
- MEDINA Enterprise SDK license key (`MEDINA_LICENSE_KEY`)
- Deployed MEDINA organism on ICP (`ORGANISM_CANISTER_ID`)

### Get Started

1. **Deploy an organism**: Follow the [Organism SDK guide](../packages/organism-sdk/README.md)
2. **Get a license**: Contact `sales@medinatech.com`
3. **Run the apps**: Use Quick Start above

---

## SDK Dependencies

Both apps use the full MEDINA SDK stack:

| SDK | Version | Role |
|-----|---------|------|
| `@medina/organism-sdk` | 1.0.0 | Core organism (ICP) |
| `@medina/intelligence-sdk` | 1.0.0 | 823+ intelligence modules |
| `@medina/enterprise-sdk` | 1.0.0 | Workforce + governance |
| `@medina/client-sdk` | 1.0.0 | TS client library |
| `@medina/protocol-adapters` | 1.0.0 | Multi-protocol bridge |

---

**MEDINA TECH | ALFREDO MEDINA HERNANDEZ | DALLAS TX | 2026**

**COPYRIGHT © 2024-2026 ALFREDO MEDINA HERNANDEZ. ALL RIGHTS RESERVED.**
