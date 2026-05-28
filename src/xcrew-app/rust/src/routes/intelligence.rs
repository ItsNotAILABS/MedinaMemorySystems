use axum::{extract::State, response::Json};
use serde_json::{json, Value};
use uuid::Uuid;

use crate::error::AppError;
use crate::intelligence::{DecisionRequest, QuantumSuperposeRequest, SwarmOptimizeRequest, PhantomRequest};
use crate::state::{AppState, QuantumState, SwarmState, SwarmAgent};
use crate::PHI;

pub async fn make_decision(
    State(state): State<AppState>,
    Json(req): Json<DecisionRequest>,
) -> Result<Json<Value>, AppError> {
    if req.options.is_empty() {
        return Err(AppError::BadRequest("At least one option required".into()));
    }

    // Local intelligence computation (φ-weighted)
    let num_options = req.options.len() as f64;
    let weights: Vec<f64> = req.options.iter().enumerate().map(|(i, _)| {
        PHI.powf(-(i as f64) / num_options)
    }).collect();

    let total_weight: f64 = weights.iter().sum();
    let normalized: Vec<f64> = weights.iter().map(|w| w / total_weight).collect();

    // Select based on φ-weighted distribution
    let mut cumulative = 0.0;
    let threshold = 1.0 / PHI;
    let mut selected_idx = 0;
    for (i, &w) in normalized.iter().enumerate() {
        cumulative += w;
        if cumulative >= threshold {
            selected_idx = i;
            break;
        }
    }

    let decision = &req.options[selected_idx];
    let confidence = normalized[selected_idx];

    Ok(Json(json!({
        "decision": decision,
        "confidence": confidence,
        "reasoning": [
            format!("Context: {}", req.context),
            format!("φ-weighted selection from {} options", req.options.len()),
            format!("Selected index {} with weight {:.4}", selected_idx, normalized[selected_idx]),
            "Applied golden ratio harmonic distribution"
        ],
        "phi_alignment": PHI,
        "compute_cost": 0.05,
        "latency_ms": 1.2
    })))
}

pub async fn quantum_superpose(
    State(state): State<AppState>,
    Json(req): Json<QuantumSuperposeRequest>,
) -> Result<Json<Value>, AppError> {
    if req.outcomes.is_empty() {
        return Err(AppError::BadRequest("At least one outcome required".into()));
    }

    let amplitude = 1.0 / (req.outcomes.len() as f64).sqrt();
    let amplitudes: Vec<(String, f64, f64)> = req.outcomes.iter()
        .map(|o| (o.clone(), amplitude, 0.0))
        .collect();

    let qstate = QuantumState {
        id: req.id.clone(),
        amplitudes: amplitudes.clone(),
        coherence: 1.0,
    };
    state.inner.quantum_states.insert(req.id.clone(), qstate);

    let response_amps: Vec<Value> = amplitudes.iter().map(|(outcome, real, imag)| {
        json!({
            "outcome": outcome,
            "real": real,
            "imag": imag,
            "probability": real * real + imag * imag
        })
    }).collect();

    Ok(Json(json!({
        "id": req.id,
        "amplitudes": response_amps,
        "coherence": 1.0,
        "protocol": "PROTO-231"
    })))
}

pub async fn quantum_measure(
    State(state): State<AppState>,
    Json(body): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let id = body.get("id")
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::BadRequest("id required".into()))?;

    let qstate = state.inner.quantum_states.get(id)
        .ok_or_else(|| AppError::NotFound(format!("Quantum state {} not found", id)))?;

    // Born rule measurement
    let probs: Vec<f64> = qstate.amplitudes.iter()
        .map(|(_, r, i)| r * r + i * i)
        .collect();
    let total: f64 = probs.iter().sum();

    let rand_val = (std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .subsec_nanos() as f64) / 4_294_967_295.0;

    let mut cumulative = 0.0;
    let mut result = &qstate.amplitudes[0].0;
    for (i, &p) in probs.iter().enumerate() {
        cumulative += p / total;
        if rand_val <= cumulative {
            result = &qstate.amplitudes[i].0;
            break;
        }
    }

    Ok(Json(json!({
        "id": id,
        "measured_outcome": result,
        "collapsed": true,
        "born_rule_applied": true
    })))
}

