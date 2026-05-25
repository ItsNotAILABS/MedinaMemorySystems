"""
PROTO-309 — Working Memory Protocol (Python)
Active working memory with capacity constraints and φ-coherent management.

Charter: PROTO-309
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable
from enum import Enum
from collections import deque

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


class ChunkType(Enum):
    VERBAL = "verbal"
    VISUAL = "visual"
    SPATIAL = "spatial"
    NUMERICAL = "numerical"
    PROCEDURAL = "procedural"


@dataclass
class MemoryChunk:
    """A chunk in working memory."""
    id: str
    content: Any
    chunk_type: ChunkType
    activation: float = 1.0
    load: float = 1.0  # Cognitive load
    created_at: float = field(default_factory=time.time)
    last_refreshed: float = field(default_factory=time.time)
    rehearsal_count: int = 0
    
    def refresh(self) -> None:
        """Refresh chunk to prevent decay."""
        self.last_refreshed = time.time()
        self.activation = min(1.0, self.activation + PHI_INV * 0.2)
        self.rehearsal_count += 1
    
    def decay(self, elapsed: float) -> None:
        """Apply decay based on time since last refresh."""
        rate = PHI_INV * 0.1
        self.activation *= math.exp(-rate * elapsed)
    
    def is_active(self) -> bool:
        """Check if chunk is still active."""
        return self.activation > 0.1


@dataclass
class CentralExecutive:
    """Controls attention and coordinates subsystems."""
    focus_capacity: float = 1.0
    current_focus: List[str] = field(default_factory=list)
    task_queue: deque = field(default_factory=deque)
    inhibition_strength: float = PHI_INV
    
    def can_focus(self, load: float) -> bool:
        """Check if there's capacity to focus on new item."""
        current_load = sum(1 for _ in self.current_focus)
        return current_load + load <= self.focus_capacity * PHI
    
    def set_focus(self, chunk_ids: List[str]) -> None:
        """Set current focus."""
        self.current_focus = chunk_ids[:int(4 * PHI)]  # Miller's 7±2 adjusted
    
    def queue_task(self, task: Dict[str, Any]) -> None:
        """Queue a task for processing."""
        self.task_queue.append(task)
    
    def next_task(self) -> Optional[Dict[str, Any]]:
        """Get next task from queue."""
        if self.task_queue:
            return self.task_queue.popleft()
        return None


class PhonologicalLoop:
    """Verbal/auditory working memory buffer."""
    
    def __init__(self, capacity: int = 7):
        self.capacity = capacity
        self.buffer: List[MemoryChunk] = []
        self.rehearsal_rate = PHI_INV * 2  # Rehearsals per second
    
    def add(self, chunk: MemoryChunk) -> bool:
        """Add verbal chunk to loop."""
        if chunk.chunk_type not in [ChunkType.VERBAL, ChunkType.NUMERICAL]:
            return False
        
        if len(self.buffer) >= self.capacity:
            self._remove_weakest()
        
        self.buffer.append(chunk)
        return True
    
    def rehearse_all(self) -> int:
        """Rehearse all items in the loop."""
        for chunk in self.buffer:
            chunk.refresh()
        return len(self.buffer)
    
    def _remove_weakest(self) -> None:
        """Remove weakest chunk."""
        if self.buffer:
            weakest = min(self.buffer, key=lambda c: c.activation)
            self.buffer.remove(weakest)
    
    def get_active(self) -> List[MemoryChunk]:
        """Get active chunks."""
        return [c for c in self.buffer if c.is_active()]


