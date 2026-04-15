import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Array "mo:base/Array";

/// CPL - COHERENT PROTOCOL LANGUAGE
/// ================================
/// Communication protocol built on sacred geometry.
/// Platonic solids, Hermetic principles, Method of Loci.
/// The architecture of meaning transfer.

module {
  // ═══════════════════════════════════════════════════════════════════════════
  // FUNDAMENTAL CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  public let PHI : Float = 1.6180339887498948482;
  public let PI : Float = 3.1415926535897932385;
  public let SQRT_2 : Float = 1.4142135623730950488;
  public let SQRT_3 : Float = 1.7320508075688772935;
  public let SQRT_5 : Float = 2.2360679774997896964;

  // ═══════════════════════════════════════════════════════════════════════════
  // PLATONIC SOLIDS — The Five Perfect Forms
  // Each encodes different aspects of reality
  // ═══════════════════════════════════════════════════════════════════════════

  public type PlatonicSolid = {
    #Tetrahedron;  // Fire — 4 faces, 4 vertices, 6 edges
    #Hexahedron;   // Earth — 6 faces, 8 vertices, 12 edges (Cube)
    #Octahedron;   // Air — 8 faces, 6 vertices, 12 edges
    #Dodecahedron; // Cosmos/Ether — 12 faces, 20 vertices, 30 edges
    #Icosahedron;  // Water — 20 faces, 12 vertices, 30 edges
  };

  public type SolidProperties = {
    name : Text;
    element : Text;
    faces : Nat;
    vertices : Nat;
    edges : Nat;
    faceShape : Text;
    dualSolid : PlatonicSolid;
    dihedralAngle : Float;      // degrees
    surfaceAreaFactor : Float;  // relative to edge length²
    volumeFactor : Float;       // relative to edge length³
  };

  /// Get properties of a Platonic solid
  public func solidProperties(solid : PlatonicSolid) : SolidProperties {
    switch (solid) {
      case (#Tetrahedron) {
        {
          name = "Tetrahedron";
          element = "Fire";
          faces = 4;
          vertices = 4;
          edges = 6;
          faceShape = "Equilateral Triangle";
          dualSolid = #Tetrahedron; // Self-dual
          dihedralAngle = 70.528779;
          surfaceAreaFactor = SQRT_3;
          volumeFactor = SQRT_2 / 12.0;
        }
      };
      case (#Hexahedron) {
        {
          name = "Hexahedron (Cube)";
          element = "Earth";
          faces = 6;
          vertices = 8;
          edges = 12;
          faceShape = "Square";
          dualSolid = #Octahedron;
          dihedralAngle = 90.0;
          surfaceAreaFactor = 6.0;
          volumeFactor = 1.0;
        }
      };
      case (#Octahedron) {
        {
          name = "Octahedron";
          element = "Air";
          faces = 8;
          vertices = 6;
          edges = 12;
          faceShape = "Equilateral Triangle";
          dualSolid = #Hexahedron;
          dihedralAngle = 109.471221;
          surfaceAreaFactor = 2.0 * SQRT_3;
          volumeFactor = SQRT_2 / 3.0;
        }
      };
      case (#Dodecahedron) {
        {
          name = "Dodecahedron";
          element = "Cosmos/Ether";
          faces = 12;
          vertices = 20;
          edges = 30;
          faceShape = "Regular Pentagon";
          dualSolid = #Icosahedron;
          dihedralAngle = 116.565051;
          surfaceAreaFactor = 3.0 * SQRT_5 * (5.0 + 2.0 * SQRT_5);
          volumeFactor = (15.0 + 7.0 * SQRT_5) / 4.0;
        }
      };
      case (#Icosahedron) {
        {
          name = "Icosahedron";
          element = "Water";
          faces = 20;
          vertices = 12;
          edges = 30;
          faceShape = "Equilateral Triangle";
          dualSolid = #Dodecahedron;
          dihedralAngle = 138.189685;
          surfaceAreaFactor = 5.0 * SQRT_3;
          volumeFactor = (5.0 / 12.0) * (3.0 + SQRT_5);
        }
      };
    }
  };

  /// Euler's formula: V - E + F = 2 for all convex polyhedra
  public func eulerCheck(vertices : Nat, edges : Nat, faces : Nat) : Bool {
    vertices + faces == edges + 2
  };

  /// Get the dual solid (vertices ↔ faces)
  public func dualSolid(solid : PlatonicSolid) : PlatonicSolid {
    solidProperties(solid).dualSolid
  };

  /// Map element to solid
  public func elementToSolid(element : Text) : ?PlatonicSolid {
    switch (element) {
      case ("fire") { ?#Tetrahedron };
      case ("earth") { ?#Hexahedron };
      case ("air") { ?#Octahedron };
      case ("water") { ?#Icosahedron };
      case ("ether") { ?#Dodecahedron };
      case ("cosmos") { ?#Dodecahedron };
      case (_) { null };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SEVEN HERMETIC PRINCIPLES
  // The Kybalion — Universal laws of existence
  // ═══════════════════════════════════════════════════════════════════════════

  public type HermeticPrinciple = {
    #Mentalism;        // All is Mind
    #Correspondence;   // As above, so below
    #Vibration;        // Nothing rests, everything moves
    #Polarity;         // Everything has poles, opposites are identical in nature
    #Rhythm;           // Everything flows, pendulum swings
    #CauseAndEffect;   // Every cause has its effect
    #Gender;           // Gender is in everything, masculine/feminine principles
  };

  public type PrincipleProperties = {
    name : Text;
    maxim : Text;
    application : Text;
    frequencyResonance : Float;  // Associated frequency in Hz
  };

  /// Get properties of a Hermetic principle
  public func principleProperties(principle : HermeticPrinciple) : PrincipleProperties {
    switch (principle) {
      case (#Mentalism) {
        {
          name = "Mentalism";
          maxim = "The All is Mind; the Universe is Mental";
          application = "Consciousness creates reality";
          frequencyResonance = 963.0; // Crown chakra frequency
        }
      };
      case (#Correspondence) {
        {
          name = "Correspondence";
          maxim = "As above, so below; as below, so above";
          application = "Patterns repeat at all scales";
          frequencyResonance = 852.0; // Third eye frequency
        }
      };
      case (#Vibration) {
        {
          name = "Vibration";
          maxim = "Nothing rests; everything moves; everything vibrates";
          application = "All matter is energy at different frequencies";
          frequencyResonance = 741.0; // Expression frequency
        }
      };
      case (#Polarity) {
        {
          name = "Polarity";
          maxim = "Everything is dual; opposites are identical in nature, different in degree";
          application = "Transform negative to positive by changing vibration";
          frequencyResonance = 639.0; // Heart connection frequency
        }
      };
      case (#Rhythm) {
        {
          name = "Rhythm";
          maxim = "Everything flows; the pendulum swing manifests in everything";
          application = "Neutralize negative swings through understanding";
          frequencyResonance = 528.0; // Transformation frequency
        }
      };
      case (#CauseAndEffect) {
        {
          name = "Cause and Effect";
          maxim = "Every cause has its effect; every effect has its cause";
          application = "Rise above causality through higher planes";
          frequencyResonance = 417.0; // Facilitating change
        }
      };
      case (#Gender) {
        {
          name = "Gender";
          maxim = "Gender is in everything; masculine and feminine principles";
          application = "Balance masculine (projective) and feminine (receptive)";
          frequencyResonance = 396.0; // Liberation from fear
        }
      };
    }
  };

  /// All seven principles
  public func allPrinciples() : [HermeticPrinciple] {
    [#Mentalism, #Correspondence, #Vibration, #Polarity, #Rhythm, #CauseAndEffect, #Gender]
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // METHOD OF LOCI — Memory Palace Architecture
  // The ancient art of spatial memory
  // ═══════════════════════════════════════════════════════════════════════════

  public type Locus = {
    id : Text;
    name : Text;
    description : Text;
    theta : Float;        // Angular position (0-360)
    phi : Float;          // Elevation angle (0-180)
    depth : Nat;          // Distance from center (1-∞)
    ring : Nat;           // Concentric ring (1-12)
    linkedLoci : [Text];  // Connected locations
    contentRef : ?Text;   // What's stored here
  };

  public type MemoryPalace = {
    id : Text;
    name : Text;
    architect : Text;
    loci : [Locus];
    entryLocus : Text;    // Starting point
    pathways : [(Text, Text)]; // Navigation routes
    createdAt : Int;
  };

  /// Create a new locus in the memory palace
  public func createLocus(
    id : Text,
    name : Text,
    theta : Float,
    phi : Float,
    depth : Nat,
    ring : Nat
  ) : Locus {
    {
      id = id;
      name = name;
      description = "";
      theta = theta;
      phi = phi;
      depth = depth;
      ring = ring;
      linkedLoci = [];
      contentRef = null;
    }
  };

  /// Generate a ring of loci (circular arrangement)
  public func generateRing(ringNumber : Nat, lociCount : Nat, prefix : Text) : [Locus] {
    var loci : [Locus] = [];
    let angleStep = 360.0 / Float.fromInt(Int.abs(lociCount));
    
    var i = 0;
    while (i < lociCount) {
      let theta = Float.fromInt(i) * angleStep;
      let locus = createLocus(
        prefix # "-" # Nat.toText(ringNumber) # "-" # Nat.toText(i),
        "Locus " # Nat.toText(i) # " of Ring " # Nat.toText(ringNumber),
        theta,
        90.0, // Equatorial
        ringNumber,
        ringNumber
      );
      loci := Array.append(loci, [locus]);
      i += 1;
    };
    loci
  };

  /// Generate golden spiral loci arrangement
  public func generateGoldenSpiral(count : Nat, prefix : Text) : [Locus] {
    var loci : [Locus] = [];
    let goldenAngle = 137.5077640500378; // degrees
    
    var i = 0;
    while (i < count) {
      let theta = Float.fromInt(i) * goldenAngle;
      let normalizedTheta = theta - Float.floor(theta / 360.0) * 360.0;
      let radius = Float.sqrt(Float.fromInt(i + 1));
      
      let locus = createLocus(
        prefix # "-spiral-" # Nat.toText(i),
        "Spiral Locus " # Nat.toText(i),
        normalizedTheta,
        90.0,
        Int.abs(Float.toInt(radius)) + 1,
        (i / 12) + 1
      );
      loci := Array.append(loci, [locus]);
      i += 1;
    };
    loci
  };

  /// Calculate distance between two loci (spherical)
  public func lociDistance(l1 : Locus, l2 : Locus) : Float {
    // Convert to radians
    let theta1 = l1.theta * PI / 180.0;
    let theta2 = l2.theta * PI / 180.0;
    let phi1 = l1.phi * PI / 180.0;
    let phi2 = l2.phi * PI / 180.0;
    
    // Spherical distance formula
    let cosD = Float.sin(phi1) * Float.sin(phi2) + 
               Float.cos(phi1) * Float.cos(phi2) * Float.cos(theta2 - theta1);
    
    // Clamp to valid range for acos
    let clampedCosD = if (cosD > 1.0) { 1.0 } else if (cosD < -1.0) { -1.0 } else { cosD };
    
    Float.arccos(clampedCosD)
  };

  /// Find nearest locus to given coordinates
  public func findNearestLocus(loci : [Locus], theta : Float, phi : Float) : ?Locus {
    if (loci.size() == 0) { return null };
    
    let target : Locus = {
      id = "target";
      name = "target";
      description = "";
      theta = theta;
      phi = phi;
      depth = 1;
      ring = 1;
      linkedLoci = [];
      contentRef = null;
    };
    
    var nearest : ?Locus = null;
    var minDist = 999999.0;
    
    for (locus in loci.vals()) {
      let dist = lociDistance(target, locus);
      if (dist < minDist) {
        minDist := dist;
        nearest := ?locus;
      };
    };
    
    nearest
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CPL PACKET STRUCTURE — Coherent Protocol Language Messages
  // ═══════════════════════════════════════════════════════════════════════════

  public type CPLIntent = {
    #Query;      // Seeking information
    #Command;    // Requesting action
    #Inform;     // Providing information
    #Confirm;    // Acknowledging receipt
    #Challenge;  // Requesting proof
    #Offer;      // Proposing exchange
    #Accept;     // Agreeing to proposal
    #Reject;     // Declining proposal
  };

  public type CPLPacket = {
    id : Text;
    fromAddress : Text;
    toAddress : Text;
    intent : CPLIntent;
    solid : PlatonicSolid;         // Geometric encoding
    principle : HermeticPrinciple; // Philosophical frame
    lawVector : [Text];            // Applicable laws
    mathPayload : Text;            // Mathematical content
    architecturePayload : Text;    // Structural content
    resonanceFrequency : Float;    // Communication frequency
    timestamp : Int;
  };

  /// Create a CPL packet
  public func createPacket(
    id : Text,
    from : Text,
    to : Text,
    intent : CPLIntent,
    solid : PlatonicSolid,
    principle : HermeticPrinciple,
    mathPayload : Text,
    archPayload : Text,
    timestamp : Int
  ) : CPLPacket {
    let solidProps = solidProperties(solid);
    let princProps = principleProperties(principle);
    
    {
      id = id;
      fromAddress = from;
      toAddress = to;
      intent = intent;
      solid = solid;
      principle = principle;
      lawVector = [];
      mathPayload = mathPayload;
      architecturePayload = archPayload;
      resonanceFrequency = princProps.frequencyResonance * PHI / Float.fromInt(solidProps.faces);
      timestamp = timestamp;
    }
  };

  /// Calculate packet resonance with receiver
  public func packetResonance(packet : CPLPacket, receiverFrequency : Float) : Float {
    let ratio = if (packet.resonanceFrequency > receiverFrequency) {
      receiverFrequency / packet.resonanceFrequency;
    } else {
      packet.resonanceFrequency / receiverFrequency;
    };
    
    // Check for harmonic relationship
    let octaveRatio = ratio * 2.0;
    let fifthRatio = ratio * 1.5;
    
    let octaveResonance = 1.0 - Float.abs(octaveRatio - 1.0);
    let fifthResonance = 1.0 - Float.abs(fifthRatio - 1.0);
    let phiResonance = 1.0 - Float.abs(ratio - (1.0 / PHI));
    
    Float.max(Float.max(octaveResonance, fifthResonance), phiResonance)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TREE OF LIFE — Kabbalistic 10 Sephiroth + 22 Paths
  // ═══════════════════════════════════════════════════════════════════════════

  public type Sephirah = {
    number : Nat;      // 1-10
    name : Text;       // Hebrew name
    meaning : Text;    // English meaning
    pillar : Text;     // Severity, Mercy, or Balance
    element : ?Text;   // Associated element
    planet : ?Text;    // Associated planet
  };

  /// The 10 Sephiroth
  public func sephiroth() : [Sephirah] {
    [
      { number = 1; name = "Kether"; meaning = "Crown"; pillar = "Balance"; element = null; planet = ?"Primum Mobile" },
      { number = 2; name = "Chokmah"; meaning = "Wisdom"; pillar = "Mercy"; element = null; planet = ?"Zodiac" },
      { number = 3; name = "Binah"; meaning = "Understanding"; pillar = "Severity"; element = null; planet = ?"Saturn" },
      { number = 4; name = "Chesed"; meaning = "Mercy"; pillar = "Mercy"; element = ?"Water"; planet = ?"Jupiter" },
      { number = 5; name = "Geburah"; meaning = "Severity"; pillar = "Severity"; element = ?"Fire"; planet = ?"Mars" },
      { number = 6; name = "Tiphareth"; meaning = "Beauty"; pillar = "Balance"; element = ?"Air"; planet = ?"Sun" },
      { number = 7; name = "Netzach"; meaning = "Victory"; pillar = "Mercy"; element = ?"Fire"; planet = ?"Venus" },
      { number = 8; name = "Hod"; meaning = "Splendor"; pillar = "Severity"; element = ?"Water"; planet = ?"Mercury" },
      { number = 9; name = "Yesod"; meaning = "Foundation"; pillar = "Balance"; element = ?"Air"; planet = ?"Moon" },
      { number = 10; name = "Malkuth"; meaning = "Kingdom"; pillar = "Balance"; element = ?"Earth"; planet = ?"Earth" }
    ]
  };

  /// The 22 paths connecting Sephiroth (mapped to Hebrew letters)
  public func treeOfLifePaths() : [(Nat, Nat, Text)] {
    [
      (1, 2, "Aleph"), (1, 3, "Beth"), (1, 6, "Gimel"),
      (2, 3, "Daleth"), (2, 4, "He"), (2, 6, "Vav"),
      (3, 4, "Zayin"), (3, 5, "Cheth"), (3, 6, "Teth"),
      (4, 5, "Yod"), (4, 6, "Kaph"), (4, 7, "Lamed"),
      (5, 6, "Mem"), (5, 8, "Nun"),
      (6, 7, "Samekh"), (6, 8, "Ayin"), (6, 9, "Pe"),
      (7, 8, "Tzaddi"), (7, 9, "Qoph"), (7, 10, "Resh"),
      (8, 9, "Shin"), (8, 10, "Tav"),
    ]
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SACRED RATIOS — Found throughout nature and ancient architecture
  // ═══════════════════════════════════════════════════════════════════════════

  /// Key sacred ratios
  public func sacredRatio(name : Text) : Float {
    switch (name) {
      case ("phi") { PHI };                        // Golden ratio
      case ("sqrt2") { SQRT_2 };                   // Diagonal of unit square
      case ("sqrt3") { SQRT_3 };                   // Height of equilateral triangle
      case ("sqrt5") { SQRT_5 };                   // Diagonal of 1x2 rectangle
      case ("pi") { PI };                          // Circle ratio
      case ("e") { 2.7182818284590452354 };       // Natural logarithm base
      case ("phi_squared") { PHI * PHI };          // φ²
      case ("phi_cubed") { PHI * PHI * PHI };      // φ³
      case ("silver") { 1.0 + SQRT_2 };            // Silver ratio (1 + √2)
      case ("bronze") { (3.0 + SQRT_13) / 2.0 };   // Bronze ratio
      case ("plastic") { 1.3247179572447458 };    // Plastic number
      case (_) { 1.0 };
    }
  };

  /// Check if two values are in a sacred ratio
  public func isSacredRatio(a : Float, b : Float, tolerance : Float) : ?Text {
    if (b == 0.0) { return null };
    let ratio = a / b;
    
    if (Float.abs(ratio - PHI) < tolerance) { return ?"phi" };
    if (Float.abs(ratio - SQRT_2) < tolerance) { return ?"sqrt2" };
    if (Float.abs(ratio - SQRT_3) < tolerance) { return ?"sqrt3" };
    if (Float.abs(ratio - PI) < tolerance) { return ?"pi" };
    if (Float.abs(ratio - (1.0 + SQRT_2)) < tolerance) { return ?"silver" };
    
    null
  };
}
