/**
 * PROTO-XCREW-CONT-001: Edge Hardening Protocol
 * Java Implementation
 *
 * Protocol ID: PROTO-XCREW-CONT-001
 * Charter: CHARTER-XCREW-CONT-001
 * Version: 1.0.0
 *
 * Titulus Latinus: Protocollum Indurationis Marginis
 */

package com.medina.protocols.continuation;

import java.util.*;
import java.util.concurrent.*;
import java.io.*;
import java.nio.file.*;
import java.security.MessageDigest;
import java.time.Instant;

/**
 * Edge Hardening Protocol Implementation.
 * Prepares XCREW for production edge deployments.
 */
public class EdgeHardening {

    // ═══════════════════════════════════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════════════════════════════════

    public static final double PHI = (1 + Math.sqrt(5)) / 2;
    public static final double PHI_INV = 1 / PHI;

    // ═══════════════════════════════════════════════════════════════════════════
    // POWER MODES
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Power consumption modes for edge devices.
     */
    public enum PowerMode {
        FULL("All features, maximum intelligence"),
        BALANCED("Core features, reduced polling"),
        SAVER("Essential only, extended intervals"),
        CRITICAL("Minimal operation, state preservation");

        private final String description;

        PowerMode(String description) {
            this.description = description;
        }

        public String getDescription() { return description; }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // THERMAL THRESHOLDS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Thermal threshold levels.
     */
    public enum ThermalThreshold {
        NORMAL(0, 60.0, "Operating normally"),
        WARM(1, 70.0, "Elevated temperature"),
        HOT(2, 80.0, "High temperature - throttling"),
        CRITICAL(3, 90.0, "Critical - minimal operation"),
        EMERGENCY(4, 100.0, "Emergency shutdown required");

        private final int level;
        private final double maxTempC;
        private final String description;

        ThermalThreshold(int level, double maxTempC, String description) {
            this.level = level;
            this.maxTempC = maxTempC;
            this.description = description;
        }

        public int getLevel() { return level; }
        public double getMaxTempC() { return maxTempC; }
        public String getDescription() { return description; }

