"""
PROTO-327 — Concept Formation Protocol (Python)
Bottom-up concept learning and abstraction for MEDINA Memory Systems.

Charter: PROTO-327
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import uuid
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, FrozenSet, Callable
from collections import defaultdict
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class ConceptType(Enum):
    """Types of concepts."""
    PRIMITIVE = "primitive"
    COMPOSITE = "composite"
    ABSTRACT = "abstract"
    RELATIONAL = "relational"
    PROCEDURAL = "procedural"


@dataclass
class Feature:
    """A feature with value and relevance."""
    name: str
    value: Any
    relevance: float = 1.0
    variance: float = 0.0
    
    def similarity(self, other: Feature) -> float:
        """Compute similarity to another feature."""
        if self.name != other.name:
            return 0.0
        
        if isinstance(self.value, (int, float)) and isinstance(other.value, (int, float)):
            diff = abs(self.value - other.value)
            max_val = max(abs(self.value), abs(other.value), 1)
            return math.exp(-diff / max_val * PHI_INV)
        
        return 1.0 if self.value == other.value else 0.0


@dataclass
class Exemplar:
    """An exemplar (instance) of a concept."""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    features: Dict[str, Feature] = field(default_factory=dict)
    label: Optional[str] = None
    typicality: float = 0.5
    created_at: float = field(default_factory=time.time)
    
    def add_feature(self, name: str, value: Any, relevance: float = 1.0) -> Feature:
        """Add a feature to the exemplar."""
        feature = Feature(name=name, value=value, relevance=relevance)
        self.features[name] = feature
        return feature
    
    def similarity_to(self, other: Exemplar, weights: Dict[str, float] = None) -> float:
        """Compute weighted similarity to another exemplar."""
        if not self.features or not other.features:
            return 0.0
        
        weights = weights or {}
        total_sim = 0.0
        total_weight = 0.0
        
        common_features = set(self.features.keys()) & set(other.features.keys())
        for fname in common_features:
            weight = weights.get(fname, 1.0)
            sim = self.features[fname].similarity(other.features[fname])
            total_sim += sim * weight
            total_weight += weight
        
        return total_sim / (total_weight + 1e-10) * PHI_INV


@dataclass
class Concept:
    """A concept formed from exemplars."""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = ""
    concept_type: ConceptType = ConceptType.PRIMITIVE
    prototype: Dict[str, Any] = field(default_factory=dict)
    exemplar_ids: Set[str] = field(default_factory=set)
    feature_weights: Dict[str, float] = field(default_factory=dict)
    parent_id: Optional[str] = None
    children_ids: Set[str] = field(default_factory=set)
    coherence: float = 0.5
    activation: float = 0.5
    created_at: float = field(default_factory=time.time)
    
    def update_prototype(self, exemplars: List[Exemplar]) -> None:
        """Update prototype from exemplars."""
        if not exemplars:
            return
        
        # Aggregate feature values
        feature_values = defaultdict(list)
        for ex in exemplars:
            for fname, feature in ex.features.items():
                feature_values[fname].append(feature.value)
        
        # Compute prototype (mean for numeric, mode for categorical)
        for fname, values in feature_values.items():
            if all(isinstance(v, (int, float)) for v in values):
                self.prototype[fname] = sum(values) / len(values)
            else:
                counts = defaultdict(int)
                for v in values:
                    counts[str(v)] += 1
                self.prototype[fname] = max(counts.keys(), key=lambda k: counts[k])
        
        # Update feature weights based on variance
        for fname, values in feature_values.items():
            if len(values) > 1 and all(isinstance(v, (int, float)) for v in values):
                mean = sum(values) / len(values)
                variance = sum((v - mean) ** 2 for v in values) / len(values)
                # Low variance = high weight (discriminative feature)
                self.feature_weights[fname] = 1 / (variance + 1) * PHI_INV
            else:
                self.feature_weights[fname] = 1.0
    
    def compute_coherence(self, exemplars: List[Exemplar]) -> float:
        """Compute concept coherence from exemplar similarities."""
        if len(exemplars) < 2:
            return 1.0
        
        total_sim = 0.0
        count = 0
        for i, ex1 in enumerate(exemplars):
            for ex2 in exemplars[i+1:]:
                total_sim += ex1.similarity_to(ex2, self.feature_weights)
                count += 1
        
        self.coherence = total_sim / count if count > 0 else 0.0
        return self.coherence


class ConceptFormationEngine:
    """
    Concept formation engine with φ-coherent abstraction.
    """
    
    def __init__(self, similarity_threshold: float = 0.6):
        self.concepts: Dict[str, Concept] = {}
        self.exemplars: Dict[str, Exemplar] = {}
        self.concept_exemplars: Dict[str, Set[str]] = defaultdict(set)
        self.similarity_threshold = similarity_threshold
        self.feature_importance: Dict[str, float] = defaultdict(lambda: 1.0)
        self.beat_count = 0
    
    def add_exemplar(self, features: Dict[str, Any], label: Optional[str] = None) -> Exemplar:
        """Add a new exemplar."""
        exemplar = Exemplar(label=label)
        for name, value in features.items():
            exemplar.add_feature(name, value, self.feature_importance[name])
        self.exemplars[exemplar.id] = exemplar
        return exemplar
    
    def classify_exemplar(self, exemplar: Exemplar) -> Optional[Tuple[Concept, float]]:
        """Classify exemplar to best matching concept."""
        best_concept = None
        best_score = 0.0
        
        for concept in self.concepts.values():
            score = self._compute_membership(exemplar, concept)
            if score > best_score and score >= self.similarity_threshold:
                best_score = score
                best_concept = concept
        
        return (best_concept, best_score) if best_concept else None
    
    def _compute_membership(self, exemplar: Exemplar, concept: Concept) -> float:
        """Compute membership degree of exemplar in concept."""
        # Prototype-based similarity
        proto_sim = 0.0
        total_weight = 0.0
        
        for fname, proto_val in concept.prototype.items():
            if fname in exemplar.features:
                feature = exemplar.features[fname]
                weight = concept.feature_weights.get(fname, 1.0)
                
                if isinstance(proto_val, (int, float)) and isinstance(feature.value, (int, float)):
                    diff = abs(proto_val - feature.value)
                    max_val = max(abs(proto_val), abs(feature.value), 1)
                    sim = math.exp(-diff / max_val * PHI_INV)
                else:
                    sim = 1.0 if proto_val == feature.value else 0.0
                
                proto_sim += sim * weight
                total_weight += weight
        
        return proto_sim / (total_weight + 1e-10) * concept.activation
    
    def form_concept(self, exemplar_ids: List[str], name: str = None,
                     concept_type: ConceptType = ConceptType.PRIMITIVE) -> Optional[Concept]:
        """Form a new concept from exemplars."""
        exemplars = [self.exemplars[eid] for eid in exemplar_ids if eid in self.exemplars]
        if not exemplars:
            return None
        
        concept = Concept(
            name=name or f"concept_{len(self.concepts)}",
            concept_type=concept_type,
            exemplar_ids=set(exemplar_ids)
        )
        concept.update_prototype(exemplars)
        concept.compute_coherence(exemplars)
        
        self.concepts[concept.id] = concept
        for eid in exemplar_ids:
            self.concept_exemplars[concept.id].add(eid)
        
        return concept
    
    def induce_concept(self, positive_examples: List[Dict[str, Any]],
                       negative_examples: List[Dict[str, Any]] = None) -> Concept:
        """Induce concept from positive and negative examples."""
        # Add exemplars
        pos_exemplars = [self.add_exemplar(ex, label="positive") for ex in positive_examples]
        neg_exemplars = [self.add_exemplar(ex, label="negative") for ex in (negative_examples or [])]
        
        # Form initial concept from positive examples
        concept = self.form_concept(
            [e.id for e in pos_exemplars],
            concept_type=ConceptType.COMPOSITE
        )
        
        if not concept or not neg_exemplars:
            return concept
        
        # Refine weights to discriminate from negative examples
        for fname in concept.feature_weights:
            pos_vals = [e.features[fname].value for e in pos_exemplars if fname in e.features]
            neg_vals = [e.features[fname].value for e in neg_exemplars if fname in e.features]
            
            if pos_vals and neg_vals:
                # Increase weight if feature discriminates
                pos_mean = sum(pos_vals) / len(pos_vals) if all(isinstance(v, (int, float)) for v in pos_vals) else None
                neg_mean = sum(neg_vals) / len(neg_vals) if all(isinstance(v, (int, float)) for v in neg_vals) else None
                
                if pos_mean is not None and neg_mean is not None:
                    discrimination = abs(pos_mean - neg_mean)
                    concept.feature_weights[fname] *= (1 + discrimination * PHI_INV)
        
        return concept
    
    def merge_concepts(self, concept_ids: List[str]) -> Optional[Concept]:
        """Merge multiple concepts into a more abstract one."""
        concepts = [self.concepts[cid] for cid in concept_ids if cid in self.concepts]
        if len(concepts) < 2:
            return None
        
        # Combine exemplars
        all_exemplar_ids = set()
        for c in concepts:
            all_exemplar_ids.update(c.exemplar_ids)
        
        # Create abstract concept
        abstract = self.form_concept(
            list(all_exemplar_ids),
            name=f"abstract_{len(self.concepts)}",
            concept_type=ConceptType.ABSTRACT
        )
        
        if abstract:
            # Set up hierarchy
            for c in concepts:
                c.parent_id = abstract.id
                abstract.children_ids.add(c.id)
        
        return abstract
    
    def split_concept(self, concept_id: str, num_clusters: int = 2) -> List[Concept]:
        """Split a concept into subconcepts."""
        if concept_id not in self.concepts:
            return []
        
        concept = self.concepts[concept_id]
        exemplars = [self.exemplars[eid] for eid in concept.exemplar_ids if eid in self.exemplars]
        
        if len(exemplars) < num_clusters:
            return []
        
        # Simple k-means-like clustering
        clusters = [[] for _ in range(num_clusters)]
        
        # Initialize with random assignment
        import random
        for ex in exemplars:
            clusters[random.randint(0, num_clusters - 1)].append(ex)
        
        # Refine (one iteration)
        centroids = []
        for cluster in clusters:
            if cluster:
                centroid = {}
                for fname in concept.prototype:
                    vals = [e.features[fname].value for e in cluster if fname in e.features]
                    if vals and all(isinstance(v, (int, float)) for v in vals):
                        centroid[fname] = sum(vals) / len(vals)
                centroids.append(centroid)
        
        # Form subconcepts
        subconcepts = []
        for i, cluster in enumerate(clusters):
            if cluster:
                sub = self.form_concept(
                    [e.id for e in cluster],
                    name=f"{concept.name}_sub{i}",
                    concept_type=ConceptType.COMPOSITE
                )
                if sub:
                    sub.parent_id = concept_id
                    concept.children_ids.add(sub.id)
                    subconcepts.append(sub)
        
        return subconcepts
    
    def compute_concept_similarity(self, concept_id1: str, concept_id2: str) -> float:
        """Compute similarity between two concepts."""
        if concept_id1 not in self.concepts or concept_id2 not in self.concepts:
            return 0.0
        
        c1 = self.concepts[concept_id1]
        c2 = self.concepts[concept_id2]
        
        # Prototype-based similarity
        common_features = set(c1.prototype.keys()) & set(c2.prototype.keys())
        if not common_features:
            return 0.0
        
        total_sim = 0.0
        for fname in common_features:
            v1, v2 = c1.prototype[fname], c2.prototype[fname]
            if isinstance(v1, (int, float)) and isinstance(v2, (int, float)):
                diff = abs(v1 - v2)
                max_val = max(abs(v1), abs(v2), 1)
                total_sim += math.exp(-diff / max_val * PHI_INV)
            else:
                total_sim += 1.0 if v1 == v2 else 0.0
        
        return total_sim / len(common_features) * PHI_INV
    
    def update_feature_importance(self) -> None:
        """Update global feature importance based on discrimination."""
        feature_scores = defaultdict(list)
        
        for concept in self.concepts.values():
            for fname, weight in concept.feature_weights.items():
                feature_scores[fname].append(weight)
        
        for fname, scores in feature_scores.items():
            self.feature_importance[fname] = sum(scores) / len(scores) * PHI_INV
    
    def decay_concepts(self, dt: float) -> None:
        """Apply temporal decay to concept activations."""
        for concept in self.concepts.values():
            concept.activation *= math.exp(-dt * PHI_INV * 0.01)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get concept formation statistics."""
        if not self.concepts:
            return {"total_concepts": 0}
        
        coherences = [c.coherence for c in self.concepts.values()]
        activations = [c.activation for c in self.concepts.values()]
        
        return {
            "total_concepts": len(self.concepts),
            "total_exemplars": len(self.exemplars),
            "mean_coherence": sum(coherences) / len(coherences),
            "mean_activation": sum(activations) / len(activations),
            "mean_exemplars_per_concept": len(self.exemplars) / len(self.concepts),
            "beat_count": self.beat_count,
            "phi_coherence": sum(c.coherence * c.activation for c in self.concepts.values()) / len(self.concepts) * PHI_INV
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_concept_engine: Optional[ConceptFormationEngine] = None

def get_concept_formation_engine() -> ConceptFormationEngine:
    """Get or create the global concept formation engine."""
    global _concept_engine
    if _concept_engine is None:
        _concept_engine = ConceptFormationEngine()
    return _concept_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "ConceptType", "Feature", "Exemplar", "Concept",
    "ConceptFormationEngine", "get_concept_formation_engine"
]
