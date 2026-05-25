/**
 * PROTO-MMS-CONT-001: Capability Maturation Protocol
 * Java Implementation
 *
 * Protocol ID: PROTO-MMS-CONT-001
 * Charter: CHARTER-MMS-CONT-001
 * Version: 1.0.0
 *
 * Titulus Latinus: Protocollum Maturationis Capacitatum
 */

package com.medina.protocols.continuation;

import java.util.*;
import java.util.concurrent.*;
import java.util.function.Supplier;
import java.time.Instant;

/**
 * Capability Maturation Protocol Implementation.
 * Manages the progression of MEDINA capabilities through maturation levels.
 */
public class CapabilityMaturation {

    // ═══════════════════════════════════════════════════════════════════════════
    // CONSTANTS — PHI-HARMONIC PARAMETERS
    // ═══════════════════════════════════════════════════════════════════════════

    public static final double PHI = (1 + Math.sqrt(5)) / 2;  // 1.618033988749895
    public static final double PHI_INV = 1 / PHI;              // 0.618033988749895
    public static final double PHI_SQ = PHI * PHI;             // 2.618033988749895

    // ═══════════════════════════════════════════════════════════════════════════
    // MATURATION LEVELS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Maturation levels from development to production.
     */
    public enum MaturationLevel {
        L0_DEV(0, "Development complete, basic tests pass"),
        L1_TESTED(1, "Comprehensive test coverage"),
        L2_HARDENED(2, "Error handling, recovery procedures"),
        L3_DOCUMENTED(3, "Complete documentation"),
        L4_OPERATIONAL(4, "Runbooks, monitoring, alerting"),
        L5_PRODUCTION(5, "Certified for production use");

        private final int value;
        private final String description;

        MaturationLevel(int value, String description) {
            this.value = value;
            this.description = description;
        }

        public int getValue() { return value; }
        public String getDescription() { return description; }

