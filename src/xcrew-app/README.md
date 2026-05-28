# XCREW Production Web Application

## Protocol: XCREW-APP-001

**"Execute anywhere, instantly, at zero marginal cost."**

---

## Architecture

XCREW is a production-grade, sovereign edge computing platform built with **non-TypeScript** languages for maximum performance and reliability:

```
┌─────────────────────────────────────────────────────────────────┐
│                    XCREW PLATFORM v1.0.0                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │   RUST (Axum)   │  │    GO (Edge)     │  │  PYTHON (AI)   │  │
│  │   Port 8080     │  │   Port 9001      │  │  Port 9000     │  │
│  │                 │  │                  │  │                │  │
│  │  • REST API     │  │  • Edge Cache    │  │  • Quantum     │  │
│  │  • WebSocket    │  │  • Routing       │  │  • Swarm PSO   │  │
│  │  • Auth/JWT     │  │  • Load Balance  │  │  • Temporal    │  │
│  │  • Workers      │  │  • Orchestration │  │  • Phantom MC  │  │
│  │  • OS Syscalls  │  │  • Geo-routing   │  │  • Memory Nav  │  │
│  │  • Protocols    │  │  • Zero-alloc    │  │  • φ-Timing    │  │
│  └────────┬────────┘  └────────┬─────────┘  └───────┬────────┘  │
│           │                    │                     │            │
│           └────────────────────┼─────────────────────┘            │
│                                │                                   │
│  ┌─────────────────────────────┴──────────────────────────────┐  │
│  │              MEDINA MEMORY SYSTEMS (Integration)            │  │
│  │                                                             │  │
│  │  • Toroidal Memory Navigator (TMN-001)                     │  │
│  │  • Zero-Cost Engines (25+ languages)                       │  │
│  │  • Phantom Monte Carlo (ZCE-PHANTOM-001)                   │  │
│  │  • Workforce Scaling Orchestrator (WSO-001)                │  │
│  │  • φ-Harmonic Timing Engine (PHT-001)                      │  │
│  │  • Quantum/Temporal/Swarm Protocols (PROTO-231/232/233)    │  │
│  │  • 44 Python AI Protocols (PROTO-321 through PROTO-340+)   │  │
│  │  • XOS Operating Layer (XCREW-OS-001)                      │  │
│  │  • Alpha Edge Solver (ALPHA-EC-001)                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Language | Framework | Role |
|-------|----------|-----------|------|
| **API Server** | Rust | Axum | HTTP/WebSocket gateway, auth, routing |
| **Edge Services** | Go | net/http + gorilla/mux | Distributed cache, geo-routing, orchestration |
| **Intelligence** | Python | FastAPI | AI/ML, protocol execution, decision engine |
| **Math Engines** | Julia | Native | Advanced mathematics (Hopf algebra, category theory) |
| **System Layer** | Zig/C | Native | Memory management, system primitives |

---

## API Endpoints

### Platform
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/platform` | Platform info & capabilities |
| GET | `/api/v1/platform/metrics` | Live metrics |

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login & get JWT |
| POST | `/api/v1/auth/refresh` | Refresh token |

### Intelligence
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/intelligence/decide` | AI-powered decision |
| POST | `/api/v1/intelligence/quantum/superpose` | Create quantum superposition |
| POST | `/api/v1/intelligence/quantum/measure` | Collapse quantum state |
| POST | `/api/v1/intelligence/swarm/optimize` | PSO optimization |
| POST | `/api/v1/intelligence/phantom/precompute` | Monte Carlo precompute |

### Memory (Toroidal)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/memory/store` | Store in toroidal space |
| GET | `/api/v1/memory/:id` | Retrieve by ID |
| POST | `/api/v1/memory/search` | k-NN toroidal search |

### Workers
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/workers` | List workers |
| POST | `/api/v1/workers` | Create worker |
| GET | `/api/v1/workers/:id` | Get worker details |
| DELETE | `/api/v1/workers/:id` | Delete worker |
| POST | `/api/v1/workers/:id/execute` | Execute worker |

### Edge Network
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/edge/locations` | List edge locations |
| POST | `/api/v1/edge/route` | Geo-route to nearest edge |
| POST | `/api/v1/edge/deploy` | Deploy to edge regions |

