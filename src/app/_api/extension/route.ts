import { NextRequest, NextResponse } from 'next/server';
import {
  connectExtension,
  disconnectExtension,
  setExtensionPanel,
  receiveExtensionMessage,
  getExtensionState,
} from '@/lib/agiDesktopEngine';
import type { ExtensionPanelMode, ExtensionMessage } from '@/types';

const VALID_PANELS: ExtensionPanelMode[] = ['chat', 'page-analysis', 'memory-write', 'agent-assist', 'tab-control'];

// POST /api/extension — connect, disconnect, set panel, send message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      action: string;
      panel?: ExtensionPanelMode;
      type?: ExtensionMessage['type'];
      payload?: Record<string, unknown>;
    };

    switch (body.action) {
      case 'connect': {
        const state = connectExtension();
        return NextResponse.json({ success: true, data: state, timestamp: new Date().toISOString() });
      }

      case 'disconnect': {
        const state = disconnectExtension();
        return NextResponse.json({ success: true, data: state, timestamp: new Date().toISOString() });
      }

      case 'set-panel': {
        if (!body.panel || !VALID_PANELS.includes(body.panel)) {
          return NextResponse.json({ success: false, error: `Invalid panel. Valid: ${VALID_PANELS.join(', ')}` }, { status: 400 });
        }
        const state = setExtensionPanel(body.panel);
        return NextResponse.json({ success: true, data: state, timestamp: new Date().toISOString() });
      }

      case 'message': {
        if (!body.type) {
          return NextResponse.json({ success: false, error: 'type is required' }, { status: 400 });
        }
        const { response, extensionState } = receiveExtensionMessage(
          body.type,
          body.payload ?? {},
        );
        return NextResponse.json({
          success: true,
          data: { response, extensionState },
          timestamp: new Date().toISOString(),
        });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${body.action}` }, { status: 400 });
    }
  } catch (err) {
    console.error('[/api/extension POST]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/extension — current extension state
export async function GET() {
  try {
    const state = getExtensionState();
    return NextResponse.json({ success: true, data: state, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[/api/extension GET]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
