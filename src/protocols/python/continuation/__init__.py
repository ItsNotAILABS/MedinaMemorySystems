"""
MEDINA Memory Systems - Continuation Protocols
Python Implementation

This package contains Python implementations of the continuation protocols
for MEDINA Memory Systems and XCREW Edge Platform.

Protocols:
- PROTO-MMS-CONT-001: Capability Maturation Protocol
- PROTO-XCREW-CONT-001: Edge Hardening Protocol

Charter References:
- CHARTER-MMS-CONT-001: MEDINA Continuation Charter
- CHARTER-XCREW-CONT-001: XCREW Continuation Charter
"""

from .capability_maturation import (
    PHI, PHI_INV, PHI_SQ,
    MaturationLevel,
    MaturationRequirement,
    MaturationGate,
    Capability,
    CapabilityRegistry,
    StressTestResult,
    StressTestSuite,
    ChaosScenario,
    ProcessCrashScenario,
    NetworkPartitionScenario,
    MemoryPressureScenario,
    ChaosTestSuite,
    get_capability_registry,
)

from .edge_hardening import (
    PowerMode,
    ResourceBudget,
    FeatureTier,
    FeatureManager,
    EdgeState,
    StatePersistence,
    QueuedDecision,
    OfflineQueue,
    NetworkMonitor,
    ThermalThreshold,
    ThermalPolicy,
    ThermalManager,
    EdgeHardeningManager,
    get_edge_hardening_manager,
)

__all__ = [
    # Constants
    'PHI', 'PHI_INV', 'PHI_SQ',
    
    # Capability Maturation
    'MaturationLevel',
    'MaturationRequirement',
    'MaturationGate',
    'Capability',
    'CapabilityRegistry',
    'StressTestResult',
    'StressTestSuite',
    'ChaosScenario',
    'ProcessCrashScenario',
    'NetworkPartitionScenario',
    'MemoryPressureScenario',
    'ChaosTestSuite',
    'get_capability_registry',
    
    # Edge Hardening
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

__version__ = '1.0.0'
__protocol_ids__ = [
    'PROTO-MMS-CONT-001',
    'PROTO-XCREW-CONT-001',
]
