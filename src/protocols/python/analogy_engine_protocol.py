"""
PROTO-334 — Analogy Engine Protocol (Python)
Analogical reasoning and structure mapping for MEDINA Memory Systems.

Charter: PROTO-334
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple
from collections import defaultdict
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class RelationType(Enum):
    """Types of relations in analogies."""
    CAUSAL = "causal"
    SPATIAL = "spatial"
    TEMPORAL = "temporal"
    FUNCTIONAL = "functional"
    STRUCTURAL = "structural"
    ATTRIBUTE = "attribute"


@dataclass
class Entity:
    """An entity in a domain."""
    id: str
    name: str
    attributes: Dict[str, Any] = field(default_factory=dict)
    
    def similarity(self, other: Entity) -> float:
        """Compute attribute similarity."""
        if not self.attributes or not other.attributes:
            return 0.0
        
        common = set(self.attributes.keys()) & set(other.attributes.keys())
        if not common:
            return 0.0
        
        matches = sum(
            1 for k in common 
            if self.attributes[k] == other.attributes[k]
        )
        return matches / len(common) * PHI_INV


@dataclass
class Relation:
    """A relation between entities."""
    id: str
    relation_type: RelationType
    source_id: str
    target_id: str
    predicate: str
    weight: float = 1.0
    
    def matches_structure(self, other: Relation) -> bool:
        """Check if relations have same structure."""
        return self.relation_type == other.relation_type


@dataclass
class Domain:
    """A domain containing entities and relations."""
    id: str
    name: str
    entities: Dict[str, Entity] = field(default_factory=dict)
    relations: Dict[str, Relation] = field(default_factory=dict)
    
    def add_entity(self, id: str, name: str, **attributes) -> Entity:
        """Add an entity to the domain."""
        entity = Entity(id=id, name=name, attributes=attributes)
        self.entities[id] = entity
        return entity
    
    def add_relation(self, id: str, relation_type: RelationType,
                     source_id: str, target_id: str, predicate: str) -> Relation:
        """Add a relation to the domain."""
        relation = Relation(
            id=id, relation_type=relation_type,
            source_id=source_id, target_id=target_id,
            predicate=predicate
        )
        self.relations[id] = relation
        return relation


@dataclass
class Mapping:
    """A mapping between two domains."""
    id: str
    source_domain_id: str
    target_domain_id: str
    entity_mappings: Dict[str, str] = field(default_factory=dict)
    relation_mappings: Dict[str, str] = field(default_factory=dict)
    score: float = 0.0
    
    def add_entity_mapping(self, source_id: str, target_id: str) -> None:
        """Add entity correspondence."""
        self.entity_mappings[source_id] = target_id
    
    def add_relation_mapping(self, source_id: str, target_id: str) -> None:
        """Add relation correspondence."""
        self.relation_mappings[source_id] = target_id


@dataclass
class Inference:
    """An inference drawn from analogy."""
    source_predicate: str
    target_predicate: str
    confidence: float
    supporting_mappings: int
    timestamp: float = field(default_factory=time.time)


class AnalogyEngine:
    """
    Analogical reasoning engine with φ-coherent structure mapping.
    """
    
    def __init__(self, similarity_threshold: float = 0.5):
        self.domains: Dict[str, Domain] = {}
        self.mappings: Dict[str, Mapping] = {}
        self.inferences: List[Inference] = []
        self.similarity_threshold = similarity_threshold
        self.relation_weights: Dict[RelationType, float] = {
            RelationType.CAUSAL: PHI,
            RelationType.FUNCTIONAL: PHI_INV * PHI,
            RelationType.STRUCTURAL: 1.0,
            RelationType.TEMPORAL: PHI_INV,
            RelationType.SPATIAL: PHI_INV,
            RelationType.ATTRIBUTE: PHI_INV * PHI_INV
        }
        self.beat_count = 0
    
    def create_domain(self, id: str, name: str) -> Domain:
        """Create a new domain."""
        domain = Domain(id=id, name=name)
        self.domains[id] = domain
        return domain
    
    def find_analogy(self, source_domain_id: str, 
                     target_domain_id: str) -> Optional[Mapping]:
        """Find analogical mapping between domains using SME-like algorithm."""
        if source_domain_id not in self.domains or target_domain_id not in self.domains:
            return None
        
        source = self.domains[source_domain_id]
        target = self.domains[target_domain_id]
        
        mapping = Mapping(
            id=f"map_{source_domain_id}_{target_domain_id}",
            source_domain_id=source_domain_id,
            target_domain_id=target_domain_id
        )
        
        # Phase 1: Local match - find matching relations
        local_matches = self._find_local_matches(source, target)
        
        # Phase 2: Build mapping hypotheses
        mapping = self._build_mapping(source, target, local_matches, mapping)
        
        # Phase 3: Score mapping
        mapping.score = self._score_mapping(mapping, source, target)
        
        self.mappings[mapping.id] = mapping
        self.beat_count += 1
        
        return mapping
    
    def _find_local_matches(self, source: Domain, target: Domain) -> List[Tuple[str, str, float]]:
        """Find locally matching relations."""
        matches = []
        
        for srel_id, srel in source.relations.items():
            for trel_id, trel in target.relations.items():
                if srel.matches_structure(trel):
                    weight = self.relation_weights.get(srel.relation_type, 1.0)
                    matches.append((srel_id, trel_id, weight))
        
        return matches
    
    def _build_mapping(self, source: Domain, target: Domain,
                       local_matches: List[Tuple[str, str, float]],
                       mapping: Mapping) -> Mapping:
        """Build consistent mapping from local matches."""
        # Greedy consistent mapping
        entity_constraints: Dict[str, Set[str]] = defaultdict(set)
        
        # Sort by weight (prefer higher-order relations)
        local_matches.sort(key=lambda x: x[2], reverse=True)
        
        for srel_id, trel_id, weight in local_matches:
            srel = source.relations[srel_id]
            trel = target.relations[trel_id]
            
            # Check consistency
            src_mapped = mapping.entity_mappings.get(srel.source_id)
            tgt_mapped = mapping.entity_mappings.get(srel.target_id)
            
            if src_mapped and src_mapped != trel.source_id:
                continue
            if tgt_mapped and tgt_mapped != trel.target_id:
                continue
            
            # Add mapping
            mapping.add_entity_mapping(srel.source_id, trel.source_id)
            mapping.add_entity_mapping(srel.target_id, trel.target_id)
            mapping.add_relation_mapping(srel_id, trel_id)
        
        return mapping
    
    def _score_mapping(self, mapping: Mapping, source: Domain, 
                       target: Domain) -> float:
        """Score a mapping using systematicity principle."""
        if not mapping.relation_mappings:
            return 0.0
        
        score = 0.0
        
        # Score based on mapped relations
        for srel_id in mapping.relation_mappings:
            srel = source.relations.get(srel_id)
            if srel:
                weight = self.relation_weights.get(srel.relation_type, 1.0)
                score += weight
        
        # Bonus for systematic mappings (connected relations)
        mapped_entities = set(mapping.entity_mappings.keys())
        for srel_id in mapping.relation_mappings:
            srel = source.relations.get(srel_id)
            if srel:
                # Check if source and target are also in mapped relations
                if srel.source_id in mapped_entities and srel.target_id in mapped_entities:
                    score += PHI_INV  # Systematicity bonus
        
        # Normalize
        max_possible = len(source.relations) * PHI
        return (score / max_possible) * PHI_INV if max_possible > 0 else 0
    
    def transfer_inference(self, mapping_id: str) -> List[Inference]:
        """Transfer unmapped relations as candidate inferences."""
        if mapping_id not in self.mappings:
            return []
        
        mapping = self.mappings[mapping_id]
        source = self.domains.get(mapping.source_domain_id)
        target = self.domains.get(mapping.target_domain_id)
        
        if not source or not target:
            return []
        
        inferences = []
        
        # Find unmapped source relations that could transfer
        mapped_relations = set(mapping.relation_mappings.keys())
        for srel_id, srel in source.relations.items():
            if srel_id in mapped_relations:
                continue
            
            # Check if entities are mapped
            if srel.source_id in mapping.entity_mappings and \
               srel.target_id in mapping.entity_mappings:
                
                target_src = mapping.entity_mappings[srel.source_id]
                target_tgt = mapping.entity_mappings[srel.target_id]
                
                # Create inference
                target_predicate = f"{srel.predicate}({target_src}, {target_tgt})"
                
                inference = Inference(
                    source_predicate=f"{srel.predicate}({srel.source_id}, {srel.target_id})",
                    target_predicate=target_predicate,
                    confidence=mapping.score * PHI_INV,
                    supporting_mappings=len(mapping.relation_mappings)
                )
                inferences.append(inference)
                self.inferences.append(inference)
        
        return inferences
    
    def find_analogous_domains(self, domain_id: str, top_k: int = 5) -> List[Tuple[str, float]]:
        """Find most analogous domains to given domain."""
        if domain_id not in self.domains:
            return []
        
        scores = []
        for other_id in self.domains:
            if other_id == domain_id:
                continue
            
            mapping = self.find_analogy(domain_id, other_id)
            if mapping:
                scores.append((other_id, mapping.score))
        
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]
    
    def retrieve_by_similarity(self, query_domain: Domain, top_k: int = 5) -> List[str]:
        """Retrieve similar domains from memory."""
        similarities = []
        
        for domain_id, domain in self.domains.items():
            # Simple structural similarity
            rel_types_query = set(r.relation_type for r in query_domain.relations.values())
            rel_types_domain = set(r.relation_type for r in domain.relations.values())
            
            if rel_types_query and rel_types_domain:
                jaccard = len(rel_types_query & rel_types_domain) / len(rel_types_query | rel_types_domain)
                similarities.append((domain_id, jaccard * PHI_INV))
        
        similarities.sort(key=lambda x: x[1], reverse=True)
        return [s[0] for s in similarities[:top_k]]
    
    def get_stats(self) -> Dict[str, Any]:
        """Get analogy engine statistics."""
        mapping_scores = [m.score for m in self.mappings.values()]
        inference_confidences = [i.confidence for i in self.inferences]
        
        return {
            "total_domains": len(self.domains),
            "total_mappings": len(self.mappings),
            "total_inferences": len(self.inferences),
            "mean_mapping_score": sum(mapping_scores) / len(mapping_scores) if mapping_scores else 0,
            "mean_inference_confidence": sum(inference_confidences) / len(inference_confidences) if inference_confidences else 0,
            "beat_count": self.beat_count,
            "phi_coherence": sum(mapping_scores) / len(mapping_scores) * PHI_INV if mapping_scores else 0
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_analogy_engine: Optional[AnalogyEngine] = None

def get_analogy_engine() -> AnalogyEngine:
    """Get or create the global analogy engine."""
    global _analogy_engine
    if _analogy_engine is None:
        _analogy_engine = AnalogyEngine()
    return _analogy_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "RelationType", "Entity", "Relation", "Domain", "Mapping", "Inference",
    "AnalogyEngine", "get_analogy_engine"
]
