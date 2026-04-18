import type { ModelFamily, ModelInvocation } from '@/types';
import { routeToModel, invokeModel, getModels } from './modelRouter';
import { getOrganismState } from './organismSovereign';
import { checkAllGates } from './gateEnforcement';

export interface UlriScore {
  modelId: ModelFamily;
  keywordScore: number;
  organismAffinity: number;
  gateWeight: number;
  compositeScore: number;
}

export interface UlriRoutingResult {
  primary: ModelFamily;
  scores: UlriScore[];
  consensus: UlriConsensus | null;
  invocation: ModelInvocation;
  routingLatency: number;
}

export interface UlriConsensus {
  models: ModelFamily[];
  invocations: ModelInvocation[];
  agreementScore: number;
  synthesized: string;
}

const ORGANISM_AFFINITY: Record<string, ModelFamily[]> = {
  cognitive: ['strategist', 'analyst', 'projection'],
  affective: ['memory-curator', 'governance', 'operations'],
  somatic: ['builder', 'operations', 'risk'],
  sovereign: ['strategist', 'governance', 'risk'],
};

const GATE_MODEL_WEIGHTS: Record<string, ModelFamily[]> = {
  A: ['governance', 'strategist'],
  B: ['memory-curator', 'analyst'],
  C: ['strategist', 'projection', 'risk'],
};

function computeKeywordScores(prompt: string): Record<ModelFamily, number> {
  const lower = prompt.toLowerCase();
  const KEYWORDS: Record<ModelFamily, string[]> = {
    strategist: ['strategy', 'plan', 'vision', 'macro', 'sovereign', 'decide', 'direction', 'goal', 'future', 'long-term'],
    builder: ['build', 'create', 'code', 'implement', 'design', 'construct', 'generate', 'develop', 'architecture', 'system'],
    analyst: ['analyze', 'analysis', 'data', 'pattern', 'trend', 'insight', 'measure', 'metric', 'quantify', 'evaluate'],
    governance: ['govern', 'proposal', 'vote', 'policy', 'doctrine', 'audit', 'compliance', 'enact', 'law', 'rule'],
    'memory-curator': ['memory', 'remember', 'recall', 'store', 'find', 'coordinate', 'lineage', 'resonance', 'search', 'knowledge'],
    operations: ['operate', 'task', 'workflow', 'execute', 'manage', 'run', 'process', 'schedule', 'deploy', 'pipeline'],
    risk: ['risk', 'threat', 'danger', 'secure', 'gate', 'protect', 'vulnerability', 'anomaly', 'safety', 'warn'],
    projection: ['project', 'forecast', 'future', 'scenario', 'predict', 'trajectory', 'simulate', 'timeline', 'model', 'expect'],
  };

  const scores: Record<string, number> = {};
  const words = lower.split(/\s+/);
  const totalWords = Math.max(words.length, 1);

  for (const [family, keywords] of Object.entries(KEYWORDS)) {
    let hits = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) hits++;
    }
    scores[family] = hits / totalWords;
  }

  return scores as Record<ModelFamily, number>;
}

function computeOrganismAffinity(modelId: ModelFamily): number {
  const organism = getOrganismState();
  const registers = ['cognitive', 'affective', 'somatic', 'sovereign'] as const;
  let totalAffinity = 0;
  let count = 0;

  for (const reg of registers) {
    const affiliatedModels = ORGANISM_AFFINITY[reg];
    if (affiliatedModels.includes(modelId)) {
      totalAffinity += organism[reg] / 100;
      count++;
    }
  }

  return count > 0 ? totalAffinity / count : 0.5;
}

function computeGateWeight(modelId: ModelFamily): number {
  const gateChecks = checkAllGates();
  let weight = 1.0;

  for (const [gateId, check] of Object.entries(gateChecks)) {
    const affiliatedModels = GATE_MODEL_WEIGHTS[gateId] ?? [];
    if (affiliatedModels.includes(modelId)) {
      if (check.gate.status === 'green') weight *= 1.1;
      else if (check.gate.status === 'amber') weight *= 0.85;
      else weight *= 0.5;
    }
  }

  return Math.min(1.5, weight);
}

export function ulriRoute(prompt: string): UlriRoutingResult {
  const start = Date.now();
  const keywordScores = computeKeywordScores(prompt);
  const models = getModels();

  const scores: UlriScore[] = models.map((m) => {
    const kw = keywordScores[m.id] ?? 0;
    const oa = computeOrganismAffinity(m.id);
    const gw = computeGateWeight(m.id);
    const composite = (kw * 0.45 + oa * 0.30 + gw * 0.25);
    return {
      modelId: m.id,
      keywordScore: kw,
      organismAffinity: oa,
      gateWeight: gw,
      compositeScore: composite,
    };
  });

  scores.sort((a, b) => b.compositeScore - a.compositeScore);

  const primary = scores[0]?.modelId ?? routeToModel(prompt);
  const invocation = invokeModel(primary, prompt);
  const routingLatency = Date.now() - start;

  return { primary, scores, consensus: null, invocation, routingLatency };
}

export function ulriConsensus(prompt: string, topN = 3): UlriRoutingResult {
  const start = Date.now();
  const keywordScores = computeKeywordScores(prompt);
  const models = getModels();

  const scores: UlriScore[] = models.map((m) => {
    const kw = keywordScores[m.id] ?? 0;
    const oa = computeOrganismAffinity(m.id);
    const gw = computeGateWeight(m.id);
    const composite = (kw * 0.45 + oa * 0.30 + gw * 0.25);
    return {
      modelId: m.id,
      keywordScore: kw,
      organismAffinity: oa,
      gateWeight: gw,
      compositeScore: composite,
    };
  });

  scores.sort((a, b) => b.compositeScore - a.compositeScore);

  const topModels = scores.slice(0, topN).filter((s) => s.compositeScore > 0);
  const invocations = topModels.map((s) => invokeModel(s.modelId, prompt));
  const primary = topModels[0]?.modelId ?? routeToModel(prompt);

  const agreementScore = topModels.length > 1
    ? 1 - Math.abs(topModels[0].compositeScore - topModels[topModels.length - 1].compositeScore) / Math.max(topModels[0].compositeScore, 0.01)
    : 1.0;

  const synthesized = invocations.length > 1
    ? `[${primary.toUpperCase()} + ${invocations.length - 1} models] ${invocations[0].response}`
    : invocations[0]?.response ?? 'No response generated.';

  const consensus: UlriConsensus = {
    models: topModels.map((s) => s.modelId),
    invocations,
    agreementScore: Math.min(1, agreementScore),
    synthesized,
  };

  const routingLatency = Date.now() - start;

  return { primary, scores, consensus, invocation: invocations[0], routingLatency };
}
