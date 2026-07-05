'use client';

/**
 * MEDINA Client-Side API Interceptor
 * 
 * Intercepts fetch calls to /api/* and handles them locally using in-memory engines.
 * This enables the app to work as a fully static site (no server needed).
 * All state lives in the browser — sovereign, self-contained.
 */

import { pulseOrganism, getOrganismState, getRegisterSummary } from '@/lib/organismSovereign';
import { getGates, getGovernanceStats, listProposals, createProposal, openProposal, voteOnProposal, enactProposal, getAuditLog, setGateStatus } from '@/lib/governanceEngine';
import { queryMemory, storeMemory, getMemory, updateMemory, deleteMemory, pinMemory, unpinMemory, listMemories, getMemoryStats, getPinnedMemories, getMemoryLineage, getRootMemory } from '@/lib/memoryEngine';
import { getModels, getModel, invokeModel, getInvocationHistory, getModelStats, routeToModel } from '@/lib/modelRouter';
import { listSessions as listReplaySessions, getSession as getReplaySession, startReplaySession, stopReplaySession, getCurrentSession, getReplayStats } from '@/lib/replayEngine';
import { parseCommand, isCommand, getCommandHelp } from '@/lib/commandParser';
import { ulriRoute, ulriConsensus } from '@/lib/ulriEngine';
import { dualRead } from '@/lib/dualRead';
import { checkAllGates } from '@/lib/gateEnforcement';
import { sovereignId } from '@/lib/sovereign-id';
import {
  listMCPTools,
  getMCPTool,
  listMCPServerInfo,
  callMCPTool,
  getIPhoneBridgeConnection,
  MCP_TOOL_REGISTRY,
  type MCPToolServer,
} from '@/lib/mcpToolRegistry';
import { getMCPServer } from '@/lib/goSystem';
import { IPHONE_BRIDGE_GO_SYSTEM_ID } from '@/lib/mcpToolRegistry';
import {
  listProjects,
  getProject,
  createProject,
  updateProjectDesign,
  aiAssist,
  scaffold,
  buildCapsules,
  createProjectToken,
  deploy,
  listDeployHistory,
  exportProjectBundle,
  exportProjectToDisk,
  getProjectSourceFiles,
  updateProjectFile,
  listGeneratedProjects,
  getCompanyVault,
  listTemplates,
  getTemplate,
  templateCategories,
  listDeployTargets,
  getDeployPlan,
  attachDeployScripts,
  APP_BUILDER_MANIFEST,
} from '@/lib/appBuilderEngine';
import {
  staticStudioCapabilities,
  serverModeRequiredResponse,
} from '@/lib/studioCapabilities';

// ─── Response Helpers ───────────────────────────────────────────────────────

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function now(): string {
  return new Date().toISOString();
}

// ─── Route Handlers ─────────────────────────────────────────────────────────

async function handleSync(): Promise<Response> {
  const organism = pulseOrganism();
  const gates = getGates();
  const governance = getGovernanceStats();
  const memory = getMemoryStats();
  const models = { families: getModels(), stats: getModelStats() };
  const replay = getReplayStats();
  const recentMemories = listMemories(5);

  return jsonResponse({
    organism,
    gates,
    governance,
    memory,
    models,
    replay,
    recentMemories,
    timestamp: now(),
    beat: organism.lastBeat,
  });
}

