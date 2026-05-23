/**
 * XCREW Edge Computing Platform - Test Suite
 * Protocol: XCREW-PLATFORM-001
 */

import { getXWorkerRuntime, createXWorker, XExecutionContext, PhiHarmonicScheduler } from '../xcrew-platform/core/XWorkerRuntime';
import { getXNetworkOrchestrator } from '../xcrew-platform/network/XNetworkOrchestrator';
import { getXStore } from '../xcrew-platform/storage/XStore';
import { getXQueue } from '../xcrew-platform/queues/XQueue';
import { getXDurable } from '../xcrew-platform/workers/XDurable';
import { getXAIGateway } from '../xcrew-platform/core/XAIGateway';

const PHI = 1.618033988749895;

describe('XCREW Platform (XCREW-PLATFORM-001)', () => {
  describe('XWorkerRuntime', () => {
    it('should create workers', () => {
      const runtime = getXWorkerRuntime();
      const worker = createXWorker(
        { name: 'test-worker', main: 'index.ts' },
        async (req, env, ctx) => new Response('OK')
      );
      expect(worker.id).toMatch(/^xw-/);
      expect(worker.config.name).toBe('test-worker');
    });

    it('should execute workers', async () => {
      const runtime = getXWorkerRuntime();
      const worker = createXWorker(
        { name: 'exec-worker', main: 'index.ts' },
        async (req) => new Response(`Hello ${req.url}`)
      );
      const response = await runtime.execute(worker.id, {
        url: 'https://test.xcrew.io',
        method: 'GET',
        headers: new Map()
      });
      expect(response.status).toBe(200);
    });

    it('should track metrics', async () => {
      const runtime = getXWorkerRuntime();
      const worker = createXWorker(
        { name: 'metrics-worker', main: 'index.ts' },
        async () => new Response('OK')
      );
      await runtime.execute(worker.id, { url: 'test', method: 'GET', headers: new Map() });
      const metrics = runtime.getWorkerMetrics(worker.id);
      expect(metrics?.invocations).toBeGreaterThan(0);
    });
  });

  describe('PhiHarmonicScheduler', () => {
    it('should calculate φ-based retry delays', () => {
      const scheduler = new PhiHarmonicScheduler();
      const delay1 = scheduler.calculateRetryDelay(1);
      const delay2 = scheduler.calculateRetryDelay(2);
      expect(delay2 / delay1).toBeCloseTo(PHI, 1);
    });

    it('should get φ-based concurrency limits', () => {
      const scheduler = new PhiHarmonicScheduler();
      const limit = scheduler.getConcurrencyLimit(10);
      expect(limit).toBe(Math.ceil(10 * PHI));
    });
  });

  describe('XExecutionContext', () => {
    it('should handle waitUntil', async () => {
      const ctx = new XExecutionContext();
      let completed = false;
      ctx.waitUntil(Promise.resolve().then(() => { completed = true; }));
      await ctx.flush();
      expect(completed).toBe(true);
    });

    it('should handle passThroughOnException', () => {
      const ctx = new XExecutionContext();
      expect(ctx.shouldPassThrough()).toBe(false);
      ctx.passThroughOnException();
      expect(ctx.shouldPassThrough()).toBe(true);
    });
  });

  describe('XNetworkOrchestrator', () => {
    it('should initialize with edge locations', () => {
      const network = getXNetworkOrchestrator();
      expect(network).toBeDefined();
      const locations = network.getEdgeLocations();
      expect(locations.length).toBeGreaterThan(0);
    });

    it('should route requests to nearest edge', () => {
      const network = getXNetworkOrchestrator();
      const decision = network.route({ latitude: 40.7128, longitude: -74.0060 });
      expect(decision.primaryEdge).toBeDefined();
      expect(decision.phiScore).toBeGreaterThan(0);
    });
  });

  describe('XStore', () => {
    it('should create KV namespaces', () => {
      const store = getXStore();
      const kv = store.createKV('test-namespace');
      expect(kv).toBeDefined();
    });

    it('should put and get values', async () => {
      const store = getXStore();
      const kv = store.createKV('test-kv');
      await kv.put('key1', 'value1');
      const value = await kv.get('key1');
      expect(value).toBe('value1');
    });

    it('should create R2 buckets', () => {
      const store = getXStore();
      const r2 = store.createR2('test-bucket');
      expect(r2).toBeDefined();
    });
  });

  describe('XQueue', () => {
    it('should create queues', () => {
      const queueManager = getXQueue();
      const queue = queueManager.create('test-queue');
      expect(queue).toBeDefined();
    });

    it('should send and receive messages', async () => {
      const queueManager = getXQueue();
      const queue = queueManager.create('msg-queue');
      await queue.send({ data: 'test-message' });
      const batch = await queue.receive();
      expect(batch.messages.length).toBeGreaterThan(0);
    });

    it('should use φ-harmonic backoff', () => {
      const queueManager = getXQueue();
      const delay1 = queueManager.calculateBackoff(1);
      const delay2 = queueManager.calculateBackoff(2);
      expect(delay2 / delay1).toBeCloseTo(PHI, 1);
    });
  });

  describe('XDurable', () => {
    it('should create durable object stubs', () => {
      const durable = getXDurable();
      const stub = durable.get('test-do', 'TestClass');
      expect(stub).toBeDefined();
      expect(stub.id).toBeDefined();
    });

    it('should persist state', async () => {
      const durable = getXDurable();
      const stub = durable.get('state-do', 'StateClass');
      await stub.storage.put('key', 'value');
      const value = await stub.storage.get('key');
      expect(value).toBe('value');
    });
  });

  describe('XAIGateway', () => {
    it('should initialize AI gateway', () => {
      const gateway = getXAIGateway();
      expect(gateway).toBeDefined();
    });

    it('should list available models', () => {
      const gateway = getXAIGateway();
      const models = gateway.listModels();
      expect(models.length).toBeGreaterThan(0);
    });

    it('should use φ-weighted load balancing', () => {
      const gateway = getXAIGateway();
      const config = gateway.getConfig();
      expect(config.phiLoadBalance).toBe(true);
    });
  });

  describe('Platform Integration', () => {
    it('should achieve target φ-coherence score', () => {
      const runtime = getXWorkerRuntime();
      const score = runtime.getPhiCoherenceScore();
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should support all runtime types', () => {
      const runtimes = ['v8-isolate', 'wasm', 'deno', 'node', 'bun'];
      runtimes.forEach(rt => {
        const worker = createXWorker(
          { name: `${rt}-worker`, main: 'index.ts', runtime: rt as any },
          async () => new Response('OK')
        );
        expect(worker.config.runtime).toBe(rt);
      });
    });
  });
});
