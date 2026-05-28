"""
PROTO-303 — Attention Mechanism Protocol (Python)
φ-coherent attention allocation for cognitive processing.

Charter: PROTO-303
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable
from enum import Enum

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


class AttentionType(Enum):
    FOCUSED = "focused"
    DIVIDED = "divided"
    SELECTIVE = "selective"
    SUSTAINED = "sustained"
    EXECUTIVE = "executive"


@dataclass
class AttentionTarget:
    """A target of attention with salience and priority."""
    id: str
    label: str
    salience: float = 0.5
    priority: float = 0.5
    duration: float = 0.0
    is_attended: bool = False
    attend_start: Optional[float] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def compute_attention_weight(self) -> float:
        """Compute φ-weighted attention value."""
        return self.salience * PHI + self.priority * PHI_INV
    
    def start_attention(self) -> None:
        """Mark as currently attended."""
        self.is_attended = True
        self.attend_start = time.time()
    
    def end_attention(self) -> float:
        """End attention and return duration."""
        if self.attend_start:
            self.duration += time.time() - self.attend_start
        self.is_attended = False
        self.attend_start = None
        return self.duration


@dataclass
class AttentionSpotlight:
    """The focus of attention with capacity constraints."""
    capacity: float = 1.0
    current_load: float = 0.0
    targets: List[str] = field(default_factory=list)
    focus_width: float = field(default_factory=lambda: PHI_INV)
    
    def can_attend(self, weight: float) -> bool:
        """Check if there's capacity for new attention."""
        return self.current_load + weight <= self.capacity * PHI
    
    def add_target(self, target_id: str, weight: float) -> bool:
        """Add a target to the attention spotlight."""
        if self.can_attend(weight):
            self.targets.append(target_id)
            self.current_load += weight
            return True
        return False
    
    def remove_target(self, target_id: str, weight: float) -> bool:
        """Remove a target from the spotlight."""
        if target_id in self.targets:
            self.targets.remove(target_id)
            self.current_load = max(0, self.current_load - weight)
            return True
        return False
    
    def utilization(self) -> float:
        """Get current utilization ratio."""
        return self.current_load / (self.capacity * PHI) if self.capacity > 0 else 0


class AttentionFilter:
    """Filters stimuli based on relevance and priority."""
    
    def __init__(self, threshold: float = 0.3):
        self.threshold = threshold
        self.filter_history: List[Dict[str, Any]] = []
    
    def filter(self, targets: List[AttentionTarget]) -> List[AttentionTarget]:
        """Filter targets that pass the attention threshold."""
        passed = []
        for target in targets:
            weight = target.compute_attention_weight()
            if weight >= self.threshold * PHI:
                passed.append(target)
        
        self.filter_history.append({
            "input_count": len(targets),
            "output_count": len(passed),
            "timestamp": time.time()
        })
        
        return passed
    
    def adjust_threshold(self, delta: float) -> None:
        """Adjust the filter threshold."""
        self.threshold = max(0.1, min(0.9, self.threshold + delta))


