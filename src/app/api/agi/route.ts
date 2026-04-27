import { NextRequest, NextResponse } from 'next/server';
import {
  bootKernel,
  shutdownKernel,
  getDesktopState,
  getAGIStats,
  agiExecuteTask,
  setCapabilityTier,
} from '@/lib/agiDesktopEngine';
import type { AGICapabilityTier } from '@/types';

const VALID_TIERS: AGICapabilityTier[] = ['observer', 'assistant', 'operator', 'autonomous'];

// POST /api/agi — boot, shutdown, execute task, set tier
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      action: string;
      tier?: AGICapabilityTier;
      task?: string;
    };

    switch (body.action) {
      case 'boot': {
        const tier = VALID_TIERS.includes(body.tier as AGICapabilityTier) ? body.tier! : 'assistant';
        const state = bootKernel(tier);
        return NextResponse.json({ success: true, data: state, timestamp: new Date().toISOString() });
      }

      case 'shutdown': {
        const state = shutdownKernel();
        return NextResponse.json({ success: true, data: state, timestamp: new Date().toISOString() });
      }

      case 'execute': {
        if (!body.task?.trim()) {
          return NextResponse.json({ success: false, error: 'task is required' }, { status: 400 });
        }
        const result = agiExecuteTask(body.task.trim());
        return NextResponse.json({
          success: true,
          data: {
            sessionId: result.session.id,
            composedAnswer: result.session.composedAnswer,
            deployedAI: result.deployedAI,
            tabs: result.tabs,
            actions: result.actions,
          },
          timestamp: new Date().toISOString(),
        });
      }

      case 'set-tier': {
        if (!VALID_TIERS.includes(body.tier as AGICapabilityTier)) {
          return NextResponse.json({ success: false, error: `Invalid tier. Valid: ${VALID_TIERS.join(', ')}` }, { status: 400 });
        }
        setCapabilityTier(body.tier!);
        return NextResponse.json({ success: true, data: { tier: body.tier }, timestamp: new Date().toISOString() });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${body.action}` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// GET /api/agi — state or stats
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') ?? 'state';

    switch (action) {
      case 'state': {
        const state = getDesktopState();
        return NextResponse.json({ success: true, data: state, timestamp: new Date().toISOString() });
      }
      case 'stats': {
        const stats = getAGIStats();
        return NextResponse.json({ success: true, data: stats, timestamp: new Date().toISOString() });
      }
      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
