package com.medinatech.mmims.protocols;

import java.util.*;
import java.util.stream.Collectors;

/**
 * PROTO-233 — Swarm Intelligence Protocol (Java)
 * PSO, ACO pheromone trails, and swarm consensus for MMIMS-X.
 *
 * Charter: PROTO-233
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
 */
public class SwarmIntelligenceProtocol {

    // ── Constants ──────────────────────────────────────────────────────────
    public static final double PHI         = (1 + Math.sqrt(5)) / 2.0;
    public static final double PHI_INV     = 1.0 / PHI;
    public static final double PHI_SQ      = PHI * PHI;
    public static final double PSO_W       = 1.0 / PHI_SQ;   // inertia  ≈ 0.382
    public static final double PSO_C1      = PHI_INV;         // cognitive ≈ 0.618
    public static final double PSO_C2      = PHI;             // social    ≈ 1.618
    public static final double EVAPORATION = PHI_INV * 0.1;   // ≈ 0.0618

    private static final Random RNG = new Random();
    private static double rand()    { return RNG.nextDouble(); }
    private static double clamp(double v, double lo, double hi) {
        return Math.max(lo, Math.min(hi, v));
    }

    // ── Vector Utilities ───────────────────────────────────────────────────
    private static double[] vecAdd(double[] a, double[] b) {
        double[] out = new double[a.length];
        for (int i = 0; i < a.length; i++) out[i] = a[i] + b[i];
        return out;
    }
    private static double[] vecSub(double[] a, double[] b) {
        double[] out = new double[a.length];
        for (int i = 0; i < a.length; i++) out[i] = a[i] - b[i];
        return out;
    }
    private static double[] vecScale(double[] a, double s) {
        double[] out = new double[a.length];
        for (int i = 0; i < a.length; i++) out[i] = a[i] * s;
        return out;
    }

    // ── FitnessFunction interface ──────────────────────────────────────────
    @FunctionalInterface
    public interface FitnessFunction { double evaluate(double[] position); }

    // ── Particle (PSO) ─────────────────────────────────────────────────────
    public static class Particle {
        public double[]  position;
        public double[]  velocity;
        public double[]  bestPos;
        public double    bestFit;
        private final FitnessFunction fitnessFn;
        private final double[][] bounds;
        private final int        dim;

        public Particle(double[] position, double[] velocity,
                        FitnessFunction fitnessFn, double[][] bounds) {
            this.position  = position.clone();
            this.velocity  = velocity.clone();
            this.fitnessFn = fitnessFn;
            this.bounds    = bounds;
            this.dim       = position.length;
            this.bestPos   = position.clone();
            this.bestFit   = fitnessFn.evaluate(position);
        }

        public double step(double[] globalBest) {
            double r1 = rand(), r2 = rand();
            double[] ine = vecScale(velocity, PSO_W);
            double[] cog = vecScale(vecSub(bestPos, position), PSO_C1 * r1);
            double[] soc = vecScale(vecSub(globalBest, position), PSO_C2 * r2);

            velocity = vecAdd(vecAdd(ine, cog), soc);
            if (bounds != null) {
                for (int i = 0; i < dim; i++) {
                    double span = (bounds[i][1] - bounds[i][0]) * PHI_INV;
                    velocity[i] = clamp(velocity[i], -span, span);
                }
            }

            position = vecAdd(position, velocity);
            if (bounds != null) {
                for (int i = 0; i < dim; i++)
                    position[i] = clamp(position[i], bounds[i][0], bounds[i][1]);
            }

            double fit = fitnessFn.evaluate(position);
            if (fit > bestFit) { bestFit = fit; bestPos = position.clone(); }
            return fit;
        }
    }

    // ── Particle Swarm Optimizer ───────────────────────────────────────────
    public static class ParticleSwarmOptimizer {
        private final List<Particle> particles = new ArrayList<>();
        private double[]  globalBest;
        private double    globalFit = Double.NEGATIVE_INFINITY;
        private int       iteration = 0;

        public ParticleSwarmOptimizer(FitnessFunction fn, int dim,
                                      double[][] bounds, int nParticles) {
            for (int i = 0; i < nParticles; i++) {
                double[] pos = new double[dim];
                double[] vel = new double[dim];
                for (int d = 0; d < dim; d++) {
                    if (bounds != null) {
                        pos[d] = bounds[d][0] + rand() * (bounds[d][1] - bounds[d][0]);
                        vel[d] = (rand() - 0.5) * (bounds[d][1] - bounds[d][0]) * PHI_INV;
                    } else {
                        pos[d] = rand();
                        vel[d] = (rand() - 0.5) * PHI_INV;
                    }
                }
                Particle p = new Particle(pos, vel, fn, bounds);
                particles.add(p);
                if (p.bestFit > globalFit) {
                    globalFit  = p.bestFit;
                    globalBest = p.bestPos.clone();
                }
            }
        }

        public Map<String, Object> step() {
            iteration++;
            for (Particle p : particles) {
                double fit = p.step(globalBest);
                if (fit > globalFit) { globalFit = fit; globalBest = p.position.clone(); }
            }
            Map<String, Object> r = new LinkedHashMap<>();
            r.put("iteration", iteration);
            r.put("best",      Arrays.copyOf(globalBest, globalBest.length));
            r.put("fitness",   globalFit);
            return r;
        }

        public Map<String, Object> run(int n) {
            Map<String, Object> last = null;
            for (int i = 0; i < n; i++) last = step();
            return last;
        }
    }

    // ── Pheromone Trail System (ACO) ───────────────────────────────────────
    public static class PheromoneTrailSystem {
        private final Map<String, Double> trails = new HashMap<>();
        private final double              initial;
        private       int                 stepCount = 0;

