use axum::{extract::{Path, State}, response::Json};
use serde_json::{json, Value};
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;

use crate::error::AppError;
use crate::models::{CreateWorkerRequest, ExecuteWorkerRequest};
use crate::state::{AppState, Worker};
use crate::PHI;

pub async fn list_workers(State(state): State<AppState>) -> Json<Value> {
    let workers: Vec<Value> = state.inner.workers.iter().map(|w| {
        json!({
            "id": w.id,
            "name": w.name,
            "status": w.status,
            "executions": w.executions,
            "phi_coherence": w.phi_coherence,
            "created_at": w.created_at
        })
    }).collect();

    Json(json!({
        "workers": workers,
        "total": state.inner.workers.len()
    }))
}

pub async fn create_worker(
    State(state): State<AppState>,
    Json(req): Json<CreateWorkerRequest>,
) -> Result<Json<Value>, AppError> {
    let id = Uuid::new_v4().to_string();
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    let worker = Worker {
        id: id.clone(),
        name: req.name,
        status: "ready".into(),
        handler_code: req.handler_code,
        created_at: now,
        executions: 0,
        phi_coherence: PHI / 2.0,
    };

    state.inner.workers.insert(id.clone(), worker.clone());

    Ok(Json(json!({
        "id": id,
        "name": worker.name,
        "status": worker.status,
        "phi_coherence": worker.phi_coherence,
        "created_at": now
    })))
}

pub async fn get_worker(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Value>, AppError> {
    let worker = state.inner.workers.get(&id)
        .ok_or_else(|| AppError::NotFound(format!("Worker {} not found", id)))?;

    Ok(Json(json!({
        "id": worker.id,
        "name": worker.name,
        "status": worker.status,
        "handler_code": worker.handler_code,
        "executions": worker.executions,
        "phi_coherence": worker.phi_coherence,
        "created_at": worker.created_at
    })))
}

pub async fn delete_worker(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Value>, AppError> {
    state.inner.workers.remove(&id)
        .ok_or_else(|| AppError::NotFound(format!("Worker {} not found", id)))?;

    Ok(Json(json!({
        "deleted": true,
        "id": id
    })))
}

pub async fn execute_worker(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(req): Json<ExecuteWorkerRequest>,
) -> Result<Json<Value>, AppError> {
    let mut worker = state.inner.workers.get_mut(&id)
        .ok_or_else(|| AppError::NotFound(format!("Worker {} not found", id)))?;

    worker.executions += 1;
    worker.status = "running".into();
    worker.phi_coherence = (worker.phi_coherence + PHI / 10.0).min(PHI);

    let execution_id = Uuid::new_v4().to_string();

    Ok(Json(json!({
        "execution_id": execution_id,
        "worker_id": id,
        "status": "completed",
        "input": req.input,
        "output": {
            "result": "executed",
            "phi_coherence": worker.phi_coherence
        },
        "executions_total": worker.executions
    })))
}
