//! Application state shared across handlers

use dashmap::DashMap;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::Instant;

use crate::PHI;

/// Shared application state
#[derive(Clone)]
pub struct AppState {
    pub inner: Arc<AppStateInner>,
}

pub struct AppStateInner {
    pub start_time: Instant,
    pub sessions: DashMap<String, Session>,
    pub workers: DashMap<String, Worker>,
    pub memories: DashMap<String, MemoryEntry>,
    pub processes: DashMap<u64, Process>,
    pub quantum_states: DashMap<String, QuantumState>,
    pub swarm_states: DashMap<String, SwarmState>,
    pub edge_locations: Vec<EdgeLocation>,
    pub protocols: Vec<Protocol>,
    pub intelligence_url: String,
    pub edge_service_url: String,
    pub next_pid: std::sync::atomic::AtomicU64,
}

impl AppState {
    pub async fn new() -> anyhow::Result<Self> {
        let intelligence_url = std::env::var("INTELLIGENCE_SERVICE_URL")
            .unwrap_or_else(|_| "http://localhost:9000".to_string());
        let edge_service_url = std::env::var("EDGE_SERVICE_URL")
            .unwrap_or_else(|_| "http://localhost:9001".to_string());

        Ok(Self {
            inner: Arc::new(AppStateInner {
                start_time: Instant::now(),
                sessions: DashMap::new(),
                workers: DashMap::new(),
                memories: DashMap::new(),
                processes: DashMap::new(),
                quantum_states: DashMap::new(),
                swarm_states: DashMap::new(),
                edge_locations: Self::init_edge_locations(),
                protocols: Self::init_protocols(),
                intelligence_url,
                edge_service_url,
                next_pid: std::sync::atomic::AtomicU64::new(1),
            }),
        })
    }

    fn init_edge_locations() -> Vec<EdgeLocation> {
        vec![
            EdgeLocation { id: "us-east-1".into(), name: "US East (Virginia)".into(), lat: 37.4316, lng: -78.6569, status: "healthy".into(), capacity: 0.85 },
            EdgeLocation { id: "us-west-2".into(), name: "US West (Oregon)".into(), lat: 43.8041, lng: -120.5542, status: "healthy".into(), capacity: 0.78 },
            EdgeLocation { id: "eu-west-1".into(), name: "Europe (Ireland)".into(), lat: 53.1424, lng: -7.6921, status: "healthy".into(), capacity: 0.92 },
            EdgeLocation { id: "ap-northeast-1".into(), name: "Asia Pacific (Tokyo)".into(), lat: 35.6762, lng: 139.6503, status: "healthy".into(), capacity: 0.88 },
            EdgeLocation { id: "ap-southeast-1".into(), name: "Asia Pacific (Singapore)".into(), lat: 1.3521, lng: 103.8198, status: "healthy".into(), capacity: 0.90 },
            EdgeLocation { id: "sa-east-1".into(), name: "South America (São Paulo)".into(), lat: -23.5505, lng: -46.6333, status: "healthy".into(), capacity: 0.82 },
            EdgeLocation { id: "af-south-1".into(), name: "Africa (Cape Town)".into(), lat: -33.9249, lng: 18.4241, status: "healthy".into(), capacity: 0.75 },
            EdgeLocation { id: "me-south-1".into(), name: "Middle East (Bahrain)".into(), lat: 26.0667, lng: 50.5577, status: "healthy".into(), capacity: 0.80 },
        ]
    }

    fn init_protocols() -> Vec<Protocol> {
        vec![
            Protocol { id: "PROTO-231".into(), name: "Quantum Coherence".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-232".into(), name: "Temporal Reasoning".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-233".into(), name: "Swarm Intelligence".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-321".into(), name: "Quantum Coherence Protocol".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-322".into(), name: "Temporal Reasoning Protocol".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-323".into(), name: "Swarm Intelligence Protocol".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-324".into(), name: "Memory Consolidation Protocol".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-325".into(), name: "Pattern Recognition Protocol".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-326".into(), name: "Decision Optimization Protocol".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-327".into(), name: "Neural Binding Protocol".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-328".into(), name: "Causal Inference Protocol".into(), language: "Python".into(), status: "active".into() },
            Protocol { id: "PROTO-SVA-001".into(), name: "Capability Testing Language".into(), language: "DSL".into(), status: "active".into() },
            Protocol { id: "PROTO-SVA-002".into(), name: "Memory Testing Language".into(), language: "DSL".into(), status: "active".into() },
        ]
    }
}

// ============================================================================
// DATA MODELS
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: String,
    pub user_id: String,
    pub token: String,
    pub created_at: u64,
    pub expires_at: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Worker {
    pub id: String,
    pub name: String,
    pub status: String,
    pub handler_code: String,
    pub created_at: u64,
    pub executions: u64,
    pub phi_coherence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemoryEntry {
    pub id: String,
    pub data: serde_json::Value,
    pub theta: f64,
    pub phi: f64,
    pub rho: f64,
    pub ring: u32,
    pub beat: u64,
    pub weight: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Process {
    pub pid: u64,
    pub name: String,
    pub state: String,
    pub priority: u32,
    pub phi_level: f64,
    pub cpu_time_ms: u64,
    pub created_at: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantumState {
    pub id: String,
    pub amplitudes: Vec<(String, f64, f64)>, // (outcome, real, imag)
    pub coherence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SwarmState {
    pub id: String,
    pub agents: Vec<SwarmAgent>,
    pub global_best: Vec<f64>,
    pub global_best_fitness: f64,
    pub iterations: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SwarmAgent {
    pub id: String,
    pub position: Vec<f64>,
    pub velocity: Vec<f64>,
    pub best_position: Vec<f64>,
    pub best_fitness: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EdgeLocation {
    pub id: String,
    pub name: String,
    pub lat: f64,
    pub lng: f64,
    pub status: String,
    pub capacity: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Protocol {
    pub id: String,
    pub name: String,
    pub language: String,
    pub status: String,
}
