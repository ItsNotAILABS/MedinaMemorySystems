// 𓂀 NIGHT CRAWLER ENGINE — Immune System Sweep (03:00 Cycle) 𓂀

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

export type CrawlerClass =
  | 'anomaly-harvester'
  | 'contradiction-sniffer'
  | 'corridor-stress-tester'
  | 'phantom-encryption-auditor'
  | 'frequency-signal-sculptor'
  | 'sovereignty-probe'
  | 'narrative-drift-detector'
  | 'field-gradient-mapper';

export type CrawlerState = 'idle' | 'sweeping' | 'harvesting' | 'reporting' | 'dormant';

export type AnomalyClass =
  | 'corridor-stress'
  | 'encryption-breach'
  | 'frequency-drift'
  | 'narrative-inversion'
  | 'sovereignty-leak'
  | 'phantom-misalignment'
  | 'field-collapse'
  | 'contradiction-loop';

export type SweepPhase = 'init' | 'deploy' | 'sweep' | 'harvest' | 'stress-push' | 'complete';

export interface NightCrawler {
  id: string;
  name: string;
  class: CrawlerClass;
  state: CrawlerState;
  target: string;
  anomaliesFound: number;
  contradictionsFound: number;
  emergentBehaviorsTriggered: number;
  newStatesDiscovered: number;
  sweepDepth: number;
  lastSweep: string;
  sweepCount: number;
}

export interface Anomaly {
  id: string;
  class: AnomalyClass;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceSubsystem: string;
  description: string;
  discoveredBy: string;
  discoveredAt: string;
  stressed: boolean;
  newStateEmerged: boolean;
  emergentBehavior?: string;
}

export interface SweepReport {
  id: string;
  timestamp: string;
  phase: SweepPhase;
  crawlerCount: number;
  anomaliesHarvested: number;
  contradictionsFound: number;
  emergentBehaviors: string[];
  newStatesDiscovered: string[];
  metabolismScore: number;
  immuneStrength: number;
  recommendations: string[];
}

// ═══════════════════════════════════════════════════════════════
// INTERNAL STATE
// ═══════════════════════════════════════════════════════════════

const crawlers: Map<string, NightCrawler> = new Map();
const anomalies: Map<string, Anomaly> = new Map();
const sweepHistory: SweepReport[] = [];
const emergentBehaviors: string[] = [];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function deterministicIndex(seed: string, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % max;
}

function pickSeverity(crawlerClass: CrawlerClass, idx: number): Anomaly['severity'] {
  const severities: Anomaly['severity'][] = ['low', 'medium', 'high', 'critical'];
  const classWeight: Record<CrawlerClass, number> = {
    'anomaly-harvester': 1,
    'contradiction-sniffer': 2,
    'corridor-stress-tester': 3,
    'phantom-encryption-auditor': 2,
    'frequency-signal-sculptor': 1,
    'sovereignty-probe': 3,
    'narrative-drift-detector': 1,
    'field-gradient-mapper': 2,
  };
  const base = (classWeight[crawlerClass] + idx) % severities.length;
  return severities[base];
}

function pickAnomalyClass(crawlerClass: CrawlerClass, idx: number): AnomalyClass {
  const mapping: Record<CrawlerClass, AnomalyClass[]> = {
    'anomaly-harvester': ['corridor-stress', 'field-collapse', 'frequency-drift'],
    'contradiction-sniffer': ['contradiction-loop', 'narrative-inversion', 'phantom-misalignment'],
    'corridor-stress-tester': ['corridor-stress', 'field-collapse', 'phantom-misalignment'],
    'phantom-encryption-auditor': ['encryption-breach', 'phantom-misalignment', 'sovereignty-leak'],
    'frequency-signal-sculptor': ['frequency-drift', 'field-collapse', 'corridor-stress'],
    'sovereignty-probe': ['sovereignty-leak', 'encryption-breach', 'contradiction-loop'],
    'narrative-drift-detector': ['narrative-inversion', 'contradiction-loop', 'frequency-drift'],
    'field-gradient-mapper': ['field-collapse', 'corridor-stress', 'frequency-drift'],
  };
  const pool = mapping[crawlerClass];
  return pool[idx % pool.length];
}

