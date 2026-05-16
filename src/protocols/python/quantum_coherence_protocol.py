"""
PROTO-231 — Quantum Coherence Protocol (Python)
Quantum-inspired cognitive processing for MMIMS-X.

Charter: PROTO-231
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Tuple, Dict, Any

# ── Constants ──────────────────────────────────────────────────────────────────
PHI     = (1 + math.sqrt(5)) / 2   # 1.618033…
PHI_INV = 1 / PHI                   # 0.618033…
PHI_SQ  = PHI * PHI                 # 2.618033…


# ── Complex Number ─────────────────────────────────────────────────────────────
@dataclass(frozen=True)
class Complex:
    re: float
    im: float = 0.0

    def __add__(self, o: "Complex") -> "Complex":
        return Complex(self.re + o.re, self.im + o.im)

    def __sub__(self, o: "Complex") -> "Complex":
        return Complex(self.re - o.re, self.im - o.im)

    def __mul__(self, o: "Complex") -> "Complex":
        return Complex(
            self.re * o.re - self.im * o.im,
            self.re * o.im + self.im * o.re,
        )

    def scale(self, s: float) -> "Complex":
        return Complex(self.re * s, self.im * s)

    def conj(self) -> "Complex":
        return Complex(self.re, -self.im)

    def norm2(self) -> float:
        return self.re ** 2 + self.im ** 2

    def norm(self) -> float:
        return math.sqrt(self.norm2())

    @staticmethod
    def phase(theta: float) -> "Complex":
        """e^(iθ)"""
        return Complex(math.cos(theta), math.sin(theta))

    def __repr__(self) -> str:
        return f"({self.re:.4f}+{self.im:.4f}i)"


def _normalise(amps: List[Complex]) -> List[Complex]:
    total = sum(a.norm2() for a in amps) or 1.0
    inv   = 1 / math.sqrt(total)
    return [a.scale(inv) for a in amps]


# ── Quantum Cognitive State ────────────────────────────────────────────────────
class QuantumCognitiveState:
    """Superposition over a discrete set of cognitive options."""

    def __init__(self, options: List[str], amplitudes: Optional[List[Complex]] = None):
        if not options:
            raise ValueError("Need at least one cognitive option")
        self.options   = list(options)
        self.n         = len(options)
        self.collapsed = False
        self.result: Optional[Dict[str, Any]] = None
        self.amplitudes: List[Complex] = (
            _normalise(amplitudes) if amplitudes else self._uniform()
        )

    def _uniform(self) -> List[Complex]:
        amps = [
            Complex.phase((2 * math.pi * i * PHI_INV) % (2 * math.pi)).scale(1 / math.sqrt(self.n))
            for i in range(self.n)
        ]
        return _normalise(amps)

    def probabilities(self) -> List[float]:
        return [a.norm2() for a in self.amplitudes]

    def apply_phase(self, index: int, theta: float) -> "QuantumCognitiveState":
        if self.collapsed:
            raise RuntimeError("State already collapsed")
        amps           = list(self.amplitudes)
        amps[index]    = amps[index] * Complex.phase(theta)
        self.amplitudes = _normalise(amps)
        return self

    def measure(self) -> Dict[str, Any]:
        if self.collapsed:
            return self.result  # type: ignore
        probs  = self.probabilities()
        r      = random.random()
        cumul  = 0.0
        chosen = self.n - 1
        for i, p in enumerate(probs):
            cumul += p
            if r <= cumul:
                chosen = i
                break
        self.collapsed = True
        self.result    = {
            "option":      self.options[chosen],
            "index":       chosen,
            "probability": probs[chosen],
        }
        return self.result

    def expectation(self, utility_fn) -> float:
        return sum(p * utility_fn(i) for i, p in enumerate(self.probabilities()))


# ── Entangled Pair ─────────────────────────────────────────────────────────────
class EntangledPair:
    def __init__(self, state_a: QuantumCognitiveState, state_b: QuantumCognitiveState):
        self.state_a   = state_a
        self.state_b   = state_b
        self.angle     = math.pi / 4 * PHI_INV
        self.collapsed = False
        self.id        = f"ENT-{int(time.time() * 1000)}-{random.randint(0, 9999)}"

    def measure_a(self) -> Optional[Dict[str, Any]]:
        if self.collapsed:
            return None
        result_a = self.state_a.measure()
        i        = result_a["index"] % self.state_b.n
        self.state_b.apply_phase(i, self.angle * PHI)
        self.collapsed = True
        return result_a

    def correlation_score(self) -> float:
        probs_a = self.state_a.probabilities()
        probs_b = self.state_b.probabilities()
        return sum(
            math.sqrt(pa * pb)
            for pa, pb in zip(probs_a, probs_b)
        )


# ── Quantum Decision Engine ────────────────────────────────────────────────────
class QuantumDecisionEngine:
    def __init__(self, options: List[str], utilities: List[float]):
        if len(options) != len(utilities):
            raise ValueError("options/utilities length mismatch")
        self.options   = list(options)
        self.utilities = list(utilities)
        self.history: List[Dict[str, Any]] = []

    def decide(self) -> Dict[str, Any]:
        state = QuantumCognitiveState(self.options)
        max_u = max(self.utilities) or 1e-9
        for i, u in enumerate(self.utilities):
            theta = (u / max_u) * math.pi * PHI_INV
            state.apply_phase(i, theta)

        expected_util = state.expectation(lambda i: self.utilities[i])
        result        = state.measure()

        decision = {
            **result,
            "utility":      self.utilities[result["index"]],
            "expected_util": expected_util,
            "phi_coherence": f"{result['probability'] * PHI:.4f}",
            "timestamp":    time.time(),
        }
        self.history.append(decision)
        return decision

    def classical_optimum(self) -> Dict[str, Any]:
        best_i = max(range(len(self.utilities)), key=lambda i: self.utilities[i])
        return {"option": self.options[best_i], "utility": self.utilities[best_i]}


# ── Quantum Memory Cell ────────────────────────────────────────────────────────
class QuantumMemoryCell:
    def __init__(self, label: str, interpretations: List[str]):
        self.label           = label
        self.state           = QuantumCognitiveState(interpretations)
        self.write_count     = 0
        self.read_count      = 0
        self.collapse_history: List[Dict[str, Any]] = []

    def write(self, interpretations: List[str],
              amplitudes: Optional[List[Complex]] = None) -> None:
        self.state       = QuantumCognitiveState(interpretations, amplitudes)
        self.write_count += 1

    def peek(self) -> List[Dict[str, Any]]:
        probs = self.state.probabilities()
        return [
            {"interpretation": opt, "probability": probs[i]}
            for i, opt in enumerate(self.state.options)
        ]

    def read(self) -> Dict[str, Any]:
        result = self.state.measure()
        self.read_count += 1
        self.collapse_history.append({**result, "at": time.time()})
        return result

    def coherence_score(self) -> float:
        probs = self.state.probabilities()
        H = -sum(p * math.log2(p) for p in probs if p > 0)
        return max(0.0, 1 - H / math.log2(self.state.n)) if self.state.n > 1 else 1.0


# ── Quantum Coherence Bus ──────────────────────────────────────────────────────
class QuantumCoherenceBus:
    def __init__(self):
        self.cells:    Dict[str, QuantumMemoryCell]    = {}
        self.pairs:    Dict[str, EntangledPair]         = {}
        self.engines:  Dict[str, QuantumDecisionEngine] = {}
        self.beat_count = 0

    def register_cell(self, label: str, interpretations: List[str]) -> QuantumMemoryCell:
        cell = QuantumMemoryCell(label, interpretations)
        self.cells[label] = cell
        return cell

    def get_cell(self, label: str) -> Optional[QuantumMemoryCell]:
        return self.cells.get(label)

    def entangle(self, label_a: str, label_b: str) -> EntangledPair:
        a, b  = self.cells[label_a], self.cells[label_b]
        pair  = EntangledPair(a.state, b.state)
        self.pairs[pair.id] = pair
        return pair

    def register_decision(self, id: str, options: List[str],
                          utilities: List[float]) -> QuantumDecisionEngine:
        engine          = QuantumDecisionEngine(options, utilities)
        self.engines[id] = engine
        return engine

    def decide(self, id: str) -> Optional[Dict[str, Any]]:
        engine = self.engines.get(id)
        return engine.decide() if engine else None

    def coherence_report(self) -> Dict[str, Any]:
        self.beat_count += 1
        return {
            "beat":   self.beat_count,
            "cells":  [
                {
                    "label":     label,
                    "coherence": cell.coherence_score(),
                    "reads":     cell.read_count,
                    "writes":    cell.write_count,
                }
                for label, cell in self.cells.items()
            ],
            "pairs":  [
                {
                    "id":          pair.id,
                    "correlation": pair.correlation_score(),
                    "collapsed":   pair.collapsed,
                }
                for pair in self.pairs.values()
            ],
            "phi_pulse": (self.beat_count * PHI_INV) % 1,
            "timestamp": time.time(),
        }


# ── Quick demo ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-231 Quantum Coherence Protocol (Python) ===")

    options   = ["expand-memory", "compress-context", "delegate-agent", "prune-graph"]
    utilities = [0.9, 0.6, 1.0, 0.4]
    engine    = QuantumDecisionEngine(options, utilities)

    print("Classical optimum:", engine.classical_optimum())
    for _ in range(5):
        d = engine.decide()
        print(f"  Quantum decision: {d['option']}  p={d['probability']:.3f}")

    cell = QuantumMemoryCell("context-cell", ["episodic", "semantic", "procedural", "working"])
    print(f"\nMemory cell coherence: {cell.coherence_score():.4f}")
    print("Peek:", cell.peek())
    print("Read (collapse):", cell.read())
