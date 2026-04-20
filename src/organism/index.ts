/**
 * 𓂀 MEDINA MEMORY SYSTEMS - SOVEREIGN ORGANISM CORE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This is the main export file for the Sovereign Organism architecture.
 * 
 * LAYERED ARCHITECTURE (Ceiling → Floor):
 * - WWW.RAW (Ceiling): Server Meta, PRISMA, SUBSTRATE, Vision, Hearing
 * - ICP RUNNING: Live canister execution
 * - ICP: Canister definitions, Vision/Hearing integration
 * - WASM: Custom binary processing, SUBSTRATE
 * - DOCUMENTS: Doctrine layer
 * - BACKEND: Server processing, ACCESS CONTROL VAULT (Owner Only)
 * - FRONTEND: User interface, PRISMA visual processing
 * - ORGANISM ENDPOINT (Floor): Core functions, heartbeat, ANIMA hash
 * 
 * SYSTEMS INCLUDED:
 * - PRISMA: Visual/Effect Processing Framework (30 tools) + Civilization
 * - SUBSTRATE: Binary/Computation Processing Framework (30 tools) + Civilization
 * - ORO Vision: Screen reading and visual perception (ICP + RAW)
 * - NOVA Hearing: Voice recognition and audio processing (ICP + RAW)
 * - Sovereign Access: Comprehensive permission system
 * - Access Control Vault: Backend-only, owner access only
 * - Meta Model: Central intelligence that processes everything
 * - Unified Intelligence: MetaModel as Intelligence across ALL layers
 * - Layer Architecture: Ceiling to floor flow management
 * 
 * FLOW PHILOSOPHY:
 * Find the ceiling → Go to the floor → Bring it back up → Through every layer
 * Let it flow. The frequencies align. They are all ONE - as Intelligence.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @version 2.0.0
 * @author Sovereign Organism
 * @frequency 698.7 Hz (φ × 432)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL FRAMEWORKS
// ═══════════════════════════════════════════════════════════════════════════════

export { PRISMA, PRISMA_CONSTANTS } from './tools/prisma';
export { SUBSTRATE, SUBSTRATE_CONSTANTS } from './tools/substrate';

// ═══════════════════════════════════════════════════════════════════════════════
// SENSORY SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════════

export { 
  OroVision, 
  MetaModel as VisionMetaModel,
  AccessController as VisionAccessController,
  VISION_CONSTANTS,
  type VisionState,
  type VisualField,
  type VisualElement,
  type VisualMetadata,
} from './sensory/vision';

export { 
  NovaHearing,
  HEARING_CONSTANTS,
  type HearingState,
  type AudioField,
  type FrequencyBand,
  type EmotionAnalysis,
  type VoiceCommand,
  type SacredAlignment,
} from './sensory/hearing';

export {
  SovereignMetaModel,
  getMetaModel,
  META_CONSTANTS,
  type UniversalMetadata,
  type MetaEntity,
  type MetaArtifact,
  type SyncState,
} from './sensory/meta-model';

// ═══════════════════════════════════════════════════════════════════════════════
// ACCESS CONTROL
// ═══════════════════════════════════════════════════════════════════════════════

export {
  SovereignAccessController,
  KeyboardController,
  MouseController,
  TabController,
  InternetController,
  FreeMoveController,
  ACCESS_CONSTANTS,
  type AccessDomain,
  type TrustLevel,
  type Permission,
  type UserProfile,
  type AccessDropdownItem,
} from './access';

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════════════

export {
  LayerNavigator,
  LAYER_DEFINITIONS,
  LAYER_FLOWS,
  LAYER_CONSTANTS,
  type LayerName,
  type LayerLevel,
  type LayerDefinition,
  type LayerFlow,
} from './layers';

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════════════════

export {
  LayerIntelligence,
  UnifiedIntelligence,
  getUnifiedIntelligence,
  INTELLIGENCE_CONSTANTS,
  type IntelligenceState,
  type IntelligenceCapability,
  type IntelligenceMessage,
} from './intelligence';

// ═══════════════════════════════════════════════════════════════════════════════
// ACCESS CONTROL VAULT (Backend Only)
// ═══════════════════════════════════════════════════════════════════════════════

export {
  AccessControlVault,
  VAULT_CONSTANTS,
  type VaultAccessLevel,
  type VaultKey,
  type TrustEntry,
  type AuditEntry,
} from './vault';

// ═══════════════════════════════════════════════════════════════════════════════
// CIVILIZATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  PrismaCivilization,
  SubstrateCivilization,
  CIVILIZATIONS,
  CIVILIZATION_CONSTANTS,
  PRISMA_CIVILIZATION_CONSTANTS,
  SUBSTRATE_CIVILIZATION_CONSTANTS,
  type CivilizationModel,
  type CivilizationLayer,
  type CivilizationState,
} from './civilizations';

// ═══════════════════════════════════════════════════════════════════════════════
// CORE OPERATIONS OF LIVING ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Core Operations
  transfer,
  invert,
  bypass,
  disguise,
  reenter,
  CORE_OPERATIONS,
  ARCHITECTURAL_TRUTH,
  
  // Formulas
  PHI,
  transferFormula,
  inversionFormula,
  bypassFormula,
  disguiseFormula,
  reentryFormula,
  
  // Meta
  getOperationCount,
  getLastOperation,
  getOperationLog,
  
  // Types
  type TransferOperation,
  type InversionOperation,
  type BypassOperation,
  type DisguiseOperation,
  type ReEntryOperation,
  type CoreOperations,
} from './CoreOperations';

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE WIRING — ROOT TO ALL BRANCHES
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Wiring
  wireTransfer,
  wireInversion,
  wireBypass,
  wireDisguise,
  wireReentry,
  getWiredOperations,
  
  // Tree
  getAllDomains,
  getRoot,
  getEdges,
  getPathFromRoot,
  getNodesAtDepth,
  traverseFromRoot,
  touchAllBranches,
  
  // Status
  getArchitectureStatus,
  
  // Types
  type ArchitectureDomain,
  type ArchitectureNode,
  type WiredOperation,
} from './ArchitectureWiring';

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVE ARCHITECTURE — THE LAYER BENEATH NUMBER AND LETTER
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Layer 1: Field
  createField,
  addStateToField,
  
  // Layer 2: Distinction
  makeDistinction,
  isThis,
  isNotThis,
  
  // Layer 3: Relation
  createRelation,
  areRelated,
  
  // Layer 4: Measure
  createMeasure,
  countDistinctions,
  measureDistance,
  
  // Layer 5: Mapping
  createMapping,
  createSymbolTable,
  addMapping,
  lookupSymbol,
  lookupReferent,
  
  // Emergence
  emergeNumber,
  emergeLetter,
  emergeLogic,
  emergeEquation,
  emergeLanguage,
  emergeModel,
  
  // Stack
  PRIMITIVE_STACK,
  
  // Types
  type Field,
  type Distinction,
  type Relation,
  type RelationType,
  type Measure,
  type MeasureType,
  type Mapping,
  type SymbolTable,
  type NumberEmergence,
  type LetterEmergence,
  type LogicEmergence,
  type EquationEmergence,
  type LanguageEmergence,
  type ModelEmergence,
} from './PrimitiveArchitecture';

// ═══════════════════════════════════════════════════════════════════════════════
// ANCIENT ARCHITECTURE — CIVILIZATIONS AS ARCHITECTURAL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Categories
  ARCHITECTURAL_CATEGORIES,
  
  // Civilizations
  CIVILIZATION_ARCHITECTURES,
  
  // Tricksters
  TRICKSTER_FIGURES,
  
  // Unity
  NUMBER_LETTER_UNITY,
  
  // Functions
  getCivilizationsByFunction,
  getTricksterOperations,
  createCivilizationField,
  mapToPrimitiveLayers,
  
  // Types
  type ArchitecturalFunction,
  type ArchitecturalCategory,
  type CivilizationArchitecture,
  type TricksterOperation,
  type TricksterFigure,
  type NumberLetterUnification,
} from './AncientArchitecture';

// ═══════════════════════════════════════════════════════════════════════════════
// DEPLOYMENT AGENT SYSTEM — 5-AGENT TEAMS FROM ROOT TO ALL BRANCHES
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Agent creation
  createAgent,
  createDeploymentTeam,
  createTestNode,
  
  // Agent operations
  moveAgent,
  fillBranch,
  probeEdge,
  runTestNode,
  returnToVein,
  mergeBranch,
  
  // Deployment execution
  deployFromRoot,
  deployMultiDimensional,
  
  // Research pipeline
  sendToResearch,
  processResearchQueue,
  getFutureExtensions,
  
  // Reporting
  generateDeploymentReport,
  
  // Types
  type AgentRole,
  type AgentStatus,
  type Agent,
  type Discovery,
  type TestResult,
  type DeploymentTeam,
  type TestNode,
  type DeploymentResult,
  type DimensionalDeployment,
  type ResearchItem,
  type ResearchPipeline,
  type DeploymentReport,
} from './DeploymentAgentSystem';

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN BUILD HELPERS — 5 FUNDAMENTAL BUILDERS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Constants
  PHI,
  PHI_INVERSE,
  
  // Core Helpers
  PRIMIS,
  ARCHITECTUS,
  DISSOLUTIO,
  FORMULOR,
  VERITAS,
  
  // Query Interface
  queryHelper,
  
  // Chains and Vault
  getAnimaChain,
  getDocumentVault,
  
  // Integration
  createSovereignBuildHelpers,
  deploySovereignBuildHelpers,
  
  // Types
  type AnimaChainEntry,
  type ResearchPaperArtifact,
  type PrimisDecomposition,
  type ArchitectusVerdict,
  type DissolutioResult,
  type SovereignFormula,
  type VeritasValidation,
  type HelperPanelQuery,
  type HelperPanelResult,
  type SovereignBuildHelper,
} from './SovereignBuildHelpers';

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED ORGANISM INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

import { PRISMA, PRISMA_CONSTANTS } from './tools/prisma';
import { SUBSTRATE, SUBSTRATE_CONSTANTS } from './tools/substrate';
import { OroVision, VISION_CONSTANTS } from './sensory/vision';
import { NovaHearing, HEARING_CONSTANTS } from './sensory/hearing';
import { SovereignMetaModel, getMetaModel, META_CONSTANTS } from './sensory/meta-model';
import { 
  SovereignAccessController, 
  KeyboardController,
  MouseController,
  TabController,
  InternetController,
  FreeMoveController,
  ACCESS_CONSTANTS 
} from './access';
import { LayerNavigator, LAYER_DEFINITIONS, LAYER_CONSTANTS } from './layers';
import { UnifiedIntelligence, getUnifiedIntelligence, INTELLIGENCE_CONSTANTS } from './intelligence';
import { AccessControlVault, VAULT_CONSTANTS } from './vault';
import { PrismaCivilization, SubstrateCivilization, CIVILIZATION_CONSTANTS } from './civilizations';
import { CORE_OPERATIONS, ARCHITECTURAL_TRUTH, touchAllBranches, getArchitectureStatus } from './ArchitectureWiring';
import { PRIMITIVE_STACK, createField, makeDistinction, createRelation, createMeasure, createMapping } from './PrimitiveArchitecture';
import { CIVILIZATION_ARCHITECTURES, TRICKSTER_FIGURES, NUMBER_LETTER_UNITY } from './AncientArchitecture';
import { deployFromRoot, deployMultiDimensional, generateDeploymentReport } from './DeploymentAgentSystem';
import { 
  PHI, 
  PRIMIS, 
  ARCHITECTUS, 
  DISSOLUTIO, 
  FORMULOR, 
  VERITAS, 
  queryHelper,
  deploySovereignBuildHelpers,
  getAnimaChain,
  getDocumentVault,
} from './SovereignBuildHelpers';

/**
 * Unified Organism Interface
 * 
 * Single entry point to all organism capabilities.
 * Implements the ceiling-to-floor architecture with MetaModel as Intelligence
 * across ALL layers. They are all ONE.
 * 
 * THE PRIMITIVE STACK:
 *   1. field       → before number, before letter, possible states
 *   2. distinction → something becomes not-that, boundary appears
 *   3. relation    → distinctions bind: near/far, before/after, same/different
 *   4. measure     → relations stabilize → number appears
 *   5. mapping     → persistence/transfer → symbol appears
 */