### Protocols
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/protocols` | List all protocols |
| POST | `/api/v1/protocols/:id/execute` | Execute protocol |

### OS (XOS)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/os/spawn` | Spawn process |
| GET | `/api/v1/os/processes` | List processes |
| POST | `/api/v1/os/syscall` | Execute syscall |
| GET | `/api/v1/os/status` | OS status |

### WebSocket
| Path | Description |
|------|-------------|
| `/ws` | Real-time intelligence streaming |

---

## Integrated Systems

The XCREW app integrates the following existing MEDINA systems:

### From `/src/zero-cost-engines/`
- **25+ language engines** providing φ-optimized computation
- Rust (95%), Go (90%), Python (85%), Zig (97%), C (98%) efficiency ratings
- Zero-allocation patterns for edge deployment

### From `/src/protocols/python/`
- **44 AI protocols** covering: quantum coherence, temporal reasoning, swarm intelligence, memory consolidation, pattern recognition, decision optimization, neural binding, causal inference, and more

### From `/src/lib/`
- **ToroidalMemoryNavigator** (TMN-001): 5-coordinate memory navigation
- **WorkforceScalingOrchestrator** (WSO-001): φ-scaled agent management
- **PhiHarmonicTimingEngine** (PHT-001): 10-level timing coordination
- **AlphaEdgeSolver** (ALPHA-EC-001): Edge case resolution

### From `/src/xcrew-platform/`
- **XOS Kernel** (XCREW-OS-001): Process/memory/file management
- **XIntelligence Bridge** (XCREW-INTEL-001): Protocol integration layer

---

## Quick Start

### Docker Compose (Recommended)
```bash
cd src/xcrew-app
docker compose up -d
```

### Individual Services

**Rust API Server:**
```bash
cd rust
cargo run --release
# Listening on :8080
```

**Go Edge Service:**
```bash
cd go
go run ./cmd/xcrew-edge
# Listening on :9001
```

**Python Intelligence:**
```bash
cd python
pip install -r requirements.txt
python main.py
# Listening on :9000
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `XCREW_HOST` | `0.0.0.0` | API server bind host |
| `XCREW_PORT` | `8080` | API server port |
| `XCREW_EDGE_PORT` | `9001` | Edge service port |
| `XCREW_INTEL_HOST` | `0.0.0.0` | Intelligence service host |
| `XCREW_INTEL_PORT` | `9000` | Intelligence service port |
| `INTELLIGENCE_SERVICE_URL` | `http://localhost:9000` | Intelligence service URL |
| `EDGE_SERVICE_URL` | `http://localhost:9001` | Edge service URL |
| `RUST_LOG` | `xcrew_server=info` | Rust log level |

---

## Performance Targets

| Metric | Target | Engine |
|--------|--------|--------|
| API Latency (p99) | < 10ms | Rust/Axum |
| Cache Hit Rate | > 95% | Go |
| Intelligence Decision | < 50ms | Python + NumPy |
| WebSocket Latency | < 5ms | Rust |
| Edge Routing | < 1ms | Go |
| Memory Operations | < 2ms | Rust |
| Monte Carlo (1618 sims) | < 100ms | Python |

---

## Security

- JWT authentication with Argon2 password hashing
- CORS configured per environment
- Zero-trust edge deployment model
- Encrypted state storage capability
- Rate limiting ready

---

## Charter Alignment

This application implements:
- **CHARTER-XCREW-CONT-001**: XCREW Platform Continuation
- **PROTO-XCREW-CONT-001**: Edge Hardening Protocol
- **PROTO-XCREW-CONT-002**: Intelligence Distribution Protocol
- **PROTO-XCREW-CONT-005**: Developer Experience Protocol

---

*"Intelligentia in Margine, Potentia in Ubique"*
*(Intelligence at the Edge, Power Everywhere)*

**φ = 1.618033988749895**
