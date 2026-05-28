"""
PROTO-324 — Goal Management Protocol (Python)
Hierarchical goal tracking and prioritization for MEDINA Memory Systems.

Charter: PROTO-324
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import uuid
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable
from collections import defaultdict
from enum import Enum
import heapq

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class GoalStatus(Enum):
    """Status of a goal."""
    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    COMPLETED = "completed"
    FAILED = "failed"
    ABANDONED = "abandoned"


class GoalPriority(Enum):
    """Priority levels for goals."""
    CRITICAL = 5
    HIGH = 4
    MEDIUM = 3
    LOW = 2
    OPTIONAL = 1


@dataclass
class Goal:
    """A goal with hierarchical structure."""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = ""
    description: str = ""
    priority: GoalPriority = GoalPriority.MEDIUM
    status: GoalStatus = GoalStatus.PENDING
    progress: float = 0.0
    parent_id: Optional[str] = None
    children_ids: Set[str] = field(default_factory=set)
    dependencies: Set[str] = field(default_factory=set)
    deadline: Optional[float] = None
    created_at: float = field(default_factory=time.time)
    started_at: Optional[float] = None
    completed_at: Optional[float] = None
    value: float = 1.0
    cost: float = 1.0
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def compute_utility(self) -> float:
        """Compute goal utility (value/cost ratio)."""
        time_pressure = 1.0
        if self.deadline:
            remaining = max(0, self.deadline - time.time())
            time_pressure = 1 + PHI / (remaining + 1)
        
        return (self.value * self.priority.value * time_pressure) / (self.cost + 0.1) * PHI_INV
    
    def is_achievable(self, completed_goals: Set[str]) -> bool:
        """Check if all dependencies are satisfied."""
        return self.dependencies.issubset(completed_goals)
    
    def update_progress(self, delta: float) -> None:
        """Update goal progress."""
        self.progress = min(1.0, max(0.0, self.progress + delta))
        if self.progress >= 1.0:
            self.complete()
    
    def activate(self) -> None:
        """Activate the goal."""
        self.status = GoalStatus.ACTIVE
        self.started_at = time.time()
    
    def complete(self) -> None:
        """Mark goal as completed."""
        self.status = GoalStatus.COMPLETED
        self.completed_at = time.time()
        self.progress = 1.0
    
    def fail(self) -> None:
        """Mark goal as failed."""
        self.status = GoalStatus.FAILED
        self.completed_at = time.time()


class GoalStack:
    """Stack of active goals for execution."""
    
    def __init__(self, max_size: int = 10):
        self.stack: List[Goal] = []
        self.max_size = max_size
    
    def push(self, goal: Goal) -> bool:
        """Push a goal onto the stack."""
        if len(self.stack) >= self.max_size:
            return False
        self.stack.append(goal)
        goal.activate()
        return True
    
    def pop(self) -> Optional[Goal]:
        """Pop the top goal."""
        return self.stack.pop() if self.stack else None
    
    def peek(self) -> Optional[Goal]:
        """Peek at the top goal."""
        return self.stack[-1] if self.stack else None
    
    def interrupt(self, goal: Goal) -> bool:
        """Interrupt current goal with higher priority one."""
        if not self.stack:
            return self.push(goal)
        
        if goal.priority.value > self.stack[-1].priority.value:
            self.stack[-1].status = GoalStatus.SUSPENDED
            return self.push(goal)
        return False


class GoalManagementEngine:
    """
    Hierarchical goal management with φ-coherent prioritization.
    """
    
    def __init__(self):
        self.goals: Dict[str, Goal] = {}
        self.root_goals: Set[str] = set()
        self.completed_goals: Set[str] = set()
        self.active_stack = GoalStack()
        self.goal_queue: List[Tuple[float, str]] = []
        self.achievement_history: List[Dict[str, Any]] = []
        self.total_value_achieved = 0.0
        self.beat_count = 0
    
    def create_goal(self, name: str, priority: GoalPriority = GoalPriority.MEDIUM,
                    parent_id: Optional[str] = None, **kwargs) -> Goal:
        """Create a new goal."""
        goal = Goal(name=name, priority=priority, parent_id=parent_id, **kwargs)
        self.goals[goal.id] = goal
        
        if parent_id and parent_id in self.goals:
            self.goals[parent_id].children_ids.add(goal.id)
        else:
            self.root_goals.add(goal.id)
        
        # Add to priority queue
        utility = -goal.compute_utility()
        heapq.heappush(self.goal_queue, (utility, goal.id))
        
        return goal
    
    def add_dependency(self, goal_id: str, depends_on: str) -> bool:
        """Add dependency between goals."""
        if goal_id not in self.goals or depends_on not in self.goals:
            return False
        self.goals[goal_id].dependencies.add(depends_on)
        return True
    
    def get_achievable_goals(self) -> List[Goal]:
        """Get goals whose dependencies are satisfied."""
        return [
            g for g in self.goals.values()
            if g.status == GoalStatus.PENDING and g.is_achievable(self.completed_goals)
        ]
    
    def select_next_goal(self) -> Optional[Goal]:
        """Select next goal to pursue using utility maximization."""
        achievable = self.get_achievable_goals()
        if not achievable:
            return None
        
        # Select by utility
        return max(achievable, key=lambda g: g.compute_utility())
    
    def pursue_goal(self, goal_id: str) -> bool:
        """Start pursuing a specific goal."""
        if goal_id not in self.goals:
            return False
        
        goal = self.goals[goal_id]
        if not goal.is_achievable(self.completed_goals):
            return False
        
        return self.active_stack.push(goal)
    
    def update_progress(self, goal_id: str, delta: float) -> Dict[str, Any]:
        """Update goal progress and propagate to parents."""
        if goal_id not in self.goals:
            return {"success": False}
        
        goal = self.goals[goal_id]
        old_progress = goal.progress
        goal.update_progress(delta)
        
        result = {
            "success": True,
            "goal_id": goal_id,
            "old_progress": old_progress,
            "new_progress": goal.progress,
            "completed": goal.status == GoalStatus.COMPLETED
        }
        
        if goal.status == GoalStatus.COMPLETED:
            self._on_goal_completed(goal)
        
        # Propagate to parent
        if goal.parent_id and goal.parent_id in self.goals:
            parent = self.goals[goal.parent_id]
            children = [self.goals[cid] for cid in parent.children_ids if cid in self.goals]
            if children:
                parent.progress = sum(c.progress for c in children) / len(children)
        
        return result
    
    def complete_goal(self, goal_id: str) -> bool:
        """Mark a goal as completed."""
        if goal_id not in self.goals:
            return False
        
        goal = self.goals[goal_id]
        goal.complete()
        self._on_goal_completed(goal)
        return True
    
    def fail_goal(self, goal_id: str, propagate: bool = True) -> Set[str]:
        """Mark goal as failed, optionally propagating to dependents."""
        failed = set()
        if goal_id not in self.goals:
            return failed
        
        goal = self.goals[goal_id]
        goal.fail()
        failed.add(goal_id)
        
        if propagate:
            # Fail goals depending on this one
            for other in self.goals.values():
                if goal_id in other.dependencies and other.status == GoalStatus.PENDING:
                    other.fail()
                    failed.add(other.id)
        
        self._record_event("failed", goal)
        return failed
    
    def decompose_goal(self, goal_id: str, subgoal_specs: List[Dict[str, Any]]) -> List[Goal]:
        """Decompose a goal into subgoals."""
        if goal_id not in self.goals:
            return []
        
        parent = self.goals[goal_id]
        subgoals = []
        
        for spec in subgoal_specs:
            subgoal = self.create_goal(
                name=spec.get("name", f"Subgoal of {parent.name}"),
                priority=spec.get("priority", parent.priority),
                parent_id=goal_id,
                value=parent.value / len(subgoal_specs) * PHI_INV,
                **{k: v for k, v in spec.items() if k not in ["name", "priority"]}
            )
            subgoals.append(subgoal)
        
        return subgoals
    
    def get_goal_hierarchy(self, goal_id: str) -> Dict[str, Any]:
        """Get hierarchical structure of a goal."""
        if goal_id not in self.goals:
            return {}
        
        goal = self.goals[goal_id]
        children = [
            self.get_goal_hierarchy(cid)
            for cid in goal.children_ids
            if cid in self.goals
        ]
        
        return {
            "id": goal.id,
            "name": goal.name,
            "status": goal.status.value,
            "progress": goal.progress,
            "utility": goal.compute_utility(),
            "children": children
        }
    
    def replan(self) -> List[Goal]:
        """Replan goals based on current state."""
        # Refresh queue
        self.goal_queue = []
        for goal in self.goals.values():
            if goal.status in [GoalStatus.PENDING, GoalStatus.SUSPENDED]:
                utility = -goal.compute_utility()
                heapq.heappush(self.goal_queue, (utility, goal.id))
        
        # Get top goals
        plan = []
        temp_queue = list(self.goal_queue)
        while temp_queue and len(plan) < 5:
            _, goal_id = heapq.heappop(temp_queue)
            if goal_id in self.goals:
                goal = self.goals[goal_id]
                if goal.is_achievable(self.completed_goals):
                    plan.append(goal)
        
        self.beat_count += 1
        return plan
    
    def _on_goal_completed(self, goal: Goal) -> None:
        """Handle goal completion."""
        self.completed_goals.add(goal.id)
        self.total_value_achieved += goal.value * PHI_INV
        
        # Pop from stack if active
        if self.active_stack.peek() == goal:
            self.active_stack.pop()
        
        self._record_event("completed", goal)
    
    def _record_event(self, event_type: str, goal: Goal) -> None:
        """Record goal event."""
        self.achievement_history.append({
            "type": event_type,
            "goal_id": goal.id,
            "goal_name": goal.name,
            "value": goal.value,
            "timestamp": time.time(),
            "beat": self.beat_count
        })
    
    def get_stats(self) -> Dict[str, Any]:
        """Get goal management statistics."""
        by_status = defaultdict(int)
        for goal in self.goals.values():
            by_status[goal.status.value] += 1
        
        return {
            "total_goals": len(self.goals),
            "root_goals": len(self.root_goals),
            "completed_goals": len(self.completed_goals),
            "by_status": dict(by_status),
            "active_stack_size": len(self.active_stack.stack),
            "total_value_achieved": self.total_value_achieved,
            "beat_count": self.beat_count,
            "phi_efficiency": self.total_value_achieved / (len(self.completed_goals) + 1) * PHI_INV
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_goal_engine: Optional[GoalManagementEngine] = None

def get_goal_management_engine() -> GoalManagementEngine:
    """Get or create the global goal management engine."""
    global _goal_engine
    if _goal_engine is None:
        _goal_engine = GoalManagementEngine()
    return _goal_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "GoalStatus", "GoalPriority", "Goal", "GoalStack",
    "GoalManagementEngine", "get_goal_management_engine"
]