export class SovereignOrganism {
  // Core systems
  public readonly metaModel: SovereignMetaModel;
  public readonly vision: OroVision;
  public readonly hearing: NovaHearing;
  public readonly access: SovereignAccessController;
  
  // Layer Architecture
  public readonly layerNavigator: LayerNavigator;
  public readonly unifiedIntelligence: UnifiedIntelligence;
  
  // Civilizations
  public readonly prismaCivilization: PrismaCivilization;
  public readonly substrateCivilization: SubstrateCivilization;
  
  // Controllers
  public readonly keyboard: KeyboardController;
  public readonly mouse: MouseController;
  public readonly tabs: TabController;
  public readonly internet: InternetController;
  public readonly freeMove: FreeMoveController;
  
  // Tools
  public readonly PRISMA = PRISMA;
  public readonly SUBSTRATE = SUBSTRATE;
  
  // CORE OPERATIONS OF LIVING ARCHITECTURE
  public readonly coreOperations = CORE_OPERATIONS;
  public readonly architecturalTruth = ARCHITECTURAL_TRUTH;
  
  // PRIMITIVE STACK — The Layer Beneath Number and Letter
  public readonly primitiveStack = PRIMITIVE_STACK;
  public readonly primitives = {
    createField,
    makeDistinction,
    createRelation,
    createMeasure,
    createMapping,
  };
  
