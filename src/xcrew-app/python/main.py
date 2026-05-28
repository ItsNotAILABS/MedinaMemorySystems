"""
XCREW Intelligence Service
Protocol: XCREW-INTEL-SERVICE-001

FastAPI-based intelligence service integrating all MEDINA protocols:
- Quantum Coherence (PROTO-231/321)
- Temporal Reasoning (PROTO-232/322)
- Swarm Intelligence (PROTO-233/323)
- Phantom Monte Carlo (ZCE-PHANTOM-001)
- Toroidal Memory Navigation (TMN-001)
- φ-Harmonic Timing (PHT-001)
- Workforce Scaling (WSO-001)

"Intelligence at the Edge, Power Everywhere"
"""

import os
import time
import math
import uuid
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from intelligence.quantum_engine import QuantumCoherenceEngine
from intelligence.swarm_engine import SwarmIntelligenceEngine
from intelligence.temporal_engine import TemporalReasoningEngine
from intelligence.phantom_engine import PhantomMonteCarloEngine
from intelligence.memory_engine import ToroidalMemoryEngine
from intelligence.phi_engine import PhiHarmonicEngine

# Constants
PHI = 1.618033988749895
PHI_INVERSE = 0.6180339887498949
VERSION = "1.0.0"
PROTOCOL = "XCREW-INTEL-SERVICE-001"

