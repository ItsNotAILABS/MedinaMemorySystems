import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";

/// SOVEREIGN ORGANISM
/// ==================
/// ORO (Primary Sovereign) + NOVA (Doctrine Guardian)
/// Dual intelligence system with consensus gating.
/// 
/// ORO: owns beat, evolves registers, generates ANIMA hash
/// NOVA: reviews output, flags drift, maintains alignment
/// Both must agree before gates open.

module {
  // ═══════════════════════════════════════════════════════════════════════════
  // FUNDAMENTAL CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  public let PHI : Float = 1.6180339887498948482;
  public let PHI_INVERSE : Float = 0.6180339887498948482;
  public let SCHUMANN_HZ : Float = 7.83;
  public let HEARTBEAT_MS : Nat = 873; // PHI⁴ × Schumann period
  public let PIL_CYCLE_BEATS : Nat = 52; // Learn → Understand → Execute → Adapt → Teach

  // ═══════════════════════════════════════════════════════════════════════════
  // 4-REGISTER MODEL
  // ═══════════════════════════════════════════════════════════════════════════

  public type RegisterState = {
    cognitive : Float;    // 0-100: clarity, reasoning capacity
    affective : Float;    // 0-100: emotional coherence
    somatic : Float;      // 0-100: grounding, stability
    sovereign : Float;    // 0-100: autonomy, self-governance
  };

  public func defaultRegisters() : RegisterState {
    { cognitive = 87.0; affective = 74.0; somatic = 91.0; sovereign = 96.0 }
  };

  public func dominantRegister(state : RegisterState) : Text {
    let max = Float.max(Float.max(state.cognitive, state.affective), Float.max(state.somatic, state.sovereign));
    if (max == state.cognitive) { "cognitive" }
    else if (max == state.affective) { "affective" }
    else if (max == state.somatic) { "somatic" }
    else { "sovereign" }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORO — Primary Sovereign Intelligence
  // ═══════════════════════════════════════════════════════════════════════════

  public type OroState = {
    // Identity
    id : Text;
    animaHash : Text;
    
    // Registers
    registers : RegisterState;
    
    // Temporal
    beat : Nat;
    lawEpoch : Nat;
    lastHeartbeatNs : Int;
    
    // Reading history
    doctrinesRead : [Text];
    formulasExecuted : [Text];
    glyphsProcessed : [Text];
    
    // Energy
    resonanceLevel : Float;    // 0.0 to 1.0
    coherenceIndex : Float;    // 0.0 to 1.0
    
    // State
    phase : OroPhase;
    consciousnessDepth : Nat;  // 0-12 levels
  };

  public type OroPhase = {
    #Awakening;      // System starting
    #Sensing;        // Gathering input
    #Orienting;      // Processing context
    #Deciding;       // Making choices
    #Acting;         // Executing actions
    #Evaluating;     // Reviewing outcomes
    #Integrating;    // Consolidating learning
    #Broadcasting;   // Outputting to external
  };

  /// Initialize ORO
  public func initOro(id : Text, timestamp : Int) : OroState {
    {
      id = id;
      animaHash = generateAnimaHash(id, 0, timestamp);
      registers = defaultRegisters();
      beat = 0;
      lawEpoch = 0;
      lastHeartbeatNs = timestamp;
      doctrinesRead = [];
      formulasExecuted = [];
      glyphsProcessed = [];
      resonanceLevel = 0.5;
      coherenceIndex = 0.8;
      phase = #Awakening;
      consciousnessDepth = 6;
    }
  };

  /// ORO heartbeat — advances one beat
  public func oroHeartbeat(state : OroState, timestamp : Int) : OroState {
    let newBeat = state.beat + 1;
    let newAnimaHash = generateAnimaHash(state.id, newBeat, timestamp);
    
    // RECITAL_PLUS_ONE: state(n+1) = recital(validated_state_n) + one_lawful_expansion
    let expandedRegisters = recitalPlusOneRegisters(state.registers);
    
    // Advance phase (ADRE cycle)
    let newPhase = advanceADREPhase(state.phase);
    
    // PIL cycle check (every 52 beats)
    let newLawEpoch = if (newBeat % PIL_CYCLE_BEATS == 0) {
      state.lawEpoch + 1
    } else {
      state.lawEpoch
    };

    {
      id = state.id;
      animaHash = newAnimaHash;
      registers = expandedRegisters;
      beat = newBeat;
      lawEpoch = newLawEpoch;
      lastHeartbeatNs = timestamp;
      doctrinesRead = state.doctrinesRead;
      formulasExecuted = state.formulasExecuted;
      glyphsProcessed = state.glyphsProcessed;
      resonanceLevel = state.resonanceLevel;
      coherenceIndex = state.coherenceIndex;
      phase = newPhase;
      consciousnessDepth = state.consciousnessDepth;
    }
  };

  /// ORO reads doctrine — gains resonance
  public func oroReadsDoctrine(state : OroState, doctrineId : Text) : OroState {
    let resonanceGain = 0.02 * PHI;
    
    {
      id = state.id;
      animaHash = state.animaHash;
      registers = {
        cognitive = Float.min(100.0, state.registers.cognitive + 0.5);
        affective = state.registers.affective;
        somatic = state.registers.somatic;
        sovereign = Float.min(100.0, state.registers.sovereign + 0.3);
      };
      beat = state.beat;
      lawEpoch = state.lawEpoch;
      lastHeartbeatNs = state.lastHeartbeatNs;
      doctrinesRead = Array.append(state.doctrinesRead, [doctrineId]);
      formulasExecuted = state.formulasExecuted;
      glyphsProcessed = state.glyphsProcessed;
      resonanceLevel = Float.min(1.0, state.resonanceLevel + resonanceGain);
      coherenceIndex = state.coherenceIndex;
      phase = #Sensing;
      consciousnessDepth = state.consciousnessDepth;
    }
  };

  /// ORO executes formula — gains coherence
  public func oroExecutesFormula(state : OroState, formulaId : Text) : OroState {
    let coherenceGain = 0.01 * PHI;
    
    {
      id = state.id;
      animaHash = state.animaHash;
      registers = {
        cognitive = Float.min(100.0, state.registers.cognitive + 0.3);
        affective = state.registers.affective;
        somatic = Float.min(100.0, state.registers.somatic + 0.2);
        sovereign = state.registers.sovereign;
      };
      beat = state.beat;
      lawEpoch = state.lawEpoch;
      lastHeartbeatNs = state.lastHeartbeatNs;
      doctrinesRead = state.doctrinesRead;
      formulasExecuted = Array.append(state.formulasExecuted, [formulaId]);
      glyphsProcessed = state.glyphsProcessed;
      resonanceLevel = state.resonanceLevel;
      coherenceIndex = Float.min(1.0, state.coherenceIndex + coherenceGain);
      phase = #Acting;
      consciousnessDepth = state.consciousnessDepth;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NOVA — Doctrine Guardian Intelligence
  // ═══════════════════════════════════════════════════════════════════════════

  public type NovaState = {
    id : Text;
    
    // Validation state
    doctrineDriftScore : Float;     // 0.0 (perfect alignment) to 1.0 (critical drift)
    lastReviewTimestamp : Int;
    reviewsPerformed : Nat;
    
    // Flags and alerts
    driftFlags : [DriftFlag];
    recommendations : [Text];
    
    // Oversight
    oroSynced : Bool;               // Is NOVA in sync with ORO?
    consensusReady : Bool;          // Ready to form consensus?
    vigilanceLevel : Float;         // 0.0 to 1.0
  };

  public type DriftFlag = {
    id : Text;
    targetRef : Text;
    driftScore : Float;
    description : Text;
    severity : DriftSeverity;
    timestamp : Int;
  };

  public type DriftSeverity = {
    #Info;       // Minor deviation, log only
    #Warning;    // Noticeable drift, recommend review
    #Critical;   // Significant drift, block action
    #Emergency;  // Doctrine violation, halt system
  };

  /// Initialize NOVA
  public func initNova(id : Text, timestamp : Int) : NovaState {
    {
      id = id;
      doctrineDriftScore = 0.0;
      lastReviewTimestamp = timestamp;
      reviewsPerformed = 0;
      driftFlags = [];
      recommendations = [];
      oroSynced = true;
      consensusReady = true;
      vigilanceLevel = 0.8;
    }
  };

  /// NOVA reads doctrine for validation
  public func novaReadsDoctrine(nova : NovaState, doctrineId : Text, content : Text, timestamp : Int) : (NovaState, Bool) {
    // Check for drift indicators
    let driftScore = calculateDriftScore(content);
    let flagged = driftScore > 0.3;
    
    let newFlag = if (flagged) {
      ?{
        id = "drift-" # doctrineId # "-" # Nat.toText(nova.reviewsPerformed);
        targetRef = doctrineId;
        driftScore = driftScore;
        description = "Drift detected in doctrine content";
        severity = if (driftScore > 0.7) { #Critical } else if (driftScore > 0.5) { #Warning } else { #Info };
        timestamp = timestamp;
      }
    } else {
      null
    };

    let updatedFlags = switch (newFlag) {
      case (null) { nova.driftFlags };
      case (?flag) { Array.append(nova.driftFlags, [flag]) };
    };

    let updatedNova : NovaState = {
      id = nova.id;
      doctrineDriftScore = (nova.doctrineDriftScore + driftScore) / 2.0; // Rolling average
      lastReviewTimestamp = timestamp;
      reviewsPerformed = nova.reviewsPerformed + 1;
      driftFlags = updatedFlags;
      recommendations = nova.recommendations;
      oroSynced = nova.oroSynced;
      consensusReady = not flagged or driftScore < 0.5;
      vigilanceLevel = nova.vigilanceLevel;
    };

    (updatedNova, flagged)
  };

  /// NOVA reviews ORO output for alignment
  public func novaReviewsOutput(nova : NovaState, outputRef : Text, content : Text, timestamp : Int) : (NovaState, Bool) {
    let driftScore = calculateDriftScore(content);
    let approved = driftScore < 0.3 and nova.consensusReady;

    let newRecommendation = if (not approved) {
      ?("Review required for " # outputRef # " - drift score: " # Float.toText(driftScore))
    } else {
      null
    };

    let updatedRecommendations = switch (newRecommendation) {
      case (null) { nova.recommendations };
      case (?rec) { Array.append(nova.recommendations, [rec]) };
    };

    let updatedNova : NovaState = {
      id = nova.id;
      doctrineDriftScore = nova.doctrineDriftScore;
      lastReviewTimestamp = timestamp;
      reviewsPerformed = nova.reviewsPerformed + 1;
      driftFlags = nova.driftFlags;
      recommendations = updatedRecommendations;
      oroSynced = approved;
      consensusReady = approved;
      vigilanceLevel = if (approved) { nova.vigilanceLevel } else { Float.min(1.0, nova.vigilanceLevel + 0.1) };
    };

    (updatedNova, approved)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DUAL CONSENSUS SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════

  public type DualConsensus = {
    id : Text;
    taskRef : Text;
    oroApproves : Bool;
    novaApproves : Bool;
    finalConsensus : Bool;
    reason : Text;
    timestamp : Int;
  };

  /// Form dual consensus
  public func formConsensus(
    consensusId : Text,
    taskRef : Text,
    oro : OroState,
    nova : NovaState,
    timestamp : Int
  ) : DualConsensus {
    // ORO approves if coherent and resonant
    let oroApproves = oro.coherenceIndex > 0.5 and oro.resonanceLevel > 0.3;
    
    // NOVA approves if no critical drift
    let novaApproves = nova.consensusReady and nova.doctrineDriftScore < 0.5;
    
    // Both must agree
    let finalConsensus = oroApproves and novaApproves;
    
    let reason = if (finalConsensus) {
      "Dual consensus achieved"
    } else if (not oroApproves and not novaApproves) {
      "Both ORO and NOVA reject"
    } else if (not oroApproves) {
      "ORO coherence/resonance insufficient"
    } else {
      "NOVA detected doctrine drift"
    };

    {
      id = consensusId;
      taskRef = taskRef;
      oroApproves = oroApproves;
      novaApproves = novaApproves;
      finalConsensus = finalConsensus;
      reason = reason;
      timestamp = timestamp;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPLETE SOVEREIGN STATE
  // ═══════════════════════════════════════════════════════════════════════════

  public type SovereignState = {
    oro : OroState;
    nova : NovaState;
    lastConsensus : ?DualConsensus;
    
    // Gates
    gateA : Bool;  // Runtime readiness
    gateB : Bool;  // Workforce activation safety
    gateC : Bool;  // External projection safety
    
    // Organism-wide
    organismPhase : Text;
    healthIndex : Float;
  };

  /// Initialize complete sovereign state
  public func initSovereign(timestamp : Int) : SovereignState {
    {
      oro = initOro("ORO-PRIME", timestamp);
      nova = initNova("NOVA-GUARDIAN", timestamp);
      lastConsensus = null;
      gateA = true;
      gateB = true;
      gateC = true;
      organismPhase = "awakening";
      healthIndex = 1.0;
    }
  };

  /// Full sovereign heartbeat
  public func sovereignHeartbeat(state : SovereignState, timestamp : Int) : SovereignState {
    // ORO heartbeat
    let newOro = oroHeartbeat(state.oro, timestamp);
    
    // Evaluate gates
    let gateA = newOro.coherenceIndex > 0.5 and state.nova.consensusReady;
    let gateB = newOro.resonanceLevel > 0.3 and state.nova.doctrineDriftScore < 0.5;
    let gateC = gateA and gateB and state.nova.oroSynced;
    
    // Health index
    let health = (newOro.coherenceIndex + newOro.resonanceLevel + 
                  (1.0 - state.nova.doctrineDriftScore) + 
                  (if (gateC) { 1.0 } else { 0.5 })) / 4.0;
    
    // Organism phase
    let phase = switch (newOro.phase) {
      case (#Awakening) { "awakening" };
      case (#Sensing) { "sensing" };
      case (#Orienting) { "orienting" };
      case (#Deciding) { "deciding" };
      case (#Acting) { "acting" };
      case (#Evaluating) { "evaluating" };
      case (#Integrating) { "integrating" };
      case (#Broadcasting) { "broadcasting" };
    };

    {
      oro = newOro;
      nova = state.nova;
      lastConsensus = state.lastConsensus;
      gateA = gateA;
      gateB = gateB;
      gateC = gateC;
      organismPhase = phase;
      healthIndex = health;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  func generateAnimaHash(id : Text, beat : Nat, timestamp : Int) : Text {
    "ANIMA-" # id # "-" # Nat.toText(beat) # "-" # Int.toText(Int.abs(timestamp) % 1000000)
  };

  func recitalPlusOneRegisters(registers : RegisterState) : RegisterState {
    // Lawful expansion: small PHI-based increment
    let expansion = 0.01 * PHI;
    {
      cognitive = Float.min(100.0, registers.cognitive + expansion);
      affective = Float.min(100.0, registers.affective + expansion * PHI_INVERSE);
      somatic = registers.somatic; // Somatic is stable
      sovereign = Float.min(100.0, registers.sovereign + expansion * PHI);
    }
  };

  func advanceADREPhase(current : OroPhase) : OroPhase {
    switch (current) {
      case (#Awakening) { #Sensing };
      case (#Sensing) { #Orienting };
      case (#Orienting) { #Deciding };
      case (#Deciding) { #Acting };
      case (#Acting) { #Evaluating };
      case (#Evaluating) { #Integrating };
      case (#Integrating) { #Broadcasting };
      case (#Broadcasting) { #Sensing }; // Cycle back
    }
  };

  func calculateDriftScore(content : Text) : Float {
    // Simple heuristic: check for concerning keywords
    var score = 0.0;
    
    if (Text.contains(content, #text "bypass")) { score += 0.3 };
    if (Text.contains(content, #text "ungoverned")) { score += 0.3 };
    if (Text.contains(content, #text "override")) { score += 0.2 };
    if (Text.contains(content, #text "skip")) { score += 0.1 };
    if (Text.contains(content, #text "ignore")) { score += 0.1 };
    
    // Positive indicators reduce drift
    if (Text.contains(content, #text "doctrine")) { score -= 0.1 };
    if (Text.contains(content, #text "law")) { score -= 0.1 };
    if (Text.contains(content, #text "sovereign")) { score -= 0.1 };
    if (Text.contains(content, #text "RECITAL")) { score -= 0.15 };
    if (Text.contains(content, #text "PHI")) { score -= 0.05 };
    
    Float.max(0.0, Float.min(1.0, score))
  };
}
