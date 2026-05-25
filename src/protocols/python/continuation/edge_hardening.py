"""
PROTO-XCREW-CONT-001: Edge Hardening Protocol
Python Implementation

Protocol ID: PROTO-XCREW-CONT-001
Charter: CHARTER-XCREW-CONT-001
Version: 1.0.0

Titulus Latinus: Protocollum Indurationis Marginis
"""

import math
import time
import json
import hashlib
import os
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Any, Callable
from abc import ABC, abstractmethod
import threading
from queue import Queue

# ═══════════════════════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI

# ═══════════════════════════════════════════════════════════════════════════════
# POWER MODES
# ═══════════════════════════════════════════════════════════════════════════════

class PowerMode(Enum):
    """Power consumption modes for edge devices."""
    FULL = "full"           # All features, maximum intelligence
    BALANCED = "balanced"   # Core features, reduced polling
    SAVER = "saver"         # Essential only, extended intervals
    CRITICAL = "critical"   # Minimal operation, state preservation


@dataclass
class ResourceBudget:
    """Resource allocation budget for edge operation."""
    total_memory_mb: float
    reserved_memory_mb: float
    intelligence_memory_mb: float
    cache_memory_mb: float
    buffer_memory_mb: float
    
    @property
    def available_memory_mb(self) -> float:
        return self.total_memory_mb - self.reserved_memory_mb
    
    def can_allocate(self, required_mb: float) -> bool:
        used = self.intelligence_memory_mb + self.cache_memory_mb + self.buffer_memory_mb
        return (used + required_mb) <= self.available_memory_mb


# ═══════════════════════════════════════════════════════════════════════════════
# FEATURE TIERS
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class FeatureTier:
    """A feature with its resource requirements and priority."""
    name: str
    memory_mb: float
    priority: int  # 0 = essential, higher = more optional
    enabled: bool = True


class FeatureManager:
    """Manages feature enablement based on resource constraints."""
    
    DEFAULT_TIERS = [
        FeatureTier("core", 10, 0),
        FeatureTier("toroidal", 40, 1),
        FeatureTier("temporal", 20, 2),
        FeatureTier("swarm", 30, 2),
        FeatureTier("quantum", 50, 3),
    ]
    
    def __init__(self, tiers: List[FeatureTier] = None):
        self.tiers = tiers or self.DEFAULT_TIERS.copy()
    
    def shed_features(self, available_memory_mb: float) -> List[str]:
        """
        Determine which features to enable given available memory.
        Returns list of enabled feature names.
        """
        # Sort by priority (keep low priority = essential)
        sorted_tiers = sorted(self.tiers, key=lambda t: t.priority)
        
        remaining = available_memory_mb
        enabled = []
        
        for tier in sorted_tiers:
            if remaining >= tier.memory_mb:
                tier.enabled = True
                enabled.append(tier.name)
                remaining -= tier.memory_mb
            else:
                tier.enabled = False
        
        return enabled
    
    def get_enabled_features(self) -> List[str]:
        """Get list of currently enabled features."""
        return [t.name for t in self.tiers if t.enabled]
    
    def get_total_memory_required(self) -> float:
        """Get total memory required for all features."""
        return sum(t.memory_mb for t in self.tiers)
    
    def get_enabled_memory(self) -> float:
        """Get memory used by enabled features."""
        return sum(t.memory_mb for t in self.tiers if t.enabled)


# ═══════════════════════════════════════════════════════════════════════════════
# STATE PERSISTENCE
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class EdgeState:
    """Persistent state for edge node."""
    version: str
    timestamp: float
    node_id: str
    memory_state: Dict[str, Any] = field(default_factory=dict)
    protocol_states: Dict[str, Dict] = field(default_factory=dict)
    pending_decisions: List[Dict] = field(default_factory=list)
    checksum: str = ""
    
    def compute_checksum(self) -> str:
        """Compute checksum of state for integrity verification."""
        state_dict = {
            "version": self.version,
            "timestamp": self.timestamp,
            "node_id": self.node_id,
            "memory_state": self.memory_state,
            "protocol_states": self.protocol_states,
            "pending_decisions": self.pending_decisions,
        }
        state_json = json.dumps(state_dict, sort_keys=True)
        return hashlib.sha256(state_json.encode()).hexdigest()
    
    def verify_integrity(self) -> bool:
        """Verify state integrity via checksum."""
        return self.checksum == self.compute_checksum()


