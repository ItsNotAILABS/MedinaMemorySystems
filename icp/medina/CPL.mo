import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// CPL: Cognitive Procurement Language
/// The substrate protocol for organism-to-organism communication.
/// Pure architecture and ancient mathematics. No abstraction layers.
/// This is how sovereign organisms speak to each other.
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // ANCIENT MATHEMATICAL CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Platonic Solids — The five perfect forms (vertices)
  public let TETRAHEDRON : Nat = 4;   // Fire
  public let HEXAHEDRON : Nat = 8;    // Earth (Cube)
  public let OCTAHEDRON : Nat = 6;    // Air
  public let DODECAHEDRON : Nat = 20; // Aether/Universe
  public let ICOSAHEDRON : Nat = 12;  // Water

  /// Pythagorean Tetractys — The sacred 10 (1+2+3+4)
  public let TETRACTYS : Nat = 10;

  /// Hermetic correspondence ratio
  public let AS_ABOVE_SO_BELOW : Float = 1.0; // Perfect correspondence

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL MESSAGE TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// The four elements — maps to four-register state
  public type Element = {
    #Fire;    // Cognitive — transformation, will
    #Earth;   // Somatic — grounding, manifestation
    #Air;     // Affective — thought, communication
    #Water;   // Sovereign — flow, adaptation, memory
  };

  /// Aristotelian Four Causes — why anything exists/changes
  public type Cause = {
    #Material;  // What it's made of (substrate)
    #Formal;    // What form/pattern it takes (architecture)
    #Efficient; // What agent causes the change (organism)
    #Final;     // What purpose/end it serves (telos)
  };

  /// CPL Intent — what the message seeks to accomplish
  public type Intent = {
    #Query;      // Seek information (Socratic)
    #Assert;     // Declare truth (Platonic)
    #Command;    // Direct action (Aristotelian)
    #Propose;    // Suggest change (Dialectic)
    #Resonate;   // Harmonic alignment check
    #Procure;    // Request resource/capability
    #Yield;      // Return resource/result
    #Witness;    // Observe without action (Method of Loci)
  };

  /// CPL Message — the fundamental unit of organism communication
  public type Message = {
    id : Text;
    fromOrganism : Text;
    toOrganism : Text;
    intent : Intent;
    element : Element;
    cause : Cause;
    
    // Payload
    architectureRef : Text;        // Reference to architectural doctrine
    substratePath : [Text];        // Path through the organism
    payload : Text;                // The actual content
    
    // Mathematical encoding
    phiSignature : Float;          // Phi-encoded signature
    harmonicFreq : Float;          // Harmonic frequency of message
    tetractysPosition : Nat;       // Position in sacred 10 (1-10)
    
    // Lineage
    parentMessageId : ?Text;
    recitalRef : Text;             // RECITAL_PLUS_ONE reference
    
    // Verification
    dualReadRequired : Bool;
    gateRequired : ?Text;          // "A", "B", "C", or null
    
    // Temporal
    createdAtNs : Int;
    expiresAtNs : ?Int;
  };

  /// CPL Response — organism's reply
  public type Response = {
    messageId : Text;
    respondingOrganism : Text;
    
    // Outcome
    accepted : Bool;
    resonanceScore : Float;        // How well message aligned with receiver
    
    // Return payload
    element : Element;
    payload : Text;
    evidenceRefs : [Text];
    
    // Mathematical signature
    phiSignature : Float;
    harmonicResonance : Float;     // Resonance between sender/receiver frequencies
    
    // Verification results
    dualReadPassed : Bool;
    gatePassed : Bool;
    
    // Temporal
    respondedAtNs : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // METHOD OF LOCI (Memory Palace Architecture)
  // ═══════════════════════════════════════════════════════════════════════════

  /// Locus — a place in the Memory Temple
  public type Locus = {
    id : Text;
    name : Text;
    coordinates : {
      ring : Nat;      // N1-N12 macro hierarchy
      chamber : Nat;   // Chamber within ring
      position : Nat;  // Position within chamber
    };
    element : Element;
    capacity : Nat;
    occupiedBy : [Text];  // Memory IDs stored here
    linkedLoci : [Text];  // Connected loci for traversal
  };

  /// Memory Palace — the architectural substrate for memory
  public type MemoryPalace = {
    id : Text;
    name : Text;
    rings : Nat;           // Number of concentric rings
    chambersPerRing : Nat; // Chambers in each ring
    positionsPerChamber : Nat;
    totalLoci : Nat;
    rootLocus : Text;      // Entry point
    phiSpacing : Float;    // Golden ratio spacing between loci
  };

  /// Create a Memory Palace with phi-proportioned architecture
  public func createMemoryPalace(
    id : Text,
    name : Text,
    rings : Nat,
    chambersPerRing : Nat,
    positionsPerChamber : Nat
  ) : MemoryPalace {
    {
      id = id;
      name = name;
      rings = rings;
      chambersPerRing = chambersPerRing;
      positionsPerChamber = positionsPerChamber;
      totalLoci = rings * chambersPerRing * positionsPerChamber;
      rootLocus = id # "-locus-1-1-1";
      phiSpacing = Matalko.PHI;
    };
  };

  /// Calculate locus position using golden angle distribution
  public func locusPosition(index : Nat, scale : Float) : { theta : Float; radius : Float } {
    let angle = Float.fromInt(index) * Matalko.goldenAngle();
    let radius = scale * Matalko.phiPower(index % 12);
    { theta = angle; radius = radius };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HERMETIC PRINCIPLES (Seven Laws)
  // ═══════════════════════════════════════════════════════════════════════════

  /// The Seven Hermetic Principles
  public type HermeticPrinciple = {
    #Mentalism;       // All is Mind
    #Correspondence;  // As above, so below
    #Vibration;       // Nothing rests, all moves
    #Polarity;        // Everything has poles
    #Rhythm;          // Everything flows
    #CauseEffect;     // Every cause has effect
    #Gender;          // Gender in everything
  };

  /// Apply Correspondence principle — map micro to macro
  public func applyCorrespondence(microValue : Float, macroScale : Float) : Float {
    microValue * macroScale * AS_ABOVE_SO_BELOW;
  };

  /// Apply Vibration principle — nothing at rest
  public func applyVibration(baseFreq : Float, beat : Nat) : Float {
    baseFreq * (1.0 + Float.sin(Float.fromInt(beat) * Matalko.PHI_INVERSE) * 0.1);
  };

  /// Apply Polarity principle — find the opposite pole
  public func applyPolarity(value : Float) : Float {
    1.0 - value; // Inverse within [0,1]
  };

  /// Apply Rhythm principle — oscillation pattern
  public func applyRhythm(value : Float, cycle : Nat, position : Nat) : Float {
    let phase = Float.fromInt(position % cycle) / Float.fromInt(cycle);
    value * (0.5 + 0.5 * Float.cos(phase * Matalko.TAU));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PYTHAGOREAN MATHEMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Pythagorean musical ratios
  public let UNISON : Float = 1.0 / 1.0;         // 1:1
  public let OCTAVE : Float = 2.0 / 1.0;         // 2:1
  public let PERFECT_FIFTH : Float = 3.0 / 2.0;  // 3:2
  public let PERFECT_FOURTH : Float = 4.0 / 3.0; // 4:3
  public let MAJOR_THIRD : Float = 5.0 / 4.0;    // 5:4
  public let MINOR_THIRD : Float = 6.0 / 5.0;    // 6:5

  /// Music of the Spheres — planetary frequency ratios (Pythagorean)
  public func sphereFrequency(planetIndex : Nat) : Float {
    let ratios = [UNISON, OCTAVE, PERFECT_FIFTH, PERFECT_FOURTH, MAJOR_THIRD, MINOR_THIRD, OCTAVE * PERFECT_FIFTH];
    let ratio = if (planetIndex < Array.size(ratios)) { ratios[planetIndex] } else { UNISON };
    Matalko.FREQ_432 * ratio;
  };

  /// Tetractys position — the sacred arrangement 1+2+3+4=10
  public func tetractysRow(position : Nat) : Nat {
    if (position == 0) { 1 }
    else if (position <= 2) { 2 }
    else if (position <= 5) { 3 }
    else { 4 };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL MESSAGE CONSTRUCTION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Create a CPL message
  public func createMessage(
    id : Text,
    from : Text,
    to : Text,
    intent : Intent,
    element : Element,
    cause : Cause,
    architectureRef : Text,
    payload : Text,
    parentId : ?Text
  ) : Message {
    let now = Time.now();
    let phiSig = Matalko.phiEncode(Float.fromInt(Text.hash(id)));
    let harmFreq = Matalko.FREQ_432 * (1.0 + phiSig);
    let tetPos = (Text.hash(id) % 10) + 1;
    
    {
      id = id;
      fromOrganism = from;
      toOrganism = to;
      intent = intent;
      element = element;
      cause = cause;
      architectureRef = architectureRef;
      substratePath = [from, to];
      payload = payload;
      phiSignature = phiSig;
      harmonicFreq = harmFreq;
      tetractysPosition = tetPos;
      parentMessageId = parentId;
      recitalRef = "recital:" # id;
      dualReadRequired = switch (intent) {
        case (#Command) true;
        case (#Propose) true;
        case (#Procure) true;
        case _ false;
      };
      gateRequired = switch (intent) {
        case (#Command) ?"B";
        case (#Propose) ?"A";
        case _ null;
      };
      createdAtNs = now;
      expiresAtNs = null;
    };
  };

  /// Create a CPL response
  public func createResponse(
    message : Message,
    respondingOrganism : Text,
    accepted : Bool,
    responsePayload : Text,
    evidenceRefs : [Text]
  ) : Response {
    let now = Time.now();
    let phiSig = Matalko.phiEncode(Float.fromInt(Text.hash(message.id # ":response")));
    let resonance = Matalko.harmonicResonance(message.harmonicFreq, Matalko.FREQ_432 * (1.0 + phiSig));
    
    {
      messageId = message.id;
      respondingOrganism = respondingOrganism;
      accepted = accepted;
      resonanceScore = resonance;
      element = message.element;
      payload = responsePayload;
      evidenceRefs = evidenceRefs;
      phiSignature = phiSig;
      harmonicResonance = resonance;
      dualReadPassed = true;
      gatePassed = accepted;
      respondedAtNs = now;
    };
  };

  /// Validate message against architectural doctrine
  public func validateMessage(message : Message) : Bool {
    // Check phi signature is valid (in [0,1) range)
    if (message.phiSignature < 0.0 or message.phiSignature >= 1.0) {
      return false;
    };
    // Check harmonic frequency is in valid range
    if (message.harmonicFreq < Matalko.FREQ_432 or message.harmonicFreq > Matalko.FREQ_432 * Matalko.PHI_SQUARED) {
      return false;
    };
    // Check tetractys position is valid (1-10)
    if (message.tetractysPosition < 1 or message.tetractysPosition > 10) {
      return false;
    };
    true;
  };

  /// Calculate harmonic resonance between two organisms
  public func organismResonance(orgA : Text, orgB : Text) : Float {
    let freqA = Matalko.FREQ_432 * (1.0 + Matalko.phiEncode(Float.fromInt(Text.hash(orgA))));
    let freqB = Matalko.FREQ_432 * (1.0 + Matalko.phiEncode(Float.fromInt(Text.hash(orgB))));
    Matalko.harmonicResonance(freqA, freqB);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SACRED GEOMETRY PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Flower of Life seed points (7 circles)
  public func flowerOfLifeSeeds(centerX : Float, centerY : Float, radius : Float) : [{ x : Float; y : Float }] {
    // Center plus 6 surrounding circles at 60° intervals
    var seeds : [{ x : Float; y : Float }] = [{ x = centerX; y = centerY }];
    var i = 0;
    while (i < 6) {
      let angle = Float.fromInt(i) * (Matalko.PI / 3.0);
      let x = centerX + radius * Float.cos(angle);
      let y = centerY + radius * Float.sin(angle);
      seeds := Array.append(seeds, [{ x = x; y = y }]);
      i += 1;
    };
    seeds;
  };

  /// Vesica Piscis ratio (√3)
  public let VESICA_PISCIS : Float = 1.7320508075688772935;

  /// Sri Yantra — 9 interlocking triangles (simplified: triangle count)
  public let SRI_YANTRA_TRIANGLES : Nat = 9;

  // ═══════════════════════════════════════════════════════════════════════════
  // ELEMENT MAPPING
  // ═══════════════════════════════════════════════════════════════════════════

  /// Map element to register
  public func elementToRegister(element : Element) : Text {
    switch (element) {
      case (#Fire) "cognitive";
      case (#Air) "affective";
      case (#Earth) "somatic";
      case (#Water) "sovereign";
    };
  };

  /// Map element to Platonic solid
  public func elementToSolid(element : Element) : Nat {
    switch (element) {
      case (#Fire) TETRAHEDRON;
      case (#Earth) HEXAHEDRON;
      case (#Air) OCTAHEDRON;
      case (#Water) ICOSAHEDRON;
    };
  };

  /// Map cause to processing mode
  public func causeToMode(cause : Cause) : Text {
    switch (cause) {
      case (#Material) "substrate";
      case (#Formal) "architecture";
      case (#Efficient) "execution";
      case (#Final) "purpose";
    };
  };
};