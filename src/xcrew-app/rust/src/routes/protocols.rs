use axum::{extract::{Path, State}, response::Json};
use serde_json::{json, Value};

use crate::error::AppError;
use crate::models::ExecuteProtocolRequest;
use crate::state::AppState;

pub async fn list_protocols(State(state): State<AppState>) -> Json<Value> {
    let protocols: Vec<Value> = state.inner.protocols.iter().map(|p| {
        json!({
            "id": p.id,
            "name": p.name,
            "language": p.language,
            "status": p.status
        })
    }).collect();

    Json(json!({
        "protocols": protocols,
        "total": state.inner.protocols.len()
    }))
}

pub async fn execute_protocol(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(req): Json<ExecuteProtocolRequest>,
) -> Result<Json<Value>, AppError> {
    let protocol = state.inner.protocols.iter()
        .find(|p| p.id == id)
        .ok_or_else(|| AppError::NotFound(format!("Protocol {} not found", id)))?;

    Ok(Json(json!({
        "protocol_id": protocol.id,
        "protocol_name": protocol.name,
        "language": protocol.language,
        "status": "executed",
        "parameters": req.parameters,
        "result": {
            "success": true,
            "output": format!("Protocol {} executed successfully", protocol.name),
            "phi_coherence": 1.618033988749895_f64
        }
    })))
}
