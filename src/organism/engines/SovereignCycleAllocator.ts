// ════════════════════════════════════════════════════════════════════════════
// SOVEREIGN CYCLE ALLOCATOR — TypeScript Interface
// ════════════════════════════════════════════════════════════════════════════
// Browser/Node.js implementation of φ-Mathematics based self-funding
//
// Author: Alfredo Medina Hernandez | MedinaSITech@outlook.com
// Formation: MERIDIAN-CYCLES-2026
// CPL Integration: LEX CYCLE-001 (Sovereign Cycle Generation)
// ════════════════════════════════════════════════════════════════════════════

// ── φ SUBSTRATE CONSTANTS ────────────────────────────────────────────────────

/** The Golden Ratio - fundamental constant of sovereign mathematics */
export const PHI = 1.6180339887498948482;

/** φ⁻¹ - The coherence gate, inverse of golden ratio */
export const PHI_INV = 0.6180339887498948482;

/** φ⁻² - Decay rate for neglected cycles */
export const PHI_INV_SQ = 0.3819660112501051518;

/** φ⁻⁴ - Glyph floor, minimum coherence threshold */
export const PHI_INV_4 = 0.2360679774997896;

/** φ² - Squared golden ratio for enhanced operations */
export const PHI_SQ = 2.6180339887498948482;

/** Coherence gate threshold - minimum for sovereign operations */
export const COHERENCE_GATE = PHI_INV;

/** Decay rate per neglect period */
export const DECAY_RATE = PHI_INV_SQ;

/** Heartbeat interval in milliseconds (Schumann resonance aligned) */
export const HEARTBEAT_MS = 873;

// Fibonacci constants
const F_13 = 233;

// ── TYPE DEFINITIONS ─────────────────────────────────────────────────────────

/** Record of a cycle allocation event */
export interface AllocationRecord {
  timestamp: number;
  amount: number;
  purpose: string;
  coherenceAt: number;
  released: boolean;
}

/** Record of a cycle generation event */
export interface GenerationEvent {
  timestamp: number;
  baseAmount: number;
  compoundAmount: number;
  workBonus: number;
  totalGenerated: number;
  fibState: [number, number];
  coherence: number;
}

/** Statistics about the cycle allocator state */
export interface CycleStatistics {
  totalCycles: number;
  allocatedCycles: number;
  availableCycles: number;
  generatedCycles: number;
  burnedCycles: number;
  compoundFactor: number;
  fibGeneration: number;
  coherence: number;
  operationCount: number;
  generationRate: number;
  efficiencyRatio: number;
}

// ── SOVEREIGN CYCLE ALLOCATOR CLASS ──────────────────────────────────────────

/**
 * SovereignCycleAllocator - Self-funding through φ-mathematics
 * 
 * The organism generates computational cycles through:
 *   1. COHERENCE PRODUCTION: cycles = coherence² × φ × base_rate
 *   2. FIBONACCI COMPOUND: cycles compound at F(n)/F(n-1) → φ rate
 *   3. VALUE CREATION: work performed generates cycles for the collective
 *   4. DECAY RESISTANCE: maintained coherence prevents cycle decay
 */
export class SovereignCycleAllocator {
  // Cycle balances
  private totalCycles: number;
  private allocatedCycles: number;
  private generatedCycles: number;
  private burnedCycles: number;

  // Generation parameters
  private generationRate: number;
  private compoundFactor: number;
  private coherence: number;

  // Fibonacci state
  private fibA: number;
  private fibB: number;
  private fibGeneration: number;

  // Tracking
  private lastGeneration: number;
  private lastAllocation: number;
  private operationCount: number;

  // History
  private allocationHistory: AllocationRecord[];
  private generationHistory: GenerationEvent[];

  /**
   * Create a new sovereign cycle allocator
   * @param initialCycles - Starting cycle balance
   */
  constructor(initialCycles: number = 0) {
    const now = Date.now();

    this.totalCycles = initialCycles;
    this.allocatedCycles = 0;
    this.generatedCycles = initialCycles;
    this.burnedCycles = 0;

    this.generationRate = PHI_INV;
    this.compoundFactor = 1.0;
    this.coherence = PHI_INV;

    this.fibA = 1;
    this.fibB = 1;
    this.fibGeneration = 2;

    this.lastGeneration = now;
    this.lastAllocation = now;
    this.operationCount = 0;

    this.allocationHistory = [];
    this.generationHistory = [];
  }

  // ── CORE OPERATIONS ──────────────────────────────────────────────────────

