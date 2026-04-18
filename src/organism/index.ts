/**
 * 𓂀 MEDINA MEMORY SYSTEMS - SOVEREIGN ORGANISM CORE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This is the main export file for the Sovereign Organism architecture.
 * 
 * Systems included:
 * - PRISMA: Visual/Effect Processing Framework (30 tools)
 * - SUBSTRATE: Binary/Computation Processing Framework (30 tools)
 * - ORO Vision: Screen reading and visual perception
 * - NOVA Hearing: Voice recognition and audio processing
 * - Sovereign Access: Comprehensive permission system
 * - Meta Model: Central intelligence that processes everything
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @version 1.0.0
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

/**
 * Unified Organism Interface
 * 
 * Single entry point to all organism capabilities
 */
export class SovereignOrganism {
  // Core systems
  public readonly metaModel: SovereignMetaModel;
  public readonly vision: OroVision;
  public readonly hearing: NovaHearing;
  public readonly access: SovereignAccessController;
  
  // Controllers
  public readonly keyboard: KeyboardController;
  public readonly mouse: MouseController;
  public readonly tabs: TabController;
  public readonly internet: InternetController;
  public readonly freeMove: FreeMoveController;
  
  // Tools
  public readonly PRISMA = PRISMA;
  public readonly SUBSTRATE = SUBSTRATE;
  
  // Constants
  public readonly CONSTANTS = {
    PRISMA: PRISMA_CONSTANTS,
    SUBSTRATE: SUBSTRATE_CONSTANTS,
    VISION: VISION_CONSTANTS,
    HEARING: HEARING_CONSTANTS,
    META: META_CONSTANTS,
    ACCESS: ACCESS_CONSTANTS,
  };
  
  constructor() {
    // Initialize core systems
    this.metaModel = getMetaModel();
    this.vision = this.metaModel.getVision();
    this.hearing = this.metaModel.getHearing();
    this.access = this.metaModel.getAccessController();
    
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
    this.metaModel.start();
    console.log('☥ Organism is now alive and processing');
  }
  
  /**
   * Stop the organism
   */
  stop(): void {
    console.log('Ω Sovereign Organism: Entering dormancy...');
    this.metaModel.stop();
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
  
  // All constants
  CONSTANTS: {
    PRISMA: PRISMA_CONSTANTS,
    SUBSTRATE: SUBSTRATE_CONSTANTS,
    VISION: VISION_CONSTANTS,
    HEARING: HEARING_CONSTANTS,
    META: META_CONSTANTS,
    ACCESS: ACCESS_CONSTANTS,
  },
};
