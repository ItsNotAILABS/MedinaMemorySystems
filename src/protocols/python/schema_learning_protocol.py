"""
PROTO-325 — Schema Learning Protocol (Python)
Adaptive schema induction and generalization for MEDINA Memory Systems.

Charter: PROTO-325
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import uuid
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable, FrozenSet
from collections import defaultdict
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class SchemaType(Enum):
    """Types of schemas."""
    OBJECT = "object"
    EVENT = "event"
    SCRIPT = "script"
    CAUSAL = "causal"
    SPATIAL = "spatial"
    TEMPORAL = "temporal"


@dataclass
class Slot:
    """A slot in a schema with constraints."""
    name: str
    slot_type: str = "any"
    required: bool = True
    default_value: Any = None
    constraints: List[Callable[[Any], bool]] = field(default_factory=list)
    filler_history: List[Any] = field(default_factory=list)
    
    def fill(self, value: Any) -> bool:
        """Attempt to fill the slot with a value."""
        if all(c(value) for c in self.constraints):
            self.filler_history.append(value)
            return True
        return False
    
    def get_typical_filler(self) -> Any:
        """Get most common filler value."""
        if not self.filler_history:
            return self.default_value
        counts = defaultdict(int)
        for v in self.filler_history:
            counts[str(v)] += 1
        return max(counts.keys(), key=lambda k: counts[k])


@dataclass
class Schema:
    """A cognitive schema representing structured knowledge."""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = ""
    schema_type: SchemaType = SchemaType.OBJECT
    slots: Dict[str, Slot] = field(default_factory=dict)
    relations: List[Tuple[str, str, str]] = field(default_factory=list)
    parent_id: Optional[str] = None
    children_ids: Set[str] = field(default_factory=set)
    activation: float = 0.5
    confidence: float = 0.5
    usage_count: int = 0
    created_at: float = field(default_factory=time.time)
    
    def add_slot(self, name: str, slot_type: str = "any", required: bool = True,
                 default_value: Any = None) -> Slot:
        """Add a slot to the schema."""
        slot = Slot(name=name, slot_type=slot_type, required=required,
                   default_value=default_value)
        self.slots[name] = slot
        return slot
    
    def fill_slots(self, bindings: Dict[str, Any]) -> float:
        """Fill slots with bindings, return match quality."""
        filled = 0
        required_filled = 0
        required_total = sum(1 for s in self.slots.values() if s.required)
        
        for slot_name, value in bindings.items():
            if slot_name in self.slots:
                if self.slots[slot_name].fill(value):
                    filled += 1
                    if self.slots[slot_name].required:
                        required_filled += 1
        
        # Match quality based on φ-weighted filling
        if required_total == 0:
            return 1.0 if filled > 0 else 0.0
        
        return (required_filled / required_total) * PHI_INV + (filled / len(self.slots)) * (1 - PHI_INV)
    
    def compute_similarity(self, other: Schema) -> float:
        """Compute similarity to another schema."""
        shared_slots = set(self.slots.keys()) & set(other.slots.keys())
        all_slots = set(self.slots.keys()) | set(other.slots.keys())
        
        if not all_slots:
            return 0.0
        
        slot_sim = len(shared_slots) / len(all_slots)
        type_sim = 1.0 if self.schema_type == other.schema_type else PHI_INV
        
        return slot_sim * type_sim * PHI_INV


@dataclass
class Instance:
    """An instance bound to a schema."""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    schema_id: str = ""
    bindings: Dict[str, Any] = field(default_factory=dict)
    match_quality: float = 0.0
    created_at: float = field(default_factory=time.time)


class SchemaLearningEngine:
    """
    Schema learning engine with φ-coherent generalization.
    """
    
    def __init__(self, generalization_threshold: float = 0.7):
        self.schemas: Dict[str, Schema] = {}
        self.instances: Dict[str, Instance] = {}
        self.schema_hierarchy: Dict[str, Set[str]] = defaultdict(set)  # parent -> children
        self.generalization_threshold = generalization_threshold
        self.learning_rate = PHI_INV * 0.1
        self.beat_count = 0
    
    def create_schema(self, name: str, schema_type: SchemaType = SchemaType.OBJECT,
                      parent_id: Optional[str] = None) -> Schema:
        """Create a new schema."""
        schema = Schema(name=name, schema_type=schema_type, parent_id=parent_id)
        self.schemas[schema.id] = schema
        
        if parent_id and parent_id in self.schemas:
            self.schemas[parent_id].children_ids.add(schema.id)
            self.schema_hierarchy[parent_id].add(schema.id)
            # Inherit slots from parent
            parent = self.schemas[parent_id]
            for slot_name, slot in parent.slots.items():
                schema.add_slot(slot_name, slot.slot_type, slot.required, slot.default_value)
        
        return schema
    
    def bind_instance(self, schema_id: str, bindings: Dict[str, Any]) -> Optional[Instance]:
        """Bind an instance to a schema."""
        if schema_id not in self.schemas:
            return None
        
        schema = self.schemas[schema_id]
        match_quality = schema.fill_slots(bindings)
        
        instance = Instance(
            schema_id=schema_id,
            bindings=bindings,
            match_quality=match_quality
        )
        self.instances[instance.id] = instance
        schema.usage_count += 1
        schema.activation = min(1.0, schema.activation + self.learning_rate)
        
        return instance
    
    def find_best_schema(self, bindings: Dict[str, Any]) -> Optional[Tuple[Schema, float]]:
        """Find best matching schema for bindings."""
        best_schema = None
        best_score = 0.0
        
        for schema in self.schemas.values():
            # Create temporary copy to test match
            score = 0.0
            matched = 0
            for slot_name, slot in schema.slots.items():
                if slot_name in bindings:
                    if all(c(bindings[slot_name]) for c in slot.constraints):
                        matched += 1
                        score += PHI_INV if slot.required else PHI_INV * PHI_INV
            
            if schema.slots:
                score *= matched / len(schema.slots)
                score *= schema.activation  # Boost active schemas
            
            if score > best_score:
                best_score = score
                best_schema = schema
        
        return (best_schema, best_score) if best_schema else None
    
    def induce_schema(self, instances: List[Dict[str, Any]], 
                      schema_type: SchemaType = SchemaType.OBJECT) -> Schema:
        """Induce a new schema from example instances."""
        if not instances:
            return self.create_schema("empty_schema", schema_type)
        
        # Find common slots across instances
        all_keys = set()
        key_counts = defaultdict(int)
        key_values = defaultdict(list)
        
        for inst in instances:
            for key, value in inst.items():
                all_keys.add(key)
                key_counts[key] += 1
                key_values[key].append(value)
        
        # Create schema with common slots
        schema = self.create_schema(f"induced_{len(self.schemas)}", schema_type)
        
        for key in all_keys:
            frequency = key_counts[key] / len(instances)
            required = frequency >= self.generalization_threshold
            
            # Infer type from values
            values = key_values[key]
            if all(isinstance(v, (int, float)) for v in values):
                slot_type = "number"
            elif all(isinstance(v, str) for v in values):
                slot_type = "string"
            elif all(isinstance(v, bool) for v in values):
                slot_type = "boolean"
            else:
                slot_type = "any"
            
            schema.add_slot(key, slot_type, required)
        
        # Bind all instances
        for inst in instances:
            self.bind_instance(schema.id, inst)
        
        schema.confidence = len(instances) / (len(instances) + PHI)
        return schema
    
    def generalize_schemas(self, schema_ids: List[str]) -> Optional[Schema]:
        """Generalize multiple schemas into a parent schema."""
        schemas = [self.schemas[sid] for sid in schema_ids if sid in self.schemas]
        if len(schemas) < 2:
            return None
        
        # Find common slots
        common_slots = set(schemas[0].slots.keys())
        for schema in schemas[1:]:
            common_slots &= set(schema.slots.keys())
        
        # Create generalized schema
        general = self.create_schema(
            f"general_{len(self.schemas)}",
            schemas[0].schema_type
        )
        
        for slot_name in common_slots:
            # Use most common configuration
            types = [s.slots[slot_name].slot_type for s in schemas]
            required = all(s.slots[slot_name].required for s in schemas)
            most_common_type = max(set(types), key=types.count)
            general.add_slot(slot_name, most_common_type, required)
        
        # Link as parent
        for schema in schemas:
            schema.parent_id = general.id
            general.children_ids.add(schema.id)
            self.schema_hierarchy[general.id].add(schema.id)
        
        return general
    
    def specialize_schema(self, schema_id: str, 
                          additional_slots: Dict[str, Tuple[str, bool]]) -> Optional[Schema]:
        """Create specialized version of schema with additional slots."""
        if schema_id not in self.schemas:
            return None
        
        parent = self.schemas[schema_id]
        child = self.create_schema(
            f"{parent.name}_specialized",
            parent.schema_type,
            parent_id=schema_id
        )
        
        for slot_name, (slot_type, required) in additional_slots.items():
            child.add_slot(slot_name, slot_type, required)
        
        return child
    
    def merge_schemas(self, schema_id1: str, schema_id2: str) -> Optional[Schema]:
        """Merge two schemas into one."""
        if schema_id1 not in self.schemas or schema_id2 not in self.schemas:
            return None
        
        s1 = self.schemas[schema_id1]
        s2 = self.schemas[schema_id2]
        
        merged = self.create_schema(f"merged_{s1.name}_{s2.name}", s1.schema_type)
        
        # Combine slots
        all_slots = set(s1.slots.keys()) | set(s2.slots.keys())
        for slot_name in all_slots:
            slot1 = s1.slots.get(slot_name)
            slot2 = s2.slots.get(slot_name)
            
            if slot1 and slot2:
                # Both have slot - merge
                required = slot1.required and slot2.required
                slot_type = slot1.slot_type if slot1.slot_type == slot2.slot_type else "any"
            elif slot1:
                required = slot1.required
                slot_type = slot1.slot_type
            else:
                required = slot2.required
                slot_type = slot2.slot_type
            
            merged.add_slot(slot_name, slot_type, required)
        
        merged.confidence = (s1.confidence + s2.confidence) / 2 * PHI_INV
        return merged
    
    def decay_schemas(self, dt: float) -> None:
        """Apply temporal decay to schema activations."""
        for schema in self.schemas.values():
            schema.activation *= math.exp(-dt * PHI_INV * 0.01)
    
    def prune_schemas(self, min_usage: int = 1, min_activation: float = 0.01) -> int:
        """Remove unused or inactive schemas."""
        to_remove = [
            sid for sid, s in self.schemas.items()
            if s.usage_count < min_usage and s.activation < min_activation
            and not s.children_ids  # Don't remove if has children
        ]
        
        for sid in to_remove:
            schema = self.schemas[sid]
            if schema.parent_id and schema.parent_id in self.schemas:
                self.schemas[schema.parent_id].children_ids.discard(sid)
            del self.schemas[sid]
        
        return len(to_remove)
    
    def get_schema_tree(self, schema_id: str) -> Dict[str, Any]:
        """Get hierarchical view of schema and descendants."""
        if schema_id not in self.schemas:
            return {}
        
        schema = self.schemas[schema_id]
        children = [
            self.get_schema_tree(cid)
            for cid in schema.children_ids
            if cid in self.schemas
        ]
        
        return {
            "id": schema.id,
            "name": schema.name,
            "type": schema.schema_type.value,
            "slots": list(schema.slots.keys()),
            "activation": schema.activation,
            "confidence": schema.confidence,
            "usage_count": schema.usage_count,
            "children": children
        }
    
    def get_stats(self) -> Dict[str, Any]:
        """Get schema learning statistics."""
        if not self.schemas:
            return {"total_schemas": 0}
        
        activations = [s.activation for s in self.schemas.values()]
        confidences = [s.confidence for s in self.schemas.values()]
        
        return {
            "total_schemas": len(self.schemas),
            "total_instances": len(self.instances),
            "root_schemas": sum(1 for s in self.schemas.values() if s.parent_id is None),
            "mean_activation": sum(activations) / len(activations),
            "mean_confidence": sum(confidences) / len(confidences),
            "mean_slots": sum(len(s.slots) for s in self.schemas.values()) / len(self.schemas),
            "beat_count": self.beat_count,
            "phi_coherence": sum(s.activation * s.confidence for s in self.schemas.values()) / len(self.schemas) * PHI_INV
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_schema_engine: Optional[SchemaLearningEngine] = None

def get_schema_learning_engine() -> SchemaLearningEngine:
    """Get or create the global schema learning engine."""
    global _schema_engine
    if _schema_engine is None:
        _schema_engine = SchemaLearningEngine()
    return _schema_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "SchemaType", "Slot", "Schema", "Instance",
    "SchemaLearningEngine", "get_schema_learning_engine"
]
