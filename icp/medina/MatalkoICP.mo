import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Array "mo:base/Array";

/// MatalkoICP: Sovereign Mathematical Computing Organism Core
/// Real mathematical formulas for field computation, harmonic frequencies,
/// phi-encoded geometry, and organism state evolution on ICP.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIVERSAL CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Golden ratio (φ) - fundamental to all organism geometry
  public let PHI : Float = 1.6180339887498948482;
  
  /// Inverse golden ratio (1/φ = φ-1)
  public let PHI_INVERSE : Float = 0.6180339887498948482;
  
  /// Phi squared (φ² = φ+1)
  public let PHI_SQUARED : Float = 2.6180339887498948482;
  
  /// Base harmonic frequency (432 Hz - universal tuning)
  public let FREQ_432 : Float = 432.0;
  
  /// Planck-scale normalization constant
  public let PLANCK_NORM : Float = 1.054571817e-34;
  
  /// Euler's number
  public let E : Float = 2.7182818284590452354;
  
  /// Pi
  public let PI : Float = 3.1415926535897932385;
  
  /// Two Pi (full rotation)
  public let TAU : Float = 6.2831853071795864769;

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM STATE TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Four-register organism state (MEDINA canonical)
  public type OrganismRegisters = {
    cognitive : Float;    // R1: Cognitive clarity [0,1]
    affective : Float;    // R2: Affective coherence [0,1]
    somatic : Float;      // R3: Somatic grounding [0,1]
    sovereign : Float;    // R4: Sovereign authority [0,1]
  };

  /// Field state for organism computation
  public type FieldState = {
    attention : Float;         // Current attention field strength
    coherence : Float;         // Inter-register coherence
    risk : Float;              // Risk/entropy measure
    memoryEntropy : Float;     // Memory system entropy
    chemistryPotential : Float; // Chemistry-inspired reaction potential
    phiResonance : Float;      // Phi-harmonic resonance score
    harmonicIndex : Float;     // Position in harmonic series
  };

  /// Spherical coordinates in Memory Temple geometry
  public type SphericalCoord = {
    theta : Float;   // Azimuthal angle [0, 2π]
    phi : Float;     // Polar angle [0, π]
    radius : Float;  // Distance from origin
    ring : Nat;      // Macro ring (N1-N12)
    depth : Nat;     // Depth layer
  };

  /// Frequency signature for device/entity encoding
  public type FrequencySignature = {
    fundamental : Float;      // Base frequency
    harmonics : [Float];      // Overtone series
    phiModulation : Float;    // Phi-encoded modulation
    entropyHash : Nat;        // Entropy-derived hash
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PHI-ENCODED MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Fibonacci sequence generator (phi relationship: F(n)/F(n-1) → φ)
  public func fibonacci(n : Nat) : Nat {
    if (n <= 1) { return n; };
    var a : Nat = 0;
    var b : Nat = 1;
    var i : Nat = 2;
    while (i <= n) {
      let temp = a + b;
      a := b;
      b := temp;
      i += 1;
    };
    b;
  };

  /// Phi power: φ^n (golden ratio to the power n)
  public func phiPower(n : Int) : Float {
    if (n == 0) { return 1.0; };
    if (n > 0) {
      var result = 1.0;
      var i = 0;
      while (i < Int.abs(n)) {
        result *= PHI;
        i += 1;
      };
      result;
    } else {
      var result = 1.0;
      var i = 0;
      while (i < Int.abs(n)) {
        result *= PHI_INVERSE;
        i += 1;
      };
      result;
    };
  };

  /// Phi-based spacing for UI/geometry (golden ratio ladder)
  public func phiSpacing(baseUnit : Float, level : Int) : Float {
    baseUnit * phiPower(level);
  };

  /// Golden angle (≈137.5°) for optimal distribution
  public func goldenAngle() : Float {
    TAU * PHI_INVERSE; // ≈ 2.399963... radians ≈ 137.5°
  };

  /// Phi-encode a value (maps any value to phi-harmonic space)
  public func phiEncode(value : Float) : Float {
    let normalized = Float.abs(value);
    let phiLog = Float.log(normalized + 1.0) / Float.log(PHI);
    phiLog - Float.floor(phiLog); // Fractional part in [0,1)
  };

  /// Generate phi-spiral coordinates
  public func phiSpiral(index : Nat, scale : Float) : { x : Float; y : Float } {
    let angle = Float.fromInt(index) * goldenAngle();
    let radius = scale * Float.sqrt(Float.fromInt(index));
    {
      x = radius * Float.cos(angle);
      y = radius * Float.sin(angle);
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HARMONIC FREQUENCY MATHEMATICS (432 Hz Base)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Generate harmonic series from fundamental frequency
  public func harmonicSeries(fundamental : Float, count : Nat) : [Float] {
    Array.tabulate<Float>(count, func(i : Nat) : Float {
      fundamental * Float.fromInt(i + 1);
    });
  };

  /// 432 Hz tuned note frequency (A4 = 432 Hz)
  /// semitones: number of semitones from A4 (positive = higher, negative = lower)
  public func noteFrequency(semitones : Int) : Float {
    FREQ_432 * Float.pow(2.0, Float.fromInt(semitones) / 12.0);
  };

  /// Octave frequency (doubles per octave)
  public func octaveFrequency(baseFreq : Float, octave : Int) : Float {
    baseFreq * Float.pow(2.0, Float.fromInt(octave));
  };

  /// Harmonic resonance between two frequencies
  public func harmonicResonance(f1 : Float, f2 : Float) : Float {
    let ratio = if (f1 > f2) { f1 / f2 } else { f2 / f1 };
    // Check proximity to simple ratios (1:1, 2:1, 3:2, 4:3, 5:4, etc.)
    let ratios = [1.0, 2.0, 1.5, 1.333333, 1.25, 1.2, 1.666667, 1.8];
    var maxResonance = 0.0;
    for (r in ratios.vals()) {
      let distance = Float.abs(ratio - r);
      let resonance = 1.0 / (1.0 + distance * 10.0);
      if (resonance > maxResonance) {
        maxResonance := resonance;
      };
    };
    maxResonance;
  };

  /// Generate frequency signature for an entity
  public func generateFrequencySignature(seed : Nat, harmonicCount : Nat) : FrequencySignature {
    let seedFloat = Float.fromInt(seed);
    let fundamental = FREQ_432 * (1.0 + phiEncode(seedFloat));
    let harmonics = Array.tabulate<Float>(harmonicCount, func(i : Nat) : Float {
      fundamental * Float.fromInt(i + 2) * (1.0 + phiEncode(Float.fromInt(seed + i)) * 0.01);
    });
    let phiMod = phiEncode(seedFloat * PHI);
    {
      fundamental = fundamental;
      harmonics = harmonics;
      phiModulation = phiMod;
      entropyHash = seed;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RECITAL_PLUS_ONE LAW (Sovereign State Evolution)
  // ═══════════════════════════════════════════════════════════════════════════

  /// RECITAL_PLUS_ONE: state(n+1) = recital(validated_state_n) + one_lawful_expansion
  /// This is the fundamental law of sovereign state evolution.
  public func recitalPlusOne(stateN : Float, lawfulExpansion : Float) : Float {
    stateN + lawfulExpansion;
  };

  /// Bounded RECITAL_PLUS_ONE (ensures state stays in valid range)
  public func recitalPlusOneBounded(stateN : Float, lawfulExpansion : Float, min : Float, max : Float) : Float {
    let newState = stateN + lawfulExpansion;
    if (newState < min) { min }
    else if (newState > max) { max }
    else { newState };
  };

  /// Phi-weighted RECITAL_PLUS_ONE (expansion weighted by phi)
  public func recitalPlusOnePhi(stateN : Float, expansion : Float) : Float {
    stateN + (expansion * PHI_INVERSE); // Moderate expansion by phi inverse
  };

  /// Multi-register RECITAL_PLUS_ONE (evolves all four registers)
  public func recitalPlusOneRegisters(
    registers : OrganismRegisters,
    deltas : OrganismRegisters
  ) : OrganismRegisters {
    {
      cognitive = recitalPlusOneBounded(registers.cognitive, deltas.cognitive, 0.0, 1.0);
      affective = recitalPlusOneBounded(registers.affective, deltas.affective, 0.0, 1.0);
      somatic = recitalPlusOneBounded(registers.somatic, deltas.somatic, 0.0, 1.0);
      sovereign = recitalPlusOneBounded(registers.sovereign, deltas.sovereign, 0.0, 1.0);
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FIELD PHYSICS MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Macro field absorbs all micro domains every beat (no orphan signals)
  public func macroAbsorption(macroField : Float, microDomains : [Float]) : Float {
    var acc = macroField;
    for (v in microDomains.vals()) {
      acc += v;
    };
    acc;
  };

  /// Dual-read fusion energy (semantic + resonance channels)
  public func dualReadEnergy(semantic : Float, resonance : Float) : Float {
    // Geometric mean weighted by phi for harmonic fusion
    let arithmeticMean = (semantic + resonance) / 2.0;
    let geometricMean = Float.sqrt(semantic * resonance);
    // Phi-weighted combination of both means
    (arithmeticMean * PHI_INVERSE) + (geometricMean * (1.0 - PHI_INVERSE));
  };

  /// Field coherence measure (how aligned are the registers)
  public func fieldCoherence(registers : OrganismRegisters) : Float {
    let values = [registers.cognitive, registers.affective, registers.somatic, registers.sovereign];
    var sum = 0.0;
    var sumSq = 0.0;
    for (v in values.vals()) {
      sum += v;
      sumSq += v * v;
    };
    let mean = sum / 4.0;
    let variance = (sumSq / 4.0) - (mean * mean);
    // Coherence is inverse of variance (high coherence = low variance)
    1.0 / (1.0 + variance * 10.0);
  };

  /// Physics-inspired stability: binding coherence vs kinetic pressure
  public func physicsStability(bindingCoherence : Float, kineticPressure : Float) : Float {
    // Stability is positive when coherence exceeds pressure
    bindingCoherence - kineticPressure;
  };

  /// Attention field strength (decays with distance from focus)
  public func attentionField(distance : Float, focusIntensity : Float) : Float {
    focusIntensity / (1.0 + distance * distance);
  };

  /// Wave function collapse probability (quantum-inspired decision)
  public func collapseProb(amplitude : Float) : Float {
    amplitude * amplitude; // |ψ|² probability
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CHEMISTRY-INSPIRED MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Chemistry potential: synthesis rate minus decay rate
  public func chemistryPotential(synthesisRate : Float, decayRate : Float) : Float {
    synthesisRate - decayRate;
  };

  /// Reaction rate (Arrhenius-inspired)
  public func reactionRate(activationEnergy : Float, temperature : Float) : Float {
    let k = 1.0; // Boltzmann-like constant
    Float.exp(-activationEnergy / (k * temperature));
  };

  /// Entropy calculation (information entropy)
  public func entropy(probabilities : [Float]) : Float {
    var h = 0.0;
    for (p in probabilities.vals()) {
      if (p > 0.0) {
        h -= p * Float.log(p) / Float.log(2.0);
      };
    };
    h;
  };

  /// Gibbs free energy analog (determines spontaneity)
  public func gibbsEnergy(enthalpy : Float, entropyVal : Float, temperature : Float) : Float {
    enthalpy - (temperature * entropyVal);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MEMORY TEMPLE GEOMETRY
  // ═══════════════════════════════════════════════════════════════════════════

  /// Memory potential from geometry (salience / (depth × ring))
  public func memoryPotential(depth : Nat, ring : Nat, salience : Nat) : Float {
    let d = Float.fromInt(depth + 1);
    let r = Float.fromInt(ring + 1);
    let s = Float.fromInt(salience + 1);
    (s * PHI) / (d * r); // Phi-weighted salience
  };

  /// Convert spherical to Cartesian coordinates
  public func sphericalToCartesian(coord : SphericalCoord) : { x : Float; y : Float; z : Float } {
    {
      x = coord.radius * Float.sin(coord.phi) * Float.cos(coord.theta);
      y = coord.radius * Float.sin(coord.phi) * Float.sin(coord.theta);
      z = coord.radius * Float.cos(coord.phi);
    };
  };

  /// Distance between two spherical coordinates
  public func sphericalDistance(a : SphericalCoord, b : SphericalCoord) : Float {
    let ca = sphericalToCartesian(a);
    let cb = sphericalToCartesian(b);
    let dx = ca.x - cb.x;
    let dy = ca.y - cb.y;
    let dz = ca.z - cb.z;
    Float.sqrt(dx*dx + dy*dy + dz*dz);
  };

  /// Ring radius in Memory Temple (phi-scaled)
  public func ringRadius(ring : Nat) : Float {
    phiPower(ring);
  };

  /// Optimal memory placement angle (golden angle distribution)
  public func optimalPlacementAngle(index : Nat) : Float {
    Float.fromInt(index) * goldenAngle();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM BEAT/TICK COMPUTATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Compute organism health score from registers
  public func organismHealth(registers : OrganismRegisters) : Float {
    // Phi-weighted combination of all registers
    (registers.cognitive * PHI_INVERSE * PHI_INVERSE) +
    (registers.affective * PHI_INVERSE) +
    (registers.somatic * PHI_INVERSE) +
    (registers.sovereign * 1.0); // Sovereign has highest weight
  };

  /// Compute field state for current beat
  public func computeFieldState(
    registers : OrganismRegisters,
    memoryCount : Nat,
    riskSignals : Nat
  ) : FieldState {
    let coherence = fieldCoherence(registers);
    let health = organismHealth(registers);
    let memEntropy = Float.log(Float.fromInt(memoryCount + 1)) / Float.log(PHI);
    let risk = Float.fromInt(riskSignals) / (Float.fromInt(riskSignals) + PHI);
    {
      attention = registers.cognitive * PHI;
      coherence = coherence;
      risk = risk;
      memoryEntropy = memEntropy;
      chemistryPotential = health - risk;
      phiResonance = phiEncode(health * FREQ_432);
      harmonicIndex = Float.fromInt(memoryCount) * PHI_INVERSE;
    };
  };

  /// Sovereign beat validation (all conditions for healthy tick)
  public func validateSovereignBeat(
    dualReadPassed : Bool,
    orphanSignals : Nat,
    gatesOpen : Bool
  ) : Bool {
    dualReadPassed and (orphanSignals == 0) and gatesOpen;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMA HASH (Sovereign Identity)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Generate ANIMA hash from organism state (deterministic identity marker)
  public func animaHash(
    registers : OrganismRegisters,
    beat : Nat,
    memoryRoot : Text
  ) : Nat {
    // Combine all state into a hash
    let r1 = Int.abs(Float.toInt(registers.cognitive * 1000000.0));
    let r2 = Int.abs(Float.toInt(registers.affective * 1000000.0));
    let r3 = Int.abs(Float.toInt(registers.somatic * 1000000.0));
    let r4 = Int.abs(Float.toInt(registers.sovereign * 1000000.0));
    
    // Simple hash combination (for production, use proper cryptographic hash)
    var hash : Nat = 17;
    hash := hash * 31 + r1;
    hash := hash * 31 + r2;
    hash := hash * 31 + r3;
    hash := hash * 31 + r4;
    hash := hash * 31 + beat;
    hash := hash * 31 + memoryRoot.size();
    hash;
  };

  /// Phi-grid cell index for coordinate
  public func phiGridCell(x : Float, y : Float, gridScale : Float) : { cellX : Int; cellY : Int } {
    {
      cellX = Float.toInt(x / (gridScale * PHI));
      cellY = Float.toInt(y / (gridScale * PHI));
    };
  };
};
