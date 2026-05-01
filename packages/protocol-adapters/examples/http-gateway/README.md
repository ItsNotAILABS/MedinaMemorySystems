# HTTP Gateway Example
## REST API Gateway for MEDINA Organisms

A production example showing how to expose a MEDINA organism as a standard REST API, enabling any application to interact with MEDINA's intelligence through familiar HTTP endpoints.

## Overview

This gateway sits in front of your MEDINA organism and provides:
- Standard REST endpoints for all organism operations
- JWT authentication and API key management
- Rate limiting with φ-harmonic token buckets
- OpenAPI 3.0 documentation
- Health check and readiness probes

## Endpoints

```
GET  /health                         — Health check
GET  /organism/state                 — Organism state
POST /organism/pulse                 — Trigger heartbeat
POST /organism/recognize             — Pattern recognition

POST /memory/store                   — Store memory
GET  /memory/:key                    — Retrieve memory
POST /memory/query                   — Query memories

POST /workforce/invoke               — Invoke workforce agent
GET  /workforce/status               — All workforce status

POST /governance/propose             — Submit proposal
POST /governance/:id/vote            — Vote on proposal
GET  /governance/state               — Governance state

GET  /intelligence/analyze           — Intelligence analysis
POST /intelligence/pattern           — Pattern matching
```

## Setup

```typescript
import express from 'express';
import { HttpAdapter, WaveRouter } from '@medina/protocol-adapters';
import { MedinaClient } from '@medina/client-sdk';

const app = express();
app.use(express.json());

// Connect to organism
const medina = new MedinaClient({
    canisterId: process.env.ORGANISM_CANISTER_ID!,
    host: process.env.ICP_HOST || 'https://ic0.app',
});

await medina.connect();

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'alive',
        organism: 'connected',
        heartbeat: '873ms',
        phi: 1.6180339887498948482,
        timestamp: Date.now(),
    });
});

// Organism endpoints
app.get('/organism/state', async (req, res) => {
    const state = await medina.organism.getState();
    res.json(state);
});

app.post('/organism/pulse', async (req, res) => {
    const beat = await medina.organism.pulse();
    res.json({ beat, timestamp: Date.now() });
});

// Memory endpoints
app.post('/memory/store', async (req, res) => {
    const { key, value, priority } = req.body;
    await medina.memory.store({ key, value, priority });
    res.json({ stored: true, key });
});

app.get('/memory/:key', async (req, res) => {
    const memory = await medina.memory.get(req.params.key);
    if (!memory) {
        return res.status(404).json({ error: 'Memory not found' });
    }
    res.json(memory);
});

// Workforce endpoints
app.post('/workforce/invoke', async (req, res) => {
    const { type, task, data } = req.body;
    const result = await medina.models.invoke({ workforce: type, task, data });
    res.json(result);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`MEDINA HTTP Gateway running on port ${PORT}`);
    console.log(`Organism: ${process.env.ORGANISM_CANISTER_ID}`);
    console.log(`Health: http://localhost:${PORT}/health`);
});
```

## Authentication Middleware

```typescript
import jwt from 'jsonwebtoken';

// JWT authentication middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // Check API key
    const apiKey = req.headers['x-api-key'];
    if (apiKey === process.env.MEDINA_API_KEY) {
        return next();
    }

    // Check JWT bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.slice(7);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = payload;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Apply authentication to all routes
app.use('/organism', authenticate);
app.use('/memory', authenticate);
app.use('/workforce', authenticate);
app.use('/governance', authenticate);
app.use('/intelligence', authenticate);
```

## φ-Harmonic Rate Limiting

```typescript
import { PhiRateLimiter } from '@medina/protocol-adapters';

// Rate limiter using golden ratio token bucket
const limiter = new PhiRateLimiter({
    // Requests per minute, φ-scaled by tier
    tiers: {
        developer:    { rpm: 61,   burst: 8   },  // Fib[6], Fib[3+2]
        professional: { rpm: 610,  burst: 89  },  // Fib[7]×10, Fib[11]
        enterprise:   { rpm: 6180, burst: 1000 }, // φ⁻¹ × 10000
    },
    keyExtractor: (req) => req.headers['x-api-key'] as string,
    tierResolver: async (key) => await getApiKeyTier(key),
});

app.use(limiter.middleware());
```

## Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY .env.production .env

EXPOSE 3001

HEALTHCHECK --interval=873ms --timeout=300ms --retries=3 \
    CMD wget -q -O- http://localhost:3001/health || exit 1

CMD ["node", "dist/gateway.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  medina-gateway:
    build: .
    ports:
      - "3001:3001"
    environment:
      ORGANISM_CANISTER_ID: ${ORGANISM_CANISTER_ID}
      ICP_HOST: https://ic0.app
      MEDINA_API_KEY: ${MEDINA_API_KEY}
      JWT_SECRET: ${JWT_SECRET}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "-O-", "http://localhost:3001/health"]
      interval: 873ms
      timeout: 300ms
      retries: 3
```

## Running This Example

```bash
cd http-gateway
npm install

# Configure
export ORGANISM_CANISTER_ID="your-canister-id"
export MEDINA_API_KEY="your-api-key"
export JWT_SECRET="your-jwt-secret"

# Development
npm run dev

# Production
npm run build
npm start

# Docker
docker-compose up -d
```

## Example API Calls

```bash
# Health check
curl http://localhost:3001/health

# Pulse the organism (with API key)
curl -X POST http://localhost:3001/organism/pulse \
  -H "X-API-Key: your-api-key"

# Store a memory
curl -X POST http://localhost:3001/memory/store \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"key":"insight-001","value":"Market opportunity identified","priority":"fibonacci-8"}'

# Invoke workforce analyst
curl -X POST http://localhost:3001/workforce/invoke \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"type":"W-ANALYST","task":"market-analysis","data":{"segment":"enterprise"}}'
```

---

**MEDINA TECH | Protocol Adapters | HTTP Gateway | 2026**
