"""
PROTO-232 — Temporal Reasoning Protocol (Python)
Phi-scaled time perception, causal inference, and temporal abstraction
for MMIMS-X.

Charter: PROTO-232
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import uuid
from collections import deque
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set, Tuple

# ── Constants ──────────────────────────────────────────────────────────────────
PHI     = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI

# ── 8 Phi-Scaled Time Scales ───────────────────────────────────────────────────
_LABELS = ["flash", "micro", "pulse", "breath", "beat", "wave", "cycle", "epoch"]

@dataclass(frozen=True)
class TimeScale:
    index: int
    name:  str
    ms:    float
    label: str

TIME_SCALES: List[TimeScale] = [
    TimeScale(k, f"τ{k}", 100.0 * PHI ** k, _LABELS[k])
    for k in range(8)
]


# ── Temporal Event ─────────────────────────────────────────────────────────────
class TemporalEvent:
    def __init__(self, id: str, type: str, payload: Any,
                 timestamp_ms: Optional[float] = None):
        self.id           = id
        self.type         = type
        self.payload      = payload
        self.timestamp    = timestamp_ms if timestamp_ms is not None else time.time() * 1000
        self.causes:  List[str] = []
        self.effects: List[str] = []
        self.weight       = 1.0
        self.scale_idx    = 0

    def add_cause(self, event_id: str) -> None:
        if event_id not in self.causes:
            self.causes.append(event_id)

    def add_effect(self, event_id: str) -> None:
        if event_id not in self.effects:
            self.effects.append(event_id)

    def decayed_weight(self, now_ms: Optional[float] = None,
                       half_life_ms: Optional[float] = None) -> float:
        if now_ms is None:
            now_ms = time.time() * 1000
        if half_life_ms is None:
            half_life_ms = TIME_SCALES[4].ms
        age    = now_ms - self.timestamp
        lam    = math.log(2) / half_life_ms * PHI_INV
        return self.weight * math.exp(-lam * age)

    def to_summary(self) -> Dict[str, Any]:
        return {
            "id":        self.id,
            "type":      self.type,
            "scale":     TIME_SCALES[min(self.scale_idx, 7)].label,
            "causes":    len(self.causes),
            "effects":   len(self.effects),
            "timestamp": self.timestamp,
        }


# ── Phi-Decay Buffer ───────────────────────────────────────────────────────────
class PhiDecayBuffer:
    def __init__(self, capacity: int = 144,
                 half_life_ms: Optional[float] = None):
        self.capacity    = capacity  # 144 = Fibonacci F₁₂
        self.half_life   = half_life_ms or TIME_SCALES[4].ms
        self._events:    Dict[str, TemporalEvent] = {}
        self._order:     List[str] = []

    def add(self, event: TemporalEvent) -> None:
        if event.id in self._events:
            self._refresh(event.id)
            return
        if len(self._events) >= self.capacity:
            self._evict()
        self._events[event.id] = event
        self._order.append(event.id)

    def _refresh(self, id: str) -> None:
        if id in self._order:
            self._order.remove(id)
            self._order.append(id)

    def _evict(self) -> None:
        now  = time.time() * 1000
        min_id, min_w = None, float("inf")
        for id, ev in self._events.items():
            w = ev.decayed_weight(now, self.half_life)
            if w < min_w:
                min_w, min_id = w, id
        if min_id:
            del self._events[min_id]
            self._order = [i for i in self._order if i != min_id]

    def get(self, id: str) -> Optional[TemporalEvent]:
        return self._events.get(id)

    def size(self) -> int:
        return len(self._events)

    def all(self) -> List[TemporalEvent]:
        return list(self._events.values())

    def ranked(self, now_ms: Optional[float] = None) -> List[Tuple[TemporalEvent, float]]:
        if now_ms is None:
            now_ms = time.time() * 1000
        pairs = [(ev, ev.decayed_weight(now_ms, self.half_life)) for ev in self._events.values()]
        return sorted(pairs, key=lambda x: x[1], reverse=True)

    def prune(self, threshold: float = 0.01) -> int:
        now    = time.time() * 1000
        to_del = [id for id, ev in self._events.items()
                  if ev.decayed_weight(now, self.half_life) < threshold]
        for id in to_del:
            del self._events[id]
        self._order = [i for i in self._order if i in self._events]
        return len(to_del)


# ── Causal Graph ───────────────────────────────────────────────────────────────
class CausalGraph:
    def __init__(self):
        self._out: Dict[str, Dict[str, float]] = {}
        self._in:  Dict[str, Dict[str, float]] = {}

    def _ensure(self, id: str) -> None:
        self._out.setdefault(id, {})
        self._in.setdefault(id, {})

    def link(self, cause: str, effect: str, strength: float = None) -> None:
        if strength is None:
            strength = PHI_INV
        self._ensure(cause)
        self._ensure(effect)
        self._out[cause][effect] = strength
        self._in[effect][cause]  = strength

    def predict_effects(self, cause_id: str, max_depth: int = 3) -> List[Dict[str, Any]]:
        visited: Dict[str, float] = {}
        queue   = [(cause_id, 1.0, 0)]
        while queue:
            id, strength, depth = queue.pop(0)
            if depth >= max_depth:
                continue
            for eff, edge_str in self._out.get(id, {}).items():
                cum = strength * edge_str * PHI_INV
                if eff not in visited or visited[eff] < cum:
                    visited[eff] = cum
                    queue.append((eff, cum, depth + 1))
        visited.pop(cause_id, None)
        return sorted(
            [{"id": k, "strength": v} for k, v in visited.items()],
            key=lambda x: x["strength"], reverse=True,
        )

    def infer_causes(self, effect_id: str, max_depth: int = 3) -> List[Dict[str, Any]]:
        visited: Dict[str, float] = {}
        queue   = [(effect_id, 1.0, 0)]
        while queue:
            id, strength, depth = queue.pop(0)
            if depth >= max_depth:
                continue
            for cause, edge_str in self._in.get(id, {}).items():
                cum = strength * edge_str * PHI_INV
                if cause not in visited or visited[cause] < cum:
                    visited[cause] = cum
                    queue.append((cause, cum, depth + 1))
        visited.pop(effect_id, None)
        return sorted(
            [{"id": k, "strength": v} for k, v in visited.items()],
            key=lambda x: x["strength"], reverse=True,
        )

    def node_count(self) -> int: return len(self._out)
    def edge_count(self) -> int: return sum(len(v) for v in self._out.values())


# ── Temporal Abstractor ────────────────────────────────────────────────────────
class TemporalAbstractor:
    def summarise(self, events: List[TemporalEvent],
                  scale_index: int = 4) -> List[Dict[str, Any]]:
        if not events:
            return []
        ts    = TIME_SCALES[min(scale_index, 7)]
        window = ts.ms
        sorted_evs = sorted(events, key=lambda e: e.timestamp)
        episodes, bucket, start = [], [], sorted_evs[0].timestamp

        for ev in sorted_evs:
            if ev.timestamp - start <= window:
                bucket.append(ev)
            else:
                episodes.append(self._merge(bucket, ts))
                bucket, start = [ev], ev.timestamp
        if bucket:
            episodes.append(self._merge(bucket, ts))
        return episodes

    @staticmethod
    def _merge(evs: List[TemporalEvent], ts: TimeScale) -> Dict[str, Any]:
        types   = list(set(e.type    for e in evs))
        causes  = list(set(c         for e in evs for c in e.causes))
        effects = list(set(x         for e in evs for x in e.effects))
        return {
            "scale_label":  ts.label,
            "event_count":  len(evs),
            "types":        types,
            "start_ms":     evs[0].timestamp,
            "end_ms":       evs[-1].timestamp,
            "duration_ms":  evs[-1].timestamp - evs[0].timestamp,
            "causes":       causes,
            "effects":      effects,
            "phi_weight":   len(evs) / ts.ms * PHI,
        }


# ── Temporal Reasoning Engine ──────────────────────────────────────────────────
class TemporalReasoningEngine:
    def __init__(self, buffer_capacity: int = 144):
        self.buffer     = PhiDecayBuffer(buffer_capacity)
        self.causal     = CausalGraph()
        self.abstractor = TemporalAbstractor()
        self._counter   = 0

    def ingest(self, type: str, payload: Any,
               cause_ids: Optional[List[str]] = None) -> TemporalEvent:
        cause_ids = cause_ids or []
        self._counter += 1
        id = f"EVT-{self._counter}-{int(time.time() * 1000)}"
        ev = TemporalEvent(id, type, payload)
        for cid in cause_ids:
            ev.add_cause(cid)
            self.causal.link(cid, id, PHI_INV)
            cause = self.buffer.get(cid)
            if cause:
                cause.add_effect(id)
        self.buffer.add(ev)
        self.causal._ensure(id)
        return ev

    def assert_causation(self, cause_id: str, effect_id: str,
                         strength: float = None) -> None:
        self.causal.link(cause_id, effect_id, strength or PHI_INV)
        c, e = self.buffer.get(cause_id), self.buffer.get(effect_id)
        if c: c.add_effect(effect_id)
        if e: e.add_cause(cause_id)

    def predict_effects(self, id: str, max_depth: int = 3) -> List[Dict]:
        return self.causal.predict_effects(id, max_depth)

    def infer_causes(self, id: str, max_depth: int = 3) -> List[Dict]:
        return self.causal.infer_causes(id, max_depth)

    def summarise(self, scale_index: int = 4) -> List[Dict]:
        return self.abstractor.summarise(self.buffer.all(), scale_index)

    def prune(self, threshold: float = 0.01) -> int:
        return self.buffer.prune(threshold)

    def status(self) -> Dict[str, Any]:
        return {
            "buffered":      self.buffer.size(),
            "causal_nodes":  self.causal.node_count(),
            "causal_edges":  self.causal.edge_count(),
        }


# ── Quick demo ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-232 Temporal Reasoning Protocol (Python) ===")
    for s in TIME_SCALES:
        print(f"  {s.name}: {s.ms:.1f} ms ({s.label})")

    engine = TemporalReasoningEngine()
    e1 = engine.ingest("sensor-read",   "temperature=98.6")
    time.sleep(0.01)
    e2 = engine.ingest("alert-trigger", "threshold-exceeded", [e1.id])
    time.sleep(0.005)
    e3 = engine.ingest("agent-spawn",   "risk-agent-007",    [e2.id])

    print(f"\nPredicted effects of {e1.id}: {engine.predict_effects(e1.id)}")
    print(f"Inferred causes of  {e3.id}: {engine.infer_causes(e3.id)}")
    print(f"Status: {engine.status()}")