  /**
   * Generate cycles through coherent mathematical operations.
   * 
   * Formula:
   *   base = coherence² × φ × generation_rate
   *   compound = base × (fibB / fibA)  [→ φ as generation increases]
   *   work_bonus = work_units × φ⁻¹
   *   total = compound + work_bonus
   * 
   * @param currentCoherence - Current system coherence (0.0 - 1.0)
   * @param workUnits - Amount of useful work performed
   * @returns Total cycles generated
   */
  generateCycles(currentCoherence: number, workUnits: number): number {
    // Update coherence state
    this.coherence = currentCoherence;

    // Advance Fibonacci state
    const newFib = this.fibA + this.fibB;
    this.fibA = this.fibB;
    this.fibB = newFib;
    this.fibGeneration++;

    // Calculate compound factor (approaches φ)
    this.compoundFactor = this.fibB / this.fibA;

    // Base generation from coherence (quadratic relationship)
    const base = currentCoherence * currentCoherence * PHI * this.generationRate;

    // Compound with Fibonacci ratio
    const compound = base * this.compoundFactor;

    // Work bonus
    const workBonus = workUnits * PHI_INV;

    // Total generated
    const total = compound + workBonus;

    // Update balances
    this.generatedCycles += total;
    this.totalCycles += total;
    this.operationCount++;
    this.lastGeneration = Date.now();

    // Record generation event
    const event: GenerationEvent = {
      timestamp: Date.now(),
      baseAmount: base,
      compoundAmount: compound,
      workBonus,
      totalGenerated: total,
      fibState: [this.fibA, this.fibB],
      coherence: currentCoherence,
    };

    this.generationHistory.push(event);

    // Prune history
    if (this.generationHistory.length > F_13) {
      this.generationHistory.shift();
    }

    return total;
  }

  /**
   * Allocate cycles for a specific purpose
   * @param required - Number of cycles needed
   * @param purpose - Description of allocation purpose
   * @returns [allocated_amount, remaining_available]
   */
  allocateCycles(required: number, purpose: string): [number, number] {
    const available = this.totalCycles - this.allocatedCycles;
    const allocated = Math.min(available, required);

    if (allocated > 0) {
      this.allocatedCycles += allocated;
      this.lastAllocation = Date.now();

      const record: AllocationRecord = {
        timestamp: Date.now(),
        amount: allocated,
        purpose,
        coherenceAt: this.coherence,
        released: false,
      };

      this.allocationHistory.push(record);

      if (this.allocationHistory.length > F_13) {
        this.allocationHistory.shift();
      }
    }

    const remaining = this.totalCycles - this.allocatedCycles;
    return [allocated, remaining];
  }

  /**
   * Release allocated cycles back to the pool
   * @param amount - Amount to release
   */
  releaseCycles(amount: number): void {
    this.allocatedCycles = Math.max(0, this.allocatedCycles - amount);
  }

  /**
   * Consume cycles permanently
   * @param amount - Amount to burn
   * @returns true if successful
   */
  burnCycles(amount: number): boolean {
    const available = this.totalCycles - this.allocatedCycles;

    if (available >= amount) {
      this.totalCycles -= amount;
      this.burnedCycles += amount;
      return true;
    }
    return false;
  }

  /**
   * Apply decay to unused cycles
   * @param neglectPeriods - Number of neglect periods
   * @returns Amount of cycles decayed
   */
  decayCycles(neglectPeriods: number): number {
    if (neglectPeriods === 0) return 0;

    // Decay factor = (φ⁻²)^n
    const decayFactor = Math.pow(PHI_INV_SQ, neglectPeriods);

    // Calculate decay from unallocated
    const unallocated = this.totalCycles - this.allocatedCycles;
    const decayAmount = unallocated * (1 - decayFactor);

    // Apply decay
    this.totalCycles -= decayAmount;

    return decayAmount;
  }

  /**
   * Auto-generate if balance is low
   * @param minBalance - Minimum balance threshold
   * @returns Amount generated
   */
  autoGenerate(minBalance: number): number {
    const available = this.totalCycles - this.allocatedCycles;

    if (available < minBalance) {
      const deficit = minBalance - available;
      const workNeeded = deficit / PHI_INV;
      return this.generateCycles(this.coherence, workNeeded);
    }
    return 0;
  }

  // ── STATISTICS & QUERIES ─────────────────────────────────────────────────

  /**
   * Get current statistics
   */
  getStatistics(): CycleStatistics {
    const available = this.totalCycles - this.allocatedCycles;
    const efficiency = this.burnedCycles > 0
      ? this.generatedCycles / this.burnedCycles
      : this.generatedCycles;

    return {
      totalCycles: this.totalCycles,
      allocatedCycles: this.allocatedCycles,
      availableCycles: available,
      generatedCycles: this.generatedCycles,
      burnedCycles: this.burnedCycles,
      compoundFactor: this.compoundFactor,
      fibGeneration: this.fibGeneration,
      coherence: this.coherence,
      operationCount: this.operationCount,
      generationRate: this.generationRate,
      efficiencyRatio: efficiency,
    };
  }

  /**
   * Check if coherence is above the gate threshold
   */
  isCoherent(): boolean {
    return this.coherence >= COHERENCE_GATE;
  }

  /**
   * Get coherence deficit
   */
  getCoherenceDeficit(): number {
    return this.coherence >= COHERENCE_GATE
      ? 0
      : COHERENCE_GATE - this.coherence;
  }

  /**
   * Get allocation history
   */
  getAllocationHistory(): AllocationRecord[] {
    return [...this.allocationHistory];
  }

  /**
   * Get generation history
   */
  getGenerationHistory(): GenerationEvent[] {
    return [...this.generationHistory];
  }

