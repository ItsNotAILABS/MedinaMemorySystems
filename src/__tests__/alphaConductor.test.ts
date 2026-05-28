/**
 * 𓂀 ALPHA CONDUCTOR — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Tests for ALPHA-COND-001: Alpha Conductor
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  AlphaConductor,
  getAlphaConductor,
  resetAlphaConductor,
  PHI,
  PHI_INVERSE,
  PHI_SQUARED,
  PHI_CUBED,
  SCHUMANN_PERIOD_MS,
  GOLDEN_ANGLE,
  MAX_VOICES_PER_SECTION,
  BEAT_SUBDIVISIONS,
} from '../lib/alphaConductor';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Constants', () => {
  test('PHI is the golden ratio', () => {
    expect(PHI).toBeCloseTo(1.618033988749895, 10);
  });

  test('PHI satisfies φ² = φ + 1', () => {
    expect(PHI_SQUARED).toBeCloseTo(PHI + 1, 10);
  });

  test('PHI_INVERSE + PHI_INVERSE² = 1', () => {
    expect(PHI_INVERSE + PHI_INVERSE * PHI_INVERSE).toBeCloseTo(1, 10);
  });

  test('SCHUMANN_PERIOD_MS is ~127.7ms', () => {
    expect(SCHUMANN_PERIOD_MS).toBeCloseTo(1000 / 7.83, 5);
  });

  test('GOLDEN_ANGLE is correct', () => {
    const expected = 2 * Math.PI * PHI_INVERSE * PHI_INVERSE;
    expect(GOLDEN_ANGLE).toBeCloseTo(expected, 10);
  });

  test('MAX_VOICES_PER_SECTION is 13 (Fibonacci)', () => {
    expect(MAX_VOICES_PER_SECTION).toBe(13);
  });

  test('BEAT_SUBDIVISIONS are Fibonacci numbers', () => {
    expect(BEAT_SUBDIVISIONS).toEqual([1, 1, 2, 3, 5, 8, 13, 21]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Lifecycle', () => {
  let conductor: AlphaConductor;

  beforeEach(() => {
    resetAlphaConductor();
    conductor = new AlphaConductor();
  });

  afterEach(() => {
    conductor.finale();
  });

  test('starts in dormant state', () => {
    expect(conductor.getState()).toBe('dormant');
  });

  test('begin transitions to conducting', () => {
    conductor.begin();
    expect(conductor.getState()).toBe('conducting');
  });

  test('finale returns to dormant', () => {
    conductor.begin();
    conductor.finale();
    expect(conductor.getState()).toBe('dormant');
  });

  test('begin is idempotent when already conducting', () => {
    conductor.begin();
    conductor.begin(); // should not error
    expect(conductor.getState()).toBe('conducting');
  });

  test('finale is idempotent when dormant', () => {
    conductor.finale();
    expect(conductor.getState()).toBe('dormant');
  });

  test('has unique id', () => {
    const other = new AlphaConductor();
    expect(conductor.id).not.toBe(other.id);
    other.finale();
  });

  test('charter is ALPHA-COND-001', () => {
    expect(conductor.charter).toBe('ALPHA-COND-001');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Voices', () => {
  let conductor: AlphaConductor;

  beforeEach(() => {
    conductor = new AlphaConductor();
    conductor.begin();
  });

  afterEach(() => {
    conductor.finale();
  });

  test('register voice returns voice with correct properties', () => {
    const voice = conductor.registerVoice('strings', 'Violin I');
    expect(voice.id).toBeDefined();
    expect(voice.section).toBe('strings');
    expect(voice.name).toBe('Violin I');
    expect(voice.state).toBe('silent');
    expect(voice.coherence).toBe(1.0);
  });

  test('register voice assigns φ-distributed phase', () => {
    const v1 = conductor.registerVoice('strings', 'Voice 1');
    const v2 = conductor.registerVoice('strings', 'Voice 2');
    expect(v1.phase).not.toBe(v2.phase);
    // Phase difference should be golden angle
    const diff = Math.abs(v2.phase - v1.phase);
    expect(diff).toBeCloseTo(GOLDEN_ANGLE, 5);
  });

  test('register voice with custom tempo and dynamic', () => {
    const voice = conductor.registerVoice('brass', 'Trumpet', 'presto', 'fortissimo');
    expect(voice.tempo).toBe('presto');
    expect(voice.dynamic).toBe('fortissimo');
  });

  test('section capacity is enforced', () => {
    for (let i = 0; i < MAX_VOICES_PER_SECTION; i++) {
      conductor.registerVoice('strings', `Voice ${i}`);
    }
    expect(() => conductor.registerVoice('strings', 'Overflow')).toThrow();
  });

  test('different sections have independent capacity', () => {
    for (let i = 0; i < MAX_VOICES_PER_SECTION; i++) {
      conductor.registerVoice('strings', `String ${i}`);
    }
    // Should still be able to add to brass
    const voice = conductor.registerVoice('brass', 'Trumpet');
    expect(voice).toBeDefined();
  });

  test('get voice by id', () => {
    const voice = conductor.registerVoice('percussion', 'Timpani');
    const retrieved = conductor.getVoice(voice.id);
    expect(retrieved).toBeDefined();
    expect(retrieved!.name).toBe('Timpani');
  });

  test('get voices by section', () => {
    conductor.registerVoice('woodwinds', 'Flute');
    conductor.registerVoice('woodwinds', 'Oboe');
    conductor.registerVoice('brass', 'Horn');
    const woodwinds = conductor.getVoicesBySection('woodwinds');
    expect(woodwinds).toHaveLength(2);
  });

  test('remove voice', () => {
    const voice = conductor.registerVoice('choir', 'Soprano');
    const removed = conductor.removeVoice(voice.id);
    expect(removed).toBe(true);
    expect(conductor.getVoice(voice.id)).toBeUndefined();
  });

  test('entrance transitions voice to warming/playing', () => {
    const voice = conductor.registerVoice('strings', 'Cello');
    conductor.entrance(voice.id);
    const updated = conductor.getVoice(voice.id);
    expect(updated!.state).toBe('warming');
  });

  test('exit transitions voice to fading', () => {
    const voice = conductor.registerVoice('strings', 'Cello');
    voice.state = 'playing'; // simulate playing
    conductor.exit(voice.id);
    const updated = conductor.getVoice(voice.id);
    expect(updated!.state).toBe('fading');
  });

  test('entrance returns false for already playing voice', () => {
    const voice = conductor.registerVoice('strings', 'Cello');
    voice.state = 'playing';
    const result = conductor.entrance(voice.id);
    expect(result).toBe(false);
  });

  test('exit returns false for silent voice', () => {
    const voice = conductor.registerVoice('strings', 'Cello');
    const result = conductor.exit(voice.id);
    expect(result).toBe(false);
  });

  test('all voices are retrievable', () => {
    conductor.registerVoice('strings', 'V1');
    conductor.registerVoice('brass', 'V2');
    conductor.registerVoice('woodwinds', 'V3');
    expect(conductor.getAllVoices()).toHaveLength(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPO & DYNAMICS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Tempo & Dynamics', () => {
  let conductor: AlphaConductor;

  beforeEach(() => {
    conductor = new AlphaConductor();
    conductor.begin();
  });

  afterEach(() => {
    conductor.finale();
  });

  test('default tempo is moderato', () => {
    const metrics = conductor.getMetrics();
    expect(metrics.currentTempo).toBe('moderato');
  });

  test('default dynamic is mezzo_forte', () => {
    const metrics = conductor.getMetrics();
    expect(metrics.currentDynamic).toBe('mezzo_forte');
  });

  test('set tempo changes beat interval', () => {
    const beforeInterval = conductor.getBeatInterval();
    conductor.setTempo('presto');
    const afterInterval = conductor.getBeatInterval();
    expect(afterInterval).toBeLessThan(beforeInterval);
  });

  test('tempo intervals are φ-scaled', () => {
    const allegro = conductor.getTempoInterval('allegro');
    const moderato = conductor.getTempoInterval('moderato');
    expect(moderato / allegro).toBeCloseTo(PHI, 5);
  });

  test('all tempi produce positive intervals', () => {
    const tempi = ['prestissimo', 'presto', 'allegro', 'moderato', 'andante', 'adagio', 'largo', 'grave'] as const;
    for (const tempo of tempi) {
      expect(conductor.getTempoInterval(tempo)).toBeGreaterThan(0);
    }
  });

  test('tempi are ordered from fastest to slowest', () => {
    const tempi = ['prestissimo', 'presto', 'allegro', 'moderato', 'andante', 'adagio', 'largo', 'grave'] as const;
    for (let i = 0; i < tempi.length - 1; i++) {
      expect(conductor.getTempoInterval(tempi[i])).toBeLessThan(conductor.getTempoInterval(tempi[i + 1]));
    }
  });

  test('dynamic levels are ordered from loudest to softest', () => {
    const dynamics = ['fortissimo', 'forte', 'mezzo_forte', 'mezzo_piano', 'piano', 'pianissimo'] as const;
    for (let i = 0; i < dynamics.length - 1; i++) {
      expect(conductor.getDynamicLevel(dynamics[i])).toBeGreaterThan(conductor.getDynamicLevel(dynamics[i + 1]));
    }
  });

  test('fortissimo has resource level 1.0', () => {
    expect(conductor.getDynamicLevel('fortissimo')).toBe(1.0);
  });

  test('mezzo_forte resource level is φ⁻¹', () => {
    expect(conductor.getDynamicLevel('mezzo_forte')).toBeCloseTo(PHI_INVERSE, 5);
  });

  test('set dynamic emits event', () => {
    const events: any[] = [];
    conductor.on(e => events.push(e));
    conductor.setDynamic('forte');
    expect(events.some(e => e.type === 'dynamic_change')).toBe(true);
  });

  test('set tempo emits event', () => {
    const events: any[] = [];
    conductor.on(e => events.push(e));
    conductor.setTempo('allegro');
    expect(events.some(e => e.type === 'tempo_change')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CUE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Cues', () => {
  let conductor: AlphaConductor;

  beforeEach(() => {
    conductor = new AlphaConductor();
    conductor.begin();
  });

  afterEach(() => {
    conductor.finale();
  });

  test('schedule cue returns cue with correct properties', () => {
    const cue = conductor.scheduleCue('entrance', 'strings', 100);
    expect(cue.id).toBeDefined();
    expect(cue.type).toBe('entrance');
    expect(cue.targetSection).toBe('strings');
    expect(cue.executedAt).toBeNull();
  });

  test('schedule cue with target voice', () => {
    const voice = conductor.registerVoice('strings', 'Violin');
    const cue = conductor.scheduleCue('accent', 'strings', 0, {}, voice.id);
    expect(cue.targetVoiceId).toBe(voice.id);
  });

  test('execute ready cues returns executed cues', () => {
    conductor.scheduleCue('entrance', 'strings', 0); // delay 0 = immediate
    const executed = conductor.executeCues();
    expect(executed.length).toBeGreaterThanOrEqual(1);
    expect(executed[0].executedAt).not.toBeNull();
  });

  test('future cues are not executed', () => {
    conductor.scheduleCue('entrance', 'strings', 10000); // 10s in future
    const executed = conductor.executeCues();
    expect(executed).toHaveLength(0);
  });

  test('all cue types are accepted', () => {
    const types = ['entrance', 'exit', 'crescendo', 'diminuendo', 'accent', 'fermata', 'tempo_change', 'section_solo', 'tutti'] as const;
    for (const type of types) {
      const cue = conductor.scheduleCue(type, 'all', 0);
      expect(cue.type).toBe(type);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MOVEMENTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Movements', () => {
  let conductor: AlphaConductor;

  beforeEach(() => {
    conductor = new AlphaConductor();
    conductor.begin();
  });

  afterEach(() => {
    conductor.finale();
  });

  test('add movement returns movement with correct properties', () => {
    const movement = conductor.addMovement('Allegro con brio', 'allegro', 'forte', 32);
    expect(movement.name).toBe('Allegro con brio');
    expect(movement.tempo).toBe('allegro');
    expect(movement.dynamic).toBe('forte');
    expect(movement.measures).toBe(32);
    expect(movement.currentMeasure).toBe(0);
    expect(movement.startedAt).toBeNull();
  });

  test('next movement starts the first movement', () => {
    conductor.addMovement('I. Allegro', 'allegro', 'forte', 16);
    const movement = conductor.nextMovement();
    expect(movement).not.toBeNull();
    expect(movement!.name).toBe('I. Allegro');
    expect(movement!.startedAt).not.toBeNull();
  });

  test('next movement sets tempo and dynamic', () => {
    conductor.addMovement('I. Presto', 'presto', 'fortissimo', 8);
    conductor.nextMovement();
    const metrics = conductor.getMetrics();
    expect(metrics.currentTempo).toBe('presto');
    expect(metrics.currentDynamic).toBe('fortissimo');
  });

  test('next movement returns null when no more movements', () => {
    conductor.addMovement('Only', 'moderato', 'mezzo_forte', 4);
    conductor.nextMovement();
    const result = conductor.nextMovement();
    expect(result).toBeNull();
  });

  test('get current movement reflects active movement', () => {
    conductor.addMovement('First', 'allegro', 'forte', 8);
    conductor.addMovement('Second', 'adagio', 'piano', 16);
    expect(conductor.getCurrentMovement()).toBeNull();
    conductor.nextMovement();
    expect(conductor.getCurrentMovement()!.name).toBe('First');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// COHERENCE & PHASE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Coherence & Phase', () => {
  let conductor: AlphaConductor;

  beforeEach(() => {
    conductor = new AlphaConductor();
    conductor.begin();
  });

  afterEach(() => {
    conductor.finale();
  });

  test('phase alignment is 1.0 with no playing voices', () => {
    expect(conductor.getPhaseAlignment()).toBe(1.0);
  });

  test('phase alignment is 1.0 with single playing voice', () => {
    const voice = conductor.registerVoice('strings', 'Solo');
    voice.state = 'playing';
    expect(conductor.getPhaseAlignment()).toBe(1.0);
  });

  test('average coherence starts at 1.0', () => {
    conductor.registerVoice('strings', 'V1');
    expect(conductor.getAverageCoherence()).toBe(1.0);
  });

  test('phase lock couples voices toward reference', () => {
    const v1 = conductor.registerVoice('strings', 'V1');
    const v2 = conductor.registerVoice('strings', 'V2');
    v1.state = 'playing';
    v2.state = 'playing';
    v1.phase = 0;
    v2.phase = Math.PI * 0.75; // offset from reference

    conductor.phaseLock(0);

    // After phase lock, v2 should have moved toward 0 (phase decreased)
    const updated = conductor.getVoice(v2.id);
    expect(updated!.phase).toBeLessThan(Math.PI * 0.75);
  });

  test('phase lock emits event', () => {
    const voice = conductor.registerVoice('strings', 'V1');
    voice.state = 'playing';
    const events: any[] = [];
    conductor.on(e => events.push(e));
    conductor.phaseLock(0);
    expect(events.some(e => e.type === 'phase_lock')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// METRICS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Metrics', () => {
  let conductor: AlphaConductor;

  beforeEach(() => {
    conductor = new AlphaConductor();
    conductor.begin();
  });

  afterEach(() => {
    conductor.finale();
  });

  test('metrics reflect conducting state', () => {
    const metrics = conductor.getMetrics();
    expect(metrics.state).toBe('conducting');
  });

  test('metrics show total voices', () => {
    conductor.registerVoice('strings', 'V1');
    conductor.registerVoice('brass', 'V2');
    const metrics = conductor.getMetrics();
    expect(metrics.totalVoices).toBe(2);
  });

  test('metrics show active voices', () => {
    const v1 = conductor.registerVoice('strings', 'V1');
    conductor.registerVoice('brass', 'V2');
    v1.state = 'playing';
    const metrics = conductor.getMetrics();
    expect(metrics.activeVoices).toBe(1);
  });

  test('metrics show current movement', () => {
    conductor.addMovement('Test', 'allegro', 'forte', 8);
    conductor.nextMovement();
    const metrics = conductor.getMetrics();
    expect(metrics.currentMovement).toBe('Test');
  });

  test('uptime increases', () => {
    const metrics = conductor.getMetrics();
    expect(metrics.uptime).toBeGreaterThanOrEqual(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Events', () => {
  let conductor: AlphaConductor;

  beforeEach(() => {
    conductor = new AlphaConductor();
  });

  afterEach(() => {
    conductor.finale();
  });

  test('emits state_change on begin', () => {
    const events: any[] = [];
    conductor.on(e => events.push(e));
    conductor.begin();
    expect(events.some(e => e.type === 'state_change')).toBe(true);
  });

  test('emits movement_start on nextMovement', () => {
    conductor.begin();
    conductor.addMovement('Test', 'allegro', 'forte', 8);
    const events: any[] = [];
    conductor.on(e => events.push(e));
    conductor.nextMovement();
    expect(events.some(e => e.type === 'movement_start')).toBe(true);
  });

  test('listener can unsubscribe', () => {
    conductor.begin();
    const events: any[] = [];
    const unsub = conductor.on(e => events.push(e));
    unsub();
    conductor.setTempo('presto');
    expect(events).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Singleton', () => {
  afterEach(() => {
    resetAlphaConductor();
  });

  test('getAlphaConductor returns same instance', () => {
    const a = getAlphaConductor();
    const b = getAlphaConductor();
    expect(a).toBe(b);
  });

  test('resetAlphaConductor creates new instance', () => {
    const a = getAlphaConductor();
    resetAlphaConductor();
    const b = getAlphaConductor();
    expect(a).not.toBe(b);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// INTEGRATION — ORCHESTRATOR + CONDUCTOR WORKING TOGETHER
// ═══════════════════════════════════════════════════════════════════════════════

describe('Alpha Conductor - Section Coverage', () => {
  let conductor: AlphaConductor;

  beforeEach(() => {
    conductor = new AlphaConductor();
    conductor.begin();
  });

  afterEach(() => {
    conductor.finale();
  });

  test('all 6 sections accept voices', () => {
    const sections = ['strings', 'brass', 'woodwinds', 'percussion', 'choir', 'electronics'] as const;
    for (const section of sections) {
      const voice = conductor.registerVoice(section, `${section}_voice`);
      expect(voice.section).toBe(section);
    }
    expect(conductor.getAllVoices()).toHaveLength(6);
  });

  test('resource level reflects current dynamic', () => {
    conductor.setDynamic('fortissimo');
    expect(conductor.getResourceLevel()).toBe(1.0);
    conductor.setDynamic('pianissimo');
    expect(conductor.getResourceLevel()).toBeLessThan(0.2);
  });

  test('beat interval reflects current tempo', () => {
    conductor.setTempo('prestissimo');
    const fast = conductor.getBeatInterval();
    conductor.setTempo('grave');
    const slow = conductor.getBeatInterval();
    expect(slow / fast).toBeGreaterThan(10); // grave is much slower than prestissimo
  });
});
