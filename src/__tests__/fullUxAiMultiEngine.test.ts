// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * Tests for Full UX AI Engine (UX-AI-001) and Multi-Engine Orchestrator (MULTI-ENG-001)
 */

import { FullUxAiEngine, getFullUxAiEngine, InteractionEvent, InputModality } from '../lib/fullUxAiEngine';
import { MultiEngineOrchestrator, getMultiEngineOrchestrator, EngineDomain, EngineResult } from '../lib/multiEngineOrchestrator';

// ═══════════════════════════════════════════════════════════════════════════════
// FULL UX AI ENGINE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('FullUxAiEngine [UX-AI-001]', () => {
  let engine: FullUxAiEngine;

  beforeEach(() => {
    engine = new FullUxAiEngine();
  });

  describe('Lifecycle', () => {
    it('starts inactive', () => {
      expect(engine.isActive()).toBe(false);
    });

    it('activates correctly', () => {
      engine.activate();
      expect(engine.isActive()).toBe(true);
    });

    it('deactivates correctly', () => {
      engine.activate();
      engine.deactivate();
      expect(engine.isActive()).toBe(false);
    });

    it('has correct charter and name', () => {
      expect(engine.charter).toBe('UX-AI-001');
      expect(engine.name).toBe('Full UX AI Engine');
      expect(engine.version).toBe('1.0.0');
    });
  });

  describe('Interaction Tracking', () => {
    it('records interactions', () => {
      const event: InteractionEvent = {
        id: 'evt-1',
        timestamp: Date.now(),
        modality: 'touch',
        target: 'button-submit',
        confidence: 0.9,
      };
      engine.recordInteraction(event);
      expect(engine.getInteractionCount()).toBe(1);
    });

    it('tracks multiple interactions', () => {
      for (let i = 0; i < 10; i++) {
        engine.recordInteraction({
          id: `evt-${i}`,
          timestamp: Date.now() + i * 100,
          modality: 'mouse',
          target: `target-${i % 3}`,
          confidence: 0.8,
        });
      }
      expect(engine.getInteractionCount()).toBe(10);
    });

    it('returns recent interactions', () => {
      for (let i = 0; i < 5; i++) {
        engine.recordInteraction({
          id: `evt-${i}`,
          timestamp: Date.now() + i,
          modality: 'keyboard',
          target: `field-${i}`,
          confidence: 0.7,
        });
      }
      const recent = engine.getRecentInteractions(3);
      expect(recent).toHaveLength(3);
      expect(recent[0].id).toBe('evt-2');
    });
  });

  describe('Prediction Engine', () => {
    it('returns null with insufficient data', () => {
      expect(engine.predictNextInteraction()).toBeNull();
    });

    it('predicts based on interaction history', () => {
      for (let i = 0; i < 5; i++) {
        engine.recordInteraction({
          id: `evt-${i}`,
          timestamp: Date.now() + i * 100,
          modality: 'touch',
          target: 'button-save',
          confidence: 0.9,
        });
      }
      const prediction = engine.predictNextInteraction();
      expect(prediction).not.toBeNull();
      expect(prediction!.target).toBe('button-save');
      expect(prediction!.confidence).toBeGreaterThan(0);
      expect(prediction!.modality).toBe('touch');
    });

    it('returns higher confidence for consistent patterns', () => {
      // Consistent pattern
      for (let i = 0; i < 10; i++) {
        engine.recordInteraction({
          id: `evt-${i}`,
          timestamp: Date.now() + i * 100,
          modality: 'mouse',
          target: 'nav-home',
          confidence: 0.95,
        });
      }
      const prediction = engine.predictNextInteraction();
      expect(prediction!.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('Pattern Recognition', () => {
    it('creates patterns from interactions', () => {
      engine.recordInteraction({
        id: 'evt-1',
        timestamp: Date.now(),
        modality: 'touch',
        target: 'menu',
        confidence: 0.8,
      });
      expect(engine.getPatternCount()).toBe(1);
    });

    it('updates existing patterns', () => {
      for (let i = 0; i < 5; i++) {
        engine.recordInteraction({
          id: `evt-${i}`,
          timestamp: Date.now() + i,
          modality: 'touch',
          target: 'menu',
          confidence: 0.8,
        });
      }
      expect(engine.getPatternCount()).toBe(1);
      const patterns = engine.getPatterns();
      expect(patterns[0].frequency).toBe(5);
    });

    it('returns top patterns sorted by frequency', () => {
      for (let i = 0; i < 10; i++) {
        engine.recordInteraction({
          id: `evt-a-${i}`,
          timestamp: Date.now() + i,
          modality: 'touch',
          target: 'button-a',
          confidence: 0.8,
        });
      }
      for (let i = 0; i < 3; i++) {
        engine.recordInteraction({
          id: `evt-b-${i}`,
          timestamp: Date.now() + 100 + i,
          modality: 'mouse',
          target: 'button-b',
          confidence: 0.7,
        });
      }
      const top = engine.getTopPatterns(1);
      expect(top[0].name).toContain('button-a');
    });
  });

  describe('φ-Layout Generation', () => {
    it('generates layout cells', () => {
      const cells = engine.generatePhiLayout(5, 1000, 800);
      expect(cells).toHaveLength(5);
    });

    it('assigns correct phi ratios', () => {
      const PHI = (1 + Math.sqrt(5)) / 2;
      const PHI_INVERSE = 1 / PHI;
      const cells = engine.generatePhiLayout(4, 1000, 800);
      expect(cells[0].phiRatio).toBeCloseTo(PHI, 5);
      expect(cells[1].phiRatio).toBeCloseTo(PHI_INVERSE, 5);
    });

    it('positions cells within container bounds', () => {
      const cells = engine.generatePhiLayout(10, 1000, 800);
      for (const cell of cells) {
        expect(cell.x).toBeGreaterThanOrEqual(0);
        expect(cell.x).toBeLessThanOrEqual(1000);
        expect(cell.y).toBeGreaterThanOrEqual(0);
        expect(cell.y).toBeLessThanOrEqual(800);
      }
    });

    it('manages layout mode', () => {
      expect(engine.getLayoutMode()).toBe('grid');
      engine.setLayoutMode('spiral');
      expect(engine.getLayoutMode()).toBe('spiral');
    });
  });

  describe('Emotion Detection', () => {
    it('starts neutral', () => {
      expect(engine.getEmotionState()).toBe('neutral');
    });

    it('detects frustration from rapid interactions', () => {
      const now = Date.now();
      for (let i = 0; i < 25; i++) {
        engine.recordInteraction({
          id: `evt-${i}`,
          timestamp: now,
          modality: 'touch',
          target: 'button',
          confidence: 0.5,
        });
      }
      expect(engine.getEmotionState()).toBe('frustrated');
    });

    it('detects flowing state from high confidence', () => {
      engine.recordInteraction({
        id: 'evt-1',
        timestamp: Date.now(),
        modality: 'keyboard',
        target: 'editor',
        confidence: 0.95,
      });
      expect(engine.getEmotionState()).toBe('flowing');
    });

    it('allows manual emotion setting', () => {
      engine.setEmotionState('delighted');
      expect(engine.getEmotionState()).toBe('delighted');
    });
  });

  describe('Adaptive Decisions', () => {
    it('returns null when inactive', () => {
      for (let i = 0; i < 5; i++) {
        engine.recordInteraction({
          id: `evt-${i}`,
          timestamp: Date.now() + i,
          modality: 'mouse',
          target: 'btn',
          confidence: 0.9,
        });
      }
      expect(engine.generateAdaptation()).toBeNull();
    });

    it('generates adaptation when active with data', () => {
      engine.activate();
      for (let i = 0; i < 5; i++) {
        engine.recordInteraction({
          id: `evt-${i}`,
          timestamp: Date.now() + i * 100,
          modality: 'touch',
          target: 'save-btn',
          confidence: 0.9,
        });
      }
      const decision = engine.generateAdaptation();
      expect(decision).not.toBeNull();
      expect(decision!.target).toBe('save-btn');
      expect(decision!.confidence).toBeGreaterThan(0);
      expect(decision!.phiWeight).toBeGreaterThan(0);
    });

    it('tracks decision count', () => {
      engine.activate();
      for (let i = 0; i < 3; i++) {
        engine.recordInteraction({
          id: `evt-${i}`,
          timestamp: Date.now() + i * 100,
          modality: 'mouse',
          target: 'link',
          confidence: 0.8,
        });
      }
      engine.generateAdaptation();
      engine.generateAdaptation();
      expect(engine.getDecisionCount()).toBe(2);
    });
  });

  describe('UX Health Report', () => {
    it('generates health report', () => {
      const report = engine.computeHealthReport();
      expect(report.score).toBeGreaterThanOrEqual(0);
      expect(report.score).toBeLessThanOrEqual(1);
      expect(report.level).toBeDefined();
      expect(report.timestamp).toBeGreaterThan(0);
    });

    it('reports optimal health with good interactions', () => {
      for (let i = 0; i < 20; i++) {
        engine.recordInteraction({
          id: `evt-${i}`,
          timestamp: Date.now() + i * 1000,
          modality: 'mouse',
          target: `target-${i % 5}`,
          confidence: 0.95,
        });
      }
      const report = engine.computeHealthReport();
      expect(report.interactionSuccess).toBeGreaterThan(0.9);
    });

    it('health score accessible via getter', () => {
      engine.computeHealthReport();
      expect(engine.getHealthScore()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Configuration', () => {
    it('returns default config', () => {
      const config = engine.getConfig();
      expect(config.predictionDepth).toBe(5);
      expect(config.maxPatterns).toBe(144);
    });

    it('updates config partially', () => {
      engine.updateConfig({ predictionDepth: 10 });
      expect(engine.getConfig().predictionDepth).toBe(10);
      expect(engine.getConfig().maxPatterns).toBe(144); // unchanged
    });
  });

  describe('Intelligence Report', () => {
    it('returns comprehensive report', () => {
      engine.activate();
      engine.recordInteraction({
        id: 'evt-1',
        timestamp: Date.now(),
        modality: 'touch',
        target: 'btn',
        confidence: 0.9,
      });
      const report = engine.getIntelligenceReport();
      expect(report.charter).toBe('UX-AI-001');
      expect(report.active).toBe(true);
      expect(report.interactions).toBe(1);
      expect(report.patterns).toBe(1);
    });
  });

  describe('Singleton', () => {
    it('returns same instance', () => {
      const a = getFullUxAiEngine();
      const b = getFullUxAiEngine();
      expect(a).toBe(b);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MULTI-ENGINE ORCHESTRATOR TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('MultiEngineOrchestrator [MULTI-ENG-001]', () => {
  let orchestrator: MultiEngineOrchestrator;

  beforeEach(() => {
    orchestrator = new MultiEngineOrchestrator();
  });

  describe('Lifecycle', () => {
    it('starts inactive', () => {
      expect(orchestrator.isActive()).toBe(false);
    });

    it('activates all engines', () => {
      orchestrator.activate();
      expect(orchestrator.isActive()).toBe(true);
      const engines = orchestrator.getAllEngines();
      for (const engine of engines) {
        expect(engine.status).toBe('ready');
      }
    });

    it('deactivates all engines', () => {
      orchestrator.activate();
      orchestrator.deactivate();
      expect(orchestrator.isActive()).toBe(false);
    });

    it('has correct charter', () => {
      expect(orchestrator.charter).toBe('MULTI-ENG-001');
      expect(orchestrator.name).toBe('Multi-Engine Orchestrator');
    });
  });

  describe('Engine Management', () => {
    it('initializes with 8 default engines', () => {
      expect(orchestrator.getEngineCount()).toBe(8);
    });

    it('has all 8 domains covered', () => {
      const domains: EngineDomain[] = ['ux', 'reasoning', 'memory', 'prediction', 'creative', 'security', 'optimization', 'communication'];
      for (const domain of domains) {
        const engines = orchestrator.getEnginesByDomain(domain);
        expect(engines.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('registers new engines', () => {
      const engine = orchestrator.registerEngine('ux', 'UX Engine v2', 'UX-002');
      expect(engine.domain).toBe('ux');
      expect(engine.name).toBe('UX Engine v2');
    });

    it('respects max engines per domain', () => {
      orchestrator.registerEngine('ux', 'UX-2', 'UX-002');
      orchestrator.registerEngine('ux', 'UX-3', 'UX-003');
      orchestrator.registerEngine('ux', 'UX-4', 'UX-004');
      // Default max is 3, so oldest should be removed
      const uxEngines = orchestrator.getEnginesByDomain('ux');
      expect(uxEngines.length).toBeLessThanOrEqual(3);
    });

    it('removes engines', () => {
      const engines = orchestrator.getAllEngines();
      const id = engines[0].id;
      expect(orchestrator.removeEngine(id)).toBe(true);
      expect(orchestrator.getEngine(id)).toBeUndefined();
    });
  });

  describe('Task Management', () => {
    it('submits tasks', () => {
      const task = orchestrator.submitTask('reasoning', { query: 'test' });
      expect(task.id).toBeDefined();
      expect(task.domain).toBe('reasoning');
      expect(task.status).toBe('pending');
    });

    it('routes tasks when active', () => {
      orchestrator.activate();
      const task = orchestrator.submitTask('memory', { data: 'store this' }, 'high');
      expect(task.status).toBe('assigned');
      expect(task.assignedEngine).toBeDefined();
    });

    it('executes tasks and returns results', () => {
      orchestrator.activate();
      const task = orchestrator.submitTask('prediction', { input: [1, 2, 3] });
      const result = orchestrator.executeTask(task.id, { prediction: 42 }, 0.95);
      expect(result).not.toBeNull();
      expect(result!.confidence).toBe(0.95);
      expect(result!.domain).toBe('prediction');
    });

    it('handles task failure', () => {
      orchestrator.activate();
      const task = orchestrator.submitTask('security', { scan: true });
      orchestrator.failTask(task.id);
      const updated = orchestrator.getTask(task.id);
      expect(updated!.status).toBe('failed');
    });

    it('tracks pending and completed tasks', () => {
      orchestrator.activate();
      const t1 = orchestrator.submitTask('ux', { action: 'adapt' });
      const t2 = orchestrator.submitTask('creative', { prompt: 'design' });
      orchestrator.executeTask(t1.id, { result: 'done' }, 0.9);

      expect(orchestrator.getCompletedTasks()).toHaveLength(1);
      expect(orchestrator.getPendingTasks()).toHaveLength(1);
    });
  });

  describe('Consensus Engine', () => {
    it('computes phi-weighted consensus', () => {
      const results: EngineResult[] = [
        { engineId: 'e1', domain: 'reasoning', output: 'answer-A', confidence: 0.9, executionTimeMs: 100, phiCoherence: 0.8, timestamp: Date.now() },
        { engineId: 'e2', domain: 'reasoning', output: 'answer-B', confidence: 0.7, executionTimeMs: 150, phiCoherence: 0.6, timestamp: Date.now() + 10 },
        { engineId: 'e3', domain: 'reasoning', output: 'answer-A', confidence: 0.85, executionTimeMs: 120, phiCoherence: 0.75, timestamp: Date.now() + 20 },
      ];

      const consensus = orchestrator.computeConsensus(results);
      expect(consensus.overallConfidence).toBeGreaterThan(0);
      expect(consensus.strategy).toBe('phi_weighted');
      expect(consensus.participatingEngines).toHaveLength(3);
    });

    it('computes highest-confidence consensus', () => {
      const results: EngineResult[] = [
        { engineId: 'e1', domain: 'ux', output: 'low', confidence: 0.3, executionTimeMs: 50, phiCoherence: 0.5, timestamp: Date.now() },
        { engineId: 'e2', domain: 'ux', output: 'high', confidence: 0.99, executionTimeMs: 200, phiCoherence: 0.9, timestamp: Date.now() + 10 },
      ];

      const consensus = orchestrator.computeConsensus(results, 'highest_confidence');
      expect(consensus.fusedOutput).toBe('high');
      expect(consensus.overallConfidence).toBe(0.99);
    });

    it('computes first-responder consensus', () => {
      const now = Date.now();
      const results: EngineResult[] = [
        { engineId: 'e1', domain: 'prediction', output: 'fast', confidence: 0.7, executionTimeMs: 10, phiCoherence: 0.6, timestamp: now },
        { engineId: 'e2', domain: 'prediction', output: 'slow', confidence: 0.95, executionTimeMs: 500, phiCoherence: 0.9, timestamp: now + 500 },
      ];

      const consensus = orchestrator.computeConsensus(results, 'first_responder');
      expect(consensus.fusedOutput).toBe('fast');
    });

    it('handles empty results gracefully', () => {
      const consensus = orchestrator.computeConsensus([]);
      expect(consensus.fusedOutput).toBeNull();
      expect(consensus.overallConfidence).toBe(0);
    });

    it('tracks consensus history', () => {
      const results: EngineResult[] = [
        { engineId: 'e1', domain: 'memory', output: 'data', confidence: 0.8, executionTimeMs: 50, phiCoherence: 0.7, timestamp: Date.now() },
      ];
      orchestrator.computeConsensus(results);
      orchestrator.computeConsensus(results);
      expect(orchestrator.getConsensusHistory()).toHaveLength(2);
    });
  });

  describe('Metrics', () => {
    it('returns orchestrator metrics', () => {
      const metrics = orchestrator.getMetrics();
      expect(metrics.totalEngines).toBe(8);
      expect(metrics.totalTasks).toBe(0);
      expect(metrics.uptime).toBeGreaterThanOrEqual(0);
    });

    it('updates metrics after task execution', () => {
      orchestrator.activate();
      const task = orchestrator.submitTask('optimization', { optimize: true });
      orchestrator.executeTask(task.id, { optimized: true }, 0.88);

      const metrics = orchestrator.getMetrics();
      expect(metrics.completedTasks).toBe(1);
      expect(metrics.averageConfidence).toBeCloseTo(0.88, 1);
    });

    it('tracks failed tasks in metrics', () => {
      orchestrator.activate();
      const task = orchestrator.submitTask('communication', { msg: 'hello' });
      orchestrator.failTask(task.id);

      const metrics = orchestrator.getMetrics();
      expect(metrics.failedTasks).toBe(1);
    });
  });

  describe('Configuration', () => {
    it('returns default config', () => {
      const config = orchestrator.getConfig();
      expect(config.maxEnginesPerDomain).toBe(3);
      expect(config.consensusStrategy).toBe('phi_weighted');
      expect(config.maxConcurrentTasks).toBe(89);
    });

    it('updates config', () => {
      orchestrator.updateConfig({ maxConcurrentTasks: 144 });
      expect(orchestrator.getConfig().maxConcurrentTasks).toBe(144);
    });
  });

  describe('Intelligence Report', () => {
    it('returns comprehensive report', () => {
      orchestrator.activate();
      const report = orchestrator.getIntelligenceReport();
      expect(report.charter).toBe('MULTI-ENG-001');
      expect(report.active).toBe(true);
      expect(report.engines).toBe(8);
      expect(report.domains).toHaveLength(8);
    });
  });

  describe('Singleton', () => {
    it('returns same instance', () => {
      const a = getMultiEngineOrchestrator();
      const b = getMultiEngineOrchestrator();
      expect(a).toBe(b);
    });
  });
});
