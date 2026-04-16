import { NextRequest, NextResponse } from 'next/server';
import { getEdgeStats, getRecentEdges, clearEdges } from '@/lib/organismEdgeModel';
import { getOrganismState } from '@/lib/organismSovereign';
import { getMemoryStats } from '@/lib/memoryEngine';
import { getGovernanceStats } from '@/lib/governanceEngine';
import { getModelStats } from '@/lib/modelRouter';
import { getReplayStats } from '@/lib/replayEngine';
import { getPermissionStats } from '@/lib/permissionsManager';
import { getDeviceState } from '@/lib/deviceSovereignty';
import { getMessageStats } from '@/lib/messageEngine';
import { getCampaignStats } from '@/lib/campaignEngine';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'full';

    switch (action) {
      case 'quick': {
        // Quick health check
        const organism = getOrganismState();
        return NextResponse.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          organism: {
            phase: organism.phase,
            sovereign: organism.sovereign,
            beat: organism.lastBeat,
          },
        });
      }

      case 'edges': {
        const stats = getEdgeStats();
        const recent = getRecentEdges(20);
        return NextResponse.json({
          stats,
          recent,
        });
      }

      case 'full':
      default: {
        // Full system health
        const organism = getOrganismState();
        const memory = getMemoryStats();
        const governance = getGovernanceStats();
        const models = getModelStats();
        const replay = getReplayStats();
        const permissions = getPermissionStats();
        const device = getDeviceState();
        const edges = getEdgeStats();
        const messages = getMessageStats();
        const campaigns = getCampaignStats();

        // Calculate overall health score
        const healthFactors = [
          organism.sovereign / 100,
          organism.cognitive / 100,
          organism.affective / 100,
          organism.somatic / 100,
          governance.gateStatuses.A === 'green' ? 1 : governance.gateStatuses.A === 'amber' ? 0.5 : 0,
          governance.gateStatuses.B === 'green' ? 1 : governance.gateStatuses.B === 'amber' ? 0.5 : 0,
          governance.gateStatuses.C === 'green' ? 1 : governance.gateStatuses.C === 'amber' ? 0.5 : 0,
          edges.total > 0 ? edges.autoRecovered / edges.total : 1,
        ];

        const healthScore = healthFactors.reduce((a, b) => a + b, 0) / healthFactors.length;

        return NextResponse.json({
          status: healthScore > 0.7 ? 'healthy' : healthScore > 0.4 ? 'degraded' : 'critical',
          healthScore: Math.round(healthScore * 100) / 100,
          timestamp: new Date().toISOString(),
          
          organism: {
            cognitive: organism.cognitive,
            affective: organism.affective,
            somatic: organism.somatic,
            sovereign: organism.sovereign,
            phase: organism.phase,
            beat: organism.lastBeat,
            dominantRegister: organism.dominantRegister,
          },

          subsystems: {
            memory: {
              total: memory.total,
              pinned: memory.pinned,
              avgSalience: Math.round(memory.avgSalience * 100) / 100,
              byType: memory.byType,
            },
            governance: {
              totalProposals: governance.totalProposals,
              open: governance.open,
              enacted: governance.enacted,
              gates: governance.gateStatuses,
            },
            models: {
              totalInvocations: models.totalInvocations,
              activeModels: models.activeModels,
              avgLatency: models.avgLatency,
            },
            replay: {
              totalSessions: replay.totalSessions,
              totalEvents: replay.totalEvents,
              recording: replay.currentlyRecording,
            },
            permissions: {
              total: permissions.total,
              active: permissions.active,
            },
            devices: {
              current: device.device?.fingerprint.type ?? 'none',
              beat: device.currentBeat,
              resonance: device.device?.resonanceStrength ?? 0,
            },
            messaging: {
              drafts: messages.drafts,
              sent: messages.sent,
              pending: messages.pending,
            },
            campaigns: {
              total: campaigns.total,
              active: campaigns.byStatus?.active ?? 0,
              totalReach: campaigns.totalReach,
            },
          },

          edges: {
            total: edges.total,
            autoRecovered: edges.autoRecovered,
            recoveryRate: edges.total > 0 ? Math.round((edges.autoRecovered / edges.total) * 100) : 100,
            byType: edges.byType,
            bySeverity: edges.bySeverity,
            patterns: edges.patterns.length,
            circuits: edges.circuits.length,
          },
        });
      }
    }

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { action: string };

    switch (body.action) {
      case 'clear-edges': {
        clearEdges();
        return NextResponse.json({ 
          success: true, 
          message: 'Edge log cleared',
        });
      }

      default:
        return NextResponse.json({ 
          error: `Unknown action: ${body.action}` 
        }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
