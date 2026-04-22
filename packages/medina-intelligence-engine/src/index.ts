// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * @itsnotailabs/intelligence-engine
 * ─────────────────────────────────────────────────────────────────────────
 * Multi-modal intelligence engine for sovereign AI systems.
 *
 * INCLUDES:
 *   - Token Economy (5 transformers, 5 models, 30 uses, CPL compiler)
 *   - Voting Bill (3 governance engines: Simple, Weighted, Sovereign)
 *   - Intelligence Contracts (full lifecycle: propose → bind → execute → audit)
 *
 * This is a LIVING PACKAGE — it carries organism metadata and self-documents.
 */

export { TokenEconomy, CPLCompiler } from '../../../src/organism/intelligence/TokenEconomy';
export { SimpleTokenVoting, WeightedTokenVoting, SovereignTokenVoting } from '../../../src/organism/intelligence/VotingBill';

export const PACKAGE_ORGANISM = {
  name: '@itsnotailabs/intelligence-engine',
  latinName: 'Machina Intelligentiae',
  version: '1.0.0',
  class: 'PACKAGE.SOVEREIGN',
  livingDocument: true,
  transformers: ['CONTRACTUS', 'VALUATOR', 'EXECUTOR', 'AUDITOR', 'ARBITER'],
  models: ['PACTUM', 'PRETIUM', 'NEXUS', 'FIDES', 'MEMORIA'],
  engines: ['SimpleTokenVoting', 'WeightedTokenVoting', 'SovereignTokenVoting'],
  uses: 30,
  cost: {
    contractCreation: '$0.005',
    contractExecution: '$0.02',
    votingSimple: '5 tokens/bill',
    votingWeighted: '15 tokens/bill',
    votingSovereign: '50 tokens/bill',
  },
};