class VisuospatialSketchpad:
    """Visual/spatial working memory buffer."""
    
    def __init__(self, capacity: int = 4):
        self.capacity = capacity
        self.visual_buffer: List[MemoryChunk] = []
        self.spatial_buffer: List[MemoryChunk] = []
    
    def add_visual(self, chunk: MemoryChunk) -> bool:
        """Add visual chunk."""
        if chunk.chunk_type != ChunkType.VISUAL:
            return False
        
        if len(self.visual_buffer) >= self.capacity:
            self._remove_weakest(self.visual_buffer)
        
        self.visual_buffer.append(chunk)
        return True
    
    def add_spatial(self, chunk: MemoryChunk) -> bool:
        """Add spatial chunk."""
        if chunk.chunk_type != ChunkType.SPATIAL:
            return False
        
        if len(self.spatial_buffer) >= self.capacity:
            self._remove_weakest(self.spatial_buffer)
        
        self.spatial_buffer.append(chunk)
        return True
    
    def _remove_weakest(self, buffer: List[MemoryChunk]) -> None:
        """Remove weakest from specified buffer."""
        if buffer:
            weakest = min(buffer, key=lambda c: c.activation)
            buffer.remove(weakest)
    
    def get_all_active(self) -> List[MemoryChunk]:
        """Get all active visual and spatial chunks."""
        visual = [c for c in self.visual_buffer if c.is_active()]
        spatial = [c for c in self.spatial_buffer if c.is_active()]
        return visual + spatial


class EpisodicBuffer:
    """Binds information from different sources."""
    
    def __init__(self, capacity: int = 4):
        self.capacity = capacity
        self.bindings: List[Dict[str, Any]] = []
    
    def bind(self, chunks: List[MemoryChunk], label: str = "") -> Dict[str, Any]:
        """Create a binding of multiple chunks."""
        if len(self.bindings) >= self.capacity:
            self.bindings.pop(0)
        
        binding = {
            "id": f"bind-{int(time.time()*1000)}",
            "label": label,
            "chunks": [c.id for c in chunks],
            "created_at": time.time(),
            "strength": sum(c.activation for c in chunks) / len(chunks) if chunks else 0
        }
        
        self.bindings.append(binding)
        return binding
    
    def get_bindings(self) -> List[Dict[str, Any]]:
        """Get all current bindings."""
        return self.bindings


