use axum::{extract::{Path, State}, response::Json};
use serde_json::{json, Value};
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;

use crate::error::AppError;
use crate::models::{SearchMemoryRequest, StoreMemoryRequest};
use crate::state::{AppState, MemoryEntry};
use crate::PHI;

pub async fn store_memory(
    State(state): State<AppState>,
    Json(req): Json<StoreMemoryRequest>,
) -> Result<Json<Value>, AppError> {
    let id = req.id.unwrap_or_else(|| Uuid::new_v4().to_string());
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64;

    let entry = MemoryEntry {
        id: id.clone(),
        data: req.data,
        theta: req.theta.unwrap_or_else(|| rand::random::<f64>() * std::f64::consts::TAU),
        phi: req.phi.unwrap_or_else(|| rand::random::<f64>() * std::f64::consts::TAU),
        rho: req.rho.unwrap_or_else(|| 0.5 + rand::random::<f64>() * 0.5),
        ring: req.ring.unwrap_or_else(|| (rand::random::<f32>() * 12.0) as u32),
        beat: now,
        weight: 1.0,
    };

    state.inner.memories.insert(id.clone(), entry.clone());

    Ok(Json(json!({
        "id": id,
        "coordinate": {
            "theta": entry.theta,
            "phi": entry.phi,
            "rho": entry.rho,
            "ring": entry.ring,
            "beat": entry.beat
        },
        "stored": true
    })))
}

pub async fn retrieve_memory(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Value>, AppError> {
    let entry = state.inner.memories.get(&id)
        .ok_or_else(|| AppError::NotFound(format!("Memory {} not found", id)))?;

    Ok(Json(json!({
        "id": entry.id,
        "data": entry.data,
        "coordinate": {
            "theta": entry.theta,
            "phi": entry.phi,
            "rho": entry.rho,
            "ring": entry.ring,
            "beat": entry.beat
        },
        "weight": entry.weight
    })))
}

pub async fn search_memory(
    State(state): State<AppState>,
    Json(req): Json<SearchMemoryRequest>,
) -> Result<Json<Value>, AppError> {
    let k = req.k.unwrap_or(5);
    let rings = 12u32;

    let mut distances: Vec<(String, f64)> = state.inner.memories.iter().map(|entry| {
        let d_theta = (req.theta - entry.theta).abs().min(
            std::f64::consts::TAU - (req.theta - entry.theta).abs()
        );
        let d_phi = (req.phi - entry.phi).abs().min(
            std::f64::consts::TAU - (req.phi - entry.phi).abs()
        );
        let d_rho = (req.rho - entry.rho).abs();
        let d_ring_raw = (req.ring as i32 - entry.ring as i32).unsigned_abs();
        let d_ring = d_ring_raw.min(rings - d_ring_raw);

        let dist = (d_theta.powi(2) + d_phi.powi(2) + (d_rho * PHI).powi(2)
            + (d_ring as f64 / rings as f64).powi(2)).sqrt();

        (entry.id.clone(), dist)
    }).collect();

    distances.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());
    let results: Vec<Value> = distances.iter().take(k).map(|(id, dist)| {
        let entry = state.inner.memories.get(id).unwrap();
        json!({
            "id": id,
            "distance": dist,
            "data": entry.data,
            "coordinate": {
                "theta": entry.theta,
                "phi": entry.phi,
                "rho": entry.rho,
                "ring": entry.ring
            }
        })
    }).collect();

    Ok(Json(json!({
        "query_coordinate": {
            "theta": req.theta,
            "phi": req.phi,
            "rho": req.rho,
            "ring": req.ring
        },
        "results": results,
        "total_searched": state.inner.memories.len(),
        "k": k
    })))
}
