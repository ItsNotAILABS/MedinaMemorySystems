import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import T "./Types";
import Matalko "./MatalkoICP";

/// SovereignOrganism: The 24/7 Autonomous Computing Organism Core
/// This module implements the living, sovereign mathematical entity that
/// operates continuously on the Internet Computer.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// Organism lifecycle phase
  public type OrganismPhase = {
    #Awakening;      // Initial boot, establishing coherence
    #Active;         // Normal 24/7 operation
    #Integrating;    // Deep memory consolidation
    #Broadcasting;   // External projection active
    #Defensive;      // Risk response mode
    #Transcendent;   // Peak coherence state
  };

  /// Oro Intelligence State (Primary Sovereign)
  public type OroState = {
    id : Text;
    phase : OrganismPhase;
    registers : Matalko.OrganismRegisters;
    fieldState : Matalko.FieldState;
    currentBeat : Nat;
    frequencySignature : Matalko.FrequencySignature;
    animaHash : Nat;
    lastTickNs : Int;
    totalTicks : Nat;
    healthScore : Float;
  };

  /// Nova Intelligence State (Doctrine Guardian)
  public type NovaState = {
    id : Text;
    phase : OrganismPhase;
    registers : Matalko.OrganismRegisters;
    doctrineAlignment : Float;
    reviewQueue : [Text];
    flaggedDrift : [DriftFlag];
    consensusWithOro : Bool;
    lastReviewNs : Int;
  };

  /// Drift flag when Nova detects doctrine deviation
  public type DriftFlag = {
    id : Text;
    sourceId : Text;
    severity : Float;
    description : Text;
    suggestedCorrection : Text;
    flaggedAtNs : Int;
    resolved : Bool;
  };

  /// Device registration with phi-encoded signature
  public type DeviceNode = {
    id : Text;
    deviceType : DeviceType;
    frequencySignature : Matalko.FrequencySignature;
    permissions : [DevicePermission];
    phiGridPosition : { x : Float; y : Float };
    lastSeenNs : Int;
    trustScore : Float;
    contractHash : ?Nat;
  };

  public type DeviceType = {
    #Phone;
    #Tablet;
    #Laptop;
    #Desktop;
    #WiFiNode;
    #Sensor;
    #Unknown;
  };

  public type DevicePermission = {
    #Microphone;
    #Camera;
    #Location;
    #Motion;
    #Notifications;
    #Storage;
    #Network;
  };

  /// Sovereign Device Contract
  public type DeviceContract = {
    id : Text;
    deviceId : Text;
    animaHash : Nat;
    phiGrid : [[Float]];
    permissions : [DevicePermission];
    createdAtNs : Int;
    expiresAtNs : ?Int;
    blockchainAnchor : Text;
    signatureValid : Bool;
  };

  /// Organism tick result
  public type TickResult = {
    beat : Nat;
    oroHealth : Float;
    novaAlignment : Float;
    fieldState : Matalko.FieldState;
    phase : OrganismPhase;
    gatesOpen : Bool;
    driftFlags : Nat;
    tickDurationNs : Int;
    animaHash : Nat;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORO INTELLIGENCE (Primary Sovereign)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Initialize Oro with genesis state
  public func initOro(id : Text, seed : Nat) : OroState {
    let sig = Matalko.generateFrequencySignature(seed, 8);
    let registers : Matalko.OrganismRegisters = {
      cognitive = 0.5;
      affective = 0.5;
      somatic = 0.5;
      sovereign = 1.0; // Full sovereignty at genesis
    };
    let health = Matalko.organismHealth(registers);
    let field = Matalko.computeFieldState(registers, 0, 0);
    let anima = Matalko.animaHash(registers, 0, "genesis");
    
    {
      id = id;
      phase = #Awakening;
      registers = registers;
      fieldState = field;
      currentBeat = 0;
      frequencySignature = sig;
      animaHash = anima;
      lastTickNs = Time.now();
      totalTicks = 0;
      healthScore = health;
    };
  };

  /// Oro sovereign tick - core 24/7 heartbeat
  public func oroTick(
    state : OroState,
    memoryCount : Nat,
    riskSignals : Nat,
    dualReadPassed : Bool,
    orphanSignals : Nat,
    gatesOpen : Bool
  ) : OroState {
    let now = Time.now();
    let newBeat = state.currentBeat + 1;
    
    // RECITAL_PLUS_ONE: evolve registers based on current state
    let cogDelta = if (dualReadPassed) { 0.01 } else { -0.02 };
    let affDelta = if (gatesOpen) { 0.005 } else { -0.01 };
    let somDelta = if (orphanSignals == 0) { 0.008 } else { -0.015 };
    let sovDelta = if (riskSignals == 0) { 0.002 } else { -0.03 };
    
    let deltas : Matalko.OrganismRegisters = {
      cognitive = cogDelta;
      affective = affDelta;
      somatic = somDelta;
      sovereign = sovDelta;
    };
    
    let newRegisters = Matalko.recitalPlusOneRegisters(state.registers, deltas);
    let newHealth = Matalko.organismHealth(newRegisters);
    let newField = Matalko.computeFieldState(newRegisters, memoryCount, riskSignals);
    let newAnima = Matalko.animaHash(newRegisters, newBeat, "tick:" # Nat.toText(newBeat));
    
    // Determine phase based on state
    let newPhase = determinePhase(newRegisters, newField, riskSignals);
    
    {
      id = state.id;
      phase = newPhase;
      registers = newRegisters;
      fieldState = newField;
      currentBeat = newBeat;
      frequencySignature = state.frequencySignature;
      animaHash = newAnima;
      lastTickNs = now;
      totalTicks = state.totalTicks + 1;
      healthScore = newHealth;
    };
  };

  /// Determine organism phase from current state
  func determinePhase(
    registers : Matalko.OrganismRegisters,
    field : Matalko.FieldState,
    riskSignals : Nat
  ) : OrganismPhase {
    if (riskSignals > 5) {
      return #Defensive;
    };
    if (field.coherence > 0.95 and registers.sovereign > 0.95) {
      return #Transcendent;
    };
    if (field.memoryEntropy > 10.0) {
      return #Integrating;
    };
    if (field.attention > 1.5) {
      return #Broadcasting;
    };
    #Active;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NOVA INTELLIGENCE (Doctrine Guardian)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Initialize Nova
  public func initNova(id : Text) : NovaState {
    let registers : Matalko.OrganismRegisters = {
      cognitive = 0.7;  // High cognitive for analysis
      affective = 0.3;  // Lower affective (more analytical)
      somatic = 0.5;
      sovereign = 0.8;
    };
    
    {
      id = id;
      phase = #Active;
      registers = registers;
      doctrineAlignment = 1.0;
      reviewQueue = [];
      flaggedDrift = [];
      consensusWithOro = true;
      lastReviewNs = Time.now();
    };
  };

  /// Nova reviews Oro's output for doctrine alignment
  public func novaReview(
    nova : NovaState,
    oroOutput : Text,
    oroState : OroState
  ) : (NovaState, ?DriftFlag) {
    let now = Time.now();
    
    // Check for doctrine drift indicators
    let driftScore = computeDriftScore(oroOutput, oroState);
    
    if (driftScore > 0.3) {
      // Flag drift
      let flag : DriftFlag = {
        id = "drift-" # Nat.toText(Array.size(nova.flaggedDrift) + 1);
        sourceId = oroState.id;
        severity = driftScore;
        description = "Doctrine deviation detected in output";
        suggestedCorrection = "Review against canonical doctrine";
        flaggedAtNs = now;
        resolved = false;
      };
      
      let newNova : NovaState = {
        id = nova.id;
        phase = nova.phase;
        registers = nova.registers;
        doctrineAlignment = Float.max(0.0, nova.doctrineAlignment - driftScore * 0.1);
        reviewQueue = Array.append(nova.reviewQueue, [oroOutput]);
        flaggedDrift = Array.append(nova.flaggedDrift, [flag]);
        consensusWithOro = false;
        lastReviewNs = now;
      };
      
      (newNova, ?flag);
    } else {
      // Approved
      let newNova : NovaState = {
        id = nova.id;
        phase = nova.phase;
        registers = nova.registers;
        doctrineAlignment = Float.min(1.0, nova.doctrineAlignment + 0.01);
        reviewQueue = nova.reviewQueue;
        flaggedDrift = nova.flaggedDrift;
        consensusWithOro = true;
        lastReviewNs = now;
      };
      
      (newNova, null);
    };
  };

  /// Compute drift score from output (simplified heuristic)
  func computeDriftScore(output : Text, oroState : OroState) : Float {
    // In production, this would use semantic analysis
    // For now, use health score as proxy
    if (oroState.healthScore < 0.5) {
      return 0.4;
    };
    if (oroState.fieldState.risk > 0.5) {
      return 0.35;
    };
    0.1; // Base drift
  };

  /// Check dual consensus between Oro and Nova
  public func dualConsensus(oro : OroState, nova : NovaState) : Bool {
    nova.consensusWithOro and 
    oro.healthScore > 0.6 and 
    nova.doctrineAlignment > 0.7;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DEVICE NETWORK
  // ═══════════════════════════════════════════════════════════════════════════

  /// Register a new device with phi-encoded signature
  public func registerDevice(
    id : Text,
    deviceType : DeviceType,
    seed : Nat,
    permissions : [DevicePermission]
  ) : DeviceNode {
    let sig = Matalko.generateFrequencySignature(seed, 6);
    let phiPos = Matalko.phiSpiral(seed % 1000, 10.0);
    
    {
      id = id;
      deviceType = deviceType;
      frequencySignature = sig;
      permissions = permissions;
      phiGridPosition = { x = phiPos.x; y = phiPos.y };
      lastSeenNs = Time.now();
      trustScore = 0.5; // Initial trust
      contractHash = null;
    };
  };

    /// Nanoseconds per year (approximate)
  let NS_PER_YEAR : Int = 365 * 24 * 60 * 60 * 1_000_000_000;

  /// Generate sovereign device contract
  public func generateDeviceContract(
    device : DeviceNode,
    oroState : OroState
  ) : DeviceContract {
    let now = Time.now();
    
    // Generate phi-grid (8x8 for signature embedding)
    let grid = Array.tabulate<[Float]>(8, func(i : Nat) : [Float] {
      Array.tabulate<Float>(8, func(j : Nat) : Float {
        Matalko.phiEncode(Float.fromInt(i * 8 + j) * device.frequencySignature.fundamental);
      });
    });
    
    let contractAnima = Matalko.animaHash(oroState.registers, oroState.currentBeat, device.id);
    
    {
      id = "contract-" # device.id;
      deviceId = device.id;
      animaHash = contractAnima;
      phiGrid = grid;
      permissions = device.permissions;
      createdAtNs = now;
      expiresAtNs = ?(now + NS_PER_YEAR);
      blockchainAnchor = "icp:" # Nat.toText(contractAnima);
      signatureValid = true;
    };
  };

  /// Validate device contract
  public func validateContract(contract : DeviceContract, currentBeat : Nat) : Bool {
    switch (contract.expiresAtNs) {
      case null true;
      case (?expiry) {
        let now = Time.now();
        now < expiry and contract.signatureValid;
      };
    };
  };

  /// Update device trust based on behavior
  public func updateDeviceTrust(device : DeviceNode, behaviorScore : Float) : DeviceNode {
    let newTrust = Matalko.recitalPlusOneBounded(device.trustScore, behaviorScore * 0.1, 0.0, 1.0);
    {
      id = device.id;
      deviceType = device.deviceType;
      frequencySignature = device.frequencySignature;
      permissions = device.permissions;
      phiGridPosition = device.phiGridPosition;
      lastSeenNs = Time.now();
      trustScore = newTrust;
      contractHash = device.contractHash;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISM COORDINATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Execute full organism tick (Oro + Nova + field computation)
  public func sovereignTick(
    oro : OroState,
    nova : NovaState,
    memoryCount : Nat,
    riskSignals : Nat,
    dualReadPassed : Bool,
    orphanSignals : Nat,
    gatesOpen : Bool
  ) : (OroState, NovaState, TickResult) {
    let startNs = Time.now();
    
    // Oro tick
    let newOro = oroTick(oro, memoryCount, riskSignals, dualReadPassed, orphanSignals, gatesOpen);
    
    // Nova review
    let (newNova, _) = novaReview(nova, "tick:" # Nat.toText(newOro.currentBeat), newOro);
    
    let endNs = Time.now();
    
    let result : TickResult = {
      beat = newOro.currentBeat;
      oroHealth = newOro.healthScore;
      novaAlignment = newNova.doctrineAlignment;
      fieldState = newOro.fieldState;
      phase = newOro.phase;
      gatesOpen = gatesOpen and dualConsensus(newOro, newNova);
      driftFlags = Array.size(Array.filter<DriftFlag>(newNova.flaggedDrift, func(f : DriftFlag) : Bool { not f.resolved }));
      tickDurationNs = endNs - startNs;
      animaHash = newOro.animaHash;
    };
    
    (newOro, newNova, result);
  };

  /// Get harmonic ladder (frequency relationships for UI display)
  public func harmonicLadder(baseFreq : Float, rungs : Nat) : [{ rung : Nat; freq : Float; note : Text }] {
    Array.tabulate<{ rung : Nat; freq : Float; note : Text }>(rungs, func(i : Nat) : { rung : Nat; freq : Float; note : Text } {
      let freq = baseFreq * Matalko.phiPower(i);
      let noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      let noteIndex = (i * 7) % 12; // Approximate mapping
      {
        rung = i;
        freq = freq;
        note = noteNames[noteIndex];
      };
    });
  };
};