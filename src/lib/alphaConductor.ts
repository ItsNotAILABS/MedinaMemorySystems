// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * 𓂀 ALPHA CONDUCTOR — HARMONIC INTELLIGENCE SYNCHRONIZATION 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ALPHA-COND-001: The Alpha Conductor is the timing and synchronization layer
 * that ensures all Alpha-class operations execute in φ-harmonic coherence.
 * Like a symphony conductor, it manages tempo, dynamics, entrances/exits,
 * and ensemble coordination across all intelligence subsystems.
 *
 * Architecture:
 *
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │               ALPHA CONDUCTOR (ALPHA-COND-001)                  │
 *   ├─────────────────────────────────────────────────────────────────┤
 *   │                                                                 │
 *   │  SECTIONS (like orchestral sections):                           │
 *   │  ├── STRINGS      — continuous background processes             │
 *   │  ├── BRASS        — high-priority signal processors             │
 *   │  ├── WOODWINDS    — analytical/reasoning pipelines              │
 *   │  ├── PERCUSSION   — timing/heartbeat generators                 │
 *   │  ├── CHOIR        — consensus/voting systems                    │
 *   │  └── ELECTRONICS  — external integrations                       │
 *   │                                                                 │
 *   │  TEMPI (φ-derived):                                             │
 *   │  ├── PRESTISSIMO  — φ⁻² × base (≈48.8ms)  ultra-fast          │
 *   │  ├── PRESTO       — φ⁻¹ × base (≈78.9ms)  very fast           │
 *   │  ├── ALLEGRO      — φ⁰ × base  (≈127.7ms) fast                │
 *   │  ├── MODERATO     — φ¹ × base  (≈206.6ms) moderate            │
 *   │  ├── ANDANTE      — φ² × base  (≈334.2ms) walking             │
 *   │  ├── ADAGIO       — φ³ × base  (≈540.8ms) slow                │
 *   │  ├── LARGO        — φ⁴ × base  (≈875ms)   very slow           │
 *   │  └── GRAVE        — φ⁵ × base  (≈1415ms)  solemn              │
 *   │                                                                 │
 *   │  DYNAMICS:                                                       │
 *   │  ├── FORTISSIMO   — maximum resource allocation                 │
 *   │  ├── FORTE        — high resource allocation                    │
 *   │  ├── MEZZO_FORTE  — moderate-high allocation                    │
 *   │  ├── MEZZO_PIANO  — moderate-low allocation                     │
 *   │  ├── PIANO        — low resource allocation                     │
 *   │  └── PIANISSIMO   — minimal allocation                          │
 *   │                                                                 │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * Charter: ALPHA-COND-001
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { sovereignId } from './sovereign-id';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION I: CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** The golden ratio */
export const PHI = (1 + Math.sqrt(5)) / 2;

/** Inverse golden ratio */
export const PHI_INVERSE = 1 / PHI;

/** Squared golden ratio */
export const PHI_SQUARED = PHI * PHI;

/** Cubed golden ratio */
export const PHI_CUBED = PHI * PHI * PHI;

/** Schumann period (ms) — base tempo reference */
export const SCHUMANN_PERIOD_MS = 1000 / 7.83;

/** Golden angle (radians) — used for phase distribution */
export const GOLDEN_ANGLE = 2 * Math.PI * PHI_INVERSE * PHI_INVERSE;

/** Maximum voices per section */
export const MAX_VOICES_PER_SECTION = 13; // Fibonacci(7)

/** Beat subdivision — Fibonacci-derived */
export const BEAT_SUBDIVISIONS = [1, 1, 2, 3, 5, 8, 13, 21];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION II: TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type Section =
  | 'strings'
  | 'brass'
  | 'woodwinds'
  | 'percussion'
  | 'choir'
  | 'electronics';

export type Tempo =
  | 'prestissimo'
  | 'presto'
  | 'allegro'
  | 'moderato'
  | 'andante'
  | 'adagio'
  | 'largo'
  | 'grave';

export type Dynamic =
  | 'fortissimo'
  | 'forte'
  | 'mezzo_forte'
  | 'mezzo_piano'
  | 'piano'
  | 'pianissimo';

export type VoiceState =
  | 'silent'
  | 'warming'
  | 'playing'
  | 'sustaining'
  | 'fading'
  | 'resting';

export type ConductorState =
  | 'dormant'
  | 'tuning'
  | 'conducting'
  | 'crescendo'
  | 'diminuendo'
  | 'fermata'
  | 'finale';