class AttentionMechanism:
    """
    Core attention mechanism with φ-harmonic allocation.
    """
    
    def __init__(self, capacity: float = 1.0):
        self.spotlight = AttentionSpotlight(capacity=capacity)
        self.filter = AttentionFilter()
        self.targets: Dict[str, AttentionTarget] = {}
        self.attention_type = AttentionType.FOCUSED
        self.beat_count = 0
        self.attention_history: List[Dict[str, Any]] = []
    
    def register_target(self, id: str, label: str, 
                       salience: float = 0.5, priority: float = 0.5,
                       **metadata) -> AttentionTarget:
        """Register a new attention target."""
        target = AttentionTarget(
            id=id, label=label, 
            salience=salience, priority=priority,
            metadata=metadata
        )
        self.targets[id] = target
        return target
    
    def update_salience(self, id: str, salience: float) -> bool:
        """Update the salience of a target."""
        if id in self.targets:
            self.targets[id].salience = max(0, min(1, salience))
            return True
        return False
    
    def update_priority(self, id: str, priority: float) -> bool:
        """Update the priority of a target."""
        if id in self.targets:
            self.targets[id].priority = max(0, min(1, priority))
            return True
        return False
    
    def allocate_attention(self) -> List[str]:
        """Allocate attention based on current state."""
        # Filter targets
        all_targets = list(self.targets.values())
        filtered = self.filter.filter(all_targets)
        
        # Sort by attention weight
        sorted_targets = sorted(
            filtered,
            key=lambda t: t.compute_attention_weight(),
            reverse=True
        )
        
        # Clear current spotlight
        for tid in list(self.spotlight.targets):
            if tid in self.targets:
                self.targets[tid].end_attention()
            self.spotlight.remove_target(tid, 0)
        self.spotlight.current_load = 0
        self.spotlight.targets = []
        
        # Allocate to top targets
        attended = []
        for target in sorted_targets:
            weight = target.compute_attention_weight()
            if self.spotlight.add_target(target.id, weight * PHI_INV):
                target.start_attention()
                attended.append(target.id)
        
        self.attention_history.append({
            "beat": self.beat_count,
            "attended": attended,
            "utilization": self.spotlight.utilization(),
            "timestamp": time.time()
        })
        
        return attended
    
    def focus_on(self, target_id: str) -> bool:
        """Force focus on a specific target."""
        if target_id not in self.targets:
            return False
        
        # Clear current attention
        for tid in list(self.spotlight.targets):
            if tid in self.targets:
                self.targets[tid].end_attention()
        self.spotlight.targets = []
        self.spotlight.current_load = 0
        
        # Focus on specific target
        target = self.targets[target_id]
        target.start_attention()
        self.spotlight.targets = [target_id]
        self.spotlight.current_load = target.compute_attention_weight()
        self.attention_type = AttentionType.FOCUSED
        
        return True
    
    def divide_attention(self, target_ids: List[str]) -> List[str]:
        """Divide attention among specified targets."""
        self.attention_type = AttentionType.DIVIDED
        
        # Clear current attention
        for tid in list(self.spotlight.targets):
            if tid in self.targets:
                self.targets[tid].end_attention()
        self.spotlight.targets = []
        self.spotlight.current_load = 0
        
        attended = []
        for tid in target_ids:
            if tid in self.targets:
                target = self.targets[tid]
                weight = target.compute_attention_weight() / len(target_ids)
                if self.spotlight.add_target(tid, weight):
                    target.start_attention()
                    attended.append(tid)
        
        return attended
    
    def selective_attention(self, criterion: Callable[[AttentionTarget], bool]) -> List[str]:
        """Apply selective attention based on a criterion."""
        self.attention_type = AttentionType.SELECTIVE
        
        selected = [t for t in self.targets.values() if criterion(t)]
        return self.divide_attention([t.id for t in selected])
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one attention cycle."""
        self.beat_count += 1
        
        # Auto-reallocation every φ beats
        if self.beat_count % max(1, int(PHI * 5)) == 0:
            self.allocate_attention()
        
        # Decay salience for unattended targets
        for target in self.targets.values():
            if not target.is_attended:
                target.salience *= (1 - PHI_INV * 0.01 * elapsed)
        
        return {
            "beat": self.beat_count,
            "attended_count": len(self.spotlight.targets),
            "utilization": self.spotlight.utilization(),
            "attention_type": self.attention_type.value,
            "phi_coherence": self.spotlight.utilization() * PHI,
            "timestamp": time.time()
        }
    
    def get_attended(self) -> List[AttentionTarget]:
        """Get currently attended targets."""
        return [
            self.targets[tid] 
            for tid in self.spotlight.targets 
            if tid in self.targets
        ]
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate attention coherence report."""
        attended = self.get_attended()
        total_duration = sum(t.duration for t in self.targets.values())
        
        return {
            "total_targets": len(self.targets),
            "attended_count": len(attended),
            "attention_type": self.attention_type.value,
            "spotlight_utilization": self.spotlight.utilization(),
            "total_attention_duration": total_duration,
            "filter_threshold": self.filter.threshold,
            "phi_coherence": self.spotlight.utilization() * PHI,
            "beat": self.beat_count,
            "timestamp": time.time()
        }


class AttentionController:
    """
    High-level controller for multiple attention mechanisms.
    """
    
    def __init__(self):
        self.mechanisms: Dict[str, AttentionMechanism] = {}
        self.active_mechanism: Optional[str] = None
        self.global_beat = 0
    
    def create_mechanism(self, name: str, capacity: float = 1.0) -> AttentionMechanism:
        """Create a new attention mechanism."""
        mechanism = AttentionMechanism(capacity)
        self.mechanisms[name] = mechanism
        if self.active_mechanism is None:
            self.active_mechanism = name
        return mechanism
    
    def get_mechanism(self, name: str) -> Optional[AttentionMechanism]:
        """Get an attention mechanism by name."""
        return self.mechanisms.get(name)
    
    def switch_mechanism(self, name: str) -> bool:
        """Switch the active attention mechanism."""
        if name in self.mechanisms:
            self.active_mechanism = name
            return True
        return False
    
    def global_tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one tick for all mechanisms."""
        self.global_beat += 1
        results = {}
        
        for name, mechanism in self.mechanisms.items():
            results[name] = mechanism.tick(elapsed)
        
        return {
            "global_beat": self.global_beat,
            "mechanisms": results,
            "active": self.active_mechanism
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_controller_instance: Optional[AttentionController] = None

def get_attention_controller() -> AttentionController:
    """Get or create the singleton AttentionController."""
    global _controller_instance
    if _controller_instance is None:
        _controller_instance = AttentionController()
    return _controller_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-303 Attention Mechanism Protocol (Python) ===")
    
    controller = get_attention_controller()
    mechanism = controller.create_mechanism("main")
    
    # Register targets
    mechanism.register_target("task_1", "Email", salience=0.7, priority=0.8)
    mechanism.register_target("task_2", "Meeting", salience=0.9, priority=0.9)
    mechanism.register_target("task_3", "Background music", salience=0.2, priority=0.1)
    mechanism.register_target("task_4", "Notification", salience=0.6, priority=0.5)
    
    # Allocate attention
    attended = mechanism.allocate_attention()
    print(f"Attended targets: {attended}")
    
    # Focus on specific target
    mechanism.focus_on("task_2")
    print(f"Focused on task_2: {mechanism.get_attended()}")
    
    # Run time steps
    for _ in range(20):
        mechanism.tick()
    
    print(f"Coherence report: {mechanism.coherence_report()}")
