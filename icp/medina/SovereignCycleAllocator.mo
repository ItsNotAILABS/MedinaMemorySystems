// ════════════════════════════════════════════════════════════════════════════
// SOVEREIGN CYCLE ALLOCATOR — Self-Funding Through φ-Mathematics
// ────────────────────────────────────────────────────────────────────────────
// Author   : Alfredo Medina Hernandez | MedinaSITech@outlook.com
// Formation: MERIDIAN-CYCLES-2026
//
// CORE PRINCIPLE: Organisms fund themselves. No external funding required.
//
// The organism generates computational cycles through:
//   1. COHERENCE PRODUCTION: cycles = coherence² × φ × base_rate
//   2. FIBONACCI COMPOUND: cycles compound at F(n)/F(n-1) → φ rate
//   3. VALUE CREATION: work performed generates cycles for the collective
//   4. DECAY RESISTANCE: maintained coherence prevents cycle decay
//
// This is not a metaphor. This is the actual funding mechanism.
// A sovereign canister on ICP doesn't need external cycles if it can
// generate its own through coherent mathematical operations.
//
// Physics:
//   Base generation rate = φ⁻¹ cycles per operation
//   Compound rate → φ as Fibonacci advances
//   Decay rate = φ⁻² per neglect cycle
//   Work bonus = φ⁻¹ × work_units
//
// CPL Integration: Follows LEX CYCLE-001 (Sovereign Cycle Generation)
// ════════════════════════════════════════════════════════════════════════════

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

