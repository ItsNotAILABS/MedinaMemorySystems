/**
 * MCP Tool Registry — Medina + iPhone Bridge
 *
 * Exposes MCP-compatible tool schemas and dispatches Medina-native tools
 * in-process. iPhone Bridge tools are documented and routed to the external
 * MESIEServer.py MCP server (see .cursor/mcp.json).
 */

import {
  storeMemory,
  queryMemory,
  listMemories,
  getMemoryStats,
} from '@/lib/memoryEngine';
import { createProposal, listProposals } from '@/lib/governanceEngine';
import { getMCPServer } from '@/lib/goSystem';

// ─── Types ───────────────────────────────────────────────────────────────────

export type MCPToolServer = 'medina' | 'iphone-bridge';

export interface MCPToolParameterProperty {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  enum?: string[];
  items?: { type: string };
}

export interface MCPToolSchema {
  name: string;
  description: string;
  server: MCPToolServer;
  parameters: {
    type: 'object';
    properties: Record<string, MCPToolParameterProperty>;
    required?: string[];
  };
}

export interface MCPToolCallResult {
  success: boolean;
  tool: string;
  server: MCPToolServer;
  data?: unknown;
  error?: string;
  bridgeRequired?: boolean;
  connection?: IPhoneBridgeConnection;
  timestamp: string;
}

export interface IPhoneBridgeConnection {
  serverId: string;
  goSystemId: string;
  command: string;
  args: string[];
  protocol: 'stdio';
  cursorConfigPath: string;
}

export interface MCPServerInfo {
  id: string;
  name: string;
  server: MCPToolServer;
  description: string;
  toolCount: number;
  connection?: IPhoneBridgeConnection;
}

// ─── iPhone Bridge connection defaults ───────────────────────────────────────

export const IPHONE_BRIDGE_GO_SYSTEM_ID = 'MCP-31';

export function getIPhoneBridgeConnection(): IPhoneBridgeConnection {
  return {
    serverId: 'iphone-bridge',
    goSystemId: IPHONE_BRIDGE_GO_SYSTEM_ID,
    command: process.env.MCP_IPHONE_BRIDGE_PYTHON ?? '/home/MESIE/mcp-iphone-bridge/.venv/bin/python',
    args: [
      process.env.MCP_IPHONE_BRIDGE_SCRIPT ?? '/home/MESIE/mcp-iphone-bridge/MESIEServer.py',
    ],
    protocol: 'stdio',
    cursorConfigPath: '.cursor/mcp.json',
  };
}

// ─── Tool definitions ───────────────────────────────────────────────────────

const MEDINA_TOOLS: MCPToolSchema[] = [
  {
    name: 'medina_memory_store',
    description: 'Store data in the Memory Temple',
    server: 'medina',
    parameters: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Content to store' },
        type: { type: 'string', description: 'Memory type', enum: ['semantic', 'episodic', 'procedural', 'doctrine'] },
        tags: { type: 'array', description: 'Optional tags', items: { type: 'string' } },
      },
      required: ['content'],
    },
  },
  {
    name: 'medina_memory_query',
    description: 'Query the Memory Temple by text',
    server: 'medina',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'number', description: 'Maximum results (default 20)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'medina_memory_list',
    description: 'List recent memories',
    server: 'medina',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (default 20)' },
      },
    },
  },
  {
    name: 'medina_memory_stats',
    description: 'Get Memory Temple statistics',
    server: 'medina',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'medina_governance_propose',
    description: 'Submit a governance proposal',
    server: 'medina',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Proposal title' },
        description: { type: 'string', description: 'Proposal description' },
        author: { type: 'string', description: 'Author name (default: AI Client)' },
      },
      required: ['title'],
    },
  },
  {
    name: 'medina_governance_list',
    description: 'List governance proposals',
    server: 'medina',
    parameters: { type: 'object', properties: {} },
  },
];

const IPHONE_BRIDGE_TOOLS: MCPToolSchema[] = [
  {
    name: 'iphone_device_info',
    description: 'Get connected iPhone device details (model, iOS version, battery, storage)',
    server: 'iphone-bridge',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'iphone_screenshot',
    description: 'Capture a screenshot from the connected iPhone',
    server: 'iphone-bridge',
    parameters: {
      type: 'object',
      properties: {
        format: { type: 'string', description: 'Image format', enum: ['jpeg', 'png'] },
      },
    },
  },
  {
    name: 'iphone_tap',
    description: 'Tap at screen coordinates on the iPhone',
    server: 'iphone-bridge',
    parameters: {
      type: 'object',
      properties: {
        x: { type: 'number', description: 'X coordinate' },
        y: { type: 'number', description: 'Y coordinate' },
      },
      required: ['x', 'y'],
    },
  },
  {
    name: 'iphone_swipe',
    description: 'Swipe gesture on the iPhone screen',
    server: 'iphone-bridge',
    parameters: {
      type: 'object',
      properties: {
        fromX: { type: 'number', description: 'Start X coordinate' },
        fromY: { type: 'number', description: 'Start Y coordinate' },
        toX: { type: 'number', description: 'End X coordinate' },
        toY: { type: 'number', description: 'End Y coordinate' },
        duration: { type: 'number', description: 'Swipe duration in milliseconds' },
      },
      required: ['fromX', 'fromY', 'toX', 'toY'],
    },
  },
  {
    name: 'iphone_launch_app',
    description: 'Launch an app on the iPhone by bundle ID',
    server: 'iphone-bridge',
    parameters: {
      type: 'object',
      properties: {
        bundleId: { type: 'string', description: 'App bundle identifier (e.g. com.apple.mobilesafari)' },
      },
      required: ['bundleId'],
    },
  },
  {
    name: 'iphone_ui_scan',
    description: 'Scan the iPhone UI for tappable elements and their coordinates',
    server: 'iphone-bridge',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'iphone_type_text',
    description: 'Type text into the focused field on the iPhone',
    server: 'iphone-bridge',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text to type' },
      },
      required: ['text'],
    },
  },
  {
    name: 'iphone_list_apps',
    description: 'List installed apps on the connected iPhone',
    server: 'iphone-bridge',
    parameters: { type: 'object', properties: {} },
  },
];

