package com.medinatech.mmims.protocols;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * PROTO-231 — Quantum Coherence Protocol (Java)
 * Quantum-inspired cognitive processing for MMIMS-X.
 *
 * Charter: PROTO-231
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
 */
public class QuantumCoherenceProtocol {

    // ── Constants ──────────────────────────────────────────────────────────
    public static final double PHI     = (1 + Math.sqrt(5)) / 2.0;
    public static final double PHI_INV = 1.0 / PHI;
    public static final double PHI_SQ  = PHI * PHI;

    // ── Complex Number ─────────────────────────────────────────────────────
    public static class Complex {
        public final double re, im;

        public Complex(double re, double im) { this.re = re; this.im = im; }

        public Complex add(Complex o)  { return new Complex(re + o.re, im + o.im); }
        public Complex sub(Complex o)  { return new Complex(re - o.re, im - o.im); }
        public Complex mul(Complex o)  {
            return new Complex(re * o.re - im * o.im, re * o.im + im * o.re);
        }
        public Complex scale(double s) { return new Complex(re * s, im * s); }
        public Complex conj()          { return new Complex(re, -im); }
        public double  norm2()         { return re * re + im * im; }
        public double  norm()          { return Math.sqrt(norm2()); }

        /** e^(iθ) */
        public static Complex phase(double theta) {
            return new Complex(Math.cos(theta), Math.sin(theta));
        }

        @Override public String toString() {
            return String.format("(%.4f+%.4fi)", re, im);
        }
    }

    // ── Quantum Cognitive State ────────────────────────────────────────────
    public static class QuantumCognitiveState {
        public final String[] options;
        public       Complex[] amplitudes;
        public       boolean   collapsed;
        public       MeasurementResult result;
        private final Random rng = new Random();

        public QuantumCognitiveState(String[] options) {
            this.options    = options.clone();
            this.amplitudes = uniform(options.length);
            this.collapsed  = false;
        }

        public QuantumCognitiveState(String[] options, Complex[] amplitudes) {
            this.options    = options.clone();
            this.amplitudes = normalise(amplitudes.clone());
            this.collapsed  = false;
        }

        private Complex[] uniform(int n) {
            Complex[] amps = new Complex[n];
            double scale   = 1.0 / Math.sqrt(n);
            for (int i = 0; i < n; i++) {
                double theta = (2 * Math.PI * i * PHI_INV) % (2 * Math.PI);
                amps[i] = Complex.phase(theta).scale(scale);
            }
            return normalise(amps);
        }

        private Complex[] normalise(Complex[] amps) {
            double total = 0;
            for (Complex a : amps) total += a.norm2();
            double inv = 1.0 / Math.sqrt(total == 0 ? 1 : total);
            Complex[] out = new Complex[amps.length];
            for (int i = 0; i < amps.length; i++) out[i] = amps[i].scale(inv);
            return out;
        }

        public double[] probabilities() {
            double[] p = new double[amplitudes.length];
            for (int i = 0; i < amplitudes.length; i++) p[i] = amplitudes[i].norm2();
            return p;
        }

        public QuantumCognitiveState applyPhase(int index, double theta) {
            if (collapsed) throw new IllegalStateException("State already collapsed");
            Complex[] amps  = amplitudes.clone();
            amps[index]     = amps[index].mul(Complex.phase(theta));
            this.amplitudes = normalise(amps);
            return this;
        }

        public MeasurementResult measure() {
            if (collapsed) return result;
            double[] probs = probabilities();
            double   r     = rng.nextDouble();
            double   cumul = 0;
            int      chosen = options.length - 1;
            for (int i = 0; i < options.length; i++) {
                cumul += probs[i];
                if (r <= cumul) { chosen = i; break; }
            }
            collapsed = true;
            result    = new MeasurementResult(options[chosen], chosen, probs[chosen]);
            return result;
        }

        public double expectation(double[] utilities) {
            double[] probs = probabilities();
            double   e     = 0;
            for (int i = 0; i < probs.length; i++) e += probs[i] * utilities[i];
            return e;
        }
    }

    // ── Measurement Result ─────────────────────────────────────────────────
    public static class MeasurementResult {
        public final String option;
        public final int    index;
        public final double probability;
        public MeasurementResult(String option, int index, double probability) {
            this.option = option; this.index = index; this.probability = probability;
        }
    }

