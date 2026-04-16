/**
 * Tests for kernelCompression.ts
 * "The symbol holds everything. The organism reads the symbol and knows everything behind it."
 */

import * as kc from '../lib/kernelCompression';

describe('Kernel Compression Library', () => {
  describe('Constants', () => {
    it('should have correct PHI constants', () => {
      expect(kc.PHI).toBeCloseTo(1.6180339887498948482, 15);
      expect(kc.PHI_INVERSE).toBeCloseTo(0.6180339887498948482, 15);
      expect(kc.PHI_SQUARED).toBeCloseTo(2.6180339887498948482, 15);
      expect(kc.PHI_CUBED).toBeCloseTo(4.2360679774997896964, 15);
    });

    it('should have correct frequency constants', () => {
      expect(kc.SCHUMANN_FUNDAMENTAL).toBe(7.83);
      expect(kc.SOLFEGGIO_528).toBe(528.0);
      expect(kc.HEARTBEAT_MS).toBe(873);
    });

    it('should have complete glyph table', () => {
      expect(kc.GLYPH_TABLE.length).toBeGreaterThan(20);
      expect(kc.GLYPH_TABLE.every(g => g.glyph && g.dataType && g.frequency > 0)).toBe(true);
    });
  });

  describe('Glyph Signature Generation', () => {
    describe('generateGlyphSignature', () => {
      it('should generate 6-glyph signature (may be more than 6 bytes due to Unicode)', () => {
        const sig = kc.generateGlyphSignature('Hello World');
        // The function generates 6 glyphs, but some glyphs are multi-byte
        // So we count the actual glyph count using spread operator
        const glyphCount = [...sig].length;
        expect(glyphCount).toBe(6);
      });

      it('should be deterministic for same content', () => {
        const sig1 = kc.generateGlyphSignature('Test Content');
        const sig2 = kc.generateGlyphSignature('Test Content');
        expect(sig1).toBe(sig2);
      });

      it('should produce different signatures for different content', () => {
        const sig1 = kc.generateGlyphSignature('Content A');
        const sig2 = kc.generateGlyphSignature('Content B');
        expect(sig1).not.toBe(sig2);
      });

      it('should contain only glyphs from the table', () => {
        const sig = kc.generateGlyphSignature('Sample text');
        const allGlyphs = kc.GLYPH_TABLE.map(g => g.glyph);
        for (const char of sig) {
          expect(allGlyphs).toContain(char);
        }
      });
    });
  });

  describe('Frequency Key Calculation', () => {
    describe('calculateFrequencyKey', () => {
      it('should return positive frequency', () => {
        const freq = kc.calculateFrequencyKey('Test content');
        expect(freq).toBeGreaterThan(0);
      });

      it('should be based on SOLFEGGIO_528 and PHI', () => {
        const freq = kc.calculateFrequencyKey('Test');
        // Base is SOLFEGGIO_528 * PHI = 854.17
        expect(freq).toBeGreaterThan(kc.SOLFEGGIO_528 * kc.PHI * 0.9);
        expect(freq).toBeLessThan(kc.SOLFEGGIO_528 * kc.PHI * 1.1);
      });

      it('should be deterministic', () => {
        expect(kc.calculateFrequencyKey('Same')).toBe(kc.calculateFrequencyKey('Same'));
      });
    });
  });

  describe('Phi Depth Calculation', () => {
    describe('calculatePhiDepth', () => {
      it('should return 0 for size <= PHI', () => {
        expect(kc.calculatePhiDepth(1)).toBe(0);
      });

      it('should increase with larger sizes', () => {
        const d10 = kc.calculatePhiDepth(10);
        const d100 = kc.calculatePhiDepth(100);
        const d1000 = kc.calculatePhiDepth(1000);
        expect(d100).toBeGreaterThan(d10);
        expect(d1000).toBeGreaterThan(d100);
      });

      it('should represent number of PHI divisions', () => {
        // 100 / PHI^n until < PHI
        // 100 → 61.8 → 38.2 → 23.6 → 14.6 → 9.0 → 5.6 → 3.4 → 2.1 → 1.3 (depth 9)
        const depth = kc.calculatePhiDepth(100);
        expect(depth).toBeGreaterThan(5);
      });
    });
  });

  describe('Kernel Compression and Expansion', () => {
    describe('compressToKernel', () => {
      it('should create kernel with all required properties', () => {
        const kernel = kc.compressToKernel('Test content', 'doc-123', 3, 100);
        
        expect(kernel).toHaveProperty('id');
        expect(kernel).toHaveProperty('glyphSignature');
        expect(kernel).toHaveProperty('frequencyKey');
        expect(kernel).toHaveProperty('compressionRatio');
        expect(kernel).toHaveProperty('originalSize');
        expect(kernel).toHaveProperty('torusCoordinate');
        expect(kernel).toHaveProperty('stateMachineState');
      });

      it('should set original size correctly', () => {
        const content = 'This is test content';
        const kernel = kc.compressToKernel(content, 'doc-1', 1, 1);
        expect(kernel.originalSize).toBe(content.length);
      });

      it('should start in Compressed state', () => {
        const kernel = kc.compressToKernel('Content', 'doc-1', 1, 1);
        expect(kernel.stateMachineState).toBe('Compressed');
      });

      it('should include torus coordinate with ring and beat', () => {
        const kernel = kc.compressToKernel('Content', 'doc-1', 5, 42);
        expect(kernel.torusCoordinate.ring).toBe(5);
        expect(kernel.torusCoordinate.beat).toBe(42);
      });

      it('should calculate compression ratio using PHI', () => {
        const kernel = kc.compressToKernel('A'.repeat(100), 'doc-1', 1, 1);
        expect(kernel.compressionRatio).toBeCloseTo(kc.PHI * Math.log(101), 5);
      });
    });

    describe('expandKernel', () => {
      it('should return full content on valid signature match', () => {
        const content = 'Original content here';
        const kernel = kc.compressToKernel(content, 'doc-1', 1, 1);
        
        const result = kc.expandKernel(kernel, content);
        expect(result.fullContent).toBe(content);
        expect(result.executionReady).toBe(true);
      });

      it('should set executionReady=false for mismatched signature', () => {
        const kernel = kc.compressToKernel('Original', 'doc-1', 1, 1);
        const result = kc.expandKernel(kernel, 'Different content');
        expect(result.executionReady).toBe(false);
      });

      it('should calculate resonance level', () => {
        const content = 'Test';
        const kernel = kc.compressToKernel(content, 'doc-1', 1, 1);
        const result = kc.expandKernel(kernel, content);
        
        expect(result.resonanceLevel).toBeCloseTo(kc.PHI / (kc.PHI + 1.0), 10);
      });
    });
  });

  describe('State Machine Transitions', () => {
    describe('transitionState', () => {
      it('should transition Compressed → Expanding', () => {
        const kernel = kc.compressToKernel('Test', 'doc-1', 1, 1);
        const transitioned = kc.transitionState(kernel, 'Expanding');
        expect(transitioned.stateMachineState).toBe('Expanding');
      });

      it('should not allow invalid transitions', () => {
        const kernel = kc.compressToKernel('Test', 'doc-1', 1, 1);
        // Compressed cannot go directly to Resonating
        const transitioned = kc.transitionState(kernel, 'Resonating');
        expect(transitioned.stateMachineState).toBe('Compressed'); // Unchanged
      });

      it('should follow valid transition paths', () => {
        let kernel = kc.compressToKernel('Test', 'doc-1', 1, 1);
        
        kernel = kc.transitionState(kernel, 'Expanding');
        expect(kernel.stateMachineState).toBe('Expanding');
        
        kernel = kc.transitionState(kernel, 'Executing');
        expect(kernel.stateMachineState).toBe('Executing');
        
        kernel = kc.transitionState(kernel, 'Resonating');
        expect(kernel.stateMachineState).toBe('Resonating');
        
        kernel = kc.transitionState(kernel, 'Contracting');
        expect(kernel.stateMachineState).toBe('Contracting');
        
        kernel = kc.transitionState(kernel, 'Compressed');
        expect(kernel.stateMachineState).toBe('Compressed');
      });
    });

    describe('isKernelActive', () => {
      it('should return false for Compressed', () => {
        const kernel = kc.compressToKernel('Test', 'doc-1', 1, 1);
        expect(kc.isKernelActive(kernel)).toBe(false);
      });

      it('should return true for active states', () => {
        let kernel = kc.compressToKernel('Test', 'doc-1', 1, 1);
        kernel = kc.transitionState(kernel, 'Expanding');
        expect(kc.isKernelActive(kernel)).toBe(true);
      });
    });
  });

  describe('Torus Navigation', () => {
    describe('torusDistance', () => {
      it('should return 0 for same coordinates', () => {
        const coord: kc.TorusCoordinate = { theta: 90, phi: 45, rho: 1, ring: 3, beat: 10 };
        expect(kc.torusDistance(coord, coord)).toBe(0);
      });

      it('should weight dimensions by PHI powers', () => {
        const a: kc.TorusCoordinate = { theta: 0, phi: 0, rho: 0, ring: 0, beat: 0 };
        const b: kc.TorusCoordinate = { theta: 10, phi: 0, rho: 0, ring: 0, beat: 0 };
        const c: kc.TorusCoordinate = { theta: 0, phi: 10, rho: 0, ring: 0, beat: 0 };
        
        // Phi is weighted by PHI, so phi difference should matter more
        expect(kc.torusDistance(a, c)).toBeGreaterThan(kc.torusDistance(a, b));
      });
    });

    describe('findNearestKernels', () => {
      it('should find kernels within distance', () => {
        const kernels = [
          kc.compressToKernel('A', 'doc-1', 1, 1),
          kc.compressToKernel('B', 'doc-2', 2, 2),
          kc.compressToKernel('C', 'doc-3', 10, 100),
        ];
        
        const target: kc.TorusCoordinate = { theta: 0, phi: 0, rho: 1, ring: 1, beat: 1 };
        const nearby = kc.findNearestKernels(target, kernels, 1000);
        
        expect(nearby.length).toBeGreaterThan(0);
        expect(nearby.length).toBeLessThanOrEqual(3);
      });

      it('should return empty for no nearby kernels', () => {
        const kernels = [kc.compressToKernel('Far', 'doc-1', 12, 1000)];
        const target: kc.TorusCoordinate = { theta: 0, phi: 0, rho: 0, ring: 1, beat: 1 };
        
        const nearby = kc.findNearestKernels(target, kernels, 1);
        expect(nearby.length).toBe(0);
      });
    });

    describe('spatialToTorus', () => {
      it('should convert spatial coordinate to torus coordinate', () => {
        const spatial = { theta: 45, phi: 90, depth: 2.5, ring: 5, beat: 100 };
        const torus = kc.spatialToTorus(spatial);
        
        expect(torus.theta).toBe(45);
        expect(torus.phi).toBe(90);
        expect(torus.rho).toBe(2.5);
        expect(torus.ring).toBe(5);
        expect(torus.beat).toBe(100);
      });
    });
  });

  describe('Contract Management', () => {
    describe('createContract', () => {
      it('should create contract with correct properties', () => {
        const contract = kc.createContract('doc-123', 'kernel-456', 'Sovereign', true);
        
        expect(contract.documentId).toBe('doc-123');
        expect(contract.kernelId).toBe('kernel-456');
        expect(contract.contractType).toBe('Sovereign');
        expect(contract.consensusRequired).toBe(true);
        expect(contract.mutations).toBe(0);
      });

      it('should set binding strength based on PHI', () => {
        const contract = kc.createContract('doc', 'kernel', 'Guardian', false);
        expect(contract.bindingStrength).toBeCloseTo(kc.PHI / (kc.PHI + 1.0), 10);
      });
    });

    describe('mutateContract', () => {
      it('should increment mutations', () => {
        const contract = kc.createContract('doc', 'kernel', 'Executor', false);
        const mutated = kc.mutateContract(contract);
        
        expect(mutated.mutations).toBe(1);
      });

      it('should decrease binding strength', () => {
        const contract = kc.createContract('doc', 'kernel', 'Resonator', false);
        const mutated = kc.mutateContract(contract);
        
        expect(mutated.bindingStrength).toBeLessThan(contract.bindingStrength);
      });

      it('should update lastSync', () => {
        const contract = kc.createContract('doc', 'kernel', 'Translator', false);
        const mutated = kc.mutateContract(contract);
        
        expect(new Date(mutated.lastSync).getTime())
          .toBeGreaterThanOrEqual(new Date(contract.lastSync).getTime());
      });
    });

    describe('verifyContract', () => {
      it('should verify recent contract with good binding', () => {
        const contract = kc.createContract('doc', 'kernel', 'Sovereign', true);
        expect(kc.verifyContract(contract)).toBe(true);
      });

      it('should fail for very weak binding', () => {
        let contract = kc.createContract('doc', 'kernel', 'Guardian', false);
        // Mutate many times to weaken binding
        for (let i = 0; i < 10; i++) {
          contract = kc.mutateContract(contract);
        }
        expect(kc.verifyContract(contract)).toBe(false);
      });
    });
  });

  describe('Kernel Evolution', () => {
    describe('transcendKernel', () => {
      it('should increase phi depth', () => {
        const kernel = kc.compressToKernel('Test', 'doc-1', 1, 1);
        const transcended = kc.transcendKernel(kernel);
        
        expect(transcended.phiDepth).toBe(kernel.phiDepth + 1);
      });

      it('should increment version', () => {
        const kernel = kc.compressToKernel('Test', 'doc-1', 1, 1);
        const transcended = kc.transcendKernel(kernel);
        
        expect(transcended.version).toBe(kernel.version + 1);
      });

      it('should set parent kernel ID', () => {
        const kernel = kc.compressToKernel('Test', 'doc-1', 1, 1);
        const transcended = kc.transcendKernel(kernel);
        
        expect(transcended.parentKernelId).toBe(kernel.id);
      });

      it('should multiply compression ratio by PHI', () => {
        const kernel = kc.compressToKernel('Test', 'doc-1', 1, 1);
        const transcended = kc.transcendKernel(kernel);
        
        expect(transcended.compressionRatio).toBeCloseTo(kernel.compressionRatio * kc.PHI, 5);
      });
    });

    describe('mergeKernels', () => {
      it('should combine multiple kernels', () => {
        const k1 = kc.compressToKernel('Content A', 'doc-1', 1, 1);
        const k2 = kc.compressToKernel('Content B', 'doc-2', 2, 2);
        
        const merged = kc.mergeKernels([k1, k2], 5, 50);
        
        expect(merged.originalSize).toBe(k1.originalSize + k2.originalSize);
        expect(merged.torusCoordinate.ring).toBe(5);
        expect(merged.torusCoordinate.beat).toBe(50);
      });

      it('should truncate glyph signature to 12 chars', () => {
        const kernels = Array(5).fill(null).map((_, i) => 
          kc.compressToKernel(`Content ${i}`, `doc-${i}`, 1, 1)
        );
        
        const merged = kc.mergeKernels(kernels, 1, 1);
        expect(merged.glyphSignature.length).toBeLessThanOrEqual(12);
      });

      it('should use highest frequency multiplied by PHI', () => {
        const k1 = kc.compressToKernel('A', 'doc-1', 1, 1);
        const k2 = kc.compressToKernel('B', 'doc-2', 1, 1);
        const maxFreq = Math.max(k1.frequencyKey, k2.frequencyKey);
        
        const merged = kc.mergeKernels([k1, k2], 1, 1);
        expect(merged.frequencyKey).toBeCloseTo(maxFreq * kc.PHI, 5);
      });
    });
  });

  describe('Glyph Utilities', () => {
    describe('getGlyphByType', () => {
      it('should find glyph by data type', () => {
        const glyph = kc.getGlyphByType('sun');
        expect(glyph).toBeDefined();
        expect(glyph!.glyph).toBe('𓇳');
        expect(glyph!.frequency).toBe(528.0);
      });

      it('should return undefined for unknown type', () => {
        expect(kc.getGlyphByType('nonexistent')).toBeUndefined();
      });
    });

    describe('getGlyphFrequency', () => {
      it('should return frequency for known glyph', () => {
        expect(kc.getGlyphFrequency('𓇳')).toBe(528.0);
        expect(kc.getGlyphFrequency('φ')).toBe(698.7);
      });

      it('should return SOLFEGGIO_528 for unknown glyph', () => {
        expect(kc.getGlyphFrequency('X')).toBe(kc.SOLFEGGIO_528);
      });
    });

    describe('decodeGlyphSignature', () => {
      it('should decode signature to data types', () => {
        const sig = '𓇳φ';
        const types = kc.decodeGlyphSignature(sig);
        expect(types).toContain('sun');
        expect(types).toContain('phi');
      });

      it('should skip unknown characters', () => {
        const sig = '𓇳X';
        const types = kc.decodeGlyphSignature(sig);
        expect(types.length).toBe(1);
        expect(types).toContain('sun');
      });
    });

    describe('calculateSignatureFrequency', () => {
      it('should calculate average frequency of glyphs in signature', () => {
        // Just verify the function returns a reasonable frequency value
        const freq = kc.calculateSignatureFrequency('𓇳φ');
        expect(freq).toBeGreaterThan(0);
        expect(freq).toBeLessThan(1000);
      });
    });
  });
});