export type CueType =
  | 'entrance'
  | 'exit'
  | 'crescendo'
  | 'diminuendo'
  | 'accent'
  | 'fermata'
  | 'tempo_change'
  | 'section_solo'
  | 'tutti';

export interface Voice {
  id: string;
  section: Section;
  name: string;
  state: VoiceState;
  tempo: Tempo;
  dynamic: Dynamic;
  phase: number;        // 0-2π
  frequency: number;    // Hz
  coherence: number;    // 0-1
  beatCount: number;
  lastBeatAt: number;
  entranceAt: number | null;
  exitAt: number | null;
}

export interface Cue {
  id: string;
  type: CueType;
  targetSection: Section | 'all';
  targetVoiceId: string | null;
  scheduledAt: number;
  executedAt: number | null;
  data: Record<string, unknown>;
}

export interface Movement {
  id: string;
  name: string;
  tempo: Tempo;
  dynamic: Dynamic;
  measures: number;
  currentMeasure: number;
  startedAt: number | null;
  completedAt: number | null;
}

export interface ConductorMetrics {
  state: ConductorState;
  currentTempo: Tempo;
  currentDynamic: Dynamic;
  totalVoices: number;
  activeVoices: number;
  totalBeats: number;
  totalCues: number;
  averageCoherence: number;
  phaseAlignment: number;   // 0-1, how phase-locked voices are
  uptime: number;
  currentMovement: string | null;
}

export interface ConductorEvent {
  type: 'voice_entrance' | 'voice_exit' | 'cue_executed' | 'tempo_change'
    | 'dynamic_change' | 'movement_start' | 'movement_end' | 'state_change'
    | 'coherence_shift' | 'phase_lock';
  timestamp: number;
  data: unknown;
}

export type ConductorListener = (event: ConductorEvent) => void;

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION III: TEMPO & DYNAMIC MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════════

/** Tempo → interval in ms (φ-scaled from Schumann period) */
const TEMPO_INTERVALS: Record<Tempo, number> = {
  prestissimo: SCHUMANN_PERIOD_MS * Math.pow(PHI, -2),
  presto:      SCHUMANN_PERIOD_MS * Math.pow(PHI, -1),
  allegro:     SCHUMANN_PERIOD_MS,
  moderato:    SCHUMANN_PERIOD_MS * PHI,
  andante:     SCHUMANN_PERIOD_MS * PHI_SQUARED,
  adagio:      SCHUMANN_PERIOD_MS * PHI_CUBED,
  largo:       SCHUMANN_PERIOD_MS * Math.pow(PHI, 4),
  grave:       SCHUMANN_PERIOD_MS * Math.pow(PHI, 5),
};

