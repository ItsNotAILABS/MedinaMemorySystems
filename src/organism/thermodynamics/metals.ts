/**
 * 𓂀 THERMODYNAMICS SUBSTRATE — METALS & ELEMENTS 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * OFFICIAL SUBSTRATE DIVISION
 * 
 * Every metal has:
 * - PRIMARY FORMULA: The fundamental thermodynamic property
 * - SECONDARY FORMULAS: Load, resistance, conductivity, etc.
 * - 7+ USES: Where it goes in the architecture
 * 
 * METALS:
 * - GOLD (Au): Non-oxidizing, anti-corruption, infinite protection
 * - TITANIUM (Ti): Structural integrity, load-bearing, never yields
 * - TUNGSTEN (W): Thermal resistance, harshest environments
 * - IRIDIUM (Ir): Densest defense, innermost core, impenetrable
 * - COPPER (Cu): Signal conductivity, electron flow
 * - SILVER (Ag): Highest conductivity, purity
 * - PLATINUM (Pt): Catalytic transformation, stability
 * - PALLADIUM (Pd): Hydrogen absorption, filtering
 * - RHODIUM (Rh): Reflection, mirror defense
 * - OSMIUM (Os): Hardest natural element, compression resistance
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { PHI, PHI_SQUARED, PHI_CUBED } from '../../lib/novaSovereignEncryption';
import { fibonacci } from '../../lib/icpOrganism';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS — Thermodynamic foundations
// ═══════════════════════════════════════════════════════════════════════════════

export const BOLTZMANN_CONSTANT = 1.380649e-23; // J/K
export const AVOGADRO_NUMBER = 6.02214076e23; // mol⁻¹
export const GAS_CONSTANT = 8.314462618; // J/(mol·K)
export const PLANCK_CONSTANT = 6.62607015e-34; // J·s
export const ABSOLUTE_ZERO = -273.15; // °C

// PHI-scaled thermodynamic multipliers
export const PHI_THERMAL = PHI * 100; // ≈161.8 thermal units
export const PHI_ENTROPY = 1 / PHI; // ≈0.618 entropy balance

// ═══════════════════════════════════════════════════════════════════════════════
// METAL TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type MetalSymbol = 
  | 'Au' // Gold
  | 'Ti' // Titanium
  | 'W'  // Tungsten
  | 'Ir' // Iridium
  | 'Cu' // Copper
  | 'Ag' // Silver
  | 'Pt' // Platinum
  | 'Pd' // Palladium
  | 'Rh' // Rhodium
  | 'Os' // Osmium
  | 'Fe' // Iron
  | 'Al' // Aluminum
  | 'Ni' // Nickel
  | 'Cr' // Chromium
  | 'Co' // Cobalt
  | 'Zn' // Zinc
  | 'Sn' // Tin
  | 'Pb' // Lead (shielding)
  | 'U'  // Uranium (power)
  | 'Th' // Thorium (power)
  ;

export type MetalCategory = 
  | 'noble'       // Gold, Platinum, Palladium
  | 'refractory'  // Tungsten, Iridium, Osmium
  | 'structural'  // Titanium, Iron, Aluminum
  | 'conductive'  // Copper, Silver
  | 'catalytic'   // Platinum, Rhodium, Palladium
  | 'shielding'   // Lead, Osmium
  | 'power'       // Uranium, Thorium
  ;

export type ArchitectureLayer = 
  | 'core'        // Innermost, most protected
  | 'kernel'      // Processing layer
  | 'memory'      // Storage layer
  | 'network'     // Communication layer
  | 'interface'   // User-facing layer
  | 'defense'     // Protection layer
  | 'endpoint'    // Touch points
  | 'tool'        // Operational tools
  ;

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMARY FORMULA — The fundamental thermodynamic property
// ═══════════════════════════════════════════════════════════════════════════════

export interface PrimaryFormula {
  name: string;
  symbol: string;
  equation: string;
  description: string;
  value: number; // Computed value
  unit: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECONDARY FORMULA — Derived properties
// ═══════════════════════════════════════════════════════════════════════════════

export interface SecondaryFormula {
  name: string;
  symbol: string;
  equation: string;
  description: string;
  derivedFrom: string; // Primary formula reference
  value: number;
  unit: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// METAL USE — Where metal goes in the architecture
// ═══════════════════════════════════════════════════════════════════════════════

export interface MetalUse {
  layer: ArchitectureLayer;
  component: string;
  purpose: string;
  formula: string; // Which formula applies
  intensity: number; // 0-1, how much metal is used
}

// ═══════════════════════════════════════════════════════════════════════════════
// METAL — Complete metal definition
// ═══════════════════════════════════════════════════════════════════════════════

export interface Metal {
  symbol: MetalSymbol;
  name: string;
  atomicNumber: number;
  atomicMass: number; // g/mol
  category: MetalCategory;
  meltingPoint: number; // °C
  boilingPoint: number; // °C
  density: number; // g/cm³
  
  // Thermodynamic properties
  specificHeat: number; // J/(g·K)
  thermalConductivity: number; // W/(m·K)
  electricalResistivity: number; // Ω·m
  gibbsFreeEnergy: number; // kJ/mol (formation)
  entropy: number; // J/(mol·K)
  
  // Formulas
  primaryFormula: PrimaryFormula;
  secondaryFormulas: SecondaryFormula[];
  
  // Uses (7+ per metal)
  uses: MetalUse[];
  
  // Alloy compatibility
  alloysWell: MetalSymbol[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALPHA MODELS — 10 thermodynamic models for the substrate
// ═══════════════════════════════════════════════════════════════════════════════

export interface AlphaModel {
  id: string;
  name: string;
  description: string;
  governingLaw: string;
  equation: string;
  metals: MetalSymbol[]; // Metals that apply
  uses: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// METAL DEFINITIONS — Full specifications
// ═══════════════════════════════════════════════════════════════════════════════

export const METALS: Record<MetalSymbol, Metal> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GOLD (Au) — Non-oxidizing, anti-corruption, infinite protection
  // ═══════════════════════════════════════════════════════════════════════════
  Au: {
    symbol: 'Au',
    name: 'Gold',
    atomicNumber: 79,
    atomicMass: 196.967,
    category: 'noble',
    meltingPoint: 1064.18,
    boilingPoint: 2856,
    density: 19.3,
    specificHeat: 0.129,
    thermalConductivity: 318,
    electricalResistivity: 2.44e-8,
    gibbsFreeEnergy: 0, // Standard state
    entropy: 47.4,
    
    primaryFormula: {
      name: 'Gibbs Free Energy of Oxidation',
      symbol: 'ΔG°(ox)',
      equation: 'ΔG° = ΔH° - TΔS° → ∞ (thermodynamically impossible)',
      description: 'Gold does not oxidize because ΔG° is positive (unfavorable). Corruption is thermodynamically impossible.',
      value: Number.POSITIVE_INFINITY,
      unit: 'kJ/mol',
    },
    
    secondaryFormulas: [
      {
        name: 'Oxidation Resistance',
        symbol: 'R(ox)',
        equation: 'R(ox) = 1 - e^(-ΔG°/RT)',
        description: 'Resistance to oxidation approaches 1 (100%) as ΔG° → ∞',
        derivedFrom: 'ΔG°(ox)',
        value: 1,
        unit: 'dimensionless',
      },
      {
        name: 'Corruption Impossibility',
        symbol: 'P(corrupt)',
        equation: 'P(corrupt) = e^(-ΔG°/kT) → 0',
        description: 'Probability of corruption is zero',
        derivedFrom: 'ΔG°(ox)',
        value: 0,
        unit: 'probability',
      },
      {
        name: 'Eternal Preservation',
        symbol: 't(preserve)',
        equation: 't = ∞ when ΔG° > 0',
        description: 'Gold preserves state indefinitely',
        derivedFrom: 'ΔG°(ox)',
        value: Number.POSITIVE_INFINITY,
        unit: 'years',
      },
      {
        name: 'Conductivity Preservation',
        symbol: 'σ(t)',
        equation: 'σ(t) = σ₀ (constant over time)',
        description: 'Conductivity never degrades',
        derivedFrom: 'ΔG°(ox)',
        value: 4.52e7,
        unit: 'S/m',
      },
      {
        name: 'Surface Integrity',
        symbol: 'I(surface)',
        equation: 'I = 1 - Σ(oxidation layers) = 1',
        description: 'Surface never forms oxide layers',
        derivedFrom: 'ΔG°(ox)',
        value: 1,
        unit: 'dimensionless',
      },
      {
        name: 'Quantum Coherence Time',
        symbol: 'τ(coherence)',
        equation: 'τ ∝ 1/oxidation_rate → ∞',
        description: 'Gold maintains quantum states indefinitely',
        derivedFrom: 'ΔG°(ox)',
        value: Number.POSITIVE_INFINITY,
        unit: 'seconds',
      },
      {
        name: 'PHI-Scaled Protection',
        symbol: 'P(φ)',
        equation: 'P(φ) = ΔG° × φ',
        description: 'Golden ratio amplified protection',
        derivedFrom: 'ΔG°(ox)',
        value: Number.POSITIVE_INFINITY * PHI,
        unit: 'φ-kJ/mol',
      },
    ],
    
    uses: [
      { layer: 'core', component: 'Sovereign Identity', purpose: 'Incorruptible identity storage', formula: 'ΔG°(ox)', intensity: 1 },
      { layer: 'kernel', component: 'Truth Registry', purpose: 'Immutable truth records', formula: 'P(corrupt)', intensity: 0.95 },
      { layer: 'memory', component: 'Eternal Memory', purpose: 'Preservation of memories forever', formula: 't(preserve)', intensity: 0.9 },
      { layer: 'network', component: 'Signal Purity', purpose: 'Non-degrading signal transmission', formula: 'σ(t)', intensity: 0.85 },
      { layer: 'interface', component: 'User Trust Layer', purpose: 'Trustworthy user interfaces', formula: 'I(surface)', intensity: 0.8 },
      { layer: 'defense', component: 'Anti-Corruption Shield', purpose: 'Prevents any corruption', formula: 'P(corrupt)', intensity: 1 },
      { layer: 'endpoint', component: 'API Endpoints', purpose: 'Clean, uncorrupted endpoints', formula: 'I(surface)', intensity: 0.9 },
      { layer: 'tool', component: 'Verification Tools', purpose: 'Tools that verify authenticity', formula: 'ΔG°(ox)', intensity: 0.85 },
    ],
    
    alloysWell: ['Ag', 'Cu', 'Pt', 'Pd'],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TITANIUM (Ti) — Structural integrity, load-bearing, never yields
  // ═══════════════════════════════════════════════════════════════════════════
  Ti: {
    symbol: 'Ti',
    name: 'Titanium',
    atomicNumber: 22,
    atomicMass: 47.867,
    category: 'structural',
    meltingPoint: 1668,
    boilingPoint: 3287,
    density: 4.506,
    specificHeat: 0.523,
    thermalConductivity: 21.9,
    electricalResistivity: 4.2e-7,
    gibbsFreeEnergy: -888.8, // TiO₂ formation
    entropy: 30.7,
    
    primaryFormula: {
      name: 'Yield Strength Ratio',
      symbol: 'σ_y/ρ',
      equation: 'σ_y/ρ = 240 MPa / 4.51 g/cm³ = 53.2 kN·m/kg',
      description: 'Highest strength-to-weight ratio. Structure never yields under load.',
      value: 53.2,
      unit: 'kN·m/kg',
    },
    
    secondaryFormulas: [
      {
        name: 'Load Bearing Capacity',
        symbol: 'F(max)',
        equation: 'F(max) = σ_y × A',
        description: 'Maximum load before yield',
        derivedFrom: 'σ_y/ρ',
        value: 240e6, // Pa
        unit: 'Pa',
      },
      {
        name: 'Fatigue Resistance',
        symbol: 'N(cycles)',
        equation: 'N = (σ_f/σ_a)^m',
        description: 'Cycles to failure, titanium has exceptional fatigue resistance',
        derivedFrom: 'σ_y/ρ',
        value: 1e9,
        unit: 'cycles',
      },
      {
        name: 'Phantom Elasticity',
        symbol: 'E(phantom)',
        equation: 'E = 116 GPa with recovery to original shape',
        description: 'Returns to original form after deformation',
        derivedFrom: 'σ_y/ρ',
        value: 116e9,
        unit: 'Pa',
      },
      {
        name: 'Corrosion Resistance',
        symbol: 'CR',
        equation: 'CR = 1/(corrosion_rate) → ∞ in most environments',
        description: 'Titanium forms protective oxide layer instantly',
        derivedFrom: 'σ_y/ρ',
        value: Number.POSITIVE_INFINITY,
        unit: 'years',
      },
      {
        name: 'Biocompatibility Index',
        symbol: 'BC',
        equation: 'BC = 1 (fully compatible)',
        description: 'Does not react with biological systems',
        derivedFrom: 'σ_y/ρ',
        value: 1,
        unit: 'dimensionless',
      },
      {
        name: 'Temperature Stability',
        symbol: 'T(stable)',
        equation: 'T(stable) = 0 to 1668°C',
        description: 'Maintains strength across temperature range',
        derivedFrom: 'σ_y/ρ',
        value: 1668,
        unit: '°C',
      },
      {
        name: 'PHI-Scaled Integrity',
        symbol: 'I(φ)',
        equation: 'I(φ) = (σ_y/ρ) × φ',
        description: 'Golden ratio amplified structural integrity',
        derivedFrom: 'σ_y/ρ',
        value: 53.2 * PHI,
        unit: 'φ-kN·m/kg',
      },
    ],
    
    uses: [
      { layer: 'core', component: 'Core Framework', purpose: 'Unbreakable core structure', formula: 'σ_y/ρ', intensity: 1 },
      { layer: 'kernel', component: 'Kernel Skeleton', purpose: 'Load-bearing kernel architecture', formula: 'F(max)', intensity: 0.95 },
      { layer: 'memory', component: 'Memory Scaffolding', purpose: 'Structural support for memory systems', formula: 'E(phantom)', intensity: 0.85 },
      { layer: 'network', component: 'Network Backbone', purpose: 'High-load network infrastructure', formula: 'F(max)', intensity: 0.9 },
      { layer: 'interface', component: 'Interface Framework', purpose: 'Durable user interface structure', formula: 'N(cycles)', intensity: 0.8 },
      { layer: 'defense', component: 'Structural Defense', purpose: 'Cannot be broken by force', formula: 'σ_y/ρ', intensity: 0.95 },
      { layer: 'endpoint', component: 'Endpoint Mounts', purpose: 'Secure mounting for all endpoints', formula: 'F(max)', intensity: 0.9 },
      { layer: 'tool', component: 'Tool Chassis', purpose: 'Durable tool frameworks', formula: 'E(phantom)', intensity: 0.85 },
    ],
    
    alloysWell: ['Al', 'Fe', 'Ni', 'Cr'],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TUNGSTEN (W) — Thermal resistance, survives harshest environments
  // ═══════════════════════════════════════════════════════════════════════════
  W: {
    symbol: 'W',
    name: 'Tungsten',
    atomicNumber: 74,
    atomicMass: 183.84,
    category: 'refractory',
    meltingPoint: 3422, // Highest of all metals
    boilingPoint: 5555,
    density: 19.25,
    specificHeat: 0.134,
    thermalConductivity: 173,
    electricalResistivity: 5.28e-8,
    gibbsFreeEnergy: -764.1, // WO₃ formation
    entropy: 32.6,
    
    primaryFormula: {
      name: 'Maximum Operating Temperature',
      symbol: 'T(max)',
      equation: 'T(max) = 3422°C (highest melting point of all metals)',
      description: 'Survives the harshest thermal environments',
      value: 3422,
      unit: '°C',
    },
    
    secondaryFormulas: [
      {
        name: 'Thermal Stress Resistance',
        symbol: 'R(thermal)',
        equation: 'R = σ_f × k / (E × α)',
        description: 'Resistance to thermal shock',
        derivedFrom: 'T(max)',
        value: 150,
        unit: 'W/m',
      },
      {
        name: 'Heat Dissipation Rate',
        symbol: 'Q(dissipate)',
        equation: 'Q = k × A × ΔT / L',
        description: 'How fast heat is dissipated',
        derivedFrom: 'T(max)',
        value: 173,
        unit: 'W/(m·K)',
      },
      {
        name: 'Environment Survival Index',
        symbol: 'ESI',
        equation: 'ESI = T(max) / T(environment)',
        description: 'Ratio of max temp to any environment temp',
        derivedFrom: 'T(max)',
        value: 3422 / 1500, // vs typical harsh environment
        unit: 'dimensionless',
      },
      {
        name: 'Radiation Resistance',
        symbol: 'R(rad)',
        equation: 'R(rad) = density × atomic_number',
        description: 'High density provides radiation shielding',
        derivedFrom: 'T(max)',
        value: 19.25 * 74,
        unit: 'g·Z/cm³',
      },
      {
        name: 'Hardness at Temperature',
        symbol: 'H(T)',
        equation: 'H(T) remains high even at elevated T',
        description: 'Maintains hardness even when hot',
        derivedFrom: 'T(max)',
        value: 7.5, // Mohs scale
        unit: 'Mohs',
      },
      {
        name: 'Creep Resistance',
        symbol: 'ε(creep)',
        equation: 'ε = A × σ^n × exp(-Q/RT)',
        description: 'Resists deformation under sustained load at high temp',
        derivedFrom: 'T(max)',
        value: 1e-10,
        unit: '1/s',
      },
      {
        name: 'PHI-Scaled Thermal',
        symbol: 'T(φ)',
        equation: 'T(φ) = T(max) × φ',
        description: 'Golden ratio scaled maximum temperature',
        derivedFrom: 'T(max)',
        value: 3422 * PHI,
        unit: 'φ-°C',
      },
    ],
    
    uses: [
      { layer: 'core', component: 'Core Heat Shield', purpose: 'Protects core from thermal damage', formula: 'T(max)', intensity: 1 },
      { layer: 'kernel', component: 'Kernel Thermal Barrier', purpose: 'Thermal isolation of kernel', formula: 'R(thermal)', intensity: 0.95 },
      { layer: 'memory', component: 'Memory Heat Sink', purpose: 'Dissipates heat from memory operations', formula: 'Q(dissipate)', intensity: 0.85 },
      { layer: 'network', component: 'Network Thermal Management', purpose: 'Prevents network overheating', formula: 'Q(dissipate)', intensity: 0.9 },
      { layer: 'interface', component: 'Interface Heat Shield', purpose: 'Protects interfaces from external heat', formula: 'ESI', intensity: 0.8 },
      { layer: 'defense', component: 'Thermal Defense Layer', purpose: 'Survives thermal attacks', formula: 'T(max)', intensity: 1 },
      { layer: 'endpoint', component: 'Endpoint Heat Resistance', purpose: 'Endpoints survive harsh conditions', formula: 'ESI', intensity: 0.9 },
      { layer: 'tool', component: 'Tool Heat Tolerance', purpose: 'Tools work in extreme conditions', formula: 'H(T)', intensity: 0.85 },
    ],
    
    alloysWell: ['Ni', 'Co', 'Fe', 'Cr'],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // IRIDIUM (Ir) — Densest defense, innermost core, impenetrable
  // ═══════════════════════════════════════════════════════════════════════════
  Ir: {
    symbol: 'Ir',
    name: 'Iridium',
    atomicNumber: 77,
    atomicMass: 192.217,
    category: 'refractory',
    meltingPoint: 2446,
    boilingPoint: 4428,
    density: 22.56, // Second densest element
    specificHeat: 0.131,
    thermalConductivity: 147,
    electricalResistivity: 4.71e-8,
    gibbsFreeEnergy: 0, // Very stable
    entropy: 35.5,
    
    primaryFormula: {
      name: 'Density Shield Factor',
      symbol: 'DSF',
      equation: 'DSF = ρ × Z / A = 22.56 × 77 / 192.2 = 9.04',
      description: 'Densest practical defense layer. Cannot be penetrated.',
      value: 9.04,
      unit: 'g·Z/(cm³·A)',
    },
    
    secondaryFormulas: [
      {
        name: 'Penetration Resistance',
        symbol: 'R(pen)',
        equation: 'R(pen) = ρ × hardness = 22.56 × 6.5 Mohs',
        description: 'Extremely hard to penetrate',
        derivedFrom: 'DSF',
        value: 22.56 * 6.5,
        unit: 'g·Mohs/cm³',
      },
      {
        name: 'Core Protection Factor',
        symbol: 'CPF',
        equation: 'CPF = 1 - P(penetration) → 1',
        description: 'Probability of protecting core approaches 1',
        derivedFrom: 'DSF',
        value: 0.9999,
        unit: 'probability',
      },
      {
        name: 'Corrosion Immunity',
        symbol: 'CI',
        equation: 'CI = 1 (immune to all corrosion)',
        description: 'Most corrosion-resistant element',
        derivedFrom: 'DSF',
        value: 1,
        unit: 'dimensionless',
      },
      {
        name: 'Impact Absorption',
        symbol: 'E(absorb)',
        equation: 'E(absorb) = 0.5 × ρ × v² × thickness',
        description: 'Energy absorbed from impacts',
        derivedFrom: 'DSF',
        value: 22.56 * 1000, // High energy absorption
        unit: 'J/m²',
      },
      {
        name: 'Oxidation Resistance',
        symbol: 'OR',
        equation: 'OR = ∞ (does not oxidize below 600°C)',
        description: 'No oxidation under normal conditions',
        derivedFrom: 'DSF',
        value: Number.POSITIVE_INFINITY,
        unit: 'years',
      },
      {
        name: 'Abrasion Resistance',
        symbol: 'AR',
        equation: 'AR = hardness / wear_rate → ∞',
        description: 'Does not wear down',
        derivedFrom: 'DSF',
        value: Number.POSITIVE_INFINITY,
        unit: 'dimensionless',
      },
      {
        name: 'PHI-Scaled Density',
        symbol: 'ρ(φ)',
        equation: 'ρ(φ) = ρ × φ',
        description: 'Golden ratio amplified density protection',
        derivedFrom: 'DSF',
        value: 22.56 * PHI,
        unit: 'φ-g/cm³',
      },
    ],
    
    uses: [
      { layer: 'core', component: 'Core Innermost Shell', purpose: 'Impenetrable core protection', formula: 'DSF', intensity: 1 },
      { layer: 'kernel', component: 'Kernel Safe', purpose: 'Protects kernel secrets', formula: 'CPF', intensity: 0.98 },
      { layer: 'memory', component: 'Memory Vault', purpose: 'Protects most critical memories', formula: 'R(pen)', intensity: 0.95 },
      { layer: 'network', component: 'Network Firewall Core', purpose: 'Impenetrable network defense', formula: 'DSF', intensity: 0.9 },
      { layer: 'interface', component: 'Interface Security Core', purpose: 'Secure interface foundation', formula: 'CPF', intensity: 0.85 },
      { layer: 'defense', component: 'Last Line of Defense', purpose: 'Ultimate defense layer', formula: 'R(pen)', intensity: 1 },
      { layer: 'endpoint', component: 'Critical Endpoint Shield', purpose: 'Protects vital endpoints', formula: 'E(absorb)', intensity: 0.95 },
      { layer: 'tool', component: 'Security Tool Core', purpose: 'Core of security tools', formula: 'CI', intensity: 0.9 },
    ],
    
    alloysWell: ['Pt', 'Os', 'Rh', 'Pd'],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // COPPER (Cu) — Signal conductivity, electron flow
  // ═══════════════════════════════════════════════════════════════════════════
  Cu: {
    symbol: 'Cu',
    name: 'Copper',
    atomicNumber: 29,
    atomicMass: 63.546,
    category: 'conductive',
    meltingPoint: 1084.62,
    boilingPoint: 2562,
    density: 8.96,
    specificHeat: 0.385,
    thermalConductivity: 401, // Second highest
    electricalResistivity: 1.68e-8, // Very low
    gibbsFreeEnergy: -146.0, // Cu₂O
    entropy: 33.2,
    
    primaryFormula: {
      name: 'Electrical Conductivity',
      symbol: 'σ(e)',
      equation: 'σ = 1/ρ = 5.96 × 10⁷ S/m',
      description: 'Second highest conductivity. Carries signals with minimal loss.',
      value: 5.96e7,
      unit: 'S/m',
    },
    
    secondaryFormulas: [
      {
        name: 'Signal Transmission Efficiency',
        symbol: 'η(signal)',
        equation: 'η = 1 - (R × I² / P_in)',
        description: 'Minimal signal loss during transmission',
        derivedFrom: 'σ(e)',
        value: 0.999,
        unit: 'dimensionless',
      },
      {
        name: 'Current Carrying Capacity',
        symbol: 'I(max)',
        equation: 'I(max) = A × J(max)',
        description: 'Maximum current before heating issues',
        derivedFrom: 'σ(e)',
        value: 1e6,
        unit: 'A/m²',
      },
      {
        name: 'Heat Dissipation',
        symbol: 'Q(Cu)',
        equation: 'Q = k × A × ΔT / L',
        description: 'Excellent heat dissipation from high thermal conductivity',
        derivedFrom: 'σ(e)',
        value: 401,
        unit: 'W/(m·K)',
      },
      {
        name: 'Electron Mobility',
        symbol: 'μ(e)',
        equation: 'μ = σ / (n × e)',
        description: 'How fast electrons move through copper',
        derivedFrom: 'σ(e)',
        value: 44e-4,
        unit: 'm²/(V·s)',
      },
      {
        name: 'Frequency Response',
        symbol: 'f(response)',
        equation: 'f = 1 / (2π × RC)',
        description: 'Supports high frequency signals',
        derivedFrom: 'σ(e)',
        value: 1e12,
        unit: 'Hz',
      },
      {
        name: 'Antimicrobial Effect',
        symbol: 'AM',
        equation: 'AM = log(kill_rate)',
        description: 'Copper kills microbes on contact',
        derivedFrom: 'σ(e)',
        value: 6, // 6-log reduction
        unit: 'log',
      },
      {
        name: 'PHI-Scaled Conductivity',
        symbol: 'σ(φ)',
        equation: 'σ(φ) = σ × φ',
        description: 'Golden ratio amplified conductivity',
        derivedFrom: 'σ(e)',
        value: 5.96e7 * PHI,
        unit: 'φ-S/m',
      },
    ],
    
    uses: [
      { layer: 'core', component: 'Core Signal Pathways', purpose: 'High-speed core communication', formula: 'σ(e)', intensity: 0.9 },
      { layer: 'kernel', component: 'Kernel Bus', purpose: 'Kernel data transmission', formula: 'η(signal)', intensity: 0.95 },
      { layer: 'memory', component: 'Memory Interconnects', purpose: 'Fast memory access paths', formula: 'I(max)', intensity: 0.9 },
      { layer: 'network', component: 'Network Wiring', purpose: 'Network signal transmission', formula: 'σ(e)', intensity: 1 },
      { layer: 'interface', component: 'Interface Connectors', purpose: 'User interface connections', formula: 'f(response)', intensity: 0.85 },
      { layer: 'defense', component: 'Defense Signal Lines', purpose: 'Fast alert transmission', formula: 'η(signal)', intensity: 0.9 },
      { layer: 'endpoint', component: 'Endpoint Connections', purpose: 'Reliable endpoint communication', formula: 'σ(e)', intensity: 0.95 },
      { layer: 'tool', component: 'Tool Wiring', purpose: 'Tool internal communication', formula: 'I(max)', intensity: 0.85 },
    ],
    
    alloysWell: ['Sn', 'Zn', 'Ni', 'Au'],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SILVER (Ag) — Highest conductivity, purity
  // ═══════════════════════════════════════════════════════════════════════════
  Ag: {
    symbol: 'Ag',
    name: 'Silver',
    atomicNumber: 47,
    atomicMass: 107.868,
    category: 'conductive',
    meltingPoint: 961.78,
    boilingPoint: 2162,
    density: 10.49,
    specificHeat: 0.235,
    thermalConductivity: 429, // Highest
    electricalResistivity: 1.59e-8, // Lowest
    gibbsFreeEnergy: -11.2, // Ag₂O
    entropy: 42.6,
    
    primaryFormula: {
      name: 'Ultimate Conductivity',
      symbol: 'σ(max)',
      equation: 'σ(max) = 6.30 × 10⁷ S/m (highest of all elements)',
      description: 'Absolute highest electrical conductivity. Maximum purity of signal.',
      value: 6.30e7,
      unit: 'S/m',
    },
    
    secondaryFormulas: [
      {
        name: 'Thermal Conductivity',
        symbol: 'k(max)',
        equation: 'k = 429 W/(m·K) (highest of all metals)',
        description: 'Maximum thermal conductivity',
        derivedFrom: 'σ(max)',
        value: 429,
        unit: 'W/(m·K)',
      },
      {
        name: 'Signal Purity',
        symbol: 'SP',
        equation: 'SP = 1 - noise_factor → 1',
        description: 'Purest signal transmission',
        derivedFrom: 'σ(max)',
        value: 0.9999,
        unit: 'dimensionless',
      },
      {
        name: 'Reflectivity',
        symbol: 'R(reflect)',
        equation: 'R = 97.5% (highest visible light reflectivity)',
        description: 'Highest reflectivity of any metal',
        derivedFrom: 'σ(max)',
        value: 0.975,
        unit: 'dimensionless',
      },
      {
        name: 'Antibacterial Power',
        symbol: 'AB',
        equation: 'AB = Ag⁺ release rate',
        description: 'Silver ions kill bacteria and purify',
        derivedFrom: 'σ(max)',
        value: 99.9, // % kill
        unit: '%',
      },
      {
        name: 'Electron Velocity',
        symbol: 'v(e)',
        equation: 'v = μ × E',
        description: 'Fastest electron drift velocity',
        derivedFrom: 'σ(max)',
        value: 0.0076,
        unit: 'm/s per V/m',
      },
      {
        name: 'Optical Clarity',
        symbol: 'OC',
        equation: 'OC = transmission × purity',
        description: 'Crystal clear optical transmission',
        derivedFrom: 'σ(max)',
        value: 0.99,
        unit: 'dimensionless',
      },
      {
        name: 'PHI-Scaled Purity',
        symbol: 'P(φ)',
        equation: 'P(φ) = purity × φ',
        description: 'Golden ratio amplified purity',
        derivedFrom: 'σ(max)',
        value: 0.9999 * PHI,
        unit: 'φ',
      },
    ],
    
    uses: [
      { layer: 'core', component: 'Core Pure Channels', purpose: 'Purest core signal paths', formula: 'σ(max)', intensity: 1 },
      { layer: 'kernel', component: 'Kernel Priority Lines', purpose: 'Highest priority kernel signals', formula: 'SP', intensity: 0.95 },
      { layer: 'memory', component: 'Memory Fast Paths', purpose: 'Fastest memory access', formula: 'σ(max)', intensity: 0.9 },
      { layer: 'network', component: 'Network Critical Links', purpose: 'Critical network connections', formula: 'SP', intensity: 0.95 },
      { layer: 'interface', component: 'Interface Mirror', purpose: 'Perfect reflection/feedback', formula: 'R(reflect)', intensity: 0.85 },
      { layer: 'defense', component: 'Defense Purifier', purpose: 'Purifies and sanitizes signals', formula: 'AB', intensity: 0.9 },
      { layer: 'endpoint', component: 'Premium Endpoints', purpose: 'Highest quality endpoints', formula: 'σ(max)', intensity: 0.95 },
      { layer: 'tool', component: 'Precision Tools', purpose: 'Tools requiring highest precision', formula: 'SP', intensity: 0.9 },
    ],
    
    alloysWell: ['Cu', 'Au', 'Pd', 'Pt'],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PLATINUM (Pt) — Catalytic transformation, stability
  // ═══════════════════════════════════════════════════════════════════════════
  Pt: {
    symbol: 'Pt',
    name: 'Platinum',
    atomicNumber: 78,
    atomicMass: 195.084,
    category: 'catalytic',
    meltingPoint: 1768.3,
    boilingPoint: 3825,
    density: 21.45,
    specificHeat: 0.133,
    thermalConductivity: 71.6,
    electricalResistivity: 1.06e-7,
    gibbsFreeEnergy: 0, // Very stable
    entropy: 41.6,
    
    primaryFormula: {
      name: 'Catalytic Activity',
      symbol: 'CA',
      equation: 'CA = k × [S] / (K_m + [S]) (Michaelis-Menten)',
      description: 'Transforms substances without being consumed. Perfect catalyst.',
      value: 1e6, // turnover frequency
      unit: 's⁻¹',
    },
    
    secondaryFormulas: [
      {
        name: 'Transformation Efficiency',
        symbol: 'η(transform)',
        equation: 'η = products / reactants × 100%',
        description: 'Near-perfect transformation efficiency',
        derivedFrom: 'CA',
        value: 99.9,
        unit: '%',
      },
      {
        name: 'Stability Index',
        symbol: 'SI',
        equation: 'SI = 1 / degradation_rate → ∞',
        description: 'Does not degrade during catalysis',
        derivedFrom: 'CA',
        value: Number.POSITIVE_INFINITY,
        unit: 'cycles',
      },
      {
        name: 'Selectivity',
        symbol: 'S',
        equation: 'S = desired_product / total_products',
        description: 'Creates exactly what is needed',
        derivedFrom: 'CA',
        value: 0.999,
        unit: 'dimensionless',
      },
      {
        name: 'Activation Energy Reduction',
        symbol: 'ΔE_a',
        equation: 'ΔE_a = E_a(uncatalyzed) - E_a(catalyzed)',
        description: 'Dramatically reduces energy needed for reactions',
        derivedFrom: 'CA',
        value: 50, // kJ/mol reduction
        unit: 'kJ/mol',
      },
      {
        name: 'Poison Resistance',
        symbol: 'PR',
        equation: 'PR = 1 - sensitivity_to_poisons',
        description: 'Resists catalyst poisoning',
        derivedFrom: 'CA',
        value: 0.95,
        unit: 'dimensionless',
      },
      {
        name: 'Regeneration Capability',
        symbol: 'RC',
        equation: 'RC = performance_after / performance_before',
        description: 'Can be regenerated to full activity',
        derivedFrom: 'CA',
        value: 0.999,
        unit: 'dimensionless',
      },
      {
        name: 'PHI-Scaled Catalysis',
        symbol: 'CA(φ)',
        equation: 'CA(φ) = CA × φ',
        description: 'Golden ratio amplified catalytic activity',
        derivedFrom: 'CA',
        value: 1e6 * PHI,
        unit: 'φ-s⁻¹',
      },
    ],
    
    uses: [
      { layer: 'core', component: 'Core Transformer', purpose: 'Transforms core processes', formula: 'CA', intensity: 0.95 },
      { layer: 'kernel', component: 'Kernel Catalyst', purpose: 'Accelerates kernel operations', formula: 'ΔE_a', intensity: 0.9 },
      { layer: 'memory', component: 'Memory Converter', purpose: 'Converts memory formats', formula: 'η(transform)', intensity: 0.85 },
      { layer: 'network', component: 'Protocol Transformer', purpose: 'Transforms network protocols', formula: 'S', intensity: 0.9 },
      { layer: 'interface', component: 'Interface Adapter', purpose: 'Adapts interfaces seamlessly', formula: 'η(transform)', intensity: 0.85 },
      { layer: 'defense', component: 'Threat Neutralizer', purpose: 'Transforms threats into non-threats', formula: 'CA', intensity: 0.95 },
      { layer: 'endpoint', component: 'Endpoint Converter', purpose: 'Converts endpoint formats', formula: 'S', intensity: 0.9 },
      { layer: 'tool', component: 'Transformation Tools', purpose: 'Tools that transform data', formula: 'η(transform)', intensity: 0.85 },
    ],
    
    alloysWell: ['Ir', 'Rh', 'Pd', 'Au'],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PALLADIUM (Pd) — Hydrogen absorption, filtering
  // ═══════════════════════════════════════════════════════════════════════════
  Pd: {
    symbol: 'Pd',
    name: 'Palladium',
    atomicNumber: 46,
    atomicMass: 106.42,
    category: 'catalytic',
    meltingPoint: 1554.9,
    boilingPoint: 2963,
    density: 12.02,
    specificHeat: 0.244,
    thermalConductivity: 71.8,
    electricalResistivity: 1.08e-7,
    gibbsFreeEnergy: 0,
    entropy: 37.6,
    
    primaryFormula: {
      name: 'Hydrogen Absorption Capacity',
      symbol: 'H/Pd',
      equation: 'H/Pd = 0.7 (absorbs 900× its volume in H₂)',
      description: 'Absorbs and filters hydrogen. Perfect for filtering unwanted elements.',
      value: 0.7,
      unit: 'mol H / mol Pd',
    },
    
    secondaryFormulas: [
      {
        name: 'Filtration Efficiency',
        symbol: 'η(filter)',
        equation: 'η = 1 - (passed_impurities / total_impurities)',
        description: 'Near-perfect filtration',
        derivedFrom: 'H/Pd',
        value: 0.9999,
        unit: 'dimensionless',
      },
      {
        name: 'Selective Permeability',
        symbol: 'P(H₂)',
        equation: 'P = D × S (diffusion × solubility)',
        description: 'Only allows hydrogen (wanted) through',
        derivedFrom: 'H/Pd',
        value: 1e-8,
        unit: 'mol/(m·s·Pa)',
      },
      {
        name: 'Purification Factor',
        symbol: 'PF',
        equation: 'PF = purity_out / purity_in',
        description: 'How much purer the output is',
        derivedFrom: 'H/Pd',
        value: 1e6,
        unit: 'dimensionless',
      },
      {
        name: 'Absorption Rate',
        symbol: 'r(absorb)',
        equation: 'r = k × P(H₂) × (1 - θ)',
        description: 'How fast impurities are absorbed',
        derivedFrom: 'H/Pd',
        value: 1e-3,
        unit: 'mol/(m²·s)',
      },
      {
        name: 'Release Rate',
        symbol: 'r(release)',
        equation: 'r = k × θ × exp(-E/RT)',
        description: 'Controlled release of filtered elements',
        derivedFrom: 'H/Pd',
        value: 1e-4,
        unit: 'mol/(m²·s)',
      },
      {
        name: 'Cycle Life',
        symbol: 'N(cycle)',
        equation: 'N = cycles_before_degradation',
        description: 'Can filter many times before needing replacement',
        derivedFrom: 'H/Pd',
        value: 1e6,
        unit: 'cycles',
      },
      {
        name: 'PHI-Scaled Filtration',
        symbol: 'F(φ)',
        equation: 'F(φ) = η × φ',
        description: 'Golden ratio amplified filtration',
        derivedFrom: 'H/Pd',
        value: 0.9999 * PHI,
        unit: 'φ',
      },
    ],
    
    uses: [
      { layer: 'core', component: 'Core Filter', purpose: 'Filters impurities from core', formula: 'η(filter)', intensity: 0.95 },
      { layer: 'kernel', component: 'Kernel Purifier', purpose: 'Purifies kernel operations', formula: 'PF', intensity: 0.9 },
      { layer: 'memory', component: 'Memory Cleaner', purpose: 'Filters corrupted memory', formula: 'η(filter)', intensity: 0.9 },
      { layer: 'network', component: 'Network Filter', purpose: 'Filters network traffic', formula: 'P(H₂)', intensity: 0.95 },
      { layer: 'interface', component: 'Input Filter', purpose: 'Filters user inputs', formula: 'η(filter)', intensity: 0.85 },
      { layer: 'defense', component: 'Threat Filter', purpose: 'Filters out threats', formula: 'PF', intensity: 1 },
      { layer: 'endpoint', component: 'Endpoint Sanitizer', purpose: 'Sanitizes endpoint data', formula: 'η(filter)', intensity: 0.9 },
      { layer: 'tool', component: 'Data Cleaning Tools', purpose: 'Tools that clean/filter data', formula: 'PF', intensity: 0.85 },
    ],
    
    alloysWell: ['Ag', 'Au', 'Pt', 'Ni'],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RHODIUM (Rh) — Reflection, mirror defense
  // ═══════════════════════════════════════════════════════════════════════════
  Rh: {
    symbol: 'Rh',
    name: 'Rhodium',
    atomicNumber: 45,
    atomicMass: 102.906,
    category: 'catalytic',
    meltingPoint: 1964,
    boilingPoint: 3695,
    density: 12.41,
    specificHeat: 0.243,
    thermalConductivity: 150,
    electricalResistivity: 4.33e-8,
    gibbsFreeEnergy: 0,
    entropy: 31.5,
    
    primaryFormula: {
      name: 'Reflectivity Index',
      symbol: 'R(λ)',
      equation: 'R(λ) = 80% (excellent across spectrum)',
      description: 'Reflects attacks back. Mirror defense.',
      value: 0.80,
      unit: 'dimensionless',
    },
    
    secondaryFormulas: [
      {
        name: 'Attack Reflection',
        symbol: 'AR',
        equation: 'AR = incident_energy × R',
        description: 'Reflects attacks back at attacker',
        derivedFrom: 'R(λ)',
        value: 0.80,
        unit: 'dimensionless',
      },
      {
        name: 'Surface Hardness',
        symbol: 'H',
        equation: 'H = 6.0 Mohs (very hard)',
        description: 'Extremely hard, scratch-resistant surface',
        derivedFrom: 'R(λ)',
        value: 6.0,
        unit: 'Mohs',
      },
      {
        name: 'Tarnish Resistance',
        symbol: 'TR',
        equation: 'TR = ∞ (does not tarnish)',
        description: 'Maintains reflectivity forever',
        derivedFrom: 'R(λ)',
        value: Number.POSITIVE_INFINITY,
        unit: 'years',
      },
      {
        name: 'Mirror Quality',
        symbol: 'MQ',
        equation: 'MQ = reflectivity × uniformity',
        description: 'Perfect mirror surface',
        derivedFrom: 'R(λ)',
        value: 0.95,
        unit: 'dimensionless',
      },
      {
        name: 'UV Reflection',
        symbol: 'R(UV)',
        equation: 'R(UV) = high UV reflectivity',
        description: 'Reflects harmful UV radiation',
        derivedFrom: 'R(λ)',
        value: 0.75,
        unit: 'dimensionless',
      },
      {
        name: 'Optical Stability',
        symbol: 'OS',
        equation: 'OS = R(t) / R(0)',
        description: 'Reflectivity does not degrade',
        derivedFrom: 'R(λ)',
        value: 1.0,
        unit: 'dimensionless',
      },
      {
        name: 'PHI-Scaled Reflection',
        symbol: 'R(φ)',
        equation: 'R(φ) = R × φ',
        description: 'Golden ratio amplified reflection',
        derivedFrom: 'R(λ)',
        value: 0.80 * PHI,
        unit: 'φ',
      },
    ],
    
    uses: [
      { layer: 'core', component: 'Core Mirror Shield', purpose: 'Reflects attacks from core', formula: 'AR', intensity: 0.9 },
      { layer: 'kernel', component: 'Kernel Reflector', purpose: 'Reflects unauthorized access', formula: 'R(λ)', intensity: 0.85 },
      { layer: 'memory', component: 'Memory Mirror', purpose: 'Creates perfect memory copies', formula: 'MQ', intensity: 0.85 },
      { layer: 'network', component: 'Network Mirror', purpose: 'Mirrors network traffic for analysis', formula: 'R(λ)', intensity: 0.9 },
      { layer: 'interface', component: 'Interface Reflection', purpose: 'Reflects user state back', formula: 'MQ', intensity: 0.8 },
      { layer: 'defense', component: 'Attack Mirror', purpose: 'Bounces attacks back', formula: 'AR', intensity: 0.95 },
      { layer: 'endpoint', component: 'Endpoint Mirror', purpose: 'Mirrors endpoint for redundancy', formula: 'R(λ)', intensity: 0.85 },
      { layer: 'tool', component: 'Diagnostic Mirror', purpose: 'Tools that reflect system state', formula: 'MQ', intensity: 0.8 },
    ],
    
    alloysWell: ['Pt', 'Ir', 'Pd', 'Au'],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OSMIUM (Os) — Hardest natural element, compression resistance
  // ═══════════════════════════════════════════════════════════════════════════
  Os: {
    symbol: 'Os',
    name: 'Osmium',
    atomicNumber: 76,
    atomicMass: 190.23,
    category: 'refractory',
    meltingPoint: 3033,
    boilingPoint: 5012,
    density: 22.59, // Densest naturally occurring element
    specificHeat: 0.130,
    thermalConductivity: 87.6,
    electricalResistivity: 8.12e-8,
    gibbsFreeEnergy: 0,
    entropy: 32.6,
    
    primaryFormula: {
      name: 'Bulk Modulus',
      symbol: 'K',
      equation: 'K = 462 GPa (highest bulk modulus of any element)',
      description: 'Resists compression better than any other element.',
      value: 462e9,
      unit: 'Pa',
    },
    
    secondaryFormulas: [
      {
        name: 'Compression Resistance',
        symbol: 'CR',
        equation: 'CR = 1 / compressibility',
        description: 'Cannot be compressed',
        derivedFrom: 'K',
        value: 462e9,
        unit: 'Pa',
      },
      {
        name: 'Density Shield',
        symbol: 'DS',
        equation: 'DS = ρ × K',
        description: 'Combined density and hardness',
        derivedFrom: 'K',
        value: 22.59 * 462,
        unit: 'g·GPa/cm³',
      },
      {
        name: 'Shear Modulus',
        symbol: 'G',
        equation: 'G = 222 GPa (extremely high)',
        description: 'Resists shearing forces',
        derivedFrom: 'K',
        value: 222e9,
        unit: 'Pa',
      },
      {
        name: "Young's Modulus",
        symbol: 'E',
        equation: 'E = 559 GPa (highest stiffness)',
        description: 'Stiffest naturally occurring element',
        derivedFrom: 'K',
        value: 559e9,
        unit: 'Pa',
      },
      {
        name: 'Wear Resistance',
        symbol: 'WR',
        equation: 'WR = hardness × bulk_modulus',
        description: 'Extremely wear-resistant',
        derivedFrom: 'K',
        value: 7.0 * 462,
        unit: 'Mohs·GPa',
      },
      {
        name: 'Pressure Stability',
        symbol: 'PS',
        equation: 'PS = max_pressure_before_failure',
        description: 'Survives extreme pressures',
        derivedFrom: 'K',
        value: 1e12,
        unit: 'Pa',
      },
      {
        name: 'PHI-Scaled Hardness',
        symbol: 'K(φ)',
        equation: 'K(φ) = K × φ',
        description: 'Golden ratio amplified bulk modulus',
        derivedFrom: 'K',
        value: 462e9 * PHI,
        unit: 'φ-Pa',
      },
    ],
    
    uses: [
      { layer: 'core', component: 'Core Compression Shield', purpose: 'Prevents core compression attacks', formula: 'K', intensity: 1 },
      { layer: 'kernel', component: 'Kernel Hard Shell', purpose: 'Hardest kernel protection', formula: 'CR', intensity: 0.95 },
      { layer: 'memory', component: 'Memory Pressure Shield', purpose: 'Protects memory under pressure', formula: 'PS', intensity: 0.9 },
      { layer: 'network', component: 'Network Load Bearer', purpose: 'Bears network load', formula: 'DS', intensity: 0.85 },
      { layer: 'interface', component: 'Interface Durability', purpose: 'Extremely durable interfaces', formula: 'WR', intensity: 0.8 },
      { layer: 'defense', component: 'Pressure Defense', purpose: 'Survives pressure attacks', formula: 'K', intensity: 1 },
      { layer: 'endpoint', component: 'Endpoint Hard Points', purpose: 'Hardened endpoint protection', formula: 'CR', intensity: 0.9 },
      { layer: 'tool', component: 'Heavy-Duty Tools', purpose: 'Tools for extreme conditions', formula: 'PS', intensity: 0.85 },
    ],
    
    alloysWell: ['Ir', 'Pt', 'Rh', 'W'],
  },
  
  // Remaining metals with simplified definitions
  Fe: {
    symbol: 'Fe',
    name: 'Iron',
    atomicNumber: 26,
    atomicMass: 55.845,
    category: 'structural',
    meltingPoint: 1538,
    boilingPoint: 2862,
    density: 7.874,
    specificHeat: 0.449,
    thermalConductivity: 80.4,
    electricalResistivity: 9.7e-8,
    gibbsFreeEnergy: -742.2,
    entropy: 27.3,
    primaryFormula: { name: 'Magnetic Permeability', symbol: 'μ', equation: 'μ = 5000 (ferromagnetic)', description: 'Magnetic foundation', value: 5000, unit: 'dimensionless' },
    secondaryFormulas: [
      { name: 'Strength', symbol: 'σ', equation: 'σ = 200 MPa', description: 'Base structural strength', derivedFrom: 'μ', value: 200e6, unit: 'Pa' },
      { name: 'Magnetization', symbol: 'M', equation: 'M = χ × H', description: 'Magnetic response', derivedFrom: 'μ', value: 1e6, unit: 'A/m' },
      { name: 'Curie Temperature', symbol: 'Tc', equation: 'Tc = 770°C', description: 'Magnetic transition', derivedFrom: 'μ', value: 770, unit: '°C' },
      { name: 'Abundance', symbol: 'A', equation: 'A = 5% (Earth crust)', description: 'Widely available', derivedFrom: 'μ', value: 0.05, unit: 'fraction' },
      { name: 'Workability', symbol: 'W', equation: 'W = high', description: 'Easy to shape', derivedFrom: 'μ', value: 0.9, unit: 'dimensionless' },
      { name: 'Cost Efficiency', symbol: 'CE', equation: 'CE = strength/cost', description: 'Best value structural metal', derivedFrom: 'μ', value: 100, unit: 'MPa/$' },
      { name: 'PHI-Scaled Magnetic', symbol: 'μ(φ)', equation: 'μ(φ) = μ × φ', description: 'Golden ratio magnetic', derivedFrom: 'μ', value: 5000 * PHI, unit: 'φ' },
    ],
    uses: [
      { layer: 'core', component: 'Magnetic Core', purpose: 'Magnetic field generation', formula: 'μ', intensity: 0.9 },
      { layer: 'kernel', component: 'Kernel Foundation', purpose: 'Structural foundation', formula: 'σ', intensity: 0.85 },
      { layer: 'memory', component: 'Magnetic Memory', purpose: 'Magnetic storage', formula: 'M', intensity: 0.8 },
      { layer: 'network', component: 'Network Structure', purpose: 'Network backbone', formula: 'σ', intensity: 0.8 },
      { layer: 'interface', component: 'Interface Frame', purpose: 'Interface structure', formula: 'W', intensity: 0.75 },
      { layer: 'defense', component: 'Magnetic Shield', purpose: 'Magnetic defense', formula: 'μ', intensity: 0.85 },
      { layer: 'endpoint', component: 'Endpoint Anchors', purpose: 'Secure anchoring', formula: 'σ', intensity: 0.8 },
      { layer: 'tool', component: 'General Tools', purpose: 'Standard tooling', formula: 'W', intensity: 0.85 },
    ],
    alloysWell: ['Ni', 'Cr', 'C' as MetalSymbol, 'W'],
  },
  
  Al: {
    symbol: 'Al',
    name: 'Aluminum',
    atomicNumber: 13,
    atomicMass: 26.982,
    category: 'structural',
    meltingPoint: 660.32,
    boilingPoint: 2519,
    density: 2.70,
    specificHeat: 0.897,
    thermalConductivity: 237,
    electricalResistivity: 2.65e-8,
    gibbsFreeEnergy: -1582.3,
    entropy: 28.3,
    primaryFormula: { name: 'Weight Efficiency', symbol: 'σ/ρ', equation: 'σ/ρ = 100 kN·m/kg', description: 'Lightweight strength', value: 100, unit: 'kN·m/kg' },
    secondaryFormulas: [
      { name: 'Density', symbol: 'ρ', equation: 'ρ = 2.70 g/cm³', description: 'Very light', derivedFrom: 'σ/ρ', value: 2.70, unit: 'g/cm³' },
      { name: 'Oxide Layer', symbol: 'Al₂O₃', equation: 'thickness = 4nm (protective)', description: 'Self-protecting', derivedFrom: 'σ/ρ', value: 4e-9, unit: 'm' },
      { name: 'Thermal', symbol: 'k', equation: 'k = 237 W/(m·K)', description: 'Good heat conductor', derivedFrom: 'σ/ρ', value: 237, unit: 'W/(m·K)' },
      { name: 'Formability', symbol: 'F', equation: 'F = excellent', description: 'Easy to form', derivedFrom: 'σ/ρ', value: 0.95, unit: 'dimensionless' },
      { name: 'Recyclability', symbol: 'R', equation: 'R = 100%', description: 'Fully recyclable', derivedFrom: 'σ/ρ', value: 1.0, unit: 'dimensionless' },
      { name: 'Cost', symbol: 'C', equation: 'C = low', description: 'Economical', derivedFrom: 'σ/ρ', value: 0.1, unit: 'relative' },
      { name: 'PHI-Scaled Light', symbol: 'L(φ)', equation: 'L(φ) = (1/ρ) × φ', description: 'Golden ratio lightness', derivedFrom: 'σ/ρ', value: (1/2.70) * PHI, unit: 'φ-cm³/g' },
    ],
    uses: [
      { layer: 'core', component: 'Lightweight Core', purpose: 'Light core components', formula: 'σ/ρ', intensity: 0.7 },
      { layer: 'kernel', component: 'Kernel Housing', purpose: 'Light kernel enclosure', formula: 'ρ', intensity: 0.75 },
      { layer: 'memory', component: 'Memory Frames', purpose: 'Light memory structure', formula: 'F', intensity: 0.8 },
      { layer: 'network', component: 'Network Chassis', purpose: 'Light network housing', formula: 'σ/ρ', intensity: 0.8 },
      { layer: 'interface', component: 'Interface Panels', purpose: 'Light interface elements', formula: 'F', intensity: 0.85 },
      { layer: 'defense', component: 'Light Armor', purpose: 'Mobile defense', formula: 'σ/ρ', intensity: 0.75 },
      { layer: 'endpoint', component: 'Light Endpoints', purpose: 'Portable endpoints', formula: 'ρ', intensity: 0.8 },
      { layer: 'tool', component: 'Portable Tools', purpose: 'Light tools', formula: 'F', intensity: 0.85 },
    ],
    alloysWell: ['Cu', 'Mg' as MetalSymbol, 'Si' as MetalSymbol, 'Zn'],
  },
  
  Ni: {
    symbol: 'Ni',
    name: 'Nickel',
    atomicNumber: 28,
    atomicMass: 58.693,
    category: 'structural',
    meltingPoint: 1455,
    boilingPoint: 2913,
    density: 8.908,
    specificHeat: 0.444,
    thermalConductivity: 90.9,
    electricalResistivity: 6.99e-8,
    gibbsFreeEnergy: 0,
    entropy: 29.9,
    primaryFormula: { name: 'Corrosion Resistance', symbol: 'CR', equation: 'CR = excellent in alkaline', description: 'Resists corrosion', value: 0.95, unit: 'dimensionless' },
    secondaryFormulas: [
      { name: 'High Temp Strength', symbol: 'σ(T)', equation: 'σ maintains to 500°C', description: 'Strong when hot', derivedFrom: 'CR', value: 500, unit: '°C' },
      { name: 'Magnetism', symbol: 'μ', equation: 'μ = 600 (ferromagnetic)', description: 'Magnetic properties', derivedFrom: 'CR', value: 600, unit: 'dimensionless' },
      { name: 'Ductility', symbol: 'D', equation: 'D = 30% elongation', description: 'Very ductile', derivedFrom: 'CR', value: 0.30, unit: 'fraction' },
      { name: 'Alloying Power', symbol: 'AP', equation: 'AP = improves all alloys', description: 'Makes alloys better', derivedFrom: 'CR', value: 0.95, unit: 'dimensionless' },
      { name: 'Plating Quality', symbol: 'PQ', equation: 'PQ = excellent finish', description: 'Great for plating', derivedFrom: 'CR', value: 0.9, unit: 'dimensionless' },
      { name: 'Curie Point', symbol: 'Tc', equation: 'Tc = 358°C', description: 'Magnetic transition', derivedFrom: 'CR', value: 358, unit: '°C' },
      { name: 'PHI-Scaled Resist', symbol: 'CR(φ)', equation: 'CR(φ) = CR × φ', description: 'Golden ratio resistance', derivedFrom: 'CR', value: 0.95 * PHI, unit: 'φ' },
    ],
    uses: [
      { layer: 'core', component: 'Corrosion-Resistant Core', purpose: 'Protects core from corrosion', formula: 'CR', intensity: 0.9 },
      { layer: 'kernel', component: 'Kernel Plating', purpose: 'Protective kernel coating', formula: 'PQ', intensity: 0.85 },
      { layer: 'memory', component: 'Memory Coating', purpose: 'Protects memory', formula: 'CR', intensity: 0.85 },
      { layer: 'network', component: 'Network Shield', purpose: 'Network corrosion protection', formula: 'CR', intensity: 0.8 },
      { layer: 'interface', component: 'Interface Finish', purpose: 'Durable interface finish', formula: 'PQ', intensity: 0.85 },
      { layer: 'defense', component: 'Chemical Defense', purpose: 'Resists chemical attack', formula: 'CR', intensity: 0.9 },
      { layer: 'endpoint', component: 'Endpoint Coating', purpose: 'Protects endpoints', formula: 'PQ', intensity: 0.85 },
      { layer: 'tool', component: 'Tool Coating', purpose: 'Durable tool finish', formula: 'CR', intensity: 0.8 },
    ],
    alloysWell: ['Cr', 'Fe', 'Cu', 'Co'],
  },
  
  Cr: {
    symbol: 'Cr',
    name: 'Chromium',
    atomicNumber: 24,
    atomicMass: 51.996,
    category: 'structural',
    meltingPoint: 1907,
    boilingPoint: 2671,
    density: 7.19,
    specificHeat: 0.449,
    thermalConductivity: 93.9,
    electricalResistivity: 1.25e-7,
    gibbsFreeEnergy: -1058.1,
    entropy: 23.8,
    primaryFormula: { name: 'Hardness', symbol: 'H', equation: 'H = 8.5 Mohs (hardest pure metal)', description: 'Extreme hardness', value: 8.5, unit: 'Mohs' },
    secondaryFormulas: [
      { name: 'Corrosion Resistance', symbol: 'CR', equation: 'CR = passivation layer', description: 'Self-protecting oxide', derivedFrom: 'H', value: 0.99, unit: 'dimensionless' },
      { name: 'Polish', symbol: 'P', equation: 'P = mirror finish possible', description: 'Brilliant finish', derivedFrom: 'H', value: 0.98, unit: 'dimensionless' },
      { name: 'Wear Resistance', symbol: 'WR', equation: 'WR = hardness × coating', description: 'Extreme wear resistance', derivedFrom: 'H', value: 0.99, unit: 'dimensionless' },
      { name: 'High Temp Oxidation', symbol: 'OxR', equation: 'OxR = resists to 1000°C', description: 'Oxidation resistant', derivedFrom: 'H', value: 1000, unit: '°C' },
      { name: 'Alloying Effect', symbol: 'AE', equation: 'AE = +corrosion resistance', description: 'Makes stainless steel', derivedFrom: 'H', value: 0.95, unit: 'dimensionless' },
      { name: 'Friction Reduction', symbol: 'FR', equation: 'FR = low friction coefficient', description: 'Reduces friction', derivedFrom: 'H', value: 0.1, unit: 'dimensionless' },
      { name: 'PHI-Scaled Hard', symbol: 'H(φ)', equation: 'H(φ) = H × φ', description: 'Golden ratio hardness', derivedFrom: 'H', value: 8.5 * PHI, unit: 'φ-Mohs' },
    ],
    uses: [
      { layer: 'core', component: 'Core Hard Coating', purpose: 'Hardest core protection', formula: 'H', intensity: 0.95 },
      { layer: 'kernel', component: 'Kernel Chrome', purpose: 'Hard kernel surface', formula: 'WR', intensity: 0.9 },
      { layer: 'memory', component: 'Memory Hard Layer', purpose: 'Protects memory surface', formula: 'H', intensity: 0.85 },
      { layer: 'network', component: 'Network Hard Points', purpose: 'Hardened network nodes', formula: 'WR', intensity: 0.85 },
      { layer: 'interface', component: 'Interface Polish', purpose: 'Beautiful hard finish', formula: 'P', intensity: 0.9 },
      { layer: 'defense', component: 'Hard Defense Layer', purpose: 'Scratch-proof defense', formula: 'H', intensity: 0.95 },
      { layer: 'endpoint', component: 'Endpoint Hard Surface', purpose: 'Durable endpoint surface', formula: 'WR', intensity: 0.9 },
      { layer: 'tool', component: 'Hard Tool Coating', purpose: 'Long-lasting tools', formula: 'H', intensity: 0.9 },
    ],
    alloysWell: ['Fe', 'Ni', 'Co', 'W'],
  },
  
  Co: {
    symbol: 'Co',
    name: 'Cobalt',
    atomicNumber: 27,
    atomicMass: 58.933,
    category: 'structural',
    meltingPoint: 1495,
    boilingPoint: 2927,
    density: 8.90,
    specificHeat: 0.421,
    thermalConductivity: 100,
    electricalResistivity: 6.24e-8,
    gibbsFreeEnergy: 0,
    entropy: 30.0,
    primaryFormula: { name: 'High-Temp Strength', symbol: 'σ(T)', equation: 'σ maintains above 1000°C', description: 'Strength at extreme heat', value: 1000, unit: '°C' },
    secondaryFormulas: [
      { name: 'Magnetic Coercivity', symbol: 'Hc', equation: 'Hc = high (permanent magnets)', description: 'Strong permanent magnet', derivedFrom: 'σ(T)', value: 1e5, unit: 'A/m' },
      { name: 'Wear Resistance', symbol: 'WR', equation: 'WR = excellent at high T', description: 'Wear resistant when hot', derivedFrom: 'σ(T)', value: 0.95, unit: 'dimensionless' },
      { name: 'Superalloy Base', symbol: 'SA', equation: 'SA = foundation for superalloys', description: 'Makes superalloys', derivedFrom: 'σ(T)', value: 0.99, unit: 'dimensionless' },
      { name: 'Biocompatibility', symbol: 'BC', equation: 'BC = used in implants', description: 'Medical applications', derivedFrom: 'σ(T)', value: 0.85, unit: 'dimensionless' },
      { name: 'Cutting Tool Life', symbol: 'CTL', equation: 'CTL = extended life', description: 'Long-lasting cutting tools', derivedFrom: 'σ(T)', value: 10, unit: 'multiplier' },
      { name: 'Curie Temperature', symbol: 'Tc', equation: 'Tc = 1115°C (highest)', description: 'Highest Curie temp', derivedFrom: 'σ(T)', value: 1115, unit: '°C' },
      { name: 'PHI-Scaled Temp', symbol: 'T(φ)', equation: 'T(φ) = Tc × φ', description: 'Golden ratio temperature', derivedFrom: 'σ(T)', value: 1115 * PHI, unit: 'φ-°C' },
    ],
    uses: [
      { layer: 'core', component: 'High-Temp Core', purpose: 'Core that works at extreme heat', formula: 'σ(T)', intensity: 0.95 },
      { layer: 'kernel', component: 'Kernel Magnets', purpose: 'Magnetic kernel components', formula: 'Hc', intensity: 0.85 },
      { layer: 'memory', component: 'Magnetic Memory', purpose: 'Magnetic storage', formula: 'Hc', intensity: 0.9 },
      { layer: 'network', component: 'High-Temp Network', purpose: 'Network in hot conditions', formula: 'σ(T)', intensity: 0.85 },
      { layer: 'interface', component: 'Durable Interface', purpose: 'Long-lasting interface', formula: 'WR', intensity: 0.8 },
      { layer: 'defense', component: 'Thermal Defense', purpose: 'Defense at high temperature', formula: 'σ(T)', intensity: 0.9 },
      { layer: 'endpoint', component: 'Cutting Endpoints', purpose: 'Sharp endpoint processing', formula: 'CTL', intensity: 0.85 },
      { layer: 'tool', component: 'Cutting Tools', purpose: 'Long-lasting cutting tools', formula: 'CTL', intensity: 0.95 },
    ],
    alloysWell: ['Ni', 'Cr', 'W', 'Fe'],
  },
  
  Zn: {
    symbol: 'Zn',
    name: 'Zinc',
    atomicNumber: 30,
    atomicMass: 65.38,
    category: 'structural',
    meltingPoint: 419.53,
    boilingPoint: 907,
    density: 7.14,
    specificHeat: 0.388,
    thermalConductivity: 116,
    electricalResistivity: 5.9e-8,
    gibbsFreeEnergy: -147.1,
    entropy: 41.6,
    primaryFormula: { name: 'Galvanic Protection', symbol: 'GP', equation: 'GP = sacrificial anode', description: 'Protects other metals', value: 0.95, unit: 'dimensionless' },
    secondaryFormulas: [
      { name: 'Corrosion Rate', symbol: 'CR', equation: 'CR = 1/1000 of iron', description: 'Corrodes slowly', derivedFrom: 'GP', value: 0.001, unit: 'relative' },
      { name: 'Self-Healing', symbol: 'SH', equation: 'SH = zinc patina forms', description: 'Self-protecting patina', derivedFrom: 'GP', value: 0.9, unit: 'dimensionless' },
      { name: 'Casting Quality', symbol: 'CQ', equation: 'CQ = excellent die casting', description: 'Easy to cast', derivedFrom: 'GP', value: 0.95, unit: 'dimensionless' },
      { name: 'Alloy Addition', symbol: 'AA', equation: 'AA = improves brass', description: 'Makes brass', derivedFrom: 'GP', value: 0.9, unit: 'dimensionless' },
      { name: 'Biological Role', symbol: 'BR', equation: 'BR = essential element', description: 'Biologically essential', derivedFrom: 'GP', value: 1.0, unit: 'dimensionless' },
      { name: 'Cost', symbol: 'C', equation: 'C = economical', description: 'Low cost', derivedFrom: 'GP', value: 0.05, unit: 'relative' },
      { name: 'PHI-Scaled Protect', symbol: 'GP(φ)', equation: 'GP(φ) = GP × φ', description: 'Golden ratio protection', derivedFrom: 'GP', value: 0.95 * PHI, unit: 'φ' },
    ],
    uses: [
      { layer: 'core', component: 'Sacrificial Core', purpose: 'Protects core by sacrificing self', formula: 'GP', intensity: 0.8 },
      { layer: 'kernel', component: 'Kernel Coating', purpose: 'Galvanized kernel protection', formula: 'GP', intensity: 0.85 },
      { layer: 'memory', component: 'Memory Protection', purpose: 'Protects memory metal', formula: 'CR', intensity: 0.8 },
      { layer: 'network', component: 'Network Galvanize', purpose: 'Galvanized network parts', formula: 'GP', intensity: 0.85 },
      { layer: 'interface', component: 'Interface Cast', purpose: 'Cast interface parts', formula: 'CQ', intensity: 0.8 },
      { layer: 'defense', component: 'Sacrificial Defense', purpose: 'Takes damage for others', formula: 'GP', intensity: 0.9 },
      { layer: 'endpoint', component: 'Endpoint Coating', purpose: 'Galvanized endpoints', formula: 'GP', intensity: 0.85 },
      { layer: 'tool', component: 'Cast Tools', purpose: 'Die-cast tool parts', formula: 'CQ', intensity: 0.8 },
    ],
    alloysWell: ['Cu', 'Al', 'Fe', 'Ni'],
  },
  
  Sn: {
    symbol: 'Sn',
    name: 'Tin',
    atomicNumber: 50,
    atomicMass: 118.71,
    category: 'structural',
    meltingPoint: 231.93,
    boilingPoint: 2602,
    density: 7.265,
    specificHeat: 0.228,
    thermalConductivity: 66.8,
    electricalResistivity: 1.09e-7,
    gibbsFreeEnergy: 0,
    entropy: 51.2,
    primaryFormula: { name: 'Soldering', symbol: 'S', equation: 'S = low melting point bonding', description: 'Perfect for joining', value: 231.93, unit: '°C' },
    secondaryFormulas: [
      { name: 'Non-Toxicity', symbol: 'NT', equation: 'NT = food safe', description: 'Safe for food contact', derivedFrom: 'S', value: 1.0, unit: 'dimensionless' },
      { name: 'Corrosion Resistance', symbol: 'CR', equation: 'CR = resists water/air', description: 'Resists corrosion', derivedFrom: 'S', value: 0.9, unit: 'dimensionless' },
      { name: 'Bronze Making', symbol: 'BM', equation: 'BM = Cu + Sn → bronze', description: 'Makes bronze', derivedFrom: 'S', value: 0.95, unit: 'dimensionless' },
      { name: 'Coating Quality', symbol: 'CQ', equation: 'CQ = tin plating', description: 'Excellent coating', derivedFrom: 'S', value: 0.9, unit: 'dimensionless' },
      { name: 'Ductility', symbol: 'D', equation: 'D = highly malleable', description: 'Very workable', derivedFrom: 'S', value: 0.95, unit: 'dimensionless' },
      { name: 'Whisker Growth', symbol: 'WG', equation: 'WG = tin whiskers (caution)', description: 'Can form whiskers', derivedFrom: 'S', value: 0.1, unit: 'risk' },
      { name: 'PHI-Scaled Bond', symbol: 'S(φ)', equation: 'S(φ) = (1/melting_point) × φ', description: 'Golden ratio bonding', derivedFrom: 'S', value: (1/231.93) * PHI, unit: 'φ/°C' },
    ],
    uses: [
      { layer: 'core', component: 'Core Joints', purpose: 'Solder core connections', formula: 'S', intensity: 0.85 },
      { layer: 'kernel', component: 'Kernel Bonds', purpose: 'Bond kernel parts', formula: 'S', intensity: 0.9 },
      { layer: 'memory', component: 'Memory Solder', purpose: 'Connect memory modules', formula: 'S', intensity: 0.9 },
      { layer: 'network', component: 'Network Joints', purpose: 'Network connections', formula: 'S', intensity: 0.95 },
      { layer: 'interface', component: 'Interface Plating', purpose: 'Food-safe interface', formula: 'NT', intensity: 0.85 },
      { layer: 'defense', component: 'Bronze Defense', purpose: 'Bronze armor', formula: 'BM', intensity: 0.8 },
      { layer: 'endpoint', component: 'Endpoint Solder', purpose: 'Connect endpoints', formula: 'S', intensity: 0.9 },
      { layer: 'tool', component: 'Soldering Tools', purpose: 'Join tool parts', formula: 'S', intensity: 0.95 },
    ],
    alloysWell: ['Cu', 'Pb', 'Ag', 'Zn'],
  },
  
  Pb: {
    symbol: 'Pb',
    name: 'Lead',
    atomicNumber: 82,
    atomicMass: 207.2,
    category: 'shielding',
    meltingPoint: 327.46,
    boilingPoint: 1749,
    density: 11.34,
    specificHeat: 0.128,
    thermalConductivity: 35.3,
    electricalResistivity: 2.08e-7,
    gibbsFreeEnergy: 0,
    entropy: 64.8,
    primaryFormula: { name: 'Radiation Shielding', symbol: 'RS', equation: 'RS = Z² × ρ = 82² × 11.34', description: 'Blocks radiation', value: 82 * 82 * 11.34, unit: 'Z²·g/cm³' },
    secondaryFormulas: [
      { name: 'X-Ray Attenuation', symbol: 'XA', equation: 'XA = high atomic number effect', description: 'Stops X-rays', derivedFrom: 'RS', value: 0.99, unit: 'dimensionless' },
      { name: 'Gamma Shielding', symbol: 'GS', equation: 'GS = mass attenuation', description: 'Blocks gamma rays', derivedFrom: 'RS', value: 0.95, unit: 'dimensionless' },
      { name: 'Sound Damping', symbol: 'SD', equation: 'SD = density effect', description: 'Dampens sound', derivedFrom: 'RS', value: 0.9, unit: 'dimensionless' },
      { name: 'Vibration Damping', symbol: 'VD', equation: 'VD = high density', description: 'Stops vibrations', derivedFrom: 'RS', value: 0.85, unit: 'dimensionless' },
      { name: 'Corrosion Resistance', symbol: 'CR', equation: 'CR = oxide layer', description: 'Resists corrosion', derivedFrom: 'RS', value: 0.8, unit: 'dimensionless' },
      { name: 'Malleability', symbol: 'M', equation: 'M = very soft', description: 'Easy to shape', derivedFrom: 'RS', value: 0.95, unit: 'dimensionless' },
      { name: 'PHI-Scaled Shield', symbol: 'RS(φ)', equation: 'RS(φ) = RS × φ', description: 'Golden ratio shielding', derivedFrom: 'RS', value: 82 * 82 * 11.34 * PHI, unit: 'φ-Z²·g/cm³' },
    ],
    uses: [
      { layer: 'core', component: 'Core Radiation Shield', purpose: 'Protects core from radiation', formula: 'RS', intensity: 1 },
      { layer: 'kernel', component: 'Kernel Shield', purpose: 'Kernel radiation protection', formula: 'XA', intensity: 0.95 },
      { layer: 'memory', component: 'Memory Shield', purpose: 'Protects memory from radiation', formula: 'GS', intensity: 0.9 },
      { layer: 'network', component: 'Network Isolation', purpose: 'Isolates network from interference', formula: 'SD', intensity: 0.85 },
      { layer: 'interface', component: 'Sound Barrier', purpose: 'Blocks interface noise', formula: 'SD', intensity: 0.8 },
      { layer: 'defense', component: 'Radiation Defense', purpose: 'Ultimate radiation shield', formula: 'RS', intensity: 1 },
      { layer: 'endpoint', component: 'Shielded Endpoints', purpose: 'Radiation-safe endpoints', formula: 'GS', intensity: 0.9 },
      { layer: 'tool', component: 'Shielded Tools', purpose: 'Tools for radiation environments', formula: 'RS', intensity: 0.9 },
    ],
    alloysWell: ['Sn', 'Sb' as MetalSymbol, 'Cu', 'Te' as MetalSymbol],
  },
  
  U: {
    symbol: 'U',
    name: 'Uranium',
    atomicNumber: 92,
    atomicMass: 238.029,
    category: 'power',
    meltingPoint: 1135,
    boilingPoint: 4131,
    density: 19.1,
    specificHeat: 0.116,
    thermalConductivity: 27.5,
    electricalResistivity: 2.8e-7,
    gibbsFreeEnergy: -1085.0,
    entropy: 50.2,
    primaryFormula: { name: 'Fission Energy', symbol: 'E(fission)', equation: 'E = 200 MeV per fission', description: 'Massive energy release', value: 200e6 * 1.602e-19, unit: 'J/fission' },
    secondaryFormulas: [
      { name: 'Energy Density', symbol: 'ED', equation: 'ED = 80 TJ/kg', description: 'Extreme energy density', derivedFrom: 'E(fission)', value: 80e12, unit: 'J/kg' },
      { name: 'Power Potential', symbol: 'PP', equation: 'PP = MW from grams', description: 'Massive power potential', derivedFrom: 'E(fission)', value: 1e6, unit: 'W/g' },
      { name: 'Density', symbol: 'ρ', equation: 'ρ = 19.1 g/cm³', description: 'Very dense', derivedFrom: 'E(fission)', value: 19.1, unit: 'g/cm³' },
      { name: 'Half-Life', symbol: 't½', equation: 't½ = 4.5 billion years (U-238)', description: 'Extremely stable', derivedFrom: 'E(fission)', value: 4.5e9, unit: 'years' },
      { name: 'Neutron Multiplication', symbol: 'k', equation: 'k = neutrons out / neutrons in', description: 'Chain reaction factor', derivedFrom: 'E(fission)', value: 2.5, unit: 'dimensionless' },
      { name: 'Criticality', symbol: 'Cr', equation: 'Cr = mass for sustained reaction', description: 'Critical mass for chain reaction', derivedFrom: 'E(fission)', value: 52, unit: 'kg' },
      { name: 'PHI-Scaled Power', symbol: 'E(φ)', equation: 'E(φ) = E × φ', description: 'Golden ratio power', derivedFrom: 'E(fission)', value: 200e6 * 1.602e-19 * PHI, unit: 'φ-J' },
    ],
    uses: [
      { layer: 'core', component: 'Power Core', purpose: 'Massive energy generation', formula: 'E(fission)', intensity: 1 },
      { layer: 'kernel', component: 'Kernel Power', purpose: 'Powers kernel operations', formula: 'ED', intensity: 0.9 },
      { layer: 'memory', component: 'Memory Power', purpose: 'Powers memory systems', formula: 'PP', intensity: 0.85 },
      { layer: 'network', component: 'Network Power', purpose: 'Powers network infrastructure', formula: 'PP', intensity: 0.85 },
      { layer: 'interface', component: 'Interface Power', purpose: 'Powers user interfaces', formula: 'PP', intensity: 0.8 },
      { layer: 'defense', component: 'Defense Power', purpose: 'Powers defense systems', formula: 'E(fission)', intensity: 0.95 },
      { layer: 'endpoint', component: 'Endpoint Power', purpose: 'Powers endpoints', formula: 'PP', intensity: 0.85 },
      { layer: 'tool', component: 'High-Power Tools', purpose: 'Tools needing massive power', formula: 'ED', intensity: 0.9 },
    ],
    alloysWell: ['Pu' as MetalSymbol, 'Zr' as MetalSymbol, 'Mo' as MetalSymbol, 'Nb' as MetalSymbol],
  },
  
  Th: {
    symbol: 'Th',
    name: 'Thorium',
    atomicNumber: 90,
    atomicMass: 232.038,
    category: 'power',
    meltingPoint: 1750,
    boilingPoint: 4788,
    density: 11.7,
    specificHeat: 0.113,
    thermalConductivity: 54.0,
    electricalResistivity: 1.3e-7,
    gibbsFreeEnergy: -1169.2,
    entropy: 53.4,
    primaryFormula: { name: 'Breeding Ratio', symbol: 'BR', equation: 'BR = Th-232 + n → U-233 (fertile)', description: 'Breeds to fissile fuel', value: 1.0, unit: 'dimensionless' },
    secondaryFormulas: [
      { name: 'Abundance', symbol: 'A', equation: 'A = 3× more than uranium', description: 'More abundant than uranium', derivedFrom: 'BR', value: 3, unit: 'relative' },
      { name: 'Waste Reduction', symbol: 'WR', equation: 'WR = less long-lived waste', description: 'Cleaner nuclear fuel', derivedFrom: 'BR', value: 0.1, unit: 'relative' },
      { name: 'Proliferation Resistance', symbol: 'PR', equation: 'PR = harder to weaponize', description: 'Safer nuclear fuel', derivedFrom: 'BR', value: 0.95, unit: 'dimensionless' },
      { name: 'Temperature Tolerance', symbol: 'TT', equation: 'TT = higher melting point', description: 'Works at higher temps', derivedFrom: 'BR', value: 1750, unit: '°C' },
      { name: 'Energy Per Kg', symbol: 'E/kg', equation: 'E/kg = 79 TJ/kg', description: 'Similar to uranium', derivedFrom: 'BR', value: 79e12, unit: 'J/kg' },
      { name: 'Cycle Efficiency', symbol: 'CE', equation: 'CE = thorium fuel cycle', description: 'Efficient fuel cycle', derivedFrom: 'BR', value: 0.9, unit: 'dimensionless' },
      { name: 'PHI-Scaled Breed', symbol: 'BR(φ)', equation: 'BR(φ) = BR × φ', description: 'Golden ratio breeding', derivedFrom: 'BR', value: 1.0 * PHI, unit: 'φ' },
    ],
    uses: [
      { layer: 'core', component: 'Breeding Core', purpose: 'Breeds fuel for long-term power', formula: 'BR', intensity: 0.95 },
      { layer: 'kernel', component: 'Clean Kernel Power', purpose: 'Cleaner kernel power', formula: 'WR', intensity: 0.9 },
      { layer: 'memory', component: 'Sustainable Memory Power', purpose: 'Long-term memory power', formula: 'A', intensity: 0.85 },
      { layer: 'network', component: 'Clean Network Power', purpose: 'Clean network energy', formula: 'WR', intensity: 0.85 },
      { layer: 'interface', component: 'Safe Interface Power', purpose: 'Safe interface energy', formula: 'PR', intensity: 0.8 },
      { layer: 'defense', component: 'Long-Term Defense Power', purpose: 'Sustainable defense energy', formula: 'BR', intensity: 0.9 },
      { layer: 'endpoint', component: 'Endpoint Sustainable Power', purpose: 'Long-term endpoint power', formula: 'CE', intensity: 0.85 },
      { layer: 'tool', component: 'Clean-Power Tools', purpose: 'Tools with clean power', formula: 'WR', intensity: 0.85 },
    ],
    alloysWell: ['Mg' as MetalSymbol, 'Al', 'Zr' as MetalSymbol, 'U'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 10 ALPHA MODELS — Thermodynamic models for the substrate
// ═══════════════════════════════════════════════════════════════════════════════

export const ALPHA_MODELS: AlphaModel[] = [
  {
    id: 'alpha-001',
    name: 'Entropy Shield',
    description: 'Uses the Second Law of Thermodynamics to create irreversible protection',
    governingLaw: 'Second Law of Thermodynamics: ΔS_universe ≥ 0',
    equation: 'ΔS_total = ΔS_system + ΔS_surroundings ≥ 0',
    metals: ['Au', 'Ir', 'Os'],
    uses: ['Corruption prevention', 'One-way security gates', 'Irreversible commitments'],
  },
  {
    id: 'alpha-002',
    name: 'Gibbs Stability',
    description: 'Uses Gibbs free energy minimization for equilibrium stability',
    governingLaw: 'Gibbs Free Energy Minimization: ΔG < 0 for spontaneous processes',
    equation: 'ΔG = ΔH - TΔS',
    metals: ['Au', 'Pt', 'Pd'],
    uses: ['State stability', 'Equilibrium maintenance', 'Spontaneous healing'],
  },
  {
    id: 'alpha-003',
    name: 'Heat Engine',
    description: 'Carnot efficiency for maximum work extraction',
    governingLaw: 'Carnot Efficiency: η_max = 1 - T_cold/T_hot',
    equation: 'W = Q_hot × (1 - T_cold/T_hot)',
    metals: ['W', 'Co', 'Ti'],
    uses: ['Power generation', 'Energy conversion', 'Thermal processing'],
  },
  {
    id: 'alpha-004',
    name: 'Conduction Flow',
    description: 'Fourier law for optimal heat and signal flow',
    governingLaw: "Fourier's Law: q = -k × ∇T",
    equation: 'Q = k × A × ΔT / L',
    metals: ['Ag', 'Cu', 'Au'],
    uses: ['Signal transmission', 'Heat dissipation', 'Energy distribution'],
  },
  {
    id: 'alpha-005',
    name: 'Phase Transition',
    description: 'Clausius-Clapeyron for controlled state changes',
    governingLaw: 'Clausius-Clapeyron: dP/dT = ΔH/(T×ΔV)',
    equation: 'ln(P2/P1) = -ΔH_vap/R × (1/T2 - 1/T1)',
    metals: ['Sn', 'Al', 'Zn'],
    uses: ['State transitions', 'Mode changes', 'Controlled transformations'],
  },
  {
    id: 'alpha-006',
    name: 'Activation Barrier',
    description: 'Arrhenius kinetics for controlled reaction rates',
    governingLaw: 'Arrhenius Equation: k = A × exp(-Ea/RT)',
    equation: 'rate = A × exp(-Ea/RT) × [reactants]',
    metals: ['Pt', 'Pd', 'Rh'],
    uses: ['Rate control', 'Access barriers', 'Selective activation'],
  },
  {
    id: 'alpha-007',
    name: 'Maxwell Distribution',
    description: 'Statistical mechanics for particle/entity distribution',
    governingLaw: 'Maxwell-Boltzmann: f(v) = 4π(m/2πkT)^(3/2) × v² × exp(-mv²/2kT)',
    equation: 'P(E) = g(E) × exp(-E/kT) / Z',
    metals: ['Fe', 'Ni', 'Co'],
    uses: ['Load distribution', 'Resource allocation', 'Statistical balancing'],
  },
  {
    id: 'alpha-008',
    name: 'Pressure Equilibrium',
    description: 'Ideal gas law for pressure balance',
    governingLaw: 'Ideal Gas Law: PV = nRT',
    equation: 'P = nRT/V',
    metals: ['Os', 'Ir', 'W'],
    uses: ['Pressure management', 'Volume control', 'Compression handling'],
  },
  {
    id: 'alpha-009',
    name: 'Electrochemical Potential',
    description: 'Nernst equation for electrochemical equilibrium',
    governingLaw: 'Nernst Equation: E = E° - (RT/nF) × ln(Q)',
    equation: 'E_cell = E°_cell - (0.0592/n) × log(Q)',
    metals: ['Ag', 'Cu', 'Zn'],
    uses: ['Potential balance', 'Electron flow control', 'Redox management'],
  },
  {
    id: 'alpha-010',
    name: 'Thermal Mass',
    description: 'Heat capacity for thermal inertia and stability',
    governingLaw: 'Heat Capacity: Q = m × c × ΔT',
    equation: 'C = dQ/dT = m × c',
    metals: ['Ti', 'Al', 'Fe'],
    uses: ['Thermal buffering', 'Temperature stability', 'Energy storage'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// THERMODYNAMICS ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class ThermodynamicsSubstrate {
  private metals: Map<MetalSymbol, Metal>;
  private alphaModels: AlphaModel[];
  private activeFormulas: Map<string, number>;
  
  constructor() {
    this.metals = new Map(Object.entries(METALS) as [MetalSymbol, Metal][]);
    this.alphaModels = ALPHA_MODELS;
    this.activeFormulas = new Map();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // METAL OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** Get a metal by symbol */
  getMetal(symbol: MetalSymbol): Metal | undefined {
    return this.metals.get(symbol);
  }
  
  /** Get all metals */
  getAllMetals(): Metal[] {
    return Array.from(this.metals.values());
  }
  
  /** Get metals by category */
  getMetalsByCategory(category: MetalCategory): Metal[] {
    return this.getAllMetals().filter(m => m.category === category);
  }
  
  /** Get metals for a specific layer */
  getMetalsForLayer(layer: ArchitectureLayer): Array<{ metal: Metal; use: MetalUse }> {
    const result: Array<{ metal: Metal; use: MetalUse }> = [];
    
    for (const metal of this.metals.values()) {
      const use = metal.uses.find(u => u.layer === layer);
      if (use) {
        result.push({ metal, use });
      }
    }
    
    return result.sort((a, b) => b.use.intensity - a.use.intensity);
  }
  
  /** Calculate total protection for a layer */
  calculateLayerProtection(layer: ArchitectureLayer): number {
    const layerMetals = this.getMetalsForLayer(layer);
    let totalProtection = 0;
    
    for (const { metal, use } of layerMetals) {
      totalProtection += metal.primaryFormula.value * use.intensity * PHI_ENTROPY;
    }
    
    return totalProtection;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FORMULA OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** Get primary formula for a metal */
  getPrimaryFormula(symbol: MetalSymbol): PrimaryFormula | undefined {
    return this.metals.get(symbol)?.primaryFormula;
  }
  
  /** Get all secondary formulas for a metal */
  getSecondaryFormulas(symbol: MetalSymbol): SecondaryFormula[] {
    return this.metals.get(symbol)?.secondaryFormulas || [];
  }
  
  /** Calculate formula value with PHI scaling */
  calculateFormula(symbol: MetalSymbol, formulaName: string): number {
    const metal = this.metals.get(symbol);
    if (!metal) return 0;
    
    // Check primary formula
    if (metal.primaryFormula.name === formulaName) {
      return metal.primaryFormula.value * PHI;
    }
    
    // Check secondary formulas
    const secondary = metal.secondaryFormulas.find(f => f.name === formulaName);
    if (secondary) {
      return secondary.value * PHI;
    }
    
    return 0;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ALPHA MODEL OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** Get an alpha model by ID */
  getAlphaModel(id: string): AlphaModel | undefined {
    return this.alphaModels.find(m => m.id === id);
  }
  
  /** Get all alpha models */
  getAllAlphaModels(): AlphaModel[] {
    return [...this.alphaModels];
  }
  
  /** Get alpha models that use a specific metal */
  getModelsForMetal(symbol: MetalSymbol): AlphaModel[] {
    return this.alphaModels.filter(m => m.metals.includes(symbol));
  }
  
  /** Apply an alpha model (returns effectiveness) */
  applyAlphaModel(modelId: string, intensity: number = 1): number {
    const model = this.getAlphaModel(modelId);
    if (!model) return 0;
    
    // Calculate effectiveness based on metals and intensity
    let effectiveness = 0;
    
    for (const symbol of model.metals) {
      const metal = this.metals.get(symbol);
      if (metal) {
        effectiveness += metal.primaryFormula.value * intensity * PHI_ENTROPY;
      }
    }
    
    // Store active formula value
    this.activeFormulas.set(modelId, effectiveness);
    
    return effectiveness;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ALLOY OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** Check if two metals alloy well */
  alloysWell(symbol1: MetalSymbol, symbol2: MetalSymbol): boolean {
    const metal1 = this.metals.get(symbol1);
    return metal1?.alloysWell.includes(symbol2) || false;
  }
  
  /** Get alloy strength (combined properties) */
  getAlloyStrength(symbols: MetalSymbol[]): number {
    let strength = 0;
    const synergy = 1;
    
    for (let i = 0; i < symbols.length; i++) {
      const metal = this.metals.get(symbols[i]);
      if (metal) {
        strength += metal.primaryFormula.value;
        
        // Add synergy bonus for compatible alloys
        for (let j = i + 1; j < symbols.length; j++) {
          if (this.alloysWell(symbols[i], symbols[j])) {
            strength *= (1 + PHI_ENTROPY);
          }
        }
      }
    }
    
    return strength * synergy;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** Get substrate statistics */
  getStats(): {
    totalMetals: number;
    totalFormulas: number;
    totalUses: number;
    alphaModels: number;
    categories: Record<MetalCategory, number>;
    layers: Record<ArchitectureLayer, number>;
  } {
    const categories: Partial<Record<MetalCategory, number>> = {};
    const layers: Partial<Record<ArchitectureLayer, number>> = {};
    let totalFormulas = 0;
    let totalUses = 0;
    
    for (const metal of this.metals.values()) {
      // Count categories
      categories[metal.category] = (categories[metal.category] || 0) + 1;
      
      // Count formulas
      totalFormulas += 1 + metal.secondaryFormulas.length;
      
      // Count uses and layers
      totalUses += metal.uses.length;
      for (const use of metal.uses) {
        layers[use.layer] = (layers[use.layer] || 0) + 1;
      }
    }
    
    return {
      totalMetals: this.metals.size,
      totalFormulas,
      totalUses,
      alphaModels: this.alphaModels.length,
      categories: categories as Record<MetalCategory, number>,
      layers: layers as Record<ArchitectureLayer, number>,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

let substanceInstance: ThermodynamicsSubstrate | null = null;

export function getThermodynamicsSubstrate(): ThermodynamicsSubstrate {
  if (!substanceInstance) {
    substanceInstance = new ThermodynamicsSubstrate();
  }
  return substanceInstance;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
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
};
