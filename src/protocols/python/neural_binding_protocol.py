"""
PROTO-304 — Neural Binding Protocol (Python)
Binds distributed neural representations into coherent percepts.

Charter: PROTO-304
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


@dataclass
class NeuralFeature:
    """A single neural feature representation."""
    id: str
    feature_type: str
    value: Any
    activation: float = 1.0
    oscillation_phase: float = 0.0
    binding_ready: bool = True
    
    def synchronize(self, target_phase: float, strength: float = 0.5) -> None:
        """Synchronize oscillation phase toward target."""
        diff = target_phase - self.oscillation_phase
        # Normalize to [-π, π]
        while diff > math.pi:
            diff -= 2 * math.pi
        while diff < -math.pi:
            diff += 2 * math.pi
        self.oscillation_phase += diff * strength * PHI_INV
    
    def update_phase(self, frequency: float, dt: float) -> None:
        """Update oscillation phase over time."""
        self.oscillation_phase += 2 * math.pi * frequency * dt * PHI_INV
        self.oscillation_phase %= (2 * math.pi)


@dataclass
class Binding:
    """A binding between neural features."""
    id: str
    feature_ids: Set[str]
    binding_strength: float = 1.0
    coherence: float = 0.0
    created_at: float = field(default_factory=time.time)
    stable: bool = False
    
    def compute_coherence(self, features: Dict[str, NeuralFeature]) -> float:
        """Compute binding coherence based on phase synchronization."""
        if len(self.feature_ids) < 2:
            return 1.0
        
        phases = [features[fid].oscillation_phase 
                  for fid in self.feature_ids if fid in features]
        
        if len(phases) < 2:
            return 0.0
        
        # Compute phase coherence using circular variance
        cos_sum = sum(math.cos(p) for p in phases)
        sin_sum = sum(math.sin(p) for p in phases)
        mean_resultant = math.sqrt(cos_sum**2 + sin_sum**2) / len(phases)
        
        self.coherence = mean_resultant
        self.stable = self.coherence > PHI_INV
        return self.coherence


class BindingPool:
    """Pool of active bindings."""
    
    def __init__(self, max_bindings: int = 100):
        self.max_bindings = max_bindings
        self.bindings: Dict[str, Binding] = {}
        self.binding_counter = 0
    
    def create_binding(self, feature_ids: Set[str]) -> Binding:
        """Create a new binding."""
        self.binding_counter += 1
        binding = Binding(
            id=f"binding-{self.binding_counter}",
            feature_ids=feature_ids
        )
        
        if len(self.bindings) >= self.max_bindings:
            self._remove_weakest()
        
        self.bindings[binding.id] = binding
        return binding
    
    def get_binding(self, binding_id: str) -> Optional[Binding]:
        """Get a binding by ID."""
        return self.bindings.get(binding_id)
    
    def find_bindings_with_feature(self, feature_id: str) -> List[Binding]:
        """Find all bindings containing a feature."""
        return [b for b in self.bindings.values() if feature_id in b.feature_ids]
    
    def _remove_weakest(self) -> None:
        """Remove the weakest binding."""
        if not self.bindings:
            return
        
        weakest = min(self.bindings.values(), key=lambda b: b.binding_strength)
        del self.bindings[weakest.id]
    
    def prune_unstable(self, threshold: float = 0.3) -> int:
        """Remove unstable bindings below threshold."""
        to_remove = [
            bid for bid, b in self.bindings.items() 
            if b.coherence < threshold
        ]
        for bid in to_remove:
            del self.bindings[bid]
        return len(to_remove)


class NeuralBindingEngine:
    """
    Engine for neural binding with φ-harmonic synchronization.
    """
    
    def __init__(self, base_frequency: float = 40.0):  # Gamma band
        self.features: Dict[str, NeuralFeature] = {}
        self.binding_pool = BindingPool()
        self.base_frequency = base_frequency  # Hz
        self.beat_count = 0
        self.global_phase = 0.0
        self.history: List[Dict[str, Any]] = []
    
    def register_feature(self, id: str, feature_type: str, 
                        value: Any, activation: float = 1.0) -> NeuralFeature:
        """Register a neural feature."""
        feature = NeuralFeature(
            id=id,
            feature_type=feature_type,
            value=value,
            activation=activation,
            oscillation_phase=random.uniform(0, 2 * math.pi)
        )
        self.features[id] = feature
        return feature
    
    def bind_features(self, feature_ids: List[str]) -> Optional[Binding]:
        """Create a binding between features."""
        valid_ids = {fid for fid in feature_ids if fid in self.features}
        if len(valid_ids) < 2:
            return None
        
        binding = self.binding_pool.create_binding(valid_ids)
        
        # Initialize synchronization
        self._synchronize_binding(binding)
        
        return binding
    
    def _synchronize_binding(self, binding: Binding) -> None:
        """Synchronize features within a binding."""
        if not binding.feature_ids:
            return
        
        # Find mean phase
        phases = [self.features[fid].oscillation_phase 
                  for fid in binding.feature_ids if fid in self.features]
        
        if not phases:
            return
        
        cos_mean = sum(math.cos(p) for p in phases) / len(phases)
        sin_mean = sum(math.sin(p) for p in phases) / len(phases)
        mean_phase = math.atan2(sin_mean, cos_mean)
        
        # Synchronize features toward mean
        for fid in binding.feature_ids:
            if fid in self.features:
                self.features[fid].synchronize(mean_phase, binding.binding_strength * PHI_INV)
    
    def tick(self, dt: float = 0.001) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        self.global_phase += 2 * math.pi * self.base_frequency * dt
        self.global_phase %= (2 * math.pi)
        
        # Update all feature phases
        for feature in self.features.values():
            feature.update_phase(self.base_frequency, dt)
        
        # Update all binding coherences and synchronize
        total_coherence = 0
        for binding in self.binding_pool.bindings.values():
            coherence = binding.compute_coherence(self.features)
            total_coherence += coherence
            
            if binding.stable:
                self._synchronize_binding(binding)
        
        avg_coherence = total_coherence / max(1, len(self.binding_pool.bindings))
        
        report = {
            "beat": self.beat_count,
            "feature_count": len(self.features),
            "binding_count": len(self.binding_pool.bindings),
            "avg_coherence": avg_coherence,
            "stable_bindings": sum(1 for b in self.binding_pool.bindings.values() if b.stable),
            "global_phase": self.global_phase,
            "phi_metric": avg_coherence * PHI,
            "timestamp": time.time()
        }
        
        self.history.append(report)
        return report
    
    def unbind(self, binding_id: str) -> bool:
        """Remove a binding."""
        if binding_id in self.binding_pool.bindings:
            del self.binding_pool.bindings[binding_id]
            return True
        return False
    
    def get_bound_features(self, binding_id: str) -> List[NeuralFeature]:
        """Get features in a binding."""
        binding = self.binding_pool.get_binding(binding_id)
        if not binding:
            return []
        return [self.features[fid] for fid in binding.feature_ids if fid in self.features]
    
    def find_related_bindings(self, feature_id: str) -> List[Binding]:
        """Find all bindings involving a feature."""
        return self.binding_pool.find_bindings_with_feature(feature_id)
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate binding coherence report."""
        stable = [b for b in self.binding_pool.bindings.values() if b.stable]
        
        return {
            "total_features": len(self.features),
            "total_bindings": len(self.binding_pool.bindings),
            "stable_bindings": len(stable),
            "avg_coherence": sum(b.coherence for b in self.binding_pool.bindings.values()) / 
                            max(1, len(self.binding_pool.bindings)),
            "base_frequency": self.base_frequency,
            "global_phase": self.global_phase,
            "phi_coherence": len(stable) * PHI / max(1, len(self.binding_pool.bindings)),
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[NeuralBindingEngine] = None

def get_neural_binding_engine() -> NeuralBindingEngine:
    """Get or create the singleton NeuralBindingEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = NeuralBindingEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-304 Neural Binding Protocol (Python) ===")
    
    engine = get_neural_binding_engine()
    
    # Register features representing a visual object
    engine.register_feature("color_red", "color", "red", 0.9)
    engine.register_feature("shape_circle", "shape", "circle", 0.8)
    engine.register_feature("location_center", "location", "center", 0.7)
    engine.register_feature("motion_still", "motion", "stationary", 0.6)
    
    # Bind features into coherent object
    binding = engine.bind_features(["color_red", "shape_circle", "location_center"])
    print(f"Created binding: {binding.id}")
    
    # Run synchronization
    for _ in range(100):
        report = engine.tick(0.001)
    
    print(f"Binding coherence: {binding.coherence:.3f}")
    print(f"Binding stable: {binding.stable}")
    print(f"Report: {engine.coherence_report()}")
