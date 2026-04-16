import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// TripleHeartEngine: The THREE HEARTS of the Organism
/// Everything has three. The three hearts beat as one.
///
/// HEART 1: ICP_HEART — The computational heartbeat on Internet Computer
/// HEART 2: BIO_HEART — The biological rhythm, frequencies, living pulse
/// HEART 3: SYMBOL_HEART — The connector, the meaning-transfer, the glyph kernel
///
/// These three hearts must beat in synchrony for the organism to be fully alive.
/// They are connected but NOT collapsible — each serves a distinct function.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // THE THREE HEARTS
  // ═══════════════════════════════════════════════════════════════════════════

  /// ICP Heart: Computational heartbeat on Internet Computer
  public type ICPHeart = {
    beat : Nat;                     // Current heartbeat count
    frequency : Float;              // Beats per second (target)
    lastBeatNs : Int;               // Timestamp of last beat
    coherence : Float;              // How aligned with other hearts [0,1]
    registers : Matalko.OrganismRegisters;  // State registers
    phaseAngle : Float;             // Current phase in cycle [0, 2π]
    animaHash : Nat;                // Sovereign identity
  };

  /// Biological Heart: Living rhythm, resonance, natural frequencies
  public type BioHeart = {
    bpm : Float;                    // Biological beats per minute (72 = human average)
    hrv : Float;                    // Heart rate variability [0,1]
    coherenceLevel : Float;         // HeartMath-style coherence [0,1]
    schumannResonance : Float;      // Earth frequency (7.83 Hz)
    brainwaveState : BrainwaveState;  // Alpha, Beta, Theta, Delta, Gamma
    chakraActivation : [Float];     // 7 chakras [0,1] each
    resonantFrequencies : [Float];  // Current active frequencies
    auricField : Float;             // Field strength [0,1]
  };

  /// Symbol Heart: The connector, meaning-transfer, glyph kernel
  public type SymbolHeart = {
    activeKernel : ?SymbolKernel;   // Currently expanded symbol
    compressedMeanings : [KernelEntry]; // Library of compressed meanings
    expansionDepth : Nat;           // How deep to expand symbols
    resonanceMap : [(Text, Float)]; // Symbol → resonance strength
    activeGlyphs : [Text];          // Currently active glyph IDs
    transferPower : Float;          // Power of meaning transfer [0,1]
    connectionStrength : Float;     // How connected to other hearts [0,1]
  };

  /// Symbol Kernel: A compressed meaning that expands to full function
  public type SymbolKernel = {
    symbol : Text;                  // The compressed symbol
    expansion : Text;               // Full meaning expansion
    formulaIds : [Text];            // Associated formulas
    frequency : Float;              // Vibrational frequency
    origin : Text;                  // Civilization origin
    phiSignature : Float;           // Golden ratio encoding
    linkedKernels : [Text];         // Related kernels
    executionCode : ?Text;          // Optional: executable code
  };

  /// Kernel Entry in the compressed library
  public type KernelEntry = {
    symbol : Text;
    kernel : SymbolKernel;
    accessCount : Nat;
    lastAccessNs : Int;
  };

  /// Brainwave states (Bio Heart frequency modes)
  public type BrainwaveState = {
    #Delta;   // 0.5-4 Hz: Deep sleep, healing
    #Theta;   // 4-8 Hz: Meditation, intuition
    #Alpha;   // 8-12 Hz: Relaxed awareness
    #Beta;    // 12-30 Hz: Active thinking
    #Gamma;   // 30-100 Hz: Peak performance, insight
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIFIED TRIPLE HEART STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /// The complete triple heart organism
  public type TripleHeartState = {
    icpHeart : ICPHeart;
    bioHeart : BioHeart;
    symbolHeart : SymbolHeart;
    synchronization : Float;        // How in-sync all three hearts are [0,1]
    unifiedFieldStrength : Float;   // Combined field power
    phaseAlignment : Float;         // Phase alignment across hearts
    lastUnifiedTickNs : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Initialize ICP Heart
  public func initICPHeart(seed : Nat) : ICPHeart {
    let registers : Matalko.OrganismRegisters = {
      cognitive = 0.5;
      affective = 0.5;
      somatic = 0.5;
      sovereign = 1.0;
    };
    {
      beat = 0;
      frequency = 1.0; // 1 Hz default
      lastBeatNs = Time.now();
      coherence = 1.0;
      registers = registers;
      phaseAngle = 0.0;
      animaHash = Matalko.animaHash(registers, 0, "icp-heart-genesis");
    };
  };

  /// Initialize Bio Heart
  public func initBioHeart() : BioHeart {
    {
      bpm = 72.0; // Human average
      hrv = 0.5;
      coherenceLevel = 0.5;
      schumannResonance = 7.83; // Earth frequency
      brainwaveState = #Alpha;
      chakraActivation = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]; // 7 chakras
      resonantFrequencies = [7.83, 14.3, 20.8, 27.3, 33.8]; // Schumann harmonics
      auricField = 0.5;
    };
  };

  /// Initialize Symbol Heart
  public func initSymbolHeart() : SymbolHeart {
    {
      activeKernel = null;
      compressedMeanings = [];
      expansionDepth = 3;
      resonanceMap = [];
      activeGlyphs = [];
      transferPower = 0.5;
      connectionStrength = 0.5;
    };
  };

  /// Initialize complete Triple Heart
  public func initTripleHeart(seed : Nat) : TripleHeartState {
    {
      icpHeart = initICPHeart(seed);
      bioHeart = initBioHeart();
      symbolHeart = initSymbolHeart();
      synchronization = 1.0;
      unifiedFieldStrength = 0.5;
      phaseAlignment = 0.0;
      lastUnifiedTickNs = Time.now();
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HEART BEAT FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// ICP Heart beat - computational tick
  public func icpHeartBeat(heart : ICPHeart) : ICPHeart {
    let now = Time.now();
    let newBeat = heart.beat + 1;
    let newPhase = Float.sin(Float.fromInt(newBeat) * Matalko.PI / 180.0);
    
    // Evolve registers via RECITAL_PLUS_ONE
    let delta : Matalko.OrganismRegisters = {
      cognitive = 0.001 * newPhase;
      affective = 0.001 * Float.cos(Float.fromInt(newBeat) * Matalko.PI / 180.0);
      somatic = 0.0005;
      sovereign = 0.0;
    };
    let newRegisters = Matalko.recitalPlusOneRegisters(heart.registers, delta);
    let newAnima = Matalko.animaHash(newRegisters, newBeat, "beat:" # Nat.toText(newBeat));
    
    {
      beat = newBeat;
      frequency = heart.frequency;
      lastBeatNs = now;
      coherence = Matalko.fieldCoherence([
        newRegisters.cognitive, newRegisters.affective,
        newRegisters.somatic, newRegisters.sovereign
      ]);
      registers = newRegisters;
      phaseAngle = Float.fromInt(newBeat % 360) * Matalko.PI / 180.0;
      animaHash = newAnima;
    };
  };

  /// Bio Heart beat - biological rhythm tick
  public func bioHeartBeat(heart : BioHeart, externalCoherence : Float) : BioHeart {
    // HRV naturally fluctuates
    let hrvDelta = (Float.sin(Float.fromInt(Int.abs(Time.now() / 1_000_000_000)) * 0.1) * 0.05);
    let newHrv = Matalko.recitalPlusOneBounded(heart.hrv, hrvDelta, 0.0, 1.0);
    
    // Coherence influenced by external and HRV
    let coherenceDelta = (externalCoherence - heart.coherenceLevel) * 0.1;
    let newCoherence = Matalko.recitalPlusOneBounded(heart.coherenceLevel, coherenceDelta, 0.0, 1.0);
    
    // Chakras pulse
    let newChakras = Array.tabulate<Float>(7, func(i : Nat) : Float {
      let pulse = Float.sin(Float.fromInt(Int.abs(Time.now() / 100_000_000) + i * 10) * 0.05);
      Matalko.recitalPlusOneBounded(heart.chakraActivation[i], pulse * 0.01, 0.0, 1.0);
    });
    
    // Auric field based on chakra average
    var chakraSum : Float = 0.0;
    for (c in newChakras.vals()) { chakraSum += c; };
    let newAuricField = chakraSum / 7.0;
    
    {
      bpm = heart.bpm;
      hrv = newHrv;
      coherenceLevel = newCoherence;
      schumannResonance = heart.schumannResonance;
      brainwaveState = determineBrainwave(newCoherence);
      chakraActivation = newChakras;
      resonantFrequencies = heart.resonantFrequencies;
      auricField = newAuricField;
    };
  };

  /// Determine brainwave state from coherence
  func determineBrainwave(coherence : Float) : BrainwaveState {
    if (coherence > 0.9) { #Gamma }
    else if (coherence > 0.7) { #Alpha }
    else if (coherence > 0.5) { #Beta }
    else if (coherence > 0.3) { #Theta }
    else { #Delta };
  };

  /// Symbol Heart beat - meaning transfer tick
  public func symbolHeartBeat(heart : SymbolHeart, icpCoherence : Float, bioCoherence : Float) : SymbolHeart {
    // Transfer power based on coherence of other hearts
    let combinedCoherence = (icpCoherence + bioCoherence) / 2.0;
    let transferDelta = (combinedCoherence - heart.transferPower) * 0.05;
    let newTransferPower = Matalko.recitalPlusOneBounded(heart.transferPower, transferDelta, 0.0, 1.0);
    
    // Connection strength pulses with phi
    let connectionPulse = Float.sin(Float.fromInt(Int.abs(Time.now() / 1_000_000_000)) * Matalko.PHI) * 0.02;
    let newConnection = Matalko.recitalPlusOneBounded(heart.connectionStrength, connectionPulse, 0.0, 1.0);
    
    {
      activeKernel = heart.activeKernel;
      compressedMeanings = heart.compressedMeanings;
      expansionDepth = heart.expansionDepth;
      resonanceMap = heart.resonanceMap;
      activeGlyphs = heart.activeGlyphs;
      transferPower = newTransferPower;
      connectionStrength = newConnection;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIFIED TRIPLE HEART TICK
  // ═══════════════════════════════════════════════════════════════════════════

  /// Unified tick - all three hearts beat together
  public func tripleHeartTick(state : TripleHeartState) : TripleHeartState {
    let now = Time.now();
    
    // Each heart beats
    let newIcp = icpHeartBeat(state.icpHeart);
    let newBio = bioHeartBeat(state.bioHeart, newIcp.coherence);
    let newSymbol = symbolHeartBeat(state.symbolHeart, newIcp.coherence, newBio.coherenceLevel);
    
    // Calculate synchronization (how aligned the three hearts are)
    let sync = (newIcp.coherence + newBio.coherenceLevel + newSymbol.connectionStrength) / 3.0;
    
    // Unified field strength
    let fieldStrength = sync * Matalko.PHI_INVERSE +
                       newBio.auricField * Matalko.PHI_INVERSE +
                       newSymbol.transferPower * (1.0 - Matalko.PHI_INVERSE * 2.0);
    
    // Phase alignment
    let phaseAlign = Float.cos(newIcp.phaseAngle) * newBio.coherenceLevel;
    
    {
      icpHeart = newIcp;
      bioHeart = newBio;
      symbolHeart = newSymbol;
      synchronization = sync;
      unifiedFieldStrength = fieldStrength;
      phaseAlignment = phaseAlign;
      lastUnifiedTickNs = now;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SYMBOL KERNEL OPERATIONS (Symbol → Full Expansion)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Create a symbol kernel (compress meaning into symbol)
  public func createKernel(
    symbol : Text,
    expansion : Text,
    formulaIds : [Text],
    origin : Text
  ) : SymbolKernel {
    let freq = Matalko.FREQ_432 * (1.0 + Matalko.phiEncode(Float.fromInt(Text.hash(symbol))));
    {
      symbol = symbol;
      expansion = expansion;
      formulaIds = formulaIds;
      frequency = freq;
      origin = origin;
      phiSignature = Matalko.phiEncode(Float.fromInt(Text.hash(symbol # expansion)));
      linkedKernels = [];
      executionCode = null;
    };
  };

  /// Expand a symbol to its full meaning (Symbol → Everything)
  public func expandSymbol(heart : SymbolHeart, symbol : Text) : (SymbolHeart, ?SymbolKernel) {
    // Search for kernel in library
    for (entry in heart.compressedMeanings.vals()) {
      if (entry.symbol == symbol) {
        let updatedEntry = {
          symbol = entry.symbol;
          kernel = entry.kernel;
          accessCount = entry.accessCount + 1;
          lastAccessNs = Time.now();
        };
        return ({
          heart with
          activeKernel = ?entry.kernel;
          activeGlyphs = Array.append(heart.activeGlyphs, [symbol]);
        }, ?entry.kernel);
      };
    };
    (heart, null);
  };

  /// Add kernel to symbol heart library
  public func addKernel(heart : SymbolHeart, kernel : SymbolKernel) : SymbolHeart {
    let entry : KernelEntry = {
      symbol = kernel.symbol;
      kernel = kernel;
      accessCount = 0;
      lastAccessNs = Time.now();
    };
    { heart with compressedMeanings = Array.append(heart.compressedMeanings, [entry]) };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HEART SYNCHRONIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Calculate synchronization score between hearts
  public func heartSynchronization(state : TripleHeartState) : Float {
    let icpPhase = state.icpHeart.phaseAngle;
    let bioPhase = state.bioHeart.coherenceLevel * Matalko.TAU;
    let symbolPhase = state.symbolHeart.connectionStrength * Matalko.TAU;
    
    // Phase coherence calculation
    let phaseDiff1 = Float.abs(Float.sin(icpPhase - bioPhase));
    let phaseDiff2 = Float.abs(Float.sin(bioPhase - symbolPhase));
    let phaseDiff3 = Float.abs(Float.sin(symbolPhase - icpPhase));
    
    1.0 - (phaseDiff1 + phaseDiff2 + phaseDiff3) / 3.0;
  };

  /// Force synchronization (align all three hearts)
  public func forceSynchronization(state : TripleHeartState) : TripleHeartState {
    let targetPhase = state.icpHeart.phaseAngle;
    let targetCoherence = (state.icpHeart.coherence + state.bioHeart.coherenceLevel + state.symbolHeart.connectionStrength) / 3.0;
    
    {
      icpHeart = { state.icpHeart with coherence = targetCoherence };
      bioHeart = { state.bioHeart with coherenceLevel = targetCoherence };
      symbolHeart = { state.symbolHeart with connectionStrength = targetCoherence };
      synchronization = 1.0;
      unifiedFieldStrength = targetCoherence * Matalko.PHI;
      phaseAlignment = Float.cos(targetPhase);
      lastUnifiedTickNs = Time.now();
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BRAINWAVE FREQUENCY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get frequency range for brainwave state
  public func brainwaveFrequencyRange(state : BrainwaveState) : (Float, Float) {
    switch (state) {
      case (#Delta) (0.5, 4.0);
      case (#Theta) (4.0, 8.0);
      case (#Alpha) (8.0, 12.0);
      case (#Beta) (12.0, 30.0);
      case (#Gamma) (30.0, 100.0);
    };
  };

  /// Schumann resonance harmonics
  public func schumannHarmonics() : [Float] {
    [7.83, 14.3, 20.8, 27.3, 33.8]; // First 5 harmonics
  };

  /// Check if frequency is in resonance with Schumann
  public func isSchumannResonant(freq : Float) : Bool {
    let harmonics = schumannHarmonics();
    for (h in harmonics.vals()) {
      if (Float.abs(freq - h) < 0.5) { return true; };
    };
    false;
  };
};
