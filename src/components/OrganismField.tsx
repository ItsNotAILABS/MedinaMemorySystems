'use client';

import { usePlatformSync } from '@/hooks/usePlatformSync';
import type { OrganismRegister } from '@/types';
import MicroWorkerField from '@/components/MicroWorkerField';

const REGISTER_CONFIG: Record<OrganismRegister, { label: string; abbr: string; color: string; glow: string }> = {
  cognitive: { label: 'Cognitive', abbr: 'COG', color: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
  affective: { label: 'Affective', abbr: 'AFF', color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
  somatic: { label: 'Somatic', abbr: 'SOM', color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
  sovereign: { label: 'Sovereign', abbr: 'SOV', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
};

const GATE_COLOR: Record<string, string> = {
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
};

const PHASE_CONFIG: Record<string, { color: string; icon: string }> = {
  awake: { color: '#3b82f6', icon: '◉' },
  integrating: { color: '#8b5cf6', icon: '◎' },
  deep: { color: '#10b981', icon: '●' },
  broadcast: { color: '#f59e0b', icon: '◈' },
};

export default function OrganismField() {
  const sync = usePlatformSync();
  const { organism, gates } = sync;
  const phaseConfig = PHASE_CONFIG[organism.phase] ?? PHASE_CONFIG.awake;
  const registers: OrganismRegister[] = ['cognitive', 'affective', 'somatic', 'sovereign'];

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#0d0d15] border-b border-[#1e1e2e] text-xs overflow-x-auto shrink-0">
      {/* Phase indicator */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="text-sm"
          style={{ color: phaseConfig.color, textShadow: `0 0 6px ${phaseConfig.color}40` }}
        >
          {phaseConfig.icon}
        </span>
        <span className="font-mono font-bold" style={{ color: phaseConfig.color }}>
          {organism.phase.toUpperCase()}
        </span>
      </div>

      <div className="w-px h-4 bg-[#1e1e2e] shrink-0" />

      {/* Gates */}
      <div className="flex items-center gap-1.5 shrink-0">
        {gates.map((gate) => {
          const color = GATE_COLOR[gate.status] ?? '#6b7280';
          return (
            <div
              key={gate.id}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{
                background: `${color}15`,
                border: `1px solid ${color}40`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: color,
                  boxShadow: gate.status === 'green' ? `0 0 4px ${color}` : 'none',
                }}
              />
              <span className="font-mono font-bold text-[10px]" style={{ color }}>
                {gate.id}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-px h-4 bg-[#1e1e2e] shrink-0" />

      {/* Organism register bars */}
      <div className="flex items-center gap-3 shrink-0">
        {registers.map((reg) => {
          const config = REGISTER_CONFIG[reg];
          const value = organism[reg];
          const isDominant = organism.dominantRegister === reg;
          return (
            <div key={reg} className="flex items-center gap-1.5">
              <span className="text-slate-500 font-mono text-[10px] w-6">{config.abbr}</span>
              <div className="w-16 h-2 bg-[#1a1a2e] rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${value}%`,
                    background: `linear-gradient(90deg, ${config.color}80, ${config.color})`,
                    boxShadow: isDominant ? `0 0 8px ${config.glow}` : 'none',
                  }}
                />
              </div>
              <span
                className="font-mono font-bold text-[10px] w-6 text-right"
                style={{ color: config.color }}
              >
                {Math.round(value)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-px h-4 bg-[#1e1e2e] shrink-0" />

      {/* Beat */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-slate-500 font-mono text-[10px]">Beat</span>
        <span className="text-slate-300 font-mono font-bold text-[10px]">{organism.lastBeat}</span>
      </div>

      {/* Models active */}
      <div className="w-px h-4 bg-[#1e1e2e] shrink-0" />
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-slate-500 font-mono text-[10px]">Models</span>
        <span className="text-blue-400 font-mono font-bold text-[10px]">{sync.models.stats.activeModels}/{sync.models.families.length}</span>
      </div>

      {/* Memory */}
      <div className="w-px h-4 bg-[#1e1e2e] shrink-0" />
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-slate-500 font-mono text-[10px]">Mem</span>
        <span className="text-purple-400 font-mono font-bold text-[10px]">{sync.memory.total}</span>
      </div>

      {/* Micro Workers */}
      <div className="w-px h-4 bg-[#1e1e2e] shrink-0" />
      <MicroWorkerField />
    </div>
  );
}
