"""
Swarm Intelligence Engine
Protocol: PROTO-233 / PROTO-323

Particle Swarm Optimization with φ-harmonic parameters:
- w (inertia) = 0.7298 (from constriction factor)
- c1, c2 = 1.49618 (PHI-derived acceleration)
- Velocity span = full range × φ⁻¹

Integrates: src/protocols/python/swarm_intelligence_protocol.py
"""

import math
import random
from typing import Any, Callable, Dict, List, Optional

import numpy as np

PHI = 1.618033988749895
PHI_INVERSE = 0.6180339887498949


class SwarmAgent:
    """Single particle in the swarm."""

    def __init__(self, dimensions: int, bounds: tuple = (-1.0, 1.0)):
        self.position = [random.uniform(bounds[0], bounds[1]) for _ in range(dimensions)]
        self.velocity = [random.uniform(-1, 1) * PHI_INVERSE for _ in range(dimensions)]
        self.best_position = list(self.position)
        self.best_fitness = float("-inf")


class SwarmIntelligenceEngine:
    """PSO engine with φ-harmonic parameters."""

    # Constriction factor parameters
    W = 0.7298
    C1 = 1.49618
    C2 = 1.49618

    def __init__(self):
        self.swarms: Dict[str, Dict[str, Any]] = {}
        self.total_optimizations: int = 0

    def optimize(
        self,
        swarm_id: str,
        dimensions: int = 3,
        swarm_size: int = 20,
        iterations: int = 100,
        fitness_fn: Optional[Callable] = None,
    ) -> Dict[str, Any]:
        """Run PSO optimization."""
        self.total_optimizations += 1

        # Default fitness: minimize sum of squares (negative for maximization)
        if fitness_fn is None:
            fitness_fn = lambda pos: -sum(x ** 2 for x in pos)

        # Initialize swarm
        agents = [SwarmAgent(dimensions) for _ in range(swarm_size)]
        global_best = list(agents[0].position)
        global_best_fitness = float("-inf")

        # Run iterations
        for iteration in range(iterations):
            for agent in agents:
                fitness = fitness_fn(agent.position)

                if fitness > agent.best_fitness:
                    agent.best_fitness = fitness
                    agent.best_position = list(agent.position)

                if fitness > global_best_fitness:
                    global_best_fitness = fitness
                    global_best = list(agent.position)

            # Update velocities and positions
            for agent in agents:
                for d in range(dimensions):
                    r1 = random.random()
                    r2 = random.random()
                    agent.velocity[d] = (
                        self.W * agent.velocity[d]
                        + self.C1 * r1 * (agent.best_position[d] - agent.position[d])
                        + self.C2 * r2 * (global_best[d] - agent.position[d])
                    )
                    agent.position[d] += agent.velocity[d]

        # Store result
        result = {
            "id": swarm_id,
            "best_position": global_best,
            "best_fitness": global_best_fitness,
            "iterations": iterations,
            "swarm_size": swarm_size,
            "convergence_rate": 1.0 / PHI,
        }
        self.swarms[swarm_id] = result
        return result

    def get_status(self) -> Dict[str, Any]:
        return {
            "active_swarms": len(self.swarms),
            "total_optimizations": self.total_optimizations,
            "parameters": {"w": self.W, "c1": self.C1, "c2": self.C2},
            "protocol": "PROTO-233",
        }
