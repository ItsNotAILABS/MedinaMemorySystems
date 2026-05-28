//! Intelligence service integration

use reqwest::Client;
use serde::{Deserialize, Serialize};

const PHI: f64 = crate::PHI;

/// Intelligence decision request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DecisionRequest {
    pub context: String,
    pub options: Vec<String>,
    pub constraints: Option<serde_json::Value>,
}

/// Intelligence decision response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DecisionResponse {
    pub decision: String,
    pub confidence: f64,
    pub reasoning: Vec<String>,
    pub phi_alignment: f64,
    pub compute_cost: f64,
    pub latency_ms: f64,
}

/// Quantum superposition request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantumSuperposeRequest {
    pub id: String,
    pub outcomes: Vec<String>,
}

/// Quantum state response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantumStateResponse {
    pub id: String,
    pub amplitudes: Vec<AmplitudeEntry>,
    pub coherence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AmplitudeEntry {
    pub outcome: String,
    pub real: f64,
    pub imag: f64,
    pub probability: f64,
}

/// Swarm optimization request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SwarmOptimizeRequest {
    pub id: String,
    pub dimensions: usize,
    pub swarm_size: usize,
    pub iterations: usize,
    pub objective: String,
}

/// Swarm result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SwarmResult {
    pub best_position: Vec<f64>,
    pub best_fitness: f64,
    pub iterations_run: usize,
    pub convergence_rate: f64,
}

/// Phantom precompute request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PhantomRequest {
    pub id: String,
    pub simulations: usize,
    pub task_type: String,
    pub parameters: serde_json::Value,
}

/// Phantom result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PhantomResult {
    pub id: String,
    pub result: serde_json::Value,
    pub confidence: f64,
    pub simulations_run: usize,
}

/// Client for communicating with the Python intelligence service
pub struct IntelligenceClient {
    client: Client,
    base_url: String,
}

impl IntelligenceClient {
    pub fn new(base_url: &str) -> Self {
        Self {
            client: Client::new(),
            base_url: base_url.to_string(),
        }
    }

    pub async fn decide(&self, req: &DecisionRequest) -> anyhow::Result<DecisionResponse> {
        let resp = self
            .client
            .post(format!("{}/intelligence/decide", self.base_url))
            .json(req)
            .send()
            .await?
            .json()
            .await?;
        Ok(resp)
    }

    pub async fn quantum_superpose(
        &self,
        req: &QuantumSuperposeRequest,
    ) -> anyhow::Result<QuantumStateResponse> {
        let resp = self
            .client
            .post(format!("{}/intelligence/quantum/superpose", self.base_url))
            .json(req)
            .send()
            .await?
            .json()
            .await?;
        Ok(resp)
    }

    pub async fn swarm_optimize(&self, req: &SwarmOptimizeRequest) -> anyhow::Result<SwarmResult> {
        let resp = self
            .client
            .post(format!("{}/intelligence/swarm/optimize", self.base_url))
            .json(req)
            .send()
            .await?
            .json()
            .await?;
        Ok(resp)
    }

    pub async fn phantom_precompute(&self, req: &PhantomRequest) -> anyhow::Result<PhantomResult> {
        let resp = self
            .client
            .post(format!("{}/intelligence/phantom/precompute", self.base_url))
            .json(req)
            .send()
            .await?
            .json()
            .await?;
        Ok(resp)
    }
}