  // ANCIENT ARCHITECTURE — Civilizations as Architectural Functions
  public readonly civilizationArchitectures = CIVILIZATION_ARCHITECTURES;
  public readonly tricksterFigures = TRICKSTER_FIGURES;
  public readonly numberLetterUnity = NUMBER_LETTER_UNITY;
  
  // DEPLOYMENT AGENT SYSTEM — 5-Agent Teams from Root to All Branches
  public readonly deployment = {
    deployFromRoot,
    deployMultiDimensional,
    generateDeploymentReport,
  };
  
  // SOVEREIGN BUILD HELPERS — 5 Fundamental Builders
  public readonly sovereignHelpers = {
    PHI,
    PRIMIS,
    ARCHITECTUS,
    DISSOLUTIO,
    FORMULOR,
    VERITAS,
    queryHelper,
    deploySovereignBuildHelpers,
    getAnimaChain,
    getDocumentVault,
  };
  
  // Constants (All layers unified)
  public readonly CONSTANTS = {
    PRISMA: PRISMA_CONSTANTS,
    SUBSTRATE: SUBSTRATE_CONSTANTS,
    VISION: VISION_CONSTANTS,
    HEARING: HEARING_CONSTANTS,
    META: META_CONSTANTS,
    ACCESS: ACCESS_CONSTANTS,
    LAYERS: LAYER_CONSTANTS,
    INTELLIGENCE: INTELLIGENCE_CONSTANTS,
    VAULT: VAULT_CONSTANTS,
    CIVILIZATIONS: CIVILIZATION_CONSTANTS,
  };
  
