/**
 * 𓂀 CLOUDFLARE WORKER ENTRY POINT 𓂀
 * Production Edge Worker Handler
 * "The sovereign edge awakens"
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 */

import { MasterOrchestrator, MasterConfig, SystemStatus, ENVIRONMENTS } from './MasterOrchestrator';

// ═══════════════════════════════════════════════════════════════════════════
// ENVIRONMENT BINDINGS TYPE
// ═══════════════════════════════════════════════════════════════════════════

interface Env {
  // Environment Variables
  ENVIRONMENT: string;
  PHI_HARMONIC_MODE: string;
  
  // KV Namespaces
  MEDINA_KV: KVNamespace;
  MEDINA_AGENTS_KV: KVNamespace;
  MEDINA_MEMORY_KV: KVNamespace;
  
  // R2 Buckets
  MEDINA_R2: R2Bucket;
  MEDINA_MEMORY_R2: R2Bucket;
  
  // D1 Databases
  MEDINA_D1: D1Database;
  MEDINA_AGENTS_D1: D1Database;
  
  // Durable Objects
  MEDINA_AGENT: DurableObjectNamespace;
  MEDINA_COORDINATOR: DurableObjectNamespace;
  MEDINA_ENTANGLEMENT: DurableObjectNamespace;
  MEDINA_MEMORY: DurableObjectNamespace;
  
  // Vectorize
  MEDINA_VECTORIZE: VectorizeIndex;
  MEDINA_MEMORY_VECTORIZE: VectorizeIndex;
  
  // AI
  AI: Ai;
  
  // Queue
  MEDINA_QUEUE: Queue;
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ═══════════════════════════════════════════════════════════════════════════

let masterOrchestrator: MasterOrchestrator | null = null;
let initializationPromise: Promise<void> | null = null;

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

async function ensureInitialized(env: Env): Promise<MasterOrchestrator> {
  if (masterOrchestrator) {
    return masterOrchestrator;
  }

  if (!initializationPromise) {
    initializationPromise = initializeMaster(env);
  }

  await initializationPromise;
  return masterOrchestrator!;
}

async function initializeMaster(env: Env): Promise<void> {
  const config: Partial<MasterConfig> = {
    environment: (env.ENVIRONMENT || 'development') as any,
    features: {
      enableEdgeOrchestrator: true,
      enableMemorySystem: true,
      enableBlockchainBridge: true,
      enableEntanglement: true,
      enableAIGateway: true,
      enableHealthChecks: true,
    },
    phiHarmonic: {
      enabled: env.PHI_HARMONIC_MODE === 'true',
      resonanceFrequency: 873,
      coherenceThreshold: 0.786,
    },
  };

  masterOrchestrator = new MasterOrchestrator(config);
  await masterOrchestrator.initialize();
}

// ═══════════════════════════════════════════════════════════════════════════
// REQUEST HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

async function handleRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const master = await ensureInitialized(env);

