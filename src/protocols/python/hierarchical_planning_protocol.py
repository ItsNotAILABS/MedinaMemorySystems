"""
PROTO-313 — Hierarchical Planning Protocol (Python)
Multi-level planning with φ-coherent goal decomposition.

Charter: PROTO-313
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set
from enum import Enum
import heapq

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


class GoalStatus(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    ACHIEVED = "achieved"
    FAILED = "failed"
    ABANDONED = "abandoned"


@dataclass
class Goal:
    """A goal in the planning hierarchy."""
    id: str
    description: str
    priority: float = 0.5
    status: GoalStatus = GoalStatus.PENDING
    parent_id: Optional[str] = None
    subgoal_ids: List[str] = field(default_factory=list)
    preconditions: List[str] = field(default_factory=list)
    effects: List[str] = field(default_factory=list)
    cost: float = 1.0
    deadline: Optional[float] = None
    progress: float = 0.0
    
    def urgency(self) -> float:
        """Calculate goal urgency."""
        base = self.priority * PHI
        if self.deadline:
            time_remaining = self.deadline - time.time()
            if time_remaining > 0:
                base *= 1 / (1 + time_remaining * PHI_INV * 0.001)
            else:
                base *= PHI  # Past deadline
        return base
    
    def is_achievable(self, world_state: Set[str]) -> bool:
        """Check if preconditions are met."""
        return all(pre in world_state for pre in self.preconditions)


@dataclass
class Action:
    """An action that can be taken to achieve goals."""
    id: str
    name: str
    preconditions: List[str]
    effects: List[str]
    cost: float = 1.0
    duration: float = 1.0
    
    def is_applicable(self, world_state: Set[str]) -> bool:
        """Check if action can be applied."""
        return all(pre in world_state for pre in self.preconditions)
    
    def apply(self, world_state: Set[str]) -> Set[str]:
        """Apply action to world state."""
        new_state = world_state.copy()
        for effect in self.effects:
            if effect.startswith("NOT_"):
                new_state.discard(effect[4:])
            else:
                new_state.add(effect)
        return new_state


class PlanNode:
    """A node in the planning search tree."""
    
    def __init__(self, state: Set[str], parent: Optional["PlanNode"] = None,
                 action: Optional[Action] = None, cost: float = 0.0):
        self.state = state
        self.parent = parent
        self.action = action
        self.cost = cost
    
    def __lt__(self, other):
        return self.cost < other.cost


class HierarchicalPlanner:
    """Plans at multiple abstraction levels."""
    
    def __init__(self):
        self.plans: Dict[str, List[Action]] = {}
        self.planning_attempts = 0
    
    def plan(self, initial_state: Set[str], goal_conditions: Set[str],
            actions: List[Action], max_depth: int = 100) -> Optional[List[Action]]:
        """A* planning to achieve goal conditions."""
        self.planning_attempts += 1
        
        if goal_conditions.issubset(initial_state):
            return []
        
        # Priority queue: (f_cost, node)
        start_node = PlanNode(initial_state, None, None, 0)
        frontier = [(0, start_node)]
        visited = {frozenset(initial_state)}
        
        while frontier and len(visited) < max_depth * 100:
            _, current = heapq.heappop(frontier)
            
            for action in actions:
                if not action.is_applicable(current.state):
                    continue
                
                new_state = action.apply(current.state)
                state_key = frozenset(new_state)
                
                if state_key in visited:
                    continue
                
                visited.add(state_key)
                new_cost = current.cost + action.cost
                
                # Check goal
                if goal_conditions.issubset(new_state):
                    return self._extract_plan(PlanNode(new_state, current, action, new_cost))
                
                # Heuristic: number of unmet goals
                h = len(goal_conditions - new_state) * PHI_INV
                f = new_cost + h
                
                heapq.heappush(frontier, (f, PlanNode(new_state, current, action, new_cost)))
        
        return None
    
    def _extract_plan(self, node: PlanNode) -> List[Action]:
        """Extract plan from goal node."""
        plan = []
        current = node
        while current.action is not None:
            plan.append(current.action)
            current = current.parent
        plan.reverse()
        return plan


class GoalDecomposer:
    """Decomposes high-level goals into subgoals."""
    
    def __init__(self):
        self.decomposition_rules: Dict[str, List[str]] = {}
    
    def add_rule(self, goal_pattern: str, subgoals: List[str]) -> None:
        """Add a decomposition rule."""
        self.decomposition_rules[goal_pattern] = subgoals
    
    def decompose(self, goal: Goal) -> List[Goal]:
        """Decompose a goal into subgoals."""
        for pattern, subgoal_descs in self.decomposition_rules.items():
            if pattern in goal.description:
                subgoals = []
                for i, desc in enumerate(subgoal_descs):
                    subgoal = Goal(
                        id=f"{goal.id}-sub-{i}",
                        description=desc,
                        priority=goal.priority * PHI_INV,
                        parent_id=goal.id,
                        cost=goal.cost / len(subgoal_descs)
                    )
                    subgoals.append(subgoal)
                    goal.subgoal_ids.append(subgoal.id)
                return subgoals
        return []


class HierarchicalPlanningEngine:
    """
    Main hierarchical planning engine with φ-coherent processing.
    """
    
    def __init__(self):
        self.goals: Dict[str, Goal] = {}
        self.actions: Dict[str, Action] = {}
        self.world_state: Set[str] = set()
        self.planner = HierarchicalPlanner()
        self.decomposer = GoalDecomposer()
        self.active_plans: Dict[str, List[Action]] = {}
        self.beat_count = 0
        self.goal_counter = 0
        self.action_counter = 0
    
    def set_world_state(self, facts: List[str]) -> None:
        """Set the current world state."""
        self.world_state = set(facts)
    
    def add_fact(self, fact: str) -> None:
        """Add a fact to world state."""
        self.world_state.add(fact)
    
    def remove_fact(self, fact: str) -> None:
        """Remove a fact from world state."""
        self.world_state.discard(fact)
    
    def create_goal(self, description: str, priority: float = 0.5,
                   preconditions: Optional[List[str]] = None,
                   effects: Optional[List[str]] = None,
                   deadline: Optional[float] = None) -> Goal:
        """Create a new goal."""
        self.goal_counter += 1
        goal = Goal(
            id=f"goal-{self.goal_counter}",
            description=description,
            priority=priority,
            preconditions=preconditions or [],
            effects=effects or [],
            deadline=deadline
        )
        self.goals[goal.id] = goal
        return goal
    
    def create_action(self, name: str, preconditions: List[str],
                     effects: List[str], cost: float = 1.0,
                     duration: float = 1.0) -> Action:
        """Create a new action."""
        self.action_counter += 1
        action = Action(
            id=f"action-{self.action_counter}",
            name=name,
            preconditions=preconditions,
            effects=effects,
            cost=cost,
            duration=duration
        )
        self.actions[action.id] = action
        return action
    
    def add_decomposition_rule(self, goal_pattern: str, subgoals: List[str]) -> None:
        """Add a goal decomposition rule."""
        self.decomposer.add_rule(goal_pattern, subgoals)
    
    def decompose_goal(self, goal_id: str) -> List[Goal]:
        """Decompose a goal into subgoals."""
        goal = self.goals.get(goal_id)
        if not goal:
            return []
        
        subgoals = self.decomposer.decompose(goal)
        for sg in subgoals:
            self.goals[sg.id] = sg
        return subgoals
    
    def plan_for_goal(self, goal_id: str) -> Optional[List[Action]]:
        """Generate a plan to achieve a goal."""
        goal = self.goals.get(goal_id)
        if not goal:
            return None
        
        goal_conditions = set(goal.effects)
        actions_list = list(self.actions.values())
        
        plan = self.planner.plan(self.world_state, goal_conditions, actions_list)
        
        if plan:
            self.active_plans[goal_id] = plan
            goal.status = GoalStatus.ACTIVE
        
        return plan
    
    def execute_step(self, goal_id: str) -> Optional[Action]:
        """Execute one step of a plan."""
        plan = self.active_plans.get(goal_id)
        if not plan:
            return None
        
        action = plan.pop(0)
        if action.is_applicable(self.world_state):
            self.world_state = action.apply(self.world_state)
            
            goal = self.goals.get(goal_id)
            if goal:
                goal.progress = 1 - len(plan) / (len(plan) + 1)
                
                # Check if goal achieved
                if not plan and set(goal.effects).issubset(self.world_state):
                    goal.status = GoalStatus.ACHIEVED
                    del self.active_plans[goal_id]
            
            return action
        
        return None
    
    def get_prioritized_goals(self) -> List[Goal]:
        """Get goals sorted by urgency."""
        pending = [g for g in self.goals.values() 
                   if g.status in [GoalStatus.PENDING, GoalStatus.ACTIVE]]
        return sorted(pending, key=lambda g: g.urgency(), reverse=True)
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        # Auto-execute active plans
        executed = []
        for goal_id in list(self.active_plans.keys()):
            action = self.execute_step(goal_id)
            if action:
                executed.append(action.name)
        
        achieved = sum(1 for g in self.goals.values() if g.status == GoalStatus.ACHIEVED)
        
        return {
            "beat": self.beat_count,
            "goals": len(self.goals),
            "actions": len(self.actions),
            "active_plans": len(self.active_plans),
            "achieved_goals": achieved,
            "world_state_size": len(self.world_state),
            "executed_actions": executed,
            "phi_coherence": achieved / max(1, len(self.goals)) * PHI,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate planning coherence report."""
        by_status = {}
        for g in self.goals.values():
            status = g.status.value
            by_status[status] = by_status.get(status, 0) + 1
        
        return {
            "total_goals": len(self.goals),
            "total_actions": len(self.actions),
            "goals_by_status": by_status,
            "active_plans": len(self.active_plans),
            "planning_attempts": self.planner.planning_attempts,
            "world_state_facts": len(self.world_state),
            "phi_metric": by_status.get("achieved", 0) / max(1, len(self.goals)) * PHI,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[HierarchicalPlanningEngine] = None

def get_hierarchical_planning_engine() -> HierarchicalPlanningEngine:
    """Get or create the singleton HierarchicalPlanningEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = HierarchicalPlanningEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-313 Hierarchical Planning Protocol (Python) ===")
    
    engine = get_hierarchical_planning_engine()
    
    # Set initial state
    engine.set_world_state(["at_home", "have_keys"])
    
    # Create actions
    engine.create_action("drive_to_store", ["at_home", "have_keys"], 
                        ["NOT_at_home", "at_store"], cost=2)
    engine.create_action("buy_groceries", ["at_store"], 
                        ["have_groceries"], cost=1)
    engine.create_action("drive_home", ["at_store", "have_keys"], 
                        ["NOT_at_store", "at_home"], cost=2)
    
    # Create goal
    goal = engine.create_goal("Get groceries and return home",
                             effects=["have_groceries", "at_home"])
    
    # Plan
    plan = engine.plan_for_goal(goal.id)
    print(f"Plan: {[a.name for a in plan] if plan else 'No plan found'}")
    
    # Execute
    while engine.active_plans:
        result = engine.tick()
        print(f"Executed: {result['executed_actions']}")
    
    print(f"Goal status: {goal.status.value}")
    print(f"Report: {engine.coherence_report()}")
