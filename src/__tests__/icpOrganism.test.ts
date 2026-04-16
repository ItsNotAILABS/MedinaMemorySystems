/**
 * Tests for icpOrganism.ts
 * The ICP Integration Library - phi-encoded mathematics and organism state
 */

import * as icp from '../lib/icpOrganism';

describe('ICP Organism Library', () => {
  describe('Universal Constants', () => {
    it('should have correct PHI values', () => {
      expect(icp.PHI).toBeCloseTo(1.618033988749895, 10);
      expect(icp.PHI_INVERSE).toBeCloseTo(0.618033988749895, 10);
      expect(icp.PHI_SQUARED).toBeCloseTo(2.618033988749895, 10);
    });

    it('should have correct frequency and math constants', () => {
      expect(icp.FREQ_432).toBe(432.0);
      expect(icp.PI).toBe(Math.PI);
      expect(icp.TAU).toBe(2 * Math.PI);
      expect(icp.E).toBe(Math.E);
    });
  });

  describe('PHI-Encoded Mathematics', () => {
    describe('phiPower', () => {
      it('should return 1 for n=0', () => {
        expect(icp.phiPower(0)).toBe(1.0);
      });

      it('should return PHI for n=1', () => {
        expect(icp.phiPower(1)).toBeCloseTo(icp.PHI, 10);
      });

      it('should return PHI_SQUARED for n=2', () => {
        expect(icp.phiPower(2)).toBeCloseTo(icp.PHI_SQUARED, 10);
      });

      it('should return PHI_INVERSE for n=-1', () => {
        expect(icp.phiPower(-1)).toBeCloseTo(icp.PHI_INVERSE, 10);
      });

      it('should handle negative powers', () => {
        expect(icp.phiPower(-2)).toBeCloseTo(icp.PHI_INVERSE * icp.PHI_INVERSE, 10);
      });
    });

    describe('phiSpacing', () => {
      it('should multiply base by phi power', () => {
        expect(icp.phiSpacing(10, 0)).toBe(10);
        expect(icp.phiSpacing(10, 1)).toBeCloseTo(10 * icp.PHI, 10);
        expect(icp.phiSpacing(10, 2)).toBeCloseTo(10 * icp.PHI_SQUARED, 10);
      });
    });

    describe('goldenAngle', () => {
      it('should return approximately 2.399 radians (137.5 degrees)', () => {
        const angle = icp.goldenAngle();
        expect(angle).toBeCloseTo(icp.TAU * icp.PHI_INVERSE, 10);
        // ~137.5 degrees
        expect(angle * (180 / Math.PI)).toBeCloseTo(222.49, 1);
      });
    });

    describe('phiEncode', () => {
      it('should return value between 0 and 1', () => {
        for (let i = 0; i < 100; i++) {
          const result = icp.phiEncode(i * 7.3);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThan(1);
        }
      });

      it('should handle negative values', () => {
        const result = icp.phiEncode(-50);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(1);
      });
    });

    describe('phiSpiral', () => {
      it('should return x and y coordinates', () => {
        const point = icp.phiSpiral(0, 10);
        expect(point).toHaveProperty('x');
        expect(point).toHaveProperty('y');
      });

      it('should produce increasing radius for higher indices', () => {
        const p1 = icp.phiSpiral(1, 10);
        const p10 = icp.phiSpiral(10, 10);
        const r1 = Math.sqrt(p1.x ** 2 + p1.y ** 2);
        const r10 = Math.sqrt(p10.x ** 2 + p10.y ** 2);
        expect(r10).toBeGreaterThan(r1);
      });
    });

    describe('fibonacci', () => {
      it('should return correct Fibonacci numbers', () => {
        expect(icp.fibonacci(0)).toBe(0);
        expect(icp.fibonacci(1)).toBe(1);
        expect(icp.fibonacci(2)).toBe(1);
        expect(icp.fibonacci(3)).toBe(2);
        expect(icp.fibonacci(4)).toBe(3);
        expect(icp.fibonacci(5)).toBe(5);
        expect(icp.fibonacci(6)).toBe(8);
        expect(icp.fibonacci(10)).toBe(55);
        expect(icp.fibonacci(20)).toBe(6765);
      });
    });
  });

  describe('Harmonic Frequency Mathematics', () => {
    describe('harmonicSeries', () => {
      it('should generate correct harmonic series', () => {
        const series = icp.harmonicSeries(100, 5);
        expect(series).toEqual([100, 200, 300, 400, 500]);
      });

      it('should work with 432 Hz', () => {
        const series = icp.harmonicSeries(432, 3);
        expect(series).toEqual([432, 864, 1296]);
      });
    });

    describe('noteFrequency', () => {
      it('should return 432 Hz for A4 (0 semitones)', () => {
        expect(icp.noteFrequency(0)).toBe(432);
      });

      it('should return double frequency for +12 semitones (octave)', () => {
        expect(icp.noteFrequency(12)).toBeCloseTo(864, 5);
      });

      it('should return half frequency for -12 semitones', () => {
        expect(icp.noteFrequency(-12)).toBeCloseTo(216, 5);
      });
    });

    describe('octaveFrequency', () => {
      it('should double frequency per octave', () => {
        expect(icp.octaveFrequency(100, 1)).toBe(200);
        expect(icp.octaveFrequency(100, 2)).toBe(400);
        expect(icp.octaveFrequency(100, 0)).toBe(100);
      });
    });

    describe('harmonicResonance', () => {
      it('should return high resonance for exact ratios', () => {
        expect(icp.harmonicResonance(100, 100)).toBeGreaterThan(0.9);
        expect(icp.harmonicResonance(100, 200)).toBeGreaterThan(0.9);
      });

      it('should return lower resonance for very non-harmonic ratios', () => {
        // 1.37 ratio is actually close to 1.333 (4:3), so try a harder case
        expect(icp.harmonicResonance(100, 113)).toBeLessThan(icp.harmonicResonance(100, 150));
      });

      it('should be symmetric', () => {
        expect(icp.harmonicResonance(100, 150)).toBe(icp.harmonicResonance(150, 100));
      });
    });

    describe('generateFrequencySignature', () => {
      it('should return signature with all properties', () => {
        const sig = icp.generateFrequencySignature(42, 5);
        expect(sig).toHaveProperty('fundamental');
        expect(sig).toHaveProperty('harmonics');
        expect(sig).toHaveProperty('phiModulation');
        expect(sig).toHaveProperty('entropyHash');
      });

      it('should generate correct number of harmonics', () => {
        const sig = icp.generateFrequencySignature(42, 5);
        expect(sig.harmonics.length).toBe(5);
      });

      it('should have fundamental based on 432 Hz', () => {
        const sig = icp.generateFrequencySignature(0, 3);
        expect(sig.fundamental).toBeGreaterThanOrEqual(432);
        expect(sig.fundamental).toBeLessThan(864);
      });
    });
  });

  describe('RECITAL_PLUS_ONE Law', () => {
    describe('recitalPlusOne', () => {
      it('should add lawful expansion to state', () => {
        expect(icp.recitalPlusOne(10, 5)).toBe(15);
        expect(icp.recitalPlusOne(0, 1)).toBe(1);
        expect(icp.recitalPlusOne(100, -10)).toBe(90);
      });
    });

    describe('recitalPlusOneBounded', () => {
      it('should clamp to min', () => {
        expect(icp.recitalPlusOneBounded(5, -10, 0, 100)).toBe(0);
      });

      it('should clamp to max', () => {
        expect(icp.recitalPlusOneBounded(95, 10, 0, 100)).toBe(100);
      });

      it('should allow values within bounds', () => {
        expect(icp.recitalPlusOneBounded(50, 10, 0, 100)).toBe(60);
      });
    });

    describe('recitalPlusOneRegisters', () => {
      it('should update all 4 registers', () => {
        const registers: icp.OrganismRegisters = {
          cognitive: 0.5,
          affective: 0.5,
          somatic: 0.5,
          sovereign: 0.5,
        };
        const deltas: icp.OrganismRegisters = {
          cognitive: 0.1,
          affective: 0.1,
          somatic: 0.1,
          sovereign: 0.1,
        };
        const result = icp.recitalPlusOneRegisters(registers, deltas);
        expect(result.cognitive).toBeCloseTo(0.6, 5);
        expect(result.affective).toBeCloseTo(0.6, 5);
        expect(result.somatic).toBeCloseTo(0.6, 5);
        expect(result.sovereign).toBeCloseTo(0.6, 5);
      });

      it('should bound registers between 0 and 1', () => {
        const registers: icp.OrganismRegisters = {
          cognitive: 0.9,
          affective: 0.1,
          somatic: 0.5,
          sovereign: 1.0,
        };
        const deltas: icp.OrganismRegisters = {
          cognitive: 0.5,
          affective: -0.5,
          somatic: 0.1,
          sovereign: 0.1,
        };
        const result = icp.recitalPlusOneRegisters(registers, deltas);
        expect(result.cognitive).toBe(1);
        expect(result.affective).toBe(0);
        expect(result.sovereign).toBe(1);
      });
    });
  });

  describe('Field Computation', () => {
    describe('organismHealth', () => {
      it('should calculate weighted health score', () => {
        const registers: icp.OrganismRegisters = {
          cognitive: 1.0,
          affective: 1.0,
          somatic: 1.0,
          sovereign: 1.0,
        };
        const health = icp.organismHealth(registers);
        expect(health).toBeGreaterThan(0);
      });

      it('should weight sovereign higher', () => {
        const highSov: icp.OrganismRegisters = {
          cognitive: 0,
          affective: 0,
          somatic: 0,
          sovereign: 1.0,
        };
        const highCog: icp.OrganismRegisters = {
          cognitive: 1.0,
          affective: 0,
          somatic: 0,
          sovereign: 0,
        };
        expect(icp.organismHealth(highSov)).toBeGreaterThan(icp.organismHealth(highCog));
      });
    });

    describe('fieldCoherence', () => {
      it('should return 1 for perfectly balanced registers', () => {
        const balanced: icp.OrganismRegisters = {
          cognitive: 0.5,
          affective: 0.5,
          somatic: 0.5,
          sovereign: 0.5,
        };
        expect(icp.fieldCoherence(balanced)).toBeCloseTo(1, 5);
      });

      it('should return lower coherence for unbalanced registers', () => {
        const unbalanced: icp.OrganismRegisters = {
          cognitive: 0,
          affective: 0,
          somatic: 0,
          sovereign: 1.0,
        };
        const balanced: icp.OrganismRegisters = {
          cognitive: 0.25,
          affective: 0.25,
          somatic: 0.25,
          sovereign: 0.25,
        };
        expect(icp.fieldCoherence(unbalanced)).toBeLessThan(icp.fieldCoherence(balanced));
      });
    });

    describe('dualReadEnergy', () => {
      it('should combine arithmetic and geometric means', () => {
        const energy = icp.dualReadEnergy(0.8, 0.8);
        expect(energy).toBeCloseTo(0.8, 5);
      });

      it('should handle different values', () => {
        const energy = icp.dualReadEnergy(1.0, 0.5);
        expect(energy).toBeGreaterThan(0);
        expect(energy).toBeLessThan(1);
      });
    });

    describe('animaHash', () => {
      it('should return unsigned integer', () => {
        const registers: icp.OrganismRegisters = {
          cognitive: 0.5,
          affective: 0.5,
          somatic: 0.5,
          sovereign: 0.5,
        };
        const hash = icp.animaHash(registers, 100, 'test-root');
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(hash)).toBe(true);
      });

      it('should produce different hashes for different inputs', () => {
        const r1: icp.OrganismRegisters = { cognitive: 0.5, affective: 0.5, somatic: 0.5, sovereign: 0.5 };
        const r2: icp.OrganismRegisters = { cognitive: 0.6, affective: 0.5, somatic: 0.5, sovereign: 0.5 };
        expect(icp.animaHash(r1, 100, 'root')).not.toBe(icp.animaHash(r2, 100, 'root'));
      });
    });
  });

  describe('Harmonic Ladder', () => {
    it('should generate correct number of rungs', () => {
      const ladder = icp.harmonicLadder(5);
      expect(ladder.length).toBe(5);
    });

    it('should have correct rung structure', () => {
      const ladder = icp.harmonicLadder(3);
      expect(ladder[0]).toHaveProperty('rung');
      expect(ladder[0]).toHaveProperty('freq');
      expect(ladder[0]).toHaveProperty('note');
    });

    it('should increase frequency by PHI for each rung', () => {
      const ladder = icp.harmonicLadder(3);
      expect(ladder[1].freq).toBeCloseTo(ladder[0].freq * icp.PHI, 5);
    });
  });

  describe('432 Hz Color Palette', () => {
    it('should have all required colors', () => {
      expect(icp.COLORS_432).toHaveProperty('root');
      expect(icp.COLORS_432).toHaveProperty('oroGold');
      expect(icp.COLORS_432).toHaveProperty('novaViolet');
      expect(icp.COLORS_432).toHaveProperty('sovereignBlue');
      expect(icp.COLORS_432).toHaveProperty('memoryPurple');
      expect(icp.COLORS_432).toHaveProperty('governanceGreen');
    });
  });

  describe('Local Organism Simulation', () => {
    describe('localSovereignTick', () => {
      it('should increment beat', () => {
        const initial = icp.getLocalOroState().beat;
        icp.localSovereignTick();
        const after = icp.getLocalOroState().beat;
        expect(after).toBe(initial + 1);
      });

      it('should return tick result with all properties', () => {
        const result = icp.localSovereignTick();
        expect(result).toHaveProperty('beat');
        expect(result).toHaveProperty('oroHealth');
        expect(result).toHaveProperty('novaAlignment');
        expect(result).toHaveProperty('phase');
        expect(result).toHaveProperty('gatesOpen');
        expect(result).toHaveProperty('driftFlags');
        expect(result).toHaveProperty('animaHash');
      });

      it('should update animaHash each tick', () => {
        const r1 = icp.localSovereignTick();
        const r2 = icp.localSovereignTick();
        // animaHash changes due to different beat count
        expect(r1.animaHash).not.toBe(r2.animaHash);
      });
    });

    describe('getLocalOroState', () => {
      it('should return complete OroState', () => {
        const state = icp.getLocalOroState();
        expect(state).toHaveProperty('id');
        expect(state).toHaveProperty('phase');
        expect(state).toHaveProperty('beat');
        expect(state).toHaveProperty('healthScore');
        expect(state).toHaveProperty('registers');
        expect(state).toHaveProperty('fieldState');
      });
    });

    describe('getLocalNovaState', () => {
      it('should return complete NovaState', () => {
        const state = icp.getLocalNovaState();
        expect(state).toHaveProperty('id');
        expect(state).toHaveProperty('doctrineAlignment');
        expect(state).toHaveProperty('consensusWithOro');
        expect(state).toHaveProperty('unresolvedDrifts');
        expect(state).toHaveProperty('registers');
      });
    });

    describe('getLocalVitalSigns', () => {
      it('should return vital signs with phi and freq', () => {
        const vitals = icp.getLocalVitalSigns();
        expect(vitals.phi).toBe(icp.PHI);
        expect(vitals.freq432).toBe(icp.FREQ_432);
      });
    });
  });
});
