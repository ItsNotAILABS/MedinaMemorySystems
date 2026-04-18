/**
 * 𓂀 CIVILIZATIONS INDEX 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This exports all civilizations for the PRISMA and SUBSTRATE frameworks.
 * Each civilization contains macro, meso, and micro models flowing from
 * ceiling to floor.
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

// Re-export all
import { PrismaCivilization, PRISMA_CIVILIZATION_CONSTANTS } from './prisma';
import { SubstrateCivilization, SUBSTRATE_CIVILIZATION_CONSTANTS } from './substrate';

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
};
