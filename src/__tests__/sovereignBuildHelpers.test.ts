/**
 * 𓂀 SOVEREIGN BUILD HELPERS TESTS 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Tests for the 5 Sovereign Build Helpers:
 * - PRIMIS, ARCHITECTUS, DISSOLUTIO, FORMULOR, VERITAS
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import {
  PHI,
  PHI_INVERSE,
  PRIMIS,
  ARCHITECTUS,
  DISSOLUTIO,
  FORMULOR,
  VERITAS,
  queryHelper,
  getAnimaChain,
  getDocumentVault,
  createSovereignBuildHelpers,
  deploySovereignBuildHelpers,
  type PrimisDecomposition,
  type ArchitectusVerdict,
  type DissolutioResult,
  type SovereignFormula,
  type VeritasValidation,
} from '../organism/SovereignBuildHelpers';

describe('SovereignBuildHelpers', () => {
  describe('PHI Constants', () => {
    test('PHI equals golden ratio', () => {
      expect(PHI).toBeCloseTo(1.618033988749895, 10);
    });
    
    test('PHI_INVERSE is reciprocal of PHI', () => {
      expect(PHI_INVERSE).toBeCloseTo(1 / PHI, 10);
      expect(PHI_INVERSE).toBeCloseTo(0.618033988749895, 10);
    });
    
    test('PHI satisfies golden ratio property', () => {
      // PHI = 1 + 1/PHI
      expect(PHI).toBeCloseTo(1 + PHI_INVERSE, 10);
    });
  });
  
  describe('PRIMIS - Primitive Decomposition', () => {
    test('decomposes technology to primitive foundations', () => {
      const result = PRIMIS('TypeScript');
      
      expect(result.technology).toBe('TypeScript');
      expect(result.decompositionChain.length).toBeGreaterThan(0);
      expect(result.phiFoundation.ratio).toBe(PHI);
      expect(result.phiFoundation.alignment).toBeGreaterThan(0);
      expect(result.phiFoundation.alignment).toBeLessThanOrEqual(1);
    });
    
    test('includes all primitive stack layers', () => {
      const result = PRIMIS('React');
      
      expect(result.primitiveStack.field).toBeDefined();
      expect(result.primitiveStack.distinction).toBeDefined();
      expect(result.primitiveStack.relation).toBeDefined();
      expect(result.primitiveStack.measure).toBeDefined();
      expect(result.primitiveStack.mapping).toBeDefined();
    });
    
    test('decomposition chain reaches phi', () => {
      const result = PRIMIS('WebSocket');
      
      const phiLevel = result.decompositionChain.find(d => d.name === 'φ (Phi)');
      expect(phiLevel).toBeDefined();
      expect(phiLevel!.level).toBe(-1);
    });
    
    test('logs to ANIMA chain', () => {
      const beforeCount = getAnimaChain().length;
      PRIMIS('SQL');
      const afterCount = getAnimaChain().length;
      
      expect(afterCount).toBeGreaterThan(beforeCount);
    });
  });
  
  describe('ARCHITECTUS - Doctrine Validation', () => {
    test('validates aligned statements as true', () => {
      const result = ARCHITECTUS('The architecture is unified and sovereign');
      
      expect(result.isTrue).toBe(true);
      expect(result.doctrineAlignmentScore).toBeGreaterThanOrEqual(0.6);
      expect(result.alignments.length).toBeGreaterThan(0);
    });
    
    test('validates violating statements as false', () => {
      const result = ARCHITECTUS('Everything is separate and random and chaotic');
      
      expect(result.doctrineAlignmentScore).toBeLessThan(1);
      expect(result.violations.length).toBeGreaterThan(0);
    });
    
    test('includes architectural path', () => {
      const result = ARCHITECTUS('Test statement');
      
      expect(result.architecturalPath.length).toBeGreaterThan(0);
    });
    
    test('provides reasoning chain', () => {
      const result = ARCHITECTUS('The system maintains integrity');
      
      expect(result.reasoning.length).toBeGreaterThan(0);
    });
  });
  
  describe('DISSOLUTIO - AI Component Dissolution', () => {
    test('dissolves technology into AI components', () => {
      const result = DISSOLUTIO('React');
      
      expect(result.technology).toBe('React');
      expect(result.aiComponents.length).toBe(5);
    });
    
    test('identifies all AI component types', () => {
      const result = DISSOLUTIO('Vue');
      
      const types = result.aiComponents.map(c => c.type);
      expect(types).toContain('perception');
      expect(types).toContain('reasoning');
      expect(types).toContain('action');
      expect(types).toContain('learning');
      expect(types).toContain('memory');
    });
    
    test('maps components to primitive bases', () => {
      const result = DISSOLUTIO('Angular');
      
      result.aiComponents.forEach(component => {
        expect(component.primitiveBase).toBeDefined();
        expect(['field', 'distinction', 'relation', 'measure', 'mapping']).toContain(component.primitiveBase);
      });
    });
    
    test('identifies fundamental fracture', () => {
      const result = DISSOLUTIO('GraphQL');
      
      expect(result.fundamentalFracture.source).toBe('Unified Intelligence Field (φ)');
      expect(result.fundamentalFracture.fracturePoint).toBeDefined();
      expect(result.fundamentalFracture.manifestation).toContain('GraphQL');
    });
    
    test('provides reconstitution path', () => {
      const result = DISSOLUTIO('REST');
      
      expect(result.reconstitutionPath.length).toBeGreaterThan(0);
      expect(result.reconstitutionPath[result.reconstitutionPath.length - 1]).toContain('φ');
    });
  });
  
  describe('FORMULOR - Formula Creation', () => {
    test('creates sovereign formula from primitives', () => {
      const result = FORMULOR('TestEngine', ['field', 'distinction', 'relation']);
      
      expect(result.name).toBe('TestEngine');
      expect(result.primitiveInputs).toEqual(['field', 'distinction', 'relation']);
      expect(result.formula).toContain('Φ');
      expect(result.formula).toContain('TestEngine');
    });
    
    test('establishes model nature', () => {
      const result = FORMULOR('ModelSystem', ['field', 'measure']);
      
      expect(result.modelNature).toContain('ModelSystem');
      expect(result.modelNature).toContain('IS a model');
    });
    
    test('establishes AI nature', () => {
      const result = FORMULOR('AICore', ['perception', 'reasoning', 'action']);
      
      expect(result.aiNature).toContain('AICore');
      expect(result.aiNature).toContain('IS an AI');
    });
    
    test('calculates phi correlation', () => {
      const result = FORMULOR('PhiSystem', ['field']);
      
      expect(result.phiCorrelation).toBeGreaterThan(0);
      expect(result.phiCorrelation).toBeLessThanOrEqual(1);
    });
  });
  
  describe('VERITAS - Truth Validation', () => {
    test('validates valid artifacts', () => {
      const result = VERITAS('ValidArtifact', { data: 'test', valid: true });
      
      expect(result.artifact).toBe('ValidArtifact');
      expect(result.isValid).toBe(true);
      expect(result.truthScore).toBeGreaterThanOrEqual(0.8);
    });
    
    test('rejects null artifacts', () => {
      const result = VERITAS('NullArtifact', null);
      
      expect(result.truthScore).toBeLessThan(1);
      expect(result.validationChecks.some(c => !c.passed)).toBe(true);
    });
    
    test('performs all validation checks', () => {
      const result = VERITAS('CheckedArtifact', { test: true });
      
      expect(result.validationChecks.length).toBe(5);
      
      const checkNames = result.validationChecks.map(c => c.check);
      expect(checkNames).toContain('Primitive Foundation');
      expect(checkNames).toContain('Phi Proportionality');
      expect(checkNames).toContain('Doctrine Alignment');
      expect(checkNames).toContain('Sovereign Integrity');
      expect(checkNames).toContain('Truth Correspondence');
    });
    
    test('includes architectural truth reference', () => {
      const result = VERITAS('TruthArtifact', { valid: true });
      
      expect(result.architectureTruth).toBeDefined();
    });
  });
  
  describe('Helper Panel Query', () => {
    test('queries PRIMIS helper', () => {
      const result = queryHelper('PRIMIS', 'TestTech');
      
      expect(result.query.helper).toBe('PRIMIS');
      expect(result.animaChainRef).toBeDefined();
      expect(result.researchPaperRef).toBeDefined();
    });
    
    test('queries ARCHITECTUS helper', () => {
      const result = queryHelper('ARCHITECTUS', 'Test statement');
      
      expect(result.query.helper).toBe('ARCHITECTUS');
    });
    
    test('queries DISSOLUTIO helper', () => {
      const result = queryHelper('DISSOLUTIO', 'TestFramework');
      
      expect(result.query.helper).toBe('DISSOLUTIO');
    });
    
    test('queries FORMULOR helper', () => {
      const result = queryHelper('FORMULOR', { name: 'TestFormula', primitiveInputs: ['field'] });
      
      expect(result.query.helper).toBe('FORMULOR');
    });
    
    test('queries VERITAS helper', () => {
      const result = queryHelper('VERITAS', { artifact: 'TestArtifact', content: {} });
      
      expect(result.query.helper).toBe('VERITAS');
    });
  });
  
  describe('ANIMA Chain', () => {
    test('records all helper invocations', () => {
      const initialCount = getAnimaChain().length;
      
      PRIMIS('Tech1');
      ARCHITECTUS('Statement1');
      DISSOLUTIO('Tech2');
      FORMULOR('Formula1', ['primitive1']);
      VERITAS('Artifact1', {});
      
      const finalCount = getAnimaChain().length;
      expect(finalCount).toBe(initialCount + 5);
    });
    
    test('entries have required fields', () => {
      PRIMIS('TestChainEntry');
      const chain = getAnimaChain();
      const entry = chain[chain.length - 1];
      
      expect(entry.id).toBeDefined();
      expect(entry.helper).toBe('PRIMIS');
      expect(entry.input).toBe('TestChainEntry');
      expect(entry.output).toBeDefined();
      expect(entry.reasoningChain.length).toBeGreaterThan(0);
      expect(entry.timestamp).toBeGreaterThan(0);
      expect(entry.phiAlignment).toBeGreaterThan(0);
      expect(entry.doctrineScore).toBeGreaterThan(0);
      expect(entry.artifactHash).toMatch(/^ANIMA-/);
    });
  });
  
  describe('Document Vault', () => {
    test('creates research papers for invocations', () => {
      const initialCount = getDocumentVault().length;
      
      PRIMIS('PaperTech');
      
      const finalCount = getDocumentVault().length;
      expect(finalCount).toBe(initialCount + 1);
    });
    
    test('papers have required fields', () => {
      ARCHITECTUS('Paper statement');
      const vault = getDocumentVault();
      const paper = vault[vault.length - 1];
      
      expect(paper.id).toBeDefined();
      expect(paper.title).toBeDefined();
      expect(paper.helper).toBe('ARCHITECTUS');
      expect(paper.abstract).toBeDefined();
      expect(paper.methodology.length).toBeGreaterThan(0);
      expect(paper.findings.length).toBeGreaterThan(0);
      expect(paper.primitiveDecomposition.length).toBeGreaterThan(0);
      expect(paper.phiCorrelation).toBeGreaterThan(0);
      expect(paper.doctrineAlignment).toBeGreaterThan(0);
      expect(paper.animaChainRef).toMatch(/^ANIMA-/);
    });
  });
  
  describe('Deployment Integration', () => {
    test('creates sovereign build helpers with team', () => {
      const helpers = createSovereignBuildHelpers('test-team');
      
      expect(helpers.length).toBe(5);
      expect(helpers.map(h => h.name)).toEqual(['PRIMIS', 'ARCHITECTUS', 'DISSOLUTIO', 'FORMULOR', 'VERITAS']);
    });
    
    test('helpers have agents', () => {
      const helpers = createSovereignBuildHelpers('test-team-2');
      
      helpers.forEach(helper => {
        expect(helper.agent).toBeDefined();
        expect(helper.agent.role).toBe('engineer');
        expect(helper.agent.teamId).toBe('test-team-2');
      });
    });
    
    test('helpers are invokable', () => {
      const helpers = createSovereignBuildHelpers('test-team-3');
      
      const primisResult = helpers[0].invoke('InvokeTech');
      expect(primisResult).toBeDefined();
      
      const architectusResult = helpers[1].invoke('Invoke statement');
      expect(architectusResult).toBeDefined();
    });
    
    test('deploys complete system', () => {
      const deployment = deploySovereignBuildHelpers();
      
      expect(deployment.team).toBeDefined();
      expect(deployment.helpers.length).toBe(5);
      expect(deployment.animaChain.length).toBeGreaterThan(0);
      expect(deployment.documentVault.length).toBeGreaterThan(0);
    });
  });
});