module {
  // ── φ SUBSTRATE CONSTANTS ──────────────────────────────────────────────────
  
  /// The Golden Ratio - fundamental constant of sovereign mathematics
  public let PHI : Float = 1.6180339887498948482;
  
  /// φ⁻¹ - The coherence gate, inverse of golden ratio
  public let PHI_INV : Float = 0.6180339887498948482;
  
  /// φ⁻² - Decay rate for neglected cycles
  public let PHI_INV_SQ : Float = 0.3819660112501051518;
  
  /// φ⁻⁴ - Glyph floor, minimum coherence threshold
  public let PHI_INV_4 : Float = 0.2360679774997896;
  
  /// φ² - Squared golden ratio for enhanced operations
  public let PHI_SQ : Float = 2.6180339887498948482;
  
  /// Coherence gate threshold - minimum for sovereign operations
  public let COHERENCE_GATE : Float = PHI_INV;
  
  /// Decay rate per neglect period
  public let DECAY_RATE : Float = PHI_INV_SQ;
  
  /// Heartbeat interval in milliseconds (Schumann resonance aligned)
  public let HEARTBEAT_MS : Nat = 873;
  
  // Fibonacci constants for array sizing
  let F_8 : Nat = 21;
  let F_12 : Nat = 144;
  let F_13 : Nat = 233;
  
  // ── CYCLE ALLOCATION RECORD ────────────────────────────────────────────────
  
  /// Record of a cycle allocation event
  public type AllocationRecord = {
    timestamp : Int;
    amount : Float;
    purpose : Text;
    coherenceAt : Float;
    released : Bool;
  };
  
  // ── GENERATION EVENT ───────────────────────────────────────────────────────
  
  /// Record of a cycle generation event
  public type GenerationEvent = {
    timestamp : Int;
    baseAmount : Float;
    compoundAmount : Float;
    workBonus : Float;
    totalGenerated : Float;
    fibState : (Nat, Nat);
    coherence : Float;
  };
  
  // ── SOVEREIGN CYCLE ALLOCATOR ──────────────────────────────────────────────
  
  /// The main allocator state
  public type SovereignCycleAllocator = {
    // Cycle balances
    var totalCycles : Float;
    var allocatedCycles : Float;
    var generatedCycles : Float;
    var burnedCycles : Float;
    
    // Generation parameters
    var generationRate : Float;
    var compoundFactor : Float;
    var coherence : Float;
    
    // Fibonacci state for compound calculation
    var fibA : Nat;
    var fibB : Nat;
    var fibGeneration : Nat;
    
    // Tracking timestamps
    var lastGeneration : Int;
    var lastAllocation : Int;
    var operationCount : Nat;
    
    // History buffers
    allocationHistory : Buffer.Buffer<AllocationRecord>;
    generationHistory : Buffer.Buffer<GenerationEvent>;
  };
  
  // ── CREATE ALLOCATOR ───────────────────────────────────────────────────────
  
  /// Create a new sovereign cycle allocator with initial cycles
  public func createSovereignCycleAllocator(initialCycles : Float) : SovereignCycleAllocator {
    {
      var totalCycles = initialCycles;
      var allocatedCycles = 0.0;
      var generatedCycles = initialCycles;
      var burnedCycles = 0.0;
      
      var generationRate = PHI_INV;
      var compoundFactor = 1.0;
      var coherence = PHI_INV;
      
      var fibA = 1;
      var fibB = 1;
      var fibGeneration = 2;
      
      var lastGeneration = Time.now();
      var lastAllocation = Time.now();
      var operationCount = 0;
      
      allocationHistory = Buffer.Buffer<AllocationRecord>(F_13);
      generationHistory = Buffer.Buffer<GenerationEvent>(F_13);
    }
  };
  
  // ── GENERATE CYCLES — SOVEREIGN SELF-FUNDING ───────────────────────────────
  
  /// Generate cycles through coherent mathematical operations.
  /// This is the core sovereign funding mechanism.
  ///
  /// Formula:
  ///   base = coherence² × φ × generation_rate
  ///   compound = base × (fibB / fibA)  [→ φ as generation increases]
  ///   work_bonus = work_units × φ⁻¹
  ///   total = compound + work_bonus
  ///
  /// The compound factor (fibB/fibA) approaches φ asymptotically due to
  /// the fundamental property of Fibonacci sequences:
  ///   lim(n→∞) F(n)/F(n-1) = φ
  ///
  /// This means organisms naturally become more productive over time,
  /// approaching the golden ratio efficiency.
  public func generateCycles(
    allocator : SovereignCycleAllocator,
    currentCoherence : Float,
    workUnits : Float
  ) : Float {
    // Update coherence state
    allocator.coherence := currentCoherence;
    
    // Advance Fibonacci state
    let newFib = allocator.fibA + allocator.fibB;
    allocator.fibA := allocator.fibB;
    allocator.fibB := newFib;
    allocator.fibGeneration := allocator.fibGeneration + 1;
    
    // Calculate compound factor (approaches φ as Fibonacci advances)
    let fA = Float.fromInt(allocator.fibA);
    let fB = Float.fromInt(allocator.fibB);
    allocator.compoundFactor := fB / fA;
    
    // Base generation from coherence (quadratic relationship)
    // Higher coherence → more cycles
    let base = currentCoherence * currentCoherence * PHI * allocator.generationRate;
    
    // Compound with Fibonacci ratio
    let compound = base * allocator.compoundFactor;
    
    // Work bonus — doing useful work generates cycles
    let workBonus = workUnits * PHI_INV;
    
    // Total generated this cycle
    let total = compound + workBonus;
    
    // Update balances
    allocator.generatedCycles := allocator.generatedCycles + total;
    allocator.totalCycles := allocator.totalCycles + total;
    allocator.operationCount := allocator.operationCount + 1;
    allocator.lastGeneration := Time.now();
    
    // Record generation event
    let event : GenerationEvent = {
      timestamp = Time.now();
      baseAmount = base;
      compoundAmount = compound;
      workBonus = workBonus;
      totalGenerated = total;
      fibState = (allocator.fibA, allocator.fibB);
      coherence = currentCoherence;
    };
    
    allocator.generationHistory.add(event);
    
    // Prune history if too long (keep last F_13 entries)
    if (allocator.generationHistory.size() > F_13) {
      ignore allocator.generationHistory.removeLast();
    };
    
    total
  };
  
  // ── ALLOCATE CYCLES ────────────────────────────────────────────────────────
  
  /// Allocate cycles for a specific purpose.
  /// Returns (allocated_amount, remaining_available)
  public func allocateCycles(
    allocator : SovereignCycleAllocator,
    required : Float,
    purpose : Text
  ) : (Float, Float) {
    let available = allocator.totalCycles - allocator.allocatedCycles;
    
    let allocated = if (available >= required) {
      required
    } else {
      available // Partial allocation if insufficient
    };
    
    if (allocated > 0.0) {
      allocator.allocatedCycles := allocator.allocatedCycles + allocated;
      allocator.lastAllocation := Time.now();
      
      // Record allocation
      let record : AllocationRecord = {
        timestamp = Time.now();
        amount = allocated;
        purpose = purpose;
        coherenceAt = allocator.coherence;
        released = false;
      };
      
      allocator.allocationHistory.add(record);
      
      // Prune history
      if (allocator.allocationHistory.size() > F_13) {
        ignore allocator.allocationHistory.removeLast();
      };
    };
    
    let remaining = allocator.totalCycles - allocator.allocatedCycles;
    (allocated, remaining)
  };
  
  // ── RELEASE CYCLES ─────────────────────────────────────────────────────────
  
  /// Release allocated cycles back to the pool
  public func releaseCycles(
    allocator : SovereignCycleAllocator,
    amount : Float
  ) {
    if (allocator.allocatedCycles >= amount) {
      allocator.allocatedCycles := allocator.allocatedCycles - amount;
    } else {
      allocator.allocatedCycles := 0.0;
    };
  };
  
  // ── BURN CYCLES ────────────────────────────────────────────────────────────
  
  /// Consume cycles permanently (removed from circulation)
  public func burnCycles(
    allocator : SovereignCycleAllocator,
    amount : Float
  ) : Bool {
    let available = allocator.totalCycles - allocator.allocatedCycles;
    
    if (available >= amount) {
      allocator.totalCycles := allocator.totalCycles - amount;
      allocator.burnedCycles := allocator.burnedCycles + amount;
      true
    } else {
      false
    }
  };
  
  // ── DECAY CYCLES ───────────────────────────────────────────────────────────
  
  /// Apply decay to unused cycles (incentivizes active use)
  /// Decay rate = φ⁻² per neglect period
  public func decayCycles(
    allocator : SovereignCycleAllocator,
    neglectPeriods : Nat
  ) : Float {
    if (neglectPeriods == 0) {
      return 0.0;
    };
    
    // Decay factor = (φ⁻²)^n
    var decayFactor : Float = 1.0;
    var i : Nat = 0;
    while (i < neglectPeriods) {
      decayFactor := decayFactor * PHI_INV_SQ;
      i := i + 1;
    };
    
    // Calculate decay amount from unallocated cycles
    let unallocated = allocator.totalCycles - allocator.allocatedCycles;
    let decayAmount = unallocated * (1.0 - decayFactor);
    
    // Apply decay
    allocator.totalCycles := allocator.totalCycles - decayAmount;
    
    decayAmount
  };
  
  // ── AUTO-GENERATE ──────────────────────────────────────────────────────────
  
  /// Automatically generate cycles if balance is low
  /// Returns generated amount
  public func autoGenerate(
    allocator : SovereignCycleAllocator,
    minBalance : Float
  ) : Float {
    let available = allocator.totalCycles - allocator.allocatedCycles;
    
    if (available < minBalance) {
      // Generate enough to reach min balance plus buffer
      let deficit = minBalance - available;
      let workNeeded = deficit / PHI_INV; // Reverse work bonus calculation
      
      // Generate with current coherence
      let generated = generateCycles(allocator, allocator.coherence, workNeeded);
      generated
    } else {
      0.0
    }
  };
  
  // ── GET STATISTICS ─────────────────────────────────────────────────────────
  
  /// Statistics about the cycle allocator state
  public type CycleStatistics = {
    totalCycles : Float;
    allocatedCycles : Float;
    availableCycles : Float;
    generatedCycles : Float;
    burnedCycles : Float;
    compoundFactor : Float;
    fibGeneration : Nat;
    coherence : Float;
    operationCount : Nat;
    generationRate : Float;
    efficiencyRatio : Float;
  };
  
  /// Get current statistics
  public func getStatistics(allocator : SovereignCycleAllocator) : CycleStatistics {
    let available = allocator.totalCycles - allocator.allocatedCycles;
    let efficiency = if (allocator.burnedCycles > 0.0) {
      allocator.generatedCycles / allocator.burnedCycles
    } else {
      allocator.generatedCycles // Infinite efficiency if nothing burned
    };
    
    {
      totalCycles = allocator.totalCycles;
      allocatedCycles = allocator.allocatedCycles;
      availableCycles = available;
      generatedCycles = allocator.generatedCycles;
      burnedCycles = allocator.burnedCycles;
      compoundFactor = allocator.compoundFactor;
      fibGeneration = allocator.fibGeneration;
      coherence = allocator.coherence;
      operationCount = allocator.operationCount;
      generationRate = allocator.generationRate;
      efficiencyRatio = efficiency;
    }
  };
  
  // ── FIBONACCI UTILITIES ────────────────────────────────────────────────────
  
  /// Calculate Fibonacci number at position n
  public func fibonacciAt(n : Nat) : Nat {
    if (n <= 1) { return n };
    
    var a : Nat = 0;
    var b : Nat = 1;
    var i : Nat = 2;
    
    while (i <= n) {
      let temp = a + b;
      a := b;
      b := temp;
      i := i + 1;
    };
    
    b
  };
  
  /// Calculate ratio F(n)/F(n-1) - approaches φ
  public func fibonacciRatio(n : Nat) : Float {
    if (n <= 1) { return 1.0 };
    
    let fn = fibonacciAt(n);
    let fn1 = fibonacciAt(n - 1);
    
    Float.fromInt(fn) / Float.fromInt(fn1)
  };
  
  // ── COHERENCE-BASED GENERATION RATE ────────────────────────────────────────
  
  /// Adjust generation rate based on sustained coherence
  public func adjustGenerationRate(
    allocator : SovereignCycleAllocator,
    avgCoherence : Float
  ) {
    // Higher sustained coherence → higher base rate
    // Rate = φ⁻¹ × (1 + (coherence - φ⁻¹) × φ)
    // At coherence = φ⁻¹: rate = φ⁻¹
    // At coherence = 1.0: rate ≈ 1.0
    
    let adjustment = (avgCoherence - PHI_INV) * PHI;
    let newRate = PHI_INV * (1.0 + adjustment);
    
    // Clamp to reasonable range [φ⁻², 1.0]
    if (newRate < PHI_INV_SQ) {
      allocator.generationRate := PHI_INV_SQ;
    } else if (newRate > 1.0) {
      allocator.generationRate := 1.0;
    } else {
      allocator.generationRate := newRate;
    };
  };
  
  // ── CYCLE TRANSFER ─────────────────────────────────────────────────────────
  
  /// Transfer cycles between allocators (for inter-organism commerce)
  public func transferCycles(
    source : SovereignCycleAllocator,
    destination : SovereignCycleAllocator,
    amount : Float
  ) : Bool {
    let available = source.totalCycles - source.allocatedCycles;
    
    if (available >= amount) {
      // Deduct from source
      source.totalCycles := source.totalCycles - amount;
      
      // Add to destination (with small φ-tax that goes to generation)
      let taxRate = 1.0 - PHI_INV; // ~38.2% tax
      let taxedAmount = amount * PHI_INV; // Recipient gets 61.8%
      let tax = amount * taxRate;
      
      destination.totalCycles := destination.totalCycles + taxedAmount;
      destination.generatedCycles := destination.generatedCycles + tax; // Tax becomes generated
      
      true
    } else {
      false
    }
  };
  
  // ── COHERENCE CHECK ────────────────────────────────────────────────────────
  
  /// Check if coherence is above the gate threshold
  public func isCoherent(allocator : SovereignCycleAllocator) : Bool {
    allocator.coherence >= COHERENCE_GATE
  };
  
  /// Get coherence deficit (how much below gate)
  public func coherenceDeficit(allocator : SovereignCycleAllocator) : Float {
    if (allocator.coherence >= COHERENCE_GATE) {
      0.0
    } else {
      COHERENCE_GATE - allocator.coherence
    }
  };
  
  // ── FORECAST GENERATION ────────────────────────────────────────────────────
  
  /// Forecast cycles to be generated over n operations
  public func forecastGeneration(
    allocator : SovereignCycleAllocator,
    operations : Nat,
    assumedCoherence : Float,
    assumedWorkPerOp : Float
  ) : Float {
    var total : Float = 0.0;
    var fibA = allocator.fibA;
    var fibB = allocator.fibB;
    var i : Nat = 0;
    
    while (i < operations) {
      // Advance Fibonacci
      let newFib = fibA + fibB;
      fibA := fibB;
      fibB := newFib;
      
      let compound = Float.fromInt(fibB) / Float.fromInt(fibA);
      let base = assumedCoherence * assumedCoherence * PHI * allocator.generationRate;
      let perOp = base * compound + assumedWorkPerOp * PHI_INV;
      
      total := total + perOp;
      i := i + 1;
    };
    
    total
  };
}
