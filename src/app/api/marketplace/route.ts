// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 CALL MARKETPLACE API — VOIS-ADDRESSABLE CALL LAYER 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * API endpoint for the Call Marketplace. Supports both read-only queries (GET)
 * and mutating calls (POST). The marketplace boots at process start and is
 * always on — this route queries the already-running engine.
 *
 * GET ?action=snapshot          — Full marketplace snapshot
 * GET ?action=tool&id=TOOL-001  — Query specific tool
 * GET ?action=tools&category=CORE — Tools by category
 * GET ?action=protocol&id=PROTO-001 — Query specific protocol
 * GET ?action=protocols&category=CLIENT_LIFECYCLE — Protocols by category
 * GET ?action=registry           — Full tool registry
 * GET ?action=allProtocols       — All protocols
 * GET ?action=settlements&limit=50 — Recent settlements
 *
 * POST { action: 'invokeTool', tool_id, caller, payload }
 * POST { action: 'executeProtocol', protocol_id, caller, params }
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  isMarketplaceBooted,
  getMarketplaceSnapshot,
  getToolEntry,
  getToolMetadata,
  getContract,
  getToolsByCategory,
  getProtocol,
  getProtocolsByCategory,
  getFullRegistry,
  getAllProtocols,
  getRecentSettlements,
  invokeTool,
} from '@/lib/callMarketplaceEngine';
import type { ToolCategory, ProtocolCategory, CallerIdentity } from '@/types/marketplace';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'snapshot';

    switch (action) {
      case 'snapshot': {
        const snapshot = getMarketplaceSnapshot();
        return NextResponse.json({
          success: true,
          data: snapshot,
          timestamp: new Date().toISOString(),
        });
      }

      case 'tool': {
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ success: false, error: 'Missing tool id' }, { status: 400 });
        const entry = getToolEntry(id);
        const metadata = getToolMetadata(id);
        const contract = getContract(id);
        if (!entry) return NextResponse.json({ success: false, error: `Tool ${id} not found` }, { status: 404 });
        return NextResponse.json({ success: true, data: { entry, metadata, contract }, timestamp: new Date().toISOString() });
      }

      case 'tools': {
        const category = searchParams.get('category') as ToolCategory | null;
        if (!category) return NextResponse.json({ success: false, error: 'Missing category' }, { status: 400 });
        const tools = getToolsByCategory(category);
        return NextResponse.json({ success: true, data: { category, count: tools.length, tools }, timestamp: new Date().toISOString() });
      }

      case 'protocol': {
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ success: false, error: 'Missing protocol id' }, { status: 400 });
        const protocol = getProtocol(id);
        if (!protocol) return NextResponse.json({ success: false, error: `Protocol ${id} not found` }, { status: 404 });
        return NextResponse.json({ success: true, data: protocol, timestamp: new Date().toISOString() });
      }

      case 'protocols': {
        const category = searchParams.get('category') as ProtocolCategory | null;
        if (!category) return NextResponse.json({ success: false, error: 'Missing category' }, { status: 400 });
        const protocols = getProtocolsByCategory(category);
        return NextResponse.json({ success: true, data: { category, count: protocols.length, protocols }, timestamp: new Date().toISOString() });
      }

      case 'registry': {
        const registry = getFullRegistry();
        return NextResponse.json({ success: true, data: { count: registry.length, tools: registry }, timestamp: new Date().toISOString() });
      }

      case 'allProtocols': {
        const protocols = getAllProtocols();
        return NextResponse.json({ success: true, data: { count: protocols.length, protocols }, timestamp: new Date().toISOString() });
      }

      case 'settlements': {
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const records = getRecentSettlements(limit);
        return NextResponse.json({ success: true, data: { count: records.length, settlements: records }, timestamp: new Date().toISOString() });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;
    const action = body.action as string;

    if (!isMarketplaceBooted()) {
      return NextResponse.json({ success: false, error: 'Marketplace not yet booted' }, { status: 503 });
    }

    switch (action) {
      case 'invokeTool': {
        const toolId = body.tool_id as string;
        const caller = body.caller as CallerIdentity;
        const payload = (body.payload as Record<string, unknown>) || {};

        if (!toolId || !caller) {
          return NextResponse.json({ success: false, error: 'Missing tool_id or caller' }, { status: 400 });
        }

        const result = invokeTool(toolId, caller, payload);
        return NextResponse.json({ success: result.success, data: result, timestamp: new Date().toISOString() }, { status: result.success ? 200 : 403 });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