class StatePersistence:
    """Handles atomic state persistence for edge nodes."""
    
    def __init__(self, state_dir: str = "/tmp/xcrew_state"):
        self.state_dir = state_dir
        self.state_file = os.path.join(state_dir, "edge_state.json")
        self.temp_file = os.path.join(state_dir, "edge_state.tmp")
        os.makedirs(state_dir, exist_ok=True)
    
    def persist(self, state: EdgeState) -> bool:
        """
        Atomically persist state to disk.
        Uses write-to-temp then rename pattern for atomicity.
        """
        try:
            state.checksum = state.compute_checksum()
            state_dict = {
                "version": state.version,
                "timestamp": state.timestamp,
                "node_id": state.node_id,
                "memory_state": state.memory_state,
                "protocol_states": state.protocol_states,
                "pending_decisions": state.pending_decisions,
                "checksum": state.checksum,
            }
            
            # Write to temp file
            with open(self.temp_file, 'w') as f:
                json.dump(state_dict, f)
            
            # Atomic rename
            os.rename(self.temp_file, self.state_file)
            return True
            
        except Exception as e:
            print(f"State persistence failed: {e}")
            return False
    
    def load(self) -> Optional[EdgeState]:
        """Load state from disk with integrity verification."""
        try:
            if not os.path.exists(self.state_file):
                return None
            
            with open(self.state_file, 'r') as f:
                state_dict = json.load(f)
            
            state = EdgeState(
                version=state_dict["version"],
                timestamp=state_dict["timestamp"],
                node_id=state_dict["node_id"],
                memory_state=state_dict.get("memory_state", {}),
                protocol_states=state_dict.get("protocol_states", {}),
                pending_decisions=state_dict.get("pending_decisions", []),
                checksum=state_dict.get("checksum", ""),
            )
            
            if not state.verify_integrity():
                print("State integrity check failed!")
                return None
            
            return state
            
        except Exception as e:
            print(f"State load failed: {e}")
            return None


# ═══════════════════════════════════════════════════════════════════════════════
# OFFLINE OPERATION
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class QueuedDecision:
    """A decision queued during offline operation."""
    id: str
    timestamp: float
    decision_type: str
    context: Dict[str, Any]
    result: Optional[Any] = None
    synced: bool = False


