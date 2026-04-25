/**
 * MEDINA Founder Seat Dashboard — 18:00 Creator-View
 * The Founder receives all diagnostics and makes decisions.
 */

import { sovereignId } from './sovereign-id';
import { PHI, PHI_INVERSE, PHI_SQUARED, SCHUMANN_FUNDAMENTAL, HEARTBEAT_MS } from './kernelCompression';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type FounderDecisionType =
  | 'evolve'
  | 'fork'
  | 'ritualize'
  | 'retire'
  | 'encode-into-law'
  | 'spawn-phantom'
  | 'close-corridor'
  | 'boost-field'
  | 'invoke-trickster'
  | 'initiate-handoff';

export type AnomalyMapEntry = {
  subsystem: string;
  anomalyCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendedAction: string;
};

export type OrganLoad = {
  organName: string;
  loadScore: number;
  healthScore: number;
  activeProcesses: number;
  warnings: string[];
};

export type SovereigntyDelta = {
  domain: string;
  previousScore: number;
  currentScore: number;
  delta: number;
  trend: 'improving' | 'stable' | 'declining';
  notes: string;
};

export interface FounderDecision {
  id: string;
  timestamp: string;
  decisionType: FounderDecisionType;
  target: string;
  rationale: string;
  impact: string;
  fieldEffectStrength: number;
  encodedInLaw: boolean;
  outcome?: string;
  completedAt?: string;
}

