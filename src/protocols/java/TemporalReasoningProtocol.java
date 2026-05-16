package com.medinatech.mmims.protocols;

import java.util.*;
import java.util.stream.Collectors;

/**
 * PROTO-232 — Temporal Reasoning Protocol (Java)
 * Phi-scaled time perception, causal inference, and temporal abstraction
 * for MMIMS-X.
 *
 * Charter: PROTO-232
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
 */
public class TemporalReasoningProtocol {

    // ── Constants ──────────────────────────────────────────────────────────
    public static final double PHI     = (1 + Math.sqrt(5)) / 2.0;
    public static final double PHI_INV = 1.0 / PHI;

    // ── 8 Phi-Scaled Time Scales ───────────────────────────────────────────
    public static class TimeScale {
        public final int    index;
        public final String name;
        public final double ms;
        public final String label;
        public TimeScale(int i, String name, double ms, String label) {
            this.index = i; this.name = name; this.ms = ms; this.label = label;
        }
    }

    public static final TimeScale[] TIME_SCALES;
    static {
        String[] labels = {"flash","micro","pulse","breath","beat","wave","cycle","epoch"};
        TIME_SCALES = new TimeScale[8];
        for (int k = 0; k < 8; k++) {
            double ms = 100.0 * Math.pow(PHI, k);
            TIME_SCALES[k] = new TimeScale(k, "τ" + k, ms, labels[k]);
        }
    }

    // ── Temporal Event ─────────────────────────────────────────────────────
    public static class TemporalEvent {
        public final String       id;
        public final String       type;
        public final Object       payload;
        public final long         timestamp;
        public final List<String> causes  = new ArrayList<>();
        public final List<String> effects = new ArrayList<>();
        public       double       weight  = 1.0;
        public       int          scaleIdx = 0;

        public TemporalEvent(String id, String type, Object payload) {
            this.id = id; this.type = type; this.payload = payload;
            this.timestamp = System.currentTimeMillis();
        }

        public void addCause(String eid)  { if (!causes.contains(eid))  causes.add(eid); }
        public void addEffect(String eid) { if (!effects.contains(eid)) effects.add(eid); }

        public double decayedWeight(long nowMs, double halfLifeMs) {
            double age    = nowMs - timestamp;
            double lambda = Math.log(2) / halfLifeMs * PHI_INV;
            return weight * Math.exp(-lambda * age);
        }

        public Map<String, Object> toSummary() {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id",        id);
            m.put("type",      type);
            m.put("scale",     TIME_SCALES[Math.min(scaleIdx, 7)].label);
            m.put("causes",    causes.size());
            m.put("effects",   effects.size());
            m.put("timestamp", timestamp);
            return m;
        }
    }

    // ── Phi-Decay Buffer ───────────────────────────────────────────────────
    public static class PhiDecayBuffer {
        private final int                  capacity;
        private final double               halfLifeMs;
        private final Map<String, TemporalEvent> events = new LinkedHashMap<>();

        public PhiDecayBuffer(int capacity, double halfLifeMs) {
            this.capacity   = capacity;
            this.halfLifeMs = halfLifeMs;
        }

        public PhiDecayBuffer() { this(144, TIME_SCALES[4].ms); }

        public void add(TemporalEvent event) {
            if (events.containsKey(event.id)) return;
            if (events.size() >= capacity) evict();
            events.put(event.id, event);
        }

        private void evict() {
            long nowMs = System.currentTimeMillis();
            String minId = null; double minW = Double.MAX_VALUE;
            for (Map.Entry<String, TemporalEvent> e : events.entrySet()) {
                double w = e.getValue().decayedWeight(nowMs, halfLifeMs);
                if (w < minW) { minW = w; minId = e.getKey(); }
            }
            if (minId != null) events.remove(minId);
        }

        public TemporalEvent get(String id)  { return events.get(id); }
        public int size()                    { return events.size(); }
        public Collection<TemporalEvent> all() { return events.values(); }

