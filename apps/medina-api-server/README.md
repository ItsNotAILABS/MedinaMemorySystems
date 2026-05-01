# MEDINA API Server
## Production Node.js Backend for MEDINA Platform

A production-ready Express.js API server that wraps MEDINA organisms and exposes them as a standard REST + WebSocket service for any application to consume.

## Overview

This server acts as the backbone for all production MEDINA-powered applications:

- REST API for organism operations
- WebSocket for real-time subscriptions  
- GraphQL endpoint for flexible querying
- JWT + API key authentication
- Rate limiting with φ-harmonic token buckets
- OpenAPI 3.0 documentation
- Health checks and metrics
- Multi-tenant organization support

## Architecture

```
Client Apps
    │
    ▼
MEDINA API Server (Node.js/Express)
    ├── REST API      — Standard CRUD operations
    ├── WebSocket     — Real-time organism events
    ├── GraphQL       — Flexible data querying
    └── Admin API     — Management endpoints
         │
         ▼
    Protocol Adapters
         │
         ▼
    MEDINA Organisms (ICP Canisters)
         ├── Primary organism
         └── Backup organism (Sovereign Heart™)
```

## Project Structure

```
medina-api-server/
├── src/
│   ├── server.ts                  — Express app entry point
│   ├── config.ts                  — Configuration management
│   ├── routes/
│   │   ├── organism.ts            — /api/organism routes
│   │   ├── memory.ts              — /api/memory routes
│   │   ├── workforce.ts           — /api/workforce routes
│   │   ├── governance.ts          — /api/governance routes
│   │   └── intelligence.ts        — /api/intelligence routes
│   ├── middleware/
│   │   ├── auth.ts               — JWT + API key auth
│   │   ├── rateLimit.ts          — φ-harmonic rate limiting
│   │   ├── tenancy.ts            — Multi-tenant isolation
│   │   └── telemetry.ts          — Request tracing
│   ├── services/
│   │   ├── organism.service.ts   — Organism operations
│   │   ├── memory.service.ts     — Memory management
│   │   ├── workforce.service.ts  — Workforce orchestration
│   │   └── governance.service.ts — Governance engine
│   ├── websocket/
│   │   └── handlers.ts           — WebSocket event handlers
│   └── graphql/
│       ├── schema.ts             — GraphQL type definitions
│       └── resolvers.ts          — GraphQL resolvers
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

## Installation

```bash
cd apps/medina-api-server
npm install
cp .env.example .env
```

## Environment Variables

```env
# .env

# Server
PORT=3001
NODE_ENV=production
API_VERSION=v1

# MEDINA Platform
ORGANISM_CANISTER_ID=rrkah-fqaaa-aaaaa-aaaaq-cai
BACKUP_CANISTER_ID=backup-organism-canister-id
ICP_HOST=https://ic0.app
MEDINA_LICENSE_KEY=your-enterprise-license-key

# Security
JWT_SECRET=your-jwt-secret-min-256-bits
API_KEY_SALT=your-api-key-salt
CORS_ORIGINS=https://yourdomain.com,https://dashboard.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_DEVELOPER=61
RATE_LIMIT_MAX_PROFESSIONAL=610
RATE_LIMIT_MAX_ENTERPRISE=6180

# Database (for API keys and audit log)
DATABASE_URL=postgresql://user:pass@host/medina_api

# Redis (for rate limiting and sessions)
REDIS_URL=redis://localhost:6379

# Telemetry
TELEMETRY_ENDPOINT=https://telemetry.yourdomain.com
LOG_LEVEL=info
```

## Core Server

```typescript
// src/server.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { MedinaEnterprise } from '@medina/enterprise-sdk';
import { WaveRouter } from '@medina/protocol-adapters';

import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { tenancyMiddleware } from './middleware/tenancy';
import { organismRouter } from './routes/organism';
import { memoryRouter } from './routes/memory';
import { workforceRouter } from './routes/workforce';
import { governanceRouter } from './routes/governance';
import { intelligenceRouter } from './routes/intelligence';
import { setupWebSocket } from './websocket/handlers';
import { setupGraphQL } from './graphql';

const app = express();
const server = createServer(app);

// Security headers
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(',') || [],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Initialize MEDINA
const enterprise = new MedinaEnterprise({
    canisterId: process.env.ORGANISM_CANISTER_ID!,
    host: process.env.ICP_HOST!,
    organization: {
        name: 'MEDINA Platform API',
        tier: 'enterprise',
        licenseKey: process.env.MEDINA_LICENSE_KEY!,
    },
    highAvailability: {
        enabled: true,
        primaryCanister: process.env.ORGANISM_CANISTER_ID!,
        backupCanister: process.env.BACKUP_CANISTER_ID!,
    },
});