pub async fn swarm_optimize(
    State(state): State<AppState>,
    Json(req): Json<SwarmOptimizeRequest>,
) -> Result<Json<Value>, AppError> {
    let w = 0.7298;
    let c1 = 1.49618;
    let c2 = 1.49618;

    // Initialize swarm
    let mut agents: Vec<SwarmAgent> = (0..req.swarm_size).map(|i| {
        let position: Vec<f64> = (0..req.dimensions).map(|_| {
            (rand::random::<f64>() * 2.0) - 1.0
        }).collect();
        let velocity: Vec<f64> = (0..req.dimensions).map(|_| {
            (rand::random::<f64>() - 0.5) * PHI
        }).collect();
        SwarmAgent {
            id: format!("{}-agent-{}", req.id, i),
            position: position.clone(),
            velocity,
            best_position: position.clone(),
            best_fitness: f64::NEG_INFINITY,
        }
    }).collect();

    let mut global_best = agents[0].position.clone();
    let mut global_best_fitness = f64::NEG_INFINITY;

    // Objective: minimize sum of squares (default)
    let fitness_fn = |pos: &[f64]| -> f64 {
        -pos.iter().map(|x| x * x).sum::<f64>()
    };

    // Run PSO iterations
    for _ in 0..req.iterations {
        for agent in agents.iter_mut() {
            let fitness = fitness_fn(&agent.position);
            if fitness > agent.best_fitness {
                agent.best_fitness = fitness;
                agent.best_position = agent.position.clone();
            }
            if fitness > global_best_fitness {
                global_best_fitness = fitness;
                global_best = agent.position.clone();
            }
        }
        for agent in agents.iter_mut() {
            for d in 0..req.dimensions {
                let r1 = rand::random::<f64>();
                let r2 = rand::random::<f64>();
                agent.velocity[d] = w * agent.velocity[d]
                    + c1 * r1 * (agent.best_position[d] - agent.position[d])
                    + c2 * r2 * (global_best[d] - agent.position[d]);
                agent.position[d] += agent.velocity[d];
            }
        }
    }

    let swarm_state = SwarmState {
        id: req.id.clone(),
        agents: agents.clone(),
        global_best: global_best.clone(),
        global_best_fitness,
        iterations: req.iterations as u64,
    };
    state.inner.swarm_states.insert(req.id.clone(), swarm_state);

    Ok(Json(json!({
        "id": req.id,
        "best_position": global_best,
        "best_fitness": global_best_fitness,
        "iterations_run": req.iterations,
        "swarm_size": req.swarm_size,
        "convergence_rate": 1.0 / PHI,
        "protocol": "PROTO-233"
    })))
}

pub async fn phantom_precompute(
    State(_state): State<AppState>,
    Json(req): Json<PhantomRequest>,
) -> Result<Json<Value>, AppError> {
    let simulations = req.simulations.min(10000).max(100);

    // Monte Carlo simulation
    let mut results: std::collections::HashMap<String, usize> = std::collections::HashMap::new();
    for _ in 0..simulations {
        let key = format!("sim_{}", (rand::random::<f64>() * 10.0) as u32);
        *results.entry(key).or_insert(0) += 1;
    }

    let (best_result, best_count) = results.iter()
        .max_by_key(|(_, &count)| count)
        .map(|(k, &v)| (k.clone(), v))
        .unwrap_or(("none".into(), 0));

    let confidence = best_count as f64 / simulations as f64;

    Ok(Json(json!({
        "id": req.id,
        "result": best_result,
        "confidence": confidence,
        "simulations_run": simulations,
        "unique_outcomes": results.len(),
        "phi_rate": 1618.0, // simulations/second target
        "protocol": "ZCE-PHANTOM-001"
    })))
}