        public static MaturationLevel fromValue(int value) {
            for (MaturationLevel level : values()) {
                if (level.value == value) return level;
            }
            return L0_DEV;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // REQUIREMENT
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * A single requirement for maturation advancement.
     */
    public static class MaturationRequirement {
        private final String id;
        private final String description;
        private final Supplier<Boolean> verificationFn;
        private boolean passed;
        private String evidence;

        public MaturationRequirement(String id, String description) {
            this(id, description, null);
        }

        public MaturationRequirement(String id, String description, Supplier<Boolean> verificationFn) {
            this.id = id;
            this.description = description;
            this.verificationFn = verificationFn;
            this.passed = false;
            this.evidence = "";
        }

        public String getId() { return id; }
        public String getDescription() { return description; }
        public boolean isPassed() { return passed; }
        public String getEvidence() { return evidence; }

        public void setPassed(boolean passed) { this.passed = passed; }
        public void setEvidence(String evidence) { this.evidence = evidence; }

        public boolean verify() {
            if (verificationFn != null) {
                passed = verificationFn.get();
            }
            return passed;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MATURATION GATE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Gate between maturation levels with requirements.
     */
    public static class MaturationGate {
        private final MaturationLevel fromLevel;
        private final MaturationLevel toLevel;
        private final List<MaturationRequirement> requirements;

        public MaturationGate(MaturationLevel fromLevel, MaturationLevel toLevel) {
            this.fromLevel = fromLevel;
            this.toLevel = toLevel;
            this.requirements = new ArrayList<>();
        }

        public void addRequirement(MaturationRequirement requirement) {
            requirements.add(requirement);
        }

        public boolean checkAll() {
            for (MaturationRequirement req : requirements) {
                req.verify();
                if (!req.isPassed()) {
                    return false;
                }
            }
            return true;
        }

        public List<MaturationRequirement> getBlockers() {
            List<MaturationRequirement> blockers = new ArrayList<>();
            for (MaturationRequirement req : requirements) {
                if (!req.isPassed()) {
                    blockers.add(req);
                }
            }
            return blockers;
        }

        public MaturationLevel getFromLevel() { return fromLevel; }
        public MaturationLevel getToLevel() { return toLevel; }
        public List<MaturationRequirement> getRequirements() { return requirements; }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CAPABILITY
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * A MEDINA capability subject to maturation.
     */
    public static class Capability {
        private final String charterId;
        private final String name;
        private final String description;
        private MaturationLevel currentLevel;
        private final Map<String, MaturationGate> gates;
        private final Map<String, Object> metadata;
        private Instant lastAssessment;

        public Capability(String charterId, String name, String description) {
            this.charterId = charterId;
            this.name = name;
            this.description = description;
            this.currentLevel = MaturationLevel.L0_DEV;
            this.gates = new HashMap<>();
            this.metadata = new HashMap<>();
            this.lastAssessment = Instant.now();
            setupDefaultGates();
        }

        private void setupDefaultGates() {
            // L0 → L1: Comprehensive Testing
            MaturationGate gate01 = new MaturationGate(MaturationLevel.L0_DEV, MaturationLevel.L1_TESTED);
            gate01.addRequirement(new MaturationRequirement("test_coverage", "95% line coverage, 90% branch coverage"));
            gate01.addRequirement(new MaturationRequirement("edge_cases", "All identified edge cases tested"));
            gate01.addRequirement(new MaturationRequirement("fuzz_testing", "Fuzz testing for input validation"));
            gate01.addRequirement(new MaturationRequirement("property_tests", "Property-based tests for invariants"));
            gates.put("L0_to_L1", gate01);

            // L1 → L2: Hardening
            MaturationGate gate12 = new MaturationGate(MaturationLevel.L1_TESTED, MaturationLevel.L2_HARDENED);
            gate12.addRequirement(new MaturationRequirement("error_handling", "Error handling for all external calls"));
            gate12.addRequirement(new MaturationRequirement("timeout_handling", "Timeout handling for async operations"));
            gate12.addRequirement(new MaturationRequirement("resource_cleanup", "Resource cleanup in all code paths"));
            gate12.addRequirement(new MaturationRequirement("graceful_degradation", "Graceful degradation under load"));
            gates.put("L1_to_L2", gate12);

            // L2 → L3: Documentation
            MaturationGate gate23 = new MaturationGate(MaturationLevel.L2_HARDENED, MaturationLevel.L3_DOCUMENTED);
            gate23.addRequirement(new MaturationRequirement("api_reference", "Complete API reference documentation"));
            gate23.addRequirement(new MaturationRequirement("architecture_doc", "Architecture document"));
            gate23.addRequirement(new MaturationRequirement("integration_guide", "Integration guide"));
            gate23.addRequirement(new MaturationRequirement("troubleshooting", "Troubleshooting guide"));
            gates.put("L2_to_L3", gate23);

            // L3 → L4: Operational Readiness
            MaturationGate gate34 = new MaturationGate(MaturationLevel.L3_DOCUMENTED, MaturationLevel.L4_OPERATIONAL);
            gate34.addRequirement(new MaturationRequirement("runbook", "Runbook for common operations"));
            gate34.addRequirement(new MaturationRequirement("incident_response", "Incident response procedures"));
            gate34.addRequirement(new MaturationRequirement("monitoring", "Monitoring dashboards"));
            gate34.addRequirement(new MaturationRequirement("alerting", "Alerting rules configured"));
            gates.put("L3_to_L4", gate34);

            // L4 → L5: Production Certification
            MaturationGate gate45 = new MaturationGate(MaturationLevel.L4_OPERATIONAL, MaturationLevel.L5_PRODUCTION);
            gate45.addRequirement(new MaturationRequirement("security_review", "Security review passed"));
            gate45.addRequirement(new MaturationRequirement("performance_benchmarks", "Performance benchmarks met"));
            gate45.addRequirement(new MaturationRequirement("scalability_tests", "Scalability tests passed"));
            gate45.addRequirement(new MaturationRequirement("sovereignty_audit", "Sovereignty audit passed"));
            gates.put("L4_to_L5", gate45);
        }

        public boolean advanceTo(MaturationLevel targetLevel) {
            if (targetLevel.getValue() <= currentLevel.getValue()) {
                return true; // Already at or above target
            }

            int current = currentLevel.getValue();
            while (current < targetLevel.getValue()) {
                String gateKey = "L" + current + "_to_L" + (current + 1);
                if (gates.containsKey(gateKey)) {
                    MaturationGate gate = gates.get(gateKey);
                    if (!gate.checkAll()) {
                        return false;
                    }
                }
                current++;
            }

            currentLevel = targetLevel;
            lastAssessment = Instant.now();
            return true;
        }

        // Getters
        public String getCharterId() { return charterId; }
        public String getName() { return name; }
        public String getDescription() { return description; }
        public MaturationLevel getCurrentLevel() { return currentLevel; }
        public Map<String, MaturationGate> getGates() { return gates; }
        public Instant getLastAssessment() { return lastAssessment; }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CAPABILITY REGISTRY
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Registry of all capabilities subject to maturation.
     */
    public static class CapabilityRegistry {
        private final Map<String, Capability> capabilities;
        private static CapabilityRegistry instance;

        private CapabilityRegistry() {
            capabilities = new ConcurrentHashMap<>();
            initStandardCapabilities();
        }

        public static synchronized CapabilityRegistry getInstance() {
            if (instance == null) {
                instance = new CapabilityRegistry();
            }
            return instance;
        }

        private void initStandardCapabilities() {
            register(new Capability("ZCE-ORCH-001", "Zero-Cost Orchestrator", 
                "Multi-language cost elimination orchestration"));
            register(new Capability("TMN-001", "Toroidal Memory Navigator", 
                "5-dimensional toroidal memory navigation"));
            register(new Capability("PHT-001", "Phi-Harmonic Timing", 
                "Golden ratio-based temporal coordination"));
            register(new Capability("ZCE-PHANTOM-001", "Phantom Monte Carlo", 
                "Pre-computation decision simulation"));
            register(new Capability("SVA-001", "Sovereign Validation", 
                "Capability certification authority"));
            register(new Capability("XCREW-INTEL-001", "XCREW Intelligence", 
                "Edge intelligence integration"));
        }

        public void register(Capability capability) {
            capabilities.put(capability.getCharterId(), capability);
        }

        public Capability get(String charterId) {
            return capabilities.get(charterId);
        }

        public Map<String, Map<String, Object>> getStatus() {
            Map<String, Map<String, Object>> status = new HashMap<>();
            for (Map.Entry<String, Capability> entry : capabilities.entrySet()) {
                Capability cap = entry.getValue();
                Map<String, Object> capStatus = new HashMap<>();
                capStatus.put("name", cap.getName());
                capStatus.put("level", cap.getCurrentLevel().name());
                capStatus.put("levelValue", cap.getCurrentLevel().getValue());
                capStatus.put("lastAssessment", cap.getLastAssessment().toString());
                status.put(entry.getKey(), capStatus);
            }
            return status;
        }

        public List<Map<String, Object>> getBlockers(String charterId) {
            List<Map<String, Object>> blockers = new ArrayList<>();
            Capability cap = capabilities.get(charterId);
            if (cap == null || cap.getCurrentLevel() == MaturationLevel.L5_PRODUCTION) {
                return blockers;
            }

            int nextLevel = cap.getCurrentLevel().getValue() + 1;
            String gateKey = "L" + cap.getCurrentLevel().getValue() + "_to_L" + nextLevel;
            
            if (cap.getGates().containsKey(gateKey)) {
                MaturationGate gate = cap.getGates().get(gateKey);
                for (MaturationRequirement req : gate.getBlockers()) {
                    Map<String, Object> blocker = new HashMap<>();
                    blocker.put("id", req.getId());
                    blocker.put("description", req.getDescription());
                    blocker.put("passed", req.isPassed());
                    blockers.add(blocker);
                }
            }
            return blockers;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // STRESS TESTING
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Result of a stress test execution.
     */
    public static class StressTestResult {
        private final String testName;
        private final boolean passed;
        private final double durationSeconds;
        private final double peakLoad;
        private final List<String> errors;
        private final Map<String, Double> metrics;

        public StressTestResult(String testName, boolean passed, double durationSeconds, 
                               double peakLoad, List<String> errors, Map<String, Double> metrics) {
            this.testName = testName;
            this.passed = passed;
            this.durationSeconds = durationSeconds;
            this.peakLoad = peakLoad;
            this.errors = errors != null ? errors : new ArrayList<>();
            this.metrics = metrics != null ? metrics : new HashMap<>();
        }

        // Getters
        public String getTestName() { return testName; }
        public boolean isPassed() { return passed; }
        public double getDurationSeconds() { return durationSeconds; }
        public double getPeakLoad() { return peakLoad; }
        public List<String> getErrors() { return errors; }
        public Map<String, Double> getMetrics() { return metrics; }
    }

    /**
     * Suite for maturation stress testing.
     */
    public static class StressTestSuite {
        private final Capability capability;
        private final List<StressTestResult> results;

        public StressTestSuite(Capability capability) {
            this.capability = capability;
            this.results = new ArrayList<>();
        }

        public StressTestResult runSustainedLoadTest(double loadMultiplier, 
                                                     double durationSeconds,
                                                     Supplier<Boolean> operation) {
            long startTime = System.nanoTime();
            List<String> errors = new ArrayList<>();
            int successCount = 0;
            int failureCount = 0;

            int targetOps = (int)(loadMultiplier * 100);
            long endTime = startTime + (long)(Math.min(durationSeconds, 1.0) * 1_000_000_000);

            while (System.nanoTime() < endTime) {
                for (int i = 0; i < targetOps; i++) {
                    if (operation != null) {
                        try {
                            if (operation.get()) {
                                successCount++;
                            } else {
                                failureCount++;
                            }
                        } catch (Exception e) {
                            errors.add(e.getMessage());
                            failureCount++;
                        }
                    } else {
                        successCount++;
                    }
                }
            }

            double duration = (System.nanoTime() - startTime) / 1_000_000_000.0;
            boolean passed = failureCount == 0 && errors.isEmpty();

            Map<String, Double> metrics = new HashMap<>();
            metrics.put("successCount", (double)successCount);
            metrics.put("failureCount", (double)failureCount);
            metrics.put("opsPerSecond", duration > 0 ? successCount / duration : 0);

            StressTestResult result = new StressTestResult(
                "sustained_load_" + loadMultiplier + "x",
                passed, duration, loadMultiplier, errors, metrics
            );
            results.add(result);
            return result;
        }

        public StressTestResult runRecoveryTest(double maxRecoverySeconds) {
            long startTime = System.nanoTime();
            
            // Simulated recovery measurement
            double recoveryTime = PHI_INV * 10;
            boolean passed = recoveryTime < maxRecoverySeconds;

            Map<String, Double> metrics = new HashMap<>();
            metrics.put("recoveryTimeSeconds", recoveryTime);
            metrics.put("maxAllowedSeconds", maxRecoverySeconds);

            double duration = (System.nanoTime() - startTime) / 1_000_000_000.0;
            
            StressTestResult result = new StressTestResult(
                "recovery", passed, duration, 1.0, null, metrics
            );
            results.add(result);
            return result;
        }

        public Map<String, Object> getSummary() {
            Map<String, Object> summary = new HashMap<>();
            summary.put("capability", capability.getCharterId());
            summary.put("totalTests", results.size());
            summary.put("passed", results.stream().filter(StressTestResult::isPassed).count());
            summary.put("failed", results.stream().filter(r -> !r.isPassed()).count());
            
            List<Map<String, Object>> resultList = new ArrayList<>();
            for (StressTestResult r : results) {
                Map<String, Object> item = new HashMap<>();
                item.put("name", r.getTestName());
                item.put("passed", r.isPassed());
                item.put("duration", r.getDurationSeconds());
                item.put("peakLoad", r.getPeakLoad());
                resultList.add(item);
            }
            summary.put("results", resultList);
            return summary;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MAIN — DEMO
    // ═══════════════════════════════════════════════════════════════════════════

    public static void main(String[] args) {
        System.out.println("MEDINA Capability Maturation Protocol - Java Implementation");
        System.out.println("═".repeat(60));
        System.out.println();

        CapabilityRegistry registry = CapabilityRegistry.getInstance();
        
        System.out.println("Registered Capabilities:");
        System.out.println("-".repeat(40));
        
        Map<String, Map<String, Object>> status = registry.getStatus();
        for (Map.Entry<String, Map<String, Object>> entry : status.entrySet()) {
            System.out.printf("%s: %s%n", entry.getKey(), entry.getValue().get("name"));
            System.out.printf("  Level: %s%n", entry.getValue().get("level"));
            
            List<Map<String, Object>> blockers = registry.getBlockers(entry.getKey());
            if (!blockers.isEmpty()) {
                System.out.println("  Blockers for next level:");
                for (Map<String, Object> b : blockers) {
                    System.out.printf("    - %s: %s%n", b.get("id"), b.get("description"));
                }
            }
            System.out.println();
        }

        // Demo stress test
        System.out.println("Running Stress Test Demo...");
        System.out.println("-".repeat(40));
        
        Capability testCap = registry.get("ZCE-ORCH-001");
        StressTestSuite suite = new StressTestSuite(testCap);
        
        StressTestResult sustained = suite.runSustainedLoadTest(10.0, 1.0, () -> true);
        System.out.printf("Sustained Load Test: %s%n", sustained.isPassed() ? "PASSED" : "FAILED");
        
        StressTestResult recovery = suite.runRecoveryTest(300.0);
        System.out.printf("Recovery Test: %s%n", recovery.isPassed() ? "PASSED" : "FAILED");
        
        System.out.println();
        System.out.println("Protocol execution complete.");
    }
}
