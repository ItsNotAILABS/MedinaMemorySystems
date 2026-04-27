import { NextRequest, NextResponse } from 'next/server';
import {
  openTab,
  closeTab,
  navigateTab,
  pinTab,
  assignAgentToTab,
  listTabs,
  getTab,
  deployAI,
  pauseAI,
  resumeAI,
  stopAI,
  assignTabToAI,
  runAITask,
  listDeployedAIs,
  getDeployedAI,
  getActionHistory,
  getActionQueue,
} from '@/lib/agiDesktopEngine';
import type { ModelFamily } from '@/types';

// POST /api/desktop — tab & AI management
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;
    const action = body.action as string;

    switch (action) {
      // ── Tab actions ──────────────────────────────────
      case 'open-tab': {
        const url = body.url as string;
        if (!url) return NextResponse.json({ success: false, error: 'url is required' }, { status: 400 });
        const agent = body.agent as ModelFamily | undefined;
        const tab = openTab(url, agent);
        return NextResponse.json({ success: true, data: tab, timestamp: new Date().toISOString() });
      }

      case 'close-tab': {
        const tabId = body.tabId as string;
        if (!tabId) return NextResponse.json({ success: false, error: 'tabId is required' }, { status: 400 });
        const closed = closeTab(tabId);
        return NextResponse.json({ success: true, data: { closed }, timestamp: new Date().toISOString() });
      }

      case 'navigate-tab': {
        const tabId = body.tabId as string;
        const url = body.url as string;
        if (!tabId || !url) return NextResponse.json({ success: false, error: 'tabId and url are required' }, { status: 400 });
        const tab = navigateTab(tabId, url);
        if (!tab) return NextResponse.json({ success: false, error: 'Tab not found or closed' }, { status: 404 });
        return NextResponse.json({ success: true, data: tab, timestamp: new Date().toISOString() });
      }

      case 'pin-tab': {
        const tabId = body.tabId as string;
        if (!tabId) return NextResponse.json({ success: false, error: 'tabId is required' }, { status: 400 });
        const tab = pinTab(tabId);
        if (!tab) return NextResponse.json({ success: false, error: 'Tab not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: tab, timestamp: new Date().toISOString() });
      }

      case 'assign-agent': {
        const tabId = body.tabId as string;
        const agentId = body.agentId as ModelFamily;
        if (!tabId || !agentId) return NextResponse.json({ success: false, error: 'tabId and agentId are required' }, { status: 400 });
        const tab = assignAgentToTab(tabId, agentId);
        if (!tab) return NextResponse.json({ success: false, error: 'Tab not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: tab, timestamp: new Date().toISOString() });
      }

      // ── AI deployment actions ────────────────────────
      case 'deploy-ai': {
        const name = body.name as string;
        const description = body.description as string ?? '';
        const agentFamily = body.agentFamily as ModelFamily;
        const capabilities = body.capabilities as string[] ?? ['internet-control'];
        const initialTask = body.initialTask as string | undefined;
        if (!name || !agentFamily) return NextResponse.json({ success: false, error: 'name and agentFamily are required' }, { status: 400 });
        const ai = deployAI(name, description, agentFamily, capabilities, initialTask);
        return NextResponse.json({ success: true, data: ai, timestamp: new Date().toISOString() });
      }

      case 'pause-ai': {
        const aiId = body.aiId as string;
        if (!aiId) return NextResponse.json({ success: false, error: 'aiId is required' }, { status: 400 });
        const ai = pauseAI(aiId);
        if (!ai) return NextResponse.json({ success: false, error: 'AI not found or not active' }, { status: 404 });
        return NextResponse.json({ success: true, data: ai, timestamp: new Date().toISOString() });
      }

      case 'resume-ai': {
        const aiId = body.aiId as string;
        const task = body.task as string | undefined;
        if (!aiId) return NextResponse.json({ success: false, error: 'aiId is required' }, { status: 400 });
        const ai = resumeAI(aiId, task);
        if (!ai) return NextResponse.json({ success: false, error: 'AI not found or not paused' }, { status: 404 });
        return NextResponse.json({ success: true, data: ai, timestamp: new Date().toISOString() });
      }

      case 'stop-ai': {
        const aiId = body.aiId as string;
        if (!aiId) return NextResponse.json({ success: false, error: 'aiId is required' }, { status: 400 });
        const ai = stopAI(aiId);
        if (!ai) return NextResponse.json({ success: false, error: 'AI not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: ai, timestamp: new Date().toISOString() });
      }

      case 'assign-tab-to-ai': {
        const aiId = body.aiId as string;
        const tabId = body.tabId as string;
        if (!aiId || !tabId) return NextResponse.json({ success: false, error: 'aiId and tabId are required' }, { status: 400 });
        const ai = assignTabToAI(aiId, tabId);
        if (!ai) return NextResponse.json({ success: false, error: 'AI not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: ai, timestamp: new Date().toISOString() });
      }

      case 'run-task': {
        const aiId = body.aiId as string;
        const task = body.task as string;
        if (!aiId || !task) return NextResponse.json({ success: false, error: 'aiId and task are required' }, { status: 400 });
        const result = runAITask(aiId, task);
        if (!result) return NextResponse.json({ success: false, error: 'AI not found or not active' }, { status: 404 });
        return NextResponse.json({ success: true, data: result, timestamp: new Date().toISOString() });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// GET /api/desktop — list tabs, AIs, action history/queue
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') ?? 'tabs';
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') ?? '50', 10);

    switch (action) {
      case 'tabs': {
        const tabs = listTabs();
        return NextResponse.json({ success: true, data: tabs, timestamp: new Date().toISOString() });
      }

      case 'tab': {
        if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
        const tab = getTab(id);
        if (!tab) return NextResponse.json({ success: false, error: 'Tab not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: tab, timestamp: new Date().toISOString() });
      }

      case 'ais': {
        const ais = listDeployedAIs();
        return NextResponse.json({ success: true, data: ais, timestamp: new Date().toISOString() });
      }

      case 'ai': {
        if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
        const ai = getDeployedAI(id);
        if (!ai) return NextResponse.json({ success: false, error: 'AI not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: ai, timestamp: new Date().toISOString() });
      }

      case 'action-history': {
        const history = getActionHistory(limit);
        return NextResponse.json({ success: true, data: history, timestamp: new Date().toISOString() });
      }

      case 'action-queue': {
        const queue = getActionQueue();
        return NextResponse.json({ success: true, data: queue, timestamp: new Date().toISOString() });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
