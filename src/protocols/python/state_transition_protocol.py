"""
PROTO-318 — State Transition Protocol (Python)
Finite state machine with φ-coherent transitions.

Charter: PROTO-318
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable, Set
from enum import Enum, auto

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


@dataclass
class State:
    """A state in the state machine."""
    id: str
    name: str
    entry_action: Optional[Callable] = None
    exit_action: Optional[Callable] = None
    is_final: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)
    entry_count: int = 0
    total_time: float = 0.0
    last_entered: Optional[float] = None


@dataclass  
class Transition:
    """A transition between states."""
    id: str
    from_state: str
    to_state: str
    trigger: str
    guard: Optional[Callable[[], bool]] = None
    action: Optional[Callable] = None
    priority: float = 1.0
    fire_count: int = 0


class TransitionHistory:
    """History of state transitions."""
    
    def __init__(self, max_size: int = 1000):
        self.history: List[Dict[str, Any]] = []
        self.max_size = max_size
    
    def record(self, from_state: str, to_state: str, trigger: str) -> None:
        """Record a transition."""
        if len(self.history) >= self.max_size:
            self.history.pop(0)
        
        self.history.append({
            "from": from_state,
            "to": to_state,
            "trigger": trigger,
            "timestamp": time.time()
        })
    
    def get_recent(self, n: int = 10) -> List[Dict[str, Any]]:
        """Get recent transitions."""
        return self.history[-n:]
    
    def transition_counts(self) -> Dict[str, int]:
        """Count transitions by type."""
        counts = {}
        for t in self.history:
            key = f"{t['from']}→{t['to']}"
            counts[key] = counts.get(key, 0) + 1
        return counts


class StateMachine:
    """Core finite state machine."""
    
    def __init__(self, name: str):
        self.name = name
        self.states: Dict[str, State] = {}
        self.transitions: Dict[str, Transition] = {}
        self.current_state: Optional[str] = None
        self.initial_state: Optional[str] = None
        self.history = TransitionHistory()
        self.state_counter = 0
        self.transition_counter = 0
    
    def add_state(self, name: str, entry_action: Optional[Callable] = None,
                 exit_action: Optional[Callable] = None, is_final: bool = False) -> State:
        """Add a state."""
        self.state_counter += 1
        state = State(
            id=f"state-{self.state_counter}",
            name=name,
            entry_action=entry_action,
            exit_action=exit_action,
            is_final=is_final
        )
        self.states[name] = state
        
        if self.initial_state is None:
            self.initial_state = name
        
        return state
    
    def add_transition(self, from_state: str, to_state: str, trigger: str,
                      guard: Optional[Callable[[], bool]] = None,
                      action: Optional[Callable] = None,
                      priority: float = 1.0) -> Transition:
        """Add a transition."""
        self.transition_counter += 1
        transition = Transition(
            id=f"trans-{self.transition_counter}",
            from_state=from_state,
            to_state=to_state,
            trigger=trigger,
            guard=guard,
            action=action,
            priority=priority
        )
        self.transitions[transition.id] = transition
        return transition
    
    def start(self) -> bool:
        """Start the state machine."""
        if not self.initial_state or self.initial_state not in self.states:
            return False
        
        self.current_state = self.initial_state
        state = self.states[self.current_state]
        state.entry_count += 1
        state.last_entered = time.time()
        
        if state.entry_action:
            state.entry_action()
        
        return True
    
    def fire(self, trigger: str) -> bool:
        """Fire a trigger."""
        if not self.current_state:
            return False
        
        # Find applicable transitions
        applicable = [
            t for t in self.transitions.values()
            if t.from_state == self.current_state and t.trigger == trigger
        ]
        
        # Filter by guard
        applicable = [t for t in applicable if t.guard is None or t.guard()]
        
        if not applicable:
            return False
        
        # Select highest priority
        transition = max(applicable, key=lambda t: t.priority * PHI_INV)
        
        # Execute transition
        return self._execute_transition(transition)
    
    def _execute_transition(self, transition: Transition) -> bool:
        """Execute a transition."""
        from_state = self.states.get(transition.from_state)
        to_state = self.states.get(transition.to_state)
        
        if not from_state or not to_state:
            return False
        
        # Exit current state
        if from_state.last_entered:
            from_state.total_time += time.time() - from_state.last_entered
        
        if from_state.exit_action:
            from_state.exit_action()
        
        # Execute transition action
        if transition.action:
            transition.action()
        
        transition.fire_count += 1
        
        # Record transition
        self.history.record(from_state.name, to_state.name, transition.trigger)
        
        # Enter new state
        self.current_state = to_state.name
        to_state.entry_count += 1
        to_state.last_entered = time.time()
        
        if to_state.entry_action:
            to_state.entry_action()
        
        return True
    
    def can_fire(self, trigger: str) -> bool:
        """Check if trigger can be fired."""
        if not self.current_state:
            return False
        
        applicable = [
            t for t in self.transitions.values()
            if t.from_state == self.current_state and t.trigger == trigger
            and (t.guard is None or t.guard())
        ]
        
        return len(applicable) > 0
    
    def get_available_triggers(self) -> List[str]:
        """Get triggers that can be fired from current state."""
        if not self.current_state:
            return []
        
        triggers = set()
        for t in self.transitions.values():
            if t.from_state == self.current_state:
                if t.guard is None or t.guard():
                    triggers.add(t.trigger)
        
        return list(triggers)
    
    def is_in_final_state(self) -> bool:
        """Check if in a final state."""
        if not self.current_state:
            return False
        return self.states[self.current_state].is_final


class HierarchicalStateMachine:
    """Hierarchical state machine with nested machines."""
    
    def __init__(self, name: str):
        self.name = name
        self.machines: Dict[str, StateMachine] = {}
        self.parent_map: Dict[str, str] = {}
        self.active_machines: Set[str] = set()
    
    def add_machine(self, machine: StateMachine, parent: Optional[str] = None) -> None:
        """Add a state machine."""
        self.machines[machine.name] = machine
        if parent:
            self.parent_map[machine.name] = parent
    
    def activate(self, machine_name: str) -> bool:
        """Activate a machine."""
        if machine_name not in self.machines:
            return False
        
        machine = self.machines[machine_name]
        if machine.start():
            self.active_machines.add(machine_name)
            return True
        return False
    
    def fire(self, machine_name: str, trigger: str) -> bool:
        """Fire trigger on specific machine."""
        if machine_name not in self.active_machines:
            return False
        
        return self.machines[machine_name].fire(trigger)
    
    def broadcast(self, trigger: str) -> int:
        """Broadcast trigger to all active machines."""
        fired = 0
        for machine_name in self.active_machines:
            if self.machines[machine_name].fire(trigger):
                fired += 1
        return fired


class StateTransitionEngine:
    """
    Main state transition engine with φ-coherent processing.
    """
    
    def __init__(self):
        self.machines: Dict[str, StateMachine] = {}
        self.hierarchical: Dict[str, HierarchicalStateMachine] = {}
        self.active_machine: Optional[str] = None
        self.beat_count = 0
    
    def create_machine(self, name: str) -> StateMachine:
        """Create a new state machine."""
        machine = StateMachine(name)
        self.machines[name] = machine
        if self.active_machine is None:
            self.active_machine = name
        return machine
    
    def get_machine(self, name: str) -> Optional[StateMachine]:
        """Get a state machine by name."""
        return self.machines.get(name)
    
    def switch_machine(self, name: str) -> bool:
        """Switch active machine."""
        if name in self.machines:
            self.active_machine = name
            return True
        return False
    
    def fire(self, trigger: str, machine_name: Optional[str] = None) -> bool:
        """Fire a trigger."""
        name = machine_name or self.active_machine
        if not name or name not in self.machines:
            return False
        return self.machines[name].fire(trigger)
    
    def current_state(self, machine_name: Optional[str] = None) -> Optional[str]:
        """Get current state."""
        name = machine_name or self.active_machine
        if not name or name not in self.machines:
            return None
        return self.machines[name].current_state
    
    def available_triggers(self, machine_name: Optional[str] = None) -> List[str]:
        """Get available triggers."""
        name = machine_name or self.active_machine
        if not name or name not in self.machines:
            return []
        return self.machines[name].get_available_triggers()
    
    def create_hierarchical(self, name: str) -> HierarchicalStateMachine:
        """Create a hierarchical state machine."""
        hsm = HierarchicalStateMachine(name)
        self.hierarchical[name] = hsm
        return hsm
    
    def tick(self) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        active = self.machines.get(self.active_machine)
        
        return {
            "beat": self.beat_count,
            "machines": len(self.machines),
            "active_machine": self.active_machine,
            "current_state": active.current_state if active else None,
            "available_triggers": self.available_triggers(),
            "total_transitions": sum(
                len(m.history.history) for m in self.machines.values()
            ),
            "phi_coherence": len(self.machines) * PHI_INV,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate state transition report."""
        machine_stats = {}
        for name, machine in self.machines.items():
            machine_stats[name] = {
                "states": len(machine.states),
                "transitions": len(machine.transitions),
                "current_state": machine.current_state,
                "history_size": len(machine.history.history)
            }
        
        return {
            "total_machines": len(self.machines),
            "active_machine": self.active_machine,
            "hierarchical_machines": len(self.hierarchical),
            "machine_stats": machine_stats,
            "phi_metric": sum(len(m.states) for m in self.machines.values()) * PHI_INV,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[StateTransitionEngine] = None

def get_state_transition_engine() -> StateTransitionEngine:
    """Get or create the singleton StateTransitionEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = StateTransitionEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-318 State Transition Protocol (Python) ===")
    
    engine = get_state_transition_engine()
    
    # Create traffic light machine
    machine = engine.create_machine("traffic_light")
    
    machine.add_state("RED", entry_action=lambda: print("  -> RED light"))
    machine.add_state("YELLOW", entry_action=lambda: print("  -> YELLOW light"))
    machine.add_state("GREEN", entry_action=lambda: print("  -> GREEN light"))
    
    machine.add_transition("RED", "GREEN", "timer")
    machine.add_transition("GREEN", "YELLOW", "timer")
    machine.add_transition("YELLOW", "RED", "timer")
    
    # Run
    machine.start()
    print(f"Current: {machine.current_state}")
    
    for i in range(6):
        print(f"\nFiring 'timer' ({i+1}):")
        engine.fire("timer")
        print(f"Now in: {machine.current_state}")
    
    print(f"\nTransition counts: {machine.history.transition_counts()}")
    print(f"Report: {engine.coherence_report()}")
