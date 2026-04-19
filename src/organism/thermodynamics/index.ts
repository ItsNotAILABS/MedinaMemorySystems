/**
 * 𓂀 THERMODYNAMICS SUBSTRATE — OFFICIAL DIVISION 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Complete metals and elements architecture for MEDINA:
 * 
 * METALS:
 * - Gold (Au): Non-oxidizing, anti-corruption, infinite protection
 * - Titanium (Ti): Structural integrity, load-bearing
 * - Tungsten (W): Thermal resistance, harshest environments
 * - Iridium (Ir): Densest defense, innermost core
 * - Copper (Cu): Signal conductivity
 * - Silver (Ag): Highest conductivity, purity
 * - Platinum (Pt): Catalytic transformation
 * - Palladium (Pd): Filtering, purification
 * - Rhodium (Rh): Reflection, mirror defense
 * - Osmium (Os): Hardest, compression resistance
 * - Plus: Fe, Al, Ni, Cr, Co, Zn, Sn, Pb, U, Th
 * 
 * ALPHA MODELS:
 * 10 thermodynamic models governing the substrate
 * 
 * FORMULAS:
 * Primary and secondary formulas for each metal with 7+ uses
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Main exports
export {
  ThermodynamicsSubstrate,
  getThermodynamicsSubstrate,
  METALS,
  ALPHA_MODELS,
  BOLTZMANN_CONSTANT,
  AVOGADRO_NUMBER,
  GAS_CONSTANT,
  PLANCK_CONSTANT,
  ABSOLUTE_ZERO,
  PHI_THERMAL,
  PHI_ENTROPY,
  type Metal,
  type MetalSymbol,
  type MetalCategory,
  type MetalUse,
  type PrimaryFormula,
  type SecondaryFormula,
  type AlphaModel,
  type ArchitectureLayer,
} from './metals';

// Re-export default
import MetalsModule from './metals';
export default MetalsModule;