        public int prune(double threshold) {
            long nowMs  = System.currentTimeMillis();
            int  pruned = 0;
            Iterator<Map.Entry<String, TemporalEvent>> it = events.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry<String, TemporalEvent> e = it.next();
                if (e.getValue().decayedWeight(nowMs, halfLifeMs) < threshold) {
                    it.remove(); pruned++;
                }
            }
            return pruned;
        }
    }

    // ── Causal Graph ───────────────────────────────────────────────────────
    public static class CausalGraph {
        private final Map<String, Map<String, Double>> outEdges = new HashMap<>();
        private final Map<String, Map<String, Double>> inEdges  = new HashMap<>();

        private void ensureNode(String id) {
            outEdges.putIfAbsent(id, new HashMap<>());
            inEdges.putIfAbsent(id, new HashMap<>());
        }

        public void link(String cause, String effect, double strength) {
            ensureNode(cause); ensureNode(effect);
            outEdges.get(cause).put(effect, strength);
            inEdges.get(effect).put(cause, strength);
        }

        public List<Map<String,Object>> predictEffects(String causeId, int maxDepth) {
            Map<String, Double> visited = new HashMap<>();
            Queue<Object[]> queue = new LinkedList<>();
            queue.add(new Object[]{ causeId, 1.0, 0 });
            while (!queue.isEmpty()) {
                Object[] cur   = queue.poll();
                String   id    = (String)  cur[0];
                double   str   = (double)  cur[1];
                int      depth = (int)     cur[2];
                if (depth >= maxDepth) continue;
                Map<String, Double> out = outEdges.get(id);
                if (out == null) continue;
                for (Map.Entry<String, Double> e : out.entrySet()) {
                    double cumStr = str * e.getValue() * PHI_INV;
                    if (!visited.containsKey(e.getKey()) || visited.get(e.getKey()) < cumStr) {
                        visited.put(e.getKey(), cumStr);
                        queue.add(new Object[]{ e.getKey(), cumStr, depth + 1 });
                    }
                }
            }
            visited.remove(causeId);
            return visited.entrySet().stream()
                .map(e -> { Map<String,Object> m = new LinkedHashMap<>(); m.put("id", e.getKey()); m.put("strength", e.getValue()); return m; })
                .sorted((a,b) -> Double.compare((double)b.get("strength"), (double)a.get("strength")))
                .collect(Collectors.toList());
        }

        public List<Map<String,Object>> inferCauses(String effectId, int maxDepth) {
            Map<String, Double> visited = new HashMap<>();
            Queue<Object[]> queue = new LinkedList<>();
            queue.add(new Object[]{ effectId, 1.0, 0 });
            while (!queue.isEmpty()) {
                Object[] cur   = queue.poll();
                String   id    = (String) cur[0];
                double   str   = (double) cur[1];
                int      depth = (int)    cur[2];
                if (depth >= maxDepth) continue;
                Map<String, Double> in = inEdges.get(id);
                if (in == null) continue;
                for (Map.Entry<String, Double> e : in.entrySet()) {
                    double cumStr = str * e.getValue() * PHI_INV;
                    if (!visited.containsKey(e.getKey()) || visited.get(e.getKey()) < cumStr) {
                        visited.put(e.getKey(), cumStr);
                        queue.add(new Object[]{ e.getKey(), cumStr, depth + 1 });
                    }
                }
            }
            visited.remove(effectId);
            return visited.entrySet().stream()
                .map(e -> { Map<String,Object> m = new LinkedHashMap<>(); m.put("id", e.getKey()); m.put("strength", e.getValue()); return m; })
                .sorted((a,b) -> Double.compare((double)b.get("strength"), (double)a.get("strength")))
                .collect(Collectors.toList());
        }

        public int nodeCount() { return outEdges.size(); }
        public int edgeCount() { return outEdges.values().stream().mapToInt(Map::size).sum(); }
    }

    // ── Temporal Abstractor ────────────────────────────────────────────────
    public static class TemporalAbstractor {
        public List<Map<String, Object>> summarise(List<TemporalEvent> events, int scaleIndex) {
            if (events.isEmpty()) return Collections.emptyList();
            double windowMs = TIME_SCALES[Math.min(scaleIndex, 7)].ms;
            List<TemporalEvent> sorted = events.stream()
                .sorted(Comparator.comparingLong(e -> e.timestamp))
                .collect(Collectors.toList());

            List<Map<String, Object>> episodes = new ArrayList<>();
            List<TemporalEvent> bucket = new ArrayList<>();
            long bucketStart = sorted.get(0).timestamp;

            for (TemporalEvent ev : sorted) {
                if (ev.timestamp - bucketStart <= windowMs) {
                    bucket.add(ev);
                } else {
                    episodes.add(mergeEpisode(bucket, scaleIndex));
                    bucket = new ArrayList<>(List.of(ev));
                    bucketStart = ev.timestamp;
                }
            }
            if (!bucket.isEmpty()) episodes.add(mergeEpisode(bucket, scaleIndex));
            return episodes;
        }

        private Map<String, Object> mergeEpisode(List<TemporalEvent> evs, int scaleIndex) {
            Set<String> types   = evs.stream().map(e -> e.type).collect(Collectors.toSet());
            Set<String> causes  = evs.stream().flatMap(e -> e.causes.stream()).collect(Collectors.toSet());
            Set<String> effects = evs.stream().flatMap(e -> e.effects.stream()).collect(Collectors.toSet());
            long startMs = evs.get(0).timestamp;
            long endMs   = evs.get(evs.size() - 1).timestamp;
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("scaleLabel",  TIME_SCALES[Math.min(scaleIndex, 7)].label);
            m.put("eventCount",  evs.size());
            m.put("types",       new ArrayList<>(types));
            m.put("startMs",     startMs);
            m.put("endMs",       endMs);
            m.put("durationMs",  endMs - startMs);
            m.put("causes",      new ArrayList<>(causes));
            m.put("effects",     new ArrayList<>(effects));
            m.put("phiWeight",   evs.size() / TIME_SCALES[Math.min(scaleIndex, 7)].ms * PHI);
            return m;
        }
    }

    // ── Temporal Reasoning Engine ──────────────────────────────────────────
    public static class TemporalReasoningEngine {
        private final PhiDecayBuffer    buffer;
        private final CausalGraph       causal;
        private final TemporalAbstractor abstractor;
        private       int               eventCounter = 0;

        public TemporalReasoningEngine()              { this(144); }
        public TemporalReasoningEngine(int capacity)  {
            this.buffer     = new PhiDecayBuffer(capacity, TIME_SCALES[4].ms);
            this.causal     = new CausalGraph();
            this.abstractor = new TemporalAbstractor();
        }

        public TemporalEvent ingest(String type, Object payload, List<String> causeIds) {
            String        id = "EVT-" + (++eventCounter) + "-" + System.currentTimeMillis();
            TemporalEvent ev = new TemporalEvent(id, type, payload);
            for (String cid : causeIds) {
                ev.addCause(cid);
                causal.link(cid, id, PHI_INV);
                TemporalEvent cause = buffer.get(cid);
                if (cause != null) cause.addEffect(id);
            }
            buffer.add(ev);
            return ev;
        }

        public void assertCausation(String causeId, String effectId, double strength) {
            causal.link(causeId, effectId, strength);
            TemporalEvent c = buffer.get(causeId), e = buffer.get(effectId);
            if (c != null) c.addEffect(effectId);
            if (e != null) e.addCause(causeId);
        }

        public List<Map<String,Object>> predictEffects(String id)    { return causal.predictEffects(id, 3); }
        public List<Map<String,Object>> inferCauses(String id)       { return causal.inferCauses(id, 3); }
        public List<Map<String,Object>> summarise(int scaleIndex)    {
            return abstractor.summarise(new ArrayList<>(buffer.all()), scaleIndex);
        }
        public int prune()    { return buffer.prune(0.01); }

        public Map<String,Object> status() {
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("buffered",     buffer.size());
            m.put("causalNodes",  causal.nodeCount());
            m.put("causalEdges",  causal.edgeCount());
            return m;
        }
    }

    // ── Demo ───────────────────────────────────────────────────────────────
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== PROTO-232 Temporal Reasoning Protocol (Java) ===");
        System.out.println("Time scales:");
        for (TimeScale s : TIME_SCALES)
            System.out.printf("  %s: %.1f ms (%s)%n", s.name, s.ms, s.label);

        TemporalReasoningEngine engine = new TemporalReasoningEngine();
        TemporalEvent e1 = engine.ingest("sensor-read",  "temperature=98.6", List.of());
        Thread.sleep(10);
        TemporalEvent e2 = engine.ingest("alert-trigger","threshold-exceeded", List.of(e1.id));
        Thread.sleep(5);
        TemporalEvent e3 = engine.ingest("agent-spawn",  "risk-agent-007",  List.of(e2.id));

        System.out.println("\nPredicted effects of " + e1.id + ": " + engine.predictEffects(e1.id));
        System.out.println("Inferred causes of  " + e3.id + ": " + engine.inferCauses(e3.id));
        System.out.println("Summary (beat scale): " + engine.summarise(4));
        System.out.println("Status: " + engine.status());
    }
}