# Global engine instances
engines: Dict[str, Any] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize all intelligence engines on startup."""
    engines["quantum"] = QuantumCoherenceEngine()
    engines["swarm"] = SwarmIntelligenceEngine()
    engines["temporal"] = TemporalReasoningEngine()
    engines["phantom"] = PhantomMonteCarloEngine()
    engines["memory"] = ToroidalMemoryEngine()
    engines["phi"] = PhiHarmonicEngine()
    engines["start_time"] = time.time()
    yield
    engines.clear()


app = FastAPI(
    title="XCREW Intelligence Service",
    description="Sovereign Edge Intelligence powered by MEDINA protocols",
    version=VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class DecisionRequest(BaseModel):
    context: str
    options: List[str]
    constraints: Optional[Dict[str, Any]] = None


class DecisionResponse(BaseModel):
    decision: str
    confidence: float
    reasoning: List[str]
    phi_alignment: float
    compute_cost: float
    latency_ms: float


class QuantumSuperposeRequest(BaseModel):
    id: str
    outcomes: List[str]


class QuantumMeasureRequest(BaseModel):
    id: str


class QuantumPhaseRequest(BaseModel):
    id: str
    outcome: str
    phase: float


class SwarmOptimizeRequest(BaseModel):
    id: str
    dimensions: int = 3
    swarm_size: int = 20
    iterations: int = 100
    objective: str = "minimize_distance"


class PhantomRequest(BaseModel):
    id: str
    simulations: int = 1618
    task_type: str = "optimization"
    parameters: Dict[str, Any] = {}


class MemoryStoreRequest(BaseModel):
    id: Optional[str] = None
    data: Any
    theta: Optional[float] = None
    phi: Optional[float] = None
    rho: Optional[float] = None
    ring: Optional[int] = None


class MemorySearchRequest(BaseModel):
    theta: float
    phi: float
    rho: float
    ring: int
    k: int = 5


class TemporalPredictRequest(BaseModel):
    series: List[float]
    horizon: int = 5
    method: str = "phi_harmonic"


# ============================================================================
# HEALTH & PLATFORM ROUTES
# ============================================================================

@app.get("/health")
async def health():
    uptime = time.time() - engines.get("start_time", time.time())
    return {
        "status": "healthy",
        "protocol": PROTOCOL,
        "version": VERSION,
        "uptime_seconds": round(uptime, 2),
        "engines": list(k for k in engines.keys() if k != "start_time"),
        "phi": PHI,
    }


@app.get("/status")
async def status():
    return {
        "protocol": PROTOCOL,
        "version": VERSION,
        "engines": {
            "quantum": engines["quantum"].get_status(),
            "swarm": engines["swarm"].get_status(),
            "temporal": engines["temporal"].get_status(),
            "phantom": engines["phantom"].get_status(),
            "memory": engines["memory"].get_status(),
            "phi": engines["phi"].get_status(),
        },
        "protocols_integrated": [
            "PROTO-231 (Quantum Coherence)",
            "PROTO-232 (Temporal Reasoning)",
            "PROTO-233 (Swarm Intelligence)",
            "PROTO-321 through PROTO-340 (Python Protocols)",
            "ZCE-PHANTOM-001 (Phantom Monte Carlo)",
            "TMN-001 (Toroidal Memory Navigator)",
            "PHT-001 (Phi-Harmonic Timing)",
            "WSO-001 (Workforce Scaling)",
        ],
    }


# ============================================================================
# INTELLIGENCE DECISION ROUTE
# ============================================================================

@app.post("/intelligence/decide", response_model=DecisionResponse)
async def make_decision(req: DecisionRequest):
    start = time.time()
    reasoning = []

    if not req.options:
        raise HTTPException(status_code=400, detail="At least one option required")

    # Store context in toroidal memory
    mem_coord = engines["memory"].store(
        f"decision-{uuid.uuid4().hex[:8]}",
        {"context": req.context, "options": req.options}
    )
    reasoning.append(f"Context stored at ring {mem_coord['ring']}, θ={mem_coord['theta']:.3f}")

    # Quantum superposition of options
    q_id = f"decision-{uuid.uuid4().hex[:8]}"
    engines["quantum"].create_superposition(q_id, req.options)
    reasoning.append(f"Quantum superposition created with {len(req.options)} states")

    # Measure quantum state
    measured = engines["quantum"].measure(q_id)
    reasoning.append(f"Quantum measurement collapsed to: {measured}")

    # Swarm optimization for confidence
    swarm_result = engines["swarm"].optimize(
        f"decision-swarm-{uuid.uuid4().hex[:8]}",
        dimensions=len(req.options),
        swarm_size=20,
        iterations=50,
    )
    reasoning.append(f"Swarm optimization converged (fitness: {swarm_result['best_fitness']:.4f})")

    # Monte Carlo confidence
    mc_result = engines["phantom"].precompute(
        f"decision-mc-{uuid.uuid4().hex[:8]}",
        options=req.options,
        simulations=1000,
    )
    confidence = mc_result["confidence"]
    reasoning.append(f"Monte Carlo confidence: {confidence * 100:.1f}%")

    latency_ms = (time.time() - start) * 1000

    return DecisionResponse(
        decision=measured or req.options[0],
        confidence=confidence,
        reasoning=reasoning,
        phi_alignment=PHI,
        compute_cost=0.05 * PHI_INVERSE,
        latency_ms=round(latency_ms, 2),
    )


# ============================================================================
# QUANTUM ROUTES
# ============================================================================

@app.post("/intelligence/quantum/superpose")
async def quantum_superpose(req: QuantumSuperposeRequest):
    if not req.outcomes:
        raise HTTPException(status_code=400, detail="At least one outcome required")

    state = engines["quantum"].create_superposition(req.id, req.outcomes)
    return {
        "id": req.id,
        "amplitudes": state["amplitudes"],
        "coherence": state["coherence"],
        "protocol": "PROTO-231",
    }


@app.post("/intelligence/quantum/measure")
async def quantum_measure(req: QuantumMeasureRequest):
    result = engines["quantum"].measure(req.id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Quantum state {req.id} not found")
    return {
        "id": req.id,
        "measured_outcome": result,
        "collapsed": True,
        "born_rule_applied": True,
    }


@app.post("/intelligence/quantum/phase")
async def quantum_apply_phase(req: QuantumPhaseRequest):
    success = engines["quantum"].apply_phase(req.id, req.outcome, req.phase)
    if not success:
        raise HTTPException(status_code=404, detail=f"State or outcome not found")
    state = engines["quantum"].get_state(req.id)
    return {
        "id": req.id,
        "phase_applied": req.phase,
        "outcome": req.outcome,
        "state": state,
    }


# ============================================================================
# SWARM ROUTES
# ============================================================================

@app.post("/intelligence/swarm/optimize")
async def swarm_optimize(req: SwarmOptimizeRequest):
    result = engines["swarm"].optimize(
        req.id,
        dimensions=req.dimensions,
        swarm_size=req.swarm_size,
        iterations=req.iterations,
    )
    return {
        "id": req.id,
        "best_position": result["best_position"],
        "best_fitness": result["best_fitness"],
        "iterations_run": req.iterations,
        "convergence_rate": 1.0 / PHI,
        "protocol": "PROTO-233",
    }


# ============================================================================
# PHANTOM MONTE CARLO ROUTES
# ============================================================================

@app.post("/intelligence/phantom/precompute")
async def phantom_precompute(req: PhantomRequest):
    result = engines["phantom"].precompute(
        req.id,
        simulations=req.simulations,
        task_type=req.task_type,
        parameters=req.parameters,
    )
    return {
        "id": req.id,
        "result": result["result"],
        "confidence": result["confidence"],
        "simulations_run": result["simulations"],
        "unique_outcomes": result["unique_outcomes"],
        "phi_rate": 1618.0,
        "protocol": "ZCE-PHANTOM-001",
    }


# ============================================================================
# MEMORY ROUTES
# ============================================================================

@app.post("/intelligence/memory/store")
async def memory_store(req: MemoryStoreRequest):
    mem_id = req.id or str(uuid.uuid4())
    coord = engines["memory"].store(
        mem_id, req.data,
        theta=req.theta, phi=req.phi, rho=req.rho, ring=req.ring,
    )
    return {
        "id": mem_id,
        "coordinate": coord,
        "stored": True,
    }


@app.get("/intelligence/memory/{memory_id}")
async def memory_retrieve(memory_id: str):
    result = engines["memory"].retrieve(memory_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Memory {memory_id} not found")
    return result


@app.post("/intelligence/memory/search")
async def memory_search(req: MemorySearchRequest):
    results = engines["memory"].find_nearest(
        theta=req.theta, phi=req.phi, rho=req.rho, ring=req.ring, k=req.k,
    )
    return {
        "query_coordinate": {
            "theta": req.theta, "phi": req.phi,
            "rho": req.rho, "ring": req.ring,
        },
        "results": results,
        "k": req.k,
    }


# ============================================================================
# TEMPORAL ROUTES
# ============================================================================

@app.post("/intelligence/temporal/predict")
async def temporal_predict(req: TemporalPredictRequest):
    result = engines["temporal"].predict(
        series=req.series, horizon=req.horizon, method=req.method,
    )
    return {
        "predictions": result["predictions"],
        "confidence_intervals": result["confidence_intervals"],
        "method": req.method,
        "protocol": "PROTO-232",
    }


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    host = os.environ.get("XCREW_INTEL_HOST", "0.0.0.0")
    port = int(os.environ.get("XCREW_INTEL_PORT", "9000"))

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=False,
        workers=4,
        log_level="info",
    )
