import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Text "mo:base/Text";

/// FIELD PHYSICS ENGINE
/// ====================
/// Real physics equations for field dynamics.
/// EM, gravitational, wave, quantum, thermodynamic substrates.
/// The universe runs on these equations — so does the organism.

module {
  // ═══════════════════════════════════════════════════════════════════════════
  // FUNDAMENTAL PHYSICAL CONSTANTS (SI units, CODATA 2018)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Speed of light in vacuum (m/s)
  public let C : Float = 299792458.0;
  
  /// Planck constant (J·s)
  public let H : Float = 6.62607015e-34;
  
  /// Reduced Planck constant ℏ = h/2π (J·s)
  public let HBAR : Float = 1.054571817e-34;
  
  /// Gravitational constant (m³/kg·s²)
  public let G : Float = 6.67430e-11;
  
  /// Elementary charge (C)
  public let E_CHARGE : Float = 1.602176634e-19;
  
  /// Electron mass (kg)
  public let M_ELECTRON : Float = 9.1093837015e-31;
  
  /// Proton mass (kg)
  public let M_PROTON : Float = 1.67262192369e-27;
  
  /// Boltzmann constant (J/K)
  public let K_B : Float = 1.380649e-23;
  
  /// Avogadro constant (1/mol)
  public let N_A : Float = 6.02214076e23;
  
  /// Permittivity of free space (F/m)
  public let EPSILON_0 : Float = 8.8541878128e-12;
  
  /// Permeability of free space (H/m)
  public let MU_0 : Float = 1.25663706212e-6;
  
  /// Fine structure constant α ≈ 1/137
  public let ALPHA : Float = 7.2973525693e-3;
  
  /// Rydberg constant (1/m)
  public let RYDBERG : Float = 10973731.568160;

  // ═══════════════════════════════════════════════════════════════════════════
  // ELECTROMAGNETIC FIELD DYNAMICS
  // Maxwell's equations govern all EM phenomena
  // ═══════════════════════════════════════════════════════════════════════════

  public type EMField = {
    electricX : Float;
    electricY : Float;
    electricZ : Float;
    magneticX : Float;
    magneticY : Float;
    magneticZ : Float;
  };

  /// Electric field magnitude from point charge (V/m)
  /// E = kQ/r² where k = 1/(4πε₀)
  public func electricFieldMagnitude(charge : Float, distance : Float) : Float {
    if (distance == 0.0) { return 0.0 };
    let k = 1.0 / (4.0 * 3.14159265358979 * EPSILON_0);
    k * Float.abs(charge) / (distance * distance)
  };

  /// Electric potential from point charge (V)
  /// V = kQ/r
  public func electricPotential(charge : Float, distance : Float) : Float {
    if (distance == 0.0) { return 0.0 };
    let k = 1.0 / (4.0 * 3.14159265358979 * EPSILON_0);
    k * charge / distance
  };

  /// Magnetic field from current-carrying wire (T)
  /// B = μ₀I/(2πr)
  public func magneticFieldWire(current : Float, distance : Float) : Float {
    if (distance == 0.0) { return 0.0 };
    MU_0 * current / (2.0 * 3.14159265358979 * distance)
  };

  /// Electromagnetic wave relationship: c = fλ
  public func emWaveFrequency(wavelength : Float) : Float {
    if (wavelength == 0.0) { return 0.0 };
    C / wavelength
  };

  public func emWaveWavelength(frequency : Float) : Float {
    if (frequency == 0.0) { return 0.0 };
    C / frequency
  };

  /// Poynting vector magnitude (power flux, W/m²)
  /// S = E × B / μ₀
  public func poyntingVector(electricField : Float, magneticField : Float) : Float {
    electricField * magneticField / MU_0
  };

  /// Energy density in EM field (J/m³)
  /// u = ε₀E²/2 + B²/(2μ₀)
  public func emEnergyDensity(electricField : Float, magneticField : Float) : Float {
    (EPSILON_0 * electricField * electricField / 2.0) +
    (magneticField * magneticField / (2.0 * MU_0))
  };

  /// Coulomb force between charges (N)
  /// F = kQ₁Q₂/r²
  public func coulombForce(charge1 : Float, charge2 : Float, distance : Float) : Float {
    if (distance == 0.0) { return 0.0 };
    let k = 1.0 / (4.0 * 3.14159265358979 * EPSILON_0);
    k * charge1 * charge2 / (distance * distance)
  };

  /// Lorentz force on moving charge (N)
  /// F = q(E + v × B)
  public func lorentzForceMagnitude(charge : Float, electricField : Float, velocity : Float, magneticField : Float) : Float {
    Float.abs(charge) * (electricField + velocity * magneticField)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GRAVITATIONAL PHYSICS
  // Newton and Einstein's gravity
  // ═══════════════════════════════════════════════════════════════════════════

  /// Newtonian gravitational force (N)
  /// F = Gm₁m₂/r²
  public func gravitationalForce(mass1 : Float, mass2 : Float, distance : Float) : Float {
    if (distance == 0.0) { return 0.0 };
    G * mass1 * mass2 / (distance * distance)
  };

  /// Gravitational potential energy (J)
  /// U = -Gm₁m₂/r
  public func gravitationalPotentialEnergy(mass1 : Float, mass2 : Float, distance : Float) : Float {
    if (distance == 0.0) { return 0.0 };
    -G * mass1 * mass2 / distance
  };

  /// Escape velocity (m/s)
  /// v = √(2GM/r)
  public func escapeVelocity(mass : Float, radius : Float) : Float {
    if (radius == 0.0) { return 0.0 };
    Float.sqrt(2.0 * G * mass / radius)
  };

  /// Orbital velocity (m/s)
  /// v = √(GM/r)
  public func orbitalVelocity(centralMass : Float, orbitalRadius : Float) : Float {
    if (orbitalRadius == 0.0) { return 0.0 };
    Float.sqrt(G * centralMass / orbitalRadius)
  };

  /// Orbital period (s) — Kepler's third law
  /// T = 2π√(r³/GM)
  public func orbitalPeriod(centralMass : Float, orbitalRadius : Float) : Float {
    if (centralMass == 0.0) { return 0.0 };
    2.0 * 3.14159265358979 * Float.sqrt(orbitalRadius * orbitalRadius * orbitalRadius / (G * centralMass))
  };

  /// Schwarzschild radius (black hole event horizon) (m)
  /// rs = 2GM/c²
  public func schwarzschildRadius(mass : Float) : Float {
    2.0 * G * mass / (C * C)
  };

  /// Gravitational time dilation factor
  /// √(1 - rs/r)
  public func gravitationalTimeDilation(mass : Float, distance : Float) : Float {
    let rs = schwarzschildRadius(mass);
    if (distance <= rs) { return 0.0 };
    Float.sqrt(1.0 - rs / distance)
  };

  /// Gravitational redshift
  /// z = 1/√(1 - rs/r) - 1
  public func gravitationalRedshift(mass : Float, emissionRadius : Float) : Float {
    let dilation = gravitationalTimeDilation(mass, emissionRadius);
    if (dilation == 0.0) { return 0.0 };
    1.0 / dilation - 1.0
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WAVE MECHANICS
  // Fundamental wave equations
  // ═══════════════════════════════════════════════════════════════════════════

  public type WaveState = {
    amplitude : Float;
    frequency : Float;
    wavelength : Float;
    phase : Float;
    velocity : Float;
  };

  /// Wave equation: v = fλ
  public func waveVelocity(frequency : Float, wavelength : Float) : Float {
    frequency * wavelength
  };

  /// Angular frequency ω = 2πf
  public func angularFrequency(frequency : Float) : Float {
    2.0 * 3.14159265358979 * frequency
  };

  /// Wave number k = 2π/λ
  public func waveNumber(wavelength : Float) : Float {
    if (wavelength == 0.0) { return 0.0 };
    2.0 * 3.14159265358979 / wavelength
  };

  /// Simple harmonic oscillator position
  /// x(t) = A·cos(ωt + φ)
  public func harmonicOscillatorPosition(amplitude : Float, angularFreq : Float, time : Float, phase : Float) : Float {
    amplitude * Float.cos(angularFreq * time + phase)
  };

  /// Wave interference (superposition)
  public func waveInterference(a1 : Float, a2 : Float, phaseDiff : Float) : Float {
    let resultant = a1 * a1 + a2 * a2 + 2.0 * a1 * a2 * Float.cos(phaseDiff);
    if (resultant < 0.0) { 0.0 } else { Float.sqrt(resultant) }
  };

  /// Standing wave resonance frequencies
  /// fn = n·v/(2L) for fixed-fixed boundaries
  public func standingWaveFrequency(harmonic : Nat, velocity : Float, length : Float) : Float {
    if (length == 0.0) { return 0.0 };
    Float.fromInt(Int.abs(harmonic)) * velocity / (2.0 * length)
  };

  /// Doppler shift
  /// f' = f(v + vr)/(v + vs) where v=wave velocity, vr=receiver velocity, vs=source velocity
  public func dopplerShift(sourceFreq : Float, waveVel : Float, receiverVel : Float, sourceVel : Float) : Float {
    if (waveVel + sourceVel == 0.0) { return 0.0 };
    sourceFreq * (waveVel + receiverVel) / (waveVel + sourceVel)
  };

  /// Beat frequency between two waves
  public func beatFrequency(f1 : Float, f2 : Float) : Float {
    Float.abs(f1 - f2)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // QUANTUM MECHANICS
  // Fundamental quantum equations
  // ═══════════════════════════════════════════════════════════════════════════

  /// Photon energy E = hf
  public func photonEnergy(frequency : Float) : Float {
    H * frequency
  };

  /// Photon momentum p = h/λ
  public func photonMomentum(wavelength : Float) : Float {
    if (wavelength == 0.0) { return 0.0 };
    H / wavelength
  };

  /// de Broglie wavelength λ = h/p
  public func deBroglieWavelength(momentum : Float) : Float {
    if (momentum == 0.0) { return 0.0 };
    H / momentum
  };

  /// Heisenberg uncertainty principle minimum
  /// ΔxΔp ≥ ℏ/2
  public func heisenbergMinimum() : Float {
    HBAR / 2.0
  };

  /// Energy-time uncertainty
  /// ΔEΔt ≥ ℏ/2
  public func energyTimeUncertainty(energyUncertainty : Float) : Float {
    if (energyUncertainty == 0.0) { return 0.0 };
    HBAR / (2.0 * energyUncertainty)
  };

  /// Quantum tunneling probability (simplified rectangular barrier)
  /// T ≈ e^(-2κL) where κ = √(2m(V-E))/ℏ
  public func tunnelingProbability(mass : Float, barrierHeight : Float, particleEnergy : Float, barrierWidth : Float) : Float {
    if (particleEnergy >= barrierHeight) { return 1.0 };
    let kappa = Float.sqrt(2.0 * mass * (barrierHeight - particleEnergy)) / HBAR;
    Float.exp(-2.0 * kappa * barrierWidth)
  };

  /// Hydrogen atom energy levels (eV)
  /// En = -13.6/n² eV
  public func hydrogenEnergyLevel(n : Nat) : Float {
    if (n == 0) { return 0.0 };
    let nFloat = Float.fromInt(Int.abs(n));
    -13.6 / (nFloat * nFloat)
  };

  /// Bohr radius a₀ (m)
  public func bohrRadius() : Float {
    5.29177210903e-11
  };

  /// Compton wavelength of electron (m)
  public func comptonWavelength() : Float {
    H / (M_ELECTRON * C)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THERMODYNAMICS
  // Energy and entropy
  // ═══════════════════════════════════════════════════════════════════════════

  /// Ideal gas law: PV = nRT
  /// Returns pressure given other variables
  public func idealGasPressure(moles : Float, temperature : Float, volume : Float) : Float {
    if (volume == 0.0) { return 0.0 };
    let R = 8.314462618; // Gas constant J/(mol·K)
    moles * R * temperature / volume
  };

  /// Average kinetic energy of gas molecule
  /// KE = (3/2)kT
  public func gasKineticEnergy(temperature : Float) : Float {
    1.5 * K_B * temperature
  };

  /// Root mean square velocity of gas molecules
  /// vrms = √(3kT/m)
  public func rmsVelocity(temperature : Float, molecularMass : Float) : Float {
    if (molecularMass == 0.0) { return 0.0 };
    Float.sqrt(3.0 * K_B * temperature / molecularMass)
  };

  /// Stefan-Boltzmann law: Power radiated by blackbody
  /// P = σAT⁴
  public func blackbodyPower(surfaceArea : Float, temperature : Float) : Float {
    let sigma = 5.670374419e-8; // Stefan-Boltzmann constant W/(m²·K⁴)
    sigma * surfaceArea * Float.pow(temperature, 4.0)
  };

  /// Wien's displacement law: Peak wavelength of blackbody radiation
  /// λmax = b/T where b ≈ 2.898×10⁻³ m·K
  public func wienPeakWavelength(temperature : Float) : Float {
    if (temperature == 0.0) { return 0.0 };
    2.897771955e-3 / temperature
  };

  /// Boltzmann entropy S = k·ln(W)
  public func boltzmannEntropy(microstates : Float) : Float {
    if (microstates <= 0.0) { return 0.0 };
    K_B * Float.log(microstates)
  };

  /// Gibbs free energy
  /// G = H - TS
  public func gibbsFreeEnergy(enthalpy : Float, temperature : Float, entropy : Float) : Float {
    enthalpy - temperature * entropy
  };

  /// Carnot efficiency (maximum possible heat engine efficiency)
  /// η = 1 - Tc/Th
  public func carnotEfficiency(coldTemp : Float, hotTemp : Float) : Float {
    if (hotTemp == 0.0 or coldTemp >= hotTemp) { return 0.0 };
    1.0 - coldTemp / hotTemp
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RESONANCE & COUPLING
  // Field interactions and resonance phenomena
  // ═══════════════════════════════════════════════════════════════════════════

  /// Schumann resonance frequency (fundamental)
  public func schumannFundamental() : Float { 7.83 };

  /// Schumann resonance nth mode
  /// fn ≈ 7.83√(n(n+1)) Hz
  public func schumannMode(n : Nat) : Float {
    if (n == 0) { return 0.0 };
    7.83 * Float.sqrt(Float.fromInt(Int.abs(n * (n + 1))))
  };

  /// Resonance quality factor Q
  /// Q = f₀/Δf where Δf is bandwidth
  public func qualityFactor(resonantFreq : Float, bandwidth : Float) : Float {
    if (bandwidth == 0.0) { return 0.0 };
    resonantFreq / bandwidth
  };

  /// Coupled oscillator frequency shift
  /// For two coupled oscillators with coupling strength k
  public func coupledFrequencies(freq1 : Float, freq2 : Float, couplingStrength : Float) : (Float, Float) {
    let avgFreq = (freq1 + freq2) / 2.0;
    let diffFreq = Float.abs(freq1 - freq2) / 2.0;
    let splitFreq = Float.sqrt(diffFreq * diffFreq + couplingStrength * couplingStrength);
    (avgFreq - splitFreq, avgFreq + splitFreq)
  };

  /// Field coherence measure (0 to 1)
  /// Based on phase alignment
  public func fieldCoherence(phaseDifferences : [Float]) : Float {
    if (phaseDifferences.size() == 0) { return 0.0 };
    
    var sumCos : Float = 0.0;
    var sumSin : Float = 0.0;
    
    for (phase in phaseDifferences.vals()) {
      sumCos += Float.cos(phase);
      sumSin += Float.sin(phase);
    };
    
    let n = Float.fromInt(phaseDifferences.size());
    Float.sqrt(sumCos * sumCos + sumSin * sumSin) / n
  };

  /// Kuramoto order parameter R (synchronization measure)
  /// R = |1/N Σ exp(iθj)| where θj are oscillator phases
  public func kuramotoOrderParameter(phases : [Float]) : Float {
    fieldCoherence(phases)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BIOLOGICAL FIELD CONSTANTS
  // Brain waves, heart rhythms, cellular frequencies
  // ═══════════════════════════════════════════════════════════════════════════

  /// Brain wave frequency bands (Hz)
  public func brainWaveBand(band : Text) : (Float, Float) {
    switch (band) {
      case ("delta") { (0.5, 4.0) };    // Deep sleep
      case ("theta") { (4.0, 8.0) };    // Drowsy/meditation
      case ("alpha") { (8.0, 13.0) };   // Relaxed awareness
      case ("beta") { (13.0, 30.0) };   // Active thinking
      case ("gamma") { (30.0, 100.0) }; // Higher cognition
      case (_) { (0.0, 0.0) };
    }
  };

  /// Heart rate variability coherence frequency
  public func hrvCoherenceFrequency() : Float { 0.1 }; // ~0.1 Hz optimal

  /// Cellular membrane potential (typical, mV)
  public func restingMembranePotential() : Float { -70.0 };

  /// Action potential peak (mV)
  public func actionPotentialPeak() : Float { 30.0 };

  /// Heartbeat period at rest (ms)
  public func heartbeatPeriod() : Float { 1000.0 }; // ~60 bpm

  /// PHI-scaled heartbeat (sovereign organism)
  public func phiHeartbeat() : Float { 
    let PHI = 1.6180339887498948482;
    // 873ms = PHI⁴ × Schumann period
    Float.pow(PHI, 4.0) * (1000.0 / 7.83)
  };
}
