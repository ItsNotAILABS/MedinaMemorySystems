// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
/**
 * @itsnotailabs/substrate-os
 * ─────────────────────────────────────────────────────────────────────────
 * Multi-modal substrate operating system for sovereign deployment.
 *
 * INCLUDES:
 *   - 20 Multi-Identity Technologies (organism generation, canister forge, etc.)
 *   - Organism Generator (template → seed → canister → substrate)
 *   - Spinal Cord Bus (cross-identity shared memory backbone)
 *   - 5 Deployment Substrates (ICP, Web, Quantum, Encryption, Hybrid)
 *
 * This is a LIVING PACKAGE — it carries organism metadata and self-documents.
 */

export { MultiIdentityManager, OrganismGenerator, SpinalCordBus } from '../../../src/organism/intelligence/MultiIdentity';
export { AnimaRuntime } from '../../../src/organism/os/MedinaRuntime';

export const PACKAGE_ORGANISM = {
  name: '@itsnotailabs/substrate-os',
  latinName: 'Systema Operandi Substrati',
  version: '1.0.0',
  class: 'PACKAGE.SOVEREIGN',
  livingDocument: true,
  technologies: 20,
  substrates: ['ICP_BLOCKCHAIN', 'WEB', 'DEEP_QUANTUM', 'ENCRYPTION_MODEL', 'HYBRID'],
  engines: ['PersonaEngine', 'SubstrateEngine', 'CanisterEngine'],
  transformers: ['IdentityTransformer', 'SubstrateTransformer', 'SeedTransformer'],
  cost: {
    identityCreation: '$0.01',
    canisterForge: '$0.05',
    seedCompile: '$0.03',
    substrateDeployment: '$0.10 per substrate',
    spinalCordAccess: '$0.001 per read/write',
  },
};