export const MCP_TOOL_REGISTRY: MCPToolSchema[] = [...MEDINA_TOOLS, ...IPHONE_BRIDGE_TOOLS];

// ─── Public API ───────────────────────────────────────────────────────────────

export function listMCPTools(filter?: { server?: MCPToolServer }): MCPToolSchema[] {
  if (!filter?.server) return [...MCP_TOOL_REGISTRY];
  return MCP_TOOL_REGISTRY.filter((t) => t.server === filter.server);
}

export function getMCPTool(name: string): MCPToolSchema | undefined {
  return MCP_TOOL_REGISTRY.find((t) => t.name === name);
}

export function listMCPServerInfo(): MCPServerInfo[] {
  const medinaTools = listMCPTools({ server: 'medina' });
  const iphoneTools = listMCPTools({ server: 'iphone-bridge' });
  const goServer = getMCPServer(IPHONE_BRIDGE_GO_SYSTEM_ID);

  return [
    {
      id: 'medina',
      name: 'MEDINA',
      server: 'medina',
      description: 'In-process Medina platform tools (memory, governance)',
      toolCount: medinaTools.length,
    },
    {
      id: 'iphone-bridge',
      name: goServer?.name ?? 'iPhone Bridge (MESIE)',
      server: 'iphone-bridge',
      description: goServer?.description ?? 'Physical iPhone control via MESIE bridge MCP server',
      toolCount: iphoneTools.length,
      connection: getIPhoneBridgeConnection(),
    },
  ];
}

export function callMCPTool(
  toolName: string,
  args: Record<string, unknown> = {},
): MCPToolCallResult {
  const tool = getMCPTool(toolName);
  const timestamp = new Date().toISOString();

  if (!tool) {
    return { success: false, tool: toolName, server: 'medina', error: `Unknown tool: ${toolName}`, timestamp };
  }

  if (tool.server === 'iphone-bridge') {
    return {
      success: false,
      tool: toolName,
      server: 'iphone-bridge',
      bridgeRequired: true,
      connection: getIPhoneBridgeConnection(),
      data: { arguments: args },
      error:
        'iPhone Bridge tools run via the external MESIEServer.py MCP server. ' +
        'Enable iphone-bridge in .cursor/mcp.json and invoke tools through Cursor MCP, ' +
        'or call this endpoint from an environment where MESIEServer.py is running.',
      timestamp,
    };
  }

  try {
    const data = dispatchMedinaTool(toolName, args);
    return { success: true, tool: toolName, server: 'medina', data, timestamp };
  } catch (err) {
    return {
      success: false,
      tool: toolName,
      server: 'medina',
      error: err instanceof Error ? err.message : String(err),
      timestamp,
    };
  }
}

function dispatchMedinaTool(toolName: string, args: Record<string, unknown>): unknown {
  switch (toolName) {
    case 'medina_memory_store': {
      const content = String(args.content ?? '');
      if (!content) throw new Error('content is required');
      const memoryType = (args.type as string) ?? 'semantic';
      const tags = Array.isArray(args.tags) ? args.tags.map(String) : [];
      return storeMemory(content, memoryType as 'semantic' | 'episodic' | 'procedural' | 'doctrine', tags);
    }
    case 'medina_memory_query': {
      const query = String(args.query ?? '');
      if (!query) throw new Error('query is required');
      const limit = typeof args.limit === 'number' ? args.limit : 20;
      return queryMemory({ query, limit });
    }
    case 'medina_memory_list': {
      const limit = typeof args.limit === 'number' ? args.limit : 20;
      return listMemories(limit);
    }
    case 'medina_memory_stats':
      return getMemoryStats();
    case 'medina_governance_propose': {
      const title = String(args.title ?? '');
      if (!title) throw new Error('title is required');
      const description = String(args.description ?? '');
      const author = String(args.author ?? 'AI Client');
      return createProposal(title, description, author);
    }
    case 'medina_governance_list':
      return listProposals();
    default:
      throw new Error(`Medina tool not implemented: ${toolName}`);
  }
}
