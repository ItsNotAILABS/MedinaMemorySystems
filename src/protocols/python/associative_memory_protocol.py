"""
PROTO-307 — Associative Memory Protocol (Python)
Content-addressable associative memory with φ-coherent retrieval.

Charter: PROTO-307
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Tuple
from collections import defaultdict

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


@dataclass
class AssociativeEntry:
    """An entry in associative memory."""
    key: str
    value: Any
    pattern: List[float]
    associations: Dict[str, float] = field(default_factory=dict)
    access_count: int = 0
    last_access: float = field(default_factory=time.time)
    strength: float = 1.0
    
    def similarity(self, other_pattern: List[float]) -> float:
        """Compute similarity with another pattern."""
        if len(self.pattern) != len(other_pattern):
            min_len = min(len(self.pattern), len(other_pattern))
            p1 = self.pattern[:min_len]
            p2 = other_pattern[:min_len]
        else:
            p1, p2 = self.pattern, other_pattern
        
        dot = sum(a * b for a, b in zip(p1, p2))
        mag1 = math.sqrt(sum(a**2 for a in p1)) or 1
        mag2 = math.sqrt(sum(b**2 for b in p2)) or 1
        return dot / (mag1 * mag2)
    
    def access(self) -> None:
        """Record an access."""
        self.access_count += 1
        self.last_access = time.time()
        self.strength = min(1.0, self.strength + PHI_INV * 0.1)
    
    def decay(self, elapsed: float, rate: float = 0.01) -> None:
        """Apply decay to strength."""
        self.strength *= math.exp(-rate * elapsed * PHI_INV)


class HopfieldNetwork:
    """Simple Hopfield-style associative memory."""
    
    def __init__(self, size: int = 64):
        self.size = size
        self.weights: List[List[float]] = [
            [0.0] * size for _ in range(size)
        ]
        self.stored_patterns: List[List[int]] = []
    
    def store(self, pattern: List[int]) -> None:
        """Store a binary pattern."""
        if len(pattern) != self.size:
            return
        
        self.stored_patterns.append(pattern)
        
        # Hebbian learning
        for i in range(self.size):
            for j in range(self.size):
                if i != j:
                    self.weights[i][j] += pattern[i] * pattern[j] * PHI_INV
    
    def recall(self, partial: List[int], iterations: int = 10) -> List[int]:
        """Recall pattern from partial input."""
        state = list(partial)
        
        for _ in range(iterations):
            # Asynchronous update
            for i in range(self.size):
                activation = sum(
                    self.weights[i][j] * state[j]
                    for j in range(self.size)
                )
                state[i] = 1 if activation >= 0 else -1
        
        return state
    
    def energy(self, state: List[int]) -> float:
        """Compute energy of a state."""
        e = 0.0
        for i in range(self.size):
            for j in range(i+1, self.size):
                e -= self.weights[i][j] * state[i] * state[j]
        return e * PHI_INV


class AssociativeMemoryEngine:
    """
    Main associative memory engine with φ-coherent operations.
    """
    
    def __init__(self, pattern_size: int = 64, capacity: int = 10000):
        self.pattern_size = pattern_size
        self.capacity = capacity
        self.entries: Dict[str, AssociativeEntry] = {}
        self.hopfield = HopfieldNetwork(pattern_size)
        self.association_graph: Dict[str, Dict[str, float]] = defaultdict(dict)
        self.beat_count = 0
        self.retrieval_history: List[Dict[str, Any]] = []
    
    def store(self, key: str, value: Any, 
              pattern: Optional[List[float]] = None) -> AssociativeEntry:
        """Store a key-value pair with optional pattern."""
        if len(self.entries) >= self.capacity:
            self._evict_weakest()
        
        if pattern is None:
            pattern = [random.gauss(0, 1) for _ in range(self.pattern_size)]
        
        # Normalize pattern
        mag = math.sqrt(sum(p**2 for p in pattern)) or 1
        pattern = [p / mag for p in pattern[:self.pattern_size]]
        
        entry = AssociativeEntry(key=key, value=value, pattern=pattern)
        self.entries[key] = entry
        
        # Store binary version in Hopfield network
        binary = [1 if p >= 0 else -1 for p in pattern]
        self.hopfield.store(binary)
        
        return entry
    
    def retrieve_by_key(self, key: str) -> Optional[Any]:
        """Retrieve by exact key match."""
        entry = self.entries.get(key)
        if entry:
            entry.access()
            return entry.value
        return None
    
    def retrieve_by_pattern(self, pattern: List[float], 
                           threshold: float = 0.5) -> List[Tuple[str, float, Any]]:
        """Retrieve entries similar to pattern."""
        results = []
        
        for key, entry in self.entries.items():
            sim = entry.similarity(pattern)
            if sim >= threshold * PHI_INV:
                entry.access()
                results.append((key, sim, entry.value))
        
        results.sort(key=lambda x: x[1], reverse=True)
        
        self.retrieval_history.append({
            "type": "pattern",
            "matches": len(results),
            "best_sim": results[0][1] if results else 0,
            "timestamp": time.time()
        })
        
        return results
    
    def complete_pattern(self, partial: List[float]) -> List[float]:
        """Complete a partial pattern using Hopfield recall."""
        binary = [1 if p >= 0 else -1 for p in partial[:self.pattern_size]]
        if len(binary) < self.pattern_size:
            binary += [random.choice([-1, 1]) for _ in range(self.pattern_size - len(binary))]
        
        recalled = self.hopfield.recall(binary)
        return [float(r) for r in recalled]
    
    def associate(self, key1: str, key2: str, strength: float = 1.0) -> None:
        """Create association between two entries."""
        if key1 in self.entries and key2 in self.entries:
            self.association_graph[key1][key2] = strength * PHI_INV
            self.association_graph[key2][key1] = strength * PHI_INV
            
            self.entries[key1].associations[key2] = strength
            self.entries[key2].associations[key1] = strength
    
    def spread_activation(self, start_key: str, depth: int = 3,
                         decay: float = PHI_INV) -> Dict[str, float]:
        """Spread activation from a starting entry."""
        if start_key not in self.entries:
            return {}
        
        activations = {start_key: 1.0}
        frontier = {start_key}
        
        for _ in range(depth):
            next_frontier = set()
            for key in frontier:
                current_act = activations[key]
                for neighbor, strength in self.association_graph[key].items():
                    propagated = current_act * strength * decay
                    if neighbor in activations:
                        activations[neighbor] = max(activations[neighbor], propagated)
                    else:
                        activations[neighbor] = propagated
                    next_frontier.add(neighbor)
            frontier = next_frontier
        
        return activations
    
    def find_associated(self, key: str, k: int = 5) -> List[Tuple[str, float]]:
        """Find entries associated with a key."""
        activations = self.spread_activation(key)
        sorted_acts = sorted(activations.items(), key=lambda x: x[1], reverse=True)
        return [(k, v) for k, v in sorted_acts if k != key][:k]
    
    def _evict_weakest(self) -> None:
        """Evict weakest entries when at capacity."""
        sorted_entries = sorted(
            self.entries.items(),
            key=lambda x: x[1].strength * x[1].access_count
        )
        
        to_remove = int(len(sorted_entries) * PHI_INV * 0.1)
        for key, _ in sorted_entries[:to_remove]:
            del self.entries[key]
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        # Decay all entries
        for entry in self.entries.values():
            entry.decay(elapsed)
        
        return {
            "beat": self.beat_count,
            "entry_count": len(self.entries),
            "association_count": sum(len(v) for v in self.association_graph.values()) // 2,
            "hopfield_patterns": len(self.hopfield.stored_patterns),
            "phi_coherence": sum(e.strength for e in self.entries.values()) / 
                           max(1, len(self.entries)) * PHI,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate memory coherence report."""
        avg_strength = sum(e.strength for e in self.entries.values()) / max(1, len(self.entries))
        
        return {
            "total_entries": len(self.entries),
            "total_associations": sum(len(v) for v in self.association_graph.values()) // 2,
            "hopfield_patterns": len(self.hopfield.stored_patterns),
            "avg_strength": avg_strength,
            "retrieval_count": len(self.retrieval_history),
            "phi_metric": avg_strength * PHI,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[AssociativeMemoryEngine] = None

def get_associative_memory_engine() -> AssociativeMemoryEngine:
    """Get or create the singleton AssociativeMemoryEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = AssociativeMemoryEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-307 Associative Memory Protocol (Python) ===")
    
    engine = get_associative_memory_engine()
    
    # Store entries
    engine.store("apple", {"type": "fruit", "color": "red"})
    engine.store("banana", {"type": "fruit", "color": "yellow"})
    engine.store("carrot", {"type": "vegetable", "color": "orange"})
    
    # Create associations
    engine.associate("apple", "banana", 0.8)  # Both fruits
    engine.associate("apple", "carrot", 0.3)  # Different categories
    
    # Retrieve
    result = engine.retrieve_by_key("apple")
    print(f"Retrieved: {result}")
    
    # Find associated
    associated = engine.find_associated("apple")
    print(f"Associated with apple: {associated}")
    
    print(f"Report: {engine.coherence_report()}")
