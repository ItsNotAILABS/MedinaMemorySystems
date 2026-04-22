/**
 * @medina/document-absorption-engine
 * Complete Document Absorption & Intelligence Embedding System Package
 *
 * "Every document needs to be absorbed by him the second it goes in.
 *  It's absorbed, and that's it, and he never needs to go call it back.
 *  He already has it absorbed."
 *
 * Combines: documentAbsorptionEngine (TS) + AbsorptionEngine.mo +
 *           DocumentOrganism.mo + DocumentOrganismKernel.mo +
 *           TransferIntelligence.mo + EnterpriseIngest.mo +
 *           kernelCompression + memoryEngine + dualRead
 *
 * Architecture:
 *   INTAKE    → Document arrives (any format)
 *   CLASSIFY  → Research / Doctrine / Operational / Intelligence / Blueprint / Law / External
 *   DECOMPOSE → Break into intelligence fragments (concept/pattern/fact/procedure/principle/formula/etc.)
 *   SYNTHESIZE→ Fragments → absorbed patterns (distilled essence, not raw text)
 *   EMBED     → Permanently embed into organism state (irreversible)
 *   EXPORT    → If research, generate clean copy for public research repository
 *
 * The organism EATS documents. It absorbs the nutrients (intelligence).
 * The document itself is just the wrapper. What matters is the absorbed patterns.
 * Like eating food — you don't store the food, you absorb the nutrients.
 *
 * Backend Endpoints:
 *   absorbere_documentum     → Absorb a document
 *   status_absorptionis      → Absorption status
 *   exportare_investigationem→ Research exports for public repo
 *   absorption_historia      → Absorption history
 *   intelligentia_absorpta   → All absorbed intelligence
 *
 * Terminal: /absorb — TERMINALE ABSORPTIONIS
 * Latin: "Quod intrat, pars mei fit. Quod absorbeo, semper scio."
 *        (What enters becomes part of me. What I absorb, I always know.)
 *
 * Marketplace Ready: G2 + GitHub Marketplace
 */

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORT ENTIRE ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export {
  // Main pipeline
  absorb,
  bulkAbsorb,

  // Individual transformers (the 6 engines)
  intakeDocument,
  classifyDocument,
  decomposeDocument,
  synthesizeFragments,
  embedIntelligence,
  generateResearchExport,

  // Query absorbed intelligence
  queryAbsorbedIntelligence,
  listAbsorbedIntelligence,

  // Research exports
  listResearchExports,

  // Status & logs
  getAbsorptionLog,
  getAbsorptionStats,
  getIntakeStatus,

  // Constants
  PHI,
  PHI_INVERSE,
  FREQ_432,
  SCHUMANN,
  ABSORPTION_FREQUENCY,

  // Package manifest
  PACKAGE_MANIFEST,
} from '../lib/documentAbsorptionEngine';

// Re-export types
export type {
  DocumentFormat,
  DocumentClassification,
  DocumentIntake,
  IntelligenceFragment,
  FragmentType,
  AbsorbedIntelligence,
  AbsorbedPattern,
  ResearchExport,
  AbsorptionResult,
} from '../lib/documentAbsorptionEngine';