        public static ThermalThreshold fromTemperature(double tempC) {
            if (tempC < 60) return NORMAL;
            if (tempC < 70) return WARM;
            if (tempC < 80) return HOT;
            if (tempC < 90) return CRITICAL;
            return EMERGENCY;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // RESOURCE BUDGET
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Resource allocation budget for edge operation.
     */
    public static class ResourceBudget {
        private final double totalMemoryMb;
        private final double reservedMemoryMb;
        private double intelligenceMemoryMb;
        private double cacheMemoryMb;
        private double bufferMemoryMb;

        public ResourceBudget(double totalMemoryMb, double reservedMemoryMb,
                            double intelligenceMemoryMb, double cacheMemoryMb,
                            double bufferMemoryMb) {
            this.totalMemoryMb = totalMemoryMb;
            this.reservedMemoryMb = reservedMemoryMb;
            this.intelligenceMemoryMb = intelligenceMemoryMb;
            this.cacheMemoryMb = cacheMemoryMb;
            this.bufferMemoryMb = bufferMemoryMb;
        }

        public double getAvailableMemoryMb() {
            return totalMemoryMb - reservedMemoryMb;
        }

        public boolean canAllocate(double requiredMb) {
            double used = intelligenceMemoryMb + cacheMemoryMb + bufferMemoryMb;
            return (used + requiredMb) <= getAvailableMemoryMb();
        }

        // Getters and setters
        public double getTotalMemoryMb() { return totalMemoryMb; }
        public double getReservedMemoryMb() { return reservedMemoryMb; }
        public double getIntelligenceMemoryMb() { return intelligenceMemoryMb; }
        public double getCacheMemoryMb() { return cacheMemoryMb; }
        public double getBufferMemoryMb() { return bufferMemoryMb; }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FEATURE TIER
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * A feature with its resource requirements and priority.
     */
    public static class FeatureTier {
        private final String name;
        private final double memoryMb;
        private final int priority; // 0 = essential, higher = more optional
        private boolean enabled;

        public FeatureTier(String name, double memoryMb, int priority) {
            this.name = name;
            this.memoryMb = memoryMb;
            this.priority = priority;
            this.enabled = true;
        }

        public String getName() { return name; }
        public double getMemoryMb() { return memoryMb; }
        public int getPriority() { return priority; }
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FEATURE MANAGER
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Manages feature enablement based on resource constraints.
     */
    public static class FeatureManager {
        private final List<FeatureTier> tiers;

        public FeatureManager() {
            tiers = new ArrayList<>();
            tiers.add(new FeatureTier("core", 10, 0));
            tiers.add(new FeatureTier("toroidal", 40, 1));
            tiers.add(new FeatureTier("temporal", 20, 2));
            tiers.add(new FeatureTier("swarm", 30, 2));
            tiers.add(new FeatureTier("quantum", 50, 3));
        }

        /**
         * Determine which features to enable given available memory.
         */
        public List<String> shedFeatures(double availableMemoryMb) {
            // Sort by priority (keep essential first)
            List<FeatureTier> sorted = new ArrayList<>(tiers);
            sorted.sort(Comparator.comparingInt(FeatureTier::getPriority));

            double remaining = availableMemoryMb;
            List<String> enabled = new ArrayList<>();

            for (FeatureTier tier : sorted) {
                if (remaining >= tier.getMemoryMb()) {
                    tier.setEnabled(true);
                    enabled.add(tier.getName());
                    remaining -= tier.getMemoryMb();
                } else {
                    tier.setEnabled(false);
                }
            }

            return enabled;
        }

        public List<String> getEnabledFeatures() {
            List<String> enabled = new ArrayList<>();
            for (FeatureTier tier : tiers) {
                if (tier.isEnabled()) {
                    enabled.add(tier.getName());
                }
            }
            return enabled;
        }

        public double getTotalMemoryRequired() {
            return tiers.stream().mapToDouble(FeatureTier::getMemoryMb).sum();
        }

        public double getEnabledMemory() {
            return tiers.stream()
                       .filter(FeatureTier::isEnabled)
                       .mapToDouble(FeatureTier::getMemoryMb)
                       .sum();
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EDGE STATE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Persistent state for edge node.
     */
    public static class EdgeState implements Serializable {
        private static final long serialVersionUID = 1L;
        
        private String version;
        private long timestamp;
        private String nodeId;
        private Map<String, Object> memoryState;
        private Map<String, Map<String, Object>> protocolStates;
        private List<QueuedDecision> pendingDecisions;
        private String checksum;

        public EdgeState(String version, String nodeId) {
            this.version = version;
            this.timestamp = System.currentTimeMillis();
            this.nodeId = nodeId;
            this.memoryState = new HashMap<>();
            this.protocolStates = new HashMap<>();
            this.pendingDecisions = new ArrayList<>();
            this.checksum = "";
        }

        public String computeChecksum() {
            try {
                String stateStr = version + timestamp + nodeId + 
                                 memoryState.toString() + protocolStates.toString();
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hash = md.digest(stateStr.getBytes());
                StringBuilder hexString = new StringBuilder();
                for (byte b : hash) {
                    hexString.append(String.format("%02x", b));
                }
                return hexString.toString();
            } catch (Exception e) {
                return "";
            }
        }

        public boolean verifyIntegrity() {
            return checksum.equals(computeChecksum());
        }

        // Getters and setters
        public String getVersion() { return version; }
        public long getTimestamp() { return timestamp; }
        public String getNodeId() { return nodeId; }
        public String getChecksum() { return checksum; }
        public void setChecksum(String checksum) { this.checksum = checksum; }
        public List<QueuedDecision> getPendingDecisions() { return pendingDecisions; }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // QUEUED DECISION
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * A decision queued during offline operation.
     */
    public static class QueuedDecision implements Serializable {
        private static final long serialVersionUID = 1L;
        
        private final String id;
        private final long timestamp;
        private final String decisionType;
        private final Map<String, Object> context;
        private Object result;
        private boolean synced;

        public QueuedDecision(String id, String decisionType, Map<String, Object> context) {
            this.id = id;
            this.timestamp = System.currentTimeMillis();
            this.decisionType = decisionType;
            this.context = context;
            this.result = null;
            this.synced = false;
        }

        public String getId() { return id; }
        public long getTimestamp() { return timestamp; }
        public String getDecisionType() { return decisionType; }
        public Map<String, Object> getContext() { return context; }
        public Object getResult() { return result; }
        public boolean isSynced() { return synced; }
        
        public void setResult(Object result) { this.result = result; }
        public void setSynced(boolean synced) { this.synced = synced; }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // OFFLINE QUEUE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Queue for decisions made during offline operation.
     */
    public static class OfflineQueue {
        private final int maxSize;
        private final List<QueuedDecision> queue;
        private final Object lock = new Object();

        public OfflineQueue(int maxSize) {
            this.maxSize = maxSize;
            this.queue = new ArrayList<>();
        }

        public boolean enqueue(QueuedDecision decision) {
            synchronized (lock) {
                if (queue.size() >= maxSize) {
                    // Remove oldest synced decisions
                    queue.removeIf(QueuedDecision::isSynced);
                    if (queue.size() >= maxSize) {
                        queue.subList(0, maxSize / 2).clear();
                    }
                }
                queue.add(decision);
                return true;
            }
        }

        public List<QueuedDecision> getPending() {
            synchronized (lock) {
                List<QueuedDecision> pending = new ArrayList<>();
                for (QueuedDecision d : queue) {
                    if (!d.isSynced()) {
                        pending.add(d);
                    }
                }
                return pending;
            }
        }

        public void markSynced(List<String> decisionIds) {
            synchronized (lock) {
                for (QueuedDecision d : queue) {
                    if (decisionIds.contains(d.getId())) {
                        d.setSynced(true);
                    }
                }
            }
        }

        public int clearSynced() {
            synchronized (lock) {
                int original = queue.size();
                queue.removeIf(QueuedDecision::isSynced);
                return original - queue.size();
            }
        }

        public int size() {
            synchronized (lock) {
                return queue.size();
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NETWORK MONITOR
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Monitors network connectivity status.
     */
    public static class NetworkMonitor {
        private boolean connected;
        private long lastCheck;
        private int consecutiveFailures;

        public NetworkMonitor() {
            this.connected = true;
            this.lastCheck = System.currentTimeMillis();
            this.consecutiveFailures = 0;
        }

        public boolean checkConnectivity(long timeoutMs) {
            lastCheck = System.currentTimeMillis();
            // In real implementation, would ping endpoint
            connected = true; // Simulated
            if (connected) {
                consecutiveFailures = 0;
            } else {
                consecutiveFailures++;
            }
            return connected;
        }

        public boolean isConnected() { return connected; }
        public long getLastCheck() { return lastCheck; }
        public int getConsecutiveFailures() { return consecutiveFailures; }

        public Map<String, Object> getStatus() {
            Map<String, Object> status = new HashMap<>();
            status.put("connected", connected);
            status.put("lastCheck", lastCheck);
            status.put("consecutiveFailures", consecutiveFailures);
            return status;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // THERMAL MANAGER
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Manages thermal throttling for edge devices.
     */
    public static class ThermalManager {
        private double currentTempC;
        private ThermalThreshold currentThreshold;

        public ThermalManager() {
            this.currentTempC = 45.0;
            this.currentThreshold = ThermalThreshold.NORMAL;
        }

        public ThermalThreshold updateTemperature(double tempC) {
            this.currentTempC = tempC;
            this.currentThreshold = ThermalThreshold.fromTemperature(tempC);
            return currentThreshold;
        }

        public boolean shouldShutdown() {
            return currentThreshold == ThermalThreshold.EMERGENCY;
        }

        public double getMaxCpuPercent() {
            switch (currentThreshold) {
                case NORMAL: return 100.0;
                case WARM: return 80.0;
                case HOT: return 50.0;
                case CRITICAL: return 25.0;
                case EMERGENCY: return 0.0;
                default: return 100.0;
            }
        }

        public double getCurrentTempC() { return currentTempC; }
        public ThermalThreshold getCurrentThreshold() { return currentThreshold; }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EDGE HARDENING MANAGER
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Central manager for edge hardening.
     */
    public static class EdgeHardeningManager {
        private final String nodeId;
        private final FeatureManager featureManager;
        private final OfflineQueue offlineQueue;
        private final NetworkMonitor networkMonitor;
        private final ThermalManager thermalManager;
        private PowerMode powerMode;
        private final ResourceBudget resourceBudget;
        
        private static EdgeHardeningManager instance;

        private EdgeHardeningManager(String nodeId) {
            this.nodeId = nodeId;
            this.featureManager = new FeatureManager();
            this.offlineQueue = new OfflineQueue(10000);
            this.networkMonitor = new NetworkMonitor();
            this.thermalManager = new ThermalManager();
            this.powerMode = PowerMode.FULL;
            this.resourceBudget = new ResourceBudget(512, 64, 200, 100, 50);
        }

        public static synchronized EdgeHardeningManager getInstance(String nodeId) {
            if (instance == null) {
                instance = new EdgeHardeningManager(nodeId);
                instance.initialize();
            }
            return instance;
        }

        public boolean initialize() {
            // Configure features based on resources
            double available = resourceBudget.getAvailableMemoryMb();
            List<String> enabled = featureManager.shedFeatures(available);
            System.out.println("Enabled features: " + enabled);
            return true;
        }

        public Map<String, Object> adaptToConditions() {
            Map<String, Object> decisions = new HashMap<>();

            // Check network
            boolean networkOk = networkMonitor.checkConnectivity(5000);
            decisions.put("network", networkOk ? "online" : "offline");

            // Check thermal
            ThermalThreshold threshold = thermalManager.getCurrentThreshold();
            decisions.put("thermal", threshold.name());

            if (thermalManager.shouldShutdown()) {
                decisions.put("action", "emergency_shutdown");
                return decisions;
            }

            decisions.put("maxCpu", thermalManager.getMaxCpuPercent());
            return decisions;
        }

        public QueuedDecision makeDecision(String decisionType, Map<String, Object> context) {
            String id = nodeId + "-" + System.currentTimeMillis();
            QueuedDecision decision = new QueuedDecision(id, decisionType, context);

            if (networkMonitor.isConnected()) {
                decision.setResult(processDecision(decision));
                decision.setSynced(true);
            } else {
                decision.setResult(processDecisionLocally(decision));
                offlineQueue.enqueue(decision);
            }

            return decision;
        }

        private Map<String, Object> processDecision(QueuedDecision decision) {
            Map<String, Object> result = new HashMap<>();
            result.put("status", "processed");
            result.put("mode", "full");
            return result;
        }

        private Map<String, Object> processDecisionLocally(QueuedDecision decision) {
            Map<String, Object> result = new HashMap<>();
            result.put("status", "processed_locally");
            result.put("mode", "offline");
            return result;
        }

        public int syncPending() {
            if (!networkMonitor.isConnected()) {
                return 0;
            }

            List<QueuedDecision> pending = offlineQueue.getPending();
            List<String> syncedIds = new ArrayList<>();

            for (QueuedDecision d : pending) {
                // In real implementation, would sync to MEDINA core
                syncedIds.add(d.getId());
            }

            offlineQueue.markSynced(syncedIds);
            return syncedIds.size();
        }

        public Map<String, Object> getStatus() {
            Map<String, Object> status = new HashMap<>();
            status.put("nodeId", nodeId);
            status.put("powerMode", powerMode.name());
            status.put("featuresEnabled", featureManager.getEnabledFeatures());
            status.put("memoryUsedMb", featureManager.getEnabledMemory());
            status.put("network", networkMonitor.getStatus());
            
            Map<String, Object> thermal = new HashMap<>();
            thermal.put("tempC", thermalManager.getCurrentTempC());
            thermal.put("threshold", thermalManager.getCurrentThreshold().name());
            status.put("thermal", thermal);
            
            status.put("offlineQueueSize", offlineQueue.getPending().size());
            return status;
        }

        public String getNodeId() { return nodeId; }
        public FeatureManager getFeatureManager() { return featureManager; }
        public NetworkMonitor getNetworkMonitor() { return networkMonitor; }
        public ThermalManager getThermalManager() { return thermalManager; }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MAIN — DEMO
    // ═══════════════════════════════════════════════════════════════════════════

    public static void main(String[] args) {
        System.out.println("XCREW Edge Hardening Protocol - Java Implementation");
        System.out.println("═".repeat(60));
        System.out.println();

        EdgeHardeningManager manager = EdgeHardeningManager.getInstance("demo-node-001");
        
        System.out.println("Edge Hardening Status:");
        System.out.println("-".repeat(40));
        
        Map<String, Object> status = manager.getStatus();
        for (Map.Entry<String, Object> entry : status.entrySet()) {
            System.out.printf("%s: %s%n", entry.getKey(), entry.getValue());
        }
        
        System.out.println();
        System.out.println("Adapting to conditions...");
        Map<String, Object> adaptations = manager.adaptToConditions();
        for (Map.Entry<String, Object> entry : adaptations.entrySet()) {
            System.out.printf("  %s: %s%n", entry.getKey(), entry.getValue());
        }
        
        System.out.println();
        System.out.println("Making offline decision...");
        Map<String, Object> context = new HashMap<>();
        context.put("resource", "compute");
        context.put("amount", 100);
        QueuedDecision decision = manager.makeDecision("resource_allocation", context);
        System.out.printf("Decision ID: %s%n", decision.getId());
        System.out.printf("Result: %s%n", decision.getResult());
        
        System.out.println();
        System.out.println("Protocol execution complete.");
    }
}
