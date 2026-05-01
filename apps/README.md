# Production Apps & Tools
## MEDINA Platform — Ready-to-Deploy Applications & Development Tools

This directory contains production-ready applications and professional development tools built on the MEDINA SDK ecosystem. These are complete, deployable products and utilities you can use today.

---

## Production Applications

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

## Development Tools

### 3. `medina-cli` — Command-Line Interface

**Tech Stack**: Node.js, TypeScript, Commander
**Purpose**: CLI tool for organism deployment and management

**Features**:
- 🚀 Deploy organisms to Internet Computer
- ♥ Monitor 873ms heartbeat in real-time
- 👥 Manage 8 workforce agents (φ-scaled)
- 🗳️ OMNIS™ governance proposals and voting
- 💾 Memory export/import with Fibonacci indexing
- 🧠 Intelligence module testing (823+ modules)
- 📊 Status monitoring and health checks
- ⚙️ Configuration management

**Quick Start**:
```bash
npm install -g @medina/cli
medina init
medina deploy --network ic
medina status --watch
```

---

### 4. `medina-testing-tools` — Testing Harness

**Tech Stack**: Node.js, TypeScript, Jest
**Purpose**: Comprehensive testing suite for intelligence modules and organisms

**Features**:
- 🧪 1,101+ automated tests across all systems
- 🧠 Test all 823+ intelligence modules (7 pillars)
- 🔷 Validate φ-harmonic mathematics (19 decimal precision)
- 🦅 Test animal cognition (8 species × 12 capabilities = 96 functions)
- 🌀 Chaos theory validation (Lyapunov, Feigenbaum, Ising, Kuramoto)
- ⚡ Performance benchmarking suite
- 💪 Stress testing and load simulation
- 📄 CI/CD integration with JSON reports

**Quick Start**:
```bash
npm install -g @medina/testing-tools
medina-test all                    # Run all 1,101+ tests
medina-test neural                 # Test neural pillar
medina-test animals --species all  # Test all 96 animal functions
medina-test benchmark --all        # Run performance benchmarks
```

---

### 5. `medina-dev-tools` — Development Utilities

**Tech Stack**: Node.js, TypeScript, EJS Templates
**Purpose**: Code generators, validators, and scaffolding tools

**Features**:
- 🛠️ Generate organisms with φ-harmonic heartbeat
- 🧠 Create intelligence modules across 7 pillars
- 👥 Generate workforce agents (φ-scaled capacity)
- 📋 Scaffold complete projects from templates
- ✅ Validate organism implementations
- 🔷 Validate φ-harmonic code (19 decimal precision)
- 📄 Generate Candid interfaces automatically
- 🧪 Generate comprehensive test suites

**Quick Start**:
```bash
npm install -g @medina/dev-tools
medina-dev generate organism MyOrganism --consciousness Dolphin
medina-dev generate module CustomNeural --pillar neural
medina-dev scaffold project my-app --template organism
medina-dev validate organism ./src/
medina-dev utils phi-sync 873
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

## Complete Toolkit Summary

| Tool | Type | Purpose |
|------|------|---------|
| `medina-dashboard` | Web App | Enterprise control center UI |
| `medina-api-server` | Backend API | REST + WebSocket + GraphQL server |
| `medina-cli` | CLI Tool | Deploy and manage organisms |
| `medina-testing-tools` | Testing | 1,101+ tests for all systems |
| `medina-dev-tools` | Dev Utils | Code generators and validators |

---

## SDK Dependencies

All apps and tools use the full MEDINA SDK stack:

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
