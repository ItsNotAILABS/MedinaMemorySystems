"""
PROTO-323 — Attention Routing Protocol (Python)
Dynamic attention allocation and routing for MEDINA Memory Systems.

Charter: PROTO-323
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import heapq
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable
from collections import defaultdict
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI
SQRT3 = math.sqrt(3)


class AttentionType(Enum):
    """Types of attention mechanisms."""
    SELECTIVE = "selective"
    DIVIDED = "divided"
    SUSTAINED = "sustained"
    EXECUTIVE = "executive"
    SPATIAL = "spatial"
    FEATURE_BASED = "feature_based"


class Priority(Enum):
    """Priority levels for attention."""
    CRITICAL = 5
    HIGH = 4
    MEDIUM = 3
    LOW = 2
    BACKGROUND = 1


@dataclass
class AttentionTarget:
    """A target requiring attention."""
    id: str
    name: str
    salience: float = 0.5
    priority: Priority = Priority.MEDIUM
    attention_type: AttentionType = AttentionType.SELECTIVE
    decay_rate: float = field(default_factory=lambda: PHI_INV * 0.1)
    last_attended: float = field(default_factory=time.time)
    attention_duration: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def compute_urgency(self) -> float:
        """Compute urgency based on salience, priority, and time."""
        time_factor = time.time() - self.last_attended
        urgency = self.salience * self.priority.value * PHI
        urgency *= (1 + time_factor * self.decay_rate)
        return urgency
    
    def attend(self, duration: float) -> None:
        """Record attention event."""
        self.last_attended = time.time()
        self.attention_duration += duration
        self.salience *= PHI_INV  # Reduce salience after attention


@dataclass
class AttentionSlot:
    """A slot in the attention buffer."""
    target: Optional[AttentionTarget] = None
    capacity: float = 1.0
    utilization: float = 0.0
    slot_type: AttentionType = AttentionType.SELECTIVE
    
    def assign(self, target: AttentionTarget) -> bool:
        """Assign a target to this slot."""
        if self.target is not None:
            return False
        self.target = target
        self.utilization = min(1.0, target.salience * PHI)
        return True
    
    def release(self) -> Optional[AttentionTarget]:
        """Release the current target."""
        target = self.target
        self.target = None
        self.utilization = 0.0
        return target


class AttentionRoutingEngine:
    """
    Dynamic attention routing with φ-coherent allocation.
    """
    
    def __init__(self, num_slots: int = 7):  # Miller's 7±2
        self.slots: List[AttentionSlot] = [
            AttentionSlot(slot_type=AttentionType.SELECTIVE)
            for _ in range(num_slots)
        ]
        self.queue: List[Tuple[float, str, AttentionTarget]] = []
        self.targets: Dict[str, AttentionTarget] = {}
        self.attention_history: List[Dict[str, Any]] = []
        self.total_attention_budget = 1.0
        self.current_focus: Optional[str] = None
        self.beat_count = 0
    
    def register_target(self, target: AttentionTarget) -> None:
        """Register a new attention target."""
        self.targets[target.id] = target
        urgency = -target.compute_urgency()  # Negative for max-heap behavior
        heapq.heappush(self.queue, (urgency, target.id, target))
    
    def allocate_attention(self) -> List[AttentionTarget]:
        """Allocate attention to highest priority targets."""
        allocated = []
        
        # Refresh queue with updated urgencies
        self._refresh_queue()
        
        # Fill available slots
        for slot in self.slots:
            if slot.target is None and self.queue:
                _, target_id, target = heapq.heappop(self.queue)
                if target_id in self.targets:
                    slot.assign(target)
                    allocated.append(target)
                    self._record_attention(target, "allocated")
        
        self.beat_count += 1
        return allocated
    
    def shift_focus(self, target_id: str) -> bool:
        """Shift primary focus to specific target."""
        if target_id not in self.targets:
            return False
        
        target = self.targets[target_id]
        
        # Find slot with lowest priority target
        min_slot = min(
            (s for s in self.slots if s.target is not None),
            key=lambda s: s.target.priority.value if s.target else float('inf'),
            default=None
        )
        
        # Or find empty slot
        empty_slot = next((s for s in self.slots if s.target is None), None)
        
        slot = empty_slot or min_slot
        if slot:
            if slot.target:
                old_target = slot.release()
                if old_target:
                    self.register_target(old_target)
            slot.assign(target)
            self.current_focus = target_id
            self._record_attention(target, "focused")
            return True
        
        return False
    
    def release_target(self, target_id: str) -> bool:
        """Release a target from attention."""
        for slot in self.slots:
            if slot.target and slot.target.id == target_id:
                released = slot.release()
                if released:
                    self._record_attention(released, "released")
                    return True
        return False
    
    def get_attended_targets(self) -> List[AttentionTarget]:
        """Get currently attended targets."""
        return [s.target for s in self.slots if s.target is not None]
    
    def compute_attention_distribution(self) -> Dict[str, float]:
        """Compute attention distribution across targets."""
        attended = self.get_attended_targets()
        if not attended:
            return {}
        
        total_salience = sum(t.salience for t in attended)
        if total_salience == 0:
            return {t.id: 1.0 / len(attended) for t in attended}
        
        return {
            t.id: (t.salience / total_salience) * self.total_attention_budget
            for t in attended
        }
    
    def apply_inhibition_of_return(self, target_id: str, duration: float = 1.0) -> None:
        """Temporarily inhibit attention to recently attended target."""
        if target_id in self.targets:
            target = self.targets[target_id]
            target.salience *= math.exp(-duration * PHI_INV)
    
    def feature_based_selection(self, feature: str, value: Any) -> List[AttentionTarget]:
        """Select targets based on feature match."""
        matches = []
        for target in self.targets.values():
            if target.metadata.get(feature) == value:
                target.salience *= PHI  # Boost matching targets
                matches.append(target)
        return matches
    
    def spatial_attention(self, x: float, y: float, radius: float) -> List[AttentionTarget]:
        """Select targets within spatial region."""
        selected = []
        for target in self.targets.values():
            tx = target.metadata.get("x", 0)
            ty = target.metadata.get("y", 0)
            distance = math.sqrt((x - tx) ** 2 + (y - ty) ** 2)
            if distance <= radius:
                attention_boost = math.exp(-distance / radius * PHI_INV)
                target.salience = min(1.0, target.salience * (1 + attention_boost))
                selected.append(target)
        return selected
    
    def divided_attention(self, target_ids: List[str]) -> Dict[str, float]:
        """Divide attention among multiple targets."""
        targets = [self.targets[tid] for tid in target_ids if tid in self.targets]
        if not targets:
            return {}
        
        # Φ-weighted division
        total_weight = sum(t.salience * t.priority.value for t in targets)
        if total_weight == 0:
            return {t.id: self.total_attention_budget / len(targets) for t in targets}
        
        allocation = {}
        for target in targets:
            weight = target.salience * target.priority.value
            allocation[target.id] = (weight / total_weight) * self.total_attention_budget * PHI_INV
        
        return allocation
    
    def sustained_attention_decay(self, dt: float) -> None:
        """Apply decay to sustained attention."""
        for slot in self.slots:
            if slot.target:
                slot.target.attention_duration += dt
                # Attention fatigue
                fatigue = 1 - math.exp(-slot.target.attention_duration * PHI_INV * 0.1)
                slot.utilization *= (1 - fatigue * PHI_INV)
    
    def _refresh_queue(self) -> None:
        """Refresh priority queue with updated urgencies."""
        new_queue = []
        attended_ids = {s.target.id for s in self.slots if s.target}
        
        for target in self.targets.values():
            if target.id not in attended_ids:
                urgency = -target.compute_urgency()
                heapq.heappush(new_queue, (urgency, target.id, target))
        
        self.queue = new_queue
    
    def _record_attention(self, target: AttentionTarget, action: str) -> None:
        """Record attention event."""
        self.attention_history.append({
            "target_id": target.id,
            "action": action,
            "salience": target.salience,
            "priority": target.priority.value,
            "timestamp": time.time(),
            "beat": self.beat_count
        })
        if len(self.attention_history) > 10000:
            self.attention_history = self.attention_history[-5000:]
    
    def get_stats(self) -> Dict[str, Any]:
        """Get attention routing statistics."""
        attended = self.get_attended_targets()
        distribution = self.compute_attention_distribution()
        
        return {
            "total_slots": len(self.slots),
            "used_slots": len(attended),
            "utilization": len(attended) / len(self.slots),
            "total_targets": len(self.targets),
            "queue_length": len(self.queue),
            "mean_salience": sum(t.salience for t in attended) / len(attended) if attended else 0,
            "current_focus": self.current_focus,
            "beat_count": self.beat_count,
            "phi_coherence": sum(distribution.values()) * PHI_INV if distribution else 0
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_attention_engine: Optional[AttentionRoutingEngine] = None

def get_attention_routing_engine() -> AttentionRoutingEngine:
    """Get or create the global attention routing engine."""
    global _attention_engine
    if _attention_engine is None:
        _attention_engine = AttentionRoutingEngine()
    return _attention_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "AttentionType", "Priority", "AttentionTarget", "AttentionSlot",
    "AttentionRoutingEngine", "get_attention_routing_engine"
]