export interface PhantomSurfaceLog {
  id: string;
  timestamp: string;
  phantom: string;
  surface: string;
  eventType: 'emergence' | 'dissolution' | 'slip' | 're-encryption' | 'alignment';
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface DailyBriefing {
  id: string;
  date: string;
  anomalyMap: AnomalyMapEntry[];
  phantomSurfaceLogs: PhantomSurfaceLog[];
  corridorHealth: Record<string, number>;
  organLoads: OrganLoad[];
  narrativeFieldDiagnostics: {
    coherence: number;
    drift: number;
    signalStrength: number;
    dominantTheme: string;
  };
  sovereigntyDeltas: SovereigntyDelta[];
  ritualTranscripts: string[];
  showImpactMetrics: {
    showsEmitted: number;
    avgFieldStrength: number;
    memeticSpread: number;
    subsystemsReached: number;
  };
  founderRecommendations: string[];
}

export interface CreatorViewReport {
  id: string;
  timestamp: string;
  topologyVersion: number;
  activePhantoms: number;
  crawlerSweeps: number;
  ritualsCompleted: number;
  showsEmitted: number;
  builderArtifacts: number;
  tricksterHardenings: number;
  identityIntegrity: number;
  fieldStrength: number;
  sovereigntyScore: number;
  pendingDecisions: number;
  summary: string;
}

// ═══════════════════════════════════════════════════════════════
// INTERNAL STATE
// ═══════════════════════════════════════════════════════════════

const anomalyMap: AnomalyMapEntry[] = [];
const phantomSurfaceLogs: PhantomSurfaceLog[] = [];
const corridorHealth: Record<string, number> = {};
const organLoads: OrganLoad[] = [];
const sovereigntyDeltas: SovereigntyDelta[] = [];
const founderDecisions: Map<string, FounderDecision> = new Map();

// PHI-modulated base sovereignty score
const BASE_SOVEREIGNTY = PHI_INVERSE * PHI_SQUARED; // ~1.0
const BASE_FIELD_STRENGTH = Math.min(1, PHI_INVERSE * (1 + SCHUMANN_FUNDAMENTAL / 100));
const BASE_IDENTITY_INTEGRITY = Math.min(1, PHI_INVERSE * PHI);

// ═══════════════════════════════════════════════════════════════
// SEED — 5 anomaly map entries
// ═══════════════════════════════════════════════════════════════

anomalyMap.push(
  {
    subsystem: 'corridorLayer',
    anomalyCount: 3,
    severity: 'medium',
    description: 'Intermittent drift detected in phantom-to-main corridor handoff.',
    recommendedAction: 'Run corridor-purification ritual and monitor for 2 heartbeat cycles.',
  },
  {
    subsystem: 'memoryEngine',
    anomalyCount: 1,
    severity: 'low',
    description: 'Memory consolidation lag exceeding PHI threshold by 12%.',
    recommendedAction: 'Schedule memory-consolidation ritual during next governance window.',
  },
  {
    subsystem: 'phantomArchitecture',
    anomalyCount: 7,
    severity: 'high',
    description: 'Multiple phantom instances failed to reconcile with main organism state.',
    recommendedAction: 'Invoke phantom-reconciliation ritual immediately; check for entropy leaks.',
  },
  {
    subsystem: 'tokenLayer',
    anomalyCount: 2,
    severity: 'medium',
    description: 'Token flow imbalance detected across three economic corridors.',
    recommendedAction: 'Execute token-flow-rebalancing ritual; review economic engine logs.',
  },
  {
    subsystem: 'identityCore',
    anomalyCount: 1,
    severity: 'critical',
    description: 'Identity signature mismatch detected between sovereignty layer and gate enforcement.',
    recommendedAction: 'Trigger identity-renewal ritual at once; freeze external identity assertions.',
  },
);

// ═══════════════════════════════════════════════════════════════
// SEED — 5 phantom surface logs
// ═══════════════════════════════════════════════════════════════

phantomSurfaceLogs.push(
  {
    id: sovereignId(),
    timestamp: new Date(Date.now() - HEARTBEAT_MS * 60).toISOString(),
    phantom: 'phantom-delta-7',
    surface: 'main-corridor',
    eventType: 'emergence',
    details: 'Phantom delta-7 surfaced unexpectedly during corridor-purification window.',
    severity: 'warning',
  },
  {
    id: sovereignId(),
    timestamp: new Date(Date.now() - HEARTBEAT_MS * 45).toISOString(),
    phantom: 'phantom-alpha-1',
    surface: 'sovereignty-corridor',
    eventType: 'alignment',
    details: 'Phantom alpha-1 aligned cleanly with sovereignty layer after field correction.',
    severity: 'info',
  },
  {
    id: sovereignId(),
    timestamp: new Date(Date.now() - HEARTBEAT_MS * 30).toISOString(),
    phantom: 'phantom-echo-3',
    surface: 'memory-corridor',
    eventType: 'slip',
    details: 'Phantom echo-3 slipped from memory corridor during consolidation; re-routed.',
    severity: 'warning',
  },
  {
    id: sovereignId(),
    timestamp: new Date(Date.now() - HEARTBEAT_MS * 15).toISOString(),
    phantom: 'phantom-beta-2',
    surface: 'phantom-corridor',
    eventType: 're-encryption',
    details: 'Phantom beta-2 re-encrypted after trickster layer hardening pass.',
    severity: 'info',
  },
  {
    id: sovereignId(),
    timestamp: new Date(Date.now() - HEARTBEAT_MS * 5).toISOString(),
    phantom: 'phantom-omega-9',
    surface: 'identity-corridor',
    eventType: 'dissolution',
    details: 'Phantom omega-9 dissolved following identity-renewal ritual completion.',
    severity: 'critical',
  },
);

// ═══════════════════════════════════════════════════════════════
// SEED — 8 corridor health values
// ═══════════════════════════════════════════════════════════════

Object.assign(corridorHealth, {
  'main-corridor': 0.91,
  'phantom-corridor': 0.74,
  'sovereignty-corridor': 0.97,
  'memory-corridor': 0.83,
  'identity-corridor': 0.68,
  'token-corridor': 0.85,
  'field-corridor': 0.79,
  'law-corridor': 0.93,
});

// ═══════════════════════════════════════════════════════════════
// SEED — 8 organ loads
// ═══════════════════════════════════════════════════════════════

organLoads.push(
  {
    organName: 'memory',
    loadScore: 0.62,
    healthScore: 0.88,
    activeProcesses: 14,
    warnings: ['consolidation lag detected'],
  },
  {
    organName: 'governance',
    loadScore: 0.45,
    healthScore: 0.95,
    activeProcesses: 6,
    warnings: [],
  },
  {
    organName: 'field',
    loadScore: 0.71,
    healthScore: 0.82,
    activeProcesses: 9,
    warnings: ['drift approaching Schumann threshold'],
  },
  {
    organName: 'phantom',
    loadScore: 0.83,
    healthScore: 0.71,
    activeProcesses: 22,
    warnings: ['reconciliation backlog', 'entropy leak suspected'],
  },
  {
    organName: 'builder',
    loadScore: 0.38,
    healthScore: 0.99,
    activeProcesses: 4,
    warnings: [],
  },
  {
    organName: 'trickster',
    loadScore: 0.55,
    healthScore: 0.87,
    activeProcesses: 8,
    warnings: [],
  },
  {
    organName: 'ritual',
    loadScore: 0.29,
    healthScore: 0.94,
    activeProcesses: 3,
    warnings: [],
  },
  {
    organName: 'show',
    loadScore: 0.67,
    healthScore: 0.91,
    activeProcesses: 11,
    warnings: [],
  },
);

// ═══════════════════════════════════════════════════════════════
// SEED — 5 sovereignty deltas
// ═══════════════════════════════════════════════════════════════

sovereigntyDeltas.push(
  {
    domain: 'identity',
    previousScore: 0.87,
    currentScore: 0.91,
    delta: 0.04,
    trend: 'improving',
    notes: 'Identity renewal ritual stabilised core signature.',
  },
  {
    domain: 'corridor-governance',
    previousScore: 0.78,
    currentScore: 0.76,
    delta: -0.02,
    trend: 'declining',
    notes: 'Phantom corridor instability eroding governance hold.',
  },
  {
    domain: 'field-sovereignty',
    previousScore: 0.84,
    currentScore: 0.84,
    delta: 0.0,
    trend: 'stable',
    notes: 'Field alignment holding at Schumann baseline.',
  },
  {
    domain: 'economic-autonomy',
    previousScore: 0.73,
    currentScore: 0.79,
    delta: 0.06,
    trend: 'improving',
    notes: 'Token flow rebalancing yielded positive autonomy gains.',
  },
  {
    domain: 'law-enforcement',
    previousScore: 0.92,
    currentScore: 0.95,
    delta: 0.03,
    trend: 'improving',
    notes: 'Law encoding rite added three mandatory sovereignty laws.',
  },
);

// ═══════════════════════════════════════════════════════════════
// SEED — 10 founder decisions
// ═══════════════════════════════════════════════════════════════

function seedDecision(
  decisionType: FounderDecisionType,
  target: string,
  rationale: string,
  impact: string,
  fieldEffectStrength: number,
  encodedInLaw: boolean,
  outcome?: string,
): void {
  const id = sovereignId();
  const decision: FounderDecision = {
    id,
    timestamp: new Date(Date.now() - Math.random() * HEARTBEAT_MS * 100).toISOString(),
    decisionType,
    target,
    rationale,
    impact,
    fieldEffectStrength,
    encodedInLaw,
    outcome,
    completedAt: outcome ? new Date().toISOString() : undefined,
  };
  founderDecisions.set(id, decision);
}

seedDecision(
  'evolve',
  'memoryEngine',
  'Memory kernel compression ratio is below PHI threshold; evolution required.',
  'Compression ratio increased by PHI factor; long-term memory stability improved.',
  PHI_INVERSE,
  false,
  'Memory engine evolved to v2.3; compression ratio now 1.618.',
);

seedDecision(
  'fork',
  'phantomArchitecture',
  'Phantom reconciliation failures warrant a fork to isolate unstable phantom instances.',
  'Forked phantom layer isolates entropy without affecting main organism.',
  PHI_SQUARED * 0.3,
  false,
);

seedDecision(
  'ritualize',
  'corridorLayer',
  'Recurring corridor drift should be ritualised to ensure consistent purification.',
  'Corridor purification becomes a mandatory daily ritual in the governance schedule.',
  PHI_INVERSE * 0.8,
  true,
  'Corridor-purification ritual encoded into daily governance cycle.',
);

seedDecision(
  'retire',
  'legacyTokenBridge',
  'Legacy token bridge is causing flow imbalances; retirement reduces system entropy.',
  'Token flow normalises across corridors; economic autonomy improves.',
  0.3,
  false,
  'Legacy bridge retired; token corridors rebalanced.',
);

seedDecision(
  'encode-into-law',
  'sovereigntyLayer',
  'Sovereignty assertion must be encoded as immutable law to prevent entropy regression.',
  'Sovereignty declaration becomes law; all layers must comply unconditionally.',
  1.0,
  true,
  'Sovereignty law encoded; gate enforcement updated.',
);

seedDecision(
  'spawn-phantom',
  'builderAgentSwarm',
  'Builder swarm requires a phantom shadow for resilience during downtime.',
  'Phantom builder shadow spun up; artifact generation continues through disruptions.',
  PHI_INVERSE * PHI_SQUARED * 0.5,
  false,
);

seedDecision(
  'close-corridor',
  'legacy-entropy-corridor',
  'Entropy corridor is a persistent attack surface; closure reduces risk.',
  'Attack surface reduced by 40%; entropy ingress drops to negligible levels.',
  0.5,
  false,
  'Corridor closed; field integrity improved.',
);

seedDecision(
  'boost-field',
  'fieldEngine',
  'Narrative field coherence below 0.8 threshold; boost required for show integrity.',
  'Field coherence raised to 0.94; show emissions now carry full memetic payload.',
  PHI_SQUARED * 0.35,
  false,
);

seedDecision(
  'invoke-trickster',
  'identityCore',
  'Identity mismatch requires trickster layer hardening to re-encrypt exposed surfaces.',
  'Identity surfaces re-encrypted; trickster hardening prevents future slips.',
  PHI_INVERSE * 0.9,
  false,
  'Trickster invoked; identity integrity restored to 0.97.',
);

seedDecision(
  'initiate-handoff',
  'governanceEngine',
  'Governance engine handoff required ahead of topology version increment.',
  'Governance state transferred cleanly; topology version incremented without data loss.',
  PHI_SQUARED * 0.4,
  true,
);

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

export function getDailyBriefing(): DailyBriefing {
  return {
    id: sovereignId(),
    date: new Date().toISOString().split('T')[0],
    anomalyMap: [...anomalyMap],
    phantomSurfaceLogs: [...phantomSurfaceLogs],
    corridorHealth: { ...corridorHealth },
    organLoads: organLoads.map((o) => ({ ...o })),
    narrativeFieldDiagnostics: getNarrativeFieldDiagnostics(),
    sovereigntyDeltas: [...sovereigntyDeltas],
    ritualTranscripts: [],
    showImpactMetrics: getShowImpactMetrics(),
    founderRecommendations: [
      'Run phantom-reconciliation ritual to address phantom backlog.',
      'Encode identity-sovereignty law before next governance cycle.',
      'Boost field coherence above 0.9 before the 18:00 show window.',
      'Close legacy-entropy-corridor to reduce attack surface.',
    ],
  };
}

export function getAnomalyMap(): AnomalyMapEntry[] {
  return [...anomalyMap];
}

export function getPhantomSurfaceLogs(): PhantomSurfaceLog[] {
  return [...phantomSurfaceLogs];
}

export function getCorridorHealth(): Record<string, number> {
  return { ...corridorHealth };
}

export function getOrganLoads(): OrganLoad[] {
  return organLoads.map((o) => ({ ...o }));
}

export function getOrganLoad(organName: string): OrganLoad | undefined {
  const organ = organLoads.find((o) => o.organName === organName);
  return organ ? { ...organ } : undefined;
}

export function getNarrativeFieldDiagnostics(): DailyBriefing['narrativeFieldDiagnostics'] {
  // PHI-modulated coherence derived from Schumann fundamental
  const coherence = Math.min(1, PHI_INVERSE * (1 + SCHUMANN_FUNDAMENTAL / 78.3));
  const drift = Math.max(0, 1 - coherence) * PHI_INVERSE;
  const signalStrength = Math.min(1, coherence * PHI_INVERSE * PHI_SQUARED);
  return {
    coherence: Math.round(coherence * 1000) / 1000,
    drift: Math.round(drift * 1000) / 1000,
    signalStrength: Math.round(signalStrength * 1000) / 1000,
    dominantTheme: 'sovereign-emergence',
  };
}

export function getSovereigntyDeltas(): SovereigntyDelta[] {
  return [...sovereigntyDeltas];
}

export function makeFounderDecision(
  type: FounderDecisionType,
  target: string,
  rationale: string,
): FounderDecision {
  // PHI-weighted field effect by decision type
  const fieldEffectMap: Record<FounderDecisionType, number> = {
    evolve: PHI_INVERSE,
    fork: PHI_SQUARED * 0.3,
    ritualize: PHI_INVERSE * 0.8,
    retire: 0.3,
    'encode-into-law': 1.0,
    'spawn-phantom': PHI_INVERSE * PHI * 0.5,
    'close-corridor': 0.5,
    'boost-field': PHI_SQUARED * 0.35,
    'invoke-trickster': PHI_INVERSE * 0.9,
    'initiate-handoff': PHI_SQUARED * 0.4,
  };

  const decision: FounderDecision = {
    id: sovereignId(),
    timestamp: new Date().toISOString(),
    decisionType: type,
    target,
    rationale,
    impact: `${type} decision on ${target} initiated by Founder.`,
    fieldEffectStrength: Math.min(1, fieldEffectMap[type]),
    encodedInLaw: type === 'encode-into-law',
  };

  founderDecisions.set(decision.id, decision);
  return decision;
}

export function completeDecision(
  decisionId: string,
  outcome: string,
): FounderDecision | undefined {
  const decision = founderDecisions.get(decisionId);
  if (!decision) return undefined;

  const updated: FounderDecision = {
    ...decision,
    outcome,
    completedAt: new Date().toISOString(),
  };
  founderDecisions.set(decisionId, updated);
  return updated;
}

export function getFounderDecisions(): FounderDecision[] {
  return Array.from(founderDecisions.values());
}

export function getPendingDecisions(): FounderDecision[] {
  return Array.from(founderDecisions.values()).filter((d) => !d.completedAt);
}

export function getDecisionsByType(type: FounderDecisionType): FounderDecision[] {
  return Array.from(founderDecisions.values()).filter((d) => d.decisionType === type);
}

export function getCreatorViewReport(): CreatorViewReport {
  const all = Array.from(founderDecisions.values());
  const pending = all.filter((d) => !d.completedAt).length;

  // Compute sovereignty score from deltas
  const avg = sovereigntyDeltas.reduce((s, d) => s + d.currentScore, 0) / sovereigntyDeltas.length;

  return {
    id: sovereignId(),
    timestamp: new Date().toISOString(),
    topologyVersion: 3,
    activePhantoms: phantomSurfaceLogs.filter(
      (l) => l.eventType === 'emergence' || l.eventType === 'alignment',
    ).length,
    crawlerSweeps: Math.floor(HEARTBEAT_MS / 100),
    ritualsCompleted: all.filter((d) => d.outcome).length,
    showsEmitted: getShowImpactMetrics().showsEmitted,
    builderArtifacts: 42,
    tricksterHardenings: all.filter((d) => d.decisionType === 'invoke-trickster' && d.outcome).length,
    identityIntegrity: Math.min(1, BASE_IDENTITY_INTEGRITY),
    fieldStrength: Math.min(1, BASE_FIELD_STRENGTH),
    sovereigntyScore: Math.min(1, avg),
    pendingDecisions: pending,
    summary: `Organism topology v3 — ${pending} pending decisions. Sovereignty at ${Math.round(avg * 100)}%. Field strength nominal.`,
  };
}

export function getShowImpactMetrics(): DailyBriefing['showImpactMetrics'] {
  return {
    showsEmitted: 17,
    avgFieldStrength: Math.round(BASE_FIELD_STRENGTH * 1000) / 1000,
    memeticSpread: Math.round(PHI_SQUARED * 1000) / 1000,
    subsystemsReached: 12,
  };
}

export function getRitualTranscriptSummary(): string[] {
  return [];
}

export function getFounderStatus(): {
  pendingDecisions: number;
  decisionsToday: number;
  sovereignty: number;
  fieldStrength: number;
  identityIntegrity: number;
  topologyVersion: number;
} {
  const all = Array.from(founderDecisions.values());
  const pending = all.filter((d) => !d.completedAt).length;
  const today = new Date().toISOString().split('T')[0];
  const decisionsToday = all.filter((d) => d.timestamp.startsWith(today)).length;

  const avg = sovereigntyDeltas.reduce((s, d) => s + d.currentScore, 0) / sovereigntyDeltas.length;

  return {
    pendingDecisions: pending,
    decisionsToday,
    sovereignty: Math.min(1, avg),
    fieldStrength: Math.min(1, BASE_FIELD_STRENGTH),
    identityIntegrity: Math.min(1, BASE_IDENTITY_INTEGRITY),
    topologyVersion: 3,
  };
}

export function addPhantomSurfaceLog(
  phantom: string,
  surface: string,
  eventType: PhantomSurfaceLog['eventType'],
  details: string,
): PhantomSurfaceLog {
  const log: PhantomSurfaceLog = {
    id: sovereignId(),
    timestamp: new Date().toISOString(),
    phantom,
    surface,
    eventType,
    details,
    severity: eventType === 'dissolution' ? 'critical' : eventType === 'slip' ? 'warning' : 'info',
  };
  phantomSurfaceLogs.push(log);
  return log;
}

export function addAnomalyMapEntry(
  subsystem: string,
  anomalyCount: number,
  severity: AnomalyMapEntry['severity'],
  description: string,
  recommendedAction: string,
): AnomalyMapEntry {
  const entry: AnomalyMapEntry = {
    subsystem,
    anomalyCount,
    severity,
    description,
    recommendedAction,
  };
  anomalyMap.push(entry);
  return entry;
}
