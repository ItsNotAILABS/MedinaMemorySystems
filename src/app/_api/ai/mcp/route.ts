import { NextRequest, NextResponse } from 'next/server';
import {
  listMCPTools,
  getMCPTool,
  listMCPServerInfo,
  callMCPTool,
  getIPhoneBridgeConnection,
  MCP_TOOL_REGISTRY,
  IPHONE_BRIDGE_GO_SYSTEM_ID,
  type MCPToolServer,
} from '@/lib/mcpToolRegistry';
import { getMCPServer } from '@/lib/goSystem';
import type { ApiResponse } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'tools';
  const server = searchParams.get('server') as MCPToolServer | null;
  const toolName = searchParams.get('tool');

  try {
    switch (action) {
      case 'tools':
        return json({
          success: true,
          data: {
            tools: listMCPTools(server ? { server } : undefined),
            total: server ? listMCPTools({ server }).length : MCP_TOOL_REGISTRY.length,
          },
          timestamp: now(),
        });

      case 'tool':
        if (!toolName) return json({ success: false, error: 'tool parameter required', timestamp: now() }, 400);
        return json({ success: true, data: getMCPTool(toolName), timestamp: now() });

      case 'servers':
        return json({ success: true, data: listMCPServerInfo(), timestamp: now() });

      case 'config': {
        const goServer = getMCPServer(IPHONE_BRIDGE_GO_SYSTEM_ID);
        return json({
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
        return json({ success: false, error: 'Unknown action', timestamp: now() }, 400);
    }
  } catch (err) {
    return json({ success: false, error: String(err), timestamp: now() }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      action?: string;
      tool?: string;
      arguments?: Record<string, unknown>;
    };

    if (body.action === 'call' || body.tool) {
      const tool = body.tool;
      if (!tool) return json({ success: false, error: 'tool is required', timestamp: now() }, 400);
      const result = callMCPTool(tool, body.arguments ?? {});
      const status = result.success ? 200 : result.bridgeRequired ? 202 : 400;
      return json({ success: result.success, data: result, timestamp: now() }, status);
    }

    return json({ success: false, error: 'Unknown action. Use POST with { tool, arguments }', timestamp: now() }, 400);
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
