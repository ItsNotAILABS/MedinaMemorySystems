"""
PROTO-328 — Action Selection Protocol (Python)
Behavior arbitration and action prioritization for MEDINA Memory Systems.

Charter: PROTO-328
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import random
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable
from collections import defaultdict
from enum import Enum
import heapq

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class ActionType(Enum):
    """Types of actions."""
    MOTOR = "motor"
    COGNITIVE = "cognitive"
    COMMUNICATIVE = "communicative"
    PERCEPTUAL = "perceptual"
    INTERNAL = "internal"


class SelectionStrategy(Enum):
    """Action selection strategies."""
    WINNER_TAKE_ALL = "winner_take_all"
    SOFTMAX = "softmax"
    EPSILON_GREEDY = "epsilon_greedy"
    UCB = "ucb"  # Upper Confidence Bound
    THOMPSON = "thompson"  # Thompson sampling


@dataclass
class Action:
    """An action that can be selected and executed."""
    id: str
    name: str
    action_type: ActionType = ActionType.COGNITIVE
    utility: float = 0.5
    cost: float = 0.1
    duration: float = 0.1
    preconditions: List[Callable[[], bool]] = field(default_factory=list)
    effects: Dict[str, Any] = field(default_factory=dict)
    success_count: int = 0
    failure_count: int = 0
    total_reward: float = 0.0
    last_selected: float = 0.0
    
    def is_applicable(self) -> bool:
        """Check if all preconditions are met."""
        return all(p() for p in self.preconditions)
    
    def expected_value(self) -> float:
        """Compute expected value (utility / cost)."""
        return (self.utility * PHI_INV) / (self.cost + 0.01)
    
    def success_rate(self) -> float:
        """Compute success rate."""
        total = self.success_count + self.failure_count
        if total == 0:
            return 0.5  # Optimistic prior
        return self.success_count / total
    
    def q_value(self) -> float:
        """Compute Q-value estimate."""
        if self.success_count + self.failure_count == 0:
            return self.utility * PHI_INV
        return self.total_reward / (self.success_count + self.failure_count + 1)
    
    def ucb_value(self, total_selections: int, exploration: float = PHI) -> float:
        """Compute UCB value for exploration-exploitation trade-off."""
        n = self.success_count + self.failure_count
        if n == 0:
            return float('inf')  # Always try untried actions
        
        exploitation = self.q_value()
        exploration_bonus = exploration * math.sqrt(math.log(total_selections + 1) / n)
        return exploitation + exploration_bonus


@dataclass
class Behavior:
    """A complex behavior composed of multiple actions."""
    id: str
    name: str
    action_sequence: List[str] = field(default_factory=list)
    priority: float = 0.5
    activation: float = 0.0
    threshold: float = 0.5
    inhibits: Set[str] = field(default_factory=set)
    
    def activate(self, delta: float) -> None:
        """Increase activation level."""
        self.activation = min(1.0, self.activation + delta * PHI_INV)
    
    def decay(self, rate: float = 0.1) -> None:
        """Decay activation over time."""
        self.activation *= (1 - rate * PHI_INV)
    
    def is_active(self) -> bool:
        """Check if behavior is above threshold."""
        return self.activation >= self.threshold


class ActionSelectionEngine:
    """
    Action selection engine with φ-coherent behavior arbitration.
    """
    
    def __init__(self, strategy: SelectionStrategy = SelectionStrategy.SOFTMAX):
        self.actions: Dict[str, Action] = {}
        self.behaviors: Dict[str, Behavior] = {}
        self.strategy = strategy
        self.temperature = PHI_INV  # For softmax
        self.epsilon = PHI_INV * 0.1  # For epsilon-greedy
        self.selection_history: List[Dict[str, Any]] = []
        self.total_selections = 0
        self.current_behavior: Optional[str] = None
        self.action_queue: List[str] = []
        self.beat_count = 0
    
    def register_action(self, id: str, name: str, action_type: ActionType = ActionType.COGNITIVE,
                        utility: float = 0.5, cost: float = 0.1, **kwargs) -> Action:
        """Register a new action."""
        action = Action(id=id, name=name, action_type=action_type,
                       utility=utility, cost=cost, **kwargs)
        self.actions[id] = action
        return action
    
    def register_behavior(self, id: str, name: str, action_ids: List[str],
                          priority: float = 0.5) -> Behavior:
        """Register a complex behavior."""
        behavior = Behavior(id=id, name=name, action_sequence=action_ids,
                           priority=priority)
        self.behaviors[id] = behavior
        return behavior
    
    def get_applicable_actions(self) -> List[Action]:
        """Get all currently applicable actions."""
        return [a for a in self.actions.values() if a.is_applicable()]
    
    def select_action(self, context: Dict[str, Any] = None) -> Optional[Action]:
        """Select the next action using the configured strategy."""
        applicable = self.get_applicable_actions()
        if not applicable:
            return None
        
        # Apply context modulation
        if context:
            self._modulate_utilities(applicable, context)
        
        # Select based on strategy
        selected = None
        if self.strategy == SelectionStrategy.WINNER_TAKE_ALL:
            selected = self._winner_take_all(applicable)
        elif self.strategy == SelectionStrategy.SOFTMAX:
            selected = self._softmax_select(applicable)
        elif self.strategy == SelectionStrategy.EPSILON_GREEDY:
            selected = self._epsilon_greedy(applicable)
        elif self.strategy == SelectionStrategy.UCB:
            selected = self._ucb_select(applicable)
        elif self.strategy == SelectionStrategy.THOMPSON:
            selected = self._thompson_sampling(applicable)
        
        if selected:
            selected.last_selected = time.time()
            self.total_selections += 1
            self._record_selection(selected)
        
        return selected
    
    def _winner_take_all(self, actions: List[Action]) -> Action:
        """Select action with highest expected value."""
        return max(actions, key=lambda a: a.expected_value())
    
    def _softmax_select(self, actions: List[Action]) -> Action:
        """Softmax probabilistic selection."""
        values = [a.expected_value() for a in actions]
        max_val = max(values)
        exp_values = [math.exp((v - max_val) / self.temperature) for v in values]
        total = sum(exp_values)
        probs = [e / total for e in exp_values]
        
        r = random.random()
        cumulative = 0.0
        for action, prob in zip(actions, probs):
            cumulative += prob
            if r <= cumulative:
                return action
        return actions[-1]
    
    def _epsilon_greedy(self, actions: List[Action]) -> Action:
        """Epsilon-greedy selection."""
        if random.random() < self.epsilon:
            return random.choice(actions)
        return self._winner_take_all(actions)
    
    def _ucb_select(self, actions: List[Action]) -> Action:
        """UCB selection for exploration-exploitation."""
        return max(actions, key=lambda a: a.ucb_value(self.total_selections))
    
    def _thompson_sampling(self, actions: List[Action]) -> Action:
        """Thompson sampling using Beta distribution."""
        samples = []
        for action in actions:
            # Beta distribution parameters
            alpha = action.success_count + 1
            beta = action.failure_count + 1
            sample = random.betavariate(alpha, beta) * action.expected_value()
            samples.append((sample, action))
        return max(samples, key=lambda x: x[0])[1]
    
    def _modulate_utilities(self, actions: List[Action], context: Dict[str, Any]) -> None:
        """Modulate action utilities based on context."""
        for action in actions:
            # Urgency modulation
            if "urgency" in context:
                action.utility *= (1 + context["urgency"] * PHI_INV)
            
            # Type preference modulation
            if "preferred_type" in context and action.action_type.value == context["preferred_type"]:
                action.utility *= PHI
            
            # Recency penalty
            if action.last_selected > 0:
                recency = time.time() - action.last_selected
                if recency < 1.0:  # Recent selection penalty
                    action.utility *= recency * PHI_INV
    
    def update_action(self, action_id: str, success: bool, reward: float = 0.0) -> None:
        """Update action statistics after execution."""
        if action_id not in self.actions:
            return
        
        action = self.actions[action_id]
        if success:
            action.success_count += 1
        else:
            action.failure_count += 1
        
        action.total_reward += reward
        
        # Update utility estimate
        learning_rate = PHI_INV * 0.1
        action.utility = (1 - learning_rate) * action.utility + learning_rate * action.q_value()
    
    def activate_behavior(self, behavior_id: str, activation_delta: float = 0.5) -> bool:
        """Activate a behavior."""
        if behavior_id not in self.behaviors:
            return False
        
        behavior = self.behaviors[behavior_id]
        behavior.activate(activation_delta)
        
        # Inhibit competing behaviors
        for other_id in behavior.inhibits:
            if other_id in self.behaviors:
                self.behaviors[other_id].activation *= PHI_INV
        
        # If behavior becomes active, queue its actions
        if behavior.is_active() and not self.action_queue:
            self.current_behavior = behavior_id
            self.action_queue = list(behavior.action_sequence)
        
        return behavior.is_active()
    
    def get_next_queued_action(self) -> Optional[Action]:
        """Get next action from behavior queue."""
        while self.action_queue:
            action_id = self.action_queue.pop(0)
            if action_id in self.actions:
                action = self.actions[action_id]
                if action.is_applicable():
                    return action
        
        self.current_behavior = None
        return None
    
    def decay_behaviors(self, dt: float) -> None:
        """Decay all behavior activations."""
        for behavior in self.behaviors.values():
            behavior.decay(dt * PHI_INV)
    
    def arbitrate(self) -> Optional[Behavior]:
        """Arbitrate among active behaviors."""
        active = [b for b in self.behaviors.values() if b.is_active()]
        if not active:
            return None
        
        # Winner-take-all among active behaviors
        winner = max(active, key=lambda b: b.activation * b.priority)
        
        # Suppress others
        for behavior in active:
            if behavior != winner:
                behavior.activation *= PHI_INV * PHI_INV
        
        return winner
    
    def _record_selection(self, action: Action) -> None:
        """Record action selection."""
        self.selection_history.append({
            "action_id": action.id,
            "utility": action.utility,
            "expected_value": action.expected_value(),
            "success_rate": action.success_rate(),
            "timestamp": time.time(),
            "strategy": self.strategy.value
        })
        if len(self.selection_history) > 10000:
            self.selection_history = self.selection_history[-5000:]
        
        self.beat_count += 1
    
    def get_stats(self) -> Dict[str, Any]:
        """Get action selection statistics."""
        if not self.actions:
            return {"total_actions": 0}
        
        utilities = [a.utility for a in self.actions.values()]
        success_rates = [a.success_rate() for a in self.actions.values()]
        
        return {
            "total_actions": len(self.actions),
            "total_behaviors": len(self.behaviors),
            "total_selections": self.total_selections,
            "current_behavior": self.current_behavior,
            "queue_length": len(self.action_queue),
            "mean_utility": sum(utilities) / len(utilities),
            "mean_success_rate": sum(success_rates) / len(success_rates),
            "strategy": self.strategy.value,
            "beat_count": self.beat_count,
            "phi_coherence": sum(a.success_rate() * a.utility for a in self.actions.values()) / len(self.actions) * PHI_INV
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_action_engine: Optional[ActionSelectionEngine] = None

def get_action_selection_engine() -> ActionSelectionEngine:
    """Get or create the global action selection engine."""
    global _action_engine
    if _action_engine is None:
        _action_engine = ActionSelectionEngine()
    return _action_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "ActionType", "SelectionStrategy", "Action", "Behavior",
    "ActionSelectionEngine", "get_action_selection_engine"
]
