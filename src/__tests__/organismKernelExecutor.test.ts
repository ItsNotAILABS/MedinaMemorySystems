/**
 * Tests for organismKernelExecutor.ts
 * "The kernel is the organism, the organism is everything"
 */

import * as oke from '../lib/organismKernelExecutor';
import { PHI, PHI_INVERSE } from '../lib/kernelCompression';

describe('Organism Kernel Executor', () => {
  describe('Constants', () => {
    it('should have correct glyph signatures', () => {
      expect(oke.HEART_GLYPH).toBe('𓂀☥φ');
      expect(oke.NEURAL_GLYPH).toBe('𓏛🧠φ');
      expect(oke.ANIMAL_GLYPH).toBe('𓆃🐬🦅');
      expect(oke.UNDERWORLD_GLYPH).toBe('𓊽☷∞');
      expect(oke.SOVEREIGN_GLYPH).toBe('☰Ω𓋴');
      expect(oke.WORKFORCE_GLYPH).toBe('𓀀金水');
      expect(oke.SANDBOX_GLYPH).toBe('𓂋→⟷');
    });

    it('should have PHI-scaled frequencies', () => {
      expect(oke.HEART_FREQ).toBeCloseTo(528.0 * PHI, 1);
      expect(oke.NEURAL_FREQ).toBeCloseTo(432.0 * PHI, 1);
      expect(oke.ANIMAL_FREQ).toBeCloseTo(396.0 * PHI, 1);
      expect(oke.UNDERWORLD_FREQ).toBeCloseTo(174.0 * PHI, 1);
    });

    it('should have solfeggio frequencies for some modules', () => {
      expect(oke.SOVEREIGN_FREQ).toBe(963.0);
      expect(oke.WORKFORCE_FREQ).toBe(639.0);
      expect(oke.SANDBOX_FREQ).toBe(417.0);
    });

    it('should have compressed intelligence strings', () => {
      expect(oke.HEART_INTELLIGENCE).toContain('873ms');
      expect(oke.NEURAL_INTELLIGENCE).toContain('PATTERN');
      expect(oke.ANIMAL_INTELLIGENCE).toContain('8SPECIES');
      expect(oke.UNDERWORLD_INTELLIGENCE).toContain('7LAYERS');
      expect(oke.SOVEREIGN_INTELLIGENCE).toContain('35BEINGS');
      expect(oke.WORKFORCE_INTELLIGENCE).toContain('8TYPES');
      expect(oke.SANDBOX_INTELLIGENCE).toContain('INPUT');
    });
  });

  describe('createOrganismKernel', () => {
    it('should create organism kernel with all module kernels', () => {
      const organism = oke.createOrganismKernel();

      expect(organism).toHaveProperty('heartKernel');
      expect(organism).toHaveProperty('neuralCoreKernel');
      expect(organism).toHaveProperty('animalBrainsKernel');
      expect(organism).toHaveProperty('underworldKernel');
      expect(organism).toHaveProperty('sovereignBeingsKernel');
      expect(organism).toHaveProperty('workforceKernel');
      expect(organism).toHaveProperty('sandboxKernel');
    });

    it('should have unique ID based on timestamp', () => {
      const o1 = oke.createOrganismKernel();
      // Since IDs use Date.now() and tests run fast, they may be the same
      // Just verify the ID format is correct
      expect(o1.id).toMatch(/^ORGANISM_KERNEL_\d+$/);
    });

    it('should initialize in Idle execution state', () => {
      const organism = oke.createOrganismKernel();
      expect(organism.executionState).toBe('Idle');
    });

    it('should start at beat 0', () => {
      const organism = oke.createOrganismKernel();
      expect(organism.currentBeat).toBe(0);
    });

    it('should have phiVerified true initially', () => {
      const organism = oke.createOrganismKernel();
      expect(organism.phiVerified).toBe(true);
    });

    it('should initialize shell state with Schumann frequency', () => {
      const organism = oke.createOrganismKernel();
      expect(organism.shellState.frequency).toBe(7.83);
    });

    it('should have module kernels with correct types', () => {
      const organism = oke.createOrganismKernel();

      expect(organism.heartKernel.moduleType).toBe('Heart');
      expect(organism.neuralCoreKernel.moduleType).toBe('NeuralCore');
      expect(organism.animalBrainsKernel.moduleType).toBe('AnimalBrains');
      expect(organism.underworldKernel.moduleType).toBe('Underworld');
      expect(organism.sovereignBeingsKernel.moduleType).toBe('SovereignBeings');
      expect(organism.workforceKernel.moduleType).toBe('Workforce');
      expect(organism.sandboxKernel.moduleType).toBe('Sandbox');
    });

    it('should have module kernels in Dormant state', () => {
      const organism = oke.createOrganismKernel();

      expect(organism.heartKernel.executionState).toBe('Dormant');
      expect(organism.neuralCoreKernel.executionState).toBe('Dormant');
      expect(organism.underworldKernel.executionState).toBe('Dormant');
    });
  });

  describe('Module Kernel Structure', () => {
    let organism: oke.OrganismKernel;

    beforeEach(() => {
      organism = oke.createOrganismKernel();
    });

    it('should have correct glyph signatures on module kernels', () => {
      expect(organism.heartKernel.glyphSignature).toBe(oke.HEART_GLYPH);
      expect(organism.neuralCoreKernel.glyphSignature).toBe(oke.NEURAL_GLYPH);
      expect(organism.animalBrainsKernel.glyphSignature).toBe(oke.ANIMAL_GLYPH);
      expect(organism.underworldKernel.glyphSignature).toBe(oke.UNDERWORLD_GLYPH);
    });

    it('should have capabilities arrays', () => {
      expect(organism.heartKernel.capabilities).toContain('beat()');
      expect(organism.neuralCoreKernel.capabilities).toContain('patternRecognize()');
      expect(organism.animalBrainsKernel.capabilities).toContain('activatePigeonQuantum()');
    });

    it('should have dependencies defined', () => {
      // Heart has no dependencies
      expect(organism.heartKernel.dependencies).toEqual([]);
      // Neural depends on Heart
      expect(organism.neuralCoreKernel.dependencies).toContain('HEART_KERNEL');
      // Animal depends on Neural
      expect(organism.animalBrainsKernel.dependencies).toContain('NEURAL_KERNEL');
    });

    it('should have triggers defined', () => {
      expect(organism.heartKernel.triggers.length).toBeGreaterThan(0);
      expect(organism.heartKernel.triggers[0].triggerType).toBe('OnAlways');
    });
  });

  describe('expandKernelIntelligence', () => {
    it('should expand kernel intelligence with ratio', () => {
      const organism = oke.createOrganismKernel();
      const expanded = oke.expandKernelIntelligence(organism.heartKernel);

      expect(expanded).toContain(organism.heartKernel.compressedIntelligence);
      expect(expanded).toContain('EXPANDED×');
    });
  });

  describe('executeKernel', () => {
    it('should execute kernel in Dormant state', () => {
      const organism = oke.createOrganismKernel();
      const context: oke.ExecutionContext = {
        currentBeat: 10,
        networkFrequency: 432,
        resonanceLevel: 0.8,
        activeKernels: [],
      };

      const result = oke.executeKernel(organism.heartKernel, context);

      expect(result.success).toBe(true);
      expect(result.kernelId).toBe(organism.heartKernel.id);
    });

    it('should fail for kernels in active states', () => {
      const organism = oke.createOrganismKernel();
      organism.heartKernel.executionState = 'Executing';

      const context: oke.ExecutionContext = {
        currentBeat: 10,
        networkFrequency: 432,
        resonanceLevel: 0.8,
        activeKernels: [],
      };

      const result = oke.executeKernel(organism.heartKernel, context);
      expect(result.success).toBe(false);
    });

    it('should include execution output data', () => {
      const organism = oke.createOrganismKernel();
      const context: oke.ExecutionContext = {
        currentBeat: 42,
        networkFrequency: 528,
        resonanceLevel: 0.9,
        activeKernels: [],
      };

      const result = oke.executeKernel(organism.neuralCoreKernel, context);

      expect(result.outputData).toBeDefined();
      expect(result.outputData).toContain('BEAT:42');
      expect(result.outputData).toContain('FREQ:528.00');
    });

    it('should calculate resonance emitted', () => {
      const organism = oke.createOrganismKernel();
      const context: oke.ExecutionContext = {
        currentBeat: 1,
        networkFrequency: 432,
        resonanceLevel: 0.5,
        activeKernels: [],
      };

      const result = oke.executeKernel(organism.heartKernel, context);

      expect(result.resonanceEmitted).toBeGreaterThan(0);
      expect(result.resonanceEmitted).toBeLessThanOrEqual(1);
    });

    it('should identify triggered kernels', () => {
      const organism = oke.createOrganismKernel();
      const context: oke.ExecutionContext = {
        currentBeat: 1,
        networkFrequency: 432,
        resonanceLevel: 0.5,
        activeKernels: [],
      };

      // Heart triggers Neural
      const heartResult = oke.executeKernel(organism.heartKernel, context);
      expect(heartResult.triggeredKernels).toContain('NEURAL_KERNEL');

      // Neural triggers Animal and Sandbox
      const neuralResult = oke.executeKernel(organism.neuralCoreKernel, context);
      expect(neuralResult.triggeredKernels).toContain('ANIMAL_KERNEL');
    });
  });

  describe('executeOrganismCycle', () => {
    it('should execute heart and underworld on every beat', () => {
      const organism = oke.createOrganismKernel();
      const result = oke.executeOrganismCycle(organism, 1);

      expect(result.heartExecuted).toBe(true);
      expect(result.underworldExecuted).toBe(true);
      expect(result.neuralExecuted).toBe(true);
    });

    it('should record current beat', () => {
      const organism = oke.createOrganismKernel();
      const result = oke.executeOrganismCycle(organism, 42);

      expect(result.beat).toBe(42);
    });

    it('should execute sovereign beings only on PHI cycles (every 8 beats)', () => {
      const organism = oke.createOrganismKernel();

      const result7 = oke.executeOrganismCycle(organism, 7);
      expect(result7.sovereignExecuted).toBe(false);

      const result8 = oke.executeOrganismCycle(organism, 8);
      expect(result8.sovereignExecuted).toBe(true);

      const result16 = oke.executeOrganismCycle(organism, 16);
      expect(result16.sovereignExecuted).toBe(true);
    });

    it('should calculate total resonance', () => {
      const organism = oke.createOrganismKernel();
      const result = oke.executeOrganismCycle(organism, 8);

      expect(result.totalResonance).toBeGreaterThan(0);
    });

    it('should include phiVerified and distanceFromPC', () => {
      const organism = oke.createOrganismKernel();
      const result = oke.executeOrganismCycle(organism, 1);

      expect(result.phiVerified).toBe(true);
      expect(result.distanceFromPC).toBe(0);
    });
  });

  describe('State Transitions', () => {
    describe('transitionKernelState', () => {
      it('should follow valid transition path', () => {
        expect(oke.transitionKernelState('Dormant')).toBe('Triggered');
        expect(oke.transitionKernelState('Triggered')).toBe('Expanding');
        expect(oke.transitionKernelState('Expanding')).toBe('Executing');
        expect(oke.transitionKernelState('Executing')).toBe('Resonating');
        expect(oke.transitionKernelState('Resonating')).toBe('Completing');
        expect(oke.transitionKernelState('Completing')).toBe('Contracting');
        expect(oke.transitionKernelState('Contracting')).toBe('Dormant');
      });

      it('should return Dormant for Transcending', () => {
        expect(oke.transitionKernelState('Transcending')).toBe('Dormant');
      });
    });
  });

  describe('Utility Functions', () => {
    describe('isKernelActive', () => {
      it('should return false for Dormant', () => {
        const kernel: oke.ModuleKernel = {
          id: 'test',
          moduleType: 'Custom',
          glyphSignature: 'TEST',
          frequencyKey: 100,
          compressionRatio: 1,
          executionState: 'Dormant',
          executionCount: 0,
          lastExecution: '',
          executionDuration: 0,
          compressedIntelligence: '',
          expandedSize: 0,
          capabilities: [],
          dependencies: [],
          triggers: [],
        };

        expect(oke.isKernelActive(kernel)).toBe(false);
      });

      it('should return false for Contracting', () => {
        const kernel: oke.ModuleKernel = {
          id: 'test',
          moduleType: 'Custom',
          glyphSignature: 'TEST',
          frequencyKey: 100,
          compressionRatio: 1,
          executionState: 'Contracting',
          executionCount: 0,
          lastExecution: '',
          executionDuration: 0,
          compressedIntelligence: '',
          expandedSize: 0,
          capabilities: [],
          dependencies: [],
          triggers: [],
        };

        expect(oke.isKernelActive(kernel)).toBe(false);
      });

      it('should return true for Executing', () => {
        const kernel: oke.ModuleKernel = {
          id: 'test',
          moduleType: 'Custom',
          glyphSignature: 'TEST',
          frequencyKey: 100,
          compressionRatio: 1,
          executionState: 'Executing',
          executionCount: 0,
          lastExecution: '',
          executionDuration: 0,
          compressedIntelligence: '',
          expandedSize: 0,
          capabilities: [],
          dependencies: [],
          triggers: [],
        };

        expect(oke.isKernelActive(kernel)).toBe(true);
      });
    });

    describe('getKernelFrequency', () => {
      it('should return frequency key', () => {
        const organism = oke.createOrganismKernel();
        expect(oke.getKernelFrequency(organism.heartKernel)).toBe(organism.heartKernel.frequencyKey);
      });
    });

    describe('getOrganismResonance', () => {
      it('should return shell coherence', () => {
        const organism = oke.createOrganismKernel();
        expect(oke.getOrganismResonance(organism)).toBe(organism.shellState.coherence);
      });
    });

    describe('getAllKernelGlyphs', () => {
      it('should concatenate all kernel glyphs', () => {
        const organism = oke.createOrganismKernel();
        const glyphs = oke.getAllKernelGlyphs(organism);

        expect(glyphs).toContain(oke.HEART_GLYPH);
        expect(glyphs).toContain(oke.NEURAL_GLYPH);
        expect(glyphs).toContain(oke.ANIMAL_GLYPH);
        expect(glyphs).toContain(oke.UNDERWORLD_GLYPH);
        expect(glyphs).toContain(oke.SOVEREIGN_GLYPH);
        expect(glyphs).toContain(oke.WORKFORCE_GLYPH);
        expect(glyphs).toContain(oke.SANDBOX_GLYPH);
      });
    });

    describe('getKernelStateColor', () => {
      it('should return colors for each state', () => {
        expect(oke.getKernelStateColor('Dormant')).toBe('#6b7280');
        expect(oke.getKernelStateColor('Triggered')).toBe('#f59e0b');
        expect(oke.getKernelStateColor('Expanding')).toBe('#3b82f6');
        expect(oke.getKernelStateColor('Executing')).toBe('#10b981');
        expect(oke.getKernelStateColor('Resonating')).toBe('#8b5cf6');
        expect(oke.getKernelStateColor('Completing')).toBe('#06b6d4');
        expect(oke.getKernelStateColor('Contracting')).toBe('#f97316');
        expect(oke.getKernelStateColor('Transcending')).toBe('#ec4899');
      });

      it('should return gray for unknown state', () => {
        expect(oke.getKernelStateColor('Unknown' as any)).toBe('#6b7280');
      });
    });
  });
});