class WorkingMemoryEngine:
    """
    Main working memory engine with φ-coherent Baddeley model.
    """
    
    def __init__(self):
        self.central_executive = CentralExecutive()
        self.phonological_loop = PhonologicalLoop()
        self.visuospatial_sketchpad = VisuospatialSketchpad()
        self.episodic_buffer = EpisodicBuffer()
        self.chunks: Dict[str, MemoryChunk] = {}
        self.beat_count = 0
        self.chunk_counter = 0
    
    def load(self, content: Any, chunk_type: ChunkType, load: float = 1.0) -> Optional[MemoryChunk]:
        """Load content into working memory."""
        self.chunk_counter += 1
        
        chunk = MemoryChunk(
            id=f"wm-{self.chunk_counter}",
            content=content,
            chunk_type=chunk_type,
            load=load
        )
        
        # Route to appropriate subsystem
        success = False
        if chunk_type in [ChunkType.VERBAL, ChunkType.NUMERICAL]:
            success = self.phonological_loop.add(chunk)
        elif chunk_type == ChunkType.VISUAL:
            success = self.visuospatial_sketchpad.add_visual(chunk)
        elif chunk_type == ChunkType.SPATIAL:
            success = self.visuospatial_sketchpad.add_spatial(chunk)
        else:
            # Default to episodic buffer
            self.episodic_buffer.bind([chunk], str(content)[:20])
            success = True
        
        if success:
            self.chunks[chunk.id] = chunk
            return chunk
        return None
    
    def focus(self, chunk_ids: List[str]) -> List[str]:
        """Focus attention on specific chunks."""
        valid_ids = [cid for cid in chunk_ids if cid in self.chunks]
        
        # Refresh focused chunks
        for cid in valid_ids:
            self.chunks[cid].refresh()
        
        self.central_executive.set_focus(valid_ids)
        return valid_ids
    
    def get_focused(self) -> List[MemoryChunk]:
        """Get currently focused chunks."""
        return [self.chunks[cid] for cid in self.central_executive.current_focus
                if cid in self.chunks]
    
    def rehearse(self) -> int:
        """Rehearse phonological loop contents."""
        return self.phonological_loop.rehearse_all()
    
    def bind(self, chunk_ids: List[str], label: str = "") -> Dict[str, Any]:
        """Bind multiple chunks together."""
        chunks = [self.chunks[cid] for cid in chunk_ids if cid in self.chunks]
        return self.episodic_buffer.bind(chunks, label)
    
    def clear(self, chunk_type: Optional[ChunkType] = None) -> int:
        """Clear working memory, optionally by type."""
        cleared = 0
        
        if chunk_type is None:
            cleared = len(self.chunks)
            self.chunks.clear()
            self.phonological_loop.buffer.clear()
            self.visuospatial_sketchpad.visual_buffer.clear()
            self.visuospatial_sketchpad.spatial_buffer.clear()
        else:
            to_remove = [cid for cid, c in self.chunks.items() if c.chunk_type == chunk_type]
            for cid in to_remove:
                chunk = self.chunks.pop(cid)
                if chunk_type in [ChunkType.VERBAL, ChunkType.NUMERICAL]:
                    if chunk in self.phonological_loop.buffer:
                        self.phonological_loop.buffer.remove(chunk)
                elif chunk_type == ChunkType.VISUAL:
                    if chunk in self.visuospatial_sketchpad.visual_buffer:
                        self.visuospatial_sketchpad.visual_buffer.remove(chunk)
                elif chunk_type == ChunkType.SPATIAL:
                    if chunk in self.visuospatial_sketchpad.spatial_buffer:
                        self.visuospatial_sketchpad.spatial_buffer.remove(chunk)
                cleared += 1
        
        return cleared
    
    def get_all_active(self) -> List[MemoryChunk]:
        """Get all active chunks across subsystems."""
        return [c for c in self.chunks.values() if c.is_active()]
    
    def cognitive_load(self) -> float:
        """Calculate current cognitive load."""
        total_load = sum(c.load for c in self.chunks.values() if c.is_active())
        max_load = 7 * PHI  # Miller's number adjusted
        return min(1.0, total_load / max_load)
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        # Decay all chunks
        for chunk in self.chunks.values():
            chunk.decay(elapsed)
        
        # Remove inactive chunks
        inactive = [cid for cid, c in self.chunks.items() if not c.is_active()]
        for cid in inactive:
            del self.chunks[cid]
        
        # Automatic rehearsal
        if self.beat_count % int(PHI * 2) == 0:
            self.rehearse()
        
        return {
            "beat": self.beat_count,
            "total_chunks": len(self.chunks),
            "active_chunks": len(self.get_all_active()),
            "cognitive_load": self.cognitive_load(),
            "focused_count": len(self.central_executive.current_focus),
            "bindings": len(self.episodic_buffer.bindings),
            "phi_coherence": (1 - self.cognitive_load()) * PHI,
            "timestamp": time.time()
        }
    
    def status(self) -> Dict[str, Any]:
        """Get detailed working memory status."""
        return {
            "phonological_loop": len(self.phonological_loop.buffer),
            "visual_buffer": len(self.visuospatial_sketchpad.visual_buffer),
            "spatial_buffer": len(self.visuospatial_sketchpad.spatial_buffer),
            "episodic_bindings": len(self.episodic_buffer.bindings),
            "total_chunks": len(self.chunks),
            "cognitive_load": self.cognitive_load(),
            "focus": self.central_executive.current_focus,
            "task_queue_size": len(self.central_executive.task_queue)
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[WorkingMemoryEngine] = None

def get_working_memory_engine() -> WorkingMemoryEngine:
    """Get or create the singleton WorkingMemoryEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = WorkingMemoryEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-309 Working Memory Protocol (Python) ===")
    
    engine = get_working_memory_engine()
    
    # Load items
    c1 = engine.load("apple", ChunkType.VERBAL)
    c2 = engine.load("banana", ChunkType.VERBAL)
    c3 = engine.load("red circle", ChunkType.VISUAL)
    c4 = engine.load("top-left", ChunkType.SPATIAL)
    
    print(f"Loaded chunks: {[c.id for c in [c1, c2, c3, c4] if c]}")
    
    # Focus
    engine.focus([c1.id, c2.id])
    print(f"Focused: {[c.content for c in engine.get_focused()]}")
    
    # Check load
    print(f"Cognitive load: {engine.cognitive_load():.2f}")
    
    # Status
    print(f"Status: {engine.status()}")
    
    # Run ticks
    for _ in range(10):
        engine.tick()
    
    print(f"After decay - Active: {len(engine.get_all_active())}")
