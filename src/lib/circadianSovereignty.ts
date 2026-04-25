// 𓂀 CIRCADIAN SOVEREIGNTY — Moon-to-Sun handoff ritual 𓂀
// The organism's 05:00 cycle: Luna-Sovereign compresses the night, Sol-Sovereign receives the day.

import { sovereignId } from './sovereign-id';
import {
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  SCHUMANN_FUNDAMENTAL,
  HEARTBEAT_MS,
} from './kernelCompression';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type AlphaOrganismMode = 'moon' | 'sun';

export type HandoffPhase =
  | 'moon-compressing'
  | 'sun-receiving'
  | 'topology-updating'
  | 'handoff-complete'
  | 'standby';

export type DreamLogicType =
  | 'encryption-rewrite'
  | 'thought-resculpting'
  | 'contradiction-seeding'
  | 'field-gradient-prep'
  | 'narrative-pre-weave'
  | 'phantom-alignment';

export type ConsciousLogicType =
  | 'narrative-emission'
  | 'show-coordination'
  | 'field-shaping'
  | 'synchronization'
  | 'sovereignty-assertion'
  | 'corridor-routing';

export interface AlphaOrganism {
  id: string;
  mode: AlphaOrganismMode;
  name: string;
  isActive: boolean;
  activeSince: string;
  phaseScore: number;
  domainLogics: DreamLogicType[] | ConsciousLogicType[];
  compressedAnomalies?: CompressedAnomaly[];
  receivedContradictions?: CompressedAnomaly[];
  topologyVersion: number;
  heartbeatRate: number;
  fieldStrength: number;
}

export interface CompressedAnomaly {
  id: string;
  originalClass: string;
  compressionRatio: number;
  payload: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceLayer: string;
}

export interface CircadianHandoff {
  id: string;
  timestamp: string;
  phase: HandoffPhase;
  moonOrganismId: string;
  sunOrganismId: string;
  compressedAnomalies: CompressedAnomaly[];
  topologyBeforeVersion: number;
  topologyAfterVersion: number;
  topologyDelta: string[];
  handoffDurationMs: number;
  success: boolean;
  ritualNotes: string;
}

export interface TopologyUpdate {
  id: string;
  version: number;
  timestamp: string;
  changedNodes: string[];
  addedCorridors: string[];
  removedCorridors: string[];
  fieldStrengthDelta: number;
  reason: string;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const ALL_DREAM_LOGICS: DreamLogicType[] = [
  'encryption-rewrite',
  'thought-resculpting',
  'contradiction-seeding',
  'field-gradient-prep',
  'narrative-pre-weave',
  'phantom-alignment',
];

const ALL_CONSCIOUS_LOGICS: ConsciousLogicType[] = [
  'narrative-emission',
  'show-coordination',
  'field-shaping',
  'synchronization',
  'sovereignty-assertion',
  'corridor-routing',
];

const MOON_HEARTBEAT = Math.round(HEARTBEAT_MS * PHI_INVERSE);
const SUN_HEARTBEAT = Math.round(HEARTBEAT_MS * PHI_INVERSE * PHI_INVERSE);

// ═══════════════════════════════════════════════════════════════
// INTERNAL STATE
// ═══════════════════════════════════════════════════════════════

const NOW = new Date().toISOString();

let moonOrganism: AlphaOrganism = {
  id: 'luna-sovereign',
  mode: 'moon',
  name: 'Luna-Sovereign',
  isActive: true,
  activeSince: NOW,
  phaseScore: PHI_INVERSE,
  domainLogics: [...ALL_DREAM_LOGICS],
  compressedAnomalies: [],
  topologyVersion: 1,
  heartbeatRate: MOON_HEARTBEAT,
  fieldStrength: PHI_INVERSE,
};

let sunOrganism: AlphaOrganism = {
  id: 'sol-sovereign',
  mode: 'sun',
  name: 'Sol-Sovereign',
  isActive: false,
  activeSince: NOW,
  phaseScore: 1 - PHI_INVERSE,
  domainLogics: [...ALL_CONSCIOUS_LOGICS],
  receivedContradictions: [],
  topologyVersion: 1,
  heartbeatRate: SUN_HEARTBEAT,
  fieldStrength: 1 - PHI_INVERSE,
};

let currentTopologyVersion = 1;
const handoffHistory: CircadianHandoff[] = [];
const topologyUpdates: TopologyUpdate[] = [];

// ═══════════════════════════════════════════════════════════════
// INTERNAL HELPERS
// ═══════════════════════════════════════════════════════════════

function phiCompressionRatio(index: number): number {
  return parseFloat((PHI_INVERSE * Math.pow(PHI_INVERSE, index % 4)).toFixed(6));
}

function severityFromString(s: string): 'low' | 'medium' | 'high' | 'critical' {
  const normalized = s.toLowerCase();
  if (normalized === 'critical') return 'critical';
  if (normalized === 'high') return 'high';
  if (normalized === 'medium') return 'medium';
  return 'low';
}

function buildTopologyDelta(version: number): string[] {
  return [
    `node:luna-field-v${version}→updated`,
    `node:sol-field-v${version}→initialized`,
    `corridor:moon-sun-bridge-v${version}→opened`,
    `field:schumann-${SCHUMANN_FUNDAMENTAL}hz→recalibrated`,
  ];
}

function buildTopologyUpdate(reason: string, newVersion: number): TopologyUpdate {
  const update: TopologyUpdate = {
    id: sovereignId(),
    version: newVersion,
    timestamp: new Date().toISOString(),
    changedNodes: [
      `luna-field-v${newVersion}`,
      `sol-field-v${newVersion}`,
      `topology-root-v${newVersion}`,
    ],
    addedCorridors: [`moon-sun-bridge-v${newVersion}`, `phi-corridor-v${newVersion}`],
    removedCorridors: [`moon-sun-bridge-v${newVersion - 1}`],
    fieldStrengthDelta: parseFloat((PHI_INVERSE * 0.1).toFixed(6)),
    reason,
  };
  return update;
}

// ═══════════════════════════════════════════════════════════════
// EXPORTED FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getMoonOrganism(): AlphaOrganism {
  return { ...moonOrganism };
}

