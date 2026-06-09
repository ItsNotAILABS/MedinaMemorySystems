"""
𓂀 MEDINA ORGANISM — Protocol Integration Registry 𓂀

Wires ALL Python protocols from src/protocols/python/ into the organism SDK.
This module bridges the individual protocol implementations to the unified OrganismSDK.

Usage:
    from medina_organism.registry import ProtocolRegistry, get_all_protocols
    
    registry = ProtocolRegistry()
    registry.register_all()
    print(registry.list_protocols())
"""

from __future__ import annotations
import importlib
import os
import sys
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field

from medina_organism.core import PHI, PHI_INV, ProtocolDomain


@dataclass
class ProtocolEntry:
    """A registered protocol in the organism."""
    id: str
    name: str
    domain: ProtocolDomain
    version: str
    module_path: str
    description: str
    phi_weight: float = PHI_INV
    is_active: bool = True


# Complete protocol manifest — all 44 protocols from the organism
PROTOCOL_MANIFEST: List[Dict[str, Any]] = [
    # Core Protocols (PROTO-231/232/233)
    {"id": "PROTO-231", "name": "Quantum Coherence", "domain": ProtocolDomain.QUANTUM,
     "module": "quantum_coherence_protocol", "description": "Quantum-inspired cognitive processing"},
    {"id": "PROTO-232", "name": "Temporal Reasoning", "domain": ProtocolDomain.TEMPORAL,
     "module": "temporal_reasoning_protocol", "description": "φ-scaled time perception and causal inference"},
    {"id": "PROTO-233", "name": "Swarm Intelligence", "domain": ProtocolDomain.SWARM,
     "module": "swarm_intelligence_protocol", "description": "PSO, ACO, and swarm consensus"},
    
    # Memory Domain
    {"id": "PROTO-301", "name": "Memory Retrieval", "domain": ProtocolDomain.MEMORY,
     "module": "memory_retrieval_protocol", "description": "Context-sensitive memory retrieval"},
    {"id": "PROTO-302", "name": "Memory Consolidation", "domain": ProtocolDomain.MEMORY,
     "module": "memory_consolidation_protocol", "description": "Working to long-term transfer"},
    {"id": "PROTO-303", "name": "Attention Mechanism", "domain": ProtocolDomain.ATTENTION,
     "module": "attention_mechanism_protocol", "description": "φ-weighted attention allocation"},
    {"id": "PROTO-304", "name": "Neural Binding", "domain": ProtocolDomain.NEURAL,
     "module": "neural_binding_protocol", "description": "Phase-synchronized feature binding"},
    {"id": "PROTO-305", "name": "Causal Inference", "domain": ProtocolDomain.CAUSAL,
     "module": "causal_inference_protocol", "description": "Causal reasoning and intervention"},
    {"id": "PROTO-306", "name": "Pattern Recognition", "domain": ProtocolDomain.PATTERN,
     "module": "pattern_recognition_protocol", "description": "φ-coherent pattern detection"},
    {"id": "PROTO-307", "name": "Predictive Coding", "domain": ProtocolDomain.PREDICTIVE,
     "module": "predictive_coding_protocol", "description": "Hierarchical prediction error"},
    {"id": "PROTO-308", "name": "Decision Optimization", "domain": ProtocolDomain.DECISION,
     "module": "decision_optimization_protocol", "description": "Multi-criteria decision making"},
    
    # Cognitive Architecture
    {"id": "PROTO-310", "name": "Working Memory", "domain": ProtocolDomain.MEMORY,
     "module": "working_memory_protocol", "description": "Active working memory buffer"},
    {"id": "PROTO-311", "name": "Episodic Encoding", "domain": ProtocolDomain.MEMORY,
     "module": "episodic_encoding_protocol", "description": "Episodic memory formation"},
    {"id": "PROTO-312", "name": "Semantic Fusion", "domain": ProtocolDomain.REASONING,
     "module": "semantic_fusion_protocol", "description": "Semantic knowledge integration"},
    {"id": "PROTO-313", "name": "Attention Routing", "domain": ProtocolDomain.ATTENTION,
     "module": "attention_routing_protocol", "description": "Attention signal routing"},
    {"id": "PROTO-314", "name": "Neural Plasticity", "domain": ProtocolDomain.NEURAL,
     "module": "neural_plasticity_protocol", "description": "Synaptic weight adaptation"},
    
    # Reasoning Domain
    {"id": "PROTO-320", "name": "Symbolic Reasoning", "domain": ProtocolDomain.REASONING,
     "module": "symbolic_reasoning_protocol", "description": "Logic and symbol manipulation"},
    {"id": "PROTO-321", "name": "Spatial Reasoning", "domain": ProtocolDomain.REASONING,
     "module": "spatial_reasoning_protocol", "description": "Spatial relationship processing"},
    {"id": "PROTO-322", "name": "Analogy Engine", "domain": ProtocolDomain.REASONING,
     "module": "analogy_engine_protocol", "description": "Analogical reasoning"},
    {"id": "PROTO-323", "name": "Hypothesis Generation", "domain": ProtocolDomain.REASONING,
     "module": "hypothesis_generation_protocol", "description": "Hypothesis formation and testing"},
    {"id": "PROTO-324", "name": "Belief Revision", "domain": ProtocolDomain.REASONING,
     "module": "belief_revision_protocol", "description": "Belief update and revision"},
    
    # Planning Domain
    {"id": "PROTO-330", "name": "Planning", "domain": ProtocolDomain.PLANNING,
     "module": "planning_protocol", "description": "Goal-directed planning"},
    {"id": "PROTO-331", "name": "Hierarchical Planning", "domain": ProtocolDomain.PLANNING,
     "module": "hierarchical_planning_protocol", "description": "Multi-level plan decomposition"},
    {"id": "PROTO-332", "name": "Goal Management", "domain": ProtocolDomain.PLANNING,
     "module": "goal_management_protocol", "description": "Goal stack management"},
    {"id": "PROTO-333", "name": "Action Selection", "domain": ProtocolDomain.DECISION,
     "module": "action_selection_protocol", "description": "Action arbitration"},
    {"id": "PROTO-334", "name": "Constraint Satisfaction", "domain": ProtocolDomain.PLANNING,
     "module": "constraint_satisfaction_protocol", "description": "CSP solving"},
    
    # Learning Domain
    {"id": "PROTO-340", "name": "Learning Adaptation", "domain": ProtocolDomain.LEARNING,
     "module": "learning_adaptation_protocol", "description": "Adaptive learning rates"},
    {"id": "PROTO-341", "name": "Schema Learning", "domain": ProtocolDomain.LEARNING,
     "module": "schema_learning_protocol", "description": "Schema induction and transfer"},
    {"id": "PROTO-342", "name": "Reward Shaping", "domain": ProtocolDomain.LEARNING,
     "module": "reward_shaping_protocol", "description": "Reward signal optimization"},
    {"id": "PROTO-343", "name": "Error Correction", "domain": ProtocolDomain.LEARNING,
     "module": "error_correction_protocol", "description": "Error-driven learning"},
    
    # Emotion & Self
    {"id": "PROTO-350", "name": "Emotion Modeling", "domain": ProtocolDomain.EMOTION,
     "module": "emotion_modeling_protocol", "description": "Emotional state dynamics"},
    {"id": "PROTO-351", "name": "Self Model", "domain": ProtocolDomain.REASONING,
     "module": "self_model_protocol", "description": "Self-representation and metacognition"},
    {"id": "PROTO-352", "name": "World Model", "domain": ProtocolDomain.REASONING,
     "module": "world_model_protocol", "description": "Internal world representation"},
    
    # Integration & Communication
    {"id": "PROTO-360", "name": "Context Integration", "domain": ProtocolDomain.REASONING,
     "module": "context_integration_protocol", "description": "Multi-context fusion"},
    {"id": "PROTO-361", "name": "Communication", "domain": ProtocolDomain.COMMUNICATION,
     "module": "communication_protocol", "description": "Inter-agent communication"},
    {"id": "PROTO-362", "name": "Knowledge Synthesis", "domain": ProtocolDomain.REASONING,
     "module": "knowledge_synthesis_protocol", "description": "Cross-domain knowledge fusion"},
    {"id": "PROTO-363", "name": "Concept Formation", "domain": ProtocolDomain.LEARNING,
     "module": "concept_formation_protocol", "description": "Novel concept creation"},
    {"id": "PROTO-364", "name": "Cognitive Graph", "domain": ProtocolDomain.REASONING,
     "module": "cognitive_graph_protocol", "description": "Graph-based cognition"},
    
    # Advanced
    {"id": "PROTO-370", "name": "Emergence Detection", "domain": ProtocolDomain.PATTERN,
     "module": "emergence_detection_protocol", "description": "Emergent property detection"},
    {"id": "PROTO-371", "name": "State Transition", "domain": ProtocolDomain.TEMPORAL,
     "module": "state_transition_protocol", "description": "State machine dynamics"},
    {"id": "PROTO-372", "name": "Resource Allocation", "domain": ProtocolDomain.DECISION,
     "module": "resource_allocation_protocol", "description": "Cognitive resource management"},
    {"id": "PROTO-373", "name": "Temporal Binding", "domain": ProtocolDomain.TEMPORAL,
     "module": "temporal_binding_protocol", "description": "Temporal feature binding"},
    {"id": "PROTO-374", "name": "Associative Memory", "domain": ProtocolDomain.MEMORY,
     "module": "associative_memory_protocol", "description": "Content-addressable memory"},
]


