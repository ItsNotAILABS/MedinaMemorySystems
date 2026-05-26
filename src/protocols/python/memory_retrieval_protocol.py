"""
PROTO-335 — Memory Retrieval Protocol (Python)
Content-addressable memory retrieval for MEDINA Memory Systems.

Charter: PROTO-335
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import random
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple
from collections import defaultdict
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class RetrievalMode(Enum):
    """Modes of memory retrieval."""
    EXACT = "exact"
    SIMILARITY = "similarity"
    SPREADING = "spreading"
    CONTEXTUAL = "contextual"
    TEMPORAL = "temporal"


@dataclass
class MemoryItem:
    """An item stored in memory."""
    id: str
    content: Any
    encoding: List[float] = field(default_factory=list)
    context: Dict[str, Any] = field(default_factory=dict)
    activation: float = 1.0
    base_level: float = 0.0
    access_count: int = 0
    created_at: float = field(default_factory=time.time)
    last_accessed: float = field(default_factory=time.time)
    links: Set[str] = field(default_factory=set)
    
    def compute_activation(self, current_time: float = None) -> float:
        """Compute current activation using ACT-R style equation."""
        now = current_time or time.time()
        # Base-level learning equation
        time_decay = 0.5  # Decay parameter
        if self.access_count == 0:
            return self.base_level
        
        # Sum of powered time differences
        total = 0.0
        # Simplified: use time since last access
        time_diff = max(0.001, now - self.last_accessed)
        total = self.access_count * (time_diff ** (-time_decay))
        
        self.activation = self.base_level + math.log(total + 1) * PHI_INV
        return self.activation
    
    def access(self) -> None:
        """Record memory access."""
        self.access_count += 1
        self.last_accessed = time.time()
        self.compute_activation()


@dataclass
class RetrievalCue:
    """A cue for memory retrieval."""
    content: Any = None
    encoding: List[float] = field(default_factory=list)
    context: Dict[str, Any] = field(default_factory=dict)
    mode: RetrievalMode = RetrievalMode.SIMILARITY
    threshold: float = 0.3
    max_results: int = 10


@dataclass
class RetrievalResult:
    """Result of memory retrieval."""
    item: MemoryItem
    score: float
    match_type: str
    timestamp: float = field(default_factory=time.time)


class MemoryRetrievalEngine:
    """
    Content-addressable memory retrieval with φ-coherent activation dynamics.
    """
    
    def __init__(self, encoding_dim: int = 64):
        self.memories: Dict[str, MemoryItem] = {}
        self.encoding_dim = encoding_dim
        self.context: Dict[str, Any] = {}
        self.retrieval_history: List[RetrievalResult] = []
        self.association_matrix: Dict[Tuple[str, str], float] = {}
        self.spreading_factor = PHI_INV
        self.noise_factor = 0.1 * PHI_INV
        self.beat_count = 0
    
    def store(self, id: str, content: Any, encoding: List[float] = None,
              context: Dict[str, Any] = None) -> MemoryItem:
        """Store an item in memory."""
        if encoding is None:
            encoding = self._generate_encoding(content)
        
        item = MemoryItem(
            id=id,
            content=content,
            encoding=encoding,
            context=context or {}
        )
        self.memories[id] = item
        return item
    
    def _generate_encoding(self, content: Any) -> List[float]:
        """Generate encoding vector from content."""
        # Simple hash-based encoding
        hash_val = hash(str(content))
        random.seed(hash_val)
        return [random.gauss(0, 1) for _ in range(self.encoding_dim)]
    
    def retrieve(self, cue: RetrievalCue) -> List[RetrievalResult]:
        """Retrieve memories matching cue."""
        results = []
        
        if cue.mode == RetrievalMode.EXACT:
            results = self._exact_match(cue)
        elif cue.mode == RetrievalMode.SIMILARITY:
            results = self._similarity_match(cue)
        elif cue.mode == RetrievalMode.SPREADING:
            results = self._spreading_activation(cue)
        elif cue.mode == RetrievalMode.CONTEXTUAL:
            results = self._contextual_match(cue)
        elif cue.mode == RetrievalMode.TEMPORAL:
            results = self._temporal_match(cue)
        
        # Filter by threshold and limit
        results = [r for r in results if r.score >= cue.threshold]
        results.sort(key=lambda r: r.score, reverse=True)
        results = results[:cue.max_results]
        
        # Record access for retrieved items
        for result in results:
            result.item.access()
            self.retrieval_history.append(result)
        
        self.beat_count += 1
        return results
    
    def _exact_match(self, cue: RetrievalCue) -> List[RetrievalResult]:
        """Find exact content matches."""
        results = []
        for item in self.memories.values():
            if item.content == cue.content:
                results.append(RetrievalResult(
                    item=item,
                    score=1.0,
                    match_type="exact"
                ))
        return results
    
    def _similarity_match(self, cue: RetrievalCue) -> List[RetrievalResult]:
        """Find similar items using encoding similarity."""
        results = []
        cue_encoding = cue.encoding or self._generate_encoding(cue.content)
        
        for item in self.memories.values():
            if not item.encoding:
                continue
            
            # Cosine similarity
            similarity = self._cosine_similarity(cue_encoding, item.encoding)
            
            # Add activation-weighted noise
            activation = item.compute_activation()
            noise = random.gauss(0, self.noise_factor)
            score = (similarity * PHI_INV + activation * (1 - PHI_INV)) + noise
            score = max(0, min(1, score))
            
            results.append(RetrievalResult(
                item=item,
                score=score,
                match_type="similarity"
            ))
        
        return results
    
    def _spreading_activation(self, cue: RetrievalCue) -> List[RetrievalResult]:
        """Spreading activation retrieval."""
        # Start with similarity match
        initial = self._similarity_match(cue)
        activated: Dict[str, float] = {}
        
        # Initial activation from cue match
        for result in initial:
            activated[result.item.id] = result.score
        
        # Spread activation through links
        for _ in range(3):  # Spreading iterations
            new_activation = dict(activated)
            for item_id, activation in activated.items():
                item = self.memories.get(item_id)
                if not item:
                    continue
                
                for linked_id in item.links:
                    if linked_id in self.memories:
                        spread = activation * self.spreading_factor
                        association = self.association_matrix.get((item_id, linked_id), 0.5)
                        spread *= association
                        new_activation[linked_id] = max(
                            new_activation.get(linked_id, 0),
                            spread
                        )
            activated = new_activation
        
        results = []
        for item_id, score in activated.items():
            item = self.memories.get(item_id)
            if item:
                results.append(RetrievalResult(
                    item=item,
                    score=score,
                    match_type="spreading"
                ))
        
        return results
    
    def _contextual_match(self, cue: RetrievalCue) -> List[RetrievalResult]:
        """Match based on context similarity."""
        results = []
        
        for item in self.memories.values():
            if not item.context or not cue.context:
                continue
            
            # Context overlap
            common_keys = set(item.context.keys()) & set(cue.context.keys())
            if not common_keys:
                continue
            
            matches = sum(
                1 for k in common_keys 
                if item.context[k] == cue.context[k]
            )
            score = matches / len(common_keys) * PHI_INV
            
            results.append(RetrievalResult(
                item=item,
                score=score,
                match_type="contextual"
            ))
        
        return results
    
    def _temporal_match(self, cue: RetrievalCue) -> List[RetrievalResult]:
        """Match based on temporal proximity."""
        results = []
        reference_time = cue.context.get("time", time.time())
        
        for item in self.memories.values():
            time_diff = abs(item.created_at - reference_time)
            # Gaussian temporal proximity
            score = math.exp(-time_diff / (3600 * PHI)) * PHI_INV  # Hour scale
            
            results.append(RetrievalResult(
                item=item,
                score=score,
                match_type="temporal"
            ))
        
        return results
    
    def _cosine_similarity(self, v1: List[float], v2: List[float]) -> float:
        """Compute cosine similarity between vectors."""
        if len(v1) != len(v2):
            return 0.0
        
        dot = sum(a * b for a, b in zip(v1, v2))
        norm1 = math.sqrt(sum(a * a for a in v1))
        norm2 = math.sqrt(sum(b * b for b in v2))
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot / (norm1 * norm2)
    
    def link_memories(self, id1: str, id2: str, strength: float = 0.5) -> bool:
        """Create associative link between memories."""
        if id1 not in self.memories or id2 not in self.memories:
            return False
        
        self.memories[id1].links.add(id2)
        self.memories[id2].links.add(id1)
        self.association_matrix[(id1, id2)] = strength
        self.association_matrix[(id2, id1)] = strength
        return True
    
    def strengthen_association(self, id1: str, id2: str, delta: float = 0.1) -> None:
        """Strengthen association between memories."""
        key1 = (id1, id2)
        key2 = (id2, id1)
        
        self.association_matrix[key1] = min(
            1.0, 
            self.association_matrix.get(key1, 0.5) + delta * PHI_INV
        )
        self.association_matrix[key2] = self.association_matrix[key1]
    
    def decay_activations(self, dt: float) -> None:
        """Apply time-based decay to all memories."""
        for item in self.memories.values():
            item.compute_activation()
    
    def forget(self, threshold: float = 0.01) -> int:
        """Remove memories below activation threshold."""
        to_remove = [
            id for id, item in self.memories.items()
            if item.compute_activation() < threshold
        ]
        
        for id in to_remove:
            del self.memories[id]
            # Clean up links
            for other in self.memories.values():
                other.links.discard(id)
        
        return len(to_remove)
    
    def set_context(self, context: Dict[str, Any]) -> None:
        """Set current retrieval context."""
        self.context = context
    
    def get_stats(self) -> Dict[str, Any]:
        """Get memory retrieval statistics."""
        activations = [m.compute_activation() for m in self.memories.values()]
        access_counts = [m.access_count for m in self.memories.values()]
        
        return {
            "total_memories": len(self.memories),
            "total_retrievals": len(self.retrieval_history),
            "mean_activation": sum(activations) / len(activations) if activations else 0,
            "max_activation": max(activations) if activations else 0,
            "mean_access_count": sum(access_counts) / len(access_counts) if access_counts else 0,
            "total_associations": len(self.association_matrix) // 2,
            "beat_count": self.beat_count,
            "phi_coherence": sum(activations) / (len(activations) * PHI) if activations else 0
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_retrieval_engine: Optional[MemoryRetrievalEngine] = None

def get_memory_retrieval_engine() -> MemoryRetrievalEngine:
    """Get or create the global memory retrieval engine."""
    global _retrieval_engine
    if _retrieval_engine is None:
        _retrieval_engine = MemoryRetrievalEngine()
    return _retrieval_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "RetrievalMode", "MemoryItem", "RetrievalCue", "RetrievalResult",
    "MemoryRetrievalEngine", "get_memory_retrieval_engine"
]
