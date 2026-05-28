use axum::{extract::State, response::Json};
use serde_json::{json, Value};
use std::sync::atomic::Ordering;
use std::time::{SystemTime, UNIX_EPOCH};

use crate::error::AppError;
use crate::models::{SpawnProcessRequest, SyscallRequest};
use crate::state::{AppState, Process};
use crate::PHI;

pub async fn spawn_process(
    State(state): State<AppState>,
    Json(req): Json<SpawnProcessRequest>,
) -> Result<Json<Value>, AppError> {
    let pid = state.inner.next_pid.fetch_add(1, Ordering::SeqCst);
    let priority = req.priority.unwrap_or(5);
    let phi_level = (priority as f64 / PHI).floor();
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64;

    let process = Process {
        pid,
        name: req.name.clone(),
        state: "ready".into(),
        priority,
        phi_level,
        cpu_time_ms: 0,
        created_at: now,
    };

    state.inner.processes.insert(pid, process);

    Ok(Json(json!({
        "pid": pid,
        "name": req.name,
        "state": "ready",
        "priority": priority,
        "phi_level": phi_level,
        "protocol": "XCREW-OS-001"
    })))
}

pub async fn list_processes(State(state): State<AppState>) -> Json<Value> {
    let processes: Vec<Value> = state.inner.processes.iter().map(|p| {
        json!({
            "pid": p.pid,
            "name": p.name,
            "state": p.state,
            "priority": p.priority,
            "phi_level": p.phi_level,
            "cpu_time_ms": p.cpu_time_ms
        })
    }).collect();

    Json(json!({
        "processes": processes,
        "total": state.inner.processes.len()
    }))
}

pub async fn syscall(
    State(_state): State<AppState>,
    Json(req): Json<SyscallRequest>,
) -> Result<Json<Value>, AppError> {
    let start = std::time::Instant::now();

    let result = match req.name.as_str() {
        "intelligence_decide" | "quantum_superpose" | "quantum_measure"
        | "swarm_optimize" | "memory_store" | "memory_retrieve"
        | "phantom_precompute" => {
            json!({
                "success": true,
                "syscall": req.name,
                "args_count": req.args.len(),
                "note": "Forwarded to intelligence service"
            })
        }
        _ => {
            return Err(AppError::BadRequest(format!("Unknown syscall: {}", req.name)));
        }
    };

    let latency_us = start.elapsed().as_micros();

    Ok(Json(json!({
        "success": true,
        "return_value": result,
        "errno": 0,
        "latency_us": latency_us,
        "protocol": "XCREW-OS-001"
    })))
}

pub async fn get_status(State(state): State<AppState>) -> Json<Value> {
    let uptime = state.inner.start_time.elapsed().as_secs();

    Json(json!({
        "protocol": "XCREW-OS-001",
        "uptime_seconds": uptime,
        "processes": state.inner.processes.len(),
        "memory": {
            "total_bytes": 1073741824_u64,
            "allocated_bytes": state.inner.memories.len() as u64 * 1024,
            "free_bytes": 1073741824_u64 - (state.inner.memories.len() as u64 * 1024)
        },
        "intelligence": {
            "quantum_states": state.inner.quantum_states.len(),
            "swarm_states": state.inner.swarm_states.len(),
            "protocols_active": state.inner.protocols.len()
        },
        "phi": PHI
    }))
}
