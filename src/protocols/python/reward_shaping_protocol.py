"""
PROTO-326 — Reward Shaping Protocol (Python)
Intrinsic motivation and reward engineering for MEDINA Memory Systems.

Charter: PROTO-326
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import random
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable
from collections import defaultdict, deque
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class RewardType(Enum):
    """Types of reward signals."""
    EXTRINSIC = "extrinsic"
    INTRINSIC = "intrinsic"
    CURIOSITY = "curiosity"
    COMPETENCE = "competence"
    NOVELTY = "novelty"
    SOCIAL = "social"
    AESTHETIC = "aesthetic"


class MotivationType(Enum):
    """Types of intrinsic motivation."""
    EXPLORATION = "exploration"
    MASTERY = "mastery"
    AUTONOMY = "autonomy"
    PURPOSE = "purpose"
    CREATIVITY = "creativity"


@dataclass
class RewardSignal:
    """A reward signal with magnitude and type."""
    value: float
    reward_type: RewardType
    source: str = "environment"
    timestamp: float = field(default_factory=time.time)
    state_id: Optional[str] = None
    action_id: Optional[str] = None
    
    def shaped_value(self, gamma: float = PHI_INV) -> float:
        """Apply reward shaping transformation."""
        sign = 1 if self.value >= 0 else -1
        return sign * (abs(self.value) ** gamma) * PHI_INV


@dataclass
class State:
    """A state representation for reward computation."""
    id: str
    features: Dict[str, float] = field(default_factory=dict)
    visit_count: int = 0
    last_visit: float = field(default_factory=time.time)
    total_reward: float = 0.0
    
    def novelty_bonus(self, base_bonus: float = 1.0) -> float:
        """Compute novelty bonus based on visit frequency."""
        return base_bonus / math.sqrt(self.visit_count + 1) * PHI_INV


class PotentialFunction:
    """Potential-based reward shaping function."""
    
    def __init__(self, gamma: float = PHI_INV):
        self.gamma = gamma
        self.potentials: Dict[str, float] = {}
        self.base_potential = 0.0
    
    def set_potential(self, state_id: str, potential: float) -> None:
        """Set potential for a state."""
        self.potentials[state_id] = potential
    
    def compute_shaping(self, state_from: str, state_to: str) -> float:
        """Compute shaping reward F(s, s') = γΦ(s') - Φ(s)."""
        phi_from = self.potentials.get(state_from, self.base_potential)
        phi_to = self.potentials.get(state_to, self.base_potential)
        return self.gamma * phi_to - phi_from


class RewardShapingEngine:
    """
    Reward shaping and intrinsic motivation engine with φ-coherent dynamics.
    """
    
    def __init__(self, gamma: float = PHI_INV):
        self.gamma = gamma
        self.states: Dict[str, State] = {}
        self.reward_history: deque = deque(maxlen=10000)
        self.potential_function = PotentialFunction(gamma)
        self.curiosity_model: Dict[str, float] = {}  # Prediction errors
        self.competence_model: Dict[str, float] = {}  # Success rates
        self.intrinsic_weights: Dict[RewardType, float] = {
            RewardType.CURIOSITY: PHI_INV,
            RewardType.COMPETENCE: PHI_INV * PHI_INV,
            RewardType.NOVELTY: PHI_INV,
            RewardType.AESTHETIC: 0.1,
        }
        self.total_reward = 0.0
        self.beat_count = 0
    
    def register_state(self, state_id: str, features: Dict[str, float] = None) -> State:
        """Register a new state."""
        state = State(id=state_id, features=features or {})
        self.states[state_id] = state
        return state
    
    def visit_state(self, state_id: str) -> None:
        """Record visit to a state."""
        if state_id in self.states:
            state = self.states[state_id]
            state.visit_count += 1
            state.last_visit = time.time()
    
    def compute_extrinsic_reward(self, state_id: str, action_id: str,
                                  raw_reward: float) -> RewardSignal:
        """Compute extrinsic reward with shaping."""
        signal = RewardSignal(
            value=raw_reward,
            reward_type=RewardType.EXTRINSIC,
            source="environment",
            state_id=state_id,
            action_id=action_id
        )
        
        if state_id in self.states:
            self.states[state_id].total_reward += raw_reward
        
        self._record_reward(signal)
        return signal
    
    def compute_curiosity_reward(self, state_id: str, prediction_error: float) -> RewardSignal:
        """Compute curiosity-driven intrinsic reward."""
        # ICM-style curiosity
        self.curiosity_model[state_id] = prediction_error
        
        # Higher reward for unpredictable states
        curiosity_value = prediction_error * self.intrinsic_weights[RewardType.CURIOSITY]
        
        signal = RewardSignal(
            value=curiosity_value,
            reward_type=RewardType.CURIOSITY,
            source="curiosity_module",
            state_id=state_id
        )
        
        self._record_reward(signal)
        return signal
    
    def compute_novelty_reward(self, state_id: str) -> RewardSignal:
        """Compute novelty-based intrinsic reward."""
        if state_id not in self.states:
            self.register_state(state_id)
        
        state = self.states[state_id]
        novelty_value = state.novelty_bonus() * self.intrinsic_weights[RewardType.NOVELTY]
        
        signal = RewardSignal(
            value=novelty_value,
            reward_type=RewardType.NOVELTY,
            source="novelty_module",
            state_id=state_id
        )
        
        self._record_reward(signal)
        return signal
    
    def compute_competence_reward(self, action_id: str, success: bool) -> RewardSignal:
        """Compute competence-based intrinsic reward."""
        # Track success rate
        if action_id not in self.competence_model:
            self.competence_model[action_id] = 0.5
        
        # Update with exponential moving average
        alpha = PHI_INV * 0.1
        self.competence_model[action_id] = (
            alpha * (1.0 if success else 0.0) +
            (1 - alpha) * self.competence_model[action_id]
        )
        
        # Reward for optimal difficulty (flow zone)
        success_rate = self.competence_model[action_id]
        flow_reward = 1 - abs(success_rate - PHI_INV)  # Optimal around φ⁻¹ ≈ 0.618
        competence_value = flow_reward * self.intrinsic_weights[RewardType.COMPETENCE]
        
        signal = RewardSignal(
            value=competence_value,
            reward_type=RewardType.COMPETENCE,
            source="competence_module",
            action_id=action_id
        )
        
        self._record_reward(signal)
        return signal
    
    def compute_shaped_reward(self, state_from: str, state_to: str,
                               raw_reward: float) -> Tuple[float, RewardSignal]:
        """Compute potential-based shaped reward."""
        shaping = self.potential_function.compute_shaping(state_from, state_to)
        shaped_value = raw_reward + shaping
        
        signal = RewardSignal(
            value=shaped_value,
            reward_type=RewardType.EXTRINSIC,
            source="shaped_reward",
            state_id=state_to
        )
        
        self._record_reward(signal)
        return shaped_value, signal
    
    def set_goal_potential(self, goal_state: str, potential: float = PHI) -> None:
        """Set high potential for goal states."""
        self.potential_function.set_potential(goal_state, potential)
    
    def compute_combined_reward(self, state_id: str, action_id: str,
                                 extrinsic: float, prediction_error: float = 0.0,
                                 success: Optional[bool] = None) -> float:
        """Compute combined extrinsic and intrinsic rewards."""
        total = 0.0
        
        # Extrinsic
        ext_signal = self.compute_extrinsic_reward(state_id, action_id, extrinsic)
        total += ext_signal.shaped_value()
        
        # Novelty
        nov_signal = self.compute_novelty_reward(state_id)
        total += nov_signal.value
        
        # Curiosity (if prediction error provided)
        if prediction_error > 0:
            cur_signal = self.compute_curiosity_reward(state_id, prediction_error)
            total += cur_signal.value
        
        # Competence (if success provided)
        if success is not None:
            comp_signal = self.compute_competence_reward(action_id, success)
            total += comp_signal.value
        
        self.visit_state(state_id)
        self.total_reward += total
        self.beat_count += 1
        
        return total
    
    def adapt_intrinsic_weights(self, performance_metric: float) -> None:
        """Adapt intrinsic reward weights based on learning progress."""
        # Increase curiosity when stuck
        if performance_metric < PHI_INV:
            self.intrinsic_weights[RewardType.CURIOSITY] *= PHI
            self.intrinsic_weights[RewardType.NOVELTY] *= PHI
        else:
            # Decrease when making progress
            for rtype in [RewardType.CURIOSITY, RewardType.NOVELTY]:
                self.intrinsic_weights[rtype] = max(
                    0.01,
                    self.intrinsic_weights[rtype] * PHI_INV
                )
    
    def compute_reward_statistics(self, window: int = 1000) -> Dict[str, float]:
        """Compute statistics over recent rewards."""
        if not self.reward_history:
            return {}
        
        recent = list(self.reward_history)[-window:]
        values = [r.value for r in recent]
        
        by_type = defaultdict(list)
        for r in recent:
            by_type[r.reward_type.value].append(r.value)
        
        stats = {
            "mean": sum(values) / len(values),
            "min": min(values),
            "max": max(values),
            "std": math.sqrt(sum((v - sum(values)/len(values))**2 for v in values) / len(values)),
            "positive_ratio": sum(1 for v in values if v > 0) / len(values),
        }
        
        for rtype, type_values in by_type.items():
            stats[f"mean_{rtype}"] = sum(type_values) / len(type_values)
        
        return stats
    
    def _record_reward(self, signal: RewardSignal) -> None:
        """Record a reward signal."""
        self.reward_history.append(signal)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get reward shaping statistics."""
        return {
            "total_states": len(self.states),
            "total_rewards": len(self.reward_history),
            "total_reward": self.total_reward,
            "intrinsic_weights": {k.value: v for k, v in self.intrinsic_weights.items()},
            "beat_count": self.beat_count,
            "phi_coherence": self.total_reward / (self.beat_count + 1) * PHI_INV,
            **self.compute_reward_statistics()
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_reward_engine: Optional[RewardShapingEngine] = None

def get_reward_shaping_engine() -> RewardShapingEngine:
    """Get or create the global reward shaping engine."""
    global _reward_engine
    if _reward_engine is None:
        _reward_engine = RewardShapingEngine()
    return _reward_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "RewardType", "MotivationType", "RewardSignal", "State",
    "PotentialFunction", "RewardShapingEngine", "get_reward_shaping_engine"
]
