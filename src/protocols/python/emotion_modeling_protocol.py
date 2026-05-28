"""
PROTO-336 — Emotion Modeling Protocol (Python)
Affective computing and emotion dynamics for MEDINA Memory Systems.

Charter: PROTO-336
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Tuple
from collections import deque
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class BasicEmotion(Enum):
    """Basic emotions (Ekman's model)."""
    JOY = "joy"
    SADNESS = "sadness"
    ANGER = "anger"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    TRUST = "trust"
    ANTICIPATION = "anticipation"


@dataclass
class EmotionVector:
    """Vector representation of emotional state."""
    valence: float = 0.0  # -1 (negative) to 1 (positive)
    arousal: float = 0.0  # 0 (calm) to 1 (excited)
    dominance: float = 0.5  # 0 (submissive) to 1 (dominant)
    
    def magnitude(self) -> float:
        """Compute emotion intensity."""
        return math.sqrt(self.valence ** 2 + self.arousal ** 2) * PHI_INV
    
    def blend(self, other: EmotionVector, weight: float = 0.5) -> EmotionVector:
        """Blend with another emotion vector."""
        return EmotionVector(
            valence=self.valence * (1 - weight) + other.valence * weight,
            arousal=self.arousal * (1 - weight) + other.arousal * weight,
            dominance=self.dominance * (1 - weight) + other.dominance * weight
        )


@dataclass
class EmotionState:
    """Current emotional state."""
    primary: BasicEmotion = BasicEmotion.TRUST
    secondary: Optional[BasicEmotion] = None
    vector: EmotionVector = field(default_factory=EmotionVector)
    intensity: float = 0.5
    stability: float = 0.5
    timestamp: float = field(default_factory=time.time)
    
    def decay(self, dt: float, decay_rate: float = 0.1) -> None:
        """Apply temporal decay to emotion intensity."""
        self.intensity *= math.exp(-decay_rate * dt * PHI_INV)
        self.stability = min(1.0, self.stability + dt * PHI_INV * 0.01)


@dataclass
class EmotionEvent:
    """An event that triggers emotional response."""
    id: str
    event_type: str
    valence_impact: float = 0.0
    arousal_impact: float = 0.0
    dominance_impact: float = 0.0
    source: str = "environment"
    timestamp: float = field(default_factory=time.time)


class EmotionDynamics:
    """Dynamics model for emotion transitions."""
    
    # PAD (Pleasure-Arousal-Dominance) mappings for basic emotions
    EMOTION_PAD = {
        BasicEmotion.JOY: (0.8, 0.5, 0.6),
        BasicEmotion.SADNESS: (-0.7, -0.3, -0.4),
        BasicEmotion.ANGER: (-0.5, 0.8, 0.6),
        BasicEmotion.FEAR: (-0.7, 0.7, -0.7),
        BasicEmotion.SURPRISE: (0.1, 0.8, 0.3),
        BasicEmotion.DISGUST: (-0.6, 0.4, 0.3),
        BasicEmotion.TRUST: (0.6, 0.2, 0.5),
        BasicEmotion.ANTICIPATION: (0.4, 0.5, 0.4)
    }
    
    @staticmethod
    def pad_to_emotion(valence: float, arousal: float, dominance: float) -> BasicEmotion:
        """Map PAD values to nearest basic emotion."""
        best_emotion = BasicEmotion.TRUST
        best_distance = float('inf')
        
        for emotion, (p, a, d) in EmotionDynamics.EMOTION_PAD.items():
            distance = math.sqrt(
                (valence - p) ** 2 + 
                (arousal - a) ** 2 + 
                (dominance - d) ** 2
            )
            if distance < best_distance:
                best_distance = distance
                best_emotion = emotion
        
        return best_emotion
    
    @staticmethod
    def emotion_to_pad(emotion: BasicEmotion) -> Tuple[float, float, float]:
        """Get PAD values for emotion."""
        return EmotionDynamics.EMOTION_PAD.get(emotion, (0, 0, 0.5))


class EmotionModelingEngine:
    """
    Emotion modeling engine with φ-coherent affective dynamics.
    """
    
    def __init__(self, decay_rate: float = 0.05):
        self.current_state = EmotionState()
        self.state_history: deque = deque(maxlen=1000)
        self.event_log: List[EmotionEvent] = []
        self.decay_rate = decay_rate * PHI_INV
        self.mood: EmotionVector = EmotionVector()  # Long-term mood
        self.mood_inertia = 0.95  # How resistant mood is to change
        self.appraisal_rules: Dict[str, Dict[str, float]] = {}
        self.beat_count = 0
    
    def register_appraisal_rule(self, event_type: str, 
                                 impacts: Dict[str, float]) -> None:
        """Register appraisal rule for event type."""
        self.appraisal_rules[event_type] = impacts
    
    def appraise_event(self, event: EmotionEvent) -> EmotionVector:
        """Appraise event and compute emotional impact."""
        # Check for registered rules
        if event.event_type in self.appraisal_rules:
            impacts = self.appraisal_rules[event.event_type]
            return EmotionVector(
                valence=impacts.get("valence", 0) * PHI_INV,
                arousal=impacts.get("arousal", 0) * PHI_INV,
                dominance=impacts.get("dominance", 0) * PHI_INV
            )
        
        # Use event-provided impacts
        return EmotionVector(
            valence=event.valence_impact,
            arousal=event.arousal_impact,
            dominance=event.dominance_impact
        )
    
    def process_event(self, event: EmotionEvent) -> EmotionState:
        """Process emotional event and update state."""
        self.event_log.append(event)
        
        # Appraise event
        impact = self.appraise_event(event)
        
        # Update emotion vector
        # Intensity of impact depends on current arousal
        impact_strength = 0.3 + 0.4 * self.current_state.vector.arousal
        
        new_vector = self.current_state.vector.blend(impact, impact_strength * PHI_INV)
        
        # Clamp values
        new_vector.valence = max(-1, min(1, new_vector.valence))
        new_vector.arousal = max(0, min(1, new_vector.arousal))
        new_vector.dominance = max(0, min(1, new_vector.dominance))
        
        # Determine primary emotion
        primary = EmotionDynamics.pad_to_emotion(
            new_vector.valence, 
            new_vector.arousal, 
            new_vector.dominance
        )
        
        # Update intensity
        intensity = impact.magnitude()
        new_intensity = self.current_state.intensity * 0.7 + intensity * 0.3
        
        # Create new state
        self.current_state = EmotionState(
            primary=primary,
            secondary=self.current_state.primary if self.current_state.primary != primary else None,
            vector=new_vector,
            intensity=new_intensity,
            stability=self.current_state.stability * 0.9  # Reduce stability on event
        )
        
        self.state_history.append(self.current_state)
        
        # Update mood (slow moving average)
        self.mood = self.mood.blend(new_vector, 1 - self.mood_inertia)
        
        self.beat_count += 1
        return self.current_state
    
    def update(self, dt: float) -> None:
        """Update emotional state over time."""
        # Decay current emotion toward mood baseline
        self.current_state.decay(dt, self.decay_rate)
        
        # Pull toward mood
        mood_pull = 0.01 * dt * PHI_INV
        self.current_state.vector = self.current_state.vector.blend(
            self.mood, mood_pull
        )
        
        # Re-evaluate primary emotion
        self.current_state.primary = EmotionDynamics.pad_to_emotion(
            self.current_state.vector.valence,
            self.current_state.vector.arousal,
            self.current_state.vector.dominance
        )
    
    def get_emotion_influence(self) -> Dict[str, float]:
        """Get influence of current emotion on cognition."""
        state = self.current_state
        
        return {
            "attention_bias": state.vector.arousal * PHI_INV,  # High arousal = narrow attention
            "memory_enhancement": abs(state.vector.valence) * state.intensity,  # Emotional events remembered better
            "risk_tolerance": state.vector.dominance * state.vector.valence * PHI_INV,
            "exploration_drive": state.vector.arousal * (1 + state.vector.valence) * 0.5,
            "social_approach": state.vector.valence * state.vector.dominance * PHI_INV
        }
    
    def generate_expression(self) -> Dict[str, float]:
        """Generate facial/behavioral expression parameters."""
        state = self.current_state
        v, a, d = state.vector.valence, state.vector.arousal, state.vector.dominance
        
        return {
            "smile": max(0, v) * state.intensity,
            "frown": max(0, -v) * state.intensity,
            "eyebrow_raise": a * 0.5 * state.intensity,
            "eye_widening": max(0, a - 0.5) * state.intensity,
            "posture_expansion": d * state.intensity,
            "movement_speed": (0.5 + a * 0.5) * state.intensity
        }
    
    def detect_mood_shift(self, window_size: int = 10) -> Optional[str]:
        """Detect significant mood shifts."""
        if len(self.state_history) < window_size:
            return None
        
        recent = list(self.state_history)[-window_size:]
        old = list(self.state_history)[-window_size * 2:-window_size] if len(self.state_history) >= window_size * 2 else []
        
        if not old:
            return None
        
        recent_valence = sum(s.vector.valence for s in recent) / len(recent)
        old_valence = sum(s.vector.valence for s in old) / len(old)
        
        shift = recent_valence - old_valence
        
        if shift > PHI_INV:
            return "improving"
        elif shift < -PHI_INV:
            return "declining"
        return "stable"
    
    def get_emotional_summary(self) -> Dict[str, Any]:
        """Get summary of emotional state."""
        return {
            "primary_emotion": self.current_state.primary.value,
            "secondary_emotion": self.current_state.secondary.value if self.current_state.secondary else None,
            "valence": self.current_state.vector.valence,
            "arousal": self.current_state.vector.arousal,
            "dominance": self.current_state.vector.dominance,
            "intensity": self.current_state.intensity,
            "stability": self.current_state.stability,
            "mood_valence": self.mood.valence,
            "mood_trend": self.detect_mood_shift()
        }
    
    def get_stats(self) -> Dict[str, Any]:
        """Get emotion modeling statistics."""
        if not self.state_history:
            return {"total_events": 0}
        
        intensities = [s.intensity for s in self.state_history]
        valences = [s.vector.valence for s in self.state_history]
        
        emotion_counts = {}
        for state in self.state_history:
            emotion_counts[state.primary.value] = emotion_counts.get(state.primary.value, 0) + 1
        
        return {
            "total_events": len(self.event_log),
            "state_history_length": len(self.state_history),
            "mean_intensity": sum(intensities) / len(intensities),
            "mean_valence": sum(valences) / len(valences),
            "emotion_distribution": emotion_counts,
            "current_mood": self.mood.valence,
            "beat_count": self.beat_count,
            "phi_coherence": self.current_state.stability * abs(self.current_state.vector.valence) * PHI_INV
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_emotion_engine: Optional[EmotionModelingEngine] = None

def get_emotion_modeling_engine() -> EmotionModelingEngine:
    """Get or create the global emotion modeling engine."""
    global _emotion_engine
    if _emotion_engine is None:
        _emotion_engine = EmotionModelingEngine()
    return _emotion_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "BasicEmotion", "EmotionVector", "EmotionState", "EmotionEvent",
    "EmotionDynamics", "EmotionModelingEngine", "get_emotion_modeling_engine"
]
