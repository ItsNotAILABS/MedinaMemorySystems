import { NextRequest, NextResponse } from 'next/server';
import {
  activateAgents,
  listSessions,
  getSession,
  getSessionJournal,
  getAgentStats,
  promoteIfReusable,
  AGENT_REGISTRY,
} from '@/lib/activatedAgentEngine';
import {
  createTemplate,
  getTemplate,
  listTemplates,
  spawnOrganism,
  transitionOrganism,
  retireOrganism,
  getOrganism,
  listOrganisms,
  spawnAutobot,
  retireAutobot,
  getAutobot,
  listAutobots,
  deployDecepticon,
  recordChaosMutation,
  expireChaosDomain,
  getChaosTelemetry,
  listChaosDomains,
  listDecepticons,
  checkQuota,
  updateQuotaUsage,
  getVitaAeternaStats,
  getVitaAeternaAuditLog,
  cleanupExpiredChaosDomains,
} from '@/lib/vitaAeternaRuntime';
import type {
  AgentActivationRequest,
  ModelFamily,
  AutobotClass,
  DecepticonClass,
  AccessScope,
  QuotaTier,
  OrganismLifecycleState,
} from '@/types';

// POST /api/agents — activate agents for a task, or manage Vita Aeterna entities
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as AgentActivationRequest & {
      action?: string;
      sessionId?: string;
      threshold?: number;
      // Vita Aeterna fields
      templateId?: string;
      organismId?: string;
      autobotId?: string;
      domainId?: string;
      name?: string;
      description?: string;
      autobotClass?: AutobotClass;
      decepticonClass?: DecepticonClass;
      defaultScope?: AccessScope;
      requiredCapabilities?: string[];
      quotaTier?: QuotaTier;
      createdBy?: string;
      spawnedBy?: string;
      scope?: AccessScope;
      lineageId?: string;
      targetState?: OrganismLifecycleState;
      transitionedBy?: string;
      retiredBy?: string;
      deployedBy?: string;
      ttl?: number;
      mutationAction?: string;
      mutationTarget?: string;
      beforeState?: unknown;
      afterState?: unknown;
      updates?: Record<string, unknown>;
    };

    // ─── Vita Aeterna Actions ────────────────────────────────────────────────
    switch (body.action) {
      // Template management
      case 'template.create': {
        if (!body.name || !body.autobotClass || !body.createdBy) {
          return NextResponse.json({ success: false, error: 'name, autobotClass, and createdBy required' }, { status: 400 });
        }
        const template = createTemplate(
          body.name,
          body.description ?? '',
          body.autobotClass,
          body.defaultScope ?? 'enterprise',
          body.requiredCapabilities ?? [],
          body.quotaTier ?? 'ENTERPRISE',
          body.createdBy,
        );
        return NextResponse.json({ success: true, data: template, timestamp: new Date().toISOString() }, { status: 201 });
      }

      // Organism lifecycle
      case 'organism.spawn': {
        if (!body.templateId || !body.name || !body.spawnedBy) {
          return NextResponse.json({ success: false, error: 'templateId, name, and spawnedBy required' }, { status: 400 });
        }
        const kernel = spawnOrganism(body.templateId, body.name, body.spawnedBy);
        return NextResponse.json({ success: true, data: kernel, timestamp: new Date().toISOString() }, { status: 201 });
      }

      case 'organism.transition': {
        if (!body.organismId || !body.targetState || !body.transitionedBy) {
          return NextResponse.json({ success: false, error: 'organismId, targetState, and transitionedBy required' }, { status: 400 });
        }
        const result = transitionOrganism(body.organismId, body.targetState, body.transitionedBy);
        return NextResponse.json({ success: result.success, data: result, timestamp: new Date().toISOString() });
      }

      case 'organism.retire': {
        if (!body.organismId || !body.retiredBy) {
          return NextResponse.json({ success: false, error: 'organismId and retiredBy required' }, { status: 400 });
        }
        const result = retireOrganism(body.organismId, body.retiredBy);
        return NextResponse.json({ success: result.success, data: result, timestamp: new Date().toISOString() });
      }

      // Autobot management
      case 'autobot.spawn': {
        if (!body.autobotClass || !body.scope || !body.lineageId || !body.spawnedBy) {
          return NextResponse.json({ success: false, error: 'autobotClass, scope, lineageId, and spawnedBy required' }, { status: 400 });
        }
        const autobot = spawnAutobot(body.autobotClass, body.scope, body.lineageId, body.spawnedBy);
        return NextResponse.json({ success: true, data: autobot, timestamp: new Date().toISOString() }, { status: 201 });
      }

      case 'autobot.retire': {
        if (!body.autobotId || !body.retiredBy) {
          return NextResponse.json({ success: false, error: 'autobotId and retiredBy required' }, { status: 400 });
        }
        const retired = retireAutobot(body.autobotId, body.retiredBy);
        return NextResponse.json({ success: !!retired, data: retired, timestamp: new Date().toISOString() });
      }

      // Decepticon & Chaos domain management
      case 'chaos.deploy': {
        if (!body.decepticonClass || !body.deployedBy) {
          return NextResponse.json({ success: false, error: 'decepticonClass and deployedBy required' }, { status: 400 });
        }
        const result = deployDecepticon(body.decepticonClass, body.ttl ?? 300_000, body.deployedBy);
        return NextResponse.json({ success: true, data: result, timestamp: new Date().toISOString() }, { status: 201 });
      }

      case 'chaos.mutation': {
        if (!body.domainId || !body.mutationAction || !body.mutationTarget) {
          return NextResponse.json({ success: false, error: 'domainId, mutationAction, and mutationTarget required' }, { status: 400 });
        }
        const mutation = recordChaosMutation(body.domainId, body.mutationAction, body.mutationTarget, body.beforeState, body.afterState);
        return NextResponse.json({ success: true, data: mutation, timestamp: new Date().toISOString() });
      }

      case 'chaos.expire': {
        if (!body.domainId) {
          return NextResponse.json({ success: false, error: 'domainId required' }, { status: 400 });
        }
        const expired = expireChaosDomain(body.domainId);
        return NextResponse.json({ success: expired, timestamp: new Date().toISOString() });
      }

      case 'chaos.cleanup': {
        const cleaned = cleanupExpiredChaosDomains();
        return NextResponse.json({ success: true, data: { cleaned }, timestamp: new Date().toISOString() });
      }

      // Quota management
      case 'quota.update': {
        if (!body.organismId || !body.updates) {
          return NextResponse.json({ success: false, error: 'organismId and updates required' }, { status: 400 });
        }
        const updated = updateQuotaUsage(body.organismId, body.updates as any);
        return NextResponse.json({ success: !!updated, data: updated, timestamp: new Date().toISOString() });
      }

      // Legacy: Promote session
      case 'promote': {
        if (!body.sessionId) {
          return NextResponse.json({ success: false, error: 'sessionId required' }, { status: 400 });
        }
        const session = getSession(body.sessionId);
        if (!session) {
          return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
        }
        const entry = promoteIfReusable(session, body.threshold ?? 0.80);
        return NextResponse.json({
          success: true,
          data: { promoted: !!entry, memory: entry },
          timestamp: new Date().toISOString(),
        });
      }
    }

    // ─── Legacy: Activate Agents ─────────────────────────────────────────────
    if (!body.task?.trim()) {
      return NextResponse.json({ success: false, error: 'task is required' }, { status: 400 });
    }

    const session = activateAgents({
      task: body.task.trim(),
      context: body.context,
      agentOverrides: body.agentOverrides,
      autoPromote: body.autoPromote ?? false,
      promoteThreshold: body.promoteThreshold ?? 0.80,
    });

    return NextResponse.json({
      success: true,
      data: session,
      timestamp: new Date().toISOString(),
      processingTime: session.completedAt
        ? new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()
        : 0,
    });
  } catch (err) {
    console.error('[/api/agents POST]', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// GET /api/agents — list sessions, get single session, journal, stats, registry, or Vita Aeterna data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') ?? 'list';
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    switch (action) {
      // ─── Legacy Agent Actions ──────────────────────────────────────────────
      case 'list': {
        const sessions = listSessions(limit);
        return NextResponse.json({ success: true, data: sessions, timestamp: new Date().toISOString() });
      }

      case 'session': {
        if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
        const session = getSession(id);
        if (!session) return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: session, timestamp: new Date().toISOString() });
      }

      case 'journal': {
        if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
        const journal = getSessionJournal(id);
        return NextResponse.json({ success: true, data: journal, timestamp: new Date().toISOString() });
      }

      case 'stats': {
        const stats = getAgentStats();
        return NextResponse.json({ success: true, data: stats, timestamp: new Date().toISOString() });
      }

      case 'registry': {
        return NextResponse.json({ success: true, data: AGENT_REGISTRY as ModelFamily[], timestamp: new Date().toISOString() });
      }

      // ─── Vita Aeterna Read Actions ─────────────────────────────────────────
      case 'vita.stats': {
        const stats = getVitaAeternaStats();
        return NextResponse.json({ success: true, data: stats, timestamp: new Date().toISOString() });
      }

      case 'vita.audit': {
        const log = getVitaAeternaAuditLog(limit);
        return NextResponse.json({ success: true, data: log, timestamp: new Date().toISOString() });
      }

      // Template actions
      case 'template.get': {
        if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
        const template = getTemplate(id);
        if (!template) return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: template, timestamp: new Date().toISOString() });
      }

      case 'template.list': {
        const templates = listTemplates();
        return NextResponse.json({ success: true, data: templates, timestamp: new Date().toISOString() });
      }

      // Organism actions
      case 'organism.get': {
        if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
        const organism = getOrganism(id);
        if (!organism) return NextResponse.json({ success: false, error: 'Organism not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: organism, timestamp: new Date().toISOString() });
      }

      case 'organism.list': {
        const state = searchParams.get('state') as OrganismLifecycleState | null;
        const organisms = listOrganisms(state ?? undefined);
        return NextResponse.json({ success: true, data: organisms, timestamp: new Date().toISOString() });
      }

      // Autobot actions
      case 'autobot.get': {
        if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
        const autobot = getAutobot(id);
        if (!autobot) return NextResponse.json({ success: false, error: 'Autobot not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: autobot, timestamp: new Date().toISOString() });
      }

      case 'autobot.list': {
        const status = searchParams.get('status') as any;
        const autobots = listAutobots(status ?? undefined);
        return NextResponse.json({ success: true, data: autobots, timestamp: new Date().toISOString() });
      }

      // Decepticon actions
      case 'decepticon.list': {
        const status = searchParams.get('status') as any;
        const decepticons = listDecepticons(status ?? undefined);
        return NextResponse.json({ success: true, data: decepticons, timestamp: new Date().toISOString() });
      }

      // Chaos domain actions
      case 'chaos.list': {
        const status = searchParams.get('status') as any;
        const domains = listChaosDomains(status ?? undefined);
        return NextResponse.json({ success: true, data: domains, timestamp: new Date().toISOString() });
      }

      case 'chaos.telemetry': {
        if (!id) return NextResponse.json({ success: false, error: 'id (domainId) required' }, { status: 400 });
        const telemetry = getChaosTelemetry(id);
        return NextResponse.json({ success: true, data: telemetry, timestamp: new Date().toISOString() });
      }

      // Quota actions
      case 'quota.check': {
        const tier = searchParams.get('tier') as QuotaTier;
        if (!tier) return NextResponse.json({ success: false, error: 'tier required' }, { status: 400 });
        const result = checkQuota(tier);
        return NextResponse.json({ success: true, data: result, timestamp: new Date().toISOString() });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error('[/api/agents GET]', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
