import { NextRequest, NextResponse } from 'next/server';
import {
  listSessions,
  getSession,
  startReplaySession,
  stopReplaySession,
  getCurrentSession,
  getReplayStats,
} from '@/lib/replayEngine';
import type { ApiResponse } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'list';
  const id = searchParams.get('id');

  try {
    switch (action) {
      case 'list':
        return json({ success: true, data: listSessions(), timestamp: now() });
      case 'get': {
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const s = getSession(id);
        if (!s) return json({ success: false, error: 'Not found', timestamp: now() }, 404);
        return json({ success: true, data: s, timestamp: now() });
      }
      case 'current': {
        const s = getCurrentSession();
        return json({ success: !!s, data: s ?? undefined, timestamp: now() });
      }
      case 'stats':
        return json({ success: true, data: getReplayStats(), timestamp: now() });
      default:
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { action: string; name?: string };
    switch (body.action) {
      case 'start': {
        const name = body.name ?? `Session ${new Date().toLocaleTimeString()}`;
        const session = startReplaySession(name);
        return json({ success: true, data: session, timestamp: now() }, 201);
      }
      case 'stop': {
        const session = stopReplaySession();
        return json({ success: !!session, data: session ?? undefined, timestamp: now() });
      }
      default:
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

function json<T>(data: ApiResponse<T>, status = 200) {
  return NextResponse.json(data, { status });
}
function now() { return new Date().toISOString(); }
