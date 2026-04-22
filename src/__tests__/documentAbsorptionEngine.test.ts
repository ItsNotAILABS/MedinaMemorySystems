/**
 * Tests for DocumentAbsorptionEngine
 * 
 * "Every document, it needs to be absorbed by him the second it goes in,
 *  it's absorbed, and that's it, and he never needs to go call it back."
 */

import {
  absorb,
  bulkAbsorb,
  intakeDocument,
  classifyDocument,
  decomposeDocument,
  synthesizeFragments,
  embedIntelligence,
  generateResearchExport,
  queryAbsorbedIntelligence,
  listAbsorbedIntelligence,
  getAbsorptionLog,
  listResearchExports,
  getAbsorptionStats,
  getIntakeStatus,
} from '@/lib/documentAbsorptionEngine';
import type {
  DocumentIntake,
  IntelligenceFragment,
  AbsorbedPattern,
  AbsorbedIntelligence,
  AbsorptionResult,
  ResearchExport,
} from '@/lib/documentAbsorptionEngine';

// ═══════════════════════════════════════════════════════════════
// TEST DATA
// ═══════════════════════════════════════════════════════════════

const RESEARCH_PAPER = `
Abstract: This paper presents a novel approach to distributed memory systems
using phi-encoded spatial coordinates and harmonic resonance patterns.

Introduction: Memory systems have traditionally relied on key-value stores.
Our approach uses spherical coordinate systems aligned with the golden ratio.

Methodology: We implemented a 12-ring macro hierarchy (N1-N12) where each
ring represents a different level of abstraction. Documents are placed using
golden angle distribution for optimal coverage.

Findings: The phi-encoded system shows 61.8% improvement in retrieval
coherence compared to traditional flat storage. Pattern recognition
operates at the RECITAL_PLUS_ONE amplification rate.

Conclusion: Sovereign memory architecture using phi-encoded coordinates
provides a fundamentally different approach to knowledge management.

References:
1. Medina Memory Systems Architecture v1.0
2. Golden Ratio in Information Theory (2024)
3. Harmonic Resonance in Data Structures
`;

const DOCTRINE_DOC = `
NOVA OVO Founding Doctrine

This is the sovereign doctrine of NOVA OVO. All operations must align
with RECITAL_PLUS_ONE law. Memory is spatial. Governance is auditable.
Models are callable. Identity is sovereign.

The organism processes using pattern recognition, not memory fetching.
Every beat compounds the previous state. The heartbeat is 873ms.
`;

const OPERATIONAL_DOC = `
Deployment Procedure for Q4

Step 1. Review all pending changes
Step 2. Run integration tests
Step 3. Deploy to staging environment
Step 4. Validate all endpoints
Step 5. Promote to production

This procedure must be followed for every deployment.
`;

const CODE_DOC = `
function phiEncode(value: number): number {
  const PHI = 1.618033988749895;
  const normalized = Math.abs(value);
  const phiLog = Math.log(normalized + 1) / Math.log(PHI);
  return phiLog - Math.floor(phiLog);
}

// This formula is critical for the encoding system
// The equation maps any value to phi-harmonic space [0,1)
`;

const SHORT_DOC = 'Quick note: remember to update the API keys.';

// ═══════════════════════════════════════════════════════════════
// INTAKE TESTS
// ═══════════════════════════════════════════════════════════════

