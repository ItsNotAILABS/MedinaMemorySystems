"""
PROTO-305 — Semantic Fusion Protocol (Python)
Fuses semantic representations with φ-coherent blending.

Charter: PROTO-305
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Tuple
import hashlib

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


@dataclass
class SemanticVector:
    """A semantic representation as a vector."""
    id: str
    label: str
    dimensions: List[float]
    confidence: float = 1.0
    source: str = "unknown"
    
    def __post_init__(self):
        if not self.dimensions:
            self.dimensions = [random.gauss(0, 1) for _ in range(64)]
        self._normalize()
    
    def _normalize(self) -> None:
        """Normalize to unit vector."""
        magnitude = math.sqrt(sum(d**2 for d in self.dimensions)) or 1.0
        self.dimensions = [d / magnitude for d in self.dimensions]
    
    def similarity(self, other: "SemanticVector") -> float:
        """Compute cosine similarity."""
        if len(self.dimensions) != len(other.dimensions):
            return 0.0
        dot = sum(a * b for a, b in zip(self.dimensions, other.dimensions))
        return dot  # Already normalized
    
    def blend(self, other: "SemanticVector", weight: float = 0.5) -> "SemanticVector":
        """Blend with another vector."""
        w1 = 1 - weight
        w2 = weight
        new_dims = [
            w1 * a + w2 * b 
            for a, b in zip(self.dimensions, other.dimensions)
        ]
        return SemanticVector(
            id=f"blend-{self.id}-{other.id}",
            label=f"{self.label}+{other.label}",
            dimensions=new_dims,
            confidence=min(self.confidence, other.confidence) * PHI_INV
        )


class SemanticSpace:
    """A semantic space containing vectors."""
    
    def __init__(self, dimensions: int = 64):
        self.dimensions = dimensions
        self.vectors: Dict[str, SemanticVector] = {}
        self.clusters: Dict[str, List[str]] = {}
    
    def add_vector(self, vector: SemanticVector) -> None:
        """Add a vector to the space."""
        if len(vector.dimensions) != self.dimensions:
            # Pad or truncate
            dims = vector.dimensions[:self.dimensions]
            while len(dims) < self.dimensions:
                dims.append(0.0)
            vector.dimensions = dims
        self.vectors[vector.id] = vector
    
    def get_vector(self, id: str) -> Optional[SemanticVector]:
        """Get a vector by ID."""
        return self.vectors.get(id)
    
    def find_nearest(self, query: SemanticVector, k: int = 5) -> List[Tuple[str, float]]:
        """Find k nearest vectors to query."""
        similarities = [
            (vid, query.similarity(v))
            for vid, v in self.vectors.items()
            if vid != query.id
        ]
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:k]
    
    def cluster_by_similarity(self, threshold: float = 0.7) -> Dict[str, List[str]]:
        """Simple clustering by similarity threshold."""
        self.clusters = {}
        assigned = set()
        cluster_id = 0
        
        for vid, vec in self.vectors.items():
            if vid in assigned:
                continue
            
            cluster_id += 1
            cluster_name = f"cluster-{cluster_id}"
            self.clusters[cluster_name] = [vid]
            assigned.add(vid)
            
            for other_id, other_vec in self.vectors.items():
                if other_id in assigned:
                    continue
                if vec.similarity(other_vec) >= threshold:
                    self.clusters[cluster_name].append(other_id)
                    assigned.add(other_id)
        
        return self.clusters


class SemanticFusionEngine:
    """
    Engine for semantic fusion with φ-harmonic blending.
    """
    
    def __init__(self, dimensions: int = 64):
        self.space = SemanticSpace(dimensions)
        self.fusion_history: List[Dict[str, Any]] = []
        self.beat_count = 0
    
    def register_concept(self, label: str, dimensions: Optional[List[float]] = None,
                        confidence: float = 1.0, source: str = "input") -> SemanticVector:
        """Register a new semantic concept."""
        vec_id = f"concept-{hashlib.md5(label.encode()).hexdigest()[:8]}"
        vector = SemanticVector(
            id=vec_id,
            label=label,
            dimensions=dimensions or [],
            confidence=confidence,
            source=source
        )
        self.space.add_vector(vector)
        return vector
    
    def fuse(self, concept_ids: List[str], weights: Optional[List[float]] = None) -> Optional[SemanticVector]:
        """Fuse multiple concepts into one."""
        if len(concept_ids) < 2:
            return None
        
        vectors = [self.space.get_vector(cid) for cid in concept_ids]
        vectors = [v for v in vectors if v is not None]
        
        if len(vectors) < 2:
            return None
        
        if weights is None:
            # φ-distributed weights
            weights = [PHI_INV ** i for i in range(len(vectors))]
        
        # Normalize weights
        total_weight = sum(weights)
        weights = [w / total_weight for w in weights]
        
        # Weighted blend
        new_dims = [0.0] * self.space.dimensions
        for vec, weight in zip(vectors, weights):
            for i, d in enumerate(vec.dimensions):
                new_dims[i] += d * weight
        
        labels = "+".join(v.label for v in vectors)
        fused_id = f"fused-{int(time.time()*1000)}"
        
        fused = SemanticVector(
            id=fused_id,
            label=labels,
            dimensions=new_dims,
            confidence=min(v.confidence for v in vectors) * PHI_INV,
            source="fusion"
        )
        
        self.space.add_vector(fused)
        
        self.fusion_history.append({
            "inputs": concept_ids,
            "output": fused_id,
            "weights": weights,
            "timestamp": time.time()
        })
        
        return fused
    
    def analogical_fusion(self, a: str, b: str, c: str) -> Optional[SemanticVector]:
        """Compute a:b :: c:? analogy."""
        vec_a = self.space.get_vector(a)
        vec_b = self.space.get_vector(b)
        vec_c = self.space.get_vector(c)
        
        if not all([vec_a, vec_b, vec_c]):
            return None
        
        # d = c + (b - a) * PHI_INV
        new_dims = [
            vec_c.dimensions[i] + (vec_b.dimensions[i] - vec_a.dimensions[i]) * PHI_INV
            for i in range(self.space.dimensions)
        ]
        
        analogy_id = f"analogy-{int(time.time()*1000)}"
        result = SemanticVector(
            id=analogy_id,
            label=f"({vec_a.label}:{vec_b.label}::{vec_c.label}:?)",
            dimensions=new_dims,
            confidence=min(vec_a.confidence, vec_b.confidence, vec_c.confidence) * PHI_INV ** 2,
            source="analogy"
        )
        
        self.space.add_vector(result)
        return result
    
    def find_similar(self, concept_id: str, k: int = 5) -> List[Tuple[str, float]]:
        """Find similar concepts."""
        vector = self.space.get_vector(concept_id)
        if not vector:
            return []
        return self.space.find_nearest(vector, k)
    
    def conceptual_blend(self, concept_a: str, concept_b: str,
                        blend_point: float = 0.5) -> Optional[SemanticVector]:
        """Create a conceptual blend between two concepts."""
        vec_a = self.space.get_vector(concept_a)
        vec_b = self.space.get_vector(concept_b)
        
        if not vec_a or not vec_b:
            return None
        
        # Use PHI-adjusted blend point
        phi_blend = blend_point * PHI_INV + (1 - blend_point) * (1 - PHI_INV)
        
        blended = vec_a.blend(vec_b, phi_blend)
        blended.source = "conceptual_blend"
        self.space.add_vector(blended)
        
        return blended
    
    def tick(self) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        return {
            "beat": self.beat_count,
            "concept_count": len(self.space.vectors),
            "fusion_count": len(self.fusion_history),
            "cluster_count": len(self.space.clusters),
            "phi_coherence": len(self.space.vectors) * PHI_INV,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate semantic coherence report."""
        clusters = self.space.cluster_by_similarity()
        
        return {
            "total_concepts": len(self.space.vectors),
            "total_fusions": len(self.fusion_history),
            "clusters": len(clusters),
            "avg_cluster_size": sum(len(c) for c in clusters.values()) / max(1, len(clusters)),
            "dimensions": self.space.dimensions,
            "phi_metric": len(self.space.vectors) / max(1, len(clusters)) * PHI_INV,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[SemanticFusionEngine] = None

def get_semantic_fusion_engine() -> SemanticFusionEngine:
    """Get or create the singleton SemanticFusionEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = SemanticFusionEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-305 Semantic Fusion Protocol (Python) ===")
    
    engine = get_semantic_fusion_engine()
    
    # Register concepts
    king = engine.register_concept("king")
    queen = engine.register_concept("queen")
    man = engine.register_concept("man")
    woman = engine.register_concept("woman")
    
    # Fuse concepts
    fused = engine.fuse([king.id, queen.id])
    print(f"Fused concept: {fused.label}")
    
    # Analogical reasoning
    analogy = engine.analogical_fusion(man.id, woman.id, king.id)
    print(f"Analogy result: {analogy.label}")
    
    # Find similar
    similar = engine.find_similar(king.id)
    print(f"Similar to king: {similar}")
    
    print(f"Report: {engine.coherence_report()}")
