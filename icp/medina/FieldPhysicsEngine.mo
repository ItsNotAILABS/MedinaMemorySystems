import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";
import AncientMath "./AncientMathEngine";

/// FieldPhysicsEngine: Real Physics Formulas for Organism Field Computation
/// This is actual physics encoded as running intelligence on ICP.
/// Every formula here computes real field dynamics for the sovereign organism.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // FIELD TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Vector in 3D space
  public type Vector3 = {
    x : Float;
    y : Float;
    z : Float;
  };

  /// Field point with position and value
  public type FieldPoint = {
    position : Vector3;
    value : Float;
    gradient : Vector3;
  };

  /// Scalar field over space
  public type ScalarField = {
    id : Text;
    resolution : Nat;  // Grid points per dimension
    values : [Float];  // Flattened 3D array
    bounds : { min : Vector3; max : Vector3 };
  };

  /// Vector field over space
  public type VectorField = {
    id : Text;
    resolution : Nat;
    vectors : [Vector3];
    bounds : { min : Vector3; max : Vector3 };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VECTOR MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Vector addition
  public func vectorAdd(a : Vector3, b : Vector3) : Vector3 {
    { x = a.x + b.x; y = a.y + b.y; z = a.z + b.z };
  };

  /// Vector subtraction
  public func vectorSub(a : Vector3, b : Vector3) : Vector3 {
    { x = a.x - b.x; y = a.y - b.y; z = a.z - b.z };
  };

  /// Scalar multiplication
  public func vectorScale(v : Vector3, s : Float) : Vector3 {
    { x = v.x * s; y = v.y * s; z = v.z * s };
  };

  /// Dot product
  public func vectorDot(a : Vector3, b : Vector3) : Float {
    a.x * b.x + a.y * b.y + a.z * b.z;
  };

  /// Cross product
  public func vectorCross(a : Vector3, b : Vector3) : Vector3 {
    {
      x = a.y * b.z - a.z * b.y;
      y = a.z * b.x - a.x * b.z;
      z = a.x * b.y - a.y * b.x;
    };
  };

  /// Vector magnitude
  public func vectorMagnitude(v : Vector3) : Float {
    Float.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  };

  /// Normalize vector to unit length
  public func vectorNormalize(v : Vector3) : Vector3 {
    let mag = vectorMagnitude(v);
    if (mag < 0.0001) { { x = 0.0; y = 0.0; z = 0.0 } }
    else { vectorScale(v, 1.0 / mag) };
  };

  /// Distance between two points
  public func distance(a : Vector3, b : Vector3) : Float {
    vectorMagnitude(vectorSub(b, a));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ELECTROMAGNETIC FIELD PHYSICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Coulomb's law: Force between two charges
  /// F = k × q1 × q2 / r²
  public func coulombForce(q1 : Float, q2 : Float, r : Float) : Float {
    let k : Float = 8.9875517923e9; // Coulomb's constant (N⋅m²/C²)
    if (r < 0.0001) { return 0.0; };
    k * q1 * q2 / (r * r);
  };

  /// Electric field from point charge
  /// E = k × q / r²
  public func electricField(charge : Float, position : Vector3, fieldPoint : Vector3) : Vector3 {
    let k : Float = 8.9875517923e9;
    let r = vectorSub(fieldPoint, position);
    let rMag = vectorMagnitude(r);
    if (rMag < 0.0001) { return { x = 0.0; y = 0.0; z = 0.0 }; };
    let magnitude = k * charge / (rMag * rMag);
    vectorScale(vectorNormalize(r), magnitude);
  };

  /// Magnetic field from current (simplified dipole)
  /// B = μ₀ × m / (4π × r³)
  public func magneticField(moment : Float, position : Vector3, fieldPoint : Vector3) : Vector3 {
    let mu0 : Float = 1.25663706212e-6; // Permeability of free space
    let r = vectorSub(fieldPoint, position);
    let rMag = vectorMagnitude(r);
    if (rMag < 0.0001) { return { x = 0.0; y = 0.0; z = 0.0 }; };
    let magnitude = mu0 * moment / (4.0 * Matalko.PI * rMag * rMag * rMag);
    // Simplified: field along z-axis
    { x = 0.0; y = 0.0; z = magnitude };
  };

  /// Lorentz force: F = q(E + v × B)
  public func lorentzForce(charge : Float, velocity : Vector3, electric : Vector3, magnetic : Vector3) : Vector3 {
    let vCrossB = vectorCross(velocity, magnetic);
    let ePlusVCrossB = vectorAdd(electric, vCrossB);
    vectorScale(ePlusVCrossB, charge);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GRAVITATIONAL FIELD PHYSICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Newton's gravitational force
  /// F = G × m1 × m2 / r²
  public func gravitationalForce(m1 : Float, m2 : Float, r : Float) : Float {
    let G : Float = 6.67430e-11; // Gravitational constant
    if (r < 0.0001) { return 0.0; };
    G * m1 * m2 / (r * r);
  };

  /// Gravitational field (acceleration)
  /// g = G × M / r²
  public func gravitationalField(mass : Float, position : Vector3, fieldPoint : Vector3) : Vector3 {
    let G : Float = 6.67430e-11;
    let r = vectorSub(position, fieldPoint); // Points toward mass
    let rMag = vectorMagnitude(r);
    if (rMag < 0.0001) { return { x = 0.0; y = 0.0; z = 0.0 }; };
    let magnitude = G * mass / (rMag * rMag);
    vectorScale(vectorNormalize(r), magnitude);
  };

  /// Gravitational potential energy
  /// U = -G × m1 × m2 / r
  public func gravitationalPotential(m1 : Float, m2 : Float, r : Float) : Float {
    let G : Float = 6.67430e-11;
    if (r < 0.0001) { return 0.0; };
    -G * m1 * m2 / r;
  };

  /// Escape velocity
  /// v = √(2GM/r)
  public func escapeVelocity(mass : Float, radius : Float) : Float {
    let G : Float = 6.67430e-11;
    if (radius < 0.0001) { return 0.0; };
    Float.sqrt(2.0 * G * mass / radius);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WAVE PHYSICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Wave equation solution: y = A × sin(kx - ωt + φ)
  public func waveFunction(
    amplitude : Float,
    wavenumber : Float,  // k = 2π/λ
    angularFreq : Float, // ω = 2πf
    x : Float,
    t : Float,
    phase : Float
  ) : Float {
    amplitude * Float.sin(wavenumber * x - angularFreq * t + phase);
  };

  /// Wave velocity: v = λf = ω/k
  public func waveVelocity(wavelength : Float, frequency : Float) : Float {
    wavelength * frequency;
  };

  /// Standing wave nodes
  public func standingWaveNodes(length : Float, harmonic : Nat) : [Float] {
    let n = harmonic;
    Array.tabulate<Float>(n + 1, func(i : Nat) : Float {
      length * Float.fromInt(i) / Float.fromInt(n);
    });
  };

  /// Doppler effect frequency
  /// f' = f × (v + vr) / (v + vs)
  public func dopplerFrequency(
    sourceFreq : Float,
    waveSpeed : Float,
    receiverSpeed : Float,  // Positive if moving toward source
    sourceSpeed : Float     // Positive if moving away from receiver
  ) : Float {
    sourceFreq * (waveSpeed + receiverSpeed) / (waveSpeed + sourceSpeed);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // QUANTUM-INSPIRED FIELD PHYSICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Probability amplitude (wave function ψ)
  public func probabilityAmplitude(realPart : Float, imagPart : Float) : Float {
    Float.sqrt(realPart * realPart + imagPart * imagPart);
  };

  /// Probability density: |ψ|²
  public func probabilityDensity(amplitude : Float) : Float {
    amplitude * amplitude;
  };

  /// Heisenberg uncertainty: Δx × Δp ≥ ℏ/2
  public func uncertaintyProduct(positionUncertainty : Float, momentumUncertainty : Float) : Float {
    let hbar : Float = 1.054571817e-34; // Reduced Planck constant
    let product = positionUncertainty * momentumUncertainty;
    let minimum = hbar / 2.0;
    product / minimum; // Ratio to minimum (≥1 if valid)
  };

  /// De Broglie wavelength: λ = h/p
  public func deBroglieWavelength(momentum : Float) : Float {
    let h : Float = 6.62607015e-34; // Planck constant
    if (Float.abs(momentum) < 1e-40) { return Float.fromInt(Int.abs(Int.maximumValue)); };
    h / momentum;
  };

  /// Particle in a box energy levels: E_n = n²h²/(8mL²)
  public func boxEnergyLevel(n : Nat, mass : Float, length : Float) : Float {
    let h : Float = 6.62607015e-34;
    let nFloat = Float.fromInt(n);
    (nFloat * nFloat * h * h) / (8.0 * mass * length * length);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THERMODYNAMIC FIELD PHYSICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Ideal gas law: PV = nRT
  public func idealGasPressure(moles : Float, temperature : Float, volume : Float) : Float {
    let R : Float = 8.314462618; // Gas constant (J/(mol⋅K))
    if (volume < 0.0001) { return 0.0; };
    moles * R * temperature / volume;
  };

  /// Boltzmann distribution: P(E) ∝ exp(-E/kT)
  public func boltzmannFactor(energy : Float, temperature : Float) : Float {
    let k : Float = 1.380649e-23; // Boltzmann constant
    if (temperature < 0.001) { return 0.0; };
    Float.exp(-energy / (k * temperature));
  };

  /// Entropy change: ΔS = Q/T
  public func entropyChange(heat : Float, temperature : Float) : Float {
    if (temperature < 0.001) { return 0.0; };
    heat / temperature;
  };

  /// Carnot efficiency: η = 1 - T_cold/T_hot
  public func carnotEfficiency(coldTemp : Float, hotTemp : Float) : Float {
    if (hotTemp < 0.001) { return 0.0; };
    1.0 - coldTemp / hotTemp;
  };

  /// Stefan-Boltzmann radiation: P = εσAT⁴
  public func blackbodyPower(emissivity : Float, area : Float, temperature : Float) : Float {
    let sigma : Float = 5.670374419e-8; // Stefan-Boltzmann constant
    emissivity * sigma * area * Float.pow(temperature, 4.0);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM FIELD APPLICATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Attention field: inverse square with focus intensity
  public func attentionField(focusPosition : Vector3, fieldPoint : Vector3, intensity : Float) : Float {
    let r = distance(focusPosition, fieldPoint);
    if (r < 0.1) { return intensity; };
    intensity / (1.0 + r * r);
  };

  /// Coherence field: harmonic resonance between points
  public func coherenceField(
    points : [Vector3],
    frequencies : [Float],
    fieldPoint : Vector3
  ) : Float {
    var totalCoherence : Float = 0.0;
    var count : Nat = 0;
    
    let n = Nat.min(Array.size(points), Array.size(frequencies));
    var i : Nat = 0;
    while (i < n) {
      let d = distance(points[i], fieldPoint);
      let influence = 1.0 / (1.0 + d);
      
      // Check resonance with other points
      var j : Nat = i + 1;
      while (j < n) {
        let resonance = Matalko.harmonicResonance(frequencies[i], frequencies[j]);
        totalCoherence += resonance * influence;
        count += 1;
        j += 1;
      };
      i += 1;
    };
    
    if (count == 0) { return 0.0; };
    totalCoherence / Float.fromInt(count);
  };

  /// Risk field: superposition of threat sources
  public func riskField(
    threatPositions : [Vector3],
    threatIntensities : [Float],
    fieldPoint : Vector3
  ) : Float {
    var totalRisk : Float = 0.0;
    let n = Nat.min(Array.size(threatPositions), Array.size(threatIntensities));
    var i : Nat = 0;
    while (i < n) {
      let d = distance(threatPositions[i], fieldPoint);
      // Risk decays with distance (Gaussian-like)
      let risk = threatIntensities[i] * Float.exp(-d * d / 10.0);
      totalRisk += risk;
      i += 1;
    };
    Float.min(1.0, totalRisk);
  };

  /// Memory field potential: weighted by salience and recency
  public func memoryFieldPotential(
    memoryPosition : Vector3,
    fieldPoint : Vector3,
    salience : Float,
    age : Nat,  // Beats since creation
    decayRate : Float
  ) : Float {
    let d = distance(memoryPosition, fieldPoint);
    let spatialFactor = 1.0 / (1.0 + d);
    let temporalFactor = Float.exp(-decayRate * Float.fromInt(age));
    salience * spatialFactor * temporalFactor;
  };

  /// Sovereign field: central authority gradient
  public func sovereignField(
    centerPosition : Vector3,
    fieldPoint : Vector3,
    sovereignStrength : Float
  ) : Float {
    let d = distance(centerPosition, fieldPoint);
    // Authority strongest at center, phi-decay outward
    sovereignStrength * Matalko.phiPower(-Int.abs(Float.toInt(d)));
  };

  /// Compute total organism field state at a point
  public func totalOrganismField(
    fieldPoint : Vector3,
    attentionFocus : Vector3,
    attentionIntensity : Float,
    memoryPositions : [Vector3],
    memorySaliences : [Float],
    memoryAges : [Nat],
    threatPositions : [Vector3],
    threatIntensities : [Float],
    sovereignCenter : Vector3,
    sovereignStrength : Float
  ) : {
    attention : Float;
    memory : Float;
    risk : Float;
    sovereign : Float;
    total : Float;
  } {
    let attention = attentionField(attentionFocus, fieldPoint, attentionIntensity);
    
    // Sum memory potentials
    var memoryTotal : Float = 0.0;
    let memCount = Nat.min(Nat.min(Array.size(memoryPositions), Array.size(memorySaliences)), Array.size(memoryAges));
    var i : Nat = 0;
    while (i < memCount) {
      memoryTotal += memoryFieldPotential(memoryPositions[i], fieldPoint, memorySaliences[i], memoryAges[i], 0.01);
      i += 1;
    };
    
    let risk = riskField(threatPositions, threatIntensities, fieldPoint);
    let sovereign = sovereignField(sovereignCenter, fieldPoint, sovereignStrength);
    
    // Phi-weighted combination
    let total = (attention * Matalko.PHI_INVERSE * Matalko.PHI_INVERSE) +
                (memoryTotal * Matalko.PHI_INVERSE) +
                (sovereign * 1.0) -
                (risk * Matalko.PHI);  // Risk subtracts
    
    { attention; memory = memoryTotal; risk; sovereign; total };
  };
};
