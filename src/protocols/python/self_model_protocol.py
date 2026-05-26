"""
PROTO-340 — Self Model Protocol (Python)
Self-awareness and metacognition for MEDINA Memory Systems.

Charter: PROTO-340
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from collections import deque
from enum import Enum

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI

class CognitiveState(Enum):
    IDLE = "idle"
    PROCESSING = "processing"
    LEARNING = "learning"
    DECIDING = "deciding"
    REFLECTING = "reflecting"

@dataclass
class SelfState:
    cognitive_load: float = 0.0
    confidence: float = 0.5
    uncertainty: float = 0.5
    energy: float = 1.0
    focus: float = 0.5
    state: CognitiveState = CognitiveState.IDLE
    timestamp: float = field(default_factory=time.time)

@dataclass
class Capability:
    id: str
    name: str
    proficiency: float = 0.5
    usage_count: int = 0
    success_count: int = 0
    
    def success_rate(self) -> float:
        if self.usage_count == 0:
            return 0.5
        return self.success_count / self.usage_count

class SelfModelEngine:
    def __init__(self):
        self.current_state = SelfState()
        self.state_history: deque = deque(maxlen=1000)
        self.capabilities: Dict[str, Capability] = {}
        self.beliefs_about_self: Dict[str, float] = {}
        self.performance_log: List[Dict[str, Any]] = []
        self.beat_count = 0
    
    def register_capability(self, id: str, name: str, proficiency: float = 0.5) -> Capability:
        cap = Capability(id=id, name=name, proficiency=proficiency)
        self.capabilities[id] = cap
        return cap
    
    def update_state(self, **kwargs) -> SelfState:
        for key, value in kwargs.items():
            if hasattr(self.current_state, key):
                setattr(self.current_state, key, value)
        self.current_state.timestamp = time.time()
        self.state_history.append(self.current_state)
        return self.current_state
    
    def record_performance(self, capability_id: str, success: bool, confidence: float = 0.5) -> None:
        if capability_id in self.capabilities:
            cap = self.capabilities[capability_id]
            cap.usage_count += 1
            if success:
                cap.success_count += 1
            cap.proficiency = cap.proficiency * 0.9 + cap.success_rate() * 0.1
        
        self.performance_log.append({
            "capability": capability_id,
            "success": success,
            "confidence": confidence,
            "timestamp": time.time()
        })
        self.beat_count += 1
    
    def assess_confidence(self, task_type: str) -> float:
        if task_type in self.capabilities:
            return self.capabilities[task_type].proficiency * PHI_INV
        return 0.5 * PHI_INV
    
    def introspect(self) -> Dict[str, Any]:
        return {
            "cognitive_load": self.current_state.cognitive_load,
            "confidence": self.current_state.confidence,
            "uncertainty": self.current_state.uncertainty,
            "energy": self.current_state.energy,
            "focus": self.current_state.focus,
            "state": self.current_state.state.value,
            "capabilities": {k: v.proficiency for k, v in self.capabilities.items()},
            "overall_competence": sum(c.proficiency for c in self.capabilities.values()) / 
                                  (len(self.capabilities) + 1) * PHI_INV
        }
    
    def predict_success(self, capability_id: str) -> float:
        if capability_id not in self.capabilities:
            return 0.5
        
        cap = self.capabilities[capability_id]
        base = cap.proficiency
        energy_factor = self.current_state.energy
        load_factor = 1 - self.current_state.cognitive_load
        
        return base * energy_factor * load_factor * PHI_INV
    
    def get_stats(self) -> Dict[str, Any]:
        proficiencies = [c.proficiency for c in self.capabilities.values()]
        return {
            "total_capabilities": len(self.capabilities),
            "total_performances": len(self.performance_log),
            "mean_proficiency": sum(proficiencies) / len(proficiencies) if proficiencies else 0,
            "current_state": self.current_state.state.value,
            "beat_count": self.beat_count,
            "phi_coherence": sum(proficiencies) / len(proficiencies) * PHI_INV if proficiencies else 0
        }

_self_model_engine: Optional[SelfModelEngine] = None

def get_self_model_engine() -> SelfModelEngine:
    global _self_model_engine
    if _self_model_engine is None:
        _self_model_engine = SelfModelEngine()
    return _self_model_engine

__all__ = ["PHI", "PHI_INV", "CognitiveState", "SelfState", "Capability",
           "SelfModelEngine", "get_self_model_engine"]
