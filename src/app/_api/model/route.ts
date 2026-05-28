import { NextRequest, NextResponse } from 'next/server';
import { getModels, getModel, invokeModel, getInvocationHistory, getModelStats, routeToModel } from '@/lib/modelRouter';
import type { ApiResponse, ModelFamily } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'list';
  const id = searchParams.get('id') as ModelFamily | null;

  try {
    switch (action) {
      case 'list':
        return json({ success: true, data: getModels(), timestamp: now() });
      case 'get': {
        if (!id) return json({ success: false, error: 'Model ID required', timestamp: now() }, 400);
        const m = getModel(id);
        if (!m) return json({ success: false, error: 'Not found', timestamp: now() }, 404);
        return json({ success: true, data: m, timestamp: now() });
      }
      case 'history': {
        const limit = parseInt(searchParams.get('limit') ?? '20', 10);
        return json({ success: true, data: getInvocationHistory(limit), timestamp: now() });
      }
      case 'stats':
        return json({ success: true, data: getModelStats(), timestamp: now() });
      case 'route': {
        const prompt = searchParams.get('prompt') ?? '';
        return json({ success: true, data: { model: routeToModel(prompt) }, timestamp: now() });
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
    const body = await req.json() as { modelId: ModelFamily; prompt: string };
    if (!body.modelId || !body.prompt) {
      return json({ success: false, error: 'modelId and prompt required', timestamp: now() }, 400);
    }
    const result = invokeModel(body.modelId, body.prompt);
    return json({ success: true, data: result, timestamp: now() });
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

function json<T>(data: ApiResponse<T>, status = 200) {
  return NextResponse.json(data, { status });
}
function now() { return new Date().toISOString(); }
