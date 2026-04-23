'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { PlatformSyncState } from '@/types';

const SYNC_INTERVAL = 4000;

const DEFAULT_STATE: PlatformSyncState = {
  organism: { cognitive: 0, affective: 0, somatic: 0, sovereign: 0, phase: 'awake', lastBeat: 0, dominantRegister: 'sovereign' },
  gates: [],
  governance: { totalProposals: 0, open: 0, enacted: 0, approved: 0, gateStatuses: {} as any },
  memory: { total: 0, pinned: 0, byType: {}, avgSalience: 0 },
  models: { families: [], stats: { totalInvocations: 0, activeModels: 0, avgLatency: 0 } },
  replay: { totalSessions: 0, totalEvents: 0, currentlyRecording: false },
  recentMemories: [],
  timestamp: new Date().toISOString(),
  beat: 0,
};

export const PlatformSyncContext = createContext<PlatformSyncState>(DEFAULT_STATE);

export function usePlatformSyncProvider() {
  const [state, setState] = useState<PlatformSyncState>(DEFAULT_STATE);

  const sync = useCallback(async () => {
    try {
      const res = await fetch('/api/sync');
      if (res.ok) {
        const data = await res.json() as PlatformSyncState;
        setState(data);
      }
    } catch {
      // silently ignore sync failures
    }
  }, []);

  useEffect(() => {
    void sync();
    const interval = setInterval(() => void sync(), SYNC_INTERVAL);
    return () => clearInterval(interval);
  }, [sync]);

  return state;
}

export function usePlatformSync(): PlatformSyncState {
  return useContext(PlatformSyncContext);
}