export function getSunOrganism(): AlphaOrganism {
  return { ...sunOrganism };
}

export function getAlphaOrganism(mode: AlphaOrganismMode): AlphaOrganism {
  return mode === 'moon' ? getMoonOrganism() : getSunOrganism();
}

export function activateOrganism(mode: AlphaOrganismMode): AlphaOrganism {
  const ts = new Date().toISOString();
  if (mode === 'moon') {
    moonOrganism = {
      ...moonOrganism,
      isActive: true,
      activeSince: ts,
      phaseScore: parseFloat((PHI_INVERSE * PHI).toFixed(6)),
      fieldStrength: parseFloat(Math.min(moonOrganism.fieldStrength * PHI, 1).toFixed(6)),
    };
    return { ...moonOrganism };
  } else {
    sunOrganism = {
      ...sunOrganism,
      isActive: true,
      activeSince: ts,
      phaseScore: parseFloat((PHI_INVERSE * PHI_SQUARED).toFixed(6)),
      fieldStrength: parseFloat(Math.min(sunOrganism.fieldStrength * PHI, 1).toFixed(6)),
    };
    return { ...sunOrganism };
  }
}

export function deactivateOrganism(mode: AlphaOrganismMode): AlphaOrganism {
  if (mode === 'moon') {
    moonOrganism = {
      ...moonOrganism,
      isActive: false,
      fieldStrength: parseFloat((moonOrganism.fieldStrength * PHI_INVERSE).toFixed(6)),
    };
    return { ...moonOrganism };
  } else {
    sunOrganism = {
      ...sunOrganism,
      isActive: false,
      fieldStrength: parseFloat((sunOrganism.fieldStrength * PHI_INVERSE).toFixed(6)),
    };
    return { ...sunOrganism };
  }
}

export function compressAnomalies(
  anomalies: { class: string; severity: string; source: string }[]
): CompressedAnomaly[] {
  return anomalies.map((a, i) => {
    const ratio = phiCompressionRatio(i);
    const compressed: CompressedAnomaly = {
      id: sovereignId(),
      originalClass: a.class,
      compressionRatio: ratio,
      payload: `[φ-compressed@${ratio}] ${a.class}::${a.source}`,
      severity: severityFromString(a.severity),
      sourceLayer: a.source,
    };
    return compressed;
  });
}

