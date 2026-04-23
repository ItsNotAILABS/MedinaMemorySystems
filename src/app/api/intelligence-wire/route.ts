// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.
import { NextRequest, NextResponse } from 'next/server';
import { getWireAuditLog, getWireStats } from '@/lib/intelligenceWire';

function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
function now() { return new Date().toISOString(); }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'stats';
  const limit = parseInt(searchParams.get('limit') ?? '100', 10);

  try {
    switch (action) {
      case 'stats':
        return json({ success: true, data: getWireStats(), timestamp: now() });

      case 'audit':
        return json({ success: true, data: getWireAuditLog(limit), timestamp: now() });

      case 'routes': {
        // Import lazily to avoid circular — return the static route map
        const routes: Record<string, string[]> = {
          ArchitectureSurface:  ['/api/health', '/api/intelligence-wire'],
          CampaignsPanel:       ['/api/campaign'],
          CompanyOnboarding:    ['/api/company'],
          DesignerHub:          ['/api/design-os', '/api/health'],
          DevicesPanel:         ['/api/devices'],
          ExportPanel:          ['/api/health', '/api/intelligence-wire'],
          FormaLeaderboard:     ['/api/govern', '/api/health'],
          GovernancePanel:      ['/api/govern'],
          MemoryTemple:         ['/api/health', '/api/intelligence-wire'],
          MessagesPanel:        ['/api/message'],
          ModelRuntime:         ['/api/health', '/api/intelligence-wire'],
          OVOChat:              ['/api/message', '/api/health'],
          OrganismField:        ['/api/health', '/api/intelligence-wire'],
          OrganismPanel:        ['/api/health', '/api/subsystem-terminals'],
          OroTerminal:          ['/api/health', '/api/subsystem-terminals'],
          PermissionsPanel:     ['/api/permissions'],
          ReplayPanel:          ['/api/health', '/api/intelligence-wire'],
          Sidebar:              ['/api/health'],
          TheWorld:             ['/api/health', '/api/subsystem-terminals'],
          WaveformVisualizer:   ['/api/health', '/api/intelligence-wire'],
        };
        return json({ success: true, data: routes, timestamp: now() });
      }

      default:
        return json({ success: false, error: `Unknown action: ${action}`, timestamp: now() }, 400);
    }
  } catch (error) {
    return json({ success: false, error: String(error), timestamp: now() }, 500);
  }
}
