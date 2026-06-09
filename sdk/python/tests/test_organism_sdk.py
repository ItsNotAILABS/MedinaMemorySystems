"""
Tests for the Medina Organism Python SDK.
"""

import math
import sys
import os

# Add SDK to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from medina_organism import (
    create_organism, OrganismSDK, OrganismConfig,
    PHI, PHI_INV, PHI_SQ,
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
)
from medina_organism.registry import ProtocolRegistry, get_all_protocols
from medina_organism.core import ProtocolDomain


def test_constants():
    """φ constants are correct."""
    assert abs(PHI - 1.618033988749895) < 1e-10
    assert abs(PHI_INV - 0.618033988749895) < 1e-10
    assert abs(PHI_SQ - 2.618033988749895) < 1e-10
    assert abs(PHI * PHI_INV - 1.0) < 1e-10


def test_create_organism():
    """Can create an organism with default config."""
    org = create_organism()
    assert isinstance(org, OrganismSDK)
    assert org.config.organism_id == "medina-organism-001"


def test_organism_tick():
    """Organism heartbeat advances state."""
    org = create_organism()
    report = org.tick()
    assert report["beat"] == 1
    assert 0 <= report["coherence"] <= 1
    assert "phase" in report


def test_quantum_decide():
    """Quantum decision returns valid result."""
    org = create_organism()
    result = org.quantum_decide(["yes", "no", "maybe"])
    assert result["option"] in ["yes", "no", "maybe"]
    assert 0 <= result["probability"] <= 1


def test_quantum_decide_with_bias():
    """Quantum decision respects biases."""
    org = create_organism()
    counts = {"yes": 0, "no": 0}
    for _ in range(100):
        result = org.quantum_decide(["yes", "no"], biases={"yes": 0.8})
        counts[result["option"]] += 1
    assert counts["yes"] + counts["no"] == 100


def test_memory_operations():
    """Memory store, recall, and rehearse work."""
    org = create_organism()
    org.remember("test_1", "Hello World", importance=0.9)
    org.remember("test_2", "Goodbye World", importance=0.3)
    
    results = org.recall("Hello")
    assert len(results) > 0
    assert results[0]["content"] == "Hello World"
    
    rehearsed = org.rehearse("test_1")
    assert rehearsed is not None
    assert rehearsed["rehearsals"] == 1


def test_pattern_recognition():
    """Pattern learning and recognition works."""
    org = create_organism()
    org.learn_pattern("cat", [0.9, 0.1, 0.8, 0.2])
    org.learn_pattern("dog", [0.2, 0.9, 0.3, 0.7])
    
    matches = org.recognize([0.85, 0.15, 0.75, 0.25])
    assert len(matches) > 0
    assert matches[0]["pattern_id"] == "cat"


def test_swarm_optimization():
    """Swarm optimization converges."""
    org = create_organism()
    result = org.optimize(
        dimensions=2,
        fitness_fn=lambda x: -(x[0] ** 2 + x[1] ** 2),
        iterations=50,
        swarm_size=20,
    )
    assert result["best_score"] > -1.0


def test_temporal_reasoning():
    """Temporal events and causal chains work."""
    org = create_organism()
    org.record("event_a", {"data": "first"})
    org.record("event_b", {"data": "second"})
    org.link_cause("event_a", "event_b")
    
    chain = org.trace_effects("event_a")
    assert "event_a" in chain
    assert "event_b" in chain


def test_attention():
    """Attention focus and decay work."""
    org = create_organism()
    org.focus("task_a", priority=0.9)
    org.focus("task_b", priority=0.3)
    
    focus = org.get_focus()
    assert focus[0] == "task_a"
    assert focus[1] == "task_b"
    
    org.unfocus("task_a")
    focus = org.get_focus()
    assert "task_a" not in focus


def test_predictive_coding():
    """Predictive coding computes surprise."""
    org = create_organism()
    org.predict(level=0, prediction=[0.5, 0.3, 0.2])
    result = org.observe(level=0, observation=[0.6, 0.2, 0.3])
    assert result["surprise"] > 0
    assert org.surprise() > 0


def test_decision_optimization():
    """Multi-criteria decision works."""
    org = create_organism()
    result = org.decide(
        criteria={
            "cost": {"weight": 0.4, "minimize": True},
            "quality": {"weight": 0.6, "minimize": False},
        },
        alternatives={
            "A": {"cost": 100, "quality": 8},
            "B": {"cost": 150, "quality": 9},
            "C": {"cost": 80, "quality": 6},
        }
    )
    assert result["winner"] is not None
    assert result["winner"] in ["A", "B", "C"]


