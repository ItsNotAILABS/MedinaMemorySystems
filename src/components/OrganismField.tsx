'use client';

import { useState, useEffect } from 'react';
import type { OrganismState, Gate } from '@/types';

const GATE_COLOR: Record<string, string> = {
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
};

export default function OrganismField() {
  const [organism, setOrganism] = useState<OrganismState>({
    cognitive: 87,
    affective: 74,
    somatic: 91,
    sovereign: 96,
    phase: 'awake',
    lastBeat: 1,
    dominantRegister: 'sovereign',
  });
  const [gates, setGates] = useState<Gate[]>([
    { id: 'A', name: 'Governance', status: 'green', description: '', lastChecked: new Date().toISOString() },
    { id: 'B', name: 'Memory', status: 'green', description: '', lastChecked: new Date().toISOString() },
    { id: 'C', name: 'Sovereign', status: 'amber', description: '', lastChecked: new Date().toISOString() },
  ]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/govern?action=gates');
        if (res.ok) {
          const data = await res.json() as { data: Gate[] };
          if (data.data) setGates(data.data);
        }
      } catch {
        // ignore
      }

      // Simulate organism pulse
      setOrganism((prev) => ({
        ...prev,
        cognitive: clamp(prev.cognitive + (Math.random() * 4 - 2)),
        affective: clamp(prev.affective + (Math.random() * 4 - 2)),
        somatic: clamp(prev.somatic + (Math.random() * 2 - 1)),
        lastBeat: prev.lastBeat + 1,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function clamp(v: number) {
    return Math.max(0, Math.min(100, Math.round(v)));
  }

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-[#0d0d15] border-b border-[#1e1e2e] text-xs overflow-x-auto shrink-0">
      {/* Gates */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-slate-500 mr-1">Gates:</span>
        {gates.map((gate) => (
          <span
            key={gate.id}
            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold"
            style={{
              color: GATE_COLOR[gate.status],
              background: `${GATE_COLOR[gate.status]}18`,
              border: `1px solid ${GATE_COLOR[gate.status]}40`,
            }}
          >
            {gate.id}:{gate.status.toUpperCase()}
          </span>
        ))}
      </div>

      <div className="w-px h-4 bg-[#1e1e2e] shrink-0" />

      {/* Organism registers */}
      <div className="flex items-center gap-3 shrink-0 font-mono">
        <span className="text-slate-500">Organism:</span>
        <RegisterBar label="COG" value={organism.cognitive} color="#3b82f6" />
        <RegisterBar label="AFF" value={organism.affective} color="#8b5cf6" />
        <RegisterBar label="SOM" value={organism.somatic} color="#10b981" />
        <RegisterBar label="SOV" value={organism.sovereign} color="#f59e0b" />
      </div>

      <div className="w-px h-4 bg-[#1e1e2e] shrink-0" />

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-slate-500">Phase:</span>
        <span className="text-blue-400 font-mono">{organism.phase.toUpperCase()}</span>
        <span className="text-slate-500">Beat:</span>
        <span className="text-slate-300 font-mono">{organism.lastBeat}</span>
      </div>
    </div>
  );
}

function RegisterBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-slate-500">{label}:</span>
      <span style={{ color }} className="font-bold">{Math.round(value)}</span>
    </span>
  );
}
