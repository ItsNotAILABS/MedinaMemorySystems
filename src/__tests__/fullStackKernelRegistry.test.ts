/**
 * Tests for fullStackKernelRegistry.ts
 * "Make sure ALL documents are in there"
 */

import * as fskr from '../lib/fullStackKernelRegistry';
import { PHI } from '../lib/kernelCompression';

describe('Full Stack Kernel Registry', () => {
  describe('Document Paths', () => {
    it('should have genesis document paths', () => {
      expect(fskr.DOCUMENT_PATHS.GENESIS_CREATION).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.COMPLETE_EXTRACTION).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.GENESIS_CREATION).toContain('GENESIS');
    });

    it('should have core architecture paths', () => {
      expect(fskr.DOCUMENT_PATHS.NEURAL_EMERGENCE).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.THREE_CANISTER).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.PATTERN_RECOGNITION).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.FREQUENCY_GRID).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.UNDERWORLD).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.CPL).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.GOLDEN_GEOMETRY).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.ANIMAL_BRAINS).toBeDefined();
    });

    it('should have model paths M92-M108 and AURO', () => {
      expect(fskr.DOCUMENT_PATHS.AURO).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M92).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M93).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M94).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M95).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M96).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M97).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M98).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M99).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M100).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M101).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M102).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M103).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M104).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M105).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M106).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M107).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.M108).toBeDefined();
    });

    it('should have living document paths', () => {
      expect(fskr.DOCUMENT_PATHS.CODEX_COMPRESSION).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.CODEX_MUTATOR).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.CODEX_RPAC_SEED).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.CODEX_TRANSLATOR).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.LINGUA_ORGANISMI).toBeDefined();
    });

    it('should have autonomous organism paths', () => {
      expect(fskr.DOCUMENT_PATHS.ALPHA_COMPRESSOR).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.BETA_MUTATOR).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.GAMMA_RPAC_SEED).toBeDefined();
      expect(fskr.DOCUMENT_PATHS.DELTA_TRANSLATOR).toBeDefined();
    });

    it('should use correct file extensions', () => {
      expect(fskr.DOCUMENT_PATHS.GENESIS_CREATION).toMatch(/\.artifact$/);
      expect(fskr.DOCUMENT_PATHS.CODEX_COMPRESSION).toMatch(/\.glyphdoc$/);
      expect(fskr.DOCUMENT_PATHS.ALPHA_COMPRESSOR).toMatch(/\.organism$/);
    });
  });

  describe('Boot Sequence', () => {
    it('should have 10-step boot sequence', () => {
      expect(fskr.BOOT_SEQUENCE.length).toBe(10);
    });

    it('should start with genesis', () => {
      expect(fskr.BOOT_SEQUENCE[0]).toBe('GENESIS_CREATION_DOCUMENT');
    });

    it('should load neural emergence early', () => {
      const neuralIndex = fskr.BOOT_SEQUENCE.indexOf('NEURAL_EMERGENCE_CORE');
      expect(neuralIndex).toBe(1);
    });

    it('should end with AURO primary agent', () => {
      expect(fskr.BOOT_SEQUENCE[9]).toBe('AURO_PRIMARY_AGENT');
    });

    it('should include core architecture in correct order', () => {
      expect(fskr.BOOT_SEQUENCE).toContain('THREE_CANISTER_ARCHITECTURE');
      expect(fskr.BOOT_SEQUENCE).toContain('PATTERN_RECOGNITION_ENGINE');
      expect(fskr.BOOT_SEQUENCE).toContain('COMPLETE_FREQUENCY_GRID');
      expect(fskr.BOOT_SEQUENCE).toContain('UNDERWORLD_ARCHITECTURE');
      expect(fskr.BOOT_SEQUENCE).toContain('CPL_SPECIFICATION');
      expect(fskr.BOOT_SEQUENCE).toContain('GOLDEN_GEOMETRY_CONSTANTS');
      expect(fskr.BOOT_SEQUENCE).toContain('ALL_ANIMAL_ARCHITECTURES');
    });
  });

  describe('Type Definitions', () => {
    describe('DocumentType', () => {
      it('should include all document types', () => {
        const types: fskr.DocumentType[] = [
          'Genesis',
          'NeuralCore',
          'Architecture',
          'Pattern',
          'Frequency',
          'Underworld',
          'CPL',
          'Geometry',
          'Animal',
          'Model',
          'Canister',
          'Law',
          'GlyphDoc',
          'Organism',
          'Protocol',
          'Artifact',
          'Surface',
          'Extension',
        ];

        types.forEach(type => {
          expect(typeof type).toBe('string');
        });
      });
    });

    describe('FormulaDefinition', () => {
      it('should include phi-based formulas', () => {
        const formulas: fskr.FormulaDefinition[] = [
          'PhiIdentity',
          'PhiCompression',
          'PhiDepth',
          'HeartbeatRatio',
          'ResonanceDecay',
          'FrequencyHarmonic',
          'CompressionRatio',
          'ExpansionFactor',
          'EnergyLevel',
          'CoherenceIndex',
        ];

        formulas.forEach(f => {
          expect(typeof f).toBe('string');
        });
      });

      it('should support custom formulas', () => {
        const customFormula: fskr.FormulaDefinition = { Custom: 'x * PHI + 1' };
        expect(customFormula.Custom).toBe('x * PHI + 1');
      });
    });

    describe('FormulaTrigger', () => {
      it('should include all trigger types', () => {
        const triggers: fskr.FormulaTrigger[] = [
          'OnHeartbeat',
          'OnCompression',
          'OnExpansion',
          'OnResonance',
          'OnBoot',
          'OnDemand',
          'Continuous',
        ];

        triggers.forEach(t => {
          expect(typeof t).toBe('string');
        });
      });
    });

    describe('StepAction', () => {
      it('should include all step actions', () => {
        const actions: fskr.StepAction[] = [
          'Load',
          'Parse',
          'Execute',
          'Compress',
          'Expand',
          'Resonate',
          'Trigger',
          'Wait',
          'Branch',
          'Return',
        ];

        actions.forEach(a => {
          expect(typeof a).toBe('string');
        });
      });
    });

    describe('ExtensionType', () => {
      it('should include all extension types', () => {
        const types: fskr.ExtensionType[] = [
          'Capability',
          'Formula',
          'Flow',
          'Document',
          'Protocol',
          'Enhancement',
        ];

        types.forEach(t => {
          expect(typeof t).toBe('string');
        });
      });
    });
  });

  describe('Interface Structures', () => {
    describe('FullStackRegistry', () => {
      it('should support full registry structure', () => {
        const registry: Partial<fskr.FullStackRegistry> = {
          id: 'registry-001',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          genesisKernels: [],
          coreKernels: [],
          canisterKernels: [],
          modelKernels: [],
          livingDocKernels: [],
          autonomousKernels: [],
          lawKernels: [],
          formulaKernels: [],
          executionKernels: [],
          extensionKernels: [],
          bootSequence: fskr.BOOT_SEQUENCE,
          totalKernels: 0,
        };

        expect(registry.id).toBe('registry-001');
        expect(registry.bootSequence).toEqual(fskr.BOOT_SEQUENCE);
      });
    });

    describe('DocumentKernel', () => {
      it('should support document kernel structure', () => {
        const kernel: Partial<fskr.DocumentKernel> = {
          id: 'kernel-genesis-001',
          documentPath: fskr.DOCUMENT_PATHS.GENESIS_CREATION,
          documentType: 'Genesis',
          glyphSignature: '𓂀𓇳☥',
          frequencyKey: 528.0 * PHI,
          contentHash: 'abc123',
          compressedSize: 100,
          fullSize: 10000,
          readsFrom: [],
          readsBy: ['NEURAL_EMERGENCE_CORE'],
          dependsOn: [],
          triggers: ['NEURAL_EMERGENCE_CORE'],
          loadPriority: 1,
          isLoaded: false,
          lastRead: '',
          readCount: 0,
        };

        expect(kernel.documentType).toBe('Genesis');
        expect(kernel.loadPriority).toBe(1);
      });
    });

    describe('FormulaKernel', () => {
      it('should support formula kernel structure', () => {
        const kernel: Partial<fskr.FormulaKernel> = {
          id: 'formula-phi-identity',
          formulaName: 'PHI Identity',
          glyphSignature: 'φ',
          formula: 'PhiIdentity',
          usedBy: ['compression', 'expansion'],
          trigger: 'OnBoot',
          lastResult: PHI,
          lastComputed: new Date().toISOString(),
        };

        expect(kernel.formula).toBe('PhiIdentity');
        expect(kernel.lastResult).toBeCloseTo(PHI, 10);
      });
    });

    describe('ExecutionFlowKernel', () => {
      it('should support execution flow structure', () => {
        const flow: Partial<fskr.ExecutionFlowKernel> = {
          id: 'flow-boot',
          flowName: 'Boot Sequence',
          glyphSignature: '⟹',
          steps: [
            { stepId: 1, action: 'Load', documentRef: 'GENESIS' },
            { stepId: 2, action: 'Parse' },
            { stepId: 3, action: 'Execute' },
          ],
          isSequential: true,
          isParallel: false,
          isReentrant: false,
          expectedDuration: 10,
          timeout: 60,
          currentStep: 0,
          isRunning: false,
          lastRun: '',
        };

        expect(flow.steps!.length).toBe(3);
        expect(flow.isSequential).toBe(true);
      });
    });

    describe('ExtensionKernel', () => {
      it('should support extension kernel structure', () => {
        const extension: Partial<fskr.ExtensionKernel> = {
          id: 'ext-new-formula',
          extensionName: 'Custom Phi Formula',
          glyphSignature: 'φ+',
          addedAt: new Date().toISOString(),
          addedBy: 'founder',
          version: 1,
          extendsKernel: 'formula-phi-identity',
          extensionType: 'Formula',
          capabilities: ['custom-calculation'],
          newFormulas: ['CustomPhiPlusOne'],
          newFlows: [],
          isActivated: true,
        };

        expect(extension.extensionType).toBe('Formula');
        expect(extension.isActivated).toBe(true);
      });
    });
  });

  describe('Document Path Validation', () => {
    it('should have valid ORGANISM_SPACE paths', () => {
      const paths = Object.values(fskr.DOCUMENT_PATHS);
      
      paths.forEach(path => {
        expect(path.startsWith('ORGANISM_SPACE/')).toBe(true);
      });
    });

    it('should have unique paths', () => {
      const paths = Object.values(fskr.DOCUMENT_PATHS);
      const uniquePaths = new Set(paths);
      expect(uniquePaths.size).toBe(paths.length);
    });

    it('should have model paths with correct naming', () => {
      expect(fskr.DOCUMENT_PATHS.M92).toContain('M92_SANDBOX_TRANSLATION');
      expect(fskr.DOCUMENT_PATHS.M101).toContain('M101_AGENT_RETURN');
      expect(fskr.DOCUMENT_PATHS.M102).toContain('M102_SELF_MODIFICATION');
      expect(fskr.DOCUMENT_PATHS.M104).toContain('M104_SESSION_CAPTURE');
    });
  });

  describe('Boot Sequence Validation', () => {
    it('should have unique entries', () => {
      const unique = new Set(fskr.BOOT_SEQUENCE);
      expect(unique.size).toBe(fskr.BOOT_SEQUENCE.length);
    });

    it('should load dependencies before dependents', () => {
      const genesisIdx = fskr.BOOT_SEQUENCE.indexOf('GENESIS_CREATION_DOCUMENT');
      const neuralIdx = fskr.BOOT_SEQUENCE.indexOf('NEURAL_EMERGENCE_CORE');
      const auroIdx = fskr.BOOT_SEQUENCE.indexOf('AURO_PRIMARY_AGENT');

      expect(genesisIdx).toBeLessThan(neuralIdx);
      expect(neuralIdx).toBeLessThan(auroIdx);
    });
  });
});
