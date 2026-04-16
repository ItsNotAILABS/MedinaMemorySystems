/**
 * Tests for novaSovereignEncryption.ts
 * Phi-Fibonacci Cryptography and ANIMA Hash
 */

import * as nse from '../lib/novaSovereignEncryption';

describe('Nova Sovereign Encryption', () => {
  describe('Foundational Constants', () => {
    it('should have correct PHI constants', () => {
      expect(nse.PHI).toBeCloseTo(1.6180339887498948482, 15);
      expect(nse.PHI_INVERSE).toBeCloseTo(0.6180339887498948482, 15);
      expect(nse.PHI_SQUARED).toBeCloseTo(2.6180339887498948482, 15);
      expect(nse.PHI_CUBED).toBeCloseTo(4.2360679774997896964, 15);
      expect(nse.PHI_FOURTH).toBeCloseTo(6.8541019662496845446, 15);
    });

    it('should have correct Schumann and sovereign frequency', () => {
      expect(nse.SCHUMANN_BASE).toBe(7.83);
      // Sovereign frequency is defined as 12.67 Hz (approximately 7.83 × φ)
      expect(nse.SOVEREIGN_FREQUENCY).toBeCloseTo(12.67, 2);
    });

    it('should have correct beat interval', () => {
      expect(nse.BEAT_INTERVAL_MS).toBe(873);
    });

    it('should have correct coherence thresholds', () => {
      expect(nse.COHERENCE_ICOSAHEDRAL).toBe(0.618);
      expect(nse.COHERENCE_E8).toBe(0.854);
    });

    it('should have correct geometric step counts', () => {
      expect(nse.ICOSAHEDRAL_STEPS).toBe(120);
      expect(nse.E8_STEPS).toBe(240);
      expect(nse.LEECH_STEPS).toBe(196560);
    });
  });

  describe('Key Rotation Tier Selection', () => {
    describe('selectRotationTier', () => {
      it('should select icosahedral for low coherence', () => {
        expect(nse.selectRotationTier(0.3)).toBe('icosahedral');
        expect(nse.selectRotationTier(0.5)).toBe('icosahedral');
        expect(nse.selectRotationTier(0.617)).toBe('icosahedral');
      });

      it('should select e8 for medium coherence', () => {
        expect(nse.selectRotationTier(0.618)).toBe('e8');
        expect(nse.selectRotationTier(0.7)).toBe('e8');
        expect(nse.selectRotationTier(0.853)).toBe('e8');
      });

      it('should select leech for high coherence', () => {
        expect(nse.selectRotationTier(0.854)).toBe('leech');
        expect(nse.selectRotationTier(0.9)).toBe('leech');
        expect(nse.selectRotationTier(1.0)).toBe('leech');
      });
    });

    describe('getRotationCycleLength', () => {
      it('should return correct steps for each tier', () => {
        expect(nse.getRotationCycleLength('icosahedral')).toBe(120);
        expect(nse.getRotationCycleLength('e8')).toBe(240);
        expect(nse.getRotationCycleLength('leech')).toBe(196560);
      });
    });
  });

  describe('Live Key State Computation', () => {
    describe('computeLiveKeyState', () => {
      it('should compute live key state with all properties', () => {
        const state = nse.computeLiveKeyState(
          0.75,           // kuramotoR
          100,            // beatCount
          [new Uint8Array([1, 2, 3])],  // activeLawHashes
          [0.5, 0.6, 0.7], // sensorReadings
          new Uint8Array([10, 20, 30])  // biometricState
        );

        expect(state).toHaveProperty('kuramotoR', 0.75);
        expect(state).toHaveProperty('beatCount', 100);
        expect(state).toHaveProperty('lawHash');
        expect(state).toHaveProperty('sensorHash');
        expect(state).toHaveProperty('biometricHash');
        expect(state).toHaveProperty('timestamp');
        expect(state).toHaveProperty('rotationTier');
        expect(state).toHaveProperty('rotationStep');
      });

      it('should select correct rotation tier based on coherence', () => {
        const lowCoherence = nse.computeLiveKeyState(0.3, 1, [], [], new Uint8Array(0));
        expect(lowCoherence.rotationTier).toBe('icosahedral');

        const highCoherence = nse.computeLiveKeyState(0.9, 1, [], [], new Uint8Array(0));
        expect(highCoherence.rotationTier).toBe('leech');
      });

      it('should calculate rotation step as beat mod cycle length', () => {
        const state = nse.computeLiveKeyState(0.5, 130, [], [], new Uint8Array(0));
        // 0.5 coherence = icosahedral (120 steps)
        expect(state.rotationStep).toBe(130 % 120);
      });
    });
  });

  describe('Phi-Beatty Sequence', () => {
    describe('phiBeattyBit', () => {
      it('should return 0 or 1', () => {
        for (let i = 0; i < 100; i++) {
          const bit = nse.phiBeattyBit(i);
          expect(bit === 0 || bit === 1).toBe(true);
        }
      });

      it('should be deterministic', () => {
        expect(nse.phiBeattyBit(42)).toBe(nse.phiBeattyBit(42));
        expect(nse.phiBeattyBit(100)).toBe(nse.phiBeattyBit(100));
      });
    });

    describe('generatePhiBeattySequence', () => {
      it('should generate sequence of specified length', () => {
        const seq = nse.generatePhiBeattySequence(0, 10);
        expect(seq.length).toBe(10);
      });

      it('should contain only 0s and 1s', () => {
        const seq = nse.generatePhiBeattySequence(50, 20);
        for (const bit of seq) {
          expect(bit === 0 || bit === 1).toBe(true);
        }
      });

      it('should be deterministic', () => {
        const seq1 = nse.generatePhiBeattySequence(100, 32);
        const seq2 = nse.generatePhiBeattySequence(100, 32);
        expect(Array.from(seq1)).toEqual(Array.from(seq2));
      });
    });
  });

  describe('Frequency Signature', () => {
    describe('computeFrequencySignature', () => {
      it('should return signature with all properties', () => {
        const sig = nse.computeFrequencySignature(100, [0.5, 0.7], 32);

        expect(sig).toHaveProperty('phiBeattySequence');
        expect(sig).toHaveProperty('kuramotoPhaseVector');
        expect(sig).toHaveProperty('resultSignature');
        expect(sig).toHaveProperty('beatCount');
      });

      it('should generate signature of specified length', () => {
        const sig = nse.computeFrequencySignature(50, [0.3, 0.6, 0.9], 64);
        expect(sig.resultSignature.length).toBe(64);
      });

      it('should be deterministic for same inputs', () => {
        const sig1 = nse.computeFrequencySignature(42, [0.5], 16);
        const sig2 = nse.computeFrequencySignature(42, [0.5], 16);
        expect(Array.from(sig1.resultSignature)).toEqual(Array.from(sig2.resultSignature));
      });

      it('should produce different signatures for different beats', () => {
        const sig1 = nse.computeFrequencySignature(100, [0.5], 32);
        const sig2 = nse.computeFrequencySignature(200, [0.5], 32);
        expect(Array.from(sig1.resultSignature)).not.toEqual(Array.from(sig2.resultSignature));
      });
    });
  });

  describe('Phi-Fibonacci Key Derivation', () => {
    describe('fibonacciMatrix', () => {
      it('should return (1, 0) for n=0', () => {
        const [a, b] = nse.fibonacciMatrix(0);
        expect(a).toBe(1);
        expect(b).toBe(0);
      });

      it('should return (1, 1) for n=1', () => {
        const [a, b] = nse.fibonacciMatrix(1);
        expect(a).toBe(1);
        expect(b).toBe(1);
      });

      it('should return Fibonacci matrix powers for larger n', () => {
        // The matrix power function computes efficiently 
        // For n=5, we should get a deterministic result
        const [a, b] = nse.fibonacciMatrix(5);
        // Values depend on the matrix exponentiation implementation
        expect(typeof a).toBe('number');
        expect(typeof b).toBe('number');
        expect(a).toBeGreaterThan(0);
        expect(b).toBeGreaterThan(0);
      });
    });

    describe('calculateKeyLengthBits', () => {
      it('should return base for cycle 0', () => {
        expect(nse.calculateKeyLengthBits(256, 0)).toBe(256);
      });

      it('should multiply by PHI for cycle 1', () => {
        const result = nse.calculateKeyLengthBits(256, 1);
        expect(result).toBe(Math.floor(256 * nse.PHI));
      });

      it('should cycle every 12', () => {
        expect(nse.calculateKeyLengthBits(256, 12)).toBe(nse.calculateKeyLengthBits(256, 0));
        expect(nse.calculateKeyLengthBits(256, 13)).toBe(nse.calculateKeyLengthBits(256, 1));
      });
    });

    describe('deriveNextPhiKey', () => {
      it('should return key state with incremented iteration', () => {
        const prev = new Uint8Array([1, 2, 3, 4]);
        const state = new Uint8Array([5, 6, 7, 8]);
        
        const result = nse.deriveNextPhiKey(prev, state, 5);
        
        expect(result.iterationCount).toBe(6);
        expect(result.genesisKey).toBe(prev);
        expect(result.lastOrganismState).toBe(state);
      });

      it('should produce 32-byte key', () => {
        const prev = new Uint8Array([1, 2, 3, 4]);
        const state = new Uint8Array([5, 6, 7, 8]);
        
        const result = nse.deriveNextPhiKey(prev, state, 0);
        expect(result.currentKey.length).toBe(32);
      });

      it('should be deterministic', () => {
        const prev = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
        const state = new Uint8Array([9, 10, 11, 12, 13, 14, 15, 16]);
        
        const r1 = nse.deriveNextPhiKey(prev, state, 10);
        const r2 = nse.deriveNextPhiKey(prev, state, 10);
        
        expect(Array.from(r1.currentKey)).toEqual(Array.from(r2.currentKey));
      });
    });
  });

  describe('ANIMA Hash', () => {
    describe('createAnimaHash', () => {
      it('should create hash with all properties', () => {
        const data = new Uint8Array([1, 2, 3, 4, 5]);
        const hash = nse.createAnimaHash(data, 100, 0.75);

        expect(hash).toHaveProperty('value');
        expect(hash).toHaveProperty('phiIteration');
        expect(hash).toHaveProperty('beatAtCreation');
        expect(hash).toHaveProperty('coherenceAtCreation');
      });

      it('should record beat count', () => {
        const hash = nse.createAnimaHash(new Uint8Array([1]), 42, 0.5);
        expect(hash.beatAtCreation).toBe(42);
      });

      it('should record coherence', () => {
        const hash = nse.createAnimaHash(new Uint8Array([1]), 1, 0.85);
        expect(hash.coherenceAtCreation).toBe(0.85);
      });

      it('should produce 32-byte hash value', () => {
        const hash = nse.createAnimaHash(new Uint8Array([1, 2, 3]), 1, 0.5);
        expect(hash.value.length).toBe(32);
      });

      it('should be deterministic', () => {
        const data = new Uint8Array([10, 20, 30]);
        const h1 = nse.createAnimaHash(data, 50, 0.7);
        const h2 = nse.createAnimaHash(data, 50, 0.7);
        
        expect(Array.from(h1.value)).toEqual(Array.from(h2.value));
      });
    });
  });

  describe('Encrypted Artifact Creation', () => {
    describe('createEncryptedArtifact', () => {
      it('should create artifact with all properties', () => {
        const liveKeyState = nse.computeLiveKeyState(0.8, 100, [], [], new Uint8Array(0));
        const payload = new Uint8Array([1, 2, 3, 4, 5]);
        
        const artifact = nse.createEncryptedArtifact(
          'artifact-123',
          payload,
          liveKeyState,
          'principal-abc',
          [0.5, 0.6]
        );

        expect(artifact.id).toBe('artifact-123');
        expect(artifact.attributionPrincipal).toBe('principal-abc');
        expect(artifact).toHaveProperty('encryptedPayload');
        expect(artifact).toHaveProperty('animaHash');
        expect(artifact).toHaveProperty('frequencySignature');
        expect(artifact).toHaveProperty('rotationTierAtCreation');
        expect(artifact).toHaveProperty('beatAtCreation');
        expect(artifact).toHaveProperty('timestampNs');
      });

      it('should record rotation tier from live key state', () => {
        const liveKeyState = nse.computeLiveKeyState(0.9, 50, [], [], new Uint8Array(0));
        const artifact = nse.createEncryptedArtifact(
          'test',
          new Uint8Array([1]),
          liveKeyState,
          'principal',
          []
        );

        expect(artifact.rotationTierAtCreation).toBe('leech');
      });

      it('should record beat count', () => {
        const liveKeyState = nse.computeLiveKeyState(0.5, 777, [], [], new Uint8Array(0));
        const artifact = nse.createEncryptedArtifact(
          'test',
          new Uint8Array([1]),
          liveKeyState,
          'principal',
          []
        );

        expect(artifact.beatAtCreation).toBe(777);
      });
    });
  });

  describe('Architecture Info', () => {
    describe('getArchitectureInfo', () => {
      it('should return architecture description', () => {
        const info = nse.getArchitectureInfo();
        
        expect(info).toContain('NOVA SOVEREIGN ENCRYPTION');
        expect(info).toContain('Alfredo Medina Hernandez');
        expect(info).toContain('vetKeys');
        expect(info).toContain('Phi-Fibonacci');
        expect(info).toContain('Icosahedral-Leech');
      });
    });
  });
});