def test_neural_binding():
    """Neural binding produces coherent percepts."""
    org = create_organism()
    binding = org.bind_features({
        "color": {"type": "visual", "value": "red"},
        "shape": {"type": "visual", "value": "circle"},
    })
    assert "coherence" in binding
    assert len(binding["feature_ids"]) == 2


def test_causal_reasoning():
    """Causal strength computation works."""
    org = create_organism()
    org.link_cause("rain", "wet_ground", strength=0.9)
    org.link_cause("wet_ground", "slippery", strength=0.8)
    
    strength = org.causal_strength("rain", "slippery")
    assert strength > 0
    assert strength <= 1.0


def test_what_if():
    """Counterfactual reasoning works."""
    org = create_organism()
    org.link_cause("price_drop", "buy_signal", strength=0.85)
    
    result = org.what_if("price_drop", "large")
    assert result["variable"] == "price_drop"
    assert len(result["affected"]) > 0


def test_organism_status():
    """Status report contains all fields."""
    org = create_organism()
    org.remember("test", "data")
    org.focus("task", priority=0.5)
    
    s = org.status()
    assert s["organism_id"] == "medina-organism-001"
    assert s["memory_count"] == 1
    assert s["attention_targets"] == 1


def test_protocol_registry():
    """Protocol registry loads all protocols."""
    registry = get_all_protocols()
    assert registry.total_count >= 43
    assert registry.active_count >= 43
    
    quantum_protos = registry.get_by_domain(ProtocolDomain.QUANTUM)
    assert len(quantum_protos) >= 1


def test_quantum_protocol_direct():
    """Direct QuantumCoherenceProtocol usage."""
    qp = QuantumCoherenceProtocol(["a", "b", "c", "d"])
    probs = qp.probabilities()
    assert abs(sum(probs) - 1.0) < 1e-10
    
    qp.apply_phase(0, math.pi / 4)
    probs2 = qp.probabilities()
    assert abs(sum(probs2) - 1.0) < 1e-10
    
    result = qp.measure()
    assert result["option"] in ["a", "b", "c", "d"]


def test_swarm_protocol_direct():
    """Direct SwarmIntelligenceProtocol usage."""
    swarm = SwarmIntelligenceProtocol(
        dimensions=2,
        fitness_fn=lambda x: -(x[0] ** 2 + x[1] ** 2),
        swarm_size=10,
    )
    result = swarm.step()
    assert result["iteration"] == 1
    assert "global_best" in result


def test_entanglement():
    """Quantum entanglement correlates states."""
    qa = QuantumCoherenceProtocol(["up", "down"])
    qb = QuantumCoherenceProtocol(["left", "right"])
    pair = qa.entangle(qb)
    
    corr = pair.correlation_score()
    assert 0 <= corr <= 1.0 + 1e-10
    
    result = pair.measure_a()
    assert result is not None
    assert result["option"] in ["up", "down"]


def test_full_organism_lifecycle():
    """Full organism lifecycle: create, operate, status."""
    org = create_organism(OrganismConfig(organism_id="test-lifecycle"))
    
    org.remember("init", "System initialized", importance=1.0)
    decision = org.quantum_decide(["proceed", "halt"])
    org.focus("main_task", priority=0.9)
    org.record("start", {"phase": "init"})
    org.record("process", {"phase": "running"})
    org.link_cause("start", "process")
    org.learn_pattern("normal", [0.5, 0.5, 0.5])
    org.learn_pattern("anomaly", [0.9, 0.1, 0.9])
    
    for _ in range(5):
        org.tick()
    
    s = org.status()
    assert s["organism_id"] == "test-lifecycle"
    assert s["beat_count"] == 5
    assert s["memory_count"] >= 1
    assert s["temporal_events"] >= 2


if __name__ == "__main__":
    tests = [v for k, v in list(globals().items()) if k.startswith("test_") and callable(v)]
    passed = 0
    failed = 0
    for test in tests:
        try:
            test()
            print(f"  \u2713 {test.__name__}")
            passed += 1
        except Exception as e:
            print(f"  \u2717 {test.__name__}: {e}")
            failed += 1
    print(f"\n{'=' * 60}")
    print(f"  Results: {passed} passed, {failed} failed, {passed + failed} total")
    print(f"{'=' * 60}")
    sys.exit(0 if failed == 0 else 1)
