use axum::{extract::State, response::Json};
use serde_json::{json, Value};

use crate::error::AppError;
use crate::models::{DeployRequest, RouteRequest};
use crate::state::AppState;

pub async fn list_locations(State(state): State<AppState>) -> Json<Value> {
    let locations: Vec<Value> = state.inner.edge_locations.iter().map(|loc| {
        json!({
            "id": loc.id,
            "name": loc.name,
            "lat": loc.lat,
            "lng": loc.lng,
            "status": loc.status,
            "capacity": loc.capacity
        })
    }).collect();

    Json(json!({
        "locations": locations,
        "total": state.inner.edge_locations.len(),
        "healthy": state.inner.edge_locations.iter().filter(|l| l.status == "healthy").count()
    }))
}

pub async fn route_request(
    State(state): State<AppState>,
    Json(req): Json<RouteRequest>,
) -> Result<Json<Value>, AppError> {
    // Find nearest edge location using haversine
    let mut best_loc = &state.inner.edge_locations[0];
    let mut best_dist = f64::MAX;

    for loc in &state.inner.edge_locations {
        let dist = haversine_km(req.lat, req.lng, loc.lat, loc.lng);
        if dist < best_dist {
            best_dist = dist;
            best_loc = loc;
        }
    }

    // Estimate latency: ~0.01ms per km (speed of light in fiber)
    let estimated_latency = best_dist * 0.01 + 5.0; // +5ms processing

    Ok(Json(json!({
        "location_id": best_loc.id,
        "location_name": best_loc.name,
        "distance_km": (best_dist * 100.0).round() / 100.0,
        "estimated_latency_ms": (estimated_latency * 100.0).round() / 100.0,
        "capacity": best_loc.capacity
    })))
}

pub async fn deploy(
    State(state): State<AppState>,
    Json(req): Json<DeployRequest>,
) -> Result<Json<Value>, AppError> {
    // Verify worker exists
    if !state.inner.workers.contains_key(&req.worker_id) {
        return Err(AppError::NotFound(format!("Worker {} not found", req.worker_id)));
    }

    let strategy = req.strategy.unwrap_or_else(|| "phi-progressive".into());
    let deployed_regions: Vec<Value> = req.regions.iter().map(|r| {
        json!({
            "region": r,
            "status": "deployed",
            "replicas": 3
        })
    }).collect();

    Ok(Json(json!({
        "deployment_id": uuid::Uuid::new_v4().to_string(),
        "worker_id": req.worker_id,
        "strategy": strategy,
        "regions": deployed_regions,
        "status": "active"
    })))
}

fn haversine_km(lat1: f64, lng1: f64, lat2: f64, lng2: f64) -> f64 {
    let r = 6371.0; // Earth radius km
    let d_lat = (lat2 - lat1).to_radians();
    let d_lng = (lng2 - lng1).to_radians();
    let a = (d_lat / 2.0).sin().powi(2)
        + lat1.to_radians().cos() * lat2.to_radians().cos() * (d_lng / 2.0).sin().powi(2);
    let c = 2.0 * a.sqrt().asin();
    r * c
}