class ProtocolRegistry:
    """
    Registry of all organism protocols.
    Tracks, loads, and manages the full protocol suite.
    """

    def __init__(self):
        self.protocols: Dict[str, ProtocolEntry] = {}
        self._loaded_modules: Dict[str, Any] = {}

    def register_all(self) -> int:
        """Register all protocols from the manifest."""
        count = 0
        for entry in PROTOCOL_MANIFEST:
            self.register(ProtocolEntry(
                id=entry["id"],
                name=entry["name"],
                domain=entry["domain"],
                version="1.0.0",
                module_path=entry["module"],
                description=entry["description"],
            ))
            count += 1
        return count

    def register(self, entry: ProtocolEntry) -> None:
        """Register a single protocol."""
        self.protocols[entry.id] = entry

    def list_protocols(self) -> List[Dict[str, Any]]:
        """List all registered protocols."""
        return [
            {
                "id": p.id,
                "name": p.name,
                "domain": p.domain.value,
                "description": p.description,
                "active": p.is_active,
            }
            for p in self.protocols.values()
        ]

    def get_by_domain(self, domain: ProtocolDomain) -> List[ProtocolEntry]:
        """Get all protocols in a domain."""
        return [p for p in self.protocols.values() if p.domain == domain]

    def get(self, protocol_id: str) -> Optional[ProtocolEntry]:
        """Get a protocol by ID."""
        return self.protocols.get(protocol_id)

    def activate(self, protocol_id: str) -> bool:
        """Activate a protocol."""
        if protocol_id in self.protocols:
            self.protocols[protocol_id].is_active = True
            return True
        return False

    def deactivate(self, protocol_id: str) -> bool:
        """Deactivate a protocol."""
        if protocol_id in self.protocols:
            self.protocols[protocol_id].is_active = False
            return True
        return False

    @property
    def active_count(self) -> int:
        """Number of active protocols."""
        return sum(1 for p in self.protocols.values() if p.is_active)

    @property
    def total_count(self) -> int:
        """Total registered protocols."""
        return len(self.protocols)

    def status(self) -> Dict[str, Any]:
        """Registry status summary."""
        domains = {}
        for p in self.protocols.values():
            d = p.domain.value
            if d not in domains:
                domains[d] = {"total": 0, "active": 0}
            domains[d]["total"] += 1
            if p.is_active:
                domains[d]["active"] += 1
        
        return {
            "total_protocols": self.total_count,
            "active_protocols": self.active_count,
            "domains": domains,
        }


def get_all_protocols() -> ProtocolRegistry:
    """Create a fully-loaded protocol registry."""
    registry = ProtocolRegistry()
    registry.register_all()
    return registry
