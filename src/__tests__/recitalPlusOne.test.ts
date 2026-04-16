/**
 * Tests for recitalPlusOne.ts
 * RECITAL_PLUS_ONE Law: Every recital amplifies the next
 */

import {
  initiateRecital,
  advanceRecital,
  completeRecital,
  getRecital,
  calculateResonance,
} from '../lib/recitalPlusOne';

describe('RECITAL_PLUS_ONE Law', () => {
  describe('initiateRecital', () => {
    it('should create a new recital sequence', () => {
      const seq = initiateRecital('Test input');
      expect(seq).toHaveProperty('id');
      expect(seq.phase).toBe('recital');
      expect(seq.currentStep).toBe(1);
      expect(seq.totalSteps).toBe(4);
      expect(seq.input).toBe('Test input');
      expect(seq.completed).toBe(false);
    });

    it('should generate unique IDs', () => {
      const seq1 = initiateRecital('Input 1');
      const seq2 = initiateRecital('Input 2');
      expect(seq1.id).not.toBe(seq2.id);
    });

    it('should initialize with resonance between 0.5 and 0.8', () => {
      const seq = initiateRecital('Test');
      expect(seq.resonance).toBeGreaterThanOrEqual(0.5);
      expect(seq.resonance).toBeLessThanOrEqual(0.8);
    });
  });

  describe('advanceRecital', () => {
    it('should advance to next phase', () => {
      const seq = initiateRecital('Test');
      const advanced = advanceRecital(seq.id);
      
      expect(advanced).not.toBeNull();
      expect(advanced!.phase).toBe('integration');
      expect(advanced!.currentStep).toBe(2);
    });

    it('should amplify resonance on each advance', () => {
      const seq = initiateRecital('Test');
      const initialResonance = seq.resonance;
      
      const advanced = advanceRecital(seq.id);
      expect(advanced!.resonance).toBeGreaterThan(initialResonance);
    });

    it('should follow phase sequence: recital → integration → amplification → broadcast', () => {
      const seq = initiateRecital('Test');
      
      const s2 = advanceRecital(seq.id);
      expect(s2!.phase).toBe('integration');
      
      const s3 = advanceRecital(seq.id);
      expect(s3!.phase).toBe('amplification');
      
      const s4 = advanceRecital(seq.id);
      expect(s4!.phase).toBe('broadcast');
      expect(s4!.completed).toBe(true);
    });

    it('should set completed=true on final step', () => {
      const seq = initiateRecital('Test');
      advanceRecital(seq.id);
      advanceRecital(seq.id);
      const final = advanceRecital(seq.id);
      
      expect(final!.completed).toBe(true);
      expect(final!.currentStep).toBe(4);
    });

    it('should return null for non-existent sequence', () => {
      const result = advanceRecital('non-existent-id');
      expect(result).toBeNull();
    });

    it('should return null for already completed sequence', () => {
      const seq = initiateRecital('Test');
      advanceRecital(seq.id);
      advanceRecital(seq.id);
      advanceRecital(seq.id); // Complete
      
      const result = advanceRecital(seq.id);
      expect(result).toBeNull();
    });

    it('should cap resonance at 1.0', () => {
      const seq = initiateRecital('Test');
      advanceRecital(seq.id);
      advanceRecital(seq.id);
      const final = advanceRecital(seq.id);
      
      expect(final!.resonance).toBeLessThanOrEqual(1.0);
    });

    it('should generate output message on completion', () => {
      const seq = initiateRecital('Test');
      advanceRecital(seq.id);
      advanceRecital(seq.id);
      const final = advanceRecital(seq.id);
      
      expect(final!.output).toBeDefined();
      expect(final!.output).toContain('Recital complete');
    });
  });

  describe('completeRecital', () => {
    it('should immediately complete a recital with custom output', () => {
      const seq = initiateRecital('Test');
      const completed = completeRecital(seq.id, 'Custom output message');
      
      expect(completed).not.toBeNull();
      expect(completed!.completed).toBe(true);
      expect(completed!.phase).toBe('broadcast');
      expect(completed!.output).toBe('Custom output message');
    });

    it('should calculate final resonance based on remaining steps', () => {
      const seq = initiateRecital('Test');
      const initialResonance = seq.resonance;
      
      const completed = completeRecital(seq.id, 'Output');
      // Resonance should be amplified for skipped steps
      expect(completed!.resonance).toBeGreaterThan(initialResonance);
    });

    it('should return null for non-existent sequence', () => {
      const result = completeRecital('non-existent', 'Output');
      expect(result).toBeNull();
    });
  });

  describe('getRecital', () => {
    it('should retrieve existing recital', () => {
      const seq = initiateRecital('Test');
      const retrieved = getRecital(seq.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(seq.id);
      expect(retrieved!.input).toBe('Test');
    });

    it('should return undefined for non-existent recital', () => {
      const result = getRecital('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should reflect updates from advance', () => {
      const seq = initiateRecital('Test');
      advanceRecital(seq.id);
      
      const retrieved = getRecital(seq.id);
      expect(retrieved!.currentStep).toBe(2);
      expect(retrieved!.phase).toBe('integration');
    });
  });

  describe('calculateResonance', () => {
    const AMPLIFICATION_COEFFICIENT = 0.15;

    it('should amplify resonance by coefficient per beat', () => {
      const base = 0.5;
      const beats = 1;
      const expected = Math.min(1.0, base * Math.pow(1 + AMPLIFICATION_COEFFICIENT, beats));
      
      expect(calculateResonance(base, beats)).toBeCloseTo(expected, 10);
    });

    it('should compound over multiple beats', () => {
      const base = 0.5;
      const r1 = calculateResonance(base, 1);
      const r5 = calculateResonance(base, 5);
      
      expect(r5).toBeGreaterThan(r1);
    });

    it('should cap at 1.0', () => {
      const result = calculateResonance(0.9, 100);
      expect(result).toBe(1.0);
    });

    it('should return base for 0 beats', () => {
      expect(calculateResonance(0.5, 0)).toBe(0.5);
    });
  });

  describe('Resonance Amplification Law', () => {
    it('should follow formula: R(n+1) = R(n) × (1 + α)', () => {
      const seq = initiateRecital('Test');
      const r0 = seq.resonance;
      const ALPHA = 0.15;
      
      const advanced = advanceRecital(seq.id);
      const r1 = advanced!.resonance;
      
      // Allow small floating point differences
      expect(r1).toBeCloseTo(Math.min(1.0, r0 * (1 + ALPHA)), 10);
    });
  });
});
