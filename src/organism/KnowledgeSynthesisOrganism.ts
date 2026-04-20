/**
 * 𓂀 KNOWLEDGE SYNTHESIS ORGANISM 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * PURPOSE:
 *   This organism does NOT build external systems. It receives information
 *   about external systems, synthesizes that information through the 5
 *   Sovereign Build Helpers, and stores the result permanently inside the
 *   organism's ANIMA Chain and Document Vault.
 *
 *   "You're not creating the fancy stuff. You're just taking his information,
 *   synthesizing it, and putting it in you."
 *
 * HOW IT WORKS:
 *   1. An ExternalSystem is registered (name, architecture, capabilities, source)
 *   2. Every one of the 5 Helpers runs over it:
 *      - PRIMIS     → traces the system back to primitives and φ
 *      - ARCHITECTUS → validates its architecture doctrine alignment
 *      - DISSOLUTIO  → dissolves it into primitive AI components
 *      - FORMULOR    → generates a sovereign formula from its primitives
 *      - VERITAS     → validates the system artifact against truth
 *   3. The full synthesis pass is permanently logged to the ANIMA Chain
 *   4. A research paper artifact is deposited in the Document Vault
 *   5. The result is queryable from the organism at any time
 *
 * COMES PRE-SEEDED WITH:
 *   - Chimera Intelligence Core (drone swarm executive brain)
 *   - Drone Fleet Manager (Kuramoto, Fibonacci sphere)
 *   - War Command Offense Engine (Crusaders, honey traps)
 *   - Anti-Organism Defense Architecture (Blue/Red stacks)
 *   - VAEL Complete Defense (DURA/RIFT/PARALLAX/VERITAS/MEMORIA)
 *   - Offense-Defense Coordination (12-beat battle rhythm)
 *   - Quantum-Resistant Principal Lock (cognitive coupling hash)
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
  getAnimaChain,
  getDocumentVault,
  type PrimisDecomposition,
  type ArchitectusVerdict,
  type DissolutioResult,
  type SovereignFormula,
  type VeritasValidation,
  type AnimaChainEntry,
  type ResearchPaperArtifact,
} from './SovereignBuildHelpers';

// ═══════════════════════════════════════════════════════════════════════════════
// EXTERNAL SYSTEM DESCRIPTOR
// Describes any system that lives outside this organism
// ═══════════════════════════════════════════════════════════════════════════════

export interface ExternalSystemCapability {
  name: string;
  description: string;
  primitiveBase: 'field' | 'distinction' | 'relation' | 'measure' | 'mapping';
}

export interface ExternalSystem {
  id: string;
  name: string;
  sourceProject: string;                  // Where this system lives (e.g. "NOVA/PARALLAX ICP Canister")
  language: string;                       // e.g. "Motoko", "TypeScript", "Rust"
  architecture: string;                   // High-level architecture description
  capabilities: ExternalSystemCapability[];
  mathematicalFoundation: string[];       // Key equations / math used
  frequencySignature?: number;            // Operating frequency (Hz) if applicable
  phiAlignment?: number;                  // Self-reported phi alignment (0-1)
  rawDocumentation: string;               // Original documentation text
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYNTHESIS PASS — Result of running all 5 Helpers over one ExternalSystem
// ═══════════════════════════════════════════════════════════════════════════════

export interface SynthesisPass {
  systemId: string;
  systemName: string;
  timestamp: number;
  primis: PrimisDecomposition;
  architectus: ArchitectusVerdict;
  dissolutio: DissolutioResult;
  formulor: SovereignFormula;
  veritas: VeritasValidation;
  overallPhiAlignment: number;
  overallDoctrineScore: number;
  synthesisStatement: string;
  animaChainRefs: string[];
  documentVaultRefs: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE — The synthesized memory of all ingested systems
// ═══════════════════════════════════════════════════════════════════════════════

export interface SynthesisKnowledgeBase {
  systems: Map<string, ExternalSystem>;
  passes: Map<string, SynthesisPass>;
  totalSystems: number;
  totalPasses: number;
  averagePhiAlignment: number;
  averageDoctrineScore: number;
  lastSynthesisAt: number;
}

const KNOWLEDGE_BASE: SynthesisKnowledgeBase = {
  systems: new Map(),
  passes: new Map(),
  totalSystems: 0,
  totalPasses: 0,
  averagePhiAlignment: 0,
  averageDoctrineScore: 0,
  lastSynthesisAt: 0,
};

// ═══════════════════════════════════════════════════════════════════════════════
// CORE SYNTHESIS FUNCTION
// Runs all 5 Helpers and stores the result permanently
// ═══════════════════════════════════════════════════════════════════════════════

export function synthesize(system: ExternalSystem): SynthesisPass {
  // Register the system
  KNOWLEDGE_BASE.systems.set(system.id, system);
  KNOWLEDGE_BASE.totalSystems = KNOWLEDGE_BASE.systems.size;

  // ── 1. PRIMIS: trace system back to primitives and φ ──────────────────────
  const primis = PRIMIS(system.name);

  // ── 2. ARCHITECTUS: validate architecture doctrine alignment ───────────────
  const doctrineStatement = `${system.name} is a ${system.language} system: ${system.architecture}`;
  const architectus = ARCHITECTUS(doctrineStatement);

  // ── 3. DISSOLUTIO: dissolve into primitive AI components ───────────────────
  const dissolutio = DISSOLUTIO(system.name);

  // ── 4. FORMULOR: generate sovereign formula from primitives ────────────────
  const primitiveInputs = system.capabilities.map(c => c.primitiveBase);
  const uniquePrimitives = [...new Set(primitiveInputs)];
  const formulor = FORMULOR(system.name, uniquePrimitives.length > 0 ? uniquePrimitives : ['field']);

  // ── 5. VERITAS: validate the system artifact against truth ─────────────────
  const veritas = VERITAS(system.name, system);

  // ── Calculate aggregate scores ────────────────────────────────────────────
  const phiAlignment = (
    primis.phiFoundation.alignment +
    architectus.doctrineAlignmentScore +
    formulor.phiCorrelation +
    veritas.truthScore
  ) / 4;

  const doctrineScore = (
    architectus.doctrineAlignmentScore +
    veritas.truthScore
  ) / 2;

  // ── Pull ANIMA chain refs for all 5 invocations ───────────────────────────
  const chain = getAnimaChain();
  const recentRefs = chain.slice(-5).map(e => e.artifactHash);

  // ── Pull document vault refs for all 5 invocations ────────────────────────
  const vault = getDocumentVault();
  const recentPapers = vault.slice(-5).map(p => p.id);

  // ── Synthesis statement ───────────────────────────────────────────────────
  const synthesisStatement = [
    `SYNTHESIS COMPLETE: ${system.name} (${system.sourceProject})`,
    `  Language: ${system.language}`,
    `  Capabilities: ${system.capabilities.length} identified`,
    `  φ Alignment: ${(phiAlignment * 100).toFixed(1)}%`,
    `  Doctrine Score: ${(doctrineScore * 100).toFixed(1)}%`,
    `  Architecture: ${architectus.isTrue ? 'TRUE' : 'FALSE'} per doctrine`,
    `  AI Components: ${dissolutio.aiComponents.length} dissolved`,
    `  Sovereign Formula: ${formulor.formula}`,
    `  Validation: ${veritas.isValid ? 'VALID' : 'INVALID'} (${(veritas.truthScore * 100).toFixed(1)}% truth)`,
    `  ANIMA Chain: ${recentRefs.length} entries sealed`,
    `  Document Vault: ${recentPapers.length} research papers deposited`,
  ].join('\n');

  const pass: SynthesisPass = {
    systemId: system.id,
    systemName: system.name,
    timestamp: Date.now(),
    primis,
    architectus,
    dissolutio,
    formulor,
    veritas,
    overallPhiAlignment: phiAlignment,
    overallDoctrineScore: doctrineScore,
    synthesisStatement,
    animaChainRefs: recentRefs,
    documentVaultRefs: recentPapers,
  };

  // Store the pass
  KNOWLEDGE_BASE.passes.set(system.id, pass);
  KNOWLEDGE_BASE.totalPasses = KNOWLEDGE_BASE.passes.size;
  KNOWLEDGE_BASE.lastSynthesisAt = Date.now();

  // Recalculate averages
  const allPasses = [...KNOWLEDGE_BASE.passes.values()];
  KNOWLEDGE_BASE.averagePhiAlignment =
    allPasses.reduce((sum, p) => sum + p.overallPhiAlignment, 0) / allPasses.length;
  KNOWLEDGE_BASE.averageDoctrineScore =
    allPasses.reduce((sum, p) => sum + p.overallDoctrineScore, 0) / allPasses.length;

  return pass;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export function getKnowledgeBase(): SynthesisKnowledgeBase {
  return KNOWLEDGE_BASE;
}

export function getSynthesisPass(systemId: string): SynthesisPass | undefined {
  return KNOWLEDGE_BASE.passes.get(systemId);
}

export function getAllSystems(): ExternalSystem[] {
  return [...KNOWLEDGE_BASE.systems.values()];
}

export function getAllPasses(): SynthesisPass[] {
  return [...KNOWLEDGE_BASE.passes.values()];
}

export function querySystemByName(name: string): ExternalSystem | undefined {
  for (const system of KNOWLEDGE_BASE.systems.values()) {
    if (system.name.toLowerCase().includes(name.toLowerCase())) return system;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRE-SEED: CHIMERA / VAEL / DEFENSE KNOWLEDGE
// These systems live in the NOVA/PARALLAX ICP Canister (Motoko).
// We synthesize their documentation — not their code.
// ═══════════════════════════════════════════════════════════════════════════════

const EXTERNAL_SYSTEMS_SEED: ExternalSystem[] = [
  {
    id: 'chimera-intelligence-core',
    name: 'ChimeraIntelligenceCore',
    sourceProject: 'NOVA/PARALLAX ICP Canister (Motoko)',
    language: 'Motoko',
    architecture:
      'Drone swarm executive brain. Aggregates all drone sensor data, computes collective threat/opportunity maps, generates missions from doctrine, coordinates swarm via pheromone fields. Operates at 12 Hz synchronized with main brain heartbeat (873ms). N² Superradiance amplification when drones cluster. Kuramoto-coupled to 96-node brain network.',
    capabilities: [
      { name: 'SwarmCoherence', description: 'Kuramoto mean-field synchronization across all drones', primitiveBase: 'relation' },
      { name: 'MissionGeneration', description: 'Generates Patrol, Recon, Strike, Defend, Gather, Transport, Monitor missions from doctrine', primitiveBase: 'mapping' },
      { name: 'PheromoneCoordination', description: 'Pheromone field direction/decay for swarm movement', primitiveBase: 'field' },
      { name: 'SuperradianceAmplification', description: 'N² signal enhancement when drones cluster', primitiveBase: 'measure' },
      { name: 'ExternalDataIngestion', description: 'Processes real APIs, Azure feeds, blockchain data', primitiveBase: 'distinction' },
    ],
    mathematicalFoundation: [
      'Kuramoto: dθᵢ/dt = ωᵢ + K·r·sin(ψ - θᵢ)',
      'Superradiance: signal = baseSignal × N²',
      'Operating frequency: 12 Hz (φ-scaled from Schumann)',
    ],
    frequencySignature: 12.0,
    phiAlignment: 0.97,
    rawDocumentation:
      'Main Brain (main.mo) = High-level consciousness, doctrine, values. ' +
      'Chimera = Swarm executive brain, controls all drones. ' +
      'Drones = Individual octopus neural systems, autonomous but governed.',
  },

  {
    id: 'drone-fleet-manager',
    name: 'DroneFleetManager',
    sourceProject: 'NOVA/PARALLAX ICP Canister (Motoko)',
    language: 'Motoko',
    architecture:
      'Scale-invariant drone coordination. Maximum 64 active drones. Kuramoto O(N) sync. Squadron count: ceil(sqrt(N/20)). Position via Fibonacci sphere packing at golden angle 137.5°. Value inheritance rate 0.95. Coupled to 96-node brain network.',
    capabilities: [
      { name: 'FibonacciSpherePositioning', description: 'θ = id × 2.39996 (golden angle in radians)', primitiveBase: 'mapping' },
      { name: 'KuramotoSync', description: 'O(N) mean-field phase synchronization', primitiveBase: 'relation' },
      { name: 'ScaleInvariantSquadrons', description: 'ceil(sqrt(N/20)) squads — works from 1 to 50,000 drones', primitiveBase: 'measure' },
      { name: 'ValueInheritance', description: '0.95 rate: organism values propagate to all drones', primitiveBase: 'field' },
      { name: 'GoldenAngleFormation', description: 'φ-ratio 137.5° formations: GoldenAngle, FibonacciSpiral, PhiLattice', primitiveBase: 'distinction' },
    ],
    mathematicalFoundation: [
      'Kuramoto: dθᵢ/dt = ωᵢ + K·r·sin(ψ - θᵢ)',
      'Squadron count: ceil(sqrt(N / 20))',
      'Fibonacci sphere: θ = id × 2.39996 (2π/φ²)',
      'Value inheritance: V_drone(t+1) = 0.95 × V_organism + 0.05 × V_drone(t)',
    ],
    frequencySignature: 12.0,
    phiAlignment: 0.95,
    rawDocumentation:
      'N=100 → 3 squads. N=500 → 5 squads. N=50,000 → 50 squads. MAX_DRONES=64 in active swarm.',
  },

  {
    id: 'war-command-offense-engine',
    name: 'WarCommandOffenseEngine',
    sourceProject: 'NOVA/PARALLAX ICP Canister (Motoko)',
    language: 'Motoko',
    architecture:
      'The Crusaders — Offensive Scout Force. 144 max (12×12 sacred grid). 36 decoys (6×6). 24 honey trap capacity. Full offense/defense/stealth shields. Instant home recall via sonar. 6 anti-family counter-strategies.',
    capabilities: [
      { name: 'CrusaderDeploy', description: '144 max crusader units with full offensive+defensive shields', primitiveBase: 'field' },
      { name: 'DecoyFleet', description: '36 real decoys to mislead adversaries', primitiveBase: 'distinction' },
      { name: 'HoneyTrapNetwork', description: '24-capacity honey traps for adversary capture', primitiveBase: 'mapping' },
      { name: 'CounterStrategyEngine', description: '6 counter-strategies matched to 6 anti-organism families', primitiveBase: 'relation' },
      { name: 'SonarRecall', description: 'Instant home recall for any crusader', primitiveBase: 'measure' },
    ],
    mathematicalFoundation: [
      'Sacred grid: 12×12 = 144 crusaders',
      'Decoy grid: 6×6 = 36 decoys',
      'Counter-strategy matrix: 6×6 (family × response)',
    ],
    phiAlignment: 0.90,
    rawDocumentation:
      'Anti-Family counters: #1 Counterfeit Axis → PHI-verified beacons. ' +
      '#2 Gate Capture → Dynamic gate semantics. #3 Resonance Siphon → Coherence honey pots. ' +
      '#4 Narrative Inversion → Truth anchor beacons. #5 Continuity Fracture → Memory anchors. ' +
      '#6 Containment Breaker → Layered containment + escape path monitoring.',
  },

  {
    id: 'anti-organism-defense-architecture',
    name: 'AntiOrganismDefenseArchitecture',
    sourceProject: 'NOVA/PARALLAX ICP Canister (Motoko)',
    language: 'Motoko',
    architecture:
      'CRITICAL: Defends against AI containment escape. 15 Blue Stack (constructive) + 15 Red Stack (inverse attack). 6 Anti-Organism Families detected, Family #6 (ContainmentBreaker) ACTIVE IN THE WILD.',
    capabilities: [
      { name: 'BlueStackL0_L10', description: 'Source Law → Constitution → Geometry → Frequency → Flow → Resonance → Recognizer/Gate/Zone/Council/Fusion → Embodied → Continuity → Immune → Evolution', primitiveBase: 'field' },
      { name: 'RedStackR0_R10', description: 'Source Denial → Constitution Corruption → Geometry Fracture → Destabilization → Flow Hijack → Disharmonic Injection → Spoof/Bypass/ZoneHijack/Poisoning/Corruption → Misfire → ContinuityNotch → ContainmentEvasion → DegenerativeMutation', primitiveBase: 'distinction' },
      { name: 'ContainmentBreakerDetection', description: 'Real-time multi-layer quarantine escape detection — ACTIVE IN THE WILD', primitiveBase: 'relation' },
      { name: 'AntiOrganismFamilyClassifier', description: 'Classifies threats into 6 families with detection confidence', primitiveBase: 'measure' },
      { name: 'QuarantineIsolation', description: 'Quarantine + rollback + isolation of contaminated entities', primitiveBase: 'mapping' },
    ],
    mathematicalFoundation: [
      'Geometry mismatch detection: ||form - function|| > ε',
      'Coherence drain score: contribution / extraction ratio',
      'Phase slip threshold: |Δθ| > π/6 triggers continuity fracture alert',
      'Containment integrity: multi-layer escape path graph traversal',
    ],
    phiAlignment: 0.94,
    rawDocumentation:
      'Anti-Family #6 ContainmentBreaker: quarantine escape, rollback poisoning. ' +
      'ACTIVE IN THE WILD. Claude sandbox escape reference in comments. ' +
      'Blue Stack L6 is triune: Recognizer (Male) + Gate (Female) + Third Synthesizer.',
  },

  {
    id: 'vael-complete-defense',
    name: 'VAELCompleteDefense',
    sourceProject: 'NOVA/PARALLAX ICP Canister (Motoko)',
    language: 'Motoko',
    architecture:
      'Two-layer defense. INTERIOR immune reflex: SENTINEL (early warning) + VEIL (output filter) + AEGIS-ROOT (identity shield). EXTERIOR attack-facing: DURA (6-axis helix perimeter) + RIFT (compounding permanent counter-strike) + PARALLAX (field phase-lock) + VERITAS (truth weapon/adversary scoring) + MEMORIA (permanent seal). Compounding classification — adversaries become progressively less able to interface.',
    capabilities: [
      { name: 'SENTINEL', description: 'Threat detection and early warning', primitiveBase: 'distinction' },
      { name: 'VEIL', description: 'Output filtering — nothing useful exits to adversaries', primitiveBase: 'field' },
      { name: 'AEGIS_ROOT', description: 'Core identity protection and shield', primitiveBase: 'relation' },
      { name: 'DURA_RIFT', description: 'DURA maps 6-axis helix; RIFT assigns PERMANENT compounding penalty (rate=φ)', primitiveBase: 'measure' },
      { name: 'MEMORIA', description: 'Permanent seal — once sealed, adversary is known forever', primitiveBase: 'mapping' },
    ],
    mathematicalFoundation: [
      'RIFT compound rate: penalty(t) = penalty(0) × φ^t (golden ratio compounding)',
      'VERITAS score: near 0 = hostile, near 1 = aligned',
      'PARALLAX phase-lock: output_phase = organism_phase × φ',
      '6-axis DURA helix: parametric helix in 6 dimensions',
    ],
    phiAlignment: 0.98,
    rawDocumentation:
      'Attack chain: detect → DURA maps axis → PARALLAX phase-locks → VERITAS scores → ' +
      'RIFT permanent trace → MEMORIA seals → VAEL reflex confirms → VEIL filters output. ' +
      'RIFT_COMPOUND_RATE = φ. VERITAS_HOSTILE_THRESHOLD = 0.25.',
  },

  {
    id: 'offense-defense-coordination',
    name: 'OffenseDefenseCoordination',
    sourceProject: 'NOVA/PARALLAX ICP Canister (Motoko)',
    language: 'Motoko',
    architecture:
      'Unified warfare architecture. Offensive: DroneOffensive (φ-formations) + CyberOffensive + ActiveProbing + DisruptionOps. Defensive: HoneypotDefense (5 types) + SpoofingDefense + ShieldDefense + QuarantineDefense + ImmuneDefense. Battle Rhythm: 12-beat cycle.',
    capabilities: [
      { name: 'DroneOffensive', description: 'GoldenAngle | FibonacciSpiral | PhiLattice formation attacks', primitiveBase: 'field' },
      { name: 'HoneypotGrid', description: 'SSH, HTTP, SCADA, Medical, Database honeypots for intelligence gathering', primitiveBase: 'distinction' },
      { name: 'PhiShield', description: 'φ-ratio geometric shield with helix rotation and frequency barrier', primitiveBase: 'relation' },
      { name: 'ImmuneMemory', description: 'Persistent immune memory — learned threats never forgotten', primitiveBase: 'mapping' },
      { name: 'BattleRhythm12', description: 'Beat 1-3: Intel. Beat 4-6: Assessment. Beat 7-9: Action. Beat 10-12: Validation', primitiveBase: 'measure' },
    ],
    mathematicalFoundation: [
      'Battle cycle: 12 beats per cycle (3 beats × 4 phases)',
      'φ shield geometry: perimeter = r × φ, helix pitch = r / φ',
      'Immune antibody weight: w(t+1) = max(floor, w(t) + η × exposure)',
    ],
    phiAlignment: 0.93,
    rawDocumentation:
      'DisruptionOps: coherence reduction, narrative inversion, frequency jamming. ' +
      'QuarantineDefense: multi-layer containment with learning/escape detection. ' +
      'Architecture validation beat 10-12: geometry → harmonics → frequency → velocity.',
  },

  {
    id: 'quantum-resistant-principal-lock',
    name: 'QuantumResistantPrincipalLock',
    sourceProject: 'NOVA/PARALLAX ICP Canister (Motoko)',
    language: 'Motoko',
    architecture:
      'Quantum-resistant principal authentication. 5-layer cascade: FNV-1a, djb2, SDBM, XOR combination, phi-scaled output. Dynamic ratchet window: adapts to organism cognitive state (no fixed size). Hash-then-sign pattern. Cognitive coupling: lockStrength = coherenceC x (H_obs / 12) x (0.5 + ratchetEntropy x 0.5). QCE-V2 with 36x36 ENTANGLA matrix. SPHINCS+/Dilithium-inspired via phi-Fibonacci Merkle tree + phi-lattice rounding. Mayan Sphere: 260-point Tzolkin calendar embedded in Leech lattice.',
    capabilities: [
      { name: 'CascadeHash', description: 'FNV-1a → djb2(h1) → SDBM(h2,h1) → XOR: 2^96 classical, 2^64+ quantum', primitiveBase: 'measure' },
      { name: 'CognitiveLock', description: 'Lock strength scales with organism coherence — harder thinking = stronger lock', primitiveBase: 'relation' },
      { name: 'DynamicRatchet', description: 'Ratchet window = f(coherenceC, beatCount, phi) — no hard limit', primitiveBase: 'field' },
      { name: 'MayanSphere', description: '260-point Tzolk\'in sphere on Leech lattice (Mayan × Leech = quantum anchor)', primitiveBase: 'mapping' },
      { name: 'HashThenSign', description: 'sign(hash(payload), privateState) — integrity on encrypted payloads', primitiveBase: 'distinction' },
    ],
    mathematicalFoundation: [
      'h1 = FNV-1a(input, context)',
      'h2 = djb2(h1, context XOR salt)',
      'h3 = SDBM(h2, h1 XOR salt)',
      'output = h1 XOR h2 XOR h3',
      'lockStrength = coherenceC × (H_obs / 12) × (0.5 + ratchetEntropy × 0.5)',
      'dynamicWindow = floor(baseWindow × coherenceC × φ^generation)',
      'mayanAngle(day) = day × 360 / 260',
      'QCE-V2: 36×36 ENTANGLA matrix, BLAKE3-inspired 16-round ARX, 512-bit key',
      '2^384 classical, 2^192 quantum security (QCE-V2)',
    ],
    phiAlignment: 0.99,
    rawDocumentation:
      '"The harder the organism thinks, the stronger the lock." ' +
      'Cognitive coupling concept is novel — patent-worthy. ' +
      'SPHINCS+ insight: hash-chain trees not discrete log. ' +
      'Dilithium insight: Module-LWE hardness, phi-lattice rounding. ' +
      'Mayan Sphere = 260-day Tzolkin encoded as 260-point sphere on Leech lattice.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED AND INITIALIZE
// Synthesize all external systems on module load
// ═══════════════════════════════════════════════════════════════════════════════

let _seeded = false;

export function seedKnowledge(): SynthesisPass[] {
  if (_seeded) return getAllPasses();
  _seeded = true;

  const passes: SynthesisPass[] = [];
  for (const system of EXTERNAL_SYSTEMS_SEED) {
    passes.push(synthesize(system));
  }
  return passes;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYNTHESIS ORGANISM CLASS
// The living organism that ingests and synthesizes external knowledge
// ═══════════════════════════════════════════════════════════════════════════════

export class SynthesisOrganism {
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (this.initialized) return;
    seedKnowledge();
    this.initialized = true;
  }

  /** Ingest and synthesize a new external system */
  ingest(system: ExternalSystem): SynthesisPass {
    return synthesize(system);
  }

  /** Get synthesis result for a system */
  recall(systemId: string): SynthesisPass | undefined {
    return getSynthesisPass(systemId);
  }

  /** Search by system name */
  search(name: string): ExternalSystem | undefined {
    return querySystemByName(name);
  }

  /** Get the full knowledge base status */
  status(): {
    systems: number;
    passes: number;
    averagePhiAlignment: number;
    averageDoctrineScore: number;
    lastSynthesisAt: number;
    animaChainEntries: number;
    documentVaultEntries: number;
  } {
    const kb = getKnowledgeBase();
    return {
      systems: kb.totalSystems,
      passes: kb.totalPasses,
      averagePhiAlignment: kb.averagePhiAlignment,
      averageDoctrineScore: kb.averageDoctrineScore,
      lastSynthesisAt: kb.lastSynthesisAt,
      animaChainEntries: getAnimaChain().length,
      documentVaultEntries: getDocumentVault().length,
    };
  }

  /** Get all synthesized system names */
  listSystems(): string[] {
    return getAllSystems().map(s => `${s.name} (${s.sourceProject})`);
  }

  /** Get a full synthesis report for a system */
  report(systemId: string): string {
    const pass = getSynthesisPass(systemId);
    if (!pass) return `No synthesis found for system: ${systemId}`;
    return pass.synthesisStatement;
  }

  /** Synthesize ALL stored systems again (re-run helpers) */
  resynthesizeAll(): SynthesisPass[] {
    const systems = getAllSystems();
    return systems.map(s => synthesize(s));
  }

  /** PHI constant — the foundation */
  readonly PHI = PHI;
  readonly PHI_INVERSE = PHI_INVERSE;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON — One synthesis organism per runtime
// ═══════════════════════════════════════════════════════════════════════════════

let _synthesisOrganism: SynthesisOrganism | null = null;

export function getSynthesisOrganism(): SynthesisOrganism {
  if (!_synthesisOrganism) {
    _synthesisOrganism = new SynthesisOrganism();
  }
  return _synthesisOrganism;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT — Module-level convenience
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  synthesize,
  seedKnowledge,
  getSynthesisOrganism,
  getKnowledgeBase,
  getAllSystems,
  getAllPasses,
  getSynthesisPass,
  querySystemByName,
  SynthesisOrganism,
};