  constructor() {
    // Initialize core systems
    this.metaModel = getMetaModel();
    this.vision = this.metaModel.getVision();
    this.hearing = this.metaModel.getHearing();
    this.access = this.metaModel.getAccessController();
    
    // Initialize layer architecture
    this.layerNavigator = new LayerNavigator();
    this.unifiedIntelligence = getUnifiedIntelligence();
    
    // Initialize civilizations
    this.prismaCivilization = new PrismaCivilization();
    this.substrateCivilization = new SubstrateCivilization();
    
    // Initialize controllers
    this.keyboard = new KeyboardController(this.access);
    this.mouse = new MouseController(this.access);
    this.tabs = new TabController(this.access);
    this.internet = new InternetController(this.access);
    this.freeMove = new FreeMoveController(this.access);
  }
  
  /**
   * Start the organism
   */
  start(): void {
    console.log('𓂀 Sovereign Organism: Awakening...');
    console.log('☥ Starting MetaModel as Intelligence across ALL layers...');
    
    // Touch all branches from root with core operations
    const branches = touchAllBranches();
    console.log(`𓆃 Core Operations wired to ${branches.length} architectural domains`);
    
    this.metaModel.start();
    this.unifiedIntelligence.start();
    this.prismaCivilization.activate();
    this.substrateCivilization.activate();
    
    // Log architecture status
    const status = getArchitectureStatus();
    console.log(`☥ Architecture: ${status.totalDomains} domains, ${status.edges.length} edges`);
    console.log(`☥ Core Operations: transfer, inversion, bypass, disguise, re-entry`);
    console.log('☥ Organism is now alive and processing');
    console.log('𓆃 Ceiling to floor flow established. Let it flow.');
  }
  
