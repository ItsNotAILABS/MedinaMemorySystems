use axum::{
    extract::{State, WebSocketUpgrade},
    response::IntoResponse,
};

use crate::state::AppState;
use crate::websocket::handle_websocket;

pub async fn websocket_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_websocket(socket, state))
}
