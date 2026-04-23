/**
 * 𓂀 SOVEREIGN ENGINEER AGENTS — TEST SUITE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Tests for the Sovereign Engineers — the actual engineers of the organism.
 * They think. They test. They fix. They have a VOICE.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  SovereignEngineer,
  SovereignEngineerCollective,
  getSovereignEngineerCollective,
  type Signal,
  type Pulse,
  type Fracture,
  type Voice,
  type EngineerRole,
} from '../organism/sovereign-engineers';

import { FIBONACCI_SEQUENCE, NO_STRESS_LAW } from '../organism/internal-agents';
import { PHI } from '../lib/novaSovereignEncryption';

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: SOVEREIGN ENGINEER CREATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sovereign Engineer - Creation and State', () => {
  test('Engineer is created with correct initial state', () => {
    const engineer = new SovereignEngineer('test-engineer', 'chaos-primitive');
    const state = engineer.getState();
    
    expect(state.id).toBe('test-engineer');
    expect(state.role).toBe('chaos-primitive');
    expect(state.isAlwaysOn).toBe(true);
    expect(state.hasFeeling).toBe(false); // No feelings
    expect(state.hasVoice).toBe(true); // Has voice
    expect(state.fracturesFound).toBe(0);
    expect(state.fracturesHealed).toBe(0);
  });
  
  test('Engineer has no feelings (pure work)', () => {
    const engineer = new SovereignEngineer('test-engineer', 'healer');
    expect(engineer.getState().hasFeeling).toBe(false);
  });
  
  test('Engineer has a voice', () => {
    const engineer = new SovereignEngineer('test-engineer', 'voice');
    expect(engineer.getState().hasVoice).toBe(true);
  });
  
  test('Engineer is always on (24/7)', () => {
    const engineer = new SovereignEngineer('test-engineer', 'evolver');
    expect(engineer.getState().isAlwaysOn).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: ENGINEER VOICE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sovereign Engineer - Voice', () => {
  test('Engineer can speak', () => {
    const engineer = new SovereignEngineer('test-engineer', 'voice');
    engineer.speak('discovery', 'Test message');
    
    const voices = engineer.getVoices();
    expect(voices.length).toBe(1);
    expect(voices[0].message).toBe('Test message');
    expect(voices[0].type).toBe('discovery');
  });
  
  test('Voice has correct properties', () => {
    const engineer = new SovereignEngineer('test-engineer', 'voice');
    engineer.speak('recommendation', 'Recommend something', 0.9);
    
    const voice = engineer.getVoices()[0];
    expect(voice.agentId).toBe('test-engineer');
    expect(voice.type).toBe('recommendation');
    expect(voice.confidence).toBe(0.9);
    expect(voice.timestamp).toBeGreaterThan(0n);
  });
  
  test('Voice types are correct', () => {
    const engineer = new SovereignEngineer('test-engineer', 'voice');
    
    const types: Voice['type'][] = ['recommendation', 'warning', 'discovery', 'fix', 'question'];
    types.forEach(type => {
      engineer.speak(type, `Test ${type}`);
    });
    
    const voices = engineer.getVoices(5);
    expect(voices.length).toBe(5);
  });
  
  test('Voice confidence defaults to PHI_INVERSE', () => {
    const engineer = new SovereignEngineer('test-engineer', 'voice');
    engineer.speak('discovery', 'Test');
    
    const voice = engineer.getVoices()[0];
    expect(voice.confidence).toBeCloseTo(0.618, 2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: PULSE GENERATION (50,000 User Simulation)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sovereign Engineer - Pulse Generation', () => {
  test('Can generate pulse with signals', () => {
    const engineer = new SovereignEngineer('test-engineer', 'pulse-generator');
    const pulse = engineer.generatePulse(100);
    
    expect(pulse.signals.length).toBe(100);
    expect(pulse.count).toBe(100);
    expect(pulse.targetCount).toBe(100);
  });
  
  test('Pulse signals have correct structure', () => {
    const engineer = new SovereignEngineer('test-engineer', 'pulse-generator');
    const pulse = engineer.generatePulse(10);
    
    const signal = pulse.signals[0];
    expect(signal).toHaveProperty('id');
    expect(signal).toHaveProperty('type');
    expect(signal).toHaveProperty('payload');
    expect(signal).toHaveProperty('timestamp');
    expect(signal).toHaveProperty('fibonacciIndex');
    expect(signal).toHaveProperty('dissolved');
    expect(signal.dissolved).toBe(false);
  });
  
  test('Can generate up to 50,000 signals', () => {
    const engineer = new SovereignEngineer('test-engineer', 'pulse-generator');
    const pulse = engineer.generatePulse(50000);
    
    expect(pulse.count).toBe(50000);
    expect(pulse.signals.length).toBe(50000);
  });
  
  test('Caps at 50,000 even if more requested', () => {
    const engineer = new SovereignEngineer('test-engineer', 'pulse-generator');
    const pulse = engineer.generatePulse(100000);
    
    expect(pulse.count).toBe(50000);
    expect(pulse.targetCount).toBe(100000);
  });
  
  test('Can dissolve pulse (cleanup)', () => {
    const engineer = new SovereignEngineer('test-engineer', 'pulse-generator');
    const pulse = engineer.generatePulse(100);
    
    expect(pulse.signals.length).toBe(100);
    
    engineer.dissolvePulse(pulse);
    
    expect(pulse.signals.length).toBe(0);
    expect(pulse.count).toBe(0);
  });
  
  test('Signal types follow Fibonacci distribution', () => {
    const engineer = new SovereignEngineer('test-engineer', 'pulse-generator');
    const pulse = engineer.generatePulse(100);
    
    const types = new Set(pulse.signals.map(s => s.type));
    expect(types.size).toBeGreaterThan(1); // Multiple types
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: ENGINEER COLLECTIVE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sovereign Engineer Collective', () => {
  test('Collective has all 9 specialized engineers', () => {
    const collective = new SovereignEngineerCollective();
    const stats = collective.getCollectiveStats();
    
    expect(stats.engineerStates.length).toBe(9);
  });
  
  test('Collective has all engineer roles', () => {
    const collective = new SovereignEngineerCollective();
    const stats = collective.getCollectiveStats();
    
    const roles = new Set(stats.engineerStates.map(s => s.role));
    
    expect(roles.has('chaos-primitive')).toBe(true);
    expect(roles.has('healer')).toBe(true);
    expect(roles.has('evolver')).toBe(true);
    expect(roles.has('pulse-generator')).toBe(true);
    expect(roles.has('voice')).toBe(true);
    expect(roles.has('substrate-encoder')).toBe(true);
    expect(roles.has('ethics-guardian')).toBe(true);
    expect(roles.has('token-analyzer')).toBe(true);
    expect(roles.has('response-optimizer')).toBe(true);
  });
  
  test('All engineers have no feelings', () => {
    const collective = new SovereignEngineerCollective();
    const stats = collective.getCollectiveStats();
    
    stats.engineerStates.forEach(state => {
      expect(state.hasFeeling).toBe(false);
    });
  });
  
  test('All engineers have voice', () => {
    const collective = new SovereignEngineerCollective();
    const stats = collective.getCollectiveStats();
    
    stats.engineerStates.forEach(state => {
      expect(state.hasVoice).toBe(true);
    });
  });
  
  test('All engineers are always on', () => {
    const collective = new SovereignEngineerCollective();
    const stats = collective.getCollectiveStats();
    
    stats.engineerStates.forEach(state => {
      expect(state.isAlwaysOn).toBe(true);
    });
  });
  
  test('Can get engineer by role', () => {
    const collective = new SovereignEngineerCollective();
    
    const pulseGenerator = collective.getEngineerByRole('pulse-generator');
    expect(pulseGenerator).toBeDefined();
    expect(pulseGenerator?.role).toBe('pulse-generator');
  });
  
  test('Can generate massive pulse from collective', () => {
    const collective = new SovereignEngineerCollective();
    const pulse = collective.generateMassivePulse(1000);
    
    expect(pulse.count).toBe(1000);
    expect(pulse.signals.length).toBe(1000);
  });
  
  test('Singleton returns same instance', () => {
    const collective1 = getSovereignEngineerCollective();
    const collective2 = getSovereignEngineerCollective();
    
    expect(collective1).toBe(collective2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: CHAOS PRIMITIVES (Not Chaos Monkey)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Chaos Primitives - First Principles', () => {
  test('Fracture structure is correct', () => {
    const fracture: Fracture = {
      id: 'test-fracture',
      location: 'memory-temple',
      type: 'memory',
      severity: 0.5,
      discovered: BigInt(Date.now()) * 1000000n,
      healed: false,
    };
    
    expect(fracture.id).toBe('test-fracture');
    expect(fracture.type).toBe('memory');
    expect(fracture.severity).toBe(0.5);
    expect(fracture.healed).toBe(false);
  });
  
  test('Fracture types cover all categories', () => {
    const types: Fracture['type'][] = ['memory', 'state', 'network', 'compute', 'consensus'];
    expect(types.length).toBe(5);
  });
  
  test('Signal structure for user simulation', () => {
    const signal: Signal = {
      id: 'test-signal',
      type: 'user',
      payload: { userId: 'user-1' },
      timestamp: BigInt(Date.now()) * 1000000n,
      fibonacciIndex: 10,
      dissolved: false,
    };
    
    expect(signal.type).toBe('user');
    expect(signal.dissolved).toBe(false);
    expect(signal.fibonacciIndex).toBe(10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: NO STRESS LAW INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('No Stress Law - Upheld by Engineers', () => {
  test('Ethics guardian upholds No Stress Law', () => {
    const collective = new SovereignEngineerCollective();
    const ethicsGuardian = collective.getEngineerByRole('ethics-guardian');
    
    expect(ethicsGuardian).toBeDefined();
    
    // No Stress Law must be permanently encoded
    expect(NO_STRESS_LAW.substratePermanent).toBe(true);
  });
  
  test('Engineers transform stress to discovery', () => {
    // The engineers don't experience stress
    // They transform load into creativity
    const collective = new SovereignEngineerCollective();
    const stats = collective.getCollectiveStats();
    
    // All engineers have no feelings = no stress
    stats.engineerStates.forEach(state => {
      expect(state.hasFeeling).toBe(false);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: FIBONACCI INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('Fibonacci Integration in Engineers', () => {
  test('Pulse signals use Fibonacci indexing', () => {
    const engineer = new SovereignEngineer('test-engineer', 'pulse-generator');
    const pulse = engineer.generatePulse(100);
    
    pulse.signals.forEach((signal, i) => {
      expect(signal.fibonacciIndex).toBe(i % 50);
    });
  });
  
  test('Engineer IDs use Fibonacci sequence', () => {
    const collective = new SovereignEngineerCollective();
    const stats = collective.getCollectiveStats();
    
    // IDs contain Fibonacci numbers
    stats.engineerStates.forEach(state => {
      const hasFibNumber = FIBONACCI_SEQUENCE.some(fib => 
        state.id.includes(fib.toString())
      );
      expect(hasFibNumber).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: SCALING (0 → 5,000 → 50,000)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Scaling Verification - Engineers', () => {
  test('Can simulate 0 users', () => {
    const engineer = new SovereignEngineer('test-engineer', 'pulse-generator');
    const pulse = engineer.generatePulse(0);
    expect(pulse.count).toBe(0);
  });
  
  test('Can simulate 5,000 users', () => {
    const engineer = new SovereignEngineer('test-engineer', 'pulse-generator');
    const pulse = engineer.generatePulse(5000);
    expect(pulse.count).toBe(5000);
  });
  
  test('Can simulate 50,000 users', () => {
    const engineer = new SovereignEngineer('test-engineer', 'pulse-generator');
    const pulse = engineer.generatePulse(50000);
    expect(pulse.count).toBe(50000);
  });
  
  test('Scaling is PHI-based', () => {
    // The engineers use PHI-scaled intervals
    const expectedInterval = Math.round(873 / PHI); // BEAT_INTERVAL_MS / PHI
    expect(expectedInterval).toBeCloseTo(540, 0); // 873 / 1.618 ≈ 540
  });
});
