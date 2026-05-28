//! XCREW Production Server
//! Protocol: XCREW-SERVER-001
//! 
//! Sovereign edge computing API server built with Axum.
//! Integrates MEDINA intelligence systems via internal service mesh.
//!
//! Architecture:
//!   - Rust/Axum: HTTP API, WebSocket, Auth, Routing
//!   - Go services: Edge caching, network orchestration
//!   - Python services: Intelligence/ML, protocol execution

use axum::{
    extract::{Path, Query, State, WebSocketUpgrade},
    http::{HeaderMap, Method, StatusCode},
    middleware,
    response::{IntoResponse, Json},
    routing::{delete, get, post, put},
    Router,
};
use dashmap::DashMap;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Instant;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

mod auth;
mod error;
mod intelligence;
mod models;
mod routes;
mod state;
mod websocket;

use state::AppState;

/// φ (Golden Ratio) - core harmonic constant
const PHI: f64 = 1.618033988749895;

/// XCREW Platform version
const VERSION: &str = "1.0.0";

/// XCREW Protocol identifier
const PROTOCOL: &str = "XCREW-SERVER-001";

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "xcrew_server=info,tower_http=info".into()),
        )
        .json()
        .init();

    tracing::info!(
        version = VERSION,
        protocol = PROTOCOL,
        phi = PHI,
        "XCREW Server starting"
    );

    // Load configuration
    dotenvy::dotenv().ok();
    let host = std::env::var("XCREW_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port: u16 = std::env::var("XCREW_PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()?;

    // Initialize application state
    let state = AppState::new().await?;

    // Build router
    let app = build_router(state);

    // Start server
    let addr = SocketAddr::new(host.parse()?, port);
    tracing::info!(%addr, "XCREW Server listening");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

/// Build the application router with all routes
fn build_router(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any);

    Router::new()
        // Health & Platform
        .route("/health", get(routes::health::health_check))
        .route("/api/v1/platform", get(routes::platform::get_platform_info))
        .route("/api/v1/platform/metrics", get(routes::platform::get_metrics))
        // Authentication
        .route("/api/v1/auth/register", post(routes::auth::register))
        .route("/api/v1/auth/login", post(routes::auth::login))
        .route("/api/v1/auth/refresh", post(routes::auth::refresh_token))
        // Intelligence
        .route("/api/v1/intelligence/decide", post(routes::intelligence::make_decision))
        .route("/api/v1/intelligence/quantum/superpose", post(routes::intelligence::quantum_superpose))
        .route("/api/v1/intelligence/quantum/measure", post(routes::intelligence::quantum_measure))
        .route("/api/v1/intelligence/swarm/optimize", post(routes::intelligence::swarm_optimize))
        .route("/api/v1/intelligence/phantom/precompute", post(routes::intelligence::phantom_precompute))
        // Memory
        .route("/api/v1/memory/store", post(routes::memory::store_memory))
        .route("/api/v1/memory/:id", get(routes::memory::retrieve_memory))
        .route("/api/v1/memory/search", post(routes::memory::search_memory))
        // Workers
        .route("/api/v1/workers", get(routes::workers::list_workers))
        .route("/api/v1/workers", post(routes::workers::create_worker))
        .route("/api/v1/workers/:id", get(routes::workers::get_worker))
        .route("/api/v1/workers/:id", delete(routes::workers::delete_worker))
        .route("/api/v1/workers/:id/execute", post(routes::workers::execute_worker))
        // Edge Network
        .route("/api/v1/edge/locations", get(routes::edge::list_locations))
        .route("/api/v1/edge/route", post(routes::edge::route_request))
        .route("/api/v1/edge/deploy", post(routes::edge::deploy))
        // Protocols
        .route("/api/v1/protocols", get(routes::protocols::list_protocols))
        .route("/api/v1/protocols/:id/execute", post(routes::protocols::execute_protocol))
        // OS System Calls
        .route("/api/v1/os/spawn", post(routes::os::spawn_process))
        .route("/api/v1/os/processes", get(routes::os::list_processes))
        .route("/api/v1/os/syscall", post(routes::os::syscall))
        .route("/api/v1/os/status", get(routes::os::get_status))
        // WebSocket for real-time
        .route("/ws", get(routes::realtime::websocket_handler))
        // Layers
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .with_state(state)
}