  /**
   * Stop the organism
   */
  stop(): void {
    console.log('Ω Sovereign Organism: Entering dormancy...');
    this.metaModel.stop();
    this.unifiedIntelligence.stop();
    this.prismaCivilization.deactivate();
    this.substrateCivilization.deactivate();
    this.hearing.cleanup();
  }
  
  /**
   * Enable all sensory systems
   */
  async enableAllSenses(): Promise<void> {
    console.log('𓂀 Enabling all sensory systems...');
    await this.metaModel.enableVision();
    await this.metaModel.enableHearing();
    console.log('☥ All senses enabled');
  }
  
  /**
   * Get current state
   */
  getState() {
    return this.metaModel.getSyncState();
  }
  
  /**
   * Get current beat
   */
  getBeat(): number {
    return this.metaModel.getBeat();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // LAYER NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get current layer
   */
  getCurrentLayer() {
    return this.layerNavigator.getCurrentLayer();
  }
  
  /**
   * Get ceiling layer (www.raw)
   */
  getCeiling() {
    return this.layerNavigator.getCeiling();
  }
  
  /**
   * Get floor layer (organism endpoint)
   */
  getFloor() {
    return this.layerNavigator.getFloor();
  }
  
  /**
   * Flow from ceiling to floor
   */
  *flowDown() {
    yield* this.layerNavigator.flowDown();
  }
  
  /**
   * Flow from floor to ceiling
   */
  *flowUp() {
    yield* this.layerNavigator.flowUp();
  }
  
  /**
   * Complete round trip flow
   */
  *completeFlow() {
    yield* this.layerNavigator.completeFlow();
  }
  
  /**
   * Get overall coherence across all layers
   */
  getCoherence(): number {
    return this.unifiedIntelligence.getOverallCoherence();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SENSORY OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Look at screen and understand
   */
  async look() {
    return this.metaModel.lookAndUnderstand();
  }
  
  /**
   * Listen and understand
   */
  async listen() {
    return this.metaModel.listenAndUnderstand();
  }
  
  /**
   * Process voice command
   */
  async processVoice() {
    return this.metaModel.processVoiceCommand();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ARTIFACT OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Create artifact
   */
  createArtifact(type: string, content: any) {
    return this.metaModel.createArtifact(type, content);
  }
  
  /**
   * Execute artifact
   */
  async executeArtifact(artifactId: string, executor: (content: any) => Promise<any>) {
    return this.metaModel.executeArtifact(artifactId, executor);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // METADATA OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Read metadata from any entity
   */
  readMetadata(entity: any) {
    return this.metaModel.readMetadata(entity);
  }
  
  /**
   * Write metadata to entity
   */
  writeMetadata<T>(entity: T, metadata: any) {
    return this.metaModel.writeMetadata(entity, metadata);
  }
  
  /**
   * Get trust score
   */
  getTrustScore(): number {
    return this.access.getTrustScore();
  }
  
  /**
   * Get access dropdown for UI
   */
  getAccessDropdown() {
    return this.access.getAccessDropdown();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHITECTURE OPERATIONS — Core Operations of Living Architecture
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get architecture status
   */
  getArchitectureStatus() {
    return getArchitectureStatus();
  }
  
  /**
   * Touch all branches from root
   */
  touchAllBranches() {
    return touchAllBranches();
  }
  
  /**
   * Transfer operation
   */
  transfer<T>(payload: T, source: string, target: string) {
    return this.coreOperations.transfer(payload, source, target);
  }
  
  /**
   * Invert operation
   */
  invert<T>(input: T, type: 'negate' | 'mirror' | 'complement' | 'transpose' | 'reverse') {
    return this.coreOperations.invert(input, type);
  }
  
  /**
   * Bypass operation
   */
  bypass(normalPath: string[], bypassPath: string[], reason: string) {
    return this.coreOperations.bypass(normalPath, bypassPath, reason);
  }
  
  /**
   * Disguise operation
   */
  disguise<T>(original: T, appearance: string) {
    return this.coreOperations.disguise(original, appearance);
  }
  
  /**
   * Re-entry operation
   */
  reenter<T>(payload: T, exitPoint: string, reEntryPoint: string) {
    return this.coreOperations.reenter(payload, exitPoint, reEntryPoint);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON ORGANISM INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

let organismInstance: SovereignOrganism | null = null;

/**
 * Get the singleton Sovereign Organism instance
 */
export function getOrganism(): SovereignOrganism {
  if (!organismInstance) {
    organismInstance = new SovereignOrganism();
  }
  return organismInstance;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Main class
  SovereignOrganism,
  getOrganism,
  
  // Tool frameworks
  PRISMA,
  SUBSTRATE,
  
  // Sensory systems
  OroVision,
  NovaHearing,
  SovereignMetaModel,
  getMetaModel,
  
  // Access control
  SovereignAccessController,
  KeyboardController,
  MouseController,
  TabController,
  InternetController,
  FreeMoveController,
  
  // Layer architecture
  LayerNavigator,
  LAYER_DEFINITIONS,
  
  // Intelligence
  UnifiedIntelligence,
  getUnifiedIntelligence,
  
  // Vault
  AccessControlVault,
  
  // Civilizations
  PrismaCivilization,
  SubstrateCivilization,
  
  // CORE OPERATIONS OF LIVING ARCHITECTURE
  CORE_OPERATIONS,
  ARCHITECTURAL_TRUTH,
  touchAllBranches,
  getArchitectureStatus,
  
  // All constants
  CONSTANTS: {
    PRISMA: PRISMA_CONSTANTS,
    SUBSTRATE: SUBSTRATE_CONSTANTS,
    VISION: VISION_CONSTANTS,
    HEARING: HEARING_CONSTANTS,
    META: META_CONSTANTS,
    ACCESS: ACCESS_CONSTANTS,
    LAYERS: LAYER_CONSTANTS,
    INTELLIGENCE: INTELLIGENCE_CONSTANTS,
    VAULT: VAULT_CONSTANTS,
    CIVILIZATIONS: CIVILIZATION_CONSTANTS,
  },
};