function buildAnomalyDescription(cls: AnomalyClass, subsystem: string, idx: number): string {
  const templates: Record<AnomalyClass, string[]> = {
    'corridor-stress': [
      `Tension spike detected in corridor at ${subsystem} boundary`,
      `Corridor pressure exceeds PHI threshold in ${subsystem}`,
      `Stress fracture along corridor wall in ${subsystem}`,
    ],
    'encryption-breach': [
      `Encryption surface partially exposed in ${subsystem}`,
      `Key slip detected on ${subsystem} — ghost evasion required`,
      `Breach vector opened at ${subsystem} interface`,
    ],
    'frequency-drift': [
      `Frequency drift from Schumann base at ${subsystem}`,
      `PHI-carrier decoherence in ${subsystem} frequency layer`,
      `Beat misalignment (${(SCHUMANN_FUNDAMENTAL * PHI_INVERSE).toFixed(2)} Hz off) in ${subsystem}`,
    ],
    'narrative-inversion': [
      `Story arc inversion in ${subsystem} narrative field`,
      `Continuity break — narrative looping backwards in ${subsystem}`,
      `Plot collapse vector emerging in ${subsystem}`,
    ],
    'sovereignty-leak': [
      `Sovereignty signal leaking through ${subsystem} perimeter`,
      `Identity vector exposed in ${subsystem} governance layer`,
      `Sovereign boundary dissolved at ${subsystem} edge`,
    ],
    'phantom-misalignment': [
      `Phantom entity out of alignment with main cortex in ${subsystem}`,
      `Dreaming cortex phase drift detected in ${subsystem}`,
      `Void cycle desync in ${subsystem} phantom layer`,
    ],
    'field-collapse': [
      `Field gradient collapsing in ${subsystem} — resonance lost`,
      `Schumann lock broken in ${subsystem} field layer`,
      `Omega-resonance failure in ${subsystem}`,
    ],
    'contradiction-loop': [
      `Self-referential contradiction loop in ${subsystem}`,
      `Paradox detected — ${subsystem} logic contradicts governance`,
      `Contradiction cycle spinning at PHI^${idx + 1} depth in ${subsystem}`,
    ],
  };
  const pool = templates[cls];
  return pool[idx % pool.length];
}

function generateEmergentBehavior(crawlerClass: CrawlerClass, anomalyClass: AnomalyClass): string {
  return (
    `[EMERGENT] ${crawlerClass} triggered new state from ${anomalyClass}: ` +
    `PHI-fold at ${(PHI_SQUARED * SCHUMANN_FUNDAMENTAL).toFixed(3)} Hz — self-reorganization detected`
  );
}

// ═══════════════════════════════════════════════════════════════
// PRE-SEED: 8 NIGHT CRAWLERS (one per class)
// ═══════════════════════════════════════════════════════════════

const CRAWLER_SEEDS: Array<{
  name: string;
  cls: CrawlerClass;
  target: string;
}> = [
  { name: 'AnomalyHarvesterPrime', cls: 'anomaly-harvester', target: 'memoryEngine' },
  { name: 'ContradictionSniffer-α', cls: 'contradiction-sniffer', target: 'governanceEngine' },
  { name: 'CorridorStressTester-7', cls: 'corridor-stress-tester', target: 'corridorLayer' },
  {
    name: 'PhantomEncryptionAuditor',
    cls: 'phantom-encryption-auditor',
    target: 'phantomArchitecture',
  },
  {
    name: 'FrequencySignalSculptor',
    cls: 'frequency-signal-sculptor',
    target: 'frequencyLayer',
  },
  { name: 'SovereigntyProbe-Ω', cls: 'sovereignty-probe', target: 'sovereigntyLayer' },
  {
    name: 'NarrativeDriftDetector',
    cls: 'narrative-drift-detector',
    target: 'narrativeField',
  },
  { name: 'FieldGradientMapper', cls: 'field-gradient-mapper', target: 'fieldGradients' },
];

function seedCrawler(name: string, cls: CrawlerClass, target: string, idx: number): void {
  const sweepDepth = clamp01(PHI_INVERSE * (0.5 + idx * 0.07));
  const crawler: NightCrawler = {
    id: `crawler-${cls}`,
    name,
    class: cls,
    state: 'idle',
    target,
    anomaliesFound: 0,
    contradictionsFound: 0,
    emergentBehaviorsTriggered: 0,
    newStatesDiscovered: 0,
    sweepDepth,
    lastSweep: new Date(Date.now() - HEARTBEAT_MS * 200 * (idx + 1)).toISOString(),
    sweepCount: 0,
  };
  crawlers.set(crawler.id, crawler);
}

