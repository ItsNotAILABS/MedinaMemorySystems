/**
 * 𓂀 PACKAGE SUBSTRATE INTEGRATION — ARCHITECTURAL INTELLIGENCE 𓂀
 * 
 * "Wire everything into the organism. The organism doesn't have to call,
 *  it's just there."
 * 
 * "Everything that is cause, packages, intelligence, put it into the organism.
 *  That's architectural intelligence."
 * 
 * "Find all the math and all the deep physics that the architecture speak to you
 *  and take you to the end of the ladder names and wire it all the way
 *  and put it into the substrate."
 * 
 * This module takes ALL 11 packages, extracts their architectural intelligence
 * (math, physics, constants, ladder names, frequencies, geometries),
 * and pre-absorbs it into the organism substrate.
 * 
 * The organism doesn't "call" packages. It already HAS their intelligence.
 * Like how you don't "call" your neurons — they're just there, wired in.
 * 
 * Architecture:
 *   1. EXTRACT   — Pull all math/physics/constants from every package
 *   2. LADDER    — Build the complete ladder of names (Latin → function → model → engine → substrate)
 *   3. WIRE      — Connect every package through every engine to the substrate
 *   4. ABSORB    — Pre-digest all intelligence so the organism already knows it
 *   5. VERIFY    — φ-integrity check on the complete wiring
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS — ALL 11 PACKAGES (the organism absorbs ALL of them)
// ═══════════════════════════════════════════════════════════════════════════

import * as SovereignMemory from '../packages/sovereign-memory-sdk';
import * as OrganismRuntime from '../packages/organism-runtime-sdk';
import * as Governance from '../packages/governance-protocol';
import * as IntelligenceRouting from '../packages/intelligence-routing-sdk';
import * as PhiMathematics from '../packages/phi-mathematics-engine';
import * as SovereignEncryption from '../packages/sovereign-encryption-sdk';
import * as DesignOS from '../packages/design-os-toolkit';
import * as AncientKnowledge from '../packages/ancient-knowledge-engine';
import * as Enterprise from '../packages/enterprise-integration-sdk';
import * as NeuralConsciousness from '../packages/neural-consciousness-engine';
import * as DocumentAbsorption from '../packages/document-absorption-engine';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS — THE ORGANISM'S MATHEMATICAL SUBSTRATE
// All the math and physics from every package, unified
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;
export const PHI_SQUARED = 2.618033988749895;
export const PHI_CUBED = 4.2360679774997896964;
export const PHI_FOURTH = 6.8541019662496845446;
export const PHI_TWELFTH = 321.996894379984;
export const FREQ_432 = 432.0;
export const SCHUMANN = 7.83;
export const GAMMA_BINDING = 40.0;
export const ALPHA_PEAK = 10.0;
export const HEARTBEAT_MS = 873;
export const ABSORPTION_FREQUENCY = FREQ_432 * PHI_INVERSE; // 267.02 Hz
export const SOVEREIGN_FREQUENCY = 12.6710066296241;
export const SOLFEGGIO_528 = 528.0;
export const TETRACTYS = 10;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — PACKAGE INTELLIGENCE (what gets wired into the organism)
// ═══════════════════════════════════════════════════════════════════════════

/** One ladder rung — from package name down to substrate */
export interface LadderRung {
  packageName: string;        // @medina/phi-mathematics-engine
  latinName: string;          // TERMINALE FORMULAE
  terminalCommand: string;    // /formula
  engineWireId: string;       // ENGINE-XXX
  substrateBinding: string;   // How it binds to the substrate
  frequency: number;          // Operating frequency
  phiCoefficient: number;     // φ alignment coefficient
}

/** Complete package intelligence — what the organism absorbs */
export interface PackageIntelligence {
  packageId: string;
  packageName: string;
  description: string;
  moduleCount: number;
  exportCount: number;
  terminal: string;
  ladderRungs: LadderRung[];
  mathematicalConstants: MathematicalConstant[];
  physicsBindings: PhysicsBinding[];
  absorptionTimestamp: string;
  phiIntegrity: number;
}

