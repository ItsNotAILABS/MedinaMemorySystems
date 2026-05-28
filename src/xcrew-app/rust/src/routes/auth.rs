use axum::{extract::State, response::Json};
use serde_json::{json, Value};
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;

use crate::auth;
use crate::error::AppError;
use crate::models::{AuthResponse, LoginRequest, RegisterRequest};
use crate::state::{AppState, Session};

pub async fn register(
    State(state): State<AppState>,
    Json(req): Json<RegisterRequest>,
) -> Result<Json<Value>, AppError> {
    if req.username.is_empty() || req.password.is_empty() {
        return Err(AppError::BadRequest("Username and password required".into()));
    }

    let user_id = Uuid::new_v4().to_string();
    let _password_hash = auth::hash_password(&req.password);
    let token = auth::create_token(&user_id, "user")
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    let session = Session {
        id: Uuid::new_v4().to_string(),
        user_id: user_id.clone(),
        token: token.clone(),
        created_at: now,
        expires_at: now + 86400,
    };
    state.inner.sessions.insert(session.id.clone(), session);

    Ok(Json(json!({
        "user_id": user_id,
        "username": req.username,
        "token": token,
        "expires_at": now + 86400
    })))
}

pub async fn login(
    State(state): State<AppState>,
    Json(req): Json<LoginRequest>,
) -> Result<Json<Value>, AppError> {
    if req.username.is_empty() || req.password.is_empty() {
        return Err(AppError::BadRequest("Username and password required".into()));
    }

    let user_id = Uuid::new_v4().to_string();
    let token = auth::create_token(&user_id, "user")
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    let session = Session {
        id: Uuid::new_v4().to_string(),
        user_id: user_id.clone(),
        token: token.clone(),
        created_at: now,
        expires_at: now + 86400,
    };
    state.inner.sessions.insert(session.id.clone(), session);

    Ok(Json(json!({
        "user_id": user_id,
        "token": token,
        "expires_at": now + 86400
    })))
}

pub async fn refresh_token(
    State(_state): State<AppState>,
    Json(_body): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let user_id = Uuid::new_v4().to_string();
    let token = auth::create_token(&user_id, "user")
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    Ok(Json(json!({
        "token": token,
        "expires_at": now + 86400
    })))
}