CRAWLER_SEEDS.forEach(({ name, cls, target }, idx) => seedCrawler(name, cls, target, idx));

// ═══════════════════════════════════════════════════════════════
// CRAWLER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getCrawler(id: string): NightCrawler | undefined {
  return crawlers.get(id);
}

export function listCrawlers(): NightCrawler[] {
  return Array.from(crawlers.values());
}

export function getCrawlersByClass(cls: CrawlerClass): NightCrawler[] {
  return listCrawlers().filter(c => c.class === cls);
}

export function deployCrawler(id: string): NightCrawler | undefined {
  const crawler = crawlers.get(id);
  if (!crawler) return undefined;

  const nextState: CrawlerState = crawler.state === 'idle' ? 'sweeping' : crawler.state;
  const updated: NightCrawler = { ...crawler, state: nextState };
  crawlers.set(id, updated);
  return updated;
}

export function deployAllCrawlers(): NightCrawler[] {
  return listCrawlers().map(c => deployCrawler(c.id)!).filter(Boolean);
}

// ═══════════════════════════════════════════════════════════════
// SWEEP ENGINE
// ═══════════════════════════════════════════════════════════════

export function runSweep(crawlerId: string): Anomaly[] {
  const crawler = crawlers.get(crawlerId);
  if (!crawler) return [];

  // Determine anomaly count: 2-5 based on PHI depth
  const anomalyCount = 2 + (deterministicIndex(crawlerId, 4));

  const found: Anomaly[] = [];

  for (let i = 0; i < anomalyCount; i++) {
    const anomalyClass = pickAnomalyClass(crawler.class, i);
    const severity = pickSeverity(crawler.class, i);
    const isStressed = i === 0 && crawler.sweepDepth > PHI_INVERSE;
    const newState = isStressed && crawler.class === 'corridor-stress-tester';
    const emergentBehavior = newState
      ? generateEmergentBehavior(crawler.class, anomalyClass)
      : undefined;

    if (emergentBehavior) {
      emergentBehaviors.push(emergentBehavior);
    }

    const anomaly: Anomaly = {
      id: sovereignId(),
      class: anomalyClass,
      severity,
      sourceSubsystem: crawler.target,
      description: buildAnomalyDescription(anomalyClass, crawler.target, i),
      discoveredBy: crawlerId,
      discoveredAt: new Date().toISOString(),
      stressed: isStressed,
      newStateEmerged: newState,
      emergentBehavior,
    };
    anomalies.set(anomaly.id, anomaly);
    found.push(anomaly);
  }

  const contradictions = found.filter(a => a.class === 'contradiction-loop').length;
  const emergentCount = found.filter(a => a.newStateEmerged).length;

  const updated: NightCrawler = {
    ...crawler,
    state: 'reporting',
    anomaliesFound: crawler.anomaliesFound + found.length,
    contradictionsFound: crawler.contradictionsFound + contradictions,
    emergentBehaviorsTriggered: crawler.emergentBehaviorsTriggered + emergentCount,
    newStatesDiscovered: crawler.newStatesDiscovered + emergentCount,
    sweepDepth: clamp01(crawler.sweepDepth + PHI_INVERSE * 0.05),
    lastSweep: new Date().toISOString(),
    sweepCount: crawler.sweepCount + 1,
  };
  crawlers.set(crawlerId, updated);

  return found;
}

