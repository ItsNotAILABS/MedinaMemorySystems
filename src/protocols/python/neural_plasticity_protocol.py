"""
PROTO-321 — Neural Plasticity Protocol (Python)
Dynamic synaptic adaptation for MEDINA Memory Systems.

Charter: PROTO-321
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable
from collections import defaultdict
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI
SQRT3 = math.sqrt(3)


class PlasticityType(Enum):
    """Types of neural plasticity."""
    HEBBIAN = "hebbian"
    ANTI_HEBBIAN = "anti_hebbian"
    STDP = "stdp"  # Spike-timing dependent
    HOMEOSTATIC = "homeostatic"
    STRUCTURAL = "structural"
    METAPLASTICITY = "metaplasticity"


@dataclass
class Synapse:
    """A plastic synapse with adaptive weight."""
    pre_id: str
    post_id: str
    weight: float = 0.5
    plasticity_rate: float = field(default_factory=lambda: PHI_INV * 0.1)
    last_pre_spike: float = 0.0
    last_post_spike: float = 0.0
    eligibility_trace: float = 0.0
    stability: float = 0.5
    age: int = 0
    
    def stdp_update(self, pre_time: float, post_time: float) -> float:
        """Spike-timing dependent plasticity update."""
        dt = post_time - pre_time
        if dt > 0:
            # LTP: post follows pre
            delta = self.plasticity_rate * PHI * math.exp(-abs(dt) * PHI_INV)
        else:
            # LTD: pre follows post
            delta = -self.plasticity_rate * PHI_INV * math.exp(-abs(dt) * PHI)
        
        self.weight = max(0.0, min(1.0, self.weight + delta))
        self.eligibility_trace = delta * PHI
        self.age += 1
        return delta
    
    def hebbian_update(self, pre_act: float, post_act: float) -> float:
        """Classic Hebbian learning."""
        delta = self.plasticity_rate * pre_act * post_act * PHI_INV
        self.weight = max(0.0, min(1.0, self.weight + delta))
        self.age += 1
        return delta
    
    def homeostatic_scale(self, target_rate: float, actual_rate: float) -> None:
        """Homeostatic plasticity to maintain target firing rate."""
        ratio = target_rate / (actual_rate + 1e-10)
        scale_factor = math.pow(ratio, PHI_INV)
        self.weight *= scale_factor
        self.weight = max(0.0, min(1.0, self.weight))


@dataclass
class Neuron:
    """A neuron with plastic synapses."""
    id: str
    threshold: float = 0.5
    membrane_potential: float = 0.0
    refractory_period: float = 0.002
    last_spike_time: float = 0.0
    firing_rate: float = 0.0
    target_rate: float = 10.0
    spike_history: List[float] = field(default_factory=list)
    
    def integrate(self, input_current: float, dt: float) -> bool:
        """Integrate input and potentially fire."""
        now = time.time()
        if now - self.last_spike_time < self.refractory_period:
            return False
        
        self.membrane_potential += input_current * dt * PHI
        self.membrane_potential *= math.exp(-dt * PHI_INV * 0.1)  # Leak
        
        if self.membrane_potential >= self.threshold:
            self._spike(now)
            return True
        return False
    
    def _spike(self, spike_time: float) -> None:
        """Record a spike."""
        self.last_spike_time = spike_time
        self.membrane_potential = 0.0
        self.spike_history.append(spike_time)
        if len(self.spike_history) > 1000:
            self.spike_history = self.spike_history[-500:]
        self._update_firing_rate()
    
    def _update_firing_rate(self) -> None:
        """Calculate recent firing rate."""
        now = time.time()
        recent = [t for t in self.spike_history if now - t < 1.0]
        self.firing_rate = len(recent)


class NeuralPlasticityEngine:
    """
    Engine for neural plasticity with φ-coherent dynamics.
    """
    
    def __init__(self, learning_rate: float = 0.01):
        self.neurons: Dict[str, Neuron] = {}
        self.synapses: Dict[Tuple[str, str], Synapse] = {}
        self.outgoing: Dict[str, Set[str]] = defaultdict(set)
        self.incoming: Dict[str, Set[str]] = defaultdict(set)
        self.learning_rate = learning_rate * PHI_INV
        self.plasticity_type = PlasticityType.STDP
        self.global_modulation = 1.0
        self.beat_count = 0
    
    def add_neuron(self, id: str, **kwargs) -> Neuron:
        """Add a neuron to the network."""
        neuron = Neuron(id=id, **kwargs)
        self.neurons[id] = neuron
        return neuron
    
    def add_synapse(self, pre_id: str, post_id: str, weight: float = 0.5) -> Optional[Synapse]:
        """Add a synapse between neurons."""
        if pre_id not in self.neurons or post_id not in self.neurons:
            return None
        
        synapse = Synapse(pre_id=pre_id, post_id=post_id, weight=weight)
        self.synapses[(pre_id, post_id)] = synapse
        self.outgoing[pre_id].add(post_id)
        self.incoming[post_id].add(pre_id)
        return synapse
    
    def propagate_spike(self, neuron_id: str) -> List[str]:
        """Propagate a spike through the network."""
        fired = []
        neuron = self.neurons.get(neuron_id)
        if not neuron:
            return fired
        
        spike_time = neuron.last_spike_time
        
        for post_id in self.outgoing[neuron_id]:
            synapse = self.synapses.get((neuron_id, post_id))
            post_neuron = self.neurons.get(post_id)
            if not synapse or not post_neuron:
                continue
            
            # Apply synaptic input
            input_current = synapse.weight * self.global_modulation
            if post_neuron.integrate(input_current, 0.001):
                fired.append(post_id)
                # STDP update
                synapse.stdp_update(spike_time, post_neuron.last_spike_time)
        
        return fired
    
    def apply_plasticity(self, plasticity_type: PlasticityType = None) -> Dict[str, float]:
        """Apply plasticity rules across all synapses."""
        ptype = plasticity_type or self.plasticity_type
        changes = {}
        
        for (pre_id, post_id), synapse in self.synapses.items():
            pre = self.neurons.get(pre_id)
            post = self.neurons.get(post_id)
            if not pre or not post:
                continue
            
            if ptype == PlasticityType.STDP:
                if pre.spike_history and post.spike_history:
                    delta = synapse.stdp_update(
                        pre.spike_history[-1],
                        post.spike_history[-1]
                    )
                    changes[f"{pre_id}->{post_id}"] = delta
            
            elif ptype == PlasticityType.HEBBIAN:
                pre_act = pre.firing_rate / (pre.target_rate + 1)
                post_act = post.firing_rate / (post.target_rate + 1)
                delta = synapse.hebbian_update(pre_act, post_act)
                changes[f"{pre_id}->{post_id}"] = delta
            
            elif ptype == PlasticityType.HOMEOSTATIC:
                synapse.homeostatic_scale(post.target_rate, post.firing_rate)
                changes[f"{pre_id}->{post_id}"] = synapse.weight
        
        self.beat_count += 1
        return changes
    
    def prune_weak_synapses(self, threshold: float = 0.01) -> int:
        """Remove synapses below threshold."""
        to_remove = [
            key for key, syn in self.synapses.items()
            if syn.weight < threshold
        ]
        for key in to_remove:
            pre_id, post_id = key
            del self.synapses[key]
            self.outgoing[pre_id].discard(post_id)
            self.incoming[post_id].discard(pre_id)
        return len(to_remove)
    
    def structural_plasticity(self, growth_rate: float = 0.01) -> int:
        """Add new synapses probabilistically."""
        new_synapses = 0
        neuron_ids = list(self.neurons.keys())
        
        for _ in range(int(len(neuron_ids) * growth_rate)):
            pre_id = random.choice(neuron_ids)
            post_id = random.choice(neuron_ids)
            if pre_id != post_id and (pre_id, post_id) not in self.synapses:
                pre = self.neurons[pre_id]
                post = self.neurons[post_id]
                # Higher chance if both are active
                prob = (pre.firing_rate + post.firing_rate) / (2 * pre.target_rate + 1)
                if random.random() < prob * PHI_INV:
                    self.add_synapse(pre_id, post_id, weight=0.1)
                    new_synapses += 1
        
        return new_synapses
    
    def metaplasticity_update(self) -> None:
        """Adjust plasticity rates based on activity history."""
        for synapse in self.synapses.values():
            pre = self.neurons.get(synapse.pre_id)
            post = self.neurons.get(synapse.post_id)
            if not pre or not post:
                continue
            
            # Reduce plasticity for stable, active synapses
            activity_product = pre.firing_rate * post.firing_rate
            if activity_product > 0:
                synapse.stability = min(1.0, synapse.stability + 0.001 * PHI_INV)
                synapse.plasticity_rate *= (1 - synapse.stability * PHI_INV * 0.1)
    
    def get_network_stats(self) -> Dict[str, float]:
        """Get statistics about the network."""
        if not self.synapses:
            return {"mean_weight": 0, "total_neurons": len(self.neurons)}
        
        weights = [s.weight for s in self.synapses.values()]
        firing_rates = [n.firing_rate for n in self.neurons.values()]
        
        return {
            "total_neurons": len(self.neurons),
            "total_synapses": len(self.synapses),
            "mean_weight": sum(weights) / len(weights),
            "min_weight": min(weights),
            "max_weight": max(weights),
            "mean_firing_rate": sum(firing_rates) / len(firing_rates) if firing_rates else 0,
            "beat_count": self.beat_count,
            "phi_coherence": sum(weights) / (len(weights) * PHI) if weights else 0
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_plasticity_engine: Optional[NeuralPlasticityEngine] = None

def get_plasticity_engine() -> NeuralPlasticityEngine:
    """Get or create the global plasticity engine."""
    global _plasticity_engine
    if _plasticity_engine is None:
        _plasticity_engine = NeuralPlasticityEngine()
    return _plasticity_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "PlasticityType", "Synapse", "Neuron",
    "NeuralPlasticityEngine", "get_plasticity_engine"
]