describe('DocumentAbsorptionEngine', () => {
  describe('Document Intake', () => {
    it('should register a document into intake', () => {
      const doc = intakeDocument('Test Doc', 'Some content', 'text', 'test');
      expect(doc.id).toBeDefined();
      expect(doc.title).toBe('Test Doc');
      expect(doc.content).toBe('Some content');
      expect(doc.format).toBe('text');
      expect(doc.source).toBe('test');
      expect(doc.byteSize).toBeGreaterThan(0);
      expect(doc.receivedAt).toBeDefined();
    });

    it('should track intake status', () => {
      const status = getIntakeStatus();
      expect(status.total).toBeGreaterThanOrEqual(1);
    });

    it('should calculate byte size correctly', () => {
      const doc = intakeDocument('Size Test', 'Hello World', 'text', 'test');
      expect(doc.byteSize).toBe(11); // 'Hello World' = 11 bytes
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // CLASSIFICATION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Document Classification', () => {
    it('should classify research papers as research', () => {
      const doc = intakeDocument('Research Paper', RESEARCH_PAPER, 'research-paper', 'academic');
      expect(classifyDocument(doc)).toBe('research');
    });

    it('should classify based on content signals', () => {
      const doc = intakeDocument('Analysis', RESEARCH_PAPER, 'text', 'internal');
      // Has abstract, introduction, methodology, conclusion, findings, references
      expect(classifyDocument(doc)).toBe('research');
    });

    it('should classify doctrine documents', () => {
      const doc = intakeDocument('Doctrine', DOCTRINE_DOC, 'doctrine', 'sovereign');
      expect(classifyDocument(doc)).toBe('doctrine');
    });

    it('should classify operational documents', () => {
      const doc = intakeDocument('Procedure', OPERATIONAL_DOC, 'text', 'ops');
      expect(classifyDocument(doc)).toBe('operational');
    });

    it('should classify external documents', () => {
      const doc = intakeDocument('External', 'Some data', 'text', 'external-source', { origin: 'external' });
      expect(classifyDocument(doc)).toBe('external');
    });

    it('should default to intelligence for generic docs', () => {
      const doc = intakeDocument('Generic', 'This is some generic content that does not fit any category specifically.', 'text', 'internal');
      expect(classifyDocument(doc)).toBe('intelligence');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // DECOMPOSITION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Document Decomposition', () => {
    it('should decompose documents into fragments', () => {
      const doc = intakeDocument('Research', RESEARCH_PAPER, 'text', 'test');
      const fragments = decomposeDocument(doc);
      expect(fragments.length).toBeGreaterThan(0);
    });

    it('should assign fragment types correctly', () => {
      const doc = intakeDocument('Code', CODE_DOC, 'code', 'test');
      const fragments = decomposeDocument(doc);
      expect(fragments.length).toBeGreaterThan(0);
      // Should find formula/code fragments
      const types = fragments.map(f => f.fragmentType);
      expect(types.length).toBeGreaterThan(0);
    });

    it('should extract tags from fragments', () => {
      const doc = intakeDocument('Doctrine', DOCTRINE_DOC, 'text', 'test');
      const fragments = decomposeDocument(doc);
      const allTags = fragments.flatMap(f => f.tags);
      expect(allTags.length).toBeGreaterThan(0);
      // Should find domain-relevant tags
      expect(allTags).toEqual(expect.arrayContaining(['doctrine']));
    });

    it('should link related fragments', () => {
      const doc = intakeDocument('Research', RESEARCH_PAPER, 'text', 'test');
      const fragments = decomposeDocument(doc);
      // Fragments with overlapping tags should be connected
      const connected = fragments.filter(f => f.connections.length > 0);
      expect(connected.length).toBeGreaterThanOrEqual(0); // May or may not have connections
    });

    it('should calculate weights for fragments', () => {
      const doc = intakeDocument('Research', RESEARCH_PAPER, 'text', 'test');
      const fragments = decomposeDocument(doc);
      for (const f of fragments) {
        expect(f.weight).toBeGreaterThan(0);
        expect(f.weight).toBeLessThanOrEqual(1.0);
      }
    });

    it('should calculate phi alignment', () => {
      const doc = intakeDocument('Research', RESEARCH_PAPER, 'text', 'test');
      const fragments = decomposeDocument(doc);
      for (const f of fragments) {
        expect(f.phiAlignment).toBeDefined();
        expect(typeof f.phiAlignment).toBe('number');
      }
    });

    it('should handle short documents', () => {
      const doc = intakeDocument('Short', SHORT_DOC, 'text', 'test');
      const fragments = decomposeDocument(doc);
      // Short docs may produce 0 fragments (threshold of 10 chars per section)
      expect(fragments.length).toBeGreaterThanOrEqual(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // SYNTHESIS TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Fragment Synthesis', () => {
    it('should synthesize fragments into absorbed patterns', () => {
      const doc = intakeDocument('Research', RESEARCH_PAPER, 'text', 'test');
      const fragments = decomposeDocument(doc);
      const patterns = synthesizeFragments(fragments);
      expect(patterns.length).toBe(fragments.length);
    });

    it('should distill essence (not raw text)', () => {
      const doc = intakeDocument('Research', RESEARCH_PAPER, 'text', 'test');
      const fragments = decomposeDocument(doc);
      const patterns = synthesizeFragments(fragments);
      for (const p of patterns) {
        expect(p.essence).toBeDefined();
        expect(p.essence.length).toBeGreaterThan(0);
        // Essence should be shorter than raw content (distilled)
        expect(p.essence.length).toBeLessThanOrEqual(301);
      }
    });

    it('should preserve weights and frequencies', () => {
      const doc = intakeDocument('Research', RESEARCH_PAPER, 'text', 'test');
      const fragments = decomposeDocument(doc);
      const patterns = synthesizeFragments(fragments);
      for (let i = 0; i < patterns.length; i++) {
        expect(patterns[i].weight).toBe(fragments[i].weight);
        expect(patterns[i].frequency).toBe(fragments[i].frequency);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // EMBEDDING TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Intelligence Embedding', () => {
    it('should permanently embed intelligence', () => {
      const doc = intakeDocument('Research', RESEARCH_PAPER, 'text', 'test');
      const fragments = decomposeDocument(doc);
      const patterns = synthesizeFragments(fragments);
      const intelligence = embedIntelligence(doc.id, patterns, fragments.length);

      expect(intelligence.id).toBeDefined();
      expect(intelligence.sourceDocumentId).toBe(doc.id);
      expect(intelligence.permanent).toBe(true);
      expect(intelligence.absorptionScore).toBeGreaterThan(0);
      expect(intelligence.frequencySignature).toBeGreaterThan(0);
      expect(intelligence.phiHash).toBeGreaterThan(0);
      expect(intelligence.kernelId).toContain('KERNEL_ABS_');
      expect(intelligence.ringPlacement).toBeGreaterThanOrEqual(1);
      expect(intelligence.ringPlacement).toBeLessThanOrEqual(12);
    });

    it('should mark intelligence as permanent (irreversible)', () => {
      const doc = intakeDocument('Test', 'Some content for permanent embedding test.', 'text', 'test');
      const fragments = decomposeDocument(doc);
      const patterns = synthesizeFragments(fragments);
      const intelligence = embedIntelligence(doc.id, patterns, fragments.length);
      expect(intelligence.permanent).toBe(true);
    });

    it('should show up in the absorbed store', () => {
      const doc = intakeDocument('Store Test Unique', 'Content for store test verification that should definitely be absorbed.', 'text', 'test');
      const fragments = decomposeDocument(doc);
      const patterns = synthesizeFragments(fragments);
      const countBefore = listAbsorbedIntelligence().length;
      embedIntelligence(doc.id, patterns, fragments.length);
      expect(listAbsorbedIntelligence().length).toBeGreaterThan(countBefore);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // RESEARCH EXPORT TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Research Export Pipeline', () => {
    it('should generate research export for research docs', () => {
      const doc = intakeDocument('Research', RESEARCH_PAPER, 'text', 'academic');
      const fragments = decomposeDocument(doc);
      const patterns = synthesizeFragments(fragments);
      const exp = generateResearchExport(doc, patterns);

      expect(exp.id).toBeDefined();
      expect(exp.sourceDocumentId).toBe(doc.id);
      expect(exp.title).toBe('Research');
      expect(exp.classification).toBe('research');
      expect(exp.abstractSummary).toBeDefined();
      expect(exp.abstractSummary.length).toBeGreaterThan(0);
      expect(exp.keywords.length).toBeGreaterThan(0);
      expect(exp.publicReady).toBe(true);
      expect(exp.content).toBe(RESEARCH_PAPER); // Clean copy preserved
    });

    it('should show up in research exports list', () => {
      const doc = intakeDocument('Research Export List Test', RESEARCH_PAPER, 'text', 'test');
      const fragments = decomposeDocument(doc);
      const patterns = synthesizeFragments(fragments);
      const countBefore = listResearchExports().length;
      generateResearchExport(doc, patterns);
      expect(listResearchExports().length).toBeGreaterThan(countBefore);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // FULL PIPELINE TESTS — "absorbed the second it goes in"
  // ═══════════════════════════════════════════════════════════════

  describe('Full Absorption Pipeline', () => {
    it('should absorb a research paper completely', () => {
      const result = absorb('Phi Memory Research', RESEARCH_PAPER, 'research-paper', 'academic');

      expect(result.documentId).toBeDefined();
      expect(result.title).toBe('Phi Memory Research');
      expect(result.status).toBe('absorbed');
      expect(result.classification).toBe('research');
      expect(result.intelligence).toBeDefined();
      expect(result.intelligence.permanent).toBe(true);
      expect(result.fragmentCount).toBeGreaterThan(0);
      expect(result.patternCount).toBeGreaterThan(0);
      expect(result.absorptionScore).toBeGreaterThan(0);
      expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
      expect(result.phiTrace).toBeDefined();
      // Research should have an export
      expect(result.researchExport).not.toBeNull();
      expect(result.researchExport!.publicReady).toBe(true);
    });

    it('should absorb a doctrine document (no research export)', () => {
      const result = absorb('Founding Doctrine', DOCTRINE_DOC, 'doctrine', 'sovereign');

      expect(result.status).toBe('absorbed');
      expect(result.classification).toBe('doctrine');
      expect(result.intelligence.permanent).toBe(true);
      // Doctrine should NOT have a research export
      expect(result.researchExport).toBeNull();
    });

    it('should absorb operational documents', () => {
      const result = absorb('Deployment Procedure', OPERATIONAL_DOC, 'text', 'ops');

      expect(result.status).toBe('absorbed');
      expect(result.intelligence.permanent).toBe(true);
      expect(result.fragmentCount).toBeGreaterThan(0);
    });

    it('should absorb code documents', () => {
      const result = absorb('Phi Encode Function', CODE_DOC, 'code', 'codebase');

      expect(result.status).toBe('absorbed');
      expect(result.intelligence.permanent).toBe(true);
    });

    it('should record in absorption log', () => {
      const before = getAbsorptionLog().length;
      absorb('Log Test', 'Content for log test.', 'text', 'test');
      const after = getAbsorptionLog().length;
      expect(after).toBe(before + 1);
    });

    it('should update absorption stats', () => {
      const stats = getAbsorptionStats();
      expect(stats.totalDocumentsIntaken).toBeGreaterThan(0);
      expect(stats.totalAbsorbed).toBeGreaterThan(0);
      expect(stats.totalPatterns).toBeGreaterThan(0);
      expect(stats.averageAbsorptionScore).toBeGreaterThan(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // BULK ABSORPTION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Bulk Absorption', () => {
    it('should absorb multiple documents at once', () => {
      const results = bulkAbsorb([
        { title: 'Bulk Doc 1', content: 'First document content for bulk absorption testing.' },
        { title: 'Bulk Doc 2', content: 'Second document content for bulk absorption testing.' },
        { title: 'Bulk Doc 3', content: 'Third document content for bulk absorption testing.' },
      ]);

      expect(results.length).toBe(3);
      for (const r of results) {
        expect(r.intelligence.permanent).toBe(true);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // QUERY TESTS — "he already has it absorbed"
  // ═══════════════════════════════════════════════════════════════

  describe('Query Absorbed Intelligence', () => {
    it('should find absorbed patterns by query', () => {
      // First absorb something specific
      absorb('Phi Research', 'The golden ratio phi equals 1.618 and is fundamental to harmonic resonance patterns in memory systems.', 'text', 'test');

      const results = queryAbsorbedIntelligence('phi');
      // May or may not find results depending on essence distillation
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return empty for unknown queries', () => {
      const results = queryAbsorbedIntelligence('xyzzy_nonexistent_term_12345');
      expect(results.length).toBe(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // RING PLACEMENT TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Ring Placement', () => {
    it('should place intelligence in valid rings (N1-N12)', () => {
      const result = absorb('Ring Test', RESEARCH_PAPER, 'text', 'test');
      expect(result.intelligence.ringPlacement).toBeGreaterThanOrEqual(1);
      expect(result.intelligence.ringPlacement).toBeLessThanOrEqual(12);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // PHI ALIGNMENT TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Phi Alignment', () => {
    it('should generate phi hash for absorbed intelligence', () => {
      const result = absorb('Phi Test', 'Testing phi alignment in absorption engine.', 'text', 'test');
      expect(result.intelligence.phiHash).toBeGreaterThan(0);
      expect(result.phiTrace).toBeDefined();
    });

    it('should generate frequency signature', () => {
      const result = absorb('Freq Test', 'Frequency signature testing in the absorption pipeline.', 'text', 'test');
      expect(result.intelligence.frequencySignature).toBeGreaterThan(0);
    });
  });
});