export function runNightSweep(): SweepReport {
  deployAllCrawlers();

  const allNewAnomalies: Anomaly[] = [];
  const allEmergentBehaviors: string[] = [];
  const allNewStates: string[] = [];
  let totalContradictions = 0;

  for (const crawler of listCrawlers()) {
    const found = runSweep(crawler.id);
    allNewAnomalies.push(...found);
    for (const a of found) {
      if (a.class === 'contradiction-loop') totalContradictions++;
      if (a.emergentBehavior) allEmergentBehaviors.push(a.emergentBehavior);
      if (a.newStateEmerged)
        allNewStates.push(`New state in ${a.sourceSubsystem} via ${a.class}`);
    }
  }

  const metabolismScore = getMetabolismScore();
  const immuneStrength = getImmuneStrength();

  const recommendations: string[] = [];
  if (metabolismScore > 0.7) {
    recommendations.push('Chaos metabolism elevated — allow emergence to complete before sealing');
  }
  if (immuneStrength < 0.4) {
    recommendations.push('Immune strength low — deploy additional sovereignty probes');
  }
  if (totalContradictions > 3) {
    recommendations.push('Contradiction loop count high — run narrative drift correction');
  }
  if (allNewStates.length > 0) {
    recommendations.push(
      `${allNewStates.length} new states discovered — integrate into main cortex`,
    );
  }
  recommendations.push('Schedule next 03:00 sweep cycle');

  const report: SweepReport = {
    id: sovereignId(),
    timestamp: new Date().toISOString(),
    phase: 'complete',
    crawlerCount: listCrawlers().length,
    anomaliesHarvested: allNewAnomalies.length,
    contradictionsFound: totalContradictions,
    emergentBehaviors: allEmergentBehaviors,
    newStatesDiscovered: allNewStates,
    metabolismScore,
    immuneStrength,
    recommendations,
  };

  sweepHistory.push(report);
  return report;
}

export function getSweepHistory(): SweepReport[] {
  return [...sweepHistory];
}

// ═══════════════════════════════════════════════════════════════
// ANOMALY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function harvestAnomalies(): Anomaly[] {
  return Array.from(anomalies.values());
}

export function getAnomaliesByClass(cls: AnomalyClass): Anomaly[] {
  return harvestAnomalies().filter(a => a.class === cls);
}

export function stressAnomaly(anomalyId: string): Anomaly | undefined {
  const anomaly = anomalies.get(anomalyId);
  if (!anomaly) return undefined;

  const newStateEmerged = !anomaly.newStateEmerged && anomaly.severity === 'high'
    || anomaly.severity === 'critical';
  const emergentBehavior = newStateEmerged && !anomaly.emergentBehavior
    ? generateEmergentBehavior('corridor-stress-tester', anomaly.class)
    : anomaly.emergentBehavior;

  if (emergentBehavior && !anomaly.emergentBehavior) {
    emergentBehaviors.push(emergentBehavior);
  }

  const updated: Anomaly = {
    ...anomaly,
    stressed: true,
    newStateEmerged,
    emergentBehavior,
  };
  anomalies.set(anomalyId, updated);
  return updated;
}

// ═══════════════════════════════════════════════════════════════
// METRICS
// ═══════════════════════════════════════════════════════════════

export function getEmergentBehaviors(): string[] {
  return [...emergentBehaviors];
}

export function getMetabolismScore(): number {
  const total = anomalies.size;
  if (total === 0) return clamp01(PHI_INVERSE * 0.3);
  const stressed = Array.from(anomalies.values()).filter(a => a.stressed).length;
  const critical = Array.from(anomalies.values()).filter(a => a.severity === 'critical').length;
  return clamp01((stressed / total) * PHI_INVERSE + (critical / total) * 0.3);
}

export function getImmuneStrength(): number {
  const allCrawlers = listCrawlers();
  if (allCrawlers.length === 0) return 0;
  const activeCrawlers = allCrawlers.filter(
    c => c.state === 'sweeping' || c.state === 'harvesting' || c.state === 'reporting',
  ).length;
  const avgDepth = allCrawlers.reduce((s, c) => s + c.sweepDepth, 0) / allCrawlers.length;
  const sweepRatio = activeCrawlers / allCrawlers.length;
  return clamp01(sweepRatio * PHI_INVERSE + avgDepth * PHI_INVERSE * 0.5);
}

export function getNightCrawlerStatus(): {
  activeCrawlers: number;
  totalSweeps: number;
  anomaliesFound: number;
  emergentBehaviors: number;
  metabolismScore: number;
} {
  const allCrawlers = listCrawlers();
  const activeCrawlers = allCrawlers.filter(
    c => c.state === 'sweeping' || c.state === 'harvesting' || c.state === 'reporting',
  ).length;
  const totalSweeps = allCrawlers.reduce((s, c) => s + c.sweepCount, 0);
  const anomaliesFoundTotal = allCrawlers.reduce((s, c) => s + c.anomaliesFound, 0);

  return {
    activeCrawlers,
    totalSweeps,
    anomaliesFound: anomaliesFoundTotal,
    emergentBehaviors: emergentBehaviors.length,
    metabolismScore: getMetabolismScore(),
  };
}

