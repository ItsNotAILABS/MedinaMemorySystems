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
import type { AgentActivationRequest, ModelFamily } from '@/types';

// POST /api/agents — activate agents for a task, or promote a session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as AgentActivationRequest & { action?: string; sessionId?: string; threshold?: number };

    if (body.action === 'promote' && body.sessionId) {
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
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/agents — list sessions, get single session, journal, stats, or registry
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') ?? 'list';
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    switch (action) {
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

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error('[/api/agents GET]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
