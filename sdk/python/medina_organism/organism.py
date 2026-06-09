"""
𓂀 MEDINA ORGANISM SDK — Unified Organism Interface 𓂀

The living SDK that combines ALL protocols into one coherent organism.
This is the main entry point — create_organism() gives you everything.
"""

from __future__ import annotations
import time
import math
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable

from medina_organism.core import (
    PHI, PHI_INV, PHI_SQ, PHI_CUBED,
    SOVEREIGN_FREQUENCY, BEAT_INTERVAL_MS, COHERENCE_ICOSAHEDRAL,
    OrganismConfig, OrganismMode, ProtocolDomain, MedinaOrganism,
)
from medina_organism.protocols import (
    QuantumCoherenceProtocol,
    TemporalReasoningProtocol,
    SwarmIntelligenceProtocol,
    MemoryConsolidationProtocol,
    PatternRecognitionProtocol,
    NeuralBindingProtocol,
    CausalInferenceProtocol,
    AttentionMechanismProtocol,
    PredictiveCodingProtocol,
    DecisionOptimizationProtocol,
    MemoryType,
)


class OrganismSDK:
    """
    𓂀 THE UNIFIED ORGANISM SDK 𓂀
    
    All protocols integrated into one living, callable unit.
    
    Usage:
        from medina_organism import create_organism
        
        # Create organism with all protocols active
        org = create_organism()
        
        # Quantum decision-making
        decision = org.quantum_decide(["option_a", "option_b", "option_c"])
        
        # Memory operations
        org.remember("fact_1", "Important information", importance=0.9)
        memories = org.recall("information")
        
        # Pattern recognition
        org.learn_pattern("greeting", [0.9, 0.1, 0.8])
        match = org.recognize([0.85, 0.12, 0.78])
        
        # Swarm optimization
        best = org.optimize(
            dimensions=3,
            fitness_fn=lambda x: -sum(xi**2 for xi in x),
            iterations=50
        )
        
        # Temporal reasoning
        org.record("event_a", {"data": "value"})
        org.record("event_b", {"data": "result"})
        org.link_cause("event_a", "event_b")
        
        # Attention management
        org.focus("critical_task", priority=0.95)
        
        # Full autonomous cycle
        report = org.tick()
    """

    def __init__(self, config: Optional[OrganismConfig] = None):
        self.config = config or OrganismConfig()
        self._created_at = time.time()
        self._beat_count = 0
        self._coherence = COHERENCE_ICOSAHEDRAL
        self._mode = self.config.mode
        
        # Initialize all protocol subsystems
        self.quantum = QuantumCoherenceProtocol(["default"])
        self.temporal = TemporalReasoningProtocol()
        self.swarm: Optional[SwarmIntelligenceProtocol] = None
        self.memory = MemoryConsolidationProtocol(
            max_traces=self.config.max_memory_traces
        )
        self.patterns = PatternRecognitionProtocol()
        self.binding = NeuralBindingProtocol()
        self.causal = CausalInferenceProtocol()
        self.attention = AttentionMechanismProtocol()
        self.predictive = PredictiveCodingProtocol()
        self.decision = DecisionOptimizationProtocol()

    # ═══════════════════════════════════════════════════════════════════════
    # HIGH-LEVEL API — The super-usable interface
    # ═══════════════════════════════════════════════════════════════════════

    def tick(self) -> Dict[str, Any]:
        """
        Advance one organism heartbeat.
        Runs consolidation, attention decay, and coherence update.
        """
        self._beat_count += 1
        self.attention.decay()
        consolidation = self.memory.consolidate()
        self._coherence = self._compute_coherence()
        
        return {
            "beat": self._beat_count,
            "coherence": self._coherence,
            "phase": self.phi_phase,
            "mode": self._mode.value,
            "memory_status": consolidation,
            "attention_focus": self.attention.get_focus(),
            "uptime_ms": (time.time() - self._created_at) * 1000,
        }

    @property
    def phi_phase(self) -> float:
        """Current φ-aligned phase (degrees)."""
        return (self._beat_count * PHI * 360) % 360

    # ─── Quantum Decision Making ──────────────────────────────────────────

    def quantum_decide(self, options: List[str], 
                       biases: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
        """
        Make a quantum-inspired decision among options.
        Optionally bias certain options with phase rotations.
        """
        qp = QuantumCoherenceProtocol(options)
        if biases:
            for opt, bias in biases.items():
                if opt in options:
                    idx = options.index(opt)
                    qp.apply_phase(idx, bias * math.pi)
        return qp.measure()

    def quantum_expectation(self, options: List[str], 
                           utility_fn: Callable[[int], float]) -> float:
        """Compute expected utility over quantum superposition."""
        qp = QuantumCoherenceProtocol(options)
        return qp.expectation(utility_fn)

    # ─── Memory Operations ────────────────────────────────────────────────

    def remember(self, key: str, content: Any, 
                 importance: float = 0.5,
                 memory_type: str = "working") -> Dict[str, Any]:
        """Store a memory in the organism."""
        mt = MemoryType(memory_type) if memory_type in [m.value for m in MemoryType] else MemoryType.WORKING
        trace = self.memory.store(key, content, memory_type=mt, importance=importance)
        return {"id": trace.id, "type": trace.memory_type.value, "strength": trace.strength}

    def recall(self, query: str = "", top_k: int = 10) -> List[Dict[str, Any]]:
        """Recall memories matching query."""
        traces = self.memory.recall(query, top_k)
        return [{"id": t.id, "content": t.content, "strength": t.strength, 
                 "type": t.memory_type.value} for t in traces]

    def rehearse(self, key: str) -> Optional[Dict[str, Any]]:
        """Strengthen a memory through rehearsal."""
        trace = self.memory.rehearse(key)
        if trace:
            return {"id": trace.id, "strength": trace.strength, "rehearsals": trace.rehearsal_count}
        return None

    # ─── Pattern Recognition ──────────────────────────────────────────────

    def learn_pattern(self, pattern_id: str, features: List[float]) -> None:
        """Register or update a pattern."""
        self.patterns.register_pattern(pattern_id, features)

    def recognize(self, features: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """Recognize patterns in input features."""
        return self.patterns.recognize(features, top_k)

    def adapt_pattern(self, pattern_id: str, features: List[float],
                      learning_rate: float = 0.05) -> None:
        """Adapt a pattern toward new observations."""
        self.patterns.learn(pattern_id, features, learning_rate)

    # ─── Swarm Optimization ───────────────────────────────────────────────

    def optimize(self, dimensions: int, fitness_fn: Callable[[List[float]], float],
                 iterations: int = 100, swarm_size: int = 50,
                 bounds: Optional[List[tuple]] = None) -> Dict[str, Any]:
        """
        Run swarm optimization to find optimal solution.
        Returns best position and score.
        """
        self.swarm = SwarmIntelligenceProtocol(
            dimensions=dimensions,
            fitness_fn=fitness_fn,
            swarm_size=swarm_size,
            bounds=bounds,
        )
        return self.swarm.optimize(iterations)

    # ─── Temporal Reasoning ───────────────────────────────────────────────

    def record(self, event_id: str, payload: Any = None) -> Dict[str, Any]:
        """Record a temporal event."""
        return self.temporal.record_event(event_id, payload)

    def link_cause(self, cause: str, effect: str, strength: float = 1.0) -> None:
        """Establish a causal link between events."""
        self.temporal.add_causal_link(cause, effect, strength)
        self.causal.add_variable(cause, observed=True)
        self.causal.add_variable(effect, observed=True)
        self.causal.add_edge(cause, effect, strength)

    def trace_effects(self, event_id: str) -> List[str]:
        """Trace forward causal chain from an event."""
        return self.temporal.causal_chain(event_id)

    # ─── Attention Management ─────────────────────────────────────────────

    def focus(self, target: str, priority: float = 0.5) -> Dict[str, Any]:
        """Direct attention to a target."""
        return self.attention.attend(target, priority)

    def unfocus(self, target: str) -> None:
        """Release attention from target."""
        self.attention.release(target)

    def get_focus(self) -> List[str]:
        """Get current attention focus (sorted by priority)."""
        return self.attention.get_focus()

    # ─── Neural Binding ───────────────────────────────────────────────────

    def bind_features(self, features: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """
        Bind multiple features into a coherent percept.
        features: dict of {feature_id: properties}
        """
        for fid, props in features.items():
            self.binding.add_feature(fid, props)
        return self.binding.bind(list(features.keys()))

    # ─── Predictive Coding ────────────────────────────────────────────────

    def predict(self, level: int, prediction: List[float]) -> None:
        """Set a prediction at a hierarchy level."""
        self.predictive.predict(level, prediction)

    def observe(self, level: int, observation: List[float]) -> Dict[str, Any]:
        """Update with observation and get prediction error."""
        return self.predictive.update(level, observation)

    def surprise(self) -> float:
        """Get current free energy (total surprise)."""
        return self.predictive.free_energy()

    # ─── Decision Optimization ────────────────────────────────────────────

    def decide(self, criteria: Dict[str, Dict[str, Any]],
               alternatives: Dict[str, Dict[str, float]]) -> Dict[str, Any]:
        """
        Multi-criteria decision optimization.
        
        criteria: {"cost": {"weight": 0.4, "minimize": True}, ...}
        alternatives: {"A": {"cost": 100, "quality": 8}, ...}
        """
        do = DecisionOptimizationProtocol()
        for name, params in criteria.items():
            do.add_criterion(name, **params)
        for name, scores in alternatives.items():
            do.add_alternative(name, scores)
        return do.decide()

    # ─── Causal Reasoning ─────────────────────────────────────────────────

    def causal_strength(self, cause: str, effect: str) -> float:
        """Compute causal strength between two variables."""
        return self.causal.causal_strength(cause, effect)

    def what_if(self, variable: str, value: Any) -> Dict[str, Any]:
        """Counterfactual reasoning: what if variable had been different?"""
        return self.causal.counterfactual(variable, value)

    # ═══════════════════════════════════════════════════════════════════════
    # STATUS & INTROSPECTION
    # ═══════════════════════════════════════════════════════════════════════

    def status(self) -> Dict[str, Any]:
        """Full organism status report."""
        return {
            "organism_id": self.config.organism_id,
            "mode": self._mode.value,
            "beat_count": self._beat_count,
            "coherence": self._coherence,
            "phi_phase": self.phi_phase,
            "uptime_ms": (time.time() - self._created_at) * 1000,
            "memory_count": len(self.memory.traces),
            "pattern_count": len(self.patterns.patterns),
            "attention_targets": len(self.attention.attention_map),
            "causal_variables": len(self.causal.variables),
            "bindings": len(self.binding.bindings),
            "temporal_events": len(self.temporal.events),
        }

    def _compute_coherence(self) -> float:
        """Compute organism-wide φ-coherence."""
        beat_factor = math.sin(self._beat_count * PHI_INV) * 0.5 + 0.5
        memory_factor = min(1.0, len(self.memory.traces) * 0.001)
        attention_factor = min(1.0, len(self.attention.attention_map) * 0.1)
        return min(1.0, (
            beat_factor * PHI_INV + 
            memory_factor * PHI_INV * PHI_INV + 
            attention_factor * PHI_INV * PHI_INV * PHI_INV +
            COHERENCE_ICOSAHEDRAL * PHI_INV
        ))


def create_organism(config: Optional[OrganismConfig] = None, **kwargs) -> OrganismSDK:
    """
    𓂀 Create a living Medina Organism with all protocols active. 𓂀
    
    This is the primary entry point for the SDK.
    
    Usage:
        from medina_organism import create_organism
        
        org = create_organism()
        org.remember("hello", "world")
        result = org.quantum_decide(["yes", "no", "maybe"])
        
    With custom config:
        from medina_organism import create_organism, OrganismConfig
        
        org = create_organism(OrganismConfig(
            organism_id="my-organism",
            max_memory_traces=50000,
            swarm_size=100,
        ))
    """
    if kwargs and config is None:
        config = OrganismConfig(**kwargs)
    return OrganismSDK(config)