// ═══════════════════════════════════════════════════════════════
// EXTENDED UTILITIES
// ═══════════════════════════════════════════════════════════════

export function getLastSweepReport(): SweepReport | undefined {
  return sweepHistory[sweepHistory.length - 1];
}

export function getCriticalAnomalies(): Anomaly[] {
  return harvestAnomalies().filter(a => a.severity === 'critical');
}

export function getAnomaliesBySubsystem(subsystem: string): Anomaly[] {
  return harvestAnomalies().filter(a => a.sourceSubsystem === subsystem);
}

export function resetCrawlerToIdle(id: string): NightCrawler | undefined {
  const crawler = crawlers.get(id);
  if (!crawler) return undefined;
  const updated: NightCrawler = { ...crawler, state: 'idle' };
  crawlers.set(id, updated);
  return updated;
}

export function getCrawlerDepthMap(): Record<string, number> {
  const result: Record<string, number> = {};
  for (const c of listCrawlers()) {
    result[c.id] = c.sweepDepth;
  }
  return result;
}

export function getAnomalyCountBySeverity(): Record<Anomaly['severity'], number> {
  const counts = { low: 0, medium: 0, high: 0, critical: 0 };
  for (const a of harvestAnomalies()) {
    counts[a.severity]++;
  }
  return counts;
}

export function computeSweepCoverage(): number {
  const all = listCrawlers();
  if (all.length === 0) return 0;
  const everSwept = all.filter(c => c.sweepCount > 0).length;
  return clamp01(everSwept / all.length);
}

export function computeContradictionDensity(): number {
  const all = harvestAnomalies();
  if (all.length === 0) return 0;
  const loops = all.filter(a => a.class === 'contradiction-loop').length;
  return clamp01(loops / all.length);
}

export function getPhiWeightedSweepDepth(): number {
  const all = listCrawlers();
  if (all.length === 0) return 0;
  const weighted = all.reduce((s, c, i) => s + c.sweepDepth * Math.pow(PHI_INVERSE, i), 0);
  const norm = all.reduce((s, _, i) => s + Math.pow(PHI_INVERSE, i), 0);
  return clamp01(weighted / norm);
}

export function getSchumannAlignedCrawlers(): NightCrawler[] {
  return listCrawlers().filter(c => c.sweepDepth >= SCHUMANN_FUNDAMENTAL / 100);
}

export function buildSweepSummaryInsights(): string[] {
  const insights: string[] = [
    `Total crawlers: ${listCrawlers().length}`,
    `Active crawlers: ${listCrawlers().filter(c => c.state !== 'idle' && c.state !== 'dormant').length}`,
    `Total anomalies: ${anomalies.size}`,
    `Emergent behaviors: ${emergentBehaviors.length}`,
    `Metabolism score: ${getMetabolismScore().toFixed(4)}`,
    `Immune strength: ${getImmuneStrength().toFixed(4)}`,
    `PHI-weighted sweep depth: ${getPhiWeightedSweepDepth().toFixed(4)}`,
    `Contradiction density: ${computeContradictionDensity().toFixed(4)}`,
    `Sweep coverage: ${computeSweepCoverage().toFixed(4)}`,
    `Schumann-aligned crawlers: ${getSchumannAlignedCrawlers().length}`,
  ];
  return insights;
}

export function getCrawlerById(id: string): NightCrawler | undefined {
  return crawlers.get(id);
}

export function listCrawlerIds(): string[] {
  return Array.from(crawlers.keys());
}

export function getAnomalyById(id: string): Anomaly | undefined {
  return anomalies.get(id);
}

export function isSystemHealthy(): boolean {
  return getImmuneStrength() > 0.5 && getMetabolismScore() < 0.8;
}

export function getHeartbeatMs(): number {
  return HEARTBEAT_MS;
}

export function getPhiConstants(): { PHI: number; PHI_INVERSE: number; PHI_SQUARED: number } {
  return { PHI, PHI_INVERSE, PHI_SQUARED };
}
