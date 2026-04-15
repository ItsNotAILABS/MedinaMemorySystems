'use client';

import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import {
  localSovereignTick,
  getLocalOroState,
  getLocalNovaState,
  getLocalVitalSigns,
  harmonicLadder,
  phiSpiral,
  PHI,
  FREQ_432,
  COLORS_432,
  type OroState,
  type NovaState,
  type TickResult,
  type HarmonicRung,
} from '@/lib/icpOrganism';

export default function OrganismPanel() {
  const [oroState, setOroState] = useState<OroState | null>(null);
  const [novaState, setNovaState] = useState<NovaState | null>(null);
  const [tickResult, setTickResult] = useState<TickResult | null>(null);
  const [harmonics, setHarmonics] = useState<HarmonicRung[]>([]);
  const [autoTick, setAutoTick] = useState(true);
  const [tickRate, setTickRate] = useState(2000); // ms
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    setOroState(getLocalOroState());
    setNovaState(getLocalNovaState());
    setHarmonics(harmonicLadder(12));
  }, []);

  // Auto-tick (24/7 sovereign heartbeat)
  useEffect(() => {
    if (autoTick) {
      tickIntervalRef.current = setInterval(() => {
        const result = localSovereignTick();
        setTickResult(result);
        setOroState(getLocalOroState());
        setNovaState(getLocalNovaState());
      }, tickRate);
    }
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, [autoTick, tickRate]);

  const manualTick = () => {
    const result = localSovereignTick();
    setTickResult(result);
    setOroState(getLocalOroState());
    setNovaState(getLocalNovaState());
  };

  if (!oroState || !novaState) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-slate-500 font-mono">Initializing Sovereign Organism...</span>
      </div>
    );
  }

  const vitalSigns = getLocalVitalSigns();

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--hz-432-root)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS_432.oroGold}, ${COLORS_432.novaViolet})`,
              boxShadow: `0 0 20px ${COLORS_432.oroGold}40`
            }}
          >
            Ω
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Sovereign Organism</h2>
            <div className="text-[10px] text-slate-500 font-mono">
              φ={PHI.toFixed(6)} | 432Hz | Beat #{oroState.beat}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoTick(!autoTick)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
              autoTick 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/5'
            )}
          >
            {autoTick ? '● LIVE' : '○ PAUSED'}
          </button>
          <button
            onClick={manualTick}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
          >
            ⏩ Tick
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Dual Intelligence Display */}
        <div className="grid grid-cols-2 gap-4">
          {/* Oro Panel */}
          <div 
            className="rounded-xl p-4 border backdrop-blur-sm"
            style={{ 
              background: COLORS_432.glassBg,
              borderColor: `${COLORS_432.oroGold}30`,
              boxShadow: `0 0 30px ${COLORS_432.oroGold}10`
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: COLORS_432.oroGold, color: COLORS_432.root }}
              >
                O
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: COLORS_432.oroGold }}>
                  Oro
                </div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">
                  {oroState.phase}
                </div>
              </div>
              <div 
                className="ml-auto px-2 py-1 rounded text-[10px] font-mono"
                style={{ 
                  background: `${COLORS_432.oroGold}20`,
                  color: COLORS_432.oroGold 
                }}
              >
                Health: {(oroState.healthScore * 100).toFixed(1)}%
              </div>
            </div>

            {/* Registers */}
            <div className="space-y-2">
              <RegisterBar label="Cognitive" value={oroState.registers.cognitive} color="#4a9eff" />
              <RegisterBar label="Affective" value={oroState.registers.affective} color="#f472b6" />
              <RegisterBar label="Somatic" value={oroState.registers.somatic} color="#4ade80" />
              <RegisterBar label="Sovereign" value={oroState.registers.sovereign} color={COLORS_432.oroGold} />
            </div>

            {/* Field State */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="text-[10px] text-slate-500 mb-2 font-mono">FIELD STATE</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Attention</span>
                  <span className="text-slate-300">{(oroState.fieldState.attention || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coherence</span>
                  <span className="text-slate-300">{(oroState.fieldState.coherence || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Risk</span>
                  <span className="text-slate-300">{(oroState.fieldState.risk || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">φ Resonance</span>
                  <span className="text-slate-300">{(oroState.fieldState.phiResonance || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nova Panel */}
          <div 
            className="rounded-xl p-4 border backdrop-blur-sm"
            style={{ 
              background: COLORS_432.glassBg,
              borderColor: `${COLORS_432.novaViolet}30`,
              boxShadow: `0 0 30px ${COLORS_432.novaViolet}10`
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: COLORS_432.novaViolet, color: 'white' }}
              >
                N
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: COLORS_432.novaViolet }}>
                  Nova
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  DOCTRINE GUARDIAN
                </div>
              </div>
              <div 
                className={clsx(
                  'ml-auto px-2 py-1 rounded text-[10px] font-mono',
                  novaState.consensusWithOro 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                )}
              >
                {novaState.consensusWithOro ? '✓ CONSENSUS' : '⚠ DRIFT'}
              </div>
            </div>

            {/* Nova Metrics */}
            <div className="space-y-2">
              <RegisterBar 
                label="Doctrine Alignment" 
                value={novaState.doctrineAlignment} 
                color={COLORS_432.novaViolet} 
              />
              <RegisterBar label="Cognitive" value={novaState.registers.cognitive} color="#4a9eff" />
              <RegisterBar label="Sovereign" value={novaState.registers.sovereign} color={COLORS_432.oroGold} />
            </div>

            {/* Drift Status */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono">UNRESOLVED DRIFTS</span>
                <span 
                  className="text-sm font-mono font-bold"
                  style={{ color: novaState.unresolvedDrifts > 0 ? COLORS_432.dangerRed : COLORS_432.governanceGreen }}
                >
                  {novaState.unresolvedDrifts}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tick Result */}
        {tickResult && (
          <div 
            className="rounded-xl p-4 border backdrop-blur-sm"
            style={{ background: COLORS_432.glassBg, borderColor: COLORS_432.glassBorder }}
          >
            <div className="text-[10px] text-slate-500 mb-2 font-mono">LAST TICK RESULT</div>
            <div className="grid grid-cols-4 gap-4 text-xs font-mono">
              <MetricCard label="Beat" value={`#${tickResult.beat}`} />
              <MetricCard label="ANIMA Hash" value={tickResult.animaHash.toString(16).toUpperCase().slice(0, 8)} />
              <MetricCard label="Gates" value={tickResult.gatesOpen ? 'OPEN' : 'CLOSED'} color={tickResult.gatesOpen ? COLORS_432.governanceGreen : COLORS_432.dangerRed} />
              <MetricCard label="Phase" value={tickResult.phase.toUpperCase()} />
            </div>
          </div>
        )}

        {/* Harmonic Ladder */}
        <div 
          className="rounded-xl p-4 border backdrop-blur-sm"
          style={{ background: COLORS_432.glassBg, borderColor: COLORS_432.glassBorder }}
        >
          <div className="text-[10px] text-slate-500 mb-3 font-mono">432 Hz HARMONIC LADDER (φ-Scaled)</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {harmonics.slice(0, 8).map((h) => (
              <div 
                key={h.rung}
                className="flex-shrink-0 w-20 rounded-lg p-2 text-center border"
                style={{ 
                  background: `${COLORS_432.novaViolet}${Math.floor(10 + h.rung * 5).toString(16)}`,
                  borderColor: `${COLORS_432.novaViolet}30`
                }}
              >
                <div className="text-lg font-bold text-white">{h.note}</div>
                <div className="text-[10px] text-slate-400 font-mono">{h.freq.toFixed(1)} Hz</div>
                <div className="text-[9px] text-slate-500 font-mono">φ^{h.rung}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phi Spiral Visualization */}
        <div 
          className="rounded-xl p-4 border backdrop-blur-sm"
          style={{ background: COLORS_432.glassBg, borderColor: COLORS_432.glassBorder }}
        >
          <div className="text-[10px] text-slate-500 mb-3 font-mono">φ-SPIRAL MEMORY GEOMETRY</div>
          <PhiSpiralViz count={50} />
        </div>

        {/* Universal Constants */}
        <div 
          className="rounded-xl p-4 border backdrop-blur-sm"
          style={{ background: COLORS_432.glassBg, borderColor: COLORS_432.glassBorder }}
        >
          <div className="text-[10px] text-slate-500 mb-3 font-mono">UNIVERSAL CONSTANTS</div>
          <div className="grid grid-cols-4 gap-3 text-xs font-mono">
            <ConstantCard label="φ (Phi)" value={PHI.toFixed(10)} />
            <ConstantCard label="φ⁻¹" value={(1/PHI).toFixed(10)} />
            <ConstantCard label="Base Freq" value={`${FREQ_432} Hz`} />
            <ConstantCard label="Golden ∠" value="137.5°" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-slate-500 font-mono">{label}</span>
        <span className="font-mono" style={{ color }}>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="text-center">
      <div className="text-[9px] text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-bold" style={{ color: color || COLORS_432.sovereignCyan }}>{value}</div>
    </div>
  );
}

function ConstantCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-2 text-center">
      <div className="text-[9px] text-slate-500 mb-1">{label}</div>
      <div className="text-[11px] text-slate-300 truncate">{value}</div>
    </div>
  );
}

function PhiSpiralViz({ count }: { count: number }) {
  const points = Array.from({ length: count }, (_, i) => phiSpiral(i, 4));
  const maxR = Math.max(...points.map(p => Math.sqrt(p.x ** 2 + p.y ** 2)));
  const scale = 100 / maxR;

  return (
    <svg viewBox="-110 -110 220 220" className="w-full h-48">
      {/* Rings */}
      {[1, 2, 3, 4, 5].map(r => (
        <circle 
          key={r} 
          cx={0} 
          cy={0} 
          r={r * 20} 
          fill="none" 
          stroke={COLORS_432.glassBorder}
          strokeWidth={0.5}
        />
      ))}
      {/* Spiral points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x * scale}
          cy={p.y * scale}
          r={2 + (i / count) * 2}
          fill={i % 2 === 0 ? COLORS_432.oroGold : COLORS_432.novaViolet}
          opacity={0.3 + (i / count) * 0.7}
        />
      ))}
      {/* Center */}
      <circle cx={0} cy={0} r={4} fill={COLORS_432.sovereignCyan} />
    </svg>
  );
}
