//! Request/Response models

use serde::{Deserialize, Serialize};

// Auth models
#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user_id: String,
    pub expires_at: u64,
}

// Worker models
#[derive(Debug, Deserialize)]
pub struct CreateWorkerRequest {
    pub name: String,
    pub handler_code: String,
}

#[derive(Debug, Deserialize)]
pub struct ExecuteWorkerRequest {
    pub input: serde_json::Value,
}

// Memory models
#[derive(Debug, Deserialize)]
pub struct StoreMemoryRequest {
    pub id: Option<String>,
    pub data: serde_json::Value,
    pub theta: Option<f64>,
    pub phi: Option<f64>,
    pub rho: Option<f64>,
    pub ring: Option<u32>,
}

#[derive(Debug, Deserialize)]
pub struct SearchMemoryRequest {
    pub theta: f64,
    pub phi: f64,
    pub rho: f64,
    pub ring: u32,
    pub k: Option<usize>,
}

// Edge models
#[derive(Debug, Deserialize)]
pub struct RouteRequest {
    pub lat: f64,
    pub lng: f64,
    pub requirements: Option<Vec<String>>,
}

#[derive(Debug, Serialize)]
pub struct RouteResponse {
    pub location_id: String,
    pub location_name: String,
    pub distance_km: f64,
    pub estimated_latency_ms: f64,
}

#[derive(Debug, Deserialize)]
pub struct DeployRequest {
    pub worker_id: String,
    pub regions: Vec<String>,
    pub strategy: Option<String>,
}

// OS models
#[derive(Debug, Deserialize)]
pub struct SpawnProcessRequest {
    pub name: String,
    pub priority: Option<u32>,
}

#[derive(Debug, Deserialize)]
pub struct SyscallRequest {
    pub name: String,
    pub args: Vec<serde_json::Value>,
}

// Protocol models
#[derive(Debug, Deserialize)]
pub struct ExecuteProtocolRequest {
    pub parameters: serde_json::Value,
}
