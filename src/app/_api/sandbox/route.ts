import { NextRequest, NextResponse } from 'next/server';
import {
  createSandboxSession,
  resolveAccess,
  listSessions,
  getSandboxStats,
} from '@/lib/sandboxOrchestrator';
import type { ApiResponse } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'stats';

  switch (action) {
    case 'stats':
      return NextResponse.json({ success: true, data: getSandboxStats(), timestamp: now() });
    case 'sessions':
      return NextResponse.json({ success: true, data: listSessions(), timestamp: now() });
    default:
      return NextResponse.json({ success: false, error: 'Unknown action', timestamp: now() }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { action: string; tier?: string; requesterId?: string; sessionId?: string; resource?: string };

  switch (body.action) {
    case 'create': {
      if (!body.tier || !body.requesterId) return NextResponse.json({ success: false, error: 'tier and requesterId required', timestamp: now() }, { status: 400 });
      const session = createSandboxSession(body.tier as any, body.requesterId);
      return NextResponse.json({ success: true, data: session, timestamp: now() }, { status: 201 });
    }
    case 'resolve': {
      if (!body.sessionId || !body.resource) return NextResponse.json({ success: false, error: 'sessionId and resource required', timestamp: now() }, { status: 400 });
      const result = resolveAccess(body.sessionId, body.resource);
      return NextResponse.json({ success: true, data: result, timestamp: now() });
    }
    default:
      return NextResponse.json({ success: false, error: 'Unknown action', timestamp: now() }, { status: 400 });
  }
}

function now() { return new Date().toISOString(); }
