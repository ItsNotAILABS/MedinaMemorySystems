"""
PROTO-333 — Planning Protocol (Python)
Hierarchical task network planning for MEDINA Memory Systems.

Charter: PROTO-333
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


class TaskType(Enum):
    """Types of planning tasks."""
    PRIMITIVE = "primitive"
    COMPOUND = "compound"
    GOAL = "goal"


class PlanStatus(Enum):
    """Status of a plan."""
    PENDING = "pending"
    EXECUTING = "executing"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    ABORTED = "aborted"


@dataclass
class State:
    """A planning state."""
    predicates: Set[str] = field(default_factory=set)
    variables: Dict[str, Any] = field(default_factory=dict)
    
    def satisfies(self, conditions: Set[str]) -> bool:
        """Check if state satisfies conditions."""
        return conditions.issubset(self.predicates)
    
    def apply(self, effects: Dict[str, bool]) -> State:
        """Apply effects to create new state."""
        new_predicates = set(self.predicates)
        for pred, value in effects.items():
            if value:
                new_predicates.add(pred)
            else:
                new_predicates.discard(pred)
        return State(predicates=new_predicates, variables=dict(self.variables))


@dataclass
class Operator:
    """A planning operator (action schema)."""
    id: str
    name: str
    preconditions: Set[str] = field(default_factory=set)
    effects: Dict[str, bool] = field(default_factory=dict)
    cost: float = 1.0
    duration: float = 1.0
    
    def is_applicable(self, state: State) -> bool:
        """Check if operator is applicable in state."""
        return state.satisfies(self.preconditions)
    
    def apply(self, state: State) -> State:
        """Apply operator to state."""
        return state.apply(self.effects)


@dataclass
class Task:
    """A planning task."""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = ""
    task_type: TaskType = TaskType.PRIMITIVE
    operator_id: Optional[str] = None
    subtasks: List[str] = field(default_factory=list)
    preconditions: Set[str] = field(default_factory=set)
    effects: Dict[str, bool] = field(default_factory=dict)
    priority: float = 0.5
    
    def is_primitive(self) -> bool:
        """Check if task is primitive (directly executable)."""
        return self.task_type == TaskType.PRIMITIVE


@dataclass
class Plan:
    """A plan (sequence of actions)."""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    steps: List[str] = field(default_factory=list)  # Task IDs
    status: PlanStatus = PlanStatus.PENDING
    total_cost: float = 0.0
    total_duration: float = 0.0
    created_at: float = field(default_factory=time.time)
    current_step: int = 0
    
    def is_complete(self) -> bool:
        """Check if plan execution is complete."""
        return self.current_step >= len(self.steps)


class Method:
    """A decomposition method for compound tasks."""
    
    def __init__(self, task_name: str, subtask_names: List[str],
                 preconditions: Set[str] = None):
        self.task_name = task_name
        self.subtask_names = subtask_names
        self.preconditions = preconditions or set()
    
    def is_applicable(self, state: State) -> bool:
        """Check if method is applicable in state."""
        return state.satisfies(self.preconditions)


class PlanningEngine:
    """
    HTN planning engine with φ-coherent optimization.
    """
    
    def __init__(self, max_depth: int = 20):
        self.operators: Dict[str, Operator] = {}
        self.tasks: Dict[str, Task] = {}
        self.methods: Dict[str, List[Method]] = defaultdict(list)
        self.plans: Dict[str, Plan] = {}
        self.current_state: State = State()
        self.goal_state: Set[str] = set()
        self.max_depth = max_depth
        self.planning_stats: Dict[str, int] = defaultdict(int)
        self.beat_count = 0
    
    def register_operator(self, id: str, name: str,
                          preconditions: Set[str] = None,
                          effects: Dict[str, bool] = None,
                          cost: float = 1.0) -> Operator:
        """Register a planning operator."""
        operator = Operator(
            id=id, name=name,
            preconditions=preconditions or set(),
            effects=effects or {},
            cost=cost
        )
        self.operators[id] = operator
        return operator
    
    def register_task(self, id: str, name: str,
                      task_type: TaskType = TaskType.PRIMITIVE,
                      operator_id: Optional[str] = None) -> Task:
        """Register a task."""
        task = Task(id=id, name=name, task_type=task_type,
                   operator_id=operator_id)
        self.tasks[id] = task
        return task
    
    def register_method(self, task_name: str, subtask_names: List[str],
                        preconditions: Set[str] = None) -> Method:
        """Register a decomposition method."""
        method = Method(task_name, subtask_names, preconditions)
        self.methods[task_name].append(method)
        return method
    
    def set_initial_state(self, predicates: Set[str],
                          variables: Dict[str, Any] = None) -> None:
        """Set the initial planning state."""
        self.current_state = State(predicates=predicates, 
                                   variables=variables or {})
    
    def set_goal(self, goal_predicates: Set[str]) -> None:
        """Set the goal state."""
        self.goal_state = goal_predicates
    
    def plan_htn(self, task_id: str) -> Optional[Plan]:
        """Create plan using HTN decomposition."""
        if task_id not in self.tasks:
            return None
        
        plan = Plan()
        success = self._decompose_task(task_id, self.current_state, plan, 0)
        
        if success:
            plan.status = PlanStatus.PENDING
            self.plans[plan.id] = plan
            self.planning_stats["htn_success"] += 1
        else:
            self.planning_stats["htn_failure"] += 1
            return None
        
        self.beat_count += 1
        return plan
    
    def _decompose_task(self, task_id: str, state: State, 
                        plan: Plan, depth: int) -> bool:
        """Recursively decompose a task."""
        if depth > self.max_depth:
            return False
        
        task = self.tasks.get(task_id)
        if not task:
            return False
        
        if task.is_primitive():
            # Primitive task - check if applicable
            if task.operator_id and task.operator_id in self.operators:
                operator = self.operators[task.operator_id]
                if operator.is_applicable(state):
                    plan.steps.append(task_id)
                    plan.total_cost += operator.cost
                    plan.total_duration += operator.duration
                    return True
            return False
        
        # Compound task - find applicable method
        for method in self.methods.get(task.name, []):
            if method.is_applicable(state):
                # Try to decompose using this method
                temp_plan = Plan(steps=list(plan.steps),
                               total_cost=plan.total_cost,
                               total_duration=plan.total_duration)
                temp_state = State(predicates=set(state.predicates),
                                  variables=dict(state.variables))
                
                success = True
                for subtask_name in method.subtask_names:
                    # Find matching task
                    subtask_id = next(
                        (t.id for t in self.tasks.values() 
                         if t.name == subtask_name), None
                    )
                    if not subtask_id:
                        success = False
                        break
                    
                    if not self._decompose_task(subtask_id, temp_state, 
                                                temp_plan, depth + 1):
                        success = False
                        break
                    
                    # Update state for next subtask
                    subtask = self.tasks[subtask_id]
                    if subtask.operator_id:
                        op = self.operators.get(subtask.operator_id)
                        if op:
                            temp_state = op.apply(temp_state)
                
                if success:
                    plan.steps = temp_plan.steps
                    plan.total_cost = temp_plan.total_cost
                    plan.total_duration = temp_plan.total_duration
                    return True
        
        return False
    
    def plan_forward(self) -> Optional[Plan]:
        """Create plan using forward state-space search."""
        # A* search
        start = self.current_state
        goal = self.goal_state
        
        # Priority queue: (f_cost, g_cost, state_hash, state, plan_steps)
        open_set = [(0, 0, hash(frozenset(start.predicates)), start, [])]
        closed_set = set()
        
        while open_set:
            f, g, _, current, steps = heapq.heappop(open_set)
            
            # Goal check
            if current.satisfies(goal):
                plan = Plan(steps=steps, total_cost=g)
                plan.status = PlanStatus.PENDING
                self.plans[plan.id] = plan
                self.planning_stats["forward_success"] += 1
                self.beat_count += 1
                return plan
            
            state_hash = hash(frozenset(current.predicates))
            if state_hash in closed_set:
                continue
            closed_set.add(state_hash)
            
            # Expand
            for op_id, operator in self.operators.items():
                if operator.is_applicable(current):
                    new_state = operator.apply(current)
                    new_g = g + operator.cost
                    
                    # Heuristic: number of unsatisfied goals
                    h = len(goal - new_state.predicates) * PHI_INV
                    new_f = new_g + h
                    
                    new_hash = hash(frozenset(new_state.predicates))
                    if new_hash not in closed_set:
                        # Find or create task for this operator
                        task_id = next(
                            (t.id for t in self.tasks.values() 
                             if t.operator_id == op_id), op_id
                        )
                        heapq.heappush(open_set, 
                                      (new_f, new_g, new_hash, 
                                       new_state, steps + [task_id]))
        
        self.planning_stats["forward_failure"] += 1
        return None
    
    def execute_step(self, plan_id: str) -> Optional[str]:
        """Execute next step of a plan."""
        if plan_id not in self.plans:
            return None
        
        plan = self.plans[plan_id]
        if plan.is_complete():
            plan.status = PlanStatus.SUCCEEDED
            return None
        
        plan.status = PlanStatus.EXECUTING
        task_id = plan.steps[plan.current_step]
        task = self.tasks.get(task_id)
        
        if task and task.operator_id:
            operator = self.operators.get(task.operator_id)
            if operator and operator.is_applicable(self.current_state):
                self.current_state = operator.apply(self.current_state)
                plan.current_step += 1
                self.planning_stats["steps_executed"] += 1
                return task_id
        
        # Step failed
        plan.status = PlanStatus.FAILED
        self.planning_stats["steps_failed"] += 1
        return None
    
    def replan(self, plan_id: str) -> Optional[Plan]:
        """Replan from current state."""
        if plan_id in self.plans:
            old_plan = self.plans[plan_id]
            old_plan.status = PlanStatus.ABORTED
        
        # Try forward planning from current state
        return self.plan_forward()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get planning statistics."""
        return {
            "total_operators": len(self.operators),
            "total_tasks": len(self.tasks),
            "total_methods": sum(len(m) for m in self.methods.values()),
            "total_plans": len(self.plans),
            "current_state_size": len(self.current_state.predicates),
            "goal_size": len(self.goal_state),
            "planning_stats": dict(self.planning_stats),
            "beat_count": self.beat_count,
            "phi_coherence": (self.planning_stats.get("htn_success", 0) + 
                            self.planning_stats.get("forward_success", 0)) /
                           (sum(self.planning_stats.values()) + 1) * PHI_INV
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_planning_engine: Optional[PlanningEngine] = None

def get_planning_engine() -> PlanningEngine:
    """Get or create the global planning engine."""
    global _planning_engine
    if _planning_engine is None:
        _planning_engine = PlanningEngine()
    return _planning_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "TaskType", "PlanStatus", "State", "Operator", "Task", "Plan", "Method",
    "PlanningEngine", "get_planning_engine"
]
