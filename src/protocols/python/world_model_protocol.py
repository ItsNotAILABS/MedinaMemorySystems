"""
PROTO-329 — World Model Protocol (Python)
Internal world model for prediction and simulation for MEDINA Memory Systems.

Charter: PROTO-329
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import copy
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable
from collections import defaultdict
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class EntityType(Enum):
    """Types of world entities."""
    OBJECT = "object"
    AGENT = "agent"
    LOCATION = "location"
    EVENT = "event"
    STATE = "state"


@dataclass
class Entity:
    """An entity in the world model."""
    id: str
    name: str
    entity_type: EntityType
    properties: Dict[str, Any] = field(default_factory=dict)
    position: Optional[Tuple[float, float, float]] = None
    parent_id: Optional[str] = None
    children_ids: Set[str] = field(default_factory=set)
    last_updated: float = field(default_factory=time.time)
    confidence: float = 0.8
    
    def update_property(self, key: str, value: Any) -> None:
        """Update entity property."""
        self.properties[key] = value
        self.last_updated = time.time()
    
    def decay_confidence(self, dt: float) -> None:
        """Decay confidence over time."""
        self.confidence *= math.exp(-dt * PHI_INV * 0.01)


@dataclass
class Relation:
    """A relation between entities."""
    source_id: str
    target_id: str
    relation_type: str
    strength: float = 1.0
    temporal: bool = False
    created_at: float = field(default_factory=time.time)
    valid_until: Optional[float] = None


@dataclass
class WorldState:
    """A snapshot of the world state."""
    timestamp: float = field(default_factory=time.time)
    entities: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    relations: List[Tuple[str, str, str]] = field(default_factory=list)
    global_properties: Dict[str, Any] = field(default_factory=dict)
    
    def clone(self) -> WorldState:
        """Create a deep copy of this state."""
        return WorldState(
            timestamp=self.timestamp,
            entities=copy.deepcopy(self.entities),
            relations=list(self.relations),
            global_properties=copy.deepcopy(self.global_properties)
        )


class TransitionModel:
    """Model of state transitions."""
    
    def __init__(self):
        self.transitions: Dict[Tuple[str, str], Dict[str, float]] = defaultdict(dict)
        self.action_effects: Dict[str, List[Callable[[WorldState], WorldState]]] = {}
    
    def record_transition(self, state_from: str, action: str, state_to: str) -> None:
        """Record observed state transition."""
        key = (state_from, action)
        if state_to not in self.transitions[key]:
            self.transitions[key][state_to] = 0
        self.transitions[key][state_to] += 1
    
    def predict_next_state(self, current_state: str, action: str) -> Optional[Tuple[str, float]]:
        """Predict most likely next state."""
        key = (current_state, action)
        if key not in self.transitions:
            return None
        
        outcomes = self.transitions[key]
        total = sum(outcomes.values())
        best_state = max(outcomes, key=lambda s: outcomes[s])
        prob = outcomes[best_state] / total
        
        return (best_state, prob)
    
    def register_action_effect(self, action: str, effect: Callable[[WorldState], WorldState]) -> None:
        """Register deterministic action effect."""
        if action not in self.action_effects:
            self.action_effects[action] = []
        self.action_effects[action].append(effect)
    
    def apply_action(self, state: WorldState, action: str) -> WorldState:
        """Apply action effects to state."""
        new_state = state.clone()
        if action in self.action_effects:
            for effect in self.action_effects[action]:
                new_state = effect(new_state)
        return new_state


class WorldModelEngine:
    """
    World model engine with φ-coherent prediction and simulation.
    """
    
    def __init__(self, history_size: int = 100):
        self.entities: Dict[str, Entity] = {}
        self.relations: Dict[Tuple[str, str], Relation] = {}
        self.transition_model = TransitionModel()
        self.state_history: List[WorldState] = []
        self.history_size = history_size
        self.prediction_horizon = int(PHI * 10)
        self.current_state_id: str = "initial"
        self.beat_count = 0
    
    def add_entity(self, id: str, name: str, entity_type: EntityType,
                   properties: Dict[str, Any] = None, **kwargs) -> Entity:
        """Add an entity to the world model."""
        entity = Entity(
            id=id, name=name, entity_type=entity_type,
            properties=properties or {}, **kwargs
        )
        self.entities[id] = entity
        return entity
    
    def add_relation(self, source_id: str, target_id: str, relation_type: str,
                     strength: float = 1.0) -> Optional[Relation]:
        """Add a relation between entities."""
        if source_id not in self.entities or target_id not in self.entities:
            return None
        
        relation = Relation(
            source_id=source_id, target_id=target_id,
            relation_type=relation_type, strength=strength
        )
        self.relations[(source_id, target_id)] = relation
        return relation
    
    def update_entity(self, entity_id: str, properties: Dict[str, Any]) -> bool:
        """Update entity properties."""
        if entity_id not in self.entities:
            return False
        
        entity = self.entities[entity_id]
        for key, value in properties.items():
            entity.update_property(key, value)
        return True
    
    def get_current_state(self) -> WorldState:
        """Get current world state snapshot."""
        state = WorldState(timestamp=time.time())
        
        for eid, entity in self.entities.items():
            state.entities[eid] = {
                "name": entity.name,
                "type": entity.entity_type.value,
                "properties": dict(entity.properties),
                "confidence": entity.confidence
            }
        
        for (src, tgt), rel in self.relations.items():
            state.relations.append((src, rel.relation_type, tgt))
        
        return state
    
    def record_state(self) -> WorldState:
        """Record current state to history."""
        state = self.get_current_state()
        self.state_history.append(state)
        
        if len(self.state_history) > self.history_size:
            self.state_history = self.state_history[-self.history_size:]
        
        self.beat_count += 1
        return state
    
    def observe(self, observations: Dict[str, Dict[str, Any]]) -> None:
        """Update world model with observations."""
        for entity_id, obs in observations.items():
            if entity_id in self.entities:
                entity = self.entities[entity_id]
                for key, value in obs.items():
                    entity.update_property(key, value)
                entity.confidence = min(1.0, entity.confidence + PHI_INV * 0.1)
            else:
                # Create new entity from observation
                self.add_entity(
                    id=entity_id,
                    name=obs.get("name", entity_id),
                    entity_type=EntityType(obs.get("type", "object")),
                    properties=obs
                )
    
    def predict_state(self, action: str, steps: int = 1) -> WorldState:
        """Predict future state after action(s)."""
        state = self.get_current_state()
        
        for _ in range(steps):
            state = self.transition_model.apply_action(state, action)
            state.timestamp = time.time() + steps * 0.1
            
            # Decay confidences in prediction
            for entity_data in state.entities.values():
                entity_data["confidence"] *= PHI_INV
        
        return state
    
    def simulate_trajectory(self, actions: List[str]) -> List[WorldState]:
        """Simulate trajectory through state space."""
        trajectory = [self.get_current_state()]
        
        for action in actions:
            next_state = self.transition_model.apply_action(trajectory[-1], action)
            trajectory.append(next_state)
        
        return trajectory
    
    def query_entities(self, entity_type: Optional[EntityType] = None,
                       properties: Dict[str, Any] = None) -> List[Entity]:
        """Query entities matching criteria."""
        results = []
        
        for entity in self.entities.values():
            if entity_type and entity.entity_type != entity_type:
                continue
            
            if properties:
                match = all(
                    entity.properties.get(k) == v
                    for k, v in properties.items()
                )
                if not match:
                    continue
            
            results.append(entity)
        
        return results
    
    def query_relations(self, source_id: Optional[str] = None,
                        target_id: Optional[str] = None,
                        relation_type: Optional[str] = None) -> List[Relation]:
        """Query relations matching criteria."""
        results = []
        
        for (src, tgt), rel in self.relations.items():
            if source_id and src != source_id:
                continue
            if target_id and tgt != target_id:
                continue
            if relation_type and rel.relation_type != relation_type:
                continue
            results.append(rel)
        
        return results
    
    def find_path(self, from_entity: str, to_entity: str,
                  max_depth: int = 5) -> Optional[List[str]]:
        """Find path between entities through relations."""
        if from_entity not in self.entities or to_entity not in self.entities:
            return None
        
        visited = {from_entity}
        queue = [(from_entity, [from_entity])]
        
        while queue:
            current, path = queue.pop(0)
            
            if current == to_entity:
                return path
            
            if len(path) >= max_depth:
                continue
            
            # Find connected entities
            for (src, tgt), rel in self.relations.items():
                next_entity = None
                if src == current and tgt not in visited:
                    next_entity = tgt
                elif tgt == current and src not in visited:
                    next_entity = src
                
                if next_entity:
                    visited.add(next_entity)
                    queue.append((next_entity, path + [next_entity]))
        
        return None
    
    def decay_confidences(self, dt: float) -> None:
        """Decay all entity confidences."""
        for entity in self.entities.values():
            entity.decay_confidence(dt)
    
    def prune_low_confidence(self, threshold: float = 0.1) -> int:
        """Remove entities with low confidence."""
        to_remove = [
            eid for eid, e in self.entities.items()
            if e.confidence < threshold
        ]
        
        for eid in to_remove:
            del self.entities[eid]
            # Remove related relations
            self.relations = {
                k: v for k, v in self.relations.items()
                if k[0] != eid and k[1] != eid
            }
        
        return len(to_remove)
    
    def compute_state_difference(self, state1: WorldState, state2: WorldState) -> Dict[str, Any]:
        """Compute difference between two states."""
        diff = {
            "added_entities": [],
            "removed_entities": [],
            "changed_entities": {},
            "added_relations": [],
            "removed_relations": []
        }
        
        # Entity differences
        ids1 = set(state1.entities.keys())
        ids2 = set(state2.entities.keys())
        diff["added_entities"] = list(ids2 - ids1)
        diff["removed_entities"] = list(ids1 - ids2)
        
        for eid in ids1 & ids2:
            props1 = state1.entities[eid].get("properties", {})
            props2 = state2.entities[eid].get("properties", {})
            changes = {}
            for key in set(props1.keys()) | set(props2.keys()):
                if props1.get(key) != props2.get(key):
                    changes[key] = {"from": props1.get(key), "to": props2.get(key)}
            if changes:
                diff["changed_entities"][eid] = changes
        
        # Relation differences
        rels1 = set(state1.relations)
        rels2 = set(state2.relations)
        diff["added_relations"] = list(rels2 - rels1)
        diff["removed_relations"] = list(rels1 - rels2)
        
        return diff
    
    def get_stats(self) -> Dict[str, Any]:
        """Get world model statistics."""
        if not self.entities:
            return {"total_entities": 0}
        
        confidences = [e.confidence for e in self.entities.values()]
        by_type = defaultdict(int)
        for e in self.entities.values():
            by_type[e.entity_type.value] += 1
        
        return {
            "total_entities": len(self.entities),
            "total_relations": len(self.relations),
            "entities_by_type": dict(by_type),
            "mean_confidence": sum(confidences) / len(confidences),
            "history_length": len(self.state_history),
            "beat_count": self.beat_count,
            "phi_coherence": sum(confidences) / len(confidences) * PHI_INV
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_world_engine: Optional[WorldModelEngine] = None

def get_world_model_engine() -> WorldModelEngine:
    """Get or create the global world model engine."""
    global _world_engine
    if _world_engine is None:
        _world_engine = WorldModelEngine()
    return _world_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "EntityType", "Entity", "Relation", "WorldState",
    "TransitionModel", "WorldModelEngine", "get_world_model_engine"
]
