import { NextRequest, NextResponse } from 'next/server';
import {
  listModels,
  getModel,
  updateModelStatus,
  listMCPServers,
  getMCPServer,
  updateMCPServerStatus,
  listScrapers,
  getScraper,
  updateScraperStatus,
  listWorkflows,
  getWorkflow,
  updateWorkflowStatus,
  triggerWorkflow,
  listDivisions,
  getFleetStatus,
  queryGOSystem,
  GO_SYSTEM_MANIFEST,
} from '@/lib/goSystem';
import type { ApiResponse } from '@/types';
import type { GOQuery, GOModelStatus, MCPServerStatus, ScraperStatus, WorkflowStatus } from '@/types/goSystem';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'status';
  const id = searchParams.get('id');
  const division = searchParams.get('division') ?? undefined;
  const family = searchParams.get('family') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const status = searchParams.get('status') ?? undefined;

  try {
    switch (action) {
      case 'status':
        return json({ success: true, data: getFleetStatus(), timestamp: now() });

      case 'manifest':
        return json({ success: true, data: GO_SYSTEM_MANIFEST, timestamp: now() });

      case 'divisions':
        return json({ success: true, data: listDivisions(), timestamp: now() });

      case 'models':
        return json({
          success: true,
          data: listModels({
            family: family as GOQuery['family'],
            division: division as GOQuery['division'],
            status: status as GOModelStatus,
          }),
          timestamp: now(),
        });

      case 'model':
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        return json({ success: true, data: getModel(id), timestamp: now() });

      case 'mcpServers':
        return json({
          success: true,
          data: listMCPServers({
            division: division as GOQuery['division'],
            status: status as MCPServerStatus,
          }),
          timestamp: now(),
        });

      case 'mcpServer':
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        return json({ success: true, data: getMCPServer(id), timestamp: now() });

      case 'scrapers':
        return json({
          success: true,
          data: listScrapers({
            category: category as GOQuery['category'],
            status: status as ScraperStatus,
          }),
          timestamp: now(),
        });

      case 'scraper':
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        return json({ success: true, data: getScraper(id), timestamp: now() });

      case 'workflows':
        return json({
          success: true,
          data: listWorkflows({
            division: division as GOQuery['division'],
            status: status as WorkflowStatus,
          }),
          timestamp: now(),
        });

      case 'workflow':
        if (!id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        return json({ success: true, data: getWorkflow(id), timestamp: now() });

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
      action: string;
      id?: string;
      status?: string;
      query?: GOQuery;
    };

    switch (body.action) {
      case 'query': {
        if (!body.query) return json({ success: false, error: 'Query required', timestamp: now() }, 400);
        const result = queryGOSystem(body.query);
        return json({ success: true, data: result, timestamp: now() });
      }

      case 'updateModelStatus': {
        if (!body.id || !body.status) return json({ success: false, error: 'ID and status required', timestamp: now() }, 400);
        const model = updateModelStatus(body.id, body.status as Parameters<typeof updateModelStatus>[1]);
        if (!model) return json({ success: false, error: 'Model not found', timestamp: now() }, 404);
        return json({ success: true, data: model, timestamp: now() });
      }

      case 'updateMCPServerStatus': {
        if (!body.id || !body.status) return json({ success: false, error: 'ID and status required', timestamp: now() }, 400);
        const server = updateMCPServerStatus(body.id, body.status as Parameters<typeof updateMCPServerStatus>[1]);
        if (!server) return json({ success: false, error: 'MCP server not found', timestamp: now() }, 404);
        return json({ success: true, data: server, timestamp: now() });
      }

      case 'updateScraperStatus': {
        if (!body.id || !body.status) return json({ success: false, error: 'ID and status required', timestamp: now() }, 400);
        const scraper = updateScraperStatus(body.id, body.status as Parameters<typeof updateScraperStatus>[1]);
        if (!scraper) return json({ success: false, error: 'Scraper not found', timestamp: now() }, 404);
        return json({ success: true, data: scraper, timestamp: now() });
      }

      case 'updateWorkflowStatus': {
        if (!body.id || !body.status) return json({ success: false, error: 'ID and status required', timestamp: now() }, 400);
        const workflow = updateWorkflowStatus(body.id, body.status as Parameters<typeof updateWorkflowStatus>[1]);
        if (!workflow) return json({ success: false, error: 'Workflow not found', timestamp: now() }, 404);
        return json({ success: true, data: workflow, timestamp: now() });
      }

      case 'triggerWorkflow': {
        if (!body.id) return json({ success: false, error: 'ID required', timestamp: now() }, 400);
        const workflow = triggerWorkflow(body.id);
        if (!workflow) return json({ success: false, error: 'Workflow not found', timestamp: now() }, 404);
        return json({ success: true, data: workflow, timestamp: now() });
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
