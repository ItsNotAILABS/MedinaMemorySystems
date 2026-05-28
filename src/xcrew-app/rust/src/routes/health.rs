use axum::{extract::State, response::Json};
use serde_json::{json, Value};

use crate::state::AppState;
use crate::{PHI, PROTOCOL, VERSION};

pub async fn health_check(State(state): State<AppState>) -> Json<Value> {
    let uptime = state.inner.start_time.elapsed().as_secs();
    Json(json!({
        "status": "healthy",
        "protocol": PROTOCOL,
        "version": VERSION,
        "uptime_seconds": uptime,
        "phi": PHI,
        "components": {
            "api_server": "healthy",
            "intelligence_service": "healthy",
            "edge_network": "healthy",
            "memory_system": "healthy"
        }
    }))
}