        public PheromoneTrailSystem(double initial) { this.initial = initial; }

        private String key(String from, String to) { return from + ":" + to; }

        public double getLevel(String from, String to) {
            return trails.getOrDefault(key(from, to), initial);
        }

        public void deposit(List<String> path, double quality) {
            double delta = (quality * PHI) / Math.max(path.size() - 1, 1);
            for (int i = 0; i < path.size() - 1; i++) {
                String k = key(path.get(i), path.get(i + 1));
                trails.put(k, trails.getOrDefault(k, initial) + delta);
            }
        }

        public void evaporate() {
            stepCount++;
            trails.entrySet().removeIf(e -> {
                double next = e.getValue() * (1 - EVAPORATION);
                if (next < 1e-6) return true;
                e.setValue(next);
                return false;
            });
        }

        public String chooseNext(String from, List<String> candidates,
                                 java.util.function.BiFunction<String,String,Double> heuristicFn) {
            double alpha = PHI, beta = PHI_INV;
            double[] weights = new double[candidates.size()];
            for (int i = 0; i < candidates.size(); i++) {
                double ph = Math.pow(getLevel(from, candidates.get(i)), alpha);
                double he = Math.pow(heuristicFn.apply(from, candidates.get(i)), beta);
                weights[i] = ph * he;
            }
            double total = Arrays.stream(weights).sum();
            double r     = rand() * total;
            for (int i = 0; i < weights.length; i++) {
                r -= weights[i];
                if (r <= 0) return candidates.get(i);
            }
            return candidates.get(candidates.size() - 1);
        }

        public Map<String, Object> stats() {
            DoubleSummaryStatistics s = trails.values().stream().mapToDouble(Double::doubleValue).summaryStatistics();
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("trails",    trails.size());
            m.put("evapSteps", stepCount);
            m.put("maxLevel",  s.getCount() > 0 ? s.getMax() : 0);
            m.put("minLevel",  s.getCount() > 0 ? s.getMin() : 0);
            m.put("avgLevel",  s.getCount() > 0 ? s.getAverage() : 0);
            return m;
        }
    }

    // ── Swarm Consensus ────────────────────────────────────────────────────
    public static class SwarmConsensus {
        private final List<String>              options;
        private final Map<String, double[]>     votes   = new LinkedHashMap<>(); // agentId → [optionIdx, confidence]
        private       int                       round   = 0;

        public SwarmConsensus(List<String> options) {
            this.options = new ArrayList<>(options);
        }

        public void vote(String agentId, String option, double confidence) {
            int idx = options.indexOf(option);
            if (idx < 0) throw new IllegalArgumentException("Unknown option: " + option);
            votes.put(agentId, new double[]{ idx, clamp(confidence, 0, 1) });
        }

        public Map<String, Object> tally() {
            round++;
            double[] scores = new double[options.size()];
            for (double[] v : votes.values()) scores[(int) v[0]] += v[1] * PHI;
            double total = Arrays.stream(scores).sum();
            if (total == 0) total = 1;

            List<Map<String, Object>> ranking = new ArrayList<>();
            for (int i = 0; i < options.size(); i++) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("option",     options.get(i));
                m.put("score",      scores[i]);
                m.put("proportion", scores[i] / total);
                ranking.add(m);
            }
            ranking.sort((a, b) -> Double.compare((double)b.get("score"), (double)a.get("score")));

            double winnerScore  = (double) ranking.get(0).get("score");
            double runnerScore  = ranking.size() > 1 ? (double) ranking.get(1).get("score") : 0;
            double certainty    = runnerScore > 0 ? Math.min((winnerScore / runnerScore) * PHI_INV, 1) : 1;

            Map<String, Object> r = new LinkedHashMap<>();
            r.put("consensus",  ranking.get(0).get("option"));
            r.put("certainty",  certainty);
            r.put("round",      round);
            r.put("agentCount", votes.size());
            r.put("ranking",    ranking);
            return r;
        }

        public void reset() { votes.clear(); }
    }

    // ── Demo ───────────────────────────────────────────────────────────────
    public static void main(String[] args) {
        System.out.println("=== PROTO-233 Swarm Intelligence Protocol (Java) ===");

        // PSO: maximise -(x² + y²)  →  optimum at (0,0) with fitness 0
        double[][] bounds = {{ -5, 5 }, { -5, 5 }};
        ParticleSwarmOptimizer pso = new ParticleSwarmOptimizer(
            pos -> -(pos[0]*pos[0] + pos[1]*pos[1]),
            2, bounds, 34
        );
        Map<String, Object> psoResult = pso.run(55);
        System.out.println("PSO result: " + psoResult);

        // ACO: pheromone trail demo
        PheromoneTrailSystem aco = new PheromoneTrailSystem(PHI_INV);
        aco.deposit(List.of("A","B","C","D"), 1.0);
        System.out.println("Pheromone A→B: " + String.format("%.4f", aco.getLevel("A","B")));
        aco.evaporate();
        System.out.println("After evaporation A→B: " + String.format("%.4f", aco.getLevel("A","B")));
        System.out.println("Pheromone stats: " + aco.stats());

        // Consensus
        SwarmConsensus consensus = new SwarmConsensus(List.of("route-alpha","route-beta","route-gamma"));
        consensus.vote("agent-1", "route-alpha", 0.9);
        consensus.vote("agent-2", "route-alpha", 0.7);
        consensus.vote("agent-3", "route-beta",  0.5);
        System.out.println("Consensus: " + consensus.tally());
    }
}
