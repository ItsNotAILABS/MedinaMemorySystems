import { NextRequest, NextResponse } from 'next/server';
import {
  queryMemory,
  storeMemory,
  getMemory,
  updateMemory,
  deleteMemory,
  pinMemory,
  unpinMemory,
  listMemories,
  getMemoryStats,
  getPinnedMemories,
  getMemoryLineage,
  getRootMemory,
} from '@/lib/memoryEngine';
import { dualRead } from '@/lib/dualRead';
import type { ApiResponse } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'list';
  const id = searchParams.get('id');
  const query = searchParams.get('query') ?? '';
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);

  try {
    switch (action) {
      case 'list': {
        const entries = listMemories(limit);
        return json({ success: true, data: entries, timestamp: now() });
      }
      case 'get': {
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const entry = getMemory(id);
        if (!entry) return json({ success: false, error: 'Not found', timestamp: now() }, 404);
        return json({ success: true, data: entry, timestamp: now() });
      }
      case 'search': {
        const result = queryMemory({ query, limit });
        return json({ success: true, data: result, timestamp: now() });
      }
      case 'pinned': {
        const entries = getPinnedMemories();
        return json({ success: true, data: entries, timestamp: now() });
      }
      case 'stats': {
        const stats = getMemoryStats();
        return json({ success: true, data: stats, timestamp: now() });
      }
      case 'lineage': {
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const entries = getMemoryLineage(id);
        return json({ success: true, data: entries, timestamp: now() });
      }
      case 'root': {
        const root = getRootMemory();
        return json({ success: true, data: root ?? null, timestamp: now() });
      }
      case 'dual': {
        const result = dualRead(query, limit);
        return json({ success: true, data: result, timestamp: now() });
      }
      default:
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      content: string;
      type?: string;
      tags?: string[];
      coordinates?: Record<string, number>;
      parentId?: string;
    };

    if (!body.content) {
      return json({ success: false, error: 'Content required', timestamp: now() }, 400);
    }

    const entry = storeMemory(
      body.content,
      (body.type as any) ?? 'semantic',
      body.tags ?? [],
      body.coordinates,
      body.parentId,
    );

    return json({ success: true, data: entry, timestamp: now() }, 201);
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as { id: string; action?: string; updates?: Record<string, unknown> };
    if (!body.id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);

    if (body.action === 'pin') {
      const entry = pinMemory(body.id);
      return json({ success: !!entry, data: entry ?? undefined, timestamp: now() });
    }
    if (body.action === 'unpin') {
      const entry = unpinMemory(body.id);
      return json({ success: !!entry, data: entry ?? undefined, timestamp: now() });
    }

    const entry = updateMemory(body.id, body.updates ?? {});
    return json({ success: !!entry, data: entry ?? undefined, timestamp: now() });
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
    const ok = deleteMemory(id);
    return json({ success: ok, timestamp: now() });
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

function json<T>(data: ApiResponse<T>, status = 200) {
  return NextResponse.json(data, { status });
}

function now() {
  return new Date().toISOString();
}