    // ── Quantum Decision Engine ────────────────────────────────────────────
    public static class QuantumDecisionEngine {
        private final String[]  options;
        private final double[]  utilities;
        private final List<Map<String,Object>> history = new ArrayList<>();

        public QuantumDecisionEngine(String[] options, double[] utilities) {
            if (options.length != utilities.length)
                throw new IllegalArgumentException("options/utilities length mismatch");
            this.options   = options.clone();
            this.utilities = utilities.clone();
        }

        public Map<String, Object> decide() {
            QuantumCognitiveState state = new QuantumCognitiveState(options);
            double maxU = Arrays.stream(utilities).max().orElse(1e-9);
            for (int i = 0; i < options.length; i++) {
                double theta = (utilities[i] / maxU) * Math.PI * PHI_INV;
                state.applyPhase(i, theta);
            }
            double           expectedUtil = state.expectation(utilities);
            MeasurementResult res          = state.measure();

            Map<String, Object> decision = new LinkedHashMap<>();
            decision.put("option",       res.option);
            decision.put("index",        res.index);
            decision.put("probability",  res.probability);
            decision.put("utility",      utilities[res.index]);
            decision.put("expectedUtil", expectedUtil);
            decision.put("phiCoherence", String.format("%.4f", res.probability * PHI));
            decision.put("timestamp",    Instant.now().toEpochMilli());
            history.add(decision);
            return decision;
        }

        public Map<String, Object> classicalOptimum() {
            int    best = 0;
            double bestU = utilities[0];
            for (int i = 1; i < utilities.length; i++) {
                if (utilities[i] > bestU) { bestU = utilities[i]; best = i; }
            }
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("option",  options[best]);
            result.put("utility", bestU);
            return result;
        }

        public List<Map<String,Object>> getHistory() { return Collections.unmodifiableList(history); }
    }

    // ── Quantum Memory Cell ────────────────────────────────────────────────
    public static class QuantumMemoryCell {
        public final String label;
        private QuantumCognitiveState state;
        private int writeCount = 0, readCount = 0;
        private final List<MeasurementResult> collapseHistory = new ArrayList<>();

        public QuantumMemoryCell(String label, String[] interpretations) {
            this.label = label;
            this.state = new QuantumCognitiveState(interpretations);
        }

        public void write(String[] interpretations) {
            this.state = new QuantumCognitiveState(interpretations);
            writeCount++;
        }

        public List<Map<String, Object>> peek() {
            double[] probs = state.probabilities();
            List<Map<String, Object>> out = new ArrayList<>();
            for (int i = 0; i < state.options.length; i++) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("interpretation", state.options[i]);
                m.put("probability",    probs[i]);
                out.add(m);
            }
            return out;
        }

        public MeasurementResult read() {
            MeasurementResult r = state.measure();
            readCount++;
            collapseHistory.add(r);
            return r;
        }

        public double coherenceScore() {
            double[] probs = state.probabilities();
            double   H     = 0;
            for (double p : probs) if (p > 0) H -= p * (Math.log(p) / Math.log(2));
            return Math.max(0, 1 - H / (Math.log(state.options.length) / Math.log(2)));
        }

        public int getWriteCount() { return writeCount; }
        public int getReadCount()  { return readCount; }
    }

    // ── Quick demo ─────────────────────────────────────────────────────────
    public static void main(String[] args) {
        String[] options   = { "expand-memory", "compress-context", "delegate-agent", "prune-graph" };
        double[] utilities = { 0.9, 0.6, 1.0, 0.4 };
        QuantumDecisionEngine engine = new QuantumDecisionEngine(options, utilities);

        System.out.println("=== PROTO-231 Quantum Coherence Protocol (Java) ===");
        System.out.println("Classical optimum: " + engine.classicalOptimum());
        for (int i = 0; i < 5; i++) {
            Map<String, Object> d = engine.decide();
            System.out.println("Quantum decision: " + d.get("option")
                + " (p=" + String.format("%.3f", d.get("probability")) + ")");
        }

        QuantumMemoryCell cell = new QuantumMemoryCell("context-cell",
            new String[]{ "episodic", "semantic", "procedural", "working" });
        System.out.println("\nMemory cell coherence: " + String.format("%.4f", cell.coherenceScore()));
        System.out.println("Peek: " + cell.peek());
        System.out.println("Read (collapse): " + cell.read().option);
    }
}