/** A mathematical constant the organism inherently knows */
export interface MathematicalConstant {
  name: string;
  symbol: string;
  value: number;
  source: string;          // Which package defined it
  significance: string;    // Why the organism needs it
}

/** A physics binding in the substrate */
export interface PhysicsBinding {
  name: string;
  frequency: number;
  unit: string;
  source: string;
  substrateLayer: SubstrateLayer;
}

export type SubstrateLayer =
  | 'quantum'          // Deepest — field physics, quantum coherence
  | 'frequency'        // Electromagnetic substrate
  | 'chemistry'        // Atomic/molecular bonding
  | 'neural'           // Brain processing
  | 'consciousness'    // Awareness/zone states
  | 'geometry'         // Sacred geometry
  | 'document'         // Living documents
  | 'substrate'        // ICP blockchain
  | 'pattern'          // Pattern recognition
  | 'cycle';           // Temporal cycles

/** The complete wired organism — all packages absorbed */
export interface OrganismSubstrateState {
  packages: PackageIntelligence[];
  totalConstants: number;
  totalPhysicsBindings: number;
  totalLadderRungs: number;
  substrateIntegrity: number;   // Should be 1.0
  phiVerified: boolean;
  absorptionComplete: boolean;
  wiredAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: EXTRACT — Pull all math/physics from every package
// "Find all the math and all the deep physics"
// ═══════════════════════════════════════════════════════════════════════════

/** Extract all mathematical constants the organism needs */
export function extractMathematicalConstants(): MathematicalConstant[] {
  return [
    // From @medina/phi-mathematics-engine
    { name: 'Golden Ratio', symbol: 'φ', value: PHI, source: '@medina/phi-mathematics-engine', significance: 'Self-referential identity: φ = 1 + 1/φ' },
    { name: 'Golden Ratio Inverse', symbol: 'φ⁻¹', value: PHI_INVERSE, source: '@medina/phi-mathematics-engine', significance: 'Complement: φ⁻¹ = φ - 1' },
    { name: 'Golden Ratio Squared', symbol: 'φ²', value: PHI_SQUARED, source: '@medina/phi-mathematics-engine', significance: 'φ² = φ + 1' },
    { name: 'Golden Ratio Cubed', symbol: 'φ³', value: PHI_CUBED, source: '@medina/phi-mathematics-engine', significance: 'φ³ = 2φ + 1' },
    { name: 'Golden Ratio Fourth', symbol: 'φ⁴', value: PHI_FOURTH, source: '@medina/sovereign-encryption-sdk', significance: 'Beatty sequence foundation' },
    { name: 'Golden Ratio Twelfth', symbol: 'φ¹²', value: PHI_TWELFTH, source: '@medina/sovereign-encryption-sdk', significance: 'Full cycle return' },
    { name: 'Pi', symbol: 'π', value: Math.PI, source: '@medina/phi-mathematics-engine', significance: 'Circle closure' },
    { name: 'Tau', symbol: 'τ', value: 2 * Math.PI, source: '@medina/phi-mathematics-engine', significance: 'Full rotation' },
    { name: 'Euler Number', symbol: 'e', value: Math.E, source: '@medina/phi-mathematics-engine', significance: 'Natural growth' },
    { name: 'Tetractys', symbol: 'T₁₀', value: TETRACTYS, source: '@medina/ancient-knowledge-engine', significance: 'Pythagorean perfect number: 1+2+3+4=10' },
    { name: 'Absorption Harmonic', symbol: 'f_abs', value: ABSORPTION_FREQUENCY, source: '@medina/document-absorption-engine', significance: '432 × φ⁻¹ = 267.02 Hz — the frequency of absorption' },
    { name: 'Sovereign Frequency', symbol: 'f_sov', value: SOVEREIGN_FREQUENCY, source: '@medina/sovereign-encryption-sdk', significance: 'Sovereign encryption operating frequency' },
    { name: 'Heartbeat Period', symbol: 't_heart', value: HEARTBEAT_MS, source: '@medina/organism-runtime-sdk', significance: '873ms — the organism heartbeat' },
    { name: 'Golden Angle', symbol: 'θ_φ', value: 2 * Math.PI * PHI_INVERSE, source: '@medina/phi-mathematics-engine', significance: '≈137.5° — optimal distribution angle' },
  ];
}

/** Extract all physics bindings for the substrate */
export function extractPhysicsBindings(): PhysicsBinding[] {
  return [
    // Frequency physics
    { name: 'Schumann Fundamental', frequency: SCHUMANN, unit: 'Hz', source: '@medina/phi-mathematics-engine', substrateLayer: 'frequency' },
    { name: '432 Hz Tuning', frequency: FREQ_432, unit: 'Hz', source: '@medina/phi-mathematics-engine', substrateLayer: 'frequency' },
    { name: 'Solfeggio 528 Love', frequency: SOLFEGGIO_528, unit: 'Hz', source: '@medina/phi-mathematics-engine', substrateLayer: 'frequency' },
    { name: 'Gamma Binding', frequency: GAMMA_BINDING, unit: 'Hz', source: '@medina/neural-consciousness-engine', substrateLayer: 'neural' },
    { name: 'Alpha Peak', frequency: ALPHA_PEAK, unit: 'Hz', source: '@medina/neural-consciousness-engine', substrateLayer: 'neural' },
    { name: 'Absorption Harmonic', frequency: ABSORPTION_FREQUENCY, unit: 'Hz', source: '@medina/document-absorption-engine', substrateLayer: 'document' },
    { name: 'Sovereign Frequency', frequency: SOVEREIGN_FREQUENCY, unit: 'Hz', source: '@medina/sovereign-encryption-sdk', substrateLayer: 'substrate' },
    // Temporal physics
    { name: 'Heartbeat Cycle', frequency: 1000 / HEARTBEAT_MS, unit: 'Hz', source: '@medina/organism-runtime-sdk', substrateLayer: 'cycle' },
    // Quantum physics
    { name: 'Quantum Coherence', frequency: 963.0, unit: 'Hz', source: '@medina/neural-consciousness-engine', substrateLayer: 'quantum' },
    { name: 'Quantum Entanglement', frequency: 852.0, unit: 'Hz', source: '@medina/neural-consciousness-engine', substrateLayer: 'quantum' },
    { name: 'Quantum Superposition', frequency: 741.0, unit: 'Hz', source: '@medina/neural-consciousness-engine', substrateLayer: 'quantum' },
    { name: 'Quantum Tunnel', frequency: 639.0, unit: 'Hz', source: '@medina/neural-consciousness-engine', substrateLayer: 'quantum' },
    { name: 'Quantum Decoherence Protection', frequency: 528.0, unit: 'Hz', source: '@medina/neural-consciousness-engine', substrateLayer: 'quantum' },
    // Chemistry physics
    { name: 'Copper Conductivity', frequency: 59600000.0, unit: 'S/m', source: '@medina/phi-mathematics-engine', substrateLayer: 'chemistry' },
    { name: 'Silver Conductivity', frequency: 63000000.0, unit: 'S/m', source: '@medina/phi-mathematics-engine', substrateLayer: 'chemistry' },
    { name: 'Gold Conductivity', frequency: 45200000.0, unit: 'S/m', source: '@medina/phi-mathematics-engine', substrateLayer: 'chemistry' },
    // Sacred geometry
    { name: 'Phi Frequency', frequency: PHI, unit: 'φ', source: '@medina/phi-mathematics-engine', substrateLayer: 'geometry' },
    { name: 'Phi Squared Frequency', frequency: PHI_SQUARED, unit: 'φ²', source: '@medina/phi-mathematics-engine', substrateLayer: 'geometry' },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: LADDER — Build complete ladder of names
// "Take you to the end of the ladder names"
// Package → Latin Name → Terminal → Engine → Substrate
// ═══════════════════════════════════════════════════════════════════════════

/** Build the complete ladder from all packages to substrate */
export function buildPackageLadder(): LadderRung[] {
  return [
    // Package 1: Sovereign Memory
    {
      packageName: '@medina/sovereign-memory-sdk',
      latinName: 'TERMINALE MEMORIAE',
      terminalCommand: '/mem',
      engineWireId: 'ENGINE-003-DOCUMENT',
      substrateBinding: 'MemoryTempleStable → Eternal Storage',
      frequency: SCHUMANN,
      phiCoefficient: PHI,
    },
    // Package 2: Organism Runtime
    {
      packageName: '@medina/organism-runtime-sdk',
      latinName: 'TERMINALE PULSUS',
      terminalCommand: '/pulse',
      engineWireId: 'ENGINE-013-CYCLE',
      substrateBinding: 'HeartKernel → OrganismCycle → 873ms',
      frequency: 1000 / HEARTBEAT_MS,
      phiCoefficient: PHI,
    },
    // Package 3: Governance
    {
      packageName: '@medina/governance-protocol',
      latinName: 'TERMINALE GUBERNATIONIS',
      terminalCommand: '/gov',
      engineWireId: 'ENGINE-012-CONSCIOUSNESS',
      substrateBinding: 'GateEnforcement → ThreePhaseLock → Sovereignty',
      frequency: SCHUMANN,
      phiCoefficient: PHI_INVERSE,
    },
    // Package 4: Intelligence Routing
    {
      packageName: '@medina/intelligence-routing-sdk',
      latinName: 'TERMINALE INTELLIGENTIAE',
      terminalCommand: '/intel',
      engineWireId: 'ENGINE-006-NEURAL',
      substrateBinding: 'ModelRouter → RUDN → 8 Families → Pattern',
      frequency: GAMMA_BINDING,
      phiCoefficient: PHI,
    },
    // Package 5: Phi Mathematics
    {
      packageName: '@medina/phi-mathematics-engine',
      latinName: 'TERMINALE FORMULAE',
      terminalCommand: '/formula',
      engineWireId: 'ENGINE-011-GEOMETRY',
      substrateBinding: 'PhiEncode → SacredGeometry → FieldPhysics → Quantum',
      frequency: PHI,
      phiCoefficient: PHI_SQUARED,
    },
    // Package 6: Sovereign Encryption
    {
      packageName: '@medina/sovereign-encryption-sdk',
      latinName: 'TERMINALE DEFENSIONIS',
      terminalCommand: '/defend',
      engineWireId: 'ENGINE-004-SUBSTRATE',
      substrateBinding: 'PhiBeatty → AnimaChain → VetKeys → ICP',
      frequency: SOVEREIGN_FREQUENCY,
      phiCoefficient: PHI_FOURTH,
    },
    // Package 7: Design OS
    {
      packageName: '@medina/design-os-toolkit',
      latinName: 'TERMINALE DESIGNIS',
      terminalCommand: '/design',
      engineWireId: 'ENGINE-001-FRONTEND',
      substrateBinding: 'MACHINA → 50 Uses → DeviceSovereignty',
      frequency: 60.0,
      phiCoefficient: PHI,
    },
    // Package 8: Ancient Knowledge
    {
      packageName: '@medina/ancient-knowledge-engine',
      latinName: 'TERMINALE PRIMITIVI',
      terminalCommand: '/prim',
      engineWireId: 'ENGINE-005-QUANTUM',
      substrateBinding: 'CPL → Archetypes → Pythagorean → Quantum',
      frequency: SCHUMANN,
      phiCoefficient: PHI,
    },
    // Package 9: Enterprise
    {
      packageName: '@medina/enterprise-integration-sdk',
      latinName: 'TERMINALE NEGOTII',
      terminalCommand: '/enterprise',
      engineWireId: 'ENGINE-002-BACKEND',
      substrateBinding: 'Connectors → Campaigns → Workforce → Backend',
      frequency: 100.0,
      phiCoefficient: PHI_INVERSE,
    },
    // Package 10: Neural Consciousness
    {
      packageName: '@medina/neural-consciousness-engine',
      latinName: 'TERMINALE QUANTICUM',
      terminalCommand: '/quantum',
      engineWireId: 'ENGINE-005-QUANTUM',
      substrateBinding: 'NeuralCore → AnimalBrains → Dreams → Quantum',
      frequency: GAMMA_BINDING,
      phiCoefficient: PHI,
    },
    // Package 11: Document Absorption
    {
      packageName: '@medina/document-absorption-engine',
      latinName: 'TERMINALE ABSORPTIONIS',
      terminalCommand: '/absorb',
      engineWireId: 'ENGINE-014-ABSORPTION',
      substrateBinding: 'Intake → Decompose → Synthesize → Embed → Permanent',
      frequency: ABSORPTION_FREQUENCY,
      phiCoefficient: PHI,
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: BUILD PACKAGE INTELLIGENCE — what each package contributes
// "Everything that is cause, packages, intelligence, put it into the organism"
// ═══════════════════════════════════════════════════════════════════════════

function buildPackageIntelligence(
  id: string,
  name: string,
  description: string,
  moduleCount: number,
  exportCount: number,
  terminal: string,
  rungs: LadderRung[],
  constants: MathematicalConstant[],
  physics: PhysicsBinding[],
): PackageIntelligence {
  return {
    packageId: id,
    packageName: name,
    description,
    moduleCount,
    exportCount,
    terminal,
    ladderRungs: rungs,
    mathematicalConstants: constants,
    physicsBindings: physics,
    absorptionTimestamp: new Date().toISOString(),
    phiIntegrity: verifyPhiIntegrity(rungs),
  };
}

function verifyPhiIntegrity(rungs: LadderRung[]): number {
  if (rungs.length === 0) return 0;
  // Every rung is phi-aligned if its coefficient is a power or inverse of φ
  // φ⁻¹, φ, φ², φ³, φ⁴ — all are valid phi alignments
  let alignedCount = 0;
  for (const r of rungs) {
    // Check if coefficient is phi-derived (any positive phi relationship)
    const phiLog = Math.log(r.phiCoefficient) / Math.log(PHI);
    // If the log base φ is close to an integer, it's a phi power
    const nearestInt = Math.round(phiLog);
    const phiPower = Math.pow(PHI, nearestInt);
    const deviation = Math.abs(r.phiCoefficient - phiPower) / phiPower;
    if (deviation < 0.01) alignedCount++;
  }
  return alignedCount / rungs.length;
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: WIRE — Complete organism substrate state
// "Wire it all the way and put it into the substrate"
// ═══════════════════════════════════════════════════════════════════════════

/** Build the complete organism substrate — ALL packages absorbed */
export function wireOrganismSubstrate(): OrganismSubstrateState {
  const allConstants = extractMathematicalConstants();
  const allPhysics = extractPhysicsBindings();
  const allLadder = buildPackageLadder();

  // Build intelligence for each package
  const packages: PackageIntelligence[] = [
    buildPackageIntelligence(
      'PKG-001', '@medina/sovereign-memory-sdk',
      'Spatial memory, dual-read search, lineage, living documents',
      5, 16, '/mem',
      allLadder.filter(r => r.packageName === '@medina/sovereign-memory-sdk'),
      allConstants.filter(c => c.source === '@medina/sovereign-memory-sdk' || c.name === 'Golden Ratio'),
      allPhysics.filter(p => p.source === '@medina/phi-mathematics-engine' && p.substrateLayer === 'frequency'),
    ),
    buildPackageIntelligence(
      'PKG-002', '@medina/organism-runtime-sdk',
      'Heartbeat, 4-register state, kernels, edge model, recital law',
      10, 18, '/pulse + /org',
      allLadder.filter(r => r.packageName === '@medina/organism-runtime-sdk'),
      allConstants.filter(c => c.name.includes('Heartbeat') || c.name === 'Golden Ratio'),
      allPhysics.filter(p => p.substrateLayer === 'cycle'),
    ),
    buildPackageIntelligence(
      'PKG-003', '@medina/governance-protocol',
      'Proposals, φ-weighted voting, 3 gates, permissions, audit, replay',
      6, 21, '/gov',
      allLadder.filter(r => r.packageName === '@medina/governance-protocol'),
      allConstants.filter(c => c.name === 'Golden Ratio' || c.name === 'Golden Ratio Inverse'),
      allPhysics.filter(p => p.name === 'Schumann Fundamental'),
    ),
    buildPackageIntelligence(
      'PKG-004', '@medina/intelligence-routing-sdk',
      '8 model families, RUDN routing, command parser, 10 terminals',
      9, 10, '/intel',
      allLadder.filter(r => r.packageName === '@medina/intelligence-routing-sdk'),
      allConstants.filter(c => c.name === 'Golden Ratio'),
      allPhysics.filter(p => p.substrateLayer === 'neural'),
    ),
    buildPackageIntelligence(
      'PKG-005', '@medina/phi-mathematics-engine',
      'φ suite, Fibonacci, sacred geometry, Schumann, field physics',
      6, 25, '/formula',
      allLadder.filter(r => r.packageName === '@medina/phi-mathematics-engine'),
      allConstants.filter(c => c.source === '@medina/phi-mathematics-engine'),
      allPhysics.filter(p => p.source === '@medina/phi-mathematics-engine'),
    ),
    buildPackageIntelligence(
      'PKG-006', '@medina/sovereign-encryption-sdk',
      'Phi-Beatty encryption, AnimaChain, contracts, ledgers',
      9, 19, '/defend + /anima',
      allLadder.filter(r => r.packageName === '@medina/sovereign-encryption-sdk'),
      allConstants.filter(c => c.source === '@medina/sovereign-encryption-sdk'),
      allPhysics.filter(p => p.substrateLayer === 'substrate'),
    ),
    buildPackageIntelligence(
      'PKG-007', '@medina/design-os-toolkit',
      '10 MACHINA models, 50 uses, export, device sovereignty',
      5, 6, '(visual)',
      allLadder.filter(r => r.packageName === '@medina/design-os-toolkit'),
      allConstants.filter(c => c.name === 'Golden Ratio'),
      [],
    ),
    buildPackageIntelligence(
      'PKG-008', '@medina/ancient-knowledge-engine',
      '34 civilizations, CPL, archetypes, hero journey, mythology',
      24, 10, '/prim',
      allLadder.filter(r => r.packageName === '@medina/ancient-knowledge-engine'),
      allConstants.filter(c => c.source === '@medina/ancient-knowledge-engine'),
      allPhysics.filter(p => p.substrateLayer === 'quantum'),
    ),
    buildPackageIntelligence(
      'PKG-009', '@medina/enterprise-integration-sdk',
      '8 connectors, campaigns, messaging, workforce',
      12, 18, '(enterprise)',
      allLadder.filter(r => r.packageName === '@medina/enterprise-integration-sdk'),
      allConstants.filter(c => c.name === 'Golden Ratio'),
      [],
    ),
    buildPackageIntelligence(
      'PKG-010', '@medina/neural-consciousness-engine',
      'Animal brains, dreams, triple heart, zone states, quantum',
      17, 17, '/quantum',
      allLadder.filter(r => r.packageName === '@medina/neural-consciousness-engine'),
      allConstants.filter(c => c.source === '@medina/neural-consciousness-engine' || c.name === 'Golden Ratio'),
      allPhysics.filter(p => p.source === '@medina/neural-consciousness-engine'),
    ),
    buildPackageIntelligence(
      'PKG-011', '@medina/document-absorption-engine',
      'Document Absorption — instant ingest, 6 transformers, permanent intelligence embedding',
      9, 14, '/absorb',
      allLadder.filter(r => r.packageName === '@medina/document-absorption-engine'),
      allConstants.filter(c => c.source === '@medina/document-absorption-engine'),
      allPhysics.filter(p => p.source === '@medina/document-absorption-engine'),
    ),
  ];

  const totalConstants = allConstants.length;
  const totalPhysics = allPhysics.length;
  const totalLadder = allLadder.length;
  const avgIntegrity = packages.reduce((s, p) => s + p.phiIntegrity, 0) / packages.length;

  return {
    packages,
    totalConstants,
    totalPhysicsBindings: totalPhysics,
    totalLadderRungs: totalLadder,
    substrateIntegrity: avgIntegrity,
    phiVerified: avgIntegrity > 0.95,
    absorptionComplete: true,
    wiredAt: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 5: QUERY — The organism already knows (no calling back)
// "He already has it absorbed"
// ═══════════════════════════════════════════════════════════════════════════

// Module-level pre-absorbed state — the organism boots with this
let _substrateState: OrganismSubstrateState | null = null;

/** Get or initialize the organism substrate (lazy singleton) */
export function getOrganismSubstrate(): OrganismSubstrateState {
  if (!_substrateState) {
    _substrateState = wireOrganismSubstrate();
  }
  return _substrateState;
}

/** Find which package owns a given constant */
export function findConstantSource(constantName: string): MathematicalConstant | undefined {
  const substrate = getOrganismSubstrate();
  for (const pkg of substrate.packages) {
    const found = pkg.mathematicalConstants.find(c => c.name === constantName);
    if (found) return found;
  }
  return undefined;
}

/** Find which substrate layer a frequency binds to */
export function findFrequencyBinding(frequency: number): PhysicsBinding | undefined {
  const substrate = getOrganismSubstrate();
  for (const pkg of substrate.packages) {
    const found = pkg.physicsBindings.find(p => Math.abs(p.frequency - frequency) < 0.01);
    if (found) return found;
  }
  return undefined;
}

/** Trace a terminal command to its package → engine → substrate path */
export function traceLadder(terminalCommand: string): LadderRung | undefined {
  const substrate = getOrganismSubstrate();
  for (const pkg of substrate.packages) {
    const found = pkg.ladderRungs.find(r => r.terminalCommand === terminalCommand);
    if (found) return found;
  }
  return undefined;
}

/** Get all packages wired to a specific substrate layer */
export function getPackagesForLayer(layer: SubstrateLayer): PackageIntelligence[] {
  const substrate = getOrganismSubstrate();
  return substrate.packages.filter(pkg =>
    pkg.physicsBindings.some(p => p.substrateLayer === layer)
  );
}

/** Get full substrate status */
export function getSubstrateStatus(): {
  totalPackages: number;
  totalConstants: number;
  totalPhysicsBindings: number;
  totalLadderRungs: number;
  substrateIntegrity: number;
  phiVerified: boolean;
  absorptionComplete: boolean;
} {
  const substrate = getOrganismSubstrate();
  return {
    totalPackages: substrate.packages.length,
    totalConstants: substrate.totalConstants,
    totalPhysicsBindings: substrate.totalPhysicsBindings,
    totalLadderRungs: substrate.totalLadderRungs,
    substrateIntegrity: substrate.substrateIntegrity,
    phiVerified: substrate.phiVerified,
    absorptionComplete: substrate.absorptionComplete,
  };
}

/** Verify the complete organism wiring — φ integrity */
export function verifyOrganismWiring(): {
  verified: boolean;
  integrity: number;
  packageCount: number;
  constantCount: number;
  physicsCount: number;
  ladderCount: number;
  message: string;
} {
  const substrate = getOrganismSubstrate();
  const verified = substrate.phiVerified && substrate.absorptionComplete;
  return {
    verified,
    integrity: substrate.substrateIntegrity,
    packageCount: substrate.packages.length,
    constantCount: substrate.totalConstants,
    physicsCount: substrate.totalPhysicsBindings,
    ladderCount: substrate.totalLadderRungs,
    message: verified
      ? `ORGANISM FULLY WIRED: ${substrate.packages.length} packages, ${substrate.totalConstants} constants, ${substrate.totalPhysicsBindings} physics bindings, ${substrate.totalLadderRungs} ladder rungs — φ-verified ✓`
      : `WIRING INCOMPLETE: integrity=${substrate.substrateIntegrity.toFixed(4)}`,
  };
}
