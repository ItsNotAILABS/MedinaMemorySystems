/**
 * ULRI — Unified Layered Routing Intelligence (MEDINA Sovereign)
 *
 * Routes across ALL sovereign models — not just the 8 intelligence families,
 * but every substrate, compiler, pattern recognizer, law, and gate model.
 *
 * Everything is a model. The architecture speaks through its models.
 * Every edge is a field of possibilities.
 *
 * Formula:
 *   CompositeScore = (ModelResonance × 0.40) + (OrganismAffinity × 0.30) + (GateWeight × 0.20) + (PatternDepth × 0.10)
 */

import type { ModelFamily, ModelInvocation } from '@/types';
import { invokeModel, getModels, routeToModel } from './modelRouter';
import { getOrganismState } from './organismSovereign';
import { checkAllGates } from './gateEnforcement';
import { allModels, scoreAllModels, fieldOfPossibilities, type SovereignModel } from './sovereign-model';
import { bootSovereignRegistry } from './sovereign-registry';

let booted = false;
function ensureBoot() {
  if (!booted) {
    bootSovereignRegistry();
    booted = true;
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UlriScore {
  modelId: string;
  keywordScore: number;
  organismAffinity: number;
  gateWeight: number;
  patternDepth: number;
  compositeScore: number;
}

export interface UlriRoutingResult {
  primary: ModelFamily;
  scores: UlriScore[];
  sovereignScores: Array<{ id: string; name: string; kind: string; score: number; color: string }>;
  consensus: UlriConsensus | null;
  invocation: ModelInvocation;
  routingLatency: number;
  fieldsOfPossibility: Array<{ source: string; possibilities: string[] }>;
}

export interface UlriConsensus {
  models: ModelFamily[];
  invocations: ModelInvocation[];
  agreementScore: number;
  synthesized: string;
}

// ─── Organism Affinity ───────────────────────────────────────────────────────

const ORGANISM_AFFINITY: Record<string, string[]> = {
  cognitive: ['strategist', 'analyst', 'projection', 'pattern-substrate-model', 'command-parser-model'],
  affective: ['memory-curator', 'governance', 'operations', 'dual-read-model', 'living-document-model'],
  somatic: ['builder', 'operations', 'risk', 'wasm-compiler-model', 'sovereign-id-model'],
  sovereign: ['strategist', 'governance', 'risk', 'recital-plus-one-model', 'gate-enforcement-model'],
};

const GATE_MODEL_WEIGHTS: Record<string, string[]> = {
  A: ['governance', 'strategist', 'gate-enforcement-model', 'recital-plus-one-model'],
  B: ['memory-curator', 'analyst', 'dual-read-model', 'living-document-model'],
  C: ['strategist', 'projection', 'risk', 'pattern-substrate-model', 'wasm-compiler-model'],
};

function computeOrganismAffinity(modelId: string): number {
  const organism = getOrganismState();
  const registers = ['cognitive', 'affective', 'somatic', 'sovereign'] as const;
  let total = 0;
  let count = 0;

  for (const reg of registers) {
    const affiliated = ORGANISM_AFFINITY[reg] ?? [];
    if (affiliated.includes(modelId)) {
      total += organism[reg] / 100;
      count++;
    }
  }

  return count > 0 ? total / count : 0.5;
}

function computeGateWeight(modelId: string): number {
  const gateChecks = checkAllGates();
  let weight = 1.0;

  for (const [gateId, check] of Object.entries(gateChecks)) {
    const affiliated = GATE_MODEL_WEIGHTS[gateId] ?? [];
    if (affiliated.includes(modelId)) {
      if (check.gate.status === 'green') weight *= 1.1;
      else if (check.gate.status === 'amber') weight *= 0.85;
      else weight *= 0.5;
    }
  }

  return Math.min(1.5, weight);
}

function computePatternDepth(input: string): number {
  const lower = input.toLowerCase();
  let depth = 0;
  if (lower.includes('pattern')) depth += 0.3;
  if (lower.includes('expand')) depth += 0.2;
  if (lower.includes('think')) depth += 0.2;
  if (lower.includes('edge')) depth += 0.15;
  if (lower.includes('possibility')) depth += 0.15;
  return Math.min(1.0, depth);
}

// ─── Full Sovereign Scoring ──────────────────────────────────────────────────

function computeAllScores(prompt: string): { ulriScores: UlriScore[]; sovereignScored: Array<{ id: string; name: string; kind: string; score: number; color: string }> } {
  ensureBoot();

  const sovereignScored = scoreAllModels(prompt).map((s) => ({
    id: s.model.id,
    name: s.model.name,
    kind: s.model.kind,
    score: s.score,
    color: s.model.color,
  }));

  const intelligenceModels = getModels();
  const patternDepth = computePatternDepth(prompt);

  const ulriScores: UlriScore[] = intelligenceModels.map((m) => {
    const sovereignEntry = sovereignScored.find((s) => s.id === m.id);
    const resonance = sovereignEntry?.score ?? 0;
    const oa = computeOrganismAffinity(m.id);
    const gw = computeGateWeight(m.id);
    const composite = (resonance * 0.40) + (oa * 0.30) + (gw * 0.20) + (patternDepth * 0.10);
    return {
      modelId: m.id,
      keywordScore: resonance,
      organismAffinity: oa,
      gateWeight: gw,
      patternDepth,
      compositeScore: composite,
    };
  });

  ulriScores.sort((a, b) => b.compositeScore - a.compositeScore);
  return { ulriScores, sovereignScored };
}

// ─── Single-Model Route ──────────────────────────────────────────────────────

export function ulriRoute(prompt: string): UlriRoutingResult {
  const start = Date.now();
  const { ulriScores, sovereignScored } = computeAllScores(prompt);
  const fields = fieldOfPossibilities(prompt);
  const primary = (ulriScores[0]?.modelId as ModelFamily) ?? routeToModel(prompt);
  const invocation = invokeModel(primary, prompt);

  return {
    primary,
    scores: ulriScores,
    sovereignScores: sovereignScored.slice(0, 8),
    consensus: null,
    invocation,
    routingLatency: Date.now() - start,
    fieldsOfPossibility: fields,
  };
}

// ─── Multi-Model Consensus ───────────────────────────────────────────────────

export function ulriConsensus(prompt: string, topN = 3): UlriRoutingResult {
  const start = Date.now();
  const { ulriScores, sovereignScored } = computeAllScores(prompt);
  const fields = fieldOfPossibilities(prompt);

  const topModels = ulriScores.slice(0, topN).filter((s) => s.compositeScore > 0);
  const invocations = topModels.map((s) => invokeModel(s.modelId as ModelFamily, prompt));
  const primary = (topModels[0]?.modelId as ModelFamily) ?? routeToModel(prompt);

  const agreementScore = topModels.length > 1
    ? 1 - Math.abs(topModels[0].compositeScore - topModels[topModels.length - 1].compositeScore) / Math.max(topModels[0].compositeScore, 0.01)
    : 1.0;

  const synthesized = invocations.length > 1
    ? `[${primary.toUpperCase()} + ${invocations.length - 1} models] ${invocations[0].response}`
    : invocations[0]?.response ?? 'No response generated.';

  const consensus: UlriConsensus = {
    models: topModels.map((s) => s.modelId as ModelFamily),
    invocations,
    agreementScore: Math.min(1, agreementScore),
    synthesized,
  };

  return {
    primary,
    scores: ulriScores,
    sovereignScores: sovereignScored.slice(0, 8),
    consensus,
    invocation: invocations[0],
    routingLatency: Date.now() - start,
    fieldsOfPossibility: fields,
  };
}
