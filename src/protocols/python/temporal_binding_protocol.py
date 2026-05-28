"""
PROTO-319 — Temporal Binding Protocol (Python)
Binds events across time with φ-coherent synchronization.

Charter: PROTO-319
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Tuple
from collections import defaultdict
import bisect

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


@dataclass
class TemporalEvent:
    """An event with temporal properties."""
    id: str
    content: Any
    timestamp: float
    duration: float = 0.0
    source: str = "unknown"
    tags: List[str] = field(default_factory=list)
    
    @property
    def end_time(self) -> float:
        """Get event end time."""
        return self.timestamp + self.duration
    
    def overlaps(self, other: "TemporalEvent") -> bool:
        """Check if events overlap in time."""
        return not (self.end_time < other.timestamp or other.end_time < self.timestamp)
    
    def distance(self, other: "TemporalEvent") -> float:
        """Calculate temporal distance to another event."""
        if self.overlaps(other):
            return 0.0
        if self.end_time < other.timestamp:
            return other.timestamp - self.end_time
        return self.timestamp - other.end_time


@dataclass
class TemporalBinding:
    """A binding between temporally related events."""
    id: str
    event_ids: List[str]
    binding_type: str  # "simultaneous", "sequential", "causal"
    strength: float = 1.0
    created_at: float = field(default_factory=time.time)
    
    def decay(self, elapsed: float, rate: float = 0.001) -> None:
        """Apply temporal decay."""
        self.strength *= math.exp(-rate * elapsed * PHI_INV)


class TemporalIndex:
    """Index for efficient temporal queries."""
    
    def __init__(self):
        self.events: Dict[str, TemporalEvent] = {}
        self.timeline: List[Tuple[float, str]] = []  # Sorted by timestamp
    
    def add(self, event: TemporalEvent) -> None:
        """Add an event to the index."""
        self.events[event.id] = event
        bisect.insort(self.timeline, (event.timestamp, event.id))
    
    def query_range(self, start: float, end: float) -> List[TemporalEvent]:
        """Query events in a time range."""
        results = []
        
        # Binary search for start
        i = bisect.bisect_left(self.timeline, (start, ""))
        
        while i < len(self.timeline) and self.timeline[i][0] <= end:
            event_id = self.timeline[i][1]
            if event_id in self.events:
                results.append(self.events[event_id])
            i += 1
        
        return results
    
    def query_window(self, center: float, window: float) -> List[TemporalEvent]:
        """Query events within a time window around center."""
        return self.query_range(center - window, center + window)
    
    def get_neighbors(self, event: TemporalEvent, k: int = 5) -> List[TemporalEvent]:
        """Get k nearest temporal neighbors."""
        all_events = list(self.events.values())
        distances = [
            (e, event.distance(e))
            for e in all_events if e.id != event.id
        ]
        distances.sort(key=lambda x: x[1])
        return [e for e, _ in distances[:k]]


class TemporalSegmenter:
    """Segments timeline into coherent intervals."""
    
    def __init__(self, gap_threshold: float = 5.0):
        self.gap_threshold = gap_threshold
    
    def segment(self, events: List[TemporalEvent]) -> List[List[TemporalEvent]]:
        """Segment events by temporal gaps."""
        if not events:
            return []
        
        sorted_events = sorted(events, key=lambda e: e.timestamp)
        segments = [[sorted_events[0]]]
        
        for event in sorted_events[1:]:
            last_event = segments[-1][-1]
            gap = event.timestamp - last_event.end_time
            
            if gap > self.gap_threshold * PHI:
                segments.append([event])
            else:
                segments[-1].append(event)
        
        return segments


class TemporalBinder:
    """Creates temporal bindings between events."""
    
    def __init__(self):
        self.bindings: Dict[str, TemporalBinding] = {}
        self.binding_counter = 0
    
    def bind_simultaneous(self, events: List[TemporalEvent], 
                         tolerance: float = 0.1) -> Optional[TemporalBinding]:
        """Bind events occurring at the same time."""
        if len(events) < 2:
            return None
        
        # Check if all events are within tolerance
        timestamps = [e.timestamp for e in events]
        if max(timestamps) - min(timestamps) > tolerance:
            return None
        
        self.binding_counter += 1
        binding = TemporalBinding(
            id=f"bind-sim-{self.binding_counter}",
            event_ids=[e.id for e in events],
            binding_type="simultaneous",
            strength=PHI_INV
        )
        self.bindings[binding.id] = binding
        return binding
    
    def bind_sequential(self, events: List[TemporalEvent],
                       max_gap: float = 5.0) -> Optional[TemporalBinding]:
        """Bind events in sequence."""
        if len(events) < 2:
            return None
        
        sorted_events = sorted(events, key=lambda e: e.timestamp)
        
        # Check gaps
        for i in range(1, len(sorted_events)):
            gap = sorted_events[i].timestamp - sorted_events[i-1].end_time
            if gap > max_gap:
                return None
        
        self.binding_counter += 1
        binding = TemporalBinding(
            id=f"bind-seq-{self.binding_counter}",
            event_ids=[e.id for e in sorted_events],
            binding_type="sequential",
            strength=1.0 / len(sorted_events) * PHI
        )
        self.bindings[binding.id] = binding
        return binding
    
    def bind_causal(self, cause: TemporalEvent, effect: TemporalEvent,
                   min_delay: float = 0.0, max_delay: float = 10.0) -> Optional[TemporalBinding]:
        """Bind cause and effect events."""
        delay = effect.timestamp - cause.end_time
        
        if delay < min_delay or delay > max_delay:
            return None
        
        self.binding_counter += 1
        # Strength inversely proportional to delay
        strength = math.exp(-delay * PHI_INV * 0.1)
        
        binding = TemporalBinding(
            id=f"bind-causal-{self.binding_counter}",
            event_ids=[cause.id, effect.id],
            binding_type="causal",
            strength=strength
        )
        self.bindings[binding.id] = binding
        return binding


class TemporalBindingEngine:
    """
    Main temporal binding engine with φ-coherent processing.
    """
    
    def __init__(self):
        self.index = TemporalIndex()
        self.binder = TemporalBinder()
        self.segmenter = TemporalSegmenter()
        self.event_counter = 0
        self.beat_count = 0
    
    def record_event(self, content: Any, timestamp: Optional[float] = None,
                    duration: float = 0.0, source: str = "input",
                    tags: Optional[List[str]] = None) -> TemporalEvent:
        """Record a new temporal event."""
        self.event_counter += 1
        
        event = TemporalEvent(
            id=f"event-{self.event_counter}",
            content=content,
            timestamp=timestamp or time.time(),
            duration=duration,
            source=source,
            tags=tags or []
        )
        
        self.index.add(event)
        return event
    
    def find_simultaneous(self, timestamp: float, 
                         tolerance: float = 0.1) -> List[TemporalEvent]:
        """Find events at roughly the same time."""
        return self.index.query_window(timestamp, tolerance)
    
    def find_before(self, timestamp: float, window: float = 10.0) -> List[TemporalEvent]:
        """Find events before a timestamp."""
        return self.index.query_range(timestamp - window, timestamp)
    
    def find_after(self, timestamp: float, window: float = 10.0) -> List[TemporalEvent]:
        """Find events after a timestamp."""
        return self.index.query_range(timestamp, timestamp + window)
    
    def bind_concurrent(self, event: TemporalEvent) -> List[TemporalBinding]:
        """Automatically bind concurrent events."""
        bindings = []
        
        # Find simultaneous
        simultaneous = self.find_simultaneous(event.timestamp)
        if len(simultaneous) > 1:
            binding = self.binder.bind_simultaneous(simultaneous)
            if binding:
                bindings.append(binding)
        
        return bindings
    
    def detect_patterns(self, pattern: List[str], 
                       max_span: float = 60.0) -> List[List[TemporalEvent]]:
        """Detect sequential patterns in tags."""
        # Find all events with pattern tags
        tagged_events = defaultdict(list)
        for event in self.index.events.values():
            for tag in event.tags:
                if tag in pattern:
                    tagged_events[tag].append(event)
        
        # Find sequences matching pattern
        matches = []
        
        if pattern[0] not in tagged_events:
            return matches
        
        for start_event in tagged_events[pattern[0]]:
            sequence = [start_event]
            current_time = start_event.end_time
            
            for tag in pattern[1:]:
                # Find next event with this tag
                candidates = [
                    e for e in tagged_events[tag]
                    if e.timestamp >= current_time and 
                    e.timestamp - start_event.timestamp <= max_span
                ]
                
                if not candidates:
                    break
                
                next_event = min(candidates, key=lambda e: e.timestamp)
                sequence.append(next_event)
                current_time = next_event.end_time
            
            if len(sequence) == len(pattern):
                matches.append(sequence)
        
        return matches
    
    def segment_timeline(self, start: float, end: float) -> List[List[TemporalEvent]]:
        """Segment a portion of the timeline."""
        events = self.index.query_range(start, end)
        return self.segmenter.segment(events)
    
    def temporal_coherence(self, events: List[TemporalEvent]) -> float:
        """Calculate temporal coherence of event set."""
        if len(events) < 2:
            return 1.0
        
        # Calculate average temporal distance
        total_distance = 0.0
        count = 0
        
        for i, e1 in enumerate(events):
            for e2 in events[i+1:]:
                total_distance += e1.distance(e2)
                count += 1
        
        avg_distance = total_distance / count if count > 0 else 0
        
        # Coherence inversely proportional to distance
        return math.exp(-avg_distance * PHI_INV * 0.1)
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        # Decay bindings
        for binding in self.binder.bindings.values():
            binding.decay(elapsed)
        
        return {
            "beat": self.beat_count,
            "total_events": len(self.index.events),
            "total_bindings": len(self.binder.bindings),
            "timeline_span": (
                self.index.timeline[-1][0] - self.index.timeline[0][0]
                if self.index.timeline else 0
            ),
            "phi_coherence": len(self.binder.bindings) / max(1, len(self.index.events)) * PHI,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate temporal binding report."""
        binding_types = defaultdict(int)
        for b in self.binder.bindings.values():
            binding_types[b.binding_type] += 1
        
        return {
            "total_events": len(self.index.events),
            "total_bindings": len(self.binder.bindings),
            "binding_types": dict(binding_types),
            "avg_binding_strength": sum(b.strength for b in self.binder.bindings.values()) /
                                   max(1, len(self.binder.bindings)),
            "timeline_entries": len(self.index.timeline),
            "phi_metric": self.temporal_coherence(list(self.index.events.values())[:20]) * PHI,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[TemporalBindingEngine] = None

def get_temporal_binding_engine() -> TemporalBindingEngine:
    """Get or create the singleton TemporalBindingEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = TemporalBindingEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-319 Temporal Binding Protocol (Python) ===")
    
    engine = get_temporal_binding_engine()
    
    base_time = time.time()
    
    # Record events
    e1 = engine.record_event("Started task", base_time, tags=["start"])
    e2 = engine.record_event("Subtask A", base_time + 1, duration=2, tags=["work"])
    e3 = engine.record_event("Subtask B", base_time + 2, duration=3, tags=["work"])
    e4 = engine.record_event("Completed task", base_time + 6, tags=["end"])
    
    print(f"Recorded {len(engine.index.events)} events")
    
    # Find temporal neighbors
    neighbors = engine.index.get_neighbors(e2, k=2)
    print(f"Neighbors of e2: {[n.content for n in neighbors]}")
    
    # Bind sequential
    binding = engine.binder.bind_sequential([e1, e2, e3, e4])
    print(f"Sequential binding: {binding.id if binding else 'None'}")
    
    # Detect pattern
    patterns = engine.detect_patterns(["start", "work", "end"])
    print(f"Pattern matches: {len(patterns)}")
    
    print(f"Report: {engine.coherence_report()}")