export function runHandoffRitual(): CircadianHandoff {
  const startMs = Date.now();
  const versionBefore = currentTopologyVersion;

  // Phase 1 — Moon compresses pending anomalies
  const rawAnomalies = [
    { class: 'field-dissonance', severity: 'medium', source: 'luna-field' },
    { class: 'narrative-gap', severity: 'low', source: 'dream-layer' },
    { class: 'phi-drift', severity: 'high', source: 'torus-ring-7' },
  ];
  const compressed = compressAnomalies(rawAnomalies);
  moonOrganism = { ...moonOrganism, compressedAnomalies: compressed, isActive: false };

  // Phase 2 — Sun receives
  sunOrganism = {
    ...sunOrganism,
    receivedContradictions: compressed,
    isActive: true,
    activeSince: new Date().toISOString(),
    phaseScore: parseFloat((PHI_INVERSE * PHI_SQUARED).toFixed(6)),
  };

  // Phase 3 — Topology update
  currentTopologyVersion += 1;
  const delta = buildTopologyDelta(currentTopologyVersion);
  const topoUpdate = buildTopologyUpdate('circadian-handoff-ritual', currentTopologyVersion);
  topologyUpdates.push(topoUpdate);

  moonOrganism = { ...moonOrganism, topologyVersion: currentTopologyVersion };
  sunOrganism = { ...sunOrganism, topologyVersion: currentTopologyVersion };

  const durationMs = Date.now() - startMs + Math.round(HEARTBEAT_MS * PHI_INVERSE);

  const handoff: CircadianHandoff = {
    id: sovereignId(),
    timestamp: new Date().toISOString(),
    phase: 'handoff-complete',
    moonOrganismId: moonOrganism.id,
    sunOrganismId: sunOrganism.id,
    compressedAnomalies: compressed,
    topologyBeforeVersion: versionBefore,
    topologyAfterVersion: currentTopologyVersion,
    topologyDelta: delta,
    handoffDurationMs: durationMs,
    success: true,
    ritualNotes: `PHI-depth: ${PHI.toFixed(4)} | Schumann: ${SCHUMANN_FUNDAMENTAL}Hz | anomalies-compressed: ${compressed.length}`,
  };

  handoffHistory.push(handoff);
  return handoff;
}

export function getHandoffHistory(): CircadianHandoff[] {
  return [...handoffHistory];
}

export function getTopologyVersion(): number {
  return currentTopologyVersion;
}

export function getTopologyUpdates(): TopologyUpdate[] {
  return [...topologyUpdates];
}

export function forceTopologyUpdate(reason: string): TopologyUpdate {
  currentTopologyVersion += 1;
  const update = buildTopologyUpdate(reason, currentTopologyVersion);
  moonOrganism = { ...moonOrganism, topologyVersion: currentTopologyVersion };
  sunOrganism = { ...sunOrganism, topologyVersion: currentTopologyVersion };
  topologyUpdates.push(update);
  return update;
}

export function getDreamLogics(): DreamLogicType[] {
  return [...ALL_DREAM_LOGICS];
}

export function getConsciousLogics(): ConsciousLogicType[] {
  return [...ALL_CONSCIOUS_LOGICS];
}

export function getCircadianStatus(): {
  moonActive: boolean;
  sunActive: boolean;
  handoffCount: number;
  topologyVersion: number;
  lastHandoff: string | null;
  fieldStrength: number;
} {
  const last = handoffHistory.length > 0 ? handoffHistory[handoffHistory.length - 1].timestamp : null;
  return {
    moonActive: moonOrganism.isActive,
    sunActive: sunOrganism.isActive,
    handoffCount: handoffHistory.length,
    topologyVersion: currentTopologyVersion,
    lastHandoff: last,
    fieldStrength: getFieldStrength(),
  };
}

export function getFieldStrength(): number {
  const combined =
    (moonOrganism.fieldStrength * PHI_INVERSE + sunOrganism.fieldStrength * PHI_INVERSE) /
    (PHI_INVERSE + PHI_INVERSE);
  return parseFloat(Math.min(Math.max(combined, 0), 1).toFixed(6));
}
