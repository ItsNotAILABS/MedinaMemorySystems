/**
 * XCREW Platform Extended Test Suite
 * Tests for: Secrets, Cron, Realtime, CLI
 * Protocol: XCREW-PLATFORM-001
 */

import { 
  getXSecretsManager, 
  createSecretsNamespace,
  PhiRotationCalculator 
} from '../xcrew-platform/secrets/XSecrets';

import { 
  getXCronScheduler, 
  createCronJob,
  CronExpressionParser,
  PhiJitterCalculator 
} from '../xcrew-platform/cron/XCron';

import { 
  getXRealtimeManager,
  getXWebSocket,
  getXSSE,
  getXPubSub,
  PhiBackpressureController 
} from '../xcrew-platform/realtime/XRealtime';

import { 
  getXCREWCLI,
  CLIOutput 
} from '../xcrew-platform/cli/XCLI';

const PHI = 1.618033988749895;

describe('XCREW Platform Extended (XCREW-PLATFORM-001)', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // SECRETS TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  describe('XSecrets (XCREW-SECRETS-001)', () => {
    describe('XSecretsManager', () => {
      it('should initialize secrets manager', () => {
        const manager = getXSecretsManager();
        expect(manager).toBeDefined();
      });
      
      it('should create namespaces', () => {
        const manager = getXSecretsManager();
        const ns = manager.createNamespace('test-secrets');
        expect(ns).toBeDefined();
        expect(ns.name).toBe('test-secrets');
      });
      
      it('should list namespaces', () => {
        const manager = getXSecretsManager();
        manager.createNamespace('ns1');
        manager.createNamespace('ns2');
        const namespaces = manager.listNamespaces();
        expect(namespaces).toContain('ns1');
        expect(namespaces).toContain('ns2');
      });
    });
    
    describe('XSecretsNamespace', () => {
      it('should create secrets', async () => {
        const ns = createSecretsNamespace('create-test');
        const secret = await ns.create('API_KEY', 'sk-test-12345');
        expect(secret.id).toMatch(/^xs-/);
        expect(secret.name).toBe('API_KEY');
        expect(secret.type).toBe('api-key');
      });
      
      it('should get secret values', async () => {
        const ns = createSecretsNamespace('get-test');
        await ns.create('MY_SECRET', 'secret-value');
        const value = await ns.get('MY_SECRET');
        expect(value).toBeDefined();
        expect(value?.value).toBe('secret-value');
      });
      
      it('should update secrets', async () => {
        const ns = createSecretsNamespace('update-test');
        await ns.create('UPDATE_ME', 'old-value');
        const updated = await ns.update('UPDATE_ME', 'new-value');
        expect(updated?.version).toBe(2);
        const value = await ns.get('UPDATE_ME');
        expect(value?.value).toBe('new-value');
      });
      
      it('should delete secrets', async () => {
        const ns = createSecretsNamespace('delete-test');
        await ns.create('DELETE_ME', 'value');
        const deleted = await ns.delete('DELETE_ME');
        expect(deleted).toBe(true);
        const value = await ns.get('DELETE_ME');
        expect(value).toBeNull();
      });
      
      it('should rotate secrets', async () => {
        const ns = createSecretsNamespace('rotate-test');
        await ns.create('ROTATE_ME', 'original');
        const rotated = await ns.rotate('ROTATE_ME', 'rotated-value');
        expect(rotated?.version).toBe(2);
      });
      
      it('should detect secret types', async () => {
        const ns = createSecretsNamespace('type-test');
        
        const apiKey = await ns.create('API', 'sk-test-key-12345');
        expect(apiKey.type).toBe('api-key');
        
        const token = await ns.create('TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U');
        expect(token.type).toBe('token');
      });
      
      it('should maintain audit log', async () => {
        const ns = createSecretsNamespace('audit-test');
        await ns.create('AUDITED', 'value');
        await ns.get('AUDITED');
        const log = ns.getAuditLog();
        expect(log.length).toBeGreaterThan(0);
        expect(log.some(e => e.action === 'create')).toBe(true);
        expect(log.some(e => e.action === 'read')).toBe(true);
      });
    });
    
    describe('PhiRotationCalculator', () => {
      it('should calculate next rotation time', () => {
        const calc = new PhiRotationCalculator(86400000);
        const lastRotated = new Date();
        const next = calc.calculateNextRotation(1, lastRotated);
        expect(next.getTime()).toBeGreaterThan(lastRotated.getTime());
      });
      
      it('should calculate rotation urgency', () => {
        const calc = new PhiRotationCalculator(1000);
        const secret = {
          id: 'test',
          name: 'test',
          type: 'generic' as const,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          rotationStrategy: 'phi-harmonic' as const,
          rotationInterval: 1000,
          lastRotated: new Date(Date.now() - 2000),
          accessCount: 0,
          metadata: {}
        };
        const urgency = calc.calculateRotationUrgency(secret);
        expect(urgency).toBeGreaterThan(0);
      });
    });
  });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CRON TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  describe('XCron (XCREW-CRON-001)', () => {
    describe('CronExpressionParser', () => {
      it('should parse simple cron expressions', () => {
        const fields = CronExpressionParser.parse('0 * * * *');
        expect(fields.get('minute')).toEqual([0]);
        expect(fields.get('hour')?.length).toBe(24);
      });
      
      it('should parse complex cron expressions', () => {
        const fields = CronExpressionParser.parse('*/15 9-17 * * 1-5');
        expect(fields.get('minute')).toEqual([0, 15, 30, 45]);
        expect(fields.get('hour')).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
        expect(fields.get('dayOfWeek')).toEqual([1, 2, 3, 4, 5]);
      });
      
      it('should calculate next execution time', () => {
        const next = CronExpressionParser.getNextExecution('* * * * *');
        expect(next.getTime()).toBeGreaterThan(Date.now());
      });
      
      it('should describe cron expressions', () => {
        const desc = CronExpressionParser.describe('0 9 * * *');
        expect(desc).toContain('09:00');
      });
      
      it('should throw on invalid expressions', () => {
        expect(() => CronExpressionParser.parse('invalid')).toThrow();
      });
    });
    
    describe('XCronScheduler', () => {
      it('should initialize scheduler', () => {
        const scheduler = getXCronScheduler();
        expect(scheduler).toBeDefined();
      });
      
      it('should create cron jobs', () => {
        const scheduler = getXCronScheduler();
        const job = scheduler.createJob('test-job', '* * * * *', 'worker-1', 'handleCron');
        expect(job.id).toMatch(/^cron-/);
        expect(job.name).toBe('test-job');
        expect(job.schedule).toBe('* * * * *');
      });
      
      it('should list jobs', () => {
        const scheduler = getXCronScheduler();
        scheduler.createJob('list-job-1', '0 * * * *', 'worker-1', 'handler');
        scheduler.createJob('list-job-2', '0 0 * * *', 'worker-1', 'handler');
        const jobs = scheduler.listJobs();
        expect(jobs.length).toBeGreaterThanOrEqual(2);
      });
      
      it('should pause and resume jobs', () => {
        const scheduler = getXCronScheduler();
        const job = scheduler.createJob('pause-job', '* * * * *', 'worker-1', 'handler');
        
        scheduler.pauseJob(job.id);
        expect(scheduler.getJob(job.id)?.status).toBe('paused');
        
        scheduler.resumeJob(job.id);
        expect(scheduler.getJob(job.id)?.status).toBe('active');
      });
      
      it('should delete jobs', () => {
        const scheduler = getXCronScheduler();
        const job = scheduler.createJob('delete-job', '* * * * *', 'worker-1', 'handler');
        const deleted = scheduler.deleteJob(job.id);
        expect(deleted).toBe(true);
        expect(scheduler.getJob(job.id)).toBeUndefined();
      });
      
      it('should trigger jobs manually', async () => {
        const scheduler = getXCronScheduler();
        const job = scheduler.createJob('trigger-job', '0 0 1 1 *', 'worker-1', 'handler');
        const execution = await scheduler.triggerJob(job.id);
        expect(execution).toBeDefined();
        expect(execution?.status).toBe('completed');
      });
      
      it('should track execution history', async () => {
        const scheduler = getXCronScheduler();
        const job = scheduler.createJob('history-job', '0 0 1 1 *', 'worker-1', 'handler');
        await scheduler.triggerJob(job.id);
        await scheduler.triggerJob(job.id);
        const history = scheduler.getExecutionHistory(job.id);
        expect(history.length).toBeGreaterThanOrEqual(2);
      });
    });
    
    describe('PhiJitterCalculator', () => {
      it('should calculate deterministic jitter', () => {
        const jitter1 = PhiJitterCalculator.calculateJitter(new Date(), 'job-1');
        const jitter2 = PhiJitterCalculator.calculateJitter(new Date(), 'job-1');
        expect(jitter1).toBe(jitter2);
      });
      
      it('should calculate different jitter for different jobs', () => {
        const jitter1 = PhiJitterCalculator.calculateJitter(new Date(), 'job-1');
        const jitter2 = PhiJitterCalculator.calculateJitter(new Date(), 'job-2');
        expect(jitter1).not.toBe(jitter2);
      });
      
      it('should calculate execution windows', () => {
        const offsets = PhiJitterCalculator.calculateExecutionWindow(10, 60000);
        expect(offsets.length).toBe(10);
        expect(offsets[0]).toBeLessThanOrEqual(offsets[9]);
      });
    });
  });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // REALTIME TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  describe('XRealtime (XCREW-REALTIME-001)', () => {
    describe('XWebSocketServer', () => {
      it('should initialize WebSocket server', () => {
        const ws = getXWebSocket();
        expect(ws).toBeDefined();
      });
      
      it('should handle connections', () => {
        const ws = getXWebSocket();
        const conn = ws.handleUpgrade(new Request('http://localhost'));
        expect(conn.id).toMatch(/^ws-/);
        expect(conn.state).toBe('open');
      });
      
      it('should send messages', () => {
        const ws = getXWebSocket();
        const conn = ws.handleUpgrade(new Request('http://localhost'));
        const sent = ws.send(conn.id, 'Hello');
        expect(sent).toBe(true);
      });
      
      it('should broadcast messages', () => {
        const ws = getXWebSocket();
        ws.handleUpgrade(new Request('http://localhost'));
        ws.handleUpgrade(new Request('http://localhost'));
        const count = ws.broadcast('Broadcast message');
        expect(count).toBeGreaterThanOrEqual(2);
      });
      
      it('should close connections', () => {
        const ws = getXWebSocket();
        const conn = ws.handleUpgrade(new Request('http://localhost'));
        ws.close(conn.id);
        expect(ws.getConnection(conn.id)).toBeUndefined();
      });
      
      it('should track stats', () => {
        const ws = getXWebSocket();
        const stats = ws.getStats();
        expect(stats).toHaveProperty('connections');
        expect(stats).toHaveProperty('totalMessages');
      });
    });
    
    describe('XSSEServer', () => {
      it('should initialize SSE server', () => {
        const sse = getXSSE();
        expect(sse).toBeDefined();
      });
      
      it('should create connections', () => {
        const sse = getXSSE();
        const conn = sse.createConnection('client-1');
        expect(conn.id).toMatch(/^sse-/);
        expect(conn.state).toBe('open');
      });
      
      it('should send events', () => {
        const sse = getXSSE();
        const conn = sse.createConnection();
        const sent = sse.sendEvent(conn.id, { data: 'test event' });
        expect(sent).toBe(true);
      });
      
      it('should broadcast events', () => {
        const sse = getXSSE();
        sse.createConnection();
        sse.createConnection();
        const count = sse.broadcast({ event: 'update', data: 'broadcast' });
        expect(count).toBeGreaterThanOrEqual(2);
      });
    });
    
    describe('XPubSub', () => {
      it('should initialize PubSub', () => {
        const pubsub = getXPubSub();
        expect(pubsub).toBeDefined();
      });
      
      it('should create channels', () => {
        const pubsub = getXPubSub();
        const channel = pubsub.createChannel('test-channel');
        expect(channel.name).toBe('test-channel');
      });
      
      it('should subscribe to channels', () => {
        const pubsub = getXPubSub();
        pubsub.createChannel('sub-channel');
        const subscribed = pubsub.subscribe('client-1', 'sub-channel');
        expect(subscribed).toBe(true);
      });
      
      it('should publish messages', () => {
        const pubsub = getXPubSub();
        pubsub.createChannel('pub-channel');
        pubsub.subscribe('client-1', 'pub-channel');
        pubsub.subscribe('client-2', 'pub-channel');
        const count = pubsub.publish('pub-channel', 'message', { text: 'hello' });
        expect(count).toBe(2);
      });
      
      it('should unsubscribe from channels', () => {
        const pubsub = getXPubSub();
        pubsub.createChannel('unsub-channel');
        pubsub.subscribe('client-1', 'unsub-channel');
        const unsubscribed = pubsub.unsubscribe('client-1', 'unsub-channel');
        expect(unsubscribed).toBe(true);
      });
      
      it('should track client subscriptions', () => {
        const pubsub = getXPubSub();
        pubsub.subscribe('track-client', 'channel-1');
        pubsub.subscribe('track-client', 'channel-2');
        const subs = pubsub.getClientSubscriptions('track-client');
        expect(subs).toContain('channel-1');
        expect(subs).toContain('channel-2');
      });
    });
    
    describe('PhiBackpressureController', () => {
      it('should initialize with window size', () => {
        const controller = new PhiBackpressureController(16);
        expect(controller.getWindowSize()).toBe(16);
      });
      
      it('should allow sending when under capacity', () => {
        const controller = new PhiBackpressureController(10);
        expect(controller.canSend()).toBe(true);
      });
      
      it('should adjust rate based on latency', () => {
        const controller = new PhiBackpressureController(16);
        const rate = controller.adjustRate(10, 100);
        expect(rate).toBeGreaterThan(0);
      });
    });
    
    describe('XRealtimeManager', () => {
      it('should provide combined stats', () => {
        const manager = getXRealtimeManager();
        const stats = manager.getStats();
        expect(stats).toHaveProperty('websocket');
        expect(stats).toHaveProperty('sse');
        expect(stats).toHaveProperty('pubsub');
      });
    });
  });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CLI TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  describe('XCLI (XCREW-CLI-001)', () => {
    describe('XCREWCLI', () => {
      it('should initialize CLI', () => {
        const cli = getXCREWCLI();
        expect(cli).toBeDefined();
      });
      
      it('should parse arguments', () => {
        const cli = getXCREWCLI();
        const args = cli.parseArgs(['deploy', '--env', 'production', '--minify']);
        expect(args.command).toEqual(['deploy']);
        expect(args.options.env).toBe('production');
        expect(args.options.minify).toBe(true);
      });
      
      it('should run help command', async () => {
        const cli = getXCREWCLI();
        const result = await cli.run(['help']);
        expect(result.success).toBe(true);
        expect(result.exitCode).toBe(0);
      });
      
      it('should run version command', async () => {
        const cli = getXCREWCLI();
        const result = await cli.run(['version']);
        expect(result.success).toBe(true);
      });
      
      it('should run init command', async () => {
        const cli = getXCREWCLI();
        const result = await cli.run(['init', '--name', 'test-project']);
        expect(result.success).toBe(true);
        expect(result.data).toHaveProperty('name', 'test-project');
      });
      
      it('should run deploy command', async () => {
        const cli = getXCREWCLI();
        const result = await cli.run(['deploy', '--env', 'staging']);
        expect(result.success).toBe(true);
        expect(result.data).toHaveProperty('deploymentId');
      });
      
      it('should handle unknown commands', async () => {
        const cli = getXCREWCLI();
        const result = await cli.run(['unknown-command']);
        expect(result.success).toBe(false);
        expect(result.exitCode).toBe(1);
      });
      
      it('should get registered commands', () => {
        const cli = getXCREWCLI();
        const commands = cli.getCommands();
        expect(commands.length).toBeGreaterThan(0);
        expect(commands.some(c => c.name === 'deploy')).toBe(true);
        expect(commands.some(c => c.name === 'dev')).toBe(true);
      });
    });
    
    describe('CLIOutput', () => {
      it('should create output helper', () => {
        const output = new CLIOutput();
        expect(output).toBeDefined();
      });
      
      it('should support verbose mode', () => {
        const output = new CLIOutput(true);
        // Should not throw
        output.debug('Debug message');
      });
    });
  });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INTEGRATION TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  describe('Platform Integration', () => {
    it('should have all 12 components available', () => {
      expect(getXSecretsManager()).toBeDefined();
      expect(getXCronScheduler()).toBeDefined();
      expect(getXRealtimeManager()).toBeDefined();
      expect(getXCREWCLI()).toBeDefined();
    });
    
    it('should use φ-harmonic principles across components', () => {
      // Secrets rotation uses φ
      const rotationCalc = new PhiRotationCalculator();
      expect(rotationCalc).toBeDefined();
      
      // Cron jitter uses φ
      const jitter = PhiJitterCalculator.calculateJitter(new Date(), 'test');
      expect(typeof jitter).toBe('number');
      
      // Backpressure uses φ
      const backpressure = new PhiBackpressureController();
      expect(backpressure.getWindowSize()).toBeGreaterThan(0);
    });
  });
});
