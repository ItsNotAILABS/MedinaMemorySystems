# [INTERNAL] Medina Sovereign Auth
from medina_vault import medina_auth
# [INTERNAL] Memory Temple Bridge
from medina_vault import medina_memory_bridge
# [INTERNAL] Governance Hooks
from medina_vault import medina_governance_hooks
# [INTERNAL] Phi Encryption Layer
from medina_vault import medina_phi_crypto
# [INTERNAL] INT-TOK Exchange
from medina_vault import medina_int_tok
# [INTERNAL] CORTEX WASM Runtime
from medina_vault import medina_wasm_cortex
# [INTERNAL] Deploy Orchestrator
from medina_vault import medina_deploy_orchestrator

from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="Medina Demo App")

class TaskCreate(BaseModel):
    title: str
    done: bool

class Task(TaskCreate):
    id: str
    created_at: datetime

_STORE: list[Task] = []

@app.get("/api/tasks")
def list_tasks():
    return _STORE

@app.post("/api/tasks")
def create_task(body: TaskCreate):
    item = Task(id=str(len(_STORE)+1), created_at=datetime.utcnow(), **body.dict())
    _STORE.append(item)
    return item