  // ── RATE ADJUSTMENT ──────────────────────────────────────────────────────

  /**
   * Adjust generation rate based on sustained coherence
   * @param avgCoherence - Average coherence over time
   */
  adjustGenerationRate(avgCoherence: number): void {
    const adjustment = (avgCoherence - PHI_INV) * PHI;
    const newRate = PHI_INV * (1 + adjustment);

    // Clamp to [φ⁻², 1.0]
    this.generationRate = Math.max(PHI_INV_SQ, Math.min(1.0, newRate));
  }

  // ── FORECASTING ──────────────────────────────────────────────────────────

  /**
   * Forecast cycles to be generated over n operations
   * @param operations - Number of future operations
   * @param assumedCoherence - Assumed coherence level
   * @param assumedWorkPerOp - Assumed work units per operation
   * @returns Forecasted total cycles
   */
  forecastGeneration(
    operations: number,
    assumedCoherence: number,
    assumedWorkPerOp: number
  ): number {
    let total = 0;
    let fibA = this.fibA;
    let fibB = this.fibB;

    for (let i = 0; i < operations; i++) {
      // Advance Fibonacci
      const newFib = fibA + fibB;
      fibA = fibB;
      fibB = newFib;

      const compound = fibB / fibA;
      const base = assumedCoherence * assumedCoherence * PHI * this.generationRate;
      const perOp = base * compound + assumedWorkPerOp * PHI_INV;

      total += perOp;
    }

    return total;
  }

  // ── SERIALIZATION ────────────────────────────────────────────────────────

  /**
   * Serialize allocator state to JSON
   */
  toJSON(): object {
    return {
      totalCycles: this.totalCycles,
      allocatedCycles: this.allocatedCycles,
      generatedCycles: this.generatedCycles,
      burnedCycles: this.burnedCycles,
      generationRate: this.generationRate,
      compoundFactor: this.compoundFactor,
      coherence: this.coherence,
      fibA: this.fibA,
      fibB: this.fibB,
      fibGeneration: this.fibGeneration,
      lastGeneration: this.lastGeneration,
      lastAllocation: this.lastAllocation,
      operationCount: this.operationCount,
      allocationHistory: this.allocationHistory,
      generationHistory: this.generationHistory,
    };
  }

  /**
   * Restore allocator state from JSON
   */
  static fromJSON(json: any): SovereignCycleAllocator {
    const allocator = new SovereignCycleAllocator(0);

    allocator.totalCycles = json.totalCycles;
    allocator.allocatedCycles = json.allocatedCycles;
    allocator.generatedCycles = json.generatedCycles;
    allocator.burnedCycles = json.burnedCycles;
    allocator.generationRate = json.generationRate;
    allocator.compoundFactor = json.compoundFactor;
    allocator.coherence = json.coherence;
    allocator.fibA = json.fibA;
    allocator.fibB = json.fibB;
    allocator.fibGeneration = json.fibGeneration;
    allocator.lastGeneration = json.lastGeneration;
    allocator.lastAllocation = json.lastAllocation;
    allocator.operationCount = json.operationCount;
    allocator.allocationHistory = json.allocationHistory || [];
    allocator.generationHistory = json.generationHistory || [];

    return allocator;
  }
}

// ── UTILITY FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Calculate Fibonacci number at position n
 */
export function fibonacciAt(n: number): number {
  if (n <= 1) return n;

  let a = 0;
  let b = 1;

  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }

  return b;
}

/**
 * Calculate ratio F(n)/F(n-1) which approaches φ
 */
export function fibonacciRatio(n: number): number {
  if (n <= 1) return 1;

  const fn = fibonacciAt(n);
  const fn1 = fibonacciAt(n - 1);

  return fn / fn1;
}

/**
 * Transfer cycles between allocators with φ-tax
 * @param source - Source allocator
 * @param destination - Destination allocator
 * @param amount - Amount to transfer
 * @returns true if successful
 */
export function transferCycles(
  source: SovereignCycleAllocator,
  destination: SovereignCycleAllocator,
  amount: number
): boolean {
  const stats = source.getStatistics();

  if (stats.availableCycles >= amount) {
    // Burn from source
    source.burnCycles(amount);

    // Credit destination with φ-taxed amount (61.8%)
    const taxedAmount = amount * PHI_INV;
    destination.generateCycles(destination.getStatistics().coherence, taxedAmount / PHI_INV);

    return true;
  }
  return false;
}

// ── FACTORY FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Create a new cycle allocator with default initial cycles
 */
export function createAllocator(initialCycles: number = 1000): SovereignCycleAllocator {
  return new SovereignCycleAllocator(initialCycles);
}

/**
 * Create a coherent allocator (pre-warmed with generation cycles)
 */
export function createCoherentAllocator(
  initialCycles: number = 1000,
  warmupOperations: number = 10
): SovereignCycleAllocator {
  const allocator = new SovereignCycleAllocator(initialCycles);

  // Warm up with generation cycles at equilibrium coherence
  for (let i = 0; i < warmupOperations; i++) {
    allocator.generateCycles(PHI_INV, 1.0);
  }

  return allocator;
}

export default SovereignCycleAllocator;
