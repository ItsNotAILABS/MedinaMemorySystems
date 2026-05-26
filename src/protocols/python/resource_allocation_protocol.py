"""
PROTO-331 — Resource Allocation Protocol (Python)
Computational resource management for MEDINA Memory Systems.

Charter: PROTO-331
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import heapq
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable
from collections import defaultdict
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class ResourceType(Enum):
    """Types of computational resources."""
    CPU = "cpu"
    MEMORY = "memory"
    ATTENTION = "attention"
    BANDWIDTH = "bandwidth"
    STORAGE = "storage"
    ENERGY = "energy"


class AllocationStrategy(Enum):
    """Resource allocation strategies."""
    PROPORTIONAL = "proportional"
    PRIORITY = "priority"
    FAIR_SHARE = "fair_share"
    DEADLINE = "deadline"
    AUCTION = "auction"


@dataclass
class Resource:
    """A computational resource."""
    id: str
    resource_type: ResourceType
    total_capacity: float
    available: float = field(default=None)
    utilization: float = 0.0
    cost_per_unit: float = 1.0
    
    def __post_init__(self):
        if self.available is None:
            self.available = self.total_capacity
    
    def allocate(self, amount: float) -> float:
        """Allocate resource, return actual allocation."""
        actual = min(amount, self.available)
        self.available -= actual
        self.utilization = 1 - (self.available / self.total_capacity)
        return actual
    
    def release(self, amount: float) -> None:
        """Release allocated resource."""
        self.available = min(self.total_capacity, self.available + amount)
        self.utilization = 1 - (self.available / self.total_capacity)


@dataclass
class ResourceRequest:
    """A request for resources."""
    id: str
    requester_id: str
    resource_type: ResourceType
    amount: float
    priority: float = 0.5
    deadline: Optional[float] = None
    created_at: float = field(default_factory=time.time)
    fulfilled: bool = False
    allocated_amount: float = 0.0
    
    def urgency(self) -> float:
        """Compute request urgency."""
        base_urgency = self.priority * PHI_INV
        if self.deadline:
            remaining = max(0.01, self.deadline - time.time())
            time_urgency = PHI / remaining
            return base_urgency * (1 + time_urgency)
        return base_urgency


@dataclass
class AllocationResult:
    """Result of resource allocation."""
    request_id: str
    allocated: float
    denied: float
    resource_id: str
    timestamp: float = field(default_factory=time.time)


class ResourcePool:
    """Pool of resources of a single type."""
    
    def __init__(self, resource_type: ResourceType, total_capacity: float):
        self.resource_type = resource_type
        self.resources: Dict[str, Resource] = {}
        self.total_capacity = total_capacity
        self.add_resource(f"{resource_type.value}_default", total_capacity)
    
    def add_resource(self, id: str, capacity: float) -> Resource:
        """Add a resource to the pool."""
        resource = Resource(id=id, resource_type=self.resource_type, 
                           total_capacity=capacity)
        self.resources[id] = resource
        self.total_capacity += capacity
        return resource
    
    def get_available(self) -> float:
        """Get total available capacity."""
        return sum(r.available for r in self.resources.values())
    
    def get_utilization(self) -> float:
        """Get overall pool utilization."""
        total = sum(r.total_capacity for r in self.resources.values())
        available = sum(r.available for r in self.resources.values())
        return 1 - (available / total) if total > 0 else 0
    
    def allocate(self, amount: float) -> Tuple[float, str]:
        """Allocate from pool, return (allocated, resource_id)."""
        for rid, resource in sorted(
            self.resources.items(),
            key=lambda x: x[1].available,
            reverse=True
        ):
            if resource.available >= amount:
                actual = resource.allocate(amount)
                return actual, rid
        
        # Partial allocation from largest available
        for rid, resource in sorted(
            self.resources.items(),
            key=lambda x: x[1].available,
            reverse=True
        ):
            if resource.available > 0:
                actual = resource.allocate(resource.available)
                return actual, rid
        
        return 0.0, ""
    
    def release(self, resource_id: str, amount: float) -> None:
        """Release back to specific resource."""
        if resource_id in self.resources:
            self.resources[resource_id].release(amount)


class ResourceAllocationEngine:
    """
    Resource allocation engine with φ-coherent management.
    """
    
    def __init__(self, strategy: AllocationStrategy = AllocationStrategy.PRIORITY):
        self.pools: Dict[ResourceType, ResourcePool] = {}
        self.strategy = strategy
        self.pending_requests: List[Tuple[float, str, ResourceRequest]] = []
        self.allocations: Dict[str, List[AllocationResult]] = defaultdict(list)
        self.request_history: List[ResourceRequest] = []
        self.total_allocated: Dict[ResourceType, float] = defaultdict(float)
        self.beat_count = 0
        
        # Initialize default pools
        self._init_default_pools()
    
    def _init_default_pools(self) -> None:
        """Initialize default resource pools."""
        defaults = {
            ResourceType.CPU: 100.0,
            ResourceType.MEMORY: 1000.0,
            ResourceType.ATTENTION: 7.0,  # Miller's 7±2
            ResourceType.BANDWIDTH: 100.0,
            ResourceType.ENERGY: 100.0
        }
        for rtype, capacity in defaults.items():
            self.pools[rtype] = ResourcePool(rtype, capacity)
    
    def add_pool(self, resource_type: ResourceType, capacity: float) -> ResourcePool:
        """Add or expand a resource pool."""
        if resource_type in self.pools:
            self.pools[resource_type].total_capacity += capacity
        else:
            self.pools[resource_type] = ResourcePool(resource_type, capacity)
        return self.pools[resource_type]
    
    def request_resource(self, requester_id: str, resource_type: ResourceType,
                         amount: float, priority: float = 0.5,
                         deadline: Optional[float] = None) -> ResourceRequest:
        """Submit a resource request."""
        request = ResourceRequest(
            id=f"req_{time.time()}_{requester_id}",
            requester_id=requester_id,
            resource_type=resource_type,
            amount=amount,
            priority=priority,
            deadline=deadline
        )
        
        urgency = -request.urgency()  # Negative for max-heap
        heapq.heappush(self.pending_requests, (urgency, request.id, request))
        self.request_history.append(request)
        
        return request
    
    def process_requests(self) -> List[AllocationResult]:
        """Process pending requests using configured strategy."""
        results = []
        
        if self.strategy == AllocationStrategy.PRIORITY:
            results = self._allocate_by_priority()
        elif self.strategy == AllocationStrategy.PROPORTIONAL:
            results = self._allocate_proportional()
        elif self.strategy == AllocationStrategy.FAIR_SHARE:
            results = self._allocate_fair_share()
        elif self.strategy == AllocationStrategy.DEADLINE:
            results = self._allocate_by_deadline()
        
        self.beat_count += 1
        return results
    
    def _allocate_by_priority(self) -> List[AllocationResult]:
        """Allocate resources by priority (urgency)."""
        results = []
        
        while self.pending_requests:
            _, _, request = heapq.heappop(self.pending_requests)
            
            if request.resource_type not in self.pools:
                continue
            
            pool = self.pools[request.resource_type]
            allocated, resource_id = pool.allocate(request.amount)
            
            request.fulfilled = allocated >= request.amount
            request.allocated_amount = allocated
            
            result = AllocationResult(
                request_id=request.id,
                allocated=allocated,
                denied=request.amount - allocated,
                resource_id=resource_id
            )
            results.append(result)
            self.allocations[request.requester_id].append(result)
            self.total_allocated[request.resource_type] += allocated
        
        return results
    
    def _allocate_proportional(self) -> List[AllocationResult]:
        """Allocate proportionally to request amounts."""
        results = []
        requests_by_type: Dict[ResourceType, List[ResourceRequest]] = defaultdict(list)
        
        # Group by resource type
        while self.pending_requests:
            _, _, request = heapq.heappop(self.pending_requests)
            requests_by_type[request.resource_type].append(request)
        
        # Allocate each type proportionally
        for rtype, requests in requests_by_type.items():
            if rtype not in self.pools:
                continue
            
            pool = self.pools[rtype]
            total_requested = sum(r.amount for r in requests)
            available = pool.get_available()
            
            for request in requests:
                if total_requested > 0:
                    proportion = request.amount / total_requested
                    allocation = min(request.amount, available * proportion)
                else:
                    allocation = 0
                
                actual, resource_id = pool.allocate(allocation)
                request.allocated_amount = actual
                request.fulfilled = actual >= request.amount * PHI_INV
                
                result = AllocationResult(
                    request_id=request.id,
                    allocated=actual,
                    denied=request.amount - actual,
                    resource_id=resource_id
                )
                results.append(result)
                self.allocations[request.requester_id].append(result)
        
        return results
    
    def _allocate_fair_share(self) -> List[AllocationResult]:
        """Allocate equal shares to all requesters."""
        results = []
        requests_by_type: Dict[ResourceType, List[ResourceRequest]] = defaultdict(list)
        
        while self.pending_requests:
            _, _, request = heapq.heappop(self.pending_requests)
            requests_by_type[request.resource_type].append(request)
        
        for rtype, requests in requests_by_type.items():
            if rtype not in self.pools:
                continue
            
            pool = self.pools[rtype]
            available = pool.get_available()
            fair_share = available / len(requests) if requests else 0
            
            for request in requests:
                allocation = min(request.amount, fair_share)
                actual, resource_id = pool.allocate(allocation)
                request.allocated_amount = actual
                request.fulfilled = actual >= request.amount * PHI_INV
                
                result = AllocationResult(
                    request_id=request.id,
                    allocated=actual,
                    denied=request.amount - actual,
                    resource_id=resource_id
                )
                results.append(result)
                self.allocations[request.requester_id].append(result)
        
        return results
    
    def _allocate_by_deadline(self) -> List[AllocationResult]:
        """Allocate by deadline (earliest deadline first)."""
        results = []
        
        # Re-sort by deadline
        requests = []
        while self.pending_requests:
            _, _, request = heapq.heappop(self.pending_requests)
            deadline = request.deadline or float('inf')
            heapq.heappush(requests, (deadline, request.id, request))
        
        while requests:
            _, _, request = heapq.heappop(requests)
            
            if request.resource_type not in self.pools:
                continue
            
            pool = self.pools[request.resource_type]
            allocated, resource_id = pool.allocate(request.amount)
            
            request.fulfilled = allocated >= request.amount
            request.allocated_amount = allocated
            
            result = AllocationResult(
                request_id=request.id,
                allocated=allocated,
                denied=request.amount - allocated,
                resource_id=resource_id
            )
            results.append(result)
            self.allocations[request.requester_id].append(result)
        
        return results
    
    def release_resources(self, requester_id: str, resource_type: ResourceType,
                          amount: float) -> bool:
        """Release allocated resources."""
        if resource_type not in self.pools:
            return False
        
        pool = self.pools[resource_type]
        # Find the resource to release to
        for result in self.allocations.get(requester_id, []):
            if result.resource_id and result.allocated > 0:
                release_amount = min(amount, result.allocated)
                pool.release(result.resource_id, release_amount)
                amount -= release_amount
                if amount <= 0:
                    break
        
        return True
    
    def get_utilization(self) -> Dict[str, float]:
        """Get utilization for all resource types."""
        return {
            rtype.value: pool.get_utilization()
            for rtype, pool in self.pools.items()
        }
    
    def get_availability(self) -> Dict[str, float]:
        """Get available capacity for all resource types."""
        return {
            rtype.value: pool.get_available()
            for rtype, pool in self.pools.items()
        }
    
    def get_stats(self) -> Dict[str, Any]:
        """Get resource allocation statistics."""
        utilization = self.get_utilization()
        availability = self.get_availability()
        
        return {
            "total_pools": len(self.pools),
            "pending_requests": len(self.pending_requests),
            "total_requests": len(self.request_history),
            "utilization": utilization,
            "availability": availability,
            "mean_utilization": sum(utilization.values()) / len(utilization) if utilization else 0,
            "strategy": self.strategy.value,
            "beat_count": self.beat_count,
            "phi_coherence": sum(u * PHI_INV for u in utilization.values()) / len(utilization) if utilization else 0
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_resource_engine: Optional[ResourceAllocationEngine] = None

def get_resource_allocation_engine() -> ResourceAllocationEngine:
    """Get or create the global resource allocation engine."""
    global _resource_engine
    if _resource_engine is None:
        _resource_engine = ResourceAllocationEngine()
    return _resource_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "ResourceType", "AllocationStrategy", "Resource",
    "ResourceRequest", "AllocationResult", "ResourcePool",
    "ResourceAllocationEngine", "get_resource_allocation_engine"
]
