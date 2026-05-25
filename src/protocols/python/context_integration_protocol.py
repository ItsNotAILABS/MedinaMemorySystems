"""
PROTO-310 — Context Integration Protocol (Python)
Integrates contextual information for coherent understanding.

Charter: PROTO-310
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set
from enum import Enum

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


class ContextDimension(Enum):
    TEMPORAL = "temporal"
    SPATIAL = "spatial"
    SOCIAL = "social"
    TASK = "task"
    EMOTIONAL = "emotional"
    SEMANTIC = "semantic"


@dataclass
class ContextFeature:
    """A single context feature."""
    dimension: ContextDimension
    key: str
    value: Any
    confidence: float = 1.0
    timestamp: float = field(default_factory=time.time)
    source: str = "observation"
    
    def age(self) -> float:
        """Get feature age in seconds."""
        return time.time() - self.timestamp
    
    def relevance(self) -> float:
        """Calculate time-weighted relevance."""
        decay = math.exp(-self.age() * PHI_INV * 0.001)
        return self.confidence * decay


@dataclass
class ContextFrame:
    """A frame of context at a point in time."""
    id: str
    features: Dict[str, ContextFeature] = field(default_factory=dict)
    parent_frame: Optional[str] = None
    created_at: float = field(default_factory=time.time)
    active: bool = True
    
    def add_feature(self, feature: ContextFeature) -> None:
        """Add a feature to this frame."""
        key = f"{feature.dimension.value}:{feature.key}"
        self.features[key] = feature
    
    def get_feature(self, dimension: ContextDimension, key: str) -> Optional[ContextFeature]:
        """Get a specific feature."""
        lookup_key = f"{dimension.value}:{key}"
        return self.features.get(lookup_key)
    
    def get_by_dimension(self, dimension: ContextDimension) -> List[ContextFeature]:
        """Get all features of a dimension."""
        prefix = f"{dimension.value}:"
        return [f for k, f in self.features.items() if k.startswith(prefix)]
    
    def coherence(self) -> float:
        """Calculate frame coherence."""
        if not self.features:
            return 0.0
        relevances = [f.relevance() for f in self.features.values()]
        return sum(relevances) / len(relevances) * PHI_INV


class ContextStack:
    """Stack of context frames for hierarchical context."""
    
    def __init__(self, max_depth: int = 10):
        self.frames: List[ContextFrame] = []
        self.max_depth = max_depth
        self.frame_counter = 0
    
    def push(self, frame: Optional[ContextFrame] = None) -> ContextFrame:
        """Push a new context frame."""
        self.frame_counter += 1
        
        if frame is None:
            parent_id = self.frames[-1].id if self.frames else None
            frame = ContextFrame(
                id=f"ctx-{self.frame_counter}",
                parent_frame=parent_id
            )
        
        if len(self.frames) >= self.max_depth:
            self.frames.pop(0)
        
        # Inherit features from parent with decay
        if self.frames:
            parent = self.frames[-1]
            for key, feature in parent.features.items():
                inherited = ContextFeature(
                    dimension=feature.dimension,
                    key=feature.key,
                    value=feature.value,
                    confidence=feature.confidence * PHI_INV,
                    source="inherited"
                )
                frame.add_feature(inherited)
        
        self.frames.append(frame)
        return frame
    
    def pop(self) -> Optional[ContextFrame]:
        """Pop the current context frame."""
        if self.frames:
            frame = self.frames.pop()
            frame.active = False
            return frame
        return None
    
    def current(self) -> Optional[ContextFrame]:
        """Get current context frame."""
        return self.frames[-1] if self.frames else None
    
    def depth(self) -> int:
        """Get current stack depth."""
        return len(self.frames)


class ContextIntegrator:
    """Integrates features across dimensions."""
    
    def __init__(self):
        self.integration_weights: Dict[ContextDimension, float] = {
            dim: PHI_INV for dim in ContextDimension
        }
        self.integration_history: List[Dict[str, Any]] = []
    
    def set_weight(self, dimension: ContextDimension, weight: float) -> None:
        """Set integration weight for a dimension."""
        self.integration_weights[dimension] = max(0, min(1, weight))
    
    def integrate(self, frames: List[ContextFrame]) -> Dict[str, Any]:
        """Integrate features from multiple frames."""
        integrated: Dict[str, ContextFeature] = {}
        
        for frame in frames:
            frame_weight = frame.coherence()
            for key, feature in frame.features.items():
                dim_weight = self.integration_weights.get(feature.dimension, PHI_INV)
                combined_weight = feature.relevance() * dim_weight * frame_weight
                
                if key in integrated:
                    # Merge with existing
                    existing = integrated[key]
                    if combined_weight > existing.confidence:
                        integrated[key] = ContextFeature(
                            dimension=feature.dimension,
                            key=feature.key,
                            value=feature.value,
                            confidence=combined_weight,
                            source="integrated"
                        )
                else:
                    integrated[key] = ContextFeature(
                        dimension=feature.dimension,
                        key=feature.key,
                        value=feature.value,
                        confidence=combined_weight,
                        source="integrated"
                    )
        
        result = {
            "features": {k: {"value": f.value, "confidence": f.confidence} 
                        for k, f in integrated.items()},
            "total_features": len(integrated),
            "avg_confidence": sum(f.confidence for f in integrated.values()) / 
                            max(1, len(integrated)),
            "timestamp": time.time()
        }
        
        self.integration_history.append(result)
        return result


class ContextIntegrationEngine:
    """
    Main engine for context integration with φ-coherent processing.
    """
    
    def __init__(self):
        self.stack = ContextStack()
        self.integrator = ContextIntegrator()
        self.global_context: Dict[str, ContextFeature] = {}
        self.beat_count = 0
    
    def enter_context(self) -> ContextFrame:
        """Enter a new context frame."""
        return self.stack.push()
    
    def exit_context(self) -> Optional[ContextFrame]:
        """Exit current context frame."""
        return self.stack.pop()
    
    def set_feature(self, dimension: ContextDimension, key: str, 
                   value: Any, confidence: float = 1.0) -> ContextFeature:
        """Set a context feature in current frame."""
        frame = self.stack.current()
        if not frame:
            frame = self.enter_context()
        
        feature = ContextFeature(
            dimension=dimension,
            key=key,
            value=value,
            confidence=confidence
        )
        frame.add_feature(feature)
        return feature
    
    def get_feature(self, dimension: ContextDimension, key: str) -> Optional[Any]:
        """Get a feature value from current context."""
        frame = self.stack.current()
        if not frame:
            return None
        
        feature = frame.get_feature(dimension, key)
        return feature.value if feature else None
    
    def set_global(self, dimension: ContextDimension, key: str,
                  value: Any, confidence: float = 1.0) -> ContextFeature:
        """Set a global context feature."""
        feature = ContextFeature(
            dimension=dimension,
            key=key,
            value=value,
            confidence=confidence,
            source="global"
        )
        global_key = f"{dimension.value}:{key}"
        self.global_context[global_key] = feature
        return feature
    
    def integrate_current(self) -> Dict[str, Any]:
        """Integrate current context stack."""
        frames = list(self.stack.frames)
        
        # Add global context as virtual frame
        if self.global_context:
            global_frame = ContextFrame(id="global")
            for key, feature in self.global_context.items():
                global_frame.features[key] = feature
            frames.insert(0, global_frame)
        
        return self.integrator.integrate(frames)
    
    def query_context(self, dimensions: Optional[List[ContextDimension]] = None) -> Dict[str, Any]:
        """Query context features by dimensions."""
        integrated = self.integrate_current()
        
        if dimensions is None:
            return integrated
        
        filtered = {}
        for key, value in integrated["features"].items():
            dim_str = key.split(":")[0]
            for dim in dimensions:
                if dim.value == dim_str:
                    filtered[key] = value
                    break
        
        return {
            "features": filtered,
            "total_features": len(filtered),
            "dimensions": [d.value for d in dimensions]
        }
    
    def context_similarity(self, other_features: Dict[str, Any]) -> float:
        """Compute similarity with another context."""
        current = self.integrate_current()
        
        current_keys = set(current["features"].keys())
        other_keys = set(other_features.keys())
        
        if not current_keys or not other_keys:
            return 0.0
        
        intersection = current_keys & other_keys
        union = current_keys | other_keys
        
        return len(intersection) / len(union) * PHI_INV if union else 0.0
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        # Decay global context features
        for feature in self.global_context.values():
            feature.confidence *= math.exp(-elapsed * PHI_INV * 0.001)
        
        # Clean up low-confidence global features
        to_remove = [k for k, f in self.global_context.items() if f.confidence < 0.1]
        for k in to_remove:
            del self.global_context[k]
        
        current = self.stack.current()
        coherence = current.coherence() if current else 0.0
        
        return {
            "beat": self.beat_count,
            "stack_depth": self.stack.depth(),
            "global_features": len(self.global_context),
            "current_features": len(current.features) if current else 0,
            "coherence": coherence,
            "phi_metric": coherence * PHI,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate context coherence report."""
        integrated = self.integrate_current()
        
        return {
            "stack_depth": self.stack.depth(),
            "global_features": len(self.global_context),
            "integrated_features": integrated["total_features"],
            "avg_confidence": integrated["avg_confidence"],
            "integration_count": len(self.integrator.integration_history),
            "phi_coherence": integrated["avg_confidence"] * PHI,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[ContextIntegrationEngine] = None

def get_context_integration_engine() -> ContextIntegrationEngine:
    """Get or create the singleton ContextIntegrationEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = ContextIntegrationEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-310 Context Integration Protocol (Python) ===")
    
    engine = get_context_integration_engine()
    
    # Set global context
    engine.set_global(ContextDimension.TEMPORAL, "date", "2026-05-25")
    engine.set_global(ContextDimension.SPATIAL, "location", "Dallas, TX")
    
    # Enter nested contexts
    engine.enter_context()
    engine.set_feature(ContextDimension.TASK, "current_task", "coding")
    engine.set_feature(ContextDimension.EMOTIONAL, "mood", "focused")
    
    engine.enter_context()
    engine.set_feature(ContextDimension.TASK, "subtask", "writing protocol")
    engine.set_feature(ContextDimension.SOCIAL, "collaborator", "AI assistant")
    
    # Query context
    integrated = engine.integrate_current()
    print(f"Integrated features: {integrated['total_features']}")
    print(f"Avg confidence: {integrated['avg_confidence']:.3f}")
    
    # Query by dimension
    task_context = engine.query_context([ContextDimension.TASK])
    print(f"Task context: {task_context}")
    
    print(f"Report: {engine.coherence_report()}")
