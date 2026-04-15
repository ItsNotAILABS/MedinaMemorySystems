import { v4 as uuidv4 } from 'uuid';
import type { RecitalPlusOneSequence } from '@/types';

// ─── RECITAL_PLUS_ONE Law ─────────────────────────────────────────────────────
// Every recital amplifies the next. Resonance = R(n) × (1 + α)

const AMPLIFICATION_COEFFICIENT = 0.15;
const sequences: Map<string, RecitalPlusOneSequence> = new Map();

export function initiateRecital(input: string): RecitalPlusOneSequence {
  const seq: RecitalPlusOneSequence = {
    id: uuidv4(),
    phase: 'recital',
    currentStep: 1,
    totalSteps: 4,
    input,
    resonance: 0.5 + Math.random() * 0.3,
    completed: false,
  };
  sequences.set(seq.id, seq);
  return seq;
}

export function advanceRecital(id: string): RecitalPlusOneSequence | null {
  const seq = sequences.get(id);
  if (!seq || seq.completed) return null;

  const phases: RecitalPlusOneSequence['phase'][] = ['recital', 'integration', 'amplification', 'broadcast'];
  const nextStep = seq.currentStep + 1;
  const nextPhase = phases[nextStep - 1] ?? 'broadcast';

  const amplifiedResonance = Math.min(1.0, seq.resonance * (1 + AMPLIFICATION_COEFFICIENT));

  const updated: RecitalPlusOneSequence = {
    ...seq,
    phase: nextPhase,
    currentStep: nextStep,
    resonance: amplifiedResonance,
    completed: nextStep >= seq.totalSteps,
    output: nextStep >= seq.totalSteps
      ? `Recital complete. Final resonance: ${(amplifiedResonance * 100).toFixed(1)}%. Output amplified.`
      : undefined,
  };
  sequences.set(id, updated);
  return updated;
}

export function completeRecital(id: string, output: string): RecitalPlusOneSequence | null {
  const seq = sequences.get(id);
  if (!seq) return null;

  const finalResonance = Math.min(1.0, seq.resonance * Math.pow(1 + AMPLIFICATION_COEFFICIENT, seq.totalSteps - seq.currentStep));

  const updated: RecitalPlusOneSequence = {
    ...seq,
    phase: 'broadcast',
    currentStep: seq.totalSteps,
    resonance: finalResonance,
    output,
    completed: true,
  };
  sequences.set(id, updated);
  return updated;
}

export function getRecital(id: string): RecitalPlusOneSequence | undefined {
  return sequences.get(id);
}

export function calculateResonance(baseResonance: number, beats: number): number {
  return Math.min(1.0, baseResonance * Math.pow(1 + AMPLIFICATION_COEFFICIENT, beats));
}
