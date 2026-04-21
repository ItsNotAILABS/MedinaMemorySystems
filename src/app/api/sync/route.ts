import { NextRequest, NextResponse } from 'next/server';
import { getOrganismState, pulseOrganism } from '@/lib/organismSovereign';
import { getGates, getGovernanceStats } from '@/lib/governanceEngine';
import { getMemoryStats, listMemories } from '@/lib/memoryEngine';
import { getModels, getModelStats } from '@/lib/modelRouter';
import { getReplayStats } from '@/lib/replayEngine';
import { checkAllGates } from '@/lib/gateEnforcement';

export interface SyncPayload {
  organism: ReturnType<typeof getOrganismState>;
  gates: ReturnType<typeof getGates>;
  gateChecks: ReturnType<typeof checkAllGates>;
  governance: ReturnType<typeof getGovernanceStats>;
  memory: ReturnType<typeof getMemoryStats>;
  models: {
    families: ReturnType<typeof getModels>;
    stats: ReturnType<typeof getModelStats>;
  };
  replay: ReturnType<typeof getReplayStats>;
  recentMemories: ReturnType<typeof listMemories>;
  timestamp: string;
  beat: number;
}

export async function GET() {
  const organism = pulseOrganism();
  const gates = getGates();
  const gateChecks = checkAllGates();
  const governance = getGovernanceStats();
  const memory = getMemoryStats();
  const models = { families: getModels(), stats: getModelStats() };
  const replay = getReplayStats();
  const recentMemories = listMemories(5);

  const payload: SyncPayload = {
    organism,
    gates,
    gateChecks,
    governance,
    memory,
    models,
    replay,
    recentMemories,
    timestamp: new Date().toISOString(),
    beat: organism.lastBeat,
  };

  return NextResponse.json(payload);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { action: string };

  if (body.action === 'pulse') {
    const organism = pulseOrganism();
    return NextResponse.json({ organism, timestamp: new Date().toISOString() });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
