use axum::{extract::State, response::Json};
use serde_json::{json, Value};

use crate::state::AppState;
use crate::{PHI, PROTOCOL, VERSION};

pub async fn get_platform_info(State(state): State<AppState>) -> Json<Value> {
    Json(json!({
        "platform": "XCREW",
        "version": VERSION,
        "protocol": PROTOCOL,
        "phi": PHI,
        "architecture": {
            "backend": "Rust (Axum)",
            "edge_services": "Go",
            "intelligence": "Python (FastAPI)",
            "engines": [
                {"language": "Rust", "efficiency": 0.95, "role": "API Server & Core"},
                {"language": "Go", "efficiency": 0.90, "role": "Edge Networking & Caching"},
                {"language": "Python", "efficiency": 0.85, "role": "Intelligence & ML"},
                {"language": "Zig", "efficiency": 0.97, "role": "Memory Management"},
                {"language": "C", "efficiency": 0.98, "role": "System Primitives"},
                {"language": "Julia", "efficiency": 0.96, "role": "Mathematics"}
            ]
        },
        "capabilities": [
            "Quantum Coherence Protocols",
            "Temporal Reasoning",
            "Swarm Intelligence",
            "Phantom Monte Carlo",
            "Toroidal Memory Navigation",
            "φ-Harmonic Timing",
            "Zero-Cost Computing",
            "Edge Deployment",
            "Real-time WebSocket",
            "OS-Level Abstractions"
        ],
        "edge_locations": state.inner.edge_locations.len(),
        "protocols_active": state.inner.protocols.len(),
        "workers_running": state.inner.workers.len()
    }))
}

pub async fn get_metrics(State(state): State<AppState>) -> Json<Value> {
    let uptime = state.inner.start_time.elapsed().as_secs();
    Json(json!({
        "uptime_seconds": uptime,
        "total_workers": state.inner.workers.len(),
        "total_memories": state.inner.memories.len(),
        "total_processes": state.inner.processes.len(),
        "edge_locations": state.inner.edge_locations.len(),
        "protocols": state.inner.protocols.len(),
        "quantum_states": state.inner.quantum_states.len(),
        "swarm_states": state.inner.swarm_states.len(),
        "phi_coherence": PHI,
        "zero_cost_savings": {
            "estimated_reduction_percent": 95.0,
            "engines_active": 6
        }
    }))
}
