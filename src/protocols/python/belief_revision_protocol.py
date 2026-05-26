"""
PROTO-322 — Belief Revision Protocol (Python)
AGM-style belief revision for MEDINA Memory Systems.

Charter: PROTO-322
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, FrozenSet, Callable
from collections import defaultdict
from enum import Enum
import heapq

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class RevisionType(Enum):
    """Types of belief revision operations."""
    EXPANSION = "expansion"      # Add new belief
    CONTRACTION = "contraction"  # Remove belief
    REVISION = "revision"        # Add potentially conflicting belief
    UPDATE = "update"           # Change due to world change
    CONSOLIDATION = "consolidation"


@dataclass(frozen=True)
class Belief:
    """An immutable belief with confidence and source."""
    proposition: str
    confidence: float = 0.8
    source: str = "inference"
    timestamp: float = field(default_factory=time.time)
    
    def __hash__(self):
        return hash((self.proposition, self.source))
    
    def __eq__(self, other):
        if not isinstance(other, Belief):
            return False
        return self.proposition == other.proposition


@dataclass
class BeliefSet:
    """A set of beliefs with entrenchment ordering."""
    beliefs: Set[Belief] = field(default_factory=set)
    entrenchment: Dict[str, float] = field(default_factory=dict)
    
    def add(self, belief: Belief) -> None:
        """Add a belief to the set."""
        self.beliefs.add(belief)
        self.entrenchment[belief.proposition] = belief.confidence * PHI_INV
    
    def remove(self, proposition: str) -> bool:
        """Remove a belief by proposition."""
        to_remove = [b for b in self.beliefs if b.proposition == proposition]
        for b in to_remove:
            self.beliefs.discard(b)
        if proposition in self.entrenchment:
            del self.entrenchment[proposition]
        return len(to_remove) > 0
    
    def contains(self, proposition: str) -> bool:
        """Check if proposition is believed."""
        return any(b.proposition == proposition for b in self.beliefs)
    
    def get_entrenchment(self, proposition: str) -> float:
        """Get entrenchment degree of a proposition."""
        return self.entrenchment.get(proposition, 0.0)
    
    def least_entrenched(self) -> Optional[Belief]:
        """Find least entrenched belief."""
        if not self.beliefs:
            return None
        return min(self.beliefs, key=lambda b: self.entrenchment.get(b.proposition, 0))


class BeliefRevisionEngine:
    """
    AGM-style belief revision with φ-coherent dynamics.
    """
    
    def __init__(self):
        self.belief_set = BeliefSet()
        self.history: List[Dict[str, Any]] = []
        self.constraints: Dict[str, Set[str]] = defaultdict(set)  # Mutual exclusions
        self.dependencies: Dict[str, Set[str]] = defaultdict(set)
        self.revision_count = 0
    
    def add_constraint(self, prop1: str, prop2: str) -> None:
        """Add mutual exclusion constraint."""
        self.constraints[prop1].add(prop2)
        self.constraints[prop2].add(prop1)
    
    def add_dependency(self, dependent: str, base: str) -> None:
        """Add dependency: dependent requires base."""
        self.dependencies[dependent].add(base)
    
    def expand(self, belief: Belief) -> bool:
        """
        AGM Expansion: Add belief when consistent.
        K + α = Cn(K ∪ {α})
        """
        # Check for conflicts
        conflicts = self._find_conflicts(belief.proposition)
        if conflicts:
            return False
        
        # Check dependencies satisfied
        for dep in self.dependencies.get(belief.proposition, set()):
            if not self.belief_set.contains(dep):
                return False
        
        self.belief_set.add(belief)
        self._record_operation(RevisionType.EXPANSION, belief.proposition)
        return True
    
    def contract(self, proposition: str) -> Set[str]:
        """
        AGM Contraction: Remove belief and dependents.
        K ÷ α removes α and beliefs depending on α.
        """
        removed = set()
        
        # Find all beliefs that depend on this one
        to_remove = {proposition}
        changed = True
        while changed:
            changed = False
            for dep, bases in self.dependencies.items():
                if proposition in bases and dep not in to_remove:
                    if self.belief_set.contains(dep):
                        to_remove.add(dep)
                        changed = True
        
        # Remove in order of entrenchment (least first)
        for prop in sorted(to_remove, key=lambda p: self.belief_set.get_entrenchment(p)):
            if self.belief_set.remove(prop):
                removed.add(prop)
        
        self._record_operation(RevisionType.CONTRACTION, proposition, removed)
        return removed
    
    def revise(self, belief: Belief) -> Dict[str, Any]:
        """
        AGM Revision: Add potentially conflicting belief.
        K * α = (K ÷ ¬α) + α (Levi identity)
        """
        result = {
            "added": belief.proposition,
            "removed": set(),
            "success": False
        }
        
        # Find and resolve conflicts
        conflicts = self._find_conflicts(belief.proposition)
        
        for conflict in conflicts:
            conflict_entrenchment = self.belief_set.get_entrenchment(conflict)
            new_entrenchment = belief.confidence * PHI_INV
            
            # Only revise if new belief is more entrenched
            if new_entrenchment >= conflict_entrenchment * PHI_INV:
                removed = self.contract(conflict)
                result["removed"].update(removed)
        
        # Try to add after resolving conflicts
        if self.expand(belief):
            result["success"] = True
            # Boost entrenchment for successful revision
            self.belief_set.entrenchment[belief.proposition] *= PHI
        
        self._record_operation(RevisionType.REVISION, belief.proposition, result)
        return result
    
    def update(self, old_prop: str, new_belief: Belief) -> Dict[str, Any]:
        """
        Update: Replace old belief with new one.
        Used when the world changes, not just our knowledge.
        """
        result = {
            "old": old_prop,
            "new": new_belief.proposition,
            "removed": set(),
            "success": False
        }
        
        if self.belief_set.contains(old_prop):
            result["removed"] = self.contract(old_prop)
        
        if self.expand(new_belief):
            result["success"] = True
        
        self._record_operation(RevisionType.UPDATE, new_belief.proposition, result)
        return result
    
    def consolidate(self) -> Dict[str, Any]:
        """
        Consolidate: Remove inconsistencies and weak beliefs.
        """
        result = {
            "removed": set(),
            "strengthened": set()
        }
        
        # Find inconsistencies
        for b1 in list(self.belief_set.beliefs):
            for b2 in list(self.belief_set.beliefs):
                if b1 != b2 and b2.proposition in self.constraints.get(b1.proposition, set()):
                    # Keep more entrenched
                    if self.belief_set.get_entrenchment(b1.proposition) < \
                       self.belief_set.get_entrenchment(b2.proposition):
                        if self.belief_set.remove(b1.proposition):
                            result["removed"].add(b1.proposition)
        
        # Strengthen surviving beliefs
        for belief in self.belief_set.beliefs:
            old_ent = self.belief_set.entrenchment.get(belief.proposition, 0)
            self.belief_set.entrenchment[belief.proposition] = min(1.0, old_ent * PHI)
            result["strengthened"].add(belief.proposition)
        
        self._record_operation(RevisionType.CONSOLIDATION, None, result)
        return result
    
    def _find_conflicts(self, proposition: str) -> Set[str]:
        """Find beliefs conflicting with proposition."""
        conflicts = set()
        for existing in self.belief_set.beliefs:
            if existing.proposition in self.constraints.get(proposition, set()):
                conflicts.add(existing.proposition)
        return conflicts
    
    def _record_operation(self, op_type: RevisionType, proposition: Optional[str],
                          details: Any = None) -> None:
        """Record operation in history."""
        self.history.append({
            "type": op_type.value,
            "proposition": proposition,
            "details": details,
            "timestamp": time.time(),
            "revision_number": self.revision_count
        })
        self.revision_count += 1
    
    def query(self, proposition: str) -> Dict[str, Any]:
        """Query belief status."""
        belief = next((b for b in self.belief_set.beliefs 
                      if b.proposition == proposition), None)
        return {
            "believed": belief is not None,
            "confidence": belief.confidence if belief else 0.0,
            "entrenchment": self.belief_set.get_entrenchment(proposition),
            "source": belief.source if belief else None
        }
    
    def get_beliefs_by_confidence(self, min_confidence: float = 0.5) -> List[Belief]:
        """Get beliefs above confidence threshold."""
        return sorted(
            [b for b in self.belief_set.beliefs if b.confidence >= min_confidence],
            key=lambda b: b.confidence,
            reverse=True
        )
    
    def get_stats(self) -> Dict[str, Any]:
        """Get engine statistics."""
        beliefs = list(self.belief_set.beliefs)
        entrenchments = list(self.belief_set.entrenchment.values())
        
        return {
            "total_beliefs": len(beliefs),
            "total_constraints": sum(len(v) for v in self.constraints.values()) // 2,
            "total_dependencies": sum(len(v) for v in self.dependencies.values()),
            "revision_count": self.revision_count,
            "mean_confidence": sum(b.confidence for b in beliefs) / len(beliefs) if beliefs else 0,
            "mean_entrenchment": sum(entrenchments) / len(entrenchments) if entrenchments else 0,
            "phi_coherence": len(beliefs) / (PHI * len(self.constraints) + 1)
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_revision_engine: Optional[BeliefRevisionEngine] = None

def get_belief_revision_engine() -> BeliefRevisionEngine:
    """Get or create the global belief revision engine."""
    global _revision_engine
    if _revision_engine is None:
        _revision_engine = BeliefRevisionEngine()
    return _revision_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "RevisionType", "Belief", "BeliefSet",
    "BeliefRevisionEngine", "get_belief_revision_engine"
]
