"""
PROTO-233 — Swarm Intelligence Protocol (Python)
PSO, ACO pheromone trails, and swarm consensus for MMIMS-X.

Charter: PROTO-233
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from typing import Any, Callable, Dict, List, Optional, Tuple

# ── Constants ──────────────────────────────────────────────────────────────────
PHI         = (1 + math.sqrt(5)) / 2
PHI_INV     = 1 / PHI
PHI_SQ      = PHI * PHI
PSO_W       = 1 / PHI_SQ    # inertia weight   ≈ 0.382
PSO_C1      = PHI_INV       # cognitive coeff  ≈ 0.618
PSO_C2      = PHI           # social coeff     ≈ 1.618
EVAPORATION = PHI_INV * 0.1  # pheromone evap  ≈ 0.0618


# ── Vector Utilities ───────────────────────────────────────────────────────────
def vec_add(a: List[float], b: List[float]) -> List[float]:
    return [x + y for x, y in zip(a, b)]

def vec_sub(a: List[float], b: List[float]) -> List[float]:
    return [x - y for x, y in zip(a, b)]

def vec_scale(a: List[float], s: float) -> List[float]:
    return [x * s for x in a]

def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))

def rand_vec(n: int) -> List[float]:
    return [random.random() for _ in range(n)]


# ── Particle (PSO) ─────────────────────────────────────────────────────────────
class Particle:
    def __init__(self, position: List[float], velocity: List[float],
                 fitness_fn: Callable[[List[float]], float],
                 bounds: Optional[List[Tuple[float, float]]] = None):
        self.position   = list(position)
        self.velocity   = list(velocity)
        self.fitness_fn = fitness_fn
        self.bounds     = bounds
        self.best_pos   = list(position)
        self.best_fit   = fitness_fn(position)
        self.id         = f"P-{int(time.time()*1000)}-{random.randint(0,9999)}"
        self.dim        = len(position)

    def step(self, global_best: List[float]) -> float:
        r1, r2 = random.random(), random.random()
        ine = vec_scale(self.velocity, PSO_W)
        cog = vec_scale(vec_sub(self.best_pos, self.position), PSO_C1 * r1)
        soc = vec_scale(vec_sub(global_best,  self.position), PSO_C2 * r2)

        self.velocity = vec_add(vec_add(ine, cog), soc)

        if self.bounds:
            self.velocity = [
                clamp(v, -(b[1]-b[0])*PHI_INV, (b[1]-b[0])*PHI_INV)
                for v, b in zip(self.velocity, self.bounds)
            ]

        self.position = vec_add(self.position, self.velocity)

        if self.bounds:
            self.position = [
                clamp(x, b[0], b[1])
                for x, b in zip(self.position, self.bounds)
            ]

        fit = self.fitness_fn(self.position)
        if fit > self.best_fit:
            self.best_fit = fit
            self.best_pos = list(self.position)
        return fit


# ── Particle Swarm Optimizer ───────────────────────────────────────────────────
class ParticleSwarmOptimizer:
    def __init__(self, fitness_fn: Callable[[List[float]], float],
                 dim: int,
                 bounds: Optional[List[Tuple[float, float]]] = None,
                 n_particles: int = 34):
        self.fitness_fn  = fitness_fn
        self.dim         = dim
        self.bounds      = bounds
        self.n_particles = n_particles
        self.particles:  List[Particle] = []
        self.global_best: List[float] = []
        self.global_fit: float = float("-inf")
        self.iteration  = 0
        self.history:   List[Dict[str, Any]] = []
        self._init()

    def _init(self) -> None:
        for _ in range(self.n_particles):
            if self.bounds:
                pos = [b[0] + random.random() * (b[1]-b[0]) for b in self.bounds]
                vel = [(random.random()-0.5) * (b[1]-b[0]) * PHI_INV for b in self.bounds]
            else:
                pos = rand_vec(self.dim)
                vel = [(random.random()-0.5) * PHI_INV for _ in range(self.dim)]
            p = Particle(pos, vel, self.fitness_fn, self.bounds)
            self.particles.append(p)
            if p.best_fit > self.global_fit:
                self.global_fit  = p.best_fit
                self.global_best = list(p.best_pos)

    def step(self) -> Dict[str, Any]:
        self.iteration += 1
        for p in self.particles:
            fit = p.step(self.global_best)
            if fit > self.global_fit:
                self.global_fit  = fit
                self.global_best = list(p.position)
        result = {"iteration": self.iteration,
                  "best": list(self.global_best),
                  "fitness": self.global_fit}
        self.history.append(result)
        return result

    def run(self, n: int) -> Dict[str, Any]:
        r = None
        for _ in range(n):
            r = self.step()
        return r  # type: ignore


# ── Pheromone Trail System (ACO) ───────────────────────────────────────────────
class PheromoneTrailSystem:
    def __init__(self, initial_level: float = None):
        self.initial   = initial_level if initial_level is not None else PHI_INV
        self._trails:  Dict[str, float] = {}
        self.step_count = 0

    def _key(self, frm: str, to: str) -> str:
        return f"{frm}:{to}"

    def get_level(self, frm: str, to: str) -> float:
        return self._trails.get(self._key(frm, to), self.initial)

    def deposit(self, path: List[str], quality: float = 1.0) -> None:
        delta = (quality * PHI) / max(len(path) - 1, 1)
        for i in range(len(path) - 1):
            k = self._key(path[i], path[i+1])
            self._trails[k] = self._trails.get(k, self.initial) + delta

    def evaporate(self) -> None:
        self.step_count += 1
        dead = []
        for k, v in self._trails.items():
            nv = v * (1 - EVAPORATION)
            if nv < 1e-6:
                dead.append(k)
            else:
                self._trails[k] = nv
        for k in dead:
            del self._trails[k]

    def choose_next(self, frm: str, candidates: List[str],
                    heuristic_fn: Callable[[str, str], float]) -> str:
        alpha, beta = PHI, PHI_INV
        weights = [
            math.pow(self.get_level(frm, c), alpha) * math.pow(heuristic_fn(frm, c), beta)
            for c in candidates
        ]
        total = sum(weights) or 1.0
        r = random.random() * total
        for c, w in zip(candidates, weights):
            r -= w
            if r <= 0:
                return c
        return candidates[-1]

    def stats(self) -> Dict[str, Any]:
        levels = list(self._trails.values())
        return {
            "trails":     len(levels),
            "evap_steps": self.step_count,
            "max_level":  max(levels) if levels else 0,
            "min_level":  min(levels) if levels else 0,
            "avg_level":  sum(levels)/len(levels) if levels else 0,
        }


# ── Swarm Consensus ────────────────────────────────────────────────────────────
class SwarmConsensus:
    def __init__(self, options: List[str]):
        self.options = list(options)
        self._votes:  Dict[str, Tuple[str, float]] = {}  # agentId → (option, confidence)
        self.round    = 0

    def vote(self, agent_id: str, option: str, confidence: float = None) -> None:
        if confidence is None:
            confidence = PHI_INV
        if option not in self.options:
            raise ValueError(f"Unknown option: {option}")
        self._votes[agent_id] = (option, clamp(confidence, 0, 1))

    def tally(self) -> Dict[str, Any]:
        self.round += 1
        scores: Dict[str, float] = {o: 0.0 for o in self.options}
        for opt, conf in self._votes.values():
            scores[opt] += conf * PHI

        total = sum(scores.values()) or 1.0
        ranked = sorted(
            [{"option": o, "score": s, "proportion": s/total} for o, s in scores.items()],
            key=lambda x: x["score"], reverse=True,
        )
        winner    = ranked[0]["score"]
        runner_up = ranked[1]["score"] if len(ranked) > 1 else 0.0
        certainty = min((winner / runner_up) * PHI_INV, 1.0) if runner_up > 0 else 1.0

        return {
            "consensus":   ranked[0]["option"],
            "certainty":   certainty,
            "round":       self.round,
            "agent_count": len(self._votes),
            "ranking":     ranked,
        }

    def reset(self) -> None:
        self._votes.clear()


# ── MMIMS-X Swarm Intelligence Bus ────────────────────────────────────────────
class SwarmIntelligenceBus:
    def __init__(self):
        self.optimizers:  Dict[str, ParticleSwarmOptimizer] = {}
        self.pheromones:  Dict[str, PheromoneTrailSystem]   = {}
        self.consensuses: Dict[str, SwarmConsensus]         = {}
        self.beat         = 0

    def register_optimizer(self, id: str, fitness_fn, dim: int,
                            bounds=None, n_particles: int = 34) -> ParticleSwarmOptimizer:
        pso = ParticleSwarmOptimizer(fitness_fn, dim, bounds, n_particles)
        self.optimizers[id] = pso
        return pso

    def optimize(self, id: str, iterations: int = 55) -> Optional[Dict]:
        pso = self.optimizers.get(id)
        return pso.run(iterations) if pso else None

    def register_pheromone_trail(self, id: str, initial=None) -> PheromoneTrailSystem:
        trail = PheromoneTrailSystem(initial)
        self.pheromones[id] = trail
        return trail

    def get_pheromone(self, id: str) -> Optional[PheromoneTrailSystem]:
        return self.pheromones.get(id)

    def register_consensus(self, id: str, options: List[str]) -> SwarmConsensus:
        c = SwarmConsensus(options)
        self.consensuses[id] = c
        return c

    def vote(self, id: str, agent_id: str, option: str, confidence=None) -> None:
        self.consensuses[id].vote(agent_id, option, confidence)

    def tally(self, id: str) -> Optional[Dict]:
        c = self.consensuses.get(id)
        return c.tally() if c else None

    def tick(self) -> Dict[str, Any]:
        self.beat += 1
        for trail in self.pheromones.values():
            trail.evaporate()
        return {"beat": self.beat, "phi_pulse": (self.beat * PHI_INV) % 1}

    def report(self) -> Dict[str, Any]:
        return {
            "beat":        self.beat,
            "optimizers":  len(self.optimizers),
            "pheromones":  len(self.pheromones),
            "consensuses": len(self.consensuses),
        }


# ── Quick demo ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-233 Swarm Intelligence Protocol (Python) ===")

    # PSO: maximise -(x²+y²) → optimum at (0,0)
    pso = ParticleSwarmOptimizer(
        fitness_fn=lambda pos: -(pos[0]**2 + pos[1]**2),
        dim=2,
        bounds=[(-5, 5), (-5, 5)],
        n_particles=34,
    )
    r = pso.run(55)
    print(f"PSO optimum: {r}")

    # ACO
    aco = PheromoneTrailSystem()
    aco.deposit(["A", "B", "C", "D"], quality=1.0)
    print(f"Pheromone A→B: {aco.get_level('A','B'):.4f}")
    aco.evaporate()
    print(f"After evap  A→B: {aco.get_level('A','B'):.4f}")

    # Consensus
    consensus = SwarmConsensus(["route-alpha", "route-beta", "route-gamma"])
    consensus.vote("agent-1", "route-alpha", 0.9)
    consensus.vote("agent-2", "route-alpha", 0.7)
    consensus.vote("agent-3", "route-beta",  0.5)
    print(f"Consensus: {consensus.tally()}")
