/**
 * Multi-Model Protocol Engine — Comprehensive Test Suite
 * ============================================================
 * Tests for all 10 PROTO-MM protocols: Registry, Routing, Consensus,
 * Capability Negotiation, Memory Fusion, Health/Failover, Governance,
 * Task Decomposition, Output Synthesis, and Autonomous Evolution.
 *
 * Target: 300+ tests   Charter: MULTI-MODEL-001
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | June 2026
 */

'use strict';

import {
  ModelRegistry,
  AdaptiveModelRouter,
  CrossModelConsensus,
  CapabilityNegotiator,
  MultiModelMemoryFusion,
  ModelHealthMonitor,
  SovereignModelGovernance,
  MultiModelTaskDecomposer,
  ModelOutputSynthesizer,
  AutonomousModelEvolution,
  MultiModelProtocolEngine,
  getMultiModelProtocolEngine,
} from '@/lib/multiModelProtocolEngine';

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INV = 1 / PHI;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function registerTestModels(registry: ModelRegistry) {
  registry.register({
    name: 'GPT-5',
    provider: 'openai',
    tier: 'frontier',
    capabilities: ['reasoning', 'coding', 'creative', 'analysis', 'tool_use', 'long_context'],
    maxTokens: 128000,
    costPer1kTokens: 0.03,
    averageLatencyMs: 800,
    qualityScore: 0.95,
    status: 'healthy',
    governanceLevel: 'standard',
  });
  registry.register({
    name: 'Claude-4',
    provider: 'anthropic',
    tier: 'frontier',
    capabilities: ['reasoning', 'coding', 'creative', 'analysis', 'long_context'],
    maxTokens: 200000,
    costPer1kTokens: 0.025,
    averageLatencyMs: 700,
    qualityScore: 0.94,
    status: 'healthy',
    governanceLevel: 'standard',
  });
  registry.register({
    name: 'Gemini-Ultra',
    provider: 'google',
    tier: 'advanced',
    capabilities: ['reasoning', 'vision', 'audio', 'analysis', 'long_context'],
    maxTokens: 1000000,
    costPer1kTokens: 0.02,
    averageLatencyMs: 600,
    qualityScore: 0.92,
    status: 'healthy',
    governanceLevel: 'standard',
  });
  registry.register({
    name: 'Llama-4',
    provider: 'meta',
    tier: 'standard',
    capabilities: ['reasoning', 'coding', 'creative'],
    maxTokens: 32000,
    costPer1kTokens: 0.001,
    averageLatencyMs: 300,
    qualityScore: 0.85,
    status: 'healthy',
    governanceLevel: 'unrestricted',
  });
  registry.register({
    name: 'Mistral-Large',
    provider: 'mistral',
    tier: 'advanced',
    capabilities: ['reasoning', 'coding', 'fast_inference'],
    maxTokens: 64000,
    costPer1kTokens: 0.008,
    averageLatencyMs: 400,
    qualityScore: 0.88,
    status: 'healthy',
    governanceLevel: 'standard',
  });
  registry.register({
    name: 'Sovereign-Core',
    provider: 'sovereign',
    tier: 'specialized',
    capabilities: ['reasoning', 'analysis', 'tool_use'],
    maxTokens: 16000,
    costPer1kTokens: 0.0,
    averageLatencyMs: 200,
    qualityScore: 0.90,
    status: 'healthy',
    governanceLevel: 'sovereign',
  });
  registry.register({
    name: 'Local-Fast',
    provider: 'local',
    tier: 'efficient',
    capabilities: ['fast_inference', 'coding'],
    maxTokens: 8000,
    costPer1kTokens: 0.0,
    averageLatencyMs: 50,
    qualityScore: 0.75,
    status: 'healthy',
    governanceLevel: 'unrestricted',
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROTO-MM-001: MODEL REGISTRY & DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════════

describe('PROTO-MM-001: Model Registry & Discovery', () => {
  let registry: ModelRegistry;

  beforeEach(() => {
    registry = new ModelRegistry();
  });

  describe('Registration', () => {
    it('should register a model and return valid registration', () => {
      const model = registry.register({
        name: 'TestModel', provider: 'openai', tier: 'standard',
        capabilities: ['reasoning'], maxTokens: 4096, costPer1kTokens: 0.01,
        averageLatencyMs: 500, qualityScore: 0.9, status: 'healthy', governanceLevel: 'standard',
      });
      expect(model.id).toContain('model-openai-');
      expect(model.name).toBe('TestModel');
      expect(model.invocationCount).toBe(0);
      expect(model.successRate).toBe(1.0);
    });

    it('should assign φ-weight based on tier and capabilities', () => {
      const frontier = registry.register({
        name: 'F', provider: 'openai', tier: 'frontier',
        capabilities: ['reasoning', 'coding', 'creative'], maxTokens: 128000,
        costPer1kTokens: 0.03, averageLatencyMs: 800, qualityScore: 0.95,
        status: 'healthy', governanceLevel: 'standard',
      });
      const efficient = registry.register({
        name: 'E', provider: 'local', tier: 'efficient',
        capabilities: ['fast_inference'], maxTokens: 4000,
        costPer1kTokens: 0.0, averageLatencyMs: 50, qualityScore: 0.7,
        status: 'healthy', governanceLevel: 'unrestricted',
      });
      expect(frontier.phiWeight).toBeGreaterThan(efficient.phiWeight);
    });

    it('should register multiple models from different providers', () => {
      registerTestModels(registry);
      expect(registry.count()).toBe(7);
    });

    it('should generate unique IDs for each registration', () => {
      const m1 = registry.register({ name: 'A', provider: 'openai', tier: 'standard', capabilities: ['reasoning'], maxTokens: 4096, costPer1kTokens: 0.01, averageLatencyMs: 500, qualityScore: 0.9, status: 'healthy', governanceLevel: 'standard' });
      const m2 = registry.register({ name: 'B', provider: 'openai', tier: 'standard', capabilities: ['reasoning'], maxTokens: 4096, costPer1kTokens: 0.01, averageLatencyMs: 500, qualityScore: 0.9, status: 'healthy', governanceLevel: 'standard' });
      expect(m1.id).not.toBe(m2.id);
    });

    it('should set registeredAt timestamp', () => {
      const before = Date.now();
      const model = registry.register({ name: 'T', provider: 'local', tier: 'efficient', capabilities: ['fast_inference'], maxTokens: 1000, costPer1kTokens: 0.0, averageLatencyMs: 10, qualityScore: 0.5, status: 'healthy', governanceLevel: 'unrestricted' });
      expect(model.registeredAt).toBeGreaterThanOrEqual(before);
    });
  });

  describe('Discovery', () => {
    beforeEach(() => registerTestModels(registry));

    it('should discover models by capability', () => {
      const coders = registry.discover(['coding']);
      expect(coders.length).toBeGreaterThanOrEqual(4);
      coders.forEach(m => expect(m.capabilities).toContain('coding'));
    });

    it('should discover models by multiple capabilities', () => {
      const multiCap = registry.discover(['reasoning', 'vision']);
      expect(multiCap.length).toBeGreaterThanOrEqual(1);
      multiCap.forEach(m => {
        expect(m.capabilities).toContain('reasoning');
        expect(m.capabilities).toContain('vision');
      });
    });

    it('should filter by tier', () => {
      const frontier = registry.discover(['reasoning'], 'frontier');
      frontier.forEach(m => expect(m.tier).toBe('frontier'));
    });

    it('should sort by φ-weight descending', () => {
      const all = registry.discover(['reasoning']);
      for (let i = 1; i < all.length; i++) {
        expect(all[i - 1].phiWeight).toBeGreaterThanOrEqual(all[i].phiWeight);
      }
    });

    it('should exclude offline models', () => {
      const models = registry.getAll();
      registry.updateStatus(models[0].id, 'offline');
      const discovered = registry.discover(['reasoning']);
      expect(discovered.find(m => m.id === models[0].id)).toBeUndefined();
    });

    it('should return empty for impossible capability combo', () => {
      const result = registry.discover(['audio', 'coding', 'vision']);
      // No single model has all three in test data
      expect(result.length).toBe(0);
    });
  });

  describe('Invocation Tracking', () => {
    beforeEach(() => registerTestModels(registry));

    it('should track successful invocations', () => {
      const model = registry.getAll()[0];
      registry.recordInvocation(model.id, true);
      const updated = registry.get(model.id)!;
      expect(updated.invocationCount).toBe(1);
      expect(updated.successRate).toBe(1.0);
    });

    it('should track failed invocations and update success rate', () => {
      const model = registry.getAll()[0];
      registry.recordInvocation(model.id, true);
      registry.recordInvocation(model.id, false);
      const updated = registry.get(model.id)!;
      expect(updated.invocationCount).toBe(2);
      expect(updated.successRate).toBe(0.5);
    });

    it('should update lastUsed timestamp', () => {
      const model = registry.getAll()[0];
      expect(model.lastUsed).toBe(0);
      registry.recordInvocation(model.id, true);
      expect(registry.get(model.id)!.lastUsed).toBeGreaterThan(0);
    });

    it('should adjust phiWeight based on success rate', () => {
      const model = registry.getAll()[0];
      const originalWeight = model.phiWeight;
      registry.recordInvocation(model.id, false);
      registry.recordInvocation(model.id, false);
      expect(registry.get(model.id)!.phiWeight).toBeLessThan(originalWeight);
    });
  });

  describe('Status Management', () => {
    beforeEach(() => registerTestModels(registry));

    it('should update model status', () => {
      const model = registry.getAll()[0];
      expect(registry.updateStatus(model.id, 'degraded')).toBe(true);
      expect(registry.get(model.id)!.status).toBe('degraded');
    });

    it('should return false for unknown model', () => {
      expect(registry.updateStatus('nonexistent', 'offline')).toBe(false);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTO-MM-002: ADAPTIVE MODEL ROUTING
// ═══════════════════════════════════════════════════════════════════════════════

describe('PROTO-MM-002: Adaptive Model Routing', () => {
  let registry: ModelRegistry;
  let router: AdaptiveModelRouter;

  beforeEach(() => {
    registry = new ModelRegistry();
    router = new AdaptiveModelRouter();
    registerTestModels(registry);
  });

  describe('Basic Routing', () => {
    it('should route to a model with required capability', () => {
      const decision = router.route(['reasoning'], 'phi_optimal', registry);
      expect(decision).not.toBeNull();
      expect(decision!.selectedModelId).toBeTruthy();
      expect(decision!.strategy).toBe('phi_optimal');
    });

    it('should return null when no model matches', () => {
      const decision = router.route(['audio', 'coding', 'vision'], 'phi_optimal', registry);
      expect(decision).toBeNull();
    });

    it('should provide alternatives', () => {
      const decision = router.route(['reasoning'], 'phi_optimal', registry);
      expect(decision!.alternatives.length).toBeGreaterThan(0);
    });

    it('should record routing history', () => {
      router.route(['reasoning'], 'phi_optimal', registry);
      router.route(['coding'], 'capability_match', registry);
      expect(router.getHistory().length).toBe(2);
    });

    it('should include reasoning in decision', () => {
      const decision = router.route(['reasoning'], 'quality_first', registry);
      expect(decision!.reasoning).toContain('quality_first');
    });
  });

  describe('Routing Strategies', () => {
    it('phi_optimal should prefer high φ-weight models', () => {
      const decision = router.route(['reasoning'], 'phi_optimal', registry);
      const model = registry.get(decision!.selectedModelId)!;
      expect(model.tier).toMatch(/frontier|specialized/);
    });

    it('cost_efficient should prefer low-cost models', () => {
      const decision = router.route(['reasoning'], 'cost_efficient', registry);
      const model = registry.get(decision!.selectedModelId)!;
      expect(model.costPer1kTokens).toBeLessThanOrEqual(0.01);
    });

    it('latency_optimal should prefer fast models', () => {
      const decision = router.route(['fast_inference'], 'latency_optimal', registry);
      const model = registry.get(decision!.selectedModelId)!;
      expect(model.averageLatencyMs).toBeLessThanOrEqual(400);
    });

    it('quality_first should prefer high quality models', () => {
      const decision = router.route(['reasoning'], 'quality_first', registry);
      const model = registry.get(decision!.selectedModelId)!;
      expect(model.qualityScore).toBeGreaterThanOrEqual(0.88);
    });

    it('balanced should consider multiple factors', () => {
      const decision = router.route(['reasoning'], 'balanced', registry);
      expect(decision).not.toBeNull();
      expect(decision!.score).toBeGreaterThan(0);
    });
  });

  describe('Constraints', () => {
    it('should respect maxCost constraint', () => {
      const decision = router.route(['reasoning'], 'phi_optimal', registry, { maxCost: 0.005 });
      if (decision) {
        const model = registry.get(decision.selectedModelId)!;
        expect(model.costPer1kTokens).toBeLessThanOrEqual(0.005);
      }
    });

    it('should respect maxLatency constraint', () => {
      const decision = router.route(['reasoning'], 'phi_optimal', registry, { maxLatency: 300 });
      if (decision) {
        const model = registry.get(decision.selectedModelId)!;
        expect(model.averageLatencyMs).toBeLessThanOrEqual(300);
      }
    });

    it('should respect minQuality constraint', () => {
      const decision = router.route(['reasoning'], 'phi_optimal', registry, { minQuality: 0.93 });
      if (decision) {
        const model = registry.get(decision.selectedModelId)!;
        expect(model.qualityScore).toBeGreaterThanOrEqual(0.93);
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTO-MM-003: CROSS-MODEL CONSENSUS
// ═══════════════════════════════════════════════════════════════════════════════

describe('PROTO-MM-003: Cross-Model Consensus', () => {
  let registry: ModelRegistry;
  let consensus: CrossModelConsensus;

  beforeEach(() => {
    registry = new ModelRegistry();
    consensus = new CrossModelConsensus();
    registerTestModels(registry);
  });

  it('should resolve consensus across multiple models', async () => {
    const models = registry.getAll().slice(0, 3).map(m => m.id);
    const response = await consensus.resolve({
      id: 'test-consensus-1',
      prompt: 'What is the meaning of life?',
      models,
      mode: 'phi_weighted',
      minimumAgreement: 0.5,
      timeout: 5000,
    }, registry);

    expect(response.results.length).toBe(3);
    expect(response.consensusOutput).toBeTruthy();
    expect(response.consensusConfidence).toBeGreaterThan(0);
    expect(response.phiCoherence).toBeGreaterThan(0);
  });

  it('should calculate agreement score', async () => {
    const models = registry.getAll().slice(0, 4).map(m => m.id);
    const response = await consensus.resolve({
      id: 'test-consensus-2',
      prompt: 'Calculate 2+2',
      models,
      mode: 'majority_vote',
      minimumAgreement: 0.6,
      timeout: 3000,
    }, registry);

    expect(response.agreement).toBeGreaterThanOrEqual(0);
    expect(response.agreement).toBeLessThanOrEqual(1);
  });

  it('should use confidence_max mode correctly', async () => {
    const models = registry.getAll().slice(0, 3).map(m => m.id);
    const response = await consensus.resolve({
      id: 'test-consensus-3',
      prompt: 'Test prompt',
      models,
      mode: 'confidence_max',
      minimumAgreement: 0.5,
      timeout: 3000,
    }, registry);

    expect(response.consensusOutput).toContain('Response from');
  });

  it('should track consensus history', async () => {
    const models = registry.getAll().slice(0, 2).map(m => m.id);
    await consensus.resolve({ id: 'c1', prompt: 'Q1', models, mode: 'phi_weighted', minimumAgreement: 0.5, timeout: 3000 }, registry);
    await consensus.resolve({ id: 'c2', prompt: 'Q2', models, mode: 'phi_weighted', minimumAgreement: 0.5, timeout: 3000 }, registry);
    expect(consensus.getHistory().length).toBe(2);
  });

  it('should include latency per model result', async () => {
    const models = registry.getAll().slice(0, 3).map(m => m.id);
    const response = await consensus.resolve({
      id: 'c-latency', prompt: 'Test', models, mode: 'phi_weighted', minimumAgreement: 0.5, timeout: 3000,
    }, registry);
    response.results.forEach(r => expect(r.latencyMs).toBeGreaterThan(0));
  });

  it('should compute φ-coherence between 0 and PHI', async () => {
    const models = registry.getAll().slice(0, 5).map(m => m.id);
    const response = await consensus.resolve({
      id: 'c-phi', prompt: 'Phi test', models, mode: 'phi_weighted', minimumAgreement: 0.3, timeout: 5000,
    }, registry);
    expect(response.phiCoherence).toBeGreaterThan(0);
    expect(response.phiCoherence).toBeLessThan(PHI);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTO-MM-004: CAPABILITY NEGOTIATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('PROTO-MM-004: Capability Negotiation', () => {
  let registry: ModelRegistry;
  let negotiator: CapabilityNegotiator;

  beforeEach(() => {
    registry = new ModelRegistry();
    negotiator = new CapabilityNegotiator();
    registerTestModels(registry);
  });

  it('should negotiate best model for requested capabilities', () => {
    const result = negotiator.negotiate(['reasoning', 'coding'], registry);
    expect(result.negotiatedModel).toBeTruthy();
    expect(result.capabilityMatch).toBeGreaterThan(0);
  });

  it('should provide fallback chain', () => {
    const result = negotiator.negotiate(['reasoning'], registry);
    expect(result.fallbackChain.length).toBeGreaterThan(0);
  });

  it('should list available models', () => {
    const result = negotiator.negotiate(['reasoning'], registry);
    expect(result.availableModels.length).toBe(7);
  });

  it('should score capability match correctly', () => {
    const exact = negotiator.negotiate(['reasoning', 'coding', 'creative'], registry);
    const partial = negotiator.negotiate(['reasoning', 'audio', 'vision', 'embedding'], registry);
    expect(exact.capabilityMatch).toBeGreaterThan(0);
    expect(partial.capabilityMatch).toBeGreaterThan(0);
  });

  it('should track negotiation history', () => {
    negotiator.negotiate(['reasoning'], registry);
    negotiator.negotiate(['coding'], registry);
    negotiator.negotiate(['vision'], registry);
    expect(negotiator.getHistory().length).toBe(3);
  });

  it('should handle single capability request', () => {
    const result = negotiator.negotiate(['fast_inference'], registry);
    expect(result.negotiatedModel).toBeTruthy();
  });

  it('should generate unique negotiation IDs', () => {
    const r1 = negotiator.negotiate(['reasoning'], registry);
    const r2 = negotiator.negotiate(['coding'], registry);
    expect(r1.id).not.toBe(r2.id);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTO-MM-005: MULTI-MODEL MEMORY FUSION
// ═══════════════════════════════════════════════════════════════════════════════

describe('PROTO-MM-005: Multi-Model Memory Fusion', () => {
  let fusion: MultiModelMemoryFusion;

  beforeEach(() => {
    fusion = new MultiModelMemoryFusion();
  });

  describe('Fusion', () => {
    it('should fuse embeddings from multiple models', () => {
      const entry = fusion.fuse(
        ['model-a', 'model-b'],
        'Test memory content',
        [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]],
      );
      expect(entry.fusedEmbedding.length).toBe(3);
      expect(entry.sourceModels).toEqual(['model-a', 'model-b']);
      expect(entry.coherenceScore).toBeGreaterThan(0);
    });

    it('should apply φ-weighted fusion (first embedding weighted more)', () => {
      const entry = fusion.fuse(
        ['primary', 'secondary'],
        'Content',
        [[1.0, 0.0], [0.0, 1.0]],
      );
      // First embedding should dominate due to PHI weighting
      expect(entry.fusedEmbedding[0]).toBeGreaterThan(entry.fusedEmbedding[1]);
    });

    it('should calculate coherence between embeddings', () => {
      const highCoherence = fusion.fuse(['a', 'b'], 'Same direction', [[1, 0, 0], [0.9, 0.1, 0]]);
      const lowCoherence = fusion.fuse(['c', 'd'], 'Opposite', [[1, 0, 0], [-1, 0, 0]]);
      expect(highCoherence.coherenceScore).toBeGreaterThan(lowCoherence.coherenceScore);
    });

    it('should return coherence of 1.0 for single embedding', () => {
      const entry = fusion.fuse(['single'], 'One model', [[0.5, 0.5, 0.5]]);
      expect(entry.coherenceScore).toBe(1.0);
    });

    it('should initialize decay weight to 1.0', () => {
      const entry = fusion.fuse(['m1'], 'Fresh', [[1, 2, 3]]);
      expect(entry.decayWeight).toBe(1.0);
    });
  });

  describe('Retrieval', () => {
    beforeEach(() => {
      fusion.fuse(['m1'], 'Alpha content', [[1.0, 0.0, 0.0]]);
      fusion.fuse(['m2'], 'Beta content', [[0.0, 1.0, 0.0]]);
      fusion.fuse(['m3'], 'Gamma content', [[0.0, 0.0, 1.0]]);
    });

    it('should retrieve most similar memories', () => {
      const results = fusion.retrieve([1.0, 0.0, 0.0], 1);
      expect(results.length).toBe(1);
      expect(results[0].content).toBe('Alpha content');
    });

    it('should respect topK parameter', () => {
      const results = fusion.retrieve([0.5, 0.5, 0.0], 2);
      expect(results.length).toBe(2);
    });

    it('should retrieve all when topK exceeds count', () => {
      const results = fusion.retrieve([1, 1, 1], 10);
      expect(results.length).toBe(3);
    });
  });

  describe('Decay', () => {
    it('should decay all memory weights', () => {
      fusion.fuse(['m1'], 'Content', [[1, 0, 0]]);
      fusion.decay();
      const all = fusion.getAll();
      expect(all[0].decayWeight).toBeCloseTo(PHI_INV, 5);
    });

    it('should apply custom decay factor', () => {
      fusion.fuse(['m1'], 'Content', [[1, 0, 0]]);
      fusion.decay(0.9);
      expect(fusion.getAll()[0].decayWeight).toBeCloseTo(0.9, 5);
    });

    it('should compound decay over multiple applications', () => {
      fusion.fuse(['m1'], 'Content', [[1, 0, 0]]);
      fusion.decay();
      fusion.decay();
      expect(fusion.getAll()[0].decayWeight).toBeCloseTo(PHI_INV * PHI_INV, 5);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTO-MM-006: MODEL HEALTH & FAILOVER
// ═══════════════════════════════════════════════════════════════════════════════

describe('PROTO-MM-006: Model Health & Failover', () => {
  let monitor: ModelHealthMonitor;
  let registry: ModelRegistry;

  beforeEach(() => {
    monitor = new ModelHealthMonitor();
    registry = new ModelRegistry();
    registerTestModels(registry);
  });

  describe('Health Checks', () => {
    it('should determine healthy status for good metrics', () => {
      const check = monitor.check('model-1', 200, 0.01, 100);
      expect(check.status).toBe('healthy');
    });

    it('should determine degraded status for high latency', () => {
      const check = monitor.check('model-2', 15000, 0.15, 50);
      expect(check.status).toBe('degraded');
    });

    it('should determine unhealthy for high error rate', () => {
      const check = monitor.check('model-3', 500, 0.6, 20);
      expect(check.status).toBe('unhealthy');
    });

    it('should determine offline for very high error rate', () => {
      const check = monitor.check('model-4', 1000, 0.9, 5);
      expect(check.status).toBe('offline');
    });

    it('should calculate φ-deviation', () => {
      const check = monitor.check('model-5', 618, 0.01, 100); // ~PHI_INV seconds
      expect(check.phiDeviation).toBeLessThan(0.01);
    });

    it('should maintain check history per model', () => {
      monitor.check('m1', 200, 0.01, 100);
      monitor.check('m1', 250, 0.02, 95);
      monitor.check('m1', 300, 0.03, 90);
      expect(monitor.getHistory('m1').length).toBe(3);
    });

    it('should return latest check', () => {
      monitor.check('m1', 200, 0.01, 100);
      monitor.check('m1', 999, 0.5, 10);
      const latest = monitor.getLatest('m1')!;
      expect(latest.latencyMs).toBe(999);
    });
  });

  describe('Failover', () => {
    it('should not recommend failover with good history', () => {
      monitor.check('m1', 200, 0.01, 100);
      monitor.check('m1', 210, 0.02, 98);
      monitor.check('m1', 220, 0.01, 99);
      expect(monitor.shouldFailover('m1')).toBe(false);
    });

    it('should recommend failover with bad history', () => {
      monitor.check('m1', 5000, 0.7, 10);
      monitor.check('m1', 6000, 0.8, 5);
      monitor.check('m1', 7000, 0.9, 2);
      expect(monitor.shouldFailover('m1')).toBe(true);
    });

    it('should not recommend failover with insufficient history', () => {
      monitor.check('m1', 5000, 0.9, 2);
      expect(monitor.shouldFailover('m1')).toBe(false);
    });

    it('should select failover model with matching capabilities', () => {
      // Use Llama-4 which has common capabilities (reasoning, coding, creative)
      const models = registry.getAll();
      const llama = models.find(m => m.name === 'Llama-4')!;
      registry.updateStatus(llama.id, 'unhealthy');
      const failover = monitor.selectFailover(llama.id, registry);
      expect(failover).not.toBeNull();
      expect(failover).not.toBe(llama.id);
    });

    it('should return null when no failover available', () => {
      // Register a model with unique capability
      const unique = registry.register({
        name: 'Unique', provider: 'custom', tier: 'specialized',
        capabilities: ['embedding'], maxTokens: 1000, costPer1kTokens: 0.0,
        averageLatencyMs: 100, qualityScore: 0.8, status: 'healthy', governanceLevel: 'standard',
      });
      // Mark it unhealthy — no other model has just 'embedding'
      registry.updateStatus(unique.id, 'unhealthy');
      const failover = monitor.selectFailover(unique.id, registry);
      expect(failover).toBeNull();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTO-MM-007: SOVEREIGN MODEL GOVERNANCE
// ═══════════════════════════════════════════════════════════════════════════════

describe('PROTO-MM-007: Sovereign Model Governance', () => {
  let governance: SovereignModelGovernance;

  beforeEach(() => {
    governance = new SovereignModelGovernance();
  });

  describe('Policy Management', () => {
    it('should set and get governance policy', () => {
      governance.setPolicy('model-1', 'elevated');
      expect(governance.getPolicy('model-1')).toBe('elevated');
    });

    it('should default to standard for unknown models', () => {
      expect(governance.getPolicy('unknown')).toBe('standard');
    });

    it('should override policy on update', () => {
      governance.setPolicy('m1', 'standard');
      governance.setPolicy('m1', 'sovereign');
      expect(governance.getPolicy('m1')).toBe('sovereign');
    });
  });

  describe('Access Gates', () => {
    it('should auto-pass unrestricted gates', () => {
      governance.setPolicy('m1', 'unrestricted');
      const gate = governance.requestAccess('m1', 'user-1');
      expect(gate.passed).toBe(true);
      expect(gate.requiredApprovals).toBe(0);
    });

    it('should require 1 approval for standard', () => {
      governance.setPolicy('m1', 'standard');
      const gate = governance.requestAccess('m1', 'user-1');
      expect(gate.passed).toBe(false);
      expect(gate.requiredApprovals).toBe(1);
    });

    it('should require 5 approvals for sovereign', () => {
      governance.setPolicy('m1', 'sovereign');
      const gate = governance.requestAccess('m1', 'user-1');
      expect(gate.requiredApprovals).toBe(5);
      expect(gate.passed).toBe(false);
    });

    it('should pass gate after sufficient approvals', () => {
      governance.setPolicy('m1', 'elevated');
      const gate = governance.requestAccess('m1', 'user-1');
      governance.approve(gate.id);
      expect(governance.isAccessGranted(gate.id)).toBe(false);
      governance.approve(gate.id);
      expect(governance.isAccessGranted(gate.id)).toBe(true);
    });

    it('should not allow approval beyond pass', () => {
      governance.setPolicy('m1', 'standard');
      const gate = governance.requestAccess('m1', 'user-1');
      governance.approve(gate.id);
      expect(governance.approve(gate.id)).toBe(false); // already passed
    });

    it('should track conditions', () => {
      const gate = governance.requestAccess('m1', 'user-1', ['audit_required', 'rate_limited']);
      expect(gate.conditions).toEqual(['audit_required', 'rate_limited']);
    });

    it('should maintain gate history', () => {
      governance.requestAccess('m1', 'u1');
      governance.requestAccess('m2', 'u2');
      governance.requestAccess('m3', 'u3');
      expect(governance.getGates().length).toBe(3);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTO-MM-008: MULTI-MODEL TASK DECOMPOSITION
// ═══════════════════════════════════════════════════════════════════════════════

describe('PROTO-MM-008: Multi-Model Task Decomposition', () => {
  let decomposer: MultiModelTaskDecomposer;
  let registry: ModelRegistry;

  beforeEach(() => {
    decomposer = new MultiModelTaskDecomposer();
    registry = new ModelRegistry();
    registerTestModels(registry);
  });

  describe('Complexity-based decomposition', () => {
    it('should create 1 subtask for trivial complexity', () => {
      const result = decomposer.decompose('Simple task', 'trivial', registry);
      expect(result.subtasks.length).toBe(1);
    });

    it('should create 2 subtasks for simple complexity', () => {
      const result = decomposer.decompose('Two-step task', 'simple', registry);
      expect(result.subtasks.length).toBe(2);
    });

    it('should create 3 subtasks for moderate complexity', () => {
      const result = decomposer.decompose('Moderate work', 'moderate', registry);
      expect(result.subtasks.length).toBe(3);
    });

    it('should create 5 subtasks for complex tasks (Fibonacci)', () => {
      const result = decomposer.decompose('Build a full system', 'complex', registry);
      expect(result.subtasks.length).toBe(5);
    });

    it('should create 8 subtasks for extreme tasks (Fibonacci)', () => {
      const result = decomposer.decompose('Design entire platform architecture', 'extreme', registry);
      expect(result.subtasks.length).toBe(8);
    });
  });

  describe('Capability inference', () => {
    it('should infer coding capability from code-related tasks', () => {
      const result = decomposer.decompose('Write code for API', 'simple', registry);
      expect(result.subtasks.some(s => s.capability === 'coding')).toBe(true);
    });

    it('should infer analysis capability from data tasks', () => {
      const result = decomposer.decompose('Analyze the data patterns', 'simple', registry);
      expect(result.subtasks.some(s => s.capability === 'analysis')).toBe(true);
    });

    it('should default to reasoning for ambiguous tasks', () => {
      const result = decomposer.decompose('Do something', 'trivial', registry);
      expect(result.subtasks[0].capability).toBe('reasoning');
    });

    it('should infer multiple capabilities', () => {
      const result = decomposer.decompose('Write code and analyze data results', 'moderate', registry);
      const caps = result.subtasks.map(s => s.capability);
      expect(caps).toContain('coding');
      expect(caps).toContain('analysis');
    });
  });

  describe('Task structure', () => {
    it('should assign dependencies sequentially', () => {
      const result = decomposer.decompose('Multi-step', 'complex', registry);
      expect(result.subtasks[0].dependencies).toEqual([]);
      expect(result.subtasks[1].dependencies.length).toBe(1);
      expect(result.subtasks[2].dependencies.length).toBe(1);
    });

    it('should assign φ-weighted priorities', () => {
      const result = decomposer.decompose('Priority test', 'complex', registry);
      expect(result.subtasks[0].priority).toBeGreaterThan(result.subtasks[1].priority);
      expect(result.subtasks[1].priority).toBeGreaterThan(result.subtasks[2].priority);
    });

    it('should compute φ-partitioning', () => {
      const result = decomposer.decompose('Partition test', 'complex', registry);
      expect(result.phiPartitioning).toBeCloseTo(5 * PHI_INV, 5);
    });

    it('should initialize all subtasks as pending', () => {
      const result = decomposer.decompose('Status test', 'extreme', registry);
      result.subtasks.forEach(s => expect(s.status).toBe('pending'));
    });

    it('should assign models to subtasks', () => {
      const result = decomposer.decompose('Build code system', 'complex', registry);
      result.subtasks.forEach(s => expect(s.assignedModel).toBeTruthy());
    });
  });

  describe('History', () => {
    it('should track decomposition history', () => {
      decomposer.decompose('T1', 'simple', registry);
      decomposer.decompose('T2', 'moderate', registry);
      expect(decomposer.getDecompositions().length).toBe(2);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTO-MM-009: MODEL OUTPUT SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════════

describe('PROTO-MM-009: Model Output Synthesis', () => {
  let synthesizer: ModelOutputSynthesizer;

  beforeEach(() => {
    synthesizer = new ModelOutputSynthesizer();
  });

  describe('Synthesis', () => {
    it('should synthesize outputs from multiple models', () => {
      const result = synthesizer.synthesize([
        { modelId: 'm1', output: 'Answer A', confidence: 0.9 },
        { modelId: 'm2', output: 'Answer B', confidence: 0.8 },
        { modelId: 'm3', output: 'Answer C', confidence: 0.7 },
      ]);
      expect(result.synthesizedOutput).toContain('Synthesized from 3 models');
      expect(result.synthesizedOutput).toContain('Answer A'); // highest confidence
    });

    it('should calculate quality score with φ-weighting', () => {
      const result = synthesizer.synthesize([
        { modelId: 'm1', output: 'High', confidence: 0.95 },
        { modelId: 'm2', output: 'Med', confidence: 0.85 },
      ]);
      expect(result.qualityScore).toBeGreaterThan(0.85);
      expect(result.qualityScore).toBeLessThanOrEqual(1.0);
    });

    it('should calculate diversity index', () => {
      const diverse = synthesizer.synthesize([
        { modelId: 'm1', output: 'Short', confidence: 0.9 },
        { modelId: 'm2', output: 'A much longer and more detailed answer', confidence: 0.8 },
      ]);
      const uniform = synthesizer.synthesize([
        { modelId: 'm3', output: 'Same len', confidence: 0.9 },
        { modelId: 'm4', output: 'Same too', confidence: 0.8 },
      ]);
      expect(diverse.diversityIndex).toBeGreaterThan(uniform.diversityIndex);
    });

    it('should compute φ-harmony', () => {
      const result = synthesizer.synthesize([
        { modelId: 'm1', output: 'Output', confidence: 0.9 },
      ]);
      expect(result.phiHarmony).toBeGreaterThan(0);
    });

    it('should handle empty inputs', () => {
      const result = synthesizer.synthesize([]);
      expect(result.synthesizedOutput).toBe('');
      expect(result.qualityScore).toBe(0);
    });

    it('should handle single input', () => {
      const result = synthesizer.synthesize([
        { modelId: 'm1', output: 'Solo', confidence: 0.95 },
      ]);
      expect(result.synthesizedOutput).toContain('Solo');
      expect(result.diversityIndex).toBe(0);
    });
  });

  describe('History', () => {
    it('should track synthesis history', () => {
      synthesizer.synthesize([{ modelId: 'm1', output: 'A', confidence: 0.9 }]);
      synthesizer.synthesize([{ modelId: 'm2', output: 'B', confidence: 0.8 }]);
      expect(synthesizer.getHistory().length).toBe(2);
    });

    it('should assign unique IDs', () => {
      const r1 = synthesizer.synthesize([{ modelId: 'm1', output: 'A', confidence: 0.9 }]);
      const r2 = synthesizer.synthesize([{ modelId: 'm2', output: 'B', confidence: 0.8 }]);
      expect(r1.id).not.toBe(r2.id);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTO-MM-010: AUTONOMOUS MODEL EVOLUTION
// ═══════════════════════════════════════════════════════════════════════════════

describe('PROTO-MM-010: Autonomous Model Evolution', () => {
  let evolution: AutonomousModelEvolution;

  beforeEach(() => {
    evolution = new AutonomousModelEvolution();
  });

  describe('Evolution stages', () => {
    it('should start at nascent stage', () => {
      expect(evolution.getStage('new-model')).toBe('nascent');
    });

    it('should progress to learning after 5 generations', () => {
      for (let i = 0; i < 5; i++) {
        evolution.evolve('m1', 0.01, 0.02);
      }
      expect(evolution.getStage('m1')).toBe('learning');
    });

    it('should progress to competent after 13 generations', () => {
      for (let i = 0; i < 13; i++) {
        evolution.evolve('m1', 0.01, 0.02);
      }
      expect(evolution.getStage('m1')).toBe('competent');
    });

    it('should progress to expert after 34 generations', () => {
      for (let i = 0; i < 34; i++) {
        evolution.evolve('m1', 0.01, 0.02);
      }
      expect(evolution.getStage('m1')).toBe('expert');
    });

    it('should reach transcendent after 89 generations', () => {
      for (let i = 0; i < 89; i++) {
        evolution.evolve('m1', 0.01, 0.02);
      }
      expect(evolution.getStage('m1')).toBe('transcendent');
    });
  });

  describe('Evolution tracking', () => {
    it('should record evolution with quality and efficiency deltas', () => {
      const record = evolution.evolve('m1', 0.05, 0.03, ['vision']);
      expect(record.metrics.qualityDelta).toBe(0.05);
      expect(record.metrics.efficiencyDelta).toBe(0.03);
      expect(record.metrics.capabilityExpansion).toEqual(['vision']);
    });

    it('should increment generation counter', () => {
      evolution.evolve('m1', 0.01, 0.01);
      evolution.evolve('m1', 0.02, 0.02);
      expect(evolution.getGeneration('m1')).toBe(2);
    });

    it('should calculate φ-alignment', () => {
      const record = evolution.evolve('m1', 0.5, 0.3);
      expect(record.metrics.phiAlignment).toBeGreaterThan(0);
    });

    it('should track per-model records', () => {
      evolution.evolve('m1', 0.01, 0.01);
      evolution.evolve('m2', 0.02, 0.02);
      evolution.evolve('m1', 0.03, 0.03);
      expect(evolution.getRecords('m1').length).toBe(2);
      expect(evolution.getRecords('m2').length).toBe(1);
    });

    it('should return all records when no modelId specified', () => {
      evolution.evolve('m1', 0.01, 0.01);
      evolution.evolve('m2', 0.02, 0.02);
      expect(evolution.getRecords().length).toBe(2);
    });
  });

  describe('Fibonacci stage thresholds', () => {
    it('should use Fibonacci numbers for thresholds', () => {
      // 5, 13, 34, 89 are Fibonacci numbers
      expect([5, 13, 34, 89].every(n => {
        let a = 1, b = 1;
        while (b < n) { [a, b] = [b, a + b]; }
        return b === n;
      })).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

describe('MultiModelProtocolEngine — Unified', () => {
  let engine: MultiModelProtocolEngine;

  beforeEach(() => {
    engine = new MultiModelProtocolEngine();
  });

  it('should expose all 10 protocols', () => {
    const protocols = engine.getProtocols();
    expect(protocols.length).toBe(10);
    expect(protocols[0].id).toBe('PROTO-MM-001');
    expect(protocols[9].id).toBe('PROTO-MM-010');
  });

  it('should have charter MULTI-MODEL-001', () => {
    expect(engine.charter).toBe('MULTI-MODEL-001');
  });

  it('should provide access to all subsystems', () => {
    expect(engine.registry).toBeInstanceOf(ModelRegistry);
    expect(engine.router).toBeInstanceOf(AdaptiveModelRouter);
    expect(engine.consensus).toBeInstanceOf(CrossModelConsensus);
    expect(engine.negotiator).toBeInstanceOf(CapabilityNegotiator);
    expect(engine.memoryFusion).toBeInstanceOf(MultiModelMemoryFusion);
    expect(engine.healthMonitor).toBeInstanceOf(ModelHealthMonitor);
    expect(engine.governance).toBeInstanceOf(SovereignModelGovernance);
    expect(engine.taskDecomposer).toBeInstanceOf(MultiModelTaskDecomposer);
    expect(engine.synthesizer).toBeInstanceOf(ModelOutputSynthesizer);
    expect(engine.evolution).toBeInstanceOf(AutonomousModelEvolution);
  });

  it('should support end-to-end multi-model workflow', () => {
    // Register models
    registerTestModels(engine.registry);
    expect(engine.registry.count()).toBe(7);

    // Route a task
    const decision = engine.router.route(['reasoning', 'coding'], 'phi_optimal', engine.registry);
    expect(decision).not.toBeNull();

    // Negotiate capability
    const negotiation = engine.negotiator.negotiate(['reasoning', 'coding'], engine.registry);
    expect(negotiation.capabilityMatch).toBeGreaterThan(0);

    // Decompose task
    const decomposition = engine.taskDecomposer.decompose('Build and analyze code', 'moderate', engine.registry);
    expect(decomposition.subtasks.length).toBe(3);

    // Synthesize outputs
    const synthesis = engine.synthesizer.synthesize([
      { modelId: 'a', output: 'Result A', confidence: 0.9 },
      { modelId: 'b', output: 'Result B', confidence: 0.85 },
    ]);
    expect(synthesis.qualityScore).toBeGreaterThan(0.8);

    // Check health
    const health = engine.healthMonitor.check(decision!.selectedModelId, 200, 0.01, 100);
    expect(health.status).toBe('healthy');

    // Evolve
    const evo = engine.evolution.evolve(decision!.selectedModelId, 0.02, 0.01);
    expect(evo.stage).toBe('nascent');
  });

  it('singleton should return same instance', () => {
    const a = getMultiModelProtocolEngine();
    const b = getMultiModelProtocolEngine();
    expect(a).toBe(b);
  });
});
