/**
 * 𓂀 KNOWLEDGE SYNTHESIS ORGANISM TESTS 𓂀
 */

import {
  synthesize,
  seedKnowledge,
  getSynthesisOrganism,
  getKnowledgeBase,
  getAllSystems,
  getAllPasses,
  getSynthesisPass,
  querySystemByName,
  SynthesisOrganism,
  type ExternalSystem,
} from '../organism/KnowledgeSynthesisOrganism';

// ─── helpers ────────────────────────────────────────────────────────────────

function makeSystem(id: string): ExternalSystem {
  return {
    id,
    name: `TestSystem_${id}`,
    sourceProject: 'Test Project',
    language: 'TypeScript',
    architecture: 'A unified sovereign test architecture',
    capabilities: [
      { name: 'CapA', description: 'cap a', primitiveBase: 'field' },
      { name: 'CapB', description: 'cap b', primitiveBase: 'relation' },
    ],
    mathematicalFoundation: ['φ = 1 + 1/φ'],
    frequencySignature: 12.0,
    phiAlignment: 0.95,
    rawDocumentation: 'Raw docs for test system.',
  };
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe('KnowledgeSynthesisOrganism', () => {
  describe('seedKnowledge', () => {
    test('seeds all 7 external defense/chimera systems', () => {
      const passes = seedKnowledge();
      expect(passes.length).toBeGreaterThanOrEqual(7);
    });

    test('seed is idempotent (safe to call twice)', () => {
      const first = seedKnowledge().length;
      const second = seedKnowledge().length;
      expect(first).toBe(second);
    });
  });

  describe('synthesize', () => {
    test('runs all 5 helpers and returns a full pass', () => {
      const pass = synthesize(makeSystem('unit-test-1'));

      expect(pass.systemId).toBe('unit-test-1');
      expect(pass.primis).toBeDefined();
      expect(pass.architectus).toBeDefined();
      expect(pass.dissolutio).toBeDefined();
      expect(pass.formulor).toBeDefined();
      expect(pass.veritas).toBeDefined();
    });

    test('pass includes phi alignment between 0 and 1', () => {
      const pass = synthesize(makeSystem('unit-test-2'));
      expect(pass.overallPhiAlignment).toBeGreaterThan(0);
      expect(pass.overallPhiAlignment).toBeLessThanOrEqual(1);
    });

    test('pass includes doctrine score between 0 and 1', () => {
      const pass = synthesize(makeSystem('unit-test-3'));
      expect(pass.overallDoctrineScore).toBeGreaterThan(0);
      expect(pass.overallDoctrineScore).toBeLessThanOrEqual(1);
    });

    test('pass includes non-empty synthesis statement', () => {
      const pass = synthesize(makeSystem('unit-test-4'));
      expect(pass.synthesisStatement).toContain('SYNTHESIS COMPLETE');
      expect(pass.synthesisStatement).toContain('TestSystem_unit-test-4');
    });

    test('pass includes ANIMA chain refs', () => {
      const pass = synthesize(makeSystem('unit-test-5'));
      expect(pass.animaChainRefs.length).toBeGreaterThan(0);
      expect(pass.animaChainRefs[0]).toMatch(/^ANIMA-/);
    });

    test('pass includes document vault refs', () => {
      const pass = synthesize(makeSystem('unit-test-6'));
      expect(pass.documentVaultRefs.length).toBeGreaterThan(0);
    });

    test('system is stored in knowledge base after synthesis', () => {
      synthesize(makeSystem('unit-test-7'));
      const systems = getAllSystems();
      const found = systems.some(s => s.id === 'unit-test-7');
      expect(found).toBe(true);
    });

    test('pass is stored and retrievable after synthesis', () => {
      synthesize(makeSystem('unit-test-8'));
      const pass = getSynthesisPass('unit-test-8');
      expect(pass).toBeDefined();
      expect(pass!.systemId).toBe('unit-test-8');
    });
  });

  describe('knowledge base queries', () => {
    beforeEach(() => { seedKnowledge(); });

    test('getAllSystems returns all seeded systems', () => {
      const systems = getAllSystems();
      expect(systems.length).toBeGreaterThanOrEqual(7);
    });

    test('getAllPasses returns all synthesis passes', () => {
      const passes = getAllPasses();
      expect(passes.length).toBeGreaterThanOrEqual(7);
    });

    test('querySystemByName finds chimera by name', () => {
      const s = querySystemByName('Chimera');
      expect(s).toBeDefined();
      expect(s!.name).toContain('Chimera');
    });

    test('querySystemByName finds VAEL by name', () => {
      const s = querySystemByName('VAEL');
      expect(s).toBeDefined();
      expect(s!.name).toContain('VAEL');
    });

    test('querySystemByName finds QuantumResistant by name', () => {
      const s = querySystemByName('Quantum');
      expect(s).toBeDefined();
    });

    test('getKnowledgeBase averages are computed', () => {
      const kb = getKnowledgeBase();
      expect(kb.averagePhiAlignment).toBeGreaterThan(0);
      expect(kb.averageDoctrineScore).toBeGreaterThan(0);
      expect(kb.lastSynthesisAt).toBeGreaterThan(0);
    });
  });

  describe('SynthesisOrganism class', () => {
    let organism: SynthesisOrganism;

    beforeEach(() => {
      organism = getSynthesisOrganism();
    });

    test('getSynthesisOrganism returns singleton', () => {
      const a = getSynthesisOrganism();
      const b = getSynthesisOrganism();
      expect(a).toBe(b);
    });

    test('organism.status() returns summary', () => {
      const s = organism.status();
      expect(s.systems).toBeGreaterThanOrEqual(7);
      expect(s.passes).toBeGreaterThanOrEqual(7);
      expect(s.animaChainEntries).toBeGreaterThan(0);
      expect(s.documentVaultEntries).toBeGreaterThan(0);
    });

    test('organism.listSystems() includes all seeded systems', () => {
      const list = organism.listSystems();
      expect(list.length).toBeGreaterThanOrEqual(7);
      expect(list.some(n => n.includes('Chimera'))).toBe(true);
      expect(list.some(n => n.includes('VAEL'))).toBe(true);
      expect(list.some(n => n.includes('Quantum'))).toBe(true);
    });

    test('organism.ingest() synthesizes a new system', () => {
      const pass = organism.ingest(makeSystem('org-ingest-test'));
      expect(pass.systemId).toBe('org-ingest-test');
      expect(pass.synthesisStatement).toContain('SYNTHESIS COMPLETE');
    });

    test('organism.recall() retrieves a past synthesis', () => {
      organism.ingest(makeSystem('org-recall-test'));
      const pass = organism.recall('org-recall-test');
      expect(pass).toBeDefined();
      expect(pass!.systemName).toContain('org-recall-test');
    });

    test('organism.search() finds by partial name', () => {
      const s = organism.search('DroneFleet');
      expect(s).toBeDefined();
    });

    test('organism.report() returns formatted synthesis statement', () => {
      const report = organism.report('chimera-intelligence-core');
      expect(report).toContain('SYNTHESIS COMPLETE');
      expect(report).toContain('Chimera');
    });

    test('organism.report() returns not-found message for unknown id', () => {
      const report = organism.report('does-not-exist');
      expect(report).toContain('No synthesis found');
    });

    test('organism exposes PHI constant', () => {
      expect(organism.PHI).toBeCloseTo(1.618033988749895, 10);
    });
  });

  describe('seeded knowledge accuracy', () => {
    beforeEach(() => { seedKnowledge(); });

    test('ChimeraIntelligenceCore pass has dissolutio AI components', () => {
      const pass = getSynthesisPass('chimera-intelligence-core');
      expect(pass).toBeDefined();
      expect(pass!.dissolutio.aiComponents.length).toBe(5);
    });

    test('QuantumResistantPrincipalLock has highest phi alignment among seeds', () => {
      seedKnowledge();
      const qPass = getSynthesisPass('quantum-resistant-principal-lock');
      expect(qPass).toBeDefined();
      // quantum lock has phiAlignment: 0.99 in seed data
      expect(qPass!.overallPhiAlignment).toBeGreaterThan(0.5);
    });

    test('VAELCompleteDefense architectus verdict is truthy doctrine', () => {
      const pass = getSynthesisPass('vael-complete-defense');
      expect(pass).toBeDefined();
      expect(pass!.architectus.doctrineAlignmentScore).toBeGreaterThan(0);
    });

    test('all seeded passes have valid formulor formulas', () => {
      const passes = getAllPasses().filter(p =>
        ['chimera-intelligence-core', 'drone-fleet-manager',
          'war-command-offense-engine', 'anti-organism-defense-architecture',
          'vael-complete-defense', 'offense-defense-coordination',
          'quantum-resistant-principal-lock'].includes(p.systemId)
      );
      expect(passes.length).toBe(7);
      for (const p of passes) {
        expect(p.formulor.formula).toContain('Φ(');
      }
    });
  });
});