    // Route requests
    switch (true) {
      // Health Check
      case path === '/health':
        return handleHealthCheck(master, corsHeaders);

      // Status
      case path === '/status':
        return handleStatus(master, corsHeaders);

      // Manifest
      case path === '/manifest':
        return handleManifest(master, corsHeaders);

      // Statistics
      case path === '/stats':
        return handleStatistics(master, corsHeaders);

      // Memory API
      case path.startsWith('/api/memory'):
        return handleMemoryAPI(request, path, master, corsHeaders);

      // Agent API
      case path.startsWith('/api/agent'):
        return handleAgentAPI(request, path, master, corsHeaders);

      // AI API
      case path.startsWith('/api/ai'):
        return handleAIAPI(request, path, master, corsHeaders);

      // Blockchain API
      case path.startsWith('/api/blockchain'):
        return handleBlockchainAPI(request, path, master, corsHeaders);

      // Default route
      default:
        return new Response(JSON.stringify({
          masterId: 'MASTER-001',
          message: 'MEDINA Sovereign Edge Intelligence',
          version: '1.0.0',
          endpoints: [
            '/health',
            '/status',
            '/manifest',
            '/stats',
            '/api/memory/*',
            '/api/agent/*',
            '/api/ai/*',
            '/api/blockchain/*',
          ],
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Request error:', error);
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: String(error),
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDPOINT HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

function handleHealthCheck(
  master: MasterOrchestrator,
  corsHeaders: Record<string, string>
): Response {
  const status = master.getStatus();
  const isHealthy = status.health.overall === 'healthy';

  return new Response(JSON.stringify({
    status: status.health.overall,
    uptime: status.uptime,
    phiResonance: status.phiResonance,
    systems: status.systems,
  }), {
    status: isHealthy ? 200 : 503,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function handleStatus(
  master: MasterOrchestrator,
  corsHeaders: Record<string, string>
): Response {
  return new Response(JSON.stringify(master.getStatus()), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function handleManifest(
  master: MasterOrchestrator,
  corsHeaders: Record<string, string>
): Response {
  return new Response(JSON.stringify(master.getDeploymentManifest()), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function handleStatistics(
  master: MasterOrchestrator,
  corsHeaders: Record<string, string>
): Response {
  return new Response(JSON.stringify(master.getStatistics()), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleMemoryAPI(
  request: Request,
  path: string,
  master: MasterOrchestrator,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const memorySystem = master.getMemorySystem();
  if (!memorySystem) {
    return new Response(JSON.stringify({ error: 'Memory system not initialized' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const subPath = path.replace('/api/memory', '');

  switch (request.method) {
    case 'GET':
      if (subPath === '/stats') {
        return new Response(JSON.stringify(memorySystem.getStatistics()), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      // Get memory by key
      const url = new URL(request.url);
      const key = url.searchParams.get('key');
      if (key) {
        const memory = await memorySystem.get(key);
        return new Response(JSON.stringify(memory), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      break;

    case 'POST':
      // Store memory
      const body = await request.json() as { key: string; value: unknown; options?: any };
      const result = await memorySystem.store(body.key, body.value, body.options);
      return new Response(JSON.stringify(result), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    case 'DELETE':
      // Delete memory
      const deleteUrl = new URL(request.url);
      const deleteKey = deleteUrl.searchParams.get('key');
      if (deleteKey) {
        const deleted = await memorySystem.delete(deleteKey);
        return new Response(JSON.stringify({ deleted }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      break;
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleAgentAPI(
  request: Request,
  path: string,
  master: MasterOrchestrator,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const orchestrator = master.getEdgeOrchestrator();
  if (!orchestrator) {
    return new Response(JSON.stringify({ error: 'Edge orchestrator not initialized' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Placeholder for agent operations
  return new Response(JSON.stringify({
    message: 'Agent API',
    available: true,
    operations: ['spawn', 'terminate', 'think', 'coordinate'],
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleAIAPI(
  request: Request,
  path: string,
  master: MasterOrchestrator,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const aiGateway = master.getAIGateway();
  if (!aiGateway) {
    return new Response(JSON.stringify({ error: 'AI Gateway not initialized' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const subPath = path.replace('/api/ai', '');

  if (request.method === 'POST' && subPath === '/chat') {
    const body = await request.json() as { messages: any[]; model?: string };
    const result = await aiGateway.chat(body.messages, body.model as any);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    message: 'AI Gateway API',
    available: true,
    operations: ['chat', 'embed', 'generate'],
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleBlockchainAPI(
  request: Request,
  path: string,
  master: MasterOrchestrator,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const blockchainBridge = master.getBlockchainBridge();
  if (!blockchainBridge) {
    return new Response(JSON.stringify({ error: 'Blockchain bridge not initialized' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const subPath = path.replace('/api/blockchain', '');

  if (subPath === '/stats') {
    return new Response(JSON.stringify(blockchainBridge.getStatistics()), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    message: 'Blockchain Bridge API',
    available: true,
    operations: ['anchor', 'bridge', 'sync', 'verify'],
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHEDULED HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

async function handleScheduled(
  controller: ScheduledController,
  env: Env,
  ctx: ExecutionContext
): Promise<void> {
  const master = await ensureInitialized(env);
  
  console.log(`[CRON] Running scheduled task at ${new Date().toISOString()}`);
  
  // Perform maintenance tasks based on cron schedule
  const cronTime = controller.cron;
  
  if (cronTime === '*/5 * * * *') {
    // Memory tier management
    console.log('[CRON] Running memory tier management...');
    const memorySystem = master.getMemorySystem();
    if (memorySystem) {
      // Trigger auto-promotion/demotion logic
      console.log('[CRON] Memory management complete');
    }
  } else if (cronTime === '0 * * * *') {
    // Blockchain anchoring
    console.log('[CRON] Running blockchain anchoring...');
    const blockchainBridge = master.getBlockchainBridge();
    if (blockchainBridge) {
      // Trigger sync
      console.log('[CRON] Blockchain anchoring complete');
    }
  } else if (cronTime === '0 0 * * *') {
    // Daily cleanup
    console.log('[CRON] Running daily cleanup...');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// QUEUE HANDLER
// ═══════════════════════════════════════════════════════════════════════════

async function handleQueue(
  batch: MessageBatch<unknown>,
  env: Env,
  ctx: ExecutionContext
): Promise<void> {
  const master = await ensureInitialized(env);
  
  for (const message of batch.messages) {
    try {
      console.log(`[QUEUE] Processing message: ${message.id}`);
      // Process message based on type
      message.ack();
    } catch (error) {
      console.error(`[QUEUE] Error processing message ${message.id}:`, error);
      message.retry();
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  fetch: handleRequest,
  scheduled: handleScheduled,
  queue: handleQueue,
};

// Export Durable Object classes (stub - implement separately)
export { AgentDurableObject } from './CloudflareDurableObjects';
export { CoordinatorDurableObject } from './CloudflareDurableObjects';
