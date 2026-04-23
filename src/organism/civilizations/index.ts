/**
 * 𓂀 CIVILIZATIONS INDEX 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This exports all civilizations for the PRISMA and SUBSTRATE frameworks.
 * Each civilization contains macro, meso, and micro models flowing from
 * ceiling to floor.
 * 
 * And MACRO-ORGANISMAL ARCHITECTURE:
 * The right way to read civilization — not as artifacts but as architectures
 * for stabilizing relations between field, matter, memory, power, ritual, transfer.
 * 
 * @version 1.0.0
 * @author Sovereign Organism
 */

export { 
  PrismaCivilization,
  MACRO_MODELS as PRISMA_MACRO_MODELS,
  MESO_MODELS as PRISMA_MESO_MODELS,
  MICRO_MODELS as PRISMA_MICRO_MODELS,
  FLOOR_MODELS as PRISMA_FLOOR_MODELS,
  PRISMA_CIVILIZATION_CONSTANTS,
  type CivilizationModel,
  type CivilizationLayer,
  type CivilizationState,
} from './prisma';

export {
  SubstrateCivilization,
  MACRO_MODELS as SUBSTRATE_MACRO_MODELS,
  MESO_MODELS as SUBSTRATE_MESO_MODELS,
  MICRO_MODELS as SUBSTRATE_MICRO_MODELS,
  FLOOR_MODELS as SUBSTRATE_FLOOR_MODELS,
  SUBSTRATE_CIVILIZATION_CONSTANTS,
} from './substrate';

// Macro-Organismal Architecture
export {
  // Types
  type ArchitecturalRelation,
  type RelationStabilization,
  type ArchitecturalObject,
  type TricksterOperation,
  type Trickster,
  type CivilizationArchitecture,
  type TechStackMapping,
  
  // Architectural Objects
  PYRAMID,
  CODEX,
  CITY_GRID,
  TEMPLE,
  CALENDAR,
  TRADE_ROUTE,
  IRRIGATION_SYSTEM,
  BURIAL_SYSTEM,
  GLYPH_SYSTEM,
  LEGAL_FORM,
  ASTRONOMICAL_ALIGNMENT,
  METALLURGY,
  ARCHITECTURAL_OBJECTS,
  
  // Trickster
  TRICKSTER_OPERATIONS,
  TRICKSTER_INSIGHT,
  TRICKSTERS,
  createTrickster,
  
  // Civilizations
  EGYPT,
  MESOPOTAMIA,
  MESOAMERICA,
  CHINA,
  GREECE,
  ROME,
  INDIA,
  NORDIC,
  WEST_AFRICA,
  POLYNESIA,
  PACIFIC_NORTHWEST,
  CIVILIZATIONS as ANCIENT_CIVILIZATIONS,
  
  // Tech Stack Mapping
  TECH_STACK_MAPPINGS,
  
  // Analysis Functions
  getObjectsStabilizing,
  getCivilizationsWithRelation,
  getTricksterOperations,
  countDeepFunctions,
  readObject,
} from './macroOrganism';

// Re-export all
import { PrismaCivilization, PRISMA_CIVILIZATION_CONSTANTS } from './prisma';
import { SubstrateCivilization, SUBSTRATE_CIVILIZATION_CONSTANTS } from './substrate';
import MacroOrganism, { CIVILIZATIONS as ANCIENT_CIVILIZATIONS, TRICKSTER_INSIGHT } from './macroOrganism';

export const CIVILIZATIONS = {
  PRISMA: PrismaCivilization,
  SUBSTRATE: SubstrateCivilization,
};

export const CIVILIZATION_CONSTANTS = {
  PRISMA: PRISMA_CIVILIZATION_CONSTANTS,
  SUBSTRATE: SUBSTRATE_CIVILIZATION_CONSTANTS,
};

export default {
  PrismaCivilization,
  SubstrateCivilization,
  CIVILIZATIONS,
  CIVILIZATION_CONSTANTS,
  
  // Macro-Organismal Architecture
  MacroOrganism,
  ANCIENT_CIVILIZATIONS,
  TRICKSTER_INSIGHT,
};