// Initialize Wave Router
const waveRouter = new WaveRouter({
    organism: { canisterId: process.env.ORGANISM_CANISTER_ID! },
});

// Make available to routes
app.locals.enterprise = enterprise;
app.locals.waveRouter = waveRouter;

// Global middleware
app.use('/api', authMiddleware);
app.use('/api', rateLimitMiddleware);
app.use('/api', tenancyMiddleware);

// Routes
app.use('/api/organism',     organismRouter);
app.use('/api/memory',       memoryRouter);
app.use('/api/workforce',    workforceRouter);
app.use('/api/governance',   governanceRouter);
app.use('/api/intelligence', intelligenceRouter);

// Health check (unauthenticated)
app.get('/health', async (req, res) => {
    const beat = await enterprise.organism.pulse();
    res.json({
        status: 'alive',
        organism: { beat, heartbeatMs: 873, phi: 1.6180339887498948482 },
        timestamp: new Date().toISOString(),
    });
});

// Readiness probe
app.get('/ready', async (req, res) => {
    const isConnected = enterprise.isConnected();
    res.status(isConnected ? 200 : 503).json({
        ready: isConnected,
        organism: isConnected ? 'connected' : 'connecting',
    });
});

// GraphQL
await setupGraphQL(app, enterprise);

// WebSocket
const wss = new WebSocketServer({ server, path: '/ws' });
setupWebSocket(wss, enterprise);

// Start
const PORT = parseInt(process.env.PORT || '3001');
server.listen(PORT, async () => {
    await enterprise.connect();
    await waveRouter.initialize();
    console.log(`\n🧬 MEDINA API Server started`);
    console.log(`   REST:      http://localhost:${PORT}/api`);
    console.log(`   GraphQL:   http://localhost:${PORT}/graphql`);
    console.log(`   WebSocket: ws://localhost:${PORT}/ws`);
    console.log(`   Health:    http://localhost:${PORT}/health`);
    console.log(`   φ = 1.6180339887498948482`);
    console.log(`   Heartbeat: 873ms\n`);
});
```

## WebSocket Events

```typescript
// src/websocket/handlers.ts
import { WebSocketServer, WebSocket } from 'ws';
import { MedinaEnterprise } from '@medina/enterprise-sdk';

export function setupWebSocket(wss: WebSocketServer, enterprise: MedinaEnterprise) {
    const clients = new Map<string, WebSocket>();

    // Subscribe to organism events and broadcast to connected clients
    enterprise.sovereignty.subscribe('heartbeat', (beat) => {
        broadcast(clients, { type: 'heartbeat', data: beat });
    });

    enterprise.workforce.subscribe('status', (update) => {
        broadcast(clients, { type: 'workforce:status', data: update });
    });

    enterprise.governance.subscribe('vote', (vote) => {
        broadcast(clients, { type: 'governance:vote', data: vote });
    });

    enterprise.memory.subscribe('store', (event) => {
        broadcast(clients, { type: 'memory:stored', data: event });
    });

    wss.on('connection', (ws, req) => {
        const clientId = generateId();
        clients.set(clientId, ws);

        ws.send(JSON.stringify({ type: 'connected', clientId }));

        ws.on('message', async (data) => {
            const message = JSON.parse(data.toString());
            // Handle client-initiated actions
            if (message.type === 'pulse') {
                const beat = await enterprise.organism.pulse();
                ws.send(JSON.stringify({ type: 'pulse:result', data: { beat } }));
            }
        });

        ws.on('close', () => {
            clients.delete(clientId);
        });
    });
}

function broadcast(clients: Map<string, WebSocket>, message: object) {
    const json = JSON.stringify(message);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    });
}
```

## Docker Production Deployment

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

RUN addgroup --system --gid 1001 medina && \
    adduser --system --uid 1001 medina
USER medina

EXPOSE 3001
HEALTHCHECK --interval=873ms --timeout=2s --retries=3 \
    CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.9'
services:
  medina-api:
    build: .
    ports:
      - "3001:3001"
    env_file: .env
    depends_on:
      - redis
      - postgres
    restart: unless-stopped
    deploy:
      replicas: 2    # φ-paired redundancy
      resources:
        limits:
          memory: 512M

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: medina_api
      POSTGRES_USER: medina
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    restart: unless-stopped

volumes:
  pgdata:
```

## Running the API Server

```bash
# Development
npm run dev

# Production
npm run build
npm start

# Docker
docker-compose up -d

# Test health
curl http://localhost:3001/health
```

---

**MEDINA TECH | Production API Server | 2026**

**COPYRIGHT © 2024-2026 ALFREDO MEDINA HERNANDEZ. ALL RIGHTS RESERVED.**
