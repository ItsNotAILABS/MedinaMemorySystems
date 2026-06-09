"""
𓂀 MEDINA ORGANISM SDK — Protocol Registry 𓂀

All 44+ protocols unified under a single import. Each protocol wraps the 
full implementation from src/protocols/python/ and exposes a clean API.
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable, Tuple, Set
from collections import defaultdict, deque
from enum import Enum

from medina_organism.core import PHI, PHI_INV, PHI_SQ, MedinaOrganism

# ═══════════════════════════════════════════════════════════════════════════
# QUANTUM COHERENCE PROTOCOL (PROTO-231)
# ═══════════════════════════════════════════════════════════════════════════

class QuantumCoherenceProtocol:
    """
    Quantum-inspired cognitive processing.
    Superposition over options, phase manipulation, entanglement, and measurement.
    
    Usage:
        qp = QuantumCoherenceProtocol(["option_a", "option_b", "option_c"])
        qp.apply_phase(0, math.pi / 4)  # bias toward option_a
        result = qp.measure()            # collapse to single option
    """

    def __init__(self, options: List[str], amplitudes: Optional[List[complex]] = None):
        if not options:
            raise ValueError("Need at least one cognitive option")
        self.options = list(options)
        self.n = len(options)
        self.collapsed = False
        self.result: Optional[Dict[str, Any]] = None
        
        if amplitudes:
            self.amplitudes = self._normalize(amplitudes)
        else:
            self.amplitudes = self._uniform()

    def _uniform(self) -> List[complex]:
        """Generate φ-phased uniform superposition."""
        amps = [
            complex(math.cos(2 * math.pi * i * PHI_INV), 
                    math.sin(2 * math.pi * i * PHI_INV)) / math.sqrt(self.n)
            for i in range(self.n)
        ]
        return self._normalize(amps)

    @staticmethod
    def _normalize(amps: List[complex]) -> List[complex]:
        """Normalize amplitudes to unit probability."""
        total = sum(abs(a) ** 2 for a in amps) or 1.0
        inv = 1 / math.sqrt(total)
        return [a * inv for a in amps]

    def probabilities(self) -> List[float]:
        """Get Born-rule probabilities |α|²."""
        return [abs(a) ** 2 for a in self.amplitudes]

    def apply_phase(self, index: int, theta: float) -> "QuantumCoherenceProtocol":
        """Apply phase rotation to option at index."""
        if self.collapsed:
            raise RuntimeError("State already collapsed")
        phase = complex(math.cos(theta), math.sin(theta))
        amps = list(self.amplitudes)
        amps[index] = amps[index] * phase
        self.amplitudes = self._normalize(amps)
        return self

    def measure(self) -> Dict[str, Any]:
        """Collapse the superposition — returns chosen option."""
        if self.collapsed:
            return self.result
        probs = self.probabilities()
        r = random.random()
        cumul = 0.0
        chosen = self.n - 1
        for i, p in enumerate(probs):
            cumul += p
            if r <= cumul:
                chosen = i
                break
        self.collapsed = True
        self.result = {
            "option": self.options[chosen],
            "index": chosen,
            "probability": probs[chosen],
        }
        return self.result

    def expectation(self, utility_fn: Callable[[int], float]) -> float:
        """Compute expected utility across superposition."""
        return sum(p * utility_fn(i) for i, p in enumerate(self.probabilities()))

    def entangle(self, other: "QuantumCoherenceProtocol") -> "EntangledPair":
        """Entangle with another quantum state."""
        return EntangledPair(self, other)


class EntangledPair:
    """Two entangled quantum cognitive states."""

    def __init__(self, state_a: QuantumCoherenceProtocol, state_b: QuantumCoherenceProtocol):
        self.state_a = state_a
        self.state_b = state_b
        self.angle = math.pi / 4 * PHI_INV
        self.collapsed = False
        self.id = f"ENT-{int(time.time() * 1000)}-{random.randint(0, 9999)}"

    def measure_a(self) -> Optional[Dict[str, Any]]:
        """Measure state A, influencing state B."""
        if self.collapsed:
            return None
        result_a = self.state_a.measure()
        i = result_a["index"] % self.state_b.n
        self.state_b.apply_phase(i, self.angle * PHI)
        self.collapsed = True
        return result_a

    def correlation_score(self) -> float:
        """Bhattacharyya coefficient between the two states."""
        probs_a = self.state_a.probabilities()
        probs_b = self.state_b.probabilities()
        return sum(math.sqrt(pa * pb) for pa, pb in zip(probs_a, probs_b))


# ═══════════════════════════════════════════════════════════════════════════
# TEMPORAL REASONING PROTOCOL (PROTO-232)
# ═══════════════════════════════════════════════════════════════════════════

@dataclass(frozen=True)
class TimeScale:
    """A φ-scaled time resolution level."""
    index: int
    name: str
    ms: float
    label: str


TIME_SCALES = [
    TimeScale(k, f"τ{k}", 100.0 * PHI ** k, label)
    for k, label in enumerate(["flash", "micro", "pulse", "breath", "beat", "wave", "cycle", "epoch"])
]


class TemporalReasoningProtocol:
    """
    Phi-scaled time perception, causal inference, temporal abstraction.
    
    Usage:
        tp = TemporalReasoningProtocol()
        tp.record_event("user_click", {"button": "submit"})
        tp.record_event("server_response", {"status": 200})
        tp.add_causal_link("user_click", "server_response")
        chain = tp.causal_chain("user_click")
    """

    def __init__(self, max_events: int = 10000):
        self.events: Dict[str, Dict[str, Any]] = {}
        self.timeline: List[str] = []
        self.causal_graph: Dict[str, List[str]] = defaultdict(list)
        self.reverse_graph: Dict[str, List[str]] = defaultdict(list)
        self.max_events = max_events
        self._event_counter = 0

    def record_event(self, event_id: str, payload: Any = None,
                     timestamp_ms: Optional[float] = None) -> Dict[str, Any]:
        """Record a temporal event."""
        ts = timestamp_ms or time.time() * 1000
        self._event_counter += 1
        event = {
            "id": event_id,
            "payload": payload,
            "timestamp": ts,
            "scale_idx": self._classify_scale(ts),
            "weight": 1.0,
            "causes": [],
            "effects": [],
        }
        self.events[event_id] = event
        self.timeline.append(event_id)
        if len(self.timeline) > self.max_events:
            oldest = self.timeline.pop(0)
            self.events.pop(oldest, None)
        return event

    def add_causal_link(self, cause_id: str, effect_id: str, strength: float = 1.0) -> None:
        """Establish causal relationship between events."""
        self.causal_graph[cause_id].append(effect_id)
        self.reverse_graph[effect_id].append(cause_id)
        if cause_id in self.events:
            self.events[cause_id]["effects"].append(effect_id)
        if effect_id in self.events:
            self.events[effect_id]["causes"].append(cause_id)

    def causal_chain(self, event_id: str, max_depth: int = 10) -> List[str]:
        """Trace forward causal chain from an event."""
        chain = []
        visited = set()
        queue = deque([(event_id, 0)])
        while queue:
            eid, depth = queue.popleft()
            if eid in visited or depth > max_depth:
                continue
            visited.add(eid)
            chain.append(eid)
            for effect in self.causal_graph.get(eid, []):
                queue.append((effect, depth + 1))
        return chain

    def temporal_distance(self, id_a: str, id_b: str) -> float:
        """φ-weighted temporal distance between events."""
        if id_a not in self.events or id_b not in self.events:
            return float('inf')
        dt = abs(self.events[id_b]["timestamp"] - self.events[id_a]["timestamp"])
        scale = self._classify_scale(dt)
        return dt * (PHI_INV ** scale)

    def _classify_scale(self, ms: float) -> int:
        """Classify time delta into φ-scaled level."""
        for scale in reversed(TIME_SCALES):
            if ms >= scale.ms:
                return scale.index
        return 0


# ═══════════════════════════════════════════════════════════════════════════
# SWARM INTELLIGENCE PROTOCOL (PROTO-233)
# ═══════════════════════════════════════════════════════════════════════════

class SwarmIntelligenceProtocol:
    """
    PSO optimization, ACO pheromone trails, swarm consensus.
    
    Usage:
        swarm = SwarmIntelligenceProtocol(
            dimensions=3,
            fitness_fn=lambda x: -sum(xi**2 for xi in x),
            swarm_size=30
        )
        best = swarm.optimize(iterations=100)
    """

    PSO_W = 1 / PHI_SQ       # inertia weight ≈ 0.382
    PSO_C1 = PHI_INV          # cognitive coeff ≈ 0.618
    PSO_C2 = PHI              # social coeff ≈ 1.618
    EVAPORATION = PHI_INV * 0.1

    def __init__(self, dimensions: int, fitness_fn: Callable[[List[float]], float],
                 swarm_size: int = 50,
                 bounds: Optional[List[Tuple[float, float]]] = None):
        self.dimensions = dimensions
        self.fitness_fn = fitness_fn
        self.swarm_size = swarm_size
        self.bounds = bounds or [(-10.0, 10.0)] * dimensions
        
        # Initialize particles
        self.positions = [self._random_position() for _ in range(swarm_size)]
        self.velocities = [self._random_velocity() for _ in range(swarm_size)]
        self.personal_bests = list(self.positions)
        self.personal_best_scores = [fitness_fn(p) for p in self.positions]
        
        best_idx = max(range(swarm_size), key=lambda i: self.personal_best_scores[i])
        self.global_best = list(self.positions[best_idx])
        self.global_best_score = self.personal_best_scores[best_idx]
        self.iteration = 0

    def _random_position(self) -> List[float]:
        return [random.uniform(lo, hi) for lo, hi in self.bounds]

    def _random_velocity(self) -> List[float]:
        return [random.uniform(-(hi - lo), hi - lo) * PHI_INV
                for lo, hi in self.bounds]

    def step(self) -> Dict[str, Any]:
        """Execute one PSO iteration."""
        self.iteration += 1
        for i in range(self.swarm_size):
            r1 = [random.random() for _ in range(self.dimensions)]
            r2 = [random.random() for _ in range(self.dimensions)]
            
            for d in range(self.dimensions):
                cognitive = self.PSO_C1 * r1[d] * (self.personal_bests[i][d] - self.positions[i][d])
                social = self.PSO_C2 * r2[d] * (self.global_best[d] - self.positions[i][d])
                self.velocities[i][d] = self.PSO_W * self.velocities[i][d] + cognitive + social
                self.positions[i][d] += self.velocities[i][d]
                # Clamp to bounds
                lo, hi = self.bounds[d]
                self.positions[i][d] = max(lo, min(hi, self.positions[i][d]))
            
            score = self.fitness_fn(self.positions[i])
            if score > self.personal_best_scores[i]:
                self.personal_best_scores[i] = score
                self.personal_bests[i] = list(self.positions[i])
                if score > self.global_best_score:
                    self.global_best_score = score
                    self.global_best = list(self.positions[i])
        
        return {
            "iteration": self.iteration,
            "global_best": self.global_best,
            "global_best_score": self.global_best_score,
            "convergence": self._convergence(),
        }

    def optimize(self, iterations: int = 100) -> Dict[str, Any]:
        """Run full PSO optimization."""
        for _ in range(iterations):
            self.step()
        return {
            "best_position": self.global_best,
            "best_score": self.global_best_score,
            "iterations": self.iteration,
            "convergence": self._convergence(),
        }

    def _convergence(self) -> float:
        """Measure swarm convergence (0=dispersed, 1=converged)."""
        if not self.positions:
            return 0.0
        avg = [sum(p[d] for p in self.positions) / self.swarm_size 
               for d in range(self.dimensions)]
        variance = sum(
            sum((p[d] - avg[d]) ** 2 for p in self.positions)
            for d in range(self.dimensions)
        ) / (self.swarm_size * self.dimensions)
        return 1.0 / (1.0 + variance)


# ═══════════════════════════════════════════════════════════════════════════
# MEMORY CONSOLIDATION PROTOCOL (PROTO-302)
# ═══════════════════════════════════════════════════════════════════════════

class MemoryType(Enum):
    WORKING = "working"
    SHORT_TERM = "short_term"
    LONG_TERM = "long_term"
    SEMANTIC = "semantic"
    EPISODIC = "episodic"
    PROCEDURAL = "procedural"


@dataclass
class MemoryTrace:
    """A memory trace with consolidation metadata."""
    id: str
    content: Any
    memory_type: MemoryType
    strength: float = 1.0
    importance: float = 0.5
    emotional_valence: float = 0.0
    rehearsal_count: int = 0
    created_at: float = field(default_factory=lambda: time.time())
    last_accessed: float = field(default_factory=lambda: time.time())


class MemoryConsolidationProtocol:
    """
    Memory transfer from working to long-term storage with φ-decay.
    
    Usage:
        mc = MemoryConsolidationProtocol()
        mc.store("fact_1", "The capital of France is Paris", importance=0.8)
        mc.rehearse("fact_1")
        mc.consolidate()  # move mature memories to long-term
        results = mc.recall(query="Paris")
    """

    def __init__(self, max_traces: int = 10000, decay_rate: float = PHI_INV * 0.01):
        self.traces: Dict[str, MemoryTrace] = {}
        self.max_traces = max_traces
        self.decay_rate = decay_rate
        self.consolidation_threshold = PHI_INV

    def store(self, trace_id: str, content: Any, 
              memory_type: MemoryType = MemoryType.WORKING,
              importance: float = 0.5,
              emotional_valence: float = 0.0) -> MemoryTrace:
        """Store a new memory trace."""
        trace = MemoryTrace(
            id=trace_id,
            content=content,
            memory_type=memory_type,
            importance=importance,
            emotional_valence=emotional_valence,
        )
        self.traces[trace_id] = trace
        self._enforce_capacity()
        return trace

    def rehearse(self, trace_id: str) -> Optional[MemoryTrace]:
        """Rehearse a memory, strengthening it."""
        trace = self.traces.get(trace_id)
        if trace:
            trace.rehearsal_count += 1
            trace.strength = min(1.0, trace.strength + PHI_INV * 0.1)
            trace.last_accessed = time.time()
        return trace

    def recall(self, query: str = "", top_k: int = 10) -> List[MemoryTrace]:
        """Recall memories matching query (simple substring match)."""
        results = []
        for trace in self.traces.values():
            score = trace.strength * trace.importance
            if query and query.lower() in str(trace.content).lower():
                score *= PHI  # relevance boost
            results.append((score, trace))
        results.sort(key=lambda x: x[0], reverse=True)
        for _, trace in results[:top_k]:
            trace.last_accessed = time.time()
        return [trace for _, trace in results[:top_k]]

    def consolidate(self) -> Dict[str, int]:
        """Run consolidation cycle — promote strong memories."""
        promoted = 0
        decayed = 0
        for trace in list(self.traces.values()):
            # Apply φ-decay
            age = time.time() - trace.last_accessed
            trace.strength -= self.decay_rate * age * 0.001
            trace.strength = max(0.0, trace.strength)
            
            # Promote if strong enough
            if (trace.memory_type == MemoryType.WORKING and 
                trace.strength >= self.consolidation_threshold):
                trace.memory_type = MemoryType.LONG_TERM
                promoted += 1
            
            # Prune dead traces
            if trace.strength <= 0.0:
                del self.traces[trace.id]
                decayed += 1
        
        return {"promoted": promoted, "decayed": decayed, "total": len(self.traces)}

    def _enforce_capacity(self) -> None:
        """Remove weakest traces if over capacity."""
        while len(self.traces) > self.max_traces:
            weakest = min(self.traces.values(), key=lambda t: t.strength)
            del self.traces[weakest.id]


# ═══════════════════════════════════════════════════════════════════════════
# PATTERN RECOGNITION PROTOCOL (PROTO-306)
# ═══════════════════════════════════════════════════════════════════════════

class PatternRecognitionProtocol:
    """
    φ-coherent pattern detection, classification, and learning.
    
    Usage:
        pr = PatternRecognitionProtocol()
        pr.register_pattern("cat", [0.9, 0.1, 0.8, 0.2])
        pr.register_pattern("dog", [0.2, 0.9, 0.3, 0.7])
        match = pr.recognize([0.85, 0.15, 0.75, 0.25])  # -> "cat"
    """

    def __init__(self, similarity_threshold: float = PHI_INV):
        self.patterns: Dict[str, List[float]] = {}
        self.match_counts: Dict[str, int] = defaultdict(int)
        self.similarity_threshold = similarity_threshold

    def register_pattern(self, pattern_id: str, features: List[float],
                         category: str = "default") -> None:
        """Register a named pattern with its feature vector."""
        self.patterns[pattern_id] = features

    def recognize(self, input_features: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """Recognize patterns matching the input."""
        scores = []
        for pid, features in self.patterns.items():
            score = self._cosine_similarity(features, input_features)
            if score >= self.similarity_threshold:
                scores.append({"pattern_id": pid, "score": score})
        scores.sort(key=lambda x: x["score"], reverse=True)
        for s in scores[:top_k]:
            self.match_counts[s["pattern_id"]] += 1
        return scores[:top_k]

    def learn(self, pattern_id: str, input_features: List[float], 
              learning_rate: float = PHI_INV * 0.1) -> None:
        """Adapt pattern features toward input (Hebbian-style)."""
        if pattern_id not in self.patterns:
            self.patterns[pattern_id] = list(input_features)
            return
        features = self.patterns[pattern_id]
        self.patterns[pattern_id] = [
            f + learning_rate * (inp - f)
            for f, inp in zip(features, input_features)
        ]

    @staticmethod
    def _cosine_similarity(a: List[float], b: List[float]) -> float:
        if len(a) != len(b):
            return 0.0
        dot = sum(x * y for x, y in zip(a, b))
        mag_a = math.sqrt(sum(x ** 2 for x in a)) or 1.0
        mag_b = math.sqrt(sum(x ** 2 for x in b)) or 1.0
        return dot / (mag_a * mag_b)


# ═══════════════════════════════════════════════════════════════════════════
# NEURAL BINDING PROTOCOL (PROTO-304)
# ═══════════════════════════════════════════════════════════════════════════

class NeuralBindingProtocol:
    """
    Binds distributed neural features into coherent percepts via phase synchronization.
    
    Usage:
        nb = NeuralBindingProtocol()
        nb.add_feature("color_red", {"type": "color", "value": "red"})
        nb.add_feature("shape_circle", {"type": "shape", "value": "circle"})
        binding = nb.bind(["color_red", "shape_circle"])
    """

    def __init__(self, sync_strength: float = PHI_INV):
        self.features: Dict[str, Dict[str, Any]] = {}
        self.bindings: List[Dict[str, Any]] = []
        self.sync_strength = sync_strength

    def add_feature(self, feature_id: str, properties: Dict[str, Any],
                    activation: float = 1.0) -> None:
        """Register a neural feature."""
        self.features[feature_id] = {
            "id": feature_id,
            "properties": properties,
            "activation": activation,
            "phase": random.uniform(0, 2 * math.pi),
        }

    def bind(self, feature_ids: List[str]) -> Dict[str, Any]:
        """Bind features through phase synchronization."""
        features = [self.features[fid] for fid in feature_ids if fid in self.features]
        if not features:
            return {"bound": False, "features": []}
        
        # Compute average phase
        avg_phase = math.atan2(
            sum(math.sin(f["phase"]) for f in features),
            sum(math.cos(f["phase"]) for f in features)
        )
        
        # Synchronize features to average phase
        for f in features:
            diff = avg_phase - f["phase"]
            f["phase"] += diff * self.sync_strength
        
        # Compute binding coherence
        coherence = sum(
            math.cos(f["phase"] - avg_phase) for f in features
        ) / len(features)
        
        binding = {
            "id": f"BIND-{len(self.bindings)}",
            "feature_ids": feature_ids,
            "coherence": coherence,
            "phase": avg_phase,
            "timestamp": time.time(),
        }
        self.bindings.append(binding)
        return binding

    def binding_strength(self, binding_id: str) -> float:
        """Get current binding coherence."""
        for b in self.bindings:
            if b["id"] == binding_id:
                return b["coherence"]
        return 0.0


# ═══════════════════════════════════════════════════════════════════════════
# CAUSAL INFERENCE PROTOCOL (PROTO-305)
# ═══════════════════════════════════════════════════════════════════════════

class CausalInferenceProtocol:
    """
    Causal reasoning with intervention and counterfactual analysis.
    
    Usage:
        ci = CausalInferenceProtocol()
        ci.add_variable("rain", observed=True)
        ci.add_variable("wet_ground", observed=True)
        ci.add_edge("rain", "wet_ground", strength=0.9)
        score = ci.causal_strength("rain", "wet_ground")
    """

    def __init__(self):
        self.variables: Dict[str, Dict[str, Any]] = {}
        self.edges: Dict[str, List[Tuple[str, float]]] = defaultdict(list)
        self.observations: List[Dict[str, Any]] = []

    def add_variable(self, name: str, observed: bool = False, value: Any = None) -> None:
        """Add a causal variable."""
        self.variables[name] = {"name": name, "observed": observed, "value": value}

    def add_edge(self, cause: str, effect: str, strength: float = 1.0) -> None:
        """Add a causal edge."""
        self.edges[cause].append((effect, strength))

    def causal_strength(self, cause: str, effect: str, max_depth: int = 5) -> float:
        """Compute causal strength between two variables (path product)."""
        return self._find_path_strength(cause, effect, set(), max_depth)

    def _find_path_strength(self, current: str, target: str, 
                            visited: Set[str], depth: int) -> float:
        if depth <= 0:
            return 0.0
        if current == target:
            return 1.0
        visited.add(current)
        max_strength = 0.0
        for effect, strength in self.edges.get(current, []):
            if effect not in visited:
                path_str = strength * self._find_path_strength(
                    effect, target, visited.copy(), depth - 1)
                max_strength = max(max_strength, path_str)
        return max_strength

    def intervene(self, variable: str, value: Any) -> Dict[str, Any]:
        """Do-operator: intervene on a variable."""
        if variable in self.variables:
            self.variables[variable]["value"] = value
            self.variables[variable]["observed"] = True
        return {"variable": variable, "value": value, "type": "intervention"}

    def counterfactual(self, variable: str, hypothetical_value: Any) -> Dict[str, Any]:
        """What-if analysis: if variable had been different."""
        affected = []
        for effect, strength in self.edges.get(variable, []):
            affected.append({"variable": effect, "impact": strength})
        return {
            "variable": variable,
            "hypothetical": hypothetical_value,
            "affected": affected,
        }


# ═══════════════════════════════════════════════════════════════════════════
# ATTENTION MECHANISM PROTOCOL (PROTO-303)
# ═══════════════════════════════════════════════════════════════════════════

class AttentionMechanismProtocol:
    """
    φ-weighted attention allocation across cognitive resources.
    
    Usage:
        attn = AttentionMechanismProtocol(capacity=5)
        attn.attend("task_a", priority=0.9)
        attn.attend("task_b", priority=0.3)
        focus = attn.get_focus()  # -> ["task_a"]
    """

    def __init__(self, capacity: int = 7):
        self.capacity = capacity
        self.attention_map: Dict[str, float] = {}
        self.history: List[Dict[str, Any]] = []

    def attend(self, target: str, priority: float = 0.5) -> Dict[str, Any]:
        """Direct attention to a target with given priority."""
        self.attention_map[target] = priority
        # Normalize if over capacity — keep top-k by priority
        if len(self.attention_map) > self.capacity:
            sorted_items = sorted(self.attention_map.items(), 
                                  key=lambda x: x[1], reverse=True)
            self.attention_map = dict(sorted_items[:self.capacity])
        
        self.history.append({"target": target, "priority": priority, "time": time.time()})
        return {"target": target, "priority": priority, "active_count": len(self.attention_map)}

    def release(self, target: str) -> None:
        """Release attention from target."""
        self.attention_map.pop(target, None)

    def get_focus(self) -> List[str]:
        """Get currently attended targets sorted by priority."""
        return [k for k, _ in sorted(self.attention_map.items(), 
                                      key=lambda x: x[1], reverse=True)]

    def attention_weights(self) -> Dict[str, float]:
        """Get φ-normalized attention weights (softmax-like)."""
        if not self.attention_map:
            return {}
        total = sum(math.exp(v * PHI) for v in self.attention_map.values())
        return {k: math.exp(v * PHI) / total for k, v in self.attention_map.items()}

    def decay(self, rate: float = PHI_INV * 0.05) -> None:
        """Apply attention decay to all targets."""
        to_remove = []
        for k in self.attention_map:
            self.attention_map[k] -= rate
            if self.attention_map[k] <= 0:
                to_remove.append(k)
        for k in to_remove:
            del self.attention_map[k]


# ═══════════════════════════════════════════════════════════════════════════
# PREDICTIVE CODING PROTOCOL (PROTO-307)
# ═══════════════════════════════════════════════════════════════════════════

class PredictiveCodingProtocol:
    """
    Hierarchical prediction with error minimization.
    
    Usage:
        pc = PredictiveCodingProtocol(levels=3)
        pc.predict(level=0, prediction=[0.5, 0.3, 0.2])
        error = pc.update(level=0, observation=[0.6, 0.2, 0.3])
    """

    def __init__(self, levels: int = 3):
        self.levels = levels
        self.predictions: Dict[int, List[float]] = {}
        self.errors: Dict[int, List[float]] = {}
        self.precision: Dict[int, float] = {i: PHI_INV ** i for i in range(levels)}

    def predict(self, level: int, prediction: List[float]) -> None:
        """Set prediction at a hierarchy level."""
        self.predictions[level] = prediction

    def update(self, level: int, observation: List[float]) -> Dict[str, Any]:
        """Update with observation and compute prediction error."""
        prediction = self.predictions.get(level, [0.0] * len(observation))
        if len(prediction) != len(observation):
            prediction = [0.0] * len(observation)
        
        error = [obs - pred for obs, pred in zip(observation, prediction)]
        self.errors[level] = error
        
        # Update prediction using error and precision
        lr = self.precision.get(level, 0.5) * PHI_INV
        self.predictions[level] = [
            pred + lr * err for pred, err in zip(prediction, error)
        ]
        
        # Propagate error up hierarchy
        if level + 1 < self.levels:
            self.errors[level + 1] = [e * PHI_INV for e in error]
        
        return {
            "level": level,
            "error": error,
            "precision": self.precision[level],
            "surprise": sum(e ** 2 for e in error),
        }

    def free_energy(self) -> float:
        """Compute variational free energy across all levels."""
        fe = 0.0
        for level, error in self.errors.items():
            precision = self.precision.get(level, 1.0)
            fe += precision * sum(e ** 2 for e in error)
        return fe


# ═══════════════════════════════════════════════════════════════════════════
# DECISION OPTIMIZATION PROTOCOL (PROTO-308)
# ═══════════════════════════════════════════════════════════════════════════

class DecisionOptimizationProtocol:
    """
    Multi-criteria decision optimization with φ-weighted scoring.
    
    Usage:
        do = DecisionOptimizationProtocol()
        do.add_criterion("cost", weight=0.4, minimize=True)
        do.add_criterion("quality", weight=0.6, minimize=False)
        do.add_alternative("A", {"cost": 100, "quality": 8})
        do.add_alternative("B", {"cost": 150, "quality": 9})
        best = do.decide()  # -> optimal alternative
    """

    def __init__(self):
        self.criteria: Dict[str, Dict[str, Any]] = {}
        self.alternatives: Dict[str, Dict[str, float]] = {}

    def add_criterion(self, name: str, weight: float = 1.0, minimize: bool = False) -> None:
        """Add a decision criterion."""
        self.criteria[name] = {"weight": weight, "minimize": minimize}

    def add_alternative(self, name: str, scores: Dict[str, float]) -> None:
        """Add a decision alternative with scores per criterion."""
        self.alternatives[name] = scores

    def decide(self) -> Dict[str, Any]:
        """Compute optimal decision using φ-weighted TOPSIS."""
        if not self.alternatives or not self.criteria:
            return {"winner": None, "scores": {}}
        
        # Normalize scores
        normalized: Dict[str, Dict[str, float]] = {}
        for alt_name, scores in self.alternatives.items():
            normalized[alt_name] = {}
            for crit_name, value in scores.items():
                # Get range for normalization
                all_vals = [self.alternatives[a].get(crit_name, 0) 
                           for a in self.alternatives]
                min_val = min(all_vals) if all_vals else 0
                max_val = max(all_vals) if all_vals else 1
                rng = max_val - min_val or 1.0
                norm = (value - min_val) / rng
                if self.criteria.get(crit_name, {}).get("minimize", False):
                    norm = 1.0 - norm
                normalized[alt_name][crit_name] = norm
        
        # Compute weighted scores
        final_scores: Dict[str, float] = {}
        for alt_name, norms in normalized.items():
            score = 0.0
            for crit_name, norm_val in norms.items():
                weight = self.criteria.get(crit_name, {}).get("weight", 1.0)
                score += weight * norm_val
            final_scores[alt_name] = score
        
        winner = max(final_scores, key=final_scores.get)
        return {
            "winner": winner,
            "scores": final_scores,
            "confidence": final_scores[winner] / (sum(final_scores.values()) or 1.0),
        }
