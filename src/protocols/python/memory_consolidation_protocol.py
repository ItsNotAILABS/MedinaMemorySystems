"""
PROTO-302 — Memory Consolidation Protocol (Python)
Manages memory transfer from working to long-term storage.

Charter: PROTO-302
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from enum import Enum
import heapq

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


class MemoryType(Enum):
    WORKING = "working"
    SHORT_TERM = "short_term"
    LONG_TERM = "long_term"
    SEMANTIC = "semantic"
    EPISODIC = "episodic"
    PROCEDURAL = "procedural"


@dataclass
class MemoryTrace:
    """A single memory trace with consolidation metadata."""
    id: str
    content: Any
    memory_type: MemoryType
    strength: float = 1.0
    importance: float = 0.5
    emotional_valence: float = 0.0
    rehearsal_count: int = 0
    created_at: float = field(default_factory=time.time)
    last_accessed: float = field(default_factory=time.time)
    consolidated: bool = False
    associations: List[str] = field(default_factory=list)
    
    def consolidation_priority(self) -> float:
        """Calculate priority for consolidation based on φ-weighted factors."""
        age = time.time() - self.created_at
        recency = math.exp(-age * PHI_INV * 0.0001)
        rehearsal_factor = 1 + math.log1p(self.rehearsal_count) * PHI_INV
        emotional_boost = 1 + abs(self.emotional_valence) * PHI_INV
        
        return (
            self.strength * recency * 
            self.importance * rehearsal_factor * 
            emotional_boost * PHI
        )
    
    def decay(self, elapsed: float) -> None:
        """Apply forgetting curve with φ-scaled rate."""
        decay_rate = PHI_INV * 0.001 if self.consolidated else PHI_INV * 0.01
        self.strength *= math.exp(-decay_rate * elapsed)
    
    def rehearse(self) -> None:
        """Strengthen memory through rehearsal."""
        self.rehearsal_count += 1
        self.strength = min(1.0, self.strength + PHI_INV * 0.1)
        self.last_accessed = time.time()


class ConsolidationBuffer:
    """Buffer for memories awaiting consolidation."""
    
    def __init__(self, capacity: int = 100):
        self.capacity = capacity
        self.buffer: List[MemoryTrace] = []
        self.overflow_count = 0
    
    def add(self, trace: MemoryTrace) -> bool:
        """Add a memory trace to the buffer."""
        if len(self.buffer) >= self.capacity:
            self._evict_lowest()
            self.overflow_count += 1
        
        self.buffer.append(trace)
        return True
    
    def _evict_lowest(self) -> Optional[MemoryTrace]:
        """Remove the lowest priority trace."""
        if not self.buffer:
            return None
        
        lowest_idx = min(
            range(len(self.buffer)),
            key=lambda i: self.buffer[i].consolidation_priority()
        )
        return self.buffer.pop(lowest_idx)
    
    def get_ready_for_consolidation(self, threshold: float = 0.5) -> List[MemoryTrace]:
        """Get traces ready for consolidation."""
        ready = [t for t in self.buffer if t.consolidation_priority() >= threshold]
        self.buffer = [t for t in self.buffer if t not in ready]
        return ready
    
    def peek_top(self, k: int = 5) -> List[MemoryTrace]:
        """Peek at top-k traces by priority."""
        sorted_traces = sorted(
            self.buffer, 
            key=lambda t: t.consolidation_priority(),
            reverse=True
        )
        return sorted_traces[:k]


class LongTermStore:
    """Long-term memory storage with retrieval capabilities."""
    
    def __init__(self, max_capacity: int = 100000):
        self.max_capacity = max_capacity
        self.memories: Dict[str, MemoryTrace] = {}
        self.index_by_type: Dict[MemoryType, List[str]] = {t: [] for t in MemoryType}
        self.access_pattern: List[str] = []
    
    def store(self, trace: MemoryTrace) -> bool:
        """Store a consolidated memory trace."""
        if len(self.memories) >= self.max_capacity:
            self._compact()
        
        trace.consolidated = True
        trace.memory_type = self._determine_long_term_type(trace)
        self.memories[trace.id] = trace
        self.index_by_type[trace.memory_type].append(trace.id)
        return True
    
    def _determine_long_term_type(self, trace: MemoryTrace) -> MemoryType:
        """Determine appropriate long-term memory type."""
        if trace.emotional_valence != 0:
            return MemoryType.EPISODIC
        if trace.rehearsal_count > 5:
            return MemoryType.PROCEDURAL
        return MemoryType.SEMANTIC
    
    def retrieve(self, trace_id: str) -> Optional[MemoryTrace]:
        """Retrieve a memory trace by ID."""
        trace = self.memories.get(trace_id)
        if trace:
            trace.rehearse()
            self.access_pattern.append(trace_id)
            if len(self.access_pattern) > 1000:
                self.access_pattern = self.access_pattern[-1000:]
        return trace
    
    def search(self, query: str, limit: int = 10) -> List[MemoryTrace]:
        """Simple search by content matching."""
        results = []
        for trace in self.memories.values():
            content_str = str(trace.content).lower()
            if query.lower() in content_str:
                results.append(trace)
        
        results.sort(key=lambda t: t.consolidation_priority(), reverse=True)
        return results[:limit]
    
    def get_by_type(self, memory_type: MemoryType, limit: int = 100) -> List[MemoryTrace]:
        """Get memories by type."""
        ids = self.index_by_type.get(memory_type, [])[:limit]
        return [self.memories[id] for id in ids if id in self.memories]
    
    def _compact(self) -> int:
        """Remove weak memories to make room."""
        threshold = int(self.max_capacity * PHI_INV)
        
        sorted_memories = sorted(
            self.memories.values(),
            key=lambda t: t.strength
        )
        
        to_remove = len(self.memories) - threshold
        removed = 0
        
        for trace in sorted_memories[:to_remove]:
            del self.memories[trace.id]
            if trace.id in self.index_by_type[trace.memory_type]:
                self.index_by_type[trace.memory_type].remove(trace.id)
            removed += 1
        
        return removed


class MemoryConsolidationEngine:
    """
    Engine for managing memory consolidation with φ-harmonic timing.
    """
    
    def __init__(self):
        self.working_buffer = ConsolidationBuffer(capacity=50)
        self.short_term_buffer = ConsolidationBuffer(capacity=200)
        self.long_term_store = LongTermStore()
        self.consolidation_count = 0
        self.beat_count = 0
        self.history: List[Dict[str, Any]] = []
    
    def encode(self, content: Any, importance: float = 0.5,
               emotional_valence: float = 0.0) -> MemoryTrace:
        """Encode new information into working memory."""
        trace = MemoryTrace(
            id=f"mem-{int(time.time()*1000)}-{random.randint(0,9999)}",
            content=content,
            memory_type=MemoryType.WORKING,
            importance=importance,
            emotional_valence=emotional_valence
        )
        self.working_buffer.add(trace)
        return trace
    
    def consolidate_working_to_short_term(self) -> int:
        """Move memories from working to short-term buffer."""
        ready = self.working_buffer.get_ready_for_consolidation(threshold=0.3)
        for trace in ready:
            trace.memory_type = MemoryType.SHORT_TERM
            self.short_term_buffer.add(trace)
        return len(ready)
    
    def consolidate_short_term_to_long_term(self) -> int:
        """Move memories from short-term to long-term store."""
        ready = self.short_term_buffer.get_ready_for_consolidation(threshold=0.6)
        for trace in ready:
            self.long_term_store.store(trace)
            self.consolidation_count += 1
        return len(ready)
    
    def sleep_consolidation(self, cycles: int = 5) -> Dict[str, Any]:
        """Simulate sleep consolidation with multiple cycles."""
        results = {
            "cycles": cycles,
            "working_to_short": 0,
            "short_to_long": 0,
            "memories_strengthened": 0
        }
        
        for _ in range(cycles):
            # Transfer memories
            results["working_to_short"] += self.consolidate_working_to_short_term()
            results["short_to_long"] += self.consolidate_short_term_to_long_term()
            
            # Strengthen existing long-term memories
            for trace in list(self.long_term_store.memories.values())[:100]:
                if random.random() < PHI_INV:
                    trace.rehearse()
                    results["memories_strengthened"] += 1
        
        return results
    
    def retrieve(self, query: str, limit: int = 10) -> List[MemoryTrace]:
        """Retrieve memories matching a query."""
        return self.long_term_store.search(query, limit)
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        # Apply decay to all buffers
        for trace in self.working_buffer.buffer:
            trace.decay(elapsed)
        for trace in self.short_term_buffer.buffer:
            trace.decay(elapsed)
        for trace in self.long_term_store.memories.values():
            trace.decay(elapsed)
        
        # Automatic consolidation check
        if self.beat_count % int(PHI * 10) == 0:
            self.consolidate_working_to_short_term()
        if self.beat_count % int(PHI * 50) == 0:
            self.consolidate_short_term_to_long_term()
        
        report = {
            "beat": self.beat_count,
            "working_count": len(self.working_buffer.buffer),
            "short_term_count": len(self.short_term_buffer.buffer),
            "long_term_count": len(self.long_term_store.memories),
            "total_consolidated": self.consolidation_count,
            "phi_coherence": self.consolidation_count * PHI_INV,
            "timestamp": time.time()
        }
        
        self.history.append(report)
        return report
    
    def status(self) -> Dict[str, Any]:
        """Get current status of the consolidation engine."""
        return {
            "working_buffer": len(self.working_buffer.buffer),
            "short_term_buffer": len(self.short_term_buffer.buffer),
            "long_term_store": len(self.long_term_store.memories),
            "consolidation_count": self.consolidation_count,
            "beat_count": self.beat_count,
            "overflow_events": self.working_buffer.overflow_count + 
                              self.short_term_buffer.overflow_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[MemoryConsolidationEngine] = None

def get_memory_consolidation_engine() -> MemoryConsolidationEngine:
    """Get or create the singleton MemoryConsolidationEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = MemoryConsolidationEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-302 Memory Consolidation Protocol (Python) ===")
    
    engine = get_memory_consolidation_engine()
    
    # Encode some memories
    engine.encode("First meeting with Alice", importance=0.8, emotional_valence=0.6)
    engine.encode("Password: secret123", importance=0.9)
    engine.encode("Coffee is best hot", importance=0.3)
    engine.encode("Birthday party celebration", importance=0.7, emotional_valence=0.9)
    
    print(f"Initial status: {engine.status()}")
    
    # Run consolidation cycles
    sleep_result = engine.sleep_consolidation(cycles=3)
    print(f"Sleep consolidation: {sleep_result}")
    
    # Run time steps
    for _ in range(100):
        engine.tick()
    
    print(f"Final status: {engine.status()}")
