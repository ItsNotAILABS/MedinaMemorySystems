import type { OrganismState, OrganismRegister } from '@/types';

// ─── 4-Register Organism Sovereign ────────────────────────────────────────────

let state: OrganismState = {
  cognitive: 87,
  affective: 74,
  somatic: 91,
  sovereign: 96,
  phase: 'awake',
  lastBeat: 1,
  dominantRegister: 'sovereign',
};

export function getOrganismState(): OrganismState {
  return { ...state };
}

export function updateRegister(register: OrganismRegister, value: number): OrganismState {
  state = {
    ...state,
    [register]: Math.max(0, Math.min(100, value)),
    lastBeat: state.lastBeat + 1,
  };
  state.dominantRegister = computeDominant();
  return { ...state };
}

export function setPhase(phase: OrganismState['phase']): OrganismState {
  state = { ...state, phase, lastBeat: state.lastBeat + 1 };
  return { ...state };
}

export function broadcastState(): OrganismState {
  state = {
    ...state,
    phase: 'broadcast',
    lastBeat: state.lastBeat + 1,
    sovereign: Math.min(100, state.sovereign + 2),
  };
  return { ...state };
}

export function pulseOrganism(): OrganismState {
  // Natural variation on each beat
  state = {
    ...state,
    cognitive: clamp(state.cognitive + (Math.random() * 4 - 2)),
    affective: clamp(state.affective + (Math.random() * 4 - 2)),
    somatic: clamp(state.somatic + (Math.random() * 2 - 1)),
    lastBeat: state.lastBeat + 1,
  };
  state.dominantRegister = computeDominant();
  return { ...state };
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

function computeDominant(): OrganismRegister {
  const registers: OrganismRegister[] = ['cognitive', 'affective', 'somatic', 'sovereign'];
  return registers.reduce((a, b) => (state[a] >= state[b] ? a : b));
}

export function getRegisterSummary(): string {
  const s = state;
  return `COG:${s.cognitive.toFixed(0)} | AFF:${s.affective.toFixed(0)} | SOM:${s.somatic.toFixed(0)} | SOV:${s.sovereign.toFixed(0)} | Phase:${s.phase.toUpperCase()} | Beat:${s.lastBeat}`;
}