/** Dynamic → resource multiplier (0-1) */
const DYNAMIC_LEVELS: Record<Dynamic, number> = {
  fortissimo:  1.0,
  forte:       PHI_INVERSE + 0.2,        // ≈ 0.818
  mezzo_forte: PHI_INVERSE,              // ≈ 0.618
  mezzo_piano: PHI_INVERSE * PHI_INVERSE, // ≈ 0.382
  piano:       Math.pow(PHI_INVERSE, 3),  // ≈ 0.236
  pianissimo:  Math.pow(PHI_INVERSE, 4),  // ≈ 0.146
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION IV: ALPHA CONDUCTOR
// ═══════════════════════════════════════════════════════════════════════════════

export class AlphaConductor {
  readonly id: string;
  readonly charter = 'ALPHA-COND-001';

  private state: ConductorState = 'dormant';
  private currentTempo: Tempo = 'moderato';
  private currentDynamic: Dynamic = 'mezzo_forte';
  private startTime: number = 0;
  private totalBeats: number = 0;
  private voices: Map<string, Voice> = new Map();
  private cueQueue: Cue[] = [];
  private executedCues: Cue[] = [];
  private movements: Movement[] = [];
  private currentMovementIdx: number = -1;
  private listeners: ConductorListener[] = [];
  private beatTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.id = sovereignId();
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═════════════════════════════════════════════════════════════════════════════

  /** Begin conducting — start the beat clock */
  begin(): void {
    if (this.state !== 'dormant') return;
    this.state = 'tuning';
    this.startTime = Date.now();
    this.emit({ type: 'state_change', timestamp: Date.now(), data: { from: 'dormant', to: 'tuning' } });

    // Start beat clock at current tempo
    this.startBeatClock();
    this.state = 'conducting';
    this.emit({ type: 'state_change', timestamp: Date.now(), data: { from: 'tuning', to: 'conducting' } });
  }

  /** End the performance gracefully */
  finale(): void {
    if (this.state === 'dormant') return;
    this.state = 'finale';
    this.emit({ type: 'state_change', timestamp: Date.now(), data: { to: 'finale' } });

    // Fade all voices
    for (const [, voice] of this.voices) {
      voice.state = 'fading';
      voice.exitAt = Date.now();
    }

    if (this.beatTimer) {
      clearInterval(this.beatTimer);
      this.beatTimer = null;
    }

    this.state = 'dormant';
    this.emit({ type: 'state_change', timestamp: Date.now(), data: { to: 'dormant' } });
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // VOICE MANAGEMENT
  // ═════════════════════════════════════════════════════════════════════════════

  /** Register a new voice in a section */
  registerVoice(section: Section, name: string, tempo?: Tempo, dynamic?: Dynamic): Voice {
    const sectionVoices = [...this.voices.values()].filter(v => v.section === section);
    if (sectionVoices.length >= MAX_VOICES_PER_SECTION) {
      throw new Error(`Section ${section} is at maximum capacity (${MAX_VOICES_PER_SECTION})`);
    }

    const voiceIndex = this.voices.size;
    const phase = (voiceIndex * GOLDEN_ANGLE) % (2 * Math.PI);
    const frequency = 7.83 * Math.pow(PHI, voiceIndex % 8);

    const voice: Voice = {
      id: sovereignId(),
      section,
      name,
      state: 'silent',
      tempo: tempo || this.currentTempo,
      dynamic: dynamic || this.currentDynamic,
      phase,
      frequency,
      coherence: 1.0,
      beatCount: 0,
      lastBeatAt: 0,
      entranceAt: null,
      exitAt: null,
    };

    this.voices.set(voice.id, voice);
    return voice;
  }

  /** Signal a voice entrance */
  entrance(voiceId: string): boolean {
    const voice = this.voices.get(voiceId);
    if (!voice || voice.state === 'playing') return false;

    voice.state = 'warming';
    voice.entranceAt = Date.now();

    // Transition to playing after one beat
    setTimeout(() => {
      if (voice.state === 'warming') {
        voice.state = 'playing';
        this.emit({ type: 'voice_entrance', timestamp: Date.now(), data: { voiceId, section: voice.section, name: voice.name } });
      }
    }, TEMPO_INTERVALS[voice.tempo]);

    return true;
  }

  /** Signal a voice exit */
  exit(voiceId: string): boolean {
    const voice = this.voices.get(voiceId);
    if (!voice || voice.state === 'silent' || voice.state === 'resting') return false;

    voice.state = 'fading';
    voice.exitAt = Date.now();

    // Transition to resting after one beat
    setTimeout(() => {
      if (voice.state === 'fading') {
        voice.state = 'resting';
        this.emit({ type: 'voice_exit', timestamp: Date.now(), data: { voiceId, section: voice.section, name: voice.name } });
      }
    }, TEMPO_INTERVALS[voice.tempo]);

    return true;
  }

  /** Remove a voice entirely */
  removeVoice(voiceId: string): boolean {
    return this.voices.delete(voiceId);
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // CUE MANAGEMENT
  // ═════════════════════════════════════════════════════════════════════════════

  /** Schedule a cue */
  scheduleCue(type: CueType, targetSection: Section | 'all', delay: number, data: Record<string, unknown> = {}, targetVoiceId: string | null = null): Cue {
    const cue: Cue = {
      id: sovereignId(),
      type,
      targetSection,
      targetVoiceId,
      scheduledAt: Date.now() + delay,
      executedAt: null,
      data,
    };

    this.cueQueue.push(cue);
    this.cueQueue.sort((a, b) => a.scheduledAt - b.scheduledAt);
    return cue;
  }

  /** Execute all ready cues */
  executeCues(): Cue[] {
    const now = Date.now();
    const ready = this.cueQueue.filter(c => c.scheduledAt <= now);
    const executed: Cue[] = [];

    for (const cue of ready) {
      this.executeCue(cue);
      executed.push(cue);
    }

    this.cueQueue = this.cueQueue.filter(c => c.scheduledAt > now);
    return executed;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // TEMPO & DYNAMICS
  // ═════════════════════════════════════════════════════════════════════════════

  /** Change the global tempo */
  setTempo(tempo: Tempo): void {
    const oldTempo = this.currentTempo;
    this.currentTempo = tempo;
    this.restartBeatClock();
    this.emit({ type: 'tempo_change', timestamp: Date.now(), data: { from: oldTempo, to: tempo, intervalMs: TEMPO_INTERVALS[tempo] } });
  }

  /** Change the global dynamic level */
  setDynamic(dynamic: Dynamic): void {
    const oldDynamic = this.currentDynamic;
    this.currentDynamic = dynamic;
    this.emit({ type: 'dynamic_change', timestamp: Date.now(), data: { from: oldDynamic, to: dynamic, level: DYNAMIC_LEVELS[dynamic] } });
  }

  /** Get the current beat interval in ms */
  getBeatInterval(): number {
    return TEMPO_INTERVALS[this.currentTempo];
  }

  /** Get the resource multiplier for current dynamic */
  getResourceLevel(): number {
    return DYNAMIC_LEVELS[this.currentDynamic];
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // MOVEMENTS
  // ═════════════════════════════════════════════════════════════════════════════

  /** Add a movement to the performance */
  addMovement(name: string, tempo: Tempo, dynamic: Dynamic, measures: number): Movement {
    const movement: Movement = {
      id: sovereignId(),
      name,
      tempo,
      dynamic,
      measures,
      currentMeasure: 0,
      startedAt: null,
      completedAt: null,
    };
    this.movements.push(movement);
    return movement;
  }

  /** Start the next movement */
  nextMovement(): Movement | null {
    this.currentMovementIdx++;
    if (this.currentMovementIdx >= this.movements.length) return null;

    const movement = this.movements[this.currentMovementIdx];
    movement.startedAt = Date.now();
    this.setTempo(movement.tempo);
    this.setDynamic(movement.dynamic);

    this.emit({ type: 'movement_start', timestamp: Date.now(), data: { movementId: movement.id, name: movement.name } });
    return movement;
  }

  /** Get current movement */
  getCurrentMovement(): Movement | null {
    if (this.currentMovementIdx < 0 || this.currentMovementIdx >= this.movements.length) return null;
    return this.movements[this.currentMovementIdx];
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // COHERENCE & PHASE
  // ═════════════════════════════════════════════════════════════════════════════

  /** Calculate ensemble phase alignment (Kuramoto order parameter) */
  getPhaseAlignment(): number {
    const playingVoices = [...this.voices.values()].filter(v => v.state === 'playing');
    if (playingVoices.length === 0) return 1.0;

    let sumCos = 0;
    let sumSin = 0;
    for (const voice of playingVoices) {
      sumCos += Math.cos(voice.phase);
      sumSin += Math.sin(voice.phase);
    }

    const n = playingVoices.length;
    return Math.sqrt((sumCos / n) ** 2 + (sumSin / n) ** 2);
  }

  /** Get average coherence across all voices */
  getAverageCoherence(): number {
    const voices = [...this.voices.values()];
    if (voices.length === 0) return 1.0;
    return voices.reduce((sum, v) => sum + v.coherence, 0) / voices.length;
  }

  /** Synchronize all voices to a reference phase (phase-lock) */
  phaseLock(referencePhase?: number): void {
    const ref = referencePhase ?? 0;
    const couplingStrength = PHI_INVERSE; // Kuramoto coupling

    for (const [, voice] of this.voices) {
      if (voice.state !== 'playing') continue;
      const phaseDiff = ref - voice.phase;
      voice.phase += couplingStrength * Math.sin(phaseDiff);
      // Normalize to [0, 2π]
      voice.phase = ((voice.phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    }

    this.emit({ type: 'phase_lock', timestamp: Date.now(), data: { referencePhase: ref, alignment: this.getPhaseAlignment() } });
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // QUERIES & METRICS
  // ═════════════════════════════════════════════════════════════════════════════

  getState(): ConductorState {
    return this.state;
  }

  getMetrics(): ConductorMetrics {
    const activeVoices = [...this.voices.values()].filter(v => v.state === 'playing' || v.state === 'warming' || v.state === 'sustaining').length;
    const currentMovement = this.getCurrentMovement();

    return {
      state: this.state,
      currentTempo: this.currentTempo,
      currentDynamic: this.currentDynamic,
      totalVoices: this.voices.size,
      activeVoices,
      totalBeats: this.totalBeats,
      totalCues: this.executedCues.length,
      averageCoherence: this.getAverageCoherence(),
      phaseAlignment: this.getPhaseAlignment(),
      uptime: this.startTime > 0 ? Date.now() - this.startTime : 0,
      currentMovement: currentMovement?.name || null,
    };
  }

  getVoice(voiceId: string): Voice | undefined {
    return this.voices.get(voiceId);
  }

  getVoicesBySection(section: Section): Voice[] {
    return [...this.voices.values()].filter(v => v.section === section);
  }

  getAllVoices(): Voice[] {
    return [...this.voices.values()];
  }

  getTempoInterval(tempo: Tempo): number {
    return TEMPO_INTERVALS[tempo];
  }

  getDynamicLevel(dynamic: Dynamic): number {
    return DYNAMIC_LEVELS[dynamic];
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // EVENT SYSTEM
  // ═════════════════════════════════════════════════════════════════════════════

  on(listener: ConductorListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // INTERNAL
  // ═════════════════════════════════════════════════════════════════════════════

  private startBeatClock(): void {
    const interval = TEMPO_INTERVALS[this.currentTempo];
    this.beatTimer = setInterval(() => this.beat(), interval);
  }

  private restartBeatClock(): void {
    if (this.beatTimer) {
      clearInterval(this.beatTimer);
    }
    this.startBeatClock();
  }

  private beat(): void {
    this.totalBeats++;
    const now = Date.now();

    // Advance playing voices
    for (const [, voice] of this.voices) {
      if (voice.state === 'playing') {
        voice.beatCount++;
        voice.lastBeatAt = now;
        // Advance phase by golden angle per beat
        voice.phase = (voice.phase + GOLDEN_ANGLE) % (2 * Math.PI);
      }
    }

    // Execute ready cues
    this.executeCues();

    // Advance current movement measure
    const movement = this.getCurrentMovement();
    if (movement && movement.startedAt) {
      // Measures advance every 4 beats (common time)
      if (this.totalBeats % 4 === 0) {
        movement.currentMeasure++;
        if (movement.currentMeasure >= movement.measures) {
          movement.completedAt = now;
          this.emit({ type: 'movement_end', timestamp: now, data: { movementId: movement.id, name: movement.name } });
        }
      }
    }

    // Natural coherence drift — slight random perturbation
    for (const [, voice] of this.voices) {
      if (voice.state === 'playing') {
        voice.coherence = Math.min(1, Math.max(0, voice.coherence + (Math.random() - 0.5) * 0.02));
      }
    }
  }

  private executeCue(cue: Cue): void {
    cue.executedAt = Date.now();
    this.executedCues.push(cue);

    const targetVoices = cue.targetSection === 'all'
      ? [...this.voices.values()]
      : [...this.voices.values()].filter(v => v.section === cue.targetSection);

    switch (cue.type) {
      case 'entrance':
        for (const v of targetVoices) this.entrance(v.id);
        break;
      case 'exit':
        for (const v of targetVoices) this.exit(v.id);
        break;
      case 'crescendo':
        this.state = 'crescendo';
        break;
      case 'diminuendo':
        this.state = 'diminuendo';
        break;
      case 'accent':
        for (const v of targetVoices) v.dynamic = 'fortissimo';
        break;
      case 'fermata':
        this.state = 'fermata';
        break;
      case 'tempo_change':
        if (cue.data.tempo) this.setTempo(cue.data.tempo as Tempo);
        break;
      case 'section_solo':
        for (const [, v] of this.voices) {
          if (v.section !== cue.targetSection) v.dynamic = 'pianissimo';
        }
        break;
      case 'tutti':
        for (const [, v] of this.voices) v.dynamic = this.currentDynamic;
        break;
    }

    this.emit({ type: 'cue_executed', timestamp: Date.now(), data: { cueId: cue.id, type: cue.type, targetSection: cue.targetSection } });
  }

  private emit(event: ConductorEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION V: SINGLETON ACCESS
// ═══════════════════════════════════════════════════════════════════════════════

let _instance: AlphaConductor | null = null;

/** Get the singleton Alpha Conductor instance */
export function getAlphaConductor(): AlphaConductor {
  if (!_instance) {
    _instance = new AlphaConductor();
  }
  return _instance;
}

/** Reset the singleton (for testing) */
export function resetAlphaConductor(): void {
  if (_instance) {
    _instance.finale();
    _instance = null;
  }
}