async function handleGovern(url: URL, method: string, body?: any): Promise<Response> {
  if (method === 'GET') {
    const action = url.searchParams.get('action') ?? 'list';
    switch (action) {
      case 'list':
        return jsonResponse({ success: true, data: listProposals(), timestamp: now() });
      case 'gates':
        return jsonResponse({ success: true, data: getGates(), timestamp: now() });
      case 'audit': {
        const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);
        return jsonResponse({ success: true, data: getAuditLog(limit), timestamp: now() });
      }
      case 'stats':
        return jsonResponse({ success: true, data: getGovernanceStats(), timestamp: now() });
      default:
        return jsonResponse({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  }
  // POST
  switch (body?.action) {
    case 'create':
      if (!body.title) return jsonResponse({ success: false, error: 'Title required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: createProposal(body.title, body.description ?? '', body.author ?? 'User', body.affectedGates, body.doctrineRef), timestamp: now() }, 201);
    case 'open':
      if (!body.id) return jsonResponse({ success: false, error: 'ID required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: openProposal(body.id), timestamp: now() });
    case 'vote':
      if (!body.id || !body.vote) return jsonResponse({ success: false, error: 'ID and vote required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: voteOnProposal(body.id, body.vote, body.voter ?? 'User'), timestamp: now() });
    case 'enact':
      if (!body.id) return jsonResponse({ success: false, error: 'ID required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: enactProposal(body.id), timestamp: now() });
    case 'gate':
      if (!body.gateId || !body.status) return jsonResponse({ success: false, error: 'Gate ID and status required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: setGateStatus(body.gateId, body.status), timestamp: now() });
    default:
      return jsonResponse({ success: false, error: 'Unknown action', timestamp: now() }, 400);
  }
}

async function handleMemory(url: URL, method: string, body?: any): Promise<Response> {
  if (method === 'GET') {
    const action = url.searchParams.get('action') ?? 'list';
    const id = url.searchParams.get('id');
    const query = url.searchParams.get('query') ?? '';
    const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);

    switch (action) {
      case 'list':
        return jsonResponse({ success: true, data: listMemories(limit), timestamp: now() });
      case 'get':
        if (!id) return jsonResponse({ success: false, error: 'ID required', timestamp: now() }, 400);
        return jsonResponse({ success: true, data: getMemory(id), timestamp: now() });
      case 'search':
        return jsonResponse({ success: true, data: queryMemory({ query, limit }), timestamp: now() });
      case 'pinned':
        return jsonResponse({ success: true, data: getPinnedMemories(), timestamp: now() });
      case 'stats':
        return jsonResponse({ success: true, data: getMemoryStats(), timestamp: now() });
      case 'lineage':
        if (!id) return jsonResponse({ success: false, error: 'ID required', timestamp: now() }, 400);
        return jsonResponse({ success: true, data: getMemoryLineage(id), timestamp: now() });
      case 'root':
        return jsonResponse({ success: true, data: getRootMemory() ?? null, timestamp: now() });
      case 'dual':
        return jsonResponse({ success: true, data: dualRead(query, limit), timestamp: now() });
      default:
        return jsonResponse({ success: true, data: listMemories(limit), timestamp: now() });
    }
  }
  if (method === 'PATCH') {
    if (!body?.id) return jsonResponse({ success: false, error: 'ID required', timestamp: now() }, 400);
    if (body.action === 'pin') return jsonResponse({ success: true, data: pinMemory(body.id), timestamp: now() });
    if (body.action === 'unpin') return jsonResponse({ success: true, data: unpinMemory(body.id), timestamp: now() });
    return jsonResponse({ success: true, data: updateMemory(body.id, body.updates ?? {}), timestamp: now() });
  }
  if (method === 'DELETE') {
    const id = url.searchParams.get('id');
    if (!id) return jsonResponse({ success: false, error: 'ID required', timestamp: now() }, 400);
    return jsonResponse({ success: deleteMemory(id), timestamp: now() });
  }
  // POST
  if (!body?.content) return jsonResponse({ success: false, error: 'Content required', timestamp: now() }, 400);
  const entry = storeMemory(body.content, body.type ?? 'semantic', body.tags ?? [], body.coordinates, body.parentId);
  return jsonResponse({ success: true, data: entry, timestamp: now() }, 201);
}

async function handleModel(url: URL, method: string, body?: any): Promise<Response> {
  if (method === 'GET') {
    const action = url.searchParams.get('action') ?? 'list';
    switch (action) {
      case 'list':
        return jsonResponse({ success: true, data: getModels(), timestamp: now() });
      case 'get': {
        const id = url.searchParams.get('id') as ModelFamily | null;
        if (!id) return jsonResponse({ success: false, error: 'Model ID required', timestamp: now() }, 400);
        return jsonResponse({ success: true, data: getModel(id), timestamp: now() });
      }
      case 'history': {
        const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);
        return jsonResponse({ success: true, data: getInvocationHistory(limit), timestamp: now() });
      }
      case 'stats':
        return jsonResponse({ success: true, data: getModelStats(), timestamp: now() });
      default:
        return jsonResponse({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  }
  // POST
  if (!body?.modelId || !body?.prompt) return jsonResponse({ success: false, error: 'modelId and prompt required', timestamp: now() }, 400);
  return jsonResponse({ success: true, data: invokeModel(body.modelId, body.prompt), timestamp: now() });
}

async function handleReplay(url: URL, method: string, body?: any): Promise<Response> {
  if (method === 'GET') {
    const action = url.searchParams.get('action') ?? 'list';
    switch (action) {
      case 'list':
        return jsonResponse({ success: true, data: listReplaySessions(), timestamp: now() });
      case 'stats':
        return jsonResponse({ success: true, data: getReplayStats(), timestamp: now() });
      case 'current':
        return jsonResponse({ success: true, data: getCurrentSession(), timestamp: now() });
      default:
        return jsonResponse({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  }
  // POST
  switch (body?.action) {
    case 'start':
      return jsonResponse({ success: true, data: startReplaySession(body.name ?? `Session ${new Date().toLocaleTimeString()}`), timestamp: now() }, 201);
    case 'stop':
      return jsonResponse({ success: true, data: stopReplaySession(), timestamp: now() });
    default:
      return jsonResponse({ success: false, error: 'Unknown action', timestamp: now() }, 400);
  }
}

function getModelForCommand(module: string): ModelFamily {
  const map: Record<string, ModelFamily> = {
    memory: 'memory-curator',
    govern: 'governance',
    model: 'strategist',
    company: 'operations',
    replay: 'analyst',
    permissions: 'governance',
    organism: 'strategist',
    help: 'strategist',
  };
  return map[module] ?? 'strategist';
}

async function handleChat(_url: URL, _method: string, body?: any): Promise<Response> {
  try {
    const message = body?.message;
    if (!message?.trim()) return jsonResponse({ error: 'Message required' }, 400);

    const startTime = Date.now();

    if (isCommand(message)) {
      const parsed = parseCommand(message);
      return jsonResponse({
        id: sovereignId(),
        role: 'assistant',
        content: parsed.valid ? `Command processed: /${parsed.module} ${parsed.verb}` : (parsed.error ?? 'Invalid command'),
        commandParsed: parsed,
        modelUsed: getModelForCommand(parsed.module),
        timestamp: now(),
        processingTime: Date.now() - startTime,
      });
    }

    const useConsensus = body?.useConsensus;
    const ulriResult = useConsensus ? ulriConsensus(message, 3) : ulriRoute(message);

    return jsonResponse({
      id: sovereignId(),
      role: 'assistant',
      content: ulriResult.consensus?.synthesized ?? ulriResult.invocation.response,
      modelUsed: ulriResult.primary,
      timestamp: now(),
      processingTime: Date.now() - startTime,
      ulriScores: ulriResult.scores?.slice(0, 5),
      sovereignScores: ulriResult.sovereignScores,
      consensus: ulriResult.consensus ? {
        models: ulriResult.consensus.models,
        agreementScore: ulriResult.consensus.agreementScore,
      } : undefined,
      routingLatency: ulriResult.routingLatency,
      fieldsOfPossibility: ulriResult.fieldsOfPossibility,
    });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
}

async function handlePermissions(url: URL, method: string, body?: any): Promise<Response> {
  // Minimal stub for permissions
  if (method === 'GET') {
    return jsonResponse({ success: true, data: [], timestamp: now() });
  }
  return jsonResponse({ success: true, timestamp: now() });
}

async function handleAgents(url: URL, method: string, body?: any): Promise<Response> {
  // Stub returning empty state — agents engine is complex
  if (method === 'GET') {
    const action = url.searchParams.get('action') ?? 'list';
    if (action === 'stats') {
      return jsonResponse({ success: true, data: { totalSessions: 0, activeAgents: 0, totalInvocations: 0 }, timestamp: now() });
    }
    return jsonResponse({ success: true, data: [], timestamp: now() });
  }
  return jsonResponse({ success: true, data: {}, timestamp: now() });
}

async function handleCompany(url: URL, method: string, body?: any): Promise<Response> {
  if (method === 'GET') {
    return jsonResponse({ success: true, data: { id: 'default', name: 'Medina Systems', status: 'active', completedSteps: 5, totalSteps: 5, progress: 100 }, timestamp: now() });
  }
  return jsonResponse({ success: true, timestamp: now() });
}

async function handleJarvis(url: URL, method: string, body?: any): Promise<Response> {
  if (method === 'GET') {
    return jsonResponse({
      success: true,
      data: {
        status: 'online',
        modules: ['memory', 'governance', 'models', 'agents'],
        uptime: Date.now(),
        lastActivity: now(),
      },
      timestamp: now(),
    });
  }
  return jsonResponse({ success: true, data: { acknowledged: true }, timestamp: now() });
}

async function handleAgi(url: URL, method: string, body?: any): Promise<Response> {
  return jsonResponse({
    success: true,
    data: {
      state: 'active',
      modules: ['reasoning', 'memory', 'planning', 'execution'],
      capabilities: 12,
    },
    timestamp: now(),
  });
}

async function handleExport(url: URL, method: string, body?: any): Promise<Response> {
  return jsonResponse({ success: true, data: { formats: ['json', 'csv', 'markdown'] }, timestamp: now() });
}

async function handleHealth(): Promise<Response> {
  return jsonResponse({ status: 'healthy', timestamp: now(), version: '1.0.0' });
}

async function handleAiMcp(url: URL, method: string, body?: any): Promise<Response> {
  if (method === 'GET') {
    const action = url.searchParams.get('action') ?? 'tools';
    const server = url.searchParams.get('server') as MCPToolServer | null;
    const toolName = url.searchParams.get('tool');

    switch (action) {
      case 'tools':
        return jsonResponse({
          success: true,
          data: {
            tools: listMCPTools(server ? { server } : undefined),
            total: server ? listMCPTools({ server }).length : MCP_TOOL_REGISTRY.length,
          },
          timestamp: now(),
        });
      case 'tool':
        if (!toolName) return jsonResponse({ success: false, error: 'tool parameter required', timestamp: now() }, 400);
        return jsonResponse({ success: true, data: getMCPTool(toolName), timestamp: now() });
      case 'servers':
        return jsonResponse({ success: true, data: listMCPServerInfo(), timestamp: now() });
      case 'config': {
        const goServer = getMCPServer(IPHONE_BRIDGE_GO_SYSTEM_ID);
        return jsonResponse({
          success: true,
          data: {
            mcpServers: {
              'iphone-bridge': {
                command: getIPhoneBridgeConnection().command,
                args: getIPhoneBridgeConnection().args,
              },
            },
            goSystem: goServer,
            docs: 'Copy .cursor/mcp.json.example to .cursor/mcp.json and update paths for your machine.',
          },
          timestamp: now(),
        });
      }
      default:
        return jsonResponse({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  }

  const tool = body?.tool;
  if (!tool) return jsonResponse({ success: false, error: 'tool is required', timestamp: now() }, 400);
  const result = callMCPTool(tool, body?.arguments ?? {});
  const status = result.success ? 200 : result.bridgeRequired ? 202 : 400;
  return jsonResponse({ success: result.success, data: result, timestamp: now() }, status);
}

async function handleBuilder(url: URL, method: string, body?: any): Promise<Response> {
  if (method === 'GET') {
    const action = url.searchParams.get('action') ?? 'manifest';
    const id = url.searchParams.get('id') ?? undefined;
    switch (action) {
      case 'manifest':
        return jsonResponse({
          success: true,
          data: { ...APP_BUILDER_MANIFEST, capabilities: staticStudioCapabilities() },
          timestamp: now(),
        });
      case 'capabilities':
        return jsonResponse({ success: true, data: staticStudioCapabilities(), timestamp: now() });
      case 'projects':
        return jsonResponse({ success: true, data: listProjects(), timestamp: now() });
      case 'templates':
        return jsonResponse({ success: true, data: listTemplates(), timestamp: now() });
      case 'deploy-targets':
        return jsonResponse({ success: true, data: listDeployTargets(), timestamp: now() });
      case 'template-categories':
        return jsonResponse({ success: true, data: templateCategories(), timestamp: now() });
      case 'deploy-plan':
        if (!id) return jsonResponse({ success: false, error: 'id required', timestamp: now() }, 400);
        return jsonResponse({ success: true, data: getDeployPlan(id, url.searchParams.get('target') as never), timestamp: now() });
      case 'project':
        if (!id) return jsonResponse({ success: false, error: 'id required', timestamp: now() }, 400);
        return jsonResponse({ success: true, data: getProject(id), timestamp: now() });
      case 'vault':
        return jsonResponse({ success: true, data: getCompanyVault(), timestamp: now() });
      case 'deployments':
        return jsonResponse({ success: true, data: listDeployHistory(id), timestamp: now() });
      case 'export':
        if (!id) return jsonResponse({ success: false, error: 'id required', timestamp: now() }, 400);
        return jsonResponse({ success: true, data: exportProjectBundle(id), timestamp: now() });
      case 'generated':
        return jsonResponse({ success: true, data: listGeneratedProjects(), timestamp: now() });
      case 'source-files':
        if (!id) return jsonResponse({ success: false, error: 'id required', timestamp: now() }, 400);
        return jsonResponse({ success: true, data: getProjectSourceFiles(id), timestamp: now() });
      default:
        return jsonResponse({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  }
  switch (body?.action) {
    case 'create':
      return jsonResponse({ success: true, data: createProject(body), timestamp: now() }, 201);
    case 'design':
      if (!body.id) return jsonResponse({ success: false, error: 'id required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: updateProjectDesign(body.id, body.design ?? {}), timestamp: now() });
    case 'ai-assist':
      if (!body.id || !body.prompt) return jsonResponse({ success: false, error: 'id and prompt required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: aiAssist(body.id, body.prompt), timestamp: now() });
    case 'scaffold':
      if (!body.id) return jsonResponse({ success: false, error: 'id required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: scaffold(body.id), timestamp: now() });
    case 'build-capsules':
      if (!body.id) return jsonResponse({ success: false, error: 'id required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: buildCapsules(body.id), timestamp: now() });
    case 'create-token':
      if (!body.id || !body.token) return jsonResponse({ success: false, error: 'id and token required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: createProjectToken(body.id, body.token), timestamp: now() });
    case 'deploy-plan':
      if (!body.id) return jsonResponse({ success: false, error: 'id required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: getDeployPlan(body.id, body.target), timestamp: now() });
    case 'attach-scripts':
      if (!body.id) return jsonResponse({ success: false, error: 'id required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: attachDeployScripts(body.id, body.target), timestamp: now() });
    case 'deploy':
      if (!body.id) return jsonResponse({ success: false, error: 'id required', timestamp: now() }, 400);
      return jsonResponse({ success: true, data: deploy(body.id, body.target), timestamp: now() });
    case 'export-disk':
      return jsonResponse(serverModeRequiredResponse(), 501);
    case 'build-and-run':
    case 'create-and-run':
    case 'from-prompt':
      return jsonResponse(serverModeRequiredResponse(), 501);
    case 'update-file':
      if (!body.id || !body.path || body.content === undefined) {
        return jsonResponse({ success: false, error: 'id, path, and content required', timestamp: now() }, 400);
      }
      return jsonResponse({ success: true, data: updateProjectFile(body.id, body.path, body.content), timestamp: now() });
    default:
      return jsonResponse({ success: false, error: 'Unknown action', timestamp: now() }, 400);
  }
}

// ─── Catch-all for unhandled routes ─────────────────────────────────────────

async function handleFallback(path: string): Promise<Response> {
  return jsonResponse({ success: true, data: {}, timestamp: now() });
}

// ─── Main Router ────────────────────────────────────────────────────────────

async function routeRequest(url: URL, method: string, body?: any): Promise<Response> {
  const segments = url.pathname.replace(/^\/api\//, '').split('/');
  const path = segments[0];

  if (path === 'ai' && segments[1] === 'mcp') {
    return handleAiMcp(url, method, body);
  }

  if (path === 'builder') {
    return handleBuilder(url, method, body);
  }

  if (path === 'terminal' || path === 'orchestrate') {
    return jsonResponse(serverModeRequiredResponse(), 501);
  }

  switch (path) {
    case 'sync': return handleSync();
    case 'govern': return handleGovern(url, method, body);
    case 'memory': return handleMemory(url, method, body);
    case 'model': return handleModel(url, method, body);
    case 'replay': return handleReplay(url, method, body);
    case 'chat': return handleChat(url, method, body);
    case 'permissions': return handlePermissions(url, method, body);
    case 'agents': return handleAgents(url, method, body);
    case 'company': return handleCompany(url, method, body);
    case 'jarvis': return handleJarvis(url, method, body);
    case 'agi': return handleAgi(url, method, body);
    case 'export': return handleExport(url, method, body);
    case 'health': return handleHealth();
    default: return handleFallback(path);
  }
}

// ─── Fetch Interceptor ──────────────────────────────────────────────────────

let installed = false;

export function installApiInterceptor(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string'
      ? new URL(input, window.location.origin)
      : input instanceof URL
        ? input
        : new URL((input as Request).url, window.location.origin);

    // Only intercept /api/* requests
    if (!url.pathname.startsWith('/api/')) {
      return originalFetch(input, init);
    }

    const method = init?.method?.toUpperCase() ?? 'GET';
    let body: any = undefined;

    if (init?.body) {
      try {
        body = typeof init.body === 'string'
          ? JSON.parse(init.body)
          : {};
      } catch {
        body = {};
      }
    }

    try {
      return await routeRequest(url, method, body);
    } catch (err) {
      return jsonResponse({ error: String(err) }, 500);
    }
  };
}
