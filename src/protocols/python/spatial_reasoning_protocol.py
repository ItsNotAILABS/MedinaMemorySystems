"""
PROTO-339 — Spatial Reasoning Protocol (Python)
Spatial cognition and geometric reasoning for MEDINA Memory Systems.

Charter: PROTO-339
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Tuple
from enum import Enum

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI

class SpatialRelation(Enum):
    ABOVE = "above"
    BELOW = "below"
    LEFT = "left"
    RIGHT = "right"
    INSIDE = "inside"
    OUTSIDE = "outside"
    NEAR = "near"
    FAR = "far"

@dataclass
class Point3D:
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0
    
    def distance(self, other: Point3D) -> float:
        return math.sqrt((self.x - other.x)**2 + (self.y - other.y)**2 + (self.z - other.z)**2)
    
    def midpoint(self, other: Point3D) -> Point3D:
        return Point3D((self.x + other.x) / 2, (self.y + other.y) / 2, (self.z + other.z) / 2)

@dataclass
class SpatialObject:
    id: str
    position: Point3D = field(default_factory=Point3D)
    size: Tuple[float, float, float] = (1.0, 1.0, 1.0)
    
    def center(self) -> Point3D:
        return self.position
    
    def contains(self, point: Point3D) -> bool:
        dx = abs(point.x - self.position.x)
        dy = abs(point.y - self.position.y)
        dz = abs(point.z - self.position.z)
        return dx <= self.size[0]/2 and dy <= self.size[1]/2 and dz <= self.size[2]/2

class SpatialReasoningEngine:
    def __init__(self):
        self.objects: Dict[str, SpatialObject] = {}
        self.beat_count = 0
    
    def add_object(self, id: str, x: float, y: float, z: float = 0,
                   size: Tuple[float, float, float] = (1.0, 1.0, 1.0)) -> SpatialObject:
        obj = SpatialObject(id=id, position=Point3D(x, y, z), size=size)
        self.objects[id] = obj
        return obj
    
    def get_relation(self, obj1_id: str, obj2_id: str) -> Optional[SpatialRelation]:
        if obj1_id not in self.objects or obj2_id not in self.objects:
            return None
        
        o1, o2 = self.objects[obj1_id], self.objects[obj2_id]
        dx = o2.position.x - o1.position.x
        dy = o2.position.y - o1.position.y
        
        if abs(dx) > abs(dy):
            return SpatialRelation.RIGHT if dx > 0 else SpatialRelation.LEFT
        return SpatialRelation.ABOVE if dy > 0 else SpatialRelation.BELOW
    
    def find_nearest(self, point: Point3D, n: int = 1) -> List[str]:
        distances = [(oid, obj.position.distance(point)) for oid, obj in self.objects.items()]
        distances.sort(key=lambda x: x[1])
        return [d[0] for d in distances[:n]]
    
    def find_in_radius(self, center: Point3D, radius: float) -> List[str]:
        return [oid for oid, obj in self.objects.items() 
                if obj.position.distance(center) <= radius]
    
    def get_stats(self) -> Dict[str, Any]:
        self.beat_count += 1
        return {
            "total_objects": len(self.objects),
            "beat_count": self.beat_count,
            "phi_coherence": len(self.objects) / (self.beat_count + 1) * PHI_INV
        }

_spatial_engine: Optional[SpatialReasoningEngine] = None

def get_spatial_reasoning_engine() -> SpatialReasoningEngine:
    global _spatial_engine
    if _spatial_engine is None:
        _spatial_engine = SpatialReasoningEngine()
    return _spatial_engine

__all__ = ["PHI", "PHI_INV", "SpatialRelation", "Point3D", "SpatialObject",
           "SpatialReasoningEngine", "get_spatial_reasoning_engine"]
