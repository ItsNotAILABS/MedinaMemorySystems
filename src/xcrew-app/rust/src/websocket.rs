//! WebSocket handler for real-time communication

use axum::{
    extract::{ws::WebSocket, State, WebSocketUpgrade},
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};

use crate::state::AppState;

#[derive(Debug, Serialize, Deserialize)]
pub struct WsMessage {
    pub r#type: String,
    pub payload: serde_json::Value,
    pub timestamp: u64,
}

pub async fn handle_websocket(mut socket: WebSocket, state: AppState) {
    use axum::extract::ws::Message;
    use std::time::{SystemTime, UNIX_EPOCH};

    // Send welcome message
    let welcome = WsMessage {
        r#type: "connected".to_string(),
        payload: serde_json::json!({
            "protocol": "XCREW-SERVER-001",
            "version": "1.0.0",
            "phi": 1.618033988749895_f64,
            "message": "Welcome to XCREW Real-time Intelligence"
        }),
        timestamp: SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64,
    };

    if let Ok(json) = serde_json::to_string(&welcome) {
        let _ = socket.send(Message::Text(json.into())).await;
    }

    // Process incoming messages
    while let Some(Ok(msg)) = socket.recv().await {
        match msg {
            Message::Text(text) => {
                if let Ok(ws_msg) = serde_json::from_str::<WsMessage>(&text) {
                    let response = process_ws_message(ws_msg, &state).await;
                    if let Ok(json) = serde_json::to_string(&response) {
                        let _ = socket.send(Message::Text(json.into())).await;
                    }
                }
            }
            Message::Close(_) => break,
            _ => {}
        }
    }
}

async fn process_ws_message(msg: WsMessage, state: &AppState) -> WsMessage {
    use std::time::{SystemTime, UNIX_EPOCH};

    let payload = match msg.r#type.as_str() {
        "ping" => serde_json::json!({ "pong": true }),
        "subscribe" => serde_json::json!({
            "subscribed": msg.payload.get("channel").unwrap_or(&serde_json::json!("default")),
            "status": "ok"
        }),
        "intelligence_query" => serde_json::json!({
            "status": "processing",
            "engines": ["quantum", "swarm", "phantom", "temporal"],
            "phi_coherence": 1.618033988749895_f64
        }),
        "metrics_stream" => {
            let uptime = state.inner.start_time.elapsed().as_secs();
            serde_json::json!({
                "uptime_seconds": uptime,
                "workers": state.inner.workers.len(),
                "memories": state.inner.memories.len(),
                "processes": state.inner.processes.len(),
                "edge_locations": state.inner.edge_locations.len()
            })
        }
        _ => serde_json::json!({
            "error": "unknown_message_type",
            "received_type": msg.r#type
        }),
    };

    WsMessage {
        r#type: format!("{}_response", msg.r#type),
        payload,
        timestamp: SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64,
    }
}