class OfflineQueue:
    """Queue for decisions made during offline operation."""
    
    def __init__(self, max_size: int = 10000):
        self.max_size = max_size
        self.queue: List[QueuedDecision] = []
        self._lock = threading.Lock()
    
    def enqueue(self, decision: QueuedDecision) -> bool:
        """Add decision to offline queue."""
        with self._lock:
            if len(self.queue) >= self.max_size:
                # Remove oldest unsynced decisions if full
                self.queue = [d for d in self.queue if d.synced][-self.max_size//2:]
            
            self.queue.append(decision)
            return True
    
    def get_pending(self) -> List[QueuedDecision]:
        """Get all pending (unsynced) decisions."""
        with self._lock:
            return [d for d in self.queue if not d.synced]
    
    def mark_synced(self, decision_ids: List[str]) -> None:
        """Mark decisions as synced."""
        with self._lock:
            for decision in self.queue:
                if decision.id in decision_ids:
                    decision.synced = True
    
    def clear_synced(self) -> int:
        """Clear all synced decisions, return count cleared."""
        with self._lock:
            original_count = len(self.queue)
            self.queue = [d for d in self.queue if not d.synced]
            return original_count - len(self.queue)


class NetworkMonitor:
    """Monitors network connectivity status."""
    
    def __init__(self):
        self.is_connected = True
        self.last_check = time.time()
        self.consecutive_failures = 0
    
    def check_connectivity(self, timeout_seconds: float = 5.0) -> bool:
        """Check if network is available."""
        # In real implementation, would ping a reliable endpoint
        self.last_check = time.time()
        # Simulated: always connected for demo
        self.is_connected = True
        if self.is_connected:
            self.consecutive_failures = 0
        else:
            self.consecutive_failures += 1
        return self.is_connected
    
    def get_status(self) -> Dict:
        """Get current network status."""
        return {
            "connected": self.is_connected,
            "last_check": self.last_check,
            "consecutive_failures": self.consecutive_failures,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# THERMAL MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

class ThermalThreshold(Enum):
    """Thermal threshold levels."""
    NORMAL = 0       # < 60°C
    WARM = 1         # 60-70°C
    HOT = 2          # 70-80°C
    CRITICAL = 3     # 80-90°C
    EMERGENCY = 4    # > 90°C


@dataclass
class ThermalPolicy:
    """Policy for thermal response."""
    threshold: ThermalThreshold
    max_cpu_percent: float
    features_enabled: List[str]
    polling_interval_ms: float


class ThermalManager:
    """Manages thermal throttling for edge devices."""
    
    DEFAULT_POLICIES = {
        ThermalThreshold.NORMAL: ThermalPolicy(
            ThermalThreshold.NORMAL, 100.0, ["all"], 1000.0
        ),
        ThermalThreshold.WARM: ThermalPolicy(
            ThermalThreshold.WARM, 80.0, ["core", "toroidal", "temporal"], 2000.0
        ),
        ThermalThreshold.HOT: ThermalPolicy(
            ThermalThreshold.HOT, 50.0, ["core", "toroidal"], 5000.0
        ),
        ThermalThreshold.CRITICAL: ThermalPolicy(
            ThermalThreshold.CRITICAL, 25.0, ["core"], 10000.0
        ),
        ThermalThreshold.EMERGENCY: ThermalPolicy(
            ThermalThreshold.EMERGENCY, 0.0, [], 0.0  # Shutdown
        ),
    }
    
    def __init__(self):
        self.current_temp_c: float = 45.0
        self.policies = self.DEFAULT_POLICIES.copy()
        self.current_threshold = ThermalThreshold.NORMAL
    
    def update_temperature(self, temp_c: float) -> ThermalThreshold:
        """Update current temperature and return threshold level."""
        self.current_temp_c = temp_c
        
        if temp_c < 60:
            self.current_threshold = ThermalThreshold.NORMAL
        elif temp_c < 70:
            self.current_threshold = ThermalThreshold.WARM
        elif temp_c < 80:
            self.current_threshold = ThermalThreshold.HOT
        elif temp_c < 90:
            self.current_threshold = ThermalThreshold.CRITICAL
        else:
            self.current_threshold = ThermalThreshold.EMERGENCY
        
        return self.current_threshold
    
    def get_current_policy(self) -> ThermalPolicy:
        """Get policy for current thermal state."""
        return self.policies[self.current_threshold]
    
    def should_shutdown(self) -> bool:
        """Check if emergency shutdown is needed."""
        return self.current_threshold == ThermalThreshold.EMERGENCY


# ═══════════════════════════════════════════════════════════════════════════════
# EDGE HARDENING MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class EdgeHardeningManager:
    """
    Central manager for edge hardening.
    Coordinates all hardening subsystems.
    """
    
    def __init__(self, node_id: str):
        self.node_id = node_id
        self.feature_manager = FeatureManager()
        self.state_persistence = StatePersistence()
        self.offline_queue = OfflineQueue()
        self.network_monitor = NetworkMonitor()
        self.thermal_manager = ThermalManager()
        self.power_mode = PowerMode.FULL
        self.resource_budget = ResourceBudget(
            total_memory_mb=512,
            reserved_memory_mb=64,
            intelligence_memory_mb=200,
            cache_memory_mb=100,
            buffer_memory_mb=50,
        )
    
    def initialize(self) -> bool:
        """Initialize edge hardening systems."""
        # Try to load previous state
        state = self.state_persistence.load()
        if state:
            print(f"Restored state from {state.timestamp}")
        else:
            print("Starting with fresh state")
        
        # Configure features based on resources
        available = self.resource_budget.available_memory_mb
        enabled = self.feature_manager.shed_features(available)
        print(f"Enabled features: {enabled}")
        
        return True
    
    def adapt_to_conditions(self) -> Dict:
        """
        Adapt to current conditions (network, thermal, power).
        Returns adaptation decisions.
        """
        decisions = {}
        
        # Check network
        network_ok = self.network_monitor.check_connectivity()
        decisions["network"] = "online" if network_ok else "offline"
        
        # Check thermal (simulated reading)
        thermal_threshold = self.thermal_manager.update_temperature(
            self.thermal_manager.current_temp_c
        )
        decisions["thermal"] = thermal_threshold.name
        
        if self.thermal_manager.should_shutdown():
            decisions["action"] = "emergency_shutdown"
            return decisions
        
        # Adjust features based on thermal policy
        policy = self.thermal_manager.get_current_policy()
        decisions["max_cpu"] = policy.max_cpu_percent
        decisions["polling_interval"] = policy.polling_interval_ms
        
        return decisions
    
    def make_decision(self, decision_type: str, context: Dict) -> QueuedDecision:
        """
        Make a decision, handling offline mode appropriately.
        """
        decision = QueuedDecision(
            id=f"{self.node_id}-{time.time()}",
            timestamp=time.time(),
            decision_type=decision_type,
            context=context,
        )
        
        if self.network_monitor.is_connected:
            # Make decision normally
            decision.result = self._process_decision(decision)
            decision.synced = True
        else:
            # Queue for later sync
            decision.result = self._process_decision_locally(decision)
            self.offline_queue.enqueue(decision)
        
        return decision
    
    def _process_decision(self, decision: QueuedDecision) -> Any:
        """Process decision with full MEDINA intelligence."""
        # In real implementation, would invoke MEDINA protocols
        return {"status": "processed", "mode": "full"}
    
    def _process_decision_locally(self, decision: QueuedDecision) -> Any:
        """Process decision with local-only intelligence."""
        # In real implementation, would use cached/local protocols
        return {"status": "processed_locally", "mode": "offline"}
    
    def sync_pending(self) -> int:
        """Sync pending decisions when back online."""
        if not self.network_monitor.is_connected:
            return 0
        
        pending = self.offline_queue.get_pending()
        synced_ids = []
        
        for decision in pending:
            # In real implementation, would sync to MEDINA core
            synced_ids.append(decision.id)
        
        self.offline_queue.mark_synced(synced_ids)
        return len(synced_ids)
    
    def persist_state(self) -> bool:
        """Persist current state to disk."""
        state = EdgeState(
            version="1.0.0",
            timestamp=time.time(),
            node_id=self.node_id,
            memory_state={},  # Would include actual memory state
            protocol_states={},  # Would include protocol states
            pending_decisions=[
                {"id": d.id, "type": d.decision_type, "timestamp": d.timestamp}
                for d in self.offline_queue.get_pending()
            ],
        )
        return self.state_persistence.persist(state)
    
    def get_status(self) -> Dict:
        """Get comprehensive status of edge hardening systems."""
        return {
            "node_id": self.node_id,
            "power_mode": self.power_mode.value,
            "features_enabled": self.feature_manager.get_enabled_features(),
            "memory_used_mb": self.feature_manager.get_enabled_memory(),
            "network": self.network_monitor.get_status(),
            "thermal": {
                "temp_c": self.thermal_manager.current_temp_c,
                "threshold": self.thermal_manager.current_threshold.name,
            },
            "offline_queue_size": len(self.offline_queue.get_pending()),
        }


# ═══════════════════════════════════════════════════════════════════════════════
# SINGLETON ACCESSOR
# ═══════════════════════════════════════════════════════════════════════════════

_manager_instance: Optional[EdgeHardeningManager] = None

def get_edge_hardening_manager(node_id: str = "xcrew-edge-001") -> EdgeHardeningManager:
    """Get singleton edge hardening manager instance."""
    global _manager_instance
    if _manager_instance is None:
        _manager_instance = EdgeHardeningManager(node_id)
        _manager_instance.initialize()
    return _manager_instance


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    'PHI', 'PHI_INV',
    'PowerMode',
    'ResourceBudget',
    'FeatureTier',
    'FeatureManager',
    'EdgeState',
    'StatePersistence',
    'QueuedDecision',
    'OfflineQueue',
    'NetworkMonitor',
    'ThermalThreshold',
    'ThermalPolicy',
    'ThermalManager',
    'EdgeHardeningManager',
    'get_edge_hardening_manager',
]


if __name__ == "__main__":
    # Demo usage
    manager = get_edge_hardening_manager("demo-node-001")
    
    print("XCREW Edge Hardening Status")
    print("=" * 50)
    
    status = manager.get_status()
    print(json.dumps(status, indent=2))
    
    # Simulate offline decision
    print("\nMaking offline decision...")
    decision = manager.make_decision(
        "resource_allocation",
        {"resource": "compute", "amount": 100}
    )
    print(f"Decision ID: {decision.id}")
    print(f"Result: {decision.result}")
    
    # Persist state
    print("\nPersisting state...")
    manager.persist_state()
    print("State persisted successfully")
