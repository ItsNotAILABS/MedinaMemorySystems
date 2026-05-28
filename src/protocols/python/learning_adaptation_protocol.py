"""
PROTO-317 — Learning Adaptation Protocol (Python)
Adaptive learning with φ-coherent parameter adjustment.

Charter: PROTO-317
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable
from enum import Enum
from collections import deque

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


class AdaptationStrategy(Enum):
    GRADIENT = "gradient"
    EVOLUTIONARY = "evolutionary"
    BAYESIAN = "bayesian"
    REINFORCEMENT = "reinforcement"


@dataclass
class LearningParameter:
    """A learnable parameter."""
    name: str
    value: float
    min_value: float = 0.0
    max_value: float = 1.0
    learning_rate: float = field(default_factory=lambda: PHI_INV * 0.1)
    momentum: float = 0.0
    velocity: float = 0.0
    
    def update(self, gradient: float) -> float:
        """Update parameter with momentum."""
        self.velocity = self.momentum * self.velocity - self.learning_rate * gradient
        self.value = max(self.min_value, min(self.max_value, self.value + self.velocity))
        return self.value
    
    def adapt_learning_rate(self, performance: float) -> None:
        """Adapt learning rate based on performance."""
        if performance > 0:
            self.learning_rate *= (1 + PHI_INV * 0.1)
        else:
            self.learning_rate *= PHI_INV


@dataclass
class LearningEpisode:
    """A learning episode with feedback."""
    id: int
    parameters: Dict[str, float]
    performance: float
    timestamp: float = field(default_factory=time.time)
    metadata: Dict[str, Any] = field(default_factory=dict)


class PerformanceTracker:
    """Tracks learning performance over time."""
    
    def __init__(self, window_size: int = 100):
        self.history: deque = deque(maxlen=window_size)
        self.best_performance = float('-inf')
        self.best_parameters: Dict[str, float] = {}
    
    def record(self, episode: LearningEpisode) -> None:
        """Record an episode."""
        self.history.append(episode)
        
        if episode.performance > self.best_performance:
            self.best_performance = episode.performance
            self.best_parameters = dict(episode.parameters)
    
    def moving_average(self, n: int = 10) -> float:
        """Calculate moving average of recent performance."""
        recent = list(self.history)[-n:]
        if not recent:
            return 0.0
        return sum(e.performance for e in recent) / len(recent)
    
    def trend(self, n: int = 20) -> float:
        """Calculate performance trend (positive = improving)."""
        recent = list(self.history)[-n:]
        if len(recent) < 2:
            return 0.0
        
        # Simple linear regression
        x = list(range(len(recent)))
        y = [e.performance for e in recent]
        
        x_mean = sum(x) / len(x)
        y_mean = sum(y) / len(y)
        
        numerator = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))
        denominator = sum((xi - x_mean) ** 2 for xi in x) or 1
        
        return numerator / denominator * PHI_INV


class GradientAdapter:
    """Gradient-based learning adaptation."""
    
    def __init__(self, epsilon: float = 0.01):
        self.epsilon = epsilon
    
    def estimate_gradient(self, param: LearningParameter,
                         objective: Callable[[Dict[str, float]], float],
                         current_params: Dict[str, float]) -> float:
        """Estimate gradient via finite differences."""
        # Forward
        params_plus = dict(current_params)
        params_plus[param.name] = min(param.max_value, param.value + self.epsilon)
        f_plus = objective(params_plus)
        
        # Backward
        params_minus = dict(current_params)
        params_minus[param.name] = max(param.min_value, param.value - self.epsilon)
        f_minus = objective(params_minus)
        
        return (f_plus - f_minus) / (2 * self.epsilon)


class EvolutionaryAdapter:
    """Evolutionary learning adaptation."""
    
    def __init__(self, population_size: int = 20, mutation_rate: float = 0.1):
        self.population_size = population_size
        self.mutation_rate = mutation_rate
        self.population: List[Dict[str, float]] = []
        self.fitness: List[float] = []
    
    def initialize(self, parameters: List[LearningParameter]) -> None:
        """Initialize population."""
        self.population = []
        
        for _ in range(self.population_size):
            individual = {}
            for param in parameters:
                individual[param.name] = random.uniform(param.min_value, param.max_value)
            self.population.append(individual)
        
        self.fitness = [0.0] * self.population_size
    
    def evaluate(self, objective: Callable[[Dict[str, float]], float]) -> None:
        """Evaluate population fitness."""
        self.fitness = [objective(ind) for ind in self.population]
    
    def evolve(self, parameters: List[LearningParameter]) -> Dict[str, float]:
        """Evolve population and return best."""
        # Selection (tournament)
        new_population = []
        
        for _ in range(self.population_size):
            # Tournament selection
            candidates = random.sample(range(self.population_size), min(3, self.population_size))
            winner_idx = max(candidates, key=lambda i: self.fitness[i])
            parent = dict(self.population[winner_idx])
            
            # Mutation
            child = {}
            for param in parameters:
                value = parent[param.name]
                if random.random() < self.mutation_rate:
                    value += random.gauss(0, (param.max_value - param.min_value) * PHI_INV * 0.1)
                    value = max(param.min_value, min(param.max_value, value))
                child[param.name] = value
            
            new_population.append(child)
        
        self.population = new_population
        
        # Return best
        best_idx = max(range(len(self.fitness)), key=lambda i: self.fitness[i])
        return self.population[best_idx]


class LearningAdaptationEngine:
    """
    Main learning adaptation engine with φ-coherent processing.
    """
    
    def __init__(self, strategy: AdaptationStrategy = AdaptationStrategy.GRADIENT):
        self.parameters: Dict[str, LearningParameter] = {}
        self.strategy = strategy
        self.tracker = PerformanceTracker()
        self.gradient_adapter = GradientAdapter()
        self.evolutionary_adapter = EvolutionaryAdapter()
        self.objective: Optional[Callable[[Dict[str, float]], float]] = None
        self.beat_count = 0
        self.episode_counter = 0
    
    def add_parameter(self, name: str, initial_value: float = 0.5,
                     min_value: float = 0.0, max_value: float = 1.0,
                     learning_rate: float = 0.1, momentum: float = 0.9) -> LearningParameter:
        """Add a learnable parameter."""
        param = LearningParameter(
            name=name,
            value=initial_value,
            min_value=min_value,
            max_value=max_value,
            learning_rate=learning_rate * PHI_INV,
            momentum=momentum
        )
        self.parameters[name] = param
        return param
    
    def set_objective(self, objective: Callable[[Dict[str, float]], float]) -> None:
        """Set the objective function to optimize."""
        self.objective = objective
    
    def get_current_params(self) -> Dict[str, float]:
        """Get current parameter values."""
        return {name: p.value for name, p in self.parameters.items()}
    
    def set_params(self, params: Dict[str, float]) -> None:
        """Set parameter values."""
        for name, value in params.items():
            if name in self.parameters:
                self.parameters[name].value = value
    
    def learn_step(self) -> LearningEpisode:
        """Perform one learning step."""
        if not self.objective:
            raise ValueError("Objective function not set")
        
        self.episode_counter += 1
        current_params = self.get_current_params()
        
        if self.strategy == AdaptationStrategy.GRADIENT:
            # Gradient descent
            for name, param in self.parameters.items():
                gradient = self.gradient_adapter.estimate_gradient(
                    param, self.objective, current_params
                )
                param.update(-gradient)  # Negative for maximization
        
        elif self.strategy == AdaptationStrategy.EVOLUTIONARY:
            # Evolutionary
            if not self.evolutionary_adapter.population:
                self.evolutionary_adapter.initialize(list(self.parameters.values()))
            
            self.evolutionary_adapter.evaluate(self.objective)
            best = self.evolutionary_adapter.evolve(list(self.parameters.values()))
            self.set_params(best)
        
        # Evaluate current performance
        performance = self.objective(self.get_current_params())
        
        episode = LearningEpisode(
            id=self.episode_counter,
            parameters=self.get_current_params(),
            performance=performance
        )
        
        self.tracker.record(episode)
        
        # Adapt learning rates based on trend
        trend = self.tracker.trend()
        for param in self.parameters.values():
            param.adapt_learning_rate(trend)
        
        return episode
    
    def train(self, iterations: int = 100) -> List[LearningEpisode]:
        """Train for multiple iterations."""
        episodes = []
        for _ in range(iterations):
            episode = self.learn_step()
            episodes.append(episode)
        return episodes
    
    def get_best(self) -> Dict[str, Any]:
        """Get best parameters found."""
        return {
            "parameters": self.tracker.best_parameters,
            "performance": self.tracker.best_performance
        }
    
    def reset_to_best(self) -> None:
        """Reset parameters to best found."""
        self.set_params(self.tracker.best_parameters)
    
    def tick(self) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        return {
            "beat": self.beat_count,
            "parameters": len(self.parameters),
            "episodes": self.episode_counter,
            "current_performance": self.tracker.moving_average(1),
            "avg_performance": self.tracker.moving_average(10),
            "best_performance": self.tracker.best_performance,
            "trend": self.tracker.trend(),
            "phi_coherence": self.tracker.moving_average(10) * PHI_INV,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate learning adaptation report."""
        return {
            "strategy": self.strategy.value,
            "parameters": len(self.parameters),
            "total_episodes": self.episode_counter,
            "current_params": self.get_current_params(),
            "best_params": self.tracker.best_parameters,
            "best_performance": self.tracker.best_performance,
            "moving_avg": self.tracker.moving_average(),
            "trend": self.tracker.trend(),
            "phi_metric": self.tracker.best_performance * PHI_INV,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[LearningAdaptationEngine] = None

def get_learning_adaptation_engine() -> LearningAdaptationEngine:
    """Get or create the singleton LearningAdaptationEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = LearningAdaptationEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-317 Learning Adaptation Protocol (Python) ===")
    
    engine = get_learning_adaptation_engine()
    
    # Add parameters
    engine.add_parameter("x", initial_value=0.1, min_value=-5, max_value=5)
    engine.add_parameter("y", initial_value=0.1, min_value=-5, max_value=5)
    
    # Set objective: maximize -(x^2 + y^2) (minimum at origin)
    engine.set_objective(lambda p: -(p["x"]**2 + p["y"]**2))
    
    # Train
    print("Training...")
    episodes = engine.train(50)
    
    # Results
    best = engine.get_best()
    print(f"Best parameters: {best['parameters']}")
    print(f"Best performance: {best['performance']:.4f}")
    
    print(f"Report: {engine.coherence_report()}")
